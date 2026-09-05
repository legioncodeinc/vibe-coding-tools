# Work Sampling

- **Title:** Work Sampling. Know Industrial Engineering, undated evergreen technical reference page.
- **URL:** https://knowindustrialengineering.com/work-sampling/
- **Fetched:** 2026-08-17
- **Source type:** community (industrial engineering reference site, no publication date on page)

## Why this source matters for focus-forensics

Work sampling, also called activity sampling, is the hundred-year-old industrial
engineering method that is structurally identical to what Littlebird does: take
observations at intervals, and infer something about how time is distributed. It is the
correct methodological frame for the whole skill, and it comes with a precise statement of
what the method can and cannot yield. That statement is the technical justification for
every honesty constraint the skill imposes.

This is a reference site rather than a peer-reviewed source, and it is archived because
the recent-window search returned no peer-reviewed treatment of periodic-snapshot time
inference. That absence is recorded as a named gap in the archive README. The statistical
content below is standard textbook material and is checkable against any industrial
engineering text.

## Extracted claims

- What the method yields: work sampling "enables calculation of the amount of work content
  in terms of percentage of available working time." The output is a proportion.
- Statistical basis: the normal approximation to the binomial. The page states "68.27% of
  the data will be accommodated within the one standard error from the either side of the
  p", extending to 95.45% at two standard errors and 99.73% at three.
- Sample size: margin of error equals Z multiplied by the standard error of a proportion.
  The worked example on the page, at 95 percent confidence with Z of 1.96 and an observed
  proportion of 0.45, requires n of 96 observations for a 10 percent margin of error.
- **The randomness requirement, which is the critical one:** "Predetermined times for
  taking work sampling observations should be random and time interval between observation
  time should vary, with minimum time interval as we calculated."
- **The periodicity trap, stated explicitly:** "if there is an activity repeating every
  three minutes in the work, the sampling study will give wrong information" when
  observations are taken at fixed intervals.
- What it cannot do: "In case of time study the accuracy level is high as the operation is
  divided into fine activities/elements and a detailed picture is arrived at, whereas work
  sampling fails to give a detailed analysis." Sampling does not produce element-level
  times.

## Direct implication for the skill

This is the source of the skill's four hardest constraints.

1. **Proportions, not durations.** The output of a sampling design is the share of
   observations in a category. Converting that share into hours requires assuming the
   sampled period was fully worked and fully observed. Neither assumption holds for a
   personal machine, so the conversion is not performed.
2. **A margin of error exists and it is not small.** Roughly a hundred observations buys a
   ten percentage point margin at 95 percent confidence on a single proportion. A week of
   snapshots is a modest sample, and any proportion computed from it carries a band, not a
   point.
3. **Fixed-interval sampling is biased against periodic activity.** If the capture cadence
   and a recurring behavior share a period, the estimate is wrong in a direction that
   cannot be detected from inside the sample. This is why the skill never claims a
   fine-grained proportion for a short-cycle activity, and why comparing two weeks sampled
   the same way is more defensible than trusting either week's absolute figure.
4. **Comparison survives what absolutes do not.** A biased instrument used the same way
   twice still detects change. That is the statistical reason week-over-week change is
   this skill's primary output rather than a garnish on it.
