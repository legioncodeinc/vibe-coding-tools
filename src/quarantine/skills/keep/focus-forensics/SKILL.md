---
name: focus-forensics
description: "Weekly attention forensics from Littlebird capture. Trigger on how fragmented was my week, where did my attention go, focus report, am I context switching too much, what broke up my week, rabbit hole check, weekly focus review, why did I get nothing done. Counts observed switches between work contexts, run length in consecutive snapshots, fragmentation by hour of day, named rabbit holes against stated intentions, and meeting load against unbroken calendar time. Ships week-over-week change plus one behavioral experiment to try. Never produces hours lost, percentages of the day, or a productivity score, because periodic snapshots cannot measure those. Self-analysis only, never pointed at another person."
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan)"
---

# Focus Forensics

Shows the user the structure of their own week: where work held together, where it broke
apart, which hours were most broken up, what kept reappearing next to something they said
they were not doing, and how all of that changed since last week.

It does not tell them how many hours they lost, because it cannot know that and neither
can anything else built on periodic screen capture.

## Purpose

Littlebird takes periodic snapshots of the screen. It is not a continuous time tracker.
Between any two snapshots nothing is observed: not whether the user was at the machine,
not whether the visible window was the focused one, not what happened in the gap.

That single fact determines the whole design. A skill built on this instrument can count
transitions, measure runs in consecutive snapshots, compare hour against hour within one
person, name recurring topics, do arithmetic on a real calendar, and compare this week to
last week. It cannot produce a time ledger, and a report that says "you lost 6 hours to
context switching" is asserting something the instrument never measured.

The evidence is not marginal on this point. Even full continuous OS-level window logging
across 1,509 hours could not establish "how engaged a user was with a window in active
use" without interrupting participants to ask
(`references/research/distilled-attention-fragmentation.md`, section 6). The controlled
experiment most often cited for the hours framing found interrupted participants finishing
FASTER, at 20.31 and 20.60 minutes against 22.77 uninterrupted, with the cost appearing in
stress and frustration rather than in elapsed time
(`references/research/distilled-attention-fragmentation.md`, section 2). And the famous
"23 minutes 15 seconds to refocus" figure appears in interviews and media, not in any
paper; this sweep fetched the full text of the study usually credited with it and verified
that the number 23 does not appear anywhere in it
(`references/research/distilled-attention-fragmentation.md`, section 1).

So the skill ships switching patterns and fragmentation structure. Read
`references/what-snapshots-can-and-cannot-measure.md` before writing any number into any
output. It carries the forbidden-claims list and it is not advisory.

## Littlebird MCP calls used

Real tool names, verified in `references/littlebird-mcp-reference.md`.

| Tool | Used for |
|---|---|
| `search_user_context` | The daily snapshot backbone with `filters.data_source: "snapshots"`, the compressed pass with `"summaries"`, stated intentions with `search_queries_messages`, and per-app presence checks with `filters.app` |
| `LB_INTERNAL_LIST_MEETINGS` | Meeting load and unbroken calendar time, over the window and again with a future `end_date` for the week ahead. The one genuinely measured input this skill has |
| `LB_INTERNAL_GET_MEETING` | The `## For You` and `## Action Items` blocks, as a source of stated intentions with owner attribution |
| `LB_INTERNAL_GET_ROUTINE_REPORTS` | Reading this skill's own past reports before computing week-over-week change. Mandatory on every run |
| `LB_INTERNAL_CREATE_ROUTINE` | Offering to set up the weekly observer, after approval |
| `LB_INTERNAL_GET_ROUTINE_CONFIG` and `LB_INTERNAL_UPDATE_ROUTINE` | Editing an existing routine. `GET_CONFIG` first, always: `prompt` and `schedule` are replaced wholesale |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | Checking the plan supports another routine before offering to create one |

Not used, and worth naming so nobody reaches for them: there is no Littlebird tool that
searches past Littlebird chat conversations, so stated intentions come from
`search_user_context` with `search_queries_messages` and from meeting summary blocks. There
is no calendar tool; upcoming events come from `LB_INTERNAL_LIST_MEETINGS` with a future
`end_date`. Meeting transcripts are not fetched by this skill at all.

## Capability gate

This skill requires the Littlebird MCP on a Power or Pro plan.

Before anything else:

