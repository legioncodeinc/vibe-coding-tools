# Distilled: attention, task switching, and what activity sampling can measure

Every claim below ends in a bracketed pointer to the raw file it came from. If a domain
claim appears anywhere in this skill and cannot be traced through this file to a raw
source, it is a defect and should be deleted rather than defended.

Written from a fresh read of `raw/` on 2026-08-17.

---

## 1. The "23 minutes 15 seconds" figure has no paper behind it

This is the single most repeated number in productivity writing and it is the first thing
this skill is forbidden to say.

| Claim | Evidence |
|---|---|
| The figure appears in interviews with Gloria Mark and in media citations of those interviews, and not in a peer-reviewed publication | Independent citation audit that opened the commonly cited papers and searched them [raw/myth--23-minutes-citation-audit--oberien-2023.md] |
| The paper most often cited for it, Mark, Gudith and Klocke CHI 2008, does not contain the number 23 anywhere | Verified first-hand in this sweep by fetching the full text and searching it [raw/interruption--cost-experiment--mark-chi2008.md] |
| Of 23 blog posts surveyed, 9 cited academic papers incorrectly and only 2 cited actual paper results correctly | [raw/myth--23-minutes-citation-audit--oberien-2023.md] |
| The figure was still circulating as news years later, framed as "gospel in productivity circles" | [raw/myth--23-minutes-recirculation--biggo-2026.md] |

**Conflict, stated not smoothed.** The secondary coverage attributes the figure to a 2006
Gallup interview and reports one surveyed post containing fabricated quotes
[raw/myth--23-minutes-recirculation--biggo-2026.md]. The primary audit as retrieved does
not state that year in its text and gives a different breakdown of the survey
[raw/myth--23-minutes-citation-audit--oberien-2023.md]. Both agree there is no
peer-reviewed source. The skill uses only the agreed part and treats the specific
provenance as unconfirmed.

**What the field measurements actually say about resumption**, which is the honest
replacement for the folklore number:

| Measure | Value | Source |
|---|---|---|
| Return to an interrupted working sphere, same day | 25 min 26 sec, SD 54 min 48 sec | [raw/fragmentation--observational-baseline--mark-chi2005.md] |
| Return to a suspended application after an email alert | 9 min 33 sec, SD 13 min 15 sec | [raw/interruption--resumption-field-study--iqbal-horvitz-chi2007.md] |
| Return to a suspended application after an IM alert | 8 min, SD 11 min 32 sec | [raw/interruption--resumption-field-study--iqbal-horvitz-chi2007.md] |
| Resumption phase after email, immediate response | 16 min 33 sec, SD 27 min 20 sec | [raw/interruption--resumption-field-study--iqbal-horvitz-chi2007.md] |

Every standard deviation in that table exceeds or approaches its own mean. The band is
wide, the definition of the measured quantity moves the number more than the population
does, and there is no single figure to quote.

---

## 2. The measured cost of interruption is not lost time

The best controlled experiment in the archive found interrupted participants finishing
FASTER, not slower.

| Condition | Time to complete, minutes |
|---|---|
| No interruption | 22.77 (SD 7.60) |
| Same-context interruption | 20.31 (SD 5.94) |
| Different-context interruption | 20.60 (SD 4.93) |

[raw/interruption--cost-experiment--mark-chi2008.md]

The cost appeared in stress (6.92 baseline rising to 9.46), frustration (4.73 to 6.63),
time pressure (11.02 to 12.69) and effort (9.50 to 11.04), all on a 1 to 20 scale
[raw/interruption--cost-experiment--mark-chi2008.md]. The authors' reading: "people
completed interrupted tasks in less time with no difference in quality", at the price of
"a higher workload, more stress, higher frustration, more time pressure, and effort"
[raw/interruption--cost-experiment--mark-chi2008.md].

