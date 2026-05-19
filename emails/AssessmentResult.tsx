import {
  Html, Head, Preview, Body, Container, Section, Heading, Text, Button, Hr,
} from '@react-email/components'
import { Tailwind } from '@react-email/components'
import type { AssessmentResult } from '@/lib/assessment/scoring-data'
import {
  segmentIntros,
  gapBlocks,
  gapShortLabels,
  ctaBlocks,
  highMaturityReframe,
} from '@/lib/assessment/content'

const SEGMENT_SLUGS: Record<string, string> = {
  'AI Explorer':       'ai_explorer',
  'Foundation Builder':'foundation_builder',
  'Workflow Builder':  'workflow_builder',
  'Automation Ready':  'automation_ready',
  'Systems Scaler':    'systems_scaler',
}

const TEAM_LABELS: Record<string, string> = {
  A: 'you',
  B: 'a 2-5 person team',
  C: 'a 6-10 person team',
  D: 'an 11-20 person team',
  E: 'a 20+ person team',
}

export type AssessmentResultEmailProps = {
  result: AssessmentResult
  firstName: string
  q8: string
}

export default function AssessmentResultEmail({ result, firstName, q8 }: AssessmentResultEmailProps) {
  const { segment, hours, revenueCallouts, tags, emailVariant, ctaVariant } = result
  const segSlug = SEGMENT_SLUGS[segment] ?? 'ai_explorer'
  const isSolo = q8 === 'A'
  const topGaps = tags.gaps.slice(0, 3)
  const cta = ctaBlocks[ctaVariant]
  const teamLabel = TEAM_LABELS[q8] ?? 'your team'
  const greeting = firstName ? `Hi ${firstName},` : 'Hi,'
  const previewText = isSolo
    ? `You're a ${segment} — ~${hours.perEmployee} hrs/week recoverable.`
    : `You're a ${segment} — ~${hours.teamTotal} hrs/week recoverable across ${teamLabel}.`

  return (
    <Html lang="en">
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans m-0 p-0">
          <Container className="mx-auto max-w-[600px] bg-white my-8">

            {/* Header band */}
            <Section style={{ backgroundColor: '#0a0a0f', padding: '24px 32px' }}>
              <Text style={{ color: '#9898a8', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', margin: 0 }}>
                Tame the Machine
              </Text>
              <Text style={{ color: '#4af0c0', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', margin: '6px 0 0' }}>
                AI Impact Assessment Results
              </Text>
            </Section>

            {/* Greeting + segment */}
            <Section style={{ padding: '32px 32px 0' }}>
              <Text style={{ color: '#444', fontSize: '15px', margin: '0 0 8px' }}>{greeting}</Text>
              <Heading style={{ color: '#111', fontSize: '26px', fontWeight: 700, margin: '0 0 6px', lineHeight: 1.3 }}>
                You&apos;re a{' '}
                <span style={{ color: '#0a9e7f' }}>{segment}</span>.
              </Heading>
              <Text style={{ color: '#777', fontSize: '14px', margin: 0 }}>
                Here&apos;s your AI impact breakdown — and where to start.
              </Text>
            </Section>

            <Hr style={{ borderColor: '#eee', margin: '24px 0' }} />

            {/* Hours metric */}
            <Section style={{ padding: '0 32px' }}>
              <Text style={{ color: '#999', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 12px' }}>
                Recoverable time
              </Text>
              <Section style={{ backgroundColor: '#f8f8f8', borderRadius: '8px', padding: '20px 24px' }}>
                {isSolo ? (
                  <Text style={{ color: '#222', fontSize: '16px', margin: 0, lineHeight: 1.7 }}>
                    We estimate{' '}
                    <strong style={{ color: '#0a9e7f', fontSize: '22px' }}>~{hours.perEmployee} hrs/week</strong>
                    {' '}of recoverable time for you.
                  </Text>
                ) : (
                  <Text style={{ color: '#222', fontSize: '16px', margin: 0, lineHeight: 1.7 }}>
                    We estimate{' '}
                    <strong style={{ color: '#0a9e7f', fontSize: '22px' }}>~{hours.perEmployee} hrs/week per employee</strong>
                    {' '}— about{' '}
                    <strong style={{ color: '#0a9e7f' }}>~{hours.teamTotal} hrs/week</strong>
                    {' '}across {teamLabel}.
                  </Text>
                )}
              </Section>
            </Section>

            {/* Revenue callouts */}
            {revenueCallouts.length > 0 && (
              <Section style={{ padding: '16px 32px 0' }}>
                <Section style={{ backgroundColor: 'rgba(74,240,192,0.08)', border: '1px solid rgba(74,240,192,0.3)', borderRadius: '8px', padding: '18px 24px' }}>
                  <Text style={{ color: '#222', fontSize: '15px', margin: 0, lineHeight: 1.7 }}>
                    Plus{' '}
                    <strong style={{ color: '#0a9e7f' }}>revenue capture opportunity</strong>
                    {' '}in {revenueCallouts.length} area{revenueCallouts.length > 1 ? 's' : ''}:{' '}
                    {revenueCallouts.map(tag => gapShortLabels[tag] ?? tag).join(' and ')}.
                  </Text>
                </Section>
              </Section>
            )}

            <Hr style={{ borderColor: '#eee', margin: '24px 0' }} />

            {/* Segment intro */}
            <Section style={{ padding: '0 32px' }}>
              <Text style={{ color: '#999', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 12px' }}>
                Your situation
              </Text>
              <Text style={{ color: '#555', fontSize: '14px', lineHeight: 1.8, margin: 0 }}>
                {segmentIntros[segSlug] ?? `[SEGMENT_INTRO: ${segSlug}]`}
              </Text>
            </Section>

            {/* High-maturity reframe */}
            {emailVariant === 'high_maturity' && (
              <Section style={{ padding: '16px 32px 0' }}>
                <Text style={{ color: '#555', fontSize: '14px', lineHeight: 1.8, fontStyle: 'italic', margin: 0 }}>
                  {highMaturityReframe}
                </Text>
              </Section>
            )}

            <Hr style={{ borderColor: '#eee', margin: '24px 0' }} />

            {/* Top gaps */}
            <Section style={{ padding: '0 32px' }}>
              <Text style={{ color: '#999', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 16px' }}>
                Where AI can help you first
              </Text>
              {topGaps.map(tag => {
                const block = gapBlocks[tag]
                const shortLabel = gapShortLabels[tag] ?? tag
                return (
                  <Section key={tag} style={{ backgroundColor: '#f8f8f8', borderRadius: '8px', padding: '18px 22px', marginBottom: '12px' }}>
                    <Text style={{ color: '#0a9e7f', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 6px' }}>
                      {shortLabel}
                    </Text>
                    <Text style={{ color: '#222', fontSize: '14px', fontWeight: 600, margin: '0 0 4px' }}>
                      {block?.title ?? `[GAP: ${tag}]`}
                    </Text>
                    <Text style={{ color: '#666', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>
                      {block?.body ?? ''}
                    </Text>
                  </Section>
                )
              })}
            </Section>

            <Hr style={{ borderColor: '#eee', margin: '24px 0' }} />

            {/* CTA */}
            <Section style={{ padding: '0 32px 8px', textAlign: 'center' }}>
              <Text style={{ color: '#999', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 12px' }}>
                Next step
              </Text>
              <Text style={{ color: '#111', fontSize: '16px', fontWeight: 700, margin: '0 0 8px' }}>
                {cta?.headline ?? '[CTA headline]'}
              </Text>
              <Text style={{ color: '#777', fontSize: '14px', lineHeight: 1.7, margin: '0 0 24px' }}>
                {cta?.body ?? '[CTA body]'}
              </Text>
              <Button
                href={cta?.url ?? '#'}
                style={{
                  backgroundColor: '#4af0c0',
                  color: '#0a0a0f',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  padding: '14px 32px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                {cta?.buttonText ?? 'Book Your Free Audit'}
              </Button>
            </Section>

            <Hr style={{ borderColor: '#eee', margin: '24px 0' }} />

            {/* Footer */}
            <Section style={{ padding: '0 32px 32px', textAlign: 'center' }}>
              <Text style={{ color: '#bbb', fontSize: '12px', lineHeight: 1.7, margin: 0 }}>
                Tame the Machine &mdash; tamethemachine.com
                <br />
                Reply to this email to opt out of future messages.
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
