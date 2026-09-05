---
source_type: synthesized-internal
authority: community-practitioner
relevance: critical
topic: ceremony-health
stinger: agile-scrum-stinger
fetched: 2026-05-20
---

# Scrum Ceremony Health Indicators

Synthesized from: Scrum Guide 2020, Scrum.org anti-patterns library, Age of Product Scrum anti-patterns guide (Stefan Wolpers), agile-checksum.com 2026 anti-patterns research.

---

## Sprint Planning

### Normative duration formula (2020 Guide)
`2 hours per sprint week`: so a 2-week sprint = 4-hour maximum.

### Three-topic structure (2020 addition)
1. **Why**: Sprint Goal, what value does this Sprint deliver? (PO proposes; team negotiates)
2. **What**: PBI selection, which backlog items move to Sprint Backlog?
3. **How**: initial plan, how will the Developers accomplish the work?

### Attendance requirements
- All Scrum Team members (PO, SM, all Developers)
- SM facilitates; PO proposes; Developers commit
- SM is optional attendee (not required by Guide, but typically present as facilitator)

### Health indicators (green)
- Sprint Goal is negotiated, measurable, and motivating, not just "complete these 7 stories"
- Sprint Backlog is a real plan with identified tasks, not just a copy of the top PBIs
- Team pulls work to capacity, not pushed by PO
- Meeting ends on time or early

### Common failure modes (red, anti-patterns)
| Anti-pattern | Symptom | Repair |
|---|---|---|
| No Sprint Goal | Backlog is just a task list with no coherence | Dedicate first 15 min to crafting the Goal |
| PO assigns tasks | Developers don't self-organize | SM intervenes; restate that Developers choose how |
| Estimation session takes over | 4-hour timebox exceeded in estimation debates | Separate refinement from planning (do estimation in refinement) |
| Stories not ready | Developers waste planning discussing unclear requirements | Enforce Definition of Ready (community practice) as pre-condition |
| Capacity ignored | Team commits far above historical velocity | Use "yesterday's weather": commit to average velocity ± 10% |

---

## Daily Scrum

### Normative requirements (2020 Guide)
- 15 minutes maximum
- For Developers only: PO and SM may attend as Developers if working on Sprint Backlog items
- Held at same time, same place daily
- Purpose: inspect progress toward Sprint Goal and adapt Sprint Backlog

### What the Guide does NOT require
- The three questions ("What did I do?", "What will I do?", "Any blockers?"): removed in 2020
- Any specific format
- Attendance by PO or SM (unless they are doing development work)

### Health indicators (green)
- Discussion centers on Sprint Goal progress, not individual task status
- Blockers are surfaced and acted on within 24 hours
- Team leaves with a clear shared plan for the day
- Non-developers do not attend unless working on Sprint Backlog items

### Common failure modes (red)
| Anti-pattern | Symptom | Repair |
|---|---|---|
| Status meeting | Developers report to SM/manager one by one, no peer coordination | Reframe: "What do we need to coordinate to reach the Sprint Goal today?" |
| Too many participants | Non-developers attend, meeting runs long, team self-censors | Invite only working team; observers stand at back if needed |
| Impediment capture only | Problems named but never resolved | SM must action impediments same-day or escalate |
| Skipped daily | "We had a busy day" | Protect the 15 min; it's 1.25% of the sprint, never worth skipping |
| Zombie standup | Rote answers, no eye contact, no collaboration | Introduce Sprint Goal check-in as first question |

---

## Sprint Review

### Normative duration formula
`1 hour per sprint week`: 2-week sprint = 2-hour maximum.

### Normative requirements
- Presents results of the Sprint to key stakeholders
- Scrum Team AND stakeholders collaborate on what to do next
- Product Backlog may be adjusted based on the session
- **NOT a gate to releasing value** (2020 clarification)
- It is a "working session", not a presentation

### Attendance requirements
- All Scrum Team members + key stakeholders
- Stakeholders must be able to give feedback and influence backlog direction

