'use client'

import { motion } from 'framer-motion'

const points = [
  {
    title: 'Every call logged & transcribed',
    desc: 'Full transcript and recording of every conversation, stored and searchable. Nothing happens on your line that you can’t see.',
  },
  {
    title: 'Summarized to your inbox',
    desc: 'Name, number, the problem, and the booked time — emailed to you the moment the call ends. You’re never guessing what the AI told a customer.',
  },
  {
    title: 'Recording disclosure built in',
    desc: 'Callers are told the call may be recorded, per standard practice — so you stay on the right side of disclosure rules without lifting a finger.',
  },
  {
    title: 'Cancel anytime',
    desc: 'Month-to-month. No contracts, no cancellation fees. If it isn’t booking jobs, you walk — and Starter is backed by a 14-day money-back guarantee.',
  },
]

export default function Trust() {
  return (
    <section id="trust" className="py-[100px] bg-surface max-sm:py-[72px]">
      <div className="max-w-[1080px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7 }}
          className="max-w-[720px]"
        >
          <div className="font-display text-[11px] tracking-[4px] uppercase text-accent mb-5">
            No Black Box
          </div>
          <h2 className="font-display text-[clamp(24px,3.5vw,40px)] font-bold leading-[1.25] mb-4">
            You see everything it does
          </h2>
          <p className="text-[17px] text-muted leading-[1.8]">
            An AI answering your phones only works if you can trust it. So we built it to be
            fully transparent from day one.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-6 mt-[52px] max-sm:grid-cols-1">
          {points.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.1 }}
              className="bg-card border border-[var(--border)] p-8 flex gap-4"
            >
              <span className="text-accent font-display text-[16px] flex-shrink-0 mt-[2px]">✓</span>
              <div>
                <h3 className="font-display text-[17px] font-bold mb-3 leading-[1.3]">{p.title}</h3>
                <p className="text-[15px] text-muted leading-[1.7]">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
