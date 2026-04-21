'use client'

import { motion } from 'framer-motion'

const items = [
  { icon: '🔨', label: 'Contractors & Trades', pain: 'Missed calls, manual estimates, no follow-up system' },
  { icon: '🏠', label: 'Real Estate Agents', pain: 'Lead follow-up gaps, manual CRM, document overload' },
  { icon: '💼', label: 'Professional Services', pain: 'Email overload, manual scheduling, repetitive proposals' },
  { icon: '🍷', label: 'Wine & Hospitality', pain: 'Manual customer comms, no automated reorder workflows' },
  { icon: '☀️', label: 'Solar & Energy', pain: 'Lead qualification, pipeline visibility, proposal generation' },
  { icon: '⚡', label: 'Any Service Business', pain: "If you're doing it all yourself, there's time to reclaim" },
]

export default function WhoItsFor() {
  return (
    <section className="py-[100px] bg-surface max-sm:py-[72px]">
      <div className="max-w-[1080px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7 }}
        >
          <div className="font-display text-[11px] tracking-[4px] uppercase text-accent mb-5">
            Who This Is For
          </div>
          <h2 className="font-display text-[clamp(24px,3.5vw,40px)] font-bold leading-[1.25] mb-5">
            Built for small service businesses
          </h2>
          <p className="text-[17px] text-muted max-w-[600px] leading-[1.8]">
            If you&apos;re running the business, doing the work, and handling the admin yourself —
            this is for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-5 mt-[60px] max-sm:grid-cols-1">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: 0.05 * i }}
              className="border border-[var(--border)] px-9 py-8 flex items-center gap-5 transition-all duration-300 hover:border-[rgba(74,240,192,0.15)] hover:bg-card"
            >
              <div className="text-[28px] flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[var(--accent-dim)] rounded-sm">
                {item.icon}
              </div>
              <div>
                <div className="text-[16px] font-semibold">{item.label}</div>
                <div className="text-[14px] text-muted mt-1">{item.pain}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
