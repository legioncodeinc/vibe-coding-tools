/**
 * papaparse-chunked-worker.tsx
 * React component that parses a large CSV file using papaparse's Web Worker mode
 * and processes rows in configurable chunks to avoid main-thread blocking.
 *
 * Demonstrates: guides/01-streaming-parse-large-files.md, guides/03-validation-rules.md
 * Requires: papaparse, react, zod
 */

'use client'

import { useState, useCallback } from 'react'
import Papa from 'papaparse'
import { z } from 'zod'

// ---- schema (customize per import target) ----
const RowSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  amount: z.coerce.number().positive('Amount must be a positive number'),
})
type ValidRow = z.infer<typeof RowSchema>

// ---- error shape from templates/row-error-object.ts ----
interface RowError {
  row: number
  col?: string
  message: string
  severity: 'error' | 'warning'
}

interface ImportResult {
  imported: number
  skipped: number
  errors: RowError[]
  durationMs: number
}

// ---- component ----
export function CSVImporter() {
  const [result, setResult] = useState<ImportResult | null>(null)
  const [progress, setProgress] = useState<number>(0)
  const [parsing, setParsing] = useState(false)

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Please upload a .csv file')
      return
    }

    const startMs = Date.now()
    let rowIndex = 1 // 1-indexed; row 1 is the header
    const imported: ValidRow[] = []
    const errors: RowError[] = []

    setParsing(true)
    setProgress(0)

    await new Promise<void>((resolve, reject) => {
      Papa.parse<Record<string, string>>(file, {
        header: true,
        worker: true,           // parse in Web Worker -- avoids main-thread block
        skipEmptyLines: true,
        chunkSize: 50_000,      // bytes per chunk; tune based on row size
        chunk: (results) => {
          for (const raw of results.data) {
            rowIndex++
            const parsed = RowSchema.safeParse(raw)
            if (parsed.success) {
              imported.push(parsed.data)
            } else {
              errors.push(
                ...parsed.error.issues.map((issue) => ({
                  row: rowIndex,
                  col: issue.path[0]?.toString(),
                  message: issue.message,
                  severity: 'error' as const,
                }))
              )
            }
          }
          // Estimate progress (papaparse does not provide total byte count mid-stream)
          setProgress((prev) => Math.min(prev + 10, 95))
        },
        complete: () => {
          setProgress(100)
          resolve()
        },
        error: (err) => reject(err),
      })
    })

    setResult({
      imported: imported.length,
      skipped: errors.filter((e) => e.severity === 'error').length,
      errors,
      durationMs: Date.now() - startMs,
    })
    setParsing(false)

    // TODO: send `imported` rows to your API or database here
    // await fetch('/api/import', { method: 'POST', body: JSON.stringify(imported) })
  }, [])

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        disabled={parsing}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
      {parsing && <p>Parsing... {progress}%</p>}
      {result && (
        <div>
          <p>Imported: {result.imported} rows</p>
          <p>Skipped: {result.skipped} rows with errors</p>
          <p>Duration: {result.durationMs} ms</p>
          {result.errors.length > 0 && (
            <ul>
              {result.errors.slice(0, 20).map((e, i) => (
                <li key={i}>Row {e.row}, {e.col}: {e.message}</li>
              ))}
              {result.errors.length > 20 && <li>...and {result.errors.length - 20} more</li>}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
