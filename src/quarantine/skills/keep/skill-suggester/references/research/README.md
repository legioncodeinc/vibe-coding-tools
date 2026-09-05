# Research archive: skill-suggester

Domain research for the `skill-suggester` skill. Stage 2 (archive) and stage 3
(distillation) of the Queen Bee forge pipeline.

The domain is not Littlebird mechanics, which are settled in
`references/littlebird-mcp-reference.md`. The domain is **automation opportunity
identification**: how repeated manual work is detected from activity data, what makes a task
a good or bad candidate for automation, why automation projects fail, what happens to a job
after the routine part of it is automated, and how badly people misjudge their own repeated
work.

## What is here

```
research/
├── README.md                                           this file
├── distilled-automation-opportunity-identification.md  stage 3, every claim cited
└── raw/                                                stage 2, one file per source
```

11 sources archived, all fetched 2026-08-17.

## Source inventory

| File | Type | What it supplies |
|---|---|---|
| `raw/automation--task-mining--leno-rpm-vision-and-challenges.md` | academic | The seven-stage robotic process mining pipeline, the definition of the field, and the per-stage open challenges. The segmentation and noise-filtering challenges are the ceiling on what any capture-based detector can claim. |
| `raw/automation--task-mining--leno-discovering-automatable-routines.md` | academic | The formal definition of an automatable routine (determinate trigger plus determinate data), the confidence-1.0 determinism threshold, the fragmentation failure, and the synthetic-log evaluation numbers. |
| `raw/automation--task-mining--celonis-docs-task-mining.md` | official-docs | The commercial definition of task mining, what a production capture product records, the process-mining versus task-mining division, and the mandatory privacy and consent controls. |
| `raw/automation--task-mining--celonis-insights-what-is-task-mining.md` | vendor-blog | The named low-level automation indicators: copy and paste, application switching, manual data entry, repetitive patterns. The vendor's own statement of what process mining cannot see. |
| `raw/automation--candidate-criteria--enterbridge-seven-criteria.md` | vendor-blog | Seven positive candidate criteria and, more usefully, three explicit negative cases: too simple, not rules-based, too complex. |
| `raw/automation--failure-rates--uipath-why-rpa-deployments-fail.md` | vendor-blog | The 30 to 50 percent initial-failure figure with its provenance chain named, plus four causes of failure, two of which transfer to a single operator. |
| `raw/automation--irony--bainbridge-1983-ironies-of-automation.md` | academic | The residual task irony, the monitoring paradox, designer error, and skill decay. The core argument against inferring "automate it" from "it repeats". |
| `raw/automation--irony--parasuraman-manzey-complacency-2010.md` | academic | The measured version: automation complacency under multitask load, automation bias, omission versus commission errors, and the finding that both resist training. |
| `raw/automation--self-knowledge--collopy-1996-retrospective-time-use.md` | academic | 401 managers and professionals, self-assessed computer use against logs. 32% difference in the mean, 47% median absolute difference per individual, and regression toward the population mean. |
| `raw/automation--self-knowledge--daily-selfreport-vs-software-recorded-computer-use.md` | academic | Same-day replication of the regression pattern against keyboard and mouse logs, plus the finding that how a person feels changes their reported duration. |
| `raw/automation--self-knowledge--nature-2021-logged-vs-selfreport-meta.md` | academic | Meta-analysis over 106 effect sizes. Self-reports rarely reflect logged use. Recent enough to establish the finding is not an artifact of old studies. |

Eleven files, eleven distinct pages. Two of them sit on the same vendor domain and are held
separately rather than merged, because one is product documentation and the other is
marketing and they rank differently.

## Source-type mix

- academic: 7
- official-docs: 1
- vendor-blog: 3

Academic sources carry every load-bearing claim: the detection method, its failure modes,
the post-automation consequences, and the self-report evidence. Vendor sources carry only
the practitioner checklist and the failure-rate figure, and both are labelled where they are
used. That split is deliberate: the sections where a vendor has an interest in the answer are
the sections where vendor sourcing is worth least.

## Research window

The archive breaks the default six-month window deliberately and says so here.

- Current: the two Celonis pages are living vendor documentation fetched 2026-08-17. The
  UiPath page is undated living vendor content, also fetched 2026-08-17.
- Recent: Nature Human Behaviour 2021, Business and Information Systems Engineering 2021, BPM
  Forum 2019.
- Deliberately old, retained as foundational rather than current: Bainbridge 1983,
  Parasuraman and Manzey 2010, Collopy 1996.

The three old sources are the archive's backbone. Bainbridge 1983 is the origin of the
automation-irony literature and is still the clearest statement of the residual task problem.
Collopy 1996 is retained because it is the largest sample in the archive measuring
professionals against their own logs, and because the 2021 meta-analysis and the same-day
study both reproduce its direction. Where a modern replacement exists it is archived
alongside rather than instead.

## Named gaps

Six, stated in full in section 12 of the distillation. The two that most constrain the skill:

1. **No researched recurrence threshold exists anywhere in the archive.** The only published
   threshold is on determinism, at confidence 1.0. Every recurrence count the skill uses is a
   convention, and the skill says so to the user.
2. **No source covers detection from periodic screen snapshots.** Every detection source
   assumes an ordered UI event log with element identifiers. Sampled snapshots are strictly
   weaker input and nothing measures what that costs.

Gap 3 is worth naming here too: the natural-language repeat request, a person asking for the
same output again, is the strongest signal available in message capture and is not a signal
class anywhere in this literature. It is an unevidenced design decision, labelled as one
wherever it appears.

## What was not archived and why

Process mining conformance checking, event-log extraction from ERP systems, and the IEEE
process mining manifesto were considered and dropped. They address discovering a process from
transactional system logs, which is a different input and a different problem. The task
mining branch is the one whose input resembles screen capture, and it is where the archive is
concentrated.
