# 04: Action-Item Discipline

*Derived from `research/external/2026-05-20-action-items-follow-through-scrumtool.md` and `research/external/2026-05-20-action-items-agile-coach-medium.md`.*

---

## The follow-through problem

Only 50% of retro action items are ever completed. This is the primary failure mode of retrospectives, more significant than format choice or facilitation quality. Teams that address the structural causes of low follow-through double their closure rate within 3 sprints (case study: from 40% to 85%).

The five structural failure modes:

1. **No owner.** "We should improve documentation", who owns it?
2. **No deadline.** "At some point this sprint", when?
3. **Too large.** "Fix our CI pipeline": what's the first step?
4. **Invisible on the backlog.** Action items not placed in the sprint backlog have a near-zero completion rate. Out of sight, out of sprint.
5. **No accountability loop.** The next retro opens without reviewing the previous retro's actions. The implicit message: commitments are optional.

---

## The four-component action item (SMART-adapted for retros)

Every action item must have all four components before leaving the retro board:

| Component | What it means | Example |
|---|---|---|
| **Named owner** | One specific person. Not "the team". | Ana Martinez |
| **Specific outcome** | What will be different when this is done? Observable and concrete. | "PR review SLA < 24 hours for 90% of PRs" |
| **Sprint deadline** | A specific date or "by next retro". Not "this sprint" (which sprint?). | 2026-06-03 |
| **Backlog placement** | The item is in the sprint backlog, not in a separate retro doc. | Added to Jira sprint, story ID SPR-412 |

---

## The 3-question filter (live facilitation gate)

Apply at the commitment step, before any action item is marked as confirmed:

1. **Who owns this?** (One name must be stated aloud.)
2. **When does it close?** (A specific date or sprint.)
3. **What does done look like?** (A concrete, observable outcome: not "improved" or "better".)

If any answer is missing, the item is either refined on the spot or removed from the board. A vague action item that makes it into the backlog is worse than no action item: it occupies space and creates false accountability.

---

## Backlog placement is non-negotiable

Action items that live in a retro doc, a shared notes file, or a separate "actions" board have a dramatically lower completion rate than items in the team's main sprint backlog. This is not opinion; it is the ScrumTool structural finding (2026-04-11, `research/external/2026-05-20-action-items-follow-through-scrumtool.md`).

During the retro, as each action item is confirmed: open the sprint backlog tool and add it before moving on. Do not defer: the probability of adding it later drops sharply.

---

## The accountability loop: opening ritual for every retro

Every retro opens with a 5-10 minute review of the previous retro's action items. For each item:

- **Done:** Celebrate briefly, note what worked.
- **In Progress:** Confirm it carries over with a new deadline.
- **Dropped / Not Started:** Do not skip this. Ask: "Why didn't this happen?" Record the answer. Often this is the most valuable intelligence in the entire retro.

Calculate the follow-through rate: (Done + In Progress) / total committed. Track this number over time. If it's below 60% for two consecutive sprints, the retro's agenda becomes: why are we not following through?

---

## Sizing: three action items maximum

The research is consistent: three focused, owned, sized action items with high follow-through beats ten aspirational bullets with low follow-through. When a retro discussion produces many candidate actions:

1. Dot-vote the candidates to surface the top three.
2. Apply the 3-question filter to the top three.
3. Explicitly acknowledge the rest as "not this sprint": they are not lost, just deferred.

Teams that commit to more than three actions per retro consistently under-deliver. Teams that commit to three and close all three build momentum.

---

## Action item template

See `templates/action-items.md` for the full template. Quick format:

```
Action: [specific outcome]
Owner: [one name]
Deadline: [YYYY-MM-DD or "by next retro on YYYY-MM-DD"]
Done when: [observable condition]
Backlog ticket: [link or ticket ID]
Status (next retro): Done / In Progress / Dropped
```

---

## The Agile Coach's 3-sprint rule

Teams that explicitly track and review action item closure rates for three consecutive sprints see significant improvement even without changing their retro format. The act of measurement creates accountability. Recommend adding a follow-through rate metric to the team's sprint review dashboard (not the retro board: the sprint review, so it's visible to stakeholders and leadership).

---

*Cross-reference: `guides/00-principles.md` (the 3-question filter as a principles statement), `guides/03-facilitation.md` (action items in the facilitation agenda), `templates/action-items.md`.*
