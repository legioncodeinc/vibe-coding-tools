# 16: Data Grids & Tables

Source: `research/2026-04-25-data-grids-and-tables.md`. The right table for 50 rows is the wrong table for 5 million. Pick by row count, edit depth, and license tolerance, not by which one you used last.

## TL;DR pick

| Use case | Pick | Why |
|---|---|---|
| Headless table you'll style with shadcn / Tailwind | **TanStack Table** | Headless, type-safe, framework-agnostic |
| Enterprise feature breadth (pivots, master-detail, agg) | **AG Grid Enterprise** | Most feature-complete; commercial license |
| Excel-like data entry (formulas, fill, range select) | **Handsontable** | Spreadsheet UX out of the box; commercial |
| Millions of rows, scroll like Figma | **Glide Data Grid** | Canvas-rendered, virtualized at extreme scale |
| MUI-shop wants polished commercial table | **MUI X DataGrid (Pro/Premium)** | Polished MUI integration, paid tiers |

The canonical pick for *most* product teams in 2026: **TanStack Table** for headless control, with **AG Grid** when enterprise features justify the license, and **Glide Data Grid** when row count breaks DOM-based grids.

---

## When to choose each

### TanStack Table (the headless default)
- You want full visual control and you're already on shadcn / Tailwind / Radix.
- Up to ~10,000 rows comfortably with virtualization (`@tanstack/react-virtual`).
- Type-safe column defs; sorting, filtering, grouping, pagination: all opt-in.
- Ships zero UI. You write the `<table>`, `<thead>`, `<tbody>`, cells. That's the point.

### AG Grid (the enterprise king)
- You need pivoting, server-side row models, master-detail, range selection with copy-paste-to-Excel, integrated charts, tree data, or column groupings.
- Community edition is MIT and covers a lot. **Enterprise** is per-developer commercial.
- Trade-off: opinionated DOM, harder to theme to a custom design system. Budget for theming time.

### Handsontable (Excel-like data entry)
- Your users will type into cells like a spreadsheet: formulas, fill-down, range paste, undo stack, validation.
- Commercial license required for production use in non-OSS apps. Read the license before adopting.
- HyperFormula (free, MIT) handles the formula engine.

### Glide Data Grid (extreme-scale rendering)
- You display 100k+ rows, need 60fps scroll, and a native-feeling cell editor.
- Canvas-rendered, not DOM. Means no per-cell React reconciliation, but also no easy CSS theming: you style via the data-grid theme API.
- Used by Glide and others for very large database UIs.

### MUI X DataGrid (the MUI-shop pick)
- You're already on MUI and want a table that matches the design system without re-theming.
- Community is MIT (basic features). Pro / Premium add tree data, aggregation, pivoting, Excel export.
- If you're not on MUI, don't adopt it just for the grid.

---

## Decision axes

1. **Row count.**
   - <1,000: anything works, including raw `<table>`.
   - 1,000 to 50,000: TanStack Table + virtualization, AG Grid, MUI X.
   - 50,000 to 500,000: AG Grid (server-side row model), Glide Data Grid.
   - 500,000+: Glide Data Grid or server-driven pagination with TanStack Table.
2. **Edit depth.**
   - Read-only / single-cell edit: TanStack Table.
   - Inline edit per row: AG Grid, MUI X.
   - Spreadsheet-grade (formulas, fill, multi-cell paste): Handsontable, Glide Data Grid.
3. **License tolerance.**
   - OSS-only: TanStack Table, AG Grid Community, Glide Data Grid (MIT), MUI X Community.
   - Commercial OK: AG Grid Enterprise, Handsontable, MUI X Pro/Premium.
4. **Design system integration.** TanStack Table > MUI X (in MUI shops) > Glide > AG Grid > Handsontable.

---

## Starter (TanStack Table)

```tsx
'use client';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

type User = { id: string; name: string; email: string; role: 'admin' | 'member' };

const columnHelper = createColumnHelper<User>();
const columns = [
  columnHelper.accessor('name', { header: 'Name' }),
  columnHelper.accessor('email', { header: 'Email' }),
  columnHelper.accessor('role', { header: 'Role' }),
];

export function UsersTable({ data }: { data: User[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id}>
            {hg.headers.map((h) => (
              <th key={h.id} onClick={h.column.getToggleSortingHandler()}>
                {flexRender(h.column.columnDef.header, h.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

Wrap in `useVirtualizer` from `@tanstack/react-virtual` once row count crosses ~1,000.

---

## Choice tree

1. **<1k rows, headless control, on shadcn/Tailwind** → TanStack Table.
2. **Need pivots / master-detail / server-side rows / commercial license OK** → AG Grid (Enterprise if pivot/server-side, Community otherwise).
3. **Excel-grade editing (formulas, fill)** → Handsontable.
4. **100k+ rows, 60fps scroll** → Glide Data Grid.
5. **Already on MUI** → MUI X DataGrid.

---

## Common findings

> **[Must-fix]** `src/features/admin/UsersTable.tsx:1`: renders 50,000 rows in a plain `<table>`. Adds virtualization or move to AG Grid server-side row model. Cite Profiler frame time.

> **[Should-refactor]** `package.json:42`: `react-table@7` (legacy). Migrate to TanStack Table v8+. The API is similar but type-safer.

> **[Must-fix]** `src/features/spreadsheet/Sheet.tsx:1`: Handsontable in production without a commercial license. Verify license terms with legal; this is a compliance issue.

---

## Handoffs

- **Token / spacing / typography of the table surface** → `ux-ui-svelte-worker-bee`.
- **Server-side row model API design (cursor pagination, filter pushdown)** → `db-worker-bee`.
- **License procurement (AG Grid, Handsontable, MUI X)** → `library-worker-bee` PRD.
