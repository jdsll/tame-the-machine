'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

type Status = 'idle' | 'working' | 'done' | 'error'

function ConfirmInner() {
  const params = useSearchParams()
  const email = params.get('e') ?? ''
  const token = params.get('t') ?? ''
  const [status, setStatus] = useState<Status>('idle')

  const valid = Boolean(email && token)

  const handleUnsubscribe = async () => {
    if (status === 'working') return
    setStatus('working')
    try {
      const res = await fetch(
        `/api/unsubscribe?e=${encodeURIComponent(email)}&t=${encodeURIComponent(token)}`,
        { method: 'POST' },
      )
      const data = (await res.json()) as { ok: boolean }
      setStatus(data.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (!valid) {
    return (
      <p className="font-body text-muted text-[15px] leading-[1.8]">
        This unsubscribe link is incomplete — try clicking it again from the email, or
        just reply to any email from us and we&apos;ll take care of it.
      </p>
    )
  }

  if (status === 'done') {
    return (
      <>
        <h1 className="font-display text-[24px] font-bold text-content mb-4">
          You&apos;re unsubscribed.
        </h1>
        <p className="font-body text-muted text-[15px] leading-[1.8]">
          {email} won&apos;t get any more emails from Tame the Machine. If this was a
          mistake, just take the assessment again whenever you like.
        </p>
      </>
    )
  }

  return (
    <>
      <h1 className="font-display text-[24px] font-bold text-content mb-4">
        Unsubscribe from Tame the Machine emails?
      </h1>
      <p className="font-body text-muted text-[15px] leading-[1.8] mb-8">
        This stops all future emails to <span className="text-content">{email}</span>,
        including assessment follow-ups.
      </p>
      <button
        type="button"
        onClick={handleUnsubscribe}
        disabled={status === 'working'}
        className="font-display text-[12px] font-bold tracking-[2px] uppercase text-surface bg-accent px-8 py-[14px] transition-all duration-300 hover:shadow-[0_0_30px_var(--accent-glow)] disabled:opacity-40"
      >
        {status === 'working' ? 'One moment...' : 'Unsubscribe me'}
      </button>
      {status === 'error' && (
        <p className="mt-4 font-body text-[13px] text-red-400">
          That didn&apos;t work — reply to any email from us instead and we&apos;ll remove you
          by hand.
        </p>
      )}
    </>
  )
}

export default function UnsubscribeConfirm() {
  return (
    <Suspense fallback={null}>
      <ConfirmInner />
    </Suspense>
  )
}
