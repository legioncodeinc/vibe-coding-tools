# knowledge-base-builder

Turns a project's calls and threads into the documentation pack that makes every future AI session productive.

## What it does

Your project lives in your head, in a hundred calls, and in threads nobody will open again. That works until you brief a contractor, or until every AI session starts with re-explaining.

It ingests one project's meetings, threads and on-screen artifacts from capture, then writes a markdown pack: product requirements, architecture notes, decision records, a glossary, a brand brief, open questions and a contradiction register.

The contradiction register makes the rest trustworthy. Real projects contain conflicting statements: a number quoted two ways in two calls, an approach agreed and quietly reversed. Research on models handed conflicting passages found a confident single answer instead of the conflict, with a best correct rate of 43.8 percent under a contradiction-aware prompt. So every conflict ships with both readings, both dates, both receipts.

## When to use it

- You are briefing a contractor and dread writing the context document.
- Every AI session on this project opens with twenty minutes of re-explaining.
- Someone asked what you decided about X and when.

Just ask for it. Trigger phrases include "build a knowledge base for PROJECT", "document this project", "write the PRD from my calls", "what did we decide and when" and "make a docs pack I can feed to Claude".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| On demand | Per project | The full pack, through two confirmation gates |
| Routine | Monthly, 1st at 08:00 | Names the stale documents, plus new decisions, terms and conflicts |

Build on demand: every material fact passes a gate, and routines cannot run gates. Add the monthly watch after: it notices the project has moved on. A document stale for three reports is escalated, with a line saying a rebuild beats a patch. The skill sets the watch up itself, showing you the prompt and schedule first.

## What you get

One directory, `knowledge-base/PROJECT-SLUG/`, numbered so files read in order: index, glossary, requirements, architecture, decision records, brand brief, open questions, contradictions. A register entry reads:

```
Numeric conflict, unresolved
A: "annual contract value is 48k"  [Pricing sync, 2026-04-02, Decisions]
B: "ACV came in at 41k"            [Board prep, 2026-06-18, Decisions]
Pack says 41k, the later statement. Flips 02-product-requirements.
```

Sensitive material lands in `SENSITIVE-PROJECT-SLUG.md`, uppercase so it sorts top.

## What it needs

- The Littlebird MCP on a Power or Pro plan.
- Four answers first: what the project is called and has been called, which calls belong to it, who is on it, and what the pack is for. A contractor pack segregates differently.
- Time for the gates. Contradictions come first, since they change other documents.
- A personal voice skill, if the brand brief writes as you.

## Limits worth knowing

It documents what is in capture: recorded meetings, threads, screens. A project living in unrecorded calls gets a report saying so, not a pack.

It omits rather than pads. Where an artifact type has nothing behind it, that document is left out and the omission named in the index. A requirement with no receipt becomes an open question.

Recency wins conflicts by default, never silently. The later statement is what the pack encodes, the earlier stays in the register with its date, and the entry names the files that change if you flip it.

Segregation reduces one category of harm. It does not make the main pack safe to publish, and the skill says so at handover. Nothing is committed or shared.

## Related skills

[sop-forge](../sop-forge/README.md), for procedures a pack names but does not write. [meeting-scribe](../meeting-scribe/README.md), when the unit is one meeting. [commitment-tracker](../commitment-tracker/README.md), for whether commitments were kept. [littlebird-voice-creator](../littlebird-voice-creator/README.md), for the voice the brand brief needs.

## Under the hood

`SKILL.md` carries the seven sweeps, the two gates and the routine prompt verbatim. Guides under `references/`: `project-scoping.md`, `contradiction-register.md`, `sensitive-segregation.md`, `pack-structure-and-formats.md`, `ai-ingestible-structure.md`.

`references/research/` holds 18 archived primary sources on decision records, documentation architecture, knowledge conflict in language models and staleness. Every domain claim traces to one, and six unevidenced choices are labelled as design decisions.
