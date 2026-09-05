# Distilled research: TanStack for SvelteKit (Svelte 5)

Research window: single sweep, 2026-08-14. Stack context: SvelteKit (Svelte 5), deployed on Vercel, Neon Postgres. Every claim cites its raw source. Where a library has no real Svelte 5 support, this document says so plainly rather than inventing usage.

## 1. Svelte 5 support status by library - read this table before anything else

| Library | Official Svelte adapter? | Package | Svelte version requirement | Status |
|---|---|---|---|---|
| **Query** | Yes | `@tanstack/svelte-query` | `^5.25.0` (v6 adapter) | First-class, runes-native as of v6. `[raw/tanstack--query--svelte-overview-and-runes-migration.md]` |
| **Table** | Yes | `@tanstack/svelte-table` | v9 (latest) is **Svelte 5 only**; v8 for Svelte 3/4 | First-class, runes-native state via TanStack Store atoms in the newer `createTable` API. `[raw/tanstack--table--svelte-adapter-and-runes-state.md]` |
| **Form** | Yes | `@tanstack/svelte-form` | Svelte 5 (snippet-based API) | First-class, built on Svelte 5 snippets. `[raw/tanstack--form--svelte-quickstart-and-validation.md]` |
| **Virtual** | Yes | `@tanstack/svelte-virtual` | Not independently confirmed in this pass; treat as Svelte 5-current given sibling adapters' cutover | First-class per docs existing, but this pass didn't archive a full usage example - verify before scaffolding. `[raw/tanstack--virtual--svelte-adapter.md]` |
| **Router** | **No** | none | N/A | **No official Svelte adapter exists.** Open GitHub feature request since at least 2024, still unresolved as of the most recent archived activity (May 2026). One unofficial, unmerged community fork exists, explicitly experimental. `[raw/tanstack--router--no-official-svelte-support.md]` |
| **Start** | **No** | none | N/A | **No official Svelte adapter exists.** One third-party, zero-adoption (0 GitHub stars), self-described-experimental adapter exists (`jonask-028/tanstack-svelte-start-adapter`), created 2026-02-11, relies on runtime patches to TanStack's own internals, with documented missing features. `[raw/tanstack--start--unofficial-svelte-adapter.md]` |

**Say this plainly to any user asking about TanStack Router or TanStack Start in a SvelteKit project: don't use them.** SvelteKit already ships an official, mature, file-based router and full-stack SSR/server-function story as core framework features (see §5). There is no real gap for either library to fill on this stack, and the only Svelte-targeting code that exists for either is unofficial and admittedly incomplete.

## 2. TanStack Query in SvelteKit

### The "wrap in a function" convention

