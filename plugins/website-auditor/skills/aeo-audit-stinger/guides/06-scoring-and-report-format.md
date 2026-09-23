# 06. Scoring and report format

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

Boolean checkpoints (llms.txt present, a given AI-crawler agent allowed) resolve only to 6 or 1. Every score carries all three of: numeric value, evidence pointer, one-line justification (build plan section 4.1).

## Where this Stinger's checkpoints sit in the plugin-wide rubric

Per build plan section 4.2, Search presence is 9% of the final grade, split as Technical SEO 3.5% (technical-seo-stinger), Technical AEO 3.5% (this Stinger's Part A: llms.txt, AI-crawler access, schema signals), subjective copy read 2% (shared between both Stingers' subjective sections). Part A's checkpoints are quantified 0-6 leaves. Part B (subjective topical alignment) feeds the subjective-copy-read portion and is never blended into Part A's quantified scores, per PRD-009 AC-2.

## A scoring caution specific to this archive's thinness

Because this archive has only two vendor/practitioner sources and no official llms.txt spec (distillation Section 1, Section 7), be more conservative about assigning a 1 (Critical/F) purely on a heuristic threshold miss (e.g. llms.txt slightly over the ~2,000-character truncation heuristic) than on a clean binary absence (llms.txt returns 404, GPTBot is disallowed site-wide with no stated policy). Reserve 1 for findings the archive states plainly, not for a heuristic the archive itself flags as one vendor's own operating number.

## Output artifacts, per the shared workspace contract (PRD-009)

- `04-aeo/aeo-audit.md` - the section report, per `references/templates/aeo-section-report.md`.
- `04-aeo/evidence/` - script output JSON (from `aeo-technical.py`), schema-extraction notes, and any manually captured artifacts referenced by an evidence pointer.
- Rows contributed to `scoring/findings-register.csv` (owned by `audit-scoring-stinger`), this Stinger supplies its own `AEO-###` rows per `references/templates/audit-register-row-template.md`.

## Non-negotiables carried from conduct rules

- A clean pass still writes the full report with "None detected" per checked-and-clear section (rule 4).
- Every score's evidence is captured at the moment of finding (rule 2).
- `[subjective]` sections (Part B) stay structurally separate from quantified sections (Part A) in every artifact (rule 3, PRD-009 AC-2 - this is the binding acceptance criterion for this Stinger's split, not just a style preference).
- Anything this thin archive cannot determine with real evidence is reported as REDUCED COVERAGE or attributed opinion, never as a confirmed fact (rule 5).
