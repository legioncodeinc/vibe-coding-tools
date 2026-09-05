---
source_url: https://blog.csvbox.io/partial-import-valid-rows/
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: error-reporting
stinger: csv-xlsx-import-export-stinger
---

# Support Partial Imports with Valid Rows Only - CSVBox Blog

## Summary
Guide to implementing partial imports - processing valid rows immediately while quarantining invalid rows. Contrasted with all-or-nothing import (reject entire file on first error).

## Key quotations / statistics
- "Rather than rejecting entire uploads due to a few bad rows, modern systems accept valid rows and skip invalid ones"
- "Process clean data immediately without blocking users"
- "Quarantine invalid rows with clear error messages"
- "Allows users to fix only the problem rows and re-upload"
- "Dramatically reduces friction and support load"

## Annotations for stinger-forge
- Documents the "partial import" as the recommended default for `guides/03-validation-rules.md` and `guides/08-error-reporting-ux.md`
- The all-or-nothing approach is appropriate for transactional data (bank transfers) but bad UX for CRM-style imports where some invalid rows are acceptable
- The stinger should present both modes (configurable) with partial-import as the default recommendation
