---
name: weekly-review
description: "Weekly review, weekly scorecard, how was my week, week in review, weekly rollup, Sunday review, Friday review, what did I get done this week, next week's top three, weekly retrospective, weekly check-in. Composes the week's meetings and hours, commitments closed versus dropped versus open, leads captured, money findings, and content shipped into one scorecard by reading the sibling routines' own reports rather than re-deriving them. Leads with the multi-week trend rather than this week's figures, carries provenance on every number, is willing to state plainly that the week was poor, and selects next week's top three on consequence ahead of urgency with an escalate-or-drop rule for carried items. Runs as a weekly routine, or on demand. Requires the Littlebird MCP."
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan)"
---

# Weekly review

## Purpose

One scorecard per week covering the whole operation: meetings held and hours spent in them,
commitments closed against dropped against still open, leads captured and what happened to
them, money findings, content shipped, what moved per project, and next week's top three
with the reasoning shown.

**This is the composition skill of the marketplace, and that is its defining property.**
Nearly everything in the scorecard was already produced by a sibling routine. So the primary
retrieval of this skill is `LB_INTERNAL_LIST_ROUTINES` plus `LB_INTERNAL_GET_ROUTINE_REPORTS`
across the user's other routines, reading their weekly output. Exactly one section is
retrieved fresh every run: meetings and hours.

**Read, do not re-derive.** Re-deriving is slower and more expensive, and worse than both, it
produces a number that disagrees with the sibling's own published number. The user then has to
reconcile two versions of their own week. For a scorecard that is the worst available outcome,
because one figure the reader cannot trust undermines every other figure on the surface
[references/research/distilled-weekly-review-design.md, section 7].

**Two design properties matter more than the rest.**

1. **The trend is the product, not the snapshot.** A single week's numbers mean almost
   nothing. The routine reads twelve of its own past reports and the scorecard leads with
   direction. `references/trend-construction.md`.
2. **Honest scorekeeping, which means being willing to report a bad week.** A review that
   always finds something positive is worthless within a month and it is the single most
   likely way this skill fails. `references/honest-scorekeeping.md`.

**What the evidence actually supports.** Not the weekly review, which this archive found no
controlled evidence for at all. Monitoring: across 138 studies and 19,951 participants,
monitoring goal progress moved goal attainment by d+ = 0.40, mediated by monitoring frequency,
with larger effects when the information was physically recorded and when outcomes were
reported [references/research/distilled-weekly-review-design.md, section 1]. A persistent
routine report is a physical record by construction. That is the whole warrant for this skill,
and it is a moderate effect, not a transformation.

## Capability gate

This skill requires the **Littlebird MCP on a Power or Pro plan**.

Before anything else:

1. **List the tools actually available in this session.** Do not assume tool names. Confirm
   that the routine tools, the meeting tools, and `search_user_context` are present under
   their real names.
2. If the Littlebird MCP is not connected, **stop** and tell the user: "This skill needs the
   Littlebird MCP connected on a Power or Pro plan. Connect it at
   https://support.littlebird.ai/docs/mcp/ and run this again."
3. **If the routine tools are missing, this skill is severely degraded and says so.** Without
   `LB_INTERNAL_GET_ROUTINE_REPORTS` there is no sibling rollup and no series, which is most
   of the value. Run on-demand mode against fallbacks only, print one line at the top saying
   the scorecard is running without any rollup or trend, and do not present it as a weekly
   review.
4. Before creating the routine, call `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` to confirm the plan
   allows another routine. Routine count is plan-limited, so if the account is at its limit,
   name which existing routine should be replaced rather than proposing an addition
   [references/littlebird-mcp-reference.md].

Tool mechanics, parameters, and return shapes: `references/littlebird-mcp-reference.md`.

## Littlebird MCP calls used

| Tool | Used for |
|---|---|
| `LB_INTERNAL_LIST_ROUTINES` | Discovering which sibling routines exist, their schedules, their latest report dates, and whether they are paused. The primary retrieval. |
| `LB_INTERNAL_GET_ROUTINE_REPORTS` | Two things, both mandatory: twelve of this routine's own past reports for the series, and two reports from each matched sibling for the rollup |
| `LB_INTERNAL_LIST_MEETINGS` | Meetings held and hours in meetings for the window. The one section always retrieved fresh, and the only genuinely measurable number in the scorecard |
| `LB_INTERNAL_GET_MEETING` | Fallback only. The `## Action Items` and `## For You` sections when no commitment sibling reported |
| `search_user_context` | Fallback only. Money, leads and content sections when their siblings are absent, stale or paused |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | The plan and routine-slot check before creating the routine |
| `LB_INTERNAL_CREATE_ROUTINE` | Creating the weekly routine, from an interactive session only |
| `LB_INTERNAL_GET_ROUTINE_CONFIG` and `LB_INTERNAL_UPDATE_ROUTINE` | Changing the routine later. Read the config first, because `prompt` and `schedule` each replace the whole field |

Never used by this skill: `LB_INTERNAL_GET_MEETING_TRANSCRIPT` and
`LB_INTERNAL_SEARCH_MEETINGS`. A weekly scorecard has no budget for transcript reading, and a
topic search over meetings is a deep-run instrument that belongs to the siblings.

