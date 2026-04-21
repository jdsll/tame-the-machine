import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-12 text-center">
      <div className="max-w-[1080px] mx-auto px-6">
        <Link
          href="/"
          className="font-display text-[14px] font-bold tracking-[3px] lowercase text-content no-underline block mb-4"
        >
          Tame<span className="text-accent">_</span>the
          <span className="text-accent">_</span>Machine
        </Link>
        <p className="text-[13px] text-dim">
          &copy; {new Date().getFullYear()} Tame the Machine AI Agency &middot; Healdsburg, CA &middot;{' '}
          <Link href="/blog" className="text-dim no-underline hover:text-accent transition-colors duration-200">
            Blog
          </Link>
        </p>
      </div>
    </footer>
  )
}
