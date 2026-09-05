---
name: commitment-tracker
description: 'Commitment ledger from Littlebird meetings. Trigger on "what did I promise",
  "what do people owe me", "who owes me what", "did I follow up", "open action items",
  "what fell through the cracks", "weekly commitment review", "chase my follow-ups".
  Harvests the Action Items, Decisions and Open Questions already in every Littlebird
  meeting summary, checks each one against downstream screen and message evidence to see
  whether it actually got done, ages what is still open, and drafts nudges for approval.
  Produces a two-column ledger of what you owe and what you are owed, plus a decisions
  log.'
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan)"
---

# Commitment tracker

## Purpose

Every Littlebird meeting summary already ships a structured `## Action Items` block with
an owner tag on each line, a `## Decisions` block with a decider tag, a
`## Risks / Open Questions` block, and a `## For You` section. That structure sits there
unharvested. In the account this skill was validated against, one 30 minute partnership
call produced four action items, two of them tagged `Unassigned`, plus two open questions,
and none of it went anywhere.

This skill does three things with that structure:

1. **Harvests** it across every recorded meeting in a window.
2. **Verifies** it, which is the part nobody does: searches for downstream evidence that
   the thing actually happened.
3. **Escalates** by age, changing channel and framing rather than repeating itself.

It does not re-extract commitments from raw transcript. Raw transcript chunks are weakly
diarized and frequently tagged `[Others]`, and state of the art diarization runs at 11 to
13 percent error (`references/research/distilled-commitment-tracking.md`, section 4).
Attribution comes from the summary blocks. Always.

## Capability gate

This skill requires the Littlebird MCP on a Power or Pro plan.

Before anything else:

1. List the tools actually available in this session and use the real tool names. Do not
   assume a tool exists because it is named in `references/littlebird-mcp-reference.md`.
2. If no Littlebird MCP tools are present, stop and tell the user the skill needs the
   Littlebird MCP connected. Do not attempt a partial run from memory or from other
   sources.
3. If routine creation is part of the request, call `LB_INTERNAL_GET_SUBSCRIPTION_STATUS`
   first to confirm the plan supports another routine.

Read `references/evidence-standards.md` before writing any output. Every line in the
ledger is observed, inferred, external, or unknown, and the kind is visible to the reader.

## Littlebird MCP calls used

| Tool | Used for |
|---|---|
| `LB_INTERNAL_LIST_MEETINGS` | Enumerating the window with `start_date`, `end_date` and a `limit` high enough to cover it. Also prior instances of a recurring meeting by `name`. Entries carrying an id are recorded; entries without one are unrecorded calendar events and are not searchable. Name lookup uses this tool. |
| `LB_INTERNAL_GET_MEETING` | The harvest, on every recorded id: `## Action Items` with the owner tag on each line, `## Decisions` with the decider tag, `## Risks / Open Questions`, and `## For You`. |
| `LB_INTERNAL_SEARCH_MEETINGS` | Whether a later meeting confirmed delivery. `query` is the deliverable named as a noun, `start_date` the day after the origin meeting. Topic lookup uses this tool. Do not add `attendees`; that filter is OR and best-effort and can miss a matching meeting entirely. |
| `search_user_context` | The downstream evidence sweep and the deliberate absence proof. Narrow parallel `search_queries` and `search_queries_messages`, a `standalone_query`, a `date_range` starting the day after the commitment, and `filters` on `data_source` of `messages`, `snapshots` or `summaries`, or on `app` when proving absence. |
| `LB_INTERNAL_GET_MEETING_TRANSCRIPT` | Almost never. The single narrow case is a decision's supporting quote, taken for wording only (`references/decisions-log.md`). Never for attribution, never in the harvest. |
| `LB_INTERNAL_GET_ROUTINE_REPORTS` | Read first on every run, `limit` 5. Supplies the carry-forward list, the restatement counts that drive escalation, and everything the user already closed or held. |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | Confirming the plan supports another routine, before `CREATE_ROUTINE`. |
| `LB_INTERNAL_CREATE_ROUTINE` | Standing up the weekly ledger routine, on user approval. Works from an interactive session. Blocked only from inside a running routine. |
| `LB_INTERNAL_GET_ROUTINE_CONFIG` and `LB_INTERNAL_UPDATE_ROUTINE` | Editing that routine later. `UPDATE` replaces the whole prompt and the whole schedule, so always `GET` first. |

