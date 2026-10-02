// Homepage copy seam — every user-facing string on the letter homepage lives
// here. Messaging rules (Jeff, 2026-07-08): no invented stats or case metrics,
// no capacity framing, no public pricing (fixed-fee, quoted after the audit),
// public steps are Assessment → Audit → Build, outcome-based guarantee.

export const ASSESSMENT_URL = '/ai-impact-assessment'
export const AUDIT_CALL_URL = 'https://calendly.com/jeff-tamethemachine/audit'

export const FAMILIAR_LINES = [
  'By the time you answered the 2pm lead at 9pm, they’d already hired someone else.',
  'There’s a follow-up you meant to send on Tuesday. It’s Friday. That deal was money.',
  'Your data lives in four tools, and you — or your best employee — are the integration.',
  'You’ve tried ChatGPT, liked it, and had no idea what to do next.',
]

// The three public steps: Assessment → Audit → Build. No Upgrade Plan on the
// landing page (post-sale conversation), no dollar promises, no prices.
export const OFFER_STEPS = [
  {
    label: 'Start here',
    name: 'AI Impact Assessment',
    price: 'Free · 3 minutes',
    desc: 'Eight questions about how your business runs. You get a readiness score, an estimate of the hours you could recover, and a prioritized plan of your first three moves — in your inbox before you close the tab.',
  },
  {
    label: 'Then',
    name: 'AI & Automation Audit',
    price: 'Free · 60–90 minutes',
    desc: 'A working session on how your business actually runs — acquisition, delivery, support. You leave with a one-page report naming your 3–5 biggest automation opportunities, prioritized, within 48 hours. If AI isn’t a fit, the report says so.',
  },
  {
    label: 'If it makes sense',
    name: 'The Build',
    price: 'Fixed-fee · quoted after the audit',
    desc: 'I design and build the automation in one to three weeks, on the tools you already own. You approve the number before any work starts. 30 days of support included — and if something I built ever breaks, I fix it. Period.',
  },
]

// Risk reversal — outcome-based, not hours-only: the guarantee attaches to
// whatever result the audit scoped.
export const GUARANTEE_LINE =
  'Every build is scoped against a specific result in the audit — hours back, faster response, follow-up that doesn’t slip. If the build doesn’t deliver the result we scoped, I keep working on it at no charge until it does.'

export type Faq = { q: string; a: string }

export const FAQS: Faq[] = [
  {
    q: 'Do I need to be technical?',
    a: 'No. You explain how your business runs; I handle every technical detail. You’ll never be asked to write a prompt, manage an API key, or learn a new tool unless you want to.',
  },
  {
    q: 'What does it cost?',
    a: 'The assessment and the audit are free. Every build is fixed-fee and quoted after the audit — when we both know exactly what’s worth building and what it’s worth to you. You approve the number before any work starts. No hourly billing, no surprises.',
  },
  {
    q: 'What tools do you work with?',
    a: 'Whatever you already use. Email, calendars, spreadsheets, QuickBooks, and CRMs on one side; n8n, Make, Zapier, and custom code on the other. You keep your stack — I make the pieces talk to each other.',
  },
  {
    q: 'What if AI isn’t actually a fit for my business?',
    a: 'Then I’ll tell you, in the audit, for free. The audit maps the ROI before anything gets built — if the numbers don’t work, you get a one-page report saying so and we part as friends.',
  },
  {
    q: 'How long does a build take, and what happens after?',
    a: 'Most builds ship in one to three weeks, with 30 days of support included. And to be clear: if something I built ever breaks, I fix it — that’s the job, not an upsell.',
  },
]

// ── Parked: "What a build looks like" section (Jeff, 2026-09-15: skip for
// now). One real build + two capability patterns, no invented clients or
// results. Re-add to the homepage when real case studies ship.

export type CaseStudy = {
  tag: string
  title: string
  metric: string
  metricLabel: string
  body: string
  real: boolean
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    // Real — the assessment funnel on this site
    tag: 'Live on this site',
    title: 'The assessment that scores you',
    metric: '3 min',
    metricLabel: 'from answers to a scored, personalized report',
    body: 'The AI Impact Assessment on this site is one of my builds: it scores every lead, emails a personalized breakdown, logs everything to my CRM, and flags hot leads to my phone — no human in the loop. Take it and you’ve seen my work.',
    real: true,
  },
  {
    tag: 'A common build',
    title: 'The missed-call rescue',
    metric: '< 2 min',
    metricLabel: 'first reply, around the clock — the target this build hits',
    body: 'When a call goes unanswered, the caller instantly gets a text that answers their actual question and books the appointment. The lead that used to go cold by morning holds until you’re free — that’s revenue, not just saved time.',
    real: false,
  },
  {
    tag: 'A common build',
    title: 'The follow-up that never slips',
    metric: '0',
    metricLabel: 'deals lost to a forgotten follow-up',
    body: 'Touches two, three, and four send themselves — personalized, persistent — until the lead replies. Most deals close on the third touch or later, which is exactly when manual follow-up quits.',
    real: false,
  },
]

export const NOT_A_MENU_LINE =
  'These are three shapes automation takes — not a menu. Every business leaks somewhere different, and finding your version is exactly what the assessment and audit are for.'
