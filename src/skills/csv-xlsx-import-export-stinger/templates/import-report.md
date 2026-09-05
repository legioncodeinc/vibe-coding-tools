# Import/Export Findings Report

**Bee:** csv-xlsx-import-export-worker-bee
**Date:** {YYYY-MM-DD}
**Feature / Ticket:** {feature-name or issue number}
**Stack:** {Next.js App Router | React + Node.js API | etc.}
**Formats in scope:** {CSV | XLSX | both}
**Max file size:** {< 5 MB | 5-50 MB | 50-500 MB | > 500 MB}

---

## Summary

{1-3 sentence overview of what was reviewed/implemented and the key decisions made.}

---

## Library Decisions

| Task | Library chosen | Rationale |
|---|---|---|
| CSV parse (browser) | {papaparse / other} | {rationale} |
| CSV parse (server) | {csv-parse / other} | {rationale} |
| XLSX parse (browser) | {SheetJS CE / other} | {rationale} |
| XLSX parse (server) | {ExcelJS WorkbookReader / other} | {rationale} |
| XLSX generate (server) | {ExcelJS WorkbookWriter / other} | {rationale} |
| Column mapping | {RSI / hand-rolled / OneSchema / Flatfile / dromo} | {rationale} |

---

## Architecture Notes

### Parse layer

{Describe the streaming strategy, chunk size, Web Worker usage, or server-side pipeline chosen.}

### Validation layer

{Describe the Zod schema, coercion rules, and abort vs. collect-all decision.}

### Column mapping

{Describe the mapping approach and whether auto-match was implemented.}

### Export

{Describe the export format, BOM handling, and how sanitization was applied.}

---

## CSV Injection Sanitization

- [ ] `sanitizeCsvCell()` applied to all string cells on export
- [ ] `Content-Disposition: attachment` set on all CSV/XLSX responses
- [ ] `X-Content-Type-Options: nosniff` set
- [ ] CWE-1236 remediation documented (if required by compliance framework)

---

## Known Gotchas Applied

- [ ] SheetJS Web Worker used (not synchronous main-thread parse) for XLSX files > 5 MB
- [ ] ExcelJS `row.commit()` called immediately after each row (Issue #2916 workaround)
- [ ] UTF-8 BOM added to CSV exports for Excel compatibility (if user-facing download)
- [ ] Row-level errors reported with 1-indexed row numbers matching spreadsheet display

---

## Open Issues / Handoffs

| Item | Owner | Status |
|---|---|---|
| Upload endpoint security review | security-worker-bee | {pending / done} |
| Database bulk-insert performance | db-worker-bee | {pending / done / n/a} |
| File drop-zone UI review | ux-ui-svelte-worker-bee | {pending / done / n/a} |

---

## Recommended Test Cases

1. Upload a 0-byte file -- should return "empty file" error.
2. Upload a file with a wrong extension (.txt instead of .csv) -- should reject with message.
3. Upload a CSV with a UTF-8 BOM -- should parse header without `\uFEFF` prefix.
4. Upload a CSV with `=SUM(1+1)` in a cell -- sanitized output should start with `\t`.
5. Upload a 50 MB CSV -- should not freeze the UI (Web Worker or streaming required).
6. Upload a CSV where all rows fail validation -- should return all errors, import 0 rows.
7. Download exported CSV in Excel -- no encoding artifacts, no formula evaluation.
