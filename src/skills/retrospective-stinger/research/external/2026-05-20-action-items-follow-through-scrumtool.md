---
source_url: https://scrumtool.io/blog/why-your-retrospectives-are-not-producing-action-items-that-stick
fetched_date: 2026-05-20
source_type: blog
authority: practitioner
relevance: critical
topic: action-items
stinger: retrospective-stinger
---

# Why Your Retrospectives Are Not Producing Action Items That Stick

## Summary

Published 2026-04-11. ScrumTool's diagnostic post is the most analytically structured source in the sweep for action-item failure modes. It names five specific structural failure modes (not motivation problems) and prescribes four components of a good action item.

**Core thesis:** Action item death is a structural problem, not a motivation problem. Missing one or more structural ingredients makes follow-through optional rather than inevitable.

**Five failure modes:**

1. **No named owner.** "The team will improve our deployment process" assigns the work to everyone, which in practice means no one. When everybody owns something, it is owned by social pressure that evaporates when work gets busy.

2. **No deadline.** Undated action items live permanently on the backlog of intentions. Without a deadline, the item does not exist: it is a wish.

3. **Too large for the sprint.** "Refactor the entire authentication module" is not a sprint-sized action item. When team members see something that would take two weeks, they don't start: they defer.

4. **Invisible: not on the sprint board.** Items that live only in a retro tool or meeting doc are out of sight and out of mind. If the item is not in the sprint backlog somewhere team members actually look, it doesn't have a place in the team's workflow.

5. **No accountability mechanism.** If nothing happens when items are not completed, why complete them? The first five minutes of every retrospective should be a public accounting of last sprint's commitments.

**Four components of a good action item:**
1. A named owner. One person: not "the team," not "engineering."
2. A specific outcome. Not "improve code reviews" but "add a required checklist to the PR template with five items."
3. A deadline within the sprint. If it can't be done in the current sprint: either break it down or remove it.
4. A place in the backlog. A card or ticket in the team's normal tracking system.

**The accountability habit:** Scrum Master opens every retro by pulling up last sprint's action items and reading them aloud, one by one, asking for status. "Done, not done, or carried forward with a reason. Three minutes. No judgment, just accountability."

## Key quotations / statistics

- "This isn't a motivation problem. Engineers aren't lazy or careless. It's a structural problem: action items that don't get done are almost always missing one or more of the ingredients that make follow-through inevitable rather than optional."
- "When everybody owns something, it's owned by the social pressure of the group, and social pressure evaporates when work gets busy."
- "If the action item isn't in the sprint backlog or the team board (somewhere team members actually look) it doesn't exist in a meaningful sense in the team's workflow."
- "Social accountability (knowing that your peers will ask about the thing you committed to) is a far more effective motivator than personal discipline."
- "The structural fix for dead action items isn't discipline: it's removing the friction."

## Annotations for stinger-forge

- This is the primary source for `guides/04-action-items.md`. The five failure modes are the diagnostic checklist the Bee uses when a team has low follow-through rate (ACTION 4).
- The four-component structure (owner, specific outcome, deadline, backlog placement) is the SMART-adjacent framework stinger-forge should encode as the action item template in `templates/action-items.md`.
- "Backlog placement" is a key insight not covered by most SMART frameworks: add it explicitly to `templates/action-items.md`.
- The opening-five-minutes accountability ritual is the canonical implementation of the accountability loop referenced in the Command Brief's ACTION 4.
- Contradictions: This source says deadline "within the sprint"; the Medium post (agile coach) says "the 3-question filter" is more important than SMART. Both are compatible: stinger-forge should present SMART as structure and the 3-question filter as a live facilitation check.
