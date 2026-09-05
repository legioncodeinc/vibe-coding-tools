# 02: SvelteKit Performance & Security

Source PRD: `research/source-prds/prd-phase-02-sveltekit-performance-security.md`

---

## Goal

Lock in SvelteKit image optimization, self-hosted fonts, security headers (via `hooks.server.ts`), caching strategy, and code splitting. This phase applies to `apps/web` only.

---

## svelte.config.js: adapter and prerender

```js
// apps/web/svelte.config.js
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ runtime: 'nodejs22.x' }),
    prerender: {
      handleMissingId: 'warn',
      // Prerender static marketing pages; blog pages are prerendered via entries()
      entries: ['/', '/about', '/contact', '/blog', '/sitemap.xml', '/robots.txt'],
    },
  },
};

export default config;
```

---

## vite.config.ts: enhanced images + Tailwind

```ts
// apps/web/vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    enhancedImages(),
    sveltekit(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'supabase-vendor': ['@supabase/supabase-js', '@supabase/ssr'],
        },
      },
    },
  },
});
```

---

## Image optimization: @sveltejs/enhanced-img

**Local static assets** use `<enhanced:img>` (generates AVIF/WebP at build time):

```svelte
<script lang="ts">
  import heroImg from '$lib/assets/hero.jpg?enhanced';
</script>

<enhanced:img
  src={heroImg}
  alt="Hero"
  sizes="(min-width: 1280px) 1200px, 100vw"
  fetchpriority="high"
  loading="eager"
/>
```

**Remote images** (from Payload Media, Supabase Storage) use plain `<img>` with explicit `width`/`height`:

```svelte
<img
  src={post.heroImage.url}
  alt={post.heroImage.alt ?? post.title}
  width={post.heroImage.width}
  height={post.heroImage.height}
  sizes="(min-width: 1024px) 800px, 100vw"
  loading="lazy"
  decoding="async"
/>
```

Never use `next/image`. Never use `<img>` without `width`/`height` for remote images: it causes CLS.

---

## Self-hosted fonts: fontsource

Avoid Google Fonts DNS round-trips. Use fontsource instead:

```bash
cd apps/web
pnpm add @fontsource-variable/inter
# Add a second display font if brand requires:
# pnpm add @fontsource/playfair-display
```

Import in `+layout.svelte` or `app.css`:

```css
/* apps/web/src/app.css */
@import '@fontsource-variable/inter';
```

Declare CSS variable in design tokens:

```css
:root {
  --font-sans: 'Inter Variable', system-ui, sans-serif;
}
```

---

## Security headers: hooks.server.ts

SvelteKit's `hooks.server.ts` is the equivalent of Next.js's `next.config.js > headers()`. Apply all security headers here:

```ts
// apps/web/src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

const securityHeaders = {
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-DNS-Prefetch-Control': 'on',
  // CSP: route through security-worker-bee before tightening
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self'",
    "connect-src 'self' https:",
    "frame-src 'none'",
  ].join('; '),
};

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  return response;
};
```

> Route any CSP tightening through `security-worker-bee` before merge.

---

## Caching strategy

SvelteKit on Vercel uses the `Cache-Control` header returned from `+server.ts` or `+page.server.ts` `load` functions:

```ts
// In a +page.server.ts load function:
export const load: PageServerLoad = async ({ setHeaders }) => {
  setHeaders({
    'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
  });
  // ...
};
```

For static prerendered pages (marketing pages), Vercel CDN caches indefinitely. Use Vercel's dashboard to purge if needed.

---

## Smoke check

```bash
cd apps/web
pnpm build
# Should complete with no TS errors
# Check output: .svelte-kit/output/

curl http://localhost:4173 -I
# Should see X-Frame-Options, X-Content-Type-Options headers
```

Lighthouse on prod build: Performance ≥ 90, no AVIF/WebP warnings.

---

## Phase acceptance criteria

| ID | Criterion |
|---|---|
| 2.1 | `adapter-vercel` configured with `nodejs22.x` |
| 2.2 | `@sveltejs/enhanced-img` wired in `vite.config.ts` |
| 2.3 | `@fontsource-variable/inter` self-hosted (no Google Fonts request in network tab) |
| 2.4 | Security headers visible in dev tools (X-Frame-Options, X-Content-Type-Options, CSP) |
| 2.5 | `pnpm build` completes without TypeScript errors |
| 2.6 | LCP image uses `fetchpriority="high"` and `loading="eager"` |