### Health indicators (green)
- Stakeholders actually attend and give feedback
- Actual increment demonstrated (not slides)
- Product Backlog is adjusted based on what was learned
- Discussion about market changes, business context, not just "did we finish stories"

### Common failure modes (red)
| Anti-pattern | Symptom | Repair |
|---|---|---|
| Slide deck review | No working software shown, just screenshots or mockups | Demo only done, shippable increments |
| No stakeholders | "We demoed to ourselves" | SM/PO must ensure stakeholder presence; if impossible, get async feedback |
| PO gate review | PO approves/rejects tasks one by one: Sprint Review becomes acceptance testing | Acceptance happens during Sprint, not at Review |
| No backlog update | Sprint Review ends without backlog adjustments | PO must update and re-order backlog as direct output |
| Feature factory syndrome | Team celebrates completing stories but no business outcome discussion | Start Review with: "What business outcome were we targeting this Sprint?" |

---

## Sprint Retrospective

### Normative duration formula
`45 minutes per sprint week`: 2-week sprint = 1.5-hour maximum.

### Normative requirements
- Inspect: how did the last Sprint go with regard to individuals, interactions, processes, tools, and DoD?
- Identify: what went well, what problems were encountered, how were those problems solved?
- Create a plan for implementing improvements to the way the Scrum Team does its work

### What the Guide removed in 2020
- The requirement that "at least one high priority improvement" be added to the Sprint Backlog: this was softened to give teams more flexibility.

### Health indicators (green)
- All team members speak up, not just vocal members
- Retrospective produces 1-3 actionable improvement items with clear owners and target sprint
- Action items from prior retro are reviewed at start
- Format is varied to prevent staleness (not the same 3-column table every Sprint)
- Psychological safety is present: team names real problems, not just safe ones

### Common failure modes (red)
| Anti-pattern | Symptom | Repair |
|---|---|---|
| No action items | "We discussed a lot but nothing changed" | Every retro must produce at least 1 owner-assigned improvement |
| Same issues every sprint | Identical complaints sprint after sprint | Check: were last sprint's actions actually implemented? |
| SM runs it (only) | SM dominates facilitation, team passively answers | Rotate facilitation; use anonymous formats (FunRetro, EasyRetro) |
| Blame game | Finger-pointing instead of systemic thinking | Use 5 Whys; reframe from blame to process |
| Absent team member | PO or developers skip retro | All Scrum Team members must attend; SM escalates if patterns emerge |
| Happy path retro | Team only discusses positives, avoids conflict | Introduce anonymous input method (sticky notes, online tools) |

---

## Backlog Refinement (NOT a Scrum event)

### Status
Backlog Refinement is ongoing work: NOT a Scrum event. The Guide mentions it informally.

### Community guidance
- Up to 10% of team capacity per Sprint (Mike Cohn / Scrum.org community practice)
- Typically 1-2 sessions per Sprint of 1-1.5 hours each for a 2-week Sprint
- Goal: ensure top 2-3 sprints worth of backlog is "ready" (estimated, detailed, small enough)

### Common failure modes (red)
| Anti-pattern | Symptom | Repair |
|---|---|---|
| Refinement is Sprint Planning | Team refines and plans in one mega-session | Separate refinement (ongoing) from planning (Sprint boundary) |
| Only PO refines | Team shows up to Sprint Planning with surprises | Developers must attend and shape PBIs |
| Refinement theater | Hours spent writing acceptance criteria that nobody reads | Keep it lightweight, just enough for planning |
| Backlog too large | 300+ items in backlog; nobody can prioritize | Cap backlog at 8-12 weeks of work; archive the rest |

---

## Ceremony Duration Quick Reference

| Sprint length | Planning | Daily Scrum | Review | Retrospective |
|---|---|---|---|---|
| 1 week | 2 hours | 15 min | 1 hour | 45 min |
| 2 weeks | 4 hours | 15 min | 2 hours | 1.5 hours |
| 3 weeks | 6 hours | 15 min | 3 hours | 2.25 hours |
| 4 weeks | 8 hours | 15 min | 4 hours | 3 hours |

All timeboxes are maximum durations. End early if the purpose is achieved.
