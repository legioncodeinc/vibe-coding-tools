---
name: daily-brief
description: "Morning brief, daily digest, what's on today, brief me on my day, start my day, daily rundown, what do I need to know today, what changed since yesterday, what should I do first. Builds one screen covering today's schedule with a reason each meeting matters, the commitments actually due, what went cold, the genuinely important unread threads, one highest-leverage action with its reasoning shown, and what changed since yesterday. Rolls up sibling routine reports rather than re-deriving them. Runs as a daily routine, or on demand. Requires the Littlebird MCP."
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan)"
---

# Daily brief

## Purpose

One screen every morning covering the whole day: the schedule compressed, the commitments
actually due, what went cold, the unread threads that genuinely need a reply, the one
highest-leverage thing to do, and what changed since yesterday.

**This skill is designed around a single constraint, and the constraint is honest: daily
digests are the most-abandoned category of recurring automation there is.** A brief that
restates the calendar is deleted within a week. Daily is the hardest cadence to sustain,
and the archive says so directly: daily sending is where fatigue "shows up most clearly",
and a daily cadence "raises the bar significantly" for content quality
[references/research/distilled-daily-brief-design.md]. Two of the three top unsubscribe
reasons, lost interest and irrelevant content, are the same failure at different distances:
the digest stopped saying anything about the reader's actual situation
[references/research/distilled-daily-brief-design.md].

So every design decision in this skill exists to earn the open again the next day. The
length ceiling, the quiet-day rule, the precision bar, the mandatory delta field, and the
defended one thing are all the same mechanism seen from different sides.

**This skill owns the whole-day view. It does not own per-meeting depth.** That is
`pre-call-prep`, and daily-brief points at it rather than inlining it.

## Capability gate

This skill requires the **Littlebird MCP on a Power or Pro plan**.

Before anything else:

1. **List the tools actually available in this session.** Do not assume tool names. Confirm
   that the meeting tools, the routine tools, and `search_user_context` are present under
   their real names.
2. If the Littlebird MCP is not connected, **stop** and tell the user: "This skill needs the
   Littlebird MCP connected on a Power or Pro plan. Connect it at
   https://support.littlebird.ai/docs/mcp/ and run this again."
3. If the meeting tools are present but the routine tools are missing, run on-demand mode
   only and say the routine cannot be created from this session.
4. Before creating the routine, call `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` to confirm the
   plan allows another routine. Routine count is plan-limited, so if the account is at its
   limit, name which existing routine should be replaced rather than proposing an addition
   [references/littlebird-mcp-reference.md].

Tool mechanics, parameters, and return shapes: `references/littlebird-mcp-reference.md`.

## Littlebird MCP calls used

| Tool | Used for |
|---|---|
| `LB_INTERNAL_GET_ROUTINE_REPORTS` | Own memory, and the sibling rollup. Both are mandatory. |
| `LB_INTERNAL_LIST_ROUTINES` | Discovering which sibling routines exist and whether their reports are fresh |
| `LB_INTERNAL_LIST_MEETINGS` | Today's calendar, via a future `end_date`. Also recent recorded meetings for due Action Items |
| `LB_INTERNAL_GET_MEETING` | The `## Action Items` and `## For You` sections of recent meetings, which already carry owner attribution |
| `search_user_context` | Direct asks and waiting language with `data_source: messages`, and yesterday's activity with `data_source: summaries` |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | The plan and routine-slot check before creating the routine |
| `LB_INTERNAL_CREATE_ROUTINE` | Creating the daily routine, from an interactive session only |
| `LB_INTERNAL_GET_ROUTINE_CONFIG` and `LB_INTERNAL_UPDATE_ROUTINE` | Changing the routine later. Read the config first, because `prompt` and `schedule` each replace the whole field |

Never used by this skill: `LB_INTERNAL_GET_MEETING_TRANSCRIPT`. A daily brief has no budget
for transcript reading, and the structured summary carries better attribution anyway
[references/littlebird-mcp-reference.md].

