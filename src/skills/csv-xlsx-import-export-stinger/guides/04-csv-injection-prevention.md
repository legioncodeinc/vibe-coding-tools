# Guide 04: CSV Injection Prevention (CWE-1236)

CSV injection is a real attack vector. This guide covers the full sanitization playbook, the tab-prefix defense, and the layered approach required because no single strategy is universally effective.

*Derived from `research/external/2026-05-20-owasp-csv-injection.md`, `research/security/2026-05-20-owasp-csv-injection.md`, `research/security/2026-05-20-cwe-1236-formula-injection.md`, `research/external/2026-05-20-csv-injection-dead-ends.md`, `research/external/2026-05-20-handsontable-csv-sanitization.md`.*

---

## What CSV injection is

When a CSV file containing a cell value that starts with `=`, `+`, `-`, `@`, tab (`\t`), carriage return (`\r`), or line feed (`\n`) is opened in a spreadsheet application like Excel, LibreOffice Calc, or Google Sheets, the application evaluates the cell as a formula. This can:

- Execute arbitrary DDE (Dynamic Data Exchange) commands on Windows (CVE-class).
- Exfiltrate data to an attacker-controlled server via `=HYPERLINK(...)`.
- Crash the spreadsheet application.
- Manipulate cell values the user trusts.

This is classified as **CWE-1236: Improper Neutralization of Formula Elements in a CSV File**.

**Critical: sanitization applies on EXPORT (CSV/XLSX write), not just on import.** A value stored safely in your database that was user-entered can become dangerous when you later export it to a spreadsheet. The attack surface is in the file consumers, not your servers.

---

## Dangerous prefixes

| Character | Example dangerous value | Risk |
|---|---|---|
| `=` | `=SUM(1+1)*cmd\|' /C calc'!A0` | DDE execution (Windows) |
| `+` | `+cmd\|' /C calc'!A0` | DDE execution (older Excel) |
| `-` | `-2+3+cmd\|' /C calc'!A0` | DDE execution (older Excel) |
| `@` | `@SUM(1+1)` | Legacy Excel formula evaluation |
| `\t` (tab) | `\t=SUM(1+1)` | Bypasses prefix check in some tools |
| `\r` or `\n` | `value\r=CMD` | Line injection -- creates new row |
| Full-width variants | `＝SUM(...)` (U+FF1D) | Unicode bypass in some parsers |

---

## Sanitization function (canonical implementation)

```ts
/**
 * Sanitize a cell value for safe CSV/XLSX export.
 * Prepends a tab character to values that start with formula-triggering characters.
 * The tab approach has ~90% survival through Excel save/reopen (empirical 2025 tests).
 *
 * Based on OWASP CSV Injection guidance and CWE-1236.
 */
const DANGEROUS_PREFIXES = /^[=+\-@\t\r\n]|^[＝＋－＠]/

export function sanitizeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (DANGEROUS_PREFIXES.test(str)) {
    return `\t${str}`   // tab prefix; Excel displays it as-is after trim
  }
  return str
}
```

Apply this function to **every cell value** before writing CSV or XLSX, regardless of origin (user-input, database value, calculated field). See `examples/csv-injection-sanitize.ts`.

---

## The layered defense

No single strategy is universally safe. Apply all three layers:

### Layer 1: Cell-level sanitization (above)

Sanitize each cell value with `sanitizeCsvCell()` before writing.

### Layer 2: Correct Content-Type header

```ts
// Next.js App Router route handler
return new Response(csvContent, {
  headers: {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': 'attachment; filename="export.csv"',
    'X-Content-Type-Options': 'nosniff',
  }
})
```

`Content-Disposition: attachment` prevents browser-side formula evaluation. `X-Content-Type-Options: nosniff` prevents MIME-type sniffing.

### Layer 3: Content Security Policy

Add a strict CSP that blocks `data:` and `blob:` URIs from untrusted origins to reduce the DDE attack surface in web contexts.

---

## Why single-quote prefix is NOT sufficient

A common approach is to prefix dangerous cells with `'` (single quote). **This does not work.** When a user opens the CSV in Excel and saves it, Excel strips the single-quote prefix automatically. The tab-prefix approach survives approximately 90% of save/reopen cycles empirically (vs 0% for single-quote). Neither approach is 100% safe -- the layered defense above is required.

Source: `research/external/2026-05-20-csv-injection-dead-ends.md`

---

## When to apply sanitization

| Scenario | Apply sanitization? |
|---|---|
| CSV export to browser download | Yes, always |
| XLSX export via ExcelJS | Yes, for string cells |
| CSV written to object storage (S3) | Yes -- the file may be downloaded later |
| CSV streamed to database import only | Recommended -- the data may be exported later |
| Importing CSV from user (reading, not writing) | Not required for the imported data; sanitize on export |

---

## CWE-1236 compliance note

Applying this guide's sanitization function constitutes CWE-1236 remediation. Teams required to document security controls (SOC 2, government contracts) may reference this guide and `examples/csv-injection-sanitize.ts` in their security documentation.

*Cited example: `examples/csv-injection-sanitize.ts`*
