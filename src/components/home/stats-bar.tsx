'use client'

import { motion } from 'framer-motion'

const stats = [
  { number: '5–10', label: 'Hours saved per week' },
  { number: '48hr', label: 'Audit report turnaround' },
  { number: '$0', label: 'Cost of your first audit' },
]

export default function StatsBar() {
  return (
    <div className="border-t border-b border-[var(--border)] py-12 bg-surface-alt">
      <div className="max-w-[1080px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-3 gap-10 text-center max-sm:grid-cols-1 max-sm:gap-8"
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-[clamp(28px,4vw,42px)] font-bold text-accent mb-2">
                {stat.number}
              </div>
              <div className="text-[14px] text-muted tracking-[1px]">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
