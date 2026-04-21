import Link from 'next/link'
import { AUDIT_FORM_URL } from '@/lib/site'

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] py-5 bg-[rgba(10,10,15,0.85)] backdrop-blur-[20px] border-b border-[var(--border)]">
      <div className="max-w-[1080px] mx-auto px-6 flex justify-between items-center">
        <Link
          href="/"
          className="font-display text-[14px] font-bold tracking-[3px] lowercase text-content no-underline"
        >
          Tame<span className="text-accent">_</span>the
          <span className="text-accent">_</span>Machine
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/blog"
            className="font-display text-[11px] tracking-[2px] uppercase text-muted hover:text-accent transition-colors duration-300"
          >
            Blog
          </Link>
          <a
            href={AUDIT_FORM_URL}
            className="font-display text-[11px] tracking-[2px] uppercase text-surface bg-accent px-6 py-[10px] no-underline transition-all duration-300 hover:shadow-[0_0_30px_var(--accent-glow)] hover:-translate-y-px"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get Your Free Audit
          </a>
        </div>
      </div>
    </nav>
  )
}
