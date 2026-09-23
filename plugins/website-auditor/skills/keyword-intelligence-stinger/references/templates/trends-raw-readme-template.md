# `content-targets/trends-raw/README.md` template

Copy this file into `content-targets/trends-raw/README.md` on any run where a customer-supplied
Google Trends export was used (Tier 2). Per PRD-006 AC-4: "Given any tier-2 (customer Trends
export) input, then the raw export is preserved unmodified under `content-targets/trends-raw/`
alongside the processed output."

## What belongs in this folder

- The customer's original exported CSV file(s), byte-for-byte as received, unmodified. Google
  Trends exports come as up to three separate CSVs per search (Interest Over Time, Interest By
  Region, Related Queries), each downloaded independently from trends.google.com with no account
  or API access required. See `guides/02-tier-2-customer-trends-export.md` for the export mechanics
  and the exact caveats that make "unmodified" a binding requirement, not a formality.
- This README, filled in with the manifest below.
- Nothing else. Do not place the processed `keywords.md`/`questions.md` output here; that goes in
  the parent `content-targets/` directory. This folder is the unmodified-source archive only.

## File manifest (fill in per run)

| Filename | Export type | Search term(s) in export | Date range | Downloaded by customer on |
|---|---|---|---|---|
| `{original-filename.csv}` | `{Interest Over Time \| Interest By Region \| Related Queries}` | `{terms as entered on trends.google.com}` | `{date range selected}` | `{date, if known}` |

## Critical caveats carried forward into how this data is used (do not restate as fact elsewhere without this context)

- All scores in these files are **relative** (0-100), never an absolute search-volume count. A
  score of 87 means "near this term's own peak within this export," not "87 searches" or any
  other absolute figure.
- If multiple export files exist for different search terms, their scores are **not
  cross-comparable**. Each export gets its own independent 0-100 normalization. Do not merge
  scores across files into one combined ranking; only terms compared together within the SAME
  export share a scale.
- These files typically carry a short metadata header row before the data rows (search term,
  parameters used). Preserve it; do not strip it when archiving. Skip it only when parsing for
  `content-targets/keywords.md`/`questions.md`, not when storing.

Full mechanics and sourcing: `guides/02-tier-2-customer-trends-export.md`.
