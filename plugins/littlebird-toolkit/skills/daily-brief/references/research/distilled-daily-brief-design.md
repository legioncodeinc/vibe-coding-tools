# Distilled: daily brief and digest design

Written from a fresh read of the fourteen files in `raw/`. Every claim ends in a bracketed
citation to the raw file it came from. Where the archive conflicts, both readings are
stated and the preferred one is named with a reason. Where the archive is thin, section 9
names the gap instead of filling it.

The question this archive was swept to answer: **daily digests are the most-abandoned
category of recurring automation, so what does the evidence say about making one that is
still opened in week six?**

---

## 1. Why recurring digests get abandoned

Three separate mechanisms show up in the archive, and they are not the same problem.

| Mechanism | What it looks like | Evidence |
|---|---|---|
| Volume | Too much arriving, regardless of quality | Top stated unsubscribe reason at 20% [raw/brief--digest-fatigue--cleanemail-stats-2026.md] |
| Irrelevance | Content that is not about the reader's situation | 17% of unsubscribes, and 18% "lost interest" [raw/brief--digest-fatigue--cleanemail-stats-2026.md] |
| Tenure decay | Engagement peaks in the first weeks and falls from there | "Subscribers are most engaged in the early weeks after they join. Over time, that changes." [raw/brief--digest-fatigue--beehiiv-open-rate-decline-2026.md] |

Two of the three top unsubscribe reasons, lost interest and irrelevant content, together
account for 35% and are the same failure at different distances: the digest stopped saying
anything about the reader's actual situation
[raw/brief--digest-fatigue--cleanemail-stats-2026.md].

**The cadence-specific finding.** Daily is the hardest cadence to sustain. "Daily sending
is where this shows up most clearly", and a daily cadence "raises the bar significantly"
for content quality [raw/brief--digest-fatigue--beehiiv-open-rate-decline-2026.md]. This is
the single most directly applicable sentence in the archive for a daily routine.

**The measurement trap.** Open rate is a degraded signal. Apple Mail Privacy Protection
changes since mid-2024 depressed measured opens, "partially unwinding" inflation introduced
in 2021 [raw/brief--digest-fatigue--beehiiv-open-rate-decline-2026.md]. A digest cannot be
tuned from open rate alone.

**Evidence quality warning.** The Clean Email figures are an aggregator's numbers with no
sample sizes and an original source named for only two of them
[raw/brief--digest-fatigue--cleanemail-stats-2026.md]. The *ranking* of reasons is
corroborated in spirit by the beehiiv guide. The percentages are not citable. See section 9.

## 2. The counterintuitive finding: silence is not the fix

The strongest single study in the archive is a randomized controlled field experiment,
N = 237, three weeks, four arms
[raw/brief--notification-batching--fitz-computers-in-human-behavior-2019.md].

- Batching to three times a day beat everything: inattention d = -0.65, stress d = -0.56,
  perceived productivity d = 0.57, phone unlocks d = -0.60.
- Hourly batching "did not differ from the control" on almost every measure.
- **Turning notifications off entirely made things worse**, not better: anxiety d = 0.56,
  fear of missing out d = 0.59, with no improvement in attention or concentration.
  Participants "felt no longer able to be as responsive as expected".

Two design consequences follow, and the second one is the important one.

1. Batching works, and the benefit comes from reducing interruption frequency rather than
   from reducing information.
2. **A quiet day must still produce a brief.** The no-notification arm shows that removing
   the signal entirely creates anxiety rather than calm
   [raw/brief--notification-batching--fitz-computers-in-human-behavior-2019.md]. A digest
   that silently skips its quiet days trains exactly the FoMO the digest exists to remove.
   The correct quiet-day behavior is a short brief that says nothing needs you, not a
   skipped run.

**Extrapolation flag.** The winning arm was three times daily, which is more frequent than
a daily brief. Nothing in this study measures a once-daily interval, digest content
quality, or long-run abandonment
[raw/brief--notification-batching--fitz-computers-in-human-behavior-2019.md]. Any argument
from this study to a once-daily cadence is an extrapolation.

