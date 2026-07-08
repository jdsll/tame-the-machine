import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import {
  getClientByPhoneNumberId,
  appendCall,
  appendBooking,
  type FrontDeskClient,
} from '@/lib/frontdesk/sheets'
import {
  parseEndOfCallReport,
  parseToolCalls,
  getPhoneNumberId,
  type ToolInvocation,
} from '@/lib/frontdesk/vapi'
import {
  callSummaryEmail,
  oncallAlertEmail,
  bookingRequestEmail,
} from '@/lib/frontdesk/emails'
import { sendSms } from '@/lib/frontdesk/sms'

export const runtime = 'nodejs'

type AnyRecord = Record<string, unknown>

// Caller-facing tool results are deterministic strings — never blocked on I/O.
// Vapi speaks these back mid-call, so they must be safe even if side effects fail.
const TOOL_RESULTS: Record<string, string> = {
  notify_oncall: 'The on-call technician has been notified by text.',
  book_appointment: 'Appointment request recorded — the office will confirm shortly.',
}
const FALLBACK_RESULT = 'Got it — the team has been notified.'

// Overall budget for tool-call side effects before we respond anyway (Vapi waits).
const TOOL_SIDE_EFFECT_BUDGET_MS = 8000

function emailFrom() {
  return {
    from: process.env.NURTURE_FROM_EMAIL ?? 'Front Desk AI <jeff@send.tamethemachine.com>',
    replyTo: process.env.NURTURE_REPLY_TO ?? 'jeff@tamethemachine.com',
  }
}

function argStr(args: AnyRecord, ...keys: string[]): string {
  for (const k of keys) {
    const v = args[k]
    if (typeof v === 'string' && v.trim()) return v.trim()
    if (typeof v === 'number' && Number.isFinite(v)) return String(v)
  }
  return ''
}

function delay(ms: number): Promise<'timeout'> {
  return new Promise((resolve) => setTimeout(() => resolve('timeout'), ms))
}

