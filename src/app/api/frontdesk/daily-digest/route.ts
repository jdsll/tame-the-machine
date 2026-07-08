import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { readCalls, readClients, type CallRecord } from '@/lib/frontdesk/sheets'
import { clientDigestEmail, jeffRollupEmail, type RollupClientLine } from '@/lib/frontdesk/emails'

export const runtime = 'nodejs'

const AVG_JOB_VALUE = 350

// Vercel Cron sends `Authorization: Bearer $CRON_SECRET`. Also accept ?secret= for manual runs.
function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  if (req.headers.get('authorization') === `Bearer ${secret}`) return true
  return req.nextUrl.searchParams.get('secret') === secret
}

// 'YYYY-MM-DD' for a Date in Pacific time.
function pacificDateStr(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }
  const dryRun = req.nextUrl.searchParams.get('dryRun') === '1'

  const now = new Date()
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const targetDate = pacificDateStr(yesterday)
  const dateLabel = new Date(`${targetDate}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  let calls: CallRecord[]
  let clients: Awaited<ReturnType<typeof readClients>>
  try {
    ;[calls, clients] = await Promise.all([readCalls(), readClients()])
  } catch (err) {
    console.error('[frontdesk/digest] read failed', err)
    return NextResponse.json({ ok: false, error: 'sheet_read_failed' }, { status: 500 })
  }

  const yesterdayCalls = calls.filter((c) => pacificDateStr(new Date(c.timestamp)) === targetDate)

  const resend = new Resend(process.env.RESEND_API_KEY)
  const from = process.env.NURTURE_FROM_EMAIL ?? 'Front Desk AI <jeff@send.tamethemachine.com>'
  const replyTo = process.env.NURTURE_REPLY_TO ?? 'jeff@tamethemachine.com'

  const rollup: RollupClientLine[] = []
  let sent = 0
  let errors = 0

  const activeClients = clients.filter((c) => c.active && c.phoneNumberId)

  for (const client of activeClients) {
    const clientCalls = yesterdayCalls.filter((c) => c.phoneNumberId === client.phoneNumberId)
    const callsAnswered = clientCalls.length
    const emergencies = clientCalls.filter((c) => c.urgency.toLowerCase() === 'emergency').length
    const appointments = clientCalls.filter((c) => c.appointmentBooked).length
    const revenueProtected = appointments * AVG_JOB_VALUE

    rollup.push({
      businessName: client.businessName,
      callsAnswered,
      appointments,
      emergencies,
      revenueProtected,
    })

    // Skip sending to clients with a zero-call day; still counted in Jeff's rollup.
    if (callsAnswered === 0) continue

    if (!client.ownerEmail || dryRun) continue

    try {
      const { subject, html } = clientDigestEmail({
        businessName: client.businessName,
        dateLabel,
        callsAnswered,
        emergencies,
        appointments,
        revenueProtected,
      })
      const { error } = await resend.emails.send({ from, to: client.ownerEmail, replyTo, subject, html })
      if (error) {
        console.error('[frontdesk/digest] client email failed', client.ownerEmail, error)
        errors++
      } else {
        sent++
      }
    } catch (err) {
      console.error('[frontdesk/digest] client email threw', client.ownerEmail, err)
      errors++
    }
  }

  // Jeff's rollup across all active clients
  const totals = rollup.reduce(
    (acc, c) => {
      acc.totalCalls += c.callsAnswered
      acc.totalAppointments += c.appointments
      acc.totalEmergencies += c.emergencies
      acc.totalRevenue += c.revenueProtected
      return acc
    },
    { totalCalls: 0, totalAppointments: 0, totalEmergencies: 0, totalRevenue: 0 },
  )

  if (!dryRun) {
    try {
      const { subject, html } = jeffRollupEmail({ dateLabel, ...totals, perClient: rollup })
      const { error } = await resend.emails.send({
        from,
        to: 'jeff@tamethemachine.com',
        replyTo,
        subject,
        html,
      })
      if (error) console.error('[frontdesk/digest] rollup email failed', error)
    } catch (err) {
      console.error('[frontdesk/digest] rollup email threw', err)
    }
  }

  console.log('[frontdesk/digest] complete', { targetDate, clients: activeClients.length, sent, errors })
  return NextResponse.json({
    ok: true,
    dryRun,
    date: targetDate,
    activeClients: activeClients.length,
    callsYesterday: yesterdayCalls.length,
    digestsSent: sent,
    errors,
    ...totals,
  })
}
