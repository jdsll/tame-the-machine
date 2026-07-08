'use client'

import { motion } from 'framer-motion'
import { CALENDLY_URL, STRIPE_LINK_STARTER } from '@/lib/receptionist'

const tiers = [
  {
    name: 'Starter',
    price: '$199',
    cadence: '/mo',
    setup: 'No setup fee',
    highlight: false,
    badge: null as string | null,
    features: [
      '150 answered minutes / month',
      '1 local phone number',
      'Daily call-summary email',
      'English call handling',
      '14-day money-back guarantee',
    ],
    // Self-serve tier: Stripe checkout if configured, otherwise waitlist.
    cta: 'self-serve' as const,
  },
  {
    name: 'Pro',
    price: '$397',
    cadence: '/mo',
    setup: '+ $497 setup',
    highlight: true,
    badge: 'Founding 10: $249 setup',
    features: [
      '300 answered minutes / month',
      'Missed-call text-back',
      'Books directly into your calendar',
      'Bilingual — English & Spanish',
      'Weekly ROI report',
    ],
    cta: 'demo' as const,
  },
  {
    name: 'Premium',
    price: '$597',
    cadence: '/mo',
    setup: '+ $497 setup',
    highlight: false,
    badge: null,
    features: [
      '600 answered minutes / month',
      '2 lines / locations',
      'After-hours emergency escalation to your on-call tech',
      'CRM integration',
      'Everything in Pro',
    ],
    cta: 'demo' as const,
  },
]

export default function Pricing() {
  const hasStripe = STRIPE_LINK_STARTER.length > 0

  return (
    <section id="pricing" className="py-[100px] bg-surface-alt max-sm:py-[72px]">
      <div className="max-w-[1080px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-[640px] mx-auto"
        >
          <div className="font-display text-[11px] tracking-[4px] uppercase text-accent mb-5">
            Pricing
          </div>
          <h2 className="font-display text-[clamp(24px,3.5vw,40px)] font-bold leading-[1.25] mb-4">
            Priced to pay for itself in a call or two
          </h2>
          <p className="text-[17px] text-muted leading-[1.8]">
            Month-to-month. Cancel anytime. No long-term contracts.
          </p>
        </motion.div>

        <div className="grid grid-cols-3 gap-6 mt-[60px] items-stretch max-md:grid-cols-1 max-md:max-w-[440px] max-md:mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.12 }}
              className={`relative flex flex-col p-9 transition-all duration-400 hover:-translate-y-1 ${
                tier.highlight
                  ? 'bg-card border-2 border-accent shadow-[0_0_40px_rgba(74,240,192,0.12)]'
                  : 'bg-card border border-[var(--border)] hover:border-[rgba(74,240,192,0.15)]'
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[10px] font-bold tracking-[1.5px] uppercase text-surface bg-accent px-4 py-[6px]">
                  {tier.badge}
                </div>
              )}

              <div className="font-display text-[13px] tracking-[3px] uppercase text-accent mb-4 mt-2">
                {tier.name}
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-display text-[44px] font-bold leading-none">{tier.price}</span>
                <span className="font-display text-[16px] text-muted">{tier.cadence}</span>
              </div>
              <div className="font-display text-[12px] tracking-[1px] text-dim mb-8">
                {tier.setup}
              </div>

              <ul className="flex flex-col gap-[14px] mb-9 flex-grow">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[15px] text-muted leading-[1.5]">
                    <span className="text-accent font-display text-[14px] flex-shrink-0 mt-[2px]">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {tier.cta === 'self-serve' && hasStripe ? (
                <a
                  href={STRIPE_LINK_STARTER}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center font-display text-[12px] font-bold tracking-[2px] uppercase text-surface bg-accent px-8 py-4 no-underline transition-all duration-300 hover:shadow-[0_0_30px_var(--accent-glow)] hover:-translate-y-px"
                >
                  Start now
                </a>
              ) : tier.cta === 'self-serve' ? (
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center font-display text-[12px] font-bold tracking-[2px] uppercase text-surface bg-accent px-8 py-4 no-underline transition-all duration-300 hover:shadow-[0_0_30px_var(--accent-glow)] hover:-translate-y-px"
                >
                  Join the waitlist
                </a>
              ) : (
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-center font-display text-[12px] font-bold tracking-[2px] uppercase px-8 py-4 no-underline transition-all duration-300 hover:-translate-y-px ${
                    tier.highlight
                      ? 'text-surface bg-accent hover:shadow-[0_0_30px_var(--accent-glow)]'
                      : 'text-accent border border-[rgba(74,240,192,0.3)] hover:bg-[var(--accent-dim)]'
                  }`}
                >
                  Book a demo
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
