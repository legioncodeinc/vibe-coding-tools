# Earning the open

The whole skill is built around one constraint, so it is worth stating without softening
it: **a daily brief that restates the calendar is deleted within a week.** Daily digests
are the most-abandoned category of recurring automation, and the archive is blunt about
why. Daily is the hardest cadence there is. Daily sending is where fatigue "shows up most
clearly", and a daily cadence "raises the bar significantly" for content quality
[research/distilled-daily-brief-design.md section 1]. Two of the three top unsubscribe
reasons, lost interest and irrelevant content, are the same failure at different distances:
the digest stopped saying anything about the reader's actual situation
[research/distilled-daily-brief-design.md section 1].

Everything below is the mechanism that stops that from happening.

---

## 1. The delta is the product

Most of a brief is structurally repetitive. The same standing meetings, the same open
commitments, the same people. That is not a bug, it is what a day looks like. The part that
is not repetitive is what changed, and that is the only part that could not have been
guessed.

**Rule.** `What changed since yesterday` is a required, first-class section. It is computed,
never asserted. Computing it means:

1. Read the last report with `LB_INTERNAL_GET_ROUTINE_REPORTS`.
2. Build the set of items in that report: meetings, commitments, cold threads, unread
   threads, and the one thing.
3. Build today's set the same way.
4. Diff them. The delta has four buckets, and each has a distinct verb.

| Bucket | What it means | How it reads |
|---|---|---|
| New | In today's set, not in yesterday's | "New: [item]" |
| Resolved | In yesterday's set, gone today, with evidence of resolution | "Closed: [item], evidence [receipt]" |
| Moved | Present both days, but a field changed: date, owner, status, urgency | "Moved: [item], [old] to [new]" |
| Aged | Present both days, unchanged, consecutive-run count incremented | Not printed here. Goes to the escalation rule in section 3. |

**Never print "aged" items in the delta section.** An item that did not change is not a
change. Putting it there is how a delta section becomes a second copy of the brief.

**If the diff is empty**, say so in one line: `Nothing material changed since yesterday.`
That line is honest, it is short, and it is more useful than a fabricated difference.

## 2. The novelty floor

A brief that is 80 percent identical to yesterday's is a brief nobody reads. So measure it
and act on the measurement.

**Rule.** Count the items in today's brief that are New, Resolved, or Moved. If that count
is fewer than two, the brief switches to short form:

```
Mostly unchanged from yesterday.
[Schedule line: N meetings, first at HH:MM]
The one thing: [item] because [reason].
[Delta line or "Nothing material changed since yesterday."]
```

That is the whole brief. Four lines. No commitments section, no cold section, no unread
section, because the reader already has all of it from yesterday's report.

The reason this is a rule and not a preference: re-reading yesterday's content under
today's date is the exact experience that produces "lost interest"
[research/distilled-daily-brief-design.md section 1]. Reprinting it costs more than
omitting it.

## 3. Escalation, so a repeat changes shape

Memory without escalation produces a routine that knows it is repeating and repeats anyway
with more adjectives. That is a separate failure from having no memory at all
[routine-architect failure mode 2].

**Rule, in three tiers, keyed on consecutive-run count.**

| Runs | Behavior |
|---|---|
| 1 to 2 | Report normally. |
| 3 to 6 | Do not restate in the same form. Say plainly that the current approach is not working, name what has already been tried according to the past reports, and recommend a different tactic: a different channel, a different person, dropping it, or a decision the user has to make. |
| 7 or more | Move it out of its normal section into `Stalled, needs a decision`. State the decision required in one sentence. Do not restate the item's history. |

The threshold of three is a design decision, not an archive finding. Three is the smallest
count that distinguishes a recurring condition from a two-day coincidence. Say so if asked.

**The tell that this rule is missing.** Read three consecutive reports and compare the
recommendation for any repeated item. If the noun is the same and the verb is the same and
only the adjectives changed, escalation is not happening
[routine-architect failure mode 2].

## 4. The quiet-day rule

**Named requirement.** If the day is genuinely clear, the brief says so in two lines and
stops. It never manufactures urgency to justify its own existence.

```
Quiet day. [N] meetings, nothing due, nothing cold, no urgent threads.
The one thing: [the highest-leverage item available] because [reason], or "nothing that needs today specifically".
```

Two lines. Not two lines plus a schedule table. Not two lines plus "some things to keep an
eye on".

