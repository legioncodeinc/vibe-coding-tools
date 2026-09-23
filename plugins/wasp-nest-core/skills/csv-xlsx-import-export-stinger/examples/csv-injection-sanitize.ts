/**
 * csv-injection-sanitize.ts
 * Canonical CSV injection sanitization function (CWE-1236 remediation).
 *
 * Apply to every cell value before writing CSV or XLSX output.
 * See guides/04-csv-injection-prevention.md for the full security rationale.
 *
 * Based on: OWASP CSV Injection guidance, empirical tab-prefix research (2025)
 */

/**
 * Characters that trigger formula evaluation in Excel, LibreOffice, Google Sheets.
 * Includes full-width Unicode variants used for bypass attempts.
 */
const FORMULA_PREFIX_REGEX = /^[=+\-@\t\r\n]|^[\uFF1D\uFF0B\uFF0D\uFF20]/

/**
 * Sanitize a single cell value for safe CSV or XLSX export.
 *
 * Strategy: prefix dangerous values with a tab character.
 * The tab approach has ~90% survival through Excel save/reopen.
 * (Single-quote prefix does NOT survive -- Excel strips it on save.)
 *
 * This function does NOT guarantee 100% safety in all environments.
 * Always combine with Layer 2 (Content-Disposition: attachment) and
 * Layer 3 (Content Security Policy). See guides/04-csv-injection-prevention.md.
 */
export function sanitizeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (FORMULA_PREFIX_REGEX.test(str)) {
    return `\t${str}`
  }
  return str
}

/**
 * Sanitize an entire row object. Numbers and booleans are safe (no formula risk).
 * Only string values need sanitization.
 */
export function sanitizeRow<T extends Record<string, unknown>>(row: T): T {
  const sanitized: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(row)) {
    sanitized[key] = typeof value === 'string' ? sanitizeCsvCell(value) : value
  }
  return sanitized as T
}

// ---- Usage examples ----
/*
// Single value
sanitizeCsvCell('=SUM(1+1)')   // returns '\t=SUM(1+1)'
sanitizeCsvCell('+CMD')        // returns '\t+CMD'
sanitizeCsvCell('Alice')       // returns 'Alice' (unchanged)
sanitizeCsvCell(42)            // returns '42' (safe, no formula risk)

// Full row
const raw = { name: '=HACK', email: 'safe@example.com', amount: 100 }
const safe = sanitizeRow(raw)
// safe: { name: '\t=HACK', email: 'safe@example.com', amount: 100 }
*/