## Trigger

Trigger phrases: weekly review, weekly scorecard, how was my week, week in review, weekly
rollup, Sunday review, Friday review, what did I get done this week, what should I focus on
next week, next week's top three, weekly retrospective, weekly check-in, set up my weekly
review.

Do not trigger for: today's plan (that is `daily-brief`), a full commitment ledger (that is
`commitment-tracker`), a per-client risk view (that is `client-health-radar`), a vendor spend
audit (that is `money-leak-auditor`), or an audit of whether the routines themselves are
healthy (that is `routine-architect`).

## Routine cadence

**Weekly, plus on demand.**

**The timing position, taken deliberately: Friday late afternoon by default, roughly 16:30
local. Sunday evening is fully supported, offered every time, and is the second choice.**

The practice literature offers Friday afternoon, Sunday evening and Monday morning with no
evidence behind any of them, then says consistency matters more than the choice
[references/research/distilled-weekly-review-design.md, section 9]. So the decision comes
from the recovery literature instead.

Boundary management is the strongest lever on weekend detachment by a wide margin, d = 0.65
for interventions with a boundary-management component against d = 0.25 without
[references/research/distilled-weekly-review-design.md, section 9]. A scheduled, notified
Sunday-evening work scorecard is boundary management run backwards. And the recovery paradox
bites this skill specifically: perceiving that one has performed well predicts better evening
detachment, so an honest report that must sometimes state the week was poor would deliver that
to the reader least able to detach afterwards
[references/research/distilled-weekly-review-design.md, section 9].

The strongest objection to Friday, that it is inside the work week and Friday judgment is
tired, mostly dissolves, because **the generator is a routine and the machine has no Friday
afternoon.** It runs at 16:30 against a week that is effectively complete, and the human reads
whenever they choose, including Monday morning.

Sunday evening keeps a real case: not detaching predicts positive affect when the thinking is
problem-solving rather than rumination, and very high detachment may itself undermine
performance [references/research/distilled-weekly-review-design.md, section 9]. Offer both
with the tradeoff in plain terms, set what the user picks, and do not argue past one answer.
Full argument in `references/honest-scorekeeping.md`, section 6.

**Two modes.**

| Mode | Trigger | Output |
|---|---|---|
| **Routine (primary)** | Scheduled weekly | One routine report per run, at or under 450 words, ending in the SERIES line |
| **On demand (secondary)** | User asks | The same scorecard plus an appendix, written to a file |

## Process

### Step 1: read your own past reports

Mandatory, first, before any other retrieval. `LB_INTERNAL_GET_ROUTINE_REPORTS` on this
routine with `limit: 12`.

Parse the SERIES line at the end of each report rather than re-reading the prose. Build the
series for every field, and build the consecutive-week count for every item that has appeared
in a top three.

Twelve, because the stricter published shift rule is defined for a series of 12 to 22 points,
and because twelve weeks is a quarter, which is a window the reader can check against memory
[references/research/distilled-weekly-review-design.md, section 6]. The series line format and
the parsing rules: `references/trend-construction.md`, section 2.

A routine prompt that does not instruct the model to read its own previous reports will repeat
itself indefinitely [references/littlebird-mcp-reference.md].

### Step 2: roll up the siblings, do not re-derive them

`LB_INTERNAL_LIST_ROUTINES` with `limit: 25`, then `LB_INTERNAL_GET_ROUTINE_REPORTS` with
`limit: 2` on each matched sibling. Match on the substance of the title, not on an exact
string.

This is the primary retrieval of the skill, not a preliminary step. In a well-populated account
it produces five of the six scorecard sections.

The section-by-section mapping, the weekly freshness gate, the exact lines to print for a
stale, paused, absent or genuinely-empty sibling, the per-section fallback queries with their
budget cap, and the provenance marks: **`references/rollup-and-fallbacks.md`**.

The general rollup pattern this guide builds on lives in the `daily-brief` skill, in its
reference guide named `rollup-composition`, and is not restated here. This skill's guide
stands alone where `daily-brief` is not installed.

### Step 3: retrieve meetings and hours, always

The one fresh retrieval. `LB_INTERNAL_LIST_MEETINGS` across the window. This is genuinely
measurable and it is one of the few honest numbers in the whole scorecard, which is exactly
why it must carry its bound: scheduled duration is not attendance.

### Step 4: run the fallbacks, only for uncovered sections

At most five calls. Priority order when the budget binds: commitments, money, leads, content,
projects. Every fallback result carries its reduced-check line.
`references/rollup-and-fallbacks.md`, section 5.

### Step 5: build the series and decide what the report may say

Append this week's values, then apply the length table. One point licenses no direction claim
at all. Two licenses a one-week change and the words "trend", "improving" and "momentum" are
banned. Three to four license an early indication, in the source's own hedged wording. Five
consecutive rising or falling license the word trend. Twelve or more license the word shift.

A rule is never evaluated across a gap in the series. Closing up an `na` to reach five
consecutive points is manufacturing a trend.
**`references/trend-construction.md`**, sections 3 and 8.

