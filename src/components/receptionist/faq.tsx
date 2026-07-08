'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const faqs = [
  {
    q: 'Do I lose my phone number?',
    a: 'No. You keep the number on your trucks, website, and business cards. You just set your unanswered calls to forward to your AI receptionist. When you pick up, nothing changes; when you can’t, it answers instead of sending the caller to voicemail.',
  },
  {
    q: 'What if the AI can’t handle a call?',
    a: 'It’s built to know its limits. For anything unusual, it takes a detailed message and can hand off — either transferring to you or your on-call tech (on Premium) or flagging the call for an immediate callback. You get the full transcript either way, so nothing falls through the cracks.',
  },
  {
    q: 'Does it really speak Spanish?',
    a: 'Yes. On Pro and Premium the receptionist handles calls in both English and Spanish, switching automatically based on how the caller speaks. For a lot of plumbing and HVAC shops, that alone captures jobs that used to hang up.',
  },
  {
    q: 'Am I locked into a contract?',
    a: 'No. Every plan is month-to-month — cancel anytime, no cancellation fee. Starter also comes with a 14-day money-back guarantee, so you can try it with zero risk.',
  },
  {
    q: 'How fast can I be up and running?',
    a: 'Within 48 hours. We learn how you run jobs, your service area, and your pricing, then configure and test your receptionist. No new hardware and no app for your crew to learn.',
  },
  {
    q: 'What happens after hours?',
    a: 'Your AI answers 24/7 — nights, weekends, and holidays. It books routine jobs into your calendar and, on Premium, escalates genuine emergencies to your on-call tech so you never miss the 2 a.m. burst-pipe call.',
  },
]

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="border-b border-[var(--border)]"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex justify-between items-center gap-6 text-left py-6 cursor-pointer group"
      >
        <span className="font-display text-[17px] font-bold text-content leading-[1.4] group-hover:text-accent transition-colors duration-200">
          {q}
        </span>
        <span
          className={`text-accent font-display text-[22px] flex-shrink-0 transition-transform duration-300 ${
            open ? 'rotate-45' : ''
          }`}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? '320px' : '0', opacity: open ? 1 : 0 }}
      >
        <p className="text-[15px] text-muted leading-[1.8] pb-7 max-w-[760px]">{a}</p>
      </div>
    </motion.div>
  )
}

export default function Faq() {
  return (
    <section id="faq" className="py-[100px] bg-surface-alt max-sm:py-[72px]">
      <div className="max-w-[860px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <div className="font-display text-[11px] tracking-[4px] uppercase text-accent mb-5">
            FAQ
          </div>
          <h2 className="font-display text-[clamp(24px,3.5vw,40px)] font-bold leading-[1.25]">
            The questions every owner asks
          </h2>
        </motion.div>

        <div>
          {faqs.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
