# Guide 1: Svelte 5 support matrix and first decision

Grounded in `references/research/distilled-tanstack.md` §1, `references/svelte-5-support-matrix.md`.

## When to walk this guide

Any time a TanStack library comes up for a SvelteKit project - before writing any code, confirm the library actually has real Svelte 5 support.

## The matrix

| Library | Real Svelte 5 support | Verdict |
|---|---|---|
| Query | Yes, first-class (`@tanstack/svelte-query` v6+, needs Svelte `^5.25.0`) | Use it when the caching/mutation problem it solves is real for the task - see Guide 7 |
| Table | Yes, first-class (`@tanstack/svelte-table` v9+ is Svelte-5-only) | Use it for headless table logic - see Guide 4 |
| Form | Yes, first-class (snippet-based `@tanstack/svelte-form`) | Use it for rich client-side form validation - see Guide 5 |
| Virtual | Yes, official adapter exists | Use it for large-list rendering - verify the exact API shape live before scaffolding, see Guide 6 |
| Router | **No.** No official adapter. Open feature request, unresolved. | Do not use. SvelteKit's file-based router already does this. |
| Start | **No.** No official adapter. Only a zero-adoption, self-described-experimental third-party project exists, which patches TanStack internals. | Do not use. SvelteKit's own SSR/routing/remote functions are the mature equivalent. |

## Say this plainly

If a user asks for TanStack Router or TanStack Start in a SvelteKit context, don't hedge and don't improvise a workaround. State clearly: there is no official Svelte support for either library, SvelteKit already provides the equivalent functionality natively, and the one unofficial adapter that exists for Start is explicitly experimental with documented missing features and internal patches that make it fragile against upstream changes. This is not a judgment call - it's a documented fact from the library maintainers' own GitHub discussions and the third-party adapter's own README.

## Why this matters more than it might seem

Training data and general web search results are full of TanStack Router/Start content because those libraries are popular in the React ecosystem. It is easy to accidentally generalize "TanStack Router is great, use it here too" without checking framework-specific support. This guide exists specifically to interrupt that pattern.
