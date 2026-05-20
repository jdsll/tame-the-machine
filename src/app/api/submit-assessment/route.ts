import { NextRequest, NextResponse } from 'next/server'
import React from 'react'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import { scoreAssessment } from '@/lib/assessment/scoring'
import type { AssessmentAnswers, AssessmentResult } from '@/lib/assessment/scoring-data'
import { emailSubjects } from '@/lib/assessment/content'
import { appendRow } from '@/lib/assessment/sheets'
import { checkRateLimit } from '@/lib/assessment/rate-limit'
import AssessmentResultEmail from '@emails/AssessmentResult'
import HotLeadAlert from '@emails/HotLeadAlert'

const SEGMENT_SLUGS: Record<string, string> = {
  'AI Explorer':        'ai_explorer',
  'Foundation Builder': 'foundation_builder',
  'Workflow Builder':   'workflow_builder',
  'Automation Ready':   'automation_ready',
  'Systems Scaler':     'systems_scaler',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type SubmitRequest = {
  answers: AssessmentAnswers
  computed: AssessmentResult
  email: string
  firstName?: string
  submittedAt?: string
  source?: string
  _hp?: string
}

export async function POST(req: NextRequest) {
  let body: SubmitRequest
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const { answers, computed, email, firstName = '', submittedAt, _hp } = body

  if (!answers || !computed || !email || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 })
  }

  // Honeypot — silent success, no side effects
  if (_hp) {
    return NextResponse.json({ ok: true })
  }

  // Rate limit
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  const rateCheck = checkRateLimit(ip)
  if (!rateCheck.ok) {
    return NextResponse.json(
      { ok: false, error: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfter) } },
    )
  }

  // Server re-score (trust-but-verify — use server result for side effects)
  let result: AssessmentResult
  try {
    result = scoreAssessment(answers)
    if (
      result.segment !== computed.segment ||
      result.heat !== computed.heat ||
      result.emailVariant !== computed.emailVariant ||
      result.ctaVariant !== computed.ctaVariant
    ) {
      console.warn('[assessment] client/server result mismatch', {
        client: { segment: computed.segment, heat: computed.heat, emailVariant: computed.emailVariant, ctaVariant: computed.ctaVariant },
        server: { segment: result.segment, heat: result.heat, emailVariant: result.emailVariant, ctaVariant: result.ctaVariant },
      })
    }
  } catch (err) {
    console.error('[assessment] re-score error', err)
    return NextResponse.json({ ok: false, error: 'scoring_error' }, { status: 500 })
  }

  const segSlug = SEGMENT_SLUGS[result.segment] ?? 'ai_explorer'
  const subject = emailSubjects[segSlug] ?? 'Your AI Impact Assessment results'
  const resend = new Resend(process.env.RESEND_API_KEY)
  const from = process.env.RESEND_FROM_EMAIL ?? 'assessment@tamethemachine.com'

  let emailOk = false
  let sheetOk = false

  // Send result email
  try {
    const html = await render(
      React.createElement(AssessmentResultEmail, { result, firstName, q8: answers.q8 }),
    )
    const { error: sendError } = await resend.emails.send({ from, to: email.trim(), subject, html })
    if (sendError) {
      console.error('[assessment] result email failed', sendError)
    } else {
      emailOk = true
    }
  } catch (err) {
    console.error('[assessment] result email threw', err)
  }

  // HOT lead alert
  if (result.heat === 'HOT') {
    try {
      const alertHtml = await render(
        React.createElement(HotLeadAlert, { result, firstName, email: email.trim(), answers }),
      )
      const { error: alertError } = await resend.emails.send({
        from,
        to: 'jeff@tamethemachine.com',
        subject: `HOT lead: ${firstName || email} / ${result.segment} / ${result.leadValueTier}`,
        html: alertHtml,
      })
      if (alertError) {
        console.error('[assessment] hot lead alert failed', alertError)
      }
    } catch (err) {
      console.error('[assessment] hot lead alert threw', err)
    }
  }

  // Append to sheet
  let sheetError: string | undefined
  try {
    await appendRow({
      answers,
      result,
      email: email.trim(),
      firstName,
      submittedAt: submittedAt ?? new Date().toISOString(),
    })
    sheetOk = true
  } catch (err) {
    const e = err as { message?: string; code?: number }
    sheetError = `${e.code ?? ''} ${e.message ?? String(err)}`.trim()
    console.error('[assessment] sheets append failed', err)
  }

  // Both failed — user should contact manually
  if (!emailOk && !sheetOk) {
    return NextResponse.json({ ok: false, error: 'delivery_failed' })
  }

  return NextResponse.json({ ok: true, sheetOk, sheetError })
}
