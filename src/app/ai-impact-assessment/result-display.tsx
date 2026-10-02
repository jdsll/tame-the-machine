import { GAP_TAG_META, type AssessmentResult, type HourGapTag } from '@/lib/assessment/scoring-data'
import {
  segmentIntros,
  gapBlocks,
  gapShortLabels,
  revenueCalloutCopy,
  ctaBlocks,
  highMaturityReframe,
  firstMoves,
  auditBridge,
  auditValueLine,
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

// "an AI Explorer" / "a Systems Scaler" / "Automation Ready" (adjective, no article)
const SEGMENT_ARTICLES: Record<string, string> = {
  'AI Explorer':        'an',
  'Foundation Builder': 'a',
  'Workflow Builder':   'a',
  'Automation Ready':   '',
  'Systems Scaler':     'a',
}

// Maturity ladder, least to most AI-ready
const SEGMENT_LADDER = [
  'AI Explorer',
  'Foundation Builder',
  'Workflow Builder',
  'Automation Ready',
  'Systems Scaler',
]

// --- Sub-components ---

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
  emailed?: boolean
}

// --- Component ---

export default function ResultDisplay({ result, firstName, q8, emailed = true }: Props) {
  const { segment, hours, revenueCallouts, tags, emailVariant, ctaVariant, normalizedScore } = result
  const stageIndex = SEGMENT_LADDER.indexOf(segment)
  const segSlug = SEGMENT_SLUGS[segment] ?? 'ai_explorer'
  const isSolo = q8 === 'A'
  const teamLabel = TEAM_LABELS[q8] ?? '?'
  // low_ai_confidence gets its own reassurance block; hour-gaps fill the top 3.
  const hasLowAiConfidence = tags.gaps.includes('low_ai_confidence')
  const topGaps = tags.gaps.filter(t => t !== 'low_ai_confidence').slice(0, 3)
  const lowConfidenceBlock = gapBlocks['low_ai_confidence']
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
            {firstName ? `${firstName}, you're` : "You're"}
            {SEGMENT_ARTICLES[segment] ? ` ${SEGMENT_ARTICLES[segment]}` : ''}{' '}
            <span className="text-accent">{segment}</span>.
          </h2>
          <p className="font-body text-muted text-[15px]">
            Here&apos;s what we found — and where to start.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[640px] mx-auto px-6 py-14 space-y-12">

        {/* Email delivery failed — surface it up front so results get saved */}
        {!emailed && (
          <div className="bg-card border border-[var(--border)] rounded-xl px-6 py-4">
            <p className="font-body text-muted text-[14px] leading-[1.7]">
              We couldn&apos;t email you a copy of these results — keep this page open or
              save it, and if you&apos;d like a copy, reach out at{' '}
              <a href="mailto:jeff@tamethemachine.com" className="text-accent underline">
                jeff@tamethemachine.com
              </a>.
            </p>
          </div>
        )}

        {/* Readiness score + maturity ladder */}
        <div>
          <SectionLabel>Your AI readiness score</SectionLabel>
          <div className="bg-card border border-[var(--border)] rounded-xl p-8">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-display font-bold text-accent text-[42px] leading-none">
                {normalizedScore}
              </span>
              <span className="font-display text-muted text-[16px]">/ 100</span>
            </div>
            <div className="h-[6px] bg-card-hover rounded-full overflow-hidden mb-8">
              <div
                className="h-full bg-accent rounded-full"
                style={{ width: `${normalizedScore}%` }}
              />
            </div>
            <div className="flex gap-1.5">
              {SEGMENT_LADDER.map((stage, i) => (
                <div key={stage} className="flex-1">
                  <div
                    className={[
                      'h-[4px] rounded-full mb-2',
                      i <= stageIndex ? 'bg-accent' : 'bg-card-hover',
                    ].join(' ')}
                  />
                  <p
                    className={[
                      'font-display text-[9px] tracking-[1px] uppercase leading-[1.4]',
                      i === stageIndex ? 'text-accent font-bold' : 'text-dim',
                    ].join(' ')}
                  >
                    {stage}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

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
          <div>
            <SectionLabel>Revenue capture</SectionLabel>
            <div className="bg-[var(--accent-dim)] border border-accent rounded-xl px-8 py-6 space-y-5">
              {revenueCallouts.map(tag => (
                <div key={tag}>
                  <p className="font-display text-[10px] tracking-[2px] uppercase text-accent mb-2">
                    {gapShortLabels[tag] ?? tag}
                  </p>
                  <p className="font-body text-content text-[15px] leading-[1.8]">
                    {revenueCalloutCopy[tag] ?? ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Segment intro */}
        <div>
          <SectionLabel>Your situation</SectionLabel>
          <p className="font-body text-muted text-[15px] leading-[1.8]">
            {segmentIntros[segSlug] ?? ''}
          </p>
        </div>

        {/* High-maturity reframe — conditional */}
        {emailVariant === 'high_maturity' && (
          <div className="bg-[var(--accent-dim)] border border-accent rounded-xl px-8 py-6 space-y-4">
            {highMaturityReframe.split('\n\n').map((para, i) => (
              <p key={i} className="font-body text-content text-[15px] leading-[1.8]">
                {para}
              </p>
            ))}
          </div>
        )}

        {/* Low AI confidence reassurance — always shown when Q1 = "Not at all" */}
        {hasLowAiConfidence && lowConfidenceBlock && (
          <div>
            <SectionLabel>First, about AI itself</SectionLabel>
            <div className="bg-[var(--accent-dim)] border border-accent rounded-xl px-8 py-6">
              <p className="font-display font-bold text-content text-[16px] mb-2">
                {lowConfidenceBlock.title}
              </p>
              <p className="font-body text-content text-[14px] leading-[1.8]">
                {lowConfidenceBlock.body}
              </p>
            </div>
          </div>
        )}

        {/* Your first three moves — top gaps as a prioritized plan */}
        <div>
          <SectionLabel>Your first three moves</SectionLabel>
          <div className="space-y-4">
            {topGaps.map((tag, i) => {
              const block = gapBlocks[tag]
              const move = firstMoves[tag]
              const shortLabel = gapShortLabels[tag] ?? tag
              const hrs = GAP_TAG_META[tag as HourGapTag]?.hrsPerWeek
              return (
                <div
                  key={tag}
                  className="bg-card border border-[var(--border)] rounded-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent text-surface font-display text-[13px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <p className="font-display text-[11px] tracking-[2px] uppercase text-accent">
                      {shortLabel}
                    </p>
                    <span className="ml-auto flex gap-2">
                      {hrs !== undefined && (
                        <span className="font-display text-[10px] tracking-[1px] uppercase text-content bg-card-hover border border-[var(--border)] rounded-full px-3 py-[4px]">
                          ~{hrs} hrs/wk
                        </span>
                      )}
                      {move && (
                        <span className="font-display text-[10px] tracking-[1px] uppercase text-muted border border-[var(--border)] rounded-full px-3 py-[4px]">
                          {move.effort}
                        </span>
                      )}
                    </span>
                  </div>
                  <p className="font-display font-bold text-content text-[16px] mb-2">
                    {move?.title ?? block?.title ?? shortLabel}
                  </p>
                  {block && (
                    <p className="font-body text-muted text-[14px] leading-[1.8]">
                      {block.body}
                    </p>
                  )}
                  {move && (
                    <p className="font-body text-content text-[14px] leading-[1.8] mt-3 border-t border-[var(--border)] pt-3">
                      <span className="font-display text-[11px] tracking-[2px] uppercase text-accent">
                        First step:
                      </span>{' '}
                      {move.firstStep}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Bridge to the audit */}
          <div className="mt-8 border-l-[3px] border-accent pl-6">
            <p className="font-body text-content text-[15px] leading-[1.8]">{auditBridge}</p>
            <p className="font-display text-[12px] tracking-[1px] uppercase text-accent mt-3">
              {auditValueLine}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-surface-alt border border-[var(--border)] rounded-xl p-8 text-center">
          <SectionLabel>Next step</SectionLabel>
          {cta ? (
            <>
              <h3 className="font-display font-bold text-content text-[20px] leading-[1.3] mb-3">
                {cta.headline}
              </h3>
              <p className="font-body text-muted text-[15px] leading-[1.8] mb-8">
                {cta.body}
              </p>
            </>
          ) : null}
          <a
            href={cta?.url ?? '#'}
            className="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-surface bg-accent px-10 py-[16px] no-underline transition-all duration-300 hover:shadow-[0_0_40px_var(--accent-glow)] hover:-translate-y-[2px]"
          >
            {cta?.buttonText ?? 'Book Your Free Audit'}
          </a>
        </div>

        {/* Email reassurance */}
        {emailed && (
          <div className="text-center pb-4">
            <p className="font-body text-muted text-[14px] leading-[1.7]">
              We just emailed you these results so you have them for reference.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
