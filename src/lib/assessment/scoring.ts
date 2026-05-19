import {
  Q1_ANSWERS, Q2_ANSWERS, Q3_ANSWERS, Q4_ANSWERS, Q5_ANSWERS,
  Q6_CTA_MAP, Q7_ANSWERS, Q8_ANSWERS,
  GAP_TAG_META, SEGMENT_RULES, MAX_RAW_SCORE,
  type AssessmentAnswers, type AssessmentResult, type Heat, type HourGapTag, type Segment,
} from './scoring-data'

// Round-half-up for positive values (spec §8 — not banker's rounding)
export function roundHalfUp(x: number): number {
  return Math.floor(x + 0.5)
}

// Round to nearest multiple of 5, round-half-up
export function roundToNearest5(x: number): number {
  return roundHalfUp(x / 5) * 5
}

function determineSegment(d: { aiUsage: number; workflowClarity: number; dataToolReadiness: number }): Segment {
  for (const rule of SEGMENT_RULES) {
    if (rule.matches(d)) return rule.segment
  }
  throw new Error(`Unroutable dimensions — spec guarantees 0% UNASSIGNED: ${JSON.stringify(d)}`)
}

// Sort hour-contributing gaps: hrsPerWeek desc, then firingQuestion asc, then tableIndex asc
function sortHourGaps(tags: HourGapTag[]): HourGapTag[] {
  return [...tags].sort((a, b) => {
    const am = GAP_TAG_META[a]
    const bm = GAP_TAG_META[b]
    if (bm.hrsPerWeek !== am.hrsPerWeek) return bm.hrsPerWeek - am.hrsPerWeek
    if (am.firingQuestion !== bm.firingQuestion) return am.firingQuestion - bm.firingQuestion
    return am.tableIndex - bm.tableIndex
  })
}

export function scoreAssessment(answers: AssessmentAnswers): AssessmentResult {
  const q1 = Q1_ANSWERS[answers.q1]
  const q3 = Q3_ANSWERS[answers.q3]
  const q4 = Q4_ANSWERS[answers.q4]
  const q5 = Q5_ANSWERS[answers.q5]
  const q7 = Q7_ANSWERS[answers.q7]
  const q8 = Q8_ANSWERS[answers.q8]

  // Raw score — Q2 and Q6 contribute 0 (spec §3)
  const rawScore = q1.score + q3.score + q4.score + q5.score + q7.score + q8.scoreContribution
  const normalizedScore = Math.round(rawScore / MAX_RAW_SCORE * 100)

  // Dimensions
  const dimensions = {
    aiUsage:              q1.dimensions.aiUsage,
    workflowClarity:      q3.dimensions.workflowClarity + q4.dimensions.workflowClarity,
    dataToolReadiness:    q4.dimensions.dataToolReadiness + q5.dimensions.dataToolReadiness,
    automationOpportunity: answers.q2.reduce(
      (sum, sel) => sum + Q2_ANSWERS[sel.id].dimensions.automationOpportunity, 0
    ),
    implementationIntent: q7.dimensions.implementationIntent,
  }

  // Collect tags — track ready_to_implement count separately for heat rule
  const hourGapTags: HourGapTag[] = []
  let hasLowAiConfidence = false
  const rawIntentFires: string[] = []

  if (q1.gapTag === 'low_ai_confidence') hasLowAiConfidence = true
  if (q1.intentTag) rawIntentFires.push(q1.intentTag)

  for (const sel of answers.q2) {
    hourGapTags.push(Q2_ANSWERS[sel.id].gapTag)
  }

  if (q3.gapTag) hourGapTags.push(q3.gapTag)

  if (q4.gapTag) hourGapTags.push(q4.gapTag)
  if (q4.intentTag) rawIntentFires.push(q4.intentTag)

  for (const tag of q5.gapTags) hourGapTags.push(tag)
  if (q5.intentTag) rawIntentFires.push(q5.intentTag)

  if (q7.intentTag) rawIntentFires.push(q7.intentTag)

  const sortedHourGaps = sortHourGaps(hourGapTags)

  // tags.gaps: sorted hour-contributing + low_ai_confidence appended if fired (spec §4)
  const gaps: string[] = [...sortedHourGaps]
  if (hasLowAiConfidence) gaps.push('low_ai_confidence')

  // tags.intent: unique set; rawIntentFires keeps duplicates for heat count
  const intent = [...new Set(rawIntentFires)]

  // Hours math (spec §8)
  const rawHours = sortedHourGaps.reduce((sum, tag) => sum + GAP_TAG_META[tag].hrsPerWeek, 0)
  const perEmployee = roundHalfUp(rawHours * q8.multiplier / q8.midpoint)
  const teamTotal   = roundToNearest5(rawHours * q8.multiplier)

  // Segment
  const segment = determineSegment(dimensions)

  // Lead heat (spec §6)
  const readyCount = rawIntentFires.filter(t => t === 'ready_to_implement').length
  let heat: Heat
  if (answers.q7 === 'D') {
    heat = 'HOT'
  } else if (answers.q7 === 'B' || answers.q7 === 'C' || readyCount >= 3) {
    heat = 'WARM'
  } else {
    heat = 'COLD'
  }

  // Revenue callouts — hour-contributing gaps with HIGH revenue impact
  const revenueCallouts = sortedHourGaps.filter(tag => GAP_TAG_META[tag].revenueImpact === 'HIGH')

  // Email variant — count of hour-contributing gaps (spec §10)
  const emailVariant = sortedHourGaps.length >= 3 ? 'standard' : 'high_maturity'

  // CTA variant — Q6 rank 1 answer (spec §11)
  const q6Rank1 = answers.q6.find(s => s.rank === 1) ?? answers.q6[0]!
  const ctaVariant = Q6_CTA_MAP[q6Rank1.id]

  return {
    rawScore,
    normalizedScore,
    dimensions,
    tags: { gaps, intent },
    segment,
    heat,
    leadValueTier: q8.leadValueTier,
    hours: { raw: rawHours, perEmployee, teamTotal },
    revenueCallouts,
    emailVariant,
    ctaVariant,
  }
}