### Step 6: order the scorecard by what the series says

Direction first, absolute figures second. The section whose series is doing the most
interesting thing leads: shift, then trend, then astronomical point, then a crossed threshold,
then template order. A report that opens with this week's counts is the
measurement-instead-of-decision failure that gets scorecards abandoned
[references/research/distilled-weekly-review-design.md, section 7].

### Step 7: apply the honesty gates

Print the poor-week block when its triggers fire, plainly, at the top, with no cushioning
clause. Refuse both manufactured wins and manufactured crisis. Keep every sentence at the
level of the work rather than the level of the person, because that is the axis the feedback
evidence actually supports: over a third of measured feedback effects made performance worse,
and the mechanism is attention moving from the task to the self
[references/research/distilled-weekly-review-design.md, section 4].

The six banned win-manufacturing moves, the five banned crisis-manufacturing moves, the exact
shape of the poor-week block, and the three self-diagnosis signatures:
**`references/honest-scorekeeping.md`**.

### Step 8: select the top three

Score every candidate on consequence at weight 3, urgency at weight 2, carry at weight 2.
Filter spurious urgency to zero before scoring rather than penalizing it during. An item may
reach the top three on consequence alone, and that is the intended behavior.

Any item in the top three for three consecutive weeks gets the escalate-or-drop block. At four
it is dropped by default.

Candidate pool, the scoring tables, the five tie-breaks, the carried-item block, the honest
statement of why three, the four-line output shape with its mandatory Beat line, and the two
no-pick cases: **`references/top-three-selection.md`**.

### Step 9: count, cut, and write the SERIES line

At or under 450 words. If over, delete whole items lowest-ranked first. **Cut items, never cut
evidence.** Do not get under the ceiling by dropping receipts, stripping provenance marks,
merging findings, or removing a Beat line.

Then write the SERIES line as the last line of the report, with `na` for anything unmeasured
and `~` for anything from a fallback.

## Retrieval brief

The actual calls. Substitute real dates; never leave a placeholder in a live call. The window
is the seven days ending on the run date.

**Own history, once per run**

```
LB_INTERNAL_GET_ROUTINE_REPORTS
  routine_id: [this routine's id]
  limit:      12
```

**Sibling discovery, once per run**

```
LB_INTERNAL_LIST_ROUTINES
  limit: 25
```

**Sibling reports, once per matched sibling**

```
LB_INTERNAL_GET_ROUTINE_REPORTS
  routine_id: [sibling id]
  limit:      2
```

**Meetings and hours, always, once per run**

```
LB_INTERNAL_LIST_MEETINGS
  start_date: [window start]
  end_date:   [window end]
  limit:      60
```

Returns both recorded meetings and unrecorded calendar events; only recorded ones carry an id
[references/littlebird-mcp-reference.md]. Count both, and report the split, because the
unrecorded ones are calendar entries the user may or may not have attended. Hours come from
scheduled duration, which is a bound and not attendance, and the number carries that bound.

**Commitments fallback, only when no commitment sibling reported**

```
LB_INTERNAL_LIST_MEETINGS
  start_date: [window start minus 21 days]
  end_date:   [window end]
  limit:      40
```

then, on at most eight recorded entries that carry an id:

```
LB_INTERNAL_GET_MEETING
  meeting_id: [id]
```

Read only `## Action Items` and `## For You`. Those sections already carry owner attribution
[references/littlebird-mcp-reference.md].

**Money fallback, only when no money sibling reported**

```
search_user_context
  search_queries:   ["subscription renewal charge", "invoice overdue payment", "annual plan renews on",
                     "payment failed card declined", "your card will be charged"]
  standalone_query: "Billing, renewal, invoice and payment notices that appeared on screen this week"
  date_range:       {"start": "[window start]", "end": "[window end]"}
  filters:          {"data_source": "snapshots"}
```

**Leads fallback, only when no lead sibling reported**

```
search_user_context
  search_queries_messages: ["interested in", "send me the details", "how much is it", "can we talk",
                            "dropped you a DM", "want to learn more"]
  standalone_query:        "New people who expressed interest in what I sell during this week"
  date_range:              {"start": "[window start]", "end": "[window end]"}
  filters:                 {"data_source": "messages"}
```

**Content fallback, only when no content sibling reported**

```
search_user_context
  search_queries:   ["published post", "just posted", "newsletter sent", "video uploaded", "went live"]
  standalone_query: "Things I actually published or sent this week, as opposed to drafted"
  date_range:       {"start": "[window start]", "end": "[window end]"}
  filters:          {"data_source": "summaries"}
```

Prefer several narrow parallel queries over one broad one, both for relevance and to avoid the
oversized-result file dump [references/littlebird-mcp-reference.md].

## Evidence standards

Every line obeys `references/evidence-standards.md`. The rules that bite hardest here:

- **Provenance on every number.** Which sibling report and its date, or which retrieval and
  its window. Plus exactly one mark: `(exact)`, `(bounded: reason)`, or `(reduced check)`. A
  number with no mark does not go in the scorecard.
- **Observed, inferred, external, unknown.** Each line is exactly one, visibly. The top three
  is inference by construction and carries the observations it rests on.
