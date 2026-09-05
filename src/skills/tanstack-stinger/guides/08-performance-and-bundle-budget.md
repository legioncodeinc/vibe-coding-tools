# Guide 8: Performance and bundle budget

Grounded in `references/research/distilled-tanstack.md` §6, `references/research/raw/tanstack--query--devtools-and-bundle-size.md`.

## When to walk this guide

Deciding whether to add a TanStack library, or auditing an existing app's bundle for TanStack-related weight.

## TanStack Query's baseline cost

Importing `createQuery` + `QueryClient` + `QueryClientProvider` + `useQueryClient` costs roughly **10.44 KB gzipped** as a floor, per a TanStack maintainer's own analysis - `QueryClient` is a class and classes don't tree-shake, so this cost is effectively mandatory the moment the app imports the library at all, regardless of how many queries actually run. This is not large in absolute terms, but it's not free either, and it's the number to weigh against Guide 7's decision rule when a page's actual data needs are simple.

## TanStack Table's opt-in feature model

v9's `tableFeatures({...})` registration means unused features (grouping, faceting, resizing, pinning) don't cost bundle weight if they're never registered. This matters more the simpler a given table's actual requirements are - a read-only, unsortable table shouldn't register sorting/filtering/pagination row models it never uses.

## Virtualization is opt-in, not default

Don't add `@tanstack/svelte-virtual` preemptively - it's a separate dependency and a real complexity increase (row measurement, scroll container sizing). Reach for it when row count is actually large enough to matter, not as a default pattern for every table or list. See Guide 6.

## Devtools cost

`@tanstack/svelte-query-devtools` / `@tanstack/svelte-devtools` are dev-only tooling - make sure they're excluded from production bundles (standard Vite/SvelteKit dev-dependency and conditional-import practices apply; this skill's research didn't need to re-derive that since it's a general bundler concern, not a TanStack-specific one).

## The real budget question

The right question isn't "how much does TanStack Query cost in isolation" - it's "does this page's actual data-fetching complexity justify ~10KB+ plus a second data-fetching mental model on top of SvelteKit's free-with-the-framework `load`/remote functions." See Guide 7 for the concrete decision rule. Apply the same reasoning per-library: Table and Form both have real, justified use cases (headless table logic and rich form validation are genuinely hard to hand-roll well), but that doesn't mean every table needs the library or every form needs rich client validation.

## Common mistakes

- Adding TanStack Query to a small app with simple, non-shared page data purely out of habit.
- Registering TanStack Table features "just in case" rather than what the table actually uses.
- Shipping devtools packages to production because the exclusion wasn't explicitly checked.
