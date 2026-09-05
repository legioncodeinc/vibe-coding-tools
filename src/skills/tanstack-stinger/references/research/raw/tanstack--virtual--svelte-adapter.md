# TanStack Virtual Svelte adapter: createVirtualizer, createWindowVirtualizer

- URL: https://tanstack.com/virtual/v3/docs/framework/svelte/svelte-virtual ; https://tanstack.com/virtual/v3/docs/framework/svelte ; https://tanstack.com/virtual/latest/docs/framework/svelte
- Fetched: 2026-08-14
- Source type: Official TanStack Virtual docs
- Component: TanStack Virtual / Svelte adapter

## Content

### Status: officially supported

`@tanstack/svelte-virtual` is a real, documented, official adapter - "a wrapper around the core virtual logic" (the framework-agnostic `@tanstack/virtual-core`, same relationship pattern as Query's and Table's Svelte adapters wrapping their respective `-core` packages).

### Two entry points

- **`createVirtualizer`** - for virtualizing a scrollable container element you control directly.
- **`createWindowVirtualizer`** - returns a window-based `Virtualizer` instance configured to use the browser window itself as the scroll element, for full-page virtualized lists rather than a bounded scroll container.

## Gap in this research pass

The archive did not capture a full worked Svelte code example for either function (the fetched pages returned only the API surface, not a complete usage snippet, within this pass's fetch budget). Before scaffolding a virtualized list, pull the current `createVirtualizer` usage example directly from `https://tanstack.com/virtual/latest/docs/framework/svelte/svelte-virtual` rather than inferring the exact option shape from the React adapter's API, since Svelte adapters in this family (Query, Table, Form) have consistently used a "wrap options in a function" convention that may or may not apply identically here - confirm rather than assume.

### Pairing with TanStack Table

Per the Table research (`tanstack--table--sorting-filtering-pagination-example.md`), TanStack Table has no built-in row virtualization - large-row-count tables should pair `createTable`/`createSvelteTable` with `@tanstack/svelte-virtual`'s `createVirtualizer` on the table's scroll container rather than expecting Table alone to manage DOM node count.
