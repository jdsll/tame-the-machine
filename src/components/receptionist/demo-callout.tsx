'use client'

import { motion } from 'framer-motion'
import { CALENDLY_URL, DEMO_LINE_NUMBER, formatPhone } from '@/lib/receptionist'

export default function DemoCallout() {
  const hasDemoLine = DEMO_LINE_NUMBER.length > 0

  return (
    <section id="demo" className="py-[100px] bg-surface relative overflow-hidden max-sm:py-[72px]">
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-30%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(74,240,192,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-[1080px] mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7 }}
          className="bg-card border border-[rgba(74,240,192,0.2)] p-12 text-center max-w-[760px] mx-auto max-sm:p-8"
        >
          <div className="font-display text-[11px] tracking-[4px] uppercase text-accent mb-6">
            Try It Live
          </div>

          {hasDemoLine ? (
            <>
              <h2 className="font-display text-[clamp(24px,3.5vw,38px)] font-bold leading-[1.2] mb-5">
                Call our demo line right now and fire a{' '}
                <em className="not-italic text-accent">plumbing emergency</em> at it.
              </h2>
              <p className="text-[17px] text-muted leading-[1.8] mb-9 max-w-[560px] mx-auto">
                Pretend your water heater just burst. Ask for same-day service. Try it in
                Spanish. See how it books the job and what lands in the owner&apos;s inbox.
              </p>
              <a
                href={`tel:${DEMO_LINE_NUMBER}`}
                className="inline-block font-display text-[clamp(20px,3vw,30px)] font-bold tracking-[1px] text-surface bg-accent px-10 py-5 no-underline transition-all duration-300 hover:shadow-[0_0_40px_var(--accent-glow)] hover:-translate-y-[2px]"
              >
                {formatPhone(DEMO_LINE_NUMBER)}
              </a>
              <p className="mt-5 font-display text-[12px] tracking-[2px] uppercase text-dim">
                Tap to call · answers 24/7
              </p>
            </>
          ) : (
            <>
              <h2 className="font-display text-[clamp(24px,3.5vw,38px)] font-bold leading-[1.2] mb-5">
                Demo line launching{' '}
                <em className="not-italic text-accent">this week</em>
              </h2>
              <p className="text-[17px] text-muted leading-[1.8] mb-9 max-w-[560px] mx-auto">
                We&apos;re putting the final polish on the public demo line. Want to hear it
                sooner? Book a live walkthrough and we&apos;ll throw a plumbing emergency at it
                together — in English or Spanish.
              </p>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-display text-[13px] font-bold tracking-[2px] uppercase text-surface bg-accent px-10 py-[20px] no-underline transition-all duration-300 hover:shadow-[0_0_40px_var(--accent-glow)] hover:-translate-y-[2px]"
              >
                Book a live walkthrough
              </a>
            </>
          )}
        </motion.div>
      </div>
    </section>
  )
}
