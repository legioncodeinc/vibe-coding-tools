# csv-xlsx-import-export Stinger

A Cursor skill for `csv-xlsx-import-export-worker-bee` that covers the full "upload your spreadsheet" feature surface in React/Next.js products.

This stinger encodes production-ready guidance for: CSV and XLSX parsing (papaparse, SheetJS, exceljs, csv-parse), streaming large files (Web Worker pattern, Node.js ReadableStream), column-mapping UX (5-stage wizard, managed importers OneSchema / Flatfile / dromo, self-hosted react-spreadsheet-import), Zod row validation with row-level error objects, CSV injection prevention (CWE-1236 compliant), encoding edge cases (UTF-8 BOM, CP1252), styled XLSX export (exceljs WorkbookWriter), and streaming CSV export with correct MIME type and Excel compatibility.

**Command Brief:** `ai-tools/command-briefs/csv-xlsx-import-export-worker-bee-command-brief.md`

**Research Summary:** `.claude/skills/csv-xlsx-import-export-stinger/research/research-summary.md` (34 sources, depth: normal, date: 2026-05-20)
