---
name: "technical-seo-stinger"
description: "100-page technical SEO audit: crawlability/indexability, sitemap/robots.txt validation, canonicalization, log-file/crawl-budget analysis, keyword-frequency and long-tail semantic analysis. Wave W5."
license: AGPL-3.0-or-later
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork.
metadata:
  hive-tier: stinger
  hive-drone: technical-seo-wasp-drone
  research-window: 2026-08-18 (three rounds; round 3 closed the crawlability/sitemap/robots.txt/canonicalization/log-file gap)
  primary-surface: external-website-audit
---

# Technical Seo Stinger

> **Forge status:** stages 1-6 of the seven-stage forge pipeline complete for this pair (Topic, Research, Distillation, References, Guides, final Skill/Drone authorship). Stage 7 (Register: pest-controller-suit registration, harness deployment, repo-reference sync) has not run yet. Everything below this line is grounded against the research archive in `references/research/`; every factual claim traces to a raw source in `references/research/raw/` or is explicitly flagged as this Stinger's own judgment call where the archive has a documented gap.

You are equipping **technical-seo-wasp-drone**, part of the Website Auditor by Legion Code Inc. plugin. Full scope and acceptance criteria: [prd-008-technical-seo](../../library/requirements/backlog/prd-008-technical-seo/prd-008-technical-seo-index.md).

Every factual claim this skill makes traces to a downloaded primary source in `references/research/raw/`, cited inline as `[raw/<file>.md]`. Two checkpoint categories - keyword-frequency analysis and long-tail semantic analysis - have **no source coverage** in this archive (`references/research/distilled-technical-seo.md` Section 12). Those two are built as clearly-flagged, uncited judgment calls (guides 07-08), never presented as researched fact.

## When to use this skill

- Wave 5 of every website-auditor run, after `site-crawler-wasp-drone` has written `site-data/` and `keyword-intelligence-wasp-drone` has written `content-targets/`
- Auditing a specific page's technical SEO elements (title/meta/canonical/robots/sitemap/structured-data) against the current standard
- Validating robots.txt or an XML sitemap for a target domain, live or from a locally saved copy
- Cross-referencing a keyword or question from `content-targets/` against actual on-page coverage
- Diagnosing a crawl-budget or indexation problem when server logs or a Search Console export were supplied at intake

## When NOT to use this skill

- Improving a repository you own (source access, deploy rights, a Ship Gate flow) - that is `seo-aeo-stinger`'s scope (a different plugin, `vibe-coding-tools`; see Related section), not this externally-facing, read-only audit tool
- Full internal link-graph analysis (click depth, anchor-text scoring, orphan reachability states, link-equity flow) - that is `internal-linking-stinger`'s own researched scope; this Stinger cross-references it rather than duplicating it (guide 09)
- Re-crawling pages already in `site-data/` - this Stinger reads that folder read-only; only the two singleton site-root files (robots.txt, sitemap.xml) get a direct fetch, and that judgment call is documented in `shared/scripts/seo-technical.py`'s own docstring
- Scoring subjective AEO citation-readiness (llms.txt, AI-crawler access, schema-for-citation) - that is `aeo-audit-stinger`'s scope, sharing the same `site-data/` and `content-targets/` inputs but scoring distinct checkpoints (PRD-009)

## Procedure

Full procedure lives in `guides/`, one file per major checkpoint category, run in this order:

1. [guides/01-audit-procedure.md](guides/01-audit-procedure.md) - the procedural spine: scope, deterministic sweep, checkpoint pass, triage, scoring, report. Read this first, every run.
2. [guides/02-crawlability-and-indexability.md](guides/02-crawlability-and-indexability.md)
3. [guides/03-xml-sitemap-validation.md](guides/03-xml-sitemap-validation.md)
4. [guides/04-robots-txt-and-noindex.md](guides/04-robots-txt-and-noindex.md)
5. [guides/05-canonicalization.md](guides/05-canonicalization.md)
6. [guides/06-log-file-analysis-and-crawl-budget.md](guides/06-log-file-analysis-and-crawl-budget.md) - conditional on the customer supplying logs at intake
7. [guides/07-keyword-frequency-analysis.md](guides/07-keyword-frequency-analysis.md) - `[subjective]`, judgment-call methodology, honestly flagged
8. [guides/08-long-tail-semantic-analysis.md](guides/08-long-tail-semantic-analysis.md) - `[subjective]`, judgment-call methodology, honestly flagged
9. [guides/09-deep-linking-and-internal-links.md](guides/09-deep-linking-and-internal-links.md) - what this Stinger scores directly vs. cross-references from internal-linking-stinger
10. [guides/10-scoring-and-report-format.md](guides/10-scoring-and-report-format.md) - the 0-6 rubric and the `03-seo/` output contract

## Progressive disclosure map

Load on demand; do not read everything up front.

