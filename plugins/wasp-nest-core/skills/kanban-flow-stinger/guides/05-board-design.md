# 05. Board Design: Columns, Policies, and Replenishment

*Sources: `research/internal/command-brief-summary.md`; `research/external/2026-05-20-wip-limits-atlassian-official.md`; `research/external/2026-05-20-jira-kanban-setup-guide.md`*

---

## Column taxonomy

Every Kanban board has three types of columns, regardless of how many stages the team uses:

| Type | Purpose | Examples |
|---|---|---|
| **Input queue** | Work that has been approved for the system but not started | Backlog, Ready, To Do, Options Buffer |
| **Active work** | Work that is actively being processed | In Progress, In Review, In Test, Deploying |
| **Done** | Completed, delivered work | Done, Released, Closed |

**The input queue and done columns have no WIP limit.** WIP limits apply only to active work columns and (optionally) to the input queue to cap backlog depth.

---

## The minimum viable board

For a team new to Kanban, start with three columns:

```
| Options (no limit) | In Progress (WIP: 4) | Done (no limit) |
```

Then evolve by splitting "In Progress" as the team discovers natural sub-stages (code review, testing, deployment). **Resist the urge to map every sub-step from day one.** Let the board evolve with the team's actual workflow; invented stages that don't reflect reality create waste.

---

## Explicit policies per column

Each column needs a documented **entry policy** (what must be true for an item to enter) and **exit policy** (what must be true for an item to leave). Without explicit policies, "done" means different things to different people and items linger in ambiguous states.

**Template for a column policy card:**

```
## [Column Name] Policy

**Entry criteria:**
- [ ] <criterion 1>
- [ ] <criterion 2>

**Exit criteria (Definition of Done for this stage):**
- [ ] <criterion 1>
- [ ] <criterion 2>

**WIP limit:** N
**Owner:** <role or person responsible for this stage>
**Escalation:** if item is stuck for > X days, <action>
```

See `templates/board-design-spec.md` for the full board spec template.

---

## Blocker notation

Blocked items inflate WIP without contributing to flow. Make them visible:

- Add a red blocker marker/label to the card.
- Record the block reason and date in the card's description.
- Blocked items count against the stage's WIP limit (they are still in that stage).
- A block older than the stage's average cycle time is a systemic risk: escalate in the replenishment meeting.

Some teams add a "Blocked" column as a parking lot. This is generally an anti-pattern: it hides blockers from the stage where they live and makes the WIP count appear lower than it is.

---

## Replenishment meeting

The replenishment meeting is the primary Kanban cadence. It is NOT a sprint planning meeting:

- **Frequency:** triggered by capacity signals, not a fixed calendar. Common cadence: weekly or bi-weekly.
- **Duration:** 15-30 minutes.
- **Purpose:** pull items from the input queue into active work only when there is capacity (i.e., when a stage is at or below its WIP limit).
- **Agenda:**
  1. Review current WIP: is anything blocked? Any items exceeding the stage age limit?
  2. Review throughput from the past period.
  3. Pull the next highest-priority items into active work, up to the WIP limit.
  4. Adjust WIP limits if flow data suggests a change.

The replenishment meeting replaces sprint planning for teams that have transitioned to Kanban. Teams that retain sprint planning alongside a Kanban board are in a Scrumban hybrid: see `guides/07-kanban-vs-scrum.md`.

---

## Input queue management

The input queue is the "options buffer" for the team. Best practices:

- **Cap the input queue size.** A backlog of 200 items is not managed; it is aspirational. Cap at 2-4 weeks of throughput.
- **Priority is explicit, not emergent.** Items at the top of the input queue should have documented priority (cost of delay, business value, risk). No priority means replenishment is arbitrary.
- **Separate "ready" from "backlog."** "Ready" means the item is fully refined and can be started. "Backlog" means it is being considered but needs refinement work before it can be pulled.

---

## Column count guidelines

| Team context | Recommended column count |
|---|---|
| New to Kanban | 3 (Options, In Progress, Done) |
| Mature team, clear sub-stages | 5-7 (Options, Refined, In Dev, In Review, In Test, Deploying, Done) |
| Large enterprise value stream | Up to 9-12, but only if each stage is staffed and measured |

More columns are not better. Each additional column adds tracking overhead. Add a stage only when there is a measurable delay between the exit of one stage and the entry of the next.
