---
name: knowledge-base-builder
description: "Build my project knowledge base, document this project, write the PRD and
  architecture notes from my calls, make a docs pack for AI, what did we decide and when.
  Ingests one project's meetings, threads, on-screen artifacts and documents from Littlebird
  capture and produces a structured markdown documentation pack: product requirements,
  architecture notes, decision records, a glossary, a brand brief, and a register of every
  contradiction it found, each with both readings and both dates. Use for documenting a
  project that already exists in scattered conversations, not for writing a new spec from
  scratch."
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan)"
---

# knowledge-base-builder

## Purpose

Your projects are documented in your head, in a hundred calls, and in threads nobody will
read again. This skill turns that into a documentation pack that makes every future AI
session productive, which is the actual payoff. A well-built knowledge base means the next
agent does not need the meeting.

It ingests one project's meetings, message threads, on-screen artifacts, and documents from
Littlebird capture, and writes a structured markdown pack: product requirements, architecture
notes, decision records in a recognized format, a glossary, a brand brief where the project
has positioning, an open questions register, and a contradiction register.

**The contradiction register is the part that makes the rest trustworthy.** Real projects
contain conflicting statements over time: a number quoted two ways in two calls, an approach
agreed and silently reversed, figures that do not match across sources. A skill that quietly
picks one produces documentation that is confidently wrong, and the evidence says the model
reading it will not notice. Given two passages containing contradictory facts, all models
tested in the WikiContradict benchmark struggled to produce answers reflecting the conflict,
and under a prompt that explicitly told them to look for contradictions the best correct rate
was 43.8 percent [references/research/distilled-documentation-architecture.md section 5]. So
this skill surfaces every conflict with both readings, both dates, and both receipts, and
asks you to resolve it.

**Mode: on-demand per project**, with an optional monthly refresh routine that watches for
staleness and hands back.

---

## Littlebird MCP calls used

Real tool names, verified 2026-08-17. List the tools available in your session before calling
anything; these are a starting point, not a contract.

| Tool | Used for |
|---|---|
| `LB_INTERNAL_LIST_MEETINGS` | The project's recurring calls, by `name`. Also upcoming events, with a future `end_date`. |
| `LB_INTERNAL_SEARCH_MEETINGS` | The topic sweep across meetings, by `query` |
| `LB_INTERNAL_GET_MEETING` | The structured Decisions, Action Items, and Risks blocks, which are the spine of the pack |
| `LB_INTERNAL_GET_MEETING_TRANSCRIPT` | Verbatim wording for a decision record quote, selectively |
| `search_user_context` with `data_source: snapshots` | On-screen artifacts: designs, schemas, dashboards, docs |
| `search_user_context` with `data_source: messages` | Thread-level decisions that never reached a call |
| `LB_INTERNAL_LIST_ROUTINES` | Check for an existing refresh routine before offering to create one |
| `LB_INTERNAL_GET_ROUTINE_CONFIG` | Read a routine's current prompt before updating it |
| `LB_INTERNAL_GET_ROUTINE_REPORTS` | Read what the refresh routine has already flagged |
| `LB_INTERNAL_CREATE_ROUTINE` | Create the refresh routine, after approval |
| `LB_INTERNAL_UPDATE_ROUTINE` | Change an existing refresh routine |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | Check the plan gate and the routine limit |

A meeting lookup by NAME uses the list tool with `name`. A lookup by TOPIC uses the search
tool with `query`. Using the wrong one is the most common retrieval mistake against this
server (`references/littlebird-mcp-reference.md`, retrieval pattern 6).

---

## Trigger

"Build a knowledge base for PROJECT", "document this project", "write the PRD from my calls",
"what did we decide on PROJECT and when", "make a docs pack I can feed to Claude", "get this
project out of my head", "write architecture notes for PROJECT", "I need to brief a
contractor on PROJECT", "refresh the PROJECT knowledge base".

Not for writing a new specification for something that has not been discussed yet. This skill
documents what exists in capture. With no capture there is nothing to document, and it stops.

---

## Routine cadence

**On demand per project.** The pack is built in an interactive session because every material
fact passes a confirmation gate and a routine cannot run gates.

**Optional monthly refresh routine.** It observes only: it detects that the project has moved
on since the pack was built, names which documents are stale, and hands back to a Cowork
session. Exact prompt text in the routine wiring section below.

---

## Capability gate

This skill requires the **Littlebird MCP on a Power or Pro plan**.

