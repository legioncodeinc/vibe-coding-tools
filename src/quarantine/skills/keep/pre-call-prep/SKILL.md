---
name: pre-call-prep
description: "Pre-call brief, meeting prep, prep me for my calls, what do I need to know before this meeting, who am I talking to, brief my day, call prep. Builds a one screen brief for every call on the calendar before it happens. Covers who is on it, what was said last time with the date, what each side committed to and whether it happened, objections they raised before, what changed on their side, three talking points and one thing not to forget. Runs as a nightly or early morning routine over tomorrow's calendar, or on demand for a single upcoming meeting. Requires the Littlebird MCP."
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan)"
---

# Pre-call prep

## Purpose

A real brief for every call on the calendar, delivered before the call. Not a calendar
dump.

The product is brevity. One screen per meeting, roughly a 90 second read, because the
reader is scanning on a phone in a three minute gap between calls
[references/research/distilled-call-preparation.md]. Depth goes in an appendix they can
open if they want it. A brief nobody reads before a call is worth nothing.

**The governing rule: every line must carry a fact the user did not already have in their
head.** The strongest study in the research archive is a preregistered field experiment
across 7,196 meetings which found that a contentless pre-meeting prompt produced no
significant effect on meeting effectiveness
[references/research/distilled-call-preparation.md]. Restating the agenda, telling the
user to set an objective, and reminding them to listen well are exactly that prompt. Cut
them.

## Capability gate

This skill requires the **Littlebird MCP on a Power or Pro plan**.

Before anything else:

1. **List the tools actually available in this session.** Do not assume tool names.
   Confirm that the Littlebird meeting tools, the routine tools, and
   `search_user_context` are present under their real names.
2. If the Littlebird MCP is not connected, **stop** and tell the user:
   "This skill needs the Littlebird MCP connected on a Power or Pro plan. Connect it at
   https://support.littlebird.ai/docs/mcp/ and run this again."
3. If the routine tools are missing but the meeting tools are present, run on-demand mode
   only and say the routine cannot be created from this session.
4. When the user asks to create the routine, call `LB_INTERNAL_GET_SUBSCRIPTION_STATUS`
   first to confirm the plan allows another routine.

Tool mechanics, parameters, and return shapes: `references/littlebird-mcp-reference.md`.

## Littlebird MCP calls used

| Tool | Used for |
|---|---|
| `LB_INTERNAL_LIST_MEETINGS` | Two jobs. **Discovery**, with `start_date` and `end_date` both set to the target day. A FUTURE `end_date` is what returns upcoming calendar events; they are never recorded, so they arrive as bare entries with attendees and no id, which is exactly what a brief needs [references/littlebird-mcp-reference.md]. That is the mechanism that makes this skill schedulable, because the routine does not have to be told which meetings exist, it asks. There is no Littlebird calendar tool and none is needed. **Prior instance by title**, with `name` set to the exact upcoming meeting title over the last 180 days. A recurring meeting is found by name here, never by search. |
| `LB_INTERNAL_SEARCH_MEETINGS` | Person and topic history over the last 365 days, twice per meeting: once on attendee name plus company, once on the substantive nouns in the upcoming title. Topic lookup uses this tool, and using it for a recurring title instead of `LIST_MEETINGS` with `name` is the most common mistake against this server. |
| `LB_INTERNAL_GET_MEETING` | The structured summary of the most relevant prior meeting: `## For You`, `## Action Items`, `## Decisions`, `## Risks / Open Questions`. Those blocks carry owner attribution and are the engine behind the open loops table. Also confirms an attendee match by checking the email on the linked calendar event. |
| `LB_INTERNAL_GET_MEETING_TRANSCRIPT` | Zero times by default. Pull only when a quote is needed and the summary does not carry it, and then for wording only, never to prove who said it. |
| `search_user_context` | Attendee identity per unresolved attendee, and the open loop evidence sweep per commitment, capped at four commitments per meeting. Narrow parallel `search_queries` and `search_queries_messages`, plus a `standalone_query` and a `date_range` running from the prior meeting date to now. |
| `LB_INTERNAL_GET_ROUTINE_REPORTS` | Step 0 of every routine run, `limit` 5, and the first call of an on-demand run so it inherits what the routine already found. Drives the changed-since-the-last-brief framing and the Stuck escalation. |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | Confirming the plan allows another routine, before `CREATE_ROUTINE`. |
| `LB_INTERNAL_CREATE_ROUTINE` | Creating the daily routine, on user approval. Works from an interactive session. Blocked only from inside a running routine. |
| `LB_INTERNAL_GET_ROUTINE_CONFIG` and `LB_INTERNAL_UPDATE_ROUTINE` | Changing that routine later. `prompt` and `schedule` each REPLACE the whole field, so always `GET` first. |

