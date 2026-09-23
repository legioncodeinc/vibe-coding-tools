# Pattern signatures

Five signatures of repeated manual work, each with the actual retrieval that finds it, what
counts as one recurrence, and what the signature cannot see.

Read this before running anything. Detection is the whole problem in this skill, and a
signature you run without understanding will produce a proposal you cannot defend.

---

## The honest framing, before any of it

The field this belongs to is robotic process mining, defined as techniques to analyze data
collected during the execution of user-driven tasks in order to support the identification
and assessment of candidate routines for automation
[references/research/distilled-automation-opportunity-identification.md section 1]. Its
published pipeline has seven stages, and stages 1 to 5 are the ones this skill attempts:
recording, noise filtering, segmentation, simplification, and candidate routine
identification [same section].

**Every detection source in the archive assumes an input this skill does not have.** They
assume a UI event log: ordered actions, each with a type, a UI element identifier, and
parameter values [distilled section 3]. Littlebird supplies periodic screen snapshots with
OCR text, message threads, and activity summaries. Snapshots are sampled, not exhaustive.
There are no click events, no element identifiers, no case identifiers, and no guaranteed
ordering below the sampling interval.

Segmentation without explicit case identifiers is named as an open research challenge even
when the input **is** a proper event log, and it is harder still across multiple applications
and when tasks execute in batches [distilled section 4]. Nothing in the archive measures what
happens when you drop to snapshots [distilled section 12, gap 2].

Three consequences that govern everything below.

1. **Observed recurrence counts are a lower bound, always.** A run of the task that fell
   between snapshots did not happen as far as this skill is concerned. Report counts as "at
   least N", never as "N times".
2. **The detector fragments long routines.** One deviation in the middle of an otherwise
   identical sequence causes a detector to see two short patterns instead of one real one
   [distilled section 4]. Human work is full of deviations. Expect to find pieces of things
   and to have to reassemble them by hand.
3. **A signature is a hypothesis, not a finding.** Every candidate gets confirmed with the
   user before it is ranked as real. That is `references/evidence-standards.md` rule 6, and
   it is doing more work here than in most skills because the underlying inference is weaker.

---

## Signature 1. The recurring application or screen sequence

**What it looks like.** The same ordered set of applications or screens appearing inside a
bounded window, on separate occasions. Application switching is a first-class automation
indicator in commercial task mining [distilled section 2].

**What counts as one recurrence.** All three must hold:

- The same two or more applications appear, in the same rough order.
- Inside a single working window, meaning one calendar day at the coarsest and a two-hour
  block where the capture supports it.
- On a separate calendar day from the other recurrences. Two runs of the same task inside one
  afternoon is a batch, and a batch is one occurrence of a batched task, not two occurrences
  of the task. Batched execution is called out explicitly as a segmentation problem in the
  literature [distilled section 4].

**Retrieval.**

Step 1, cheap pass over activity summaries. Summaries are the cheapest compressed view of a
day (`references/littlebird-mcp-reference.md`, retrieval pattern 3).

```
search_user_context
  filters: {"data_source": "summaries"}
  date_range: {"start": "{90 days ago}", "end": "now"}
  search_queries: [
    "repeated the same setup work in a tool",
    "moved information from one application to another",
    "rebuilt a report or document",
    "did the same weekly or monthly task",
    "manual data entry across systems"
  ]
  standalone_query: "Which work did this person perform more than once over this window,
    in substantially the same way each time"
```

Step 2, for each candidate day the summaries surface, an app-filtered snapshot sweep. One
call per application, not one broad call: parallel narrow beats one broad
(`references/littlebird-mcp-reference.md`, retrieval pattern 1).

```
search_user_context
  filters: {"app": "{the app}", "data_source": "snapshots"}
  date_range: {"start": "{that day}", "end": "{that day}"}
  search_queries: [
    "{app} screen showing the task in progress",
    "{app} form fields and entered values",
    "{app} navigation headers and page titles",
    "{app} save publish export or confirm action"
  ]
```

Step 3, absence check. `filters.app` is how absence is proven
(`references/littlebird-mcp-reference.md`, retrieval pattern 4). If an application only
appears on three days in ninety, that is a bounded frequency, and it is evidence.

**What this signature cannot see.**

- Order below the sampling interval. If two applications appear in the same hour you know
  they co-occurred, not which came first.
- Whether the two occurrences were actually the same task. Similar screens are not the same
  work, and this is the signature with the highest false-positive rate. Confirm every
  candidate.
- Anything done in an application that produces visually identical screens for different
  tasks. A spreadsheet looks like a spreadsheet.

**Confidence ceiling: Medium.** Never High on this signature alone. It needs corroboration
from another signature or from user confirmation.

---

## Signature 2. The repeated ask

**What it looks like.** The user asking an assistant, a colleague, or a tool for the same
kind of output again, in their own words. Phrasings like "same as last time", "do that thing
again", "like the one you did for X", "the usual format".

