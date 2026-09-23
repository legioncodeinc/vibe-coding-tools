# Guide 07: Export CSV (Streaming)

Streaming CSV export from a Next.js route handler with correct headers and Excel BOM compatibility.

*Derived from `research/external/2026-05-20-papaparse-official-docs.md`, `research/external/2026-05-20-owasp-csv-injection.md`.*

---

## Streaming CSV in a Next.js App Router Route Handler

For large datasets, use a `ReadableStream` to avoid buffering the full CSV in memory:

```ts
// app/api/export/csv/route.ts
import { sanitizeCsvCell } from '@/lib/sanitize'

function escapeCell(value: unknown): string {
  const sanitized = sanitizeCsvCell(value)
  // RFC 4180: quote fields containing comma, newline, or double-quote
  if (/[,"\n\r]/.test(sanitized)) {
    return `"${sanitized.replace(/"/g, '""')}"`
  }
  return sanitized
}

function rowToCSVLine(row: Record<string, unknown>, keys: string[]): string {
  return keys.map((k) => escapeCell(row[k])).join(',')
}

export async function GET() {
  const headers = ['id', 'name', 'email', 'amount']

  const BOM = '\uFEFF'   // required for Excel UTF-8 detection
  const headerLine = headers.join(',') + '\r\n'

  const stream = new ReadableStream({
    async start(controller) {
      // Write BOM + header
      controller.enqueue(BOM + headerLine)

      // Stream rows in batches of 500 to avoid large DB result sets
      let offset = 0
      const batchSize = 500
      while (true) {
        const batch = await fetchBatch(offset, batchSize)
        if (batch.length === 0) break
        for (const row of batch) {
          controller.enqueue(rowToCSVLine(row, headers) + '\r\n')
        }
        offset += batchSize
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="export.csv"',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store',
    },
  })
}
```

---

## Browser-side CSV download (small files)

For client-rendered data under ~10 MB, generate and download directly in the browser:

```ts
import { sanitizeCsvCell } from '@/lib/sanitize'

export function downloadCSV(
  data: Record<string, unknown>[],
  filename: string,
  headers: { label: string; key: string }[]
) {
  const BOM = '\uFEFF'
  const headerLine = headers.map((h) => h.label).join(',')
  const lines = data.map((row) =>
    headers.map(({ key }) => {
      const sanitized = sanitizeCsvCell(row[key])
      return /[,"\n\r]/.test(sanitized) ? `"${sanitized.replace(/"/g, '""')}"` : sanitized
    }).join(',')
  )
  const csv = BOM + [headerLine, ...lines].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
```

---

## Headers checklist

Every CSV response must include all four:

```
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="export.csv"
X-Content-Type-Options: nosniff
Cache-Control: no-store
```

- `Content-Disposition: attachment` -- forces browser download, prevents in-browser formula execution.
- `X-Content-Type-Options: nosniff` -- prevents MIME-type sniffing that could cause a browser to interpret the CSV differently.
- `Cache-Control: no-store` -- prevents sensitive exports from landing in browser or CDN caches.

---

## When to use XLSX vs CSV

| Factor | Prefer CSV | Prefer XLSX |
|---|---|---|
| File size | Small to large | Small to medium |
| Styling needed | No | Yes |
| Formula support | No | Yes (with sanitization) |
| Simplest to generate | Yes | No |
| Excel users | Works with BOM | Best experience |
| Machine-to-machine | Yes | Less common |

*No separate example file; pattern is self-contained above.*
