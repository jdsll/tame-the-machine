import type { Metadata } from 'next'
import UnsubscribeConfirm from './confirm'

export const metadata: Metadata = {
  title: 'Unsubscribe',
  robots: { index: false, follow: false },
}

export default function UnsubscribePage() {
  return (
    <section className="min-h-[70vh] flex items-center bg-surface pt-20">
      <div className="max-w-[520px] mx-auto px-6 py-24 w-full">
        <UnsubscribeConfirm />
      </div>
    </section>
  )
}
