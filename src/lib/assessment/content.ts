// Phase 7 content registry — single seam for all copy on the result page and in emails.
// Replace [PLACEHOLDER] strings with real content; rendering updates automatically everywhere.

export const segmentIntros: Record<string, string> = {
  ai_explorer:       "You're an AI Explorer — you run a real business, and AI just hasn't made it into the day-to-day yet. That's not a problem; it's a clean starting line. Most owners here have solid instincts about where their time goes, which is exactly what makes the first AI wins land fast. The opportunity now is to put a foundation under one or two repeatable tasks and let the results build from there.",
  foundation_builder:"You're a Foundation Builder — the tools are in place, and that's further than most. What's missing isn't more software; it's the workflow layer that makes the tools actually save you time. Right now the systems hold your data, but you're still the one moving it between them. The next step is connecting those pieces so the work routes itself instead of routing through you.",
  workflow_builder:  "You're a Workflow Builder — your processes are documented and repeatable, which is the hard part most owners never finish. You've earned the right to automate. With clear workflows already in place, AI has something solid to plug into, so the gains come quickly and compound. The opportunity now isn't buying more tools; it's deploying AI on the workflows you've already built.",
  automation_ready:  "You're Automation Ready — systems documented, tools connected, data where you can use it. You've done the groundwork, so we'll skip the basics. From here the gains come from orchestration: letting AI run across your workflows end to end instead of one task at a time. The leverage now is in the handoffs between steps, where your team still spends time moving work along by hand.",
  systems_scaler:    "You're a Systems Scaler — you're already operating ahead of most businesses your size, with AI in the mix and workflows that hold up under load. You don't need convincing. What's worth your attention is the strategic edge: where AI shifts from saving hours to changing what your business can offer. The next gains are fewer but bigger, and they're about positioning, not cleanup.",
}

export const gapBlocks: Record<string, { title: string; body: string }> = {
  admin_overload: {
    title: 'Admin is eating your week',
    body:  "Email triage, scheduling, and recurring busywork are quietly taking about 6 hours a week off your plate. None of it grows the business, but all of it has to happen. The quick win: route inbound email and calendar requests through an AI assistant that drafts replies, books time, and flags only what needs you. This is one of the first things we map in an AI audit, because the hours come back fast.",
  },
  lead_response_gap: {
    title: 'Your leads are waiting too long',
    body:  "When a new lead comes in, the clock starts — and right now too many wait hours for a first reply. The cost isn't the time you spend; it's the deals that go cold before you answer. The quick win: an AI-drafted instant reply and missed-call text-back that responds in under five minutes, every time. Faster first contact is one of the clearest conversion levers we map in an audit.",
  },
  followup_gap: {
    title: 'Follow-up falls through the cracks',
    body:  "Most deals close on the third touch or later, but follow-up is the first thing to slip when you're busy. Every dropped sequence is revenue you already earned the right to win. The quick win: an AI-run follow-up cadence that personalizes each touch and keeps going until the lead replies — so nothing stalls because you ran out of hours. This is a core piece of what we map in an audit.",
  },
  content_bottleneck: {
    title: 'Content output is capped by you',
    body:  "Right now your top-of-funnel volume is limited by how much one person can write — about 4 hours a week, and never quite enough. The quick win: AI drafts the first version and repurposes long pieces into short ones, so one idea becomes a week of posts. You get more reach without more writing time, and more published content means more leads. We map this lift in an audit.",
  },
  delivery_bottleneck: {
    title: 'Client delivery slows you down',
    body:  "Delivery is where your real work happens, so it's the hardest to automate — and we won't pretend otherwise. But the edges add up: status updates, client comms, project tracking, and reporting take about 3 hours a week that don't require your expertise. The quick win: AI handles the communication and tracking around delivery so your time goes to the work clients actually pay for. We map these edges in an audit.",
  },
  data_fragmented: {
    title: 'Your data lives in too many places',
    body:  "When information is scattered across tools and spreadsheets, you lose about 6 hours a week to manual lookups and stitching reports together by hand. The quick win: integrate your systems so the data flows automatically and AI can surface answers without the hunt. Once your tools talk to each other, the lookups disappear and the reports build themselves. Connecting these systems is one of the first things we map in an audit.",
  },
  reporting_overhead: {
    title: 'Reporting takes longer than it should',
    body:  "Pulling numbers, rebuilding the same reports, and writing the summary takes about 4 hours a week — time spent describing the work instead of doing it. The quick win: automated dashboards plus AI-written summaries that turn raw data into a clear readout on schedule, with no manual assembly. You get the reporting your clients and team need without losing a half-day to it. We map this in an audit.",
  },
  tool_sprawl: {
    title: 'Great stack, disconnected',
    body:  "You've built a real toolset — the problem isn't too many tools, it's that they don't talk to each other. So you spend about 5 hours a week copying data between them and keeping things in sync by hand. The quick win: a connection layer that links what you already own, so work moves between tools automatically. You keep the stack you built; you just stop being the integration. We map this in an audit.",
  },
  no_sops: {
    title: "Nothing's written down yet",
    body:  "When your processes live in your head, every handoff costs time and nothing can be automated reliably. Documenting them takes work up front, and we'll be honest — the payoff builds over time rather than overnight. The quick win: use AI to turn how you already work into clear, repeatable SOPs in a fraction of the usual effort. Documented workflows are the foundation every later AI win plugs into. We map this in an audit.",
  },
  low_ai_confidence: {
    title: 'AI still feels like a question mark',
    body:  "If AI hasn't clicked yet, that's not a knock — it just means you haven't had a win that proved it's worth your time. The reframe: you don't need a strategy, you need one small result. The quick win: pick a single task you do every week and let AI take the first pass, so you see the payoff before committing to anything bigger. Confidence comes from one good result, and that's where we'd start.",
  },
}

