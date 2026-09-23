# 09: Blog & Content Management

Source PRD: `research/source-prds/prd-phase-09-blog-content-management.md`

---

## Goal

Implement the blog using the CMS mode selected in Phase 1. Default is **Payload Collections** via REST. Fallback is **TypeScript-as-CMS** (static data objects, no Payload).

---

## CMS mode branch

| Mode | Data source | Admin | Image uploads |
|---|---|---|---|
| **Payload (default)** | Payload `posts` collection REST API | Payload admin at apps/cms URL | Payload Media collection |
| **TypeScript-as-CMS (fallback)** | `src/lib/content/blog.ts` static objects | Code editor | Supabase Storage `media` bucket |

---

## Mode A: Payload-default

For full Payload implementation details, read `website-stinger/guides/03-sveltekit-interop.md`.

### Blog listing page

```ts
// apps/web/src/routes/blog/+page.server.ts
import type { PageServerLoad } from './$types';
import { generateSEO } from '$lib/seo/generateSEO';
import { PAYLOAD_API_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ fetch }) => {
  const res = await fetch(
    `${PAYLOAD_API_URL}/api/posts?where[status][equals]=published&sort=-publishedAt&depth=1`
  );
  const { docs: posts } = await res.json();

  return {
    posts,
    seo: generateSEO({
      title: 'Blog',
      description: 'Articles, guides, and insights.',
      url: '/blog',
    }),
  };
};
```

### Blog post page

```ts
// apps/web/src/routes/blog/[slug]/+page.server.ts
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { generateSEO } from '$lib/seo/generateSEO';
import { PAYLOAD_API_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ params, fetch }) => {
  // Fetch by slug; include draft if ?preview=true + valid token
  const res = await fetch(
    `${PAYLOAD_API_URL}/api/posts?where[slug][equals]=${params.slug}&where[status][equals]=published&depth=2`
  );
  const { docs } = await res.json();
  const post = docs?.[0];
  if (!post) throw error(404, 'Post not found');

  return {
    post,
    seo: generateSEO({
      title: post.title,
      description: post.meta?.description ?? post.excerpt,
      url: `/blog/${post.slug}`,
      type: 'article',
      image: post.heroImage?.url ?? post.meta?.image?.url,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      author: post.author?.name,
    }),
  };
};
```

### Prerendering blog posts (SvelteKit)

```ts
// apps/web/src/routes/blog/[slug]/+page.ts
import type { EntryGenerator } from './$types';
import { PAYLOAD_API_URL } from '$env/static/private';

// Prerender all published posts at build time
export const entries: EntryGenerator = async () => {
  const res = await fetch(`${PAYLOAD_API_URL}/api/posts?where[status][equals]=published&fields=slug&limit=1000`);
  const { docs } = await res.json();
  return docs.map((post: { slug: string }) => ({ slug: post.slug }));
};

export const prerender = true;
```

### Lexical rich text rendering

Payload's Lexical editor produces a JSON structure. Use `@payloadcms/richtext-lexical/react` or convert to HTML:

```ts
// apps/web/src/lib/utils/lexicalToHtml.ts
// Option 1: use @payloadcms/richtext-lexical HTML serializer (server-side only)
// Option 2: use the community package 'payload-lexical-svelte'
// Option 3: store HTML in a separate field via Payload hooks

// Minimal approach: have Payload store rendered HTML alongside Lexical JSON
// Add to Posts collection:
// { name: 'contentHtml', type: 'textarea', admin: { readOnly: true } }
// + an afterChange hook that calls payload's serializeLexicalToHtml
```

> Lexical-to-HTML on the SvelteKit side is an open question (see website-stinger/guides/03-sveltekit-interop.md).

---

## Mode B: TypeScript-as-CMS fallback

Use only for sites that skip Payload. Blog posts are typed TypeScript objects prerendered at build time.

### Blog data file

```ts
// apps/web/src/lib/content/blog.ts
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;       // HTML string
  category: string;
  tags: string[];
  authorName: string;
  authorSlug: string;
  publishedAt: string;   // ISO 8601
  updatedAt: string;
  featuredImage: string; // Absolute URL
  readTime: number;      // minutes
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'getting-started',
    title: 'Getting Started',
    excerpt: 'A brief introduction to our platform.',
    content: '<p>Full article content here...</p>',
    category: 'guides',
    tags: ['intro', 'quickstart'],
    authorName: 'Jane Smith',
    authorSlug: 'jane-smith',
    publishedAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-01-20T10:00:00Z',
    featuredImage: 'https://PUBLIC_SITE_URL/images/blog/getting-started.jpg',
    readTime: 5,
  },
];

export const getAllPosts = () => [...blogPosts].sort((a, b) =>
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
);

export const getPostBySlug = (slug: string) => blogPosts.find((p) => p.slug === slug);
```

### Static blog routes (TypeScript-as-CMS)

```ts
// apps/web/src/routes/blog/[slug]/+page.ts
import type { EntryGenerator } from './$types';
import { getAllPosts } from '$lib/content/blog';

export const entries: EntryGenerator = () =>
  getAllPosts().map((post) => ({ slug: post.slug }));

export const prerender = true;
```

---

## Image uploads (TypeScript-as-CMS)

Use Supabase Storage `media` bucket for featured image uploads (admin-only route):

```ts
// apps/web/src/routes/admin/upload/+server.ts
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const fileName = `featured/${Date.now()}-${file.name}`;

  const { data, error } = await locals.supabase.storage
    .from('media')
    .upload(fileName, file, { contentType: file.type, upsert: false });

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });

  const { data: { publicUrl } } = locals.supabase.storage.from('media').getPublicUrl(fileName);

  return new Response(JSON.stringify({ url: publicUrl }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

---

## Phase acceptance criteria

| ID | Criterion (Payload mode) | ID | Criterion (TypeScript fallback) |
|---|---|---|---|
| 9P.1 | `/blog` lists published posts from Payload REST | 9T.1 | `/blog` lists all `blogPosts` sorted newest-first |
| 9P.2 | `/blog/[slug]` renders Payload post content | 9T.2 | `/blog/[slug]` renders static HTML content |
| 9P.3 | Draft posts not visible on public site | 9T.3 | Adding entry to `blogPosts` → new static route at next build |
| 9P.4 | Article schema injected in `<svelte:head>` | 9T.4 | Article schema injected in `<svelte:head>` |
| 9P.5 | Blog post pages prerendered at build time via `entries()` | 9T.5 | Blog post pages prerendered at build time via `entries()` |
| 9P.6 | `payload-types.ts` types used for post shape | 9T.6 | `BlogPost` TypeScript interface enforced |
