---
source_type: spec
authority: high
relevance: high
topic: ThumbHash vs BlurHash compact placeholder comparison
url: https://evanw.github.io/thumbhash/
date_accessed: 2026-05-20
---

# ThumbHash: A Very Compact Image Placeholder

## Key Findings

ThumbHash advantages over BlurHash:
- **Encodes more detail** in the same space
- **Encodes the aspect ratio** (BlurHash does not)
- **More accurate colors**
- **Supports alpha** (transparency): BlurHash does not
- Similar code complexity to BlurHash
- Drawback: algorithm parameters are NOT configurable (auto-configured)

## ThumbHash vs BlurHash at a Glance (2026 data)

| Feature | BlurHash | ThumbHash |
|---|---|---|
| Typical string size | 20-30 chars (base83) | 20-28 chars (base64) |
| Alpha channel | No | Yes |
| Aspect ratio encoded | No | Yes |
| Color accuracy | Good | Better |
| Configurable | Yes (componentX/Y) | No |
| Decode JS required | Yes | Yes |
| Encode speed | Slower | Faster (~12x with fast-thumbhash) |

## Performance Data (from fast-thumbhash benchmark)

- ThumbHash encode: ~14 µs (vs BlurHash ~180 µs)
- ThumbHash decode: ~1.5 µs (vs BlurHash ~6.5 ms for some implementations)
- ThumbHash + base91 encoding produces **smaller strings** than BlurHash base83 while carrying more information

## Key Caveat for Web Use

Both BlurHash and ThumbHash require client-side JavaScript to decode. This means:
- They do NOT work without JS
- For above-the-fold LCP images, LQIP (base64 JPEG) is safer because it renders as a native `<img>` or CSS `background-image` without JS

## Alternative: LQIP via plaiceholder

plaiceholder generates a base64-encoded JPEG/PNG data URI (LQIP) that works as a CSS `background-image`: no JS decode step. This is what Next.js recommends for `blurDataURL`.

## Relevance to image-optimization-stinger

Answers the Command Brief open question on ThumbHash vs BlurHash. The tradeoff is: ThumbHash > BlurHash for quality/features at same size, but LQIP is safer for above-the-fold images (no JS dependency). Informs `guides/03-blur-placeholders.md` recommendation hierarchy.

## Direct Quotes / Data Points

- "ThumbHash encodes more detail in the same space, also encodes the aspect ratio, gives more accurate colors, supports images with alpha."
- "One potential drawback compared to BlurHash is that the parameters of the algorithm are not configurable."
- Benchmark from fast-thumbhash: "ThumbHash encode 14.4 µs vs BlurHash ~180 µs (12x faster)"
- From SplatHash article: "Decode runs on every page load for every user. Encode runs once at upload. Optimize for decode."
- From mux.com: "One big drawback is that these formats [BlurHash/ThumbHash] need to be decoded on the client side, and, unlike WebP or JPEG and blurring filters, no clients support this natively."