**This is the strongest single signal available and it is worth saying why.** Every other
signature infers repetition from behaviour. This one is the user stating it. It is the only
signature where the recurrence claim does not depend on the detector's segmentation being
right, which is the weakest link in every other signature [distilled section 4].

**And it is entirely unevidenced.** No source in the archive treats a natural-language repeat
request as a detection signal [distilled section 12, gap 3]. This is a design decision, not a
researched method. Say so if the user asks where it came from.

**Retrieval.** Scoped to message threads, because that is where request language lives.

```
search_user_context
  search_queries_messages: [
    "same as last time",
    "do that thing again like before",
    "can you redo the one you made",
    "the usual format",
    "same as the one for the other client",
    "another one of these",
    "like you did last month"
  ]
  filters: {"data_source": "messages"}
  date_range: {"start": "{180 days ago}", "end": "now"}
  standalone_query: "Occasions where this person asked for a repeat of an output they had
    already received before"
```

Run a second pass with `search_queries` unscoped, because the same phrasing appears in
screen capture of assistant interfaces that are not indexed as message threads:

```
search_user_context
  search_queries: [
    "prompt asking for the same output as a previous time",
    "chat asking to repeat a previous task",
    "request referencing a document made earlier"
  ]
  filters: {"data_source": "snapshots"}
  date_range: {"start": "{180 days ago}", "end": "now"}
```

**The attribution gate on this signature is mandatory and it is easy to get wrong.**
Captured content shows what the user was viewing, not necessarily what they wrote
(`references/evidence-standards.md` rule 4). "Same as last time" appearing in a thread is
worthless until you know who said it. A message tagged as from the user is theirs. A message
in a thread the user was reading is not. Message items carry a send timestamp different from
the collection timestamp and both matter
(`references/littlebird-mcp-reference.md`, `search_user_context`).

If you cannot establish the user was the asker, the item is not a recurrence. Drop it. Do not
average it in.

**What this signature cannot see.** Anything the user repeated without ever saying it was a
repeat, which is most of it. This signature has high precision and low recall, which is the
correct trade for a suggester [see `references/threshold-and-ranking.md`].

**Confidence ceiling: High**, where attribution is established and the same requested output
type appears across separate dates.

---

## Signature 3. Manual data movement

**What it looks like.** Information copied by hand out of one system and into another. Copy
and paste operations are captured as a first-class metric by commercial task mining, and
manual data entry across systems is one of its four named indicators [distilled section 2].
The academic literature calls this class of pattern a data transfer routine.

**Why it is the highest-value signature when it fires.** It matches the formal definition of
an automatable routine most closely: the value of each parameter can be computed from the
values of parameters of previous actions [distilled section 3]. A copy from field A into
field B is exactly a derivable parameter. It also hits two practitioner criteria at once,
disparate systems and prone to error [distilled section 5].

**Retrieval.** This one needs a two-stage approach because the signal is a value appearing in
two places.

Stage 1, find the adjacency. Two applications appearing in an interleaved pattern inside a
short window:

```
search_user_context
  filters: {"data_source": "snapshots"}
  date_range: {"start": "{90 days ago}", "end": "now"}
  search_queries: [
    "spreadsheet open next to a web form",
    "copying values into a form field",
    "pasting into a record or ticket",
    "typing details read from another screen",
    "exporting a list then importing it somewhere else"
  ]
```

Stage 2, prove the transfer. Take a distinctive literal string from the source screen, an
invoice number, a company name, an amount, and search for it directly:

```
search_user_context
  search_queries: ["{the literal value}"]
  date_range: {"start": "{that day}", "end": "{that day}"}
```

If the same literal appears in snapshots of both applications within the window, that is an
observed transfer with a receipt on both ends. That is the strongest evidence this skill can
produce for any signature.

**What this signature cannot see.** Littlebird does not record clipboard events. Matching
literals across adjacent snapshots is a proxy for a copy, and a good one, but it is an
inference and it is labelled as one (`references/evidence-standards.md` rule 2). A value
present in both places could also have been typed independently, or arrived through an
integration the user did not perform.

**The redaction obligation is heaviest here.** Stage 2 works by searching for real values,
which means the working data contains real customer records, invoice numbers and amounts. Do
not carry a single literal value into the proposal. Describe the transfer by field type, not
by content: "customer name, email and order total, moved from the order confirmation into the
CRM contact record". Raw capture never ships (`references/evidence-standards.md` rule 7).

**Confidence ceiling: High**, where a literal match on both ends is observed. Medium where
only the application adjacency is observed.

---

## Signature 4. The rebuilt artifact

**What it looks like.** A document, deck, spreadsheet or report produced repeatedly from
scratch, with the same shape each time. The tell is the shape, not the topic: the same
section headings, the same column set, the same slide order.

**What counts as one recurrence.** A distinct artifact, produced on a separate occasion, with
at least three matching structural elements, that started from something other than a copy of
the previous one.