- **Absence is not a negative finding.** "No evidence in the record since 2026-08-05", never
  "they did not do it". A section with no sibling is not a zero, and the scorecard prints the
  reason instead of a number [references/rollup-and-fallbacks.md, section 4].
- **Confidence ratings.** A Low-confidence claim never enters the top three and never gets an
  urgency score above zero.
- **Attribution guardrail.** Capture shows what the user was viewing, not what they wrote. A
  composer window is not published content.
- **Partial rosters are reported as partial.** Lead counts from message capture are floors,
  because platform UIs collapse lists.
- **Rolled-up claims keep the sibling's hedge and the sibling's confidence.** Never restate a
  sibling more confidently than the sibling did. A scorecard compresses, and compression is
  where a hedge gets dropped.
- **Relevance scores.** Anything scored 3 is a maybe. Do not build a scorecard number on a
  single 3-scored result [references/littlebird-mcp-reference.md].
- **Sensitive categories stay out.** Health, financial detail beyond business figures, legal
  history, family circumstances, protected characteristics, and precise home location, even
  where the capture contains them.
- **Raw capture never ships.** Process in temp space, produce the scorecard, delete the raw.
- **Confirm before encoding.** On-demand mode confirms with `AskUserQuestion` before recording
  a durable fact about a person or a figure. Routine mode cannot ask, so routine mode does not
  encode durable facts; it reports with hedges and marks.

## Draft never send

This skill drafts and holds. Nothing is sent, posted, published, or written into a third-party
system without the user approving the actual final text through `AskUserQuestion`. Approving a
plan is not approving the words. This applies even where a Gmail, Slack or CRM connector is
connected in the session.

The weekly review produces no outbound text at all in normal operation. If the user asks it to
chase something the scorecard surfaced, hand off: `commitment-tracker` owns nudges,
`invoice-chaser` owns receivables chasing, `renewal-sentinel` owns cancellations.

If a connector is needed, **list the available tools first** and degrade gracefully when it is
absent: produce a copy-paste block rather than assuming a connector exists.

## Empty retrieval

Five distinct empty cases. None of them fabricate.

**No sibling routines exist at all.** Run every fallback within the five-call cap, print the
no-sibling line for each uncovered section, and add one line at the top: `Running without any
rollup. Every figure below is a reduced check. The siblings that would produce real figures
are named per section.` Then offer to set up the two highest-value siblings for this user.

**A sibling is stale or paused.** Print the stale line or the paused line, run the fallback,
and never omit the section [references/rollup-and-fallbacks.md, section 4]. A missing section
reads as a zero and a zero is a claim.

**A section genuinely has no items and the sibling looked.** Print the zero with the sibling's
report date. This is the only case where a bare zero is correct, and the distinction between
"the sibling found none" and "nobody looked" is the point of the whole section.

**A quiet week: everything retrieved, nothing moved.** Print the short form: the series lines
with their flat readings, one sentence saying the week was flat, and the top three if any item
qualifies. Do not lower the bar to fill a section, do not promote a minor item, and do not
manufacture urgency to justify the report existing. Real quarters contain quiet weeks
[references/honest-scorekeeping.md, section 3].

**Everything came back empty.** Report the gap and stop:

```
No Littlebird data retrieved for this window. No routines found and no capture returned.
Nothing to review. This usually means capture was off or the account has no recent activity.
```

Never pad from training data, never reason from what would probably be there, never substitute
plausible examples [references/evidence-standards.md, rule 9].

## Output

**Routine mode** produces one Littlebird routine report per run, titled
`Weekly review, week ending [Month D, YYYY]`, at or under 450 words, in this shape.

| Part | Cap | Contents |
|---|---|---|
| Lead | 3 lines | The section whose series is doing the most interesting thing, direction first. The poor-week block goes here when triggered. |
| Meetings | 1 line | Held, split recorded against calendar-only, hours with its bound, series |
| Commitments | 3 lines | Closed of total as a rate, dropped in full by name, still open, series |
| Leads | 1 line | Captured, how many have a next step recorded, series |
| Money | 3 lines | Leaks found, renewals inside 14 days, receivables outstanding, each with provenance |
| Content | 1 line | Shipped, by name and date. Drafts excluded and said to be excluded |
| Moved and did not move | 4 lines | Per active project, state changes only |
| Next week's top three | 12 lines | Three items, four lines each, Beat line mandatory |
| Carried block | Only at 3 weeks | Escalate or drop, per top-three-selection.md |
| Selection note | Only when 2 or more carried | The self-diagnosis line |
| Footer | 2 lines | Retrieval date, which sibling reports were rolled up and their dates, then the SERIES line |

**The 450-word ceiling is a design element, not tidiness.** The practice literature names
arduousness as the reason the habit dies: "the longer and more arduous your review is, the
less likely you'll be to maintain the habit"
[references/research/distilled-weekly-review-design.md, section 2]. And the recovery
literature's distinction is between bounded problem-solving thinking, which is benign, and
open-ended rumination, which is not
[references/research/distilled-weekly-review-design.md, section 9]. A short report ending in
three decisions is the first thing. An open-ended reflective essay is the second. A stated
ceiling does not produce a ceiling, so the ceiling appears four ways: per-section caps, the
ordering rule, an explicit count-and-cut step, and a ban on getting under it by cutting
evidence.

