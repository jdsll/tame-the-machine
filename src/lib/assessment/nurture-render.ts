import React from 'react'
import { render } from '@react-email/render'
import { unsubscribeUrl, type NurtureStage } from './nurture'
import { stage1Subject, stage2Subject, stage3SubjectHot, stage3SubjectCold } from './nurture-content'
import NurtureQuickWin from '@emails/NurtureQuickWin'
import NurtureProof from '@emails/NurtureProof'
import NurtureInvite from '@emails/NurtureInvite'

export const AUDIT_URL = 'https://calendly.com/jeff-tamethemachine/audit'
export const BLOG_URL = 'https://tamethemachine.com/blog'

export type RenderLead = {
  email: string
  firstName: string
  heat: string
  top3Gaps: string[]
}

export async function renderStage(
  stage: NurtureStage,
  lead: RenderLead,
): Promise<{ subject: string; html: string }> {
  const unsub = unsubscribeUrl(lead.email)
  if (stage === 1) {
    const topGap = lead.top3Gaps[0] ?? 'low_ai_confidence'
    return {
      subject: stage1Subject(topGap),
      html: await render(
        React.createElement(NurtureQuickWin, {
          firstName: lead.firstName,
          topGap,
          unsubscribeHref: unsub,
          auditUrl: AUDIT_URL,
        }),
      ),
    }
  }
  if (stage === 2) {
    return {
      subject: stage2Subject,
      html: await render(
        React.createElement(NurtureProof, { firstName: lead.firstName, unsubscribeHref: unsub }),
      ),
    }
  }
  const isWarm = lead.heat === 'HOT' || lead.heat === 'WARM'
  return {
    subject: isWarm ? stage3SubjectHot : stage3SubjectCold,
    html: await render(
      React.createElement(NurtureInvite, {
        firstName: lead.firstName,
        heat: lead.heat,
        unsubscribeHref: unsub,
        auditUrl: AUDIT_URL,
        blogUrl: BLOG_URL,
      }),
    ),
  }
}
