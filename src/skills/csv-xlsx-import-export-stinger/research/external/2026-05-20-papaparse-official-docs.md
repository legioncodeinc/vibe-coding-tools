---
source_url: https://www.papaparse.com/
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: csv-parsing
stinger: csv-xlsx-import-export-stinger
---

# Papa Parse - Powerful CSV Parser for JavaScript (Official Docs)

## Summary
Official PapaParse documentation. PapaParse (v5.4.0, latest as of 2023 but still the canonical version in 2026) is the de facto standard JavaScript CSV parser for browser-side CSV processing. Supports streaming via `step`/`chunk` callbacks, Web Worker threading via `worker: true`, local file reading, and URL-based remote file parsing.

## Key quotations / statistics
- "Papa Parse can handle files gigabytes in size without crashing the browser"
- "With fast mode enabled (for files without quoted fields), 1 GB files can be parsed in about 20 seconds"
- `worker: true` - "parse in a Web Worker so the website won't lock up - it may take slightly longer, but your page will stay reactive"
- `chunk` callback - "process entire chunks at once (usually faster than step)" - "similar to step but delivers entire chunks rather than individual rows"
- "Do not use step and chunk together - behavior is undefined"
- `NODE_STREAM_INPUT` is Node.js only; cannot be used in browsers for stream-based parsing

## Key API reference
```javascript
Papa.parse(bigFile, {
  worker: true,           // run in Web Worker
  chunk: function(results, parser) {
    // results.data is an array of rows in this chunk
    // parser.pause() / parser.resume() / parser.abort()
  },
  complete: function() { /* all done */ }
});
```

## Annotations for stinger-forge
- The canonical recipe for `guides/01-streaming-parse-large-files.md`: worker:true + chunk callback
- Critical caveat: do NOT use step + chunk together (behavior undefined)
- Fast mode (no quoted fields) dramatically improves performance - worth documenting for "append-only" data imports
- NODE_STREAM_INPUT browser limitation means browser streaming is chunked reading from File object, not a Node.js ReadableStream
- Last release was 5.4.0 in 2023 - library is mature and stable, not actively developed but widely maintained
