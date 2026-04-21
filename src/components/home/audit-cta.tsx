'use client'

import { motion } from 'framer-motion'
import { AUDIT_FORM_URL } from '@/lib/site'

const features = [
  '60–90 minute video call',
  '3–5 prioritized opportunities',
  'One-page findings report',
  'Delivered within 48 hours',
  'Completely free',
  'Zero obligation',
]

export default function AuditCta() {
  return (
    <section id="audit" className="py-[100px] bg-surface-alt relative overflow-hidden max-sm:py-[72px]">
      {/* Radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-30%',
          left: '-10%',
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
          className="text-center max-w-[720px] mx-auto"
        >
          <div className="inline-block font-display text-[11px] tracking-[3px] uppercase text-accent border border-[rgba(74,240,192,0.25)] px-5 py-2 mb-9">
            Limited Availability
          </div>

          <h2 className="font-display text-[clamp(26px,4vw,44px)] font-bold leading-[1.2] mb-7">
            Get your free{' '}
            <em className="not-italic text-accent">AI & Automation Audit</em>
          </h2>

          <p className="text-[18px] text-muted leading-[1.8] mb-12">
            Find out exactly where AI can save you time — with a personalized, no-obligation deep
            dive into your business operations.
          </p>

          <div className="grid grid-cols-2 gap-4 text-left mb-[52px] max-w-[580px] mx-auto max-sm:grid-cols-1">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-[14px] text-[15px] text-muted py-3">
                <span className="text-accent font-display text-[14px] flex-shrink-0">✓</span>
                {f}
              </div>
            ))}
          </div>

          <a
            href={AUDIT_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-display text-[13px] font-bold tracking-[2px] uppercase text-surface bg-accent px-[52px] py-[22px] no-underline transition-all duration-300 hover:shadow-[0_0_40px_var(--accent-glow)] hover:-translate-y-[2px]"
          >
            Apply for Your Free Audit
          </a>

          <p className="mt-5 font-display text-[12px] tracking-[2px] text-dim uppercase">
            Only 5 spots available
          </p>
        </motion.div>
      </div>
    </section>
  )
}
