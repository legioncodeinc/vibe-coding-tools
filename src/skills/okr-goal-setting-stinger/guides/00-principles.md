# 00 — Principles and Scope

Core operating principles for `okr-goal-setting-worker-bee`. Read before any other guide.

*Sources: `research/external/2026-05-20-grove-doerr-okr-canon.md`, `research/internal/2026-05-20-command-brief-context.md`*

---

## The two-sentence OKR charter

An **Objective** is an ambitious, qualitative direction for a time period. A **Key Result** is a measurable outcome that proves you moved in that direction. That's all. Everything else in this stinger is an elaboration on that contract.

---

## Non-negotiable 1: Output KRs only

Key Results must measure **outcomes**, not activities or inputs.

- **Output:** "Churn drops from 5% to 2%"
- **Input (reject):** "Send monthly churn-reduction email to at-risk accounts"

When you see an input KR, run the rewrite test: *"What outcome would this activity produce if it worked?"* That outcome is the KR. See `guides/03-writing-key-results.md` for the full rewrite heuristic.

**Defensible exception:** Early-stage teams with no outcome baseline may need a capability-building KR for one cycle ("Establish a weekly product interview cadence"). Name it as an input KR explicitly, set a 1-cycle sunset, and define the outcome KR it will enable next quarter.

---

## Non-negotiable 2: No compensation linkage

OKRs must never be linked to salary, bonus, or performance review scores without explicit user instruction to do so.

**Why:** Compensation linkage destroys honest scoring. When people's pay depends on OKR grades, they sandbag targets to guarantee 100%. Research (`research/external/2026-05-20-ambitious-vs-sandbagged-calibration.md`) documents that 89% of teams under compensation pressure set sandbagged targets. Grove, Doerr, and Laszlo Bock all prohibit linkage explicitly.

If a user asks to link OKRs to compensation, surface this risk, name it as a deliberate deviation from the canon, and note that committed OKRs (not aspirational 70%-success OKRs) are the only defensible compensation anchor.

---

## Non-negotiable 3: Cite the canon for normative claims

Every rule the stinger states as "OKRs require X" must trace to Grove's "High Output Management" or Doerr's "Measure What Matters" (or Google re:Work, which applies Doerr's framework). Community best practices that are not in the canon must be labeled "community practice" or "practitioner convention" — not presented as rules.

The OKR canon is short. The noise around it is enormous. Labeling clearly keeps the Angel credible.

---

## Non-negotiable 4: Honest framework fit assessment

OKRs are not universally appropriate. Before prescribing OKRs, assess:

- Does the team have enough runway to invest in a quarterly goal cycle? (If they pivot weekly, quarterly OKRs may be overhead.)
- Is there a "north star" clear enough to write an aspirational Objective toward? (If not, the company needs strategy work, not OKRs.)
- Does the team have baseline metrics to write measurable KRs? (If not, a data-instrument quarter may come first.)

When OKRs are a poor fit, say so plainly. Recommend alternatives: weekly priorities, a single "this quarter's one thing" focus, or continuous KPI tracking. See `guides/06-small-team-adaptation.md`.

---

## Scope boundary

| In scope | Out of scope |
|---|---|
| Writing and rewriting O+KR pairs | Authoring company strategy |
| Auditing OKR quality and format | Engineering roadmap or sprint planning |
| Cadence design and check-in rituals | Full project management tool configuration |
| OKR tool field mapping (Lattice, 15Five, Weekdone, Notion) | Tool pricing, procurement, or vendor selection |
| OKR vs. KPI vs. MBO disambiguation | Non-OKR goal frameworks (EOS, V2MOM, BHAG) in depth |
| Small-team OKR adaptation | Team composition or hiring decisions |

---

## Handoff rules

- **`library-worker-bee`** owns storing OKR artefacts in `library/`. This Angel authors the content; `library-worker-bee` owns the folder structure.
- **`agile-scrum-worker-bee`** owns Scrum ceremonies. When sprint goals intersect with OKRs, this Angel owns the OKR side and notes the Scrum connection.
- **Domain Angels** (`react-worker-bee`, `db-worker-bee`, etc.) own the engineering work OKRs point at. This Angel writes the goal; the domain Angel plans the execution.

---

## Refresh cadence

The Grove/Doerr canon is stable — no expected refresh. Tool-specific guides (`guides/07-tools.md`) should be reviewed every 6-12 months as Lattice, 15Five, and Weekdone UXs change. The small-team adaptation guide should be reviewed annually.
