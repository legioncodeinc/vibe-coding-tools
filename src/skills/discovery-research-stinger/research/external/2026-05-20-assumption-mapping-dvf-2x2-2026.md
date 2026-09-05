---
source_url: https://qualz.ai/research-guide/frameworks/assumption-mapping/
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: 5
topic: assumption-mapping
stinger: discovery-research-stinger
---

# Assumption Mapping (Importance x Evidence 2x2) - Qualz.ai Research Guide

**Published:** 2026-04-10 | **Author:** Qualz.ai | **Site:** qualz.ai

## Summary

The clearest 2026 guide to the assumption mapping technique as used in Torres' Continuous Discovery Habits. Covers the four assumption categories (DVFU), the 2x2 matrix axes, the prioritization protocol, and the most common failure modes. Synthesizes Torres (CDH Chapter 11) with Rob Fitzpatrick (The Mom Test) and the broader lean startup validation literature.

**The Four Assumption Categories (DVFU):**
- **Desirability** - Do customers want this? Will they switch from their current solution?
- **Viability** - Can we sustain this as a business? Will it generate revenue? Is it legal?
- **Feasibility** - Can we build it? Do we have the technology and skills?
- **Usability** - Can customers figure out how to use it? Will they complete the key flows?

**The 2x2 Mapping Matrix:**
- Y-axis: **Importance** (bottom = nice to know, top = must be true or idea fails)
- X-axis: **Evidence** (left = no evidence / pure guess, right = strong evidence / validated)
- The "Kill Zone" = high importance, low evidence quadrant = test these first (leap-of-faith assumptions)

**The Protocol:**
1. Brainstorm all assumptions for the solution. Aim for 10-20. Cover all four DVFU categories.
2. Plot each on the 2x2 matrix (do this as a trio, not solo - individual maps reflect one person's blind spots)
3. Focus exclusively on the Kill Zone (high importance, low evidence)
4. For each Kill Zone assumption, design the cheapest, fastest experiment that could provide evidence (interview, data pull, smoke test, prototype, concierge test)
5. Run experiments. Evidence moves assumptions right on the x-axis.

**Experiment types by assumption category (from multiple companion sources):**

| Assumption | Discovery experiment | Validation experiment |
|---|---|---|
| Desirability | Customer interviews, observation | Fake door test, landing page, concierge |
| Viability | Willingness-to-pay interviews, competitor pricing | Pre-orders, letters of intent, pricing experiment |
| Feasibility | Expert consultation, desk research | Technical prototype, PoC, spike |
| Usability | Informal "hallway" testing | Prototype usability test with 5 users per round |

**The four prototype archetypes (from IdeaPlan's Complete Guide to Product Discovery):**
- **Smoke test / Fake door** - add a button for a feature that doesn't exist; measure click rate (1-2 days, near-zero cost)
- **Landing page** - describe and sell the value proposition before building (1 week, $100-500 in ads)
- **Wizard of Oz** - human manually executes what the system would do; user thinks it's automated (1-2 weeks, human labor cost)
- **Concierge MVP** - manually deliver the service value; user knows a human is involved (2-4 weeks, human labor)

**Key failure modes (Qualz.ai):**
- Test what scares you, not what is easy. "Teams naturally gravitate toward assumptions they can test comfortably (feasibility questions for engineers, usability questions for designers)."
- Importance is about the idea, not the company. An assumption is "important" if being wrong means this *specific solution* fails.
- Evidence is a spectrum. An assumption moves from "no evidence" to "some signal" to "strong evidence" over multiple rounds.
- Spending too long on the map itself. "Spend 30 minutes mapping, then go run experiments."

## Key Quotations / Statistics

- "Assumptions in the high importance, low evidence quadrant are your leap-of-faith assumptions. These are the ones that could kill your idea and that you currently know the least about. Test these first."
- "Test what scares you, not what is easy." (Qualz.ai)
- "Spend 30 minutes mapping, then go run experiments. Do not wordsmith assumption statements for hours."
- "Do this as a team. Individual assumption maps reflect one person's blind spots." (Qualz.ai)
- "The most important assumptions are almost always about people - their behavior, their preferences, their willingness to pay - and those are inherently messier to validate." (LeanPivot.ai)
- "A common mistake is using a feasibility test (building a prototype) to validate desirability (do people want this?) - the two questions require different evidence." (IdeaPlan)

## Annotations for stinger-forge

- **Primary source for `guides/05-assumption-mapping.md`:** The DVFU four categories and the 2x2 protocol are the exact content this guide should encode. The "30 minutes mapping then go run experiments" rule prevents perfectionism traps.
- **Primary source for `guides/06-experiment-design.md`:** The four prototype archetypes (fake door, landing page, Wizard of Oz, concierge) with their time/cost profiles are the canonical experiment menu. These match the archetypes listed in the Command Brief exactly.
- **Template implication:** `templates/assumption-map.md` should be a markdown table with columns: Assumption, Category (D/V/F/U), Importance (1-5), Evidence (1-5), Priority (Importance x (5-Evidence)), Experiment type, Success criterion.
- **Contradiction with Command Brief:** Brief mentions "four experiment archetypes (paper mock, Wizard of Oz, concierge, fake door / landing page)" - this source uses the same four but names them slightly differently. Paper mock maps to low-fidelity prototype usability test. Stinger should unify the naming in `guides/06-experiment-design.md`.
- **Sequencing note:** Always run assumption mapping *before* prototype design, never after. The experiment type follows from the assumption type (D=fake door/landing page, V=pricing test, F=spike, U=prototype usability). This sequencing must be explicit in the stinger guides.
