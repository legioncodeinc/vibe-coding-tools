---
source_type: docs
authority: high
relevance: high
topic: Next.js Image component official API reference
url: https://nextjs.org/docs/app/api-reference/components/image
date_accessed: 2026-05-20
---

# Next.js Image Component: Official API Reference (App Router)

## Key Findings

### `placeholder` prop

- `"empty"` (default): No placeholder
- `"blur"`: Show blurred version while loading: requires `blurDataURL`
- `"data:image/..."`: Use a Data URL directly as placeholder

### `blurDataURL` prop

- Base64-encoded Data URL used as `background-image` during load
- **Automatic for local static imports** of `.jpg`, `.png`, `.webp`, `.avif` (blur hash auto-generated)
- **Must be provided manually** for remote/dynamic images
- Recommended: use plaiceholder library or png-pixel.com to generate
- Keep it small (10px or less): it's enlarged/blurred automatically
- "A large blurDataURL may hurt performance."

### `remotePatterns` configuration (in `next.config.js`)

```js
module.exports = {
  images: {
    // Next.js 15.3.0+ (URL constructor syntax)
    remotePatterns: [new URL('https://example.com/account123/**')],
    
    // Pre-15.3.0 (object syntax)
    remotePatterns: [{
      protocol: 'https',
      hostname: 'example.com',
      port: '',
      pathname: '/account123/**',
      search: '',
    }]
  }
}
```

### Wildcard Patterns

- `*`: matches a single path segment or subdomain
- `**`: matches any number of path segments at end OR subdomains at beginning
- `**` syntax does NOT work in the middle of a pattern

### `loaderFile` (CDN override)

```js
// next.config.js
module.exports = {
  images: { loader: 'custom', loaderFile: './my/image/loader.js' }
}

// my/image/loader.js
'use client'
export default function myImageLoader({ src, width, quality }) {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}
```

### Built-in CDN Loaders (legacy, use `loaderFile` for flexibility)

- Imgix: `loader: 'imgix'`
- Cloudinary: `loader: 'cloudinary'`
- Akamai: `loader: 'akamai'`

### Remote Images: Required Manual Props

Since Next.js cannot access remote files at build time:
- `width` and `height` must be provided manually
- `blurDataURL` must be provided if using `placeholder="blur"`

### `priority` prop (LCP optimization)

Use `priority` on the image that will be the LCP element:
- Removes `loading="lazy"`
- Adds `fetchpriority="high"`
- Preloads the image

### `fill` layout mode

```jsx
<div style={{ position: 'relative', width: '100%', height: '400px' }}>
  <Image src="..." alt="..." fill style={{ objectFit: 'cover' }} />
</div>
```

## Relevance to image-optimization-stinger

Primary reference for `guides/04-nextjs-image.md`. Covers the complete API surface for local images (auto blurDataURL), remote images (manual props + blurDataURL), remotePatterns security config, and CDN loaders.

## Direct Quotes / Data Points

- `blurDataURL` is auto-populated "If src is a static import of a jpg, png, webp, or avif file, blurDataURL is added automatically: unless the image is animated."
- "A large blurDataURL may hurt performance. Keep it small and simple."
- `priority` prop "should be added to the image that will be the Largest Contentful Paint (LCP) element for each page."
- "Note that any allowed remotePatterns that respond with a redirect will follow the redirect from the remote image server without validating remotePatterns again on the redirect location."
