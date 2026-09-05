# Research archive: daily-brief

Stage 2 and stage 3 of the forge pipeline for the `daily-brief` skill.

## Layout

| Path | What it is |
|---|---|
| `distilled-daily-brief-design.md` | The cited distillation. Read this first. Every claim ends in a bracketed citation to a file in `raw/`. |
| `raw/` | One file per archived source, each headed with title, URL, fetch date, and source type. |

## Sweep

Run 2026-08-17. Fourteen sources archived against the five required research targets. The
sweep was deliberately biased toward measured findings and away from productivity-guru
content; where guru content is archived, it is archived as the statement of a position
rather than as evidence, and the raw file says so.

| Required target | Sources |
|---|---|
| Morning routines, planning, prioritization, and what improves a day's output | `brief--planning--masicampo-baumeister-jpsp-2011.md`, `brief--planning--gollwitzer-sheeran-meta-analysis-2006.md`, `brief--morning-routines--simplypsychology-2026.md` |
| Single-highest-priority framing, evidence for and against | `brief--single-priority--todoist-eat-the-frog.md` (for), `brief--single-priority--highley-eat-the-frog-critique.md` (against), `brief--planning--gollwitzer-sheeran-meta-analysis-2006.md` (what actually has support) |
| Notification and digest fatigue, why recurring digests get abandoned | `brief--notification-batching--fitz-computers-in-human-behavior-2019.md`, `brief--digest-fatigue--cleanemail-stats-2026.md`, `brief--digest-fatigue--beehiiv-open-rate-decline-2026.md` |
| Executive briefing format and length norms | `brief--brief-format--cipherbrief-presidents-daily-brief.md`, `brief--brief-format--bluf-army-regulation-25-50.md`, `brief--brief-length--nngroup-how-little-users-read.md` |
| Decision quality by time of day | `brief--time-of-day--linder-antibiotic-prescribing-jama-2014.md`, `brief--time-of-day--glockner-hungry-judge-revisited-2016.md`, `brief--time-of-day--facchin-chronotype-sports-medicine-open-2018.md` |

## Source quality

| Type | Count | Files |
|---|---|---|
| academic | 6 | fitz-2019, masicampo-baumeister-2011, gollwitzer-sheeran-2006, facchin-2018, glockner-2016, linder-2014 |
| industry-research | 1 | nngroup |
| practitioner | 1 | cipherbrief |
| vendor-docs | 1 | beehiiv |
| vendor-blog | 2 | cleanemail, todoist |
| community | 3 | bluf-wikipedia, highley, simplypsychology |

Ranking applied throughout the distillation: academic outranks industry research outranks
practitioner account outranks vendor documentation outranks vendor blog outranks community.
Where only a vendor or community source exists for a claim, the distillation says so and
downgrades the claim's stated strength.

## Three things to know before using the distillation

1. **Section 6 contains a live conflict that is the finding, not a nuisance.** The most
   famous evidence for decision quality declining across a session is largely a statistical
   artifact, while a smaller, better-controlled result survives. Do not collapse the two
   into a single confident claim about afternoons.
2. **Section 9 lists seven numbers that appear in the archive and must never be restated as
   fact.** Check that table before quoting any statistic from these files.
3. **Section 9 also lists five named coverage gaps.** The most important one: nothing in
   this archive measures abandonment of an AI-generated personal daily brief. Every
   retention claim in the skill is transferred from email newsletter data and labelled as a
   transfer.

## Littlebird MCP mechanics

Not researched here. Those live in `../littlebird-mcp-reference.md`, copied verbatim from
the forge foundation and verified against a live Pro account on 2026-08-17.