`createQuery`, `createMutation`, and `createForm` (Form's `createForm`) all require their options be **wrapped in a function** (e.g. `createQuery(() => ({ queryKey, queryFn }))`), not passed as a plain object. This is the single biggest divergence from React Query muscle memory and the most common source of "not reactive" bugs when porting knowledge across frameworks. `[raw/tanstack--query--svelte-overview-and-runes-migration.md]` `[raw/tanstack--form--svelte-quickstart-and-validation.md]`

### SSR setup - disable on server, prefetch deliberately

```ts
// +layout.ts
const queryClient = new QueryClient({
  defaultOptions: { queries: { enabled: browser, staleTime: 60 * 1000 } },
});
```
`enabled: browser` stops automatic query execution server-side (SvelteKit SSRs by default and an unguarded query would otherwise keep running async after the HTML ships) without disabling `prefetchQuery`. `[raw/tanstack--query--sveltekit-ssr-prefetching.md]`

Two prefetch patterns, not equally good:
| Pattern | Setup cost | Best for |
|---|---|---|
| `initialData` from any `load` (universal or server) | Low | Single, shallow, one-off query |
| `prefetchQuery` + pass `queryClient` through **universal** `load` only | Higher | Multiple consumers of the same query, accurate `dataUpdatedAt`, no prop-drilling |

`prefetchQuery` will **not** work through `+page.server.ts`/`+layout.server.ts` - must go through `+page.ts`/`+layout.ts`. `[raw/tanstack--query--sveltekit-ssr-prefetching.md]`

### Query client setup, invalidation, mutations, optimistic updates

Standard `QueryClientProvider` wraps the app near the root. `queryClient.invalidateQueries({ queryKey: [...] })` is the addressable cache-invalidation call, most often fired from a mutation's `onSettled`. `createMutation`'s Svelte implementation is confirmed rune-native from source (`$state`-backed proxy, `$effect.pre` subscriptions) - not a stores-compatibility shim. `[raw/tanstack--query--mutations-optimistic-updates.md]`

Two optimistic-update strategies, both valid, pick per use case:
1. Direct cache write in `onMutate` (`setQueryData`) + snapshot/rollback in `onError` - best when multiple components must reflect the change.
2. Read the mutation's own `variables` while pending, render optimistic UI locally - simpler, single-component-tree only. `useMutationState` lets other components read in-flight variables by `mutationKey`.
`[raw/tanstack--query--mutations-optimistic-updates.md]`

### Devtools

Two install paths exist - pick one: standalone `@tanstack/svelte-query-devtools` (`<SvelteQueryDevtools />` near the app root), or the newer unified `@tanstack/svelte-devtools` shell with `SvelteQueryDevtoolsPanel` as a plugin. The Svelte plugin API uses a `component` prop (real Svelte component reference), not React's `render` (JSX) - a genuine adapter-shape difference, not an inconsistency. `[raw/tanstack--query--devtools-and-bundle-size.md]`

### Bundle cost

Baseline cost for `useQuery`/`createQuery` + `QueryClient` + provider + `useQueryClient`/`useQueryClient` equivalents: **~10.44 KB gzipped**, described by a TanStack maintainer as "likely the bare minimum" since `QueryClient` is a non-tree-shakeable class that's always required. v5-generation code (which the Svelte v6 adapter's core sits on) is ~10% smaller than v4 from dropping legacy-browser support. `[raw/tanstack--query--devtools-and-bundle-size.md]`

## 3. TanStack Table with Svelte 5 runes

Two API generations coexist in current docs - **don't mix them per table**:
| Generation | Function | State model |
|---|---|---|
| Older/stable | `createSvelteTable(options)` | Often paired with a `writable` store; Svelte 4 idioms (`svelte:component`, `on:click`) appear in official examples |
| v9 (latest) | `createTable({ features, columns, data })` | TanStack Store atoms; Svelte adapter installs rune-based reactivity automatically |
`[raw/tanstack--table--svelte-adapter-and-runes-state.md]` `[raw/tanstack--table--sorting-filtering-pagination-example.md]`

v9 features (sorting, filtering, pagination, grouping, faceting, pinning, resizing) are **opt-in via `tableFeatures({...})`**, not bundled by default - smaller bundles, more accurate TypeScript types, but every feature used must be explicitly registered plus its row-model factory (`createSortedRowModel()`, `createPaginatedRowModel()`, etc.). `[raw/tanstack--table--svelte-adapter-and-runes-state.md]`

Three ways to own table state - pick exactly one per state slice, don't mix ownership paths for the same slice:
1. `initialState` (table owns it internally).
2. External `$state` + `onXChange` callbacks (app owns it as plain runes state).
3. External TanStack Store atoms via `atoms` option (shared across tables/components).
Precedence when accidentally mixed: external atoms > external `state` > internal base atom. `[raw/tanstack--table--svelte-adapter-and-runes-state.md]`

**No built-in virtualization.** TanStack Table's own examples slice large datasets for display rather than virtualizing rows. Pair with `@tanstack/svelte-virtual`'s `createVirtualizer` on the table's scroll container for real large-dataset rendering. `[raw/tanstack--table--sorting-filtering-pagination-example.md]`

## 4. TanStack Form validation

