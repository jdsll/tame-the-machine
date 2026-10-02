import type { Metadata } from 'next'
import AssessmentForm from './assessment-form'

export const metadata: Metadata = {
  title: 'AI Impact Assessment',
  description:
    'Find out how much time AI could recover for your business — nine questions, about three minutes.',
}

export default function AIImpactAssessmentPage() {
  return (
    <>
      <div className="bg-surface-alt border-b border-[var(--border)] pt-32 pb-14">
        <div className="max-w-[640px] mx-auto px-6">
          <div className="font-display text-[11px] tracking-[4px] uppercase text-accent mb-5">
            Tame the Machine
          </div>
          <h1 className="font-display text-[clamp(26px,4vw,42px)] font-bold text-content leading-[1.2] tracking-[-0.5px] mb-4">
            AI Impact Assessment
          </h1>
          <p className="font-body text-muted text-[16px] leading-[1.7] max-w-[520px]">
            Nine questions. About three minutes. Walk away knowing exactly where AI can
            recover time — and revenue — for your business.
          </p>
        </div>
      </div>

      <AssessmentForm />
    </>
  )
}
