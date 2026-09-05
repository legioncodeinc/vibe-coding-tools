# 07: Payload Admin Setup

Source PRD: `research/source-prds/prd-phase-07-payload-admin.md`

This guide replaces the retired `guides/07-admin-spa.md` (Vite SPA). Payload's built-in React admin panel is the content management interface. No separate Vite SPA is scaffolded.

For full Payload implementation details, invoke `website-worker-bee` (Payload is owned by website-stinger; no separate Payload Bee exists) (or read `website-stinger/SKILL.md`).

---

## Goal

Configure Payload's admin panel in `apps/cms`: define Collections and Globals, wire the Postgres adapter (Supabase), set CORS to allow the SvelteKit frontend, configure editor roles, and verify the admin is accessible at its Vercel URL.

---

## payload.config.ts: baseline

```ts
// apps/cms/src/payload.config.ts
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { fileURLToPath } from 'url';
import { Posts } from './collections/Posts';
import { Pages } from './collections/Pages';
import { Media } from './collections/Media';
import { Users } from './collections/Users';
import { SiteSettings } from './globals/SiteSettings';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Posts, Pages, Media, Users],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.PAYLOAD_DATABASE_URI || '',
    },
    // Payload uses the 'payload' schema to keep its tables separate from public business data
    schemaName: 'payload',
  }),
  // CORS: add the SvelteKit app's origin here
  cors: [
    process.env.PUBLIC_SITE_URL || 'http://localhost:5173',
    'http://localhost:5173',
  ],
  csrf: [
    process.env.PUBLIC_SITE_URL || 'http://localhost:5173',
  ],
  secret: process.env.PAYLOAD_SECRET || 'fallback-dev-secret-change-in-prod',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
});
```

---

## Core Collections

### Posts (blog)

```ts
// apps/cms/src/collections/Posts.ts
import type { CollectionConfig } from 'payload';

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title', group: 'Content' },
  access: {
    read: () => true,                                    // Public REST read
    create: ({ req }) => Boolean(req.user),              // Any logged-in editor
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === 'admin',
  },
  versions: { drafts: { autosave: true } },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { position: 'sidebar' } },
    { name: 'excerpt', type: 'textarea' },
    { name: 'content', type: 'richText' },              // Lexical editor
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'author', type: 'relationship', relationTo: 'users', admin: { position: 'sidebar' } },
    {
      name: 'status',
      type: 'select',
      options: [{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }],
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
    },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
    { name: 'meta', type: 'group', fields: [
      { name: 'description', type: 'textarea' },
      { name: 'image', type: 'upload', relationTo: 'media' },
    ]},
  ],
};
```

### Pages (Blocks-based)

```ts
// apps/cms/src/collections/Pages.ts
import type { CollectionConfig } from 'payload';
import { HeroBlock, TextBlock, CTABlock, TestimonialsBlock } from '../blocks';

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title', group: 'Content' },
  access: { read: () => true, create: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user) },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [HeroBlock, TextBlock, CTABlock, TestimonialsBlock],
    },
    { name: 'meta', type: 'group', fields: [
      { name: 'description', type: 'textarea' },
      { name: 'image', type: 'upload', relationTo: 'media' },
    ]},
  ],
};
```

### Media

```ts
// apps/cms/src/collections/Media.ts
import type { CollectionConfig } from 'payload';
import path from 'path';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: path.resolve('public/media'),           // Local dev; use cloud storage in prod
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, crop: 'center' },
      { name: 'card', width: 768, height: 432, crop: 'center' },
      { name: 'hero', width: 1440, height: 810 },
    ],
  },
  access: { read: () => true },
  fields: [
    { name: 'alt', type: 'text', required: true },
  ],
};
```

### Users

```ts
// apps/cms/src/collections/Users.ts
import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email', group: 'Admin' },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      options: [{ value: 'admin', label: 'Admin' }, { value: 'editor', label: 'Editor' }],
      defaultValue: 'editor',
      access: { update: ({ req }) => req.user?.role === 'admin' },
    },
  ],
};
```

---

## SiteSettings Global

```ts
// apps/cms/src/globals/SiteSettings.ts
import type { GlobalConfig } from 'payload';

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: { read: () => true, update: ({ req }) => req.user?.role === 'admin' },
  fields: [
    { name: 'siteName', type: 'text', required: true },
    { name: 'tagline', type: 'text' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'socialLinks', type: 'array', fields: [
      { name: 'platform', type: 'text' },
      { name: 'url', type: 'text' },
    ]},
  ],
};
```

---

## Generate types

After defining Collections, generate TypeScript types and share with `apps/web`:

```bash
cd apps/cms
pnpm payload generate:types
# Generates: src/payload-types.ts
# Copy or link to packages/payload-types/index.ts if using shared package
```

---

## CORS checklist

Before considering Phase 7 done, verify:

1. `apps/cms/payload.config.ts` `cors` array contains `PUBLIC_SITE_URL`.
2. `PUBLIC_SITE_URL` is set correctly in `apps/cms/.env.local`.
3. `apps/web` can `fetch('/api/posts')` from `+page.server.ts` without CORS errors.

---

## Phase acceptance criteria

| ID | Criterion |
|---|---|
| 7.1 | Payload admin accessible at `apps/cms` URL (port 3000 locally) |
| 7.2 | Posts, Pages, Media, Users collections visible in admin |
| 7.3 | CORS configured: SvelteKit origin returns 200 on `OPTIONS /api/posts` |
| 7.4 | `payload-types.ts` generated and importable from `apps/web` |
| 7.5 | Creating a draft post in Payload admin → GET `/api/posts?where[status][equals]=published` excludes it |
| 7.6 | SiteSettings Global readable via `/api/globals/site-settings` |
