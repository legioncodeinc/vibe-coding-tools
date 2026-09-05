# Research archive: learning-capturer

Domain research for the `learning-capturer` skill. Stage 2 (archive) and stage 3
(distillation) of the Queen Bee forge pipeline.

## What is here

```
research/
├── README.md                                  this file
├── distilled-personal-knowledge-capture.md    stage 3, every claim cited to a raw file
└── raw/                                       stage 2, one file per archived source
```

13 sources archived, all fetched 2026-08-17. Each raw file carries title, URL, fetch date,
source type, and a note on why it was archived. Several also carry an explicit "what this
source does NOT supply" block, because several of the fetches were partial and the
distillation must not over-read them.

## Source inventory

| File | Type | What it supplies |
|---|---|---|
| `raw/kb--staleness--arxiv-obsolete-stackoverflow-answers.md` | academic | Obsolescence measured over 52,177 answer threads. 58.4% already stale at posting, 20.5% ever updated, 118-day reaction lag, cause breakdown by dependency category, the include-version-and-time recommendation. |
| `raw/kb--dev-search--springer-what-developers-search-web.md` | academic | 60 developers plus 235 survey respondents. Seven-dimension search taxonomy. Error messages among the most frequent searches; config, performance, threading, security bugs among the hardest. |
| `raw/kb--dev-search--nsf-10-years-later-code-search.md` | academic | 1,945 survey responses, 100,000+ tool users, June 2025. Search frequency unchanged despite AI assistants. |
| `raw/kb--postmortem--google-sre-postmortem-culture.md` | official-docs | Required postmortem elements, threshold-based trigger criteria, the blameless principle, the unreviewed-postmortem rule, cross-postmortem trend analysis. |
| `raw/kb--entry-structure--document360-troubleshooting-articles.md` | official-docs | Six-section troubleshooting article structure, the exact-error-text searchability rule, cause omitted when unknown, title patterns. |
| `raw/kb--entry-structure--checkflow-it-runbook-template.md` | vendor-blog | Ten-section runbook structure, required metadata (named owner, version, last and next review), review cadence table, eight documentation failure modes. |
| `raw/kb--entry-structure--knowledge-base-vs-runbook.md` | vendor-blog | The discovery-versus-execution distinction and its content boundary table. |
| `raw/kb--ai-solves--clutch-devs-dont-understand-ai-code.md` | vendor-blog | n=800, June 2025: 59% use AI-generated code they do not fully understand, plus Copilot security-flaw rates. |
| `raw/kb--ai-solves--stackoverflow-trust-gap.md` | vendor-blog | Developer Survey trust series: 40% in 2023 falling to 29% in 2025 against 84% adoption. |
| `raw/kb--pkm-failure--zettelkasten-collectors-fallacy.md` | community | The Collector's Fallacy definition, the reinforcement mechanism, the liability framing, the three-part counter-practice. |
| `raw/kb--pkm-failure--keiffenheim-digital-graveyard.md` | community | Retrieval-at-the-moment-of-need as the real bottleneck. The digital graveyard quote. Explicitly zero data. |
| `raw/kb--pkm-failure--shevchenko-deleted-1500-notes.md` | community | Real counts from one failed and repaired base: unmanageable at ~2,000 notes, 4,500 peak, 1,500 deleted, 80/20 collected-to-original ratio, and the index-by-future-context repair. |
| `raw/kb--structure--devto-personal-git-repo-wiki.md` | community | Concrete on-disk layout for a plain-markdown personal knowledge base in git, and the portability argument. Does not solve search. |

## Source-type mix

- academic: 3
- official-docs: 2
- vendor-blog: 4
- community: 4

The staleness section rests on the strongest source in the archive. The
why-knowledge-bases-die section rests entirely on practitioner writing with no measured
prevalence anywhere, and every use of it in the skill's guides says so.

## How to use this

Read `distilled-personal-knowledge-capture.md` first. Every domain claim in the skill's
guides traces through it to a raw file. If a claim is not in the distillation, it is not in
the archive, and it does not go in the skill.

Section 8 of the distillation lists the archive's gaps. Five of this skill's design
decisions are explicitly **not** evidenced by this archive and are labelled as design
decisions in the guides rather than as researched practice:

1. The solve-detection method in `references/solve-detection.md`, in full.
2. Deduplication similarity thresholds and merge rules.
3. The bounded time-cost estimate.
4. The greppable symptom line and the generated index.
5. The founding premise that people re-debug problems they already solved.

Secret scrubbing is deliberately absent from this archive. That method is inherited by
reference from the `sop-forge` skill, which carries its own evidence for it. See
`references/secret-scrubbing.md`.
