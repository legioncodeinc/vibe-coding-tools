---
source_url: https://www.getaltera.com/changelog/2026-04-23-csv-exports-utf8-bom/
retrieved_on: 2026-05-20
source_type: changelog
authority: practitioner
relevance: medium
topic: encoding
stinger: csv-xlsx-import-export-stinger
---

# New CSV Encoding Option for Excel Compatibility | Altera Changelog (April 2026)

## Summary
April 2026 changelog entry from Altera (a data analytics tool) announcing that they now default to UTF-8 BOM encoding for CSV exports to ensure Excel compatibility. Confirms this is an ongoing industry issue in 2026.

## Key quotations / statistics
- "CSV exports now default to UTF-8 BOM encoding for Excel compatibility with non-English characters"
- Users can opt out by switching to UTF-8 without BOM
- The change was needed because Excel fails to correctly display non-ASCII characters in UTF-8 CSV files that lack the BOM

## Annotations for stinger-forge
- Confirms in `guides/07-export-csv.md`: for CSV files intended for Excel, include the UTF-8 BOM (`\ufeff`) at the beginning of the response
- The BOM prefix should be opt-in or the default depending on the audience: if the CSV is for programmatic consumption, BOM causes issues; if for Excel end users, BOM is needed
- Document both the BOM-prefixed and BOM-free patterns with clear guidance on when to use each
