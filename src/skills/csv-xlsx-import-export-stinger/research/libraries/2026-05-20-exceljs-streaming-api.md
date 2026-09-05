---
source_type: github
authority: high
relevance: H
topic: exceljs-streaming
url: https://github.com/exceljs/exceljs
fetched: 2026-05-20
---

# ExcelJS: Server-Side XLSX Streaming Reader and Writer

## Summary

ExcelJS is a mature Node.js library (v4.x stable as of 2025) for reading and writing XLSX and CSV files with streaming support. Unlike SheetJS Community Edition, ExcelJS provides a true streaming interface on both the read and write paths, making it the correct choice for server-side processing of large XLSX imports.

The streaming read path uses `workbook.xlsx.createInputStream()` which returns a Node.js `Writable` stream. Piping a file read stream into it emits a `worksheet` event for each sheet, and each sheet emits `row` events for each row. This event-driven architecture enables processing files of arbitrary size without loading the full workbook into memory. Memory usage stays roughly constant regardless of file size, bounded only by the batch size of rows being processed.

ExcelJS's streaming write path uses `workbook.xlsx.createOutputStream()` or `workbook.xlsx.write(stream)`, enabling large exports to be streamed directly to an HTTP response or file without buffering the entire workbook in memory.

The library handles date serial number conversion natively when cells are typed as dates, avoiding the "45678 vs actual date" bug that plagues SheetJS CE users. Cell type coercion via the `cell.type` enum (ExcelJS.ValueType) allows reliable detection of text vs number vs date vs formula cells.

ExcelJS does NOT support legacy `.xls` (BIFF8) format, ODS, or XLSB. For these formats, a pre-conversion step (using LibreOffice CLI on the server, or SheetJS CE in the browser) is required before passing the file to ExcelJS.

## Key quotations / statistics

- ExcelJS v4.4.0 (2024) changelog includes fixes for streaming with very large workbooks (> 500,000 rows tested).
- Weekly downloads: ~1.9M (npm, 2026 data from PkgPulse)
- ExcelJS supports: XLSX, CSV only (not XLS, ODS, XLSB)

## API surface reference

```js
const ExcelJS = require("exceljs");

// Streaming import
async function streamImport(filePath) {
  const workbook = new ExcelJS.stream.xlsx.WorkbookReader(filePath, {
    worksheets: "emit",   // emit "worksheet" events
    entries: "emit",      // emit "entry" events
  });

  for await (const worksheetReader of workbook) {
    for await (const row of worksheetReader) {
      const values = row.values.slice(1); // index 1-based; slice off index 0
      // Process row values
    }
  }
}

// Streaming export
async function streamExport(data, res) {
  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    stream: res,
    useStyles: true,
  });
  const worksheet = workbook.addWorksheet("Export");
  for (const row of data) {
    worksheet.addRow(row).commit(); // commit each row to free memory
  }
  await workbook.commit();
}
```

## Key takeaways for stinger-forge

- Document the `WorkbookReader` streaming API as the standard server-side XLSX import pattern in `guides/02-xlsx-parse.md`; include the `for await ... of worksheetReader` pattern.
- Row values are 1-indexed in ExcelJS (index 0 is undefined); always `.slice(1)` before processing.
- For export streaming to HTTP responses, `WorkbookWriter` with `stream: res` avoids buffering - document this in `guides/08-export.md`.
- Warn that ExcelJS only supports XLSX/CSV; document the pre-conversion requirement for XLS/ODS files.
- ExcelJS's formula handling: cells with `type === ExcelJS.ValueType.Formula` expose `cell.result` (the last computed value) but NOT a re-execution engine; this is safe from formula injection on read.
