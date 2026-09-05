# The run chart: a simple analytical tool for learning from variation in healthcare processes

- **URL:** https://semcme.org/wp-content/uploads/The-Run-Chart-Perla-R-the-BMJ-2011-1.pdf
- **Fetched:** 2026-08-17
- **Source type:** academic (Perla, Provost, Murray; BMJ Quality and Safety, 2011)

## How few data points a run chart can use

> "There are many applications (eg, patient monitoring of annual PSA tests) where the run
> chart is useful with just three or four data points in order to get an early indication of
> central tendency and trend."

Note the hedge in the source's own wording: "early indication", not a trend.

## The four run chart rules

| Rule | Threshold, verbatim where quoted |
|---|---|
| **Shift** | "Six or more consecutive points either all above or all below the median." |
| **Trend** | "Five or more consecutive points all going up or all going down." |
| **Runs** | Too few or too many crossings of the median line, against tabulated critical values |
| **Astronomical point** | "An astronomical data point is one that is obviously, even blatantly, different from the rest of the points." |

## The overreaction warning, which is the reason this source is in the archive

> "When improvement data are presented in healthcare (eg, clinical reports, dashboards,
> project updates, and board reports), people will often over- or under-react to a single or
> most recent data point (and begin tampering, possibly making things worse)."

## Reading for skill design

This is the sourced version of "the trend is the product, not the snapshot", and it also
supplies the exact thresholds a weekly series can use, because a weekly series is a run
chart with a one-week interval.

Direct mapping:

| Weeks of history | What the skill may say |
|---|---|
| 1 | The number, with no direction claim at all |
| 2 | A one-week change. Not a trend. |
| 3 to 4 | An "early indication" of central tendency, in the source's own hedged language |
| 5 consecutive rising or falling | The Trend rule fires. It may be called a trend. |
| 6 consecutive on one side of the median | The Shift rule fires. It may be called a shift. |

The astronomical point rule gives the scorecard a legitimate way to flag one blatantly odd
week without claiming a direction.

The overreaction quote names the failure mode of a weekly scorecard exactly: reading meaning
into the most recent point and changing tactics in response to noise.

## Caveat

This is a healthcare process-improvement source. Weekly counts of meetings and commitments
are not a controlled industrial process, and the run chart rules assume the points are
independent draws from a stable process, which a person's work week is not. The rules are
used here as a discipline against overclaiming, not as a statistical test. Stated as a
transfer wherever used.