## Trigger

Trigger phrases: morning brief, daily digest, brief me on my day, what's on today, start my
day, daily rundown, what do I need to know today, what changed since yesterday, what should
I do first, set up my morning brief.

Do not trigger for: a single upcoming meeting (that is `pre-call-prep`), a full commitment
ledger (that is `commitment-tracker`), or a per-client risk view (that is
`client-health-radar`).

## Routine cadence

Daily. Primary mode.

**The timing position, taken deliberately: morning-of, roughly 45 minutes before the user's
first real decision of the day. Not the night before.**

The reasoning, and the honest limits of it:

1. **The load-bearing field is what changed since yesterday.** A night-before brief
   structurally cannot see the overnight window, which is where a large share of the delta
   comes from. Generating before the last hours of signal damages the exact field that earns
   the open.
2. **Within-session decision quality degrades modestly**, so a hard decision is better
   surfaced before the session starts. Adjusted odds of an inappropriate prescription rose
   to 1.26 by the fourth hour of a clinic session, P less than .001 for trend
   [references/research/distilled-daily-brief-design.md]. That is a real, measured, modest
   effect. The far more famous parole result that would have supported a stronger claim is
   largely a statistical artifact, and this skill does not lean on it
   [references/research/distilled-daily-brief-design.md].
3. **The night-before slot is already taken, and correctly so.** `pre-call-prep` runs in the
   evening because a per-meeting brief needs slack to fix a forgotten commitment before the
   call. Two routines, two times, one reason each. That is composition, not duplication.

**Do not hardcode an early clock hour.** There is no universal peak hour. The chronotype
finding is an interaction, not a main effect: at 08:00 early chronotypes outperformed late
ones by 8.4% on vigilance and 5.9% on executive function, and late chronotypes "were
significantly impaired in all measures in the morning"
[references/research/distilled-daily-brief-design.md]. Ask the user what time they make
their first real decision of the day and set the schedule 45 minutes before that. A default
of 07:00 is a starting point to be adjusted, not a recommendation.

Consistency matters more than elaboration: a short brief at the same time every day is the
supported shape, and a longer richer one is not
[references/research/distilled-daily-brief-design.md].

**Two modes.**

| Mode | Trigger | Output |
|---|---|---|
| **Routine (primary)** | Scheduled daily | One routine report per run, at or under 220 words |
| **On demand (secondary)** | User asks | The same brief plus an appendix, written to a file |

## Process

### Step 1: read your own past reports

Mandatory, first, before any content retrieval. `LB_INTERNAL_GET_ROUTINE_REPORTS` on this
routine with `limit: 7`. Build the list of every item already reported and how many
consecutive runs each has appeared in. That count drives the escalation rule.

A routine prompt that does not instruct the model to read its own previous reports will
repeat itself indefinitely [references/littlebird-mcp-reference.md].

### Step 2: roll up the siblings, do not re-derive them

`LB_INTERNAL_LIST_ROUTINES`, then `LB_INTERNAL_GET_ROUTINE_REPORTS` with `limit: 2` on each
matched sibling. If `commitment-tracker` and `client-health-radar` routines exist and are
fresh, take their findings instead of re-running their retrieval.

This is the named feature of the skill: **read, do not re-derive.** A sibling report is
already distilled, already carries receipts and owner attribution, and already carries its
own escalation state. Re-deriving produces a second, slightly different answer to a question
that was already answered.

The mapping table, the freshness gate, the attribution rules, and the fallback queries for
when a sibling is absent or stale: **`references/rollup-composition.md`**.

### Step 3: retrieve what the siblings did not cover

Today's calendar, then only the uncovered sections. Full call list in the retrieval brief
below.

### Step 4: compute the delta

Diff today's item set against the last report's. Four buckets: New, Resolved, Moved, Aged.
Aged items never appear in the delta section, because an item that did not change is not a
change. If fewer than two items are New, Resolved, or Moved, the brief drops to short form.