**Direct consequence.** A report claiming "you lost N hours to context switching" is not a
cautious summary of this literature. It asserts the one thing the most-cited experiment
measured going the other way.

---

## 3. Switch cost is real, and it is measured in milliseconds

| Claim | Value |
|---|---|
| Responses on a switch trial are slower than on a repetition trial, "often by a substantial amount (e.g. 200 ms relative to a baseline of 500 ms)", with higher error rates | [raw/switching--laboratory-switch-cost--monsell-tics2003.md] |
| Preparation does not remove the cost; a residual cost persists after roughly 600 ms of preparation | [raw/switching--laboratory-switch-cost--monsell-tics2003.md] |
| Residual costs persist "even when 5 s or more is allowed for preparation" | [raw/switching--laboratory-switch-cost--monsell-tics2003.md] |

The review's applied recommendation concerns interface design for operators monitoring
multiple sources under time pressure. It does not extend the laboratory numbers to office
multitasking, and contains no per-switch cost in units of workday minutes
[raw/switching--laboratory-switch-cost--monsell-tics2003.md].

**Direct consequence.** Counting switches is justified because the mechanism is real.
Multiplying a switch count by a minutes-per-switch penalty is not, because no such
published penalty exists to multiply by.

---

## 4. Published baselines for run length, and why they cannot be compared

| Study | Continuous run before a switch | Method |
|---|---|---|
| Mark, Gonzalez, Harris 2005 | 11 min 4 sec, SD 18 min 9 sec, in a working sphere | External ethnographer with a stopwatch, 24 people, 700+ hours [raw/fragmentation--observational-baseline--mark-chi2005.md] |
| Talypova and colleagues 2025 | approximately 6 min in a main working sphere, M 364.46 sec, SD 229.33, Mdn 300.72 | Participant-worn video glasses, self-annotated, 15 people, one hour each [raw/fragmentation--recent-replication--talypova-chiwork2025.md] |

The obvious reading is that focus halved in twenty years. The 2025 authors explicitly
decline it: "Any cross-study comparisons should be interpreted with care, as differences in
methods, measures, and study contexts may limit direct comparability"
[raw/fragmentation--recent-replication--talypova-chiwork2025.md]. The two studies differ in
observer, instrument, unit of analysis, population, sample size and country.

Other structural numbers worth having:

| Finding | Value | Source |
|---|---|---|
| Share of working sphere segments interrupted | 57.1 percent | [raw/fragmentation--observational-baseline--mark-chi2005.md] |
| Distinct working spheres per person | 11.7, SD 2.4 | [raw/fragmentation--observational-baseline--mark-chi2005.md] |
| Interrupted work resumed same day | 77.2 percent | [raw/fragmentation--observational-baseline--mark-chi2005.md] |
| Switches per one-hour session | mean 36, SD 17; median 29, IQR 22.5 | [raw/fragmentation--recent-replication--talypova-chiwork2025.md] |
| Share of off-task time that was self-initiated | approximately 60 percent | [raw/fragmentation--recent-replication--talypova-chiwork2025.md] |
| Alerts per hour, email plus IM | 3.74 per hour overall | [raw/interruption--resumption-field-study--iqbal-horvitz-chi2007.md] |
| Switch rate per minute, before an interruption vs during resumption | 0.84 rising to 2.34 (email) and 2.56 (IM) | [raw/interruption--resumption-field-study--iqbal-horvitz-chi2007.md] |

**Direct consequence, and it is the design principle of the whole skill.** Two honest
measurements of the same construct by different methods differ by a factor of two and
cannot be compared. Two measurements by the SAME imperfect method can be, because whatever
the method distorts, it distorts both times
[raw/fragmentation--recent-replication--talypova-chiwork2025.md]. Never compare a user's
number to a published figure. Always compare it to their own prior window measured
identically.

The switch-rate escalation from 0.84 to over 2.3 per minute during resumption is also
what licenses flagging a burst of rapid switching as a structural signature in its own
right, with no duration claim attached
[raw/interruption--resumption-field-study--iqbal-horvitz-chi2007.md].

