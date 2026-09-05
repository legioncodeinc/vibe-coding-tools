# TanStack Table Svelte: column defs, sorting, filtering, pagination, virtualization pattern

- URL: https://tanstack.com/table/latest/docs/framework/svelte/examples/sorting ; https://tanstack.com/table/beta/docs/framework/svelte/examples/kitchen-sink
- Fetched: 2026-08-14
- Source type: Official TanStack Table docs (worked examples)
- Component: TanStack Table / Svelte examples

## Content

### Column definitions (stable shape across API generations)

```ts
const columns: ColumnDef<Person>[] = [
  {
    header: 'Name',
    columns: [
      { accessorKey: 'firstName', cell: (info) => info.getValue() },
      { accessorFn: (row) => row.lastName, id: 'lastName', header: () => 'Last Name' },
    ],
  },
  { accessorKey: 'age', header: () => 'Age' },
];
```

`accessorKey` for direct property access, `accessorFn` for derived/computed values (requires an explicit `id` since there's no property name to infer one from). Columns can nest for grouped headers.

### Sorting example (`createSvelteTable`, older stores-based generation)

```svelte
<script lang="ts">
  import { writable } from 'svelte/store';
  import { createSvelteTable, getCoreRowModel, getSortedRowModel, flexRender } from '@tanstack/svelte-table';

  let sorting: SortingState = [];
  const setSorting: OnChangeFn<SortingState> = (updater) => {
    sorting = updater instanceof Function ? updater(sorting) : updater;
    options.update((old) => ({ ...old, state: { ...old.state, sorting } }));
  };

  const options = writable<TableOptions<Person>>({
    data, columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const table = createSvelteTable(options);
</script>

{#each $table.getHeaderGroups() as headerGroup}
  {#each headerGroup.headers as header}
    <th on:click={header.column.getToggleSortingHandler()}>
      <svelte:component this={flexRender(header.column.columnDef.header, header.getContext())} />
    </th>
  {/each}
{/each}
```

Note: this example predates the v9 `createTable`/runes rewrite and Svelte 5's `onclick` event syntax - it uses `svelte:component` and `on:click` (Svelte 4 idioms) and a `writable` store rather than runes. `createSvelteTable` still works this way in current docs; the newer `createTable` API (see the adapter/state raw file) is the rune-native alternative. Treat both as currently valid but architecturally distinct - pick one per project, don't mix.

### Feature registration pattern (v9, from the kitchen-sink example)

Advanced features - filtering (including fuzzy filtering via `match-sorter`-style rank functions), grouping, faceting, row pinning, column pinning/resizing - are all opt-in via `tableFeatures({...})` and paired row-model factories (`createFilteredRowModel`, `createFacetedRowModel`, `createGroupedRowModel`, `createPaginatedRowModel`, `createSortedRowModel`). Custom `filterFn`/`sortFn` can be registered per-column via `meta` and referenced by name (`filterFn: 'fuzzy'`).

### Virtualization is a separate library, not a Table feature

TanStack Table's own docs do not include row virtualization as a built-in feature - the 100,000-row example in the sorting demo simply slices to the first 10 rows for display (`.slice(0, 10)`) rather than virtualizing. For real large-dataset rendering, pair TanStack Table with `@tanstack/svelte-virtual` (see the Virtual raw file) rather than expecting Table alone to handle DOM-node count for huge row sets.