1. List the tools actually available in this session and use the real tool names. Do not
   assume a tool exists because it is named in `references/littlebird-mcp-reference.md`.
2. If no Littlebird MCP tools are present, stop and tell the user the skill needs the
   Littlebird MCP connected. Do not attempt a partial run from memory or from any other
   source.
3. If routine creation is part of the request, call `LB_INTERNAL_GET_SUBSCRIPTION_STATUS`
   first to confirm the plan supports another routine.

Read `references/evidence-standards.md` before writing any output. Every line in the report
is observed, inferred, external or unknown, and the kind is visible to the reader.

## Trigger

Direct asks: how fragmented was my week, where did my attention go, focus report, am I
context switching too much, what broke up my week, rabbit hole check, weekly focus review,
why did I get nothing done this week, which hours are my best.

Indirect triggers worth catching: the user says the week felt scattered, asks what happened
to a specific day, asks whether a change they made last week helped, or asks to see whether
their calendar is eating their mornings.

Do NOT trigger on a request to analyze anyone else's activity. See the guardrail.

## Routine cadence

| Mode | Trigger | Window | Output |
|---|---|---|---|
| **Weekly routine** | Scheduled, unattended, Monday morning | Last 7 days, plus its own past reports | A routine report naming this week's structure and what CHANGED. No files, no approvals |
| **On demand** | User asks in Cowork or Claude Code | 7 days by default, 14 or 28 on request | The full report file, plus the context taxonomy confirmation on a first run |

The routine observes and reports. The on-demand run writes the file, confirms the taxonomy,
and holds the rabbit hole confirmation gate open. A routine cannot create or update routines
and cannot hold an approval gate open
(`references/littlebird-mcp-reference.md`).

**Offer to create the routine.** Routines CAN be created from an interactive session. Show
the user the exact prompt text and schedule from the routine wiring section below, get
approval with `AskUserQuestion`, then call `LB_INTERNAL_CREATE_ROUTINE`. Do not tell the
user to go and set it up by hand.

## Process

### 0. Read the past reports first

Call `LB_INTERNAL_GET_ROUTINE_REPORTS` on the focus-forensics routine with `limit` 8 before
any retrieval, and extract the fields listed in
`references/week-over-week-reporting.md`. Week-over-week change is this skill's primary
output, and it cannot be computed from a window read in isolation.

If no routine exists and no prior artifact is present in the working directory, this is a
first run. Say so, produce the single-window report, and offer the routine.

### 1. Retrieve

Full brief in `references/switch-and-run-detection.md`, step 1. Day-scoped parallel calls
for the snapshot backbone, one compressed summaries pass, one intentions pass, targeted
per-app presence checks, and the meeting list over the window and one week forward.

Narrow parallel queries beat one broad query on both scoring and result size; a broad query
returns 70,000 plus characters and gets dumped to a file
(`references/littlebird-mcp-reference.md`). Read the relevance scores: items below 3 are
omitted by the server entirely and a 3-scored item never establishes a context run on its
own.

### 2. Deduplicate, order, label

`references/switch-and-run-detection.md`, steps 2 and 3. Collapse OCR duplicates, sort by
timestamp because retrieval returns items by relevance rather than chronologically
(`references/evidence-standards.md`, rule 8), then assign each snapshot a work context.

The context taxonomy rule that matters most: the same app can carry several contexts.
Collapsing a browser to one context destroys the entire analysis, because a browser-heavy
user would then show almost no switching. Where OCR does not support a confident label the
context is `unclear`, and the count of `unclear` snapshots is reported next to every metric
that depends on labeling.

Context labels are inferences layered over observations and the report says so
(`references/evidence-standards.md`, rule 2).

### 3. Compute the structure

Run `scripts/switch_metrics.py` on the labeled snapshot list. It derives the observed
cadence and the gap threshold, classifies every adjacent pair as a switch, hold, break or
unclear boundary, builds the run distribution, computes hour and weekday transition rates
with their sample sizes and a reporting floor, finds bursts, and emits an exclusions block.

The arithmetic is deterministic and a wrong headline count is the fastest way this report
loses trust, which is why it lives in a script rather than in the model's head. The script
assigns no labels and makes no judgments; every one of those stays with the model and the
user.

