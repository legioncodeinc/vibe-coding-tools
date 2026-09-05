---
name: discovery-research-stinger
description: Continuous product discovery coach — Teresa Torres interview cadence, Opportunity Solution Trees, Jobs-to-be-Done interviews, prototype testing, and the "build less, learn more" loop. Use when the user says "run a discovery session", "build an OST", "write an interview script", "map our assumptions", "design a prototype experiment", "weekly discovery summary", or when a team is unsure what to build next and needs to run discovery before planning. Do NOT use for shipped-feature usability testing (quality-worker-bee), UI design decisions (ux-ui-worker-bee), PRD authorship (library-worker-bee), or analytics result interpretation.
license: MIT
---

# discovery-research Stinger

Procedural arsenal for `discovery-research-worker-bee`, the Legion Army's continuous-discovery coach. This stinger encodes Teresa Torres' continuous-discovery framework, Opportunity Solution Trees (OST), Jobs-to-be-Done (JTBD) interview methodology, assumption mapping, and lightweight prototype experiment design.

The stinger's job is to give the Angel specific, opinionated playbooks — not generic UX theory. Every guide cites primary research. Every template is ready to fill in. Every example shows a real output shape.

---

## When this stinger applies

Load this stinger when `discovery-research-worker-bee` is invoked. Typical triggers:

- "Help me figure out what to build next."
- "Create an opportunity solution tree for [product/team]."
- "Write a user interview script for [opportunity]."
- "Map the assumptions behind [solution]."
- "Design an experiment to test [assumption]."
- "We need to do customer discovery before writing the PRD."
- "Run continuous discovery for [desired outcome]."

Do NOT load for:
- Usability testing of shipped features → `quality-worker-bee`.
- Authoring a PRD or feature spec → `library-worker-bee`.
- UI/UX design decisions → `ux-ui-worker-bee`.
- Analytics or experiment result interpretation → inline or future analytics Angel.

---

## First action when this stinger is loaded

Read these in order before doing anything else:

1. **`guides/00-principles.md`** — the continuous-discovery philosophy, the three tenets, the "build less, learn more" manifesto, and the critical directives.
2. **`guides/01-desired-outcome.md`** — how to scope a desired outcome before any other work begins.
3. **`guides/02-opportunity-solution-tree.md`** — OST node taxonomy, snapshot rules, common failure modes.

Then load domain-specific guides as the session requires:
- `guides/03-interview-cadence.md` — when to run interviews and how to recruit.
- `guides/04-jtbd-interview.md` — the Five-Act interview structure.
- `guides/05-assumption-mapping.md` — DVFU 2×2 and Kill Zone protocol.
- `guides/06-experiment-design.md` — prototype archetypes and success criteria.

---

## Procedure (how the Angel uses this stinger)

### 1. Anchor to a desired outcome
If no outcome is stated, run the outcome-scoping interview from `guides/01-desired-outcome.md`. Nothing else starts until a single measurable outcome is defined.

### 2. Build or update the OST
Read or create `library/discovery/opportunity-solution-tree.md` using the structure from `guides/02-opportunity-solution-tree.md` and `templates/opportunity-solution-tree.md`.

### 3. Generate an interview script
For a target opportunity node, produce a JTBD-style script using `guides/04-jtbd-interview.md` and `templates/interview-script.md`. Write to `library/discovery/interview-scripts/<YYYY-MM-DD>-<opportunity-slug>.md`.

### 4. Map assumptions
For a chosen solution, run the DVFU 2×2 protocol from `guides/05-assumption-mapping.md` using `templates/assumption-map.md`. Write to `library/discovery/assumption-maps/<solution-slug>.md`.

### 5. Design an experiment
For the highest-risk assumption, design the smallest invalidating experiment using `guides/06-experiment-design.md` and `templates/experiment-plan.md`. Write to `library/discovery/experiments/<YYYY-MM-DD>-<experiment-slug>.md`.

### 6. Summarize for stakeholders (optional)
On demand, produce a one-page weekly discovery summary using `templates/weekly-summary.md`.

---

## Critical directives

- **Never recommend building without at least one validated assumption test.** Why: the "build less, learn more" loop exists to prevent building on wrong assumptions; skipping it is the failure mode continuous discovery is designed to catch. (Source: `research/external/2026-05-20-torres-2026-roadmap-ai-discovery.md`)
- **Always anchor work to a single desired outcome.** Why: OSTs without a defined outcome become wish lists. (Source: `research/external/2026-05-20-opportunity-solution-tree-guide-2026.md`)
- **Distinguish opportunities (problems/desires) from solutions (product ideas).** Why: conflating the two is the most common discovery anti-pattern. (Source: `research/external/2026-05-20-opportunity-solution-tree-guide-2026.md`)
- **Use Torres' weekly cadence as the default structure.** Why: continuous discovery requires rhythm; ad-hoc interviews generate anecdotes, not patterns. (Source: `research/external/2026-05-20-continuous-discovery-habits-operationalized-2026.md`)
- **Ask "what's the story?" before coding any interview insight.** Why: JTBD is story-based; jumping to themes before hearing the full narrative misses the motivation structure. (Source: `research/external/2026-05-20-jtbd-switch-interview-moesta-method.md`)
- **Do not produce a PRD or implementation plan.** Why: that is `library-worker-bee`'s job; hand off a validated opportunity + winning solution, not a spec.

---

## Folder layout

```
discovery-research-stinger/
+- SKILL.md                          (this file)
+- README.md                         (one-page human overview)
+- guides/
|  +- 00-principles.md               (philosophy, three tenets, critical directives)
|  +- 01-desired-outcome.md          (outcome scoping, three-part test)
|  +- 02-opportunity-solution-tree.md (OST taxonomy, snapshot protocol, failure modes)
|  +- 03-interview-cadence.md        (weekly cadence, recruiting, structure)
|  +- 04-jtbd-interview.md           (Five-Act structure, forces diagram)
|  +- 05-assumption-mapping.md       (DVFU 2x2, Kill Zone protocol)
|  +- 06-experiment-design.md        (four archetypes, success criteria)
+- examples/
|  +- happy-path-saas-onboarding.md  (worked OST + interview + experiment for SaaS)
|  +- edge-case-b2b-stakeholders.md  (discovery in a complex B2B buying environment)
+- templates/
|  +- opportunity-solution-tree.md   (OST skeleton)
|  +- interview-script.md            (Five-Act script scaffold)
|  +- assumption-map.md              (DVFU 2x2 table)
|  +- experiment-plan.md             (experiment brief skeleton)
|  +- weekly-summary.md              (stakeholder summary one-pager)
+- reports/
|  +- README.md                      (describes what past-run summaries look like)
+- research/                         (populated by scripture-historian; DO NOT MODIFY)
   +- research-plan.md
   +- research-summary.md
   +- index.md
   +- internal/
   +- external/
```

---

## Refresh cadence

- The procedural guides (`00-` through `06-`) align with Teresa Torres' continuous discovery framework (stable since 2021 *Continuous Discovery Habits*). Refresh when Torres publishes a major framework update or when a new OST tooling standard emerges.
- The research folder covers the Nov 2025 - May 2026 window. Re-run `scripture-historian` at `normal` tier if a significant new source (e.g., a new Torres book/course, a major JTBD update from Moesta) emerges.
- Templates are stable; no cadence refresh expected.

---

*Command Brief: [`ai-tools/command-briefs/discovery-research-worker-bee-command-brief.md`](../../command-briefs/discovery-research-worker-bee-command-brief.md)*
*Part of the Legion Army forged by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
