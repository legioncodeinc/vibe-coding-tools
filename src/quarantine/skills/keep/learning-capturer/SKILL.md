---
name: learning-capturer
description: "Stop re-debugging the same wall, capture what I learned, log this fix, add
  to my knowledge base, what did I figure out this week, I have solved this before.
  Watches Littlebird capture for moments the user got past something hard (an API error,
  a framework gotcha, a database quirk, a deploy failure) and files each one into a
  personal, greppable knowledge base of how they fixed it last time. Weekly routine that
  proposes candidate entries for confirmation, plus an on-demand pass after a hard
  session. Handles deduplication against existing entries, recurrence escalation, version
  staleness, and a mandatory secret scrub. Not for writing generic tutorials and not for
  documenting a procedure that worked first time."
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan)"
---

# learning-capturer

## Purpose

The same wall, twice. An error the user spent ninety minutes on in March shows up again in
August and they start from zero, because the fix lived in a terminal scrollback that closed
months ago.

Littlebird watched the whole first fight. This skill reads that capture, finds the moments
where something broke and then stopped being broken, and turns each one into an entry in a
personal knowledge base keyed on the thing the user will actually search for next time,
which is the literal error text.

Two facts shape the design. Error message explanations are among the most frequent things
developers search the web for [references/research/distilled-personal-knowledge-capture.md
section 1], and search behavior has not declined despite AI assistants arriving
[references/research/distilled-personal-knowledge-capture.md section 1]. So the retrieval
key is the error string, and building a local searchable artifact is not fighting a dying
habit.

**The founding premise, that people re-debug problems they already solved, is a premise.**
No source in this skill's archive measures a re-finding rate
[references/research/distilled-personal-knowledge-capture.md section 8]. Do not present it
to the user as a research finding.

**Mode: weekly routine that proposes, plus on-demand after a hard session.** The routine
never writes. The user confirms every entry.

---

## Littlebird MCP calls used

Real tool names, verified 2026-08-17. List the tools available in this session and use what
is actually there.

| Tool | Used for |
|---|---|
| `search_user_context` | Every retrieval sweep. Error surfaces, the grind, resumption, message threads, activity summaries, and the historical recurrence check. |
| `LB_INTERNAL_SEARCH_MEETINGS` | A wall solved during a call or a pairing session, looked up BY TOPIC. |
| `LB_INTERNAL_LIST_MEETINGS` | A wall solved in a specific known meeting, looked up BY NAME. |
| `LB_INTERNAL_GET_MEETING` | The structured summary, for who supplied the fix. Attribution comes from Decisions and Action Items, never from raw transcript. |
| `LB_INTERNAL_GET_MEETING_TRANSCRIPT` | Only when the exact wording of a spoken fix is needed. |
| `LB_INTERNAL_GET_ROUTINE_REPORTS` | Reading past sweep reports so a rejected candidate stays rejected. |
| `LB_INTERNAL_GET_ROUTINE_CONFIG` | Before any routine update, because `prompt` replaces the whole prompt. |
| `LB_INTERNAL_CREATE_ROUTINE` | Offering to create the weekly sweep. |
| `LB_INTERNAL_UPDATE_ROUTINE` | Adding a permanently rejected fingerprint to the routine's do-not-propose list. |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | Checking the plan gate and whether another routine can be created. |

There is no Littlebird tool that searches past Littlebird chat conversations. Where this
skill needs prior context it uses `search_user_context`.

---

## Trigger

Fires on: "capture what I learned", "log this fix", "add that to my knowledge base", "what
did I figure out this week", "I have solved this before", "stop re-debugging this", "write
up how I fixed that", "did I hit this error before", "what have I been getting stuck on".

Also fires when the weekly sweep report lands and the user opens Cowork to work it.

Does not fire for: documenting a procedure that worked first time, which is `sop-forge`, or
for general note-taking.

---

## Capability gate

This skill requires the **Littlebird MCP on a Power or Pro plan**. Before anything else:

1. **List the tools actually available in this session.** Use the real names you find. The
   table above is verified as of 2026-08-17 and is a starting point, not a contract.
2. If no Littlebird tools are present, **stop**. Say the skill needs the Littlebird MCP
   connected and that it cannot reconstruct a solve from the user describing it, because
   the whole point is the detail they no longer remember.
3. If the plan gate is in doubt, check subscription status before promising a sweep.
4. If the user asks for the weekly routine, check the plan's routine limit first.

There is no degraded mode.

---

## Do this first, every time

Read these two before you touch retrieval:

1. `references/evidence-standards.md` - the receipt format, the observed / inferred /
   external / unknown split, the attribution guardrail, the confirmation gates.
2. `references/littlebird-mcp-reference.md` - tool parameters, return shapes, and the
   limitations to design around.

Then `references/solve-detection.md`, which governs stages 2 and 3. The other guides load
at the stage that needs them.

---

## Routine cadence

**Weekly.** Friday 16:30 local, so the week is done and the report is waiting on Monday.

The routine observes and proposes. It does not write files, does not ask questions, and
does not append to the knowledge base. Routines cannot do approvals or produce file
deliverables (`references/littlebird-mcp-reference.md`, "Do not ask a routine to do work it
cannot finish unattended in one pass"). The user opens Cowork and this skill does the rest.

The on-demand mode runs the same pipeline against a window the user names, usually "today"
or "yesterday afternoon", right after a session that hurt.

---

## Process

| Stage | Guide | Output |
|---|---|---|
| 1. Fix the window and load the base | this file, `references/kb-structure-and-dedupe.md` section 1 | Window, existing entries, `rejected.md`, staleness flags |
| 2. Six sweeps | Retrieval brief below, `references/solve-detection.md` sections 1 to 2 | Raw retrieval, timestamp-sorted |
| 3. Classify each candidate | `references/solve-detection.md` sections 3 to 5 | Solved / abandoned / other-solved / ai-solved, with confidence |
| 4. **Scrub** | `references/secret-scrubbing.md` | Scrubbed strings, typed placeholders, rotation flags |
| 5. Dedupe | `references/kb-structure-and-dedupe.md` sections 3 to 5, `scripts/kb_index.py --check` | New / update / rejected-already, plus recurrence escalations |
| 6. Draft | `references/entry-schema.md` | Draft entries and draft updates, nothing written |
| 7. Confirm | `AskUserQuestion` | Approved, edited, or rejected, one by one |
| 8. Write and index | `references/kb-structure-and-dedupe.md` sections 4, 6, 7 | Files appended, `rejected.md` updated, `INDEX.md` rebuilt |

Stage 4 runs before stage 5, so no unscrubbed string reaches a comparison or a report.
Stage 4 never gets skipped, not on-demand, not when the user says the session was harmless.

Stage 7 never gets skipped either. See the guardrail.

---

## Retrieval brief

The exact queries. Default window for the weekly routine: the last 7 days. For on-demand,
the window the user names. Split anything longer than about two hours into sub-windows,
because a single broad sweep exceeds the tool result limit and gets dumped to a file
instead (`references/littlebird-mcp-reference.md`, "Oversized results"). Prefer several
narrow parallel queries over one broad one
(`references/littlebird-mcp-reference.md`, retrieval pattern 1).

**Sweep A. Shape of the week.** `search_user_context`,
`filters: {"data_source": "summaries"}`, window fixed. Queries:
`["troubleshooting or debugging session", "blocked on an error", "spent a long time on one
problem"]`. Cheapest compressed view of the period and it names the apps for Sweep B
(`references/littlebird-mcp-reference.md`, retrieval pattern 3).

**Sweep B. Error surfaces.** `filters: {"data_source": "snapshots"}`, same window. Five
narrow queries:

1. `"terminal output with an error message or stack trace"`
2. `"red error banner or failed build output"`
3. `"exception or traceback in the editor"`
4. `"HTTP 4xx or 5xx response in browser devtools"`
5. `"database error, migration failure, or connection refused"`

**Sweep C. The grind.** `filters: {"data_source": "snapshots"}`, same window:

1. `"search engine results page for an error message"`
2. `"Stack Overflow question or GitHub issue page"`
3. `"documentation page for a library or framework"`
4. `"AI assistant chat panel containing code"`
5. `"config file, environment file, or lockfile being edited"`

Query 4 is not optional. It is how the AI-assisted solve gets detected, which is the
highest-value entry type this skill produces
(`references/solve-detection.md` section 4).

**Sweep D. Resumption.** `filters: {"data_source": "snapshots"}`, window extended 24 hours
past the sweep window, because a fix late on Friday shows its success state on Saturday:

1. `"build succeeded or tests passing"`
2. `"deployment succeeded or server started listening"`
3. `"commit message or pull request describing a fix"`

**Sweep E. Human help.** `search_queries_messages` with
`filters: {"data_source": "messages"}`, same window:
`["someone helping debug an error", "sharing a stack trace in a thread", "asking about an
error message"]`. Feeds the solved-by-someone-else branch.

**Sweep F. Historical recurrence, one call per surviving candidate.** `standalone_query`
set to the **scrubbed** literal error string, `date_range` ending where the sweep window
begins and starting as far back as capture goes. This finds occurrences that predate the
knowledge base and is what makes the occurrence log honest
(`references/solve-detection.md` section 5).

**Sweep G, only when a call was involved.** Lookup by NAME uses `LB_INTERNAL_LIST_MEETINGS`
with `name`. Lookup by TOPIC uses `LB_INTERNAL_SEARCH_MEETINGS` with `query`. Using the
wrong one is the most common retrieval mistake against this server
(`references/littlebird-mcp-reference.md`, retrieval pattern 6).

**Then sort by timestamp.** Retrieval is relevance-ordered, not chronological
(`references/littlebird-mcp-reference.md`, known limitations), and the entire detection
method is a time-ordered shape, so an unsorted sweep detects nothing.

---

## Detecting a solve

Full method in `references/solve-detection.md`. The shape, in one table:

| Phase | What it is |
|---|---|
| **A. Surface** | An error string or a failure state appears in capture. |
| **B. Grind** | The error recurs across snapshots while the context churns: searches, docs, issue pages, an assistant panel, config edits, repeated command runs. |
| **C. Cessation and resumption** | The error stops appearing, AND the original work advances without it. |

**Both halves of C are required.** Cessation alone is what abandonment looks like too, and
that single discrimination carries most of the skill's accuracy.

The four outcomes, each filed differently:

| Outcome | Filed as |
|---|---|
| Solved | A full entry. |
| Abandoned | One line in `open-walls.md`. Never a fix entry. |
| Solved by someone else | A full entry, `solved-by: other`, attribution taken from meeting summaries rather than raw transcript. |
| Solved by an assistant, not understood | A full entry, `solved-by: ai-assistant`, `understood: no`, Root cause usually honestly empty. |

That last row is the most valuable capture in the skill. 59% of developers report using
AI-generated code they do not fully understand, from a survey of 800 professionals
[references/research/distilled-personal-knowledge-capture.md section 6], and separately
stated trust in AI tools fell from 40% in 2023 to 29% in 2025 against 84% adoption
[references/research/distilled-personal-knowledge-capture.md section 6]. Those measure
different things and are not merged. The consequence is the point: a fix accepted without
understanding is the one entry the user cannot reconstruct from memory, because no memory
was formed.

**Ambiguous means abandoned.** A missing entry costs one re-debug. A wrong entry costs a
re-debug plus the time spent trusting it.

Detection is a design decision in full. The archive contains no source on detecting a solve
from observational data [references/research/distilled-personal-knowledge-capture.md
section 8]. Say so if the user asks how it works.

---

## Evidence standards

Apply `references/evidence-standards.md` in full. The four that bite hardest here:

- **Receipts on everything** (rule 1), in the form
  `[Tuesday, August 11, 2026 23:40 EDT | chrome]`. In this skill the receipt is also a
  navigation aid: the user opens that timestamp in the Littlebird app to see the original
  screen. Say so once, in the provenance block.
- **Observed, inferred, external, unknown stay visibly different** (rule 2). An error string
  read cleanly off a snapshot is observed. A repaired OCR string is inferred. A root cause
  concluded from the shape of the fix is inferred and says so. "Understood: no" is always
  an inference.
- **Rate what the user will act on** (rule 3). A Low-confidence fix that touches production,
  deletes data, or changes billing carries a stop marker telling the reader to verify before
  running it.
- **Attribution guardrail** (rule 4). Capture shows what was viewed, not what was written.
  A screen share is someone else's machine. A pasted block from an assistant is not the
  user's reasoning. Every `solved-by` value is an attribution claim and gets the same
  scrutiny.

---

## Secret scrubbing is mandatory and is this skill's top risk

Debugging capture is denser with credentials than any other kind, because credentials are
exactly what you look at when something is broken. A failing API call shows the bearer
token. A refused database connection shows the connection string with the password in it. A
401 shows the client secret. A failed deploy prints environment variables into the build
log.

Worse, **the secret is often inside the error message**, which is the one field this skill
preserves verbatim and makes greppable. The `SEARCH:` line is the highest-risk line in the
artifact.

`references/secret-scrubbing.md` is mandatory reading and the pass is mandatory execution.
The method itself is **inherited by reference** from the redaction-pass guide that ships
inside the `sop-forge` skill in this marketplace, which carries the category taxonomy, the
three-sweep scan, and the evidence behind them. It is not rebuilt here and it is not re-evidenced here.

The deltas that matter in this skill:

1. **Scrub before you compare.** Order is fixed: detect, scrub, compare, draft, confirm,
   write. An unscrubbed string must never reach the dedupe check, because the check prints
   what it matched.
2. **Never print a matched secret into the transcript.** Not the value, not a prefix, not a
   masked form, not "the key ending in 8f2c". Report a count, a category, and a location.
   Never ask the user to confirm whether a specific value is a real key.
3. **Structure-preserving placeholders in error strings.**
   `Error: connect ECONNREFUSED postgres://[USER]:[PASSWORD]@[DB_HOST]:5432/[DATABASE]`
   keeps `ECONNREFUSED postgres` and the port, which is what the user will grep for. Never
   `[REDACTED]`. An entry whose commands carry placeholders the reader cannot resolve is a
   named failure mode of operational documentation
   [references/research/distilled-personal-knowledge-capture.md section 3].
4. **Where scrubbing destroys the search key, say so and lose the key.** Never keep a secret
   to preserve searchability.
5. **The rotation flag goes at the top of the sweep report**, naming the field, the time,
   and the app. Never the value. Screen capture of a credential is exposure.
6. **The entry persists**, so the floor is higher than for a one-time document. Assume every
   entry will eventually be pasted into a chat, because the useful ones are exactly the ones
   the user will send to a colleague.

---

## Deduplication, and why recurrence is the point

The same gotcha recurs. A second encounter **updates the existing entry** with a new
occurrence row. It does not create a second entry. Full rules in
`references/kb-structure-and-dedupe.md` section 3.

Run the deterministic first pass:

```
python3 scripts/kb_index.py knowledge-base --check "the scrubbed error string"
```

It normalizes away paths, ids, hashes, line numbers, and ports, keeps version numbers and
error codes because those are the discriminators, scores against every `SEARCH:` line and
title, and checks `rejected.md` in the same call. It matches text, not meaning, so judge
symptom, cause, and fix by hand before merging. The thresholds are a design decision; the
archive has no research on deduplicating personal knowledge base entries
[references/research/distilled-personal-knowledge-capture.md section 8].

**Recurrence escalates.** The occurrence log is not bookkeeping. Google's postmortem
practice runs automated trend analysis across many postmortems precisely so recurrence
becomes visible [references/research/distilled-personal-knowledge-capture.md section 4].
The personal version:

| Occurrences | Report behavior |
|---|---|
| 2 | Noted. |
| 3 | Flagged, with elapsed span and summed lower-bound time cost. |
| 4 or more | Top of the report, above new candidates, with a specific structural fix proposed: a pinned version, a lint rule, a CI check, a removed dependency. |

Keep it blameless. "You have hit this four times, here is the structural fix", never "you
keep making the same mistake". A record that indicts the person reading it stops getting
written [references/research/distilled-personal-knowledge-capture.md section 4]. The
escalation is a proposal. This skill never changes the user's code or config.

---

## Staleness

A fix from two majors ago is a wrong answer the user's own past self vouched for.

This is the best-evidenced risk in the skill. Of measured obsolete answers on a public
platform, 58.4% were already obsolete when first posted and only 20.5% were ever updated,
with an average 118-day lag between someone noticing and anyone acting
[references/research/distilled-personal-knowledge-capture.md section 5]. Third-party
libraries and language versions together account for roughly 63% of obsolescence
[references/research/distilled-personal-knowledge-capture.md section 5]. The authors'
recommendation to writers is exactly what this skill implements: include version and time
information [references/research/distilled-personal-knowledge-capture.md section 5].

Every entry carries pinned versions, a `review-after` date, and a `last-confirmed` date.
Every sweep runs:

```
python3 scripts/kb_index.py knowledge-base --stale
```

and surfaces **at most four** flagged entries, ordered by how much the user loses if the
entry is wrong. A staleness list longer than the candidate list turns the report into a
chore, and a chore gets muted.

Outcomes are reconfirm, revise, or retire. **Retire, never delete**: a retired entry still
answers "did I already decide this does not apply", and deletion destroys the occurrence
history that drives escalation. Full rules in `references/staleness-and-versions.md`.

---

## Output

### The artifact

```
knowledge-base/
├── INDEX.md                 generated, never hand-edited
├── entries/
│   └── YYYY-MM-DD--kebab-slug.md
├── open-walls.md            abandoned problems, one line each
└── rejected.md              the rejection ledger
```

Flat `entries/`, one markdown file per entry, filename equal to the entry id. Location
confirmed with the user on first run and recorded; default `knowledge-base/` in the working
directory.

Flat rather than topic folders because the retrieval path is a human running grep for an
error string, and topic folders force a filing decision at write time about a category the
user will not remember at read time. The archive's one concrete personal knowledge base
layout uses topic folders and explicitly does not solve search
[references/research/distilled-personal-knowledge-capture.md section 7]; the practitioner
source that repaired a failing base did it by abandoning topic grouping for
index-by-future-retrieval-context [references/research/distilled-personal-knowledge-capture.md
section 2]. Flat plus tags plus a generated index is a design decision filling that gap.

### The entry

Fixed schema, every field present, empty fields stated rather than dropped. Full template
and worked example in `references/entry-schema.md`.

| Field | Rule |
|---|---|
| **Title** | Names the symptom, not the cause and not the fix. |
| **Symptom** | A one-line `SEARCH:` holding the literal error text verbatim and unwrapped, the grep target, plus a concrete description and the query the user actually typed. |
| **Context** | Stack, exact pinned versions, environment. `unknown, not captured` where capture did not show it. Never "latest". |
| **Root cause** | Separate field. `established`, `empirical`, or `unknown`. Never invented. The published template omits cause when unknown rather than forcing a guess [references/research/distilled-personal-knowledge-capture.md section 3]. |
| **The fix** | Actual commands, config, or code, verbatim and scrubbed, ordered most-likely-first, ending in an explicit expected outcome. |
| **What did not work** | Mandatory. Each line: what was tried, why it looked right, what happened instead. The middle part is what saves time. |
| **Time cost** | A bounded range with the snapshot count, never a single number, and "unbounded, ask the user" when the phases span an uncaptured gap. |
| **Occurrences** | Date, receipt, what was different. Drives the escalation ladder. |
| **Tags** | 3 to 6, lowercase kebab, one greppable line. |
| **Provenance** | Receipts back to the source capture with timestamps the user can open in the Littlebird app, plus the redaction count and categories. |

Title and Symptom carry the whole retrieval story, and that rule has the strongest support
in the archive: two independent sources in different domains reach it
[references/research/distilled-personal-knowledge-capture.md section 2]. The knowledge base
literature states "Use the reader's language. Titles and symptom descriptions should use the
exact error message text" [references/research/distilled-personal-knowledge-capture.md
section 3]; the personal knowledge management practitioner reached the same rule by asking
"in what context might I refer to this note in the future?"
[references/research/distilled-personal-knowledge-capture.md section 2].

