import { describe, it, expect } from 'vitest'
import { scoreAssessment, roundHalfUp, roundToNearest5 } from './scoring'
import {
  Q1_ANSWERS, Q2_ANSWERS, Q3_ANSWERS, Q4_ANSWERS, Q5_ANSWERS,
  Q6_CTA_MAP, Q7_ANSWERS, Q8_ANSWERS,
  GAP_TAG_META, SEGMENT_RULES, MAX_RAW_SCORE,
  type AssessmentAnswers,
} from './scoring-data'

// ── Layer 1: Data table assertions ────────────────────────────────────────────

describe('Layer 1 — data tables match spec v1.0.2', () => {
  it('MAX_RAW_SCORE is 60', () => {
    expect(MAX_RAW_SCORE).toBe(60)
  })

  it('Q1_ANSWERS has exactly 4 keys A-D', () => {
    expect(Object.keys(Q1_ANSWERS).sort()).toEqual(['A', 'B', 'C', 'D'])
  })
  it('Q1 scores match spec §2', () => {
    expect(Q1_ANSWERS.A.score).toBe(0)
    expect(Q1_ANSWERS.B.score).toBe(3)
    expect(Q1_ANSWERS.C.score).toBe(7)
    expect(Q1_ANSWERS.D.score).toBe(10)
  })
  it('Q1 aiUsage dimensions match spec §2', () => {
    expect(Q1_ANSWERS.A.dimensions.aiUsage).toBe(0)
    expect(Q1_ANSWERS.B.dimensions.aiUsage).toBe(3)
    expect(Q1_ANSWERS.C.dimensions.aiUsage).toBe(7)
    expect(Q1_ANSWERS.D.dimensions.aiUsage).toBe(10)
  })
  it('Q1 tags match spec §2', () => {
    expect(Q1_ANSWERS.A.gapTag).toBe('low_ai_confidence')
    expect(Q1_ANSWERS.B.gapTag).toBeNull()
    expect(Q1_ANSWERS.D.intentTag).toBe('ready_to_implement')
    expect(Q1_ANSWERS.A.intentTag).toBeNull()
  })

  it('Q2_ANSWERS has exactly 5 keys A-E', () => {
    expect(Object.keys(Q2_ANSWERS).sort()).toEqual(['A', 'B', 'C', 'D', 'E'])
  })
  it('Q2 gap tags match spec §2', () => {
    expect(Q2_ANSWERS.A.gapTag).toBe('admin_overload')
    expect(Q2_ANSWERS.B.gapTag).toBe('followup_gap')
    expect(Q2_ANSWERS.C.gapTag).toBe('content_bottleneck')
    expect(Q2_ANSWERS.D.gapTag).toBe('delivery_bottleneck')
    expect(Q2_ANSWERS.E.gapTag).toBe('reporting_overhead')
  })
  it('Q2 automationOpportunity dimensions match spec §2', () => {
    expect(Q2_ANSWERS.A.dimensions.automationOpportunity).toBe(8)
    expect(Q2_ANSWERS.B.dimensions.automationOpportunity).toBe(8)
    expect(Q2_ANSWERS.C.dimensions.automationOpportunity).toBe(6)
    expect(Q2_ANSWERS.D.dimensions.automationOpportunity).toBe(5)
    expect(Q2_ANSWERS.E.dimensions.automationOpportunity).toBe(7)
  })

  it('Q3_ANSWERS has exactly 4 keys A-D', () => {
    expect(Object.keys(Q3_ANSWERS).sort()).toEqual(['A', 'B', 'C', 'D'])
  })
  it('Q3 scores and tags match spec §2', () => {
    expect(Q3_ANSWERS.A.score).toBe(0);  expect(Q3_ANSWERS.A.gapTag).toBe('no_sops')
    expect(Q3_ANSWERS.B.score).toBe(3);  expect(Q3_ANSWERS.B.gapTag).toBe('no_sops')
    expect(Q3_ANSWERS.C.score).toBe(7);  expect(Q3_ANSWERS.C.gapTag).toBeNull()
    expect(Q3_ANSWERS.D.score).toBe(10); expect(Q3_ANSWERS.D.gapTag).toBeNull()
  })
  it('Q3 workflowClarity dimensions match spec §2', () => {
    expect(Q3_ANSWERS.A.dimensions.workflowClarity).toBe(0)
    expect(Q3_ANSWERS.B.dimensions.workflowClarity).toBe(3)
    expect(Q3_ANSWERS.C.dimensions.workflowClarity).toBe(7)
    expect(Q3_ANSWERS.D.dimensions.workflowClarity).toBe(10)
  })

  it('Q4_ANSWERS has exactly 4 keys A-D', () => {
    expect(Object.keys(Q4_ANSWERS).sort()).toEqual(['A', 'B', 'C', 'D'])
  })
  it('Q4 scores, tags, and dimensions match spec §2', () => {
    expect(Q4_ANSWERS.A.score).toBe(0);  expect(Q4_ANSWERS.A.gapTag).toBe('lead_response_gap')
    expect(Q4_ANSWERS.A.dimensions).toEqual({ workflowClarity: 0,  dataToolReadiness: 0 })
    expect(Q4_ANSWERS.B.score).toBe(3);  expect(Q4_ANSWERS.B.gapTag).toBe('lead_response_gap')
    expect(Q4_ANSWERS.B.dimensions).toEqual({ workflowClarity: 3,  dataToolReadiness: 1 })
    expect(Q4_ANSWERS.C.score).toBe(7);  expect(Q4_ANSWERS.C.gapTag).toBeNull()
    expect(Q4_ANSWERS.C.dimensions).toEqual({ workflowClarity: 7,  dataToolReadiness: 5 })
    expect(Q4_ANSWERS.D.score).toBe(10); expect(Q4_ANSWERS.D.intentTag).toBe('ready_to_implement')
    expect(Q4_ANSWERS.D.dimensions).toEqual({ workflowClarity: 10, dataToolReadiness: 8 })
  })

  it('Q5_ANSWERS has exactly 4 keys A-D', () => {
    expect(Object.keys(Q5_ANSWERS).sort()).toEqual(['A', 'B', 'C', 'D'])
  })
  it('Q5 scores, tags, and dimensions match spec §2', () => {
    expect(Q5_ANSWERS.A.score).toBe(0);  expect(Q5_ANSWERS.A.gapTags).toEqual(['data_fragmented'])
    expect(Q5_ANSWERS.A.dimensions.dataToolReadiness).toBe(0)
    expect(Q5_ANSWERS.B.score).toBe(4);  expect(Q5_ANSWERS.B.gapTags).toEqual([])
    expect(Q5_ANSWERS.B.dimensions.dataToolReadiness).toBe(4)
    expect(Q5_ANSWERS.C.score).toBe(7);  expect(Q5_ANSWERS.C.gapTags).toEqual(['tool_sprawl', 'data_fragmented'])
    expect(Q5_ANSWERS.C.dimensions.dataToolReadiness).toBe(7)
    expect(Q5_ANSWERS.D.score).toBe(10); expect(Q5_ANSWERS.D.intentTag).toBe('ready_to_implement')
    expect(Q5_ANSWERS.D.dimensions.dataToolReadiness).toBe(10)
  })

  it('Q6_CTA_MAP has exactly 5 keys A-E and correct variants', () => {
    expect(Object.keys(Q6_CTA_MAP).sort()).toEqual(['A', 'B', 'C', 'D', 'E'])
    expect(Q6_CTA_MAP.A).toBe('time')
    expect(Q6_CTA_MAP.B).toBe('response')
    expect(Q6_CTA_MAP.C).toBe('revenue')
    expect(Q6_CTA_MAP.D).toBe('quality')
    expect(Q6_CTA_MAP.E).toBe('efficiency')
  })

  it('Q7_ANSWERS has exactly 4 keys A-D with correct scores and intent tags', () => {
    expect(Object.keys(Q7_ANSWERS).sort()).toEqual(['A', 'B', 'C', 'D'])
    expect(Q7_ANSWERS.A.score).toBe(0);  expect(Q7_ANSWERS.A.intentTag).toBeNull()
    expect(Q7_ANSWERS.B.score).toBe(3);  expect(Q7_ANSWERS.B.intentTag).toBeNull()
    expect(Q7_ANSWERS.C.score).toBe(7);  expect(Q7_ANSWERS.C.intentTag).toBe('ready_to_implement')
    expect(Q7_ANSWERS.D.score).toBe(10); expect(Q7_ANSWERS.D.intentTag).toBe('ready_to_implement')
  })
  it('Q7 implementationIntent dimensions match spec §2', () => {
    expect(Q7_ANSWERS.A.dimensions.implementationIntent).toBe(0)
    expect(Q7_ANSWERS.B.dimensions.implementationIntent).toBe(3)
    expect(Q7_ANSWERS.C.dimensions.implementationIntent).toBe(7)
    expect(Q7_ANSWERS.D.dimensions.implementationIntent).toBe(10)
  })

  it('Q8_ANSWERS has exactly 5 keys A-E', () => {
    expect(Object.keys(Q8_ANSWERS).sort()).toEqual(['A', 'B', 'C', 'D', 'E'])
  })
  it('Q8 scoreContribution values match spec §2', () => {
    expect(Q8_ANSWERS.A.scoreContribution).toBe(0)
    expect(Q8_ANSWERS.B.scoreContribution).toBe(3)
    expect(Q8_ANSWERS.C.scoreContribution).toBe(6)
    expect(Q8_ANSWERS.D.scoreContribution).toBe(8)
    expect(Q8_ANSWERS.E.scoreContribution).toBe(10)
  })
  it('Q8 multipliers match spec §2', () => {
    expect(Q8_ANSWERS.A.multiplier).toBe(1.0)
    expect(Q8_ANSWERS.B.multiplier).toBe(2.5)
    expect(Q8_ANSWERS.C.multiplier).toBe(4.0)
    expect(Q8_ANSWERS.D.multiplier).toBe(7.0)
    expect(Q8_ANSWERS.E.multiplier).toBe(10.0)
  })
  it('Q8 midpoints match spec §2', () => {
    expect(Q8_ANSWERS.A.midpoint).toBe(1)
    expect(Q8_ANSWERS.B.midpoint).toBe(3.5)
    expect(Q8_ANSWERS.C.midpoint).toBe(8)
    expect(Q8_ANSWERS.D.midpoint).toBe(15)
    expect(Q8_ANSWERS.E.midpoint).toBe(30)
  })
  it('Q8 leadValueTier values match spec §7', () => {
    expect(Q8_ANSWERS.A.leadValueTier).toBe('SMALL')
    expect(Q8_ANSWERS.B.leadValueTier).toBe('SMALL-MID')
    expect(Q8_ANSWERS.C.leadValueTier).toBe('MID')
    expect(Q8_ANSWERS.D.leadValueTier).toBe('LARGE')
    expect(Q8_ANSWERS.E.leadValueTier).toBe('LARGE')
  })

  it('GAP_TAG_META has exactly 9 hour-contributing tags', () => {
    expect(Object.keys(GAP_TAG_META).sort()).toEqual([
      'admin_overload', 'content_bottleneck', 'data_fragmented', 'delivery_bottleneck',
      'followup_gap', 'lead_response_gap', 'no_sops', 'reporting_overhead', 'tool_sprawl',
    ])
  })
  it('GAP_TAG_META hrsPerWeek values match spec §4', () => {
    expect(GAP_TAG_META.admin_overload.hrsPerWeek).toBe(6)
    expect(GAP_TAG_META.lead_response_gap.hrsPerWeek).toBe(2)
    expect(GAP_TAG_META.followup_gap.hrsPerWeek).toBe(2)
    expect(GAP_TAG_META.content_bottleneck.hrsPerWeek).toBe(4)
    expect(GAP_TAG_META.delivery_bottleneck.hrsPerWeek).toBe(3)
    expect(GAP_TAG_META.data_fragmented.hrsPerWeek).toBe(6)
    expect(GAP_TAG_META.reporting_overhead.hrsPerWeek).toBe(4)
    expect(GAP_TAG_META.tool_sprawl.hrsPerWeek).toBe(5)
    expect(GAP_TAG_META.no_sops.hrsPerWeek).toBe(3)
  })
  it('HIGH revenue impact tags match spec §9', () => {
    const highTags = Object.entries(GAP_TAG_META)
      .filter(([, m]) => m.revenueImpact === 'HIGH')
      .map(([tag]) => tag)
      .sort()
    expect(highTags).toEqual(['content_bottleneck', 'followup_gap', 'lead_response_gap'])
  })

  it('SEGMENT_RULES has exactly 5 entries in priority order', () => {
    expect(SEGMENT_RULES).toHaveLength(5)
    expect(SEGMENT_RULES[0].segment).toBe('Systems Scaler')
    expect(SEGMENT_RULES[1].segment).toBe('Automation Ready')
    expect(SEGMENT_RULES[2].segment).toBe('Workflow Builder')
    expect(SEGMENT_RULES[3].segment).toBe('Foundation Builder')
    expect(SEGMENT_RULES[4].segment).toBe('AI Explorer')
  })
})