## 3. Length: the only hard number in the archive

Nielsen Norman Group's reanalysis gives a usable model of a scanning reader
[raw/brief--brief-length--nngroup-how-little-users-read.md]:

- Ceiling on reading: "at most 28% of the words during an average visit; 20% is more
  likely".
- Time model: "a fixed time of about 25 seconds, plus an additional 4.4 seconds per 100
  words".
- Marginal words are read at roughly 18%: when content is added, "customers will read 18%"
  of the addition.
- **The threshold:** "users read half the information only on those pages with 111 words or
  less".

The 111-word threshold is the operational number. It splits any brief into two budgets:

| Budget | Size | Read at roughly |
|---|---|---|
| The part that is actually read | first 111 words | 50% |
| Everything after it | remainder | 18% of marginal words |

**Consequence, stated sharply.** Words past the first block are not free and not neutral.
They are read at 18% and they dilute the share of attention the first block gets
[raw/brief--brief-length--nngroup-how-little-users-read.md]. Anything that must be read
goes in the first 111 words. Everything else is optional by construction, so it should be
written as if it were optional.

**Scope caveat.** This is web page reading behavior from an eyetracking and logging
dataset, not email or in-app report reading
[raw/brief--brief-length--nngroup-how-little-users-read.md]. Treat 111 as a well-grounded
order of magnitude, not a constant.

## 4. Executive briefing format norms

Two independent traditions converge on the same structure.

**The President's Daily Brief.** One page. Seven days a week, 365 days a year. Bottom Line
Up Front, where "the what, the why, and what's next/outlook ... is contained within the
first sentence of your document, not buried later in your piece". The writer's job is to
"identify the most important information for your client", and on padding: "your client is
paying for your analysis, they do not need to see all of your homework and examples"
[raw/brief--brief-format--cipherbrief-presidents-daily-brief.md].

**Army Regulation 25-50.** Main point first, active voice, "concise, organized, and to the
point". The first paragraph answers who, what, when, where and why. The mechanic worth
stealing is the all-caps subject keyword: INFO, REQUEST, or ACTION, which tells the reader
what is demanded of them before they read the item
[raw/brief--brief-format--bluf-army-regulation-25-50.md].

Neither tradition supplies a word count
[raw/brief--brief-format--cipherbrief-presidents-daily-brief.md]
[raw/brief--brief-format--bluf-army-regulation-25-50.md]. The transferable content is
discipline plus a labelling scheme, not a number. The number has to come from section 3.

**Rejected claim.** The BLUF entry cites "47% greater return to shareholders over five
years" for organizations with effective communication. It is not about BLUF, carries no
methodology, and is recorded only so it is not repeated
[raw/brief--brief-format--bluf-army-regulation-25-50.md].

## 5. The single-highest-priority framing, for and against

**For, as stated by its proponents.** Identify the Most Important Task and do it before
other work. The frog is the "important but not urgent" task that "makes you feel a sense of
dread or reluctance". Size bound: "Your frog should take 1-4 hours or half a day of work
(at most)." Mechanisms invoked are planning fallacy, procrastination, and morning momentum
[raw/brief--single-priority--todoist-eat-the-frog.md].

**None of those three mechanisms is cited to a study on that page**
[raw/brief--single-priority--todoist-eat-the-frog.md]. The 1 to 4 hour size bound is the
only durable, specific item.

**Against.** The method bundles two separate claims: pick one priority, and do it first
thing in the morning. Only the first is about priority. The critique reports personal
failure from the second, and lists conditions that must hold: the task is scheduled in the
person's own peak hours, creative and analytical work are matched to the right windows, and
the frog is genuinely high leverage
[raw/brief--single-priority--highley-eat-the-frog-critique.md]. That source's numbers, a
25% night-owl share and a 30% performance drop, are asserted without citation and are not
usable [raw/brief--single-priority--highley-eat-the-frog-critique.md].