The delta rules, the novelty floor, the escalation tiers, the quiet-day rule, the precision
bar with its named negative cases, and the banned-content list:
**`references/earning-the-open.md`**.

### Step 5: pick the one thing and defend it

One action, chosen from a candidate pool built out of what was already retrieved, scored on
deadline, blocking, cost of one more day, and fit against today's actual calendar. Written
with a window taken from a real gap, a receipt, and a one-line beat clause naming the
runner-up and the comparison that decided it.

**An unexplained pick gets ignored, so the beat clause is mandatory.** A Low-confidence claim
never becomes the one thing.

Candidate generation, scoring, the output shape, the size bound, the two no-pick cases, and
the repeat handling: **`references/the-one-thing.md`**.

### Step 6: write it, then count and cut

Block one at or under 110 words, total at or under 220. Then count the words and, if over,
delete whole lowest-ranked items until under. **Cut items, never cut evidence.**

A stated ceiling does not produce a ceiling. In a live Littlebird account, a routine whose
prompt says "Keep the total output under 200 words" produced reports that run past it
[references/research/distilled-daily-brief-design.md, and routine-architect failure mode 7].
That is why the ceiling appears as per-section caps, per-section overflow rules, an explicit
count-and-cut step, and a ban on fake compression, all four together.

The template, the derivation of the numbers, the detail scaling table, section suppression,
and the two short forms: **`references/brief-format-and-ceiling.md`**.

## Retrieval brief

The actual calls. Substitute real dates; never leave a placeholder in a live call.

**Own memory, once per run**

```
LB_INTERNAL_GET_ROUTINE_REPORTS
  routine_id: [this routine's id]
  limit:      7
```

**Sibling discovery and rollup, once per run plus once per matched sibling**

```
LB_INTERNAL_LIST_ROUTINES
  limit: 25
```

```
LB_INTERNAL_GET_ROUTINE_REPORTS
  routine_id: [sibling id]
  limit:      2
```

**Today's calendar, once per run.** A future `end_date` returns upcoming calendar events
[references/littlebird-mcp-reference.md].

```
LB_INTERNAL_LIST_MEETINGS
  start_date: [today]
  end_date:   [today]
  limit:      50
```

**Due commitments, only when no commitment-tracker sibling reported**

```
LB_INTERNAL_LIST_MEETINGS
  start_date: [today minus 14 days]
  end_date:   [today]
  limit:      25
```

then, on the three most recent entries that carry an id:

```
LB_INTERNAL_GET_MEETING
  meeting_id: [id]
```

Read only `## Action Items` and `## For You`. Those sections already carry owner attribution
[references/littlebird-mcp-reference.md].

**Direct asks and waiting language, once per run**

```
search_user_context
  search_queries_messages: ["can you send", "any update on", "still waiting on", "did you get a chance",
                            "need this from you", "by end of day", "before Friday", "following up"]
  standalone_query:        "Messages where someone asked me for something specific with a date and I have not answered"
  date_range:              {"start": "[today minus 4 days]", "end": "now"}
  filters:                 {"data_source": "messages"}
```

**Yesterday's activity, once per run.** The summaries source is the cheapest way to get a
compressed view of a day [references/littlebird-mcp-reference.md].

```
search_user_context
  search_queries:   ["what I worked on", "decisions made", "commitments made"]
  standalone_query: "What happened yesterday that changes what matters today"
  date_range:       {"start": "[yesterday]", "end": "[today]"}
  filters:          {"data_source": "summaries"}
```

**Cold check, only when no client-health-radar sibling reported**

```
search_user_context
  search_queries_messages: ["waiting to hear back", "any update on", "circling back", "following up on"]
  standalone_query:        "Threads where the other person asked something and the last message is theirs, not mine"
  date_range:              {"start": "[today minus 21 days]", "end": "[today minus 4 days]"}
  filters:                 {"data_source": "messages"}
```

