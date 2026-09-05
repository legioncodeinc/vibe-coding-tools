# Guide 08: Error Reporting UX

Row-level error model, the "N imported / M failed" summary, partial import, and the downloadable error report.

*Derived from `research/external/2026-05-20-row-level-error-messages.md`, `research/external/2026-05-20-downloadable-error-reports.md`, `research/external/2026-05-20-partial-import-valid-rows.md`, `research/external/2026-05-20-import-ux-design-guide.md`.*

---

## The row-level error contract

Every error must include:

1. **Row number** -- matching the spreadsheet row number (including the header), not a zero-indexed array index.
2. **Column reference** -- the canonical target column key (not the spreadsheet header name, which the user may have mapped away).
3. **Human message** -- tell the user *what to fix*, not just that it's wrong. "Email is required" beats "Validation failed".
4. **Severity** -- `error` (row cannot be imported) or `warning` (row imported with issue noted).

See `templates/row-error-object.ts` for the full TypeScript interface.

---

## The import result shape

```ts
// templates/import-result.ts
export interface ImportResult {
  imported: number     // rows successfully written to the database
  skipped: number      // rows skipped due to errors
  warnings: number     // rows imported with warnings
  errors: RowError[]   // all error objects collected
  mapping: ColumnMapping[]   // the column mapping used for this run
  durationMs: number   // parse + validate + write wall-clock time
}
```

---

## The "N imported / M failed" summary UI

Present the summary immediately after import completes:

```
Import complete
✅ 1,247 rows imported
⚠️  3 rows skipped (see errors below)
```

For each error, show: row number + column + message. Group by column for large error sets (> 20 errors).

When more than 50 rows fail, collapse the inline error list and rely on the downloadable error report.

---

## Downloadable error report CSV

Always offer a "Download error report" button when any rows fail. The error report is a CSV containing the original failed rows plus an added `__errors__` column:

```ts
function buildErrorReportCSV(
  originalRows: Record<string, unknown>[],
  errors: RowError[],
  headers: string[]
): string {
  const errorByRow = new Map<number, string[]>()
  for (const err of errors) {
    const existing = errorByRow.get(err.row) ?? []
    existing.push(`${err.col ?? 'general'}: ${err.message}`)
    errorByRow.set(err.row, existing)
  }

  const BOM = '\uFEFF'
  const allHeaders = [...headers, '__errors__']
  const headerLine = allHeaders.join(',')
  const lines = errors
    .map((e) => e.row - 2)   // convert to 0-indexed data array
    .filter((i, idx, arr) => arr.indexOf(i) === idx)
    .map((i) => {
      const row = originalRows[i]
      const errs = errorByRow.get(i + 2) ?? []
      return [...headers.map((h) => String(row?.[h] ?? '')), errs.join('; ')].join(',')
    })

  return BOM + [headerLine, ...lines].join('\r\n')
}
```

The user fixes the error CSV and re-uploads it. This closes the feedback loop.

---

## Partial import vs all-or-nothing

| Mode | Description | When to use |
|---|---|---|
| **Partial import** | Import valid rows; skip failed rows | Most B2B products |
| **All-or-nothing** | Import nothing if any row fails | Financial data, audit-critical records |

For partial import, use a database transaction per-row (or per-chunk) so a write failure on one row does not roll back the preceding 1,000 rows.

For all-or-nothing, wrap the entire import in a single transaction. Be aware this can hit transaction timeout limits for large files -- consider a staging table pattern instead (insert all to staging, validate, then swap into production in one atomic step).

---

## Progress indicator for large imports

For imports taking over 2 seconds, show a progress indicator. For streaming imports with chunk callbacks:

```ts
// Report progress every 10% or every 1,000 rows, whichever is smaller
const PROGRESS_INTERVAL = Math.min(Math.ceil(totalRows / 10), 1000)

let processed = 0
for await (const chunk of parseStream) {
  // ... process chunk
  processed += chunk.length
  if (processed % PROGRESS_INTERVAL === 0) {
    onProgress(Math.round((processed / totalRows) * 100))
  }
}
```

*Cited examples: `examples/papaparse-chunked-worker.tsx`, `templates/import-result.ts`, `templates/row-error-object.ts`*