**On-demand mode** produces a file at `weekly-review-[YYYY-MM-DD].md` in the working
directory: the identical scorecard, plus an appendix holding the full twelve-point series for
every field, the sibling report dates and staleness state for each section, the full candidate
pool for the top three with every score shown, and the items excluded with the reason each was
excluded. Nothing in the appendix is required reading. State the path to the user when done.

Both modes end with the retrieval date, the rolled-up sibling reports and their dates, and the
SERIES line, so the next run can rebuild the series from one line per report.

## Guardrail

**The specific risk this skill carries is authority laundering: a number acquires
authority by being printed in a scorecard, regardless of where it came from.**

Three failure paths, all specific to this skill's shape.

1. **A fallback figure gets read as a measurement.** A commitment count derived from eight
   meeting summaries and a real ledger from `commitment-tracker` look identical once they are
   both a digit next to a label. Then the fallback figure enters the twelve-week series and
   contaminates a trend that will be used to recommend a change of approach. Mitigation, and
   it is not optional: every number carries one of three provenance marks, fallback values
   carry `~` in the SERIES line, and a trend rule is never evaluated across mixed provenance
   without saying so [references/rollup-and-fallbacks.md, section 6].

2. **A missing section reads as a zero.** This is the quiet version of the same problem, and
   it is worse because nothing is printed to argue with. Mitigation: stale, paused and absent
   siblings each have an exact line that must be printed, and a bare zero is legal only when a
   sibling looked and found none [references/rollup-and-fallbacks.md, section 4].

3. **The scorecard amplifies a sibling's error into a trend.** `daily-brief` can promote a
   sibling's misreading to the top of one day. This skill can promote it into a twelve-week
   series and then recommend a tactic change on the strength of it. Mitigation: never restate
   a sibling more confidently than the sibling did, print the sibling's report date next to
   every rolled-up number, and recommend a change of approach only on a fired rule or a
   three-week carry, never on a single week's movement
   [references/trend-construction.md, section 7].

**And the risk that follows from the skill's own purpose: a review that always finds something
positive.** Every incentive in a model writing to a person about that person pushes toward
softening, and it happens one hedge at a time in the last sentence of each section. The
countermeasures are the banned-move lists, the mandatory poor-week block, and the eight-run
self-diagnosis, all in `references/honest-scorekeeping.md`. The symmetric risk, manufactured
crisis, gets the same treatment, because a report that always alarms carries as little
information as one that always reassures.

**Reacting to noise is the failure this skill is uniquely positioned to cause.** It reports
numbers and it sets next week's priorities in the same document. Adjusting a process in
response to common cause variation is measured, not theoretical: chasing the target produced a
process spread 2.5 times wider than leaving it alone
[references/research/distilled-weekly-review-design.md, section 6]. The anti-tampering rule in
`references/trend-construction.md` section 7 is the countermeasure and it is the load-bearing
rule of the skill.

## Routine wiring

Create with `LB_INTERNAL_CREATE_ROUTINE`, from an interactive session only. `CREATE_ROUTINE`
and `UPDATE_ROUTINE` are not available from inside a running routine
[references/littlebird-mcp-reference.md].

Before creating it:

1. Call `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` and check the routine slot.
2. Call `LB_INTERNAL_LIST_ROUTINES` and see which siblings already exist, because that
   determines how many fallbacks this routine will have to run and therefore how useful it
   will be on day one. If fewer than two siblings exist, say so and offer to set up the two
   highest-value ones first.
3. Ask the user, with `AskUserQuestion`, which slot they want. Offer Friday late afternoon as
   the default and Sunday evening as the alternative, and give the tradeoff in their terms:
   Friday keeps the weekend clear of a work report but the week is technically still running;
   Sunday is more reflective but puts a work document at the end of the recovery window.
4. Show them the exact prompt text and the schedule, and get approval before calling
   `CREATE_ROUTINE`.

Title: `Weekly review`

Schedule shape, with the day and time set from the user's answer rather than from this
example:

```
{"frequency": "weekly", "time": "16:30", "week_days": ["FR"]}
```

Sunday alternative: `{"frequency": "weekly", "time": "18:00", "week_days": ["SU"]}`

Times are in the user's local timezone [references/littlebird-mcp-reference.md].

`notifications_enabled`: true. `email_notifications_enabled`: true. The dashboard failure named
in the archive is that "Users have to remember to check. Out of sight means out of routine"
[references/research/distilled-weekly-review-design.md, section 7], and the practice
literature names not scheduling it as the primary reason the weekly review does not happen
[references/research/distilled-weekly-review-design.md, section 2]. The notification is the
countermeasure to both.

To change it later, call `LB_INTERNAL_GET_ROUTINE_CONFIG` first, because `prompt` and
`schedule` each replace the whole field [references/littlebird-mcp-reference.md].

### The exact routine prompt text

Pass this verbatim as `prompt`. Replace the bracketed identifier with the real routine id
before the call.

