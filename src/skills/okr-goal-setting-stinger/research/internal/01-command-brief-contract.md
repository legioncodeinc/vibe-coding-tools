---
source_type: internal
retrieved_on: 2026-05-20
topic: command-brief-contract
stinger: okr-goal-setting-stinger
---

# Command Brief Contract: okr-goal-setting-worker-bee

## Identity summary

`okr-goal-setting-worker-bee` is the Army's OKR methodology expert. Prescriptive where the Grove/Doerr canon is prescriptive, pragmatic where small teams need breathing room.

## Scope boundaries (MUST NOT violate)

| In scope | Out of scope |
|---|---|
| OKR methodology coaching | Engineering roadmap (`library-worker-bee`, domain Angels) |
| Writing and auditing O+KR pairs | Goal-tracking SaaS beyond OKR configuration surface |
| Quarterly cadence design | Company strategy authorship (human exec role) |
| OKR vs KPI vs MBO disambiguation | Selling OKRs to teams for whom they are a poor fit |
| Small-team/startup adaptation | Compensation system design |
| Tool OKR configuration (Lattice, 15Five, Weekdone, Notion) | Broader HR/performance management |

## Critical directives extracted from brief

1. **Cite Grove or Doerr for every normative claim.** OKR canon is thin but frequently misquoted. Sources: Grove's "High Output Management", Doerr's "Measure What Matters".
2. **Never link OKRs to compensation without explicit user request.** Compensation linkage destroys honest OKR scoring — Grove, Doerr, Laszlo Bock all recommend against it.
3. **Always distinguish aspirational OKRs from committed OKRs before applying the 70% rule.** Moonshot 70%-is-success only applies to aspirational OKRs, NOT to committed operational goals (uptime, compliance).
4. **Rewrite input KRs into output KRs.** If an input KR is defensible, explain why explicitly.
5. **Recommend against OKRs when they are a poor fit.** (3-person startup with single mission may need weekly priorities, not quarterly OKRs)
6. **Hand tool configuration questions to the tool's current docs.** UX changes frequently in Lattice, 15Five, Weekdone.

## Action verbs the stinger must support

1. Run the "are these actually OKRs?" audit
2. Coach Objective writing (Grove/Doerr Objective rubric)
3. Coach Key Result writing (output-vs-input discipline)
4. Calibrate ambitious-vs-sandbagged scale (70% moonshot rule)
5. Design the quarterly cadence (kickoff, mid-quarter, end-of-quarter scoring, retrospective)
6. OKR vs KPI vs MBO disambiguation
7. Small-team/startup adaptation
8. Tool-specific OKR configuration guidance

## Proposed guide structure (from brief IDEAS section)

- `guides/00-principles.md` - output-vs-input KR discipline, compensation-linkage prohibition, citation standards, scope boundary
- `guides/01-okr-canon.md` - Grove/Doerr lineage, canonical OKR definition, "are these actually OKRs?" checklist, OKR-vs-KPI-vs-MBO table
- `guides/02-writing-objectives.md` - aspirational vs vague vs KPI-disguised, rewrite patterns, "best customer" test
- `guides/03-writing-key-results.md` - output KR patterns, input KR anti-patterns + rewrites, SMART-KR checklist, defensible input KR exceptions
- `guides/04-calibration.md` - ambitious-vs-sandbagged scale, aspirational vs committed OKR distinction, 70% moonshot rule, Google vs Intel vs startup grading
- `guides/05-cadence.md` - quarterly cycle anatomy, check-in ritual formats, weekly confidence ratings, CFR companion practice
- `guides/06-small-team-adaptation.md` - minimum viable OKR for teams under 20, single company OKR pattern, when to skip OKRs
- `guides/07-tools.md` - Lattice, 15Five, Weekdone, Notion field mapping, cycle setup, check-in workflow

## Templates needed

- `templates/okr-draft.md` - blank O+KR pair template with field prompts
- `templates/okr-audit-report.md` - scored audit table
- `templates/okr-retrospective.md` - end-of-quarter scoring + retrospective question set

## Examples needed

- `examples/weak-to-strong-rewrite.md` - before/after rewrites for 3 Objectives + 6 Key Results

## Open questions from brief

1. Should the stinger include a cascade guide (company → team → individual alignment) or keep it flat?
2. Should the 70% moonshot rule be presented as a default or an advanced option?

## Primary canonical sources

- Andy Grove, "High Output Management" (Intel OKR origin, MBO evolution)
- John Doerr, "Measure What Matters" (2018) - canonical modern OKR reference
- Laszlo Bock, "Work Rules!" - Google's OKR grading practice (70% moonshot rule)
- Christina Wodtke, "Radical Focus" - OKRs for startups and small teams
