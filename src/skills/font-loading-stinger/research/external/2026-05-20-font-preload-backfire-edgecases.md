---
source_url: https://learn.goirs.me/insights/font-preload-performance
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: preload
stinger: font-loading-stinger
---

# Font Preloading: When rel=preload Backfires

## Summary
Technical deep-dive (November 2025) explaining the CORS mechanism behind
font preloading, covering the `crossorigin` attribute variants, priority
inversion risks, unused preloads, and an HTTP/2 Push conflict edge case.
Particularly valuable for its explanation that font CORS applies even to
same-origin fonts: a common developer misconception.

## Key quotations / statistics

- "Font files are **always** fetched with CORS (Cross-Origin Resource Sharing)
  mode — even for same-origin fonts. This is a browser security requirement,
  not a server configuration issue."

- When you preload a font without `crossorigin`:
  - Preload request: No CORS, includes cookies (normal mode)
  - Actual font request: Anonymous CORS, no cookies
  - "Browsers consider these *different resources* due to credential mode
    mismatch. The preloaded response can't be reused, causing a duplicate download."

- `crossorigin` equivalence:
  ```html
  <!-- All three are equivalent: -->
  <link rel="preload" as="font" href="/font.woff2" crossorigin>
  <link rel="preload" as="font" href="/font.woff2" crossorigin="">
  <link rel="preload" as="font" href="/font.woff2" crossorigin="anonymous">
  ```

- "**Never use `crossorigin="use-credentials"`** — fonts don't use credentialed
  requests. This will also cause double downloads."

- Priority inversion: "Preloaded fonts get 'highest' priority in Chrome's
  resource scheduler — same as render-blocking CSS. If you preload 3 fonts
  (150KB total) and your LCP image is 80KB, fonts download first, delaying LCP."

- Time savings: "The gain: fonts start downloading 300-800ms earlier. The cost:
  preloaded resources have **highest priority**, competing with critical
  resources like CSS and LCP images."

- Production checklist from the article:
  - Preload 1-2 fonts maximum (primary body + optional headline)
  - Always include `crossorigin`, even for same-origin fonts
  - Include `type="font/woff2"` to help older browsers skip unsupported formats
  - Pair with `font-display: optional` when possible
  - Self-host fonts for full preload control
  - Test on Slow 4G throttle
  - Monitor LCP after adding preloads

## Annotations for stinger-forge

- The "300-800ms earlier fetch" vs "highest priority competition" quantification
  belongs in `guides/02-preload-strategy.md` as the risk/reward framing.
- The three equivalent `crossorigin` forms (bare attribute, `=""`, `="anonymous"`)
  resolve the common developer confusion: include in the guide.
- The `crossorigin="use-credentials"` anti-pattern is a gotcha that belongs in a
  "Common Mistakes" callout.
- The HTTP/2 Push conflict (don't use preload + HTTP/2 Push together) is a
  less-common but real edge case for the guide's "when not to preload" section.
