// Plain, dependency-free HTML email builders for Front Desk AI.
// Kept as simple inline-styled strings (no react-email needed for these).

const FOOTER = 'Front Desk AI by Tame the Machine'

export function escapeHtml(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function shell(inner: string): string {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f4f4f6;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1a1a22;">
    ${inner}
    <p style="margin-top:32px;padding-top:16px;border-top:1px solid #e2e2e8;font-size:12px;color:#9898a8;">
      ${FOOTER}
    </p>
  </div>
</body></html>`
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 12px 6px 0;font-size:13px;color:#606070;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:6px 0;font-size:14px;color:#1a1a22;">${value}</td>
  </tr>`
}

export type CallEmailData = {
  callerNumber: string
  time: string
  need: string
  urgency: string
  isEmergency: boolean
  appointmentBooked: boolean
  summary: string
  businessName: string
}

export function callSummaryEmail(d: CallEmailData): { subject: string; html: string } {
  const oneLine = d.need || 'New call'
  const subject = `${d.isEmergency ? '🚨 EMERGENCY — ' : ''}[Front Desk AI] Call from ${d.callerNumber} — ${oneLine}`

  const urgencyBadge = d.isEmergency
    ? `<span style="display:inline-block;background:#e5484d;color:#fff;font-size:12px;font-weight:600;padding:3px 10px;border-radius:4px;">EMERGENCY</span>`
    : d.urgency
      ? `<span style="display:inline-block;background:#eef0f3;color:#404050;font-size:12px;font-weight:600;padding:3px 10px;border-radius:4px;">${escapeHtml(d.urgency)}</span>`
      : '—'

  const inner = `
    <h1 style="font-size:20px;margin:0 0 4px;">New call handled${d.businessName ? ` — ${escapeHtml(d.businessName)}` : ''}</h1>
    <p style="font-size:14px;color:#606070;margin:0 0 20px;">${escapeHtml(oneLine)}</p>
    <table style="border-collapse:collapse;width:100%;">
      ${row('Caller', escapeHtml(d.callerNumber))}
      ${row('Time', escapeHtml(d.time))}
      ${row('What they needed', escapeHtml(d.need || '—'))}
      ${row('Urgency', urgencyBadge)}
      ${row('Appointment booked', d.appointmentBooked ? '✅ Yes' : 'No')}
    </table>
    <h2 style="font-size:14px;margin:24px 0 8px;color:#404050;">Call summary</h2>
    <p style="font-size:14px;line-height:1.6;color:#2a2a34;white-space:pre-wrap;">${escapeHtml(d.summary || 'No summary available.')}</p>
  `
  return { subject, html: shell(inner) }
}

export type WelcomeEmailData = {
  intakeUrl: string
  businessName?: string
}

export function welcomeEmail(d: WelcomeEmailData): { subject: string; html: string } {
  const subject = 'Welcome to Front Desk AI — one quick step to go live'
  const inner = `
    <h1 style="font-size:20px;margin:0 0 12px;">You're in. Let's get your line answering.</h1>
    <p style="font-size:14px;line-height:1.6;">Thanks for signing up for Front Desk AI${d.businessName ? `, ${escapeHtml(d.businessName)}` : ''}. Your 24/7 receptionist is almost ready — we just need a few details about how you run jobs.</p>
    <p style="font-size:14px;line-height:1.6;">It takes about 5 minutes and gets you live within 48 hours:</p>
    <p style="margin:24px 0;">
      <a href="${escapeHtml(d.intakeUrl)}" style="display:inline-block;background:#0a0a0f;color:#4af0c0;font-weight:700;font-size:14px;text-decoration:none;padding:14px 28px;border-radius:6px;">Complete your onboarding →</a>
    </p>
    <p style="font-size:13px;color:#606070;line-height:1.6;">Questions? Just reply to this email — it goes straight to Jeff.</p>
  `
  return { subject, html: shell(inner) }
}

export type InternalNotifyData = {
  email: string
  plan?: string
  amountTotal?: string
  stripeCustomerId?: string
  sessionId?: string
}

export function internalSignupEmail(d: InternalNotifyData): { subject: string; html: string } {
  const subject = `💳 New Front Desk AI signup — ${d.email}`
  const inner = `
    <h1 style="font-size:20px;margin:0 0 16px;">New paid signup</h1>
    <table style="border-collapse:collapse;width:100%;">
      ${row('Customer', escapeHtml(d.email))}
      ${row('Plan', escapeHtml(d.plan || 'Starter'))}
      ${row('Amount', escapeHtml(d.amountTotal || '—'))}
      ${row('Stripe customer', escapeHtml(d.stripeCustomerId || '—'))}
      ${row('Session', escapeHtml(d.sessionId || '—'))}
    </table>
    <p style="font-size:13px;color:#606070;margin-top:20px;">Added to FrontDeskClients as <strong>pending-onboarding</strong>. Welcome + intake email sent to the customer.</p>
  `
  return { subject, html: shell(inner) }
}

export type ClientDigestData = {
  businessName: string
  dateLabel: string
  callsAnswered: number
  emergencies: number
  appointments: number
  revenueProtected: number
}

export function clientDigestEmail(d: ClientDigestData): { subject: string; html: string } {
  const subject = `[Front Desk AI] Your ${d.dateLabel} recap — ${d.callsAnswered} call${d.callsAnswered === 1 ? '' : 's'} answered`
  const stat = (n: string, label: string) =>
    `<td style="padding:12px;text-align:center;background:#f7f7f9;border-radius:8px;">
       <div style="font-size:26px;font-weight:700;color:#0a0a0f;">${escapeHtml(n)}</div>
       <div style="font-size:12px;color:#606070;margin-top:2px;">${escapeHtml(label)}</div>
     </td>`
  const inner = `
    <h1 style="font-size:20px;margin:0 0 4px;">Yesterday, while you worked${d.businessName ? ` — ${escapeHtml(d.businessName)}` : ''}</h1>
    <p style="font-size:14px;color:#606070;margin:0 0 20px;">${escapeHtml(d.dateLabel)}</p>
    <table style="border-collapse:separate;border-spacing:8px;width:100%;">
      <tr>
        ${stat(String(d.callsAnswered), 'Calls answered')}
        ${stat(String(d.appointments), 'Appointments booked')}
      </tr>
      <tr>
        ${stat(String(d.emergencies), 'Emergencies flagged')}
        ${stat(`$${d.revenueProtected.toLocaleString('en-US')}`, 'Revenue protected*')}
      </tr>
    </table>
    <p style="font-size:12px;color:#9898a8;line-height:1.6;margin-top:16px;">*Estimated as appointments booked × $350 average job value.</p>
  `
  return { subject, html: shell(inner) }
}

export type RollupClientLine = {
  businessName: string
  callsAnswered: number
  appointments: number
  emergencies: number
  revenueProtected: number
}

export function jeffRollupEmail(d: {
  dateLabel: string
  totalCalls: number
  totalAppointments: number
  totalEmergencies: number
  totalRevenue: number
  perClient: RollupClientLine[]
}): { subject: string; html: string } {
  const subject = `[Front Desk AI] Daily rollup ${d.dateLabel} — ${d.totalCalls} calls across ${d.perClient.length} client${d.perClient.length === 1 ? '' : 's'}`
  const rows = d.perClient
    .map(
      (c) => `<tr>
        <td style="padding:6px 8px;font-size:13px;border-bottom:1px solid #eee;">${escapeHtml(c.businessName || '—')}</td>
        <td style="padding:6px 8px;font-size:13px;border-bottom:1px solid #eee;text-align:center;">${c.callsAnswered}</td>
        <td style="padding:6px 8px;font-size:13px;border-bottom:1px solid #eee;text-align:center;">${c.appointments}</td>
        <td style="padding:6px 8px;font-size:13px;border-bottom:1px solid #eee;text-align:center;">${c.emergencies}</td>
        <td style="padding:6px 8px;font-size:13px;border-bottom:1px solid #eee;text-align:right;">$${c.revenueProtected.toLocaleString('en-US')}</td>
      </tr>`,
    )
    .join('')
  const inner = `
    <h1 style="font-size:20px;margin:0 0 4px;">Front Desk AI — daily rollup</h1>
    <p style="font-size:14px;color:#606070;margin:0 0 20px;">${escapeHtml(d.dateLabel)}</p>
    <p style="font-size:14px;">${d.totalCalls} calls · ${d.totalAppointments} appointments · ${d.totalEmergencies} emergencies · $${d.totalRevenue.toLocaleString('en-US')} protected</p>
    <table style="border-collapse:collapse;width:100%;margin-top:16px;">
      <tr>
        <th style="text-align:left;padding:6px 8px;font-size:12px;color:#606070;border-bottom:2px solid #ddd;">Client</th>
        <th style="text-align:center;padding:6px 8px;font-size:12px;color:#606070;border-bottom:2px solid #ddd;">Calls</th>
        <th style="text-align:center;padding:6px 8px;font-size:12px;color:#606070;border-bottom:2px solid #ddd;">Appts</th>
        <th style="text-align:center;padding:6px 8px;font-size:12px;color:#606070;border-bottom:2px solid #ddd;">Emerg.</th>
        <th style="text-align:right;padding:6px 8px;font-size:12px;color:#606070;border-bottom:2px solid #ddd;">Revenue</th>
      </tr>
      ${rows || '<tr><td colspan="5" style="padding:12px 8px;font-size:13px;color:#9898a8;">No calls yesterday.</td></tr>'}
    </table>
  `
  return { subject, html: shell(inner) }
}