1. **List the tools actually available in this session** and use the real names you find. Do
   not assume the names in `references/littlebird-mcp-reference.md` are still exact. That file
   is verified as of 2026-08-17 and is a starting point.
2. If no Littlebird tools are present, **stop**. Tell the user this skill needs the Littlebird
   MCP connected, and that it cannot build a knowledge base from a description of the project.
3. If the plan gate is in doubt, call `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` before promising a
   pack. Check it again before offering the refresh routine, because routine count is
   plan-limited.

There is no degraded mode. A pack written without capture is fiction, and it is fiction that
will be loaded into every future session about this project.

---

## Do this first, every time

Read these two, in this order, before touching retrieval:

1. `references/evidence-standards.md` for the receipt format, the observed / inferred /
   external / unknown split, the attribution guardrail, and the confirmation gates.
2. `references/littlebird-mcp-reference.md` for tool parameters, return shapes, and the
   limitations to design around.

Then read `references/project-scoping.md` and follow it. The other four guides load at the
stage that needs them.

---

## Process

Seven stages. Stage 4 runs before stage 5, and stage 5 before stage 6, and neither ordering is
negotiable.

| Stage | Guide | Output |
|---|---|---|
| 1. Scope the project | `references/project-scoping.md` part 1 | Confirmed boundary: names, calls, people, window, purpose |
| 2. Sweep | `references/project-scoping.md` part 2 | Raw retrieval across seven sweeps |
| 3. Sort, deduplicate, score | `references/project-scoping.md` part 3 | A time-ordered, deduplicated fact ledger |
| 4. **Contradiction pass** | `references/contradiction-register.md` | The register, with both readings on every conflict |
| 5. **Sensitive segregation** | `references/sensitive-segregation.md` | Three-way sort: main pack, segregated file, dropped |
| 6. Confirm | `references/evidence-standards.md` rule 6, plus the two gates below | Corrected ledger, resolved conflicts, approved segregation |
| 7. Write the pack | `references/pack-structure-and-formats.md` and `references/ai-ingestible-structure.md` | The files |

### Stage 1: scope

Ask four things with `AskUserQuestion`: what the project is called and what else it has been
called, which recurring calls belong to it, who is on it, and what window. Also ask what the
pack is **for**, because a pack for a contractor and a pack for the user's own AI sessions
differ in what gets segregated. Read the boundary back before sweeping.

### Stage 2: sweep

Seven sweeps, specified with their exact queries in `references/project-scoping.md` part 2.
Windowed, narrow, parallel: five specific queries beat one vague query and avoid the
oversized-result file dump (`references/littlebird-mcp-reference.md`, retrieval patterns 1 and
2).

A. Recurring call spine, `LB_INTERNAL_LIST_MEETINGS` with `name`, one call per recurring call.
B. Topic sweep, `LB_INTERNAL_SEARCH_MEETINGS`, six parallel queries including
   `"PROJECT what we agreed to change"`, which is how reversals surface.
C. Structured blocks, `LB_INTERNAL_GET_MEETING` per id. The `## Decisions`,
   `## Action Items`, and `## Risks / Open Questions` blocks are the spine of the decision
   records and the open questions register, and they already carry owner attribution
   (`references/littlebird-mcp-reference.md`, "What a meeting summary already contains").
D. Transcript, `LB_INTERNAL_GET_MEETING_TRANSCRIPT`, only for decisions you intend to record,
   only for wording and reasoning, never to establish who said something.
E. On-screen artifacts, `search_user_context` with `data_source: snapshots`, month by month,
   six queries covering designs, schemas, diagrams, dashboards, specs, roadmaps. **Snapshots
   are the primary source for the data model.**
F. Thread decisions, `search_user_context` with `data_source: messages`, six queries. This is
   where the decisions that never reached a call live.
G. Vocabulary, targeted queries per candidate term, across both sources.

### Stage 3: sort, deduplicate, score

Sort by event time, because retrieval is relevance-ordered
(`references/evidence-standards.md` rule 8). Deduplicate, because OCR of dense UI produces
repeated lines and repetition is not corroboration
(`references/littlebird-mcp-reference.md`, known limitations). Read the relevance scores;
anything scored 3 is a maybe (retrieval pattern 5).

Build the fact ledger described in `references/contradiction-register.md`, with a separate
Value column. A conflict between two sentences is hard to see. A conflict between two values in
one column is trivial to see.

### Stage 4: the contradiction pass

