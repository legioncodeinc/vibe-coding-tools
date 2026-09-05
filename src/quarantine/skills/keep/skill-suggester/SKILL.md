---
name: skill-suggester
description: "What should I automate next, what skill should I build, am I doing the same
  thing over and over, I keep doing this by hand, find my repeated work, propose a new skill.
  Detects repeated manual workflows in Littlebird capture across five named signatures, ranks
  candidates with honest recurrence counts and receipts, dedupes them against the skills the
  user already has, recommends build or skip against ten reasons to say no, and pre-drafts a
  valid SKILL.md for the top candidate. Use for finding and drafting a new automation
  candidate. Not for auditing existing routines, and not for writing an SOP."
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan)"
---

# skill-suggester

The marketplace skill that finds the marketplace's next skill. It watches capture for work
the user has now done by hand several times, checks that work against what they already have
installed, and hands back a ranked shortlist with receipts plus one pre-drafted SKILL.md.

The thing it is careful about is saying no. The naive inference, it repeats therefore automate
it, is incomplete, and the reason is the oldest finding in the archive: the designer who tries
to eliminate the operator still leaves the operator to do the tasks which the designer cannot
think how to automate
[references/research/distilled-automation-opportunity-identification.md section 8.1].
Automating the mechanical half of a task leaves the half that resisted automation, and that
half is the hard one. Ten reasons to skip are in `references/when-not-to-automate.md` and they
are half the output.

**Mode: monthly routine detects, Cowork session drafts.** The routine cannot draft a SKILL.md
and cannot ask for approval, so it reports and hands off.

**Hard rule, before anything else: suggest only, never install.** No plugin manifest, no
marketplace manifest, no skills directory. This skill writes proposals and drafts into the
working directory and stops.

---

## Purpose

Turn repeated manual work that is invisible to the person doing it into a small number of
defensible automation proposals, each one already checked against the tools they own.

The problem is real because people cannot see their own repeated work. Three independent
sources measured self-reported computer use against logs and all three found the estimates do
not hold up: a 32% difference in the average and a median absolute individual difference of
47% across 401 professionals, with light users overestimating and heavy users underestimating
[distilled section 9.1]; the same regression pattern replicated same-day against keyboard and
mouse logs [distilled section 9.2]; and self-reports rarely reflecting logged use across 106
effect sizes [distilled section 9.3]. Capture is the log. That is the entire premise.

---

## Littlebird MCP calls used

Real tool names. List the tools actually available in this session before using any of them.

| Tool | Used for |
|---|---|
| `search_user_context` | All five pattern signatures. Snapshots, messages and activity summaries, month by month |
| `LB_INTERNAL_SEARCH_MEETINGS` | Signature 5, the re-answered question, searched by topic |
| `LB_INTERNAL_LIST_MEETINGS` | Recurring meetings by `name`, which is a strong cadence signal for periodic work |
| `LB_INTERNAL_GET_MEETING` | The structured summary for a recurring meeting, specifically Action Items, which name repeated obligations |
| `LB_INTERNAL_LIST_ROUTINES` | The dedupe pass, and finding this skill's own routine id |
| `LB_INTERNAL_GET_ROUTINE_CONFIG` | Reading the rejection ledger out of this skill's own routine prompt before updating it |
| `LB_INTERNAL_GET_ROUTINE_REPORTS` | Reading past reports so a rejected candidate is not re-proposed |
| `LB_INTERNAL_CREATE_ROUTINE` | Offering to create the monthly detector, from an interactive session |
| `LB_INTERNAL_UPDATE_ROUTINE` | Writing a rejected candidate into the ledger inside the routine prompt |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | Checking the plan before proposing a routine that consumes a slot |

`LB_INTERNAL_GET_MEETING_TRANSCRIPT` is deliberately not used. The structured summary already
carries owner-attributed Action Items and Decisions, and pulling full transcripts to count
recurrences is expensive and weakly diarized
(`references/littlebird-mcp-reference.md`, known limitations).

**Skill and routine listing is not a Littlebird call.** Whatever this session exposes for
listing available skills is used for the dedupe pass, and if nothing does, the dedupe pass
cannot run and the report carries no proposals. See
`references/dedupe-against-existing-skills.md` step 1.

---

## Trigger

Run it when the user says any of: what should I automate next, what skill should I build,
am I doing the same thing over and over, I keep doing this by hand, find my repeated work,
is there a skill for this, what is worth automating.

