# Distilled: React-to-Svelte porting
- Research window: 2026-09-04 (initial sweep; source-codebase facts from the frozen Bifrost ui/ tree)
- Raw archive: `references/research/raw/01` through `04`
- Every claim cites its raw file by number. Svelte-side rune semantics are owned (and cited) by the [[svelte-stinger]] research archive; this skill owns the bridge.

## 1. The source stack (Bifrost dashboard)

React + Vite + TanStack Router 1.168 + TanStack Table 8 + Redux Toolkit/RTK Query + axios + ~20 Radix primitives in shadcn shape; node >=22.12; output embeds into the gateway [raw/04]. Live logs use WebSockets [raw/04]. The workspace has 30+ surface folders of which a tenant product needs a subset (logs, virtual-keys, governance, dashboard, observability, config, plugins); cluster/rbac/scim/guardrails/audit-logs are enterprise-flavored [raw/04].

## 2. Component model mapping is nearly mechanical

- Radix primitive name -> shadcn-svelte component name is close to 1:1 (Dialog, Dropdown Menu, Select, Tabs, Switch, Tooltip, ...) because shadcn/ui and shadcn-svelte share the catalog and copy-in model; shadcn-svelte is built on Bits UI + Tailwind and hands you editable component code [raw/02].
- React hooks translate to runes: state/derived/effect/effects-cleanup/context/refs/ids all have Svelte 5 equivalents (table in `references/translation-table.md`; semantics per [[svelte-stinger]] archive) [raw/01].
- `useMemo`/`useCallback` mostly disappear: `$derived` is a fine-grained reactive computation, so the memoization-for-performance rationale does not carry over [raw/01].

## 3. Routing mapping (TanStack Router -> SvelteKit)

- File-based route trees map to SvelteKit's `src/routes` tree: layout routes -> `+layout.svelte`; nested paths -> nested directories; error boundaries -> `+error.svelte`; loaders -> `+page.ts`/`+layout.ts` load functions or SvelteKit universal load [raw/03].
- TanStack's typed search params (JSON-first, validated, `useSearch`) map to SvelteKit page options and URL search params handling in load; validation moves into load or a schema helper [raw/03].
- Route context (auth, shared singletons) maps to SvelteKit layouts, `locals` in server load, and module-level state in `.svelte.ts` [raw/03].
- Code-based route config has no direct SvelteKit equivalent; prefer restructuring to file-based rather than fighting the framework [raw/03].

## 4. Data-fetching mapping (RTK Query -> ?)

- RTK Query's per-service endpoint definitions are the contract inventory: extract endpoint + shape per surface before porting [raw/04].
- Svelte-side replacement is project-defined: SvelteKit load for route data, TanStack Query for Svelte (`@tanstack/svelte-query`) for client cache semantics, or thin fetch wrappers over the same endpoints. Decision belongs to the product contract, not to this skill.
- axios interceptors (auth headers, error redirects) map to a shared fetch wrapper or SvelteKit handle hook.

## 5. State mapping (Redux/RTK -> Svelte 5)

- Redux store slices -> `.svelte.ts` modules with `$state`/`$derived` exports ([[svelte-stinger]] universal reactivity guide).
- RTK Query cache invalidation tags -> explicit refetch triggers or a query library's invalidation; port per surface, do not try to reproduce the tag graph wholesale.

## 6. Known gaps in this archive

- Svelte 5 rune semantics: owned by [[svelte-stinger]]; consult, do not duplicate.
- SvelteKit form actions / remote functions specifics: [[svelte-stinger]] archive.
- TanStack Table headless rendering in Svelte: `@tanstack/svelte-table` exists but is not archived here; verify against its docs before porting heavy tables.
- Transition/animation system differences (CSS transitions vs svelte/transition): not archived.
- Testing-library differences (@testing-library/react vs @testing-library/svelte): not archived.
