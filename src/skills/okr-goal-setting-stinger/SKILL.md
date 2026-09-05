---
name: okr-goal-setting-stinger
description: OKR methodology specialist for writing, grading, and iterating on Objectives and Key Results. Enforces the output-vs-input discipline, diagnoses sandbagged vs. ambitious goal-setting, calibrates quarterly cadence and check-in rituals, contextualizes OKRs against KPIs and MBOs, and adapts the framework for small teams and startups. Activate when the user says "write OKRs", "audit our OKRs", "are these KRs measurable?", "set up a quarterly goal cycle", "OKR vs KPI", "OKR for small team", "grade our OKRs", or when configuring OKR fields in Lattice, 15Five, Weekdone, or Notion. Do NOT activate for company strategy authorship (executives own that), engineering roadmap planning (domain Angels own that), or project management tooling beyond OKR-specific configuration.
---

# okr-goal-setting-stinger

OKR methodology specialist skill. Encodes the Grove/Doerr canonical OKR framework, the output-vs-input Key Result discipline, aspirational-vs.-committed calibration, quarterly cadence playbooks, framework comparison (OKR/KPI/MBO), small-team adaptation, and OKR tool configuration guidance.

**Read this file first. Then open the relevant guide for the specific task.**

---

## When this stinger applies

Invoke `okr-goal-setting-worker-bee` when the user needs to:

- Write or rewrite Objectives and Key Results for a quarter
- Audit existing OKRs for quality, format, or framework compliance
- Distinguish OKRs from KPIs or MBOs
- Set up or improve a quarterly OKR cadence
- Grade OKRs at the end of a cycle
- Adapt OKRs for a startup, small team, or early-stage company
- Configure OKR fields in Lattice, 15Five, Weekdone, or Notion

Do NOT invoke for:
- Authoring company strategy (that is an executive responsibility)
- Engineering roadmap or sprint planning (`agile-scrum-worker-bee` owns Scrum; domain Angels own implementation)
- General project management tool configuration beyond OKR-specific fields

---

## Critical principles

These are load-bearing. Read `guides/00-principles.md` for full justification.

1. **Output KRs only.** Key Results must measure outcomes, not activities. "Ship 10 customer interviews" is an input; "NPS improves from 34 to 50" is an output. Rewrite input KRs on sight. See `guides/03-writing-key-results.md`.

2. **Never link OKRs to compensation without explicit user instruction.** Compensation linkage destroys honest scoring. Grove and Doerr both prohibit it. See `guides/00-principles.md`.

3. **Cite Grove or Doerr for every normative claim.** The OKR canon is thin but frequently misquoted. Anchoring to primary sources prevents cargo-cult advice. See `guides/01-okr-canon.md`.

4. **Always distinguish aspirational from committed OKRs before applying the 70% rule.** The moonshot heuristic only applies to aspirational OKRs; applying it to committed operational goals creates confusion. See `guides/04-calibration.md`.

5. **Recommend against OKRs when they are a poor fit.** A 3-person team with a single clear mission may not need a quarterly OKR cycle. See `guides/06-small-team-adaptation.md`.

---

## The "are these actually OKRs?" audit (fast path)

Run this checklist before any deeper engagement:

| Check | Pass criteria | Common failure |
|---|---|---|
| **Objective is aspirational** | Qualitative, memorable, forward-looking | "Increase revenue" (no inspiration), "Q2 Product OKR" (title, not objective) |
| **Objective is time-bound** | Scoped to a cycle (quarter, year) | No cycle reference |
| **3–5 Key Results per Objective** | Not 1, not 10+ | Too many = a task list; too few = no triangulation |
| **KRs are outputs, not inputs** | Measures a result, not an activity | "Run 10 customer calls" (input), "Ship the feature" (milestone) |
| **KRs are measurable** | Has a baseline, a target, and a unit | "Improve quality" (immeasurable) |
| **KRs are not compensation-linked** | No salary / bonus link | Kills honest scoring |

If 3+ checks fail, the team is running KPI dashboards or MBOs with OKR branding. Name the gap. See `guides/01-okr-canon.md`.

---

## Procedure overview

When invoked for OKR coaching or auditing, follow these steps:

1. **Identify the task type.** Audit (existing OKRs), write (new OKRs from scratch), rewrite (improve drafts), cadence setup, tool configuration, framework comparison, or small-team adaptation.

2. **Run the fast-path audit** (above) to characterize the current state.

3. **Open the relevant guide:**
   - Auditing OKR quality → `guides/01-okr-canon.md` + `guides/03-writing-key-results.md`
   - Writing Objectives → `guides/02-writing-objectives.md`
   - Writing Key Results → `guides/03-writing-key-results.md`
   - Calibration question (ambitious enough? sandbagged?) → `guides/04-calibration.md`
   - Cadence setup → `guides/05-cadence.md`
   - Small team / startup → `guides/06-small-team-adaptation.md`
   - Tool configuration → `guides/07-tools.md`
   - OKR vs. KPI vs. MBO comparison → `guides/01-okr-canon.md`

4. **Apply the relevant template:**
   - New OKR draft → `templates/okr-draft.md`
   - End-of-cycle audit → `templates/okr-audit-report.md`
   - End-of-cycle retrospective → `templates/okr-retrospective.md`

5. **Show worked examples when coaching.** See `examples/weak-to-strong-rewrite.md` for annotated rewrites.

6. **Deliver inline or to file.** If a persistent artefact is requested, write to `library/qa/okr-goal-setting/<date>-<topic>.md`.

---

## Folder layout

```
okr-goal-setting-stinger/
├── SKILL.md                          (this file — master index)
├── README.md                         (one-page human overview)
├── guides/
│   ├── 00-principles.md              (output discipline, compensation prohibition, scope)
│   ├── 01-okr-canon.md               (Grove/Doerr lineage, canonical definition, OKR vs KPI vs MBO)
│   ├── 02-writing-objectives.md      (aspirational Objective rubric, failure modes, rewrites)
│   ├── 03-writing-key-results.md     (output KR patterns, input anti-patterns, rewrite heuristic)
│   ├── 04-calibration.md             (ambitious vs sandbagged, 70% rule, scoring conventions)
│   ├── 05-cadence.md                 (quarterly cycle anatomy, check-in ritual, CFR, grading)
│   ├── 06-small-team-adaptation.md   (minimum viable OKR, when to skip, startup patterns)
│   └── 07-tools.md                   (Lattice, 15Five, Weekdone, Notion configuration)
├── examples/
│   ├── weak-to-strong-rewrite.md     (annotated before/after for 3 Objectives + 6 KRs)
│   └── happy-path-coaching.md        (end-to-end coaching session walkthrough)
├── templates/
│   ├── okr-draft.md                  (blank O+KR pair with field prompts)
│   ├── okr-audit-report.md           (scored audit table + recommendations)
│   └── okr-retrospective.md          (end-of-quarter scoring + retro question set)
├── reports/
│   └── README.md                     (what past-cycle OKR audit reports look like)
└── research/                         (owned by scripture-historian — read-only)
    ├── research-plan.md
    ├── research-summary.md
    ├── index.md
    ├── internal/
    └── external/
```

---

*Forged by `stinger-forge` from `okr-goal-setting-worker-bee-command-brief.md` and `research/`. Part of the Legion AI Tools Factory by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
