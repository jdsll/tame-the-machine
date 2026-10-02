// Scoring tables — spec v1.0.2 §2, §4, §5, §8

export type Segment = 'AI Explorer' | 'Foundation Builder' | 'Workflow Builder' | 'Automation Ready' | 'Systems Scaler'
export type Heat = 'HOT' | 'WARM' | 'COLD'
export type LeadValueTier = 'SMALL' | 'SMALL-MID' | 'MID' | 'LARGE'
export type EmailVariant = 'standard' | 'high_maturity'
export type CtaVariant = 'time' | 'response' | 'revenue' | 'quality' | 'efficiency'
export type RevenueImpact = 'HIGH' | 'medium' | 'low'
export type GapTag =
  | 'admin_overload' | 'lead_response_gap' | 'followup_gap' | 'content_bottleneck'
  | 'delivery_bottleneck' | 'data_fragmented' | 'reporting_overhead' | 'tool_sprawl'
  | 'no_sops' | 'low_ai_confidence'
export type HourGapTag = Exclude<GapTag, 'low_ai_confidence'>
export type IntentTag = 'ready_to_implement'
export type BudgetBand = 'unsure' | 'under_2500' | '2500_5000' | '5000_10000' | '10000_plus'

export type AssessmentAnswers = {
  q1: 'A' | 'B' | 'C' | 'D'
  q2: { id: 'A' | 'B' | 'C' | 'D' | 'E'; rank: 1 | 2 }[]
  q3: 'A' | 'B' | 'C' | 'D'
  q4: 'A' | 'B' | 'C' | 'D'
  q5: 'A' | 'B' | 'C' | 'D'
  q6: { id: 'A' | 'B' | 'C' | 'D' | 'E'; rank: 1 | 2 }[]
  q7: 'A' | 'B' | 'C' | 'D'
  q8: 'A' | 'B' | 'C' | 'D' | 'E'
  // Optional so submissions from a cached pre-q9 page still score
  q9?: 'A' | 'B' | 'C' | 'D' | 'E'
}

export type AssessmentResult = {
  rawScore: number
  normalizedScore: number
  dimensions: {
    aiUsage: number
    workflowClarity: number
    dataToolReadiness: number
    automationOpportunity: number
    implementationIntent: number
  }
  tags: {
    gaps: string[]   // sorted hour-contributing gaps + low_ai_confidence appended if fired
    intent: string[] // unique set
  }
  segment: Segment
  heat: Heat
  leadValueTier: LeadValueTier
  hours: { raw: number; perEmployee: number; teamTotal: number }
  revenueCallouts: string[]
  emailVariant: EmailVariant
  ctaVariant: CtaVariant
  budgetBand: BudgetBand
}

// ── Q1: How often are you using AI tools today? ──────────────────────────────

export interface Q1AnswerData {
  score: number
  gapTag: 'low_ai_confidence' | null
  intentTag: 'ready_to_implement' | null
  dimensions: { aiUsage: number }
}
export const Q1_ANSWERS: Record<'A' | 'B' | 'C' | 'D', Q1AnswerData> = {
  A: { score: 0,  gapTag: 'low_ai_confidence', intentTag: null,                 dimensions: { aiUsage: 0  } },
  B: { score: 3,  gapTag: null,                intentTag: null,                 dimensions: { aiUsage: 3  } },
  C: { score: 7,  gapTag: null,                intentTag: null,                 dimensions: { aiUsage: 7  } },
  D: { score: 10, gapTag: null,                intentTag: 'ready_to_implement', dimensions: { aiUsage: 10 } },
}

// ── Q2: Where are you losing the most time? (multi-select, score = 0) ────────

export interface Q2AnswerData {
  gapTag: HourGapTag
  dimensions: { automationOpportunity: number }
}
export const Q2_ANSWERS: Record<'A' | 'B' | 'C' | 'D' | 'E', Q2AnswerData> = {
  A: { gapTag: 'admin_overload',      dimensions: { automationOpportunity: 8 } },
  B: { gapTag: 'followup_gap',        dimensions: { automationOpportunity: 8 } },
  C: { gapTag: 'content_bottleneck',  dimensions: { automationOpportunity: 6 } },
  D: { gapTag: 'delivery_bottleneck', dimensions: { automationOpportunity: 5 } },
  E: { gapTag: 'reporting_overhead',  dimensions: { automationOpportunity: 7 } },
}

