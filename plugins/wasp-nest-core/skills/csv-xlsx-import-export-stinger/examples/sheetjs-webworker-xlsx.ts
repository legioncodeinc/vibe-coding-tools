/**
 * sheetjs-webworker-xlsx.ts
 * Pattern for parsing a large XLSX file in a Web Worker to avoid main-thread blocking.
 *
 * SheetJS CANNOT stream-read XLSX files (the ZIP container requires full buffering).
 * Moving the parse to a Web Worker keeps the UI responsive while the file loads.
 *
 * Demonstrates: guides/01-streaming-parse-large-files.md
 * Requires: xlsx (SheetJS CE, Apache 2.0)
 */

// ---- worker.ts (create as a separate file for Web Worker) ----
// If using Vite or Next.js with Turbopack, import as:
// const worker = new Worker(new URL('./sheetjs-worker.ts', import.meta.url), { type: 'module' })

/*
// sheetjs-worker.ts
import * as XLSX from 'xlsx'

self.onmessage = (e: MessageEvent<ArrayBuffer>) => {
  try {
    const workbook = XLSX.read(e.data, {
      type: 'array',
      cellDates: true,        // return Date objects for date cells
      cellNF: false,          // skip number format info (smaller parse)
      sheetStubs: false,      // skip empty cells
    })

    const firstSheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[firstSheetName]
    const rows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,        // return arrays (first row = headers)
      defval: null,     // null for missing cells
      blankrows: false, // skip rows that are entirely empty
    })

    // rows[0] is the header array; rows[1..] are data arrays
    const [headers, ...data] = rows as unknown[][]
    self.postMessage({ ok: true, headers, data, sheetNames: workbook.SheetNames })
  } catch (err) {
    self.postMessage({ ok: false, error: (err as Error).message })
  }
}
*/

// ---- main thread usage (React component or utility function) ----

interface XLSXParseResult {
  headers: string[]
  data: unknown[][]
  sheetNames: string[]
}

export function parseXLSXWithWorker(file: File): Promise<XLSXParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer
      if (!buffer) {
        reject(new Error('Failed to read file'))
        return
      }

      // Create the Web Worker
      // In Next.js with Turbopack, use: new Worker(new URL('./sheetjs-worker.ts', import.meta.url), { type: 'module' })
      // In Vite: same pattern
      const workerUrl = '/workers/sheetjs-worker.js' // pre-built worker script
      const worker = new Worker(workerUrl)

      worker.onmessage = (ev) => {
        worker.terminate()
        if (ev.data.ok) {
          resolve({ headers: ev.data.headers, data: ev.data.data, sheetNames: ev.data.sheetNames })
        } else {
          reject(new Error(ev.data.error))
        }
      }

      worker.onerror = (err) => {
        worker.terminate()
        reject(err)
      }

      // Transfer the ArrayBuffer ownership to the worker (zero-copy)
      worker.postMessage(buffer, [buffer])
    }

    reader.onerror = () => reject(reader.error)
    reader.readAsArrayBuffer(file)
  })
}

// ---- Usage example ----
/*
const result = await parseXLSXWithWorker(file)
// result.headers: ['Name', 'Email', 'Amount']
// result.data: [['Alice', 'alice@example.com', 100], ...]
// result.sheetNames: ['Sheet1', 'Sheet2']

// Map to objects for Zod validation:
const rows = result.data.map((row) =>
  Object.fromEntries(result.headers.map((h, i) => [h, row[i]]))
)
*/
