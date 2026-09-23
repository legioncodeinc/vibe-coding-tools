# Pack structure and document formats

What ships, what each file contains, and which format each one uses. Load this at stage 5,
after the contradiction pass and after the confirmation gate, not before.

Domain claims here trace through `research/distilled-documentation-architecture.md` to a file
in `research/raw/`.

---

## The pack

One directory, `knowledge-base/PROJECT-SLUG/`, where the slug is kebab-case and derived from
the project name the user confirmed at scoping.

```
knowledge-base/PROJECT-SLUG/
  00-index.md
  01-glossary.md
  02-product-requirements.md          (or 02-prd-FEATURE-SLUG.md, one per feature)
  03-architecture.md
  04-decisions/
    0001-kebab-case-title.md
    0002-kebab-case-title.md
    index.md
  05-brand-brief.md                   (only where the project has positioning material)
  06-open-questions.md
  07-contradictions.md
  SENSITIVE-PROJECT-SLUG.md           (only where segregated material exists; see sensitive-segregation.md)
```

Numeric prefixes are deliberate. They give a stable sort in every file listing and every tree
view, so the index order and the disk order agree.

**Omit rather than pad.** A pack with four documents and a stated absence of the other two is
better than six documents where two are speculation. Record every omission in `00-index.md`.

---

## 00-index.md

The first thing a future agent reads, and often the only thing it reads before deciding what
else to load. Agents are advised to hold lightweight identifiers and load data at runtime
rather than preloading everything
[research/distilled-documentation-architecture.md section 4], which is only possible if the
index tells them what each file contains.

Required content:

1. Project name and any prior names.
2. One paragraph: what this project is, in plain language, with no jargon that is not defined
   in the glossary.
3. A table of every file in the pack, with a one-line description of what is in it and when it
   was last built.
4. The provenance block: window swept, number of meetings read, number of snapshots and
   message items after deduplication, and the date the pack was generated.
5. The omissions list: which standard documents are absent and why.
6. Counts: open questions, unresolved contradictions, sensitive items segregated.
7. The confirmation record: date confirmed, and what the user corrected.

The curated-list-with-descriptions shape is the transferable part of the llms.txt proposal,
which argues from context window cost and extraction noise but presents no measurement that a
model answers better when given one [research/distilled-documentation-architecture.md
section 4]. Adopt the shape, do not claim the benefit.

---

## 01-glossary.md

The highest-value file in the pack for AI ingestion, and the reason is mechanical rather than
stylistic: a project's private vocabulary was never in any model's training data, so it either
gets defined or gets guessed. A term appearing in several casing or punctuation variants also
fragments retrieval, because documents about one concept stop looking related
[research/distilled-documentation-architecture.md section 4].

One entry per term. Format:

```
### TERM

**Canonical form:** the spelling and casing this pack uses everywhere
**Also written as:** every variant observed in capture
**Definition:** one sentence, no jargon that is not itself defined in this file
**First used:** date and receipt
**Confidence:** High | Medium | Low
```

Rules:

- **Alphabetical order**, not order of importance. A reader looking up a term does not know
  its importance.
- **Expand every acronym on its first appearance in the entry**, then use the acronym.
- **No circular definitions.** If term A's definition uses term B and term B's uses term A,
  one of them is wrong and both go to the open questions register.
- **A term used two ways is not one entry.** It is a contradiction register item and the
  glossary entry says the term is contested and points at the register.
- Include terms that are ordinary English used in a project-specific way. These are more
  dangerous than invented words, because a model will confidently apply the ordinary meaning.

---

## 02-product-requirements.md

Structure, adapted from the 14-section anatomy in
[research/distilled-documentation-architecture.md section 3], reduced to what capture can
actually support:

```
# PRD: FEATURE OR PRODUCT NAME

## Problem and outcome
## Users and use cases
## Goals
## Non-goals
## Functional requirements
## Acceptance criteria
## Non-functional requirements
## Dependencies and constraints
## Open questions
## Sources
```

Rules that carry the weight:

- **Lead with the outcome, not the interface.** The source rule: a PRD should begin with the
  user problem and the business outcome, not with interface details or database fields
  [research/distilled-documentation-architecture.md section 3].
- **Acceptance criteria in Given / When / Then form.** Vague criteria are a named pitfall
  [research/distilled-documentation-architecture.md section 3].
