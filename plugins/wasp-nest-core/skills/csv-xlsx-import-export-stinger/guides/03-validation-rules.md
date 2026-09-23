# Guide 03: Validation Rules

Per-row Zod validation, error shape, and the abort-vs-collect-all decision.

*Derived from `research/external/2026-05-20-row-level-error-messages.md`, `research/external/2026-05-20-partial-import-valid-rows.md`, `research/external/2026-05-20-deterministic-import-pipeline.md`.*

---

## The validation layer position

Validation runs AFTER column mapping, BEFORE database write:

```
Parse → Column map → Validate → Import
                          ↓
                    Error collection
```

---

## The row-error object shape

Every validation error must carry row context. Use the canonical shape from `templates/row-error-object.ts`:

```ts
export interface RowError {
  row: number         // 1-indexed (match spreadsheet row numbers for user clarity)
  col?: string        // column key from your schema (not the spreadsheet header)
  message: string     // human-readable; tell the user what to fix
  severity: 'error' | 'warning'
}
```

A severity of `warning` means the row can be imported with the issue noted. A severity of `error` means the row must not be imported.

---

## Per-row Zod validation

Define the target schema once and apply it to every row:

```ts
import { z } from 'zod'
import type { RowError } from './templates/row-error-object'

const RowSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  amount: z.coerce.number().positive('Amount must be positive'),
  date: z.coerce.date().optional(),
})

type ValidRow = z.infer<typeof RowSchema>

function validateRow(
  rawRow: Record<string, string>,
  rowIndex: number
): { valid: ValidRow | null; errors: RowError[] } {
  const result = RowSchema.safeParse(rawRow)
  if (result.success) return { valid: result.data, errors: [] }

  const errors: RowError[] = result.error.issues.map((issue) => ({
    row: rowIndex,
    col: issue.path[0]?.toString(),
    message: issue.message,
    severity: 'error',
  }))
  return { valid: null, errors }
}
```

Use `z.coerce.number()` and `z.coerce.date()` rather than strict type checks -- spreadsheet values are always strings on parse.

---

## Abort-vs-collect-all decision

Two strategies for handling errors:

| Strategy | When to use | UX |
|---|---|---|
| **Abort on first error** | Low tolerance for partial data; all-or-nothing requirement | "Your file has errors. Fix and re-upload." |
| **Collect all errors** | User can import valid rows and fix errors separately | "N rows imported. M rows skipped (see error report)." |

For most B2B products, **collect-all + partial import** is the better UX. Users invested time populating the spreadsheet; forcing a full re-upload for a few bad rows is punishing.

See `guides/08-error-reporting-ux.md` for the error-report UI and `templates/import-result.ts` for the full result shape.

---

## Type coercion rules

Common spreadsheet gotchas:

| Value | Problem | Fix |
|---|---|---|
| `"1,234.56"` | Comma thousand-separators break `parseFloat` | Strip commas before `z.coerce.number()` |
| `"01/31/2026"` | Ambiguous locale (MM/DD vs DD/MM) | Require ISO 8601 in template; or ask user for locale |
| `""` (empty string) | `z.string()` passes; `z.string().min(1)` fails as desired | Use `.min(1)` for required strings |
| Excel date serial number (e.g., `45634`) | SheetJS returns raw serial for raw cells | Use `XLSX.SSF.parse_date_code(serial)` or set `cellDates:true` |
| `TRUE` / `FALSE` | String, not boolean | `z.preprocess(v => v === 'TRUE', z.boolean())` |

---

## Validation pipeline for streaming imports

For large files processed in chunks, accumulate errors without blocking the stream:

```ts
const importResult: ImportResult = { imported: 0, errors: [], skipped: 0, mapping: [] }

for await (const chunk of parseCSV(file)) {
  for (let i = 0; i < chunk.length; i++) {
    const rowIndex = importResult.imported + importResult.skipped + i + 2 // +2: 1-indexed + header
    const { valid, errors } = validateRow(chunk[i], rowIndex)
    if (valid) {
      await db.insert(valid)
      importResult.imported++
    } else {
      importResult.errors.push(...errors)
      importResult.skipped++
    }
  }
}
```

*Cited examples: `examples/papaparse-chunked-worker.tsx`, `templates/row-error-object.ts`, `templates/import-result.ts`*