**The conflict, and the preferred reading.** The archive supports naming one priority. It
does not support prescribing a clock time for it. The chronotype evidence in section 6
independently breaks the fixed-morning half of the claim, so the correct synthesis is: keep
the single-priority framing, drop the "first thing in the morning" rule, and replace it with
a window chosen from the reader's actual calendar.

**What does have real support: the if-then form.** Meta-analysis of 94 studies: goal
attainment d = .65, initiating action d = .61, preventing derailment d = .77, for plans of
the form "If situation Y is encountered, then I will initiate behavior Z"
[raw/brief--planning--gollwitzer-sheeran-meta-analysis-2006.md]. So a named priority should
be written with its situational cue attached, not as a bare noun.

**And the boundary condition, which is the part usually dropped.** "When there are few
barriers to goal achievement ... implementation intention formation might be superfluous",
and "strong effects ... were obtained predominantly when the underlying goal intention was
strong and activated" [raw/brief--planning--gollwitzer-sheeran-meta-analysis-2006.md]. The
if-then form only earns its words on an item the reader would otherwise avoid or forget,
and only where the reader already wants the outcome. Wrapping routine items in if-then
spends words for nothing by the source's own logic.

**A second, independent reason to state a plan rather than a task.** Across six studies,
unfulfilled goals caused intrusive thoughts, elevated goal-word accessibility, and worse
performance on unrelated tasks, and "Allowing participants to formulate specific plans for
their unfulfilled goals eliminated the various activation and interference effects"
[raw/brief--planning--masicampo-baumeister-jpsp-2011.md]. The goal stayed unfulfilled. Only
the plan changed. Conclusion as published: "Committing to a specific plan for a goal may
therefore not only facilitate attainment of the goal but may also free cognitive resources
for other pursuits" [raw/brief--planning--masicampo-baumeister-jpsp-2011.md].

That result is 2011, lab-based, student samples, Ns between 68 and 124, with p values close
to threshold [raw/brief--planning--masicampo-baumeister-jpsp-2011.md]. It justifies the
*shape* of the recommendation. It does not promise an effect size.

## 6. Decision quality by time of day

This is the target where the archive is most internally contested, and the contest is the
finding.

**The contested flagship.** Danziger et al. (2011) reported favorable parole rulings
falling from roughly 65% to near 0% across a session. Two independent criticisms:
case ordering is non-random, because unrepresented prisoners appear later and fare worse;
and favorable rulings take longer (7.37 versus 5.21 minutes), so a judge who rationally
avoids starting a long case before a break produces an end-of-session skew with no
depletion at all. Simulations reproduce drops of 15% to 45% from time management alone.
Author's conclusion: "the effect of serial order and mental depletion is overestimated in
the original work", and "large parts, but admittedly not all aspects" of the finding are
artifact [raw/brief--time-of-day--glockner-hungry-judge-revisited-2016.md].

**The result that survives, at a much smaller size.** 21,867 acute respiratory infection
visits, 204 clinicians, 23 practices. Antibiotic prescribing rose across the clinic
session: adjusted odds ratio 1.01 in the second hour, 1.14 in the third, 1.26 in the
fourth, P less than .001 for trend, and significant in the fourth hour for diagnoses where
antibiotics are never indicated. The authors call it "consistent with the hypothesis that
decision fatigue progressively impairs clinicians' ability to resist ordering inappropriate
treatments" [raw/brief--time-of-day--linder-antibiotic-prescribing-jama-2014.md].

**Preferred reading.** Within-session degradation of decision quality is real and modest.
An odds ratio of 1.26 supports a weak preference for putting a hard decision early in a
working session. It does not support any claim that afternoon decisions are unreliable, and
the flagship result that would have supported such a claim is largely artifact
[raw/brief--time-of-day--glockner-hungry-judge-revisited-2016.md]
[raw/brief--time-of-day--linder-antibiotic-prescribing-jama-2014.md]. Note also that
session position is not clock time, since sessions start at different hours
[raw/brief--time-of-day--linder-antibiotic-prescribing-jama-2014.md].

