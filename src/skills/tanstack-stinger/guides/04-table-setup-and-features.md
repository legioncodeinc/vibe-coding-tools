# Guide 4: TanStack Table setup and feature registration

Grounded in `references/research/distilled-tanstack.md` §3, `references/table-setup-template.md`.

## When to walk this guide

Building a data table with sorting, filtering, or pagination in a SvelteKit app.

## Pick one API generation - do not mix

- **`createSvelteTable(options)`** - older/stable wrapper, commonly paired with a `writable` store in official examples, uses some Svelte 4 idioms (`svelte:component`, `on:click`) even in current docs.
- **`createTable({ features, columns, data })`** (v9/latest) - rune-native, state backed by TanStack Store atoms, features are opt-in via `tableFeatures({...})`.

For a new Svelte 5 project, default to `createTable`. Only reach for `createSvelteTable` if matching an existing codebase already using it.

## Feature registration (v9)

Nothing is bundled by default - register exactly what's needed:

```ts
const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
});
```

This keeps bundles smaller and gives TypeScript accurate types for the table instance - registering a feature you don't use isn't free, and using a feature you didn't register is a type error, not a silent no-op.

## State ownership - pick exactly one path per state slice

1. `initialState` - table owns it, simplest.
2. External `$state` + `onXChange` callbacks - app owns it as runes state.
3. External TanStack Store atoms via the `atoms` option - for state shared across tables or consumed outside the table's component tree.

Do not set the same slice (e.g. `pagination`) through two of these paths at once. If it happens accidentally: external atoms win over external `state`, and external `state` syncs into the table's internal base atom - that's the documented precedence, not a bug, but it's confusing to debug if you didn't mean to mix paths.

## Data must be reactive

Always pass `data` as a getter, not a plain reference:

```ts
const table = createTable({
  features, columns,
  get data() { return data; }, // correct - reactive
});
```

A plain `data` value captured at table-creation time won't update when the underlying array changes.

## Virtualization is separate

TanStack Table has no built-in row virtualization. For thousands of rows, pair with `@tanstack/svelte-virtual` on the scroll container - see `guides/06-virtualization.md`. Don't try to make Table alone handle huge row counts by slicing/paginating aggressively when the actual requirement is a scrollable virtualized list.

## Common mistakes

- Mixing `createSvelteTable` and `createTable` patterns in the same codebase without a reason.
- Registering a feature's row model but not the feature itself (or vice versa) - both halves are required.
- Passing `data` as a plain value instead of a getter, then wondering why the table doesn't update after a data refresh.
