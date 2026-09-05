---
source_url: https://handsontable.com/blog/handsontable-15.3.0-csv-sanitization-accessibility-updates-and-30-fixes
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: medium
topic: csv-injection
stinger: csv-xlsx-import-export-stinger
---

# Handsontable 15.3.0: CSV Sanitization, Accessibility Updates

## Summary
April 2025 release notes for Handsontable 15.3.0, which added native CSV sanitization via a `sanitizeValues` option. Demonstrates the industry standardizing on configurable OWASP-compliant sanitization. Useful as a reference for the expected sanitize function contract.

## Key quotations / statistics
- New `sanitizeValues` option added for CSV export
- Implements OWASP-compliant sanitization
- Configurable: can be enabled/disabled per export

## Annotations for stinger-forge
- Shows the industry trend toward opt-in configurable sanitization (not always-on)
- The `sanitizeValues` option pattern could inspire the API design for the stinger's `csv-injection-sanitize.ts` template
- The "sanitize-csv" npm package mentioned in the Command Brief does not appear to be widely documented - the inline approach from OWASP or Handsontable's pattern may be more reliable