---

## 5. What periodic sampling can and cannot yield

This is the methodological core. Work sampling, also called activity sampling, is the
industrial engineering method structurally identical to periodic screen capture.

| Property | Statement | Source |
|---|---|---|
| Output | The method yields "the amount of work content in terms of percentage of available working time". A proportion, not a duration | [raw/measurement--activity-sampling-basis--knowie-work-sampling.md] |
| Statistical basis | Normal approximation to the binomial proportion | [raw/measurement--activity-sampling-basis--knowie-work-sampling.md] |
| Precision cost | At 95 percent confidence with an observed proportion of 0.45, roughly 96 observations buys a 10 percentage point margin of error | [raw/measurement--activity-sampling-basis--knowie-work-sampling.md] |
| Randomness requirement | Observation times "should be random and time interval between observation time should vary" | [raw/measurement--activity-sampling-basis--knowie-work-sampling.md] |
| Periodicity trap | With fixed intervals, "if there is an activity repeating every three minutes in the work, the sampling study will give wrong information" | [raw/measurement--activity-sampling-basis--knowie-work-sampling.md] |
| Granularity limit | Sampling "fails to give a detailed analysis" of the kind a time study produces; it does not yield element-level times | [raw/measurement--activity-sampling-basis--knowie-work-sampling.md] |

**Direct consequences, four of them, and they generate the forbidden-claims list.**

1. Proportions are the native output. Converting a proportion to hours requires assuming
   the whole period was worked and observed. Neither assumption holds on a personal
   machine.
2. A week of snapshots is a modest sample and every proportion from it carries a band, not
   a point.
3. Fixed-cadence capture is biased against activity that shares a period with the cadence,
   in a direction undetectable from inside the sample.
4. Comparison survives what absolutes do not. A biased instrument used identically twice
   still detects change.

**Named gap.** The recent-window sweep found no peer-reviewed validation study of
screenshot-interval time tracking specifically. Search results for that query returned
vendor marketing exclusively. The statistical frame above is standard and checkable, but
there is no published accuracy figure for the specific instrument this skill runs on.

---

## 6. Even continuous logging cannot see engagement

| Claim | Source |
|---|---|
| With full Windows OS activity capture, "it could not be known how engaged a user was with a window in active use" without experience sampling probes | [raw/attention--hour-of-day-rhythm--mark-chi2014.md] |
| The same study could not capture what was being read: "Capturing what email was being read or any other application interaction was not collected due to privacy and technical limitations" | [raw/attention--hour-of-day-rhythm--mark-chi2014.md] |
| Researchers with a continuous event log describe task boundaries as hard to locate: "it is difficult to identify exactly when the resumption phase may begin", and used heuristics | [raw/interruption--resumption-field-study--iqbal-horvitz-chi2007.md] |
| Duration in the best-instrumented email study was defined on the FOREGROUND window and terminated by five minutes of keyboard and mouse inactivity | [raw/intervention--email-batching-null--mark-chi2016.md] |

**Direct consequence.** Every duration figure in this literature rests on foreground-window
state plus input activity. An instrument with neither cannot produce that quantity. If a
continuous log cannot establish engagement, periodic images certainly cannot, and no output
of this skill may be phrased as "you were focused" or "you were distracted".

---

## 7. Hour of day is a real axis; the user's own rhythm is the only valid reference

| Claim | Source |
|---|---|
| "People are most focused in their work mid-afternoon, with a peak at 2-3 p.m." in a 32 person, 1,509 hour study | [raw/attention--hour-of-day-rhythm--mark-chi2014.md] |
| Boredom reports roughly doubled on Monday (27.8 percent) versus Friday (13.3 percent) | [raw/attention--hour-of-day-rhythm--mark-chi2014.md] |
| Internet surfing and window switching correlated with boredom | [raw/attention--hour-of-day-rhythm--mark-chi2014.md] |
| A separate 2025 study found no time-of-day pattern in switching, only personality correlations, within one-hour scheduled sessions | [raw/fragmentation--recent-replication--talypova-chiwork2025.md] |

