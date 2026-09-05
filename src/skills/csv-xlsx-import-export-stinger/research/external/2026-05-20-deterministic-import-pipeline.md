---
source_url: https://dev.to/r_j_multischema/how-we-built-a-deterministic-file-import-pipeline-in-typescript-csv-xlsx-zip-23pe
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: import-architecture
stinger: csv-xlsx-import-export-stinger
---

# How We Built a Deterministic File Import Pipeline in TypeScript (CSV, XLSX, ZIP)

## Summary
Engineering blog post on building a production file import pipeline with deterministic processing, Zod validation, structured error handling, and idempotent writes. Strong reference for `guides/03-validation-rules.md` and the TypeScript interface templates.

## Key quotations / statistics
- "Use schema versioning and stable keys (runKey) to ensure identical input + schema = identical output every time, preventing duplicate imports on retries"
- "Report errors by code, row, column, and message so users can fix data quickly rather than guessing"
- "Process valid files even when ZIP uploads contain unsupported files; return a skipped-file summary instead of failing the entire run"
- "Use stable keys for upsert operations to prevent duplicate records despite deterministic processing"
- "Show accepted files, skipped files with reasons, row-level validation errors, and insert/update/failed counts"
- Zod schema used for type-safe row validation with automatic TypeScript types

## Annotations for stinger-forge
- The `{row, col, code, message}` error object shape from this source should inform `templates/row-error-object.ts`
- Deterministic processing with `runKey` is a sophisticated pattern worth documenting - prevents the "I uploaded twice and got duplicates" support ticket
- Non-blocking failure mode (process valid rows, skip invalid ones) is the recommended default for `guides/08-error-reporting-ux.md`
- ZIP file handling (extracting CSV/XLSX from ZIP) is an edge case worth documenting
