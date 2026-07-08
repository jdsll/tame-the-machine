'use client'

import { motion } from 'framer-motion'
import { CALENDLY_URL, DEMO_LINE_NUMBER, formatPhone } from '@/lib/receptionist'

export default function FooterCta() {
  const hasDemoLine = DEMO_LINE_NUMBER.length > 0

  return (
    <section className="py-[110px] bg-surface relative overflow-hidden max-sm:py-[80px]">
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-30%',
          left: '-10%',
          width: '640px',
          height: '640px',
          background: 'radial-gradient(circle, rgba(74,240,192,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-[1080px] mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7 }}
          className="max-w-[720px] mx-auto"
        >
          <h2 className="font-display text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.5px] mb-7">
            Your next missed call is a{' '}
            <em className="not-italic text-accent">booked job</em>
          </h2>
          <p className="text-[18px] text-muted leading-[1.8] mb-11">
            Put a 24/7 receptionist on your line this week. Book a 15-minute demo and hear
            exactly what your callers would hear.
          </p>

          <div className="flex gap-5 items-center justify-center flex-wrap">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-display text-[13px] font-bold tracking-[2px] uppercase text-surface bg-accent px-[52px] py-[22px] no-underline transition-all duration-300 hover:shadow-[0_0_40px_var(--accent-glow)] hover:-translate-y-[2px]"
            >
              Book a 15-min demo
            </a>
            {hasDemoLine && (
              <a
                href={`tel:${DEMO_LINE_NUMBER}`}
                className="font-display text-[13px] tracking-[2px] uppercase text-muted py-[22px] no-underline transition-colors duration-300 hover:text-accent"
              >
                Or call {formatPhone(DEMO_LINE_NUMBER)} →
              </a>
            )}
          </div>

          <p className="mt-12 font-display text-[12px] tracking-[2px] uppercase text-dim">
            Front Desk AI ·{' '}
            <a
              href="https://tamethemachine.com"
              className="text-muted hover:text-accent transition-colors duration-200 no-underline"
            >
              by Tame the Machine
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