- **Specific thresholds over adjectives.** The source rule prefers a stated p95 latency figure
  over the word "fast" [research/distilled-documentation-architecture.md section 3]. Applied
  here this rule does double duty: it is also a test of the source material. If the capture
  never contained a number, do not invent one. Write the requirement without it and add the
  missing threshold to open questions. That inversion is this skill's reading of the rule, not
  the source's [research/distilled-documentation-architecture.md section 3].
- **Non-goals.** No source in the archive establishes this heading as researched practice; the
  archive supports stating what is out of scope and the heading is a house convention
  [research/distilled-documentation-architecture.md sections 3 and 8]. Keep it anyway, and
  populate it only from things the user actually ruled out, with receipts. An invented non-goal
  is worse than none, because a future agent will treat it as a boundary.
- **A requirement without a receipt is not a requirement.** It is an open question.

Split into one file per feature when the project has more than roughly three distinct
features. `02-prd-FEATURE-SLUG.md`.

---

## 03-architecture.md

Two sections, and the second one is usually thinner than the first.

**System overview.** What the pieces are and how they relate. Written as short declarative
statements, one relationship per line. Name the specific versions the project actually uses
rather than a vague reference, which is one of the two items from the agents.md corpus
observation with a clear mechanism behind it
[research/distilled-documentation-architecture.md section 4].

**Data model.** Entities, fields, and relationships, as far as capture supports. Snapshots of
a schema, a table list, or a type definition are the strongest evidence available. A verbal
description of a table on a call is weaker and is marked so.

Format for the data model:

```
### ENTITY

**Purpose:** one sentence
**Fields:** one per line, name, type, and whether observed or described
**Relationships:** one per line, in the form "ENTITY has many OTHER"
**Evidence:** receipt, and whether from a schema snapshot or from discussion
```

Mark the coverage explicitly at the top of the data model section: which entities are fully
observed, which are partial, and which are named but not detailed. A partially captured data
model presented as complete is the architecture equivalent of a partial roster
(`evidence-standards.md` rule 5).

---

## 04-decisions/

One file per decision, in `NNNN-kebab-case-title.md` form, numbered monotonically, numbers
never reused even for a deprecated record
[research/distilled-documentation-architecture.md section 2]. Plus `index.md` listing every
record by number, title, status, and date, because without an index the directory is a wall of
filenames nobody can navigate [research/distilled-documentation-architecture.md section 2].

### Choosing the format by what the capture supports

No source in the archive ranks the decision-record formats or gives a selection rule
[research/distilled-documentation-architecture.md sections 2 and 8]. The rule below is this
skill's design decision, stated as one.

| What the capture contains | Format | Sections |
|---|---|---|
| Options were argued, with tradeoffs | **MADR** | Context and Problem Statement, Decision Drivers, Considered Options, Decision Outcome, Consequences, plus frontmatter for status, date, decision-makers, consulted, informed [research/distilled-documentation-architecture.md section 2] |
| A decision with visible forces but no enumerated alternatives | **Nygard** | Title, Status, Context, Decision, Consequences [research/distilled-documentation-architecture.md section 2] |
| A decision announced, with a stated tradeoff and little else | **Y-statement** | One sentence: in the context of USE CASE, facing CONCERN, we decided for OPTION to achieve QUALITY, accepting DOWNSIDE [research/distilled-documentation-architecture.md section 2] |
| A decision with no visible reasoning at all | not a record | It goes in the index as a bare dated fact, or into open questions if it matters |

Do not pad a thin capture up into a full MADR record. Four sections inferred from nothing is
the advocacy-document anti-pattern with extra steps
[research/distilled-documentation-architecture.md section 2].

### Section rules from the primary source

- **Context** carries the forces at play, technological, political, social, project-local, in
  neutral factual language that shows the tension rather than arguing for the outcome
  [research/distilled-documentation-architecture.md section 2]. This is the part that is
  expensive to reconstruct later and it is exactly what a transcript contains, so this is
  where a verbatim quote earns its place.
- **Decision** in full sentences, active voice, phrased "We will ..."
  [research/distilled-documentation-architecture.md section 2].
- **Consequences** lists everything that follows, positive, negative, and neutral
  [research/distilled-documentation-architecture.md section 2].

### Status and supersession

