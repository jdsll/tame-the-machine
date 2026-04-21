import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllTags, getPostsByTag } from '@/lib/posts'
import PostCard from '@/components/blog/post-card'

interface Props {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  const tags = getAllTags()
  return tags.map((tag) => ({ tag }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params
  return {
    title: `Posts tagged "${tag}"`,
    description: `All blog posts tagged with ${tag} on Tame the Machine.`,
  }
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params
  const posts = getPostsByTag(tag)

  if (posts.length === 0) notFound()

  return (
    <>
      <div className="pt-32 pb-16 bg-surface-alt border-b border-[var(--border)]">
        <div className="max-w-[1080px] mx-auto px-6">
          <Link
            href="/blog"
            className="font-display text-[11px] tracking-[2px] uppercase text-dim no-underline hover:text-accent transition-colors duration-200 mb-6 block"
          >
            ← All Posts
          </Link>
          <div className="font-display text-[11px] tracking-[4px] uppercase text-accent mb-4">
            Tag
          </div>
          <h1 className="font-display text-[clamp(24px,3.5vw,40px)] font-bold leading-[1.2]">
            {tag}
          </h1>
          <p className="text-muted mt-3">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="py-16 bg-surface">
        <div className="max-w-[1080px] mx-auto px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
