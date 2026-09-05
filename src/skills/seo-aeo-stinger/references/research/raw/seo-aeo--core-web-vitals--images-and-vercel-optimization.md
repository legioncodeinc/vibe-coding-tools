# SvelteKit Images docs + Vercel Image Optimization docs

- URL: https://svelte.dev/docs/kit/images ; https://vercel.com/docs/image-optimization ; https://www.npmjs.com/package/@sveltejs/enhanced-img
- Fetched: 2026-08-14
- Source type: official-docs
- Component: core-web-vitals

## Notes

### @sveltejs/enhanced-img

A Vite plugin running a Svelte preprocessor that transforms images at build time: generates optimal formats (`.avif`, `.webp`), creates multiple sizes for different screens, auto-sets intrinsic `width`/`height` to prevent layout shift, and strips EXIF data for privacy. Works in any Vite-based project.

Limitation: as a build plugin it can only optimize files present on disk at build time -- images from a CMS/database/backend need the "loading images dynamically from a CDN" pattern instead (a plain `<img>` targeting a CDN that transforms on request).

Build output is cached in `./node_modules/.cache/imagetools`, so only the first build is slow.

Usage:

```svelte
<enhanced:img src="./image.png" alt="..." />
```

At build time `<enhanced:img>` is replaced with a `<picture>` wrapping an `<img>`, providing multiple types/sizes. Only downscaling is possible -- provide the highest-resolution source you need. Provide images at 2x resolution for HiDPI/retina displays; smaller variants are generated automatically.

`width`/`height` are optional (inferred from source, auto-added during preprocessing) so the browser can reserve layout space and avoid CLS.

`sizes` for responsive hero-width images:

```svelte
<enhanced:img src="./image.png" sizes="min(1280px, 100vw)" />
```

If `sizes` is specified, smaller images are generated for smaller devices and `srcset` is populated. Smallest auto-generated width is 540px; custom widths via the `w` query param (`?w=1280;640;400`). Without `sizes`, only a HiDPI and a standard-resolution image are generated.

Per-image transforms via query string (blur, quality, flatten, rotate).

### Best practices (from docs)

- Mix Vite's built-in asset handling, `@sveltejs/enhanced-img`, and CDN-dynamic images within one project as appropriate per image source.
- Serve all images via CDN regardless of optimization method used, to reduce latency.
- Source images should be provided at 2x display width/height for HiDPI.
- For hero-width images much larger than mobile viewport (~400px), specify `sizes` so smaller variants are served on small devices.
- For the LCP image: set `fetchpriority="high"`, avoid `loading="lazy"`.
- Do not use `em`/`rem` in `sizes` or change the default root font-size elsewhere in CSS -- the browser's image-preload reservation can then mismatch the actual CSS layout.

### Vercel Image Optimization

Vercel dynamically transforms unoptimized images, caches the results on the Vercel CDN close to users. Works across frameworks including Next.js, Astro, Nuxt (SvelteKit via `adapter-vercel`'s `images` config, see the adapter-vercel raw file). A plain `<img>` bypasses optimization and serves the source directly; a framework's optimized-image component routes through Vercel's pipeline.

Transformation URL query params: `url` (source, local or remote), `w` (target width in px; height auto-derived, aspect preserved), `q` (quality 1-100).

Optimized images can also be generated once at write time and stored in Vercel Blob to avoid per-request transformation billing; each write is billed as one transformation, and serving the stored result afterward does not re-incur transformation charges.