Snippet-based field API (`{#snippet children(field)}`), consistent with the Svelte-5-native rewrite pattern seen across Query and Table. Field-level `validators` support sync `onChange` and debounced async `onChangeAsync`. Nested/conditional fields are a supported first-class pattern (a field's snippet can render another `<form.Field>`). `form.Subscribe` with a `selector` scopes reactivity to a state slice (e.g. `canSubmit`/`isSubmitting`) to avoid re-rendering unrelated parts of the form on every keystroke. `[raw/tanstack--form--svelte-quickstart-and-validation.md]`

**Gap**: Standard Schema (Zod/Valibot) integration is confirmed for SvelteKit's own native `form` remote function (§5) but not independently verified for `@tanstack/svelte-form`'s validator options in this research pass - check live docs before assuming identical schema-library wiring. `[raw/tanstack--form--svelte-quickstart-and-validation.md]`

## 5. When NOT to use TanStack in SvelteKit - the mission's core question, answered with evidence

SvelteKit's own primitives cover more of the "server state" problem than they get credit for:

| Need | SvelteKit native answer | What it covers |
|---|---|---|
| Fetch data for a route, once, SSR'd | `load` (`+page.js`/`+page.server.js`) | Server/universal split, credentialed + relative fetch, automatic SSR-to-hydration response inlining (no re-fetch), response streaming for slow data |
| Read dynamic data anywhere, deduped | `query` remote function | Server-side request-scoped cache (same query called twice in one request = one execution) + client-side instance dedup (`getPosts() === getPosts()`), usable directly in markup via experimental `await` |
| Real-time/self-updating data | `query.live` | Async-iterable-backed, auto-connects/disconnects, no manual `refresh()` |
| Write data with pending/error state | `form` remote function, or classic form actions + `use:enhance` | Zero-JS-capable progressive enhancement, Standard Schema validation, programmatic `submit()` |
`[raw/sveltekit--load-functions--universal-vs-server.md]` `[raw/sveltekit--remote-functions--query-form-command.md]`

**What SvelteKit's native primitives do NOT give you, which is TanStack Query's real value-add:**
- Client-side cache that persists and is shared **across navigations and unrelated components** with configurable staleness/GC - `load`/`query` dedup is request- or instance-scoped, not a long-lived cross-page cache.
- Background refetching on interval or window-focus.
- An addressable, explicit `invalidateQueries`-style operation decoupled from any one call site.
- Mutation state (`isPending`, rollback context, `useMutationState` across components) as a first-class, reusable primitive.

**Decision rule this skill enforces**: default to `load` + remote functions (`query`/`form`/`command`) for typical page data and typical mutations - it's zero extra bundle cost and SvelteKit's own team is actively investing in this exact problem space (see the `2.61.0` release notes cited in the remote-functions raw file). Reach for TanStack Query specifically when the app has genuine cross-component/cross-navigation client cache-sharing needs, wants background revalidation, or needs addressable invalidation/mutation-state patterns that `load`/remote functions don't provide out of the box - e.g. a dashboard with many components independently subscribing to the same server data, or a UI needing live "is this mutating right now, from anywhere" state.

## 6. Performance and bundle considerations

TanStack Query's baseline is ~10.44 KB gzipped and effectively mandatory once any part of the app imports `QueryClient` (a non-tree-shakeable class). `[raw/tanstack--query--devtools-and-bundle-size.md]` TanStack Table v9's opt-in `tableFeatures` registration keeps unused table features out of the bundle, which matters more the fewer features a given table actually needs. `[raw/tanstack--table--svelte-adapter-and-runes-state.md]` For large row counts, virtualization is a separate library (`@tanstack/svelte-virtual`) and a separate integration step, not automatic. `[raw/tanstack--table--sorting-filtering-pagination-example.md]`

## Open gaps carried forward (do not fill from training data)

1. No full worked `createVirtualizer`/`createWindowVirtualizer` Svelte code example was archived - confirm the current option shape against live docs before scaffolding.
2. TanStack Form's Standard Schema (Zod/Valibot) validator integration on the Svelte adapter specifically was not independently confirmed.
3. The TanStack Svelte libraries landing page's full library-by-library card list was not fully captured - this document's status table is built from each library's own docs, treated as higher-confidence than the landing page's tagline.
