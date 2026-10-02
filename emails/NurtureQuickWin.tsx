import NurtureShell, { P } from './NurtureShell'
import { gapLabel, stage1QuickWins } from '@/lib/assessment/nurture-content'

// Stage 1 (day 2): the concrete quick win for the lead's #1 gap.

export type NurtureQuickWinProps = {
  firstName: string
  topGap: string
  unsubscribeHref: string
  auditUrl: string
}

export default function NurtureQuickWin({ firstName, topGap, unsubscribeHref, auditUrl }: NurtureQuickWinProps) {
  const label = gapLabel(topGap)
  const quickWin = stage1QuickWins[topGap] ?? stage1QuickWins.low_ai_confidence
  return (
    <NurtureShell
      preview={`The first thing I’d do about ${label}.`}
      greeting={firstName ? `Hi ${firstName},` : 'Hi,'}
      cta={{ text: 'Book a free audit', href: auditUrl }}
      unsubscribeHref={unsubscribeHref}
    >
      <P>
        When you took the assessment, your biggest gap came out as{' '}
        <strong>{label}</strong>. Here&apos;s the first thing I&apos;d do about it. It&apos;s
        yours to use whether we ever talk or not.
      </P>
      <P>{quickWin}</P>
      <P>
        You can build this yourself in an afternoon. If you&apos;d rather have someone look
        at the whole picture first, that&apos;s what the free audit is for.
      </P>
    </NurtureShell>
  )
}
