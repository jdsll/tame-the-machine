import Link from 'next/link'

export default function TagChip({ tag }: { tag: string }) {
  return (
    <Link
      href={`/blog/tags/${tag}`}
      className="font-display text-[10px] tracking-[2px] uppercase text-accent border border-[rgba(74,240,192,0.25)] px-3 py-1 no-underline transition-all duration-200 hover:bg-[var(--accent-dim)]"
    >
      {tag}
    </Link>
  )
}
