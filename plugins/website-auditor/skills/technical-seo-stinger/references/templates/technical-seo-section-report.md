# 03-seo/technical-seo.md output template

Copy-ready skeleton for this Stinger's write into the shared audit workspace's `03-seo/` folder (build plan section 3). Fill every bracketed field; do not leave a section blank, per conduct rule 4 (a clean pass still produces a "None detected" section, never a silent skip).

```markdown
# Technical SEO audit

Run date: <ISO date>
Site: <domain>
Pages evaluated: <count from site-data/, up to 100>
Coverage note: <state plainly if any checkpoint could not run, e.g. "X-Robots-Tag header checks require a live header capture not present in this run's site-data/; those checkpoints are marked REDUCED COVERAGE below.">

## 1. Site-wide technical checkpoints

| Checkpoint | Score (0-6) | Evidence | Justification |
|---|---|---|---|
| robots.txt reachability | | | |
| robots.txt intentionality | | | |
| XML sitemap validity | | | |
| XML sitemap honesty | | | |
| Sitemap coverage vs. crawled pages | | | |

## 2. Per-page checkpoints (rollup; full detail in page-level scorecards under `evidence/`)

| Page | Title/meta | Canonical | Noindex conflict | H1 | Structured data | Overall page score |
|---|---|---|---|---|---|---|
| <path> | | | | | | |

## 3. Deep-linking (cross-linked, not duplicated)

This Stinger flags orphan-page and internal-link-integrity signals it observes directly while scoring the checkpoints above (e.g. an internal link pointing at a pre-redirect URL rather than the canonical form). Full link-graph analysis (click depth, anchor-text quality, link-equity distribution) is internal-linking-stinger's own scope; see `03-seo/internal-linking.md` for that Stinger's output and cross-reference rather than re-deriving it here.

## 4. Keyword-frequency findings [subjective, judgment-call methodology - see references/templates/keyword-frequency-worksheet.md]

<summary table or link to the completed worksheet, referencing keywords by KW-### ID per AC-2>

## 5. Long-tail semantic-coverage findings [subjective, judgment-call methodology - see references/templates/long-tail-semantic-gap-worksheet.md]

<summary table or link to the completed worksheet, referencing questions by Q-### ID per AC-2>

## 6. Audit register

<link to or embed of this run's TSEO-### rows, per references/templates/audit-register-row-template.md>

## 7. Research gaps disclosed to the auditor

Carried forward from `references/research/distilled-technical-seo.md` Section 12: numeric thresholds throughout this report (title/meta character ranges, TTFB targets, redirect-hop warnings) are practitioner/vendor operating heuristics, not disclosed Google standards. Keyword-frequency and long-tail semantic methodology are this Stinger's own judgment call, not a cited standard - see the two worksheet files for the full honesty note.
```