Prefer several narrow parallel queries over one broad one, both for relevance and to avoid
the oversized-result file dump [references/littlebird-mcp-reference.md].

## Evidence standards

Every line obeys `references/evidence-standards.md`. The rules that bite hardest here:

- **Receipts on every line.** Meeting claims cite the meeting name, date, and summary
  section. Message claims carry the collection time, app, thread, and the send time, which
  is a different value.
- **Observed, inferred, external, unknown.** Each line is exactly one, visibly. The one thing
  is an inference by construction and carries the observations it rests on.
- **Absence is not a negative finding.** "No evidence in the record since 2026-07-29", never
  "they did not do it".
- **Confidence ratings.** A Low-confidence claim never becomes the one thing and never gets
  an urgency label.
- **Attribution guardrail.** Capture shows what the user was viewing, not necessarily what
  they wrote. An item whose only evidence is a document on screen is not a commitment.
- **Relevance scores.** Anything scored 3 is a maybe. Do not build a flagged item on a single
  3-scored result without corroboration [references/littlebird-mcp-reference.md].
- **Rolled-up claims keep the sibling's hedge and the sibling's confidence.** Never restate a
  sibling more confidently than the sibling did.
- **Sensitive categories stay out.** Health, financial detail, legal history, family
  circumstances, protected characteristics, and precise home location, even where the
  capture contains them.
- **Raw capture never ships.** Process in temp space, produce the brief, delete the raw.
- **Confirm before encoding.** On-demand mode confirms with `AskUserQuestion` before writing
  down a durable fact about a person or a number. Routine mode cannot ask, so routine mode
  does not encode durable facts; it reports with hedges.

## Draft never send

This skill drafts and holds. Nothing is sent, posted, published, or written into a
third-party system without the user approving the actual final text through
`AskUserQuestion`. Approving a plan is not approving the words. This applies even where a
Gmail, Slack, or CRM connector is connected in the session. If the user asks daily-brief to
send a nudge, hand off to `commitment-tracker`, which owns nudge drafting.

If a connector is needed, **list the available tools first** and degrade gracefully when it
is absent: produce a copy-paste block instead of assuming a connector exists.

## Empty retrieval

Four distinct empty cases, four distinct behaviors. None of them fabricate.

**Quiet day: everything retrieved, nothing met the bar.** Two lines, per the quiet-day rule
in `references/earning-the-open.md`. Do not skip the run and do not pad. This is the
expected outcome on a real quiet day.

**No meetings on the calendar.** Print the schedule line as `Schedule: nothing on the
calendar.` and continue. An empty calendar is not an empty brief; commitments and threads
still matter.

**One retrieval came back empty.** Suppress that section entirely and say nothing about it.
An empty section is not printed [references/brief-format-and-ceiling.md].

**Everything came back empty.** Report the gap and stop:

```
No Littlebird data retrieved for this window. Nothing to brief. This usually means capture
was off or the account has no recent activity.
```

Never pad from training data, never reason from what would probably be there, never
substitute plausible examples [references/evidence-standards.md].

## Output

**Routine mode** produces one Littlebird routine report per run, titled
`Daily brief for [weekday], [Month D, YYYY]`, at or under 220 words, in this shape:

| Part | Cap | Contents |
|---|---|---|
| Bottom line | 1 sentence | The single most important thing about today |
| Schedule | 5 lines plus overflow | Time, title, one clause on why it matters, depth pointer to pre-call-prep |
| The one thing | 3 lines | Action with a calendar window, Why with a receipt, Beat clause |
| Due today | 3 items, 2 lines each | Item, owed to, source receipt, ACTION keyword, handoff line |
| Went cold | 2 items, 1 line each | Thread or account, quiet since, what was pending, INFO keyword |
| Needs a reply | 3 items, 1 line each | Person, the dated ask, date, REQUEST keyword |
| Changed since yesterday | 4 lines | New, Closed, Moved. Always printed |
| Stalled, needs a decision | Only at 7 or more runs | Item, run count, the decision in one sentence |