**Why the brief still ships on a quiet day rather than skipping the run.** This is the
counterintuitive finding in the archive and it decides the design. In a randomized field
experiment, the arm that removed notifications entirely did worse than the batched arms:
anxiety d = 0.56, fear of missing out d = 0.59, with no improvement in attention, and
participants "felt no longer able to be as responsive as expected"
[research/distilled-daily-brief-design.md section 2]. A brief that silently skips its quiet
days trains the exact anxiety the brief exists to remove. The reader stops knowing whether
silence means nothing happened or the routine broke.

So: quiet days ship. They ship short.

**Three failure shapes this rule bans outright:**

- Promoting a minor item so a section is not empty.
- Adding a hedged possibility so the brief has something forward-looking in it.
- Restating a standing meeting's existence as if it were news.

## 5. Precision over recall

**A brief with one wrong "urgent" item costs more trust than a brief that missed three real
ones.** The asymmetry is not symmetric and the reason is structural: a missed item is
recoverable because the reader still trusts the brief and will keep reading it. A brief the
reader has stopped opening cannot be corrected, because the correction arrives in the brief.

**Rule.** For every section, the inclusion test is stated as a condition that could be
checked, and it is paired with named negative cases. The negative cases matter more than the
positive test, because a prompt with only positive criteria has no discipline
[routine-architect failure mode 5].

**Do not flag as an urgent unread thread:**

- A thread where the most recent message is from the user. The ball is not with the user.
- A newsletter, a notification digest, a receipt, a calendar invite, or an automated alert,
  even when the subject line contains urgency words.
- A thread whose urgency comes from the sender's adjectives rather than a dated ask.
  "ASAP" from a vendor is not a deadline.
- A group thread where the ask names someone else as the owner.
- Anything the retrieval scored 3 with no corroborating item
  [littlebird-mcp-reference.md].

**Do not flag as a due commitment:**

- An action item with no date and no downstream evidence anyone is waiting.
- An item whose owner is someone else, unless the user is the one blocked by it.
- An item a sibling routine already reported as closed.
- An item where the only evidence is screen capture of a document the user was reading.
  Capture shows what was viewed, not what was written [evidence-standards.md].

**Do not flag as cold:**

- A thread quiet for less time than that relationship's own normal gap.
- A thread quiet because it reached a natural end. A closed deal is not a cold thread.
- A thread where the user is deliberately waiting on a known external date.

**The tie-break, stated as a rule.** When not confident an item passes the test, leave it
out. Then, once per brief and only once, a single line may name what was excluded and why:
`Left out: 2 borderline threads, no dated ask.` That line preserves recall for the reader
without spending the precision budget.

## 6. What is banned from every brief

These get cut on sight, because each one is content the reader could have generated without
opening the brief.

| Banned | Why |
|---|---|
| A bare meeting list with times and no reason each one matters | This is the calendar. The reader has the calendar. |
| Inlined pre-call briefing content | pre-call-prep owns that. Point at it. |
| Advice about how to have a good day, focus, or manage energy | Contentless. Not derived from any retrieval. |
| Motivational framing of any kind | Costs words, carries no fact. |
| A count of items with no items ("you have 14 open action items") | A number is not a finding. |
| Restated context the reader supplied ("you have a call with Dana, who is your client") | Adds nothing. |
| Anything with no receipt behind it | Violates the evidence standards. |
| A closing summary | The brief was already the summary. |

## 7. How to tell whether it is working

Open rate is a degraded signal and cannot carry this on its own
[research/distilled-daily-brief-design.md section 1]. Use these instead, and check them
whenever the skill runs in on-demand mode:

1. **Read the last 7 reports.** Count how many contained at least one New, Resolved, or
   Moved item. If that number is below 4, the brief is mostly reprinting and the retrieval
   window or the inclusion tests need to change.
2. **Count quiet-day reports across the history.** If zero across twenty runs, the routine
   is manufacturing findings. Real weeks contain quiet days
   [routine-architect failure mode 9].
3. **Check whether the routine auto-paused.** Littlebird exposes an auto-pause-when-unread
   setting [littlebird-mcp-reference.md]. A routine that auto-paused did not fail
   administratively. It is the product's fatigue circuit breaker having fired. Report it
   that way and rewrite the prompt rather than un-pausing it unchanged.
4. **Compare the one thing across consecutive reports.** If the same one thing appears three
   times with the same recommended action, the escalation rule is not firing.
