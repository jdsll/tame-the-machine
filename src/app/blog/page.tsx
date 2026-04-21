import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/blog/post-card'
import { SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'The Machine Blog',
  description: `Practical AI automation insights for small service businesses. From ${SITE_NAME}.`,
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <>
      {/* Hero */}
      <div className="pt-32 pb-16 bg-surface-alt border-b border-[var(--border)]">
        <div className="max-w-[1080px] mx-auto px-6">
          <div className="font-display text-[11px] tracking-[4px] uppercase text-accent mb-4">
            The Machine Blog
          </div>
          <h1 className="font-display text-[clamp(28px,4vw,48px)] font-bold leading-[1.2] mb-4">
            Practical AI for busy owners
          </h1>
          <p className="text-[17px] text-muted max-w-[560px] leading-[1.8]">
            No hype. No buzzwords. Just what works — explained in plain language for small service
            businesses.
          </p>
        </div>
      </div>

      {/* Post grid */}
      <div className="py-16 bg-surface">
        <div className="max-w-[1080px] mx-auto px-6">
          {posts.length === 0 ? (
            <p className="text-muted">No posts yet — check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
