# csv-xlsx-import-export-wasp-drone

## Domain
Implements and audits the "upload your spreadsheet" feature surface for React/Next.js products: CSV/XLSX parsing (papaparse, SheetJS, exceljs), large-file streaming via the Web Worker + chunk pattern, column-mapping UX (the 5-stage wizard, managed importers like OneSchema/Flatfile/dromo vs self-hosted react-spreadsheet-import), per-row Zod validation with structured error objects, CSV injection prevention (CWE-1236), encoding edge cases (UTF-8 BOM, CP1252), and styled XLSX export via ExcelJS WorkbookWriter.

## Paired Stinger
[csv-xlsx-import-export-stinger](../../csv-xlsx-import-export-stinger) - the library decision tree, streaming-parse patterns for large files, column-mapping UX guidance, validation rules, CSV injection sanitization, and export code for XLSX/CSV.

## Trigger phrases
- "build a CSV import for this app"
- "add XLSX upload with column mapping"
- "we need a column-mapping wizard"
- "export this data to Excel"
- "stream-parse a large CSV without freezing the browser"
- "is our CSV export safe from injection"
- "handle UTF-8 BOM and CP1252 encoding on import"
- "compare OneSchema vs Flatfile vs a self-hosted importer"

## Do NOT route when
- The request is the file drop-zone UI component itself; that is ux-ui-svelte-wasp-drone. This Drone owns the parse/validate/export logic behind it.
- The request is database bulk-insert performance once rows are validated; that is db-wasp-drone.
- The request is a security audit of the upload endpoint; that is security-wasp-drone, and this Drone explicitly hands off to it before any upload endpoint reaches production.
- File size exceeds 500 MB, requiring a server-side pipeline with object storage; this Drone does not own that background-job architecture.
- The user needs HIPAA compliance with a managed importer; verify BAA availability or the self-hosted path before proceeding, don't assume.

## Inputs the Drone needs
- Format(s) in scope (CSV, XLSX, or both), max expected file size, and whether column mapping is needed.
- Validation rules and the output target (React state, API, or DB).
- Export requirements, if the request includes generating downloadable files.

## Outputs
- Parse/streaming code (papaparse/SheetJS/exceljs) with a Web Worker strategy for files over 5 MB.
- A column-mapping wizard (managed or self-hosted) and a Zod validation layer with row-level error objects.
- Sanitized CSV/XLSX export code and a findings report at `templates/import-report.md` covering library decisions and the sanitization checklist.

## Commonly sequenced with
- ux-ui-svelte-wasp-drone: builds the drop-zone and wizard UI shell this Drone's logic plugs into.
- db-wasp-drone: handles bulk-insert performance for validated rows this Drone produces.
- security-wasp-drone: audits the upload endpoint before production, mandatory handoff every time.
