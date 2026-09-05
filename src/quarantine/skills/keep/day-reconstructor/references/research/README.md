# Research archive: day-reconstructor

Domain research for the `day-reconstructor` skill. Stage 2 (archive) and stage 3
(distillation) of the Queen Bee forge pipeline.

The domain is development activity logging and changelog practice. Littlebird MCP mechanics
are not researched here: that work is already done and lives in
`../littlebird-mcp-reference.md`, copied verbatim from the foundation.

## What is here

```
research/
├── README.md                    this file
├── distilled-dev-logging.md     stage 3, every claim cited to a raw file
└── raw/                         stage 2, one file per archived source
```

12 sources archived, all fetched 2026-08-17. Each raw file carries title, URL, fetch date,
source type, and a note on why it was archived. Where a fetch was partial or blocked, the
raw file says so in a retrieval-fidelity note at the bottom.

## Source inventory

| File | Type | What it supplies |
|---|---|---|
| `raw/devlog--changelog-spec--keep-a-changelog-1-1-0.md` | official-docs | The spec itself, version 1.1.0. Six categories, guiding principles, Unreleased rule, ISO 8601 dates, the four named bad practices including commit log diffs. |
| `raw/devlog--changelog-spec--common-changelog.md` | official-docs | Competing spec. Four categories, no Unreleased, mandatory references, imperative present-tense entries, and the sharpest published argument against automation and against `git log` as a changelog. |
| `raw/devlog--commit-convention--conventional-commits-1-0-0.md` | official-docs | The spec itself, version 1.0.0. Message grammar, `feat` and `fix`, scope rule, both breaking-change signals, stated benefits. |
| `raw/devlog--versioning--semver-2-0-0.md` | official-docs | MAJOR/MINOR/PATCH definitions and the FAQ deprecation rule that makes the `Deprecated` category load-bearing. |
| `raw/devlog--tooling--git-cliff-docs.md` | official-docs | The reference commit-to-changelog generator. Establishes that a generated changelog covers exactly the set of commits and nothing else. |
| `raw/devlog--time-allocation--xia-2018-program-comprehension.md` | academic | IEEE TSE 2018. 78 developers, 3,148 monitored hours, automatic classification. Comprehension 57.62%, editing 5.02%. The coverage note's evidence. |
| `raw/devlog--time-allocation--meyer-2019-today-was-a-good-day.md` | academic | IEEE TSE 2019. 5,928 self-reports. Full workday breakdown, 4.66 interruptions, 47.3 minute longest coding stretch, and the authors' own account of self-report bias. |
| `raw/devlog--fragmentation--meyer-2017-work-life-of-developers.md` | academic | IEEE TSE 2017, via the first author's summary page. 20 developers logged. The 0.3 to 2.0 minute activity-switch finding and the three productivity chronotypes. |
| `raw/devlog--self-monitoring--meyer-2017-cscw-design-recommendations.md` | academic | CSCW 2017, via publication landing pages. What developers wanted in a retrospective summary of their own work. |
| `raw/devlog--journal-practice--stackoverflow-developer-journal.md` | vendor-blog | Stack Overflow Blog 2024. Contents of a developer journal, the debugging record instruction, and the named reason the habit is abandoned. |
| `raw/devlog--journal-practice--erikson-daily-work-journal.md` | community | Practitioner account since 2013. File structure, the 10 to 15 minute cost, and a real retrieval event for a past solution. |
| `raw/devlog--activity-metrics--getdx-measuring-developer-activity.md` | vendor-blog | Named researchers on why commit and line counts misrepresent developer work. The metric-hazard guardrail. |

## Source-type mix

- official-docs: 5 (four of them the primary specifications themselves)
- academic: 4 (three peer-reviewed IEEE TSE, one ACM CSCW)
- vendor-blog: 2
- community: 1

Specifications were fetched at their canonical URLs rather than from summaries of them, per
the assignment. Three of the four academic sources were reachable in full or near-full; two
of them were only reachable through author or research-group landing pages, and those raw
files say so and limit what may be cited from them.

## Where sources conflict

Keep a Changelog and Common Changelog disagree on category count and on the Unreleased
section. `distilled-dev-logging.md` section 1 states both readings, states which this skill
prefers, and states why. The conflict is not smoothed.

The 5.02% editing figure and the 15% coding figure look contradictory and are not.
`distilled-dev-logging.md` section 4 explains what each is measuring.

## How to use this

Read `distilled-dev-logging.md` first. Every domain claim in the skill's guides traces
through it to a raw file. If a claim is not in the distillation, it is not in the archive,
and it does not go in the skill.

Section 9 of the distillation lists the archive's seven named gaps. Three of this skill's
core mechanisms (session boundary definition, activity attribution, and problem-solution
extraction) are explicitly **not** evidenced by this archive and are labelled as design
decisions at the point of use rather than presented as researched practice.
