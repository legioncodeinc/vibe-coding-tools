---
source_type: official_docs
authority: high
relevance: H
topic: csv-injection-prevention
url: https://owasp.org/www-community/attacks/CSV_Injection
fetched: 2026-05-20
---

# OWASP CSV Injection: Mitigation Strategies and 2025 ASVS v5 Requirements

## Summary

CSV Injection (also called Formula Injection or DDE Attack) is an OWASP-documented vulnerability (CWE-1236: Improper Neutralization of Formula Elements in a CSV File) where untrusted user input is embedded in CSV or spreadsheet exports, then executed as formulas when opened in a spreadsheet application. The attack surface is every cell that begins with a trigger character, because Excel, LibreOffice, and Google Sheets interpret those cells as formula expressions rather than text.

The trigger characters requiring sanitization are: `=` (equals), `+` (plus), `-` (minus), `@` (at), `\t` (tab, 0x09), `\r` (carriage return, 0x0D), `\n` (line feed, 0x0A), and full-width variants (`＝`, `＋`, `－`, `＠`) used to bypass ASCII-only filters in some locales. A null character (`\00`) is also documented as a bypass vector. Injection can also occur via field separator injection: an attacker inserts commas or quotes within a value to push a dangerous character to the start of the next cell.

OWASP ASVS v5.0 (updated March 2025) includes formal requirements for CSV exports: applications must follow RFC 4180 escaping rules and must escape special characters using a single quote prefix if they are the first character in a field value - this applies to CSV, XLS, XLSX, and ODF exports. The ASVS language is explicit that this is not optional for applications that export user-controlled data.

There is no universal sanitization strategy that works for all spreadsheet applications. The most reliable approach is the tab-prefix method: prepend a tab character inside a quoted field (e.g., `"\t=1+2"`). This forces Excel to treat the cell as text. However the tab character remains in the cell value, which may affect downstream processing. The double-quote wrapping approach is insufficient on its own because Excel can strip quotes when saving and re-opening a file.

The recommended defense-in-depth approach combines: (1) prefix sanitization at the cell level (strip or prefix dangerous characters), (2) `Content-Type: text/csv` response headers with `Content-Disposition: attachment` to prevent browser rendering, and (3) user awareness that downloaded CSV files should not be opened in Excel without validation.

## Key quotations / statistics

- "CSV Injection...allows attackers to use CSV files to run arbitrary commands on the victim's computer." (OWASP CSV Injection)
- "There is no universal sanitization strategy that is safe for all spreadsheet applications and all downstream consumers." (OWASP CSV Injection)
- "OWASP ASVS v5.0 requires applications to follow RFC4180 escaping rules for CSV exports and escape special characters using a single quote if they are the first character in a field value." (OWASP ASVS Issue #2811)
- CWE-1236 severity: Medium (CVSS 3.1 base score 8.0 for confirmed exploitation scenarios)

## Canonical sanitization function

```ts
/**
 * Sanitize a cell value for safe CSV/XLSX export.
 * Prefix cells starting with dangerous characters with a single quote.
 * OWASP ASVS v5 compliant.
 */
function sanitizeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  const dangerous = /^[=+\-@\t\r\n\0\uff1d\uff0b\uff0d\uff20]/;
  if (dangerous.test(str)) {
    return `'${str}`; // Single-quote prefix forces text interpretation
  }
  return str;
}
```

## Key takeaways for stinger-forge

- Document all 8+ trigger characters (including full-width variants and null byte) in `guides/06-csv-injection.md`; many implementations only cover the four common ASCII ones.
- The single-quote prefix is ASVS v5 compliant and the recommended default; document the tab-prefix alternative as a secondary option with its trade-off (tab remains in data).
- Field separator injection is an underappreciated vector; the sanitization function must run AFTER value stringification, not before, to catch injected separators.
- For managed platforms: `formulaMode: false` / `formulaMode: "disabled"` is a platform-level defense but does NOT replace cell-level sanitization on export.
- Include a test suite template in `guides/06-csv-injection.md` with payloads: `=HYPERLINK("http://evil.com","click")`, `+cmd|' /C calc'!A0`, `@SUM(1+1)*cmd|' /C calc'!A0`.
