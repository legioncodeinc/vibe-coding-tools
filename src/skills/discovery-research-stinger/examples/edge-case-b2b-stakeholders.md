# Example: Edge Case — Discovery in Complex B2B with Multiple Stakeholders

Demonstrates how to adapt the continuous-discovery process when there are multiple buyer/user personas with conflicting needs, which is common in enterprise B2B.

**Related guides:** `guides/01-desired-outcome.md`, `guides/02-opportunity-solution-tree.md`, `guides/04-jtbd-interview.md`

---

## Context

**Product:** Compliance-reporting SaaS for financial services firms.
**Team:** PM + designer + engineer.
**Challenge:** The product has two distinct user types: (1) compliance officers who configure and run reports; (2) C-suite executives who consume the reports. The team is conflating their feedback in the OST, causing the tree to branch incoherently.

---

## The multi-stakeholder problem

In B2B products, the "customer" in JTBD terms is often fragmented:
- The **buyer** (decision-maker, pays the invoice) cares about viability and ROI.
- The **user** (does the work) cares about desirability and usability.
- The **beneficiary** (reads the output) cares about reliability and format.

Running one OST that tries to capture all three roles produces a tree with conflicting opportunity nodes: "reports are too slow to generate" (user) and "reports don't surface the right KPIs" (beneficiary) are different jobs and need separate trees.

---

## Resolution: one OST per distinct job

The team splits into two discovery streams:

**Stream A — Compliance officer (user/doer)**
- Desired outcome: "Compliance officer generates a complete quarterly report in under 2 hours with no manual data fixes."
- OST anchored to the workflow friction, tool integration, and error experience of the person generating the report.

**Stream B — Executive (beneficiary)**
- Desired outcome: "C-suite executives surface material risk signals from compliance reports without a briefing from the compliance team."
- OST anchored to report readability, KPI surfacing, and narrative clarity for non-technical consumers.

Each stream runs its own interview cadence (2 compliance officers/week for Stream A; 1 executive/month — lower frequency because of access constraints for Stream B).

---

## Interview adaptation for executives

Standard JTBD Five-Act runs ~30 min with a hands-on user. For C-suite participants:
- Reduce to 20 min max; respect calendar constraints.
- Act 3 (switch story) focuses on "the last time a compliance issue surprised you" rather than "the last time you used the reporting tool" — executives rarely interact with the tool directly but experience its downstream consequences.
- Outcome: richer data on what "a good report" looks like in terms of narrative structure, risk hierarchy, and decision-relevance — not UI feedback.

---

## What not to do

- **Do not combine both roles in a single OST.** The resulting tree has contradictory opportunity nodes and produces solution ideas that satisfy neither persona.
- **Do not skip executive interviews because "they don't use the product."** The beneficiary job is a real JTBD job. Missing it produces technically correct reports that fail to drive executive decisions — a viability risk.
- **Do not treat the buyer as the only voice.** Buyers choose the product; users churn from it. Both voices are load-bearing in the OST.
