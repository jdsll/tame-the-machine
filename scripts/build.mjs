import { readFileSync, writeFileSync, mkdirSync, readdirSync, cpSync, rmSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, basename } from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dir = dirname(__filename);
const ROOT = join(__dir, '..');
const DIST = join(ROOT, 'dist');
const POSTS_DIR = join(ROOT, 'content', 'posts');
const TEMPLATES_DIR = join(ROOT, 'templates');
const ASSETS_DIR = join(ROOT, 'assets');
const SITE_URL = 'https://tamethemachine.com';

function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escXml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function slugify(filename) {
  return basename(filename, '.md')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractFirstParagraph(html) {
  const match = html.match(/<p>([\s\S]*?)<\/p>/);
  if (!match) return '';
  return match[1].replace(/<[^>]+>/g, '').trim().slice(0, 220);
}

function renderTags(tags) {
  if (!tags || tags.length === 0) return '';
  const safeTag = (t) => t.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const chips = tags
    .map(tag => `<a href="/blog/tags/${safeTag(tag)}" class="post-tag">${escHtml(tag)}</a>`)
    .join('');
  return `<div class="post-tags">${chips}</div>`;
}

function renderPostCard(post) {
  return `
<article class="post-card">
  <div class="post-card-meta">${renderTags(post.tags)}</div>
  <h2 class="post-card-title"><a href="/blog/${post.slug}">${escHtml(post.title)}</a></h2>
  <p class="post-card-excerpt">${escHtml(post.excerpt)}</p>
  <a href="/blog/${post.slug}" class="post-card-link">Read more &rarr;</a>
</article>`;
}

function loadPosts() {
  if (!existsSync(POSTS_DIR)) return [];

  const files = readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  const posts = [];
  const slugsSeen = new Set();

  for (const file of files) {
    const raw = readFileSync(join(POSTS_DIR, file), 'utf8');
    const { data, content } = matter(raw);

    if (data.draft === true) continue;

    const missing = ['title', 'date'].filter(f => !data[f]);
    if (missing.length) {
      console.error(`\nError: "${file}" is missing required frontmatter: ${missing.join(', ')}`);
      process.exit(1);
    }

    const slug = data.slug || slugify(file);
    if (slugsSeen.has(slug)) {
      console.error(`\nError: Duplicate slug "${slug}" found in "${file}". Set a unique slug in frontmatter.`);
      process.exit(1);
    }
    slugsSeen.add(slug);

    const renderedContent = marked.parse(content);
    let excerpt = data.excerpt;
    if (!excerpt) {
      excerpt = extractFirstParagraph(renderedContent);
      console.warn(`Warning: "${file}" has no excerpt; using first paragraph text.`);
    }

    posts.push({
      title: String(data.title),
      slug,
      date: new Date(String(data.date)),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      excerpt: String(excerpt),
      ogImage: data.ogImage ? String(data.ogImage) : '/assets/og-default.svg',
      content: renderedContent,
    });
  }

  posts.sort((a, b) => b.date - a.date);
  return posts;
}

function buildPosts(posts, postTemplate) {
  mkdirSync(join(DIST, 'blog'), { recursive: true });
  for (const post of posts) {
    const canonical = `${SITE_URL}/blog/${post.slug}`;
    const html = postTemplate
      .replace(/<!--TITLE-->/g, escHtml(post.title))
      .replace(/<!--EXCERPT-->/g, escHtml(post.excerpt))
      .replace(/<!--OG_IMAGE-->/g, escHtml(post.ogImage))
      .replace(/<!--CANONICAL-->/g, escHtml(canonical))
      .replace(/<!--TAGS-->/g, renderTags(post.tags))
      .replace('<!--CONTENT-->', post.content);
    writeFileSync(join(DIST, 'blog', `${post.slug}.html`), html, 'utf8');
    console.log(`  Built: /blog/${post.slug}`);
  }
}

function buildBlogIndex(posts, indexTemplate) {
  const postsList = posts.length === 0
    ? '<p class="no-posts">No posts yet &mdash; check back soon.</p>'
    : posts.map(renderPostCard).join('\n');
  const html = indexTemplate.replace('<!--POSTS_LIST-->', postsList);
  writeFileSync(join(DIST, 'blog', 'index.html'), html, 'utf8');
  console.log('  Built: /blog/');
}

function buildTagPages(posts, tagTemplate) {
  if (posts.length === 0) return;
  const tagMap = new Map();
  for (const post of posts) {
    for (const tag of post.tags) {
      if (!tagMap.has(tag)) tagMap.set(tag, []);
      tagMap.get(tag).push(post);
    }
  }
  mkdirSync(join(DIST, 'blog', 'tags'), { recursive: true });
  for (const [tag, tagPosts] of tagMap) {
    const postsList = tagPosts.map(renderPostCard).join('\n');
    const html = tagTemplate
      .replace(/<!--TAG_NAME-->/g, escHtml(tag))
      .replace('<!--POSTS_LIST-->', postsList);
    const safeTag = tag.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    writeFileSync(join(DIST, 'blog', 'tags', `${safeTag}.html`), html, 'utf8');
    console.log(`  Built: /blog/tags/${safeTag}`);
  }
}

function buildRSS(posts) {
  const items = posts.map(post => `
  <item>
    <title>${escXml(post.title)}</title>
    <link>${SITE_URL}/blog/${post.slug}</link>
    <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
    <description>${escXml(post.excerpt)}</description>
    <pubDate>${post.date.toUTCString()}</pubDate>
  </item>`).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Tame the Machine &mdash; Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>AI automation insights for small service businesses</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  writeFileSync(join(DIST, 'blog', 'rss.xml'), rss, 'utf8');
  console.log('  Built: /blog/rss.xml');
}

function buildSitemap(posts) {
  const tagSet = new Set(posts.flatMap(p => p.tags));

  const postUrls = posts.map(p =>
    `  <url><loc>${SITE_URL}/blog/${p.slug}</loc><lastmod>${p.date.toISOString().slice(0, 10)}</lastmod></url>`
  ).join('\n');

  const tagUrls = [...tagSet].map(tag => {
    const safeTag = tag.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    return `  <url><loc>${SITE_URL}/blog/tags/${safeTag}</loc></url>`;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}/</loc></url>
  <url><loc>${SITE_URL}/blog</loc></url>
${postUrls}
${tagUrls}
</urlset>`;

  writeFileSync(join(DIST, 'sitemap.xml'), sitemap, 'utf8');
  console.log('  Built: /sitemap.xml');
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

console.log('Building tamethemachine.com...\n');

if (existsSync(DIST)) rmSync(DIST, { recursive: true });
mkdirSync(DIST, { recursive: true });

cpSync(join(ROOT, 'index.html'), join(DIST, 'index.html'));
if (existsSync(ASSETS_DIR)) {
  cpSync(ASSETS_DIR, join(DIST, 'assets'), { recursive: true });
}

const postTemplate    = readFileSync(join(TEMPLATES_DIR, 'post.html'), 'utf8');
const blogIndexTmpl   = readFileSync(join(TEMPLATES_DIR, 'blog-index.html'), 'utf8');
const tagTmpl         = readFileSync(join(TEMPLATES_DIR, 'tag-index.html'), 'utf8');

const posts = loadPosts();
console.log(`Found ${posts.length} published post(s).\n`);

buildPosts(posts, postTemplate);
buildBlogIndex(posts, blogIndexTmpl);
buildTagPages(posts, tagTmpl);
buildRSS(posts);
buildSitemap(posts);

console.log('\nBuild complete.');
