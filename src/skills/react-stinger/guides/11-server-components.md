# 11: Server Components

Source: `research/2026-04-24-server-components-boundary.md`.

## The mental model

- **Every file in an RSC-capable framework is a Server Component by default.**
- `'use client'` marks a file as the **entry point to the client bundle**. Everything it imports also enters the client bundle (transitively, until it hits another `'use client'`; RSC can't be an ancestor of a client import).
- Client Components can have Server Components as **children** (passed as JSX), but cannot **import** them.

## The single biggest rule: push `'use client'` down

Bad:

```tsx
// app/posts/page.tsx
'use client';
export default function Page() {
  const [filter, setFilter] = useState('');
  return (
    <>
      <PostsHero />          {/* forced into client bundle */}
      <Filter v={filter} onChange={setFilter} />
      <PostsList filter={filter} />  {/* also client */}
    </>
  );
}
```

Good:

```tsx
// app/posts/page.tsx  — RSC
export default async function Page() {
  const posts = await getPosts();
  return (
    <>
      <PostsHero />           {/* RSC */}
      <PostsListClient posts={posts} />  {/* boundary at the leaf */}
    </>
  );
}

// app/posts/posts-list-client.tsx  — client
'use client';
export function PostsListClient({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState('');
  return ( /* filter UI + posts.filter(...) */ );
}
```

## Props must be serializable

Across the RSC → Client boundary, only serializable values pass:
- primitives, `null`, plain objects/arrays of these
- `Date` (serialized as string, you lose the type; convert explicitly)
- Server Actions (functions marked `'use server'`)
- JSX (as children)
- Promises (client reads via `use(promise)`)

**Never passable:** class instances, `Map`, `Set`, functions (unless server actions), DOM nodes.

## Pass Server Components as children

Canonical pattern for "client-interactive layout with server content":

```tsx
// app/layout.tsx — RSC
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ClientSidebar>
      {children}  {/* RSC tree renders on server */}
    </ClientSidebar>
  );
}

// client-sidebar.tsx
'use client';
export function ClientSidebar({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div>{open && <nav />}{children}</div>;
}
```

## Leaked server secrets

```ts
// src/lib/secrets.ts
export const API_SECRET = process.env.API_SECRET;
```

If this file is imported (even transitively) by a `'use client'` file, `API_SECRET` ships to the browser.

**Mitigation:**

```ts
// src/lib/secrets.ts
import 'server-only';
export const API_SECRET = process.env.API_SECRET;
```

`server-only` throws at build time if imported from a client module. Mirror: `client-only` for browser-API modules.

This is always a must-fix finding when caught.

## Server Actions: security baseline

Server Actions are **public HTTP endpoints**. Treat them exactly like a REST API route. Next.js 15 adds automatic Origin / Referer checks for form-initiated invocations, but does nothing else automatically.

Every action must:

1. **Authenticate.** Verify session / token. Early-return on missing.
2. **Authorize.** Does this user have permission for this resource?
3. **Validate input with Zod.** Cast without parse is a must-fix.
4. **Handle errors without leaking.** Return a typed error shape; never `throw` the raw DB error.

```ts
'use server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';

const Schema = z.object({ postId: z.string(), body: z.string().min(1).max(10_000) });

export async function createComment(formData: FormData) {
  const session = await getSession();
  if (!session) return { ok: false, error: 'unauthenticated' };

  const parsed = Schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: 'invalid', fields: parsed.error.flatten().fieldErrors };

  // authz
  const post = await db.posts.findById(parsed.data.postId);
  if (!post) return { ok: false, error: 'not-found' };
  if (post.private && post.authorId !== session.userId) return { ok: false, error: 'forbidden' };

  await db.comments.insert({ ...parsed.data, authorId: session.userId });
  return { ok: true };
}
```

**Hand off to `security-worker-bee`** when:
- Multi-factor auth or token refresh patterns are in scope.
- CSRF / CORS configuration needs review beyond Next.js defaults.
- Rate limiting / abuse mitigation.

## Caching (Next.js 15)

`fetch` in a Server Component is cached by default. Be explicit:

```ts
await fetch(url, { cache: 'force-cache' });          // SSG-like
await fetch(url, { cache: 'no-store' });             // every request
await fetch(url, { next: { revalidate: 60 } });      // ISR-like
await fetch(url, { next: { tags: ['posts'] } });     // invalidatable
```

See Next.js caching docs: rules change enough that version-pinning matters.

## Pages Router → App Router migration

Out of scope for a dedicated guide. Canonical source: https://nextjs.org/docs/app/guides/migrating/app-router-migration. If the user needs help, stage the migration route-by-route and write an ADR per route group.

## Common findings

> **[Must-fix]** `app/dashboard/page.tsx:1`: `'use client'` at the top of the page forces every descendant into the client bundle, including 3 RSC-eligible charts. Push `'use client'` to leaf interactive components. See `guides/11-server-components.md §push-use-client-down`.

> **[Must-fix]** `app/api/upload/actions.ts:5`: Server Action reads `formData` without Zod parse and without auth check. Add both. See `guides/11-server-components.md §server-actions-security-baseline`.

> **[Must-fix]** `src/lib/stripe.ts:1`: imports `process.env.STRIPE_SECRET`; imported by a `'use client'` component. Add `import 'server-only'` and restructure.

## Example in action

See `examples/adr-example-server-components-boundary.md` for a complete decision record.