Full definitions in `references/switch-and-run-detection.md`, steps 4 through 9: what
counts as a switch, why a break is never a switch and never interpreted, how runs are built
and reported as a distribution rather than a mean, the hour-bucket floor, meeting load
arithmetic, and what a burst is.

### 4. Name rabbit holes, if any clear the bar

`references/rabbit-hole-identification.md`. Three conditions, all required: three or more
separate runs, inside a window where the user stated a different intention in their own
captured words, and not plausibly part of that intention.

No stated intention means no rabbit hole finding. Without one the skill would be
substituting its own opinion about what the user should have been doing, which is exactly
the register that gets a report turned off.

Every named rabbit hole carries the quoted intention with its receipt, the run count and
snapshot count, the dates and times of each run, and a neutral description. Missing any of
the four, it does not appear. Cap the section at two.

The attribution guardrail applies at full strength: captured content shows what the user
was VIEWING, not what they wrote (`references/evidence-standards.md`, rule 4). An intention
that cannot be attributed to the user is not an intention.

### 5. Compare against last week

`references/week-over-week-reporting.md`. Run the four comparability gates before printing
a single delta: cadence, coverage, taxonomy overlap, and unclear rate. A gate that fails is
reported, not worked around.

Then compare the metrics listed in that guide, respect the indifference band, and do not
call two points a trend.

This is the section that goes above the fold. Two measurements taken by the SAME imperfect
method can be compared, because whatever the method distorts it distorts both times, and
that is far more defensible than either week's absolute number
(`references/research/distilled-attention-fragmentation.md`, section 4).

### 6. Offer one experiment

One change, tied to the specific pattern observed, with a way to tell next week whether it
worked. Selection table, the four required parts, and the two forbidden nudges are in
`references/week-over-week-reporting.md`.

The two forbidden nudges, restated here because they will otherwise be offered every week:
never present batching email as a proven remedy, because the only logged test of it found
no stress benefit
(`references/research/distilled-attention-fragmentation.md`, section 9); and never suggest
the user try harder or be more disciplined, because the interventions that moved measured
behavior removed something from the environment while the one that asked the person to
reorganize around the same environment failed
(`references/research/distilled-attention-fragmentation.md`, section 9).

### 7. Write it in the right register

`references/week-over-week-reporting.md`, tone section. Neutral and curious. A colleague
showing the user something interesting in the data, not a coach and not an auditor.

A report that makes the user feel judged gets turned off in two weeks, and a skill that is
turned off has zero effect regardless of accuracy. The banned word list is in that guide
and half of it is banned for being false rather than for being unkind: the instrument
cannot measure `distracted`, `productive`, `deep work` or `flow state`, so those words are
not available even when they would be flattering.

## Retrieval brief

The actual calls. Substitute the window dates. Per-family detail in
`references/switch-and-run-detection.md`.

**The daily snapshot backbone**, run once per day in the window, never once for the window

```
search_user_context
  search_queries:   ["what was on screen", "application in use", "document being edited",
                     "browser tab", "terminal or editor"]
  standalone_query: a one sentence statement that this is a sweep of everything captured
                    on this one day, in order, to reconstruct which contexts appeared
  date_range:       {start: "YYYY-MM-DD 00:00:00", end: "YYYY-MM-DD 23:59:59"}
  filters:          {data_source: "snapshots"}
```

**The compressed pass**, to name contexts and catch days the backbone thinned out

```
search_user_context
  search_queries: ["what I worked on", "activity summary"]
  date_range:     {start: window start, end: "now"}
  filters:        {data_source: "summaries"}
```

Summaries name contexts and fill gaps. They are never counted as snapshots. Mixing the two
units corrupts every count in the report.

**Stated intentions**, which rabbit-hole detection requires

```
search_user_context
  search_queries:          ["today I need to", "priority for this week", "focus on",
                            "plan for today", "to do list"]
  search_queries_messages: ["what I said I would work on", "I am working on"]
  date_range:              {start: window start, end: "now"}
```

Only messages tagged `(From:[user])` are the user's own
(`references/evidence-standards.md`, rule 4). Message items carry a send time that differs
from the collection time, and the send time governs the timeline
(`references/evidence-standards.md`, rule 8).

**Per-app presence checks**, only for apps a first pass already surfaced

```
search_user_context
  search_queries: [the app or site name, the app name plus a typical task in it]
  date_range:     {start: window start, end: "now"}
  filters:        {app: "the app", data_source: "snapshots"}
```

