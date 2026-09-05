# Guide 01: Streaming Parse for Large Files

Files over 5 MB require a streaming or worker-based strategy. This guide covers the three production patterns.

*Derived from `research/external/2026-05-20-sheetjs-streaming-api.md`, `research/libraries/2026-05-20-papaparse-streaming-worker.md`, `research/libraries/2026-05-20-exceljs-streaming-api.md`, `research/external/2026-05-20-deterministic-import-pipeline.md`.*

---

## Size thresholds

| File size | Strategy |
|---|---|
| < 5 MB | Synchronous parse is fine |
| 5 - 50 MB | papaparse `worker:true`, SheetJS Web Worker |
| 50 - 500 MB | Chunked parse mandatory; consider server-side handoff |
| > 500 MB | Server-side only; upload to object storage (S3/R2), process with a background job |

---

## Pattern 1: Large CSV -- papaparse Web Worker + chunk callback

papaparse's `worker: true` option runs the parse in a Web Worker automatically. Use the `chunk` callback to process rows in batches rather than loading the full result array into memory.

```ts
// usage in a React component
import Papa from 'papaparse'

function parseCSVFile(file: File, onChunk: (rows: unknown[]) => void) {
  return new Promise<void>((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      worker: true,           // parse in Web Worker
      skipEmptyLines: true,
      chunkSize: 10_000,      // rows per chunk; tune for your row size
      chunk: (results) => {
        onChunk(results.data)
      },
      complete: () => resolve(),
      error: (err) => reject(err),
    })
  })
}
```

The `worker: true` option requires papaparse's worker script to be accessible from the document root. When using Next.js, add `papaparse/papaparse.min.js` to `public/` or configure the bundler to copy it. See `examples/papaparse-chunked-worker.tsx` for the full component.

---

## Pattern 2: Large XLSX (browser) -- SheetJS Web Worker isolation

**SheetJS cannot stream-read XLSX.** The ZIP container must be fully buffered before any cell is accessible. This is a hard constraint, not a configuration option.

The correct pattern is to run the entire SheetJS parse in a dedicated Web Worker so the main thread stays responsive:

```ts
// worker.ts  (Vite/Next.js worker syntax)
import * as XLSX from 'xlsx'
import type { WorkerMessage } from './types'

self.onmessage = async (e: MessageEvent<ArrayBuffer>) => {
  try {
    const workbook = XLSX.read(e.data, { type: 'array' })
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: null })
    self.postMessage({ ok: true, rows })
  } catch (err) {
    self.postMessage({ ok: false, error: (err as Error).message })
  }
}

// component.tsx
async function parseXLSXFile(file: File) {
  const buffer = await file.arrayBuffer()           // still reads whole file
  const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })
  return new Promise((resolve, reject) => {
    worker.onmessage = (e) => {
      worker.terminate()
      e.data.ok ? resolve(e.data.rows) : reject(new Error(e.data.error))
    }
    worker.postMessage(buffer, [buffer])            // transfer ownership, zero-copy
  })
}
```

For true bounded-memory iteration without buffering the whole file, `xlsx-stream-rows` is an option (zero dependencies, Apache 2.0). Verify its maintenance status on npm before recommending it as the primary solution for files > 50 MB.

See `examples/sheetjs-webworker-xlsx.ts` for the full example.

---

## Pattern 3: Large XLSX (server) -- ExcelJS WorkbookReader streaming

On the server side (Next.js App Router route handler, API route, or standalone Node.js), use ExcelJS's `WorkbookReader` with `createReadStream`:

```ts
import ExcelJS from 'exceljs'
import { Readable } from 'stream'

async function streamXLSX(
  buffer: Buffer,
  onRow: (rowValues: ExcelJS.CellValue[]) => Promise<void>
) {
  const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader()
  const readable = Readable.from(buffer)   // or pass a file path string directly

  return new Promise<void>((resolve, reject) => {
    workbookReader.on('worksheet', (worksheetReader) => {
      worksheetReader.on('row', async (row) => {
        await onRow(row.values as ExcelJS.CellValue[])
      })
    })
    workbookReader.on('end', resolve)
    workbookReader.on('error', reject)
    workbookReader.read(readable, { entries: 'emit' })
  })
}
```

Note: `WorkbookReader` does not support styled reads (formatting is read-only for generation). It is optimized for data extraction, not presentation.

---

## Open question (from research)

> **xlsx-stream-rows maturity:** Maintenance status unverified as of 2026-05-20. Check npm download count and last publish date before recommending as the primary solution for large XLSX reads in production.

*Cited example: `examples/sheetjs-webworker-xlsx.ts`, `examples/papaparse-chunked-worker.tsx`*
