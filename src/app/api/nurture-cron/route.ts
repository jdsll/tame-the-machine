import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { readLeads, setCell, type LeadRow } from '@/lib/assessment/sheets'
import { nextDue, unsubscribeToken, SKIPPED_MARKER } from '@/lib/assessment/nurture'
import { renderStage } from '@/lib/assessment/nurture-render'

const MAX_SENDS_PER_RUN = 50

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return req.headers.get('authorization') === `Bearer ${secret}`
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }
  const dryRun = req.nextUrl.searchParams.get('dryRun') === '1'
  const now = new Date()

  let leads: LeadRow[]
  try {
    leads = await readLeads()
  } catch (err) {
    console.error('[nurture] readLeads failed', err)
    return NextResponse.json({ ok: false, error: 'sheet_read_failed' }, { status: 500 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  // send.tamethemachine.com is the verified Resend domain; replies route to Jeff's real inbox
  const from = process.env.NURTURE_FROM_EMAIL ?? 'Jeff Restel <jeff@send.tamethemachine.com>'
  const replyTo = process.env.NURTURE_REPLY_TO ?? 'jeff@tamethemachine.com'
  const siteBase = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tamethemachine.com'

  const plan: { email: string; row: number; action: string }[] = []
  let sent = 0
  let skipped = 0
  let errors = 0

  for (const lead of leads) {
    const due = nextDue(lead, now)

    if (due.action === 'skip-stale') {
      plan.push({ email: lead.email, row: lead.rowNumber, action: 'skip-stale' })
      if (!dryRun) {
        try {
          await setCell(lead.rowNumber, 'N', SKIPPED_MARKER)
          skipped++
        } catch (err) {
          console.error('[nurture] stale-mark failed', lead.rowNumber, err)
          errors++
        }
      }
      continue
    }

    if (due.action !== 'send') {
      continue
    }

    plan.push({ email: lead.email, row: lead.rowNumber, action: `send-stage-${due.stage}` })
    if (dryRun) continue
    if (sent >= MAX_SENDS_PER_RUN) break

    try {
      const { subject, html } = await renderStage(due.stage, lead)
      const oneClickUnsub = `${siteBase}/api/unsubscribe?e=${encodeURIComponent(lead.email.toLowerCase())}&t=${unsubscribeToken(lead.email)}`
      const { error } = await resend.emails.send({
        from,
        to: lead.email,
        replyTo,
        subject,
        html,
        headers: {
          'List-Unsubscribe': `<${oneClickUnsub}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      })
      if (error) {
        console.error('[nurture] send failed', lead.email, error)
        errors++
        continue
      }
      await setCell(lead.rowNumber, due.column, now.toISOString())
      sent++
    } catch (err) {
      console.error('[nurture] send threw', lead.email, err)
      errors++
    }
  }

  console.log('[nurture] run complete', { dryRun, checked: leads.length, sent, skipped, errors })
  return NextResponse.json({ ok: true, dryRun, checked: leads.length, plan, sent, skipped, errors })
}
