import {
  Html, Head, Preview, Body, Container, Section, Heading, Text, Hr,
} from '@react-email/components'
import { Tailwind } from '@react-email/components'
import type { AssessmentAnswers, AssessmentResult } from '@/lib/assessment/scoring-data'

export type HotLeadAlertProps = {
  result: AssessmentResult
  firstName: string
  email: string
  answers: AssessmentAnswers
}

export default function HotLeadAlert({ result, firstName, email, answers }: HotLeadAlertProps) {
  const top3Gaps = result.tags.gaps.slice(0, 3)
  const q6TopOutcome = answers.q6.length > 0 ? answers.q6[0].id : '—'

  return (
    <Html lang="en">
      <Head />
      <Preview>HOT lead: {firstName || email} / {result.segment} / {result.leadValueTier}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans m-0 p-0">
          <Container className="mx-auto max-w-[600px] bg-white my-8">

            {/* Header */}
            <Section style={{ backgroundColor: '#0a0a0f', padding: '20px 32px' }}>
              <Text style={{ color: '#4af0c0', fontSize: '13px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', margin: 0 }}>
                🔥 HOT Lead Alert
              </Text>
              <Text style={{ color: '#9898a8', fontSize: '11px', margin: '4px 0 0' }}>
                AI Impact Assessment — Tame the Machine
              </Text>
            </Section>

            {/* Contact info */}
            <Section style={{ padding: '28px 32px 0' }}>
              <Heading style={{ color: '#111', fontSize: '20px', fontWeight: 700, margin: '0 0 16px' }}>
                {firstName ? `${firstName}` : 'New submission'} — reply immediately
              </Heading>
              <Row label="Email" value={email} />
              <Row label="First Name" value={firstName || '(not provided)'} />
            </Section>

            <Hr style={{ borderColor: '#eee', margin: '20px 0' }} />

            {/* Lead scoring */}
            <Section style={{ padding: '0 32px' }}>
              <Text style={{ color: '#999', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 14px' }}>
                Lead profile
              </Text>
              <Row label="Segment" value={result.segment} />
              <Row label="Heat" value={result.heat} highlight />
              <Row label="Lead Value Tier" value={result.leadValueTier} />
              <Row label="Email Variant" value={result.emailVariant} />
              <Row label="CTA Variant" value={`${result.ctaVariant} (Q6 top: ${q6TopOutcome})`} />
            </Section>

            <Hr style={{ borderColor: '#eee', margin: '20px 0' }} />

            {/* Hours & gaps */}
            <Section style={{ padding: '0 32px' }}>
              <Text style={{ color: '#999', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 14px' }}>
                Assessment details
              </Text>
              <Row label="Per-Employee Hrs" value={`~${result.hours.perEmployee} hrs/week`} />
              <Row label="Team Total Hrs" value={`~${result.hours.teamTotal} hrs/week`} />
              <Row label="Top Gaps" value={top3Gaps.join(', ') || '—'} />
              <Row label="Revenue Callouts" value={result.revenueCallouts.join(', ') || '—'} />
            </Section>

            <Hr style={{ borderColor: '#eee', margin: '20px 0' }} />

            {/* Raw answers */}
            <Section style={{ padding: '0 32px 32px' }}>
              <Text style={{ color: '#999', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 10px' }}>
                Raw answers
              </Text>
              <Section style={{ backgroundColor: '#f4f4f4', borderRadius: '6px', padding: '14px 18px' }}>
                <Text style={{ fontFamily: 'monospace', fontSize: '12px', color: '#444', margin: 0, whiteSpace: 'pre', lineHeight: 1.6 }}>
                  {JSON.stringify(answers, null, 2)}
                </Text>
              </Section>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <Text style={{ fontSize: '14px', margin: '0 0 8px', color: '#333' }}>
      <span style={{ color: '#888', display: 'inline-block', minWidth: '160px' }}>{label}:</span>
      {' '}
      <strong style={highlight ? { color: '#e53e3e' } : {}}>{value}</strong>
    </Text>
  )
}
