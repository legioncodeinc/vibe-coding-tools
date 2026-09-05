---
source_url: https://diataxis.fr/start-here/
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: diataxis
stinger: docs-site-stinger
---

# Diátaxis - The Four Kinds of Documentation Framework

## Summary

Diátaxis (by Daniele Procida) is the canonical framework for documentation architecture used by Python, Django, Gatsby, and many major open-source projects. It identifies four fundamentally distinct kinds of documentation, each serving a different user need. The framework uses a two-dimensional map: the vertical axis is action vs. cognition; the horizontal axis is acquisition (learning) vs. application (working). The four kinds: (1) Tutorials - learning-oriented, experiential, "teach me"; (2) How-to guides - goal-oriented, practical, "help me accomplish this"; (3) Reference - information-oriented, accurate/complete/reliable descriptions; (4) Explanation - understanding-oriented, discursive, "why does this work this way?". The framework is explicitly not prescriptive about volume - it's a quality and organization tool.

## Key quotations / statistics

- "The core idea of Diátaxis is that there are fundamentally four identifiable kinds of documentation, that respond to four different needs."
- Four types table: Tutorials ("Can you teach me to...?"), How-to guides ("How do I...?"), Reference ("What is...?"), Explanation ("Why...?")
- "Like a how-to guide, reference serves the user who is at work... it's up to the user to be sufficiently competent to interpret and use it correctly."
- "Explanation joins things together, and helps answer the question why? It needs to circle around its subject, and approach it from different directions."
- Workflow: "1. Consider what you see in the documentation... 2. Ask: is there any way in which it could be improved? 3. Decide on one thing you could do to it right now... 4. Do that thing."
- "A how-to guide is concerned with work - a task or problem, with a practical goal. Maintain focus on that goal."

## Annotations for stinger-forge

- Diátaxis is the theoretical foundation for `guides/01-content-pyramid.md`. The "four kinds" map directly to the nav structure in each platform: reference/ (API reference), how-to/ (guides), tutorial/ (tutorials), explanation/ (conceptual overviews).
- The key anti-pattern Diátaxis prevents is "one big guide" - where tutorial content, reference, and how-to instructions are mixed. Document this anti-pattern explicitly.
- The two-dimensional map (action/cognition x acquisition/application) is useful in the nav structure design section: API reference = information-oriented + application; Tutorials = action-oriented + acquisition.
- For `guides/00-platform-selection.md`: Ask the team which type of content dominates. API-reference-heavy → Fern. Tutorial/guide-heavy → Docusaurus/Starlight/Mintlify.
- Source site: https://diataxis.fr (Daniele Procida, Python core contributor)
