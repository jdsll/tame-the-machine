'use client'

import { motion } from 'framer-motion'

const pains = [
  {
    text: (
      <>
        <strong className="text-content font-semibold">Missed calls and lost leads</strong> because
        you&apos;re on a job site or in a meeting
      </>
    ),
  },
  {
    text: (
      <>
        <strong className="text-content font-semibold">Hours of manual data entry</strong> across
        multiple systems that don&apos;t talk to each other
      </>
    ),
  },
  {
    text: (
      <>
        <strong className="text-content font-semibold">No follow-up system</strong> — leads fall
        through the cracks because there&apos;s no automated sequence
      </>
    ),
  },
  {
    text: (
      <>
        <strong className="text-content font-semibold">Repetitive proposals and invoicing</strong>{' '}
        that eat into time you could spend doing actual work
      </>
    ),
  },
]

export default function Problem() {
  return (
    <section className="py-[100px] bg-surface max-sm:py-[72px]">
      <div className="max-w-[1080px] mx-auto px-6">
        <div className="grid grid-cols-2 gap-20 items-center mt-0 max-sm:grid-cols-1 max-sm:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7 }}
          >
            <div className="font-display text-[11px] tracking-[4px] uppercase text-accent mb-5">
              The Problem
            </div>
            <h2 className="font-display text-[clamp(24px,3.5vw,40px)] font-bold leading-[1.25] mb-5">
              You&apos;re working 60-hour weeks doing things a machine could handle
            </h2>
            <p className="text-[17px] text-muted max-w-[600px] leading-[1.8]">
              You know AI could help. You just don&apos;t know where to start — and you don&apos;t
              have time to figure it out while running your business.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {pains.map((pain, i) => (
              <div
                key={i}
                className="py-6 border-b border-[var(--border)] flex gap-5 items-start"
              >
                <div className="font-display text-[18px] text-accent flex-shrink-0 w-7 pt-[2px]">
                  →
                </div>
                <div className="text-[16px] text-muted leading-[1.7]">{pain.text}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
