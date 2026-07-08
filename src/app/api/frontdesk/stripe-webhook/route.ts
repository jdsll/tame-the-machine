import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { verifyStripeSignature } from '@/lib/frontdesk/stripe-verify'
import { appendClient } from '@/lib/frontdesk/sheets'
import { welcomeEmail, internalSignupEmail } from '@/lib/frontdesk/emails'

export const runtime = 'nodejs'

type AnyRecord = Record<string, unknown>

function str(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    console.error('[frontdesk/stripe] STRIPE_WEBHOOK_SECRET not set')
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 500 })
  }

  // Raw body is required for signature verification.
  const rawBody = await req.text()
  const sig = req.headers.get('stripe-signature')
  if (!verifyStripeSignature(rawBody, sig, secret)) {
    return NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 400 })
  }

  let event: AnyRecord
  try {
    event = JSON.parse(rawBody) as AnyRecord
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ ok: true, ignored: str(event.type) || 'unknown' })
  }

  const dataObject = ((event.data as AnyRecord)?.object ?? {}) as AnyRecord
  const customerDetails = (dataObject.customer_details ?? {}) as AnyRecord
  const email = str(customerDetails.email) || str(dataObject.customer_email)
  const businessName = str(customerDetails.name)
  const stripeCustomerId = str(dataObject.customer)
  const sessionId = str(dataObject.id)
  const amountCents = typeof dataObject.amount_total === 'number' ? dataObject.amount_total : null
  const currency = (str(dataObject.currency) || 'usd').toUpperCase()
  const amountTotal =
    amountCents != null ? `${(amountCents / 100).toFixed(2)} ${currency}` : undefined

  if (!email) {
    console.warn('[frontdesk/stripe] session with no customer email', sessionId)
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const from = process.env.NURTURE_FROM_EMAIL ?? 'Front Desk AI <jeff@send.tamethemachine.com>'
  const replyTo = process.env.NURTURE_REPLY_TO ?? 'jeff@tamethemachine.com'
  const intakeUrl = process.env.FRONTDESK_INTAKE_URL ?? 'https://tamethemachine.com/receptionist'

  // Welcome + onboarding email to the customer
  if (email) {
    try {
      const { subject, html } = welcomeEmail({ intakeUrl, businessName })
      const { error } = await resend.emails.send({ from, to: email, replyTo, subject, html })
      if (error) console.error('[frontdesk/stripe] welcome email failed', error)
    } catch (err) {
      console.error('[frontdesk/stripe] welcome email threw', err)
    }
  }

  // Internal notification to Jeff
  try {
    const { subject, html } = internalSignupEmail({
      email: email || 'unknown',
      plan: 'Starter',
      amountTotal,
      stripeCustomerId,
      sessionId,
    })
    const { error } = await resend.emails.send({
      from,
      to: 'jeff@tamethemachine.com',
      replyTo,
      subject,
      html,
    })
    if (error) console.error('[frontdesk/stripe] internal notify failed', error)
  } catch (err) {
    console.error('[frontdesk/stripe] internal notify threw', err)
  }

  // Add to FrontDeskClients as pending-onboarding
  try {
    await appendClient({
      businessName,
      ownerEmail: email,
      plan: 'starter',
      active: false,
      status: 'pending-onboarding',
      stripeCustomerId,
    })
  } catch (err) {
    console.error('[frontdesk/stripe] appendClient failed', err)
  }

  return NextResponse.json({ ok: true })
}
