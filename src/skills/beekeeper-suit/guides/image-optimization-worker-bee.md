# image-optimization-worker-bee

## Domain
This Bee owns how images are encoded, sized, delivered, and perceived in React/Next.js and plain HTML contexts: format selection (AVIF first, WebP fallback, never JPEG as primary), responsive srcset/sizes correctness, blur placeholders (LQIP, BlurHash-as-CSS-gradient, ThumbHash), next/image configuration including the Next.js 16 priority-to-preload shift, and CLI tooling (Sharp for pipelines, Squoosh for one-offs).

## Paired Stinger
[image-optimization-stinger](../../image-optimization-stinger) - the format-selection decision tree, srcset/sizes calculation guide, placeholder tradeoff matrix, next/image API reference, and Sharp/Squoosh tooling notes.

## Trigger phrases
- "optimize my images"
- "convert to AVIF"
- "fix layout shift from images"
- "add blur placeholders"
- "what remote patterns do I need for next/image"
- "my LCP image is slow"
- "AVIF vs WebP"
- "audit our images"

## Do NOT route when
- The request is about SVG icon components rather than raster/photo images; that belongs to icon-system-worker-bee.
- The request is a general Lighthouse score audit beyond image-specific findings; that belongs to lighthouse-pagespeed-worker-bee.
- The request is CDN cache TTL or caching architecture; that belongs to devops-worker-bee.
- The request is CSS animation performance; that belongs to ux-ui-svelte-worker-bee.

## Inputs the Bee needs
- The framework and Next.js version (needed to choose priority vs preload).
- The CDN setup, if any, and whether it supports format negotiation.
- The known or suspected LCP candidate image.
- Existing next.config or picture-element patterns.

## Outputs
- Corrected format pipeline, srcset/sizes values, and placeholder implementation.
- A next.config fix (formats, remotePatterns, minimumCacheTTL).
- An image-audit-report with inventory, format breakdown, LCP candidates, and a prioritized remediation checklist.

## Commonly sequenced with
- lighthouse-pagespeed-worker-bee: measures the before/after impact of image fixes on LCP and CLS.
- icon-system-worker-bee: takes over when the asset in question is an SVG icon, not a photo.
- devops-worker-bee: owns CDN-level format negotiation and cache TTL strategy.