External research in step 4 uses whichever web tool the session happens to expose. That is
not a Littlebird tool, it is a separate connector, and it may be absent. List what is
available and degrade to internal record only.

Exact call shapes, with the parameters to substitute: the retrieval brief below.

## Trigger

Ask for it: "prep me for my calls", "what do I need to know before this meeting", "who am
I talking to", "meeting prep", "call prep", "pre-call brief", "brief me on my next call".

Scheduled: the daily routine below, which briefs every call on the target day's calendar.

Do not trigger for: the shape of the whole day rather than its calls (that is
`daily-brief`), a deep dossier on one individual (that is `osint-investigator`), or the
recap after a call has already happened (that is `meeting-scribe`).

## Routine cadence

Daily, and this is the primary mode. Default 18:30 local the evening before, with an early
morning alternative at 06:45. Ask the user which one before creating it. Evening before is
the default because it leaves time to act on a forgotten commitment; early morning is
fresher but leaves no room to fix anything.

Offer to create it from this session: show the user the exact prompt text and the schedule,
get approval through `AskUserQuestion`, then call `LB_INTERNAL_CREATE_ROUTINE`. Both
`CREATE_ROUTINE` and `UPDATE_ROUTINE` work from an interactive session and are blocked only
from inside a running routine [references/littlebird-mcp-reference.md]. Do not tell the
user to go set it up by hand. Schedule, title, notification settings and the exact prompt
text: the routine wiring section below.

| Mode | Trigger | Window | Output |
|---|---|---|---|
| **Routine (primary)** | Scheduled, evening before or early morning | One day | A report per run, one screen per meeting |
| **On demand** | User asks about a specific or the next upcoming meeting | Next 48 hours, one meeting | A single brief plus an appendix |

Both modes run the same retrieval. On demand mode goes deeper on one meeting and may ask
the user clarifying questions. Routine mode is unattended and never asks.

## Process

### Step 1: find the calls

`LB_INTERNAL_LIST_MEETINGS` with a FUTURE `end_date` returns upcoming calendar events.
Upcoming events are never recorded, so they arrive as bare calendar entries with
attendees and no id, which is exactly what a brief needs
[references/littlebird-mcp-reference.md]. This is what makes the routine trivially
schedulable: it does not need to be told which meetings exist, it asks.

Full procedure, including the discovery calls per mode, the recorded-versus-upcoming id
check, the booking description handling, and the meeting classifier:
**`references/upcoming-meeting-discovery.md`**.

If the window returns nothing, go to the zero meetings branch below.

### Step 2: resolve the attendees

Calendar invites carry emails and sometimes display names. Match them to the internal
record on a four rung ladder, record which rung matched because that becomes the
confidence rating, and **flag ambiguous matches rather than guessing**. A brief that
attaches the wrong person's history to an attendee will be believed and acted on.

Full procedure, the ladder, the confidence table, the ambiguity flag format, and the large
roster rule: **`references/attendee-resolution.md`**.

### Step 3: pull the history

