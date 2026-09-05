# Worked Example: Scrum Process Audit

This example walks through a complete "is this actually Scrum?" audit for a fictional 6-person SaaS team. It demonstrates the full workflow from input gathering to framework recommendation.

---

## Input received from user

> "We're a 6-person startup building a B2B SaaS. We do 2-week sprints, daily standups, and a sprint review every other Friday. We have a product manager (he calls himself the PO) who attends planning and reviews but usually isn't available mid-sprint. Our SM is also our lead developer. We don't do retrospectives; we ran them for 3 months but they never produced anything useful so we stopped. Our 'sprint goal' is usually 'finish all the planned stories.' We're wondering if we should switch to Kanban."

---

## Step 1: "Is this actually Scrum?" audit

Applying `guides/01-scrum-guide-reference.md` checklist:

### Roles findings
| Requirement | Status | Observation |
|---|---|---|
| PO: one person, real authority | ~ | PM/PO is the right person, but mid-sprint unavailability is a concern |
| Developers: self-managing | ✓ | No evidence of external direction |
| SM: accountable for Scrum effectiveness | ✗ | SM is lead Dev: conflict of interest; retrospectives stopped on his watch |

### Events findings
| Requirement | Status | Observation |
|---|---|---|
| Sprint length fixed (1-4 weeks) | ✓ | 2-week sprints |
| Sprint Planning produces a Sprint Goal | ✗ | "Finish all planned stories" is not a Sprint Goal |
| Daily Scrum: 15-min, Developer-led | ~ | Unknown format; described as "standups": likely became status reports |
| Sprint Review: Done items only | ~ | Unknown what is shown; PM not always available |
| Sprint Retrospective: occurs | ✗ | Explicitly stopped |

### Artefacts findings
| Requirement | Status | Observation |
|---|---|---|
| Sprint Goal: specific | ✗ | "Finish the sprint" is not a goal |
| Definition of Done: written | Unknown | Not mentioned; likely implicit |
| Increment: releasable | Unknown | Not described |

---

## Step 2: Verdict

**Verdict: This is Scrum-but.**

The team has the structural shell of Scrum (cadence, planning, review, daily sync) but has removed the inspect-and-adapt mechanism (Retrospectives) and never had a real Sprint Goal. The SM role is compromised by the SM also being the lead Developer.

This is not a failure: it is a very common state for 1-3 year Scrum teams. The question is whether to fix the Scrum gaps or deliberately move to a different framework.

---

## Step 3: Anti-pattern identification

From `guides/05-anti-patterns.md`:

| Anti-pattern | Evidence |
|---|---|
| No Sprint Goal | "finish all planned stories" |
| Absent Scrum Master | SM = lead Dev; retrospectives stopped under his watch |
| Zombie Scrum (emerging) | Retrospectives stopped because they "never produced anything useful": this is the earliest signal |
| PO by Proxy (mild) | PM unavailable mid-sprint; unclear if real authority |

---

## Step 4: Framework selection assessment

Using `guides/06-framework-selection.md` decision matrix:

| Dimension | Score | Notes |
|---|---|---|
| Work predictability | 1 | B2B SaaS feature work is mostly planned |
| Sprint commitment comfort | 1 | Team commits to sprints; no noted interrupt problem |
| Unplanned work % | 1 | No mention of high interrupt load |
| Stakeholder cadence | 2 | PM intermittent mid-sprint; review structure unclear |
| Scrum experience | 2 | 1+ year of Scrum; ceremonies exist but degraded |

**Total: 7; Recommendation: Scrum (with targeted fixes)**

The team's instinct to consider Kanban is understandable, but the data does not support migration. The real problem is degraded Scrum practices, not the wrong framework. Kanban would remove the inspect-and-adapt mechanisms (Sprint Review, Retrospective) the team already struggles to maintain.

---

## Step 5: Priority action plan

| Priority | Action | Owner | Target Sprint |
|---|---|---|---|
| 1 | Write an explicit Sprint Goal at the next Sprint Planning: specific, not "finish the list" | PM/PO | Sprint N+1 |
| 2 | Restart Retrospectives with a new format (DAKI instead of Start/Stop/Continue) and commit to one specific action item per Retro | SM | Sprint N+1 |
| 3 | Define a written Definition of Done (minimum: code reviewed, tested manually, AC met) | SM + Developers | Sprint N+1 (first retro) |
| 4 | Evaluate SM conflict of interest: can a Developer other than the lead take on SM facilitation? | Team | Sprint N+2 |

---

## Output delivered to user

The coaching response would include:
1. Verdict: "This is Scrum-but, not Scrum, but it's fixable without switching frameworks."
2. The four anti-patterns named and explained
3. The four priority actions above
4. The DoD startup template (`templates/definition-of-done-startup.md`) for immediate use
5. The DAKI retrospective format (`templates/retrospective-formats.md`, Format 5) for the restarted retro
6. A Sprint Goal example: "Enable any new customer to complete onboarding without contacting support"

---

*This example demonstrates agile-scrum-worker-bee's audit workflow. For the full template, see `templates/scrum-audit-report.md`.*
