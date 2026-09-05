# Run Charts Revisited: A Simulation Study of Run Chart Rules for Detection of Non-Random Variation in Health Care Processes

- **URL:** https://pmc.ncbi.nlm.nih.gov/articles/PMC4244133/
- **Fetched:** 2026-08-17
- **Retrieval note:** direct fetch returned a reCAPTCHA challenge. Content below was
  retrieved through the Firecrawl research index extract of the same URL on the same date.
  Quotes are from that extract. Flagged because it is a weaker retrieval path than a direct
  fetch.
- **Source type:** academic (Anhoj and Olesen, PLOS ONE, 2014)

## Method

Simulated run charts of 2 to 100 data points under linear drifts and non-linear shifts in
the sample distribution mean. 1000 simulations per chart length, normal distribution,
standard deviation 1, distribution means of 0.0, 0.5, 1.0, 1.5 and 2.0.

## Definitions used

- **Shift.** "an unusually long run of consecutive data points either above or below the
  median". Perla defines it as six or more. "Carey and others recommend seven or eight data
  points depending on the purpose of the run chart and the total number of data points
  available."
- **Trend.** "an unusually long run of data points all going up or down."

## The findings that constrain a weekly series

- "with a run chart of 20 data points, the expected longest run would be 4, and a run of
  more than 7 data points would indicate a shift in process level."
- "with less than 27 data points in total, the chance of having a trend of 6 or more data
  points going up or down is less than 5%."
- "Perla and Provost suggest using only 6 data points to signal a shift. Carey suggests 7
  data points for a run chart with up to 19 data points. The shift rule we suggest takes at
  least 8 data points to signal a shift if one has between 12 and 22 data points in total."
- The suggested rules keep "the false signal rate constant around 5% and independent of the
  number of data points in the chart."
- A companion source in the same family notes that for series with fewer than 20 values, the
  simple shift and trend rules signal falsely no more than about 10 percent of the time
  [https://www.iecodesign.com/blog/2015/2/2/run-charts-in-quality-improvement-work].

## Reading for skill design

The disagreement between Perla (six points signals a shift) and Anhoj and Olesen (eight
points, given a 12 to 22 point series) is a live conflict and it is the reason the skill sets
its history depth where it does.

**Position taken:** read 12 prior reports. Twelve puts the series inside the 12 to 22 band
where Anhoj and Olesen's stricter rule is defined, gives the median enough points to be
stable, and is one quarter of a year, which is a window a person can remember. Below 12,
report direction only and never call a shift.

The simple rules are used for the language they license, not as a hypothesis test, because
a person's week is not a stable process. The conservative reading is preferred: where Perla
would allow "shift" at six, this skill waits.
