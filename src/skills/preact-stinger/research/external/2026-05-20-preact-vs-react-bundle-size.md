---
source_type: blog
authority: high
relevance: high
topic: bundle-size
url: https://preactjs.com/about/project-goals
---

# Preact vs React Bundle Size: Real Numbers

## Sizes (gzipped, 2026)

| Library | Min+Gzip | Notes |
|---|---|---|
| preact | ~3 KB | core only |
| preact + signals | ~6 KB | core + @preact/signals |
| react + react-dom | ~40 KB | production build |
| preact/compat | ~5 KB additional | on top of preact core |

## Parse time (4x CPU throttle, Moto G4 class device)

- React + ReactDOM: ~120ms parse time
- Preact: ~12ms parse time

**10x parse-time difference matters for third-party embeds** loaded on pages with budget constraints.

## When Preact wins

1. **Third-party embed widget**: you don't control the host page; every byte affects host LCP. Target < 10KB total bundle including styles.
2. **Preact Signals as the state model**: if signals-first reactivity is the goal and React's scheduler overhead is undesirable.
3. **Fresh / Deno Deploy project**: Fresh is Preact-native; using React requires more configuration.
4. **Astro islands with aggressive budgets**: each island loads independently; 3KB vs 40KB multiplies per island.
5. **Legacy CMS embed (no build step)**: Preact has official CDN/IIFE builds under 10KB total.

## When React is still better

1. **Server Components (RSC)**: Preact has no RSC implementation. If you need RSC, use React.
2. **Ecosystem dependency on React internals**: any library using `react-dom/client` directly won't work under compat.
3. **Team on React**: switching costs usually exceed bundle savings at > 50KB app sizes.
4. **Next.js App Router**: `preact/compat` + Next.js App Router is a known footgun (RSC incompatibility).
5. **React 19 `use()` hook or Concurrent Mode**: not supported by preact/compat.

## Decision threshold

Rule of thumb: Preact pays off when the rendered page budget is < 50KB total JS, or when the widget must not conflict with the host page's React version.
