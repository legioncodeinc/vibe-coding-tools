# TanStack Table Svelte adapter: createSvelteTable / createTable, Svelte-5-only cutover, runes state

- URL: https://tanstack.dev/table/latest/docs/framework/svelte/svelte-table ; https://tanstack.com/table/latest/docs/framework/svelte/quick-start ; https://tanstack.com/table/latest/docs/framework/svelte/guide/table-state
- Fetched: 2026-08-14
- Source type: Official TanStack Table docs
- Component: TanStack Table / Svelte adapter

## Content

### Status: officially supported, and the latest version is Svelte-5-only

Direct quote from the Quick Start page: **"This version of `@tanstack/svelte-table` only supports Svelte 5 or newer. For Svelte 3/4 support, use version 8 of `@tanstack/svelte-table`."** This is an important, explicit version-gate fact: a project must be on `@tanstack/svelte-table` v9+ to get the current rune-native API, and must stay on v8 if still on Svelte 3/4 (not relevant to this stack, which targets Svelte 5, but relevant if auditing an older project).

### Two generations of the API, both documented, do not conflate

- **`createSvelteTable`** - the older/stable wrapper API. `const table = createSvelteTable(options)`. Uses `writable` stores for state in older examples (see the sorting example raw file) - this pattern predates the v9 runes rewrite.
- **`createTable`** (v9+, "latest" docs) - the newer core function, paired with `tableFeatures({...})` to opt into features explicitly (sorting, filtering, pagination, etc. are NOT bundled by default - registering only what's needed keeps bundles small and gives TypeScript accurate types). State is backed by **TanStack Store atoms**, and the Svelte adapter installs rune-based reactivity automatically.

```ts
const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  sortFns,
});

const table = createTable({
  features,
  columns,
  get data() { return data; }, // getter, not a plain value - keeps it reactive
});
```

### Reading state the rune-native way

```svelte
<script lang="ts">
  const pagination = $derived(table.atoms.pagination.get());
  const rows = $derived(table.getRowModel().rows);
</script>
```

Mutate state through feature APIs (`table.setSorting(...)`, `table.nextPage()`, `column.toggleVisibility()`, `row.toggleSelected()`) - never edit `table.baseAtoms.<slice>` directly except in the documented escape-hatch pattern for advanced cases.

### Three ways to own table state, pick exactly one per slice

1. **`initialState`** - table owns the state internally, simplest, no external sync.
2. **External `$state` + matching `onXChange` callbacks** (e.g. `onSortingChange`) - app owns the state as plain Svelte runes state.
3. **External TanStack Store atoms** (`createAtom`, passed via the `atoms` option) - for state shared across multiple tables or consumed outside the table's own component tree; use `useSelector` from `@tanstack/svelte-store` when code outside the table needs to read the raw atom.

Explicit warning: **do not provide the same state slice via multiple ownership paths simultaneously** (e.g. both `initialState.pagination` and `atoms.pagination`) unless intentionally picking a winner - external atoms take precedence over external `state`, and external `state` syncs into the table's internal base atom. This is a documented precedence order, not undefined behavior, but it's an easy source of "my state isn't updating" bugs if two paths are set inconsistently.

### `createTableHook` for shared conventions

When multiple tables in an app share features/row-models/component conventions, define them once via `createTableHook` to get a pre-bound `createAppTable`/`createAppColumnHelper` pair rather than re-registering features per table.
