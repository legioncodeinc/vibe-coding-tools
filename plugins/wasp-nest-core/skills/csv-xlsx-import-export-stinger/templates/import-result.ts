/**
 * import-result.ts
 * TypeScript interface for the full import result returned after processing a CSV or XLSX file.
 *
 * See guides/08-error-reporting-ux.md and guides/03-validation-rules.md.
 */

import type { RowError } from './row-error-object'

/** The column mapping applied during this import run. */
export interface ColumnMapping {
  /** Header as it appeared in the uploaded spreadsheet. */
  sourceColumn: string
  /** Canonical target field key in your schema. Empty string = skipped. */
  targetField: string
}

/** Full result of a single CSV/XLSX import operation. */
export interface ImportResult {
  /** Number of rows successfully validated and written. */
  imported: number

  /** Number of rows skipped due to validation errors. */
  skipped: number

  /** Number of rows imported with warnings (non-blocking issues). */
  warnings: number

  /** All row-level errors collected during validation. */
  errors: RowError[]

  /** Column mapping used for this run (for display and re-import). */
  mapping: ColumnMapping[]

  /** Total wall-clock time in milliseconds (parse + validate + write). */
  durationMs: number
}