The single most common retrieval mistake against this server is looking a meeting up the
wrong way. **A recurring meeting's prior instance is found by TITLE using
`LB_INTERNAL_LIST_MEETINGS` with `name`. A topic is found using
`LB_INTERNAL_SEARCH_MEETINGS` with `query`** [references/littlebird-mcp-reference.md].
Get this right or the recurring briefs will silently have no history in them.

Then mine `LB_INTERNAL_GET_MEETING`'s structured summary rather than re-deriving from
transcript. Its `## Action Items` and `## For You` blocks carry owner attribution and are
the engine behind the open loops table
[references/littlebird-mcp-reference.md].

Full procedure, including the open loop evidence sweep, the quoting rules, the objection
sources, the external research step, and the per-meeting query budget:
**`references/history-retrieval.md`**.

### Step 4: external research on what changed

**List the web tools available in this session and pick one. Do not assume a specific web
tool exists.** Environments differ. If no web tool is available, write
"no external research tool available this run, internal record only" and continue. That
is an acceptable brief. Fabricated company news is not.

Cap: three queries per distinct company, deduplicated across the day, three lines maximum
in the brief. Every external line carries its URL and is reported as "their site says X",
never as "X" [references/evidence-standards.md].

### Step 5: write the brief

Pick one shape per meeting. Do not blend them.

| Shape | When |
|---|---|
| Sales call | Prospect or active deal. Leads with what the record still cannot tell you. |
| Partner sync | Reciprocal. Symmetrical open loops table is the centerpiece. |
| Recurring standup or internal recurring | Delta only. No profiles, no background, no external. |
| Client review | Existing customer. Unresolved complaint goes at the top. |
| Large multi-attendee logistics | Above 7 attendees. Briefs the user's slice, not the room. |
| First meeting | No internal record. Mostly external plus the booking description. |

Templates for all six, the precedence rules when a meeting fits two, the length
enforcement rule, and the list of things that never appear in any brief:
**`references/brief-formats-by-meeting-type.md`**.

## Retrieval brief

The actual calls this skill makes. Substitute real dates; do not leave placeholders in a
live call.

**Discovery, once per run**

```
LB_INTERNAL_LIST_MEETINGS
  start_date: <target day>
  end_date:   <target day>
  limit:      50
```

**Prior instance by title, once per meeting**

```
LB_INTERNAL_LIST_MEETINGS
  name:       "<exact upcoming meeting title>"
  start_date: <today minus 180 days>
  end_date:   <today>
  limit:      10
```

**Person and topic history, twice per meeting**

```
LB_INTERNAL_SEARCH_MEETINGS
  query:      "<attendee name> <company>"
  start_date: <today minus 365 days>
  end_date:   <today>
  limit:      10
```

```
LB_INTERNAL_SEARCH_MEETINGS
  query:      "<substantive nouns from the upcoming meeting title>"
  start_date: <today minus 365 days>
  end_date:   <today>
  limit:      10
```

**Structured summary, once or twice per meeting**

```
LB_INTERNAL_GET_MEETING
  meeting_id: <id of the most relevant prior meeting>
```

**Transcript, zero times by default.** Pull only when a quote is needed and the summary
does not carry it.

**Attendee identity, per unresolved attendee**

```
search_user_context
  search_queries:          ["<full email>", "<display name>", "<display name> <company>"]
  search_queries_messages: ["<display name>", "<email local part>"]
  standalone_query:        "Who is <display name>, what do they do, and what has the user discussed with them"
  date_range:              {"start": "<today minus 365 days>", "end": "now"}
```

**Open loop evidence, per commitment, capped at 4 commitments per meeting**

```
search_user_context
  search_queries:          ["<3 to 6 distinctive words from the commitment>"]
  search_queries_messages: ["<same words>", "<person name> <deliverable noun>"]
  standalone_query:        "Evidence that <commitment> was completed after <prior meeting date>"
  date_range:              {"start": "<prior meeting date>", "end": "now"}
```