Also run it when the monthly routine has produced a report naming candidates, and the user
opens Cowork to act on it. That is the main path.

---

## Routine cadence

**Monthly, day 1, 09:00.**

Monthly because the signal is a pattern across weeks. A weekly cadence on this produces three
reports saying nothing changed for every one that says something, which is the fastest way to
train a user to stop opening it. The threshold itself is a 90-day and 180-day window, so a
faster cadence cannot see anything new anyway.

The `schedule` shape is
`{"frequency": "monthly", "time": "09:00", "month_day": 1}`
(`references/littlebird-mcp-reference.md`, routine tools).

**Offer to create it, do not tell the user to go do it.** `LB_INTERNAL_CREATE_ROUTINE` works
from an interactive session and is blocked only from inside a running routine. Check the plan
with `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` first, name which slot it takes, show the full
prompt text below, get approval through `AskUserQuestion`, then create it. Creating a routine
immediately generates a first report, so read that first report with the user and fix the
prompt while they still remember what they asked for.

---

## Capability gate

This skill requires the **Littlebird MCP on a Power or Pro plan**. Before anything else:

1. **List the tools actually available in this session** and use the real names you find. Do
   not assume the names in `references/littlebird-mcp-reference.md` are still exact. That file
   is verified as of 2026-08-17 and is a starting point, not a contract.
2. If no Littlebird tools are present, **stop.** Say the skill needs the Littlebird MCP
   connected. There is no degraded mode. A suggester that cannot read capture is guessing at
   the user's work, which is precisely the guess the research says people get wrong
   [distilled section 9].
3. **If the session cannot list its own available skills, stop before proposing anything.**
   The dedupe pass is not optional. Report the detected patterns as observations and say the
   proposals cannot be made without knowing what is installed.

---

## Do this first, every time

Read these two before you touch retrieval:

1. `references/evidence-standards.md` - the receipt format, the observed / inferred / external
   / unknown split, the attribution guardrail, and the confirmation gates.
2. `references/littlebird-mcp-reference.md` - tool parameters, return shapes, and the known
   limitations that set the ceiling on every recurrence count this skill produces.

Then `references/pattern-signatures.md`, which is what everything else operates on.

---

## Process

| Stage | Guide | Output |
|---|---|---|
| 1. Read past reports and the rejection ledger | this file, Routine wiring | The do-not-propose list |
| 2. Run the five signatures | `references/pattern-signatures.md` | Raw candidate patterns with receipts |
| 3. Deduplicate, sort, count | `references/pattern-signatures.md`, cross-signature rules | Recurrence counts as lower bounds |
| 4. Apply the threshold | `references/threshold-and-ranking.md` sections 2 to 3 | Candidates above the bar, plus a watchlist |
| 5. **Dedupe against installed skills** | `references/dedupe-against-existing-skills.md` | Four buckets. Only one produces a proposal |
| 6. Anonymize third parties | `references/evidence-standards.md` rule 10, and Guardrail below | Role labels replacing names |
| 7. Build or skip | `references/when-not-to-automate.md` | A recommendation per candidate with a named reason |
| 8. Rank and size | `references/threshold-and-ranking.md` sections 4 to 6 | At most three candidates, ordered |
| 9. Confirm with the user | `references/evidence-standards.md` rule 6 | Corrected candidates, chosen top pick |
| 10. Draft the top candidate | `references/skill-md-drafting.md` | A validated SKILL.md draft |
| 11. Record the decision | this file, Routine wiring | Ledger updated where something was rejected |

Stage 5 runs before stage 7 and before any drafting. Stage 6 runs before anything is written
into a proposal, not after.

Stages 1 to 4 are what the routine does. Stages 5 to 11 are the Cowork session. The routine
can attempt stage 5 only if the running routine can list skills, which is not guaranteed, so
its prompt tells it to say when it could not.

---

## Retrieval brief

The full parameter shapes, the reasoning, and what each signature cannot see are in
`references/pattern-signatures.md`. The summary:

**Sweep A, cheap day-shape pass.** `search_user_context` with
`filters: {"data_source": "summaries"}`, `date_range` over the last 90 days swept month by
month. Queries: `["repeated the same setup work in a tool", "moved information from one
application to another", "rebuilt a report or document", "did the same weekly or monthly
task", "manual data entry across systems"]`. Summaries are the cheapest compressed view of a
day (`references/littlebird-mcp-reference.md`, retrieval pattern 3), and they supply the
candidate days for sweep B.

