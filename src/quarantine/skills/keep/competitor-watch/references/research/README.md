# Research archive for competitor-watch

Stage 2 (archive) and stage 3 (distillation) of the forge pipeline for this skill.

## Layout

```
research/
├── README.md                                  this file
├── distilled-competitive-intelligence.md      the cited distillation, read this first
└── raw/                                       17 archived sources, one file per source
```

## How to use it

Read `distilled-competitive-intelligence.md`. Every claim in it ends in a bracketed
citation to a file in `raw/`. Every domain claim in this skill's guides traces back
through that distillation to a raw file. If a statement about competitive intelligence
practice, weak-signal theory, CI tooling, cadence, or professional ethics appears in
`SKILL.md` or in any guide under `references/` without a path back to this archive, it is
a defect.

## Sweep window

Fetched 2026-08-17. Most sources are current: Crayon 2026, Contify updated July 2026,
Qmarkets June 2026, SiftHub March 2026, Northr March 2026, Corporate Visions March 2026,
Contify new-competitor guide March 2026, Klue sources September 2025.

Four sources are older than 12 months on purpose:

- `ci--weak-signals--dpublication-interpretation.md` (2020) and the Ansoff literature it
  summarizes (1975 onward). Weak-signal theory is a standing reference body. Recency is
  not the correct quality axis for a fifty-year-old strategy framework.
- `ci--adoption--pma-why-ci-programs-fail.md` (2022). The clearest practitioner statement
  of CI program failure modes found in the sweep. Failure modes are structural.
- `ci--adoption--klue-battlecard-mistakes-data.md` (2023). The only source in the sweep
  carrying measured data on why competitive deliverables go unread.
- `ci--ethics--kompyte-too-far-cases.md` (2023) and the Pragmatic Institute guardrails
  (assets dated 2019). Trade secret case law and the SCIP code do not go stale on a
  six-month cycle.

## Source inventory

| File | Publisher | Type |
|---|---|---|
| `raw/ci--ethics--scip-code-of-ethics.md` | SCIP | official-docs |
| `raw/ci--ethics--pragmatic-institute-guardrails.md` | Pragmatic Institute | vendor-blog |
| `raw/ci--ethics--citools-legal-framework-cases.md` | competitiveintelligencetools.com | community |
| `raw/ci--ethics--kompyte-too-far-cases.md` | Kompyte | vendor-blog |
| `raw/ci--ethics--aqute-is-ci-ethical.md` | Aqute Intelligence | vendor-blog |
| `raw/ci--method--northr-ci-framework.md` | Northr | vendor-blog |
| `raw/ci--method--corporatevisions-win-loss.md` | Corporate Visions | vendor-blog |
| `raw/ci--sources--klue-internal-external-sources.md` | Klue | vendor-blog |
| `raw/ci--sources--sifthub-untapped-internal.md` | SiftHub | vendor-blog |
| `raw/ci--tooling--contify-tool-landscape.md` | Contify | vendor-blog |
| `raw/ci--adoption--crayon-state-of-ci-2026.md` | Crayon | vendor-blog |
| `raw/ci--adoption--pma-why-ci-programs-fail.md` | Product Marketing Alliance | community |
| `raw/ci--adoption--klue-battlecard-mistakes-data.md` | Klue | vendor-blog |
| `raw/ci--weak-signals--dpublication-interpretation.md` | DPublication proceedings | academic |
| `raw/ci--weak-signals--wikipedia-sews.md` | Wikipedia | community |
| `raw/ci--new-entrants--contify-detect-new-competitors.md` | Contify | vendor-blog |
| `raw/ci--new-entrants--qmarkets-horizon-scanning.md` | Qmarkets | vendor-blog |

## Source quality warning

Only one source is official-docs (the SCIP code) and only one is academic (the weak
signals paper). Everything quantitative in this archive is vendor-published by companies
that sell competitive intelligence software. Crayon, Klue, Contify, and Kompyte all have
a commercial interest in the conclusion that competitive intelligence is important and
should be done weekly with tooling. Section 4 and section 10 of the distillation carry
that caveat forward. Use the vendor numbers directionally. Do not quote a vendor
percentage to a user as a measured fact.

## Dash normalization

Dashes inside quoted source passages have been normalized to spaced hyphens throughout the
archive, and each raw file says so in its header. This keeps the whole skill folder free of
em dashes and en dashes as the authoring contract requires, at the cost of exact
typographic fidelity in quotations. Wording is unchanged.
