import Link from 'next/link'
import type { Post } from '@/lib/posts'
import TagChip from './tag-chip'

export default function PostCard({ post }: { post: Post }) {
  const { frontmatter, slug } = post
  return (
    <article className="relative bg-card border border-[var(--border)] p-8 transition-all duration-300 hover:bg-card-hover hover:border-[rgba(74,240,192,0.15)] hover:-translate-y-1 group">
      <div className="font-display text-[11px] tracking-[3px] uppercase text-[#606070] mb-4">
        {new Date(frontmatter.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>

      <h2 className="font-display text-[20px] font-bold leading-[1.3] mb-4 text-[#e8e8ed] group-hover:text-[#4af0c0] transition-colors duration-300">
        {frontmatter.title}
      </h2>

      <p className="text-[15px] text-[#9898a8] leading-[1.7] mb-6">{frontmatter.excerpt}</p>

      {/* Stretched link overlays date/title/excerpt — sits above them (z-1) so clicks anywhere on the card body open the post */}
      <Link
        href={`/blog/${slug}`}
        className="absolute inset-0 z-[1]"
        aria-label={frontmatter.title}
      />

      {/* Tags pop above the stretched link (z-2) so they receive their own clicks */}
      {frontmatter.tags && frontmatter.tags.length > 0 && (
        <div className="relative z-[2] flex flex-wrap gap-2">
          {frontmatter.tags.map((tag) => (
            <TagChip key={tag} tag={tag} />
          ))}
        </div>
      )}
    </article>
  )
}
