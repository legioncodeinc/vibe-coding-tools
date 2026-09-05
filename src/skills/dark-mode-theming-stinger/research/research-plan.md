---
depth_tier: normal
time_window: 2025-11 to 2026-05
page_budget: 25
conducted_by: scripture-historian (inline synthesis for slot-mode)
date: 2026-05-20
---

# Research Plan: dark-mode-theming-stinger

## Depth tier

**Normal**: standard 25-page budget, 6-month time window, five primary queries.

## Query plan

| # | Query | Status |
|---|-------|--------|
| 1 | "next-themes flash prevention 2026" | synthesized |
| 2 | "CSS variables dark mode tokens 2026" | synthesized |
| 3 | "Tailwind v4 dark mode 2026" | synthesized |
| 4 | "Multi-brand theme runtime swap 2026" | synthesized |
| 5 | "System color scheme detect SSR 2026" | synthesized |

## Source plan

- `next-themes` GitHub repo and issues (FOWT edge cases, App Router compatibility)
- Tailwind CSS docs for v4 dark-mode configuration (Oxide engine, `@custom-variant`)
- MDN `prefers-color-scheme` spec
- web.dev color-scheme and CSS custom properties articles
- CSS-Tricks dark-mode comprehensive guide
- Next.js App Router docs for layout/script ordering

## Open questions going into synthesis

1. Does `next-themes` v3.x (2026) fully support App Router without extra workarounds?
2. What is the canonical CSP-safe pattern for the FOWT inline script?
3. Does Tailwind v4 Oxide engine change how `darkMode: 'class'` works vs. v3?
4. Is there a zero-`next-themes` pattern for simple apps that avoids the dependency?
5. What is the recommended server-cookie strategy for SSR-matched first paint?
