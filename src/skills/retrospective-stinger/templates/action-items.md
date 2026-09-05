# Action Item Template

Use this template to capture, assign, and track every action item that emerges from a retrospective session. Each item must answer the three-question filter before leaving the board.

---

## Three-Question Filter (apply at the commit step)

Before finalizing any action item, confirm:

1. **Who owns this?** One name. Not "the team", not "the BE team".
2. **When does it close?** A concrete date within the next sprint or cycle.
3. **What does done look like?** A verifiable, observable outcome: not a feeling.

If any question cannot be answered in under 30 seconds, the item is not ready to commit.

---

## Action Item Record

```markdown
## Action Items — [Sprint/Period Label] Retro ([YYYY-MM-DD])

| # | Action | Owner | Due | Done Looks Like | Status |
|---|--------|-------|-----|-----------------|--------|
| 1 | [Specific, verb-led statement] | [First Last] | [YYYY-MM-DD] | [Observable outcome] | Open |
| 2 | | | | | |
| 3 | | | | | |
```

**Follow-through rate from previous retro:** [X of Y items closed] = [XX%]

---

## Field Definitions

| Field | Rule |
|-------|------|
| **Action** | Start with a verb. Max 15 words. "Add linting to CI pipeline" not "Improve code quality". |
| **Owner** | One person, not a team or role. If no one will own it, don't commit it. |
| **Due** | A date within the current sprint. If it spans sprints, break it into sprint-sized pieces. |
| **Done Looks Like** | Observable, not aspirational. "PR merged to main" not "better code quality". |
| **Status** | Open / In Progress / Done / Dropped. Update at the next retro's opening review. |

---

## The Accountability Loop

At the start of the next retro, open with:

1. Read each action item aloud.
2. Ask the owner for a status update (30 seconds max per item).
3. Mark Done, In Progress, or Dropped.
4. Compute the follow-through rate.
5. If rate < 50%, pause the retro: the root cause of the low follow-through rate IS the retro's subject.

---

## Placement in the Sprint Backlog

Every committed action item MUST be added to the team's sprint backlog or task board before the retro closes. Items that live only in the retro notes have a near-zero completion rate.

- Jira/Linear/GitHub: create a task tagged `retro-action` with the owner assigned and the due date set.
- Notion/Confluence: create a task in the team's task database.
- Physical: write on the team's physical board in a dedicated "Retro Actions" swim lane.

---

*Part of `retrospective-stinger`. See `guides/04-action-items.md` for the full action-item discipline and failure-mode catalog.*
