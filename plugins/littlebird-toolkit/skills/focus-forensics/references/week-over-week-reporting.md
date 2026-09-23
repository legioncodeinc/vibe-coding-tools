# Week over week reporting

The comparison procedure, the artifact spec, the single behavioral nudge, and the tone
rules. This is the skill's primary output, not its closing section.

## Why comparison is the strongest thing this skill produces

Two honest measurements of the same construct by different methods differ by a factor of
two and cannot be compared. The 2005 stopwatch study gives roughly 11 minutes in a working
sphere; the 2025 video study gives roughly 6 minutes; the 2025 authors explicitly decline
the comparison, on the grounds that "differences in methods, measures, and study contexts
may limit direct comparability"
(`references/research/distilled-attention-fragmentation.md`, section 4).

Two measurements by the SAME imperfect method can be compared, because whatever the method
distorts, it distorts both times
(`references/research/distilled-attention-fragmentation.md`, section 4). Everything the
snapshot instrument gets wrong, it gets wrong in week one and week two alike.

The intervention evidence has the same shape. The cleanest demonstration in the archive is
within-subjects: 13 people measured against themselves under two conditions, switches per
hour falling from 37.1 to 18.2 and seconds per window rising from 75.5 to 131.9
(`references/research/distilled-attention-fragmentation.md`, section 9). The point
estimates are unusable elsewhere; the within-person comparison is what carried the finding.

So: never compare the user to a published figure, to a benchmark, or to another person.
Always compare them to their own prior window measured identically.

## Reading the prior reports

Before computing anything, call `LB_INTERNAL_GET_ROUTINE_REPORTS` on the focus-forensics
routine with `limit` 8 and read every returned report
(`references/littlebird-mcp-reference.md`). Extract into a table:

| Field | From each past report |
|---|---|
| Window dates | Header |
| Observed cadence, median interval between snapshots | Method section |
| Snapshot count, switch count, transition rate | Headline block |
| Median run length, longest run, count of runs of length 1 | Run block |
| Top three and bottom three hours with their sample sizes | Hour block |
| Meeting count, scheduled meeting minutes, count of gaps of 90 minutes or more | Meeting block |
| Named rabbit holes | Rabbit hole block |
| The nudge offered, and its stated check | Nudge block |

Every artifact this skill writes must contain those fields in a shape a later run can pull
back out. That is why the artifact spec below fixes the section order and the label
wording.

## The comparability gate, which runs before any comparison

Comparison is only valid when the instrument behaved the same way in both windows. Check
all four, in order, before printing a single delta:

1. **Cadence.** If the observed median interval between snapshots differs by more than 25
   percent between the two windows, counts are not comparable. Report both cadences, state
   that the capture rate changed, and skip the count comparisons entirely. Rates that are
   proportions of adjacent pairs may still be compared, with the caveat printed.
2. **Coverage.** If either window has fewer than three days with snapshots, or fewer than
   50 snapshots, comparison is skipped and the thin window is named.
3. **Context taxonomy.** If the context labels assigned this week do not substantially
   overlap the labels in the prior report, the user's work changed and the comparison is
   between different things. Say so and compare only the taxonomy-independent metrics:
   snapshot count, transition rate, run length distribution, break count.
4. **Unclear rate.** If the share of `unclear` snapshots differs by more than 10 percentage
   points between windows, labeling quality changed and any context-dependent comparison
   carries that caveat inline.

A gate that fails is reported, not worked around. "The capture rate changed this week so
the counts are not comparable" is a correct and useful sentence.

## What gets compared

| Metric | Comparison | Notes |
|---|---|---|
| Transition rate, switches per adjacent pair | Delta in percentage points | The headline. A proportion, so it survives a cadence change better than a count does |
| Median run length, in snapshots | Delta in snapshots | Never converted to time |
| Count of runs of length 1 | Delta in count, with both snapshot counts printed | The fragmentation signature that matters most |
| Count of runs of length 5 or more | Delta in count | The supply of sustained work |
| Longest run | Both values in snapshots, with both bounded intervals | |
| Top three and bottom three fragmented hours | Whether the set changed, not the rate delta | Hour-level rates are too thin for delta reporting |
| Meeting count and scheduled minutes | Delta, in real units | The only real minutes in the report |
| Gaps of 90 minutes or more | Delta in count | The measured supply of unbroken calendar time |
| Rabbit holes | Which persisted, which are new, which are gone | Never a count trend |
| Last week's nudge | Whether its stated check passed, failed, or was inconclusive | Mandatory. See below |

