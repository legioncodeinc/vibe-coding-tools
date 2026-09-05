---
source_url: https://github.com/pixel-point/fontpie
retrieved_on: 2026-05-20
source_type: github-readme
authority: official
relevance: critical
topic: cls
stinger: font-loading-stinger
---

# fontpie - CLI-generated metric-override CSS (GitHub)

## Summary
Official README for `fontpie` by Pixel Point, a framework-agnostic CLI tool
that reads a web font file (WOFF2, WOFF, OTF, TTF) and outputs the complete
`@font-face` CSS for the metric-adjusted fallback font. Uses the same
ascent-override/descent-override/line-gap-override/size-adjust algorithm as
Next.js `adjustFontFallback`, wrapped in a one-command workflow. Created by the
same team (Pixel Point) that builds for Next.js/Vercel.

## Key quotations / statistics

- One-command workflow:
  ```bash
  npx fontpie ./roboto-regular.woff2 --name Roboto
  ```

- Output CSS:
  ```css
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url('roboto-regular.woff2') format('woff2');
  }
  @font-face {
    font-family: 'Roboto Fallback';
    font-style: normal;
    font-weight: 400;
    src: local('Times New Roman');
    ascent-override: 84.57%;
    descent-override: 22.25%;
    line-gap-override: 0.00%;
    size-adjust: 109.71%;
  }
  html {
    font-family: 'Roboto', 'Roboto Fallback';
  }
  ```

- CLI options:
  - `--fallback <font-family>`: `"serif"` | `"sans-serif"` | `"mono"`, default `"sans-serif"`
  - `--style <style>`: font-style value, default `"normal"`
  - `--weight <weight>`: font-weight value, default `"400"`
  - `--name <name>`: font-family value

- Default fallback fonts: Serif → Times New Roman, Sans-Serif → Arial,
  Monospace → Courier New

- Browser compatibility for metric override properties (as of tool release):
  - Chrome ✅ 87+, Edge ✅ 87+, Firefox ✅ 89+, Opera ✅ 73+, Safari ❌
  - Note: Safari support for `size-adjust` was added in Safari 17 (2023):
    check current status for 2026 production usage.

## Annotations for stinger-forge

- `fontpie` is the **primary tool recommendation** for
  `guides/05-cls-elimination.md` for non-Next.js projects or `next/font/local`
  users who want to verify the automatically generated values.
- The output CSS template maps exactly to `templates/font-face-block.md`:
  use fontpie's output as the canonical template shape.
- Safari compatibility note: the tool's README shows Safari ❌ at time of
  writing (2022), but `size-adjust` landed in Safari 17 (September 2023).
  The 2026 guide should verify current Safari support and note it as
  baseline-supported.
- The `--fallback mono` option for monospace fonts is not covered in most
  guides, worth noting for monospace web font use cases (code blocks).
- This tool was created by Pixel Point, the same company that contributed the
  Next.js `adjustFontFallback` implementation.
