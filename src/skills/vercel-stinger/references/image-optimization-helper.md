# Image optimization helper: copy-paste for SvelteKit on Vercel

Grounded in `research/distilled-vercel.md` §6, `research/raw/vercel--image-optimization--sveltekit-enhanced-img.md`.

SvelteKit has no built-in `Image` component wired into Vercel's optimization pipeline (unlike Next.js/Nuxt). Pick per image source, both can coexist.

## Path A: dynamic / CMS / DB-driven image URLs -> Vercel on-demand optimization

```ts
// src/lib/image.ts
import { dev } from '$app/environment';

export function optimize(src: string, widths = [640, 960, 1280], quality = 90) {
  if (dev) return src;
  return widths
    .slice()
    .sort((a, b) => a - b)
    .map((width, i) => {
      const url = `/_vercel/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
      const descriptor = i < widths.length - 1 ? ` ${width}w` : '';
      return url + descriptor;
    })
    .join(', ');
}
```

```svelte
<script lang="ts">
  import { optimize } from '$lib/image';
  export let photo: { url: string; description: string };
</script>

<img srcset={optimize(photo.url)} alt={photo.description} />
```

Requires `images` configured in `adapter-vercel()` (see `svelte-config-templates.md`) so Vercel knows which widths/formats are allowed.

## Path B: static, known-at-build images -> `@sveltejs/enhanced-img`

```bash
npm i -D @sveltejs/enhanced-img
```

```svelte
<script>
  import heroImage from './hero.jpg?enhanced';
</script>

<enhanced:img src={heroImage} alt="Hero" sizes="(min-width: 1200px) 1200px, 100vw" />
```

Provide the source at 2x display resolution. First build is slow (transform cost); subsequent builds hit `node_modules/.cache/imagetools`.

## Decision rule

| Image source | Use |
|---|---|
| Uploaded by users, stored in DB/CMS/S3 | Path A (Vercel on-demand) |
| Static marketing/hero art shipped with the repo | Path B (`enhanced-img`) |
| Frequently-changing tokenized URLs (same content, new URL each time) | Neither - serve `unoptimized`, cache-busting defeats optimization anyway |

## Cost guardrail

Billed per **source image transformed**, not per request (distilled §6, §9). A route that generates a new dynamic OG image per request can burn through the included transform quota fast. Pre-generate OG images at build time where possible, or route them through a separate image CDN instead of Vercel's pipeline.
