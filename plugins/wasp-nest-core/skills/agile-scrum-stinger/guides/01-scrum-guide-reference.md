# 01. Scrum Guide 2020 Audit Map

The Scrum Guide 2020 (https://scrumguides.org) is 13 pages. Every normative claim in this stinger traces to it. This guide maps each Scrum Guide requirement to an actionable audit check, using the exact structure: Roles, Events, Artefacts, Commitments.

---

## Key changes from Scrum Guide 2017 → 2020

These are the most commonly violated because teams learned 2017:

| 2017 | 2020 |
|---|---|
| "Development Team" | "Developers" |
| "Self-organizing" | "Self-managing" |
| Product Backlog Goal (implied) | "Product Goal" (explicit commitment) |
| Sprint Goal (ceremony output) | Sprint Goal (Sprint Backlog commitment) |
| Three Daily Scrum questions prescribed | No prescribed format: team decides |
| Servant-leadership described for SM | "True leader" language added |

---

## Scrum Team Roles Audit Checklist

### Product Owner
**Guide requires:**
- [ ] One person, not a committee
- [ ] Responsible for Product Backlog ordering and Product Goal
- [ ] Stakeholder decisions respected (real authority, not a proxy)
- [ ] Available to answer Developers' questions during the Sprint

**Common violations:**
- PO by Proxy: a "business representative" who must escalate every decision (violates authority requirement)
- Committee PO: "the product committee decides the backlog" (violates one-person requirement)
- Absent PO: PO not reachable during Sprint (violates availability requirement)

### Scrum Master
**Guide requires:**
- [ ] Accountable for Scrum team's effectiveness
- [ ] Coaches team, PO, and organization in Scrum
- [ ] Serves the Scrum Team as a true leader (not just a meeting scheduler)

**Common violations:**
- SM as note-taker: only facilitates meetings without coaching on Scrum (role reduced to admin)
- SM as combined PM: manages external stakeholders, runs status reports, sets deadlines (scope creep)
- Missing SM: no one owns Scrum adoption; processes drift without accountability

### Developers
**Guide requires:**
- [ ] 10 or fewer people (recommended, not hard rule)
- [ ] Cross-functional: must be able to create a "Done" Increment each Sprint
- [ ] Self-managing: decide how to do the work, not told by someone outside

**Common violations:**
- Developers can't create Done Increment without external help (QA, ops, security teams outside the team)
- Developers directed by SM or PO on how to do the work (violates self-managing)

---

## Scrum Events Audit Checklist

### Sprint
**Guide requires:**
- [ ] Fixed length (1-4 weeks, same duration, not adjusted per sprint)
- [ ] No changes that endanger Sprint Goal
- [ ] PO can cancel Sprint only if Sprint Goal obsolete

**Common violations:**
- "Sprint" of 6 weeks (exceeds maximum; violates cadence principle)
- Sprint length varies ("we'll do 3 weeks this time"): undermines rhythm
- Sprint cancelled by management, not PO (authority violation)

### Sprint Planning
**Guide requires:**
- [ ] Time-boxed to maximum 8 hours for 1-month Sprint (proportionally shorter for shorter sprints)
- [ ] Addresses: Why (Sprint Goal), What (selected Backlog items), How (plan for creating Increment)
- [ ] Output: Sprint Goal and Sprint Backlog

**Common violations:**
- No Sprint Goal produced (most common; "our Sprint Goal is to finish the sprint backlog" is not a goal)
- Only "What" addressed, not "Why": team has tasks but no shared purpose
- Runs 30 minutes for 2-week Sprint (insufficient for real planning)

### Daily Scrum
**Guide requires:**
- [ ] 15-minute time-box, every day, same time and place
- [ ] Developers plan collaboration and progress toward Sprint Goal
- [ ] Format decided by the Developers (no prescribed questions)

**IMPORTANT: Common misunderstanding:**
The three questions ("What did I do yesterday?", "What will I do today?", "What's blocking me?") were in the **2017 Guide**. The **2020 Guide removed them**. Teams using them are using community practice, not Scrum Guide requirement. Label accordingly.

**Common violations:**
- Daily Scrum has become a status report to SM or PO (violates "Developers plan for each other")
- Runs 45-60 minutes (exceeds 15-minute time-box)
- Skipped when SM is on leave (if Daily Scrum only happens because SM forces it, the team doesn't own it)

### Sprint Review
**Guide requires:**
- [ ] Maximum 4-hour time-box for 1-month Sprint
- [ ] Scrum Team and stakeholders inspect Increment and adapt Product Backlog
- [ ] Working, Done software demonstrated (not slides about what's coming)

**Common violations:**
- Demo of features not yet Done (only Done Increments may be reviewed)
- No stakeholder attendance (Sprint Review without stakeholders is a dry run, not a review)
- Used as a status report to management rather than an inspection of the Increment

### Sprint Retrospective
**Guide requires:**
- [ ] Maximum 3-hour time-box for 1-month Sprint
- [ ] Inspects how the last Sprint went: people, interactions, processes, tools
- [ ] Plans improvements to enact in the next Sprint
- [ ] Most significant improvement added to next Sprint Backlog (optional but recommended)

**Common violations:**
- Retrospective produces no action items (most common, venting without commitment)
- Action items have no owner or no timeline ("we should improve our code review process" → nobody owns it)
- Retrospective skipped when Sprint didn't go well ("we don't have time for retro"), violates the principle that this is when retro is most needed

### Backlog Refinement
**Guide says:** "Backlog Refinement is the act of breaking down and further defining Product Backlog items into smaller, more precise items. This is an ongoing activity to add details, estimates, and order. [...] The Scrum Team decides how and when refinement is done."

**IMPORTANT: NOT a formal Scrum event:** Backlog Refinement is not listed as one of Scrum's five events. Teams that run it as a formal weekly meeting are making a team decision (often a good one), not following a Scrum Guide requirement. Label this as a team practice, not normative Scrum.

---

## Scrum Artefacts and Commitments Audit Checklist

### Product Backlog: Commitment: Product Goal
- [ ] Product Backlog exists and is maintained by PO
- [ ] Product Goal is explicit, public, and the team can state it
- [ ] Items are ordered (not prioritized, ordering implies ranking, not tiering)

### Sprint Backlog: Commitment: Sprint Goal
- [ ] Sprint Goal is created during Sprint Planning and is specific enough to fail
- [ ] "Our Sprint Goal is to complete all planned stories" is not a Sprint Goal
- [ ] Sprint Backlog is owned by Developers and updated daily

### Increment: Commitment: Definition of Done
- [ ] Definition of Done exists, is written, and is applied to every item
- [ ] Increment is releasable (meets DoD) at end of Sprint, regardless of whether it is released
- [ ] DoD is stricter than or equal to any organizational DoD

---

*All requirements in this guide cite Scrum Guide 2020. Community practices are labeled explicitly.*
