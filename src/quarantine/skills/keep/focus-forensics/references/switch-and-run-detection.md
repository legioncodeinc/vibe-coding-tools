# Switch and run detection

The retrieval brief, the context taxonomy, the switch definition, and the run and hour
arithmetic. Read `references/what-snapshots-can-and-cannot-measure.md` first. Nothing here
overrides the forbidden-claims list.

## Step 0: know what one snapshot is worth

Each retrieved snapshot item arrives prefixed `[Time collected | App]`
(`references/littlebird-mcp-reference.md`). That prefix is the entire unit of analysis: a
timestamp and an application, plus whatever OCR text came with it.

Two consecutive snapshot items with different apps are two observations and one observed
transition. That is the atom this whole guide is built from.

## Step 1: retrieval brief

Run narrow parallel queries, never one broad query. A broad query returns 70,000 plus
characters and gets dumped to a file (`references/littlebird-mcp-reference.md`).

**The daily backbone.** Run this once per day in the window, not once for the window. Seven
day-scoped calls beat one week-scoped call on both scoring and result size.

```
search_user_context
  search_queries:   ["what was on screen", "application in use", "document being edited",
                     "browser tab", "terminal or editor"]
  standalone_query: a one sentence statement that this is a sweep of everything captured
                    on this one day, in order, to reconstruct which contexts appeared
  date_range:       {start: "YYYY-MM-DD 00:00:00", end: "YYYY-MM-DD 23:59:59"}
  filters:          {data_source: "snapshots"}
```

**The compressed pass, for days the backbone thins out.** Littlebird writes its own daily
activity summaries and they are the cheapest compressed view of a day
(`references/littlebird-mcp-reference.md`).

```
search_user_context
  search_queries:   ["what I worked on", "activity summary"]
  date_range:       {start: window start, end: "now"}
  filters:          {data_source: "summaries"}
```

Summaries are used to NAME contexts and to catch days the snapshot sweep missed. They are
never counted as snapshots. Mixing the two units corrupts every count in the report.

**Stated intentions, which rabbit-hole detection needs.**

```
search_user_context
  search_queries:   ["today I need to", "priority for this week", "focus on",
                     "plan for today", "to do list"]
  search_queries_messages: ["what I said I would work on", "I am working on"]
  date_range:       {start: window start, end: "now"}
```

**Per-app presence checks, only for apps a first pass already surfaced.** Asking whether a
named app appeared is a legitimate, answerable question and a negative answer is a real
finding (`references/littlebird-mcp-reference.md`).

```
search_user_context
  search_queries:   [the app or site name, the app name plus a typical task in it]
  date_range:       {start: window start, end: "now"}
  filters:          {app: "<the app>", data_source: "snapshots"}
```

**Meetings, which are the one genuinely measured input.**

```
LB_INTERNAL_LIST_MEETINGS
  start_date: window start
  end_date:   window end
  limit:      100
```

Run it again with `end_date` one week in the future to see the shape of the week ahead.
Upcoming events carry no id, no summary and no transcript
(`references/littlebird-mcp-reference.md`). This call returns BOTH recorded meetings and
unrecorded calendar events, and the unrecorded ones matter just as much here, because a
calendar block fragments a day whether or not anyone recorded it.

**Read the relevance scores.** Items below 3 are omitted by the server entirely, and an
item scored 3 is a maybe (`references/littlebird-mcp-reference.md`). A 3-scored snapshot
never establishes a context run on its own.

## Step 2: deduplicate before counting anything

OCR of dense UI produces fragments, duplicate lines and interleaved chrome, and repeated
identical lines are one observation, not several
(`references/littlebird-mcp-reference.md`).

Rules, applied in this order:

1. Two items with the same collection timestamp and the same app are one snapshot. Merge
   their text.
2. Items whose text is a strict subset of another item at the same timestamp are dropped.
3. Sort the surviving snapshots by timestamp ascending. Retrieval returns items ordered by
   relevance, not chronologically (`references/evidence-standards.md`, rule 8), and every
   count in this guide depends on chronological order.

`scripts/switch_metrics.py` performs steps 1 through 3 and everything in steps 4 through 7
below. Use it. The arithmetic is deterministic, easy to get subtly wrong by hand, and a
wrong headline count is the fastest way this report loses trust.

## Step 3: assign a context to each snapshot

A **context** is coarser than an application and finer than a project. It is the answer to
"what was this person doing", at the grain a person would recognize a week later.

Two levels, both recorded on every snapshot:

- **App**, taken verbatim from the snapshot prefix. Mechanical, no judgment.
- **Work context**, a short label the model assigns from the OCR text plus the app.

Rules for assigning a work context:

1. Prefer a label the user's own material already uses: a project name, a client name, a
   repository name, a document title. Never invent a taxonomy of your own.
2. The same app can carry several contexts. A browser on a client dashboard and a browser
   on an unrelated forum are two contexts. Collapsing them to "chrome" destroys the entire
   analysis, because a browser-heavy user would show almost no switching.
3. Different apps can carry one context. An editor, a terminal and a docs tab all on the
   same feature are one context.
4. If the OCR does not support a confident label, the context is `unclear`. Do not guess.
   `unclear` snapshots break a run but are never counted as a switch INTO anything, and the
   count of `unclear` snapshots is reported alongside every metric that depends on
   labeling.
5. Communication apps get one context per thread family where the OCR supports it, and a
   single `comms` context where it does not. Say which was used.

Contexts are an inference layered over observations (`references/evidence-standards.md`,
rule 2), and the report labels them as such. The snapshot timestamps and app names are
observations. The grouping into contexts is not.

## Step 4: define a switch, once, and never vary it

**A switch is an adjacent pair of snapshots, in timestamp order, whose work-context labels
differ.**

That is the whole definition. Consequences worth stating out loud:

- The switch count for a day is at most one less than the snapshot count for that day.
  Report both. A switch count without its snapshot count is meaningless, because a day with
  more snapshots will show more switches for no behavioral reason at all.
- Switches are not comparable across days with different snapshot counts unless normalized.
  Normalize as switches per adjacent snapshot pair, which is a proportion between 0 and 1.
  Call it the **transition rate**. Never call it a rate per hour or per minute.
- A gap between two snapshots longer than the **gap threshold** does not produce a switch,
  in either direction. It produces a **break**. See step 5.
- A switch into or out of `unclear` is not counted. It ends the run and is recorded as a
  boundary.

## Step 5: gaps, breaks, and the threshold

Littlebird's capture cadence is not guaranteed and is not published in
`references/littlebird-mcp-reference.md`. Derive it, do not assume it.

1. Compute the interval between every adjacent pair of snapshots across the window.
2. Take the median interval. That is the **observed cadence** for this user in this window.
   Report it in the method section of every artifact, because it is the resolution limit of
   everything else in the report.
3. Set the **gap threshold** at four times the median interval, or 20 minutes, whichever is
   larger.
4. Any adjacent pair separated by more than the gap threshold is a **break**, not a switch.
   Breaks end runs and are excluded from transition-rate denominators.

Breaks are reported as their own count and are explicitly NOT interpreted. A break means
the capture stopped or thinned out. It might be a meeting, lunch, a closed laptop, a
different machine, or capture failure. The report says "capture gap" and says nothing about
what the user was doing, because nothing was observed
(`references/evidence-standards.md`, rule 2).

If the observed cadence differs by more than 25 percent between the current window and the
comparison window, week-over-week comparison of counts is not valid and the report says so
in place of the comparison. See `references/week-over-week-reporting.md`.

## Step 6: runs

A **run** is a maximal sequence of consecutive snapshots sharing one work context,
uninterrupted by a switch, a break, or an `unclear` snapshot.

For each run record:

| Field | Value | Kind |
|---|---|---|
| Context label | The assigned label | Inferred |
| Length | Count of consecutive snapshots | Observed |
| First and last snapshot timestamps | From the capture | Observed |
| Bounded interval | Last timestamp minus first timestamp | Observed, and it is an INTERVAL not a duration |
| Terminator | switch, break, unclear, or end of day | Observed |

Report the distribution, never a mean alone:

- Median run length in snapshots.
- Longest run, with its context, its day, and its bounded interval.
- Count of runs of length 1, which is the fragmentation signature that matters most.
- Count of runs of length 5 or more, the user's supply of sustained work.

Every published run-length figure in the literature carries a standard deviation at or
above its own mean (`references/research/distilled-attention-fragmentation.md`, section 4).
The distribution is skewed. A mean is the wrong summary and this skill does not print one.

**The mandatory phrasing for the bounded interval** is in
`references/what-snapshots-can-and-cannot-measure.md`. Use it verbatim in shape. The
primary figure is the snapshot count; the clock span is context, labeled as an interval
bounded by two observations.

## Step 7: fragmentation by hour of day

This is the comparative output that survives the measurement problem best, because it
compares like with
like within one person, on an axis the literature says varies systematically
(`references/research/distilled-attention-fragmentation.md`, section 7).