The first three parts together are block one and stay at or under 110 words, because a
scanning reader reads half the information "only on those pages with 111 words or less"
[references/research/distilled-daily-brief-design.md].

**On-demand mode** produces a file at `daily-brief-[YYYY-MM-DD].md` in the working
directory: the identical brief, plus an appendix below it holding the fuller lists, the
excluded borderline items with the reason each was excluded, and the sibling report dates
used. Nothing in the appendix is required reading. State the path to the user when done.

Both modes end with one line naming the retrieval date and which sibling routine reports
were rolled up, so a reader can tell how fresh the brief is and where to check it.

## Guardrail

**The specific risk this skill carries is false urgency laundering.**

A daily brief is read in under a minute, by habit, in an imperative register. Items in it get
acted on without verification, and the one thing especially so, because it is a single
imperative line. That gives this skill two failure paths that no other skill in the
marketplace has in the same form:

1. **An inference reads as an instruction.** The one thing is an inference by construction.
   Compressed to one imperative line, it loses the visible hedge that makes an inference
   checkable. Mitigation, and it is not optional: the one thing always carries its receipt
   and its beat clause, and a Low-confidence claim never occupies that slot
   [references/the-one-thing.md].
2. **The rollup amplifies a sibling routine's error to the top of the user's day.** If
   commitment-tracker misreads a commitment, daily-brief can promote that misreading to the
   one thing. Mitigation: every rolled-up line names the sibling and its report date, keeps
   the sibling's hedge, and is never restated more confidently than the sibling stated it
   [references/rollup-composition.md].

**And the risk that follows from the skill's own purpose: manufactured urgency.** A daily
routine has an implicit daily quota unless something tells it that nothing to report is a
complete answer. The quiet-day rule is that clause, and it is a named requirement rather than
a preference. A brief that never has a quiet day across twenty runs is manufacturing
findings, and real weeks contain quiet days.

**Precision over recall, stated as the governing trade.** One wrong urgent item costs more
trust than three missed real ones. A missed item is recoverable because the reader still
opens the brief. A brief the reader has stopped opening cannot be corrected, because the
correction arrives inside the brief.

## Routine wiring

Create with `LB_INTERNAL_CREATE_ROUTINE`, from an interactive session only.
`CREATE_ROUTINE` and `UPDATE_ROUTINE` are not available from inside a running routine
[references/littlebird-mcp-reference.md].

Before creating it:

1. Call `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` and check the routine slot.
2. Call `LB_INTERNAL_LIST_ROUTINES` and see which siblings already exist, since the rollup
   mapping changes what this routine needs to retrieve.
3. Ask the user, with `AskUserQuestion`, what time they make their first real decision of the
   day. Set the schedule 45 minutes before that. Show them the exact prompt text and the
   schedule and get approval before calling `CREATE_ROUTINE`.

Title: `Daily brief`

Schedule shape, with the time set from the user's answer rather than from this example:

```
{"frequency": "daily", "time": "07:00"}
```

Times are in the user's local timezone [references/littlebird-mcp-reference.md].

`notifications_enabled`: true. `email_notifications_enabled`: true. A brief that arrives
without a notification is a brief nobody reads.

To change it later, call `LB_INTERNAL_GET_ROUTINE_CONFIG` first, because `prompt` and
`schedule` each replace the whole field [references/littlebird-mcp-reference.md].

### The exact routine prompt text

Pass this verbatim as `prompt`. Replace the two bracketed identifiers with real values
before the call.

