# Guide 00: When to Choose Preact

> Source: `research/external/2026-05-20-preact-vs-react-bundle-size.md`

Preact is the right choice in a small number of concrete scenarios. This guide is the entry point for all `preact-worker-bee` invocations involving evaluation or architecture decisions. Read it before any other guide.

---

## The honest tradeoff matrix

| Factor | Preact wins | React wins |
|---|---|---|
| Bundle size target | < 50KB total JS budget | No hard budget |
| Third-party embed | Yes: 3KB vs 40KB matters for host page LCP | No embed context |
| Signals as state model | Yes: native support, no extra plumbing | `@preact/signals-react` available but awkward |
| Astro islands | Works well, < 5KB per island | Works well, ~40KB per island |
| Fresh / Deno | Fresh is Preact-native | React not native to Fresh |
| React Server Components | No (BLOCKED with compat) | Yes: only React supports RSC |
| Next.js App Router | NO (footgun) | Yes |
| Ecosystem compatibility | Good for stable hooks (useState, useEffect, etc.) | Complete |
| React 19 `use()` hook | Not supported | Yes |
| `useTransition` / Concurrent Mode | Not supported | Yes |
| Team familiarity | Cost: learning signals mental model | Lower switching cost |

## When Preact is the correct choice (the rare cases)

1. **Third-party embed widget** where you don't control the host page and need < 10KB total bundle.
2. **Signals-first architecture** where you want reactive values without React's vdom diffing overhead and are building a greenfield project.
3. **Fresh 2.x project**: Fresh is Preact-native; using React requires more configuration.
4. **Aggressive Astro island budget**: each island loads independently, so 3KB vs 40KB multiplies per island.
5. **Legacy CMS embed (no build step)**: Preact has official CDN/IIFE builds under 10KB.

## When React is still better (the common case)

1. **React Server Components are required**: Preact has no RSC implementation.
2. **Next.js App Router**: `preact/compat` + App Router is a documented footgun.
3. **React 19 features** (`use()`, `useTransition`, Concurrent Mode): not supported by compat.
4. **Team on React**: switching costs usually exceed bundle savings at > 50KB app sizes.
5. **Third-party libs using React internals**: `react-dom/client` directly, Context in non-standard ways, etc.
6. **Ecosystem libraries requiring `@types/react`**: compat type conflict is a real maintenance burden.

## The "is it worth it?" decision heuristic

Ask three questions:
1. Do you have a concrete bundle-size constraint (embed, strict budget)?
2. Do you want signals-first reactivity as the primary model?
3. Are you in a Deno/Fresh or signals-heavy Astro context?

If none of these are true, use React. Preact's switching costs (team familiarity, compat surface, ecosystem gaps) rarely pay off without a concrete driver.

## The `@preact/signals-react` middle path

If the team wants signals but isn't ready to switch to Preact, `@preact/signals-react` 3.10.1 (May 2026) provides the signals primitives in a React codebase. This is a valid incremental path before a full Preact migration.

> See `research/external/2026-05-20-signals-api-v2-guide.md` for the signals API.
