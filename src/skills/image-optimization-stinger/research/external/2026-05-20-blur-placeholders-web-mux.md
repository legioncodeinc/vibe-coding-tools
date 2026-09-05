---
url: https://www.mux.com/blog/blurry-image-placeholders-on-the-web
title: "A clear look at blurry image placeholders on the web - Mux"
date: 2025-12-16
source_type: blog
authority: high
relevance: high
topic: lqip-blurhash
stinger: image-optimization-stinger
---

# Blurry Image Placeholders on the Web - Mux

## Summary

December 2025 deep-dive from Mux's engineering team comparing LQIP (blur-up), BlurHash, and ThumbHash for browser use. Concludes that for web contexts LQIP via a tiny WebP/JPEG is preferable to BlurHash because: (1) LQIP requires no JavaScript to render -- the browser natively displays the Base64 image, (2) BlurHash strings must be decoded client-side with a JS library, which partly defeats the placeholder's purpose on slow networks. Also covers ThumbHash as an improvement over BlurHash.

## Key quotations / statistics

- Facebook LQIP technique (2015): "resize the original image to a tiny image (around 40px wide)... compress it with JPEG encoding... the user upscale the image and apply a Gaussian blur filter." Payload: "200 bytes or smaller."
- WebP LQIP: "This file format provides an even better compression than JPEG, resulting in a file size approaching only 100 bytes if the tiny image has a maximum size of 16x16 with a quality around 70%."
- Next.js "uses this exact same technique in the next/image component to show a blurry placeholder."
- BlurHash: "A short string that is only 20-30 characters (~bytes)."
- BlurHash drawback: "These formats need to be decoded on the client side -- and, unlike WebP or JPEG and blurring filters, no clients support this natively. For the web, this means you'll always need JavaScript to decode the placeholder."
- "If you transform the image to a blurhash and back to an image, then send the image to the customer, what you've done is treat BlurHash as a preprocessing filter that loses the majority of its benefits."
- ThumbHash: "A similar library called ThumbHash was released that encodes even more detail in the same space and adds other benefits like encoding the image's aspect-ratio and supporting images that contain an alpha channel."
- Conclusion: "For these hash libraries to be effective, the short encoded string should be stored server side -- and stay in that form until it arrives at the client." But for web, LQIP/blur-up produces "a more accurate representation" and avoids JS dependency.
- "The encoded size might be about 150 bytes larger [than blurhash], but the increased quality and avoiding the requirement of JavaScript to render the blurhash is well worth it."

## Annotations for stinger-forge

- This is the primary source for the BlurHash vs LQIP tradeoff in `guides/03-placeholders.md`.
- Key nuance: converting BlurHash to Base64 server-side before sending negates the size benefit (10x larger). Either send the raw hash (needs client JS) or use LQIP (no JS needed).
- The 100-bytes WebP LQIP figure (16x16, quality 70%) is the target spec for `guides/03-placeholders.md`.
- ThumbHash is an improvement over BlurHash -- mention it as an alternative for teams that want the hash approach.
- Next.js's built-in blurDataURL uses LQIP (not BlurHash) -- important for `guides/04-next-image.md`.
