'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { scoreAssessment } from '@/lib/assessment/scoring'
import type { AssessmentAnswers, AssessmentResult } from '@/lib/assessment/scoring-data'
import { QUESTIONS } from './questions'
import ResultDisplay from './result-display'

// --- Types ---

// Selection order is rank order: selected[0] is the top pick.
type MultiRankState = { selected: string[] }

type FormState = {
  step: number
  q1: string | null
  q2: MultiRankState
  q3: string | null
  q4: string | null
  q5: string | null
  q6: MultiRankState
  q7: string | null
  q8: string | null
  firstName: string
  email: string
  hp: string
  emailDelivered: boolean
}

// --- Constants ---

const EMPTY_MULTI: MultiRankState = { selected: [] }

const DEFAULT_STATE: FormState = {
  step: 0,
  q1: null,
  q2: { ...EMPTY_MULTI },
  q3: null,
  q4: null,
  q5: null,
  q6: { ...EMPTY_MULTI },
  q7: null,
  q8: null,
  firstName: '',
  email: '',
  hp: '',
  emailDelivered: true,
}

// v2: MultiRankState dropped rank1 (rank is now selection order)
const STORAGE_KEY = 'aia:form:v2'

// --- Helpers ---

function hydrateFromStorage(): FormState {
  try {
    if (typeof window === 'undefined') return DEFAULT_STATE
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_STATE
  }
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

function toAnswers(s: FormState): AssessmentAnswers {
  type MultiId5 = 'A' | 'B' | 'C' | 'D' | 'E'
  type RankItem = { id: MultiId5; rank: 1 | 2 }

  function buildMulti(mr: MultiRankState): RankItem[] {
    return mr.selected.slice(0, 2).map((id, i) => ({ id: id as MultiId5, rank: (i + 1) as 1 | 2 }))
  }

  return {
    q1: s.q1 as 'A' | 'B' | 'C' | 'D',
    q2: buildMulti(s.q2),
    q3: s.q3 as 'A' | 'B' | 'C' | 'D',
    q4: s.q4 as 'A' | 'B' | 'C' | 'D',
    q5: s.q5 as 'A' | 'B' | 'C' | 'D',
    q6: buildMulti(s.q6),
    q7: s.q7 as 'A' | 'B' | 'C' | 'D',
    q8: s.q8 as 'A' | 'B' | 'C' | 'D' | 'E',
  }
}

// --- Sub-components ---

function OptionButton({
  selected,
  onClick,
  children,
  rankBadge = null,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
  rankBadge?: 1 | 2 | null
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        'w-full text-left px-5 py-4 rounded-lg border transition-all duration-150 font-body text-[15px] leading-[1.6]',
        rankBadge ? 'flex items-center gap-3' : '',
        selected
          ? 'border-accent bg-[var(--accent-dim)] text-content'
          : 'border-[var(--border)] bg-card hover:bg-card-hover text-content',
      ].join(' ')}
    >
      {rankBadge && (
        <span
          aria-hidden="true"
          className={[
            'flex-shrink-0 w-5 h-5 rounded-full border-2 border-accent flex items-center justify-center font-display text-[11px] font-bold leading-none',
            rankBadge === 1 ? 'bg-accent text-surface' : 'bg-transparent text-accent',
          ].join(' ')}
        >
          {rankBadge}
        </span>
      )}
      <span className={rankBadge ? 'flex-1' : ''}>{children}</span>
    </button>
  )
}

// --- Main component ---

