# What snapshots can and cannot measure

What this skill can and cannot establish about how attention was spent, why, and what it
ships instead.

Read this before writing any number into any output. The rules here override any instinct
to total something up into hours.

## The short version

**Do not emit a time ledger.** Not hours lost, not a percentage of the day, not a
productivity score, not minutes per switch, not a comparison against anyone else. Emit
counts, sequences, distributions, named examples, and change against the user's own prior
window.

The roadmap promised "you lost approximately X hours to Y". That sentence cannot be
produced from this instrument, and shipping it anyway would be a false precision that
discredits every other number in the report.

## What the instrument actually is

Littlebird takes periodic snapshots of the screen. That is the whole input, plus meetings.
Enumerate what a single snapshot does and does not tell you.

| A snapshot tells you | A snapshot does not tell you |
|---|---|
| Something was visible on this screen at this timestamp | Whether the user was at the machine |
| Which application or site rendered the visible pixels | Whether the visible window was the FOCUSED window |
| Text that was legible, subject to OCR error | Whether the user was reading it, writing it, or had left it open behind something else |
| That two consecutive snapshots differed | Anything that happened in the interval between them |
| That a context appeared in N snapshots across a window | How many minutes were spent in it |

Nothing in the gap between two snapshots is observed. The user may have worked continuously
in one context, switched fourteen times and returned, or gone to lunch. All three produce
the same pair of snapshots.

## Why: what the measurements actually say

Everything in this section traces through
`references/research/distilled-attention-fragmentation.md` to a raw source.

### Even continuous OS-level logging cannot see engagement

A CHI 2014 study captured all activity in the operating system across 1,509 hours and still
reported that "it could not be known how engaged a user was with a window in active use"
without interrupting participants to ask them
(`references/research/distilled-attention-fragmentation.md`, section 6). They had every
window event. They still had to ask.

Researchers with a full continuous event log describe the boundary between tasks as hard to
find: "it is difficult to identify exactly when the resumption phase may begin", and they
resorted to heuristics
(`references/research/distilled-attention-fragmentation.md`, section 6).

The best-instrumented email study in the archive defined duration on the FOREGROUND window,
terminated by five minutes with no keyboard or mouse activity
(`references/research/distilled-attention-fragmentation.md`, section 6). That is the
definition every published duration figure rests on. This skill has neither foreground
state nor input activity, so it cannot produce that quantity. Not approximately. At all.

### Periodic sampling yields proportions, and proportions have bands

Activity sampling is a century-old method and its properties are known. It yields "the
amount of work content in terms of percentage of available working time", which is a
proportion, and it "fails to give a detailed analysis" of the kind that produces
element-level times (`references/research/distilled-attention-fragmentation.md`, section 5).

Precision costs observations. At 95 percent confidence with an observed proportion near
0.45, roughly 96 observations buys a margin of error of 10 percentage points
(`references/research/distilled-attention-fragmentation.md`, section 5). A week of
snapshots is a modest sample. Every proportion computed from it is a band, not a point.

### Fixed-interval capture is biased in a way you cannot detect from inside it

The method requires that observation times "should be random and time interval between
observation time should vary". With fixed intervals, "if there is an activity repeating
every three minutes in the work, the sampling study will give wrong information"
(`references/research/distilled-attention-fragmentation.md`, section 5).

A person who checks a chat app on a rough rhythm, or a build that runs on a timer, or a
standup at the same minute each day, can be systematically over-counted or invisible. There
is no way to tell from the sample which happened.

### The cost of fragmentation is not measured in lost hours anyway

The controlled experiment most often cited in support of the hours framing found interrupted
participants finishing FASTER: 20.31 and 20.60 minutes with interruptions against 22.77
without (`references/research/distilled-attention-fragmentation.md`, section 2). The cost
turned up in stress, frustration, time pressure and effort, not in elapsed time
(`references/research/distilled-attention-fragmentation.md`, section 2).

So "you lost N hours to context switching" is not a cautious paraphrase of the literature.
It asserts the one thing the most-cited experiment measured moving the other way.

### There is no per-switch penalty to multiply by

Switch cost is real. It is roughly 200 ms against a 500 ms baseline in the laboratory, it
survives preparation, and a residual cost persists even after 5 seconds of warning
(`references/research/distilled-attention-fragmentation.md`, section 3). That is a genuine
mechanism, measured in tenths of a second, on cued trials between two trivial tasks.

The review contains no cost of switching between real work contexts and no estimate in
units of workday minutes (`references/research/distilled-attention-fragmentation.md`,
section 3). Any skill that multiplies a switch count by a minutes-per-switch figure has
invented the multiplier.

### The most famous number in this field does not exist

The "23 minutes 15 seconds to refocus" figure appears in interviews and in media citations
of those interviews, and not in a peer-reviewed publication
(`references/research/distilled-attention-fragmentation.md`, section 1). This sweep fetched
the full text of the paper most often cited for it and searched it: the number 23 does not
appear anywhere in the document
(`references/research/distilled-attention-fragmentation.md`, section 1).

What the field measurements actually give is a wide band with enormous spread:

| Measured quantity | Value | Standard deviation |
|---|---|---|
| Return to an interrupted working sphere, same day | 25 min 26 sec | 54 min 48 sec |
| Return to a suspended app after an email alert | 9 min 33 sec | 13 min 15 sec |
| Return to a suspended app after an IM alert | 8 min | 11 min 32 sec |
| Resumption phase after email, immediate response | 16 min 33 sec | 27 min 20 sec |

(`references/research/distilled-attention-fragmentation.md`, section 1.) Every standard
deviation meets or exceeds its mean. There is no single number in there to quote, which is
exactly why a single number got invented.

