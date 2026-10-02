import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { renderStage } from '@/lib/assessment/nurture-render'
import type { NurtureStage } from '@/lib/assessment/nurture'

// Dev tool: send every nurture email variant to one address so copy can be
// reviewed the way a lead reads it. Same render path as the cron.
// GET /api/nurture-preview?to=<email>[&gap=<gapTag>]  ·  Bearer CRON_SECRET

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const to = req.nextUrl.searchParams.get('to') ?? ''
  const gap = req.nextUrl.searchParams.get('gap') ?? 'lead_response_gap'
  if (!EMAIL_RE.test(to)) {
    return NextResponse.json({ ok: false, error: 'invalid_to' }, { status: 400 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const from = process.env.NURTURE_FROM_EMAIL ?? 'Jeff Restel <jeff@send.tamethemachine.com>'
  const replyTo = process.env.NURTURE_REPLY_TO ?? 'jeff@tamethemachine.com'

  // Stage 3 renders differently by heat, so preview both versions
  const variants: { stage: NurtureStage; heat: string; note: string }[] = [
    { stage: 1, heat: 'WARM', note: `stage 1 (gap: ${gap})` },
    { stage: 2, heat: 'WARM', note: 'stage 2' },
    { stage: 3, heat: 'HOT', note: 'stage 3 — HOT/WARM version' },
    { stage: 3, heat: 'COLD', note: 'stage 3 — COLD version' },
  ]

  const sent: string[] = []
  const errors: string[] = []
  for (const v of variants) {
    try {
      const { subject, html } = await renderStage(v.stage, {
        email: to,
        firstName: 'Jeff',
        heat: v.heat,
        top3Gaps: [gap],
      })
      const { error } = await resend.emails.send({ from, to, replyTo, subject, html })
      if (error) {
        errors.push(`${v.note}: ${error.message}`)
      } else {
        sent.push(`${v.note}: "${subject}"`)
      }
    } catch (err) {
      errors.push(`${v.note}: ${String(err)}`)
    }
  }

  return NextResponse.json({ ok: errors.length === 0, sent, errors })
}
