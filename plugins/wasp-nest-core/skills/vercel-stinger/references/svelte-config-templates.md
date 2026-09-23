# svelte.config.js templates (copy-paste)

Grounded in `research/distilled-vercel.md` §1-2. Verify against `research/raw/vercel--sveltekit--adapter-vercel-config.md` before deviating.

## Baseline: Node.js runtime, sane defaults

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      runtime: 'nodejs22.x',
      regions: ['iad1'],
    }),
  },
};

export default config;
```

Default to Node.js, not Edge. See distilled §1-2: Vercel's own current docs recommend migrating off Edge, and Next.js already dropped Edge route support in 16.3. Only reach for `runtime: 'edge'` on a specific route that needs sub-25ms global latency and has no Node-API dependency.

## With image optimization config

```js
import adapter from '@sveltejs/adapter-vercel';

export default {
  kit: {
    adapter: adapter({
      runtime: 'nodejs22.x',
      images: {
        sizes: [640, 828, 1200, 1920, 3840],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 300,
        domains: ['your-app.vercel.app'],
      },
    }),
  },
};
```

## Per-route override: split a heavy route into its own function with more memory

```ts
// src/routes/api/export/+server.ts
export const config = {
  runtime: 'nodejs22.x',
  memory: 3008,
  maxDuration: 60,
  split: true,
};

export async function GET() {
  // heavy export logic
}
```

## Per-route ISR

```ts
// src/routes/blog/[slug]/+page.server.ts
export const config = {
  isr: {
    expiration: 3600,
    allowQuery: ['preview'],
  },
};
```

## `vercel.json` starting point for this stack

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "crons": [
    { "path": "/api/cron/cleanup", "schedule": "0 3 * * *" }
  ],
  "images": {
    "sizes": [640, 828, 1200, 1920, 3840],
    "formats": ["image/avif", "image/webp"]
  }
}
```

Only add `functions`, `regions`, or `functionFailoverRegions` keys here if the project-level defaults from `adapter-vercel()` aren't sufficient - prefer adapter config over `vercel.json` duplication where both can express the same setting, per distilled §1.
