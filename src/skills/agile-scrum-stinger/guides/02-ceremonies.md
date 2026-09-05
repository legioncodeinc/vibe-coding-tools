# 02. Ceremony Coaching

Per-ceremony coaching guide for all five Scrum events. Each section covers: purpose, duration formula, attendance, failure modes and repair moves, and diagnostic questions.

---

## §1. Sprint Planning

### Purpose (Scrum Guide 2020)
Establish the Sprint Goal (Why), select Backlog items (What), and plan how to create the Increment (How).

### Duration formula
`Max 2 hours per Sprint week`: a 2-week Sprint gets 4 hours max; a 4-week Sprint gets 8 hours max.

### Attendance
**Required:** Scrum Team (PO + SM + all Developers)
**Optional:** SMEs the team invites

### Sprint Goal: the most commonly missing output
The Sprint Goal is the single most commonly skipped output of Sprint Planning. Diagnostic questions:
- "What business outcome are we creating this Sprint?"
- "If a Developer's story fell apart mid-Sprint, would the Sprint still succeed?"
- "Can every team member recite the Sprint Goal without looking it up?"

A Sprint Goal that passes: "Enable users to complete checkout without contacting support."
A Sprint Goal that fails: "Finish the checkout stories in the backlog."

### Failure modes and repair moves

| Failure mode | Diagnostic signal | Repair move |
|---|---|---|
| No Sprint Goal produced | Team commits to a list, not a purpose | Run a 10-min "goal framing" exercise before story selection |
| PO not present | Stories re-explained mid-session; direction unclear | Pre-condition: reschedule if PO absent; no exceptions |
| Stories not ready (no AC) | Planning takes 3x longer than forecast | Add "AC complete" to DoD for backlog items entering sprint |
| Estimation dominates | 60% of time on sizing, 40% on plan | Time-box estimation to 50% of available time; move overflow to refinement |
| No capacity accounting | Sprint overcommits every iteration | Use Developer capacity per day, subtract ceremonies and leave |

### Sprint Planning agenda template
See `templates/sprint-planning-agenda.md`.

---

## §2. Daily Scrum

### Purpose (Scrum Guide 2020)
Developers plan their collaboration and inspect their progress toward the Sprint Goal. A 15-minute daily synchronization.

### Duration
**Hard time-box: 15 minutes.** Not 16 minutes. If discussions always run over, the Daily Scrum has become something else.

### Attendance
**Required:** Developers
**Optional:** PO and SM may attend but do not direct the conversation. SM ensures the event happens.

### Format
The 2020 Guide prescribes no format. The three questions from 2017 ("What did I do yesterday? What will I do today? What's blocking me?") are community practice, not Scrum Guide requirements. Teams may use them, but should not cite them as "what Scrum requires."

Alternative formats that work:
- Board walk: go through active Sprint Backlog items left-to-right; Developers comment on their items
- Sprint Goal focus: "Are we on track for the Sprint Goal? What threatens it?"
- Round-robin without questions: each Developer says what they need from others today

### Failure modes and repair moves

| Failure mode | Diagnostic signal | Repair move |
|---|---|---|
| Status report to SM | Developers face the SM, not each other | Physically remove SM from the circle; Developers face each other |
| Runs long | Consistently >20 minutes | Strict hand signal for "this needs a separate conversation" |
| Blocker venting session | 10+ minutes on a single blocker | Park the detail; SM books a follow-up with affected Developers only |
| No Sprint Goal reference | No mention of Sprint Goal in a week of standups | Add "Are we on track for the Sprint Goal?" as standing first question |
| Daily Scrum skipped | "We communicate on Slack anyway" | Not equivalent: async misses real-time coordination signals; re-establish habit |

---

## §3. Sprint Review

### Purpose (Scrum Guide 2020)
Scrum Team and stakeholders inspect the Increment and adapt the Product Backlog. This is a collaborative working session, not a one-directional demo.

### Duration formula
`Max 1 hour per Sprint week`: 2-week Sprint gets 2 hours max; 4-week Sprint gets 4 hours max.

### Attendance
**Required:** Scrum Team + invited stakeholders
**Without stakeholders:** The Sprint Review is a dry run, not a real review. Reschedule or note the gap.

### What may be reviewed
Only **Done Increments**: items that meet the Definition of Done in full. Showing "almost done" or "95% done" work in Sprint Review is a common failure mode that erodes trust.

