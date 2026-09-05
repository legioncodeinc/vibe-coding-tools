# Threshold and ranking

How many recurrences justify a proposal, over what window, and how competing candidates get
ordered. Plus how to state effort without inventing a number.

---

## 1. The threshold is a convention and this section says so first

**No source in the research archive supplies a researched constant for how many times a task
must recur before it is worth automating.** The only published threshold anywhere in the
archive is on determinism, not frequency: a method that retains only learned rules with
confidence 1.0, because only those can be considered deterministic
[references/research/distilled-automation-opportunity-identification.md section 3.1]. That is
a test of whether a routine is automatable at all, not of whether it recurs often enough to
bother.

The practitioner literature does supply frequency language, and it is not usable as a number
here. It wants processes taking hours out of the day, executed multiple times daily or
continuously, and it excludes a 15-minute-weekly task as too small to justify
[distilled section 5, section 6]. Those figures are calibrated to enterprise robotic process
automation, where a bot is a funded project with development, testing, governance and
maintenance cost [distilled section 6.1]. The bar for "worth automating" moves with the cost
of building, and here the cost of building is one working session. The criteria transfer. The
numbers do not [distilled section 11, conflict 2].

So the threshold below is stated as what it is: a convention, chosen deliberately, with its
trade-off named. Say that to the user if they ask where it came from. Do not present it as
research.

---

## 2. The threshold

**Three observed recurrences within 90 days, or four within 180 days.**

A candidate that meets neither is not proposed. It may be recorded in a watchlist section of
the report, which is a different thing from a proposal.

### What each half is doing

- **Three in 90 days** catches active, current work. The window is short enough that the
  pattern is still live and the tools involved have not changed underneath it.
- **Four in 180 days** catches genuinely periodic work: monthly reporting, quarterly reviews,
  onboarding a new client. Four occurrences over six months is a real cadence and it would
  never clear a 90-day bar.

### Why three and not two

Two occurrences cannot distinguish a habit from a coincidence. Any two pieces of work
resemble each other if you squint, and signature 1 in `references/pattern-signatures.md` is
specifically prone to that. Three is the smallest count where the recurrence claim survives
one of the three being wrong.

### Why three and not five

Because the counts this skill produces are systematically low. Three separate mechanisms push
the same direction:

1. **Snapshots are sampled.** A run that fell between captures did not happen as far as
   retrieval is concerned.
2. **Detectors fragment routines.** One deviation in the middle of an otherwise identical
   sequence causes the detector to see two short patterns rather than one real one
   [distilled section 4]. The long, valuable routines are the ones most likely to get broken
   up and under-counted.
3. **Items scoring below 3 are omitted by the server entirely**
   (`references/littlebird-mcp-reference.md`, `search_user_context` return shape).

An observed count is a **lower bound**, always. Write it as "at least 3 occurrences", never
as "3 occurrences". A threshold tuned as if the count were complete would be set too high.

---

## 3. What the threshold trades off

State this trade-off to the user in the first report, once.

**Setting it lower, at two:** more candidates surface, and more of them are coincidences.
That failure is worse than it looks, because the cost lands on a monthly report the user has
to keep opening. A report the user stops reading cannot be tuned, since the tuning signal is
gone with it. This is the same asymmetry that governs every routine in this marketplace
(`references/routine-wiring` guidance inside SKILL.md, and routine-architect's failure mode
5).

**Setting it higher, at five:** every proposal is solid, and the user has already performed
the task five times before anything is said. If the point of the skill is to catch repeated
work early enough to matter, a threshold that requires five occurrences has already lost most
of the value it was supposed to create.

**Three is chosen to sit on the early side of that trade**, on the reasoning that the
under-counting in section 2 means an observed three usually corresponds to more than three,
and that a proposal is cheap to decline while a missed pattern costs an unbounded number of
future occurrences.

**Do not change the threshold silently.** If the user wants it moved, move it, record the new
number in the routine prompt, and say in the next report which threshold produced the list.

---

## 4. Effort, stated honestly

**Never print an hour figure.** Not "this costs you about 2 hours a month". The capture does
not support it and the user's own estimate does not either.

### Why the capture does not support it

Snapshots are periodic samples. Two snapshots 40 minutes apart bound the elapsed span of a
session at 40 minutes. They say nothing about how much of that span was the task, how much
was a phone call, and how much was the tab sitting open. Elapsed time is an upper bound on
effort and a bad one.

### Why the user's estimate does not support it either

This is the finding worth carrying into the conversation, because the natural fix for a
missing number is to ask the user, and the archive says that fix does not work.

- 401 managers and professionals, self-assessed computer use against logs: a 32% difference
  in the average amount of use, 3.9 against 2.7 hours per day, and at the individual level a
  **median absolute percentage difference of 47%** against logged connect time
  [distilled section 9.1].
- Estimates regress toward the population mean: light users overestimated their use, heavy
  users underestimated theirs [distilled section 9.1]. So the direction of a person's error
  is predictable from how much they actually do, which makes it a bias rather than noise.
