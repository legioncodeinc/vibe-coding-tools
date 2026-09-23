# 07 — OKR Tool Configuration

How to configure OKR-specific fields in Lattice, 15Five, Weekdone, and Notion.

*Sources: `research/external/08-weekdone-okr-methodology-tool.md`, `research/external/09-okr-tools-landscape-2026.md`, `research/external/2026-05-20-okr-tools-lattice-15five-weekdone.md`*

---

## Tool selection guidance

| Tool | Best for | Pricing tier | OKR-native? |
|---|---|---|---|
| **Weekdone** | Teams with 5-100 people; strong OKR methodology built in | Per-user, mid-range | Yes (built around OKRs) |
| **15Five** | Teams wanting OKRs + 1:1s + performance in one platform | Per-user, higher-end | Yes (OKRs + CFR) |
| **Lattice** | HR-integrated goal-setting at 50-500 people | Per-user, enterprise-leaning | Partial (Goals module, not OKR-native) |
| **Notion** | Teams already using Notion who want lightweight OKRs | Already-in-use cost | No (template-based; requires discipline) |
| **Linear / GitHub Issues** | Engineering teams who want OKRs tied to dev work | Developer tooling | No (workaround only) |

**Critical directive:** Advise on what to configure; point users to the tool's current documentation for where the UI settings live. Tool UXs change frequently.

---

## Weekdone

Weekdone is the most OKR-native tool in this list. Its information architecture maps directly to the Grove/Doerr model.

### Key configuration:

**Cycle setup:**
- Settings → Periods → Create a new period named for the quarter (e.g., "Q3 2026")
- Set start and end dates
- Select whether to use the 0-1 scoring scale or a percentage

**OKR structure:**
- Company OKR → Objectives at the company level
- Team OKR → Objectives scoped to a team, linked to a company Objective
- Key Results → metrics with baseline, target, current, and owner fields
- Projects → discrete deliverables (map to committed OKRs or to initiatives)

**Check-in workflow:**
- Weekly update: each user reports KR progress + confidence rating (1-5 scale in Weekdone)
- Manager view: aggregated red/amber/green by team

**Common mistakes:**
- Creating too many Key Results per Objective (Weekdone has no limit; self-impose a 5-KR cap)
- Using "Projects" for strategic outcomes instead of Key Results
- Failing to link team OKRs to company OKRs (misses the alignment benefit)

---

## 15Five

15Five combines OKRs (called "Outcomes") with weekly check-ins, 1:1s, and engagement surveys.

### Key configuration:

**Cycle setup:**
- Admin → Outcomes → Create Cycle → name it, set dates, set default review frequency
- Choose whether cycles are company-wide or per-team

**OKR structure (15Five terminology):**
- Objective = "Goal" (top-level)
- Key Result = "Key Result" nested under a Goal
- Align to parent: link team/individual Goals to company-level Goals

**Check-in workflow:**
- Weekly 15-minute check-in: teams rate each OKR confidence (1-5) and add a comment
- Manager dashboard: confidence trend by person and team

**CFR integration:**
- Best-self reviews and 1:1 templates can reference active OKRs
- Recognition module ties shout-outs to OKR progress

**Common mistakes:**
- Linking OKR scores to compensation — 15Five has a performance review module, so the temptation to connect them is higher; explicitly separate the cycles
- Setting check-in frequency to "monthly" — 15Five works best with weekly pulses; monthly makes the data stale

---

## Lattice

Lattice's Goals module supports OKR-like structures but is more flexible than strictly OKR-native tools. The flexibility is both a feature and a risk — teams can accidentally build KPI dashboards and call them OKRs.

### Key configuration:

**Cycle setup:**
- Goals → Cycles → Create → select "Company OKR", "Department OKR", or "Individual goal"
- Set cycle dates, visibility (public vs. private), and whether goals roll up to a parent

**OKR structure:**
- Objective = "Goal" (top-level)
- Key Result = "Key Result" (child)
- Progress update types: percentage, numeric, true/false, milestone
- For OKRs, use "numeric" for output metrics, "true/false" only for committed binary OKRs

**Common mistakes:**
- Using "milestone" type for Key Results — converts KRs into task lists (input anti-pattern)
- Linking Goals to Lattice compensation reviews — Lattice's default UX makes this easy; explicitly decide NOT to before the first cycle
- Creating Individual Goals before the company/department OKR exists — the cascade has no anchor

**Lattice-specific note:** Lattice's OKR implementation has changed significantly in 2024-2026. Before configuring, check the current Lattice help center at https://help.lattice.com for the latest field and cycle setup.

---

## Notion OKR template

For teams already using Notion, a database-based OKR template is the lowest-friction option. It is not a dedicated OKR tool; it requires manual discipline to maintain.

### Minimal schema (two databases):

**Database 1: Objectives**
| Field | Type | Notes |
|---|---|---|
| Name | Title | Aspirational sentence |
| Quarter | Select | Q1 / Q2 / Q3 / Q4 + year |
| Owner | Person | Single owner |
| Score | Number | 0.0-1.0; filled at end of cycle |
| Type | Select | Aspirational / Committed |
| Status | Select | Active / Graded / Archived |

**Database 2: Key Results**
| Field | Type | Notes |
|---|---|---|
| Name | Title | Metric description |
| Objective | Relation | Links to Objectives DB |
| Baseline | Number | Value at start of cycle |
| Target | Number | Value to achieve by cycle end |
| Current | Number | Updated at each check-in |
| Owner | Person | |
| KR Type | Select | Output / Input (flag inputs for rewrite) |
| Score | Formula | (Current - Baseline) / (Target - Baseline) |

**Check-in workflow:**
- Weekly: update "Current" field for each KR
- Mid-quarter: add a "Confidence" field (1-10) and update it at the mid-quarter meeting
- End of quarter: fill Score for each KR; score the Objective

**Limitations:**
- No automated notifications or reminders — add a recurring Notion automation or use a calendar reminder
- No aggregation views across teams without linked databases
- Score formula breaks if Target equals Baseline (division by zero) — add a safety check

---

## Tool-agnostic configuration principles

Regardless of tool:

1. **Set the cycle before creating OKRs.** Cycle dates anchor the time-bound constraint of each Objective.
2. **Use "numeric" or "percentage" KR types, not "milestone" or "task".** Milestone types encourage input KRs.
3. **Separate goal-tracking from performance review.** If the tool offers both, configure them as separate cycles with no automatic link.
4. **Make company OKRs visible to all.** Transparency is a feature, not a risk. Teams that can see the company OKR understand how their work connects.
5. **Do a setup review at mid-quarter.** If anyone finds the tool confusing, simplify before the next cycle.

---

*This guide cites `research/external/09-okr-tools-landscape-2026.md` and `research/external/2026-05-20-okr-tools-lattice-15five-weekdone.md`. For current tool UX, verify against each tool's current documentation.*
