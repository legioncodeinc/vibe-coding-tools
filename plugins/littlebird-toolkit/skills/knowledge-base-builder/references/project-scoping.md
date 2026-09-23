# Project scoping and the retrieval brief

Stage 1 and stage 2 of the pipeline. Everything downstream depends on getting the project
boundary right, because a knowledge pack built on a fuzzy boundary contains material from two
projects and neither reader can tell which is which.

Read `../references/evidence-standards.md` and `../references/littlebird-mcp-reference.md`
before this file. From inside this folder those are `evidence-standards.md` and
`littlebird-mcp-reference.md`.

---

## Part 1: fix the boundary before you retrieve

### 1.1 Ask the user four things

Use `AskUserQuestion`. Do not infer any of these from capture, because an inferred boundary
silently changes what goes in the pack.

| Question | Why it changes the retrieval |
|---|---|
| **What is the project called, and what else has it been called?** | Names change. A project renamed six weeks in has two names in the capture and a name-only search finds half of it. |
| **Which recurring calls belong to it?** | These become the `name` argument for the meeting list tool. This is the single highest-yield input the user can give. |
| **Who is on it?** | Names, and which apps those conversations happen in. Drives the message queries. |
| **What window?** | Default: project start to today. If the user does not know the start, use 12 months and say so in the pack's provenance block. |

Also ask what they want the pack **for**. A pack meant to brief an incoming contractor and a
pack meant to prime a coding agent are the same content with different segregation decisions.
See `sensitive-segregation.md`.

### 1.2 Confirm the boundary in writing before sweeping

Read the boundary back: project name, aliases, recurring call names, people, window, purpose.
One `AskUserQuestion`. This is cheap and it prevents an expensive wrong sweep.

### 1.3 The four kinds of thing you are looking for

Hold this list explicitly, because it determines which retrieval surface to use for each.

| Material | Where it lives | Tool |
|---|---|---|
| Structured decisions, action items, risks | Meeting summaries | `LB_INTERNAL_GET_MEETING` |
| Reasoning and wording behind a decision | Meeting transcripts | `LB_INTERNAL_GET_MEETING_TRANSCRIPT` |
| On-screen artifacts: designs, schemas, dashboards, docs | Screen snapshots | `search_user_context` with `filters.data_source` set to `snapshots` |
| Thread-level decisions that never reached a call | Message threads | `search_user_context` with `filters.data_source` set to `messages` |

Sweep the fourth row even when the meeting spine looks complete. A decision made in a thread
and never restated on a call leaves no trace in any meeting summary, so a pack built from
meetings alone can be missing exactly the decisions that moved fastest. Whether that happens
on a given project is an empirical question about that project, and running sweep F is how you
answer it rather than assume it.

---

## Part 2: the retrieval brief

Windowed, narrow, parallel. Five specific queries beat one vague query and avoid the
oversized-result file dump (`littlebird-mcp-reference.md`, retrieval pattern 1). Every call
carries a `date_range` (retrieval pattern 2).

### Sweep A: the recurring call spine

**Tool:** `LB_INTERNAL_LIST_MEETINGS`
**Params:** `name` set to each recurring call name from step 1.1, plus `start_date` and
`end_date` covering the window, plus `limit`.

A lookup by NAME uses the list tool with `name`. A lookup by TOPIC uses the search tool with
`query`. Using the wrong one is the most common retrieval mistake against this server
(`littlebird-mcp-reference.md`, retrieval pattern 6).

Run one call per recurring call name. Collect the ids. Only recorded meetings carry an id;
bare calendar entries do not and are not searchable.

### Sweep B: the topic sweep across meetings

**Tool:** `LB_INTERNAL_SEARCH_MEETINGS`
**Params:** `query`, plus `start_date` and `end_date`, plus `limit`.

Run these queries in parallel, one call each, substituting the project name:

1. `"PROJECT decision on approach"`
2. `"PROJECT requirements and scope"`
3. `"PROJECT architecture and data model"`
4. `"PROJECT pricing positioning and target customer"`
5. `"PROJECT timeline blockers and risks"`
6. `"PROJECT what we agreed to change"`

Query 6 is not optional. It is how reversals surface, and reversals are what the contradiction
register is built from.

Do not rely on the `attendees` filter to prove someone was in a meeting. It is an OR filter
and best-effort over top candidates only (`littlebird-mcp-reference.md`, meeting tools).

### Sweep C: the structured blocks

**Tool:** `LB_INTERNAL_GET_MEETING`, one call per meeting id from sweeps A and B.

