import { createHmac, timingSafeEqual } from 'crypto'
import type { LeadRow } from './sheets'

// ── Sequence config ───────────────────────────────────────────────────────────
// Stage N sends once `daysAfterSubmit` days have passed since submission and the
// stage's sheet column is still empty. One email per lead per run, so a backlog
// lead drips one stage per day rather than getting blasted.

export type NurtureStage = 1 | 2 | 3

export const STAGES: { stage: NurtureStage; daysAfterSubmit: number; column: 'N' | 'O' | 'P' }[] = [
  { stage: 1, daysAfterSubmit: 2, column: 'N' },
  { stage: 2, daysAfterSubmit: 6, column: 'O' },
  { stage: 3, daysAfterSubmit: 10, column: 'P' },
]

// Leads older than this with no nurture ever sent predate the sequence — skip
// them rather than emailing someone weeks after they took the assessment.
export const STALE_DAYS = 21

// A lead partway through the sequence keeps going after a short outage, but
// past this age the remaining stages would arrive out of nowhere, so stop.
export const EXPIRE_DAYS = 30

export const SKIPPED_MARKER = 'skipped:stale'

export type DueResult =
  | { action: 'send'; stage: NurtureStage; column: 'N' | 'O' | 'P' }
  | { action: 'skip-stale' }
  | { action: 'none'; reason: 'unsubscribed' | 'complete' | 'not-due' | 'skipped' | 'expired' }

export function daysSince(iso: string, now: Date): number {
  return (now.getTime() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24)
}

export function nextDue(lead: LeadRow, now: Date): DueResult {
  if (lead.unsubscribedAt) return { action: 'none', reason: 'unsubscribed' }
  if (lead.nurture1SentAt === SKIPPED_MARKER) return { action: 'none', reason: 'skipped' }

  const age = daysSince(lead.submittedAt, now)
  const sent = [lead.nurture1SentAt, lead.nurture2SentAt, lead.nurture3SentAt]

  // Never nurtured and already stale — mark and move on
  if (!sent[0] && age > STALE_DAYS) return { action: 'skip-stale' }
  if (sent.every(Boolean)) return { action: 'none', reason: 'complete' }
  if (age > EXPIRE_DAYS) return { action: 'none', reason: 'expired' }

  for (const s of STAGES) {
    if (sent[s.stage - 1]) continue
    if (age >= s.daysAfterSubmit) return { action: 'send', stage: s.stage, column: s.column }
    return { action: 'none', reason: 'not-due' } // stages are ordered; nothing later can be due
  }
  return { action: 'none', reason: 'complete' }
}

// ── Unsubscribe tokens ────────────────────────────────────────────────────────
// HMAC of the lowercased email; the link works forever and carries no PII
// beyond the email itself.

function secret(): string {
  const s = process.env.UNSUBSCRIBE_SECRET ?? process.env.RESEND_API_KEY ?? ''
  if (!s) throw new Error('[nurture] no UNSUBSCRIBE_SECRET or RESEND_API_KEY set')
  return s
}

export function unsubscribeToken(email: string): string {
  return createHmac('sha256', secret()).update(email.trim().toLowerCase()).digest('hex').slice(0, 32)
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = unsubscribeToken(email)
  const a = Buffer.from(expected)
  const b = Buffer.from(token)
  return a.length === b.length && timingSafeEqual(a, b)
}

export function unsubscribeUrl(email: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tamethemachine.com'
  const params = new URLSearchParams({ e: email.trim().toLowerCase(), t: unsubscribeToken(email) })
  return `${base}/unsubscribe?${params.toString()}`
}