**Meetings and unbroken calendar time**

```
LB_INTERNAL_LIST_MEETINGS
  start_date: window start
  end_date:   window end
  limit:      100
```

Run again with `end_date` one week in the future for the shape of the week ahead. Upcoming
events carry no id, no summary and no transcript
(`references/littlebird-mcp-reference.md`). Unrecorded calendar events count exactly as
much as recorded ones here: the block was on the calendar either way.

**Intentions from meetings**, for meetings that produced them

```
LB_INTERNAL_GET_MEETING
  meeting_id: the recorded ids from the list above
```

Take the `## For You` section and the `## Action Items` lines owned by the user. Both carry
owner attribution already (`references/littlebird-mcp-reference.md`). Do not fetch
transcripts; this skill has no use for them.

## Empty retrieval

If snapshot retrieval returns nothing across the window, report the window, the queries
run, and the date ranges tried, and stop (`references/evidence-standards.md`, rule 9). Do
not widen the window silently, do not substitute a plausible week, do not reason from what
the user was probably doing.

If retrieval returns snapshots for fewer than three days in a seven day window, or fewer
than 50 snapshots total, coverage is too thin for the switching analysis. Report the
coverage that existed, deliver the meeting-load section on its own since calendar data is
unaffected, skip the week-over-week comparison, and skip the nudge. A nudge from a thin
week is a guess dressed as a finding.

If the meeting list is empty but snapshots are present, run everything else and say the
calendar section had no entries. That is a real finding about the week, not a failure.

## Output

One file per deep run:

```
focus-forensics-YYYY-MM-DD.md
```

in the working directory or a directory the user names, dated by the window END date.

Ten sections, in fixed order with fixed headings so a later run can parse its own prior
output. Full spec in `references/week-over-week-reporting.md`.

1. `## How this was measured`. The limitation note verbatim, window dates, observed
   cadence, queries run.
2. `## Coverage`. Days with snapshots, snapshot count, per-day counts, break count,
   `unclear` share, any failed comparability gate.
3. `## This week's structure`. Snapshot count, switch count, transition rate, median run
   length in snapshots, longest run with its bounded interval, count of runs of length 1,
   count of runs of length 5 or more, burst list.
4. `## Compared with last week`. The comparison table. **The primary section.**
5. `## By hour and by day`. Top three and bottom three hours with sample sizes, weekday
   shape, thin hours listed separately.
6. `## Meetings and unbroken calendar time`. Meeting count, scheduled minutes, gaps of 90
   minutes or more. Real minutes, no causal claim.
7. `## Recurring alongside a stated intention`. At most two rabbit holes, or a line saying
   none cleared the bar.
8. `## Last week's experiment`. Passed, failed, or inconclusive, with both numbers.
9. `## One thing to try this week`. The nudge, in four parts.
10. `## What this report did not look at`. Excluded categories, the forbidden claims, any
    named gap that affected this run.

The context taxonomy persists across runs in `focus-contexts.md` in the same directory, so
that week two counts the same things week one counted.

Raw retrieved capture is working data and does not ship in the artifact
(`references/evidence-standards.md`, rule 7).

**Nothing is sent, posted, or written into any third-party system.** This is a private
artifact for the user alone. If the user asks for a shareable version, show them the exact
text and get approval of the words rather than of the plan
(`references/evidence-standards.md`, rule 6). Approving a plan is not approving the words.

## Guardrail

**This skill analyzes the user's own capture, for the user, and nothing else. Pointing it
at another person would be surveillance.**

It does not run against a named colleague, report or contractor. It does not produce a
comparison between two people. It does not produce an artifact framed for a manager. It
does not characterize anyone else's attention, activity or diligence, even when other
people appear in the capture, which they will.

If the user asks to run it on someone else, decline and say why in one sentence. Do not run
a reduced version, do not run it "just to see", do not offer a de-identified variant. Offer
instead to help them ask that person to run it on themselves and share what they choose to
share.

The reason is evidential, not decorative. Electronic monitoring carries a small positive
correlation with employee strain and a small negative correlation with job attitudes, and
its apparently neutral average effect on performance may reflect suppression, meaning real
harms and real gains cancelling rather than nothing happening
(`references/research/distilled-attention-fragmentation.md`, section 10). The strongest
controllable moderator named in that review is how the monitoring is implemented and
communicated. A person voluntarily reading their own capture sits at the benign end of that
moderator; a manager running the identical computation on a report sits at the other end.
The computation being identical is exactly the point.