**Sweep B, the repeated ask.** `search_user_context` with `search_queries_messages:
["same as last time", "do that thing again like before", "can you redo the one you made",
"the usual format", "same as the one for the other client", "another one of these", "like you
did last month"]`, `filters: {"data_source": "messages"}`, 180-day window. This is the
strongest single signal, because it is the user stating the repetition rather than the
detector inferring it. Establish attribution before counting anything
(`references/evidence-standards.md` rule 4).

**Sweep C, app sequences.** One call per candidate application,
`filters: {"app": "{app}", "data_source": "snapshots"}`, narrowed to the candidate day. Five
narrow queries beat one broad one (`references/littlebird-mcp-reference.md`, retrieval
pattern 1), and a narrow window avoids the oversized-result file dump
(`references/littlebird-mcp-reference.md`, oversized results).

**Sweep D, data movement.** Two stages. Find the application adjacency, then take a
distinctive literal value from the source screen and search for it directly to prove it
appeared on both ends.

**Sweep E, rebuilt artifacts and re-answered questions.** Snapshot queries for the artifact
type and its section headings, including explicit queries for template use and file
duplication, which are what distinguish a rebuild from a copy. Then
`LB_INTERNAL_SEARCH_MEETINGS` by topic for questions answered repeatedly. Meeting lookup by
TOPIC uses the search tool, lookup by NAME uses the list tool with `name`, and using the wrong
one is the most common retrieval mistake against this server
(`references/littlebird-mcp-reference.md`, retrieval pattern 6).

**Then deduplicate and sort by timestamp before counting anything.** OCR of dense UI produces
fragments and duplicate lines, and repeated identical lines are one observation. Results are
relevance-ordered, not chronological (`references/littlebird-mcp-reference.md`, known
limitations).

---

## Evidence standards

Apply `references/evidence-standards.md` in full. The five that bite hardest here:

- **Receipts on every occurrence** (rule 1). A recurrence count with no dates behind it is an
  assertion. Each occurrence carries its timestamp and app anchor, and the reader can open it.
- **Observed, inferred, external, unknown stay visibly different** (rule 2). "These two
  applications appeared in the same hour" is observed. "The user copied data between them" is
  inferred, because Littlebird does not record clipboard events. Never promote the second to
  the first by dropping the hedge.
- **Rate what the user will act on** (rule 3). A build recommendation is an ask for the user's
  time. Rate the recurrence claim, and never rate a claim High on signature 1 alone.
- **The attribution guardrail** (rule 4). Signature 2 lives or dies on it. "Same as last time"
  in a thread proves someone asked for a repeat, not that the user did.
- **Raw capture never ships** (rule 7). The data-movement signature works by searching real
  values, so the working set contains customer records and amounts. Describe transfers by
  field type, never by content, and delete the working data when the proposal is written.

**Counts are lower bounds, always.** Write "at least 4 occurrences", never "4 occurrences".
Snapshots are sampled, detectors fragment long routines into short ones
[distilled section 4], and the server omits items scored below 3 entirely. Every mechanism
pushes the same direction.

---

## Output

Two artifacts in the working directory.

**1. `skill-proposals-{YYYY-MM-DD}.md`**, in this order:

1. **Bottom line.** One sentence: the single thing worth building, or that nothing is.
2. **The threshold line.** The threshold used and the window swept, stated so a reader can
   tell an absent item from a below-bar item. See
   `references/threshold-and-ranking.md` section 7.
3. **Dedupe pass result.** Counts per bucket, and the date it ran. If it could not run, that
   line says so and the report carries no proposals.
4. **Ranked candidates**, at most three, one block each:

   | Field | Content |
   |---|---|
   | Pattern | What the repeated work is, in one sentence, third parties anonymized |
   | Signatures fired | Which of the five, and whether more than one |
   | Recurrences | "At least N", with every date and its receipt |
   | Size | Steps observed, applications, handoffs, bounded elapsed span. Never an hour figure |
   | Automatability | Pass, partial or fail against the determinate-trigger and determinate-data test |
   | Dedupe verdict | Bucket A, B, C or D, with the named skill where relevant |
   | Recommendation | Build or skip, with the reason number from `references/when-not-to-automate.md` |
   | Confidence | High, Medium or Low on the recurrence claim |
   | What a skill would do | Two or three sentences. Concrete, not aspirational |

