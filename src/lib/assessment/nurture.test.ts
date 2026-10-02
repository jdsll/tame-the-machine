import { describe, it, expect, beforeAll } from 'vitest'
import { nextDue, unsubscribeToken, verifyUnsubscribeToken, SKIPPED_MARKER } from './nurture'
import type { LeadRow } from './sheets'

beforeAll(() => {
  process.env.UNSUBSCRIBE_SECRET = 'test-secret'
})

const NOW = new Date('2026-07-07T16:00:00Z')

function lead(overrides: Partial<LeadRow> = {}): LeadRow {
  return {
    rowNumber: 2,
    submittedAt: '2026-07-07T00:00:00Z',
    email: 'lead@example.com',
    firstName: 'Pat',
    segment: 'Foundation Builder',
    heat: 'WARM',
    top3Gaps: ['admin_overload', 'followup_gap'],
    emailVariant: 'standard',
    nurture1SentAt: '',
    nurture2SentAt: '',
    nurture3SentAt: '',
    unsubscribedAt: '',
    ...overrides,
  }
}

function daysAgo(n: number): string {
  return new Date(NOW.getTime() - n * 24 * 60 * 60 * 1000).toISOString()
}

describe('nextDue', () => {
  it('nothing due before day 2', () => {
    expect(nextDue(lead({ submittedAt: daysAgo(1) }), NOW)).toEqual({ action: 'none', reason: 'not-due' })
  })

  it('stage 1 due at day 2', () => {
    expect(nextDue(lead({ submittedAt: daysAgo(2) }), NOW)).toEqual({ action: 'send', stage: 1, column: 'N' })
  })

  it('stage 2 not sent before day 6 even when stage 1 sent', () => {
    expect(nextDue(lead({ submittedAt: daysAgo(3), nurture1SentAt: daysAgo(1) }), NOW))
      .toEqual({ action: 'none', reason: 'not-due' })
  })

  it('stage 2 due at day 6', () => {
    expect(nextDue(lead({ submittedAt: daysAgo(6), nurture1SentAt: daysAgo(4) }), NOW))
      .toEqual({ action: 'send', stage: 2, column: 'O' })
  })

  it('stage 3 due at day 10', () => {
    expect(nextDue(lead({ submittedAt: daysAgo(10), nurture1SentAt: 'x', nurture2SentAt: 'x' }), NOW))
      .toEqual({ action: 'send', stage: 3, column: 'P' })
  })

  it('complete after all three sent', () => {
    expect(nextDue(lead({ submittedAt: daysAgo(20), nurture1SentAt: 'x', nurture2SentAt: 'x', nurture3SentAt: 'x' }), NOW))
      .toEqual({ action: 'none', reason: 'complete' })
  })

  it('backlog lead sends only the next unsent stage (no blast)', () => {
    // Day 11, nothing sent yet, but within stale window → stage 1 only
    expect(nextDue(lead({ submittedAt: daysAgo(11) }), NOW)).toEqual({ action: 'send', stage: 1, column: 'N' })
  })

  it('unsubscribed leads never send', () => {
    expect(nextDue(lead({ submittedAt: daysAgo(5), unsubscribedAt: daysAgo(1) }), NOW))
      .toEqual({ action: 'none', reason: 'unsubscribed' })
  })

  it('stale never-nurtured leads are skipped', () => {
    expect(nextDue(lead({ submittedAt: daysAgo(30) }), NOW)).toEqual({ action: 'skip-stale' })
  })

  it('skip marker is terminal', () => {
    expect(nextDue(lead({ submittedAt: daysAgo(30), nurture1SentAt: SKIPPED_MARKER }), NOW))
      .toEqual({ action: 'none', reason: 'skipped' })
  })

  it('stale rule does not fire when stage 1 was already sent', () => {
    // Old lead mid-sequence keeps going
    expect(nextDue(lead({ submittedAt: daysAgo(30), nurture1SentAt: 'x', nurture2SentAt: 'x' }), NOW))
      .toEqual({ action: 'send', stage: 3, column: 'P' })
  })
})

describe('unsubscribe tokens', () => {
  it('verifies its own token, case-insensitively', () => {
    const t = unsubscribeToken('Lead@Example.com')
    expect(verifyUnsubscribeToken('lead@example.com', t)).toBe(true)
  })

  it('rejects a tampered token', () => {
    const t = unsubscribeToken('lead@example.com')
    expect(verifyUnsubscribeToken('other@example.com', t)).toBe(false)
    expect(verifyUnsubscribeToken('lead@example.com', t.slice(0, -1) + 'f')).toBe(false)
    expect(verifyUnsubscribeToken('lead@example.com', 'short')).toBe(false)
  })

  it('mid-sequence leads stop once past the expiry window', () => {
    expect(nextDue(lead({ submittedAt: daysAgo(90), nurture1SentAt: 'x' }), NOW))
      .toEqual({ action: 'none', reason: 'expired' })
  })
})