There is no Littlebird tool that searches past Littlebird chat conversations. Where a
message history is needed, `search_user_context` with `data_source: messages` is the tool.

Exact call shapes, with the parameters to substitute: the retrieval brief below.

## Trigger

Ask for it: "what did I promise", "what do people owe me", "who owes me what", "did I
follow up", "open action items", "what fell through the cracks", "weekly commitment
review", "chase my follow-ups".

Scheduled: the weekly routine below, whose report ends by naming this skill for the deep
run.

Do not trigger for: the follow-up message after one call (that is `meeting-scribe`), or an
unanswered thread where nothing was promised (that is `who-am-i-ghosting`).

## Routine cadence

Weekly. Default Monday 08:00 local, the schedule in the routine wiring section below.

Offer to create it from this session with `LB_INTERNAL_CREATE_ROUTINE`: show the user the
exact prompt text and the schedule, get approval through `AskUserQuestion`, then call it.
Do not tell the user to go set it up by hand.

| Mode | Trigger | Window | Output |
|---|---|---|---|
| **Weekly routine** | Scheduled, unattended | Last 7 days plus open carry-forward | A routine report, no files, no approvals |
| **Deep run** | User asks in Cowork or Claude Code | Last 30 days, or 90 on a first backfill | The full ledger file plus drafted nudges held for approval |

The routine observes. The deep run acts. A routine cannot create or update routines, and
cannot hold an approval gate open (`references/littlebird-mcp-reference.md`).

## Process

### 1. Fix the window and enumerate meetings

`LB_INTERNAL_LIST_MEETINGS` with `start_date`, `end_date`, and a `limit` high enough to
cover the window.

Split the result into recorded meetings, which carry an id, and unrecorded calendar
events, which do not and are not searchable. Count the unrecorded ones and report that
count as a coverage gap.

### 2. Harvest

`LB_INTERNAL_GET_MEETING` on every recorded id. Do not pull transcripts at this stage.

Full procedure in `references/harvesting-commitments.md`: the field list, the attribution
rule, the two-column split, the `Unassigned` third list, and the deduplication rule for
recurring meetings, where age runs from the earliest appearance and not the latest
restatement.

### 3. Verify

For each open item, search for the artifact the commitment would have produced, not for
the commitment text again.

Full procedure in `references/completion-verification.md`: the four statuses, the
four-step evidence sweep, the confidence rules for closing an item, and how to write an
absence so it reads as a finding rather than an accusation.

The governing rule: **"no evidence it was done" is not "it was not done"**. Report the
former.

### 4. Age and escalate

Buckets: fresh at 0 to 7 days, aging at 8 to 14, escalate at 15 and older. An item with a
stated deadline uses the deadline instead.

Full procedure in `references/escalation-and-nudges.md`: the four-tier ladder, the six
drafting requirements, the voice-skill check, the approval gate, and the separate
treatment for the owed-by-me column, which gets a forced decision at 15 days rather than a
nudge.

### 5. Log decisions

Full procedure in `references/decisions-log.md`: verbatim entries with decider and date,
supersession detection, contested entries, decisions that produced no action item, and the
single narrow case where a raw transcript quote is permitted.

## Retrieval brief

The actual calls. Substitute the window and the item under test.

**Enumerate the window**

```
LB_INTERNAL_LIST_MEETINGS
  start_date: first day of window
  end_date:   today
  limit:      50
```

**Prior instances of a recurring meeting** (name lookup uses LIST_MEETINGS, topic lookup
uses SEARCH_MEETINGS; using the wrong one is the most common mistake against this server)