// ── Q3: How repeatable are your main workflows? ───────────────────────────────

export interface Q3AnswerData {
  score: number
  gapTag: 'no_sops' | null
  dimensions: { workflowClarity: number }
}
export const Q3_ANSWERS: Record<'A' | 'B' | 'C' | 'D', Q3AnswerData> = {
  A: { score: 0,  gapTag: 'no_sops', dimensions: { workflowClarity: 0  } },
  B: { score: 3,  gapTag: 'no_sops', dimensions: { workflowClarity: 3  } },
  C: { score: 7,  gapTag: null,      dimensions: { workflowClarity: 7  } },
  D: { score: 10, gapTag: null,      dimensions: { workflowClarity: 10 } },
}

// ── Q4: What happens when a new lead or request comes in? ────────────────────

export interface Q4AnswerData {
  score: number
  gapTag: 'lead_response_gap' | null
  intentTag: 'ready_to_implement' | null
  dimensions: { workflowClarity: number; dataToolReadiness: number }
}
export const Q4_ANSWERS: Record<'A' | 'B' | 'C' | 'D', Q4AnswerData> = {
  A: { score: 0,  gapTag: 'lead_response_gap', intentTag: null,                 dimensions: { workflowClarity: 0,  dataToolReadiness: 0 } },
  B: { score: 3,  gapTag: 'lead_response_gap', intentTag: null,                 dimensions: { workflowClarity: 3,  dataToolReadiness: 1 } },
  C: { score: 7,  gapTag: null,                intentTag: null,                 dimensions: { workflowClarity: 7,  dataToolReadiness: 5 } },
  D: { score: 10, gapTag: null,                intentTag: 'ready_to_implement', dimensions: { workflowClarity: 10, dataToolReadiness: 8 } },
}

// ── Q5: What tools / data do you already have? ───────────────────────────────

export interface Q5AnswerData {
  score: number
  gapTags: HourGapTag[]
  intentTag: 'ready_to_implement' | null
  dimensions: { dataToolReadiness: number }
}
export const Q5_ANSWERS: Record<'A' | 'B' | 'C' | 'D', Q5AnswerData> = {
  A: { score: 0,  gapTags: ['data_fragmented'],                intentTag: null,                 dimensions: { dataToolReadiness: 0  } },
  B: { score: 4,  gapTags: [],                                 intentTag: null,                 dimensions: { dataToolReadiness: 4  } },
  C: { score: 7,  gapTags: ['tool_sprawl', 'data_fragmented'], intentTag: null,                 dimensions: { dataToolReadiness: 7  } },
  D: { score: 10, gapTags: [],                                 intentTag: 'ready_to_implement', dimensions: { dataToolReadiness: 10 } },
}

// ── Q6: What outcome matters most right now? (multi-select, no score/tags) ───

export const Q6_CTA_MAP: Record<'A' | 'B' | 'C' | 'D' | 'E', CtaVariant> = {
  A: 'time',
  B: 'response',
  C: 'revenue',
  D: 'quality',
  E: 'efficiency',
}

// ── Q7: If the ROI were clear, when would you implement? ─────────────────────

export interface Q7AnswerData {
  score: number
  intentTag: 'ready_to_implement' | null
  dimensions: { implementationIntent: number }
}
export const Q7_ANSWERS: Record<'A' | 'B' | 'C' | 'D', Q7AnswerData> = {
  A: { score: 0,  intentTag: null,                 dimensions: { implementationIntent: 0  } },
  B: { score: 3,  intentTag: null,                 dimensions: { implementationIntent: 3  } },
  C: { score: 7,  intentTag: 'ready_to_implement', dimensions: { implementationIntent: 7  } },
  D: { score: 10, intentTag: 'ready_to_implement', dimensions: { implementationIntent: 10 } },
}

// ── Q8: How big is your team? ────────────────────────────────────────────────