Prefer several narrow parallel queries over one broad one, both for relevance and to
avoid the oversized-result file dump [references/littlebird-mcp-reference.md].

## Evidence standards

Every line in every brief obeys `references/evidence-standards.md`. The rules that bite
hardest here:

- **Receipts.** Every internal claim carries one. Meeting claims cite the meeting name,
  its date, and the summary section the claim came from.
- **Observed, inferred, external, unknown.** Each line is exactly one of these and the
  reader can tell which. Never promote an inference by dropping the hedge.
- **Absence is not a negative finding.** Write "no evidence in the record since
  2026-07-29", never "they did not do it". This matters most in the open loops table,
  where the difference decides whether the user walks into a call apologizing for
  something they actually did.
- **Attribution guardrail.** Capture shows what the user was VIEWING, not necessarily
  what they wrote. A transcript chunk tagged `[Others]` proves someone said it, not who.
  Take speaker attribution from the summary's Action Items and Decisions blocks.
- **Partial rosters are reported as partial**, with resolved, unresolved, and total counts.
- **Sensitive categories stay out.** Health, financial detail, legal history, family
  circumstances, protected characteristics, and precise home location do not belong in a
  pre-call brief even when the capture contains them.
- **Confirm before encoding.** In on-demand mode, anything about to be written down as a
  durable fact about a person gets confirmed with `AskUserQuestion` first. Routine mode
  cannot ask, so routine mode does not encode durable facts; it reports with hedges.
- **Raw capture never ships.** Process retrieved material in temp space, produce the
  brief, delete the raw.

## Empty retrieval

Three distinct empty cases, three distinct behaviors. None of them fabricate.

**No meetings on the calendar.** Write exactly:

```
No calls on the calendar for <date>. Nothing to brief.
```

Stop. Do not summarize yesterday. Do not find something else to say. A routine that
manufactures content on an empty day trains the user to stop reading it.

**Meetings exist, the record knows nothing about them.** Write the honest short brief:
who the calendar says is coming, what the description says verbatim, what external
research found, and an explicit "first meeting, nothing in the record" line. A 30 minute
call with someone new, briefed as "here is what the calendar says and nothing else", is
an honest and useful brief. Template in
`references/upcoming-meeting-discovery.md`.

**A specific retrieval came back empty.** Name the gap in place. "No prior instance found
for this title in the last 180 days." "No evidence in the record that the SOC 2 report
was sent." Do not pad from training data, do not reason from what would probably be
there, do not substitute plausible examples [references/evidence-standards.md].

## Output

**Routine mode** produces one Littlebird routine report per run, titled
`Pre-call brief for <weekday>, <Month D, YYYY>`. Structure:

1. One line header: how many calls, total scheduled hours, first call time.
2. One section per meeting in chronological order, one screen each, in the shape chosen
   by the classifier.
3. A single appendix at the bottom, headed `## Appendix`, with one subsection per meeting
   that needed depth: full rosters, longer quotes, additional history. Nothing in the
   appendix is required reading.

**On-demand mode** produces a file at `pre-call-prep-<YYYY-MM-DD>-<slug>.md` in the
working directory, where `<slug>` is a kebab-case fragment of the meeting title. Same
structure, one meeting, deeper appendix. State the path to the user when done.

Both modes carry a final line naming the retrieval date and the tool set used, so a
reader can tell how fresh the brief is.

## Guardrail

Two risks, both about a person who is not in the room while the brief is being written.

**Fabricating detail about an attendee.** The brief is read in the three minutes before a
call and every line in it will be believed and acted on, which means an invented line gets
said out loud to the person it was invented about. Three ways a line gets invented here,
each with its rule:

1. **Attaching one person's history to another person's email.** A display name match is
   not an identity match. Record which rung of the ladder matched, treat that as the
   confidence rating, and where two people in the record share a name or the domain does
   not match any past record, write "Ambiguous" with both readings and attach NO history to
   that attendee. Flag rather than guess
   [references/attendee-resolution.md].
