---
name: "csv-xlsx-import-export-stinger"
description: "The \\\\\\\"upload your spreadsheet\\\\\\\" implementation arsenal for React/Next.js products. Covers library selection (papaparse, SheetJS, exceljs), streaming-parse for 100MB+ files, the column-mapping UX wizard, managed importers (OneSchema, Flatfile, dromo) vs self-hosted (react-spreadsheet-import), Zod row validation, CSV injection prevention, encoding edge cases, and styled XLSX export. Use when the user says \\\\\\\"build a CSV import\\\\\\\", \\\\\\\"add XLSX upload\\\\\\\", \\\\\\\"spreadsheet import feature\\\\\\\", \\\\\\\"column-mapping wizard\\\\\\\", \\\\\\\"export to Excel\\\\\\\", \\\\\\\"streaming parse large file\\\\\\\", \\\\\\\"CSV injection safety\\\\\\\", or when csv-xlsx-import-export-worker-bee is invoked. Do NOT use for file drop-zone UI (ux-ui-svelte-worker-bee), database bulk-insert tuning (db-worker-bee), or upload endpoint security audit (security-worker-bee)."
---

# csv-xlsx-import-export Stinger

Procedural arsenal for `csv-xlsx-import-export-worker-bee`. Encodes every decision the Bee needs to make when helping a team add "upload your spreadsheet" to a React/Next.js product.

This stinger is deliberately opinionated: it picks winners from the research and explains the trade-offs rather than presenting false symmetry. When the research surfaces a gotcha (SheetJS cannot stream XLSX, ExcelJS WorkbookWriter has a memory leak), the guides encode the workaround, not the happy fiction.

## When this stinger applies

Load when the Bee is invoked on any of:

- "Build a CSV import feature"
- "Add XLSX file upload"
- "Column-mapping wizard for my importer"
- "Parse a 100MB spreadsheet without freezing the browser"
- "Export data to Excel with styled headers"
- "Is my CSV export safe from formula injection?"
- "Compare OneSchema vs Flatfile vs dromo vs hand-rolled"
- "Why is SheetJS not streaming my XLSX?"

Do NOT load for:

- Generic file upload drop-zone UX (ux-ui-svelte-worker-bee owns the react-dropzone + progress indicator surface).
- Database upsert performance after import (db-worker-bee).
- Server-side upload endpoint hardening (security-worker-bee must audit the endpoint before production).

## First action when this stinger is loaded

Read these in order before doing anything else:

1. **`guides/00-library-decision-tree.md`** -- pick the right library stack for the user's constraints before writing a line of code.
2. **`guides/04-csv-injection-prevention.md`** -- the sanitization rule is non-negotiable; read it early so it is never forgotten.
3. **`research/research-summary.md`** -- the five headline findings from scripture-historian, including the SheetJS streaming gotcha and ExcelJS memory leak.

Then walk the remaining guides in order of the task at hand. Each guide is self-contained.

## Folder layout

```text
csv-xlsx-import-export-stinger/
+- SKILL.md                              (this file)
+- README.md                             (one-page human overview)
+- guides/
|  +- 00-library-decision-tree.md        (papaparse vs SheetJS vs exceljs vs csv-parse)
|  +- 01-streaming-parse-large-files.md  (Web Worker pattern, ExcelJS ReadStream, chunked CSV)
|  +- 02-column-mapping-ux.md            (5-stage wizard, managed vs self-hosted, RSI)
|  +- 03-validation-rules.md             (Zod row schema, error shape, abort vs collect)
|  +- 04-csv-injection-prevention.md     (dangerous prefixes, sanitize function, CWE-1236)
|  +- 05-encoding-edge-cases.md          (UTF-8 BOM, CP1252, line-ending normalization)
|  +- 06-export-xlsx.md                  (exceljs WorkbookWriter, header style, freeze pane)
|  +- 07-export-csv.md                   (streaming response, MIME type, BOM for Excel)
|  +- 08-error-reporting-ux.md           (row-level errors, partial import, download error CSV)
+- examples/
|  +- papaparse-chunked-worker.tsx        (large CSV via Web Worker + chunk callback)
|  +- sheetjs-webworker-xlsx.ts           (large XLSX via Web Worker isolation)
|  +- exceljs-workbook-builder.ts         (styled export with WorkbookWriter)
|  +- column-mapping-wizard.tsx           (minimal hand-rolled mapping component)
|  +- csv-injection-sanitize.ts           (canonical sanitize function)
+- templates/
|  +- row-error-object.ts                 (TypeScript interface for error shape)
|  +- import-result.ts                    (TypeScript interface for full import result)
|  +- import-report.md                    (markdown report skeleton for findings)
+- reports/
|  +- README.md                           (how past-run reports accumulate)
+- research/                              (DO NOT MODIFY -- owned by scripture-historian)
```

