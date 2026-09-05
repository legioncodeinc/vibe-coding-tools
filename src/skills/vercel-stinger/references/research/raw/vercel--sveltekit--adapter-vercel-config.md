# SvelteKit adapter-vercel: install, config object, routes, images, ISR

- URL: https://svelte.dev/docs/kit/adapter-vercel ; https://vercel.com/docs/frameworks/full-stack/sveltekit ; https://svelte.dev/docs/kit/adapter-auto ; https://github.com/sveltejs/kit/blob/main/packages/adapter-vercel/index.d.ts
- Fetched: 2026-08-14
- Source type: Official docs (svelte.dev) + official Vercel docs + SvelteKit source (type definitions)
- Component: SvelteKit / adapter-vercel

## Content

### Install and wire up

`npm create svelte@latest` (now `npx sv create`) installs `adapter-auto` by default, which detects Vercel at build time and installs `@sveltejs/adapter-vercel` for you. Vercel's own docs recommend installing `@sveltejs/adapter-vercel` explicitly instead of relying on `adapter-auto`: it pins version stability, slightly speeds up CI, and unlocks per-route/per-project deployment configuration that `adapter-auto` cannot pass through (adapter-auto takes no options).

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';

export default {
  kit: {
    adapter: adapter({
      runtime: 'nodejs20.x',
    }),
  },
};
```

`svelte.config.js` cannot be TypeScript (long-standing SvelteKit constraint).

### Deployment configuration (`config` object)

Set adapter-level defaults in `svelte.config.js`, or override per-route by exporting `export const config` from `+server.js`, `+page(.server).js`, or `+layout(.server).js`. Layout-level config cascades to child routes unless overridden more specifically.

Options that apply to all functions:
- `runtime`: `'edge'`, `'nodejs20.x'`, or `'nodejs22.x'`. Defaults to the Node version configured on the Vercel dashboard for the project.
- `regions`: array of edge network region IDs (default `["iad1"]` for serverless; `'all'` allowed if `runtime` is `'edge'`). Multiple regions for serverless functions require an Enterprise plan.
- `split`: if `true`, deploys the route as its own separate Vercel Function. Setting `split: true` at the adapter level splits every route.

Edge-only option:
- `external`: array of dependencies esbuild should treat as external when bundling - only for optional deps that don't run outside Node.

Serverless-only options:
- `memory`: MB of RAM, default `1024`, can be lowered to `128` or raised in 64 MB increments up to `3008` on Pro/Enterprise.
- `maxDuration`: max execution seconds. Defaults 10s Hobby, 15s Pro, 900s Enterprise.
- `isr`: Incremental Static Regeneration config (see below).

### Images

`adapter-vercel` accepts an `images` config object matching the Build Output API's images spec, e.g.:

```js
adapter({
  images: {
    sizes: [640, 828, 1200, 1920, 3840],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 300,
    domains: ['example-app.vercel.app'],
  },
})
```

### Incremental Static Regeneration

```js
export const config = {
  isr: {
    expiration: 60,       // seconds before regeneration, or false = never expire
    bypassToken: '...',   // random token to bypass cache via cookie or x-vercel-revalidate header
    allowQuery: ['page'], // query params cached independently; omit = each unique query cached separately
  },
};
```

### Environment variables

The adapter exposes Vercel's env vars (both build-time `static`/`dynamic` `private` and system env vars) through SvelteKit's `$env/static/private` and `$env/dynamic/private` modules - standard SvelteKit env-var patterns apply unchanged on Vercel.

### Type definitions (source of truth)

From `adapter-vercel/index.d.ts`: `ServerlessConfig` carries `runtime`, `regions`, `maxDuration`, `memory`, `split`, `isr`. `EdgeConfig` (deprecated shape, `runtime: 'edge'`) carries `runtime`, `regions` (string[] | 'all'), `external`, `split`. `Config = (EdgeConfig | ServerlessConfig) & { images?: ImagesConfig }`.
