# Keyword-frequency worksheet

> **Honest grounding note, read before using this template.** `references/research/distilled-technical-seo.md` Section 12 states plainly: keyword-frequency scoring methodology (specific thresholds, formulas, what counts as over- or under-optimization) is **not covered by any source in this Stinger's research archive**. Nothing below is a cited standard. This worksheet is this Stinger's own reasonable, clearly-labelled judgment call for turning a raw frequency count into a `[subjective]`-adjacent signal a human auditor can act on - build it as a procedure, not as invented fact. Do not present any number on this worksheet as an authoritative SEO threshold in a customer-facing report; present it as "this audit's working method," full stop.

## Method (this Stinger's own, not sourced)

1. For each keyword entry in `content-targets/keywords.md` (format assumed as `KW-###` sequential IDs pending keyword-intelligence-stinger's own final schema - reconcile against that Stinger's actual output format once it exists), count exact and near-variant occurrences across: page `<title>`, meta description, H1, H2/H3 headings, first 100 words of body copy, and total body copy, using the Markdown extraction already in `site-data/<slug>.md` (read-only, no re-fetch).
2. Compute a simple frequency-per-1000-words ratio for the total-body-copy count, purely as a comparability aid across pages of different lengths. This is NOT a claim about an optimal density; the archive has no disclosed optimal-density standard, and neither does current mainstream SEO practice generally (keyword-stuffing penalties are about pattern, not a fixed ratio).
3. Flag, do not auto-score, these patterns for human review:
   - **Zero-presence**: a keyword tagged as a priority target with zero occurrences anywhere on its assigned page.
   - **Title/H1-absent**: present in body copy but absent from both title and H1, a placement gap rather than a frequency gap.
   - **Suspiciously repetitive**: the same exact keyword phrase appearing unnaturally often in a short span (a pattern check, not a ratio check - read the surrounding sentences before flagging).
4. Every flagged pattern becomes a `[subjective]`-labelled row in the audit register (see `audit-register-row-template.md`), never a 0-6 score on its own; keyword-frequency findings feed the subjective portion of the Search presence category per the plugin's rubric, not a boolean pass/fail leaf.

## Worksheet table

```markdown
| Keyword ID (KW-###) | Keyword text | Assigned page(s) | Title? | H1? | H2/H3 count | Body count | Per-1000-words | Flag | Notes [subjective] |
|---|---|---|---|---|---|---|---|---|---|
| KW-001 | example keyword phrase | /products/example | Y | N | 1 | 6 | 4.2 | Title/H1-absent | H1 uses a synonym instead of the exact target phrase; likely fine, flagged for auditor read |
```

## What NOT to claim

- Do not assert a "keyword density is too low/high" verdict as fact. This archive documents no such standard (distillation Section 12), and Google's own generative-AI guidance explicitly states AI features "understand synonyms and general meaning" without needing exhaustive exact-phrase repetition (distillation Section 10) - a mythbusting point worth carrying into traditional-search reasoning too, even though that specific claim was scoped to AI features.
- Do not treat this worksheet's per-1000-words ratio as a scoring input on its own; it is a triage aid to help a human reviewer find pages worth a closer read, nothing more.
