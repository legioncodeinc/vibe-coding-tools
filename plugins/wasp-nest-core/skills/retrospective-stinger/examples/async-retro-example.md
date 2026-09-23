# Example: Async Retro for a Distributed Team

*Demonstrates `guides/05-async-retro.md` (async design), `guides/01-formats.md` (4Ls for async), `guides/04-action-items.md` (action items in async context).*

---

## Context

- **Team:** 5-person engineering team: 2 in London (UTC), 2 in Austin (UTC-5), 1 in Singapore (UTC+8)
- **Sprint:** Sprint 8, 2-week sprint. Good delivery, mild frustration about unclear acceptance criteria.
- **Timezone spread:** 13 hours (London to Singapore). No viable synchronous window.
- **Team maturity:** Has been running retros for 8 sprints, first async retro.
- **Safety score:** 3.7 (moderate-high). Async with anonymous input selected.

---

## Format selection

**Format:** 4Ls (Liked / Learned / Lacked / Longed For): self-explanatory, positive framing works well for async reflection, first async retro so low facilitation overhead helps.

**Tool:** Parabol (anonymous mode enabled, async phases configured).

---

## Day 1 (Monday): Input phase opens

Facilitator sends Slack message at 9am UTC:

> "Sprint 8 retro is open in Parabol: [link]. Please add your thoughts to each category by Wednesday 5pm UTC (your local equivalent: London 5pm, Austin noon, Singapore 1am Thursday). Cards are anonymous. I'll share clusters Thursday morning."

Parabol board with 4Ls prompts:

- **Liked:** "What did you enjoy or appreciate about Sprint 8?"
- **Learned:** "What did you learn: about the product, the tech, the team, or yourself?"
- **Lacked:** "What was missing that would have made Sprint 8 smoother?"
- **Longed For:** "What do you wish we had: a practice, tool, resource, or change?"

---

## Day 2 (Tuesday): Reminder

Slack: "Retro board closes tomorrow at 5pm UTC: 3 of 5 people have contributed. Add your thoughts!"

---

## Day 3 (Wednesday): Input closes, clustering

Input closed: 18 total cards (average 3.6 per person, all 5 participants contributed).

Facilitator clusters async (30 minutes):

- **Liked:** Clear sprint goal (3 cards), effective pair sessions (2 cards), fast review turnaround (2 cards)
- **Learned:** GraphQL subscription patterns (2 cards), how to write better acceptance criteria (2 cards)
- **Lacked:** Acceptance criteria before sprint start (4 cards), cross-team dependency visibility (2 cards)
- **Longed For:** AC template we fill before planning (3 cards), shared dependency board (2 cards)

Facilitator posts Parabol voting link to Slack: "Board clustered. Please vote (3 dots each) by Thursday 5pm UTC: [link]"

---

## Day 4 (Thursday): Voting closes, synthesis call (30 minutes)

**Voting results:**

1. Acceptance criteria before sprint start (Lacked): 10 dots
2. AC template (Longed For): 9 dots
3. Cross-team dependency visibility (Lacked): 7 dots

These two top themes are clearly related. The synthesis call will focus on one root-cause discussion.

**Synthesis call (30 min, 9am UTC: only viable overlap window):**

Attendees: all 5 (Singapore team member joins at 5pm local).

**Agenda:**

- 5 min: Previous actions review. Sprint 7 had 2 actions: "Add code review checklist to team wiki" (Done, Ana), "Schedule monthly dependency sync with Platform team" (In Progress, Tom, new deadline set).
- 5 min: Context summary by facilitator: "The clearest pattern is acceptance criteria. Almost half of all Lacked and Longed For cards are about ACs. Let's dig into why."
- 15 min: Discussion on AC theme. "Why aren't ACs ready before sprint start?" → "PM writes them during planning." → "Why during planning?" → "It's the first time the PM and engineers discuss the stories in depth." → Root cause: stories enter planning without prior refinement. Decision: add a refinement session 3 days before sprint planning.
- 10 min: Action item commitment (3-question filter).
- 5 min: Closing.

**Action items confirmed:**

Action 1: Add a 30-minute story refinement session 3 days before sprint planning
- Owner: Sarah (PM)
- Deadline: First session before Sprint 9 planning (2026-06-05)
- Done when: Recurring calendar invite sent to all team members, first refinement session completed with ACs drafted for top 5 stories.
- Backlog: Jira SPR-512

Action 2: Create an acceptance criteria template
- Owner: Ana (lead engineer)
- Deadline: 2026-05-27 (end of current sprint)
- Done when: Template published in team Notion, PM confirms it covers the fields needed.
- Backlog: Jira SPR-513

Follow-through rate from Sprint 7: 50% (1 Done, 1 In Progress). Acknowledge. "We're improving: Sprint 6 was 33%."

**Closing:** Emoji round in Slack (team is still async at session close): team posts reactions to "How are you leaving this retro?": 🎉 🎉 👍 💪 ✅.

---

## Post-retro reflection

- First async retro ran smoothly. Parabol's anonymous mode produced more candid input on Lacked cards than previous sync retros (facilitator's observation).
- 5/5 participation (vs. 4/5 typical in a rushed sync window).
- Singapore contributor wrote the most substantive Lacked cards: they reported appreciating the async format.
- 2 focused action items committed. Both in Jira with owners and deadlines.