### The weekly sweep report

Produced by the routine, read by this skill. Order: security notice if credentials were
found, then recurrence escalations, then new candidates with their classification and
confidence, then at most four staleness flags, then the carry-forward rejection block.

---

## Confirm before anything is appended

**Nothing is written to the knowledge base without the user approving that specific entry.**
Not the plan, the entry.

This is the encode gate (`references/evidence-standards.md` rule 6) and it is also the
skill's answer to its own biggest risk. Automation makes collecting free, and the
Collector's Fallacy is a reward loop attached to the act of collecting
[references/research/distilled-personal-knowledge-capture.md section 2]. A skill that
appends without engagement removes the only step the archive says produces knowledge, which
is effortful engagement [references/research/distilled-personal-knowledge-capture.md
section 2]. Unprocessed collections become liabilities that accumulate faster than they can
be engaged and are then ignored entirely
[references/research/distilled-personal-knowledge-capture.md section 2].

Use `AskUserQuestion`, one candidate at a time, showing the drafted entry. For each:

- Approve as drafted
- Approve with edits, and take the edits
- Reject, and record it in `rejected.md` with the date, the fingerprint, and the reason
- Defer to next week

Confirm specifically: the classification (solved versus abandoned versus assistant-solved),
any Low-confidence reading, the root cause when it is marked `established`, and the redaction
choices for the confirmable categories. Do not ask the user to confirm every High-confidence
field individually, which is just asking them to write the entry themselves.