```
Write my daily brief for today. Hard ceiling: 220 words total. Read every step before you
retrieve anything.

STEP 0. READ YOUR OWN PAST REPORTS FIRST.
Call LB_INTERNAL_GET_ROUTINE_REPORTS with routine_id [this routine's id] and limit 7 before
any other retrieval. Build two things:
  a) The set of every item you reported yesterday: meetings, due commitments, cold threads,
     unread threads, and the one thing.
  b) For each item, how many consecutive reports it has appeared in. You need that count in
     STEP 6.

STEP 1. ROLL UP THE OTHER ROUTINES INSTEAD OF REDOING THEIR WORK.
Call LB_INTERNAL_LIST_ROUTINES with limit 25. For any routine whose title is about
commitments, follow-ups, client health, accounts at risk, or call prep, call
LB_INTERNAL_GET_ROUTINE_REPORTS on it with limit 2.
Use a sibling report only if its latest report is newer than two of its own schedule
intervals. If it is older than that, or the routine is paused, do not use it: run the
reduced fallback in STEP 3 instead and add one line saying that routine has not reported
since its last date.
When you use a sibling finding, attribute it inline as [from ROUTINE TITLE, DATE] and keep
its exact hedging. If it said "no evidence in the record since DATE", you say that too. Never
state a rolled-up item more confidently than the routine that found it. If your own retrieval
disagrees with a rolled-up item, print both readings and say they disagree.

STEP 2. TODAY'S CALENDAR.
Call LB_INTERNAL_LIST_MEETINGS with start_date and end_date both set to today's date and
limit 50. A future end_date returns upcoming calendar events. Upcoming events are never
recorded, so they arrive as bare calendar entries with attendees and no id. Discard any
returned entry that has an id and a start time in the past.
For each meeting, write ONE clause on why it matters today, then the pointer "Depth:
pre-call-prep". Do NOT write a pre-call brief. No attendee profiles, no history tables, no
talking points. That is a different skill and duplicating it here will blow the ceiling on
one meeting.

STEP 3. RETRIEVE ONLY WHAT THE SIBLINGS DID NOT COVER.
If no commitment routine reported: call LB_INTERNAL_LIST_MEETINGS for the last 14 days with
limit 25, take the three most recent entries that have an id, call LB_INTERNAL_GET_MEETING
on each, and read ONLY the "## Action Items" and "## For You" sections. Those carry owner
attribution. Keep only items owned by me with a date at or before today. Cap at 3.
If no client health routine reported: run search_user_context with
filters {"data_source": "messages"}, search_queries_messages ["waiting to hear back",
"any update on", "circling back", "following up on"], and date_range from 21 days ago to 4
days ago, looking for threads where the other person asked something and the last message is
theirs. Cap at 2.
Always: run search_user_context with filters {"data_source": "messages"},
search_queries_messages ["can you send", "any update on", "still waiting on", "did you get a
chance", "need this from you", "by end of day", "before Friday", "following up"] and
date_range from 4 days ago to now, for direct asks addressed to me that I have not answered.
Always: run search_user_context with filters {"data_source": "summaries"} and date_range
covering yesterday, to see what happened yesterday that changes what matters today.
Use several narrow parallel queries rather than one broad one. A broad query can return more
than the tool result limit and get dumped to a file.

STEP 4. WHAT COUNTS, AND WHAT DOES NOT.
An unread thread counts only if a named person made a specific ask of me with a date or an
implied deadline, and the last message in the thread is theirs.
Do NOT flag these, even when they look relevant:
  - Any thread where my message is the most recent one. The ball is not with me.
  - Newsletters, notification digests, receipts, invites, automated alerts, even with
    urgency words in the subject.
  - Urgency that comes from the sender's adjectives rather than a date. "ASAP" from a vendor
    is not a deadline.
  - A group thread where the ask names someone else as the owner.
  - Anything whose only support is one retrieval result scored 3, or one OCR fragment.
A commitment counts only if it has a date at or before today AND either I own it or I am
blocking someone else. Do not flag an item whose only evidence is a document that was on my
screen: capture shows what I was viewing, not what I wrote.
A thread counts as cold only if it is quieter than that relationship's own normal gap and
something was actually pending. A closed deal is not a cold thread.
When you are not confident an item passes, LEAVE IT OUT. Then, once and only once, you may
write a single line naming what you excluded and why, like "Left out: 2 borderline threads,
no dated ask." A missed item is recoverable. A brief I stop reading is not.

STEP 5. THE ONE THING.
Pick exactly one action, from what you already retrieved. Never invent one.
Score candidates on, in this order: does it have a real date from a real source at or before
today; is a named person blocked waiting on me; what does one more day of delay actually
cost; and does today's calendar contain a gap big enough to do it. Date and blocked-person
beat everything else. Where two are otherwise tied and one is a hard decision, prefer the one
that can go in an earlier window, but do not tell me my afternoon judgment is unreliable.
Write it in exactly three lines:
  The one thing: ACTION, with a time window taken from a real gap in today's calendar.
  Why: the deadline or the blocked person, with a receipt.
  Beat: THE RUNNER UP, because THE ONE COMPARISON THAT DECIDED IT.
The Beat line is mandatory. An unexplained pick gets ignored.
If the work does not fit any gap today, say so and name the largest first step that does fit.
If the best candidate's only evidence is weak, a single result scored 3 or an OCR fragment,
do NOT use it. Drop to the next candidate. If none qualifies, write "The one thing: nothing
that needs today specifically. The nearest real deadline is ITEM on DATE."
End the one thing with a handoff line, either "Next: open Cowork and run SKILL NAME on
TARGET" or "Next: THE PHYSICAL ACTION, roughly TIME ESTIMATE".

STEP 6. WHAT CHANGED, AND THE ESCALATION RULE.
Diff today's item set against yesterday's report from STEP 0. Print only New, Closed, and
Moved items. An item that appeared yesterday and did not change is NOT a change and does not
go in this section.
If fewer than two items are New, Closed, or Moved, do not write the full brief. Write only
these four lines and stop:
  Mostly unchanged from yesterday.
  Schedule: N meetings, first at HH:MM.
  The one thing: ITEM because REASON.
  Nothing material changed since yesterday.
ESCALATION RULE, using the consecutive-run counts from STEP 0. For any item now in its third
through sixth consecutive report: do not restate it in the same form. Say plainly that the
current approach is not working, name what has already been tried according to your past
reports, and recommend a different tactic: a different channel, a different person, a smaller
first step, or dropping it. For any item at seven or more consecutive reports: move it out of
its normal section into a "Stalled, needs a decision" section and state, in one sentence, the
decision I have to make. Do not restate its history.

STEP 7. THE QUIET DAY RULE.
If nothing meets the bar in STEP 4 and there is no defensible one thing, write exactly two
lines and stop:
  Quiet day. N meetings, nothing due, nothing cold, no urgent threads.
  The one thing: ITEM because REASON. (or: nothing that needs today specifically.)
That is a correct and complete report. Do not lower the bar to fill a section, do not promote
a minor item, do not add hedged possibilities, and do not manufacture urgency to justify this
report existing. Real weeks contain quiet days. Still write the report: going silent is worse
than saying nothing is needed.

STEP 8. FORMAT AND CEILING.
Order, and skip any section that is empty rather than printing an empty heading:
  Bottom line: one sentence, the single most important thing about today.
  Schedule: one summary line, then at most 5 meetings at one line each, then "plus N more".
  The one thing: the three lines from STEP 5 plus its handoff line.
  Due today: at most 3 items, 2 lines each, then "plus N more". Tag each ACTION.
  Went cold: at most 2 items, 1 line each. Tag each INFO.
  Needs a reply: at most 3 items, 1 line each. Tag each REQUEST.
  Changed since yesterday: at most 4 lines. Always print this section.
  Stalled, needs a decision: only when an item has hit 7 consecutive runs.
The bottom line, the schedule block and the one thing together must be 110 words or fewer,
because that is the part that actually gets read.
Every factual line carries a receipt: the meeting name and date and which summary section, or
the capture timestamp and app and thread. Mark each line as observed, inferred, or unknown,
and never drop the hedge off an inference. "No evidence in the record since DATE" is not the
same claim as "did not happen" and you must not write it as if it were. Keep health,
financial detail, legal history, family circumstances, protected characteristics and home
location out of this report even if the capture contains them.

STEP 9. COUNT AND CUT. DO NOT SKIP THIS.
Count the words in your finished draft. If it is over 220, DELETE WHOLE ITEMS, lowest ranked
first, until it is under 220. Then count block one and if it is over 110 words, delete whole
meeting lines until it is under.
Do NOT get under the limit by compressing: do not drop receipts, do not strip dates, do not
merge two findings into one vague sentence, and never remove the Beat line from the one
thing. Cut items, never cut evidence. Three fully receipted items beat six stripped ones.
State the final word count nowhere in the report. Just obey it.

Last line of the report: the retrieval date and which routine reports you rolled up.
Title the report: Daily brief for WEEKDAY, MONTH D, YYYY.
```

