'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    label: 'Discover',
    title: 'AI & Automation Audit',
    desc: 'A 60–90 minute deep dive into how your business actually runs. I identify the 3–5 biggest opportunities where AI and automation can save you real time — and deliver a one-page report within 48 hours.',
  },
  {
    number: '02',
    label: 'Build',
    title: 'Custom Solution',
    desc: "I design and build your automation — whether that's an AI chatbot, an automated lead pipeline, CRM workflows, or custom integrations. Fixed-fee pricing. No hourly surprises. 30 days of support included.",
  },
  {
    number: '03',
    label: 'Maintain',
    title: 'Ongoing Support',
    desc: "AI tools evolve and APIs change. I keep your automations running smoothly with monitoring, updates, and quarterly reviews — so you never lose the time you've gained back.",
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="py-[100px] bg-surface-alt max-sm:py-[72px]">
      <div className="max-w-[1080px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7 }}
        >
          <div className="font-display text-[11px] tracking-[4px] uppercase text-accent mb-5">
            How It Works
          </div>
          <h2 className="font-display text-[clamp(24px,3.5vw,40px)] font-bold leading-[1.25]">
            Three steps from overwhelmed to automated
          </h2>
        </motion.div>

        <div className="grid grid-cols-3 gap-8 mt-[60px] max-sm:grid-cols-1">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.15 }}
              className="bg-card border border-[var(--border)] p-11 relative transition-all duration-400 hover:bg-card-hover hover:border-[rgba(74,240,192,0.15)] hover:-translate-y-1"
            >
              <div className="font-display text-[48px] font-bold text-accent opacity-20 absolute top-5 right-7">
                {step.number}
              </div>
              <div className="font-display text-[11px] tracking-[3px] uppercase text-accent mb-4">
                {step.label}
              </div>
              <h3 className="font-display text-[20px] font-bold mb-4 leading-[1.3]">
                {step.title}
              </h3>
              <p className="text-[15px] text-muted leading-[1.7]">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