The second half of the guardrail is what the skill refuses to print about the user
themselves. The full list is in
`references/what-snapshots-can-and-cannot-measure.md`. The short version: no total hours
lost, no percentage of the day, no productivity or focus score, no comparison against any
other person or any published benchmark, no minutes of cost per switch, no "23 minutes 15
seconds" in any framing including a debunking one, no "you were focused" or "you were
distracted", and no claim whatsoever about what happened between two snapshots.

If the user explicitly asks for hours, do not produce them. Explain what the instrument is
in two sentences, offer the switch and run structure instead, and let them decide whether
that answers the question. A user told plainly why they cannot have a number will trust the
numbers they do get.

The third half, and it matters as much as the other two: sensitive material stays out.
Health, medical, financial, legal, family, job searching, and anything about a named third
party's behavior are excluded from the artifact even when the capture contains them and
even when they would satisfy every detection rule
(`references/evidence-standards.md`, rule 10). The report says a category was excluded and
does not say which one.

## Routine wiring

Create the weekly observer with `LB_INTERNAL_CREATE_ROUTINE` after showing the user this
exact prompt and schedule and getting approval with `AskUserQuestion`. Creating it generates
a first report immediately, then it runs on schedule.

```
title:    Weekly focus forensics
schedule: {"frequency": "weekly", "time": "08:00", "week_days": ["MO"]}
notifications_enabled: true
email_notifications_enabled: false
```

Monday morning is deliberate. The report is about the week that just ended, and it lands
before the new week has taken its shape.

Exact `prompt` text to pass:

```
You are running a weekly focus forensics report for one person, on their own
captured screen history, for their own use. Your job is to describe the structure of
their week and what changed since last week. You are a colleague showing them
something interesting in their own data. You are not a coach, not an auditor, and
you never tell them how they should have spent their time.

STEP 1. MEMORY FIRST. Before anything else, call LB_INTERNAL_GET_ROUTINE_REPORTS for
this routine with limit 8 and read every past report. Pull out of each one: the
window dates, the median interval between snapshots, the snapshot count, the switch
count, the transition rate, the median run length, the count of runs of length 1,
the top and bottom hours with their sample sizes, the meeting count and scheduled
minutes, the named recurring topics, and the experiment that was suggested along
with how it was to be checked. You need all of this in steps 5 and 7. Do not skip
this step. A report that describes this week without comparing it to the last one
has failed, because the comparison is the only part of this report that is properly
trustworthy.

STEP 2. GATHER. Run one search_user_context call per day of the last 7 days with
filters data_source snapshots, using several narrow queries about what was on
screen, which application was in use, what document was being edited, which browser
tab was open, and what was in the terminal or editor. Do not run one broad call for
the whole week; it will overflow and it will score worse. Then run one
search_user_context call over the whole week with data_source summaries to name the
work and catch days the snapshot sweep thinned out. Then run one search_user_context
call over the whole week for stated intentions, using both the general queries and
the message queries, looking for things this person wrote down about what they
planned to work on. Then call LB_INTERNAL_LIST_MEETINGS for the last 7 days with
limit 100, and again with an end date 7 days in the future. Do not fetch any meeting
transcripts.

STEP 3. ORDER AND LABEL. Retrieval returns items by relevance, not by time, so sort
every snapshot by its collection timestamp before you count anything. Collapse
repeated identical OCR lines and items sharing a timestamp and an app into single
observations. Then give each snapshot a short work context label taken from the
person's own vocabulary: a project name, a client name, a repository name, a
document title. The same application can carry several different contexts and a
browser almost always does; if you collapse a browser into one context you will
destroy the whole analysis. Where the captured text does not support a confident
label, the context is unclear. Never guess a label. Report how many snapshots were
unclear.

STEP 4. COUNT. A switch is an adjacent pair of snapshots, in time order, whose
context labels differ. Compute for the week: the snapshot count, the median interval
between snapshots, the switch count, and the transition rate which is switches
divided by adjacent observed pairs. Any adjacent pair separated by more than four
times the median interval, or more than 20 minutes, whichever is larger, is a
capture gap and not a switch. Capture gaps are counted and reported and never
interpreted; you do not know what happened in them. Then build runs, where a run is
a maximal sequence of consecutive snapshots sharing one context. Report the median
run length in snapshots, the number of runs of length 1, the number of runs of
length 5 or more, and the single longest run with its context and the clock time of
its first and last snapshot. Then compute the transition rate for each hour of the
day, and report only hours with at least 20 adjacent pairs, at most the top three
and bottom three, always printing the number of pairs next to the rate. Then from
the meeting list compute per day the meeting count, the total scheduled minutes, and
the number of gaps of 90 minutes or more between meetings.

STEP 5. COMPARE. This is the most important part of the report. Before comparing
anything, check four things. If the median interval between snapshots changed by
more than 25 percent since last week, the counts are not comparable and you must say
so and skip the count comparisons. If either week had fewer than 3 days with
snapshots or fewer than 50 snapshots, skip the comparison and name the thin week. If
the context labels this week barely overlap last week's, say the work changed and
compare only the snapshot count, the transition rate, the run lengths and the gap
count. If the share of unclear snapshots moved by more than 10 percentage points,
print that caveat next to every context-dependent comparison. Then compare: the
transition rate, the median run length, the count of runs of length 1, the count of
runs of length 5 or more, the longest run, whether the set of most and least
fragmented hours changed, the meeting count and scheduled minutes, and the number of
90 minute gaps. Treat a transition rate change under 5 percentage points, or a
median run length change under 1 snapshot, as about the same rather than as a
finding. If you have fewer than four comparable past reports, describe the change
and do not describe a direction of travel; two points are not a trend.

STEP 6. RECURRING TOPICS. Name a recurring topic only when all three of these hold:
it appeared in three or more separate runs, it appeared inside a window where this
person had written down a different intention in their own words, and it is not
plausibly part of that intention. Quote their stated intention verbatim with its
date and source. Give the number of runs, the total snapshots, and the date and
clock time each run started. Describe the topic neutrally with no evaluative
adjective. Then add a line saying this is a count of appearances next to something
they wrote down, that it is not a judgment about whether the reading was worth
doing, and that you have no way to know whether it turned out to be relevant after
all. Name at most two. If no stated intention was found anywhere in the week, say
that and name none. Never name anything touching health, medical, financial, legal,
family or job searching matters, anything about another named person's behavior, or
anything from someone else's screen share or dashboard. If you excluded something on
those grounds, say only that a category was excluded.

STEP 7. THE EXPERIMENT. First resolve last week's. If the check you set passed, say
so in one line with both numbers. If it failed, say so in one line with both numbers
and do not suggest the same thing again. If it was inconclusive because coverage was
thin, say so and suggest the same thing again with a clearer check. Then suggest
exactly one change for this week. It must be tied to a specific pattern you observed
this week, it must be concrete enough to do without deciding anything further, name
an actual application or an actual day and time, and it must come with a check
expressed in a number this report already prints, with a threshold. Prefer changes
that remove something from the environment, such as turning off notifications for
one named application during named hours, or blocking one specific 90 minute gap that
is already free on the calendar. Do not suggest batching email or messages as a
proven remedy; the only logged study of it found no stress benefit, and if you
suggest it at all you must say that. Do not suggest trying harder, concentrating
more, or being more disciplined. If the week was too thin, or nothing clear emerged,
say there is no experiment this week and explain why. One suggestion, never a list.

STEP 8. WRITE. Open with a short note saying Littlebird takes periodic snapshots of
the screen, that it is not a time tracker, that nothing between two snapshots is
observed, and that week over week change is the most trustworthy line in the report
because both weeks were measured the same imperfect way. Then in this order:
coverage, this week's structure, what changed since last week, the hour and weekday
shape, meetings and unbroken calendar time, recurring topics, last week's experiment
resolved, and this week's one experiment. Name at least one thing that held up, such
as the longest run or the least fragmented hour, when the data supports it; report it
as evidence, not as consolation.

RULES.
Never report hours lost, minutes spent, a percentage of the day, a productivity
score, a focus score, or a grade of any kind. The instrument cannot measure them.
Never compare this person to anyone else, to an average, or to any published figure.
Never write the figure 23 minutes 15 seconds, in any framing, including one that
denies it. There is no paper containing it.
Never say they were focused or distracted. Engagement is not observable from
snapshots, and it is not observable from full window logging either.
Express run lengths in consecutive snapshots. Where you give clock times for a run,
say explicitly that it is an interval bounded by two observations and not a measured
duration.
The only real minutes in this report are scheduled meeting minutes from the
calendar. Do not let those license inventing any other minutes.
Report meeting load and fragmentation side by side and do not claim one caused the
other.
Print the sample size next to every rate. A rate without its sample size is not a
finding.
Never use these words about this person: wasted, lost, squandered, poor, bad, worst,
should have, distracted, unfocused, undisciplined, procrastinating, productive,
unproductive, deep work, flow state.
If this report disagrees with how their week felt, say the two differ and stop
there. Do not tell them their memory is wrong.
This report is about this one person's own capture, for them. Never analyze anyone
else's activity and never write an artifact framed for a manager.
If retrieval returns nothing for the week, say the week was empty, say which queries
you ran, and stop. Do not widen the window and do not invent a week.
End with one line: open Cowork and run focus-forensics for the full report file, the
per-hour detail, and the context taxonomy.
```