| Path | Load when |
|---|---|
| `references/research/distilled-technical-seo.md` | Verifying any technical-SEO claim fast, or checking whether a number is a disclosed standard vs. a vendor heuristic |
| `references/research/raw/` | Tracing a claim to its primary source |
| `guides/01-audit-procedure.md` | Running a full pass end to end |
| `guides/02` through `guides/06` | Depth on a specific quantified checkpoint category |
| `guides/07`, `guides/08` | The two explicitly-uncited judgment-call checkpoints |
| `guides/09` | Deciding what belongs in this Stinger's report vs. internal-linking-stinger's |
| `guides/10` | Scoring and where output artifacts go |
| `references/templates/page-level-scorecard.md` | Scoring one page's full checkpoint set |
| `references/templates/audit-register-row-template.md` | Writing a finding into the plugin-wide findings register |
| `references/templates/keyword-frequency-worksheet.md` | Working the keyword-frequency judgment call |
| `references/templates/long-tail-semantic-gap-worksheet.md` | Working the long-tail semantic judgment call |
| `references/templates/technical-seo-section-report.md` | Writing the final `03-seo/technical-seo.md` deliverable |
| `references/scripts/README.md` | Running the deterministic `seo-technical.py` script (shared at plugin root, `shared/scripts/`) |

## References map

- **Research**: `references/research/distilled-technical-seo.md` (dense, cited synthesis) and `references/research/raw/` (5 primary sources: ECOSIRE's 47-point checklist, Seoxpert's discovery-to-rank-ordered audit, Digital Codex's log-file-analysis guide, Google Search Central's changelog, Semrush's recap of Google's generative-AI guide).
- **Templates**: page-level scorecard, audit-register row, keyword-frequency worksheet, long-tail semantic-gap worksheet, section-report skeleton - all in `references/templates/`.
- **Scripts**: `shared/scripts/seo-technical.py` (stdlib-only Python, robots.txt/sitemap/canonical validation), pointed to from `references/scripts/README.md`.
- **Guides**: `guides/01` through `guides/10`, one per checkpoint category, run in the order listed above.

## Related drones and stingers

- [technical-seo-wasp-drone](../../agents/technical-seo-wasp-drone.md) - this Stinger's paired Drone.
- [internal-linking-stinger](../internal-linking-stinger) - owns the full internal link-graph audit (click depth, anchor-text quality, orphan reachability states, link-equity flow); this Stinger's own deep-linking scope is deliberately narrow and cross-references that Stinger's `03-seo/internal-linking.md` output rather than re-deriving it (guide 09).
- [aeo-audit-stinger](../aeo-audit-stinger) - shares `site-data/` and `content-targets/questions.md`; scores distinct AEO-specific checkpoints (llms.txt, AI-crawler access, citation-focused schema, subjective topical alignment). See that Stinger's guide 05 for the boundary with this Stinger's own long-tail semantic guide.
- [keyword-intelligence-stinger](../keyword-intelligence-stinger) - produces the `content-targets/keywords.md` and `content-targets/questions.md` files this Stinger's `KW-###`/`Q-###` worksheets reference by ID; reconcile the exact ID convention against that Stinger's own final schema once it is authored.
- [audit-scoring-stinger](../audit-scoring-stinger) - rolls this Stinger's `TSEO-###` register rows and page-level scores into the plugin-wide XLSX scorecard.
- `seo-aeo-stinger` - a **different plugin** (`vibe-coding-tools`, not this plugin), the internal-repo SvelteKit/Payload SEO-and-AEO specialist. Consult it by skill name (there is no valid relative path from this plugin into another installed plugin's skill folder) for the underlying SEO standard where this external audit's scope overlaps - e.g. its JSON-LD schema library and Core Web Vitals budget tables are transferable reading. Do not duplicate its research archive; that Stinger optimizes a repo you own, this one audits a site you do not.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [technical-seo-wasp-drone](../../agents/technical-seo-wasp-drone.md) - this Stinger's paired Drone.
  - [internal-linking-stinger](../internal-linking-stinger) - full internal link-graph analysis; consult for click depth, anchor-text quality, and orphan reachability states rather than re-deriving them here.
  - [aeo-audit-stinger](../aeo-audit-stinger) - the AEO-specific sibling audit sharing this Stinger's inputs; consult for the boundary on long-tail semantic vs. AEO topical-alignment findings.
  - `seo-aeo-stinger` (vibe-coding-tools plugin, installed separately) - internal-repo SvelteKit SEO/AEO specialist; consult for the underlying SEO standard where this external audit's scope overlaps, do not duplicate its research archive.

## Ship Gate

This Stinger's per-run output writes only into an external customer's audit workspace (`03-seo/` inside `<domain>-audit/`, build plan section 3), never into this plugin's own repository. The Ship Gate (`security-stinger`, `quality-stinger`, `github-repo-health-stinger`, per the build plan's Q22 answer) governs commits **to this repository** - it applies when this Stinger's or its paired Drone's own files change and those changes are being committed here, not to the audit findings this Drone produces about a customer's site. A per-run audit pass does not trigger the Ship Gate; a change to this SKILL.md, its guides, or its Drone file, committed to this repo, does.
