---
source_type: blog
authority: high
relevance: high
topic: plaiceholder Next.js LQIP base64 blur placeholder
url: https://npm.io/package/@plaiceholder/blurhash
date_accessed: 2026-05-20
---

# plaiceholder: Node.js LQIP Library for Next.js

## Key Findings

- `plaiceholder` is the official library recommended by Next.js docs for generating `blurDataURL`
- Supports 4 strategies: CSS (linear gradients), SVG, Base64 (primary for `next/image`), Blurhash
- Uses Sharp under the hood
- `getPlaiceholder(src, options)` API: `src` can be a path or remote URL
- `size` option (4-64): controls placeholder resolution (default: 4px)
- The base64 strategy returns a data URI for use as `blurDataURL`

## Installation

```bash
npm install plaiceholder sharp
```

## App Router (Server Component) Usage

```tsx
// app/blog/[slug]/page.tsx — Server Component
import Image from 'next/image';
import { getPlaiceholder } from 'plaiceholder';

export default async function BlogPost() {
  const { base64, img } = await getPlaiceholder(
    'https://images.unsplash.com/photo-xxx?w=800',
    { size: 10 }
  );
  
  return (
    <Image
      {...img}
      placeholder="blur"
      blurDataURL={base64}
      alt="Blog post hero"
    />
  );
}
```

## App Router Compatibility

`getPlaiceholder` is an **async server-side function**: it works naturally in React Server Components (App Router). No `getStaticProps` required. The function uses Sharp for image processing, which runs on the server.

**Important**: `plaiceholder` itself (the JS function) is fully compatible with App Router Server Components. The earlier compatibility issues were with older versions and the Pages Router.

## @plaiceholder/next Helper

The `@plaiceholder/next` plugin provides a `getImage()` helper for accessing `public/` files by path in server contexts. This handles the path resolution so you don't need to construct the full file path manually.

## Local Image Limitation

Earlier versions of `@plaiceholder/next` only supported local images. The current `plaiceholder` v3 package supports both local and remote URLs via `getPlaiceholder`.

## Recommended Size Settings

- `size: 4` (default): Minimum detail, smallest output
- `size: 10`: Good balance for blur previews
- `size: 64`: Maximum detail (larger blurDataURL, impacts performance)

Keep `blurDataURL` strings small: Next.js docs warn "A large blurDataURL may hurt performance."

## Relevance to image-optimization-stinger

Answers the Command Brief open question "Does plaiceholder v3 support App Router server components?": YES, it works natively as an async function in RSC. Primary tool recommendation for `guides/03-blur-placeholders.md`.

## Direct Quotes / Data Points

- Next.js official docs: "To generate one [blurDataURL], you can use: A library like Plaiceholder"
- npm.io on plaiceholder: "Converts a specified image Buffer into a low-res placeholder... For a 'blurred' effect, extend the returned styles with filter: blur() and transform: scale()"
- "Solutions such as Plaiceholder can help with base64 generation" (Next.js docs)
