import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import TagChip from '@/components/blog/tag-chip'
import { SITE_URL } from '@/lib/site'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      url: `${SITE_URL}/blog/${slug}`,
      type: 'article',
      publishedTime: post.frontmatter.date,
      images: post.frontmatter.ogImage
        ? [{ url: post.frontmatter.ogImage }]
        : [{ url: '/assets/og-default.svg' }],
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post || post.frontmatter.draft) notFound()

  return (
    <div className="pt-28 pb-20 bg-surface">
      <div className="max-w-[720px] mx-auto px-6">
        {/* Back link */}
        <Link
          href="/blog"
          className="font-display text-[11px] tracking-[2px] uppercase text-dim no-underline hover:text-accent transition-colors duration-200 mb-12 block"
        >
          ← Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-12">
          {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.frontmatter.tags.map((tag) => (
                <TagChip key={tag} tag={tag} />
              ))}
            </div>
          )}

          <h1 className="font-display text-[clamp(24px,3.5vw,40px)] font-bold leading-[1.2] mb-4">
            {post.frontmatter.title}
          </h1>

          <div className="font-display text-[12px] tracking-[2px] text-dim">
            {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </header>

        {/* MDX content */}
        <article className="prose max-w-none">
          <MDXRemote
            source={post.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                ],
              },
            }}
          />
        </article>
      </div>
    </div>
  )
}
