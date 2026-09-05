# State Libraries: Opinionated Decision (Zustand / Jotai / Redux Toolkit)

**Sources:**
- https://github.com/pmndrs/zustand
- https://jotai.org/
- https://redux-toolkit.js.org/
- https://dev.to/jsgurujobs/state-management-in-2026-zustand-vs-jotai-vs-redux-toolkit-vs-signals-2gge
- WebSearch: "Zustand vs Jotai vs Redux Toolkit 2026 decision tree"

**Retrieved:** 2026-04-24

## Summary

For client-side global UI state in 2026, **Zustand is the default**. Jotai for fine-grained atomic state in form builders / spreadsheets / derived graphs. Redux Toolkit when the team is very large or the product needs time-travel debugging / Redux DevTools / legacy ecosystem.

Server state goes to TanStack Query, **never** to Zustand/Jotai/Redux. Form state goes to React Hook Form. URL state goes to nuqs (or router params). Component state stays in `useState`/`useReducer`.

## The opinionated call

| Situation | Pick |
|---|---|
| Default global UI state | **Zustand** |
| Dozens of interdependent small atoms (builder UIs) | **Jotai** |
| Large team (>15), strict patterns demanded, heavy middleware/sagas | **Redux Toolkit** |
| Server cache | **TanStack Query** (not a general state lib) |
| URL state | **nuqs** (Next.js/React) |
| Forms | **React Hook Form + Zod** |

## Why Zustand by default

- Hook-based API, no provider wrapping.
- Tiny bundle (~1 KB).
- Selectors prevent re-renders.
- Immer middleware for ergonomic mutations.
- Works identically in Next.js App Router (with per-request store factory).

## Why NOT Context for global state

- No selector support: every consumer re-renders on any update.
- `use-context-selector` exists but adds complexity; Zustand's selectors are built-in.
- Context is fine for *low-velocity* data (theme, locale, auth-user object). For anything that updates often, reach for Zustand.

## Relevance to this stinger

Spine of `guides/03-state-management.md` decision tree. This is where "Opinionation is the product" shows up hardest: the Bee says "Zustand" and cites this file.