// ── Layer 2: Formula isolation ────────────────────────────────────────────────

describe('Layer 2 — formula isolation', () => {
  describe('roundHalfUp', () => {
    it('rounds down when fractional part < 0.5', () => {
      expect(roundHalfUp(1.4)).toBe(1)
      expect(roundHalfUp(6.428)).toBe(6)
    })
    it('rounds up when fractional part = 0.5 (round-half-up, not banker\'s)', () => {
      expect(roundHalfUp(1.5)).toBe(2)
      expect(roundHalfUp(2.5)).toBe(3)
    })
    it('rounds integers unchanged', () => {
      expect(roundHalfUp(0)).toBe(0)
      expect(roundHalfUp(17)).toBe(17)
    })
  })

  describe('roundToNearest5', () => {
    it('rounds to nearest 5 with round-half-up', () => {
      expect(roundToNearest5(22.5)).toBe(25)  // Profile 5 edge case
      expect(roundToNearest5(21)).toBe(20)    // Profile 3 teamTotal
      expect(roundToNearest5(50)).toBe(50)
      expect(roundToNearest5(55)).toBe(55)
      expect(roundToNearest5(12)).toBe(10)
      expect(roundToNearest5(0)).toBe(0)
    })
  })

  describe('rawScore calculation', () => {
    it('sums scores from Q1 Q3 Q4 Q5 Q7 Q8 only (Q2 Q6 = 0)', () => {
      // Max rawScore: all D answers = 10+10+10+10+10 + Q8E=10 = 60
      const max: AssessmentAnswers = {
        q1: 'D', q2: [{ id: 'A', rank: 1 }],
        q3: 'D', q4: 'D', q5: 'D',
        q6: [{ id: 'A', rank: 1 }],
        q7: 'D', q8: 'E',
      }
      expect(scoreAssessment(max).rawScore).toBe(60)
    })
    it('rawScore = 0 when all minimum answers', () => {
      const min: AssessmentAnswers = {
        q1: 'A', q2: [{ id: 'A', rank: 1 }],
        q3: 'A', q4: 'A', q5: 'A',
        q6: [{ id: 'A', rank: 1 }],
        q7: 'A', q8: 'A',
      }
      expect(scoreAssessment(min).rawScore).toBe(0)
    })
  })

  describe('normalizedScore', () => {
    it('rawScore 0 → normalizedScore 0', () => {
      const r = scoreAssessment({ q1:'A', q2:[{id:'A',rank:1}], q3:'A', q4:'A', q5:'A', q6:[{id:'A',rank:1}], q7:'A', q8:'A' })
      expect(r.normalizedScore).toBe(0)
    })
    it('rawScore 60 → normalizedScore 100', () => {
      const r = scoreAssessment({ q1:'D', q2:[{id:'D',rank:1}], q3:'D', q4:'D', q5:'D', q6:[{id:'D',rank:1}], q7:'D', q8:'E' })
      expect(r.normalizedScore).toBe(100)
    })
    it('rawScore 58 → normalizedScore 97 (Profile 3)', () => {
      const r = scoreAssessment({ q1:'D', q2:[{id:'D',rank:1}], q3:'D', q4:'D', q5:'D', q6:[{id:'D',rank:1}], q7:'D', q8:'D' })
      expect(r.rawScore).toBe(58)
      expect(r.normalizedScore).toBe(97)
    })
  })

  describe('dimension summation', () => {
    it('workflowClarity = Q3 + Q4 contributions', () => {
      const r = scoreAssessment({ q1:'A', q2:[{id:'A',rank:1}], q3:'C', q4:'B', q5:'A', q6:[{id:'A',rank:1}], q7:'A', q8:'A' })
      // Q3=C: 7, Q4=B: 3 → 10
      expect(r.dimensions.workflowClarity).toBe(10)
    })
    it('dataToolReadiness = Q4 + Q5 contributions', () => {
      const r = scoreAssessment({ q1:'A', q2:[{id:'A',rank:1}], q3:'A', q4:'C', q5:'C', q6:[{id:'A',rank:1}], q7:'A', q8:'A' })
      // Q4=C: 5, Q5=C: 7 → 12
      expect(r.dimensions.dataToolReadiness).toBe(12)
    })
    it('automationOpportunity sums both Q2 selections', () => {
      const r = scoreAssessment({ q1:'A', q2:[{id:'A',rank:1},{id:'E',rank:2}], q3:'A', q4:'A', q5:'A', q6:[{id:'A',rank:1}], q7:'A', q8:'A' })
      // A=8, E=7 → 15
      expect(r.dimensions.automationOpportunity).toBe(15)
    })
    it('automationOpportunity uses single Q2 selection when only one', () => {
      const r = scoreAssessment({ q1:'A', q2:[{id:'D',rank:1}], q3:'A', q4:'A', q5:'A', q6:[{id:'A',rank:1}], q7:'A', q8:'A' })
      expect(r.dimensions.automationOpportunity).toBe(5)
    })
  })

  describe('segment routing — priority order', () => {
    it('Systems Scaler: aiUsage ≥ 7, workflowClarity ≥ 14, dataToolReadiness ≥ 14', () => {
      // Q1=D(aiUsage 10), Q3=D+Q4=D(wC 20), Q4=D+Q5=D(dTR 18), Q7=D, Q8=A
      const r = scoreAssessment({ q1:'D', q2:[{id:'D',rank:1}], q3:'D', q4:'D', q5:'D', q6:[{id:'D',rank:1}], q7:'D', q8:'A' })
      expect(r.segment).toBe('Systems Scaler')
    })
    it('SS fails when aiUsage < 7 even if other dims pass', () => {
      // Q1=B gives aiUsage=3; Q3=D+Q4=D: wC=20, dTR=18 — would be SS if aiUsage passed
      const r = scoreAssessment({ q1:'B', q2:[{id:'D',rank:1}], q3:'D', q4:'D', q5:'D', q6:[{id:'D',rank:1}], q7:'D', q8:'A' })
      expect(r.segment).toBe('Automation Ready')
    })
    it('Automation Ready: dataToolReadiness ≥ 9, workflowClarity ≥ 7', () => {
      // Q4=C(dTR 5)+Q5=B(dTR 4)=9; Q3=C(wC 7)+Q4=C(wC 7)=14; aiUsage=3 (fails SS)
      const r = scoreAssessment({ q1:'B', q2:[{id:'A',rank:1}], q3:'C', q4:'C', q5:'B', q6:[{id:'A',rank:1}], q7:'A', q8:'A' })
      expect(r.segment).toBe('Automation Ready')
      expect(r.dimensions.dataToolReadiness).toBe(9)
    })
    it('Workflow Builder: workflowClarity ≥ 7, dataToolReadiness ≤ 8', () => {
      // Q3=C(wC 7)+Q4=C(wC 7)=14; Q4=C(dTR 5)+Q5=A(dTR 0)=5; not AR (dTR<9)
      const r = scoreAssessment({ q1:'A', q2:[{id:'A',rank:1}], q3:'C', q4:'C', q5:'A', q6:[{id:'A',rank:1}], q7:'A', q8:'A' })
      expect(r.segment).toBe('Workflow Builder')
    })
    it('Foundation Builder: dataToolReadiness ≥ 5, workflowClarity ≤ 6', () => {
      // Q4=C(dTR 5)+Q5=A(dTR 0)=5; Q3=A(wC 0)+Q4=C(wC 7)... wait wC=7 would be WB
      // Need wC ≤ 6: Q3=B(3)+Q4=A(0)=3; dTR: Q4=A(0)+Q5=C(7)=7 ≥ 5
      const r = scoreAssessment({ q1:'A', q2:[{id:'A',rank:1}], q3:'B', q4:'A', q5:'C', q6:[{id:'A',rank:1}], q7:'A', q8:'A' })
      expect(r.segment).toBe('Foundation Builder')
      expect(r.dimensions.workflowClarity).toBeLessThanOrEqual(6)
      expect(r.dimensions.dataToolReadiness).toBeGreaterThanOrEqual(5)
    })
    it('AI Explorer: workflowClarity ≤ 6, dataToolReadiness ≤ 4', () => {
      // Q3=A(wC 0)+Q4=A(wC 0)=0; Q4=A(dTR 0)+Q5=B(dTR 4)=4
      const r = scoreAssessment({ q1:'A', q2:[{id:'A',rank:1}], q3:'A', q4:'A', q5:'B', q6:[{id:'A',rank:1}], q7:'A', q8:'A' })
      expect(r.segment).toBe('AI Explorer')
    })
  })

  describe('lead heat', () => {
    it('HOT when Q7=D', () => {
      const r = scoreAssessment({ q1:'A', q2:[{id:'A',rank:1}], q3:'A', q4:'A', q5:'A', q6:[{id:'A',rank:1}], q7:'D', q8:'A' })
      expect(r.heat).toBe('HOT')
    })
    it('WARM when Q7=C', () => {
      const r = scoreAssessment({ q1:'A', q2:[{id:'A',rank:1}], q3:'A', q4:'A', q5:'A', q6:[{id:'A',rank:1}], q7:'C', q8:'A' })
      expect(r.heat).toBe('WARM')
    })
    it('WARM when Q7=B', () => {
      const r = scoreAssessment({ q1:'A', q2:[{id:'A',rank:1}], q3:'A', q4:'A', q5:'A', q6:[{id:'A',rank:1}], q7:'B', q8:'A' })
      expect(r.heat).toBe('WARM')
    })
    it('WARM when Q7=A but ready_to_implement fires 3+ times', () => {
      // Q1=D(1 fire) + Q4=D(1 fire) + Q5=D(1 fire) = 3 fires; Q7=A → WARM via count
      const r = scoreAssessment({ q1:'D', q2:[{id:'A',rank:1}], q3:'A', q4:'D', q5:'D', q6:[{id:'A',rank:1}], q7:'A', q8:'A' })
      expect(r.heat).toBe('WARM')
    })
    it('COLD when Q7=A and ready_to_implement fires < 3 times', () => {
      // Q4=D(1) + Q5=D(1) = 2 fires; Q7=A → COLD
      const r = scoreAssessment({ q1:'A', q2:[{id:'A',rank:1}], q3:'A', q4:'D', q5:'D', q6:[{id:'A',rank:1}], q7:'A', q8:'A' })
      expect(r.heat).toBe('COLD')
    })
  })

  describe('hours math', () => {
    it('rawHours sums hrsPerWeek of hour-contributing gap tags only', () => {
      // Q2=A(admin_overload 6) + Q3=A(no_sops 3) → rawHours = 9
      const r = scoreAssessment({ q1:'B', q2:[{id:'A',rank:1}], q3:'A', q4:'C', q5:'B', q6:[{id:'A',rank:1}], q7:'A', q8:'A' })
      expect(r.hours.raw).toBe(9)
    })
    it('low_ai_confidence does not contribute to rawHours', () => {
      // Q1=A fires low_ai_confidence (excluded). No other gap tags → rawHours = 0
      const r = scoreAssessment({ q1:'A', q2:[{id:'B',rank:1}], q3:'C', q4:'C', q5:'B', q6:[{id:'A',rank:1}], q7:'A', q8:'A' })
      // Q2=B: followup_gap(2)
      expect(r.hours.raw).toBe(2)
      expect(r.tags.gaps).toContain('low_ai_confidence')
    })
    it('perEmployee = roundHalfUp(rawHours × multiplier / midpoint)', () => {
      // Profile 6: rawHours=3, Q8=C(mul 4.0, mid 8) → 3*4/8=1.5 → 2
      const r = scoreAssessment({ q1:'A', q2:[{id:'D',rank:1}], q3:'D', q4:'D', q5:'D', q6:[{id:'D',rank:1}], q7:'A', q8:'C' })
      expect(r.hours.perEmployee).toBe(2)
    })
    it('teamTotal uses round-half-up-to-nearest-5 — Profile 5 edge case', () => {
      // Profile 5: rawHours=9, Q8=B(mul 2.5) → 9*2.5=22.5 → 25 (not 20)
      const r = scoreAssessment({ q1:'D', q2:[{id:'A',rank:1}], q3:'B', q4:'C', q5:'B', q6:[{id:'A',rank:1}], q7:'B', q8:'B' })
      expect(r.hours.teamTotal).toBe(25)
    })
    it('teamTotal = 0 when no gap tags fire', () => {
      const r = scoreAssessment({ q1:'B', q2:[{id:'B',rank:1}], q3:'C', q4:'C', q5:'B', q6:[{id:'A',rank:1}], q7:'A', q8:'A' })
      // Q2=B fires followup_gap(2hrs) - actually that's not 0
      // Use inputs with no gap tags: Q1=B, Q2=B, Q3=C, Q4=C, Q5=B, Q7=A → followup_gap fires
      // To get 0 gaps: Q1=B(no gap), Q2=B(followup_gap — unavoidable), use Q2 that fires a gap
      // Actually impossible to have 0 gap tags with Q2 always firing one. rawHours can still be > 0.
      // Test instead that teamTotal correctly computes 0 hours if rawHours=0
      // Edge: Q1=B, Q3=C, Q4=C, Q5=B, Q7=A → only Q2 gaps. Use Q2=D(delivery_bottleneck 3hrs)
      // This won't be 0. Just verify formula: rawHours=2(followup_gap), Q8=A(mul 1.0) → teamTotal=round5(2)=0? No: round5(2) = 0? round5(2/5)=round5(0.4)=roundHalfUp(0.4)=0 → 0*5=0
      const r2 = scoreAssessment({ q1:'B', q2:[{id:'B',rank:1}], q3:'C', q4:'C', q5:'B', q6:[{id:'A',rank:1}], q7:'A', q8:'A' })
      // rawHours=2, mul=1.0 → teamTotal=round5(2)=0
      expect(r2.hours.teamTotal).toBe(0)
    })
  })

  describe('top-3 gap selection and tiebreaker', () => {
    it('sorts by hrsPerWeek descending', () => {
      // Q2=[B(followup_gap 2),E(reporting_overhead 4)], Q3=A(no_sops 3) → reporting>no_sops>followup
      const r = scoreAssessment({ q1:'B', q2:[{id:'B',rank:1},{id:'E',rank:2}], q3:'A', q4:'C', q5:'B', q6:[{id:'A',rank:1}], q7:'A', q8:'A' })
      const hourGaps = r.tags.gaps.filter(t => t !== 'low_ai_confidence')
      expect(hourGaps[0]).toBe('reporting_overhead')  // 4hrs
      expect(hourGaps[1]).toBe('no_sops')             // 3hrs
      expect(hourGaps[2]).toBe('followup_gap')         // 2hrs
    })
    it('tiebreaker: earlier question wins (admin_overload Q2 beats data_fragmented Q5, both 6hrs)', () => {
      // Q2=A(admin_overload 6, Q2) and Q5=A(data_fragmented 6, Q5)
      const r = scoreAssessment({ q1:'A', q2:[{id:'A',rank:1}], q3:'A', q4:'A', q5:'A', q6:[{id:'A',rank:1}], q7:'A', q8:'A' })
      const hourGaps = r.tags.gaps.filter(t => t !== 'low_ai_confidence')
      expect(hourGaps[0]).toBe('admin_overload')
      expect(hourGaps[1]).toBe('data_fragmented')
    })
    it('low_ai_confidence is appended last, not in top-3 position', () => {
      const r = scoreAssessment({ q1:'A', q2:[{id:'A',rank:1}], q3:'A', q4:'A', q5:'A', q6:[{id:'A',rank:1}], q7:'A', q8:'A' })
      expect(r.tags.gaps[r.tags.gaps.length - 1]).toBe('low_ai_confidence')
    })
    it('low_ai_confidence absent when Q1 != A', () => {
      const r = scoreAssessment({ q1:'B', q2:[{id:'A',rank:1}], q3:'A', q4:'A', q5:'A', q6:[{id:'A',rank:1}], q7:'A', q8:'A' })
      expect(r.tags.gaps).not.toContain('low_ai_confidence')
    })
  })

  describe('revenueCallouts', () => {
    it('lead_response_gap and followup_gap are revenue callouts when fired', () => {
      // Q2=B(followup_gap), Q4=A(lead_response_gap)
      const r = scoreAssessment({ q1:'B', q2:[{id:'B',rank:1}], q3:'C', q4:'A', q5:'B', q6:[{id:'A',rank:1}], q7:'A', q8:'A' })
      expect(r.revenueCallouts).toContain('followup_gap')
      expect(r.revenueCallouts).toContain('lead_response_gap')
    })
    it('no revenue callouts when no HIGH-impact tags fire', () => {
      // Q2=D(delivery_bottleneck low), Q3=A(no_sops low), Q4=C(no gap), Q5=B(no gap)
      const r = scoreAssessment({ q1:'B', q2:[{id:'D',rank:1}], q3:'A', q4:'C', q5:'B', q6:[{id:'A',rank:1}], q7:'A', q8:'A' })
      expect(r.revenueCallouts).toHaveLength(0)
    })
  })

  describe('emailVariant', () => {
    it('standard when 3+ hour-contributing gap tags fire', () => {
      // Q2=A(admin_overload) + Q3=A(no_sops) + Q4=A(lead_response_gap) + Q5=A(data_fragmented) = 4 gaps
      const r = scoreAssessment({ q1:'B', q2:[{id:'A',rank:1}], q3:'A', q4:'A', q5:'A', q6:[{id:'A',rank:1}], q7:'A', q8:'A' })
      expect(r.emailVariant).toBe('standard')
    })
    it('high_maturity when fewer than 3 hour-contributing gap tags fire', () => {
      // Q2=D(delivery_bottleneck only), Q3=C, Q4=C, Q5=B → 1 gap
      const r = scoreAssessment({ q1:'B', q2:[{id:'D',rank:1}], q3:'C', q4:'C', q5:'B', q6:[{id:'A',rank:1}], q7:'A', q8:'A' })
      expect(r.emailVariant).toBe('high_maturity')
    })
    it('low_ai_confidence does not count toward emailVariant threshold', () => {
      // Q1=A fires low_ai_confidence. Q2=D(delivery_bottleneck), Q3=C, Q4=C, Q5=B → 1 hour gap
      const r = scoreAssessment({ q1:'A', q2:[{id:'D',rank:1}], q3:'C', q4:'C', q5:'B', q6:[{id:'A',rank:1}], q7:'A', q8:'A' })
      expect(r.emailVariant).toBe('high_maturity')
      expect(r.tags.gaps).toContain('low_ai_confidence')
    })
  })

  describe('ctaVariant', () => {
    it('derives from Q6 rank 1 answer', () => {
      const make = (id: 'A' | 'B' | 'C' | 'D' | 'E'): AssessmentAnswers => ({
        q1: 'A', q2: [{ id: 'A', rank: 1 }], q3: 'A', q4: 'A', q5: 'A',
        q6: [{ id, rank: 1 }], q7: 'A', q8: 'A',
      })
      expect(scoreAssessment(make('A')).ctaVariant).toBe('time')
      expect(scoreAssessment(make('B')).ctaVariant).toBe('response')
      expect(scoreAssessment(make('C')).ctaVariant).toBe('revenue')
      expect(scoreAssessment(make('D')).ctaVariant).toBe('quality')
      expect(scoreAssessment(make('E')).ctaVariant).toBe('efficiency')
    })
    it('uses rank-1 item when two Q6 selections present', () => {
      const r = scoreAssessment({
        q1: 'A', q2: [{ id: 'A', rank: 1 }], q3: 'A', q4: 'A', q5: 'A',
        q6: [{ id: 'C', rank: 1 }, { id: 'A', rank: 2 }], q7: 'A', q8: 'A',
      })
      expect(r.ctaVariant).toBe('revenue')
    })
  })
})