- Replicated same-day, against keyboard and mouse logs, with the same regression pattern:
  overestimation below 3.6 hours of recorded use, underestimation above it, and a median
  self-report exceeding recorded duration by 1.9 hours [distilled section 9.2].
- And a second-order finding that lands directly on this skill: experiencing symptoms was
  related to a 0.15-hour increase in self-reported duration after controlling for recorded
  duration [distilled section 9.2]. How the person felt changed their reported number. The
  tasks a person nominates as their repetitive burden are partly selected by how annoying
  they are, not by how long they take.
- The general version, over 106 effect sizes: self-reports were rarely an accurate reflection
  of logged use [distilled section 9.3].

Two conflicting readings exist on the direction of the bias and the distillation records
both: the two primary studies find the regression pattern, the meta-analysis reports
systematic directional bias without resolving a single uniform direction across study types
[distilled section 11, conflict 3]. The regression pattern is preferred, held at medium
confidence, because it comes from the two studies that measured individuals against their own
logs and it is stable across a 25-year gap.

### What to print instead

Four measured quantities, all of which the capture actually supports:

| Field | How it is derived | Example |
|---|---|---|
| Steps observed | Count of distinct deduplicated UI states on the occurrence with the most complete capture | 11 distinct screens |
| Applications involved | Count of distinct apps in the sequence | 3 |
| Handoffs between applications | Count of transitions between distinct apps | 4 |
| Elapsed span, bounded | First and last snapshot timestamp of the best-captured occurrence, stated as a bound | "capture spans 09:12 to 09:51, so under 39 minutes elapsed, which is not the same as 39 minutes of work" |

And optionally a fifth line, clearly separated and clearly labelled:

| Field | How it is derived |
|---|---|
| The user's own estimate | Only if the user volunteers it, printed as "the user estimates X", with a one-line note that self-estimates of computer work carry a median individual error near 47% against logs [distilled section 9.1] |

The step count is the honest workhorse. It is directly observable, it is what actually
determines how much a skill would carry, and it is the number a reader can check against the
receipts.

---

## 5. Ranking

Rank candidates on four factors. There is no weighted formula, because a formula would imply
a precision none of the inputs have. Sort by factor 1, break ties with 2, then 3, then 4.

**Factor 1. Evidence strength.** How defensible the recurrence claim is.

| Tier | What it means |
|---|---|
| Strong | Signature 2 or 3 fired with attribution or a literal match established on both ends, or two independent signatures fired on the same work |
| Moderate | One signature fired, three or more receipted occurrences, no contradicting evidence |
| Weak | Threshold met only by counting items scored 3, or by counting occurrences inside a single batch |

Weak never ranks above Moderate regardless of how large the apparent saving is. A confident
proposal built on weak evidence is the specific way this skill loses the user's trust.

**Factor 2. Automatability.** Does it pass the formal test: a determinate trigger, and every
input either constant or derivable from earlier steps in the same run [distilled section 3].
Score it as pass, partial, or fail. A fail here is a skip recommendation regardless of how
often it recurs, and the reason goes in the proposal.

**Factor 3. Observed size.** Steps, applications, handoffs, per section 4. More steps and more
handoffs mean more of the work a skill would actually carry. This is where the practitioner
criteria land: disparate systems and error-proneness are both real signals
[distilled section 5], and both show up as handoff count.

**Factor 4. Recurrence count and recency.** More occurrences, and more recent ones, rank
higher. A pattern whose last occurrence was four months ago is a watchlist item, not a
proposal, whatever its total count says.

### The suppressors, applied after ranking

Two things demote a candidate no matter where it ranked.

- **Anything the dedupe pass flagged as already covered** drops out of the proposal list
  entirely and moves into the "you already have this" section. See
  `references/dedupe-against-existing-skills.md`.
- **Anything hitting a reason in `references/when-not-to-automate.md`** becomes a skip
  recommendation with its reason named, and it stays visible in the report. A named skip is a
  finding. Deleting it silently means the next run rediscovers it and proposes it.

---

## 6. How many to propose

**At most three candidates in any one report, and one drafted SKILL.md.**

The ceiling is not a formatting preference. A ranked list forces the ranking to mean
something, and a suggester that lists eight candidates has not made a judgment, it has made a
dump. If more than three cleared the threshold, report the top three and end the section with
a count of how many more exist.

**Zero is a valid and complete result.** A month in which nothing crossed the threshold is an
ordinary month. The failure mode this skill is most exposed to is manufacturing a proposal to
justify its own existence, because a proposal is its output. Write "no repeated workflow
crossed the threshold this period" and stop.

---

## 7. Report the threshold with the list

Every report states, in one line, the threshold that produced it and the window it ran over.
Something like: "Threshold: at least 3 occurrences in 90 days or 4 in 180. Window swept:
2026-05-17 to 2026-08-17. Counts are lower bounds, because capture is sampled."

Without that line the reader cannot tell whether an absent item was absent or just below the
bar, and a threshold nobody can see is a threshold nobody can argue with.
