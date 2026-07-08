import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getClientByPhoneNumberId, appendCall } from '@/lib/frontdesk/sheets'
import { parseEndOfCallReport } from '@/lib/frontdesk/vapi'
import { callSummaryEmail } from '@/lib/frontdesk/emails'

export const runtime = 'nodejs'

type AnyRecord = Record<string, unknown>

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

  // We only act on the end-of-call report; acknowledge everything else with 200.
  if (message.type !== 'end-of-call-report') {
    return NextResponse.json({ ok: true, ignored: String(message.type ?? 'unknown') })
  }

  const parsed = parseEndOfCallReport(message)

  // Look up the client; do all I/O in try/catch so a failure never 500s the webhook.
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
        const from = process.env.NURTURE_FROM_EMAIL ?? 'Front Desk AI <jeff@send.tamethemachine.com>'
        const replyTo = process.env.NURTURE_REPLY_TO ?? 'jeff@tamethemachine.com'
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

        // Emergency: also alert the owner's cell. SMS ships later (Telnyx);
        // for now we log the intended send so nothing is silently dropped.
        if (parsed.isEmergency && client.ownerCell) {
          console.log('[frontdesk/vapi] EMERGENCY SMS placeholder', {
            to: client.ownerCell,
            caller: parsed.callerNumber,
            need: parsed.oneLineNeed,
          })
        }
      } catch (err) {
        console.error('[frontdesk/vapi] owner email threw', err)
      }
    }
  } catch (err) {
    console.error('[frontdesk/vapi] handler error', err)
  }

  // Always 200 fast so Vapi doesn't retry.
  return NextResponse.json({ ok: true })
}