export async function POST(req: NextRequest) {
  // Auth: shared secret header set on the Vapi server-message config.
  const secret = process.env.FRONTDESK_WEBHOOK_SECRET
  if (!secret || req.headers.get('x-frontdesk-secret') !== secret) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  let body: AnyRecord
  try {
    body = (await req.json()) as AnyRecord
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const message = (body.message && typeof body.message === 'object' ? body.message : body) as AnyRecord
  const type = String(message.type ?? 'unknown')

  if (type === 'tool-calls') {
    return handleToolCalls(message)
  }

  if (type === 'end-of-call-report') {
    await handleEndOfCall(message)
    return NextResponse.json({ ok: true })
  }

  // status-update and everything else: acknowledge fast with 200.
  return NextResponse.json({ ok: true, ignored: type })
}

// ---------- tool-calls (synchronous, mid-call) ----------

async function handleToolCalls(message: AnyRecord): Promise<NextResponse> {
  const invocations = parseToolCalls(message)

  // Build the caller-facing results up front — these don't depend on any I/O.
  const results = invocations.map((inv) => ({
    toolCallId: inv.id,
    result: TOOL_RESULTS[inv.name] ?? FALLBACK_RESULT,
  }))

  // Fire side effects (client lookup, emails, sheet write, SMS) but never let
  // them hold the response past the budget — Vapi is waiting on this reply.
  const phoneNumberId = getPhoneNumberId(message)
  const raced = await Promise.race([
    runToolSideEffects(phoneNumberId, invocations).then(() => 'done' as const),
    delay(TOOL_SIDE_EFFECT_BUDGET_MS),
  ])
  if (raced === 'timeout') {
    console.warn('[frontdesk/vapi] tool side effects exceeded budget; responded with fallback results')
  }

  return NextResponse.json({ results })
}

async function runToolSideEffects(
  phoneNumberId: string,
  invocations: ToolInvocation[],
): Promise<void> {
  let client: FrontDeskClient | null = null
  try {
    client = phoneNumberId ? await getClientByPhoneNumberId(phoneNumberId) : null
  } catch (err) {
    console.error('[frontdesk/vapi] tool client lookup failed', err)
  }
  const businessName = client?.businessName ?? ''
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { from, replyTo } = emailFrom()

  for (const inv of invocations) {
    try {
      if (inv.name === 'notify_oncall') {
        const callerName = argStr(inv.args, 'caller_name', 'callerName')
        const callbackNumber = argStr(inv.args, 'callback_number', 'callbackNumber')
        const address = argStr(inv.args, 'address')
        const issue = argStr(inv.args, 'issue')
        const urgency = argStr(inv.args, 'urgency') || 'emergency'

        // Text the on-call tech (SMS stub for now — Telnyx later via sendSms()).
        const smsTarget = client?.onCallPhone || client?.ownerCell || ''
        await sendSms(
          smsTarget,
          `EMERGENCY — ${businessName || 'Front Desk AI'}: ${callerName} ${callbackNumber}. ${issue}`.trim(),
        )

        // Also email the owner so there's a durable record.
        if (client?.ownerEmail) {
          const { subject, html } = oncallAlertEmail({
            callerName,
            callbackNumber,
            address,
            issue,
            urgency,
            businessName,
          })
          const { error } = await resend.emails.send({ from, to: client.ownerEmail, replyTo, subject, html })
          if (error) console.error('[frontdesk/vapi] oncall email failed', error)
        }
      } else if (inv.name === 'book_appointment') {
        const callerName = argStr(inv.args, 'caller_name', 'callerName')
        const callbackNumber = argStr(inv.args, 'callback_number', 'callbackNumber', 'phone')
        const address = argStr(inv.args, 'address')
        const issue = argStr(inv.args, 'issue')
        const preferredWindow = argStr(inv.args, 'preferred_window', 'preferredWindow', 'preferred_time')

        try {
          await appendBooking({
            timestamp: new Date().toISOString(),
            businessName,
            phoneNumberId,
            callerName,
            callerPhone: callbackNumber,
            address,
            issue,
            preferredWindow,
          })
        } catch (err) {
          console.error('[frontdesk/vapi] appendBooking failed', err)
        }

        if (client?.ownerEmail) {
          const { subject, html } = bookingRequestEmail({
            callerName,
            callbackNumber,
            address,
            issue,
            preferredWindow,
            businessName,
          })
          const { error } = await resend.emails.send({ from, to: client.ownerEmail, replyTo, subject, html })
          if (error) console.error('[frontdesk/vapi] booking email failed', error)
        }
      } else {
        console.warn('[frontdesk/vapi] unknown tool call', inv.name)
      }
    } catch (err) {
      console.error('[frontdesk/vapi] tool side effect threw', inv.name, err)
    }
  }
}

// ---------- end-of-call-report ----------

async function handleEndOfCall(message: AnyRecord): Promise<void> {
  const parsed = parseEndOfCallReport(message)

  try {
    const client = parsed.phoneNumberId
      ? await getClientByPhoneNumberId(parsed.phoneNumberId)
      : null

    if (!client) {
      console.warn('[frontdesk/vapi] no client for phoneNumberId', parsed.phoneNumberId)
    }

    const businessName = client?.businessName ?? ''
    const timeLabel = new Date(parsed.startedAt).toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      dateStyle: 'medium',
      timeStyle: 'short',
    })

    // (a) Append to FrontDeskCalls
    try {
      await appendCall({
        timestamp: parsed.startedAt,
        businessName,
        phoneNumberId: parsed.phoneNumberId,
        callerNumber: parsed.callerNumber,
        durationSeconds: parsed.durationSeconds,
        endedReason: parsed.endedReason,
        urgency: parsed.urgency,
        appointmentBooked: parsed.appointmentBooked,
        summary: parsed.summary,
        cost: parsed.cost,
      })
    } catch (err) {
      console.error('[frontdesk/vapi] appendCall failed', err)
    }

    // (b) Email the owner a per-call summary
    if (client?.ownerEmail) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        const { from, replyTo } = emailFrom()
        const { subject, html } = callSummaryEmail({
          callerNumber: parsed.callerNumber,
          time: timeLabel,
          need: parsed.oneLineNeed,
          urgency: parsed.urgency,
          isEmergency: parsed.isEmergency,
          appointmentBooked: parsed.appointmentBooked,
          summary: parsed.summary,
          businessName,
        })
        const { error } = await resend.emails.send({ from, to: client.ownerEmail, replyTo, subject, html })
        if (error) console.error('[frontdesk/vapi] owner email failed', error)

        // Emergency backstop: also text the owner's cell (SMS stub for now).
        if (parsed.isEmergency && client.ownerCell) {
          await sendSms(
            client.ownerCell,
            `Emergency call handled for ${businessName || 'your line'}: ${parsed.callerNumber} — ${parsed.oneLineNeed}`,
          )
        }
      } catch (err) {
        console.error('[frontdesk/vapi] owner email threw', err)
      }
    }
  } catch (err) {
    console.error('[frontdesk/vapi] handler error', err)
  }
}