### Failure modes and repair moves

| Failure mode | Diagnostic signal | Repair move |
|---|---|---|
| No stakeholders attend | Only internal team present | PO owns stakeholder attendance; block the calendar 2 weeks ahead |
| "Almost Done" items shown | "We just need one more day on..." | Gate: nothing enters Sprint Review without meeting DoD |
| Management status report | Slides replace working software | Mandate: only working Increment is reviewed; kill slide decks |
| Product Backlog not updated | Review ends without adaptation | Close every Sprint Review with PO stating what changed in the Backlog |
| No feedback collected | Team presents, stakeholders watch | Add 15-min open Q&A and backlog impact discussion to agenda |

---

## §4. Sprint Retrospective

### Purpose (Scrum Guide 2020)
Inspect how the last Sprint went (people, interactions, processes, tools) and identify improvements to enact.

### Duration formula
`Max 45 minutes per Sprint week`: 2-week Sprint gets 90 minutes max; 4-week Sprint gets 3 hours max.

### Attendance
**Required:** Scrum Team (all roles)
**Stakeholders:** Do NOT attend (creates psychological safety risk)

### The action item rule
Every Retrospective that produces no owned, time-boxed action items has failed. The output is not a list of feelings or themes: it is commitments to change behavior in the next Sprint.

**Required fields per action item:**
- What: specific, measurable behavior change
- Who: one owner (not "the team")
- When: target Sprint

### Retrospective format library
See `templates/retrospective-formats.md` for:
- Start / Stop / Continue (default, good for most contexts)
- 4Ls (Liked / Learned / Lacked / Longed For)
- Sailboat (liked by teams that like metaphors)
- Mad / Sad / Glad (useful when team morale needs explicit surfacing)
- DAKI (Drop / Add / Keep / Improve, good for structural changes)
- Starfish (useful when team is mature and wants granular improvement)

### Failure modes and repair moves

| Failure mode | Diagnostic signal | Repair move |
|---|---|---|
| No action items | Retro ends with "good discussion" | Facilitate: "What specific thing will we do differently next Sprint? Who owns it?" |
| Same issues every sprint | Recurring themes; no progress | Carry previous action items into the current retro as agenda item 1 |
| Psychological safety too low | Silence or surface-level comments only | Use anonymous sticky notes or async retro tools (EasyRetro, Retrium) |
| SM dominates the retro | SM does most of the talking | SM facilitates; SM does not prescribe outcomes |
| Skipped when Sprint was hard | "We're behind; no time for retro" | Retro is most needed after hard sprints; make it non-negotiable |

---

## §5. Backlog Refinement

### Important: NOT a formal Scrum event
The Scrum Guide 2020 describes Backlog Refinement as an ongoing activity, not one of the five formal Scrum events. Teams that run a weekly "refinement meeting" are making a team decision. This is often a good decision, but it is not "required by Scrum."

### Purpose
Add details, estimates (if used), and ordering to Product Backlog items so they are ready for future Sprint Planning sessions.

### The "10% rule"
Community practice (not Scrum Guide) suggests spending approximately 10% of Sprint capacity on refinement. For a 2-week Sprint with 10 Developers, that is roughly 8 person-hours of refinement per Sprint.

### Readiness criteria (useful heuristic, not normative)
An item is "ready" for Sprint Planning when:
- [ ] Title is specific (not "Fix bug": "Fix null pointer in checkout flow when cart is empty")
- [ ] Acceptance Criteria are written and agreed by PO + at least one Developer
- [ ] Dependencies are identified
- [ ] The team has a rough size estimate (if estimation is used)
- [ ] The item fits within one Sprint (if it doesn't, split it)

### Failure modes and repair moves

| Failure mode | Diagnostic signal | Repair move |
|---|---|---|
| Items enter Sprint Planning unrefined | Sprint Planning extends hours beyond time-box | Add "AC written" as pre-condition for story entering sprint planning |
| Refinement dominated by one person | PO or lead Dev does all the talking | Rotate facilitation; encourage each Dev to read one story aloud |
| No estimation during refinement | All estimation saved for Sprint Planning | Move sizing to refinement; Sprint Planning focuses on plan, not sizing |
| Refinement backlog too thin | Team runs out of refined items | Maintain a 2-Sprint-ahead refined backlog as a buffer |
