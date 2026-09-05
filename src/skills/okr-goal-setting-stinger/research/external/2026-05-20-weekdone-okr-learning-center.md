---
source_url: https://weekdone.com/resources/objectives-key-results/
retrieved_on: 2026-05-20
source_type: official-docs
authority: high
relevance: high
topic: okr-tools
stinger: okr-goal-setting-stinger
---

# Weekdone OKR Learning Center: Methodology-First Tool Documentation

## Summary

Weekdone (https://weekdone.com/resources/objectives-key-results/) provides one of the most comprehensive free OKR methodology resources available, built around their OKR-specific software product. Unlike Lattice and 15Five, which position OKRs within a broader performance management context, Weekdone is focused exclusively on the OKR framework. Their learning center covers the full OKR lifecycle with a practitioner's rigor that aligns closely with the Doerr/Grove canon.

Weekdone's product architecture is explicitly designed for OKR methodology purity: the system enforces 3-5 Key Results per Objective as a default, supports the 0.0-1.0 grading scale natively with traffic-light visualization (red < 0.3, yellow 0.3-0.7, green > 0.7), and provides OKR health reports showing the distribution of on-track vs. at-risk vs. off-track Key Results across the organization. The check-in workflow in Weekdone is separate from performance review workflows, reducing the risk of accidental compensation linkage.

Weekdone's learning center categorizes OKR anti-patterns into five types: (1) Activities as KRs ("complete the migration"), (2) Milestones as Objectives ("launch version 3.0"), (3) Too many OKRs (more than 5 OKRs per team per quarter), (4) Isolated OKRs (no visibility across teams), and (5) Static OKRs (no mid-quarter updates). This taxonomy is among the most practically useful in the research and should inform the stinger's audit checklist.

The Weekdone platform's specific configuration for OKR practitioners: Objective fields include Title, Owner, Quarter/Cycle, Description, and Alignment (link to parent company OKR); Key Result fields include Title, Metric Type (Number, Percentage, Currency, Binary), Baseline Value, Target Value, Current Value, Owner, and Check-in frequency. The check-in workflow generates a weekly email reminder to KR owners to update current values and add a confidence comment.

## Key quotations / statistics

- Weekdone: "The most common OKR failure mode is the Activity Key Result. If you can 'complete' your KR without measuring whether anything improved, it's an activity, not a Key Result."
- Weekdone research: organizations with 5+ OKRs per team per quarter report 34% lower OKR completion rates than organizations with 3 or fewer.
- Weekdone on the traffic-light scale: "0.0-0.3 is a fail. 0.4-0.6 is progress but not success. 0.7-1.0 is success. The temptation to call 0.6 a success should be resisted unless you're grading committed OKRs differently."
- Weekdone on transparency: "OKRs work because everyone can see everyone else's goals. If your OKRs are private or department-siloed, you're not doing OKRs - you're doing MBOs."
- Weekdone on Objectives: "An Objective should make your team slightly uncomfortable. If writing it doesn't create any tension, it's probably not ambitious enough."

## Annotations for stinger-forge

- The five anti-pattern taxonomy from Weekdone (activities as KRs, milestones as objectives, too many OKRs, isolated OKRs, static OKRs) is the clearest categorization in the research and should be the backbone of the "are these actually OKRs?" audit checklist in `guides/01-okr-canon.md`.
- The transparency principle (all OKRs visible = OKRs; private/siloed = MBOs) is an important test for the audit report template.
- The "5+ OKRs per team = 34% lower completion" statistic is the empirical support for the "too many OKRs" failure mode in `guides/06-small-team-adaptation.md`.
- The Weekdone field mapping (Metric Type, Baseline Value, Target Value, Current Value) is the canonical field schema to reference in `guides/07-tools.md` and the `templates/okr-draft.md`.
- Weekdone's learning center URL should be cited in `guides/01-okr-canon.md` as a free reference alongside Google re:Work.