5. **Already covered.** Bucket A items: "you already have X".
6. **Covered but not firing.** Bucket B items, each with the user's own phrasings quoted and
   receipted, the current description, and a proposed replacement. Usually the most valuable
   section in the file.
7. **Improve rather than build.** Bucket C items, each naming the existing skill and the
   specific extension.
8. **Skips, with reasons.** Every candidate that hit a reason in
   `references/when-not-to-automate.md`, kept visible so the next run does not rediscover it.
9. **Watchlist.** Below-threshold patterns with their current counts.

**2. `drafts/{proposed-skill-name}/SKILL.md`** plus `drafts/{proposed-skill-name}/README-DRAFT.md`,
for the top candidate only. Structure, validation checklist and the stage 2 research
obligation are in `references/skill-md-drafting.md` sections 8 and 9.

The routine's own report is a third, smaller artifact: under 300 words, top three candidates,
no drafts, and a handoff line. Its exact shape is fixed by the prompt below.

Delete the working retrieval once both artifacts are written
(`references/evidence-standards.md` rule 7).

---

## Guardrail

Three risks, all specific to this skill.

**1. It will manufacture proposals if nothing stops it, because a proposal is its output.**
This is the sharpest risk here and it is structural rather than accidental. A monthly routine
asked to find automation candidates has an implicit monthly quota, and a suggester that
produces a proposal every month regardless of the evidence trains the user to ignore all of
them. **Zero proposals is a valid and complete result.** Say "no repeated workflow crossed the
threshold this period" and stop. Do not lower the bar to fill the section, do not promote a
watchlist item, do not add hedged possibilities.

**2. It reads months of capture, so third parties are all over the working data.** Every
person, client and company in a pattern gets a role label before the proposal exists.
"A marketing client", not the name. Pseudonymization before analysis is the industry default
for this data class rather than a courtesy [distilled section 10], and the marketplace rule is
that third parties in capture are incidental and included only where material
(`references/evidence-standards.md` rule 10). The re-answered-question signature is built
entirely out of other people asking the user things, so it needs this most.

**3. It can propose automating something the user does by hand on purpose.** The person may
be keeping their hand in, or checking something along the way, or doing the task because the
doing is how they think about it. The capture cannot tell you which. Confirm before ranking
(`references/evidence-standards.md` rule 6), and treat "I do that deliberately" as a complete
answer that closes the candidate permanently.

And the standing hard rule that sits above all three: **suggest only, never auto-install.**
Nothing is written into a plugin manifest, a marketplace manifest, or the user's installed
skills. Nothing is sent, published or applied. The draft-never-send law applies to the
description rewrites in bucket B as much as to anything else: those are durable edits to
installed artifacts and they go to the user as text, for approval, through `AskUserQuestion`.

---

## Empty and thin retrieval

| Situation | Action |
|---|---|
| No Littlebird tools in session | Stop at the capability gate. |
| Session cannot list available skills | Report detected patterns as observations. Make no proposals. The dedupe pass is not optional. |
| Summaries empty for the window | Report that the window is not captured and stop. Do not run the expensive per-app sweeps against a window with no capture in it. |
| Signatures fire, nothing clears the threshold | Report the watchlist with counts, state the threshold, and stop. This is the expected outcome most months. |
| Everything scored 3 | Anything scored 3 is a maybe (`references/littlebird-mcp-reference.md`, retrieval pattern 5). Report Low confidence across the board and confirm every candidate before ranking. |
| A candidate's occurrences all fall in one week | That is a batch, not a cadence. Batched execution is a known segmentation problem [distilled section 4]. Watchlist it and say why. |
| Only one occurrence has usable step detail | Report the step count from that occurrence and say the others are counted but not detailed. Do not extrapolate steps across occurrences you did not see. |

A failed or empty retrieval ends the run (`references/evidence-standards.md` rule 9). Never
invent a pattern to fill the report.

---

## Routine wiring

The routine detects. The Cowork session drafts. The split is forced: a routine cannot ask for
approval, cannot write a file deliverable, and cannot create or update routines
(`references/littlebird-mcp-reference.md`, routine tools and the Routines-observe Cowork-acts
pattern). Drafting a SKILL.md and confirming it needs an interactive session.

### The rejection ledger, and where it lives

