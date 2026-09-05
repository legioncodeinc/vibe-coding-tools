---
url: https://www.kojordan.com/blog/everything-you-never-wanted-to-know-about-cors-and-font-preloads/
fetched: 2026-05-20
source_type: blog
authority: medium
relevance: high
topic: preload-strategy
---

# Everything You Never Wanted to Know About CORS and Font Preloads

## Summary

A deep technical analysis of the `crossorigin` attribute requirement on `<link rel="preload" as="font">` tags. Confirms that `crossorigin` is required (not optional, not an anti-pattern) because the CSS spec mandates font requests always use CORS. The article also reveals a non-obvious production hazard: combining font preloads with `Vary: Origin` HTTP response headers can cause cross-browser double-fetch loops: a scenario where font files are re-downloaded on every page reload in Safari or in Chromium browsers depending on whether `crossorigin` is used or omitted.

## Key quotations / statistics

- "Using `crossorigin` with font preloads is best practice, not an anti-pattern."
- "Font requests must always be made with CORS, even for same-origin fonts." (per CSS spec)
- "The `crossorigin` attribute is essential because preloads are performed without CORS by default, so you must explicitly demand it."
- Canonical preload markup: `<link rel="preload" href="/font.woff2" as="font" type="font/woff2" crossorigin>`
- `Vary: Origin` hazard: "There is currently no way to satisfy all browsers when using `Vary: Origin` with font preloads."
- Safari + CORS preload + `Vary: Origin`: "causes an endless reload cycle where the font is re-downloaded on every page reload due to Origin header mismatches between preload requests and CSS-initiated requests."
- Without CORS preload + `Vary: Origin`: "All Chromium-based browsers are affected, causing repeated font downloads."

## Annotations for stinger-forge

- This is the primary source for `guides/02-preload-strategy.md`'s crossorigin section. The canonical `<link>` markup with `crossorigin` (no value needed, defaults to `anonymous`) must be shown.
- The `Vary: Origin` hazard is an advanced edge case relevant to CDN configurations. The stinger should include a note warning against setting `Vary: Origin` on font responses when using preload hints.
- Complements web.dev's recommendation to "be cautious when using preload to load fonts": the caution is not about `crossorigin` itself but about the opportunity cost of elevated fetch priority.
- The over-preloading anti-pattern (preloading more than 2-3 fonts raises fetch priority to Highest and can delay LCP images) should be covered separately from the `crossorigin` requirement.
- The correct preload tag template for `templates/preload-link.md` in the stinger: `<link rel="preload" href="/fonts/inter-variable.woff2" as="font" type="font/woff2" crossorigin>`.
