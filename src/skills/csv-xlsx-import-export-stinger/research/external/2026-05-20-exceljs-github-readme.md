---
source_url: https://github.com/exceljs/exceljs
retrieved_on: 2026-05-20
source_type: github-readme
authority: official
relevance: critical
topic: xlsx-generation
stinger: csv-xlsx-import-export-stinger
---

# ExcelJS - GitHub README and API Reference

## Summary
ExcelJS is a Node.js (and browser) library for reading, writing, and manipulating Excel workbooks. Current version is 4.4.0. Provides a fluent API for creating styled workbooks, a streaming WorkbookWriter for large exports, and a WorkbookReader for large imports. Known memory leak issues in streaming writer in certain scenarios.

## Key quotations / statistics
- WorkbookWriter streaming API: `new stream.xlsx.WorkbookWriter({ stream: writeStream })`
- Row-level commits: `worksheet.addRow(data).commit()` - flushes row immediately to disk
- PR #2558 addresses RAM usage problems with streaming writes; pending merge into v5.0
- Issue #2953: "Out of memory while writing a large file supposed to result in 15 Mo of xlsx" - current known bug
- Issue #2916: "Memory leak in ExcelJS.stream.xlsx.WorkbookWriter" - also current

## Key API patterns
```javascript
// Streaming export (memory-efficient)
const { stream } = require('exceljs');
const writeStream = fs.createWriteStream('output.xlsx');
const wb = new stream.xlsx.WorkbookWriter({ stream: writeStream });
const ws = wb.addWorksheet('Sheet1');
ws.addRow(['Name', 'Email']).commit(); // header
for (const row of data) {
  ws.addRow([row.name, row.email]).commit(); // each row written immediately
}
await wb.commit(); // finalize

// Styled export
const wb = new ExcelJS.Workbook();
const ws = wb.addWorksheet('Sheet1');
ws.views = [{ state: 'frozen', ySplit: 1 }]; // freeze header row
ws.columns = [
  { header: 'Name', key: 'name', width: 25, style: { font: { bold: true } } }
];
ws.autoFilter = 'A1:Z1';
```

## Annotations for stinger-forge
- The memory leak in WorkbookWriter is a real gotcha for `guides/06-export-xlsx.md` - add a warning and link to the issue
- For large exports: use streaming WorkbookWriter and commit rows individually; do NOT use the non-streaming Workbook for large datasets
- Freeze pane, autoFilter, column widths - all well-supported in ExcelJS; document these as standard export polish
- The WorkbookReader (for streaming reads) should be mentioned in `guides/01-streaming-parse-large-files.md` as the server-side alternative to SheetJS for huge files
