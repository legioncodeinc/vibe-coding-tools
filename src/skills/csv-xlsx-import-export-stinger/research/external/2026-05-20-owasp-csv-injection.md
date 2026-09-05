---
source_url: https://owasp.org/www-community/attacks/CSV_Injection
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: csv-injection
stinger: csv-xlsx-import-export-stinger
---

# OWASP CSV Injection

## Summary
The authoritative OWASP definition of CSV Injection (also called Formula Injection). Describes the attack vector, the characters that trigger formula execution, and the recommended mitigations. A landmark reference for any CSV export sanitization guide.

## Key quotations / statistics
- "CSV Injection (also known as Formula Injection) occurs when websites embed untrusted input inside CSV files"
- Dangerous characters that trigger formula execution: `=`, `+`, `-`, `@`, Tab (`0x09`), Carriage return (`0x0D`), Line feed (`0x0A`)
- "In addition to this, attackers may utilize the fact that the application fields contain field separators and quotes in them to inject additional data fields"
- Full-width variants trigger in some locales: `＝`, `＋`, `－`, `＠`
- **Standard mitigations (less reliable):** wrap in double quotes, prepend single quote, escape double quotes
- **Excel-resistant mitigation:** prefix formula-triggering cells with tab character (`\t`) inside quoted fields
- "No universal sanitization strategy is safe for all spreadsheet applications and downstream consumers"
- Microsoft Excel removes quotes/escape characters on save-reopen, potentially re-activating formulas (GitHub Issue #517 in OWASP community)

## Annotations for stinger-forge
- This is the foundational reference for `guides/04-csv-injection-prevention.md`
- The "no universal safe strategy" finding is important - the skill should recommend defense-in-depth: sanitize AND serve with correct Content-Type/Content-Disposition headers
- The tab-character prefix approach is the best single technique for human-viewing scenarios
- Full-width variant risk (`＝` etc.) is often overlooked - should be in the sanitize function
- The OWASP ASVS V1 (Encoding and Sanitization) has related guidelines for completeness
