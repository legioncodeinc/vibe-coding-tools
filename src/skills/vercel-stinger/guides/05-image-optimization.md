# Guide 5: Image optimization

Grounded in `references/research/distilled-vercel.md` §6, `references/image-optimization-helper.md`.

## When to walk this guide

Adding images to a SvelteKit page and deciding how they should be served/optimized on Vercel.

## The gap to know up front

SvelteKit has no built-in `Image` component wired into Vercel's optimization pipeline - Next.js has `next/image`, Nuxt has `@nuxt/image`, SvelteKit has neither. Don't reach for a non-existent `<Image>` import. There are two real, coexisting options.

## Path A: dynamic / CMS / DB-driven images

Use the hand-rolled `optimize()` helper against `/_vercel/image?url=...&w=...&q=...` - copy-paste version in `references/image-optimization-helper.md`. Requires `images` configured in `adapter-vercel()` (sizes/formats/domains) so Vercel's pipeline knows what widths/formats are allowed to be generated.

## Path B: static, build-time-known images

Use `@sveltejs/enhanced-img` (`npm i -D @sveltejs/enhanced-img`). `<enhanced:img src={image} alt="..." />` auto-generates responsive `<picture>` markup, sets width/height to prevent layout shift, strips EXIF, converts to avif/webp. Only works on files present on disk at build time - not CMS/DB images.

## Decision table

| Image source | Path |
|---|---|
| User-uploaded, DB/CMS/S3-backed | A (Vercel on-demand) |
| Static marketing/hero art in the repo | B (`enhanced-img`) |
| Tokenized URLs that change per-request without content changing | Neither - skip optimization, cache-busting defeats it anyway |

## Cost discipline

Billed per **source image transformed**, not per request. A dynamic OG-image route that generates a new source image on every request can burn through the included transform quota fast. If a route generates OG images dynamically, either cache the generated image aggressively (so the same source isn't re-transformed) or pre-generate at build time / route through a separate image CDN instead of Vercel's pipeline. See `references/research/distilled-vercel.md` §9 for the wider cost picture.

## Common mistakes

- Trying to import a `next/image`-style component that doesn't exist for SvelteKit.
- Using Path B (`enhanced-img`) for CMS-driven images that aren't on disk at build time - it silently can't process them.
- Letting a dynamic OG-image route regenerate the same image on every request without a cache layer in front of it.
