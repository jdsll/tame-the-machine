import NurtureShell, { P } from './NurtureShell'
import { stage2Paragraphs } from '@/lib/assessment/nurture-content'

// Stage 2 (day 6): own-work proof — Jeff automated his own businesses first.

export type NurtureProofProps = {
  firstName: string
  unsubscribeHref: string
}

export default function NurtureProof({ firstName, unsubscribeHref }: NurtureProofProps) {
  return (
    <NurtureShell
      preview="How I started by automating my own businesses."
      greeting={firstName ? `Hi ${firstName},` : 'Hi,'}
      unsubscribeHref={unsubscribeHref}
    >
      {stage2Paragraphs.map((para, i) => (
        <P key={i}>{para}</P>
      ))}
    </NurtureShell>
  )
}
