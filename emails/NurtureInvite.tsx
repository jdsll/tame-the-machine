import NurtureShell, { P } from './NurtureShell'
import { stage3HotParagraphs, stage3ColdParagraphs } from '@/lib/assessment/nurture-content'

// Stage 3 (day 10): the invite. Direct for HOT/WARM, soft close for COLD.

export type NurtureInviteProps = {
  firstName: string
  heat: string
  unsubscribeHref: string
  auditUrl: string
  blogUrl: string
}

export default function NurtureInvite({ firstName, heat, unsubscribeHref, auditUrl, blogUrl }: NurtureInviteProps) {
  const isWarm = heat === 'HOT' || heat === 'WARM'
  const paragraphs = isWarm ? stage3HotParagraphs : stage3ColdParagraphs
  return (
    <NurtureShell
      preview={isWarm ? 'A free audit and a one-page report within 48 hours.' : 'The audit is there whenever you’re ready.'}
      greeting={firstName ? `Hi ${firstName},` : 'Hi,'}
      cta={
        isWarm
          ? { text: 'Book your free audit', href: auditUrl }
          : { text: 'Read the blog', href: blogUrl }
      }
      unsubscribeHref={unsubscribeHref}
    >
      {paragraphs.map((para, i) => (
        <P key={i}>{para}</P>
      ))}
    </NurtureShell>
  )
}