**Conflict, stated not smoothed.** One study finds a strong daily rhythm, another finds
none. The designs differ: the first sampled experience across five full workdays per
person, the second observed a single scheduled one-hour session per person and tested only
early versus late session time. The first design can see a daily rhythm and the second
cannot. This archive reads the two as compatible rather than contradictory, and notes that
the reading is an inference.

**Direct consequence.** Hour of day is worth reporting because it is a comparison of like
with like within one person. The published peak hour is never presented as a target.

---

## 8. Self-report is not a second measurement

| Claim | Source |
|---|---|
| Across 106 effect sizes, "self-reported media use correlates only moderately with logged measurements" and "self-reports were rarely an accurate reflection of logged media use" | [raw/measurement--self-report-vs-logged--parry-nathumbehav-2021.md] |
| Measures of problematic media use "show an even weaker association with usage logs" | [raw/measurement--self-report-vs-logged--parry-nathumbehav-2021.md] |
| A randomized notification-disabling experiment measured interruption frequency by self-report and flagged that as a limitation: it "should be interpreted with cautions due to recall bias" | [raw/intervention--notification-disabling-experiment--ohly-joh-2023.md] |

The published abstract does not state the pooled correlation, the standardized mean
difference, or the proportion of studies meeting an accuracy threshold; the full text was
not retrievable in this sweep, so those values are not available and are not asserted
[raw/measurement--self-report-vs-logged--parry-nathumbehav-2021.md].

**Direct consequence.** Do not ask the user how fragmented their week felt and report the
answer as a measurement, and never average a felt impression with snapshot evidence. When
the report and the user's memory diverge, the literature establishes that memory and logs
routinely differ. It does not license telling the user their memory is wrong.

---

## 9. What actually reduces fragmentation, and what does not

### Supported: removing an interrupt source

| Measure | Baseline | Email removed | Source |
|---|---|---|---|
| Window switches per hour | 37.1 (SD 31.4) | 18.2 (SD 23.5) | [raw/intervention--email-cutoff--mark-chi2012.md] |
| Seconds per window | 75.5 (SD 394.3) | 131.9 (SD 568.1) | [raw/intervention--email-cutoff--mark-chi2012.md] |
| Heart rate variability | 77.03 | 80.39, stress lower | [raw/intervention--email-cutoff--mark-chi2012.md] |

Thirteen participants, within-subjects, five experimental days
[raw/intervention--email-cutoff--mark-chi2012.md]. The window-duration standard deviations
run four to five times their means, so the direction is credible and the point estimates
are not portable.

### Supported, with heavy caveats: disabling notifications

Randomized between-subjects field experiment, 247 cases. Interruption frequency fell in
the experimental group (F = 37.92, P under .001), with significant mediated effects on
performance and on irritation
[raw/intervention--notification-disabling-experiment--ohly-joh-2023.md].

The authors' own limitations: the ban was partial, all variables were self-reported, the
treatment lasted a single working day, and the sample skewed young and highly educated
[raw/intervention--notification-disabling-experiment--ohly-joh-2023.md]. The effect was
also moderated: high fear of missing out and low telepressure both nullified it
[raw/intervention--notification-disabling-experiment--ohly-joh-2023.md].

### NOT supported: batching email

"Despite widespread claims, we found no evidence that batching email leads to lower
stress", from a 12-workday logged study of 40 participants
[raw/intervention--email-batching-null--mark-chi2016.md]. The same study did find that
longer email time within an hour predicted higher stress that hour, and more email time in
a day predicted lower assessed productivity that day
[raw/intervention--email-batching-null--mark-chi2016.md].

