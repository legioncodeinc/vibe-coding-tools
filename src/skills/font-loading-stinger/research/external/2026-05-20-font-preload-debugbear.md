---
source_url: https://www.debugbear.com/blog/rel-preload-problems
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: critical
topic: preload
stinger: font-loading-stinger
---

# Common Problems With rel="preload" - DebugBear

## Summary
Practitioner deep-dive (updated 2025) on the failure modes of `rel="preload"`.
Includes real-world case study of Ghost homepage preloading 38 fonts and
delaying LCP by several seconds, documents the CORS credential mode mismatch
that causes double-fetch, covers the "preloaded but not used" console warning
causes, and explains the fetchpriority attribute for LCP image prioritization.

## Key quotations / statistics

- Real-world anti-pattern: "The page is preloading 38 different fonts, causing
  these requests to compete for bandwidth with the more important LCP image
  request. As a result, the image only appears several seconds later."

- CORS mode mismatch double-fetch: "If a preloaded file isn't used, Chrome will
  show a message like this: 'The resource was preloaded using link preload but
  not used within a few seconds from the window's load event.'"

- Fix for CORS mismatch: "Adding the `crossorigin` attribute to the link tag
  ensures that both requests are made using CORS headers. The preload response
  can then be safely reused for the actual font load."

- Wrong preload (no crossorigin):
  ```html
  <link rel="preload" href="...font.woff2" as="font" />
  ```
  Chrome warning: "A preload for '...' is found, but is not used because the
  request credentials mode does not match. Consider taking a look at crossorigin
  attribute."

- For LCP image: "You can use priority hints and the `fetchpriority` attribute
  to tell the browser that this image is important."
  ```html
  <link rel="preload" href="/images/photo.jpg" as="image" fetchpriority="high" />
  ```

- Preloading an already-discovered resource is wasteful: a stylesheet already
  in `<head>` doesn't benefit from a `<link rel="preload">` tag added for it.

## Annotations for stinger-forge

- This source provides the **real-world horror story** (38 fonts, Ghost LCP
  delay) that justifies the "never preload more than 2-3 font files" directive
  in `guides/02-preload-strategy.md`.
- The CORS double-fetch mechanism should be explained with the browser warning
  message verbatim in the guide: it's the most common font preload mistake.
- The `fetchpriority="high"` attribute for the single most critical font should
  appear in `templates/preload-link.md`.
- The "preloaded but not used" warning causes (preload vs prefetch mix-up,
  removed resources, third-party ownership changes) belong in a "Common
  Mistakes" section of the guide.