A named stage with its own retrieval, its own file, and its own gate. Full procedure in
`references/contradiction-register.md`. Six kinds to sweep for: numeric, reversal,
definitional, scope, attribution, temporal. Then the reversal sweep, which searches forward
from each recorded decision for evidence the project is doing something else, because a
reversal has only one recorded statement and the other side is an absence.

**Recency wins by default and never silently.** The later statement is the working answer and
is what the pack encodes. The earlier one is retained in the register with its date and its
receipt, and the entry says which was used and why. Where the earlier statement is High
confidence and the later one is Low, recency does not win automatically; that goes to the user
unresolved.

This mirrors how decision records already handle a reversal: the old record is not edited or
deleted, it is marked superseded with the replacement's number so the chain is traversable
forward [references/research/distilled-documentation-architecture.md section 2]. Extending
that model to non-decision facts is this skill's own design decision and no source in the
archive does it [references/research/distilled-documentation-architecture.md section 9].

### Stage 5: sensitive segregation

Before any file is written, not as a review at the end. Full procedure in
`references/sensitive-segregation.md`. Five categories: financial, equity and ownership,
legal, personnel, third-party confidential. Three-way sort: main pack, segregated file, or
dropped. Four detection sweeps, including the screen-share sweep, which is the one that
surfaces another company's numbers sitting in the user's capture.

### Stage 6: confirm before you encode

Two gates, both with `AskUserQuestion`, in this order.

**Gate A, the contradiction resolution gate.** One question per conflict, both readings shown
with their dates and receipts, three options every time: reading A, reading B, or both are
wrong. Never present a default as pre-selected. "I do not know" is a legitimate answer and the
entry stays unresolved. This gate runs first because the answers change what the other
documents say.

**Gate B, the encoding gate.** Anything written down as durable fact about a person, a
company, a commitment, or a number gets confirmed first (`references/evidence-standards.md`
rule 6). Batch by document rather than asking about every line. Confirm: every Low and Medium
confidence fact, every inferred line, every glossary definition, every non-goal, the data
model coverage claim, and the segregation assignments.

A knowledge base is durable and will be fed to future agents, so an unconfirmed fact in it
propagates into work the user never watches happen. That is why this gate is heavier here than
in a skill that produces a one-off report.

### Stage 7: write

`references/pack-structure-and-formats.md` for what each file contains and which decision
record format to use. `references/ai-ingestible-structure.md` for the writing rules and for
which of them are actually evidenced.

Then delete the working ledger and the raw retrieval. Raw capture never ships
(`references/evidence-standards.md` rule 7).

---

## Output

One directory, `knowledge-base/PROJECT-SLUG/`, written to the working directory.

| File | Contents |
|---|---|
| `00-index.md` | What the project is, a table of every file with a one-line description, the provenance block, the omissions list, counts of open questions and unresolved contradictions and segregated items, and the confirmation record |
| `01-glossary.md` | One entry per project term, alphabetical: canonical form, observed variants, one-sentence definition, first use with receipt, confidence |
| `02-product-requirements.md` | Problem and outcome, users and use cases, goals, non-goals, functional requirements, acceptance criteria in Given / When / Then form, non-functional requirements, dependencies, open questions, sources. Split per feature as `02-prd-FEATURE-SLUG.md` where the project has more than about three |
| `03-architecture.md` | System overview as one relationship per line, plus the data model as far as capture supports, with coverage marked as fully observed, partial, or named only |
| `04-decisions/NNNN-kebab-case-title.md` | One record per decision, format chosen by what the capture supports: MADR where options were argued, Nygard where forces are visible, Y-statement where only the tradeoff is. Plus `index.md` listing number, title, status, date |
| `05-brand-brief.md` | The five positioning components in order, with empty components marked empty rather than filled in. Only where the project has positioning material |
| `06-open-questions.md` | Table: question, why it matters, source, date raised, status |
| `07-contradictions.md` | One entry per conflict: kind, status, reading A and reading B each with value, date, receipt, quote and confidence, what the pack currently says, and which files change if the resolution flips. Ships even when empty |
| `SENSITIVE-PROJECT-SLUG.md` | Segregated items with category, fact, why it was kept, receipt, confidence. Uppercase prefix so it sorts to the top and cannot be missed. Only where segregated material exists |

Omit a document rather than pad it, and record every omission in the index. A pack with four
documents and a stated absence beats six documents where two are speculation.

---

## Evidence standards

Apply `references/evidence-standards.md` in full. The five that bite hardest here:

- **Every material fact carries a receipt** (rule 1). Meeting form
  `[Meeting name, 2026-08-03, Decisions]`. Message form carries both the collection time and
  the send time, because they are different values and both matter.