// ── Layer 3: Integration against spec §12 test profiles ───────────────────────

describe('Layer 3 — §12 test profile integration', () => {
  it('Profile 1 — Solo, no AI, no SOPs, researching', () => {
    const r = scoreAssessment({
      q1: 'A', q2: [{ id: 'A', rank: 1 }],
      q3: 'A', q4: 'A', q5: 'A',
      q6: [{ id: 'A', rank: 1 }],
      q7: 'A', q8: 'A',
    })
    expect(r.segment).toBe('AI Explorer')
    expect(r.heat).toBe('COLD')
    expect(r.leadValueTier).toBe('SMALL')
    expect(r.hours.perEmployee).toBe(17)
    expect(r.hours.teamTotal).toBe(15)
    expect(r.emailVariant).toBe('standard')
    expect(r.ctaVariant).toBe('time')
  })

  it('Profile 2 — Mid-stage 5-person, weekly AI, fragmented tools, ready this month', () => {
    const r = scoreAssessment({
      q1: 'C', q2: [{ id: 'B', rank: 1 }, { id: 'E', rank: 2 }],
      q3: 'B', q4: 'C', q5: 'C',
      q6: [{ id: 'B', rank: 1 }, { id: 'C', rank: 2 }],
      q7: 'C', q8: 'B',
    })
    expect(r.segment).toBe('Automation Ready')
    expect(r.heat).toBe('WARM')
    expect(r.leadValueTier).toBe('SMALL-MID')
    expect(r.hours.perEmployee).toBe(14)
    expect(r.hours.teamTotal).toBe(50)
    expect(r.emailVariant).toBe('standard')
    expect(r.ctaVariant).toBe('response')
  })

  it('Profile 3 — Mature 11-20 team, daily AI, integrated, ready this week', () => {
    const r = scoreAssessment({
      q1: 'D', q2: [{ id: 'D', rank: 1 }],
      q3: 'D', q4: 'D', q5: 'D',
      q6: [{ id: 'D', rank: 1 }],
      q7: 'D', q8: 'D',
    })
    expect(r.segment).toBe('Systems Scaler')
    expect(r.heat).toBe('HOT')
    expect(r.leadValueTier).toBe('LARGE')
    expect(r.hours.perEmployee).toBe(1)
    expect(r.hours.teamTotal).toBe(20)
    expect(r.emailVariant).toBe('high_maturity')
    expect(r.ctaVariant).toBe('quality')
  })

  it('Profile 4 — Foundation Builder validation (Q5=C)', () => {
    const r = scoreAssessment({
      q1: 'A', q2: [{ id: 'A', rank: 1 }],
      q3: 'A', q4: 'A', q5: 'C',
      q6: [{ id: 'A', rank: 1 }],
      q7: 'B', q8: 'B',
    })
    expect(r.segment).toBe('Foundation Builder')
    expect(r.heat).toBe('WARM')
    expect(r.leadValueTier).toBe('SMALL-MID')
    expect(r.hours.perEmployee).toBe(16)
    expect(r.hours.teamTotal).toBe(55)
    expect(r.emailVariant).toBe('standard')
    expect(r.ctaVariant).toBe('time')
  })

  it('Profile 5 — AI power user, partial workflows — teamTotal round-half-up edge case', () => {
    const r = scoreAssessment({
      q1: 'D', q2: [{ id: 'A', rank: 1 }],
      q3: 'B', q4: 'C', q5: 'B',
      q6: [{ id: 'A', rank: 1 }],
      q7: 'B', q8: 'B',
    })
    expect(r.segment).toBe('Automation Ready')
    expect(r.heat).toBe('WARM')
    expect(r.leadValueTier).toBe('SMALL-MID')
    expect(r.hours.perEmployee).toBe(6)
    expect(r.hours.teamTotal).toBe(25)  // 22.5 → 25, not 20
    expect(r.emailVariant).toBe('high_maturity')
    expect(r.ctaVariant).toBe('time')
  })

  it('Profile 6 — High systems, low AI use', () => {
    const r = scoreAssessment({
      q1: 'A', q2: [{ id: 'D', rank: 1 }],
      q3: 'D', q4: 'D', q5: 'D',
      q6: [{ id: 'D', rank: 1 }],
      q7: 'A', q8: 'C',
    })
    expect(r.segment).toBe('Automation Ready')
    expect(r.heat).toBe('COLD')
    expect(r.leadValueTier).toBe('MID')
    expect(r.hours.perEmployee).toBe(2)
    expect(r.hours.teamTotal).toBe(10)
    expect(r.emailVariant).toBe('high_maturity')
    expect(r.ctaVariant).toBe('quality')
  })
})

