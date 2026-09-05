# Research archive: invoice-chaser

Domain research for accounts receivable collection in a small business, gathered
2026-08-17. Littlebird MCP mechanics are not researched here; that archive already exists
and is copied verbatim into `references/littlebird-mcp-reference.md`.

## Layout

| Path | What it is |
|---|---|
| `raw/` | One file per archived source. Each carries title, URL, fetch date, source type, verbatim extracts, and the limitations noticed at fetch time. |
| `distilled-receivables-collection.md` | The cited distillation. Every claim ends in a bracketed pointer to its raw file. Read this before quoting any domain figure. |

## Source inventory

16 sources. Ranked by weight, official docs first.

| File | Source type | Covers |
|---|---|---|
| `law--fdcpa-definitions--uscode-1692a.md` | official-docs | Statutory definitions of "debt" and "debt collector" |
| `law--regf-contact-frequency--ecfr-1006-14.md` | official-docs | Regulation F harassment section and call-frequency presumptions |
| `law--fdcpa-scope--cfpb-askcfpb.md` | official-docs | CFPB on who the FDCPA covers, and on state law |
| `law--regf-contact-frequency--ballardspahr-2020.md` | legal-analysis | Rebuttable-presumption framing of the 7-in-7 rule |
| `law--fdcpa-scope-business--findlaw-2024.md` | legal-explainer | FDCPA and small businesses collecting their own accounts |
| `law--state-broader--rosenthal-kandh.md` | legal-explainer | California Rosenthal Act reaching original creditors |
| `aging--collectibility-by-age--crfonline-ccaofa.md` | industry-association | CCA of A collectability table, seven rows |
| `aging--collectibility-by-age--cstworldwide-ccaofa.md` | vendor | Same CCA of A survey, conflicting twelve-month row |
| `aging--collectibility-by-age--leibsolutions-2026.md` | vendor | Bands by days past due, internally inconsistent |
| `benchmarks--smb-late-payment--quickbooks-2026.md` | vendor-research | US small business overdue prevalence and cash-flow impact |
| `benchmarks--days-late--xero-sbi-2026.md` | vendor-research | Average days late by country from platform data |
| `benchmarks--ar-statistics-roundup--paidnice-2026.md` | vendor | Secondary aggregation of AR statistics with attributions |
| `cadence--reminder-sequence--chaser-2026.md` | vendor | Eight-rung reminder ladder with timing and tone |
| `prevention--payment-terms--xero-guide-2026.md` | vendor | Deposits, shorter terms, payment friction, discounts |
| `latefees--enforceability-by-state--clearreceivables-2026.md` | vendor | Written-terms requirement, commercial rates, usury examples |
| `reconciliation--unapplied-cash--stuut-2026.md` | vendor | Why payments go unmatched and what chasing a paid invoice costs |

## How to use this archive

- Before quoting a figure in any output, check it in
  `distilled-receivables-collection.md` and read the surrounding caveat.
- Two conflicts are live and are not resolved into a single number: the CCA of A
  twelve-month collectability row, and whether late payment is improving or worsening.
  Section 1 and section 2 of the distillation state the preferred reading and why.
- Section 8 of the distillation lists eight named gaps. If a question falls inside one of
  them, the answer is "the archive does not cover this," not a plausible-sounding number.
- Ten of the sixteen sources sell collection services, AR automation, or invoicing
  software. Attribute their figures to them.

Nothing in this archive is legal advice.
