# The contradiction register

Stage 4. A named stage with its own retrieval pass, its own output file, and its own
confirmation gate. Not a footnote in the writing stage.

---

## Why this is a stage and not a footnote

Three findings, all from peer-reviewed measurement in the archive.

**A model handed conflicting material usually produces a confident single answer rather than
flagging the conflict.** WikiContradict, NeurIPS 2024: given two passages containing
contradictory facts, all tested models struggled to produce answers that reflected the
conflicting nature of the context [research/distilled-documentation-architecture.md
section 5].

**Explicit instruction to look for conflicts helps substantially, so detection has to be a
named step.** Llama-3-70b-instruct rose from 10.4 percent to 43.8 percent correct once the
prompt told it to attend to contradictions
[research/distilled-documentation-architecture.md section 5].

**Even when instructed, the best measured rate was under 50 percent.** Under the
contradiction-aware prompt: Llama-3-70b-instruct 43.8 percent, Mistral-7b-instruct 20.8
percent, GPT-4 10.4 percent [research/distilled-documentation-architecture.md section 5]. So
detection cannot be left to the same pass that writes the document, and resolution needs a
human.

And the reason an unresolved conflict is not merely a local gap: in the context-memory
conflict study, Mistral-7B scored 65.3 percent under no contradiction against 43.5 percent
under a low-plausibility contradiction, a drop of 21.8 percentage points, and the model did not
signal that it was degraded [research/distilled-documentation-architecture.md section 5]. That
study is a preprint on 7B-class models, so the absolute numbers do not transfer to frontier
models; the direction is the durable part
[research/distilled-documentation-architecture.md section 5].

A pack containing an unresolved contradiction therefore does not just fail on the contradicted
question. It quietly degrades the surrounding work of every future session that loads it.

Every model except one did worse on implicit contradictions, where the conflict has to be
inferred, than on explicit ones [research/distilled-documentation-architecture.md section 5].
Implicit conflicts are the majority of what a real project produces, because nobody says "this
contradicts what I said in March". They say a different number.

---

## What counts as a contradiction

Six kinds. Sweep for all six explicitly; a general instruction to look for conflicts finds
mostly the first kind.

| Kind | Shape | Example of how it appears |
|---|---|---|
| **Numeric** | The same quantity stated as two values | A figure quoted one way on a call in March and another way in a thread in June |
| **Reversal** | An approach agreed and later silently changed | A decision block records one approach; three months later the work described assumes another, with no decision recorded in between |
| **Definitional** | A term used with two meanings | Two people use the same word for different things and neither notices |
| **Scope** | Something is both in and out | A feature listed as committed in one place and as explicitly out of scope in another |
| **Attribution** | Who owns or decided something differs | An action item assigned to one person in a summary and referred to as someone else's in a thread |
| **Temporal** | A date or sequence stated two ways | A launch date, an order of operations, a start date |

Numeric and scope conflicts are the ones users notice. Definitional conflicts are the ones that
do the most damage in AI ingestion, because both readings look correct in isolation and nothing
in the text signals a problem.

---

## The detection pass

Run this after the sweeps in `project-scoping.md` and before writing anything. It has three
parts, and the third one is the one that finds the reversals.

### Part 1: build the fact ledger

Every material fact you intend to encode gets a ledger row before it gets a sentence in a
document. Minimum fields:

| Field | Content |
|---|---|
| Fact id | Sequential |
| Subject | The thing the fact is about, using the canonical glossary term |
| Claim | One sentence, atomic |
| Value | The number, name, date, or state, isolated so it can be compared |
| Event date | When it was said, not when it was captured |
| Receipt | Per `evidence-standards.md` rule 1 |
| Kind | observed, inferred, external, unknown |
| Confidence | High, Medium, Low |

The Value column is load-bearing. A conflict between two sentences is hard to see. A conflict
between two values in the same column is trivial to see.

### Part 2: group and compare

Group ledger rows by Subject. Within each group, compare Values pairwise. Anything that differs
is a candidate.

Then filter out the non-conflicts, which are numerous:

- **Legitimate change over time.** A figure that grew is not a contradiction, it is a series.
  It becomes a contradiction only when both values are stated as current.
- **Different scopes.** Two numbers describing different things that share a name. This is a
  definitional problem, and it goes to the glossary, not the register, unless both readings are
  actually used interchangeably.
- **Rounding and approximation.** One speaker rounding is not a conflict. Two speakers giving
  incompatible precise figures is.
- **OCR fragments.** Deduplicate first and check whether the differing value is a truncated
  render (`littlebird-mcp-reference.md`, known limitations). Do not raise a conflict on a single
  Low-confidence OCR fragment against a High-confidence transcript quote. Note it and move on.