**There is no universal peak hour.** In a within-subjects study of 56 participants tested at
14:00, 20:00 and 08:00, the finding is the interaction, not a main effect. Vigilance:
F(2,106) = 5.7, p = 0.004, with diurnal change of 3.5% for early chronotypes versus 9.1%
for late ones. Executive function: F(2,108) = 5.5, p = 0.005, with early chronotypes
significantly better in the morning than afternoon (p = 0.002) or evening (p = 0.03). At
08:00, early chronotypes outperformed late ones by 8.4% on vigilance and 5.9% on executive
function. Conclusion: "LCTs were significantly impaired in all measures in the morning
compared to ECTs" [raw/brief--time-of-day--facchin-chronotype-sports-medicine-open-2018.md].

Caveats: young sample, mean age 21.8, mostly students, and the effects are single-digit
percentages rather than transformative
[raw/brief--time-of-day--facchin-chronotype-sports-medicine-open-2018.md].

**The design rule this yields.** Any product that hardcodes an early clock hour as the
high-performance window is right for one group and wrong for the other
[raw/brief--time-of-day--facchin-chronotype-sports-medicine-open-2018.md]. Delivery time
must be set from the reader's own schedule, not from a productivity convention.

## 7. Morning routines: what is supported and what is not

A secondary review that is unusually explicit about the split
[raw/brief--morning-routines--simplypsychology-2026.md]:

| Supported | Not supported |
|---|---|
| Consistent sleep timing | Waking early: "No strong research establishes that waking early is independently beneficial for mental health across all chronotypes." |
| Exercise, with consistency mattering more than timing | Longer or more elaborate routines: "A 15-minute consistent routine may provide as much structure benefit as a 90-minute elaborate sequence." |
| Morning daylight, "one of the better-supported morning habits" | Morning journaling as practised in routine culture, since the studied version is "directed, emotionally engaged writing, not the gratitude lists and intention-setting that morning routine culture tends to emphasize" |

The load-bearing transfer: **consistency beats elaboration**
[raw/brief--morning-routines--simplypsychology-2026.md]. A short brief delivered at the same
time every day is the supported shape. A longer, richer brief is the shape with no support
behind it.

No individual studies are cited with numbers in that piece, so every claim from it is
reported as a secondary summary [raw/brief--morning-routines--simplypsychology-2026.md].

## 8. The synthesis, as design rules

Each rule states the evidence it rests on and how far that evidence actually reaches.

| Rule | Rests on | Strength |
|---|---|---|
| The must-read content fits in roughly 111 words; total stays near 200 | 50%-read threshold and 18% marginal read rate [raw/brief--brief-length--nngroup-how-little-users-read.md] | Strong for a scanning reader, extrapolated from web to report |
| Bottom line in the first sentence | PDB and AR 25-50 converge [raw/brief--brief-format--cipherbrief-presidents-daily-brief.md] [raw/brief--brief-format--bluf-army-regulation-25-50.md] | Strong as practice, no measured effect |
| Label each item with what it demands of the reader | INFO / REQUEST / ACTION keywords [raw/brief--brief-format--bluf-army-regulation-25-50.md] | Practice norm |
| A quiet day still ships a brief, a short one | Removing notifications raised anxiety and FoMO [raw/brief--notification-batching--fitz-computers-in-human-behavior-2019.md] | Strong, though from a different medium |
| Name exactly one priority | Proponent literature only [raw/brief--single-priority--todoist-eat-the-frog.md] | Weak as evidence, defensible as a forcing function for ranking |
| Write the priority as a plan with a cue and a window, not a bare task | d = .65 across 94 studies [raw/brief--planning--gollwitzer-sheeran-meta-analysis-2006.md], plus six studies on plan making [raw/brief--planning--masicampo-baumeister-jpsp-2011.md] | Strong |
| Use the if-then form only for the priority, not for every item | Boundary conditions [raw/brief--planning--gollwitzer-sheeran-meta-analysis-2006.md] | Strong, stated by the source itself |
| Cap the priority at a 1 to 4 hour piece of work | Proponent size bound [raw/brief--single-priority--todoist-eat-the-frog.md] | Weak, vendor assertion, adopted as a heuristic |
| Prefer an earlier window for a hard decision, weakly | OR 1.26 by fourth hour [raw/brief--time-of-day--linder-antibiotic-prescribing-jama-2014.md], with the flagship contested [raw/brief--time-of-day--glockner-hungry-judge-revisited-2016.md] | Weak by design |
| Never hardcode an early clock hour as the good hour | Interaction, not main effect [raw/brief--time-of-day--facchin-chronotype-sports-medicine-open-2018.md] | Strong |
| Same time every day, short, rather than richer | Consistency beats elaboration [raw/brief--morning-routines--simplypsychology-2026.md] | Moderate, secondary source |
| Relevance to the reader's own situation is the thing that prevents abandonment | 35% of unsubscribes are lost interest plus irrelevance [raw/brief--digest-fatigue--cleanemail-stats-2026.md], daily "raises the bar significantly" [raw/brief--digest-fatigue--beehiiv-open-rate-decline-2026.md] | Moderate, aggregator numbers |

