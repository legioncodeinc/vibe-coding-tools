---
source_type: official_docs
authority: high
relevance: M
topic: cwe-formula-injection
url: https://cwe.mitre.org/data/definitions/1236.html
fetched: 2026-05-20
---

# CWE-1236: Improper Neutralization of Formula Elements in a CSV File

## Summary

CWE-1236 (maintained by MITRE, current as of CWE version 4.20) formally classifies CSV/formula injection as a software weakness in the "Improper Neutralization" category. It applies when a product constructs all or part of a formula using externally-influenced input from an upstream component (user input, API response, database record) without neutralizing special elements that could alter the intended calculation.

The affected technologies span all languages and frameworks that generate CSV, XLSX, ODS, or any spreadsheet output, and all applications that import spreadsheet data with formula support enabled. The weakness is exploitable when: (1) a spreadsheet application opens the file, (2) formula evaluation is enabled (the default in Excel, LibreOffice, Google Sheets), and (3) the formula references external resources (DDE links, HTTP endpoints, file system paths).

CWE-1236's documented consequences include: executing arbitrary commands on the victim's machine (via DDE injection in older Excel versions), exfiltrating data to attacker-controlled servers (via HYPERLINK formulas making HTTP requests), and corrupting financial calculations (by injecting arithmetic that changes totals). The CVSS 3.1 base score for confirmed exploitation is 8.0 (High).

The CWE lists three primary mitigations: (1) input validation at ingestion time (reject or sanitize formula characters before storing), (2) output encoding at generation time (prefix dangerous characters at CSV/XLSX generation), and (3) documentation/user education (warn users not to enable macros or DDE when opening files from untrusted sources). CWE recommends defense in depth with all three layers.

An important subtlety: the weakness exists at BOTH the import path (when user-uploaded CSVs contain injected formulas that the application stores and later re-exports) and the export path (when application-generated CSVs include user-controlled data that was sanitized at storage but not at export time). Both paths must be defended independently.

## Key quotations / statistics

- "CWE-1236: Improper Neutralization of Formula Elements in a CSV File" - MITRE CWE 4.20
- CVSS 3.1 Base Score: 8.0 (High) for confirmed exploitation
- "The product generates a CSV file that contains user-supplied data without stripping or quoting the formula-related characters..."
- Affected technologies: "All languages, all frameworks, all operating systems"

## Key takeaways for stinger-forge

- In `guides/06-csv-injection.md`, reference CWE-1236 by number so developers can link their security review to the formal weakness classification.
- The "both paths" insight is critical: sanitize at ingest time AND at export time. Document both code paths in separate sections of the guide.
- The "documentation" mitigation from CWE is worth implementing: add a user-visible warning to the export download dialog that says "Do not enable macros when opening this file."
- For OWASP-level audits (`security-worker-bee` handoff), the test cases should explicitly verify CWE-1236 coverage.
- Frame the severity correctly: CVSS 8.0 (High) means this must be treated as a blocking issue in any security review, not a nice-to-have.