It also found that people who checked email volitionally reported higher end-of-day
productivity at high email volume than people driven by notifications
[raw/intervention--email-batching-null--mark-chi2016.md].

### The pattern across all three

The change that worked removed something from the environment
[raw/intervention--email-cutoff--mark-chi2012.md,
raw/intervention--notification-disabling-experiment--ohly-joh-2023.md]. The change that
failed asked the person to reorganize their own behavior around the same environment
[raw/intervention--email-batching-null--mark-chi2016.md]. And roughly 60 percent of
off-task time in the most recent observational study was self-initiated rather than
externally triggered [raw/fragmentation--recent-replication--talypova-chiwork2025.md],
which means fragmentation is largely not something being done to the user and a report
should not be written as though it were.

**Direct consequence.** Offer one environmental change, framed as an experiment with a
stated way to check it next week. Never present batching as a proven remedy. Never present
any nudge as settled, because the moderation findings show the same intervention helping
some people and not others in ways not predictable from behavior alone
[raw/intervention--notification-disabling-experiment--ohly-joh-2023.md].

---

## 10. Why this must never be pointed at another person

| Claim | Source |
|---|---|
| Electronic monitoring's overall impact on performance "appears neutral" | [raw/ethics--electronic-monitoring-effects--koenig-annrev-2025.md] |
| It carries "a small positive correlation...with strain" and "a small negative correlation...with job attitudes" | [raw/ethics--electronic-monitoring-effects--koenig-annrev-2025.md] |
| The neutral average may reflect suppression: "modest effect sizes may stem from paradoxical effects that counterbalance each other" | [raw/ethics--electronic-monitoring-effects--koenig-annrev-2025.md] |
| Effects are contingent on moderators including how monitoring "is implemented and communicated" | [raw/ethics--electronic-monitoring-effects--koenig-annrev-2025.md] |

**Direct consequence.** The computation is identical whether the user runs it on themselves
or a manager runs it on a report. The difference is entirely in who chose to run it and who
receives the output, which is precisely the moderator the review names as controllable
[raw/ethics--electronic-monitoring-effects--koenig-annrev-2025.md]. A neutral average
performance effect is not a defense, because suppression means an aggregate null can hide a
real strain cost. This skill is scoped to the user's own capture, for the user, and the
scoping is an evidence-based constraint rather than a disclaimer.

---

## 11. Named gaps in this archive

1. **No peer-reviewed validation of screenshot-interval time inference.** The search for it
   returned vendor marketing only. The statistical frame in section 5 is standard and
   checkable, but there is no published accuracy number for this specific instrument.
2. **The Parry pooled effect sizes are not in hand.** Only the abstract was retrievable.
   The three abstract-level claims are used; no coefficient is asserted
   [raw/measurement--self-report-vs-logged--parry-nathumbehav-2021.md].
3. **No source in the archive measures rabbit-hole behavior as such.** The nearest thing is
   the finding that internet surfing correlated with boredom
   [raw/attention--hour-of-day-rhythm--mark-chi2014.md] and that off-task episodes averaged
   54 seconds with a standard deviation of 100 seconds
   [raw/fragmentation--recent-replication--talypova-chiwork2025.md]. The skill's
   rabbit-hole detection is therefore a heuristic over observed repetition and stated
   intention, presented as evidence for the user to judge, not as a validated construct.
4. **No source measures meeting load against unbroken working time directly.** The 2025
   study reported no meeting effects at all
   [raw/fragmentation--recent-replication--talypova-chiwork2025.md]. The skill's use of
   calendar data is arithmetic on real calendar entries, which is defensible on its own
   terms, but it is not backed by a published effect in this archive.
5. **Every switch-rate and run-length figure here comes from Windows desktop knowledge work
   in corporate research settings, mostly from one research group.** Nothing in the archive
   establishes that these shapes hold for a solo operator on a personal machine, which is
   this marketplace's user.
