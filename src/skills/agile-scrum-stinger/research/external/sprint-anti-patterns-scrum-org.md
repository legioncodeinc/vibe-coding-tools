---
source_url: https://scrum.org/resources/blog/sprint-anti-patterns
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: anti-patterns
stinger: agile-scrum-stinger
---

# Sprint Anti-Patterns (Scrum.org, March 2024)

## Summary
Scrum.org's catalog of Sprint-level anti-patterns covering Sprint Backlog composition, PO behavior during the Sprint, and common Sprint execution failures. Directly relevant to the "ceremony health" audit function of agile-scrum-worker-bee.

## Key quotations / statistics
- "Absent PO: The Product Owner is absent most of the Sprint and is not available to answer questions of the Developers... it displays the team's value creation, putting the accomplishment of the Sprint Goal at risk."
- "Not having a Sprint Goal: The Product Owner proposes a direction that resembles a random assortment of tasks, providing no cohesion. If this is the natural way of finishing your Sprint Planning, you probably have outlived the usefulness of Scrum as a product development framework."
- "Sprint stuffing: The Developers accomplished the Sprint Goal early, and the Product Owner is pushing them hard to accept new work from the Product Backlog to fill the 'void.'"
- "PO clinging to tasks: There is a clear line: before a Product Backlog item becomes part of the Sprint Backlog, the Product Owner is responsible. However, once it moves from one backlog to the other, the Developers become responsible."

## Sprint Anti-Pattern Quick Reference
| Anti-Pattern | Diagnosis Signal | Scrum Guide Violation |
|---|---|---|
| No Sprint Goal | Planning output is task list, not unified objective | Sprint Backlog commitment missing |
| Absent PO | Developers make product decisions alone | PO accountability not fulfilled |
| PO clinging to tasks | PO changes AC after items enter Sprint Backlog | Developers own Sprint Backlog, not PO |
| Delaying PO | Items sit "Done" waiting for PO review for days | Artificial queue; cycle time inflated |
| Sprint stuffing | PO pushes new work when Sprint Goal achieved | Violates Developer prerogative |
| No Sprint cancellation | Sprint continues when Goal becomes obsolete | Wasteful; violates empiricism |

## Key Audit Trigger
When a Scrum team cannot articulate their Sprint Goal, the audit should flag this as a potential indicator that:
1. Scrum may not be the right framework (Product Backlog is just a maintenance task list)
2. PO is not empowered to define a coherent product direction
3. Team has drifted into Zombie Scrum

## Annotations for stinger-forge
- The "No Sprint Goal" anti-pattern is the single most actionable Sprint diagnostic: directly observable in Sprint Planning output.
- The PO ownership boundary ("before Sprint Backlog = PO; after Sprint Backlog = Developers") is a clean rule for the audit report template.
- This source feeds into `guides/02-ceremonies.md` (Sprint Planning failure modes section) and `guides/05-anti-patterns.md` (Sprint anti-patterns section).