## Do not read noise as trend

Three rules, each of which will otherwise be broken every single week.

1. **Two points are not a trend.** With fewer than four comparable prior reports, describe
   the change and do not describe a direction of travel. "Higher than last week" is
   supportable. "Trending worse" is not.
2. **Print an indifference band and respect it.** A transition-rate change under 5
   percentage points, or a median run length change of under 1 snapshot, is reported as
   "about the same". A sampling design with roughly a hundred observations carries a margin
   of error around 10 percentage points on a single proportion
   (`references/research/distilled-attention-fragmentation.md`, section 5), so small deltas
   are not findings and dressing them up as findings is the fastest way to train the user
   to ignore the report.
3. **Never extrapolate.** No projections, no "at this rate", no annualized anything.

## The single behavioral nudge

One change. Tied to the specific pattern observed this week. With a way to tell next week
whether it worked. That is the entire specification, and each clause is doing work.

### Choosing it

Pick from the pattern, in this priority order. Stop at the first that applies.

| If the week showed | Offer | Evidence position |
|---|---|---|
| Last week's nudge with an inconclusive check | The same nudge again, unchanged, with a clearer check | Repeating an untested experiment is not repetition, it is finishing it |
| High count of runs of length 1, and a comms context involved in most switches | Turn off notifications for one named app for a defined block on named days | Best-supported change in the archive, and the caveats are heavy. Section 9 |
| A dense burst pattern clustered in identifiable hours | Move one specific recurring commitment out of the user's least fragmented hour | Hour comparison is the axis that holds up best. Section 7 |
| Many meetings and few calendar gaps of 90 minutes or more | Block one named 90 minute gap on one named day next week | Calendar arithmetic is real. Step 8 of the detection guide |
| A named rabbit hole persisting from last week | Nothing behavioral. Surface it and ask what it is | The skill does not know whether it was worth doing |
| Nothing above, or a Low-confidence week | No nudge this week. Say so | A nudge from a thin week is a guess |

Two things are forbidden as nudges regardless of pattern:

- **Batching email or messages as a proven remedy.** The only logged test of it in the
  archive found no stress benefit: "Despite widespread claims, we found no evidence that
  batching email leads to lower stress"
  (`references/research/distilled-attention-fragmentation.md`, section 9). If the pattern
  genuinely points there, offer it explicitly as an untested experiment and say the
  published evidence found no benefit.
- **Anything that asks the user to try harder, concentrate more, or be more disciplined.**
  The changes that moved measured behavior removed something from the environment; the one
  that asked the person to reorganize themselves around the same environment failed
  (`references/research/distilled-attention-fragmentation.md`, section 9).

### Stating it

Every nudge carries four parts:

1. **The observation it responds to**, with its numbers.
2. **The change**, concrete enough to do without deciding anything further. A named app, a
   named day, a named time. Not "reduce interruptions".
3. **The check**, expressed in a metric this report already prints, with a threshold. "Next
   week's report will show whether runs of length 1 fell below 40."
4. **The honesty line**, which states how good the evidence is.

The honesty line for the notification nudge, or close to it:

```
The published evidence for this is one randomized experiment that ran for a single
working day, with self-reported outcomes, on a young and highly educated sample,
and the effect disappeared entirely for some people depending on their relationship
with being reachable. It is the best-supported change in the research this skill
was built on, which tells you more about the research than about the change. Treat
it as an experiment on yourself, and the check below is how you find out.
```

### Marking it as resolved

Next week's report opens the nudge section by resolving last week's:

- **Check passed.** Say so, in one line, with both numbers. Offer to keep it or stop it.
- **Check failed.** Say so, in one line, with both numbers. Do not offer the same nudge
  again. Move to the next row of the table.
- **Inconclusive**, because coverage was thin or a gate failed. Say so and repeat the same
  nudge with a clearer check.

A nudge whose outcome is never reported back is advice, and this skill does not give
advice. It runs one experiment a week and tells the user how it went.

## Tone

A report that makes the user feel judged gets turned off in two weeks, and a skill that
gets turned off has zero effect regardless of how accurate it was. Tone is therefore a
functional requirement, not a style preference.

### The register

Neutral and curious. The report is a colleague showing the user something interesting they
found in the data. Not a coach, and not an auditor.

