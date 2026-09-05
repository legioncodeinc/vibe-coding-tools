# Documenting architecture decisions (the Nygard format)

- **Title:** Documenting Architecture Decisions
- **URL:** https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
- **Fetched:** 2026-08-17
- **Source type:** primary source (Michael Nygard, the article that defined the ADR format)

## The problem it names

Architectural decisions accumulate without their reasoning. A new person on the project
then faces two bad options: accept a past decision without understanding why it was made,
or reverse it without understanding what it was holding up.

Nygard's warning, quoted: "if the project accumulates too many decisions accepted without
understanding, then the development team becomes afraid to change anything and the project
collapses under its own weight."

## The template, section by section

| Section | What goes in it |
|---|---|
| **Title** | A short noun phrase naming the decision. Example given: "ADR 1: Deployment on Ruby on Rails 3.0.10" |
| **Status** | proposed, accepted, deprecated, or superseded, and when superseded, a reference to the record that replaced it |
| **Context** | The forces at play: technological, political, social, project-local. Written in neutral, factual language that shows the tension between competing concerns rather than arguing for the outcome |
| **Decision** | The response, in full sentences, active voice, phrased as "We will ..." |
| **Consequences** | Everything that follows, positive, negative, and neutral |

## Immutability and supersession

Records are numbered sequentially and numbers are never reused. When a decision is
reversed, the original record is not deleted or edited. It stays in place and is marked
superseded, so the history of the argument survives alongside the current answer.

## Why this matters for a knowledge pack built from meetings

The Context section is the part that is expensive to reconstruct later and cheap to capture
at the time. It is also exactly what a meeting transcript contains and what a summary's
Decisions block does not: the competing concerns that were live in the room. The decision
itself is usually recoverable from any source. The forces are not.
