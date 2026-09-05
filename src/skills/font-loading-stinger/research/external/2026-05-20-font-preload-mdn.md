---
source_url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preload
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: preload
stinger: font-loading-stinger
---

# rel="preload" HTML attribute - MDN Web Docs (Updated April 2026)

## Summary
MDN specification reference for `<link rel="preload">`. Documents the `as`,
`type`, and `crossorigin` attributes, the CORS requirement for fonts, and the
distinction between preload and prefetch. Confirms that font files require
anonymous CORS mode and that omitting `crossorigin` on a font preload causes a
wasted double-fetch. Updated April 22, 2026.

## Key quotations / statistics

- "Note: `font` and `fetch` preloading requires the `crossorigin` attribute to
  be set; see CORS-enabled fetches below."

- Correct font preload syntax:
  ```html
  <link
    rel="preload"
    href="fonts/cicle_fina-webfont.woff2"
    as="font"
    type="font/woff2"
    crossorigin />
  ```

- "Because of various reasons, these [font files] have to be fetched using
  anonymous-mode CORS."

- "The attribute needs to be set to match the resource's CORS and credentials
  mode, even when the fetch is not cross-origin."

- "When preloading resources that are fetched with CORS enabled (e.g., fetch(),
  XMLHttpRequest or fonts), special care needs to be taken to setting the
  `crossorigin` attribute on your `<link>` element."

- "Therefore, specifying preloading for multiple types of the same resource is
  discouraged. Instead, the best practice is to specify preloading only for the
  type the majority of your users are likely to actually use."

## Annotations for stinger-forge

- This is the **spec citation** for `guides/02-preload-strategy.md`. The
  anonymous CORS mode requirement is the primary reason the `crossorigin`
  attribute is mandatory even for same-origin fonts.
- The `type="font/woff2"` attribute helps browsers skip unsupported formats:
  should be included in `templates/preload-link.md`.
- The "no multiple types" guidance supports the "preload only WOFF2" directive
  in the 2026 performance checklist.
- Updated April 2026: reflects current browser behavior.
