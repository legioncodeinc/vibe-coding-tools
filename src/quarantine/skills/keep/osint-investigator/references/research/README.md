# Research archive for osint-investigator

Stage 2 (archive) and stage 3 (distillation) of the forge pipeline for this skill.

## Layout

```
research/
├── README.md                                  this file
├── distilled-due-diligence-and-osint.md       the cited distillation, read this first
└── raw/                                       13 archived sources, one file per source
```

## How to use it

Read `distilled-due-diligence-and-osint.md`. Every claim in it ends in a bracketed citation
to a file in `raw/`. Every domain claim in this skill's guides traces back through that
distillation to a raw file. If a statement about due diligence practice, source grading,
corroboration, identity resolution, or legal boundaries appears in `SKILL.md` or in any
guide under `references/` without a path back to this archive, it is a defect.

## Sweep window

Fetched 2026-08-17. Process and regulatory sources are recent: Neotas updated May 2026,
ShadowDragon 2026 guide, Ballard Spahr commentary December 2025, CFPB circular 2024.

Four sources are older than 12 months on purpose. The Admiralty scale and its critiques
(1968 to 2019), the Verification Handbook, and the FCRA and SEC material are the standing
reference texts of their fields. Recency is not the correct quality axis for a NATO
grading scale or a federal statute, and swapping them for a fresher secondary blog post
would be a downgrade in source quality, not an upgrade in currency.

## Source inventory

| File | Publisher | Type |
|---|---|---|
| `raw/diligence--source-grading--sans-admiralty.md` | SANS Institute | vendor-blog |
| `raw/diligence--source-grading--blockint-admiralty-critique.md` | Blockint | community |
| `raw/diligence--legal--ftc-fcra-screening.md` | US FTC | official-docs |
| `raw/diligence--legal--cfpb-circular-2024-06.md` | US CFPB | official-docs |
| `raw/diligence--legal--fcra-vs-nonfcra-businessscreen.md` | Business Screen | vendor-blog |
| `raw/diligence--legal--gdpr-legitimate-interest.md` | Usercentrics | vendor-blog |
| `raw/diligence--corroboration--verification-handbook.md` | European Journalism Centre | academic |
| `raw/diligence--osint-method--shadowdragon-background-check.md` | ShadowDragon | vendor-blog |
| `raw/diligence--identity-resolution--usersearch-people-search.md` | UserSearch | vendor-blog |
| `raw/diligence--process--diligent-third-party.md` | Diligent | vendor-blog |
| `raw/diligence--process--neotas-dd-types-2026.md` | Neotas | vendor-blog |
| `raw/diligence--claims--sec-false-credentials.md` | US SEC | official-docs |
| `raw/diligence--claims--founder-fraud-ballard-spahr.md` | Technical.ly / Ballard Spahr | community |

Three official-docs sources, one academic, seven vendor-blog, two community. Official docs
outrank vendor blogs outrank community posts, and where they conflict the distillation says
so and states which reading it prefers.

## Note on quoted text

Every raw file preserves source wording verbatim with one mechanical exception: em dashes
and en dashes inside quoted passages are normalized to spaced hyphens, because this repo
forbids those characters and the validation is a character grep. No words were changed.

## Recorded conflicts

Two, both carried into the distillation rather than smoothed:

1. **Admiralty scale, usable versus unreliable.** SANS presents it as directly applicable.
   Blockint assembles four decades of evidence that its central independence assumption
   fails in practice (87% of ratings collapse to the diagonal). Resolution: keep the
   two-axis structure, drop the published letter grades, define both axes locally.
2. **FCRA business-vetting carve-out.** A screening vendor asserts a clean binary. Neither
   the FTC nor the CFPB publishes an affirmative business-diligence exemption. Resolution:
   directionally right, not a safe harbor; the contractor-vetting edge case is live, and
   the skill's purpose gate refuses employment screening outright.
