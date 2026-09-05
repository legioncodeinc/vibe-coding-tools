---
url: https://webperfclinic.com/article/resource-hints-preload-preconnect-prefetch-early-hints-guide
fetched: 2026-05-20
source_type: blog
authority: medium
relevance: high
topic: preload-strategy
---

# Resource Hints Complete Guide 2026 (Web Perf Clinic)

## Summary

A comprehensive 2026 guide to all browser resource hint types: `preload`, `preconnect`, `prefetch`, `modulepreload`, and Early Hints (`103`). For font loading specifically, covers when `preload` is appropriate for fonts, the priority implications of overloading the browser's hint queue, and how Early Hints (HTTP `103`) can substitute for preload on server-rendered pages by pushing font hints before the HTML is fully sent.

## Key quotations / statistics

- Font preloading substantially improves performance "by preventing layout shifts and text rendering delays."
- "Without preloading, fonts are discovered late in the loading process — often 2-3 seconds into page load — because browsers conservatively wait until a font is explicitly needed before downloading it."
- Preloading raises resource priority to `Highest`. Over-preloading inverts the priority queue and can delay LCP images.
- Early Hints (`103 Early Hints`) can push font preloads before the HTML document is ready, making them earlier than any in-document `<link rel="preload">`.
- `modulepreload` is for JavaScript modules, NOT for fonts. Using it for fonts is a type error.
- `preconnect` is the lighter-weight alternative for third-party font CDNs (Google Fonts, Bunny Fonts): establishes DNS + TCP + TLS without downloading the file.

## Annotations for stinger-forge

- This is a supporting source for `guides/02-preload-strategy.md`. The "2-3 second late discovery" figure is a concrete motivating statistic for why preloading matters.
- The Early Hints mention is worth noting in the stinger as an advanced technique for server-rendered Next.js apps (Next.js supports Early Hints via `Response.prototype.headers` in some configurations).
- The `preconnect` vs `preload` distinction is important: for Google Fonts CDN users (who are NOT using next/font), `preconnect` to `fonts.googleapis.com` and `fonts.gstatic.com` with `crossorigin` is the baseline best practice, not `preload`.
- The priority inversion risk from over-preloading (> 2-3 fonts) must be documented in `guides/02-preload-strategy.md`. Each preloaded font competes with LCP image fetching.
- `modulepreload` vs `preload` distinction: do not confuse in guides. Fonts use `rel="preload" as="font"`.
