# Guide 06: Export XLSX (ExcelJS)

Server-side XLSX generation with styled headers, freeze pane, and the WorkbookWriter memory-leak workaround.

*Derived from `research/external/2026-05-20-exceljs-github-readme.md`, `research/libraries/2026-05-20-exceljs-streaming-api.md`, `research/external/2026-05-20-sheetjs-vs-exceljs-comparison.md`.*

---

## ExcelJS WorkbookWriter (streaming, low-RAM)

Use `WorkbookWriter` for any export that might contain more than ~1,000 rows. It streams the file to the HTTP response without buffering the full workbook in memory.

**Critical: call `row.commit()` after EVERY row.** ExcelJS has an active memory leak (Issue #2916, PR #2558) where uncommitted rows accumulate in RAM. This will OOM long-running export jobs.

```ts
import ExcelJS from 'exceljs'
import { PassThrough } from 'stream'

export async function exportToXLSX(
  data: Record<string, unknown>[],
  columns: { header: string; key: string; width?: number }[]
): Promise<Buffer> {
  const chunks: Buffer[] = []
  const stream = new PassThrough()
  stream.on('data', (chunk: Buffer) => chunks.push(chunk))

  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream })
  const worksheet = workbook.addWorksheet('Export')

  // Define columns
  worksheet.columns = columns.map((col) => ({
    header: col.header,
    key: col.key,
    width: col.width ?? 20,
  }))

  // Style the header row
  worksheet.getRow(1).font = { bold: true, size: 11 }
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E7FF' },   // light indigo
  }
  worksheet.getRow(1).commit()   // commit header row immediately

  // Freeze the header row
  worksheet.views = [{ state: 'frozen', ySplit: 1 }]

  // Write data rows
  for (const record of data) {
    const row = worksheet.addRow(record)
    row.commit()   // CRITICAL: commit immediately to avoid memory leak (Issue #2916)
  }

  await worksheet.commit()
  await workbook.commit()

  return Buffer.concat(chunks)
}
```

---

## Serving the XLSX from a Next.js Route Handler

```ts
// app/api/export/route.ts
import { exportToXLSX } from '@/lib/export'
import { sanitizeCsvCell } from '@/lib/sanitize'  // apply to all string cells

export async function GET() {
  const rawData = await fetchDataFromDB()
  const sanitized = rawData.map((row) => ({
    name: sanitizeCsvCell(row.name),
    email: sanitizeCsvCell(row.email),
    amount: row.amount,   // numbers are safe; no formula risk
  }))

  const buffer = await exportToXLSX(sanitized, [
    { header: 'Name', key: 'name', width: 25 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Amount', key: 'amount', width: 15 },
  ])

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="export.xlsx"',
    },
  })
}
```

---

## ExcelJS Workbook (in-memory, small exports)

For small datasets (< 1,000 rows) where streaming is not needed, use the regular `Workbook` class instead:

```ts
const workbook = new ExcelJS.Workbook()
const ws = workbook.addWorksheet('Data')
ws.columns = columns
ws.addRows(data)
const buffer = await workbook.xlsx.writeBuffer()
```

This does not have the commit requirement but will load the full dataset into RAM.

---

## Adding auto-filter

```ts
worksheet.autoFilter = {
  from: { row: 1, column: 1 },
  to: { row: 1, column: columns.length },
}
```

---

## ExcelJS v5.0 note

PR #2558 (memory leak fix for WorkbookWriter) is pending merge as of 2026-05-20. No release date confirmed. Watch the ExcelJS GitHub for v5.0 release and remove the `row.commit()` workaround once it ships.

See `examples/exceljs-workbook-builder.ts` for the full standalone example.

*Cited example: `examples/exceljs-workbook-builder.ts`*