**A rejection is permanent.** Anything in `rejected.md` is never proposed again, and the
skill checks that ledger before drafting on every run. Re-proposing something the user
already declined is the fastest way to get the weekly routine muted, and a muted routine is
a dead knowledge base.

---

## Routine wiring

Offer to create the weekly sweep. Do not tell the user to go set it up by hand. Show them
this prompt text and this schedule with `AskUserQuestion`, get approval, then call
`LB_INTERNAL_CREATE_ROUTINE`.

- **title:** `Weekly solve sweep`
- **schedule:** `{"frequency": "weekly", "time": "16:30", "week_days": ["FR"]}`
- **notifications_enabled:** true
- **email_notifications_enabled:** user's choice

**prompt:**

```
You are the weekly solve sweep for the learning-capturer skill. Your job is to find
moments in the last 7 days where the user hit a technical problem and got past it, and
to report them as candidate knowledge base entries. You do NOT write files and you do
NOT create entries. You produce one report.

STEP 1. Read your own past reports first. Call LB_INTERNAL_GET_ROUTINE_REPORTS for this
routine with limit 5. From them, extract the "DO NOT RE-PROPOSE" block at the end of the
most recent report. Everything on that list has already been rejected by the user or
already filed. Never propose any of it again, in any wording.

STEP 2. Search the last 7 days with search_user_context. Run these sweeps as separate
narrow calls, not one broad call:

  A. filters data_source summaries. Queries: troubleshooting or debugging session;
     blocked on an error; spent a long time on one problem.
  B. filters data_source snapshots. Queries: terminal output with an error message or
     stack trace; red error banner or failed build output; exception or traceback in the
     editor; HTTP 4xx or 5xx response in browser devtools; database error, migration
     failure, or connection refused.
  C. filters data_source snapshots. Queries: search engine results page for an error
     message; Stack Overflow question or GitHub issue page; documentation page for a
     library or framework; AI assistant chat panel containing code; config file or
     lockfile being edited.
  D. filters data_source snapshots. Queries: build succeeded or tests passing; deployment
     succeeded or server started listening; commit message describing a fix.
  E. search_queries_messages with filters data_source messages. Queries: someone helping
     debug an error; sharing a stack trace in a thread; asking about an error message.

Sort everything by timestamp before judging anything. Results come back ordered by
relevance, not by time, and this whole method depends on time order.

STEP 3. For each candidate, look for the three-phase shape: an error appears, a period of
searching and trying, then the error stops appearing AND the original work resumes and
advances. BOTH halves of the third phase are required. Cessation with no resumption is an
abandoned problem, not a solve. Classify each as: SOLVED, ABANDONED, SOLVED BY SOMEONE
ELSE, or SOLVED BY AN AI ASSISTANT WITHOUT THE USER UNDERSTANDING IT. That last one is
the most valuable, so look specifically for a short grind phase dominated by an assistant
panel followed by a pasted block and then the error stopping. If it is ambiguous between
solved and abandoned, call it abandoned.

STEP 4. Never print a credential, token, key, password, connection string, or any part of
one into this report. If an error message contains one, describe the field and where it
appeared and say the value was withheld. If you find any credential material on screen at
all, open the report with a SECURITY NOTICE naming the field, the time, and the app, and
saying it should be rotated. Never name the value.

STEP 5. Write the report in this order:

  1. SECURITY NOTICE, only if credential material was on screen.
  2. RECURRING, only if any candidate looks like something you have reported before in a
     past report. Say how many times and over what span, and say that a repeated wall is
     worth fixing structurally rather than re-fixing.
  3. CANDIDATES. For each: a symptom line using the literal error text, the classification
     from step 3, a confidence of High, Medium or Low, the timestamps of the first error
     and the resumption, and one line on what appears to have fixed it. Maximum 6
     candidates. If there are more, keep the 6 with the longest grind phases.
  4. ABANDONED. Any wall that stopped without resumption, one line each.
  5. NEXT STEP. One line: open Cowork and run the learning-capturer skill to review these
     and append the approved ones.
  6. DO NOT RE-PROPOSE. Copy this block forward verbatim from the most recent past report,
     then append any candidate the report history shows was rejected. This block is your
     only memory. If you drop it, you will re-propose things the user already said no to.

If the searches return nothing, say exactly that and stop. Do not invent candidates and do
not pad with plausible examples. A report saying "no solves detected this week" is correct
output.
```

