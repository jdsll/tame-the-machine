import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export interface PostFrontmatter {
  title: string
  slug?: string
  date: string
  tags?: string[]
  excerpt: string
  ogImage?: string
  draft?: boolean
}

export interface Post {
  frontmatter: PostFrontmatter
  content: string
  slug: string
}

export function getAllPosts({ includeDrafts = false } = {}): Post[] {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((fileName) => {
      const fileSlug = fileName.replace(/\.(mdx|md)$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      const frontmatter = data as PostFrontmatter
      return {
        frontmatter,
        content,
        slug: frontmatter.slug ?? fileSlug,
      }
    })
    .filter((post) => includeDrafts || !post.frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    )
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts({ includeDrafts: true }).find((p) => p.slug === slug)
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((p) => p.frontmatter.tags?.includes(tag))
}

export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tags = new Set<string>()
  posts.forEach((p) => p.frontmatter.tags?.forEach((t) => tags.add(t)))
  return Array.from(tags).sort()
}