- **Observed, inferred, external, and unknown are visibly different** (rule 2). In this pack:
  observed lines carry a receipt, inferred lines begin with "Inferred:" and name what they
  rest on, external lines carry a URL, and unknown items go to the open questions file rather
  than becoming a hedged sentence in place.
- **Attribution guardrail** (rule 4). Capture shows what was on screen, not what the user
  wrote, and raw transcript chunks are weakly diarized and frequently tagged `[Others]`. Take
  who-decided from the meeting summary's `## Decisions` block. Quote transcript for wording
  only.
- **Partial rosters are reported as partial** (rule 5). This generalizes here to the data
  model: a partially captured schema presented as complete is the same defect. Mark coverage.
- **Confirm before you encode** (rule 6). Heavier here than elsewhere, because the artifact is
  durable and gets fed to future agents.

The rule this skill adds: **a requirement without a receipt is not a requirement, it is an
open question.** The same goes for a data model field, a non-goal, and a positioning claim.

---

## Empty retrieval

| Situation | Action |
|---|---|
| No Littlebird tools in session | Stop at the capability gate. |
| No recorded meetings for any named recurring call | Report it. Those calls may be unrecorded calendar entries, which carry no id, no summary, and no transcript. Ask whether the project lives in threads and screens instead. If so run sweeps E and F only and state in the pack that the meeting spine is absent. |
| Meetings empty, snapshots and messages productive | Buildable, with no attributed decision records. Say so before writing. A decision taken from a snapshot alone is an inference and is marked as one. |
| Fewer than roughly 3 recorded meetings and roughly 20 distinct snapshots after dedup | Too thin for a pack. Report what was found, name it a fragment, and offer a single project-context note instead of six documents. Do not pad. |
| One artifact type has nothing | Omit that document and name the omission in the index. An empty architecture note is worse than a stated absence. |
| Everything scored 3 | Report low confidence across the pack and widen gate B to cover material you would otherwise have passed. |

A failed or empty retrieval ends the run (`references/evidence-standards.md` rule 9). A skill
that reports "I found nothing for this window" is doing its job correctly.

---

## Routine wiring: the monthly staleness watch

