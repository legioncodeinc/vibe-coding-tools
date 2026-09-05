# Internal Notes: Command Brief Analysis
## csv-xlsx-import-export-worker-bee

**Brief path:** `ai-tools/command-briefs/csv-xlsx-import-export-worker-bee-command-brief.md`
**Backlog position:** 203
**Created:** 2026-05-20
**Research depth:** normal
**Research model:** grok-4.3

## Domain scope
The Bee owns the full data-exchange surface: file ingestion → parse → column mapping → validation → error reporting (import side); workbook construction → streaming export (export side). Does NOT own: file drop zone UI (`ux-ui-svelte-worker-bee`), bulk-insert DB performance (`db-worker-bee`), upload endpoint security (`security-worker-bee`).

## Library canon (from brief)
| Layer | Library |
|---|---|
| Browser CSV parse | papaparse |
| Browser XLSX parse | SheetJS (`xlsx`) |
| Server XLSX generate | exceljs |
| Node.js CSV parse | csv-parse |
| Managed column mapping | OneSchema or Flatfile |

## Critical directives extracted
1. Never skip CSV injection sanitization even if import target is a database (deferred injection surface)
2. Always specify streaming strategy for files over 5 MB
3. Distinguish browser-side vs server-side parse (different APIs and security trade-offs)
4. Do not recommend OneSchema/Flatfile without noting pricing model
5. Always validate and report at row level (not just file level)
6. Hand off to `security-worker-bee` before upload endpoint reaches production

## Open questions from brief
- Q1: Is react-spreadsheet-import mature enough in 2026? **ANSWERED: Yes, v4.7.1, maintained, MIT licensed**
- Q2: SheetJS licensing status 2026? **ANSWERED: Apache 2.0 Community Edition, no changes in 2026**
- Q3: OneSchema/Flatfile free tier? **ANSWERED: Flatfile has free tier (50 files/month); OneSchema has no free tier**
- Q4: ExcelJS vs xlsx-populate? **ANSWERED: ExcelJS wins for server-side generation from scratch; xlsx-populate only relevant for modifying existing templates**

## Proposed guides structure (from brief)
- `guides/00-library-decision-tree.md`
- `guides/01-streaming-parse-large-files.md`
- `guides/02-column-mapping-ux.md`
- `guides/03-validation-rules.md`
- `guides/04-csv-injection-prevention.md`
- `guides/05-encoding-edge-cases.md`
- `guides/06-export-xlsx.md`
- `guides/07-export-csv.md`
- `guides/08-error-reporting-ux.md`

## Key research findings that override/supplement the brief
1. **SheetJS cannot stream-read XLSX** - ZIP container requires buffering whole file. The brief implies SheetJS streaming is possible; it is NOT for reads. Workaround: run in Web Worker, use `xlsx-stream-rows` for true streaming, or limit via `sheetRows` option.
2. **ExcelJS WorkbookWriter has a known memory leak** (Issue #2916, PR #2558 pending for v5.0). Flag in `guides/06-export-xlsx.md`.
3. **Dromo prices at $499/month** - substantially higher than the brief implies. More expensive than Flatfile's free tier.
4. **Tab-prefix CSV injection approach has ~90% success rate** (empirically tested vs Excel save/reopen) - better than the single-quote approach.
