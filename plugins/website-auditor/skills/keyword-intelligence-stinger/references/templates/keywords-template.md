# `content-targets/keywords.md` template

Copy-ready output template. Per PRD-006 AC-3, this file must contain between 75 and 100 entries
when the run completes, each with a source-tier tag. Delete this header block and the example rows
before shipping the real file; keep the column structure.

## Source-tier legend (use these exact tag values)

| Tag | Meaning | Volume field |
|---|---|---|
| `search-console` | Tier 1: pulled from a connected Google Search Console MCP that returned query data for this domain. | Real. From the GSC Search Analytics API's `clicks`/`impressions` fields, or a Bulk-Export/BigQuery rollup. |
| `customer-trends` | Tier 2: derived from a customer-supplied Google Trends CSV export. | Relative interest score (0-100), NEVER presented as a search-volume number. See `guides/02-tier-2-customer-trends-export.md`. |
| `ai-inference` | Tier 3: inferred from crawled/fetched site content via NLP/statistical methods when no GSC or Trends data exists. | `volume-unknown`, always. Never fabricate a number for this tier, per PRD-006's binding Non-Goal. |
| `paid-api` | Tier 4: pulled from a paid keyword API (DataForSEO, Ahrefs, or equivalent), used only as last resort. | Real, from the vendor API's own volume field. Record which vendor in the Notes column. |

## Table

| # | Keyword | Source tier | Volume | Notes |
|---|---|---|---|---|
| 1 | `{keyword phrase}` | `{search-console \| customer-trends \| ai-inference \| paid-api}` | `{number, relative score 0-100, or "volume-unknown"}` | `{e.g. "16-month GSC window, avg position 4.2" / "Trends interest score, file: trends-raw/export-01.csv" / "TF-IDF top term, page: site-data/pricing.md" / "DataForSEO Keywords For Site"}` |
| ... | ... | ... | ... | ... |

## Provenance summary block (required, appended after the table)

```
## Provenance summary

- Tier used: {search-console | customer-trends | ai-inference | paid-api | mixed}
- Tier 1 (Search Console MCP): {connected and used | connected but no data for domain | not connected}
- Tier 2 (customer Trends export): {provided and used | not provided}
- Tier 3 (AI inference): {used as fallback | not needed}
- Tier 4 (paid API): {used as last resort, vendor: {name} | not needed}
- Total keywords: {75-100 count}
- Keywords marked volume-unknown: {count}
```

This block is what makes tier degradation auditable per PRD-006 AC-1/AC-2: it must state which
tiers were tried, in order, and why the run landed on the tier it used. See
`guides/05-fallback-chain-and-provenance.md`.
