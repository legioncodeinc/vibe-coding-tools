# Guide 00: Library Decision Tree

Pick the right library stack before writing any code. The wrong choice is expensive to swap.

*Derived from `research/external/2026-05-20-sheetjs-vs-exceljs-comparison.md`, `research/external/2026-05-20-papaparse-vs-csvparse-vs-fastcsv.md`, `research/external/2026-05-20-sheetjs-licensing.md`, `research/libraries/2026-05-20-sheetjs-vs-exceljs-streaming.md`.*

---

## Format matrix

| Format | Location | Recommended library | Notes |
|---|---|---|---|
| CSV (read) | Browser | **papaparse** | Worker mode, chunk callback, typed fields |
| CSV (read) | Node.js | **csv-parse** (node-csv) | Streaming transform, async iterator |
| XLSX (read) | Browser | **SheetJS CE** (`xlsx`) | Cannot stream-read -- must use Web Worker |
| XLSX (read) | Node.js | **ExcelJS WorkbookReader** | `createReadStream`, row event emitter |
| XLSX (write) | Browser | **SheetJS CE** (`xlsx`) | In-memory workbook, `writeFile` or `writeXLSX` |
| XLSX (write) | Node.js | **ExcelJS WorkbookWriter** | Streaming write, styled headers, commit rows |
| CSV (write) | Browser | **manual** (template string) | Trivial; no library needed |
| CSV (write) | Node.js | **csv-stringify** (node-csv) | Streaming, handles quoting and escaping |

---

## Decision tree

```
Need to READ a file?
├── CSV?
│   ├── Browser → papaparse (worker:true for >5 MB)
│   └── Node.js → csv-parse with async generator
└── XLSX?
    ├── Browser → SheetJS CE + Web Worker (see guides/01-streaming-parse-large-files.md)
    └── Node.js → ExcelJS WorkbookReader (createReadStream + row events)

Need to WRITE a file?
├── CSV?
│   ├── Browser → inline template string + Blob download
│   └── Node.js → csv-stringify piped to HTTP response
└── XLSX?
    ├── Browser → SheetJS CE (utils.book_new + writeXLSX)
    └── Node.js → ExcelJS WorkbookWriter (MUST commit rows individually -- see gotcha)
```

---

## papaparse (CSV read, browser)

**Version:** 5.x (stable, actively maintained)
**License:** MIT
**Bundle size:** ~22 KB gzipped

**When to use:** Any browser-side CSV parse. It is the de facto standard.

**Key options:**

```ts
Papa.parse(file, {
  header: true,        // first row becomes object keys
  worker: true,        // parse in Web Worker (required for >5 MB)
  skipEmptyLines: true,
  chunk: (results) => { /* process results.data chunk */ },
  complete: (results) => { /* final callback */ },
  error: (err) => { /* per-file error */ }
})
```

Do NOT use `Papa.parse` synchronously on files over 5 MB -- it blocks the main thread.

---

## csv-parse (CSV read, Node.js)

**Package:** `csv-parse` (part of the node-csv suite)
**Version:** 5.x
**License:** MIT

**When to use:** Server-side CSV parse, especially in Next.js API routes or App Router route handlers.

Supports async generators, transforms, and cast (type coercion). BOM stripping is built-in via the `bom` option.

---

## SheetJS CE (XLSX read + write, browser)

**Package:** `xlsx` (SheetJS Community Edition)
**Version:** 0.18.x
**License:** Apache 2.0 (confirmed 2026; attribution required in OSS disclosures)

**Critical gotcha:** SheetJS **cannot stream-read** XLSX files. The ZIP container requires the entire file to be buffered before any cell can be accessed. On a 100 MB XLSX, this means 100 MB sits in browser memory. Mitigation: run in a Web Worker to avoid main-thread blocking. See `guides/01-streaming-parse-large-files.md`.

For true bounded-memory XLSX iteration, investigate `xlsx-stream-rows` (note: maintenance status unverified as of 2026-05-20 -- check npm before recommending as primary solution).

---

## ExcelJS (XLSX read + write, Node.js)

**Package:** `exceljs`
**Version:** 4.x (v5.0 in development)
**License:** MIT

**When to use:** Server-side XLSX generation with styling (header rows, column widths, freeze panes). Also supports server-side XLSX read via `WorkbookReader` with streaming row events.

**Critical gotcha (Issue #2916):** `WorkbookWriter` has an active memory leak. Workaround: call `row.commit()` immediately after adding each row. Do NOT accumulate rows. PR #2558 is pending for v5.0.

---

## Licensing summary

| Library | License | Commercial use |
|---|---|---|
| papaparse | MIT | Yes, free |
| csv-parse | MIT | Yes, free |
| SheetJS CE | Apache 2.0 | Yes, attribution required |
| ExcelJS | MIT | Yes, free |
| react-spreadsheet-import | MIT | Yes, free |

No license fees apply for any recommended library as of 2026-05-20.

*Cited examples: `examples/papaparse-chunked-worker.tsx`, `examples/exceljs-workbook-builder.ts`*