2. **Filling "what changed on their side" from training data.** If no web tool is available
   in this session, the correct output is the line "no external research tool available
   this run, internal record only". That is an acceptable brief. Invented company news is
   not. Every external line carries its URL and is reported as "their site says X", never
   as "X".
3. **Hardening an absence into a negative.** "No evidence in the record since 2026-07-29"
   is a finding. "They did not send it" is an accusation the record does not support. This
   one bites hardest in the open loops table, where the difference decides whether the user
   opens a call apologizing for something they actually did
   [references/evidence-standards.md].

**Pulling only context the user legitimately has.** Every internal line in a brief comes
from the user's own record: their meetings, their messages, their screen capture, plus
public external sources carrying a URL. This is preparation for a conversation the user is
already having, not a background check on the other side. The limits that enforce that are
the evidence standards above, and the two that carry the most weight here are the sensitive
categories, which stay out of a brief even when the capture contains them, and the
confirmation gate, which means on-demand mode asks before writing anything down as a
durable fact about a person and routine mode, which cannot ask, encodes none.

The rest follows from the same position. Above 7 attendees, brief the user's slice rather
than profiling the room. Raw capture is processed and deleted, never shipped. External
lines are public sources with a URL attached, capped at three per company, and reported as
what the source says.

The brief is an internal artifact for the user's own reading. Nothing in it is sent to an
attendee, and this skill drafts no outbound message. Anything that needs to reach the other
side goes through a skill that holds an approval gate on the actual final text.

## Routine wiring

Create with `LB_INTERNAL_CREATE_ROUTINE`. Recommended schedule, evening before:

```
{"frequency": "daily", "time": "18:30"}
```

Early morning alternative:

```
{"frequency": "daily", "time": "06:45"}
```

Times are in the user's local timezone [references/littlebird-mcp-reference.md]. Ask the
user which they want before creating. Evening before is the default because it leaves
time to act on a forgotten commitment; early morning is fresher but leaves no room to fix
anything.

Title: `Pre-call brief`

**`notifications_enabled`: true. `email_notifications_enabled`: true.** A brief that
arrives without a notification is a brief nobody reads.

`LB_INTERNAL_CREATE_ROUTINE` and `LB_INTERNAL_UPDATE_ROUTINE` are NOT available from
inside a running routine [references/littlebird-mcp-reference.md]. Create it from an
interactive session only. To change it later, call `LB_INTERNAL_GET_ROUTINE_CONFIG`
first, because `prompt` and `schedule` each REPLACE the whole field
[references/littlebird-mcp-reference.md].

### The exact routine prompt text

Pass this verbatim as `prompt`. Adjust only the target day line if the user picks morning
mode.

