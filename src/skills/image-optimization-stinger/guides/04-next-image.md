# next/image Integration Guide

> Derived from: `research/external/2026-05-20-nextjs-image-component-api.md`, `research/external/2026-05-20-nextjs-image-api-reference.md`, `research/external/2026-05-20-nextjs-image-remote-patterns.md`, `research/external/2026-05-20-nextjs-remotepatterns-security.md`, `research/external/2026-05-20-nextjs-image-optimization-strapi.md`

---

## Essential next.config setup

```javascript
// next.config.js / next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Always enable AVIF first, WebP fallback
    formats: ['image/avif', 'image/webp'],

    // Remote image patterns (required for any external src)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
        port: '',
        pathname: '/images/**',
      },
    ],

    // Extend deviceSizes if you have very wide viewports (e.g. 4K)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // imageSizes covers the <Image sizes="..."> small-end values
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
```

---

## The Next.js 16 `priority` → `preload` shift

> **Version split:** `priority` was deprecated in Next.js 16 in favor of `preload`.

| Next.js version | LCP prop | Behavior |
|---|---|---|
| <16 | `priority` | Disables lazy loading, injects `<link rel="preload">` |
| >=16 | `preload` | Same behavior, renamed prop |

```jsx
// Next.js < 16
<Image src="/hero.avif" alt="Hero" width={1200} height={600} priority />

// Next.js >= 16
<Image src="/hero.avif" alt="Hero" width={1200} height={600} preload />
```

Check `package.json` for the Next.js version before writing the prop. If you write `priority` on Next.js 16, it still works (backwards-compatible), but a deprecation warning appears in the console.

---

## Layout modes

| Mode | When to use | Required props |
|---|---|---|
| Fixed (implicit) | Image is always the same pixel size | `width`, `height` |
| Responsive | Image scales with its container | `width`, `height`, `sizes` |
| Fill | Image fills parent container completely | Parent must have `position: relative; overflow: hidden`; use `objectFit` |

```jsx
// Fixed — thumbnail, avatar
<Image src="/avatar.jpg" alt="User avatar" width={64} height={64} />

// Responsive — content image
<Image
  src="/article-hero.jpg"
  alt="Article"
  width={800}
  height={450}
  sizes="(max-width: 768px) 100vw, 800px"
/>

// Fill — background-style hero
<div style={{ position: 'relative', height: '500px' }}>
  <Image
    src="/hero.jpg"
    alt="Hero"
    fill
    sizes="100vw"
    style={{ objectFit: 'cover' }}
    priority
  />
</div>
```

---

## Remote patterns (required for external images)

`next/image` blocks all external image sources by default. You must declare each external hostname in `remotePatterns`:

```javascript
// next.config.js
remotePatterns: [
  // Exact hostname + path prefix
  { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
  // CDN subdomain wildcard
  { protocol: 'https', hostname: '**.cloudinary.com', pathname: '/**' },
  // Strapi or other CMS
  { protocol: 'http', hostname: 'localhost', port: '1337', pathname: '/uploads/**' },
],
```

**Security note:** Wildcards (`**`) in `hostname` match any subdomain. Be as specific as possible: a wildcard on `**.example.com` allows any subdomain of example.com to serve images through your Next.js image optimization pipeline, which could be exploited if example.com is user-controlled.

> Source: `research/external/2026-05-20-nextjs-remotepatterns-security.md`

---

## Custom loaders (Cloudinary, Imgix, etc.)

If your CDN handles image resizing, use a custom loader to bypass Vercel's Image Optimization and route directly to the CDN:

```javascript
// lib/cloudinary-loader.js
export default function cloudinaryLoader({ src, width, quality }) {
  const params = [`f_auto`, `c_limit`, `w_${width}`, `q_${quality || 'auto'}`];
  return `https://res.cloudinary.com/yourcloud/image/upload/${params.join(',')}${src}`;
}
```

```jsx
<Image
  loader={cloudinaryLoader}
  src="/products/shoe.jpg"
  alt="Blue shoe"
  width={600}
  height={600}
  sizes="(max-width: 768px) 100vw, 600px"
/>
```

When using a custom loader with AVIF-capable CDNs, the CDN handles format selection via `Accept` headers: set `formats` in `next.config` is not needed.

---

## Vercel Image Optimization billing awareness

Vercel's free tier includes 1,000 image transformations/month. Each unique (src, width, quality) combination counts as one transformation. Over-broad `deviceSizes` or missing `sizes` props (defaulting to 100vw) generate many more unique size variants than necessary and can exhaust the quota quickly on high-traffic pages.

**Recommendation:** Lock down `sizes` on all non-full-width images (reduces unique width variants), and add the `minimumCacheTTL` option to maximize cache hit rates:

```javascript
images: {
  minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
}
```

---

## Common next/image mistakes

| Mistake | Fix |
|---|---|
| Omitting `sizes` on non-full-width images | Add `sizes` matching your CSS layout |
| Using `priority` without knowing the LCP candidate | Only one image per page should have `priority` / `preload` |
| `loading="lazy"` on LCP image | Remove `loading="lazy"` from the LCP candidate |
| External `src` not in `remotePatterns` | Add the hostname to `next.config` |
| Using `fill` without `position: relative` on parent | Wrap in `<div style={{ position: 'relative' }}>` |
| Not setting `objectFit` on `fill` images | Add `style={{ objectFit: 'cover' }}` or `objectFit: 'contain'` |