describe('Q9 budget', () => {
  const hotBase: AssessmentAnswers = { q1:'D', q2:[{id:'D',rank:1}], q3:'D', q4:'D', q5:'D', q6:[{id:'D',rank:1}], q7:'D', q8:'E' }

  it('missing q9 (cached pre-q9 page) scores as unsure', () => {
    const r = scoreAssessment({ ...hotBase })
    expect(r.budgetBand).toBe('unsure')
    expect(r.heat).toBe('HOT')
  })

  it('under $2,500 caps a HOT lead at WARM', () => {
    expect(scoreAssessment({ ...hotBase, q9: 'B' }).heat).toBe('WARM')
  })

  it('larger budgets keep HOT', () => {
    expect(scoreAssessment({ ...hotBase, q9: 'E' }).heat).toBe('HOT')
    expect(scoreAssessment({ ...hotBase, q9: 'A' }).heat).toBe('HOT')
  })

  it('budget never changes the readiness score', () => {
    const a = scoreAssessment({ ...hotBase, q9: 'B' })
    const b = scoreAssessment({ ...hotBase, q9: 'E' })
    expect(a.normalizedScore).toBe(b.normalizedScore)
    expect(a.segment).toBe(b.segment)
  })

  it('budget does not raise a COLD lead', () => {
    expect(scoreAssessment({ ...hotBase, q7: 'A', q1: 'A', q4: 'A', q5: 'A', q9: 'E' }).heat).toBe('COLD')
  })
})