**Do not print 23 minutes 15 seconds in any output, including a debunking one.** Repeating
a number to deny it is still circulating it.

### Self-report is not a rescue

Asking the user how fragmented the week felt does not supply a second measurement. Across
106 effect sizes, "self-reported media use correlates only moderately with logged
measurements" and "self-reports were rarely an accurate reflection of logged media use"
(`references/research/distilled-attention-fragmentation.md`, section 8).

A felt impression is a real and useful datum about the week. It is not a measurement of the
same construct and is never averaged with the snapshot evidence.

## The forbidden claims list

This skill does not produce any of the following, in any phrasing, in any output, including
routine reports, chat responses and file artifacts.

| Forbidden | Why |
|---|---|
| Total hours lost to switching, rabbit holes, or anything else | The instrument cannot convert observation counts to durations (distillation, sections 5 and 6) |
| Any percentage of the day or of the workday | Requires knowing the denominator, which requires knowing when the user was working and at the machine. Unobserved |
| A productivity score, focus score, attention score, or grade | No validated construct exists here, and a score invites the user to defend it rather than read it |
| A comparison against other people, an average, a benchmark, or a published figure | Cross-method comparison is explicitly disclaimed by the researchers themselves (distillation, section 4) |
| Minutes or seconds of cost per switch | No published per-switch workday penalty exists (distillation, section 3) |
| "23 minutes 15 seconds", in any framing | No paper contains it (distillation, section 1) |
| "You were focused" or "you were distracted" | Engagement is not observable, even with continuous logging (distillation, section 6) |
| "You spent N minutes on X" | Duration requires foreground state and input activity. Not available |
| Any claim about time between two snapshots | Unobserved by construction |
| A trend line across more than the windows actually measured the same way | Method changes invalidate comparison (distillation, section 4) |

If the user explicitly asks for hours, do not produce them. Say what the instrument is,
offer the switch and run structure instead, and let them decide whether that answers their
question. A user who asks for hours and is told plainly why they cannot have them will
trust the numbers they do get.

## What this skill ships instead

Ranked by how much each survives the measurement problem.

| Rank | Output | Why it survives |
|---|---|---|
| 1 | **Week-over-week change** in every metric below | A biased instrument used identically twice still detects change. This is the skill's primary output, not a garnish |
| 2 | **Switch counts.** Consecutive snapshots showing a different application or work context are two observations, and the transition between them is a third | Counting observed transitions requires no assumption about the interval |
| 3 | **Meeting load against unbroken calendar time**, from `LB_INTERNAL_LIST_MEETINGS` | Calendar entries are real scheduled objects with real start and end times. This is the one genuinely measured input the skill has |
| 4 | **Fragmentation by hour of day**, as switches per observed snapshot within each hour | A comparison of like with like within one person, on an axis the literature says varies systematically (distillation, section 7) |
| 5 | **Context-run length distribution**, in consecutive snapshots, with the elapsed clock interval shown as a bounded interval and labeled as one | Counting consecutive same-context snapshots is observation. The clock span is an interval bounded by two observations, never a duration |
| 6 | **Named rabbit holes**, a topic or site recurring in a window where the user had stated other intentions | A named example with receipts, presented for the user to judge |
| 7 | Anything expressed as hours, percentages, or scores | Not produced. See above |

## How to express a run without lying about it

Runs are the place where the temptation to say "duration" is strongest. The house
formulation, and it is mandatory:

```
Longest unbroken run on one context this week
  Tuesday, 14 consecutive snapshots on the Helix API work
  First snapshot 09:12, last snapshot 11:47
  That is an interval bounded by two observations, not a measured duration.
  Nothing between the snapshots was observed.
```

Never "you worked for 2 hours 35 minutes". The primary figure is 14 consecutive snapshots.
The clock times are context so the user can find the morning in their own memory. The
disclaimer line is not optional and does not get compressed away in later runs.

Report run lengths as a distribution, not a mean. Every published run-length figure in the
archive carries a standard deviation at or above its own mean
(`references/research/distilled-attention-fragmentation.md`, section 4), which means the
distribution is skewed and a mean is the wrong summary. Give the median, the longest run,
and the count of runs of length one.

## The limitation note that appears in every report

Every report carries this, in these words or very close to them, near the top:

```
How this was measured, and what it cannot see. Littlebird takes periodic snapshots
of the screen. It is not a time tracker. Between any two snapshots nothing is
observed: this report cannot tell whether you were at the machine, whether the
window it saw was the one you were actually working in, or what happened in the
gap. So it does not report hours, percentages of your day, or a score, and it never
compares you to anyone else. It reports transitions it observed, how long runs were
in consecutive snapshots, which hours looked most broken up, and what changed since
last week. Week-over-week change is the most trustworthy line in here, because both
weeks were measured the same imperfect way. If a number below contradicts your
memory of the week, your memory is not the thing being corrected. Both are partial.
```

Say it once, near the top, every time. A user who understands the boundary will trust what
sits inside it.

## The failure this guide exists to prevent

Two ways to build this skill wrong, and they fail in the same direction.

1. **Ship the hours.** "You lost 6 hours to context switching" is legible, quotable, and
   feels like the answer the user asked for. It is also unfalsifiable from the data, it
   contradicts the controlled experiment most often cited to support it, and the first time
   the user notices the report counted a lunch break as a rabbit hole, every other number
   in it becomes suspect too.
2. **Ship a score.** A focus score out of 100 turns the report into a grade. The user then
   either games it or turns it off, and in both cases stops reading the evidence.

Both produce a confident artifact the user cannot check. The defense against both is the
same: counts, sequences and named examples they can verify against their own memory of
Tuesday, plus an honest statement of what was never observed.
