# Phase 9: Blog & Content Management

> **Site Template Guide**: PRD Phase 9 of 12

---

## Phase Overview

### Goals

Implement the blog. Default mode: **Payload Collections + Lexical** editor, consumed from SvelteKit via REST. Fallback mode: **TypeScript-as-CMS** (static data objects, no admin required).

### Scope

**Payload-default (in scope):**
- `src/routes/blog/+page.server.ts`: listing page (published posts from Payload REST)
- `src/routes/blog/[slug]/+page.server.ts`: post detail page
- `src/routes/blog/[slug]/+page.ts`: `entries()` for static prerendering
- Payload `posts` collection configured with Lexical editor, draft/publish, Media relation, author relation
- Lexical-to-HTML rendering strategy (see R-2 in risks)

**TypeScript-as-CMS fallback (in scope):**
- `src/lib/content/blog.ts`: typed post data file
- Same SvelteKit routes as Payload mode but reading from the data file

**Both modes (in scope):**
- Per-post `<svelte:head>` SEO metadata via `generateSEO()`
- Article schema.org JSON-LD injection
- Category navigation
- Author attribution (E-E-A-T requirement)

**Out of scope:**
- Paginated blog listing (all posts on one page at launch)
- Comments
- Newsletter subscription integration (separate integration)

### Dependencies

- Phase 3: `generateSEO()` and `buildArticleSchema()` available
- Phase 7 (Payload mode): `posts` collection defined in `apps/cms`

---

## User Stories

### Story 1: Content Editor (Payload mode): Publish a Post

> As a **Content Editor** using the Payload admin, I want to write a blog post with a rich text editor, save it as a draft, preview it, and publish it when ready, so that the post appears on the public site without a code deploy.

**Acceptance criteria:**
- Payload admin: create post → save draft → public `/blog/[slug]` returns 404 (draft excluded)
- Payload admin: publish post → public `/blog/[slug]` returns 200 (post visible)
- Next SvelteKit build (or ISR equivalent via revalidation) includes the new post slug in `entries()`
- Article schema.org JSON-LD present on the published post page

### Story 2: Visitor: Browse Blog Listing

> As a **Visitor**, I want to browse all published articles on `/blog` sorted newest-first so that I can find the most recent content.

**Acceptance criteria:**
- `/blog` renders all published posts sorted by `publishedAt` descending
- Each post card: featured image (with alt text), category, title, excerpt, author name, date, read time
- If `posts.length === 0`: empty state rendered
- Page has full SEO metadata via `generateSEO()`

### Story 3: Visitor: Read a Post with Full SEO

> As a **Visitor** following a link to a specific article, I want the page to load instantly with accurate title, description, and social sharing metadata.

**Acceptance criteria:**
- `/blog/[slug]` renders the correct post; invalid slug → 404 via `error(404, 'Not found')`
- `<svelte:head>` contains: title, description, canonical, OG `type: article`, `article:published_time`, `article:modified_time`, `article:author`
- Article schema.org JSON-LD injected
- Author byline with `<address>` semantic HTML element
- `<time datetime={post.publishedAt}>` for machine-readable date

### Story 4: Developer: Add a Post (TypeScript-as-CMS fallback)

> As a **Developer** using TypeScript-as-CMS mode, I want to add a new post by appending an object to `blogPosts` in `blog.ts` so that a new static page is generated at the next build.

**Acceptance criteria:**
- TypeScript compiler enforces all required fields via `BlogPost` interface
- `getAllPosts()` automatically sorts the new entry by `publishedAt`
- `entries()` in `+page.ts` automatically includes the new slug
- No routing config, CMS publish step, or database migration required

---

## Payload Mode: SvelteKit Routes

### Blog listing: +page.server.ts

```ts
import { PAYLOAD_API_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
  setHeaders({ 'Cache-Control': 'public, max-age=60, s-maxage=300' });

  const res = await fetch(
    `${PAYLOAD_API_URL}/api/posts?where[status][equals]=published&sort=-publishedAt&depth=1`
  );
  const { docs: posts } = await res.json();

  return {
    posts,
    seo: generateSEO({ title: 'Blog', description: '...', url: '/blog' }),
  };
};
```

### Post detail: +page.ts (prerendering)

```ts
export const entries: EntryGenerator = async () => {
  const res = await fetch(`${PAYLOAD_API_URL}/api/posts?where[status][equals]=published&fields=slug&limit=1000`);
  const { docs } = await res.json();
  return docs.map((p: { slug: string }) => ({ slug: p.slug }));
};

export const prerender = true;
```

### Author attribution (E-E-A-T requirement)

In Payload mode, the author is a relation to `users` collection. In TypeScript-as-CMS mode, author data is embedded in the `BlogPost` interface.

**No dependency on domain-specific staff data files.** The previous implementation referenced `apps/web/lib/content/trainers.ts` to resolve author profiles. This dependency has been removed. Authors are resolved from:
- Payload mode: `post.author` (Users collection relation): has `name`, `email`, profile URL
- TypeScript-as-CMS fallback: `BlogPost.authorName` + `BlogPost.authorSlug` (embedded)

### Image uploads

In Payload mode: images are uploaded to Payload's Media collection and referenced via the `heroImage` relation. The Payload Media collection stores images in the configured upload backend (local filesystem in dev, cloud storage in prod). No dependency on any specific Supabase Storage bucket name.

In TypeScript-as-CMS fallback mode: images upload to Supabase Storage `media` bucket via a simple admin upload route.

---

## TypeScript-as-CMS Fallback: BlogPost Interface

```ts
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;        // HTML string
  category: string;
  tags: string[];
  authorName: string;     // Display name
  authorSlug: string;     // For author page URL
  publishedAt: string;    // ISO 8601
  updatedAt: string;
  featuredImage: string;  // Absolute URL
  readTime: number;       // minutes
}
```

All fields are generic and industry-agnostic. No `sport`, `workout`, or domain-specific fields.

---

## Risks and Open Questions

- **R-1 (Payload mode):** Payload's Lexical editor produces a JSON object, not HTML. SvelteKit cannot render Lexical JSON natively. Resolution options:
  - (a) Payload `afterChange` hook calls `serializeLexicalToHtml()` and stores result in a `contentHtml` field
  - (b) Use `@payloadcms/richtext-lexical/html-converter` in a Payload REST endpoint
  - (c) Use community package `payload-lexical-svelte`
  - Option (a) is recommended as it keeps rendering server-side and is cacheable.
- **R-2:** Prerendering blog posts via `entries()` requires the Payload server to be accessible at build time. In Vercel multi-project deployments, `apps/web` build may run before `apps/cms` is deployed. Use incremental prerendering or a `+page.ts` that handles `fetch` errors gracefully.
- **Q-1:** Should blog posts be statically prerendered (as described) or server-rendered on every request? Prerendering is faster and better for SEO but requires a re-deploy to reflect new content. Server-rendering is always fresh but slower. Consider Vercel ISR (revalidation via `Cache-Control: s-maxage`) as a middle ground.
