# Data Grids & Tables: research notes

**Retrieved:** 2026-04-25
**For guide:** `guides/16-data-grids-and-tables.md`

## Sources

From `cursor-subagent-research-combined.md` (Data Grids & Tables, ~line 754):

- [AG Grid](https://www.ag-grid.com/)
- [TanStack Table](https://tanstack.com/table)
- [Handsontable](https://handsontable.com/)
- [Glide Data Grid](https://grid.glideapps.com/)
- [MUI X DataGrid](https://mui.com/x/react-data-grid/)

## Adjacent references

- TanStack Virtual (virtualization companion to TanStack Table): https://tanstack.com/virtual
- AG Grid licensing matrix: https://www.ag-grid.com/license-pricing/
- Handsontable license terms (commercial for non-OSS use): https://handsontable.com/pricing
- HyperFormula (free formula engine often paired with Handsontable): https://hyperformula.handsontable.com/

## Cross-references

- `guides/13-ecosystem-catalog.md` already lists TanStack Table as the default. This guide expands the matrix to AG Grid / Handsontable / Glide / MUI X with row-count and edit-depth axes the catalog doesn't address.

## Notes

Decision axes:
1. Row count (anything → 1k → 50k → 500k+)
2. Edit depth (read-only → inline edit → spreadsheet-grade)
3. License tolerance (OSS-only vs commercial OK)
4. Design system fit (TanStack > MUI X > Glide > AG Grid > Handsontable)

No new web_search_exa expansions performed: the source doc URLs are the canonical product pages and licensing docs.