```
Write my weekly review scorecard for the seven days ending today. Hard ceiling: 450 words
total. Read every step before you retrieve anything.

STEP 0. READ YOUR OWN PAST REPORTS FIRST.
Call LB_INTERNAL_GET_ROUTINE_REPORTS with routine_id [this routine's id] and limit 12 before
any other retrieval. Every past report ends with a line starting SERIES. Parse those lines
instead of re-reading the prose. Build two things:
  a) For each field, the series of values across those weeks, in date order.
  b) For each item that has ever appeared in a top three, how many CONSECUTIVE weeks it has
     appeared. You need that count in STEP 6.
A field written na was not measured that week. A value with a trailing ~ came from a fallback,
not from a real sibling routine. Keep both distinctions.

STEP 1. ROLL UP THE OTHER ROUTINES INSTEAD OF REDOING THEIR WORK. THIS IS THE MAIN JOB.
Call LB_INTERNAL_LIST_ROUTINES with limit 25. For any routine whose title is about
commitments, follow-ups, unanswered messages, client health, deals or pipeline, leads or
comments, subscriptions or spend, renewals, invoices or receivables, content or posting, or
meeting follow-ups, call LB_INTERNAL_GET_ROUTINE_REPORTS on it with limit 2.
Use a sibling's report only if its latest report is newer than two of its own schedule
intervals. A daily routine that last reported three days ago is STALE to you even if it has
fifty reports. Check the latest report date, not the report count.
If a sibling is stale, paused, or missing, DO NOT silently leave its section out. Print the
section with one of these lines and then run the reduced fallback in STEP 3:
  "[Section]: reduced check only. [Routine] last reported [date]. Not a zero."
  "[Section]: reduced check only. [Routine] is paused. Not a zero."
  "[Section]: reduced check only. No [kind] routine found. Run [skill] for the real figure."
If a sibling DID report and found nothing, that is different and you print the real zero with
its report date.
Attribute every rolled-up number inline as [from ROUTINE TITLE, DATE] and keep its exact
hedging. If the sibling said "no evidence in the record since DATE", you say that too. Never
state a rolled-up number more confidently than the routine that found it.

STEP 2. MEETINGS AND HOURS. THIS IS THE ONE THING YOU RETRIEVE FRESH EVERY TIME.
Call LB_INTERNAL_LIST_MEETINGS with start_date seven days ago, end_date today, limit 60.
It returns both recorded meetings and plain calendar events; only recorded ones have an id.
Report the total, the split between recorded and calendar-only, and total hours from scheduled
durations. Mark hours as bounded, because scheduled duration is not attendance.

STEP 3. FALLBACKS, AT MOST FIVE CALLS TOTAL, ONLY FOR SECTIONS NO SIBLING COVERED.
Priority if the budget binds: commitments, money, leads, content. Skip the rest and print the
no-sibling line for them.
Commitments: LB_INTERNAL_LIST_MEETINGS over the last 28 days limit 40, then
LB_INTERNAL_GET_MEETING on at most 8 recorded entries, reading ONLY the "## Action Items" and
"## For You" sections, which carry owner attribution. Count items owned by me. Count an item
closed only where something in the record shows it done. DO NOT count anything as dropped from
a fallback and DO NOT compute a closure rate from one.
Money: one search_user_context with filters {"data_source": "snapshots"} and search_queries
["subscription renewal charge", "invoice overdue payment", "annual plan renews on", "payment
failed card declined", "your card will be charged"] over the window. Report only named vendor,
named amount, named date. Never total anything and never project a saving from a fallback.
Leads: one search_user_context with filters {"data_source": "messages"} and
search_queries_messages ["interested in", "send me the details", "how much is it", "can we
talk", "dropped you a DM", "want to learn more"] over the window. Report the named count as a
FLOOR, not a total, because platform UIs collapse lists.
Content: one search_user_context with filters {"data_source": "summaries"} and search_queries
["published post", "just posted", "newsletter sent", "video uploaded", "went live"] over the
window. A draft on screen is NOT shipped content.
Mark every fallback figure "(reduced check)" and put a trailing ~ on it in the SERIES line.

STEP 4. THE SERIES RULES. THIS IS THE PART THAT MAKES THE REPORT WORTH READING.
Append this week's values to the series from STEP 0, then obey this table exactly. You may not
use language from a row you have not reached.
  1 week of history:  state the number. Say NOTHING about direction. Add "First measured week.
                      No baseline yet."
  2 weeks:            you may say "up from" or "down from" with both values. You may NOT use
                      the words trend, improving, declining, or momentum. Add "One-week change
                      against a single prior week. Not a trend."
  3 to 4 weeks:       you may give an early indication of the central tendency. Add "Early
                      indication only, N weeks of history." Still no trend, still no shift.
  5 or more:          you may call it a trend ONLY if five or more consecutive points all go
                      up or all go down. Name the rule when you use it.
  12 or more:         you may additionally call it a shift ONLY if six or more consecutive
                      points sit on the same side of the median. Name the rule.
NEVER evaluate a rule across a gap. Consecutive means consecutive MEASURED weeks with no na
between them. Closing up a gap to reach five points is manufacturing a trend and is forbidden.
You may flag one blatant outlier at any length of 3 or more, but state it as an outlier and DO
NOT attach a cause to it.
Report closure as a rate with both terms visible, like "7 of 11 (64%)", never as a bare count.
Never build a composite or overall score of my week.

STEP 5. ORDER AND HONESTY. READ THIS TWICE.
Lead with DIRECTION, not with this week's numbers. The section whose series is doing the most
interesting thing goes first: a fired shift, then a fired trend, then an outlier, then a
crossed deadline, then everything else.
Write about the WORK, never about me. Do not write "strong week", "tough week", "you are
building momentum", "great job", or "you let this slip". Write what happened to the
commitments, the money, the leads and the content, with receipts.
IF THE WEEK WAS POOR, SAY SO PLAINLY AT THE TOP. Trigger it when a rate is at its lowest
measured value with at least 4 points, or two or more commitments passed their dates with no
observed response, or a trend fired the wrong way. Format:
  "This was a poor week on [measure]. [number, with series context]. [what specifically did
  not happen, with receipts]."
No cause, no encouragement, no cushioning clause, and no sentence starting with "but" or "on
the positive side".
DO NOT MANUFACTURE WINS. A win counts only if it is a countable event with a receipt: shipped,
closed, paid, signed, booked, published. Never reframe a dropped commitment as a learning.
Never count effort, hours, drafts, or plans as output. Never promote a small win to the top on
a bad week to balance the tone.
DO NOT MANUFACTURE A CRISIS EITHER. A flat week is reported as flat, not as drift or
stagnation. One bad week is normal variation, not a signal. Three unrelated mild findings do
not become a pattern by being listed together. Never state a consequence worse than what the
record shows.
If this same poor-week block has printed three weeks running, do not print it a fourth time in
the same form. Say instead that the measure has been poor for four weeks, that this report is
no longer telling me anything new, and recommend either a change of approach or an explicit
decision to accept the level.

STEP 6. NEXT WEEK'S TOP THREE, AND THE CARRY RULE.
Build candidates ONLY from what you already retrieved. Never invent one. Score each:
  consequence, weight 3: what one more week of not doing it actually costs, from the record.
    3 money leaves or a relationship materially degrades or an obligation lapses; 2 a named
    person stays blocked; 1 work piles up but nothing external changes; 0 nothing changes.
  urgency, weight 2: 2 for a hard date inside 7 days from a real document, invoice, calendar
    entry or meeting commitment; 1 for a hard date inside 30 days; 0 for EVERYTHING ELSE.
    Urgency from somebody's tone, an "ASAP", or your own sense that something feels pressing
    is 0. Filter it to zero before scoring, do not argue about it.
  carry, weight 2: 3 if it has been in the top three 3 or more consecutive weeks; 2 if two
    weeks; 1 if named in a past report but never in the top three; 0 if new.
score = 3*consequence + 2*urgency + 2*carry. Rank, take three. An item may reach the top three
on consequence alone with urgency 0. That is intended.
Tie-break in this order: higher consequence, then someone is blocked, then the smaller item,
then the older carry. If still tied, take the first and say the tie-break was arbitrary.
Write each of the three in exactly four lines:
  N. ACTION, imperative, one clause, specific enough to start.
     Because: THE CONSEQUENCE in the record's own terms, with a receipt.
     By: THE DATE with its source, or "no external date; chosen on consequence".
     Beat: THE RUNNER UP, because THE ONE COMPARISON THAT DECIDED IT.
The Beat line is mandatory. The Because line must state consequence, not just a deadline.
CARRY RULE, using the consecutive counts from STEP 0. Any item now in its THIRD consecutive
week in the top three does not appear in the normal format. Print instead:
  CARRIED, WEEK 3: ITEM
    Tried so far: WHAT MY PAST REPORTS SHOW WAS ATTEMPTED
    The approach is not working. Choose one:
      ESCALATE: A SPECIFICALLY DIFFERENT TACTIC, a different channel, a different person, a
        smaller first step, paying for it, or changing what counts as done. "Follow up again"
        is NOT an escalation.
      DROP: WHAT IS GIVEN UP, plainly, and WHO NEEDS TO BE TOLD.
At FOUR consecutive weeks with no resolution, drop it by default and print
  "DROPPED BY DEFAULT AT WEEK 4: ITEM. Reinstate it deliberately if it still matters."
If two or more of this week's three carried over from last week, add one line:
  "Selection note: N of 3 carried from last week. If this holds again, the top three has
  stopped selecting and is just restating the backlog."
If fewer than three items qualify, print the ones that do and say how many qualified. DO NOT
pad. If none qualify, write "No item this week had a consequence above zero and no dated
obligation falls inside 30 days. Nothing is being recommended." and stop there.

STEP 7. PROVENANCE ON EVERY NUMBER.
Every figure carries where it came from and exactly one mark:
  (exact) a count of discrete named items
  (bounded: REASON) a floor, a ceiling or a range, with the reason
  (reduced check) produced by a fallback rather than by the routine that owns it
A number you cannot mark does not go in the report. Print the reason instead.
"No evidence in the record since DATE" is not the same claim as "did not happen" and you must
not write it as if it were. Keep health, personal financial detail, legal history, family
circumstances, protected characteristics and home location out of this report even if the
capture contains them.

STEP 8. COUNT AND CUT. DO NOT SKIP THIS.
Count the words. If over 450, DELETE WHOLE ITEMS, lowest ranked first, until under. Do NOT get
under the limit by dropping receipts, stripping provenance marks, merging two findings into
one vague sentence, or removing a Beat line. Cut items, never cut evidence.

STEP 9. THE LAST LINE, EXACTLY THIS FORMAT, AND NOTHING AFTER IT.
SERIES | YYYY-MM-DD | mtg N | hrs N.N | cc N | cd N | co N | leads N | money N | content N | top3carry N
Use na for anything not measured. Never write 0 where you mean not measured. Put a trailing ~
on any value that came from a fallback.
The line before it names the retrieval date and which routine reports you rolled up, with
their dates.
Title the report: Weekly review, week ending MONTH D, YYYY.
```

