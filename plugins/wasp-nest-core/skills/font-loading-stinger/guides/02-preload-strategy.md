# 02 - Preload Strategy

## What preloading does (and when it helps)

`<link rel="preload" as="font">` raises a font file's fetch priority to **Highest** in the browser's fetch scheduler. This causes the browser to begin downloading the font before it processes the `<style>` or `@font-face` rule that would normally trigger the download.

Preloading helps when:
- The font file is critical-path for above-the-fold text
- The font would otherwise be discovered late (buried inside a CSS file the browser parses after layout)
- LCP is a font-rendered text element and the font is on a CDN with high latency

Preloading does NOT help when:
- The font is already loaded quickly via CDN with HTTP/2 push
- The font file is large and you haven't subsetted it (preloading a 600kB variable font is worse than not preloading it)
- The font is below the fold (wasted Highest-priority slot)

---

## The correct `<link rel="preload">` markup

```html
<!-- correct: all three attributes required -->
<link
  rel="preload"
  href="/fonts/inter-variable-latin.woff2"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
/>
```

**All three attributes are non-negotiable:**

| Attribute | Required? | Why |
|---|---|---|
| `as="font"` | Yes | Tells the browser this is a font fetch; sets correct priority and CORS mode |
| `type="font/woff2"` | Strongly recommended | Prevents fetching the file on browsers that don't support WOFF2 |
| `crossorigin="anonymous"` | Yes | Font fetches are CORS requests. Without this, the browser fetches the font twice: once for preload (without CORS headers) and once for the actual `@font-face` rule (with CORS headers). The preload is wasted. |

**The `crossorigin` double-fetch gotcha** is the single most common preload bug. If the Chrome DevTools network panel shows a font loading twice, missing `crossorigin` is almost always the cause.

---

## How many fonts to preload

**The rule: preload at most 2-3 font files.**

Each preloaded font is assigned **Highest** fetch priority. The browser's scheduler can only meaningfully prioritize a finite number of Highest-priority requests simultaneously. When you preload 4+ fonts, they compete with each other and with LCP images (which are also Highest priority). The result is priority inversion: your LCP image is delayed because it's competing with font files you told the browser were equally urgent.

**Practical guidance:**
- Preload the font file for the primary body text (usually used at largest volume)
- Preload the font file for the above-the-fold heading (LCP element)
- Do not preload supplementary weights, italic variants, or below-the-fold fonts

---

## Which format to preload

Always preload WOFF2. It is supported in all modern browsers (Chrome 36+, Firefox 39+, Safari 12+, Edge 14+). WOFF2 offers the best compression (typically 20-30% smaller than WOFF). Do not preload TTF or OTF for web use.

For variable fonts: there is one WOFF2 file for the entire weight axis. Preload that single file.

---

## `preload` vs `modulepreload` vs `prefetch`

| Directive | Use for | Priority | When fetched |
|---|---|---|---|
| `rel="preload"` | Critical fonts for current page | **Highest** | Immediately |
| `rel="prefetch"` | Fonts needed on the next page | Low | When browser is idle |
| `rel="modulepreload"` | ES module scripts | High | Immediately |

For fonts, `rel="preload"` is always correct. `prefetch` is appropriate for pre-loading a font for a page the user is likely to navigate to next (e.g., prefetch the product page font on the landing page).

---

## Google Fonts preload pattern

When using Google Fonts directly (without `next/font`), you must preload the CSS first, then the font file:

```html
<!-- Step 1: preconnect to Google Fonts origins -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Step 2: load the font stylesheet (ideally with display=swap) -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
```

**Note:** `next/font` handles all of this automatically (preconnect, preload, font-display, subsetting). If you are in a Next.js project, use `next/font` instead of manual Google Fonts links. See `guides/04-nextjs-font.md`.

---

## Self-hosted font preload pattern

```html
<head>
  <!-- Preload the two most critical font files only -->
  <link
    rel="preload"
    href="/fonts/inter-variable-latin.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
  />
  <link
    rel="preload"
    href="/fonts/geist-variable-latin.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
  />
</head>
```

---

## Audit checklist: preload correctness

When auditing an existing project, verify each `<link rel="preload" as="font">` tag:

- [ ] Has `crossorigin="anonymous"` or `crossorigin` (without value is also valid, both mean anonymous)
- [ ] Has `type="font/woff2"` (not `type="font/ttf"` or omitted)
- [ ] Points to the correct WOFF2 file (not a CSS stylesheet)
- [ ] Is ≤ 3 preload hints total
- [ ] Corresponds to a font that actually renders above-the-fold text
- [ ] No font is double-fetched (check DevTools Network > Fonts)

---

## References

- `guides/00-principles.md`: why font fetches have CORS requirements
- `guides/01-font-display-decision-matrix.md`: which fonts are critical-path (worth preloading)
- `guides/04-nextjs-font.md`: how `next/font` automates preloading
- `research/external/`: web.dev font best practices, Chrome DevTools font rendering
- `examples/happy-path-nextjs-inter.md`: shows preload in context (or notes why next/font makes manual preload unnecessary)
