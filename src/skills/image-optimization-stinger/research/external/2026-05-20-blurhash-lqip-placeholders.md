---
source_type: blog
authority: high
relevance: high
topic: blur placeholders LQIP BlurHash ThumbHash Next.js comparison 2025
url: https://unifiedimagetools.com/en/articles/responsive-placeholders-lqip-sqip-modern-2025
date_accessed: 2026-05-20
---

# Placeholder Design LQIP/SQIP/BlurHash: Practical 2025

## Key Findings

- **LQIP**: Resize image to ~32px wide, JPEG compress at quality 10-15, base64 encode → data URI. Best for photos and complex textures.
- **BlurHash**: DCT-based hash string (20-30 chars). Requires client-side JS decode. Best for mobile/PWA with lightweight constraints.
- **ThumbHash**: More detail than BlurHash in same space, encodes aspect ratio, supports alpha. Better color accuracy.
- LQIP payload: ~200-400 bytes for a 32x32 JPEG. Blurs natively via CSS `filter: blur()`.
- BlurHash payload: ~20-30 characters (base83). Zero bytes on the wire for full image, but JS required to decode.
- ThumbHash payload: ~20-28 characters (base64). Slightly smaller than BlurHash at equivalent quality.

## LQIP Generation with Sharp

```js
import sharp from 'sharp';

async function generateLQIP(inputPath, quality = 10) {
  const metadata = await sharp(inputPath).metadata();
  const lqip = await sharp(inputPath)
    .resize(32, Math.round(32 * metadata.height / metadata.width))
    .jpeg({ quality, progressive: true, mozjpeg: true })
    .toBuffer();
  return `data:image/jpeg;base64,${lqip.toString('base64')}`;
}
```

## Pre-generating Placeholders at Build Time (Next.js)

```js
// In getStaticProps or generateStaticParams
const [lqip, blurhash] = await Promise.all([
  generateLQIP(imagePath),
  generateBlurHash(imagePath)
]);
```

## Relevance to image-optimization-stinger

Core content for `guides/03-blur-placeholders.md`. Provides working code for both LQIP and BlurHash generation with Sharp. The LQIP vs BlurHash tradeoff section is key for the Bee's decision guidance.

## Direct Quotes / Data Points

- "Best For LQIP: Photographs, natural images, images with complex textures"
- "Best For BlurHash: Mobile apps, PWAs, environments requiring lightweight placeholders"
- LQIP size: approximately 200-400 bytes for a 32x32 JPEG
- BlurHash string: "usually 20-30 characters, up to 40 characters for complex images"
