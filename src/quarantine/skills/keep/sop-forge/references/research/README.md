# Research archive: sop-forge

Domain research for the `sop-forge` skill. Stage 2 (archive) and stage 3 (distillation) of
the Queen Bee forge pipeline.

## What is here

```
research/
├── README.md                    this file
├── distilled-sop-craft.md       stage 3, every claim cited to a raw file
└── raw/                         stage 2, one file per archived source
```

12 sources archived, all fetched 2026-08-17. Each raw file carries title, URL, fetch date,
source type, and a note on why it was archived.

## Source inventory

| File | Type | What it supplies |
|---|---|---|
| `raw/sop--official-standard--epa-qa-g6.md` | official-docs | EPA QA/G-6. Required SOP elements, the limited-experience detail test, independent-execution validation, document control. |
| `raw/sop--formats--psu-extension-writing-guide.md` | official-docs | Penn State Extension. Format selection matrix, imperative style rules, the seven-step build cycle including observation-first drafting. |
| `raw/sop--tacit-knowledge--brown-power-gore-cta-2024.md` | academic | Organizational Research Methods 2024. CTA definition, CDM and ACTA structure, probe taxonomy, read-back validation. |
| `raw/sop--tacit-knowledge--commoncog-acta.md` | community | ACTA restated for practitioners. The six knowledge-audit probes. |
| `raw/sop--tacit-knowledge--earthly-curse-of-knowledge.md` | vendor-blog | Curse of knowledge definition, Camerer / Loewenstein / Weber origin, four procedural failure modes. |
| `raw/sop--formats--scribe-sop-format.md` | vendor-blog | Four-format taxonomy for software workflows. Checklist ordering rule. Vendor effectiveness claims, flagged as marketing. |
| `raw/sop--tooling--vidocu-tool-comparison-2026.md` | vendor-blog | Scribe, Tango, Guidde, Vidocu capture mechanisms and output. The step-text quality ceiling quote. |
| `raw/sop--tooling--scribe-smart-privacy-screen.md` | official-docs | Vendor product docs. Redaction gated to Enterprise, no published limitations, no manual verification instruction. |
| `raw/sop--redaction--supportbench-screenshot-pii.md` | vendor-blog | Sensitive-data category taxonomy in screen capture, the 847-ticket incident, the 79.1% zero-leak ceiling, retention windows, regulatory frames. |
| `raw/sop--maintenance--glitter-why-docs-get-outdated.md` | vendor-blog | Four staleness causes, the 45-minute re-screenshot friction, review cadence, domain ownership model. |
| `raw/sop--maintenance--tracework-sop-review-update.md` | vendor-blog | Risk-tiered review cadence, out-of-cycle triggers, version numbering, review roles. |
| `raw/sop--delegation--foundr-six-levels.md` | community | Six levels of delegation. Archived also as a documented gap: no SOP guidance, no statistics. |

## Source-type mix

- official-docs: 3
- academic: 1
- vendor-blog: 6
- community: 2

Vendor sources dominate the tooling and maintenance sections. Their descriptions of
mechanism are usable; their effectiveness figures are marketing and are flagged as such in
the distillation.

## How to use this

Read `distilled-sop-craft.md` first. Every domain claim in the skill's guides traces
through it to a raw file. If a claim is not in the distillation, it is not in the archive,
and it does not go in the skill.

Section 11 of the distillation lists the archive's gaps. Three of the skill's design
decisions (frame deduplication, happy-path separation, the cost-of-documentation premise)
are explicitly not evidenced by this archive and are labelled as design decisions in the
guides rather than as researched practice.
