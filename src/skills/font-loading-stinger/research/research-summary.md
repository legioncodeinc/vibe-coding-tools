# Research Summary: font-loading-stinger

- **Depth tier consumed:** normal
- **Time window covered:** 2024-08-01 to 2026-05-20 (~9 months, anchored to
  most recent 6 months with 2024 sources included where no 2025-2026 equivalent
  exists for the specific technique)
- **Files written:** 21 total (20 external sources, 1 internal cross-reference)
- **Subfolders:** `external/` (20 files), `internal/` (1 file)

---

## The 5 Most Influential Sources

### 1. web.dev/articles/font-best-practices (official, critical)
**Why it matters:** Google's canonical 2026 best practices document. Contains
the authoritative `font-display` period table (block/swap/fallback/optional with
exact ms values), the combined `swap`+`optional` strategy recommendation, the
"use only WOFF2" directive, and the `size-adjust` mention. `stinger-forge` should
use this as the primary citation throughout all guides.

### 2. nextjs.org/docs/app/api-reference/components/font (official, critical)
**Why it matters:** Answers one of the two open questions from the Command Brief:
**Does `next/font` v15 handle `size-adjust` fallback generation automatically?**
YES. `adjustFontFallback` is `true` by default for `next/font/google` (Arial or
Times New Roman chosen based on font type). For `next/font/local`, default is
`'Arial'`. This means `guides/04-nextjs-font.md` can inform users they get CLS
elimination for free when using `next/font`.

### 3. developer.chrome.com/blog/framework-tools-font-fallback (official, critical)
**Why it matters:** The definitive source for framework-level CLS elimination.
Contains the exact generated `@font-face` CSS for Inter/Arial fallback
(ascent: 90.20%, descent: 22.48%, size-adjust: 107.40%), the 18% of Next.js
swap sites with poor CLS statistic, and the Capsize `createFontStack` API.
Covers three automation paths: Next.js built-in / Fontaine (Nuxt+Vite) / Capsize.

### 4. github.com/pixel-point/fontpie (official, critical)
**Why it matters:** The `fontpie` CLI provides the zero-setup path for framework-
agnostic metric override CSS generation. One command (`npx fontpie ./font.woff2
--name FontName`) outputs production-ready `@font-face` CSS. This is the
recommended tool for `next/font/local` users who want to verify override values
and for non-Next.js projects. Safari had no support at tool release (2022) but
gained `size-adjust` support in Safari 17 (Sep 2023): 2026 guide should verify.

### 5. font-converters.com/news/core-web-vitals-font-loading-2026 (practitioner, critical)
**Why it matters:** The only 2026-dated comprehensive performance guide. Reports
font loading causes 23% of LCP failures. Provides the 7-item complete 2026
optimization checklist including `fetchpriority="high"` on the primary body font
preload and the "optional for LCP-critical hero headings" recommendation.
Published February 2026, highest-recency practitioner source.

---

## Open Questions Resolved

**Q: Is `font-display: optional` now the correct default for non-critical body
copy in 2026?**

**Answer:** The 2026 consensus is nuanced:
- `optional` is zero-CLS but the custom font only displays if it's cached or
  arrives within ~100ms. On first visit, users see the fallback forever.
- `swap` is now the preferred default for body copy when paired with metric-
  matched fallback overrides (`size-adjust` + `ascent-override`): the CLS is
  eliminated by CSS, not by avoiding the swap.
- `optional` + `<link rel="preload">` is the gold standard for zero-jank with
  a chance of showing the web font (Chrome 83+ eliminates the double render
  cycle when `optional` is preloaded).
- For LCP-critical hero headings: `optional` prevents late font-swap events from
  delaying LCP recalculation (2026 checklist recommendation).
- **Decision matrix for `guides/01-font-display-decision-matrix.md`:**
  - Body copy: `swap` + metric overrides (most common)
  - Performance-critical / slow connections: `optional` (font may never display)
  - Hero headings (LCP element): `optional` or `swap` + early preload
  - Icon fonts: `block` (invisible glyphs on fallback are meaningless)

**Q: Does `next/font` v15 handle `size-adjust` fallback generation
automatically?**

**Answer:** YES, confirmed. `adjustFontFallback` defaults to `true` for
`next/font/google` and `'Arial'` for `next/font/local`. This has been the
behavior since v13 (`@next/font` introduction). Users of `next/font` get
automatic CLS-safe fallback CSS without any manual metric calculation.

---

## Open Questions That Survived Research

1. **Safari `size-adjust` support in 2026:** fontpie's README shows Safari ❌,
   but `size-adjust` landed in Safari 17 (September 2023). `stinger-forge` should
   check current MDN compatibility table for `size-adjust`, `ascent-override`,
   `descent-override`, and `line-gap-override` for the 2026 guide.

2. **Next.js 15/16 `next/font` API changes:** The research confirms the
   `adjustFontFallback` feature from v13, but there may be new options or
   behavior changes in Next.js 15/16. `stinger-forge` should check the Next.js 15
   and 16 changelogs for `next/font` updates.

3. **`font-display` default behavior in 2026 browsers:** The `auto` value is
   described as "varies by browser" but current sources say Chrome/Firefox
   behave like `block` (~3s). `stinger-forge` should verify if any 2025/2026
   browser has changed the `auto` default.

4. **Subfont tool:** The Command Brief mentions `subfont` as a subsetting
   automation tool. Research found glyphhanger and pyftsubset extensively but
   did not specifically surface `subfont` documentation. `stinger-forge` should
   check `subfont` (npmjs.com/package/subfont) for current 2026 maintenance
   status.

---

## Sources stinger-forge should re-fetch with deeper context

- **https://nextjs.org/docs/app/api-reference/components/font**: the full API
  reference has more options (`adjustFontFallback`, `variable`, `preload` flag)
  than covered here. `stinger-forge` should read the complete table.
- **https://capsizefitters.vercel.app/**: listed in the Command Brief as a
  reference but not found in search results as a guide. `stinger-forge` should
  fetch this URL directly to understand the Capsize online tool workflow vs the
  `@capsizecss/core` npm API.
- **https://github.com/nicholasgasior/fontpie**: the Command Brief links to
  this repo, but the fontpie tool is actually at `github.com/pixel-point/fontpie`.
  There may be a naming confusion; `stinger-forge` should verify the correct repo.

---

*Generated by scripture-historian on 2026-05-20.*
*Ready for stinger-forge.*