## 9. Named gaps and numbers this skill refuses to restate

**Gaps in coverage.** State these when asked where a recommendation came from.

1. **No source measures abandonment of an AI-generated personal daily brief.** The digest
   evidence is email marketing newsletters
   [raw/brief--digest-fatigue--beehiiv-open-rate-decline-2026.md]
   [raw/brief--digest-fatigue--cleanemail-stats-2026.md]. The transfer to a personal,
   privately generated brief is an assumption.
2. **No source tests whether a "what changed since yesterday" section improves retention.**
   That design choice is reasoned from the irrelevance and lost-interest unsubscribe
   reasons [raw/brief--digest-fatigue--cleanemail-stats-2026.md], not measured.
3. **No source compares night-before versus morning-of delivery.** The timing position in
   this skill is argued from freshness plus the within-session decision result
   [raw/brief--time-of-day--linder-antibiotic-prescribing-jama-2014.md], not from a trial.
4. **No source measures the right number of items in a brief.** The archive gives a word
   budget [raw/brief--brief-length--nngroup-how-little-users-read.md] and a priority count
   asserted by proponents [raw/brief--single-priority--todoist-eat-the-frog.md]. The item
   counts in this skill are derived from the word budget, and that derivation is a design
   decision.
5. **Post-2006 challenges to implementation-intention durability were not swept.** Named as
   a gap by the raw file itself
   [raw/brief--planning--gollwitzer-sheeran-meta-analysis-2006.md].

**Numbers present in the archive that must not be restated as fact.**

| Number | Where it appears | Why it is refused |
|---|---|---|
| 70% unsubscribed from three or more brands; 36% from six or more | [raw/brief--digest-fatigue--cleanemail-stats-2026.md] | No original source, no sample size |
| 50% to 300% unsubscribe spikes after Gmail's Subscription Center | [raw/brief--digest-fatigue--cleanemail-stats-2026.md] | No original source |
| 22.5% annual list decay; 41% report subscription fatigue | [raw/brief--digest-fatigue--cleanemail-stats-2026.md] | No original source |
| 25% of people are night owls | [raw/brief--single-priority--highley-eat-the-frog-critique.md] | Asserted without citation |
| Roughly 30% performance drop from chronotype misalignment | [raw/brief--single-priority--highley-eat-the-frog-critique.md] | Asserted without citation |
| 47% greater shareholder return from effective communication | [raw/brief--brief-format--bluf-army-regulation-25-50.md] | Not about BLUF, no methodology |
| "65% to near zero" parole ruling collapse | [raw/brief--time-of-day--glockner-hungry-judge-revisited-2016.md] | Shown to be largely artifact by the same file |

The unsubscribe-reason *ranking* (volume, then lost interest, then irrelevance) is used
directionally and always labelled as directional
[raw/brief--digest-fatigue--cleanemail-stats-2026.md].
