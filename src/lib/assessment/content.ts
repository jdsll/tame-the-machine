// Phase 7 content registry — single seam for all copy on the result page and in emails.
// Replace [PLACEHOLDER] strings with real content; rendering updates automatically everywhere.

export const segmentIntros: Record<string, string> = {
  ai_explorer:       '[PLACEHOLDER: AI Explorer intro — 2-3 sentences. Where they are, what gap exists, what\'s possible with the right foundation.]',
  foundation_builder:'[PLACEHOLDER: Foundation Builder intro — 2-3 sentences. Acknowledge the tools in place, point toward the workflow layer they\'re missing.]',
  workflow_builder:  '[PLACEHOLDER: Workflow Builder intro — 2-3 sentences. Validate their documentation, show how automation is now within reach.]',
  automation_ready:  '[PLACEHOLDER: Automation Ready intro — 2-3 sentences. Strong foundation, ready for compounding gains with AI-powered workflows.]',
  systems_scaler:    '[PLACEHOLDER: Systems Scaler intro — 2-3 sentences. Already ahead of most; frame advanced leverage points and strategic AI use.]',
}

export const gapBlocks: Record<string, { title: string; body: string }> = {
  admin_overload:      { title: '[PLACEHOLDER: Admin Overload — headline, 5-8 words]',      body: '[PLACEHOLDER: Admin Overload — 1-2 sentences describing the bottleneck and a quick-win AI fix]' },
  lead_response_gap:   { title: '[PLACEHOLDER: Lead Response Gap — headline]',              body: '[PLACEHOLDER: Lead Response Gap — description + quick win]' },
  followup_gap:        { title: '[PLACEHOLDER: Follow-Up Gap — headline]',                  body: '[PLACEHOLDER: Follow-Up Gap — description + quick win]' },
  content_bottleneck:  { title: '[PLACEHOLDER: Content Bottleneck — headline]',             body: '[PLACEHOLDER: Content Bottleneck — description + quick win]' },
  delivery_bottleneck: { title: '[PLACEHOLDER: Delivery Bottleneck — headline]',            body: '[PLACEHOLDER: Delivery Bottleneck — description + quick win]' },
  data_fragmented:     { title: '[PLACEHOLDER: Fragmented Data — headline]',                body: '[PLACEHOLDER: Fragmented Data — description + quick win]' },
  reporting_overhead:  { title: '[PLACEHOLDER: Reporting Overhead — headline]',             body: '[PLACEHOLDER: Reporting Overhead — description + quick win]' },
  tool_sprawl:         { title: '[PLACEHOLDER: Tool Sprawl — headline]',                    body: '[PLACEHOLDER: Tool Sprawl — description + quick win]' },
  no_sops:             { title: '[PLACEHOLDER: No SOPs / Documented Workflows — headline]', body: '[PLACEHOLDER: No SOPs — description + quick win]' },
  low_ai_confidence:   { title: '[PLACEHOLDER: Low AI Confidence — headline]',              body: '[PLACEHOLDER: Low AI Confidence — description + reframing sentence]' },
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

// Button text is verbatim from spec §11. headline, body, and url are placeholders.
// Set url to the Calendly booking link when available.
export const ctaBlocks: Record<string, { headline: string; body: string; buttonText: string; url: string }> = {
  time: {
    headline:   '[PLACEHOLDER: Time Recovery CTA — headline, 8-12 words]',
    body:       '[PLACEHOLDER: Time Recovery CTA — 1-2 sentences. We will map where AI buys back your weeks.]',
    buttonText: 'Book a free AI Time Recovery Audit',
    url:        'https://calendly.com/jeff-tamethemachine/audit',
  },
  response: {
    headline:   '[PLACEHOLDER: Response Speed CTA — headline]',
    body:       '[PLACEHOLDER: Response Speed CTA — 1-2 sentences. We will map where AI lifts your conversion.]',
    buttonText: 'Book a free AI Response Audit',
    url:        'https://calendly.com/jeff-tamethemachine/audit',
  },
  revenue: {
    headline:   '[PLACEHOLDER: Revenue CTA — headline]',
    body:       '[PLACEHOLDER: Revenue CTA — 1-2 sentences. We will map where AI lifts your top line.]',
    buttonText: 'Book a free AI Revenue Audit',
    url:        'https://calendly.com/jeff-tamethemachine/audit',
  },
  quality: {
    headline:   '[PLACEHOLDER: Quality CTA — headline]',
    body:       '[PLACEHOLDER: Quality CTA — 1-2 sentences. We will map where AI lifts consistency.]',
    buttonText: 'Book a free AI Quality Audit',
    url:        'https://calendly.com/jeff-tamethemachine/audit',
  },
  efficiency: {
    headline:   '[PLACEHOLDER: Efficiency CTA — headline]',
    body:       '[PLACEHOLDER: Efficiency CTA — 1-2 sentences. We will map where AI cuts overhead.]',
    buttonText: 'Book a free AI Efficiency Audit',
    url:        'https://calendly.com/jeff-tamethemachine/audit',
  },
}

export const highMaturityReframe =
  '[PLACEHOLDER: High-maturity reframe — inserted when emailVariant === high_maturity (fewer than 3 gaps fired). Acknowledge the strong foundation and reframe toward deeper implementation vs. catching up.]'

// v1: all segments use the same subject. firstName interpolation happens at send time.
// Split per segment after launch when engagement data arrives — one-file edit.
export const emailSubjects: Record<string, string> = {
  ai_explorer:       'Your AI Impact Assessment results',
  foundation_builder:'Your AI Impact Assessment results',
  workflow_builder:  'Your AI Impact Assessment results',
  automation_ready:  'Your AI Impact Assessment results',
  systems_scaler:    'Your AI Impact Assessment results',
}
