/**
 * row-error-object.ts
 * TypeScript interface for the canonical row-level error object used throughout
 * csv-xlsx-import-export-worker-bee's validation and error-reporting layers.
 *
 * See guides/03-validation-rules.md and guides/08-error-reporting-ux.md.
 */

/**
 * A single validation error tied to a specific row (and optionally column) in
 * the imported spreadsheet. Use 1-based row numbers that match the spreadsheet
 * row (including the header row as row 1).
 */
export interface RowError {
  /** 1-indexed row number matching the spreadsheet display (row 1 = header). */
  row: number

  /** The canonical target schema key (e.g. 'email', 'amount'). Omit for file-level errors. */
  col?: string

  /** Human-readable message telling the user what to fix. */
  message: string

  /**
   * 'error' = row must not be imported.
   * 'warning' = row may be imported with the issue noted.
   */
  severity: 'error' | 'warning'
}