// Short labels used in the revenue callout sentence on the result page and in emails.
// "Plus revenue capture opportunity in 2 areas: lead response and follow-up."
export const gapShortLabels: Record<string, string> = {
  admin_overload:      'admin & email overhead',
  lead_response_gap:   'lead response',
  followup_gap:        'follow-up',
  content_bottleneck:  'content creation',
  delivery_bottleneck: 'client delivery',
  data_fragmented:     'data fragmentation',
  reporting_overhead:  'reporting',
  tool_sprawl:         'tool management',
  no_sops:             'process documentation',
  low_ai_confidence:   'AI adoption',
}

// Richer revenue callout copy (30-50 words each) for the 3 HIGH-revenue gaps.
// Rendered as per-gap blocks beneath the revenue section header.
export const revenueCalloutCopy: Record<string, string> = {
  lead_response_gap:  "On the revenue side: conversion drops with every hour a lead waits, and right now too many wait too long. AI compresses your time-to-first-reply to under five minutes — so the deals you're already paying to generate don't go cold before you answer.",
  followup_gap:       "On the revenue side: most deals close on the third follow-up or later, and that's exactly where things slip when you're busy. AI runs the cadence for you — personalized, persistent, automatic — so the deals you've earned actually get closed instead of forgotten.",
  content_bottleneck: "On the revenue side: your pipeline is gated by how much content you can publish, and one person only has so many hours. AI multiplies that output — drafting and repurposing — so more of the market sees you, and more top-of-funnel turns into leads.",
}

// Button text is verbatim from spec §11. headline, body, and url are real copy.
// Calendly link is live at https://calendly.com/jeff-tamethemachine/audit
export const ctaBlocks: Record<string, { headline: string; body: string; buttonText: string; url: string }> = {
  time: {
    headline:   "Let's find the hours hiding in your week",
    body:       "In a free 30-minute audit, we'll map exactly where AI can buy back your time — and what it'd take to make it real. No pitch, just a plan you can act on.",
    buttonText: 'Book a free AI Time Recovery Audit',
    url:        'https://calendly.com/jeff-tamethemachine/audit',
  },
  response: {
    headline:   'Turn faster replies into more closed deals',
    body:       "In a free 30-minute audit, we'll map where faster, AI-driven responses lift your conversion — and which leads you're losing today. You'll leave with a clear next step.",
    buttonText: 'Book a free AI Response Audit',
    url:        'https://calendly.com/jeff-tamethemachine/audit',
  },
  revenue: {
    headline:   'Find the revenue your workflows are leaking',
    body:       "In a free 30-minute audit, we'll map where AI can lift your top line — from faster lead response to follow-up that actually happens. Concrete numbers, not theory.",
    buttonText: 'Book a free AI Revenue Audit',
    url:        'https://calendly.com/jeff-tamethemachine/audit',
  },
  quality: {
    headline:   'Make consistent quality the default',
    body:       "In a free 30-minute audit, we'll map where AI can hold your quality steady as you grow — so good work doesn't depend on who's having a good day. You'll leave with a plan.",
    buttonText: 'Book a free AI Quality Audit',
    url:        'https://calendly.com/jeff-tamethemachine/audit',
  },
  efficiency: {
    headline:   'Cut the overhead between you and the work',
    body:       "In a free 30-minute audit, we'll map where AI can strip out the busywork and connect what you already run. Less overhead, more time on what pays.",
    buttonText: 'Book a free AI Efficiency Audit',
    url:        'https://calendly.com/jeff-tamethemachine/audit',
  },
}

// Two paragraphs separated by \n\n — split and render as <p> elements in the result page.
export const highMaturityReframe =
  "Here's the honest read: you're operationally past most of what this assessment is built to catch. The common gaps — scattered data, undocumented processes, slow lead response — aren't your story, so the usual advice about catching up doesn't apply, and we won't waste your time with it.\n\nFor an operation like yours, the next layer isn't fixing what's broken — it's optimization and orchestration. It's getting AI to run across whole workflows instead of single tasks, and using it where it changes what you can offer, not just how fast you work. The gains from here are fewer but bigger, and they tend to be strategic rather than operational.\n\nThe one or two areas below are where we'd still look first. They're not weaknesses so much as the highest-leverage places left on a strong foundation — and that's exactly the conversation worth having."

// v1: all segments use the same subject. firstName interpolation happens at send time.
// Split per segment after launch when engagement data arrives — one-file edit.
export const emailSubjects: Record<string, string> = {
  ai_explorer:       'Your AI Impact Assessment results',
  foundation_builder:'Your AI Impact Assessment results',
  workflow_builder:  'Your AI Impact Assessment results',
  automation_ready:  'Your AI Impact Assessment results',
  systems_scaler:    'Your AI Impact Assessment results',
}