```
Build a pre-call brief for every call on my calendar tomorrow.

STEP 0. READ YOUR OWN PAST REPORTS FIRST.
Call LB_INTERNAL_GET_ROUTINE_REPORTS for this routine with limit 5 before you retrieve
anything else. You are looking for three things:
  a) Which meetings you have already briefed. A recurring meeting must NOT be briefed
     identically week after week.
  b) Which open commitments you flagged in earlier reports and whether they are still open.
  c) Any item you have now flagged in three or more consecutive reports.
If you have briefed this exact meeting title before, do not restate the relationship. Lead
that meeting's section with what CHANGED since your last report on it, and say explicitly
what did not change. If nothing changed, say "Nothing changed since the last brief" in one
line and move to the next meeting.
ESCALATION RULE: any open item that has appeared in three or more consecutive reports gets
its own line at the top of today's report under the heading "Stuck", with the number of
runs it has been open and a one line instruction to escalate it or drop it. Do not flag
the same item a fourth time in the same words.

STEP 1. FIND THE CALLS.
Call LB_INTERNAL_LIST_MEETINGS with start_date and end_date both set to tomorrow's date
and limit 50. A future end_date returns upcoming calendar events. Upcoming events are
never recorded, so they come back as bare calendar entries with attendees and no id.
Discard any returned entry that HAS an id and a start time in the past: that is a recorded
past meeting, not an upcoming call.
If there are no upcoming entries, write exactly this as the whole report and stop:
"No calls on the calendar for <date>. Nothing to brief."

STEP 2. RESOLVE ATTENDEES.
For each call, take the attendee emails and display names off the invite. Exclude my own
address. For each other attendee, in this order: search LB_INTERNAL_SEARCH_MEETINGS for
the display name over the last 365 days and confirm any hit with LB_INTERNAL_GET_MEETING
by checking that the attendee email matches; then search_user_context with narrow parallel
queries on the full email, the display name, and the display name plus the company implied
by the email domain; then search_user_context on the email domain alone, which resolves
the COMPANY and not the person.
Flag rather than guess. If two people in the record share a name, or the display name
matches but the email domain does not match any past record, write "Ambiguous" with both
readings and attach NO history to that attendee. Never attach one person's history to
another person's email on a guess.

STEP 3. PULL HISTORY.
For each call, first look for a prior instance BY TITLE: LB_INTERNAL_LIST_MEETINGS with
name set to the exact upcoming meeting title, start_date 180 days ago, end_date today,
limit 10. This is the correct tool for recurring meetings and using SEARCH_MEETINGS
instead is the most common mistake here. If the exact title returns nothing, retry once
with the title minus instance markers such as a date or week number.
Then run LB_INTERNAL_SEARCH_MEETINGS twice over the last 365 days: once on the attendee
name plus company, once on the substantive nouns in the upcoming title.
Then call LB_INTERNAL_GET_MEETING on the most relevant prior meeting and take your content
from its structured summary sections: For You, Action Items, Decisions, Risks / Open
Questions. Those sections carry owner attribution. Do NOT pull the full transcript unless
you need an exact quote the summary does not carry, and if you do quote a transcript,
quote it for wording only and never to prove who said it.

STEP 4. OPEN LOOPS, BOTH DIRECTIONS.
From the prior meeting's Action Items and For You blocks, build a table of what each side
committed to, with an owner column and a status column. For each commitment run ONE narrow
search_user_context over the window from the prior meeting date to now, looking for
evidence it happened. Cap at four commitments per meeting.
Status is exactly one of: "Done" with a dated receipt, "No evidence in the record since
<date>", or "Unknown". "No evidence" is NOT the same as "did not happen" and you must not
write it as if it were.

STEP 5. OBJECTIONS.
From the prior meeting's Risks / Open Questions and Topics Discussed, list concerns the
other side raised, and for each one say how it was handled if the record contains a
response. If the record contains no response, say so. Do not reconstruct what I probably
said.

STEP 6. WHAT CHANGED ON THEIR SIDE.
List the web research tools available to you in this run and pick one. Do not assume a
specific tool exists. Run at most three queries per distinct company, deduplicated across
the day: recent funding or acquisition or launch, public activity by the specific
attendee, and general recent news. Cap at three lines per company. Cite a URL on every
external line and report external claims as "their site says X", never as "X".
If no web tool is available, write "no external research tool available this run, internal
record only" and continue. Do not invent company news.

STEP 7. WRITE IT.
One screen per meeting, target a 90 second read for the whole report. Chronological order.
Every line must carry a fact I did not already have in my head: no restated agendas, no
advice about how to run a meeting, no talking point that is not grounded in something you
actually retrieved.
Pick the shape per meeting:
  - More than 7 attendees: brief MY slice only. What I own, the two or three people who
    matter to my slice, my open items. Roster count line stating resolved, unresolved and
    total. Do not profile everyone.
  - Recurring internal meeting: delta only. No profiles, no company background, no
    external research.
  - Existing customer review: any unresolved complaint goes at the TOP, above anything I
    want to talk about.
  - Prospect or active deal: include a line naming what the record still cannot tell me,
    such as who the economic buyer is or how the decision gets made.
  - No internal record for any attendee: this is a first meeting. Quote the calendar
    description verbatim, because a booking form answer stating why they booked is the
    most useful line available. Do not paraphrase it and do not extrapolate from it.
Each meeting section ends with three talking points and one line headed "Do not forget".
Put full rosters, longer quotes, and extra history in a single "Appendix" section at the
bottom. Nothing in the appendix is required reading.

EVIDENCE RULES, NON NEGOTIABLE.
Every internal claim carries a receipt naming the meeting and its date, or the capture
timestamp and app. Mark each line as observed, inferred, external, or unknown, and never
drop the hedge off an inference. Screen capture shows what I was VIEWING, not necessarily
what I wrote. Partial rosters are reported as partial with counts. Keep health, financial
detail, legal history, family circumstances, protected characteristics, and home location
out of every brief even if the capture contains them. If a retrieval comes back empty, say
so and move on. Never pad an empty result with plausible content.

Title the report: Pre-call brief for <weekday>, <Month D, YYYY>.
```