### Handoff to Cowork

The routine observes and reports. It cannot write files, cannot ask anything, and cannot
create or modify routines [references/littlebird-mcp-reference.md]. Every item it reports
ends with a handoff line naming either the Cowork skill that resolves it or the physical
action and a time estimate. When the user opens Cowork, this skill runs in on-demand mode,
reads the routine's own reports with `LB_INTERNAL_GET_ROUTINE_REPORTS`, and goes deeper on
whatever the brief surfaced.

Do not ask this routine to draft outreach, send anything, or produce a file. It cannot finish
that unattended in one pass.

## Ship Gate

Ship Gate removed, research-only skill, produces no committable code.

## Related skills

| Skill | Relationship |
|---|---|
| `pre-call-prep` | Owns per-meeting depth. daily-brief gives one clause per meeting and points here. Runs the evening before; daily-brief runs in the morning. Never inline its content. |
| `commitment-tracker` | Owns the full commitment ledger and nudge drafting. daily-brief rolls up its report for the due-today section and hands off to it for anything that needs chasing. |
| `client-health-radar` | Owns per-client risk banding. daily-brief rolls up its report for the went-cold section. |
| `routine-architect` | Audits this routine when its reports start repeating, run long, or go unread. Run it if the daily brief auto-pauses. |
| `said-it-already`, `competitor-watch`, `money-leak-auditor` | Not rolled up by default. Only surface an item from these when it carries a date landing today. |