The on-demand run is the primary mode. The routine is a cheap observer that notices the
project has moved on and hands back. It cannot rebuild the pack, because rebuilding requires
the two confirmation gates and a routine cannot run gates
(`references/littlebird-mcp-reference.md`, "Do not ask a routine to do work it cannot finish
unattended in one pass").

**Offer to create it.** Routines can be created from an interactive session; only a running
routine is blocked from creating them (`references/littlebird-mcp-reference.md`, Routine
tools). Show the user the exact prompt text and schedule below, get approval with
`AskUserQuestion`, then call `LB_INTERNAL_CREATE_ROUTINE`. Do not tell the user to go set it up
by hand.

Call `LB_INTERNAL_LIST_ROUTINES` first. If a watch already exists for this project, do not
create a second one. Call `LB_INTERNAL_GET_ROUTINE_CONFIG` and offer an update instead,
remembering that `prompt` and `schedule` each replace the whole field.

**Title:** `Knowledge base staleness watch: PROJECT NAME`

**Schedule:** `{"frequency": "monthly", "month_day": 1, "time": "08:00"}`

Monthly is this skill's convention and is not a measured optimum. The nearest anchor in the
research is the quarterly architecture review of a decision record collection
[references/research/distilled-documentation-architecture.md section 9]. Monthly is chosen
because a small project moves faster than an enterprise architecture, and the user can change
it.

**Notifications:** push on. Email if the user wants a copy.

**Prompt text, verbatim:**

```
You are a monthly staleness watch for a project knowledge base. Your job is to notice that
the project has moved on since the knowledge base was written, and to name which documents
are now stale. You do not rewrite anything, you do not resolve anything, and you do not draft
any document. You observe and you report.

The project is: PROJECT NAME
Its recurring calls are: LIST THE CALL NAMES
The knowledge base was last built on: YYYY-MM-DD
The documents in it are: 00-index, 01-glossary, 02-product-requirements, 03-architecture,
04-decisions, 05-brand-brief, 06-open-questions, 07-contradictions

FIRST, before searching, call LB_INTERNAL_GET_ROUTINE_REPORTS for this routine with limit 6
and read your own previous reports. You need them to tell a new signal from one you have
already flagged, and to escalate correctly. Do not skip this step.

Then run four retrievals, each windowed to the period since your last report, or since the
knowledge base build date if this is your first run.

RETRIEVAL 1. Call LB_INTERNAL_LIST_MEETINGS with the name of each recurring call listed
above, and a start date at the beginning of your window. Count how many project meetings
happened. A meeting lookup by name uses the list tool with name. Do not use the search tool
for this.

RETRIEVAL 2. Call LB_INTERNAL_SEARCH_MEETINGS with a start date at the beginning of your
window, once per query, for these queries with the project name substituted in:
"PROJECT decision on approach", "PROJECT what we agreed to change", "PROJECT requirements and
scope", "PROJECT architecture and data model". For each meeting that comes back, call
LB_INTERNAL_GET_MEETING and read its Decisions block and its Risks and Open Questions block.
Those two blocks are the signal. Do not pull transcripts.

RETRIEVAL 3. Search the user's captured context with data_source set to snapshots, windowed
to the period, using several narrow queries rather than one broad one: "PROJECT design mockup
or wireframe", "PROJECT database schema or table structure", "PROJECT architecture diagram",
"PROJECT specification document". You are looking for artifacts that did not exist when the
knowledge base was built.

RETRIEVAL 4. Search the user's captured context with data_source set to messages, windowed to
the period, for: "PROJECT changed my mind about", "PROJECT let us go with this approach",
"PROJECT we are cutting", "PROJECT what do we call this". Thread decisions are the ones the
knowledge base is most likely to have missed.

Write a report with exactly these five sections.

STALE DOCUMENTS
For each of the eight knowledge base documents, one line: the document name, and either
"current" or "stale" with the reason in under fifteen words and the receipt in the form
[Weekday, Month D, YYYY HH:MM TZ | app] or [Meeting name, YYYY-MM-DD, Decisions]. Rank the
stale ones first. The strongest staleness signal is a decision or artifact that exists now and
was never written down at all, so weight new material above changed material.

NEW DECISIONS
Every decision found in a Decisions block inside your window, with who decided, the date, and
the receipt. If a decision appears to reverse something the knowledge base records, say so
plainly and put it first in this section. Do not resolve it. Do not decide which is correct.
Say that both readings exist and that resolving it needs a Cowork session.

NEW TERMS
Any project-specific word, acronym, or product name that appears in your window's material.
List the term and one receipt each. Do not define them, you do not have enough context to
define them correctly. The glossary is built with the user, not by you.

POSSIBLE CONTRADICTIONS
Anything in your window that disagrees with anything else in your window, or that disagrees
with something you flagged in a previous report. Give both values, both dates, and both
receipts. Give no opinion on which is right. If you find none, write "none detected in this
window" rather than leaving the section out.

WHAT TO DO
One line naming the Cowork skill and the scope. Use exactly this shape: "Open Cowork and run
knowledge-base-builder for PROJECT NAME, scoped to WINDOW, to refresh: LIST THE STALE
DOCUMENTS." If nothing is stale, write "No refresh needed this month" and stop.

ESCALATION RULE, apply this every run. Compare against the previous reports you read at the
start.
- A document you have now flagged stale in two consecutive reports moves to the top of STALE
  DOCUMENTS and is marked REPEAT, with the number of months it has been stale.
- A document stale for three or more consecutive reports is marked ESCALATED, and the WHAT TO
  DO line changes to say the knowledge base is drifting out of date and a full rebuild is
  probably cheaper than a patch.
- A possible contradiction that has appeared in two reports without being resolved is marked
  UNRESOLVED FOR N MONTHS and moves to the top of its section.
- Do not repeat an item in identical wording across reports. If nothing about it has changed,
  say so in one line and give the month count, rather than restating the full entry.

Never write a document, never draft a requirement, never define a term, and never resolve a
contradiction. Every one of those needs the user's confirmation, and you cannot ask for it.
```

The handoff is the Routines-observe, Cowork-acts pattern
(`references/littlebird-mcp-reference.md`). The routine watches and names the condition. The
user opens Cowork, this skill reads the routine's own past reports through
`LB_INTERNAL_GET_ROUTINE_REPORTS`, and rebuilds the flagged documents with the gates in place.

**When this skill runs against a project that has a watch**, call `LB_INTERNAL_LIST_ROUTINES`
and then `LB_INTERNAL_GET_ROUTINE_REPORTS` with `limit` 6 at stage 1, before sweeping. Items
the routine already flagged start at the top of the ledger, and any contradiction it flagged
goes straight into stage 4.

---

## Guardrail

The specific risk this skill carries is **propagation**. Other skills in this marketplace
produce a report a human reads once. This one produces a durable artifact whose entire purpose
is to be loaded into future AI sessions as ground truth. A wrong fact in a one-off report gets
noticed or forgotten. A wrong fact in a knowledge base gets applied, repeatedly, by agents that
have no way to check it and no reason to doubt it.

Three specific failure shapes follow, and the countermeasures are structural rather than
advisory:

1. **A silently resolved contradiction.** The evidence is that models handed conflicting
   material produce a confident single answer rather than flagging the conflict, and that an
   unresolved conflict degrades performance on surrounding work without any signal that it has
   [references/research/distilled-documentation-architecture.md section 5]. Countermeasure:
   stage 4 is a named stage with its own file and its own gate, and the register ships even
   when empty.
2. **An inference that hardened into a fact.** A field described on a call becomes a schema
   entry, a preference becomes a requirement, a passing remark becomes a non-goal. Once it is
   in the pack, nothing downstream can tell it apart from an observation. Countermeasure: the
   marking rules in `references/evidence-standards.md` rule 2, gate B before writing, and the
   rule that a requirement without a receipt is an open question.
3. **Sensitive material handed to a contractor.** The pack exists to be given away, so its
   default trajectory is outward, and a project's capture contains equity, runway, rates,
   personnel assessments, and other companies' screens. Countermeasure:
   `references/sensitive-segregation.md`, run at stage 5 before any file is written.

Segregation reduces one obvious category of harm. It does not make the main pack safe to
publish. Say that to the user at handover, once, plainly.

**Draft never send.** This skill writes files to the user's working directory and stops. It
does not publish a pack, commit it, upload it to a documentation site, share it, or write it
into any third-party system. If a connector for such a system exists in the session, list the
available tools, then show the user the exact final content and get approval through
`AskUserQuestion` before anything leaves the machine. Approving the plan is not approving the
words.

**Voice.** The brand brief may contain phrasing written as the user. Check whether a personal
voice skill is installed in this session and use it if present. If none is installed, say so
plainly and point at this marketplace's voice creator skills. Never invent a voice profile.

---

## Ship Gate

Ship Gate removed, research-only skill, produces no committable code.

---

## Related skills

| Skill | Relationship |
|---|---|
| `sop-forge` | Documents a procedure the user performed, from screen capture. This skill documents a project's decisions and requirements. A pack often names procedures that `sop-forge` should then write. |
| `meeting-scribe` | Works one meeting. This skill works the whole project across many meetings and synthesizes across them. |
| `commitment-tracker` | Tracks whether commitments were kept. This skill records what was decided. The Action Items block feeds both. |
| `routine-architect` | Designs and audits Littlebird routines. Use it if the staleness watch needs tuning beyond what this skill offers. |
| `said-it-already` | Finds where the user previously said something. Useful when resolving a contradiction by hand. |
| The voice creator skills | Build the personal voice skill the brand brief section composes with. |

---

## Reference map

| File | Load it when |
|---|---|
| `references/project-scoping.md` | Always, at stage 1. The four scoping questions, the seven sweeps with exact queries, the sort and dedup pass, the empty-retrieval table. |
| `references/contradiction-register.md` | Always, at stage 4. Six conflict kinds, the fact ledger, the reversal sweep, the register format, the resolution gate. |
| `references/sensitive-segregation.md` | Always, at stage 5, before any file is written. Five categories, three-way sort, four detection sweeps, the segregated file format. |
| `references/pack-structure-and-formats.md` | Stage 7. What each file contains, decision record format selection, supersession, the positioning components. |
| `references/ai-ingestible-structure.md` | Stage 7, alongside the above. The writing rules, tiered by how much evidence stands behind each one. |
| `references/evidence-standards.md` | Always, first. |
| `references/littlebird-mcp-reference.md` | Always, first. |
| `references/research/distilled-documentation-architecture.md` | When you need the citation behind a rule, or want to check whether a claim is evidenced at all. |
| `references/research/README.md` | Source inventory, the one source conflict, and the archive's named gaps. |

Six of this skill's design decisions are **not** evidenced by the research archive and are
labelled as design decisions rather than researched practice: choosing the decision record
format by how much the capture supports, extending the supersession model to non-decision
facts, the sensitive segregation scheme, the one-fact-per-line rule, the pack's file set and
naming, and the monthly refresh cadence. See
`references/research/distilled-documentation-architecture.md` section 9.
