# TanStack Table v9 (Svelte 5 runes) setup (copy-paste)

Grounded in `research/distilled-tanstack.md` §3, `research/raw/tanstack--table--svelte-adapter-and-runes-state.md`.

## Minimal sortable, paginated table

```svelte
<script lang="ts">
  import {
    createTable,
    tableFeatures,
    rowSortingFeature,
    rowPaginationFeature,
    createSortedRowModel,
    createPaginatedRowModel,
    FlexRender,
  } from '@tanstack/svelte-table';
  import type { ColumnDef } from '@tanstack/svelte-table';

  type Row = { id: string; name: string; status: string };

  let { data }: { data: Row[] } = $props();

  const features = tableFeatures({
    rowSortingFeature,
    rowPaginationFeature,
    sortedRowModel: createSortedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
  });

  const columns: ColumnDef<typeof features, Row>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' },
  ];

  const table = createTable({
    features,
    columns,
    get data() {
      return data;
    },
    initialState: {
      pagination: { pageIndex: 0, pageSize: 25 },
    },
  });

  const rows = $derived(table.getRowModel().rows);
</script>

<table>
  <thead>
    {#each table.getHeaderGroups() as headerGroup}
      <tr>
        {#each headerGroup.headers as header}
          <th onclick={header.column.getToggleSortingHandler()}>
            <FlexRender content={header.column.columnDef.header} context={header.getContext()} />
          </th>
        {/each}
      </tr>
    {/each}
  </thead>
  <tbody>
    {#each rows as row}
      <tr>
        {#each row.getVisibleCells() as cell}
          <td>
            <FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<button onclick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Prev</button>
<button onclick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</button>
```

## App-owned state (external `$state` + callbacks)

```svelte
<script lang="ts">
  import type { SortingState, PaginationState } from '@tanstack/svelte-table';

  let sorting: SortingState = $state([]);
  let pagination: PaginationState = $state({ pageIndex: 0, pageSize: 10 });

  const table = createTable({
    features,
    columns,
    get data() { return data; },
    state: {
      get sorting() { return sorting; },
      get pagination() { return pagination; },
    },
    onSortingChange: (updater) => {
      sorting = updater instanceof Function ? updater(sorting) : updater;
    },
    onPaginationChange: (updater) => {
      pagination = updater instanceof Function ? updater(pagination) : updater;
    },
  });
</script>
```

Do not also set `initialState.sorting` or an `atoms.sorting` when using this pattern for the `sorting` slice - pick exactly one ownership path per state slice.

## Pairing with virtualization for large row counts

TanStack Table has no built-in virtualization. Wrap the `<tbody>`'s scroll container with `@tanstack/svelte-virtual`'s `createVirtualizer` when row counts get large (thousands+) - see `guides/06-virtualization.md`.
