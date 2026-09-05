# Documenting architecture decisions

- **Title:** Documenting Architecture Decisions
- **Author:** Michael Nygard
- **URL:** https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
- **Fetched:** 2026-08-17
- **Published:** 2011-11-15
- **Source type:** practitioner primary source. This is the origin post for the
  Architecture Decision Record format, cited by essentially every later ADR write-up.

## Note on window

Far outside the six month window. Retained because it is the primary source for a format
still in active use, and because every 2026 article on decision records restates it. Going
to the origin beats quoting a restatement.

## The problem it names

Quoted: "One of the hardest things to track during the life of a project is the motivation
behind certain decisions."

Nygard's argument: a newcomer facing an undocumented decision either accepts it without
understanding it or changes it without understanding the consequences. The end state is
that teams become "afraid to change anything and the project collapses under its own
weight."

## The template

Five sections:

| Section | Content |
|---|---|
| Title | Short noun phrase, numbered |
| Context | The forces at play, described in "value-neutral" language |
| Decision | The response, in active voice, starting "We will" |
| Status | proposed, accepted, deprecated, or superseded |
| Consequences | All resulting impacts, positive and negative |

## Immutability and supersession

Quoted: when a decision changes, "we will keep the old one around, but mark it as
superseded."

The point is that the record preserves both facts: a decision WAS made, and it is no
longer current. Deleting the old entry destroys the second fact.

## On document size

Quoted: "Nobody ever reads large documents, either. Those documents are too large to open,
read, or update. Bite sized pieces are easier for all stakeholders to consume."

## Domain limitation

This is about software architecture decisions recorded by the team that made them. It is
not about business decisions reached verbally in a meeting with an external party. The
transfer is by analogy: the format is portable, the setting is not identical.

## Direct implication for the skill

Three transferable rules. A decision entry records the context that produced it, not just
the outcome. Status is an explicit field with a supersession value rather than an implied
current state. And entries stay short enough that someone actually opens them, which
argues against dumping a full summary into a decision log.
