---
source_url: https://scrum.org/resources/blog/what-difference-between-definition-done-and-acceptance-criteria
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: definition-of-done
stinger: agile-scrum-stinger
---

# Definition of Done vs Acceptance Criteria - Scrum.org Official Explanation

## Summary
The official Scrum.org distinction between DoD and Acceptance Criteria. A commonly conflated pair of concepts: this source provides the normative separation from the Scrum authority. Essential for `guides/04-definition-of-done.md`.

## Key quotations / statistics
- "The DoD is applied to every Product Backlog Item. It is a comprehensive checklist that ensures quality by including functionality, performance, security, compliance, and other necessary standards that apply to all increments."
- "Acceptance Criteria are conditions that a specific Product Backlog Item must meet for it to be accepted by a customer, a user, or other systems. These are tailored to individual items and detail the expected behaviour and requirements of that feature or piece of functionality. Acceptance Criteria are not part of the Scrum but a complementary practice."
- "Creating DoD is a collaborative process involving the entire team and sometimes even multiple teams or the entire product organisation. Acceptance Criteria are primarily the product owner's responsibility."
- "DoD is referenced and applied at the end of the sprint to assess if work is complete. Acceptance Criteria are used throughout the sprint to guide development and testing."

## Core Distinctions
| Aspect | Definition of Done | Acceptance Criteria |
|---|---|---|
| Scope | Applies to ALL backlog items | Specific to ONE backlog item |
| Purpose | Quality gate (engineering standards) | Functional requirements (user value) |
| Set by | Team collaboratively | Product Owner (delegable) |
| Perspective | Development team quality promise | User/customer success conditions |
| Changes | Rarely (evolves with team maturity) | Per item |
| Scrum Guide | Defined artifact commitment | Complementary practice (not in Guide) |

## Critical Coaching Point
"A common error is to confuse Acceptance Criteria (AC) with the DoD. The DoD describes how the **business validates quality**; the AC describes how the **customer validates value**."

Including AC in the DoD creates dysfunction: if customer feedback changes AC mid-sprint, the team can never be "done" with a Done increment. Separating them allows Done to mean Done.

## Annotations for stinger-forge
- This disambiguation is REQUIRED in `guides/04-definition-of-done.md`. Many Scrum teams conflate these concepts.
- The table above should appear verbatim (or near-verbatim) in the DoD guide.
- The "slows forward progress" argument is the key reason NOT to include AC in DoD: teams get stuck in an infinite loop chasing changing customer expectations.
- Secondary source confirmation: applied-frameworks.com and theserverside.com both align with this Scrum.org framing.
