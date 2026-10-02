'use client'

// The letter homepage (preview V4, chosen 2026-09-15). "What a build looks
// like" section parked in home-content.ts until real case studies ship.

import { motion } from 'framer-motion'
import {
  ASSESSMENT_URL,
  AUDIT_CALL_URL,
  FAMILIAR_LINES,
  OFFER_STEPS,
  FAQS,
  GUARANTEE_LINE,
} from '@/lib/home-content'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6 },
}

export default function HomePage() {
  return (
    <>
      {/* ── Hero — the letter opens ──────────────────────────── */}
      <section className="min-h-[88vh] flex items-center relative pt-20 bg-surface overflow-hidden">
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-10%',
            left: '-15%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(74,240,192,0.05) 0%, transparent 70%)',
          }}
        />
        <div className="max-w-[720px] mx-auto px-6 relative z-10 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-[12px] tracking-[4px] uppercase text-accent mb-8"
          >
            Jeff Restel · Healdsburg, CA
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="font-display text-[clamp(30px,5vw,54px)] font-bold leading-[1.2] tracking-[-1px] mb-10"
          >
            You run the business.
            <br />
            <em className="not-italic text-accent">I&apos;ll tame the machines.</em>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="space-y-5 text-[17px] text-muted leading-[1.9] mb-12"
          >
            <p>
              I&apos;m not a tech guy who discovered business. I&apos;m a business guy — solar
              consulting, winemaking — who got tired of doing the same work twice and
              taught the machines to do it once.
            </p>
            <p>
              Now I build those automations for owner-led service businesses: the
              missed-call rescue, the follow-up that never slips, the reports that write
              themselves. Real workflows, a fixed price you approve up front, built by
              the person you talked to.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="flex gap-5 items-center flex-wrap"
          >
            <a
              href={ASSESSMENT_URL}
              className="inline-block font-display text-[12px] font-bold tracking-[2px] uppercase text-surface bg-accent px-10 py-[18px] no-underline transition-all duration-300 hover:shadow-[0_0_40px_var(--accent-glow)] hover:-translate-y-[2px]"
            >
              See what I&apos;d automate first
            </a>
            <span className="text-[13px] text-dim">Free 3-minute assessment</span>
          </motion.div>
        </div>
      </section>

      {/* ── Sound familiar? ──────────────────────────────────── */}
      <section className="py-[90px] bg-surface-alt border-t border-b border-[var(--border)] max-sm:py-[64px]">
        <div className="max-w-[720px] mx-auto px-6">
          <motion.div {...fadeUp}>
            <div className="font-display text-[11px] tracking-[4px] uppercase text-accent mb-8">
              Sound familiar?
            </div>
          </motion.div>
          <div>
            {FAMILIAR_LINES.map((line, i) => (
              <motion.div
                key={line}
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.08 * i }}
                className="py-5 border-b border-[var(--border)] last:border-b-0 flex gap-5 items-start"
              >
                <span className="font-display text-accent flex-shrink-0 pt-[2px]">→</span>
                <p className="text-[16px] text-content leading-[1.7]">{line}</p>
              </motion.div>
            ))}
          </div>
          <motion.p {...fadeUp} className="mt-8 text-[16px] text-muted leading-[1.8]">
            None of that is a character flaw. It&apos;s a systems gap — and systems gaps
            are fixable.
          </motion.p>
        </div>
      </section>

      {/* ── The three steps ──────────────────────────────────── */}
      <section className="py-[100px] bg-surface max-sm:py-[72px]">
        <div className="max-w-[860px] mx-auto px-6">
          <motion.div {...fadeUp} className="max-w-[720px]">
            <div className="font-display text-[11px] tracking-[4px] uppercase text-accent mb-5">
              How we&apos;d work together
            </div>
            <h2 className="font-display text-[clamp(24px,3.5vw,38px)] font-bold leading-[1.25] mb-4">
              Three steps, and the first two are free
            </h2>
            <p className="text-[16px] text-muted leading-[1.8] mb-2">
              No discovery-call maze. Here&apos;s the whole path.
            </p>
          </motion.div>
          <div className="mt-12 space-y-6">
            {OFFER_STEPS.map((step, i) => (
              <motion.div
                key={step.name}
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className="bg-card border border-[var(--border)] p-9 grid grid-cols-[150px_1fr] gap-8 items-start max-sm:grid-cols-1 max-sm:gap-4"
              >
                <div>
                  <div className="font-display text-[11px] tracking-[3px] uppercase text-dim mb-2">
                    {step.label}
                  </div>
                  <div className="font-display text-[13px] font-bold text-accent leading-[1.5]">
                    {step.price}
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-[19px] font-bold mb-3">{step.name}</h3>
                  <p className="text-[15px] text-muted leading-[1.8]">{step.desc}</p>
                  {i === 0 && (
                    <a
                      href={ASSESSMENT_URL}
                      className="inline-block mt-5 font-display text-[11px] font-bold tracking-[2px] uppercase text-surface bg-accent px-7 py-[12px] no-underline transition-all duration-300 hover:shadow-[0_0_30px_var(--accent-glow)]"
                    >
                      Take the assessment
                    </a>
                  )}
                  {i === 1 && (
                    <a
                      href={AUDIT_CALL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-5 font-display text-[11px] font-bold tracking-[2px] uppercase text-accent border border-[rgba(74,240,192,0.35)] px-7 py-[11px] no-underline transition-all duration-300 hover:bg-[var(--accent-dim)]"
                    >
                      Book the audit
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          <motion.p {...fadeUp} className="mt-8 text-[15px] text-content leading-[1.8] border-l-[3px] border-accent pl-6 max-w-[720px]">
            {GUARANTEE_LINE}
          </motion.p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="py-[90px] bg-surface max-sm:py-[64px]">
        <div className="max-w-[720px] mx-auto px-6">
          <motion.div {...fadeUp}>
            <div className="font-display text-[11px] tracking-[4px] uppercase text-accent mb-10">
              Frequently asked questions
            </div>
          </motion.div>
          <div>
            {FAQS.map((f, i) => (
              <motion.details
                key={f.q}
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.05 * i }}
                className="group border-b border-[var(--border)] py-6"
              >
                <summary className="font-display text-[16px] font-bold cursor-pointer list-none flex justify-between items-center gap-4">
                  {f.q}
                  <span className="text-accent transition-transform duration-200 group-open:rotate-45 font-display text-[20px]">
                    +
                  </span>
                </summary>
                <p className="text-[15px] text-muted leading-[1.8] mt-4">{f.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sign-off CTA ─────────────────────────────────────── */}
      <section className="py-[100px] bg-surface-alt border-t border-[var(--border)] relative overflow-hidden max-sm:py-[72px]">
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '-30%',
            right: '-10%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(74,240,192,0.05) 0%, transparent 70%)',
          }}
        />
        <div className="max-w-[720px] mx-auto px-6 relative z-10">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-[clamp(26px,4vw,40px)] font-bold leading-[1.25] mb-6">
              Start with the assessment.
              <br />
              <em className="not-italic text-accent">It&apos;s the demo.</em>
            </h2>
            <p className="text-[17px] text-muted leading-[1.8] mb-10 max-w-[560px]">
              The three-minute assessment is itself one of my automations — it scores
              you, writes your plan, and lands it in your inbox before you&apos;ve closed
              the tab. If you like how that feels, imagine it running your follow-up.
            </p>
            <div className="flex gap-5 items-center flex-wrap mb-10">
              <a
                href={ASSESSMENT_URL}
                className="inline-block font-display text-[12px] font-bold tracking-[2px] uppercase text-surface bg-accent px-10 py-[18px] no-underline transition-all duration-300 hover:shadow-[0_0_40px_var(--accent-glow)] hover:-translate-y-[2px]"
              >
                Take the assessment
              </a>
              <a
                href={AUDIT_CALL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-[12px] tracking-[2px] uppercase text-muted py-[18px] no-underline transition-colors duration-300 hover:text-accent"
              >
                Or skip straight to the audit →
              </a>
            </div>
            <div className="mt-2 font-display text-[14px] text-content">— Jeff</div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
