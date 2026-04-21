'use client'

import { motion } from 'framer-motion'
import { AUDIT_FORM_URL } from '@/lib/site'

export default function Hero() {
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
          AI Automation Agency
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-[clamp(32px,5.5vw,64px)] font-bold leading-[1.15] tracking-[-1px] mb-8"
        >
          Stop wasting hours on tasks{' '}
          <em className="not-italic text-accent">machines can do</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-[19px] text-muted max-w-[600px] leading-[1.8] mb-12"
        >
          I help small service businesses identify where AI can save them 5–10 hours per
          week — then I build it for them.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex gap-5 items-center flex-wrap"
        >
          <a
            href={AUDIT_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-display text-[12px] font-bold tracking-[2px] uppercase text-surface bg-accent px-10 py-[18px] no-underline transition-all duration-300 hover:shadow-[0_0_40px_var(--accent-glow)] hover:-translate-y-[2px]"
          >
            Claim Your Free Audit
          </a>
          <a
            href="#how"
            className="font-display text-[12px] tracking-[2px] uppercase text-muted py-[18px] no-underline transition-colors duration-300 hover:text-accent"
          >
            See How It Works ↓
          </a>
        </motion.div>
      </div>
    </section>
  )
}
