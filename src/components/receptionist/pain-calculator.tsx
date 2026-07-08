'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CALENDLY_URL } from '@/lib/receptionist'

const WEEKS_PER_MONTH = 4.33
const STARTER_PRICE = 199
// Conservative: the AI can't turn every missed call into a booked job, but even
// recovering a fraction more than covers the plan. Used only for the framing line.
const RECOVERY_RATE = 0.3

const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export default function PainCalculator() {
  const [missedPerWeek, setMissedPerWeek] = useState(8)
  const [jobValue, setJobValue] = useState(350)

  const monthlyLost = missedPerWeek * WEEKS_PER_MONTH * jobValue
  const recovered = monthlyLost * RECOVERY_RATE
  const net = recovered - STARTER_PRICE

  return (
    <section id="calculator" className="py-[100px] bg-surface max-sm:py-[72px]">
      <div className="max-w-[1080px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7 }}
          className="max-w-[720px]"
        >
          <div className="font-display text-[11px] tracking-[4px] uppercase text-accent mb-5">
            The Math
          </div>
          <h2 className="font-display text-[clamp(24px,3.5vw,40px)] font-bold leading-[1.25] mb-4">
            What are missed calls costing you?
          </h2>
          <p className="text-[17px] text-muted leading-[1.8]">
            Drag the sliders. This is revenue walking out the door every month while your
            crew is under a sink or on a roof.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="grid grid-cols-2 gap-8 mt-[52px] max-md:grid-cols-1"
        >
          {/* Inputs */}
          <div className="bg-card border border-[var(--border)] p-9 flex flex-col gap-10 justify-center">
            <div>
              <div className="flex justify-between items-baseline mb-4">
                <label htmlFor="missed" className="font-display text-[13px] tracking-[1px] uppercase text-muted">
                  Missed calls / week
                </label>
                <span className="font-display text-[26px] font-bold text-accent">{missedPerWeek}</span>
              </div>
              <input
                id="missed"
                type="range"
                min={1}
                max={40}
                step={1}
                value={missedPerWeek}
                onChange={(e) => setMissedPerWeek(Number(e.target.value))}
                className="w-full accent-accent cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-4">
                <label htmlFor="value" className="font-display text-[13px] tracking-[1px] uppercase text-muted">
                  Average job value
                </label>
                <span className="font-display text-[26px] font-bold text-accent">{money(jobValue)}</span>
              </div>
              <input
                id="value"
                type="range"
                min={100}
                max={2000}
                step={25}
                value={jobValue}
                onChange={(e) => setJobValue(Number(e.target.value))}
                className="w-full accent-accent cursor-pointer"
              />
            </div>
          </div>

          {/* Result */}
          <div className="bg-card border border-[rgba(74,240,192,0.2)] p-9 flex flex-col justify-center relative overflow-hidden">
            <div
              className="absolute pointer-events-none"
              style={{
                top: '-40%',
                right: '-20%',
                width: '360px',
                height: '360px',
                background: 'radial-gradient(circle, rgba(74,240,192,0.08) 0%, transparent 70%)',
              }}
            />
            <div className="relative z-10">
              <div className="font-display text-[12px] tracking-[2px] uppercase text-muted mb-3">
                Potential revenue missed / month
              </div>
              <div className="font-display text-[clamp(40px,7vw,64px)] font-bold text-accent leading-none mb-6">
                {money(monthlyLost)}
              </div>
              <div className="h-px bg-[var(--border)] my-6" />
              <p className="text-[15px] text-muted leading-[1.7]">
                Recover even <span className="text-content font-bold">1 in 3</span> of those
                calls and Front Desk AI brings back{' '}
                <span className="text-accent font-bold">{money(recovered)}/mo</span> — for a{' '}
                {money(STARTER_PRICE)}/mo plan.
              </p>
              {net > 0 && (
                <p className="mt-4 font-display text-[13px] tracking-[1px] text-content">
                  That&apos;s{' '}
                  <span className="text-accent font-bold">{money(net)}/mo</span> back in your
                  pocket, after the plan pays for itself.
                </p>
              )}
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-8 font-display text-[12px] font-bold tracking-[2px] uppercase text-surface bg-accent px-8 py-4 no-underline transition-all duration-300 hover:shadow-[0_0_40px_var(--accent-glow)] hover:-translate-y-[2px]"
              >
                Stop the bleeding — book a demo
              </a>
            </div>
          </div>
        </motion.div>

        <p className="mt-6 text-[12px] text-dim leading-[1.6] max-w-[720px]">
          Estimate only. Based on {WEEKS_PER_MONTH} weeks per month and a conservative 1-in-3
          recovery rate. Your numbers will vary with call volume and job mix.
        </p>
      </div>
    </section>
  )
}
