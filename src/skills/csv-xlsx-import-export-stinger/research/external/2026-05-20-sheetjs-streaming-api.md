---
source_url: https://docs.sheetjs.com/docs/api/stream/
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: xlsx-parsing
stinger: csv-xlsx-import-export-stinger
---

# SheetJS Community Edition - Stream Export API

## Summary
Official SheetJS documentation on streaming capabilities. Critical finding: SheetJS supports streaming WRITE (export) but does NOT support streaming READ. The ZIP container format stores directory information at the end of the file, requiring the entire file to be buffered for reading. This is a fundamental architectural constraint.

## Key quotations / statistics
- `XLSX.stream.to_csv` - streaming CSV export from a worksheet
- `XLSX.stream.to_json` - streaming JSON export from a worksheet
- `XLSX.stream.to_html` - streaming HTML export
- "SheetJS does not provide true streaming read APIs"
- "ZIP and CFB container formats store directory information at the end of the file, requiring the entire file to be buffered first"
- `sheetRows` option: limits rows parsed, but doesn't solve memory issues for very large files
- Dense mode: `dense: true` option uses arrays-of-arrays instead of objects - more memory efficient

## Key API patterns
```javascript
// Streaming export (Node.js)
const stream = XLSX.stream.to_csv(worksheet);
stream.pipe(fs.createWriteStream('output.csv'));

// Memory-efficient read with row limit
const wb = XLSX.read(data, { sheetRows: 1000 });

// Dense mode (more memory efficient)
const wb = XLSX.read(data, { dense: true });
```

## Third-party workaround
`xlsx-stream-rows` npm package provides true async row iteration with bounded memory (1.5 MiB peak heap growth on million-row files, zero dependencies).

## Annotations for stinger-forge
- THIS IS THE MOST IMPORTANT FINDING for `guides/01-streaming-parse-large-files.md`: SheetJS CAN'T stream-read, it must buffer the whole file
- For very large XLSX files in the browser, either: (a) load in a Web Worker to avoid blocking UI, (b) use xlsx-stream-rows for true streaming, (c) advise on file size limits
- SheetJS streaming WRITE is well-supported and should be used for CSV/XLSX export
- Contradicts any guides that claim SheetJS streaming reads - flag this in the skill