export interface Q8AnswerData {
  scoreContribution: number
  multiplier: number
  midpoint: number
  leadValueTier: LeadValueTier
}
export const Q8_ANSWERS: Record<'A' | 'B' | 'C' | 'D' | 'E', Q8AnswerData> = {
  A: { scoreContribution: 0,  multiplier: 1.0,  midpoint: 1,   leadValueTier: 'SMALL'     },
  B: { scoreContribution: 3,  multiplier: 2.5,  midpoint: 3.5, leadValueTier: 'SMALL-MID' },
  C: { scoreContribution: 6,  multiplier: 4.0,  midpoint: 8,   leadValueTier: 'MID'       },
  D: { scoreContribution: 8,  multiplier: 7.0,  midpoint: 15,  leadValueTier: 'LARGE'     },
  E: { scoreContribution: 10, multiplier: 10.0, midpoint: 30,  leadValueTier: 'LARGE'     },
}

// ── Q9: First-project budget (added 2026-10-02) ──────────────────────────────
// Qualification only: it never touches the readiness score, segment, or hours.
// One heat rule: an under-$2,500 budget can't produce a HOT alert (caps at WARM).

export const Q9_BUDGET: Record<'A' | 'B' | 'C' | 'D' | 'E', BudgetBand> = {
  A: 'unsure',
  B: 'under_2500',
  C: '2500_5000',
  D: '5000_10000',
  E: '10000_plus',
}

export const BUDGET_LABELS: Record<BudgetBand, string> = {
  unsure: 'Not sure yet',
  under_2500: 'Under $2,500',
  '2500_5000': '$2,500 to $5,000',
  '5000_10000': '$5,000 to $10,000',
  '10000_plus': '$10,000+',
}

// ── Gap tag metadata (spec §4) ────────────────────────────────────────────────
// low_ai_confidence excluded: no hrsPerWeek, not in top-3 selection pool.
// content_bottleneck: §4 says 'medium' but §9 explicitly lists it as a revenue callout;
// treating as HIGH to match §9's operational definition.

export interface GapTagMeta {
  hrsPerWeek: number
  revenueImpact: RevenueImpact
  firingQuestion: number  // lower = higher tiebreak priority
  tableIndex: number      // secondary tiebreak within same question
}
export const GAP_TAG_META: Record<HourGapTag, GapTagMeta> = {
  admin_overload:      { hrsPerWeek: 6, revenueImpact: 'low',  firingQuestion: 2, tableIndex: 0 },
  lead_response_gap:   { hrsPerWeek: 2, revenueImpact: 'HIGH', firingQuestion: 4, tableIndex: 1 },
  followup_gap:        { hrsPerWeek: 2, revenueImpact: 'HIGH', firingQuestion: 2, tableIndex: 2 },
  content_bottleneck:  { hrsPerWeek: 4, revenueImpact: 'HIGH', firingQuestion: 2, tableIndex: 3 },
  delivery_bottleneck: { hrsPerWeek: 3, revenueImpact: 'low',  firingQuestion: 2, tableIndex: 4 },
  data_fragmented:     { hrsPerWeek: 6, revenueImpact: 'low',  firingQuestion: 5, tableIndex: 5 },
  reporting_overhead:  { hrsPerWeek: 4, revenueImpact: 'low',  firingQuestion: 2, tableIndex: 6 },
  tool_sprawl:         { hrsPerWeek: 5, revenueImpact: 'low',  firingQuestion: 5, tableIndex: 7 },
  no_sops:             { hrsPerWeek: 3, revenueImpact: 'low',  firingQuestion: 3, tableIndex: 8 },
}

// ── Segment rules — priority order, first match wins (spec §5) ───────────────

export const MAX_RAW_SCORE = 60

export interface SegmentRule {
  segment: Segment
  matches: (d: { aiUsage: number; workflowClarity: number; dataToolReadiness: number }) => boolean
}
export const SEGMENT_RULES: readonly SegmentRule[] = [
  { segment: 'Systems Scaler',    matches: d => d.aiUsage >= 7 && d.workflowClarity >= 14 && d.dataToolReadiness >= 14 },
  { segment: 'Automation Ready',  matches: d => d.dataToolReadiness >= 9 && d.workflowClarity >= 7                     },
  { segment: 'Workflow Builder',  matches: d => d.workflowClarity >= 7 && d.dataToolReadiness <= 8                     },
  { segment: 'Foundation Builder',matches: d => d.dataToolReadiness >= 5 && d.workflowClarity <= 6                     },
  { segment: 'AI Explorer',       matches: d => d.workflowClarity <= 6 && d.dataToolReadiness <= 4                     },
]