export default function AssessmentForm() {
  const [state, setState] = useState<FormState>(DEFAULT_STATE)
  const [hydrated, setHydrated] = useState(false)
  const [blockMessage, setBlockMessage] = useState<string | null>(null)
  const [emailError, setEmailError] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const stored = hydrateFromStorage()
    // Landing on the results step after a refresh: recompute the result from
    // the stored answers so the page doesn't strand on the loading fallback.
    if (stored.step === 9) {
      try {
        setResult(scoreAssessment(toAnswers(stored)))
      } catch {
        setState(DEFAULT_STATE)
        setHydrated(true)
        return
      }
    }
    setState(stored)
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
  }, [state, hydrated])

  const { step } = state
  const question = step <= 7 ? QUESTIONS[step] : null

  // --- Handlers ---

  const clearAdvanceTimer = () => {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current)
      advanceTimer.current = null
    }
  }

  const handleSingle = (qKey: string, value: string) => {
    clearAdvanceTimer()
    setState(s => ({ ...s, [qKey]: value }))
    advanceTimer.current = setTimeout(() => {
      setState(s => ({ ...s, step: s.step + 1 }))
    }, 150)
  }

  const handleMultiToggle = (qKey: 'q2' | 'q6', id: string) => {
    setState(s => {
      const cur = s[qKey] as MultiRankState
      if (cur.selected.includes(id)) {
        return { ...s, [qKey]: { selected: cur.selected.filter(x => x !== id) } }
      }
      if (cur.selected.length >= 2) {
        setBlockMessage("You've picked 2 — tap one to deselect, then choose another.")
        setTimeout(() => setBlockMessage(null), 3000)
        return s
      }
      return { ...s, [qKey]: { selected: [...cur.selected, id] } }
    })
  }

  const canAdvance = (): boolean => {
    if (step === 8) return validateEmail(state.email)
    // Multi-rank: at least 1 selection; rank comes from selection order.
    if (step === 1) return state.q2.selected.length >= 1
    if (step === 5) return state.q6.selected.length >= 1
    return true
  }

  const goNext = () => setState(s => ({ ...s, step: s.step + 1 }))

  const goBack = () => {
    clearAdvanceTimer()
    setState(s => ({ ...s, step: s.step - 1 }))
  }

  const handleSubmit = async () => {
    if (!validateEmail(state.email)) {
      setEmailError(true)
      return
    }
    if (submitting) return
    setSubmitting(true)

    const answers = toAnswers(state)
    const scored = scoreAssessment(answers)
    setResult(scored)

    // The result is computed locally, so the user always gets their results —
    // delivery failures just mean no emailed copy (shown as a banner).
    let emailDelivered = false
    try {
      const res = await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          computed: scored,
          email: state.email,
          firstName: state.firstName || undefined,
          submittedAt: new Date().toISOString(),
          _hp: state.hp,
        }),
      })
      const data = await res.json() as { ok: boolean; emailOk?: boolean }
      emailDelivered = data.ok && data.emailOk !== false
    } catch {
      emailDelivered = false
    } finally {
      setSubmitting(false)
    }
    setState(s => ({ ...s, step: 9, emailDelivered }))
  }

  // --- Render ---

  // Step 9: result display — renders outside the form section
  if (step === 9) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {result ? (
          <ResultDisplay
            result={result}
            firstName={state.firstName}
            q8={state.q8 ?? 'A'}
            emailed={state.emailDelivered}
          />
        ) : (
          <div className="text-center py-24 text-muted font-body">Loading your results...</div>
        )}
      </motion.div>
    )
  }

  return (
    <section className="bg-surface min-h-[60vh] py-16 pb-24">
      <div className="max-w-[640px] mx-auto px-6">

        {/* Progress indicator */}
        {step <= 7 && (
          <div className="flex items-center justify-between mb-8">
            <span className="font-display text-[11px] tracking-[3px] uppercase text-muted">
              Question {step + 1} of 8
            </span>
            <div className="h-[2px] w-32 bg-card-hover rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-300"
                style={{ width: `${((step + 1) / 8) * 100}%` }}
              />
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="mb-8">
            <span className="font-display text-[11px] tracking-[3px] uppercase text-accent">
              Almost done
            </span>
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* Q steps (0-7) */}
          {step <= 7 && question && (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <div className="bg-card border border-[var(--border)] rounded-xl p-8">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <h2 className="font-display text-[18px] font-bold text-content leading-[1.4] flex-1">
                    {question.text}
                  </h2>
                  {question.kind === 'multi-rank' && (
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={!canAdvance()}
                      className="flex-shrink-0 font-display text-[11px] font-bold tracking-[2px] uppercase text-surface bg-accent px-5 py-[10px] transition-all duration-300 hover:shadow-[0_0_30px_var(--accent-glow)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
                    >
                      Next →
                    </button>
                  )}
                </div>

                {/* Single-select */}
                {question.kind === 'single' && (
                  <div className="flex flex-col gap-3">
                    {question.options.map(opt => {
                      const currentValue = state[question.qKey as keyof FormState] as string | null
                      return (
                        <OptionButton
                          key={opt.id}
                          selected={currentValue === opt.id}
                          onClick={() => handleSingle(question.qKey, opt.id)}
                        >
                          {opt.text}
                        </OptionButton>
                      )
                    })}
                  </div>
                )}

                {/* Multi-rank */}
                {question.kind === 'multi-rank' && (() => {
                  const qKey = question.qKey as 'q2' | 'q6'
                  const mrState = state[qKey] as MultiRankState
                  return (
                    <>
                      <p className="text-muted text-[13px] font-body mb-3">
                        Select up to 2 in order of impact — your first pick counts most.
                      </p>

                      <div className="flex flex-col gap-3">
                        {question.options.map(opt => {
                          const rankIdx = mrState.selected.indexOf(opt.id)
                          return (
                            <OptionButton
                              key={opt.id}
                              selected={rankIdx !== -1}
                              onClick={() => handleMultiToggle(qKey, opt.id)}
                              rankBadge={rankIdx === -1 ? null : ((rankIdx + 1) as 1 | 2)}
                            >
                              {opt.text}
                            </OptionButton>
                          )
                        })}
                      </div>

                      {/* Block message */}
                      <AnimatePresence>
                        {blockMessage && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="text-[13px] text-accent mt-4 font-body"
                          >
                            {blockMessage}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </>
                  )
                })()}
              </div>

              {/* Nav buttons */}
              {question.kind === 'multi-rank' && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={goBack}
                    className="font-body text-[14px] text-muted hover:text-content transition-colors"
                  >
                    ← Back
                  </button>
                </div>
              )}

              {question.kind === 'single' && step > 0 && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={goBack}
                    className="font-body text-[14px] text-muted hover:text-content transition-colors"
                  >
                    ← Back
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Email / name step (step 8) */}
          {step === 8 && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <form
                onSubmit={e => {
                  e.preventDefault()
                  handleSubmit()
                }}
              >
              <div className="bg-card border border-[var(--border)] rounded-xl p-8">
                <h2 className="font-display text-[18px] font-bold text-content mb-2 leading-[1.4]">
                  Where should we send your results?
                </h2>
                <p className="text-muted text-[14px] font-body mb-8 leading-[1.7]">
                  We'll email you a personal breakdown with your top AI opportunities.
                </p>

                {/* Honeypot — hidden from legitimate users */}
                <div
                  style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
                  aria-hidden="true"
                >
                  <input
                    type="text"
                    name="_hp"
                    tabIndex={-1}
                    autoComplete="off"
                    value={state.hp}
                    onChange={e => setState(s => ({ ...s, hp: e.target.value }))}
                  />
                </div>

                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block font-display text-[11px] tracking-[2px] uppercase text-muted mb-2">
                      First name
                    </label>
                    <input
                      type="text"
                      placeholder="Optional"
                      value={state.firstName}
                      onChange={e => setState(s => ({ ...s, firstName: e.target.value }))}
                      className="w-full bg-surface border border-[var(--border)] rounded-lg px-4 py-3 text-content font-body text-[15px] placeholder:text-dim focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-display text-[11px] tracking-[2px] uppercase text-muted mb-2">
                      Email <span className="text-accent">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="you@yourcompany.com"
                      value={state.email}
                      onChange={e => {
                        setState(s => ({ ...s, email: e.target.value }))
                        if (emailError) setEmailError(false)
                      }}
                      onBlur={() => {
                        if (state.email && !validateEmail(state.email)) setEmailError(true)
                      }}
                      className={[
                        'w-full bg-surface border rounded-lg px-4 py-3 text-content font-body text-[15px] placeholder:text-dim focus:outline-none transition-colors',
                        emailError
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-[var(--border)] focus:border-accent',
                      ].join(' ')}
                    />
                    {emailError && (
                      <p className="mt-2 text-[13px] font-body text-red-400">
                        Please enter a valid email address.
                      </p>
                    )}
                  </div>
                </div>

                <p className="mt-5 text-[13px] font-body text-dim leading-[1.6]">
                  One email with your full results — no spam, no drip sequence.
                </p>
              </div>

              <div className="flex items-center justify-between mt-6">
                <button
                  type="button"
                  onClick={goBack}
                  className="font-body text-[14px] text-muted hover:text-content transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={!canAdvance() || submitting}
                  className="font-display text-[11px] font-bold tracking-[2px] uppercase text-surface bg-accent px-10 py-[16px] transition-all duration-300 hover:shadow-[0_0_40px_var(--accent-glow)] hover:-translate-y-[2px] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0"
                >
                  {submitting ? 'Sending...' : 'Get my results'}
                </button>
              </div>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  )
}