This returns the structured summary with, verbatim from production, these headings:
`## Executive Summary`, `## For You`, `## Topics Discussed`, `## Decisions` (each tagged with
who decided), `## Action Items` (checkbox list, each with an owner or `Unassigned`), and
`## Risks / Open Questions` (`littlebird-mcp-reference.md`, "What a meeting summary already
contains").

**These three blocks are the spine of the pack.** `## Decisions` feeds the decision records.
`## Risks / Open Questions` feeds the open questions register. `## Action Items` tells you
which requirements were actually committed to rather than merely discussed.

Take attribution from these blocks, never from raw transcript. Transcript chunks are weakly
diarized and frequently tagged `[Others]` (`littlebird-mcp-reference.md`, known limitations).

### Sweep D: transcript, selectively

**Tool:** `LB_INTERNAL_GET_MEETING_TRANSCRIPT`

Transcripts are long. Pull one only when you need the **wording** of a decision for a quote in
a decision record, or the reasoning behind it for the Context section. Never pull one to
establish who said something.

Budget: the meetings where sweep C surfaced a decision you intend to record. Not all of them.

### Sweep E: on-screen artifacts

**Tool:** `search_user_context`
**Params:** `filters` with `data_source` set to `snapshots`, `date_range` across the window,
`search_queries` in parallel narrow batches.

Sweep month by month across the window rather than in one call
(`littlebird-mcp-reference.md`, retrieval pattern 2). Queries per month, substituting the
project name:

1. `"PROJECT design mockup or wireframe"`
2. `"PROJECT database schema or table structure"`
3. `"PROJECT architecture diagram or system flow"`
4. `"PROJECT dashboard metrics or analytics"`
5. `"PROJECT specification document or requirements page"`
6. `"PROJECT roadmap or milestone list"`

Add `filters.app` where the user named the tool: Figma, Notion, Linear, a database console.
Filtering by app also lets you prove absence, which is a real finding
(`littlebird-mcp-reference.md`, retrieval pattern 4).

**Snapshots are the primary source for the data model.** A screenshot of a schema, a table
list, or a type definition is far better evidence than someone describing a table on a call.

### Sweep F: thread-level decisions

**Tool:** `search_user_context`
**Params:** `filters` with `data_source` set to `messages`, `search_queries_messages` carrying
the queries, `date_range` per month.

Queries:

1. `"PROJECT let us go with this approach"`
2. `"PROJECT changed my mind about"`
3. `"PROJECT can you confirm the number"`
4. `"PROJECT scope creep or we are cutting"`
5. `"PROJECT deadline moved"`
6. `"PROJECT what do we call this"`

Query 6 harvests glossary terms. Naming arguments happen in threads.

Message items carry a collection time and per-message send timestamps that are different
values, and both matter (`littlebird-mcp-reference.md`, `search_user_context` return shape).
Record both in the receipt, per `evidence-standards.md` rule 1.

### Sweep G: the vocabulary sweep

**Tool:** `search_user_context`, both `snapshots` and `messages`.

Run this after A through F, once you have a candidate term list drawn from what you have read.
For each term that looks project-specific, run a targeted query for the term itself. You are
looking for two things: a moment where someone defined it, and evidence of a second meaning.

A term used two ways by two people is a glossary entry and a contradiction register entry at
the same time.

---

## Part 3: sort, deduplicate, and score

Three passes before you write anything.

1. **Sort by event time.** Retrieval returns relevance order, not chronological order
   (`evidence-standards.md` rule 8, `littlebird-mcp-reference.md` known limitations). The
   entire recency-wins rule is meaningless if the timeline is wrong, so this pass is
   load-bearing rather than cosmetic. Where collection time and event time differ, the event
   time governs the timeline.
2. **Deduplicate.** OCR of dense UI produces fragments, duplicate lines, and interleaved
   chrome; repeated identical lines are one observation
   (`littlebird-mcp-reference.md`, known limitations). Deduplicate before counting anything,
   and never treat repetition as corroboration.
3. **Read the relevance scores.** Anything scored 3 is a maybe, and no claim should rest on a
   single 3-scored item without corroboration (`littlebird-mcp-reference.md`, retrieval
   pattern 5). Items scoring below 3 never appear at all, so absence in results is not absence
   in capture.

---

## Part 4: empty and thin retrieval

| Situation | Action |
|---|---|
| No Littlebird tools in session | Stop at the capability gate. |
| Sweep A returns no recorded meetings for any named call | Report it. The calls may be unrecorded calendar entries, which carry no id, no summary, and no transcript. Ask whether the project lives in threads and screens instead, and if so run E and F only, and say in the pack that the meeting spine is absent. |
| Sweeps A through D empty, E and F productive | Buildable, but there will be no decision records with attribution. Say so before writing. Decisions taken from snapshots alone are inferences. |
| Fewer than roughly 3 recorded meetings and fewer than roughly 20 distinct snapshots after dedup | Too thin for a pack. Report what was found, name it a fragment, and offer a single project-context note instead of six documents. Do not pad. |
| Everything scored 3 | Report low confidence across the whole pack, and expand the confirmation gate to cover material you would otherwise have passed as High. |
| One artifact type has nothing (no schema anywhere, no positioning anywhere) | Omit that document from the pack and name the omission in the index. An empty architecture note is worse than a stated absence. |

A failed or empty retrieval ends the run. Never fabricate to fill a gap
(`evidence-standards.md` rule 9).
