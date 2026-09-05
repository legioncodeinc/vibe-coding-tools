# What separates a useful PRD from a wish list

- **Title:** How to Write a Good Product Requirements Document (PRD): A Tactical, Modern Guide
- **URL:** https://www.uladshauchenka.com/p/how-to-write-a-good-product-requirements
- **Fetched:** 2026-08-17
- **Source type:** community (practitioner newsletter, references ISO/IEC 25010 for the
  non-functional checklist)

## The anatomy it proposes, 14 sections

Overview and Context, Goals and Success Metrics, Users and Use Cases, Scope, Functional
Requirements, Acceptance Criteria, Non-Functional Requirements, Design and UX, Analytics and
Telemetry, Dependencies and Constraints, Risks and Assumptions, Rollout and Ops, Open
Questions, Changelog.

## The core diagnosis

Quoted: "Most costly rework doesn't come from buggy code - it comes from unclear intent."

The named failure shape: a PRD that is a wish list or a spec dump, written without the
foundational clarity about who it is for and what outcome it moves.

## Three practices it says separate good from bad

1. **Lead with outcomes.** Quoted: "Your PRD should begin with the user problem and the
   business outcome, not with interface details or database fields."
2. **Write testable acceptance criteria** in Given / When / Then form. Vague criteria are
   named as a specific pitfall.
3. **Enumerate non-functional requirements explicitly**, using ISO/IEC 25010 as a checklist
   rather than remembering them ad hoc. Omitting them is called "a recipe for rework."

## On specificity

The source rule is to prefer specific thresholds over adjectives. Its good example is a p95
response time stated as a millisecond figure; its bad example is the word "fast". The original
renders the threshold with a less-than sign, written out in words here to keep this archive
free of angle brackets.

This is the single most transferable rule for a capture-sourced PRD, because it is also a
test of whether the source material actually supports the requirement. If the capture never
contained a number, the requirement cannot be written with one, and that absence is a real
finding rather than a gap to fill with an adjective.

## Evidence quality

Practitioner opinion, structured and internally consistent, with one external standard
referenced (ISO/IEC 25010). No measurement of PRD quality against outcomes is offered, and
none should be inferred from it.

## Note on non-goals

This source does not use the term "non-goals". It carries the same idea under **Scope**,
which it splits into what is in and what is out. The explicit "Non-Goals" heading is a
convention from engineering design-doc practice rather than from this source, and is
labelled as a house convention in this skill rather than as a researched finding.
