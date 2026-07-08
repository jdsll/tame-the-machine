'use client'

import { motion } from 'framer-motion'
import { CALENDLY_URL, DEMO_LINE_NUMBER, formatPhone } from '@/lib/receptionist'

export default function Hero() {
  const hasDemoLine = DEMO_LINE_NUMBER.length > 0

  return (
    <section className="min-h-screen flex items-center relative pt-20 bg-surface overflow-hidden">
      {/* Radial accent glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-20%',
          right: '-15%',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(74,240,192,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-[1080px] mx-auto px-6 relative z-10 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-[12px] tracking-[4px] uppercase text-accent mb-8"
        >
          Front Desk AI · by Tame the Machine
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-[clamp(32px,5.5vw,64px)] font-bold leading-[1.15] tracking-[-1px] mb-8"
        >
          Never Miss{' '}
          <em className="not-italic text-accent">Another Call</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-[19px] text-muted max-w-[640px] leading-[1.8] mb-8"
        >
          A 24/7 AI receptionist built for plumbing &amp; HVAC companies. It answers the
          calls you miss — in English and Spanish — books the job, texts the caller back,
          and emails you a summary before the truck even rolls.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex items-center gap-4 flex-wrap mb-12"
        >
          <div className="font-display text-[13px] tracking-[1px] text-content border border-[rgba(74,240,192,0.25)] px-4 py-2">
            <span className="text-accent font-bold">62%</span> of calls to small service
            businesses go unanswered
          </div>
          <div className="font-display text-[13px] tracking-[1px] text-content border border-[rgba(74,240,192,0.25)] px-4 py-2">
            Average missed call ≈ a <span className="text-accent font-bold">$350</span> job
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex gap-5 items-center flex-wrap"
        >
          {hasDemoLine ? (
            <a
              href={`tel:${DEMO_LINE_NUMBER}`}
              className="inline-block font-display text-[12px] font-bold tracking-[2px] uppercase text-surface bg-accent px-10 py-[18px] no-underline transition-all duration-300 hover:shadow-[0_0_40px_var(--accent-glow)] hover:-translate-y-[2px]"
            >
              Call the demo line
            </a>
          ) : (
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-display text-[12px] font-bold tracking-[2px] uppercase text-surface bg-accent px-10 py-[18px] no-underline transition-all duration-300 hover:shadow-[0_0_40px_var(--accent-glow)] hover:-translate-y-[2px]"
            >
              Book a 15-min demo
            </a>
          )}
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-[12px] tracking-[2px] uppercase text-muted py-[18px] no-underline transition-colors duration-300 hover:text-accent"
          >
            {hasDemoLine ? 'Book a 15-min demo →' : 'See how it works ↓'}
          </a>
        </motion.div>

        {hasDemoLine && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-5 font-display text-[12px] tracking-[1px] text-dim"
          >
            Demo line: {formatPhone(DEMO_LINE_NUMBER)}
          </motion.p>
        )}
      </div>
    </section>
  )
}
