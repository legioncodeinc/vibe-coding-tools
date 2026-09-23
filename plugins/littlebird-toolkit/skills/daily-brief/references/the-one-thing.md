# The one thing

One line per day naming the single highest-leverage action, with the reasoning shown. It is
the most valuable field in the brief and the easiest one to get wrong, because an
unexplained pick reads as an opinion and gets ignored.

---

## 1. What the evidence actually supports, and what it does not

Be precise about this, because the popular framing bundles two claims that have very
different support.

**Claim A: name one priority.** The archive's support for this is proponent literature
only, and none of the mechanisms that literature invokes is cited to a study
[research/distilled-daily-brief-design.md section 5]. So the single-priority rule is not
adopted here because it is proven. It is adopted because it is a **forcing function for
ranking**. A brief that names three priorities has not ranked anything, and a ceiling with
no ranking pressure produces a report whose first item is whatever the retrieval found first
[routine-architect failure mode 7].

**Claim B: do it first thing in the morning.** Rejected. Two independent lines in the
archive break it. The critique of the method itself points out that it bundles a priority
claim with a clock claim and only the first is about priority
[research/distilled-daily-brief-design.md section 5]. And the chronotype study finds an
interaction rather than a main effect: at 08:00, early chronotypes outperformed late ones by
8.4% on vigilance and 5.9% on executive function, and "LCTs were significantly impaired in
all measures in the morning compared to ECTs"
[research/distilled-daily-brief-design.md section 6]. A product that hardcodes an early hour
as the good hour is right for one group and wrong for the other.

**Claim C: state it as a plan, not as a task.** This is the one with real support. Across 94
studies, if-then plans of the form "If situation Y is encountered, then I will initiate
behavior Z" produced d = .65 on goal attainment, d = .61 on initiating action, and d = .77
on preventing derailment [research/distilled-daily-brief-design.md section 5]. Separately,
across six studies, plan making eliminated the intrusive thoughts and unrelated-task
performance costs of unfulfilled goals, with the goal still unfulfilled and only the plan
changed [research/distilled-daily-brief-design.md section 5].

**The boundary condition that stops this from becoming a formatting tic.** The
implementation-intention source states its own limits: "When there are few barriers to goal
achievement ... implementation intention formation might be superfluous", and strong effects
appeared "predominantly when the underlying goal intention was strong and activated"
[research/distilled-daily-brief-design.md section 5]. So the if-then form is spent on the
one thing and on nothing else in the brief. Every other item is written plainly.

## 2. Candidate generation

The one thing is chosen from a candidate pool, never invented. The pool is built from what
the run already retrieved:

1. Commitments the user owes with a date at or before today, from
   `LB_INTERNAL_GET_MEETING` Action Items and For You blocks, or rolled up from a
   commitment-tracker sibling routine report.
2. Commitments where someone else is demonstrably blocked waiting on the user, evidenced by
   waiting language in a message thread.
3. Preparation that must happen before a meeting on today's calendar and that is not already
   covered by a pre-call-prep report.
4. Items flagged Stalled by the escalation rule, since a stalled item's decision is often
   the highest-leverage thing available.
5. A cold thread whose window is closing on a dated external event.

**Not in the pool:** anything with no receipt, anything whose only evidence is a
Low-confidence retrieval, anything the user has already done according to downstream
evidence, and anything owned by someone else where the user is not blocking.

## 3. Scoring

Score each candidate on four factors. Do not compute a numeric total and do not print
scores. The factors exist to make the comparison explicit and to generate the beat clause in
section 4.

| Factor | Question | Ranks higher when |
|---|---|---|
| **Deadline** | Is there a real date, from a real source? | The date is today or already past, and the date came from a transcript, an invite, or a message, not from an inference. |
| **Blocking** | Is another person unable to proceed? | Someone named is waiting, with a receipt showing the ask. |
| **Cost of one more day** | What does slipping this by 24 hours actually cost? | The cost is irreversible or compounding: a call happens without the input, a window closes, a relationship reads it as a second miss. |
| **Fit** | Does today's calendar contain a window big enough? | There is a real gap in today's schedule that fits the work. |

**Deadline and Blocking are the primary factors. Cost and Fit are tie-breakers.** An item
with a real date beats an item that merely feels important. An item with a named waiting
person beats an item with no counterparty.