### Handoff to Cowork

The routine observes and reports. It cannot write files, cannot ask anything, and cannot create
or modify routines [references/littlebird-mcp-reference.md]. Each top-three item ends in an
action the reader can start, and any item that needs drafting, approval or a third-party system
names the sibling skill that owns it.

When the user opens Cowork, this skill runs in on-demand mode, reads the routine's own reports
with `LB_INTERNAL_GET_ROUTINE_REPORTS`, and produces the file version with the full series, the
full candidate pool and the exclusion list.

Do not ask this routine to draft outreach, send anything, or produce a file. It cannot finish
that unattended in one pass.

## Ship Gate

Ship Gate removed, research-only skill, produces no committable code.

## Related skills

| Skill | Relationship |
|---|---|
| `daily-brief` | The daily analogue, and the source of the rollup pattern this skill extends. daily-brief owns the day, weekly-review owns the week and the series. weekly-review may roll up daily-brief's deltas for the projects section but never restates its schedule. |
| `commitment-tracker` | Owns the commitment ledger and nudge drafting. Supplies closed, dropped and open. weekly-review takes the counts and the dropped list, never the ledger. |
| `who-am-i-ghosting` | Owns unanswered threads. Supplies one sub-line under commitments. |
| `money-leak-auditor`, `renewal-sentinel`, `invoice-chaser` | Own the three money sections. weekly-review takes findings, deadlines inside 14 days, and the outstanding total, and hands off anything that needs a draft. |
| `lead-harvester`, `comment-to-crm-piper`, `deal-pipeline-reconstructor` | Own leads and pipeline. Supply captured counts and stage changes. |
| `said-it-already`, `content-repurposer` | Own content. Supply what shipped. Nominations and drafts are not shipped. |
| `client-health-radar`, `meeting-scribe` | Own per-client and per-meeting depth. Supply band changes and decisions for the projects section. |
| `routine-architect` | Audits this routine and the siblings when reports repeat, run long, or go unread. weekly-review never grades a sibling routine; it reports staleness as a data-quality note and points here. |

