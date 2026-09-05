# Research Summary: icon-system-stinger

**Depth consumed:** normal  
**Time window:** 2025-11 to 2026-05  
**Files written:** 6 source notes (1 internal, 5 external)

## Five most influential sources

1. **Lucide React docs + changelog (2026)**: Lucide v0.400+ ships ESM-only named exports; every icon is a separate module in the `lucide-react` package, guaranteeing per-icon tree-shaking via standard named imports. No path-import workaround needed in Vite or Next.js 15+. (`research/external/lucide-react.md`)

2. **Iconify React docs (2026)**: `@iconify/react` ships an `Icon` component that loads icons either from a bundled collection (static import) or from the Iconify CDN/API at runtime. The static-import variant (`@iconify/react` + `@iconify/icons-*`) is compatible with RSC because it performs no browser-side network call. The `addAPIProvider` CDN variant requires `"use client"`. (`research/external/iconify-react.md`)

3. **SVG sprite vs tree-shake analysis (2026)**: For projects with 50-200 icons, inline named imports produce comparable or smaller bundles than hand-crafted SVG sprites, because modern bundlers deduplicate SVG content across modules. SVG sprites win when the same icon set is needed in multiple unrelated chunks (e.g., a micro-frontend architecture) or when SSR + client hydration must use the same sprite reference. (`research/external/icon-sprite-patterns.md`)

4. **WAI-ARIA APG + Deque icon patterns (2026)**: The canonical three-category model (decorative / semantic / interactive) remains the accessibility contract. Icon buttons must have an accessible name via `aria-label` on the `<button>` or via visually-hidden `<span>` inside it; the SVG itself should be `aria-hidden="true"` and `focusable="false"` regardless. (`research/external/icon-accessibility.md`)

5. **Heroicons / Tabler / Phosphor comparison (2026)**: Heroicons v2 ships ESM with full tree-shaking; aligns with Tailwind CSS design language. Tabler provides 5500+ icons with consistent stroke widths; good for admin UIs. Phosphor provides 1300+ icons across 6 weight variants (thin/light/regular/bold/fill/duotone); well-suited to design-system-heavy products. All three are pure ESM packages in 2026. (`research/external/heroicons-tabler-phosphor.md`)

## Five open questions

1. **Dynamic RSC boundary for icon loading**: When an icon name arrives as a prop in an RSC, and the icon set is large, what is the correct pattern: static map at build time, or client component wrapper? The answer depends on whether the icon name is known at build time. Flag in `guides/02-dynamic-import-icon-name.md`.

2. **Iconify API rate limits for self-hosted apps**: The public Iconify API has no documented rate limit as of 2026-05 but Iconify recommends self-hosting the API server for production apps. This is out of scope for this stinger but should be flagged in the library-selection matrix.

3. **`vite-plugin-svgr` vs `@svgr/webpack` in Next.js 15**: Next.js 15 still ships with Webpack as the default for non-Turbopack builds; SVGR configuration differs. The guides should cover both.

4. **Lucide strict-mode export names**: Lucide icons follow PascalCase (`<ArrowRight />`); the dynamic-import pattern requires a runtime map or eval that is safe. The safe map approach is documented; confirm the exhaustive-type approach compiles within a 50-icon budget.

5. **Phosphor weight variants and bundle size**: Each Phosphor weight is a separate import path; importing the same icon at two weights doubles the bundle cost. Flag as an anti-pattern in `guides/01-tree-shake-vs-sprite.md`.

## Sources to re-fetch if needed

- Lucide React CHANGELOG.md on GitHub (version > 0.400 release notes)
- Iconify documentation page for `@iconify/react` static import mode