```
LB_INTERNAL_LIST_MEETINGS
  name:       exact meeting title
  start_date: day after the origin meeting
  end_date:   today
```

**Did a later meeting confirm delivery**

```
LB_INTERNAL_SEARCH_MEETINGS
  query:      the deliverable, named as a noun
  start_date: day after the origin meeting
  end_date:   today
  limit:      10
```

Do not add `attendees`. That filter is OR and best-effort and can miss a matching meeting
entirely. Reword `query` instead.

**Downstream screen and message evidence** (five narrow queries beat one broad query and
avoid the oversized-result file dump)

```
search_user_context
  search_queries:          [deliverable plus counterparty name,
                            project name plus artifact type,
                            the tool the work happens in]
  search_queries_messages: [counterparty name plus deliverable noun,
                            "sent" plus deliverable noun]
  standalone_query:        a one sentence statement of what would prove this was done
  date_range:              {start: day after origin, end: "now"}
  filters:                 {data_source: "messages"}
```

Run the same shape again with `data_source: "snapshots"` for work-in-progress evidence,
and with `data_source: "summaries"` for the cheapest compressed view of each day.

**Prove absence deliberately**

```
search_user_context
  search_queries: [the application or artifact that would exist]
  date_range:     {start: day after origin, end: "now"}
  filters:        {app: the application name}
```

A negative answer here is a real finding. Report the filter and the window alongside it.

Read the relevance scores on everything. Items scoring 3 are maybes and never close a
commitment alone.

## Empty retrieval

If `LIST_MEETINGS` returns nothing for the window, or every meeting returned is an
unrecorded calendar event, report the window searched and the counts found, and stop.

If the harvest succeeds but the verification sweep returns nothing for every item, that is
a legitimate result. Mark every item `No evidence`, list the queries run, and say the
window produced no downstream signal.

Do not widen the window silently. Do not substitute plausible examples. Do not reason from
what was probably discussed (`references/evidence-standards.md`, rule 9).

## Output

A deep run writes one file:

```
commitment-ledger-YYYY-MM-DD.md
```

in the working directory, or the directory the user names. Sections, in this order:

1. **Coverage.** Window, meetings recorded, meetings not recorded, items harvested, items
   merged as duplicates, items dropped as not relevant.
2. **Owed by me.** Sorted by age descending. Each row: commitment verbatim, meeting, date,
   age, restatement count, stated deadline or `none stated`, status, evidence receipt
   where closed.
3. **Owed to me.** Same structure. Each open row carries its escalation tier and, where
   tier 1 or higher, the drafted nudge held for approval.
4. **Unassigned.** Items the summary could not attribute, presented for the user to claim,
   assign, or discard. Three options, one line each.
5. **Decisions log.** Every decision with its verbatim text, decider, date, room roster,
   and status of standing, superseded, or contested.
6. **Open questions.** From the `## Risks / Open Questions` blocks, with ages.
7. **Ledger statistics.** Counts computed from this run only.

Never open the report with an industry statistic about how many action items get
forgotten. Every circulating figure for that traces back to unsourced content marketing
(`references/research/distilled-commitment-tracking.md`, section 1). The only completion
rate this skill quotes is the one it computed from the user's own meetings, which has
receipts.

Raw retrieved capture is working data. It does not ship in the artifact
(`references/evidence-standards.md`, rule 7).

## Guardrail

Two risks, both specific to a ledger built out of other people's words.

**Attributing a commitment to the wrong person.** A ledger row is a written record that a
named person promised something, and the nudge that follows it is addressed to that person.
Get the owner wrong and the user chases someone who never agreed to anything. Raw
transcript chunks are weakly diarized and frequently tagged `[Others]`, and state of the
art diarization runs at 11 to 13 percent error
(`references/research/distilled-commitment-tracking.md`, section 4). So attribution comes
from the summary's tagged `## Action Items` and `## Decisions` lines, always, and a raw
transcript quote is admissible for wording only (`references/decisions-log.md`). An item
tagged `Unassigned` stays `Unassigned` and goes to the third list for the user to claim,
assign, or discard. It is never handed to the most likely candidate.

