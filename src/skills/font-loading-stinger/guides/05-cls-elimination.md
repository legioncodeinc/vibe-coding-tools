# 05 - CLS Elimination via Metric-Matched Fallback

## The problem

`font-display: swap` causes the browser to render text in a fallback (system) font, then swap it to the web font when it arrives. If the fallback font has different metrics than the web font (different x-height, ascent, descent, line-gap), the text occupies a different amount of vertical space. When the swap occurs, the browser reflows the layout, shifting elements below the text. This is the primary cause of CLS from fonts.

**The delta is typically small (1-5%) but significant.** CLS is a cumulative metric; even small shifts from fonts compound with other shifts (images, embeds) to push the score above 0.1 (the "needs improvement" threshold).

## The solution: metric-matched fallback

Override the fallback font's metric descriptors in a separate `@font-face` declaration to match the web font's metrics. When the fallback font occupies the exact same vertical space as the web font, the swap becomes invisible: no layout shift.

The four override descriptors:

| Descriptor | What it adjusts | Unit |
|---|---|---|
| `size-adjust` | Scales the entire glyph size | % |
| `ascent-override` | Adjusts space above the baseline | % (of em unit) |
| `descent-override` | Adjusts space below the baseline | % (of em unit) |
| `line-gap-override` | Adjusts the built-in line gap | % (of em unit) |

---

## Workflow: calculate override values

### Option 1: fontpie (automated)

[fontpie](https://github.com/nicholasgasior/fontpie) calculates the override values automatically.

```bash
npm install --global fontpie

fontpie inter-variable-latin.woff2 \
  --name "Inter" \
  --style normal \
  --weight 400
```

Output example:
```
size-adjust: 100%
ascent-override: 90%;
descent-override: 22%;
line-gap-override: 0%;
```

### Option 2: capsizefitter (online tool)

[CapSize](https://seek-oss.github.io/capsizefitter/) is a web-based tool that computes the correct CSS values for both the web font and its fallback. Provide the web font file and select the target fallback system font.

### Option 3: Next.js automated generation

When using `next/font`, specifying `adjustFontFallback` triggers automatic metric calculation:

```typescript
export const brandFont = localFont({
  src: '../public/fonts/brand-variable.woff2',
  adjustFontFallback: 'Arial',  // Next.js calculates size-adjust + overrides for Arial
  fallback: ['Arial', 'sans-serif'],
  display: 'swap',
});
```

Verify the generated CSS in DevTools to confirm `size-adjust` is present.

---

## Code: manual metric-matched fallback `@font-face`

```css
/* Web font */
@font-face {
  font-family: 'Geist';
  src: url('/fonts/geist-variable-latin.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF;
}

/* Metric-matched fallback — uses system font with overridden metrics */
@font-face {
  font-family: 'Geist Fallback';
  src: local('Arial');          /* Use Arial (universally available) */
  size-adjust: 99.3%;
  ascent-override: 96%;
  descent-override: 21%;
  line-gap-override: 0%;
}

/* Usage: both fonts in the stack; browser picks Geist when loaded */
body {
  font-family: 'Geist', 'Geist Fallback', Arial, sans-serif;
}
```

The key: the browser renders text in `Geist Fallback` (which looks like Arial but with Geist's metrics) until Geist loads. When Geist arrives, the swap is invisible because the space occupied is identical.

---

## Verifying with Chrome DevTools

1. Open **DevTools > Performance** panel
2. Record a page load with throttling (e.g., Fast 3G)
3. Look for **Layout Shift** events in the timeline
4. Click any Layout Shift entry → **Layout Shift Clusters** panel shows which elements shifted and the cause
5. Font-caused shifts are labeled "font swap" or reference the font-face

To isolate font CLS:

1. Open **DevTools > Rendering** (⋮ > More tools > Rendering)
2. Enable "Disable local fonts" to force font downloads even if cached
3. Reload and observe CLS

After implementing metric-matched fallbacks, Layout Shift events caused by font swaps should disappear.

---

## The `size-adjust` trick for body copy

For body text using `font-display: optional`, there is no swap (the font either loads within ~100ms or the system font persists). CLS from `optional` is essentially zero.

For body text using `font-display: swap`, you need the full metric-matched fallback approach described above.

**2026 recommendation:**
- Body copy → `font-display: optional` → no metric override needed
- Heading / LCP font → `font-display: swap` + full metric-matched `@font-face` → zero CLS

---

## Common system fonts available for `local()` matching

| System font | Available on | Good fallback for |
|---|---|---|
| `Arial` | All platforms | Sans-serif web fonts |
| `Helvetica Neue` | macOS, iOS | Clean sans-serif fonts |
| `Georgia` | All platforms | Serif web fonts |
| `-apple-system` | macOS, iOS | System UI fonts |
| `BlinkMacSystemFont` | Chrome on macOS | System UI fonts |
| `Segoe UI` | Windows | Sans-serif web fonts |

Use `local('Arial')` as the most universally available option. Avoid platform-specific fonts in the `local()` call because the override values must match what the user's system actually has.

---

## References

- `guides/00-principles.md`: CLS → font-swap consequence chain
- `guides/01-font-display-decision-matrix.md`: why `swap` requires this guide's technique
- `guides/04-nextjs-font.md`: `adjustFontFallback` option in next/font
- `research/external/`: fontpie, capsizefitter, web.dev CLS, Chrome DevTools font rendering
- `examples/edge-case-self-hosted-variable.md`: full implementation including fontpie values
