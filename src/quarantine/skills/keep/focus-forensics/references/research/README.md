# Research archive for focus-forensics

Domain: attention and task switching in knowledge work, the empirical size of interruption
and resumption effects, the methodological limits of activity sampling and self-report as
measurement approaches, evidence on interventions that reduce fragmentation, and the
effects of electronic monitoring. Swept 2026-08-17 with web search and direct full-text
fetches.

The sweep was weighted deliberately toward measurement validity rather than toward
productivity advice, because the design of this skill rests almost entirely on what a
periodic snapshot stream is and is not entitled to claim.

## How to use this folder

Read `distilled-attention-fragmentation.md` first. It is the only file the skill's guides
cite directly, and every claim in it ends in a bracketed pointer to a file in `raw/`. If a
domain claim appears anywhere in this skill without a trail through the distillation to a
raw file, it is a defect.

## Contents

| File | Type | What it supports |
|---|---|---|
| `distilled-attention-fragmentation.md` | distillation | Every domain claim in the guides |
| `raw/fragmentation--observational-baseline--mark-chi2005.md` | academic | The canonical run-length and resumption baseline, and the observation effort behind it |
| `raw/interruption--cost-experiment--mark-chi2008.md` | academic | The controlled experiment where interrupted work finished FASTER and cost showed up as stress; first-hand verification that the number 23 is absent |
| `raw/interruption--resumption-field-study--iqbal-horvitz-chi2007.md` | academic | Resumption values with a continuous event log, switch-rate escalation during resumption, and the authors' own difficulty locating task boundaries |
| `raw/switching--laboratory-switch-cost--monsell-tics2003.md` | academic | Switch cost is real and measured in milliseconds; no per-switch workday penalty exists |
| `raw/fragmentation--recent-replication--talypova-chiwork2025.md` | academic | The most recent structural measurement, and the authors' refusal to compare it across studies |
| `raw/attention--hour-of-day-rhythm--mark-chi2014.md` | academic | Hour-of-day and day-of-week rhythms, and the load-bearing statement that continuous logging cannot see engagement |
| `raw/measurement--self-report-vs-logged--parry-nathumbehav-2021.md` | academic | Self-report is not a second measurement of logged behavior |
| `raw/measurement--activity-sampling-basis--knowie-work-sampling.md` | community, technical reference | The statistical frame for periodic sampling: proportions not durations, margin of error, the fixed-interval periodicity trap |
| `raw/intervention--email-cutoff--mark-chi2012.md` | academic | Removing an interrupt source moves switch count and run length together, within-subjects |
| `raw/intervention--email-batching-null--mark-chi2016.md` | academic | The negative finding: batching email did not lower stress |
| `raw/intervention--notification-disabling-experiment--ohly-joh-2023.md` | academic | Randomized field experiment on disabling notifications, with candid limitations and moderators |
| `raw/ethics--electronic-monitoring-effects--koenig-annrev-2025.md` | academic | Why the same computation becomes harmful when someone else runs it on you |
| `raw/myth--23-minutes-citation-audit--oberien-2023.md` | community, citation audit | The tracing of the 23 minutes 15 seconds figure to interviews rather than papers |
| `raw/myth--23-minutes-recirculation--biggo-2026.md` | community, secondary | Evidence that the figure kept circulating as news; archived for provenance, not as independent evidence |

## Source count

Fourteen raw sources. Ten peer-reviewed papers, one peer-reviewed annual review, one
industrial engineering technical reference, and two community citation-audit pieces, one of
which is secondary coverage of the other. The contract minimum is five and the assignment
minimum is seven, set higher because so much of the design rests on measurement validity.

Two of the fourteen are the weakest class in the archive, the citation-audit blog and its
news write-up. They are retained because the assignment specifically requires the 23
minutes figure be traced, because the audit's central claim was independently verified
first-hand in this sweep against the CHI 2008 full text, and because no peer-reviewed
source performs this tracing.

## Window

The default window is the last six months. Only one source falls inside it:

- `fragmentation--recent-replication--talypova-chiwork2025.md`, June 2025, and even that
  is fourteen months old at the time of the sweep.

Every other source is deliberately outside the window, and the reason is the same in each
case: these are the primary measurements, and there are no newer replacements. Flagged
individually:

- `switching--laboratory-switch-cost--monsell-tics2003.md`, March 2003. The standard
  review of the switch-cost literature. Still the citation of record.
- `fragmentation--observational-baseline--mark-chi2005.md`, 2005. The canonical
  observational study of work fragmentation, and the paper most often miscited for the 23
  minutes figure.
- `interruption--resumption-field-study--iqbal-horvitz-chi2007.md`, 2007. The field study
  with the richest event log in the archive.
- `interruption--cost-experiment--mark-chi2008.md`, 2008. Retained specifically because it
  is the paper most frequently named as the source of the folklore figure, and this sweep
  needed to check it directly.
- `intervention--email-cutoff--mark-chi2012.md`, 2012, and
  `attention--hour-of-day-rhythm--mark-chi2014.md`, 2014, and
  `intervention--email-batching-null--mark-chi2016.md`, 2016. The three logged
  intervention and rhythm studies. No newer logged replication was found.
- `measurement--self-report-vs-logged--parry-nathumbehav-2021.md`, 2021. The meta-analysis
  of record on self-report validity.
- `intervention--notification-disabling-experiment--ohly-joh-2023.md`, June 2023. The most
  recent randomized field experiment found on the intervention side.
- `ethics--electronic-monitoring-effects--koenig-annrev-2025.md`, January 2025, first
  published in advance August 2024.
- `myth--23-minutes-citation-audit--oberien-2023.md`, November 2023.
- `myth--23-minutes-recirculation--biggo-2026.md`, dated by article slug to August 2025.
- `measurement--activity-sampling-basis--knowie-work-sampling.md` is an undated evergreen
  technical reference page with no publication date shown.

## Concentration risk, stated plainly

Five of the fourteen sources have Gloria Mark as an author, and several share coauthors with
each other and with the Iqbal and Horvitz field study. This is not sloppy sourcing; it is
what the field looks like. One research group did most of the logged observational work on
workplace attention. The consequence is that the archive is not fourteen independent
readings of the world, and section 4 of the distillation is written accordingly: the
published numbers are treated as reference points that cannot be compared across methods,
never as benchmarks to score a user against.

## The honest headline about this archive

The measurement half is strong. The switch-cost mechanism, the resumption bands, the
self-report validity result, the sampling statistics and the engagement limitation are all
well sourced, and together they are sufficient to justify every constraint the skill
imposes on itself.

The prescription half is weak, and it is weak in an instructive direction. The best-known
remedy in the popular literature, batching email, was tested and failed. The two
interventions that did work removed something from the environment rather than asking the
person to try harder, and the stronger of the two ran for a single working day on a young
highly educated sample using self-reported outcomes. Nothing here supports confident
advice, which is why the skill offers exactly one experiment per report with a stated way
to check it.

Five named gaps are listed in section 11 of the distillation. The most consequential is the
first: there is no peer-reviewed validation study of screenshot-interval time inference at
all. The skill is built as though that gap exists, because it does.

## The one exception to fresh research

Littlebird MCP mechanics are not researched here. That work is already done and lives in
`../littlebird-mcp-reference.md`, copied verbatim from the forge foundation.
