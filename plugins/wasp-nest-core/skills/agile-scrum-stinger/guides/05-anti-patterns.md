# 05. Anti-Patterns

A catalogued library of the most common Scrum anti-patterns, with diagnostic signals and named repair moves. Sources: Scrum.org official anti-pattern catalogs (2021-2026), Sprint Pathologies (Scrum.org), PO Anti-Patterns (Scrum.org), Zombie Scrum (Scrum.org / Christiaan Verwijs).

---

## Catalog overview

| Anti-pattern | Category | Severity |
|---|---|---|
| Zombie Scrum | Systemic | Critical |
| No Sprint Goal | Sprint | High |
| PO by Proxy | Role | High |
| HiPPO PO | Role | High |
| Absent Scrum Master | Role | High |
| Velocity as KPI | Metrics | Medium |
| Sprint-end heroics | Sprint | Medium |
| No Retrospective action items | Ceremony | Medium |
| Scrum-but | Systemic | Medium |
| Three-question Daily Scrum as religion | Ceremony | Low |

---

## Zombie Scrum

**Definition:** The team goes through all the Scrum motions (Planning, Daily, Review, Retro) but no one believes the ceremonies produce value. The team is technically "doing Scrum" but is effectively disengaged.

**Diagnostic signals:**
- Daily Scrum is a ritual nobody cares about
- Sprint Reviews have no stakeholders
- Retrospectives produce the same action items Sprint after Sprint
- When asked "what's your Sprint Goal?", the team points at the backlog
- Developers say "we just pick up tickets"

**Root cause:** Scrum adopted as a management mandate without buy-in. The "why" behind each ceremony was never established.

**Repair moves:**
1. Run a team survey: "Which ceremonies feel valuable? Which feel like overhead?" Share results.
2. Reduce to the minimum: temporarily drop ceremonies that produce no value; add them back when the team requests them.
3. Fix the Sprint Goal: if there is no Sprint Goal, there is no purpose to inspect against. Start here.
4. Get stakeholders back into Sprint Review. Their absence is the most visible symptom of zombie Scrum.

---

## No Sprint Goal

**Definition:** The Sprint Backlog is the "goal": the team commits to completing a list of stories with no shared purpose.

**Diagnostic signals:**
- Sprint Planning ends with a list of stories but no one can articulate a business outcome
- "Our Sprint Goal is to complete all planned stories" (this is not a goal)
- Developers don't reference the Sprint Goal during the Sprint

**Root cause:** PO has not articulated business outcomes; team has defaulted to feature delivery.

**Repair moves:**
1. Run a 10-minute "goal framing" exercise at the start of Sprint Planning: "If we completed only 50% of the planned work, what would success look like?"
2. Write the Sprint Goal on a physical card or Slack pin before the Sprint starts
3. Add "Sprint Goal check" to the Daily Scrum agenda for 3 Sprints to build the habit

---

## PO by Proxy

**Definition:** The "Product Owner" does not have authority to make product decisions. They relay requests from the real decision-maker (often an executive or external client).

**Diagnostic signals:**
- "I'll have to check with the business on that"
- Sprint Reviews require a follow-up meeting before backlog changes happen
- Sprint Planning stalls because stories lack clarity and the PO can't resolve it