| Do not write | Write |
|---|---|
| You lost focus 47 times on Tuesday | Tuesday had 47 observed transitions, the most of any day this week |
| You wasted time on Kubernetes docs | Kubernetes docs appeared in 4 separate runs during a week you had written down as migration-only |
| Your worst hour was 11am | 11am had your highest transition rate this week, at 0.61 across 34 adjacent pairs |
| You should block your calendar | One thing to try: block Thursday 09:00 to 10:30, the one 90 minute gap already on your calendar |
| Your focus is declining | This week's median run was 3 snapshots, against 5 last week. Two weeks is not a trend |
| Only 12 percent of your day was deep work | This report does not compute percentages of the day. Here is the run distribution |

### The specific words that are banned

`wasted`, `lost`, `squandered`, `poor`, `bad`, `worst`, `failed` applied to the user,
`should have`, `distracted`, `unfocused`, `undisciplined`, `procrastinating`, `productive`,
`unproductive`, `deep work` as a measured category, `flow state` as a measured category.

Some of those are banned because they are judgments. The rest are banned because they name
constructs the instrument cannot measure, which makes them false as well as unkind.

### Three positive rules

1. **Lead with what the week looked like, not with what was wrong with it.** The first
   substantive line after the limitation note is the coverage summary. The second is the
   headline structure. Problems, if any, come after.
2. **Name at least one thing that held up**, when the data supports it: the longest run, an
   hour with a low transition rate, a day with sustained work, a week-over-week improvement.
   Not as consolation, as evidence. It is as real as the rest.
3. **When the report and the user's memory disagree, say so and stop there.** Self-report
   and logs routinely diverge, across 106 effect sizes
   (`references/research/distilled-attention-fragmentation.md`, section 8). That
   establishes that the two differ. It does not establish which one is wrong, and the skill
   never tells the user their memory of their own week is mistaken.

## The artifact

A deep run writes one file:

```
focus-forensics-YYYY-MM-DD.md
```

in the working directory or a directory the user names. `YYYY-MM-DD` is the window END
date.

Sections, in this order, with these headings. The order and the headings are fixed so that
a later run can parse its own prior output.

1. `## How this was measured`. The limitation note verbatim from
   `references/what-snapshots-can-and-cannot-measure.md`, plus the window dates, the
   observed cadence, and the queries run.
2. `## Coverage`. Days with snapshots, total snapshots, snapshots per day, break count,
   share of `unclear` snapshots, and any comparability gate that failed.
3. `## This week's structure`. Snapshot count, switch count, transition rate, median run
   length, longest run with its bounded interval, count of runs of length 1, count of runs
   of length 5 or more, burst list.
4. `## Compared with last week`. The comparison table, gates that failed, the indifference
   band applied, and an explicit line if fewer than four comparable priors exist. **This is
   the primary section. It goes above the fold in any summary.**
5. `## By hour and by day`. Top three and bottom three hours with sample sizes, weekday
   shape, thin-coverage hours listed separately.
6. `## Meetings and unbroken calendar time`. The meeting table, in real minutes, with the
   gaps of 90 minutes or more, and no causal claim.
7. `## Recurring alongside a stated intention`. At most two rabbit holes in the house format
   from `references/rabbit-hole-identification.md`, or a line saying none cleared the bar,
   or a line saying no stated intention was found.
8. `## Last week's experiment`. Passed, failed, or inconclusive, with both numbers.
9. `## One thing to try this week`. The nudge, in four parts.
10. `## What this report did not look at`. The excluded-category line, the forbidden claims
    this skill does not produce, and any named gap that affected this run.

Raw retrieved capture is working data and does not ship in the artifact
(`references/evidence-standards.md`, rule 7). Process it, write the distilled sections,
discard the rest.

## Confirmation before anything is encoded

Two things get confirmed with `AskUserQuestion` before they are written down as durable
fact (`references/evidence-standards.md`, rule 6):

1. **The context taxonomy, on a first run.** Show the labels derived from the capture and
   ask the user to correct, merge or rename them. A taxonomy the user does not recognize
   makes every count in every future report meaningless, and the labels persist across runs.
2. **Any rabbit hole, before it is named in a file.** Show the stated intention, the runs
   and the topic, and ask whether it belongs in the report. The user may know it was
   directly relevant work, in which case they are right and the heuristic is wrong.

Nothing produced by this skill goes to another person, gets posted, or gets written into a
third-party system. It is a private artifact. If the user asks for a version to share, show
them the exact text first and get approval of the words, not of the plan
(`references/evidence-standards.md`, rule 6).