Four statuses: Proposed, Accepted, Deprecated, Superseded by NNNN
[research/distilled-documentation-architecture.md section 2]. Proposed is the only mutable
state; Accepted is immutable
[research/distilled-documentation-architecture.md section 2].

**When a project reverses a decision, do not edit the old record.** Write a new one and set the
old record's status to Superseded by the new number, so the chain is traversable forward
[research/distilled-documentation-architecture.md section 2]. This is the native mechanism for
"the answer changed and here is what it was before", and it is why the recency-wins rule in
this skill has an audit trail rather than a deletion.

### What earns a record

The granularity rule from the archive: decisions that are hard to reverse, that span multiple
components, or that materially affect operability or security. A formatter choice is not a
record; a datastore choice is [research/distilled-documentation-architecture.md section 2].
The opposite failure is also named: only cosmic decisions recorded, with the load-bearing
middle layer missing [research/distilled-documentation-architecture.md section 2].

For a project pack, read that as: record the decisions a future agent would otherwise reverse
by accident.

### Every record carries its receipt

Source meeting or thread, date, and the block it came from. Take attribution from the meeting
summary's `## Decisions` block, never from raw transcript, because transcript chunks are weakly
diarized (`littlebird-mcp-reference.md`, known limitations). Quote transcript for wording only.

Receipt format per `evidence-standards.md` rule 1, meeting form:
`[Meeting name, 2026-08-03, Decisions]`.

---

## 05-brand-brief.md

Only where the project has positioning material. Five components, worked in this order,
because each derives from the one before it and a category chosen first will not survive
contact with the alternatives [research/distilled-documentation-architecture.md section 7]:

1. **Competitive alternatives.** What the customer would do if this did not exist. Watch for
   the named pitfall of defining these too broadly and including phantom competitors the
   customer never actually considers [research/distilled-documentation-architecture.md
   section 7]. In capture, alternatives surface as offhand remarks about who a prospect is
   comparing against, so these come from sales calls more often than from strategy calls
   [research/distilled-documentation-architecture.md section 7].
2. **Key unique attributes.** What this has that the alternatives lack.
3. **Value.** What those attributes let the buyer do.
4. **Target customer characteristics.** Who cares most about that value.
5. **Market category.** The context that makes the value obvious.

Leave a component **empty and marked empty** where capture does not support it. That is the
framework's own advantage for reconstructed material: it produces an empty cell rather than a
vague paragraph [research/distilled-documentation-architecture.md section 7].

Add a sixth section, **Voice and phrasing**, only if the user has a personal voice skill
installed in the session. Use it. If none is installed, say so plainly and point at this
marketplace's voice creator skills. Never invent a voice profile.

---

## 06-open-questions.md

Everything the pack could not resolve. Sourced primarily from the `## Risks / Open Questions`
block of the meeting summaries (`littlebird-mcp-reference.md`), plus every gap the writing pass
surfaced.

One row per question:

| Question | Why it matters | Where it came from | Raised | Status |
|---|---|---|---|---|

Status is one of: open, answered in a later source, or superseded by a decision record.

This file and `07-contradictions.md` are different things and must not be merged. An open
question is something nobody has answered. A contradiction is something answered twice,
differently.

---

## 07-contradictions.md

See `contradiction-register.md` for the full format and the detection procedure. It ships even
when empty, with the line stating that no conflicts were detected in the window swept, because
an absent register reads as "no conflicts" and a present empty one reads as "we looked".

---

## Mode discipline across the pack

Diataxis derives four documentation modes and its central claim is that blurring the
boundaries between them is at the heart of a large share of documentation problems
[research/distilled-documentation-architecture.md section 1]. The framework is written for
user-facing product documentation and does not claim to cover a project knowledge pack
[research/distilled-documentation-architecture.md section 1]. What transfers is the boundary
rule, applied as:

| File | Mode | Consequence |
|---|---|---|
| Glossary, architecture, PRD | reference | Facts. No narrative, no rationale, no history. |
| Decision records, brand brief | explanation | Rationale and context. No instructions. |
| Open questions, contradictions | working artifact | Not documentation. Marked as such at the top of each file. |

The most common breach in a capture-sourced pack: putting the history of an argument into the
architecture notes. The architecture note states what the system is. The reason it is that way
is a decision record.
