# 01. Audit procedure

How to run a technical-seo-stinger pass end to end for one audit workspace, and what it must produce. This is the procedural spine; guides 02-09 supply the depth for each checkpoint category, and guide 10 covers scoring and the report skeleton.

## Where this sits in the audit run

This Stinger equips `technical-seo-wasp-drone`, one of the nine Drones in Wave 5 of the audit run (build plan section 2). It starts only after `site-crawler-wasp-drone` has finished writing `site-data/` and `keyword-intelligence-wasp-drone` has finished writing `content-targets/keywords.md` and `content-targets/questions.md`. It reads both read-only and writes only into its own `03-seo/` subfolder, with no write contention against the other eight Wave-5 Drones (build plan section 3).

## Phase 1 - scope the pass

- Confirm `site-data/` exists and is populated (up to 100 `<slug>.html`/`<slug>.md` pairs per PRD-007 AC-2). If it is empty or missing, stop and report a blocking dependency failure rather than proceeding on zero pages.
- Confirm `content-targets/keywords.md` and `content-targets/questions.md` exist, needed for AC-2 (keyword-frequency and long-tail findings must reference specific entries by ID). If either is missing, run everything except sections 4-5 of the report and flag the gap explicitly rather than silently skipping it.

## Phase 2 - deterministic sweep

Run `shared/scripts/seo-technical.py all` first (see [references/scripts/README.md](../references/scripts/README.md) for the full flag list): robots.txt reachability and intentionality, sitemap.xml well-formedness and URL honesty, and a `site-data/`-only canonical/noindex/H1 sweep. This surfaces leads cheaply before spending reasoning cycles reading every page by hand. Every script hit is a lead, not an automatic finding, confirm each one against the actual page content before it goes in the register, per conduct rule 2 (evidence at the moment of finding, not reconstructed from a script's severity_hint alone).

## Phase 3 - checkpoint-category pass

Work through the checkpoint categories, consulting the matching guide for depth on each:

- [02-crawlability-and-indexability.md](02-crawlability-and-indexability.md) - robots.txt, server responsiveness, internal 404s, redirect chains, parameter traps, orphan-page flagging
- [03-xml-sitemap-validation.md](03-xml-sitemap-validation.md) - the three-part sitemap validation and the "silent killer" coverage-gap pattern
- [04-robots-txt-and-noindex.md](04-robots-txt-and-noindex.md) - robots.txt vs. noindex mechanics, template-level noindex, staging leakage
- [05-canonicalization.md](05-canonicalization.md) - the seven canonicalization failure modes and the re-evaluation-timing caveat
- [06-log-file-analysis-and-crawl-budget.md](06-log-file-analysis-and-crawl-budget.md) - when log access is available for this engagement, and what it can and cannot tell you without it
- [07-keyword-frequency-analysis.md](07-keyword-frequency-analysis.md) - `[subjective]`/judgment-call methodology, honestly flagged as uncited
- [08-long-tail-semantic-analysis.md](08-long-tail-semantic-analysis.md) - `[subjective]`/judgment-call methodology, honestly flagged as uncited
- [09-deep-linking-and-internal-links.md](09-deep-linking-and-internal-links.md) - what this Stinger scores directly versus what it cross-references from internal-linking-stinger

Audit dependency order matters (distillation Section 2): a Critical crawlability or indexation finding makes downstream on-page findings for that page moot. Work top-down through the categories above rather than jumping straight to keyword/long-tail work on a page that is not even indexable yet.

## Phase 4 - severity triage and register

Every checkpoint result becomes a row in the audit register per [references/templates/audit-register-row-template.md](../references/templates/audit-register-row-template.md), using the plugin's named severity bands, before any 0-6 scorecard value is assigned. A finding without an evidence pointer (file path, script output artifact, or URL) is not ready for the register yet.

## Phase 5 - scoring and report

Score every checkpoint on the page-level scorecard ([references/templates/page-level-scorecard.md](../references/templates/page-level-scorecard.md)) using the plugin's 0-6 scale; boolean checkpoints resolve only to 6 or 1. Write the section report to `03-seo/technical-seo.md` per [references/templates/technical-seo-section-report.md](../references/templates/technical-seo-section-report.md) and [10-scoring-and-report-format.md](10-scoring-and-report-format.md).

## Non-negotiable operating rules

1. Never silent-pass. A clean sweep still produces the full report with "None detected" in every checked-and-clear section, per conduct rule 4.
2. Evidence over opinion - every checkpoint result cites a `site-data/` path, a script output artifact, or a live-fetch URL and status, never a description reconstructed from memory (conduct rule 2).
3. Subjective judgements (keyword-frequency, long-tail semantic coverage) are labelled `[subjective]` and kept in their own report sections, never blended into the quantified checkpoint tables (conduct rule 3).
4. Degraded fidelity, not silence, outside this archive's researched coverage - flag REDUCED COVERAGE explicitly (e.g. X-Robots-Tag header checks with no header capture available) rather than inventing a result.
5. Never state a technical-SEO fact that is not grounded in `references/research/raw/` - if it is not archived, it is not a fact yet for this Stinger. Numeric thresholds carried from vendor/practitioner sources are presented as this audit's working heuristics, never as disclosed Google standards (distillation Section 12).
6. Deep-linking findings that belong to internal-linking-stinger's own scope are cross-referenced, never duplicated (see guide 09).