A rejected proposal stays rejected. The mechanism matters, because the routine has no memory
except its own reports and no way to read a file.

**The ledger lives inside the routine's own prompt, and the Cowork session maintains it.**
When the user rejects a candidate, the Cowork session:

1. Calls `LB_INTERNAL_GET_ROUTINE_CONFIG` on this routine, immediately before writing, not
   from memory of an earlier call.
2. Appends the rejected candidate, the date and the reason to the DO NOT PROPOSE block.
3. Shows the user the **full replacement prompt text**, because
   `LB_INTERNAL_UPDATE_ROUTINE` replaces the entire prompt with no patch and no append, and
   gets approval through `AskUserQuestion`.
4. Calls `LB_INTERNAL_UPDATE_ROUTINE`.

That is a durable edit to the user's automation and it goes through the text-approval gate
like every other one (`references/evidence-standards.md` rule 6). Note that updating a routine
does not generate an immediate report: the change takes effect at the next scheduled run.

A re-proposal is allowed only with new evidence, and it must say what changed. The prompt
below encodes that.

### The exact routine prompt

Create with `title: "Monthly automation candidate watch"`, `schedule:
{"frequency": "monthly", "time": "09:00", "month_day": 1}`. Replace every brace placeholder
before creating it: a prompt created with placeholders in it produces a report about
placeholders.

```
You are my monthly watch for work I keep doing by hand that a skill could carry. The purpose
is to give me, once a month, at most three candidates worth a Cowork session, and to say
plainly when there are none.

MEMORY
Before writing anything, call LB_INTERNAL_GET_ROUTINE_REPORTS for this routine with limit 6.
Read them oldest to newest. Build a list of every candidate you have already reported and how
many consecutive months each has appeared. You need that count for the escalation rule.

DO NOT PROPOSE
Never propose any of the following again. I have already decided against them.
  - {rejected candidate 1}: rejected {date}, because {reason}
  - {rejected candidate 2}: rejected {date}, because {reason}
The only exception: if you have evidence dated after the rejection date showing at least two
NEW occurrences, you may raise it once more, and you must open that item by saying explicitly
what has changed since I rejected it. If you cannot name what changed, do not raise it.

WHAT TO LOOK AT
The last 90 days for active work, and the last 180 days for periodic work. Run these as
separate searches rather than one combined search:
  1. activity summaries for work performed more than once in substantially the same way
  2. message threads where I asked for the same kind of output again, using phrasings like
     "same as last time", "do that thing again", "the usual format", "another one of these"
  3. screens showing information being moved by hand from one application into another
  4. documents, decks or reports rebuilt from scratch with the same shape each time, and
     separately, whether I started from a template or duplicated the previous file
  5. the same question answered for different people, in messages and in meetings
Sort by timestamp before counting. Deduplicate near-identical snapshots: repeated identical
lines are one observation, not several.

THE THRESHOLD
A candidate counts only at three or more occurrences within 90 days, or four or more within
180 days, on separate calendar days. Two runs of the same task in one afternoon is one
occurrence of a batched task, not two.
State the threshold and the window in the report, every time.
Report counts as "at least N", never as "N". Capture is sampled, so your counts are lower
bounds.

WHAT DOES NOT COUNT, and do not raise these even when they look relevant:
  - anything already covered by a skill or routine I have, where you can check
  - work I do that only looked similar across occurrences but had different substance
  - a pattern whose most recent occurrence is more than 60 days old
  - a question answered repeatedly, where the real answer is a document rather than a skill
  - a task where the repeated part is the shell and the judgment inside it is the actual work
  - anything in the DO NOT PROPOSE list above
When you are not confident a candidate passes, leave it out. A missed pattern is recoverable.
A report I stop reading is not.

DEDUPE
If you can list the skills and routines available to you, do it, and check every candidate
against them before reporting it. If a skill exists that covers a candidate, do not propose a
new one: report it as "you already have {skill}, it may just need better triggering", and
quote the words I actually used when I asked for that work.
If you cannot list available skills in this run, say so in one line. Do not skip the check
silently.

ESCALATION
Any candidate appearing in two consecutive monthly reports: stop describing the pattern
again. Say how many occurrences have accumulated since you first raised it, and ask me for a
decision: build it, or drop it permanently. Do not raise the same candidate a third time. If
I have not acted after two months, it is not a priority and repeating it is noise.

OUTPUT
  BUILD THIS: one sentence. The single candidate worth a session, and why it beats the
    others. If there is none, say so here and stop.
  Candidates: at most 3. For each, 4 lines maximum:
    what the repeated work is, with third parties described by role and never by name
    at least N occurrences, with the dates
    steps observed, applications involved, handoffs between them
    build or skip, and the one-line reason
  Already covered: at most 2 lines. Skills I already have that cover something you found.
  Watchlist: at most 3 lines. Patterns below the threshold, with their current counts.
Under 300 words. Never give an estimate in hours: capture does not measure duration. Use the
step count, the application count, and a bounded elapsed span instead.
If a section has more items than its limit, show the top ones by occurrence count and end the
section with "plus N more".

QUIET MONTHS
If nothing crosses the threshold, write "No repeated workflow crossed the threshold this
period" and stop. That is a correct and complete report and most months should look like it.
Do not lower the bar to fill the sections, do not promote a watchlist item into a candidate,
and do not add hedged possibilities.

HANDOFF
End the report with:
  Next: open Cowork and run skill-suggester on {the top candidate} to dedupe it properly and
  draft the SKILL.md.
Never end an item without a next action.
```

