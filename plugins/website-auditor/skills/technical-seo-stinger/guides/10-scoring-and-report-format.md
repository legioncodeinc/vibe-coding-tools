# 10. Scoring and report format

## The 0-6 scale (plugin-wide, build plan section 4.1)

| Value | Grade | Band | Definition |
|---|---|---|---|
| 0 | N/A | no-op | Checkpoint not relevant to this site type. Excluded from both numerator and denominator, never a failure. |
| 1 | F | Critical | Absent entirely, or critically failing. |
| 2 | D | High | Present but materially broken. |
| 3 | C | Medium | Present and meets baseline, low-severity findings only. |
| 4 | B minus | Low | Solid implementation, minor findings only. |
| 5 | B | Cosmetic | Strong, only cosmetic findings remain. |
| 6 | A | None | Complete, zero findings, meets or exceeds the current published standard cited in this Stinger's research archive. |

Boolean checkpoints (robots.txt reachable, canonical present and single, sitemap valid) resolve only to 6 or 1, nothing between. Every score carries all three of: numeric value, evidence pointer, one-line justification, or the scoring Drone rejects it and returns it to this Drone (build plan section 4.1).

## Where technical-seo's checkpoints sit in the plugin-wide rubric

Per build plan section 4.2, Search presence is 9% of the final grade, split as Technical SEO 3.5%, Technical AEO 3.5% (aeo-audit-stinger's scope), subjective copy read 2%. This Stinger's site-wide and per-page checkpoints (guides 02-06) are the quantified Technical SEO leaves; the keyword-frequency and long-tail semantic findings (guides 07-08) are `[subjective]`-labelled and feed the subjective portion, kept in a separate report section per conduct rule 3, never blended into the quantified 0-6 leaf scores.

## Output artifacts, per the shared workspace contract (PRD-008)

- `03-seo/technical-seo.md` - the section report, per `references/templates/technical-seo-section-report.md`.
- `03-seo/evidence/` - script output JSON (from `seo-technical.py`), page-level scorecards, and any manually captured artifacts referenced by an evidence pointer.
- Rows contributed to `scoring/findings-register.csv` (owned by `audit-scoring-stinger`, this Stinger supplies its own `TSEO-###` rows per `references/templates/audit-register-row-template.md`).

## Non-negotiables carried from conduct rules

- A clean pass still writes the full report with "None detected" per checked-and-clear section (rule 4), never a silent skip.
- Every score's evidence is captured at the moment of finding (rule 2); nothing in `03-seo/technical-seo.md` should read as reconstructed from memory after the fact.
- `[subjective]` sections stay visually and structurally separate from quantified sections in both the page-level scorecard and the section report (rule 3).
- Anything this archive cannot determine externally (log-based crawl-budget findings with no customer-supplied logs, X-Robots-Tag header checks with no header capture) is reported as REDUCED COVERAGE, never as a confirmed pass or fail (rule 5).