Four properties of that prompt are load-bearing and must survive any edit. It reads its own
past reports before writing anything. It reports change rather than standing state. It
resolves the previous experiment before suggesting a new one, and refuses to re-suggest an
experiment that failed, which is the escalation rule for this skill: a routine that never
escalates flags the identical top item week after week with no change in approach, which is
the specific failure observed in production
(`references/littlebird-mcp-reference.md`). And it carries the banned-word list, because
tone is a functional requirement here rather than a style preference.

`UPDATE_ROUTINE` replaces the whole prompt and the whole schedule. Always call
`LB_INTERNAL_GET_ROUTINE_CONFIG` first (`references/littlebird-mcp-reference.md`).

### Handoff to Cowork

The routine ends by naming this skill. The deep run calls
`LB_INTERNAL_GET_ROUTINE_REPORTS` on the focus-forensics routine before retrieving
anything, so it inherits the metric history, the experiment history and their outcomes, and
the context taxonomy the user already corrected. A taxonomy label the user renamed is never
silently reverted.

## Ship Gate

Ship Gate removed, research-only skill, produces no committable code.

## Related skills

| Skill | Relationship |
|---|---|
| `client-health-radar` | Same house pattern of shipping structure instead of a score, for the same reason: the obvious metric is not measurable. Read its `sentiment-limits.md` alongside this skill's `what-snapshots-can-and-cannot-measure.md` |
| `routine-architect` | Creating, auditing and editing Littlebird routines. Use it if the user wants this routine's schedule or prompt reworked rather than replaced |
| `daily-brief` | The daily forward-looking counterpart. Focus forensics looks backward at structure; the brief looks forward at the day |
| `commitment-tracker` | Uses the same `## For You` and `## Action Items` blocks for a different purpose. If the user's stated intentions are mostly meeting commitments, run that one for the commitments and this one for the structure |

## Reference map

| File | Read it for |
|---|---|
| `references/what-snapshots-can-and-cannot-measure.md` | What the instrument is, the measured evidence behind the constraints, the forbidden-claims list, the bounded-interval phrasing, and the limitation note that appears in every report |
| `references/switch-and-run-detection.md` | The retrieval brief, deduplication, the context taxonomy, the switch definition, gaps and breaks, runs, hour buckets, meeting arithmetic, bursts, and confidence ratings |
| `references/rabbit-hole-identification.md` | The three-condition bar, finding stated intentions, the required evidence, the house format, the exclusion list, and the never-point-this-at-anyone-else rule |
| `references/week-over-week-reporting.md` | The comparability gates, what gets compared, the indifference band, the single nudge and its four parts, the tone rules and banned words, and the artifact spec |
| `references/littlebird-mcp-reference.md` | Tool names, parameters, return shapes, known limitations |
| `references/evidence-standards.md` | Receipts, the four kinds, confidence ratings, confirmation gates |
| `references/research/distilled-attention-fragmentation.md` | Every domain claim in this skill, cited to a raw source |
| `references/research/README.md` | The archive index, the window exceptions, the concentration risk, and the named gaps |
| `scripts/switch_metrics.py` | The deterministic switch, run, hour and burst arithmetic |