**That last clause is what makes this signature useful and it is the part most likely to be
skipped.** If the user duplicates last month's file and edits it, the work is already
templated and the remaining effort is the judgment, not the structure. The residual is what
you would be leaving them with [distilled section 8.1]. Check for it before proposing
anything: look for a snapshot of the previous artifact being opened, duplicated, or used as a
starting point.

**Retrieval.**

```
search_user_context
  filters: {"data_source": "snapshots"}
  date_range: {"start": "{180 days ago}", "end": "now"}
  search_queries: [
    "{artifact type} document with headings",
    "{artifact type} being written or assembled",
    "blank document or new file being started",
    "duplicating or copying a previous file",
    "template gallery or new from template"
  ]
```

Queries 4 and 5 are the ones that settle whether this is a real candidate. Do not skip them
to save a call.

Then a structure sweep, once you know the artifact type, to establish that the shape repeats:

```
search_user_context
  filters: {"data_source": "snapshots"}
  search_queries: [
    "{heading one from the artifact}",
    "{heading two from the artifact}",
    "{the distinctive column or section name}"
  ]
  date_range: {"start": "{180 days ago}", "end": "now"}
```

**What this signature cannot see.** How much of the artifact was reasoning and how much was
assembly. A monthly report with identical headings can be five minutes of formatting or three
hours of analysis, and the snapshots look similar either way. This is the signature most
likely to produce a proposal that automates the wrong half.

**Confidence ceiling: Medium** on the recurrence, and explicitly **Low** on any claim about
where the effort went inside it, unless the user says.

---

## Signature 5. The re-answered question

**What it looks like.** The same question, answered by the user, for different people.

**Retrieval.** Two sources, because this shows up in messages and in meetings.

```
search_user_context
  search_queries_messages: [
    "{the recurring question topic}",
    "explaining how {the thing} works",
    "answering a question about {the thing}"
  ]
  filters: {"data_source": "messages"}
  date_range: {"start": "{180 days ago}", "end": "now"}
```

Meeting lookup by TOPIC uses the search-meetings tool with `query`. Lookup by NAME uses the
list-meetings tool with `name`. Using the wrong one is the most common retrieval mistake
against this server (`references/littlebird-mcp-reference.md`, retrieval pattern 6). For this
signature it is topic, so:

```
LB_INTERNAL_SEARCH_MEETINGS
  query: "{the recurring question or explanation}"
  start_date: "{180 days ago}"
  end_date: "{today}"
```

**What counts as one recurrence.** The same substantive question, from a **different**
counterparty, on a separate date. Same person asking twice is a follow-up, not a pattern.
Count distinct counterparties, and report that count, because it is the number that matters:
two people is a coincidence, six people is a documentation gap.

**The dominant outcome of this signature is not a skill.** A repeatedly answered question is
usually a document problem. Route it to `sop-forge` or to an FAQ before proposing anything
new. Say so in the proposal. See `references/dedupe-against-existing-skills.md` and
`references/when-not-to-automate.md` reason 6.

**Anonymize before writing.** This signature is built entirely out of other people asking the
user things. Every counterparty gets a role label, not a name, before the proposal exists.
Pseudonymization before analysis is the industry default for this data class, not a courtesy
[distilled section 10]. Rules in `references/evidence-standards.md` rule 10.

**Confidence ceiling: High** on the count of distinct askers where each is receipted. The
count is the finding.

---

## Cross-signature rules

**Deduplicate before counting anything.** OCR of dense UI produces fragments, duplicate lines
and interleaved chrome, and repeated identical lines are one observation
(`references/littlebird-mcp-reference.md`, known limitations). A naive count of snapshots
turns one afternoon into eleven recurrences.

**Sort by timestamp before you claim a sequence.** Results are relevance-ordered, not
chronological (`references/littlebird-mcp-reference.md`, known limitations).

**Read the relevance scores.** Items scoring below 3 are omitted by the server entirely, and
anything scored 3 is a maybe (`references/littlebird-mcp-reference.md`, retrieval pattern 5).
A recurrence resting on a single 3-scored item is not a recurrence.

**Two signatures firing on the same work is one candidate, not two.** The rebuilt monthly
report that the user also asked for by saying "same as last month" is one pattern with two
kinds of evidence, and that is a stronger candidate than either alone. Merge them and say
both signatures fired. Do not let it appear twice in the ranking.

**Window discipline.** Sweep month by month when building anything comprehensive
(`references/littlebird-mcp-reference.md`, retrieval pattern 2). A single ninety-day
unbounded query dilutes relevance and can exceed the tool result limit, at which point the
content is written to a file and you get a path instead
(`references/littlebird-mcp-reference.md`, oversized results).

**Empty is a result.** If the sweeps come back with nothing, say so and stop
(`references/evidence-standards.md` rule 9). "No repeated workflow crossed the threshold this
period" is a correct and complete report.
