import Link from 'next/link'
import type { Post } from '@/lib/posts'
import TagChip from './tag-chip'

export default function PostCard({ post }: { post: Post }) {
  const { frontmatter, slug } = post
  return (
    <Link
      href={`/blog/${slug}`}
      className="block bg-card border border-[var(--border)] p-8 no-underline transition-all duration-300 hover:bg-card-hover hover:border-[rgba(74,240,192,0.15)] hover:-translate-y-1 group"
    >
      <div className="font-display text-[11px] tracking-[3px] uppercase text-dim mb-4">
        {new Date(frontmatter.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>

      <h2 className="font-display text-[20px] font-bold leading-[1.3] mb-4 text-content group-hover:text-accent transition-colors duration-300">
        {frontmatter.title}
      </h2>

      <p className="text-[15px] text-muted leading-[1.7] mb-6">{frontmatter.excerpt}</p>

      {frontmatter.tags && frontmatter.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {frontmatter.tags.map((tag) => (
            <TagChip key={tag} tag={tag} />
          ))}
        </div>
      )}
    </Link>
  )
}