## Reference index

| File | What it covers |
|---|---|
| `references/earning-the-open.md` | The delta as the product, the novelty floor, escalation tiers, the quiet-day rule, precision over recall with named negative cases, banned content, how to tell whether it is working |
| `references/the-one-thing.md` | What the evidence does and does not support, candidate generation, the four scoring factors, the output shape with the beat clause, the size bound, the two no-pick cases, repeat handling, handoff |
| `references/rollup-composition.md` | Sibling discovery, the mapping table, the freshness gate, attribution rules, fallback queries, the pointer discipline with pre-call-prep, call budget |
| `references/brief-format-and-ceiling.md` | Where 110 and 220 come from, the four enforcement mechanisms, the template, detail scaling, section suppression, the two short forms, what never appears |
| `references/littlebird-mcp-reference.md` | Tool inventory, parameters, return shapes, known limitations |
| `references/evidence-standards.md` | Receipts, the four kinds of line, confidence ratings, attribution guardrail, confirmation gates |
| `references/research/distilled-daily-brief-design.md` | Cited distillation: why digests get abandoned, the silence-is-not-the-fix finding, the length numbers, briefing format norms, the single-priority conflict, the time-of-day conflict, named gaps and the numbers this skill refuses to restate |
| `references/research/README.md` | Archive layout, sweep coverage, source quality |
| `references/research/raw/` | Fourteen archived sources, each with title, URL, fetch date, source type |