### Escalation rule

Built into step 5, item 2. A routine that does not read its own reports repeats itself
indefinitely; a production routine was observed flagging the identical top item four days
running because nothing told it to escalate
(`references/littlebird-mcp-reference.md`, "Give every routine memory").

### Keeping rejections in step

The routine has no filesystem, so it cannot read `rejected.md`. Two memories are used, both
described in `references/kb-structure-and-dedupe.md` section 7:

1. The carry-forward block in every report, read via `LB_INTERNAL_GET_ROUTINE_REPORTS`.
2. For anything rejected as permanently uninteresting, offer to append the fingerprint to
   the routine's standing do-not-propose list. Call `LB_INTERNAL_GET_ROUTINE_CONFIG` first,
   because `prompt` REPLACES the whole prompt on update. Show the user the full revised
   prompt and get approval before calling `LB_INTERNAL_UPDATE_ROUTINE`.

---

## Empty retrieval

| Situation | Action |
|---|---|
| No Littlebird tools in session | Stop at the capability gate. |
| Summaries empty for the window | Report it. Confirm the window with the user. Do not run the expensive sweeps blindly. |
| Summaries present, no error surfaces found | Report that the period is captured and contains no detected walls. That is a real and good finding. Stop. |
| Error surfaces found, no resumption anywhere | Everything is abandoned. Offer `open-walls.md` lines only. Do not manufacture a fix. |
| Error text too OCR-corrupted to use as a search key | Name it as a gap. Offer the entry with a description-based symptom and say the retrieval quality is reduced. |
| Everything scored 3 | Anything scored 3 is a maybe (`references/littlebird-mcp-reference.md`, retrieval pattern 5). Report Low confidence across the board and confirm heavily. |

