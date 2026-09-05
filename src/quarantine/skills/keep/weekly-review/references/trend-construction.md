# Trend construction: the series is the product, the week is a data point

A single week's numbers mean almost nothing. Four weeks of commitment closure rate means a
lot. This file specifies how many prior reports to read, how to build the series cheaply, what
language each series length licenses, and how to present a series honestly when only one or
two points exist.

The governing evidence, and it is unusually direct. When improvement data are presented on
dashboards and project updates, "people will often over- or under-react to a single or most
recent data point (and begin tampering, possibly making things worse)"
[research/distilled-weekly-review-design.md, section 6]. Tampering, meaning reacting to
common cause variation as if it were special cause, is measured rather than theoretical: in a
catapult demonstration, adjusting to chase the target produced a process spread of 28.1 inches
against 11.1 inches with no adjustment [research/distilled-weekly-review-design.md,
section 6].

A weekly review that also sets next week's priorities is a tampering machine unless something
stops it. This file is that something.

---

## 1. How much history to read, and why twelve

```
LB_INTERNAL_GET_ROUTINE_REPORTS
  routine_id: [this routine's id]
  limit:      12
```

Twelve, not five and not twenty-five. The reasoning:

- The run chart rules this skill borrows are defined for a series with a median, and the
  stricter published shift rule "takes at least 8 data points to signal a shift if one has
  between 12 and 22 data points in total" [research/distilled-weekly-review-design.md,
  section 6]. Twelve is the bottom of the band where that rule is defined.
- Twelve weeks is one quarter, which is a window a person can actually remember, so the
  reader can check the series against their own recollection.
- The tool's maximum is 25 and its default is 5 [littlebird-mcp-reference.md]. Five is not
  enough to compute a stable median. Twenty-five weeks of context is a cost the run does not
  need to pay for a rule defined at twelve.

Where fewer than twelve reports exist, read all of them and apply section 3.

## 2. The series line: how to read twelve reports without reading twelve reports

Reading twelve full scorecards to extract eight numbers is the wrong shape. **Every report
this skill writes ends with a fixed-format series line, and the next run parses that line
instead of the prose above it.**

The last line of every weekly-review report, exactly:

```
SERIES | 2026-08-16 | mtg 11 | hrs 14.5 | cc 7 | cd 2 | co 9 | leads 4 | money 2 | content 3 | top3carry 1
```

| Field | Meaning |
|---|---|
| date | Window end date, ISO |
| mtg | Meetings held |
| hrs | Hours in meetings, one decimal |
| cc | Commitments closed |
| cd | Commitments dropped |
| co | Commitments still open at window end |
| leads | Leads captured |
| money | Money findings raised |
| content | Content items shipped |
| top3carry | How many of this week's top three were carried from last week's top three |

Rules for the line:

- **A field that was not measured is written `na`, never `0`.** `cd na` and `cd 0` are
  different claims and the whole honesty design depends on the difference.
- A field produced by a fallback is suffixed with `~`, as in `cc 5~`. The tilde means the
  number is a reduced check and must not be plotted on the same footing as sibling figures.
- The line is the last line of the report and nothing follows it.
- If a prior report predates this format and has no SERIES line, extract what is extractable
  from its prose, mark every extracted value `~`, and say in the report that the early series
  was reconstructed.

## 3. What each series length licenses you to say

This is the honest-presentation rule for short series, and it is a hard table. **The
scorecard may not use language from a row it has not reached.**

| Points available | May say | Must not say | Required hedge |
|---|---|---|---|
| 1 | The number | Anything about direction | `First measured week. No baseline yet.` |
| 2 | "Up from" or "down from", with both values | "Trend", "improving", "declining", "momentum" | `One-week change against a single prior week. Not a trend.` |
| 3 to 4 | An early indication of the central tendency, using the source's own hedge | "Trend", "shift" | `Early indication only, [N] weeks of history.` |
| 5 to 7 | A trend, but only when the Trend rule fires: five or more consecutive points all rising or all falling | "Shift" | Name which rule fired. |
| 8 to 11 | Trend, plus a median and where this week sits against it | "Shift" | Name which rule fired. |
| 12 or more | Trend, median position, and a shift when six or more consecutive points sit on one side of the median | Causal claims | Name which rule fired. |

The thresholds are Perla's: a shift is "six or more consecutive points either all above or all
below the median", a trend is "five or more consecutive points all going up or all going
down", and a run chart is "useful with just three or four data points in order to get an early
indication of central tendency and trend"
[research/distilled-weekly-review-design.md, section 6].

**The conservative reading is deliberate.** Perla and Provost signal a shift at six points;
Anhoj and Olesen's simulation requires at least eight for a series of 12 to 22, holding the
false signal rate near 5 percent [research/distilled-weekly-review-design.md, section 6].
This skill waits for twelve weeks of history before ever using the word shift, which is
stricter than either. The cost of a false trend claim in a personal scorecard is that the
reader changes tactics in response to noise, and the tampering result says that costs more
than saying nothing.