**Reporting "no evidence it was done" as "it was not done".** Those are different findings
and an empty sweep supports only the first. Verification proves what the record contains,
not what happened in the world: work done in a tool the capture never saw, or confirmed on
a call nobody recorded, leaves no trace and is still done. Write the status as the absence
it is, name the queries and the window that produced it, and let the user supply what the
record could not (`references/completion-verification.md`). Items scoring 3 on relevance
are maybes and never close a commitment alone. A nudge sent on a false negative tells a
person they dropped something they actually delivered, which costs more than the missed
follow-up would have.

### The approval gate, and the draft-never-send law

Nudges are drafted, never sent. Before any drafted text reaches another person, present
the item, its age, the evidence sweep that produced its status, the full draft text
verbatim, and the tier. Then use `AskUserQuestion` to offer: send as written, edit first,
hold, or close without contacting anyone.

The skill does not send. It hands approved text back. This holds even where a messaging or
email connector is present in the session, and even where the user already approved the
plan, because approving a plan is not approving the words. List the tools available before
mentioning any send path, and where no connector is present, produce a copy-paste block
with the recipient named. The degraded path is the normal path.

## Routine wiring

Create the weekly observer with `LB_INTERNAL_CREATE_ROUTINE`. Creating it generates a
first report immediately, then it runs on schedule.

```
title:    Weekly commitment ledger
schedule: {"frequency": "weekly", "time": "08:00", "week_days": ["MO"]}
notifications_enabled: true
email_notifications_enabled: true
```

Exact `prompt` text to pass:

```
You are maintaining a weekly commitment ledger from meeting summaries.

STEP 1. MEMORY FIRST. Before doing anything else, call
LB_INTERNAL_GET_ROUTINE_REPORTS for this routine with limit 5 and read every past
report. Build a list of every item you have already reported, with the age you gave
it and how many consecutive reports it has appeared in. You will need this in step 4.
Do not skip this step. A report that repeats last week's list unchanged is a failed
report.

STEP 2. HARVEST. Call LB_INTERNAL_LIST_MEETINGS for the last 7 days. Note how many
returned meetings are recorded, meaning they carry an id, and how many are calendar
events with no id. Call LB_INTERNAL_GET_MEETING on every recorded id. From each
summary take the Action Items block, the Decisions block, the Risks and Open
Questions block, and the For You section. Copy each item verbatim. Take the owner
from the tag on the item. Never take an owner from a transcript chunk, because
transcript chunks are weakly diarized and are often tagged Others. Do not fetch
transcripts.

STEP 3. SORT. Put items owned by the user, plus everything in For You, into a column
called Owed by me. Put items owned by another named person that come back to the
user into a column called Owed to me. Put items tagged Unassigned into a short
separate list. Never guess an owner for an Unassigned item. Drop items owned by
other people that have nothing to do with the user.

STEP 4. AGE AND ESCALATE. For every item, including ones carried over from past
reports, compute age from the date it was FIRST committed, not the date it was last
restated. Then apply this rule and follow it exactly:

  0 to 7 days: list it plainly, no action suggested.
  8 to 14 days: list it and suggest one first follow-up for the Owed to me column,
    or name the concrete next physical action for the Owed by me column.
  15 days and older: do NOT repeat what you said last week. Change the approach. For
    Owed to me, recommend a different channel from the one already tried and a
    framing that names what the delay is blocking, and ask for a date rather than
    for the deliverable. For Owed by me, present it as a decision with three
    options: do it, renegotiate the date with the person who is owed, or drop it and
    tell them.
  Appeared in 3 or more consecutive reports: open the report with this item under a
    heading called STUCK, state how many weeks it has been open, and recommend a
    live conversation instead of another written reminder. Do not list it again
    lower down.

STEP 5. VERIFY WHAT YOU CAN. For items carried over from past reports, check whether
they closed. Use LB_INTERNAL_SEARCH_MEETINGS with the deliverable as the query and a
start_date after the commitment date, and for recurring meetings use
LB_INTERNAL_LIST_MEETINGS with the name parameter to see whether the item reappears
in a later instance. If an item stopped appearing in a recurring meeting and nothing
confirms delivery, say it was dropped from the agenda with no completion evidence,
which is different from saying it was completed.

STEP 6. WRITE. Report in this order: STUCK items first if any exist, then Owed to me
with ages, then Owed by me with ages, then Unassigned items, then Decisions from this
week with their dates, then coverage, meaning how many meetings in the window were
recorded and how many were not.

RULES.
Absence of evidence is not evidence of absence. Write no evidence it was done, never
write it was not done.
Every item carries the meeting name and the meeting date.
Quote commitments verbatim from the summary. Do not paraphrase them.
Do not open with any statistic about how many action items people forget.
If LIST_MEETINGS returns nothing, say the window was empty and stop. Do not widen the
window and do not invent items.
Do not draft or send any message to anyone. Recommend, and stop there.
End with one line naming the deep run that resolves the report: open Cowork and run
commitment-tracker for the full ledger, evidence verification, and drafted nudges.
```