A failed or empty retrieval ends the run (`references/evidence-standards.md` rule 9). Never
fabricate a fix. A fabricated entry in a knowledge base does not get evaluated, it gets
executed, months later, by someone who has forgotten the context entirely.

---

## Guardrail

**The specific risk this skill carries: a knowledge base full of wrong entries is worse than
no knowledge base at all.**

Not because of the storage. Because of the trust. The user consults it at the exact moment
they are stuck, tired, and looking for a shortcut, and an entry written by their own past
self is the hardest kind of wrong answer to doubt. Four concrete failure paths, each with
its countermeasure already in the process above:

| Failure | Countermeasure |
|---|---|
| An abandoned problem filed as a solve | Both halves of phase C required. Ambiguous means abandoned. `solve-detection.md` section 3. |
| An invented root cause | `root-cause-status` has an `empirical` and an `unknown` value, and the published template omits cause when unknown [references/research/distilled-personal-knowledge-capture.md section 3]. |
| A stale fix applied to a moved-on stack | Pinned versions, `review-after`, `last-confirmed`, and a mechanical staleness check every sweep. |
| Silent accumulation without engagement | Nothing is appended without per-entry confirmation. The Collector's Fallacy is a reward loop attached to collecting [references/research/distilled-personal-knowledge-capture.md section 2]. |