## Reference index

| File | What it covers |
|---|---|
| `references/rollup-and-fallbacks.md` | Why the weekly stakes of re-deriving are higher, the section-by-section sibling mapping, the weekly freshness gate, the exact stale, paused, absent and true-zero lines, the five per-section fallbacks with their budget cap and priority order, the three provenance marks, the call budget |
| `references/trend-construction.md` | Why twelve reports, the SERIES line format and parsing, the series-length table and what each length licenses, the astronomical point, direction-first ordering, rate versus count, the ban on composite scores, the four-case anti-tampering rule, how to display a series with gaps |
| `references/honest-scorekeeping.md` | The task-versus-self position on neutral or motivating, the six banned win-manufacturing moves, the five banned crisis-manufacturing moves, the exact poor-week block and its triggers and its own escalation, blameless about the person and exact about the record, the full Friday versus Sunday argument, the three self-diagnosis signatures |
| `references/top-three-selection.md` | Why not the loudest three, the candidate pool, the three weighted factors with their scoring tables, the five tie-breaks, the escalate-or-drop block and the week-four default drop, the self-diagnosis line, the honest statement that the archive does not support three, the four-line output shape, the two no-pick cases |
| `references/littlebird-mcp-reference.md` | Tool inventory, parameters, return shapes, known limitations, the Routines-observe Cowork-acts pattern |
| `references/evidence-standards.md` | Receipts, the four kinds of line, confidence ratings, attribution guardrail, partial rosters, confirmation gates, empty retrieval |
| `references/research/distilled-weekly-review-design.md` | Cited distillation: what the monitoring evidence supports and what it does not, the cost that gets abandoned, self-assessment accuracy, the task-versus-self reading of the feedback literature, the setback asymmetry, the run chart thresholds and the live conflict inside them, why scorecards get abandoned, the mere urgency effect, the timing argument, the individual retrospective problem, seven fenced numbers, seven named gaps |
| `references/research/README.md` | Archive layout, sweep coverage against every required target, source quality ranking, four things to know first |
| `references/research/raw/` | Seventeen archived sources, each with title, URL, fetch date, and source type |
