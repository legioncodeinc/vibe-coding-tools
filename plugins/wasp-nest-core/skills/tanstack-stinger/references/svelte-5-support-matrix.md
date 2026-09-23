# TanStack + Svelte 5 support matrix

Grounded in `research/distilled-tanstack.md` §1. Read this before recommending any TanStack library in a SvelteKit project.

| Library | Use in SvelteKit? | Package | Notes |
|---|---|---|---|
| Query | Yes | `@tanstack/svelte-query` (v6+) | Requires Svelte `^5.25.0`. Options must be wrapped in a function: `createQuery(() => ({...}))`. |
| Table | Yes | `@tanstack/svelte-table` (v9+) | v9 is Svelte-5-only; use v8 only for a legacy Svelte 3/4 project (not this stack). Two API generations coexist (`createSvelteTable` vs `createTable`) - pick one. |
| Form | Yes | `@tanstack/svelte-form` | Snippet-based (`{#snippet children(field)}`). Options wrapped in a function, same convention as Query. |
| Virtual | Yes, with a caveat | `@tanstack/svelte-virtual` | Official adapter exists; confirm the current `createVirtualizer` option shape against live docs before scaffolding - this research pass didn't archive a full example. |
| Router | **No** | none | No official Svelte adapter. Do not use. SvelteKit's own file-based router is the answer. |
| Start | **No** | none | No official Svelte adapter. The only Svelte-targeting code is a zero-adoption, self-described-experimental third-party project that patches TanStack internals. Do not recommend it. SvelteKit's own SSR/routing/remote functions are the mature equivalent. |

## What to say when a user asks about TanStack Router or Start for SvelteKit

Say plainly: they don't have official Svelte support, and SvelteKit's own routing and full-stack server-function story already cover what those libraries provide for React. Do not invent usage or point to the unofficial community adapters as a real option for production work.