Two properties of that prompt are load-bearing and must survive any edit. It reads its own
past reports before writing, and it escalates rather than repeating. A routine without
both was observed in production flagging the identical blocked contact for 16 consecutive
days without ever changing its approach
(`references/escalation-and-nudges.md`).

`UPDATE_ROUTINE` replaces the whole prompt and the whole schedule. Always call
`LB_INTERNAL_GET_ROUTINE_CONFIG` first
(`references/littlebird-mcp-reference.md`).

### Handoff to Cowork

The routine ends by naming this skill. The deep run then calls
`LB_INTERNAL_GET_ROUTINE_REPORTS` on the ledger routine before harvesting, so it inherits
the carry-forward list, the restatement counts, and anything the user already marked held
or closed. Items the user closed in a previous run are never re-nudged
(`references/escalation-and-nudges.md`).

## Ship Gate

Ship Gate removed, research-only skill, produces no committable code.

## Related skills

| Skill | Relationship |
|---|---|
| `meeting-scribe` | Owns the first 24 hours after one call: the decisions record with quotes, the filtered follow-up draft, the unresolved list. It harvests commitments and hands them to this ledger rather than tracking them, and it adds one field this skill cannot compute, whether the commitment appeared in an outbound draft the user approved. Reach for it when the user wants a sendable recap of one meeting. |
| `who-am-i-ghosting` | Owns unanswered message threads, including ones where nothing was promised. This skill owns promises made in meetings, where the summary tag carries better attribution than a thread does. Reach for that one when the question is who is waiting on a reply. |
| `weekly-review` | Rolls this ledger up into the week, taking the counts and the dropped list rather than the ledger itself. Reach for it when the user wants the whole week and not commitments alone. |
| `routine-architect` | Audits the weekly routine when its reports start repeating, run long, or go unread. |
| Personal voice skills | Nudges draft through an installed personal voice skill (`references/escalation-and-nudges.md`). If none is installed, say so and point the user at this marketplace's voice creator skills. Never invent a voice profile. |

## Reference map

| File | Read it for |
|---|---|
| `references/harvesting-commitments.md` | Window, enumeration, the attribution rule, two-column sort, recurring-meeting dedup |
| `references/completion-verification.md` | The four statuses, the evidence sweep, confidence gates, aging buckets |
| `references/escalation-and-nudges.md` | The four-tier ladder, nudge drafting, voice check, approval gate |
| `references/decisions-log.md` | Decision entries, supersession, contested decisions, open questions |
| `references/littlebird-mcp-reference.md` | Tool names, parameters, return shapes, known limitations |
| `references/evidence-standards.md` | Receipts, the four kinds, confidence ratings, confirmation gates |
| `references/research/distilled-commitment-tracking.md` | Every domain claim in this skill, cited to a raw source |
| `references/research/README.md` | The archive index and its named gaps |
