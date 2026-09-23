# Example: Happy-Path Sync Retro (Mid-Maturity Team)

*Demonstrates `guides/01-formats.md` (format selection), `guides/02-psychological-safety.md` (safety check), `guides/03-facilitation.md` (facilitation agenda), `guides/04-action-items.md` (action-item discipline).*

---

## Context

- **Team:** 6-person product engineering team (1 PM, 1 designer, 4 engineers)
- **Sprint:** Sprint 22, 2-week sprint, delivered a major feature with some late-breaking scope change
- **Location:** Hybrid (3 in-office, 3 remote)
- **Team maturity:** Has been running retros for 12 sprints. Used Start/Stop/Continue for the last 5.
- **Period valence:** Successful delivery but stressful: the scope change in week 2 created overtime and friction with a stakeholder.

---

## Step 1: Format selection

**Input:** Mid-maturity team with scope-change friction. SSC has been used for 5 consecutive sprints (rotation due).

**Selection:** **DAKI** (Drop / Add / Keep / Improve): the team has been running retros long enough to discuss practice refinement, and the scope-change incident needs a "what do we add to prevent this" framing rather than a complaint session. Fallback: Starfish.

**Rationale explained to team:** "We're switching to DAKI this sprint because we've gotten good at Start/Stop/Continue and we want more granularity. DAKI will let us talk about what we need to add (specifically around scope-change protocols) rather than just what to stop doing."

---

## Step 2: Safety pre-check

**Method:** Facilitator distributes a 3-item mini-survey (abbreviated Edmondson) via anonymous Slido poll at session open:
1. "I feel safe raising concerns on this team." (1-5)
2. "Team members respect each other's perspectives." (1-5)
3. "I can take risks without fear of negative consequences." (1-5)

**Result:** Average 3.9. Moderate-high safety. Proceed with standard format; use anonymous card submission for brainstorm phase.

---

## Step 3: Facilitation run

**09:00: Opening (5 min)**

Icebreaker: One word describing the sprint. Results: "Intense," "Proud," "Exhausted," "Relieved," "Frustrating," "Accomplished."

ESVP check: 3 Explorers, 2 Shoppers, 1 Vacationer (the team lead; he acknowledges it and says "I want to use this time to figure out the scope thing").

**09:05: Previous actions review (8 min)**

Previous sprint had 3 action items:
- "Update PR review SLA expectations in the team charter": Owner: Priya. **Done.** Closure: link to updated charter.
- "Schedule async design-review step before engineering handoff": Owner: James. **In Progress.** Carries over with new deadline.
- "Add 5 minutes of stakeholder-update templates to sprint planning agenda": Owner: Marcus. **Dropped.** Reason: sprint planning was cut short in Sprint 22. Insight: "Sprint planning is always the first thing we compress. Is that a symptom?"

Follow-through rate: 1/3 Done, 1/3 In Progress = 67%. Acceptable. The dropped item surfaces a pattern worth noting.

**09:13: Silent brainstorm (12 min, DAKI categories)**

All 6 participants add cards anonymously to a shared board (Parabol). Timer visible. No discussion.

Total cards: 22 (average 3.7 per person).

**09:25: Share and cluster (10 min)**

Facilitator reads cards aloud. Team groups into clusters (no discussion, just "does this go here?"):

- **Drop:** Over-communication overhead (3 cards), last-minute stakeholder scope requests (2 cards), reactive PR review queue (2 cards)
- **Add:** Scope-freeze policy (4 cards), async design-review checkpoint (2 cards), sprint planning buffer time (2 cards)
- **Keep:** Daily standup format (3 cards), pair-programming culture (2 cards), demo ritual (2 cards)
- **Improve:** PR review SLA enforcement, sprint planning depth, stakeholder communication cadence

8 clusters total.

**09:35: Dot vote (5 min)**

3 dots each. Top results:

1. Scope-freeze policy (Add): 11 dots
2. Last-minute stakeholder scope requests (Drop): 9 dots
3. Sprint planning buffer time (Add): 7 dots
4. PR review SLA enforcement (Improve): 5 dots

**09:40: Discuss top 2 themes (20 min)**

**Theme 1: Scope-freeze policy (11 dots)**

"Why are we getting late-breaking scope changes?" → "Because stakeholders can reach engineers directly." → "Why do stakeholders have direct access to engineers for scope requests?" → "We never set a policy." 

Root cause: no scope-change protocol. Decision: define a scope-freeze policy with a process for exceptions.

**Theme 2: Sprint planning buffer (7 dots)**

"Why is sprint planning always compressed?" → "We fill the entire planning block with stories and have no buffer." → "What would a buffer look like?" → "15-minute open discussion block at the end for cross-team dependencies."

Root cause: planning agenda is too dense. Action: add a 15-minute buffer to the planning agenda template.

**09:57 (skipped Theme 3 due to time): flagged for async follow-up**

**09:57: Action items (10 min)**

**Apply 3-question filter to each proposed action:**

Action 1: Define scope-freeze policy
- Who owns this? → Marcus (PM).
- When does it close? → 2026-06-03 (before Sprint 23 planning).
- Done when? → Written policy doc linked in the team charter. Reviewed and thumbs-up from team in Slack.
- Backlog: Added to Jira as SPR-449.

Action 2: Add 15-minute buffer to sprint planning agenda
- Who owns this? → Priya (Scrum Master).
- When does it close? → Applied to Sprint 23 planning (2026-05-27).
- Done when? → Sprint 23 planning agenda has the buffer slot visible 24h before the meeting.
- Backlog: Added to Jira as SPR-450.

Action 3 (carry-over): Async design-review checkpoint (In Progress)
- Owner: James. Deadline extended to 2026-06-03.
- Backlog: existing Jira ticket SPR-401 updated.

**10:07: Closing (5 min)**

One-word round: "Focused," "Hopeful," "Clear," "Good," "Better," "Ready."

Appreciations: "I want to appreciate Marcus for flagging the scope-change risk early in the sprint even when it was uncomfortable." / "Shoutout to the whole team for finishing the feature despite the chaos."

Retro ends at 10:12.

---

## Post-retro

- Follow-through rate from last retro: 67%. Tracking on sprint dashboard.
- 3 action items committed, all in Jira, all with owners and deadlines.
- Dropped theme (PR review SLA enforcement) moved to a parking-lot note for the next retro.
