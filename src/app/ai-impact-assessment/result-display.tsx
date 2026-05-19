import type { AssessmentResult } from '@/lib/assessment/scoring-data'
import {
  segmentIntros,
  gapBlocks,
  gapShortLabels,
  ctaBlocks,
  highMaturityReframe,
} from '@/lib/assessment/content'

// --- Constants ---

const SEGMENT_SLUGS: Record<string, string> = {
  'AI Explorer':      'ai_explorer',
  'Foundation Builder':'foundation_builder',
  'Workflow Builder': 'workflow_builder',
  'Automation Ready': 'automation_ready',
  'Systems Scaler':   'systems_scaler',
}

const TEAM_LABELS: Record<string, string> = {
  A: 'you',
  B: '2-5',
  C: '6-10',
  D: '11-20',
  E: '20+',
}

// --- Sub-components ---

function PlaceholderSlot({ text }: { text: string }) {
  return (
    <div className="border border-dashed border-[var(--border)] bg-surface-alt rounded-lg px-5 py-4">
      <p className="font-display text-[10px] tracking-[2px] uppercase text-dim mb-2">
        Content slot
      </p>
      <p className="font-body text-dim text-[13px] leading-[1.6] italic">{text}</p>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-display text-[11px] tracking-[3px] uppercase text-muted mb-4">
      {children}
    </div>
  )
}

// --- Props ---

type Props = {
  result: AssessmentResult
  firstName: string
  q8: string
}

// --- Component ---

export default function ResultDisplay({ result, firstName, q8 }: Props) {
  const { segment, hours, revenueCallouts, tags, emailVariant, ctaVariant } = result
  const segSlug = SEGMENT_SLUGS[segment] ?? 'ai_explorer'
  const isSolo = q8 === 'A'
  const teamLabel = TEAM_LABELS[q8] ?? '?'
  const topGaps = tags.gaps.slice(0, 3)
  const cta = ctaBlocks[ctaVariant]

  return (
    <div className="bg-surface">

      {/* Result hero strip */}
      <div className="bg-surface-alt border-b border-[var(--border)] py-14">
        <div className="max-w-[640px] mx-auto px-6">
          <div className="font-display text-[11px] tracking-[4px] uppercase text-accent mb-5">
            Your AI profile
          </div>
          <h2 className="font-display text-[clamp(24px,3.5vw,40px)] font-bold text-content leading-[1.2] mb-3">
            {firstName ? `${firstName}, you're` : "You're"} a{' '}
            <span className="text-accent">{segment}</span>.
          </h2>
          <p className="font-body text-muted text-[15px]">
            Here's what we found — and where to start.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[640px] mx-auto px-6 py-14 space-y-12">

        {/* Hours metric */}
        <div>
          <SectionLabel>Recoverable time</SectionLabel>
          <div className="bg-card border border-[var(--border)] rounded-xl p-8">
            {isSolo ? (
              <p className="font-body text-content text-[17px] leading-[1.8]">
                We estimate{' '}
                <span className="font-display font-bold text-accent text-[22px]">
                  ~{hours.perEmployee} hrs/week
                </span>{' '}
                of recoverable time for you.
              </p>
            ) : (
              <p className="font-body text-content text-[17px] leading-[1.8]">
                We estimate{' '}
                <span className="font-display font-bold text-accent text-[22px]">
                  ~{hours.perEmployee} hrs/week per employee
                </span>
                {' '}— about{' '}
                <span className="font-display font-bold text-accent">
                  ~{hours.teamTotal} hrs/week
                </span>{' '}
                across your team of {teamLabel}.
              </p>
            )}
          </div>
        </div>

        {/* Revenue callout block — conditional */}
        {revenueCallouts.length > 0 && (
          <div className="bg-[var(--accent-dim)] border border-accent rounded-xl px-8 py-6">
            <p className="font-body text-content text-[16px] leading-[1.8]">
              Plus{' '}
              <span className="font-display font-bold text-accent">
                revenue capture opportunity
              </span>{' '}
              in {revenueCallouts.length} area
              {revenueCallouts.length > 1 ? 's' : ''}:{' '}
              {revenueCallouts
                .map(tag => gapShortLabels[tag] ?? tag)
                .join(' and ')}
              .
            </p>
          </div>
        )}

        {/* Segment intro */}
        <div>
          <SectionLabel>Your situation</SectionLabel>
          <PlaceholderSlot text={segmentIntros[segSlug] ?? `[SEGMENT_INTRO: ${segSlug}]`} />
        </div>

        {/* High-maturity reframe — conditional */}
        {emailVariant === 'high_maturity' && (
          <div>
            <PlaceholderSlot text={highMaturityReframe} />
          </div>
        )}

        {/* Top gaps */}
        <div>
          <SectionLabel>Here's where AI can help you first</SectionLabel>
          <div className="space-y-4">
            {topGaps.map(tag => {
              const block = gapBlocks[tag]
              const shortLabel = gapShortLabels[tag] ?? tag
              return (
                <div
                  key={tag}
                  className="bg-card border border-[var(--border)] rounded-xl p-6"
                >
                  <p className="font-display text-[11px] tracking-[2px] uppercase text-accent mb-3">
                    {shortLabel}
                  </p>
                  <PlaceholderSlot
                    text={
                      block
                        ? `${block.title} — ${block.body}`
                        : `[GAP_BLOCK: ${tag}]`
                    }
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-surface-alt border border-[var(--border)] rounded-xl p-8 text-center">
          <SectionLabel>Next step</SectionLabel>
          <PlaceholderSlot
            text={
              cta
                ? `${cta.headline} — ${cta.body}`
                : `[CTA: ${ctaVariant}]`
            }
          />
          <div className="mt-8">
            <a
              href={cta?.url ?? '#'}
              className="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-surface bg-accent px-10 py-[16px] no-underline transition-all duration-300 hover:shadow-[0_0_40px_var(--accent-glow)] hover:-translate-y-[2px]"
            >
              {cta?.buttonText ?? 'Book Your Free Audit'}
            </a>
          </div>
        </div>

        {/* Email reassurance */}
        <div className="text-center pb-4">
          <p className="font-body text-muted text-[14px] leading-[1.7]">
            We just emailed you these results so you have them for reference.
          </p>
        </div>

      </div>
    </div>
  )
}
