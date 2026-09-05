# Phase 2: SvelteKit Performance & Security Configuration

> **Site Template Guide**: PRD Phase 2 of 12
> *Replaces the retired prd-phase-02-nextjs-performance-security.md*

---

## Phase Overview

### Goals

Lock in `apps/web` image optimization, self-hosted fonts, security headers, caching strategy, and code splitting. All configurations target the SvelteKit + Vercel deployment context.

### Scope

**In scope:**
- `apps/web/svelte.config.js`: adapter configuration and prerender settings
- `apps/web/vite.config.ts`: `@sveltejs/enhanced-img`, Tailwind v4, manual chunks
- `apps/web/src/hooks.server.ts`: security headers on every response
- `apps/web/src/app.css`: fontsource import
- Image optimization for both local and remote (Payload Media / Supabase Storage) images
- CSP baseline (to be tightened by `security-worker-bee`)

**Out of scope:**
- Content or analytics configuration (Phases 3, 4)
- Authentication middleware (Phase 6)
- Dark mode (Phase 12)

### Dependencies

- Phase 1: `apps/web/` SvelteKit scaffold must exist

---

## User Stories

### Story 1: Developer: Automatic Image Optimization

> As a **Developer**, I want local static images to be automatically converted to AVIF/WebP at build time so that page load times are minimized without manual conversion.

**Acceptance criteria:**
- `@sveltejs/enhanced-img` installed and configured in `vite.config.ts`
- `<enhanced:img>` used for local assets; generates AVIF/WebP
- Remote images (Payload Media, Supabase Storage) use plain `<img>` with explicit `width`/`height` to prevent CLS
- LCP hero image uses `fetchpriority="high"` and `loading="eager"`
- Non-LCP images use `loading="lazy"`

### Story 2: Developer: Self-Hosted Fonts

> As a **Developer**, I want fonts loaded from `npm` (fontsource) rather than Google Fonts so that there are no third-party DNS round-trips in the font loading path.

**Acceptance criteria:**
- `@fontsource-variable/inter` (or chosen font) installed and imported in `app.css`
- No `fonts.googleapis.com` requests in the Network tab
- `font-display: swap` behavior provided by fontsource default

### Story 3: User: Security Headers

> As a **User**, I want the site to serve security headers on every response so that browser-side attacks are mitigated.

**Acceptance criteria:**
- `X-Frame-Options: SAMEORIGIN`: prevents clickjacking
- `X-Content-Type-Options: nosniff`: prevents MIME-type sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Content-Security-Policy` baseline present (to be tightened by `security-worker-bee` before launch)

### Story 4: Developer: Type-Safe Build

> As a **Developer**, I want `pnpm build` in `apps/web` to complete without TypeScript errors so that type safety is enforced before deployment.

**Acceptance criteria:**
- `pnpm build` exits 0
- No TypeScript errors in `src/`
- Generated `.svelte-kit/output/` present

---

## Technical Specification

### svelte.config.js

```js
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ runtime: 'nodejs22.x' }),
    prerender: {
      handleMissingId: 'warn',
      entries: ['/', '/blog', '/contact', '/sitemap.xml', '/robots.txt'],
    },
  },
};

export default config;
```

### vite.config.ts

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), enhancedImages(), sveltekit()],
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

### src/hooks.server.ts: security headers

```ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self'",
      "connect-src 'self' https:",
    ].join('; ')
  );

  return response;
};
```

> CSP route: tighten via `security-worker-bee` before production. `'unsafe-inline'` is a baseline only.

### Caching via setHeaders

```ts
// In +page.server.ts load functions for marketing pages:
export const load: PageServerLoad = async ({ setHeaders }) => {
  setHeaders({
    'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
  });
  return {};
};
```

---

## Risks and Open Questions

- **R-1:** `@sveltejs/enhanced-img` processes only local static imports (`?enhanced` suffix). Remote images from Payload or Supabase Storage cannot be processed at build time. They must use plain `<img>` with explicit dimensions. Document this clearly in `guides/09-blog.md`.
- **R-2:** CSP `'unsafe-inline'` for scripts is broad. GA4's inline snippet requires it. Route CSP tightening through `security-worker-bee` to identify if `nonce`-based CSP is feasible given GA4 requirements.
- **Q-1:** Does `@tailwindcss/vite` (Tailwind v4 Vite plugin) work correctly with Svelte 5's CSS scoping? Verify there are no class name conflicts between Tailwind utilities and Svelte-generated CSS.