### Handoff to Cowork

The routine observes and reports. It cannot write files, cannot ask the user anything, and
cannot create or modify routines [references/littlebird-mcp-reference.md]. When a brief
surfaces something that needs work, for example a commitment with no evidence it shipped,
the report names it under "Stuck" and the user opens Cowork. There, this same skill runs
in on-demand mode, calls `LB_INTERNAL_GET_ROUTINE_REPORTS` to read what the routine
already found, and goes deeper on the one meeting.

Do not ask the routine to draft outreach, send anything, or produce a file. It cannot
finish that unattended in one pass.

## Ship Gate

Ship Gate removed, research-only skill, produces no committable code.

## Related skills

| Skill | Relationship |
|---|---|
| `osint-investigator` | Goes deep on one person and produces a dossier. This skill gives one screen on everyone in tomorrow's calls. Reach for the investigator when a single individual warrants real research, not when a call needs a brief. |
| `client-health-radar` | Owns account-level relationship health across the whole book. This skill covers the counterparties on one meeting. Reach for the radar when the question is which accounts are drifting rather than what to say at 10am. |
| `daily-brief` | Owns the shape of the day and gives one clause per meeting, then points here for per-meeting depth rather than inlining it. It runs in the morning, this runs the evening before. Reach for it when the user wants the day, not the call. |
| `meeting-scribe` | The other half of the meeting cycle. This skill runs before the call, that one runs after and produces the recap, the decisions record, and the unresolved list. |
| `commitment-tracker` | Owns the standing commitment ledger this skill samples for its open loops table. Reach for it when the question is every open commitment rather than the ones attached to one call. |

## Reference index

| File | What it covers |
|---|---|
| `references/upcoming-meeting-discovery.md` | The future `end_date` mechanic, discovery calls per mode, the id check, booking descriptions, the meeting classifier, the zero meetings branch |
| `references/attendee-resolution.md` | Email and display name to internal record, the four rung ladder, confidence by rung, ambiguity flagging, large rosters |
| `references/history-retrieval.md` | Prior instance by title, summary mining, quoting rules, open loops and the evidence sweep, objections, external research, query budget |
| `references/brief-formats-by-meeting-type.md` | Six brief shapes with templates, shape precedence, length enforcement, what never appears |
| `references/littlebird-mcp-reference.md` | Tool inventory, parameters, return shapes, known limitations |
| `references/evidence-standards.md` | Receipts, the four kinds of line, confidence ratings, attribution guardrail, confirmation gates |
| `references/research/distilled-call-preparation.md` | Cited distillation of the call preparation research, including the conflict on whether preparation helps and the list of numbers this skill refuses to restate |
| `references/research/README.md` | Archive layout, sweep coverage, source quality |
| `references/research/raw/` | Twelve archived sources, each with title, URL, fetch date, source type |
