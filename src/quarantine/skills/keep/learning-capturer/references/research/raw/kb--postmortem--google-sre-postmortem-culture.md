# Postmortem Culture: Learning from Failure (Google SRE Book, chapter 15)

- **URL:** https://sre.google/sre-book/postmortem-culture/
- **Fetched:** 2026-08-17
- **Source type:** official-docs (Google Site Reliability Engineering book, published by
  the practice owner)
- **Why archived:** The canonical statement of incident-note practice. Supplies three
  things a personal knowledge base needs: a written trigger definition, the separation of
  root cause from impact, and the rule that an unreviewed record is worthless.

## Required elements of a postmortem

- Written record of the incident and its impact
- Actions taken to mitigate or resolve it
- Root cause or causes
- Follow-up actions to prevent recurrence

Note the structural separation: impact, actions taken, and root cause are three distinct
fields, not one narrative.

## Triggers

Criteria that initiate a postmortem:

- User-visible downtime or degradation past a threshold
- Any data loss
- On-call engineer intervention, for example a rollback or traffic rerouting
- Resolution time above an established threshold
- A monitoring failure, meaning the incident was found by hand

Quoted: "It is important to define postmortem criteria before an incident occurs so that
everyone knows when a postmortem is necessary."

## The blameless principle

A blameless postmortem "must focus on identifying the contributing causes of the incident
without indicting any individual or team for bad or inappropriate behavior."

The stance assumes everyone involved "had good intentions and did the right thing with the
information they had." Where blame culture prevails, "people will not bring issues to light
for fear of punishment."

## Good versus poor postmortems

| Poor | Good |
|---|---|
| Vents frustration, points at individuals or teams, stigmatizes participants | Identifies systematic weakness, fixes processes and systems, calls out improvements without attacking people |

## Review, storage, searchability

- Quoted: "An unreviewed postmortem might as well never have existed."
- Establish regular review sessions with senior engineers assessing completeness, root
  cause depth, and whether the action plan is appropriate.
- Postmortems go into team repositories and are shared broadly to maximize organizational
  learning.
- Google runs automated tooling for trend analysis across many postmortems, meaning
  recurrence across records is treated as its own signal.
