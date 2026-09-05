# Vercel Image Optimization for SvelteKit + @sveltejs/enhanced-img (build-time alternative)

- URL: https://vercel.com/docs/image-optimization/quickstart ; https://vercel.com/docs/image-optimization ; https://svelte.dev/docs/kit/images
- Fetched: 2026-08-14
- Source type: Official Vercel docs + official svelte.dev docs
- Component: Image Optimization

## Content

### SvelteKit does not get a component - it gets a URL builder

Unlike Next.js (`next/image`) or Nuxt (`@nuxt/image`), SvelteKit has **no built-in Image component wired into Vercel's optimization pipeline**. Vercel's own quickstart instructs SvelteKit users to hand-write a `srcset` URL builder against the `/_vercel/image` endpoint:

```js
// src/lib/image.js
import { dev } from '$app/environment';

export function optimize(src, widths = [640, 960, 1280], quality = 90) {
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
<script>
  import { optimize } from '$lib/image';
  export let photo;
</script>
<img srcset={optimize(photo.url)} alt={photo.description} />
```

This requires `images` to be configured in `adapter-vercel`'s config (sizes, formats, minimumCacheTTL, domains - see the adapter-vercel raw file) so Vercel's Image Optimization API knows which widths/formats are allowed.

### Image Transformation URL format

Query params on `/_vercel/image` (Nuxt/Astro/SvelteKit path) or `/_next/image` (Next.js path): `url` (source, local or absolute remote), `w` (target width in px, height auto-preserves aspect), `q` (quality 1-100).

### `@sveltejs/enhanced-img` - the build-time alternative (framework-native, Vercel-independent)

A Vite plugin, not tied to any host. `<enhanced:img src="./path/to/image.jpg" alt="..." />` replaces itself at build time with a `<picture>` element serving multiple formats (avif/webp) and sizes, auto-sets `width`/`height` to prevent layout shift, strips EXIF data. Only works on files present at build time on disk (not CMS/DB/dynamic remote images - those need the CDN/Vercel dynamic path instead). First build is slow (image transform cost); cached in `./node_modules/.cache/imagetools` for fast subsequent builds. Supply source images at 2x display resolution for HiDPI; only downscaling is lossless-safe.

### Vercel's own decision guidance

Vercel's official image-optimization overview explicitly defers framework-specific guidance to each framework's own docs for SvelteKit, Astro, and Nuxt rather than dictating one true pattern - meaning the choice between "Vercel on-demand optimization via a hand-rolled srcset helper" and "`@sveltejs/enhanced-img` build-time processing" is a project-level tradeoff: dynamic/CMS images favor the Vercel URL-builder path, static/known-at-build images favor `enhanced-img`. Vercel recommends the `unoptimized`-equivalent (i.e., skip optimization) for images that change URL frequently without changing content (e.g. tokenized URLs) since cache-busting defeats the optimization benefit.

### Pricing note (see also pricing raw file)

Image Optimization on Vercel is metered per **source image transformed** (not per request) plus separate cache-read and cache-write meters - this is the mechanism behind the "image optimization runaway cost" failure mode.