## Critical directives (from the Command Brief)

- **Never skip CSV injection sanitization even if the import target is a database, not Excel.** Why: exported data may be re-downloaded as CSV and opened in Excel later, creating a deferred injection surface. See `guides/04-csv-injection-prevention.md`.
- **Always specify the streaming strategy for files over 5 MB.** Why: synchronous `readAsArrayBuffer` on a 100 MB XLSX freezes the browser main thread and crashes low-RAM devices. See `guides/01-streaming-parse-large-files.md`.
- **Distinguish browser-side vs. server-side parse.** Why: SheetJS and exceljs have different APIs, memory models, and security profiles. See `guides/00-library-decision-tree.md`.
- **Do not recommend a managed importer without noting the pricing model.** Why: OneSchema has no free tier and a ~$38K/year median contract; Flatfile has 50 files/month free; Dromo starts at $499/month. See `guides/02-column-mapping-ux.md`.
- **Always validate and report errors at the row level, not just file level.** Why: row-level errors let users fix and re-upload rather than starting over. See `guides/08-error-reporting-ux.md`.
- **Hand off to `security-worker-bee` before any upload endpoint reaches production.** Why: file parsing is a classic attack surface (zip bombs, billion-laughs via XLSX shared strings, path traversal). The stinger covers sanitization but not endpoint hardening.

## Key gotchas from research

These are not in the official docs but emerged from the 2026 literature sweep:

1. **SheetJS cannot stream-read XLSX.** The ZIP container requires buffering the full file. Use a Web Worker to keep the main thread responsive. `xlsx-stream-rows` (maintenance status unverified -- check before recommending as primary solution) offers true bounded-memory iteration. See `guides/01-streaming-parse-large-files.md` and `research/external/2026-05-20-sheetjs-streaming-api.md`.

2. **ExcelJS WorkbookWriter memory leak.** Issue #2916, PR #2558 pending for v5.0. Workaround: call `row.commit()` on every row immediately after writing. Do NOT accumulate rows in memory. See `guides/06-export-xlsx.md` and `research/external/2026-05-20-exceljs-github-readme.md`.

3. **Tab-prefix CSV injection survives Excel save/reopen ~90% of the time; single-quote does not.** Layer all three defenses (cell sanitization + correct Content-Type + Content-Disposition). See `guides/04-csv-injection-prevention.md` and `research/external/2026-05-20-csv-injection-dead-ends.md`.

4. **react-spreadsheet-import (RSI) adds Chakra UI.** For shadcn/ui stacks, this means ~200KB+ bundle addition. Prefer the hand-rolled wizard from `examples/column-mapping-wizard.tsx` or the `bow-react-spreadsheet-import` fork for Chakra-free teams. See `guides/02-column-mapping-ux.md`.

5. **Dromo processes data client-side (Private Mode) on all plans.** OneSchema and Flatfile process server-side. This matters for GDPR/HIPAA -- only Dromo guarantees PII never leaves the browser. See `guides/02-column-mapping-ux.md` and `research/external/2026-05-20-oneschema-vs-dromo-comparison.md`.

---

*Forged by `stinger-forge` from `command-briefs/csv-xlsx-import-export-worker-bee-command-brief.md` and research gathered by `scripture-historian`. Part of The Hive by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
