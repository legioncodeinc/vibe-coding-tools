# Guide 02: Column-Mapping UX

This guide covers the 5-stage import wizard pattern, the managed importer comparison matrix, and the self-hosted alternative (react-spreadsheet-import + hand-rolled).

*Derived from `research/external/2026-05-20-import-ux-design-guide.md`, `research/external/2026-05-20-oneschema-vs-dromo-comparison.md`, `research/external/2026-05-20-flatfile-vs-oneschema-filefeed.md`, `research/external/2026-05-20-react-spreadsheet-import.md`, `research/ux-patterns/2026-05-20-column-mapping-ux.md`, `research/managed-platforms/2026-05-20-flatfile-react-embed.md`, `research/managed-platforms/2026-05-20-oneschema-column-mapping.md`, `research/managed-platforms/2026-05-20-dromo-platform.md`.*

---

## When column mapping is needed

Column mapping is required when users upload spreadsheets with **varying column headers** that need to be mapped to your application's canonical schema. If your schema is fixed and you provide a downloadable template, column mapping is optional (validate that expected columns exist and bail with an error if they are missing).

Rule of thumb:
- **Known schema + downloadable template** -- skip column mapping; validate header row.
- **Unknown schema / user-defined columns** -- add column mapping.
- **Enterprise / B2B product** -- add column mapping; users will have legacy spreadsheets with inconsistent headers.

---

## The 5-stage import wizard (canonical UX pattern)

From `research/external/2026-05-20-import-ux-design-guide.md`:

```
1. Pre-import     Upload the file; show preview (first 10 rows) + sheet selector for XLSX
2. Upload         Progress bar + file validation (extension, MIME type, size check)
3. Mapping        User assigns spreadsheet columns to your schema columns
                  Auto-match by fuzzy name similarity; show match confidence
4. Validation     Per-row Zod schema check; show errors inline in preview grid
                  "N rows valid, M rows have errors" summary
5. Confirmation   Import valid rows (option: skip errors or abort if any errors)
                  Downloadable error CSV for rows that failed
```

Each stage must be independently resumable -- users should not lose mapping progress if validation fails.

---

## Managed importer comparison matrix (2026)

| Feature | OneSchema | Flatfile | Dromo | react-spreadsheet-import |
|---|---|---|---|---|
| Free tier | None | 50 files/month + 10M PDV | None | Unlimited (OSS) |
| Starting price | ~$38,650/year (sales) | ~$99/month | $499/month | Free (MIT) |
| Data processing | Server-side | Server-side | **Client-side** (Private Mode) | Client-side |
| GDPR/HIPAA data routing | PII leaves browser | PII leaves browser | PII never leaves browser | PII never leaves browser |
| Column mapping | Yes, AI-assisted | Yes, blueprint-based | Yes, custom validations | Yes, manual |
| React component | Yes | Yes (Spaces SDK) | Yes (headless + UI) | Yes (full UI) |
| Validation hooks | Yes (JS) | Yes (Plugins API) | Yes (custom validators) | Via Zod |
| White-label | Yes (paid tiers) | Yes | Yes | Full control |
| Chakra UI dep | No | No | No | **Yes** (see note) |

**Critical note on data routing:** Only Dromo processes data entirely client-side (Private Mode is included on all plans including the lowest tier). OneSchema and Flatfile send data to their servers. For GDPR/HIPAA use cases, Dromo or a self-hosted solution is the only compliant option without a BAA.

---

## Choosing a managed importer

```
GDPR/HIPAA + sensitive PII?
├── Yes → Dromo (client-side) OR self-hosted RSI / hand-rolled
└── No  →
        Need free tier?
        ├── Yes → Flatfile (50 files/month free) or RSI
        └── No  →
                Budget < $500/month?
                ├── Yes → Flatfile Starter
                └── No  → OneSchema (if AI-assisted mapping matters)
```

---

## Self-hosted option: react-spreadsheet-import (RSI)

**Package:** `react-spreadsheet-import`
**Version:** v4.7.1 (last release August 2024, actively maintained)
**License:** MIT

RSI is the recommended self-hosted column-mapping component. It implements the full 5-stage wizard with preview grid, fuzzy column matching, Zod-compatible validation, and an error summary.

**Chakra UI dependency:** RSI depends on Chakra UI v2. For projects using shadcn/ui + Tailwind, this adds approximately 200 KB+ to the bundle. Options:
1. Accept the dependency (simplest path).
2. Use `bow-react-spreadsheet-import` -- a fork that removes Chakra UI.
3. Build a hand-rolled wizard from `examples/column-mapping-wizard.tsx`.

For shadcn/ui projects, the hand-rolled approach is preferred.

```tsx
// RSI minimal usage
import { ReactSpreadsheetImport } from 'react-spreadsheet-import'

const fields = [
  { label: 'Name', key: 'name', fieldType: { type: 'input' }, validations: [{ rule: 'required' }] },
  { label: 'Email', key: 'email', fieldType: { type: 'input' }, validations: [{ rule: 'required' }] },
]

<ReactSpreadsheetImport
  isOpen={isOpen}
  onClose={onClose}
  onSubmit={({ validData, invalidData, all }) => processImport(validData)}
  fields={fields}
/>
```

---

## Hand-rolled column-mapping wizard (shadcn/ui)

When RSI's Chakra dependency is unacceptable, build a minimal wizard using Radix Select (via shadcn) for the column-assignment dropdowns.

See `examples/column-mapping-wizard.tsx` for the complete component. Key data model:

```ts
// The mapping persisted per import session
type ColumnMapping = {
  sourceColumn: string    // spreadsheet header as-parsed
  targetColumn: string    // your schema's canonical field key
  confidence: number      // 0-1 fuzzy match score (for auto-population)
}
```

Auto-populate mappings using Jaro-Winkler or Levenshtein distance; the user confirms or overrides. Save the mapping per user/upload-type so repeat uploads auto-fill.

---

## Providing a downloadable template

Always offer a template XLSX/CSV. It eliminates column mapping entirely for most users. See `guides/06-export-xlsx.md` for the template generation pattern.

*Cited examples: `examples/column-mapping-wizard.tsx`*
