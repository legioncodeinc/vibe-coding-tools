# React-to-Svelte 5 translation table

React-side claims cite [raw/01](research/raw/01-react-hooks.md); the source-codebase column cites [raw/04](research/raw/04-bifrost-ui-stack.md). Svelte-side idioms are governed by the [[svelte-stinger]] archive (runes reference and migration cheatsheet); verify there before asserting fine semantics.

## Hooks

| React | Svelte 5 | Notes |
|---|---|---|
| `useState(x)` | `let x = $state(x)` | Direct assignment replaces setter; deep reactivity via `$state` proxies |
| `useReducer(fn, init)` | `$state` + explicit action functions in a `.svelte.ts` module | No reducer protocol; write named mutation functions |
| `useMemo(fn, deps)` | `$derived` / `$derived.by` | No deps array; fine-grained graph tracks dependencies |
| `useCallback(fn, deps)` | (nothing) | Functions are not unstable identities in Svelte; memoization rationale disappears |
| `useEffect(fn, deps)` | `$effect(() => { ... })` | Reactive by dependency graph, not deps array; do not use for data fetching |
| `useEffect` cleanup return | `return () => {...}` inside `$effect` | Same shape, reactive timing |
| `useLayoutEffect` | `$effect.pre` | Pre-DOM-update timing |
| `useContext(Ctx)` | `$props()` drill, or `getContext`/`setContext` | Module-level shared state in `.svelte.ts` often replaces context entirely |
| `useRef(initial)` | `let ref = $state(initial)` (non-DOM) or `bind:this={el}` | `bind:this` is the DOM-ref idiom |
| `useImperativeHandle` | `bind:this` on a component + exported functions | Export functions from the child, bind the instance |
| `useId()` | `$props.id()` | Svelte 5 component-level unique id |
| `useSyncExternalStore` | usually unnecessary | Svelte reactivity is universal (`.svelte.ts`); wrap external stores only at the seam |
| `useTransition` / `useDeferredValue` | no direct equivalent | Prioritize by restructuring; check gaps list before asserting |
| `useOptimistic` | manual: apply to `$state`, revert on failure | No built-in |
| `<Provider>` trees | `setContext` in `+layout.svelte` | Plus snippets for render delegation |

## Component syntax

| React | Svelte 5 |
|---|---|
| JSX return | Markup + `{expressions}` |
| `{cond && <A/>}` | `{#if cond}<A/>{/if}` |
| `list.map(x => <X/>)` | `{#each list as x (x.id)}` keyed each |
| `props.children` | `{@render children()}` snippet |
| render props / HOCs | snippets `{#snippet name(args)}` passed as props |
| `className` | `class` (+ `class:` directive for conditional classes) |
| `dangerouslySetInnerHTML` | `{@html}` |
| `<Fragment key>` | keyed `{#each}` or `<svelte:fragment>` |
| Error boundaries (class) | `<svelte:boundary>` with `onerror`/`failed` snippet |
| `React.lazy` + Suspense | `{#await}` blocks; SvelteKit handles route-level code splitting |
| Portals | `<svelte:window>`, `{#target}`-style actions, or mounting at layout level (verify per case) |

## Data and state

| React ecosystem | Svelte-side | Notes |
|---|---|---|
| Redux slices + dispatch | `.svelte.ts` modules exporting `$state` objects and mutation functions | Universal reactivity; no actions/reducers boilerplate |
| RTK Query endpoints (query/mutation, tags) | Project contract decision: SvelteKit load, `@tanstack/svelte-query`, or typed fetch wrappers | Extract the endpoint+shape inventory FIRST (contract, not code) |
| axios instance + interceptors | shared fetch wrapper or SvelteKit `handle` hook | Auth header injection and 401-redirect live here |
| TanStack Router file routes | SvelteKit `src/routes` | Layout routes -> `+layout.svelte`; loaders -> `+page.ts`; errors -> `+error.svelte` |
| typed `useSearch` params | load's `url.searchParams` + schema validation | Validation is explicit, not generated |
| Route context (auth, singletons) | layouts + server `locals` + `.svelte.ts` singletons | |
| TanStack Table (headless) | `@tanstack/svelte-table` or hand-rolled table over shadcn-svelte Data Table | Verify svelte adapter version before heavy tables |
| Radix primitive + cva | shadcn-svelte copy-in component (Bits UI + Tailwind) | Near 1:1 catalog; component code is yours to edit |

## Porting rules

1. Contract first: the ported component consumes the SAME endpoints with the SAME shapes as the React source. If the contract is missing an endpoint, stop and record it; never invent an endpoint client-side.
2. No React idioms in Svelte clothing: no `.map()` returning markup, no useEffect data fetching, no context providers where `.svelte.ts` state suffices.
3. The React source is reference material: read its rendering logic and edge-case handling (empty states, error states, loading skeletons, optimistic updates) and reproduce BEHAVIOR, not code shape.
4. Keep the port's file naming, test placement, and styling per the target repo's conventions, not upstream's (oxlint/oxfmt do not carry over).