### Part 3: the reversal sweep

The pairwise comparison catches numeric and scope conflicts. It does not catch a reversal,
because a reversal usually has only one recorded statement and the other side is an absence.

For every decision record you intend to write, run a forward check:

1. Take the decision and its date.
2. Search the window **after** that date for evidence that the project is doing something else.
   Use the `search_user_context` snapshot queries from `project-scoping.md` sweep E, narrowed to
   the subject of the decision, plus the meeting topic query `"PROJECT what we agreed to
   change"` from sweep B.
3. Where later evidence conflicts with the recorded decision and no intervening decision
   explains it, that is a silent reversal. It goes in the register, not in the decision record.

This is where the most valuable register entries come from, and it is the part a general
conflict instruction never reaches.

---

## Recency wins by default, but never silently

The rule:

- The **later** statement is the working answer and is what the pack encodes.
- The **earlier** statement is retained in the register with its date and its receipt.
- The register entry says which one the pack used and why.
- Where the earlier statement is High confidence and the later one is Low, recency does **not**
  win automatically. Flag it as unresolved and take it to the user with both readings.

The audit trail is not an invention. It is how decision records already work: a reversed
decision is not edited or deleted, the old record stays and is marked superseded with the
replacement's number, so the chain is traversable forward
[research/distilled-documentation-architecture.md section 2]. This skill extends that model to
non-decision facts, which no source in the archive does
[research/distilled-documentation-architecture.md section 9].

---

## The register format

`07-contradictions.md`. One entry per conflict, in this shape:

```
## C-001: SUBJECT, one line naming what disagrees

**Kind:** numeric | reversal | definitional | scope | attribution | temporal
**Status:** unresolved | resolved by user | resolved by recency | not a conflict

### Reading A
**Value:** the figure, name, date, or state
**Stated:** event date
**Receipt:** [Meeting name, 2026-03-14, Decisions]
**Quote:** verbatim, short
**Confidence:** High | Medium | Low

### Reading B
**Value:**
**Stated:** event date
**Receipt:** [collected Sunday, June 14, 2026 13:57 EDT | whatsapp | Thread name] (sent Jun 8, 6:30 PM)
**Quote:**
**Confidence:**

### What the pack currently says
Which reading was encoded, in which file, and on what basis.

### What resolving this changes
Which documents change if the user picks the other reading. Name the files.
```

Both readings get equal weight in the layout. Do not lead with the one you prefer, do not
summarize the losing one more briefly, and do not add a paragraph arguing for one. A register
entry that argues is an advocacy document, which is a named anti-pattern in decision record
practice [research/distilled-documentation-architecture.md section 2].

**The register ships even when empty**, carrying a line stating that no conflicts were detected
in the window swept, with the window named. An absent register reads as "there are no
conflicts". A present empty one reads as "we looked, and here is where we looked".

---

## The resolution gate

Take the register to the user with `AskUserQuestion` before writing the final pack. This is a
separate gate from the general confirmation gate in `evidence-standards.md` rule 6, and it runs
first, because the answers change what the other documents say.

Rules for the gate:

- **One question per conflict.** Batch them into as few `AskUserQuestion` calls as the tool
  allows, but never merge two conflicts into one question.
- **Show both readings with their dates and receipts.** Not a summary of them. The dates are
  what the user reasons from.
- **Offer three options every time:** reading A, reading B, or "both are wrong, here is the
  real answer".
- **Never present a default as pre-selected.** State that recency would pick B, then let them
  choose. The recency rule is a tiebreak for the machine, not a recommendation to the human.
- **Accept "I do not know".** That is a legitimate answer and a real finding. The entry stays
  unresolved, the pack encodes the recency answer, and both files say so.

Record what the user chose, and the date they chose it, in the register entry. A resolution
without a date is a fact with no provenance, which is the thing this whole skill exists to
avoid.

---

## After resolution

1. Update the register entry status and record the user's answer with its date.
2. Update every document the resolution touches. The "What resolving this changes" field named
   them, so this is a checklist, not a search.
3. Where the resolution reverses a recorded decision, do not edit the decision record. Write a
   new one and mark the old one Superseded by the new number
   [research/distilled-documentation-architecture.md section 2].
4. Where the conflict was definitional, update the glossary entry and remove the contested
   marker.
5. Update the counts in `00-index.md`.

Unresolved entries stay in the register and stay counted in the index. A pack that ships with
three named unresolved conflicts is more useful than one that ships with three hidden ones,
and it is the only version a future agent can reason about honestly.
