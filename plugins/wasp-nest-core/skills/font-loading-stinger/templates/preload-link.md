# Template: `<link rel="preload">` for Fonts

Place in `<head>` before any stylesheets. Use for critical fonts only (≤ 3 total).

---

## WOFF2 font (self-hosted or CDN)

```html
<link
  rel="preload"
  href="{{/fonts/font-name-latin.woff2}}"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
/>
```

All three attributes are required. See `guides/02-preload-strategy.md` for why each is non-negotiable.

## next/font equivalent

```typescript
// In next/font, preload is handled automatically.
// Ensure preload: true (default) is not overridden to false.
const inter = Inter({
  subsets: ['latin'],
  display: 'optional',
  preload: true,  // default; generates <link rel="preload"> with correct crossorigin
});
```

---

## Checklist before using this template

- [ ] This font renders above-the-fold, critical-path text (LCP candidate or hero text)
- [ ] You have ≤ 2 other font preloads in `<head>` already
- [ ] The href points to the subsetted WOFF2 (not the full font file)
- [ ] You have NOT used `next/font` (which handles preload automatically)
