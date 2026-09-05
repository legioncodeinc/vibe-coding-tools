# MADR: the Markdown Architectural Decision Record template

- **Title:** MADR (Markdown Any Decision Records)
- **URL:** https://adr.github.io/madr/
- **Fetched:** 2026-08-17
- **Source type:** official-docs (the template's own site, under the adr.github.io org)

## Full template sections

1. **Context and Problem Statement**
2. **Decision Drivers** (optional)
3. **Considered Options**
4. **Decision Outcome**, which announces the chosen option and justifies it
5. **Consequences** (optional), split positive and negative
6. **Confirmation** (optional), how compliance with the decision will be checked
7. **Pros and Cons of the Options** (optional)
8. **More Information** (optional): evidence, team agreements, links

Version 4.0 added "bare" and "minimal" variants alongside the standard one, so a small
decision does not have to carry the full eight sections.

## YAML frontmatter fields

All optional: `status`, `date` (when the decision was last updated), `decision-makers`,
`consulted` (subject matter experts consulted in a two-way exchange), `informed`
(stakeholders kept up to date one way).

The `consulted` and `informed` fields are the part of MADR that Nygard has no equivalent
for, and they map directly onto a meeting attendee list.

## Version history

| Version | Released |
|---|---|
| 3.0.0 | 2022-10-09 |
| 4.0.0-beta | 2024-09-02 |
| 4.0.0 | 2024-09-17 |

## Stated design goal

Make a decision as easy as possible to record and to version. The project explicitly
broadens scope past architecture: any important decision should be captured in a
structured way, which is why the acronym expanded from "Architectural" to "Any".

## Choosing between MADR and Nygard

The source does not rank them. The observable difference: MADR carries Considered Options
and Pros and Cons as first-class sections, so it preserves the alternatives that were
rejected. Nygard folds all of that into Context.
