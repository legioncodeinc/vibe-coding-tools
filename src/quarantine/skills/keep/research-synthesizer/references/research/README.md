# Research archive for research-synthesizer

Stage 2 (archive) and stage 3 (distillation) of the forge pipeline for this skill.

## Layout

```
research/
├── README.md                                this file
├── distilled-research-synthesis-method.md   the cited distillation, read this first
└── raw/                                     15 archived sources, one file per source
```

## How to use it

Read `distilled-research-synthesis-method.md`. Every claim in it ends in a bracketed
citation to a file in `raw/`. Every domain claim in this skill's guides traces back through
that distillation to a raw file. If a statement about synthesis method, source grading,
commercial interest, how professionals keep up, or AI failure modes appears in `SKILL.md` or
in any guide under `references/` without a path back to this archive, it is a defect.

## Sweep window

Fetched 2026-08-17. The AI material is current: the joint position statement is November
2025, the Cochrane Rapid Reviews Methods Group AI statement is 2025, the Lancet fabricated
citations study is May 2026.

Five sources are older than 12 months on purpose:

- `synthesis--narrative--york-crd-popay-narrative-synthesis.md` (2006). Still the canonical
  citation for narrative synthesis method. Recency is not the right quality axis for a
  standing methodological framework.
- `sources--credibility--stanford-fact-checkers-lateral-reading.md` (2017). The founding
  study for lateral reading.
- `synthesis--rapid-review--cochrane-rrmg-interim-guidance-2020.md` (2020). The standing
  interim guidance document, still the reference version on the group's own site.
- `sources--commercial-interest--catalogofbias-industry-sponsorship.md` (standing entry,
  underlying evidence 1998 to 2017). Sponsorship bias evidence does not go stale on a
  six-month cycle.
- `keeping-up--overload--fiercehealthcare-doximity-physician-survey.md` (2022). The only
  source found in the sweep carrying survey figures on professional information overload.
- `ai--citations--cjr-tow-center-ai-search-citation-problem-2025.md` (March 2025). Within 18
  months, and the most rigorous public measurement of AI citation accuracy found.

## Source inventory

| File | Publisher | Type |
|---|---|---|
| `raw/synthesis--rapid-review--cochrane-rrmg-interim-guidance-2020.md` | Cochrane Rapid Reviews Methods Group | official-docs |
| `raw/synthesis--rapid-review--sdu-libguide-rapid-vs-systematic.md` | University of Southern Denmark library | academic |
| `raw/synthesis--scoping-review--asu-libguide-scoping-review.md` | Arizona State University Library | academic |
| `raw/synthesis--narrative--york-crd-popay-narrative-synthesis.md` | ESRC Methods Programme / CRD York | academic |
| `raw/sources--credibility--stanford-fact-checkers-lateral-reading.md` | Stanford History Education Group | academic |
| `raw/sources--credibility--uiowa-lateral-reading-practice.md` | University of Iowa Libraries | academic |
| `raw/sources--credibility--abertay-evaluation-frameworks.md` | Abertay University | academic |
| `raw/sources--commercial-interest--catalogofbias-industry-sponsorship.md` | Catalogue of Bias / CEBM Oxford | academic |
| `raw/ai--evidence-synthesis--cochrane-campbell-jbi-cee-position-2025.md` | Cochrane, Campbell, JBI, CEE | official-docs |
| `raw/ai--rapid-reviews--cochrane-rrmg-ai-position-2025.md` | Cochrane Rapid Reviews Methods Group | official-docs |
| `raw/ai--tooling--ohsu-libguide-ai-in-systematic-reviews.md` | OHSU Library | academic |
| `raw/ai--citations--forbes-lancet-fabricated-citations-2026.md` | Forbes, reporting The Lancet | journalism |
| `raw/ai--citations--cjr-tow-center-ai-search-citation-problem-2025.md` | Columbia Journalism Review, Tow Center | academic |
| `raw/keeping-up--overload--fiercehealthcare-doximity-physician-survey.md` | Fierce Healthcare, reporting Doximity | journalism |
| `raw/keeping-up--overload--eolas-medical-knowledge-half-life.md` | Eolas Medical | vendor-blog |

Three official-docs, eight academic, two journalism, one vendor-blog, plus one academic
source (`abertay`) retained only for a single narrow point.

## The honest headline

This archive is stronger on **how to be transparent about an abbreviated method** and on
**how AI-assisted synthesis fails** than it is on the thing this skill actually does. Nothing
in it addresses prior exposure. Every evidence synthesis method archived here starts from
zero and assumes the reader has read nothing. The already-knew versus new split that is this
skill's entire structure has no methodological literature behind it in this archive and is
presented throughout as a design choice, not a sourced practice.

## Source quality warning

The quantitative evidence on information overload, knowledge staleness, and sponsorship bias
is entirely from clinical medicine. Two of the three keeping-up sources are vendor content
from companies selling products premised on the finding that professionals cannot keep up.
Use those numbers directionally. Do not quote a vendor percentage to a user as a measured
fact, and do not transfer a clinical effect size to another field without labelling the
transfer as an inference.

## Dash normalization

Dashes inside quoted source passages have been normalized to spaced hyphens throughout the
archive, and each raw file says so in its header. This keeps the whole skill folder free of
em dashes and en dashes as the authoring contract requires, at the cost of exact typographic
fidelity in quotations. Wording is unchanged.