### The overlap this routine has, declared

`routine-architect` ships a routine pattern called the reusable-asset watch that watches the
same signal on the same monthly cadence and hands off to `sop-forge`. Two monthly routines
naming the same work make both unreadable, and routine slots are plan-limited. If the user has
that pattern installed, recommend replacing it rather than adding alongside it, and say why.
Details in `references/dedupe-against-existing-skills.md` step 4.

---

## Ship Gate

Ship Gate removed, research-only skill, produces no committable code.

---

## Related skills

| Skill | The boundary |
|---|---|
| `sop-forge` | It documents a procedure the user already performed. This one decides whether the procedure should become a skill at all. A repeated manual procedure very often wants an SOP rather than an automation, and this skill routes it there. |
| `routine-architect` | It audits, rewrites and designs routines. This one proposes skills. When the right artifact for a detected pattern is a watch rather than a workflow, hand it over. It also owns the reusable-asset routine pattern this skill overlaps with. |
| `said-it-already` | Repetition in what the user sends and says. Overlaps with signature 5 and usually wins it. |
| `content-repurposer` | One piece of work reshaped for several channels, which is a repeated shape this skill will detect and should not claim. |
| `money-leak-auditor` | Also runs absence checks with `filters.app`. Different question, same retrieval trick. |

---

## Reference map

| File | Load it when |
|---|---|
| `references/pattern-signatures.md` | Always, at stage 2. The five signatures, their queries, their confidence ceilings, and what each cannot see. |
| `references/threshold-and-ranking.md` | Stages 4 and 8. The threshold and its trade-off, honest effort sizing, the four ranking factors, the three-candidate ceiling. |
| `references/dedupe-against-existing-skills.md` | Stage 5, before anything is ranked or drafted. The four buckets, the bucket B description rewrite, cannibalization, and this skill's own declared overlap. |
| `references/when-not-to-automate.md` | Stage 7, on every candidate. Ten reasons to skip and how to write one. |
| `references/skill-md-drafting.md` | Stage 10. The embedded authoring contract, the frontmatter template, the house sections, the real tool names, and the eight-point validation. |
| `references/evidence-standards.md` | Always, first. |
| `references/littlebird-mcp-reference.md` | Always, first. |
| `references/research/distilled-automation-opportunity-identification.md` | When you need the citation behind a rule, or to check whether a claim is evidenced at all. Section 13 is the claim map. |
| `references/research/README.md` | Source inventory and the archive's six named gaps. |

**Three things in this skill are design decisions rather than researched practice**, and they
are labelled as such wherever they appear.

1. **The recurrence threshold.** No source in the archive supplies a researched constant for
   how many recurrences justify automating something. The only published threshold is on
   determinism, at confidence 1.0 [distilled section 3.1]. Three in 90 days is a convention
   with a stated trade-off, not a finding.
2. **The repeated-ask signature.** A person asking for the same output again is the strongest
   signal available in message capture and is not a signal class anywhere in this literature
   [distilled section 12, gap 3].
3. **Detection from sampled snapshots at all.** Every detection source assumes an ordered UI
   event log with element identifiers, and nothing measures what dropping to periodic
   snapshots costs [distilled section 12, gap 2].