For each hour bucket 0 through 23, across the window:

1. Count snapshots observed in that hour, summed across days. Call it `n_h`.
2. Count adjacent same-hour pairs that were switches. Call it `s_h`.
3. Count adjacent same-hour pairs total, excluding breaks. Call it `p_h`.
4. Transition rate for the hour is `s_h / p_h`.

Then apply the suppression rules, which are not optional:

- **An hour with fewer than 20 adjacent pairs is not reported as a rate.** It is listed
  under thin coverage with its raw counts. Roughly 96 observations buys a 10 percentage
  point margin at 95 percent confidence on a single proportion
  (`references/research/distilled-attention-fragmentation.md`, section 5); 20 pairs buys
  very little, and it is the floor below which a number is actively misleading.
- **Report at most the top three and bottom three hours.** Ranking all 24 invites the user
  to read noise as structure.
- **Print `n_h` next to every rate.** A rate without its sample size is not a finding.
- **Never name a target hour.** The published mid-afternoon focus peak came from one
  32-person sample and a second study found no time-of-day pattern at all
  (`references/research/distilled-attention-fragmentation.md`, section 7). The user's own
  shape is the only reference.

Weekday buckets follow the identical procedure with the identical floor.

## Step 8: meeting load against unbroken time

Calendar entries are the one genuinely measured input in the whole skill. They have real
start times, real end times and real durations, and none of that is inferred from a
snapshot.

From `LB_INTERNAL_LIST_MEETINGS` over the window, compute per day:

| Metric | Definition | Kind |
|---|---|---|
| Meeting count | Number of calendar entries | Observed |
| Scheduled meeting minutes | Sum of entry durations | Observed, and this IS a real duration |
| Largest unbroken calendar gap | Longest span between the end of one entry and the start of the next, within the day's first-to-last entry span | Observed |
| Number of gaps of 90 minutes or more | Count | Observed |
| Longest snapshot run that fell inside the largest gap | Cross-reference to step 6 | Mixed, label it |

Two rules.

1. **Meeting minutes are the only minutes this skill prints.** They are real. Everything
   else is counts and intervals. Do not let a real duration in one column license an
   invented duration in another.
2. **Do not claim meetings caused fragmentation.** Report meeting load and fragmentation
   side by side for the same day and let the user connect them. No source in the archive
   measures meeting load against unbroken working time, and the 2025 observational study
   reported no meeting effects at all
   (`references/research/distilled-attention-fragmentation.md`, section 11, gap 4). The
   arithmetic on the calendar is sound; the causal story is not in evidence.

An unrecorded calendar event counts exactly as much as a recorded one for this purpose. The
block was on the calendar either way.

## Step 9: what a burst looks like, and why it is worth flagging

A **burst** is a sequence of four or more consecutive snapshots in which every adjacent pair
is a switch, with no run of length 2 or more anywhere inside it.

This is worth flagging on its own, with no duration claim attached, because switch rate
measured with a continuous event log escalated from 0.84 per minute before an interruption
to over 2.3 per minute during resumption
(`references/research/distilled-attention-fragmentation.md`, section 4). A dense cluster of
transitions is a structural signature the literature recognizes.

Report bursts as: the day, the clock span they fall inside, the ordered list of contexts,
and the snapshot count. Do not label a burst as recovery, or as an interruption, or as
distraction. It is a dense cluster of observed transitions. What it was is the user's to
say.

## Confidence ratings on structural findings

Apply `references/evidence-standards.md`, rule 3:

| Rating | When |
|---|---|
| High | The finding rests on 30 or more snapshots with confident context labels, and holds when `unclear` snapshots are excluded and when they are treated as their own context |
| Medium | 10 to 29 snapshots, or the finding is sensitive to how `unclear` snapshots are handled |
| Low | Under 10 snapshots, or the context labels depend on OCR fragments, or several contributing items scored 3 in retrieval |

A Low-rated pattern never becomes the week's behavioral nudge.

## Empty and thin retrieval

If snapshot retrieval returns nothing for the window, report the window, the queries run
and the date ranges tried, and stop (`references/evidence-standards.md`, rule 9). Do not
widen the window silently and do not substitute a plausible week.

If retrieval returns snapshots for fewer than three days in a seven day window, or fewer
than 50 snapshots total, the report says coverage was too thin for the switching analysis,
prints what coverage there was, delivers the meeting-load section on its own since calendar
data is unaffected, and skips the nudge entirely. A nudge from a thin week is a guess
dressed as a finding.
