# Guide 05: Encoding Edge Cases

UTF-8 BOM, CP1252, line-ending normalization, and the Excel-opening quirk.

*Derived from `research/external/2026-05-20-csv-parse-bom-option.md`, `research/external/2026-05-20-altera-csv-bom-changelog.md`.*

---

## The BOM problem

A UTF-8 BOM (Byte Order Mark) is the three-byte sequence `\xEF\xBB\xBF` at the start of a file. It is optional in UTF-8, but:

- **Excel requires it** to correctly detect UTF-8 encoding when opening a `.csv` file. Without the BOM, Excel interprets the file as Windows-1252 (CP1252), corrupting accented characters and non-ASCII content.
- **Many CSV parsers report the BOM as part of the first column header** (e.g., `"\ufeffName"` instead of `"Name"`), causing mapping failures.

---

## On READ: strip the BOM

```ts
// csv-parse (Node.js) -- built-in option
import { parse } from 'csv-parse'

const parser = parse({ bom: true })   // strips BOM automatically
```

```ts
// papaparse (browser) -- strips BOM automatically in v5.x
// No action required.
```

```ts
// Manual strip (if neither library handles it)
function stripBom(str: string): string {
  return str.charCodeAt(0) === 0xfeff ? str.slice(1) : str
}
```

---

## On WRITE (CSV): add the BOM for Excel compatibility

When generating a CSV that end-users will open in Excel, prefix the content with the UTF-8 BOM:

```ts
const BOM = '\uFEFF'
const csvContent = BOM + rows.map(rowToCsvLine).join('\r\n')

// In a browser download:
const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
```

**Do NOT add the BOM when generating CSVs for machine consumption** (API responses, S3 files read by other systems). Only add it for human-facing Excel downloads.

---

## Line-ending normalization

- **Windows (CRLF, `\r\n`):** Required by RFC 4180; Excel prefers CRLF.
- **Unix (LF, `\n`):** Works in most parsers but may cause double blank rows in Excel.

Rule: always write `\r\n` for CSV exports, regardless of the server OS.

For imports, normalize on read:

```ts
const normalized = rawContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
```

---

## CP1252 detection

If users upload legacy CSVs exported from old Windows software, they may be CP1252 encoded. Symptoms: garbled `é`, `ñ`, `ü` characters.

Detection strategy:

```ts
// In the browser, FileReader can detect encoding for some files
const reader = new FileReader()
reader.readAsText(file, 'windows-1252')
// Check if decoded text looks plausible vs UTF-8 decode
```

For production: require UTF-8 and provide documentation. If CP1252 support is essential, use the `iconv-lite` library on the server side to transcode before parsing.

---

## XLSX encoding: no BOM needed

XLSX files are binary ZIP containers. Encoding is defined by the format itself (UTF-8 internally). No BOM manipulation is needed for XLSX -- only for CSV.

*No worked example for this guide; the patterns above are self-contained snippets.*