**Root cause:** Organization named a PO without giving them the necessary authority (Scrum Guide requirement: the organization must respect the PO's decisions).

**Repair moves:**
1. Name the constraint explicitly: "This person does not have PO authority by Scrum Guide definition."
2. Escalate to organization leadership: a PO without authority cannot fulfill the role. The choice is to grant authority or acknowledge the team is not doing Scrum.
3. Interim: clarify what decisions the PO CAN make; create an escalation protocol for decisions outside their authority.

---

## HiPPO PO

**Definition:** The Highest-Paid Person's Opinion (HiPPO) overrides the PO's backlog decisions. A senior executive can add or reprioritize stories at will, regardless of the Sprint Goal.

**Diagnostic signals:**
- New "urgent" stories appear mid-Sprint from management
- Sprint Goals are abandoned when executive priorities shift
- PO cannot say no to story requests

**Root cause:** The organization has not accepted the PO role's authority; leadership sees the backlog as a tasking system, not a product roadmap.

**Repair moves:**
1. Scrum Master responsibility: educate leadership that mid-Sprint additions threaten the Sprint Goal (Scrum Guide explicitly allows PO to cancel Sprint if Sprint Goal becomes obsolete, but not to add work silently).
2. Create a "Stakeholder Request" intake process: requests go to the Product Backlog, not directly to the Sprint Backlog.
3. Make the cost visible: when a HiPPO story is added, name what gets dropped from the Sprint Goal.

---

## Absent Scrum Master

**Definition:** The Scrum Master role is unfilled, combined with another role (PM, lead developer), or so low in priority that Scrum ceremonies aren't facilitated.

**Diagnostic signals:**
- SM is also the lead Developer or project manager
- Retrospectives are skipped when the SM is on leave
- Scrum Guide principles are not coached: they are unknown to the team

**Root cause:** Organization views the SM as a meeting organizer rather than as a coach. The role is deprioritized.

**Repair moves:**
1. Name the gap: "The Scrum Master role is not being fulfilled. The team is missing coaching on Scrum practices."
2. If the SM is combined with a Dev role: acknowledge the conflict; SMas-Developer is a known anti-pattern (hard to remove impediments that you are part of creating).
3. If the organization won't fund a dedicated SM: at minimum, rotate Retrospective facilitation to reduce dependency on one person.

---

## Velocity as KPI

**Definition:** Team velocity is used as a performance metric: compared across teams, tracked as a target, or used to evaluate Developers.

**Diagnostic signals:**
- Management reports team velocity in stakeholder updates
- Teams are compared: "Team A gets 40 points; Team B only gets 25"
- Developers feel pressure to increase velocity quarter over quarter

**Root cause:** Management does not understand that velocity is a capacity planning tool, not an output metric.

**Repair moves:**
1. Education: velocity is team-specific and calibration-dependent; a team that sizes conservatively will have a "lower" velocity than a team that estimates liberally, with no real productivity difference.
2. Replace velocity reporting with outcome metrics: "features shipped that users actually used" or "lead time for a feature from idea to production."
3. If velocity must be reported: report it as a range (±20%) rather than a point estimate.

---

## Sprint-End Heroics

**Definition:** Stories are "completed" in the last 2-4 hours of the Sprint through rushed testing, skipped DoD items, or pressure-driven declarations of "done."

**Diagnostic signals:**
- Bugs or regressions spike post-Sprint
- DoD items are checked without being completed ("tests pass" when no tests were written)
- Review shows work that obviously needs more time

**Repair moves:**
1. SM: be present at Sprint end; ask for DoD evidence on each "Done" story.
2. Apply the Sprint Review gate: stories that don't meet the DoD are not shown in Sprint Review.
3. Root cause analysis: is the Sprint consistently overloaded? Reduce velocity target by 20% next Sprint.

---

## No Retrospective Action Items

**Definition:** Retrospective ends with a list of themes or feelings, but no committed action items with owners and deadlines.

**Diagnostic signals:**
- The same issues appear in Retro Sprint after Sprint
- Retro notes say "team should communicate better" without specifics
- Previous action items are not reviewed at the start of the next Retro

**Repair moves:**
1. Facilitation mandate: before closing Retro, ask "What specific thing will we do differently next Sprint? Who owns it? By which Sprint?"
2. Add "Review previous action items" as the first Retro agenda item.
3. If the team can't commit to actions: examine psychological safety. Anonymous retrospective formats (sticky notes, EasyRetro) lower the barrier.

---

## Scrum-but

**Definition:** "We do Scrum, but we don't do Retrospectives." "We do Scrum, but our Sprints are 6 weeks." Teams adopt some Scrum elements while skipping others.

**The nuance:** Some Scrum-but patterns are reasonable adaptations; others are violations of the framework's core. Distinguish them:

| Scrum-but | Impact | Advice |
|---|---|---|
| "But we don't use story points" | Low: story points aren't in the Guide | Not a violation; call it accurately |
| "But our Sprints are 6 weeks" | Medium: exceeds Guide's 4-week maximum | Acknowledge the deviation; assess if a shorter cycle would improve inspect-and-adapt |
| "But we skip Retrospectives" | High: removes the continuous improvement mechanism | This is a critical violation of the framework's intent |
| "But our PO doesn't attend Sprint Review" | High: removes the adaptation feedback loop | Address with organizational coaching |

The honesty-first principle: label the deviation accurately. A team that skips Retros is not "doing Scrum with some modifications": they're doing a subset that breaks the inspect-and-adapt cycle.
