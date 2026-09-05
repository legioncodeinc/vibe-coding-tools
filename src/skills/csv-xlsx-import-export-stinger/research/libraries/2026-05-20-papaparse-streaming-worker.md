---
source_type: official_docs
authority: high
relevance: H
topic: papaparse-streaming
url: https://www.papaparse.com/docs
fetched: 2026-05-20
---

# PapaParse: Streaming and Web Worker Configuration

## Summary

PapaParse (v5 stable, v6 in active development) is the dominant JavaScript CSV parser with 7 years of production use. It is purpose-built for large-file streaming from the browser without blocking the UI thread. The core streaming model exposes two callbacks: `step` for row-by-row processing and `chunk` for block-level processing, both of which prevent the entire file from being loaded into memory at once.

The `worker: true` configuration offloads parsing to a Web Worker, which is the critical pattern for files larger than a few MB. When enabled, PapaParse spawns a dedicated thread and communicates results back via the main thread's `step`/`chunk`/`complete` callbacks. This approach is the only safe way to parse 100 MB+ CSV files in a browser without UI jank.

PapaParse v6 is currently a draft refactor (PR #1100 on GitHub, opened 2025) that rewrites the codebase to TypeScript while maintaining 100% backward API compatibility. The PR documents a modular architecture with `src/types/index.ts`, `src/core/lexer.ts`, and `src/constants/index.ts`. All existing tests pass. The upgrade path from v5 is zero-friction.

One known limitation surfaced in Issue #1014: using `preview` mode (non-streaming) on very large files (700 MB+) triggers an "UndetectableDelimiter" error. The fix is to always use streaming (`step`/`chunk`) for large files and avoid `preview` with untrusted file sizes. Streaming with `worker: true` resolves this issue entirely.

PapaParse's `encoding` config option allows specifying the character encoding (e.g., `"UTF-8"`, `"windows-1252"`). Combined with the manual BOM-strip pattern (checking for `\uFEFF` as the first character of the first header), this is the recommended path for encoding correctness. The library does NOT automatically strip UTF-8 BOM by default - this must be handled manually or via `beforeFirstChunk`.

## Key quotations / statistics

- "Papa can parse files that are gigabytes in size without crashing the browser." (papaparse.com/faq)
- "Parse gigantic files without running out of memory... Enable workers to keep your page reactive." (papaparse.com)
- "1 GB of CSV data can be parsed in approximately 20 seconds when fast mode is activated." (papaparse.com/faq)

## Configuration reference (v5/v6 compatible)

```js
Papa.parse(file, {
  worker: true,          // Web Worker thread
  header: true,          // Use first row as column names
  dynamicTyping: true,   // Auto-coerce numbers/booleans
  skipEmptyLines: true,
  encoding: "UTF-8",
  beforeFirstChunk: (chunk) => {
    // Strip UTF-8 BOM
    return chunk.startsWith("\uFEFF") ? chunk.slice(1) : chunk;
  },
  step: (row, parser) => {
    // Process each row; call parser.abort() to cancel
  },
  chunk: (results, parser) => {
    // Process a batch of rows at once
  },
  complete: (results) => {
    // All rows parsed
  },
  error: (error) => {
    // Handle parse error
  }
});
```

## Key takeaways for stinger-forge

- Use `worker: true` + `step` callback as the standard pattern for files > 10 MB; it is the single most important config choice.
- BOM stripping must be done manually via `beforeFirstChunk` - document this as a code snippet in `guides/01-csv-parse.md`.
- `dynamicTyping: true` is convenient but can silently coerce strings like "007" to integers; recommend leaving it off and doing explicit coercion post-parse.
- v6 TypeScript rewrite is stable enough to reference in guides but is not yet released; stick to v5 API surface.
- The `delimiter` config accepts an empty string `""` to trigger auto-detection from `delimitersToGuess`; document this for TSV/pipe-delimited files.