The second risk, close behind: **this artifact is credential-dense by construction**,
because credentials are what is on screen when things break, and the greppable `SEARCH:`
line is the most likely place for one to survive. That is why the scrub runs before the
comparison, before the report, and before the draft, and why no matched value is ever
printed.

The archive names the mechanism by which personal knowledge bases die but **nowhere measures
how often it happens** [references/research/distilled-personal-knowledge-capture.md
section 2]. Never quote a survival rate to the user. There is not one.

---

## Related skills

| Skill | Relationship |
|---|---|
| `sop-forge` | Documents work that went right, as a procedure. This one documents work that went wrong, as a lookup. `sop-forge` owns the redaction method both skills use; this skill inherits it by reference. |
| `routine-architect` | Owns routine design generally. Use it if the user wants the weekly sweep reshaped, moved, or merged with other weekly routines. |
| `daily-brief` | Surfaces what happened day to day. It will notice a bad day; this skill turns that day into something reusable. |
| `said-it-already` | The same recurrence instinct applied to conversation instead of code. |

---

## Ship Gate

Ship Gate removed, research-only skill, produces no committable code.

---

## Reference map

| File | Load it when |
|---|---|
| `references/evidence-standards.md` | Always, first. |
| `references/littlebird-mcp-reference.md` | Always, first. |
| `references/solve-detection.md` | Stages 2 and 3. Phase shapes, the four outcomes, the AI-assisted branch, recurrence, time bounding, confidence. |
| `references/secret-scrubbing.md` | Stage 4, always, before anything is compared or printed. |
| `references/kb-structure-and-dedupe.md` | Stages 1, 5, and 8. Layout, greppability, the dedupe rule table, the escalation ladder, the rejection ledger. |
| `references/entry-schema.md` | Stage 6. The template, every field's rule, the worked example. |
| `references/staleness-and-versions.md` | Stage 1 for the check, and whenever a review outcome is decided. |
| `references/research/distilled-personal-knowledge-capture.md` | When you need the citation behind a rule, or want to check whether a claim is evidenced at all. |
| `references/research/README.md` | Source inventory and the archive's named gaps. |
| `scripts/kb_index.py` | Stage 1 (`--stale`), stage 5 (`--check`), stage 8 (`--index`). `--tags` when tag drift is suspected. |

Five of this skill's design decisions are **not** evidenced by the research archive and are
labelled as design decisions rather than researched practice: the entire solve-detection
method, the dedupe thresholds and merge rules, the bounded time-cost estimate, the greppable
symptom line with its generated index, and the premise that people re-debug problems they
already solved. See `references/research/distilled-personal-knowledge-capture.md` section 8.