**The weak time-of-day preference, stated with its caveat.** Where two candidates are
otherwise tied and one is a hard decision, prefer surfacing that one for an earlier window.
The support is modest and honest: adjusted odds of inappropriate antibiotic prescribing rose
to 1.26 by the fourth hour of a clinic session, P less than .001 for trend
[research/distilled-daily-brief-design.md section 6]. The much more famous parole result
that would have supported a stronger claim is largely a statistical artifact
[research/distilled-daily-brief-design.md section 6]. So this is a tie-breaker with a small
thumb on the scale, not a rule, and the brief never tells the reader that their afternoon
judgment is unreliable.

## 4. The output shape

Three parts, on at most three lines, inside the first block of the brief.

```
The one thing: [action, with a window taken from today's actual calendar gap].
Why: [the deadline or the blocked person, with a receipt].
Beat: [the runner-up] because [the one comparison that decided it].
```

Worked example, with fictional placeholders standing in for real retrieved values:

```
The one thing: between 11:15 and 12:00, send [Dana] the revised scope with the
  [security review] section filled in.
Why: [she said on the 14th she cannot start until it lands, and the build slot is
  Thursday] [receipt].
Beat: [the pricing deck], because [nobody is blocked on it and it has no date].
```

**Why the window is in the line.** That is the if-then cue, in the only form that survives a
one-line budget: the situation is a specific time block that exists on the reader's real
calendar today [research/distilled-daily-brief-design.md section 5]. A window invented
without checking the calendar is worse than no window, because the reader discovers it is
occupied and stops trusting the field.

**Why the beat clause is mandatory.** An unexplained pick gets ignored. The beat clause is
the entire defense of the pick, in one comparison. It also makes the pick falsifiable: the
reader who disagrees can see exactly which comparison to argue with, which is how the field
gets tuned instead of skipped.

## 5. Size bound

If the one thing takes more than roughly half a day, it is not a one thing, it is a project.
The proponent literature's own bound is 1 to 4 hours or half a day at most
[research/distilled-daily-brief-design.md section 5]. That is a vendor assertion, adopted as
a heuristic rather than as evidence, and it is worth adopting because it is falsifiable
against the calendar.

**Rule.** If no gap in today's calendar fits the work, do not pretend one exists. Name the
largest first step that does fit and say so:

```
The one thing: [the full item] does not fit today. Between 09:30 and 10:00, do
  [the specific first step] instead.
```

## 6. When there is no defensible one thing

Two distinct cases, two distinct outputs. Neither of them invents a pick.

**Case one: nothing qualifies.** No dated commitment, nobody blocked, no closing window.

```
The one thing: nothing that needs today specifically. The nearest real deadline is
  [item] on [date].
```

That is a correct and complete answer. Reporting nothing is the expected outcome on a quiet
day [routine-architect failure mode 9].

**Case two: the best candidate rests on weak evidence.** The top-scoring candidate's only
support is a single item the retrieval scored 3, an OCR fragment, or an ambiguous UI reading,
which is a Low-confidence claim [evidence-standards.md].

**Rule: a Low-confidence claim never becomes the one thing.** Drop to the next candidate
with at least Medium confidence. If none exists, use the case-one output and add:

```
Left out: one higher-scoring candidate with evidence too weak to act on.
```

The reason this rule is absolute: the one thing is written in the imperative and read in
under two seconds. Imperative single lines get acted on without verification. A
Low-confidence claim in that slot is the fastest way to make the whole brief untrustworthy,
because the reader will act on it, discover it was wrong, and correctly generalize.

## 7. Repeats

The one thing repeating is not automatically a failure. The same item can genuinely be the
highest-leverage action two days running. What is a failure is repeating it in the same
words with the same recommended action.

Apply the escalation tiers from `earning-the-open.md` section 3:

- **Second consecutive day:** keep the item, change the beat clause to say it is unchanged
  and name what blocked it yesterday.
- **Third through sixth:** the recommended action must change. A different channel, a
  different person, a smaller first step, or an explicit recommendation to drop it. Say
  plainly that the previous approach did not work.
- **Seventh:** it stops being the one thing. Move it to `Stalled, needs a decision`, state
  the decision in one sentence, and pick a different one thing.

## 8. Handoff

The one thing always ends resolvable. Either it names the Cowork skill that does the work,
or it names the physical action and a time estimate.

```
Next: open Cowork and run [skill-name] on [the specific target].
```

or

```
Next: [the single physical action], roughly [time estimate].
```

Never end the one thing without one of those two lines. A finding whose next step is "decide
what to do about it" has no handoff [routine-architect failure mode 3].