**Caveat that must appear in the skill's own thinking and not in the report.** These rules
assume points drawn from a stable process. A person's work week is not one
[research/distilled-weekly-review-design.md, section 6]. The rules are used here as a
discipline against overclaiming, not as a statistical test, and the report never presents a
run chart rule as a significance test.

## 4. The fourth rule, and the only one usable at any length

The astronomical point: a value "obviously, even blatantly, different from the rest"
[research/distilled-weekly-review-design.md, section 6].

An astronomical point may be flagged at any series length of three or more, because it is a
statement about one value against the others rather than a claim about direction. Flag it in
one line, name the value and the spread it sits outside, and **do not attach a cause**.

```
Hours in meetings: 31.0. That is roughly double every other week measured (range 9.5 to 16.0).
Flagged as an outlier, not as a trend.
```

Attaching a cause to an outlier is where a scorecard turns into a story.

## 5. What the scorecard leads with

**Direction first, absolute figures second.** This is the design property the skill is graded
on and it inverts the obvious layout.

Correct opening:

```
Commitment closure has been falling for five straight weeks. That is the Trend rule firing.
7 of 11 closed this week (64%), against a 12-week median of 78%.
```

Wrong opening, and it is what a scorecard naturally produces if nobody stops it:

```
This week: 11 meetings, 14.5 hours, 7 commitments closed, 2 dropped, 9 open, 4 leads,
2 money findings, 3 content items.
```

The second version is the measurement-instead-of-decision failure that the scorecard
literature names as the reason these systems get abandoned
[research/distilled-weekly-review-design.md, section 7]. It is a set of counts nobody acts on.

**The ordering rule.** Sections are ordered by what the series says, not by a fixed template.
The section whose series is doing the most interesting thing goes first, where interesting
means, in order: a shift fired, a trend fired, an astronomical point, a value moved across a
threshold the user set, and only then everything else in template order.

**Where no series says anything interesting, say that in one line and move on.** A week where
every series is flat is a real and common outcome, and reporting it as flat is correct
scorekeeping, not a failure to find anything. See `honest-scorekeeping.md`.

## 6. Rate versus count

Report closure as a **rate with both terms visible**, never as a bare count.

```
Commitments closed: 7 of 11 (64%)
```

A bare count of 7 rises when the person takes on more commitments and falls when they take on
fewer, independent of how well they close anything. The trend on a bare count is therefore
mostly a trend on intake, which is a different question wearing the same label.

Fields that are rates: commitments closed, commitments dropped, leads with a next step.
Fields that are counts: meetings, hours, money findings, content shipped.

**Never build a composite score.** No weekly index, no health number, no points out of ten. A
composite hides which input moved, which is the only actionable thing in the report, and a
composite score of a person's week is a self-level cue, which the feedback evidence says is
where performance degrades [research/distilled-weekly-review-design.md, section 4]. Sibling
skills in this marketplace already refuse to score people for the same reason.

## 7. The anti-tampering rule

**A change in approach is recommended only when one of these is true:**

1. A Trend rule fired, five or more consecutive points in one direction.
2. A Shift rule fired, at twelve or more weeks of history.
3. An item has been carried in the top three for three consecutive weeks, per
   `top-three-selection.md`.
4. A single-week movement crossed a hard external threshold with real consequences, such as
   an invoice entering a new aging bucket or a cancellation window closing.

Case 4 is a deadline, not a trend, and it is labelled as a deadline in the report.

**Outside those four cases, a week that moved is reported as a week that moved and nothing is
recommended.** That is the whole countermeasure. The temptation "to react to an extreme
outcome and to see it as significant, even where its causes are common"
[research/distilled-weekly-review-design.md, section 6] is what the rule blocks.

## 8. Presenting the series in the report

Inline, in text, at most one line per series. No ASCII charts, no tables of twelve numbers.

```
Closure rate: 64% this week. Last 6 weeks: 81, 79, 74, 70, 68, 64. Trend rule fired, five
consecutive falls. [from Commitment tracker, weekly] (exact)
```

Six values is the display cap even when twelve were read, because the rules were evaluated
against twelve and the reader only needs enough of the tail to see the shape. State that
twelve were read.

**Where a series has a gap**, because a sibling was paused or a run was skipped, print the gap
rather than closing it up:

```
Closure rate: 64%. Last 6 weeks: 81, 79, na, na, 68, 64. Two weeks unmeasured, so no trend
rule was evaluated.
```

**A rule is never evaluated across a gap.** Consecutive means consecutive measured weeks with
no `na` between them. Closing up a gap to reach five consecutive points is manufacturing a
trend, and it is the most technically deniable way this skill could lie.
