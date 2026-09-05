/**
 * exceljs-workbook-builder.ts
 * Server-side XLSX generation with styled headers, freeze pane, and ExcelJS WorkbookWriter.
 *
 * CRITICAL: call row.commit() immediately after each row to avoid ExcelJS memory leak (Issue #2916).
 * PR #2558 is pending for v5.0 -- remove row.commit() workaround once it ships.
 *
 * Demonstrates: guides/06-export-xlsx.md
 * Requires: exceljs
 */

import ExcelJS from 'exceljs'
import { PassThrough } from 'stream'
import { sanitizeCsvCell } from './csv-injection-sanitize'

export interface ExportColumn {
  header: string
  key: string
  width?: number
  style?: Partial<ExcelJS.Style>
}

/**
 * Generate a styled XLSX buffer using ExcelJS WorkbookWriter (streaming, low-RAM).
 * Applies CSV injection sanitization to all string cells.
 */
export async function buildXLSXBuffer(
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  sheetName = 'Export'
): Promise<Buffer> {
  const chunks: Buffer[] = []
  const stream = new PassThrough()
  stream.on('data', (chunk: Buffer) => chunks.push(chunk))

  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream })
  const worksheet = workbook.addWorksheet(sheetName)

  // Define columns (controls width and key mapping)
  worksheet.columns = columns.map((col) => ({
    header: col.header,
    key: col.key,
    width: col.width ?? 20,
  }))

  // Style the header row
  const headerRow = worksheet.getRow(1)
  headerRow.font = { bold: true, size: 11, color: { argb: 'FF1E3A5F' } }
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E7FF' },   // light indigo background
  }
  headerRow.alignment = { vertical: 'middle', horizontal: 'left' }
  headerRow.commit()   // commit header row immediately

  // Freeze the header row so it stays visible when scrolling
  worksheet.views = [{ state: 'frozen', ySplit: 1 }]

  // Add auto-filter to all header columns
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: columns.length },
  }

  // Write data rows -- sanitize strings, commit every row immediately
  for (const record of data) {
    const sanitized: Record<string, unknown> = {}
    for (const col of columns) {
      const val = record[col.key]
      // Only sanitize strings; numbers and dates are safe
      sanitized[col.key] = typeof val === 'string' ? sanitizeCsvCell(val) : val
    }
    const row = worksheet.addRow(sanitized)
    row.commit()   // CRITICAL: prevents memory leak (Issue #2916)
  }

  await worksheet.commit()
  await workbook.commit()

  return Buffer.concat(chunks)
}

// ---- Next.js App Router Route Handler usage ----
/*
// app/api/export/route.ts
import { buildXLSXBuffer } from '@/lib/exceljs-workbook-builder'

export async function GET() {
  const records = await db.users.findAll()
  const buffer = await buildXLSXBuffer(records, [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Name', key: 'name', width: 25 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Created At', key: 'createdAt', width: 20 },
  ])

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="users-export.xlsx"',
      'Cache-Control': 'no-store',
    },
  })
}
*/
