# Honest scorekeeping: the skill must be willing to report a bad week

**This is the single most likely way `weekly-review` fails.** Not a retrieval bug, not a
formatting problem. A review that always finds something positive is worthless within a
month, and every incentive inside a generative model pushes toward finding one. The model is
writing to a person about that person, and the softening happens in the last sentence of every
section, invisibly, one hedge at a time.

The equal and opposite failure is manufactured crisis. A review that always finds something
alarming is worthless on the same timescale and for the same reason: the reader learns the
report's tone carries no information about their week.

This file encodes both prohibitions and takes a position on the neutral-versus-motivating
question.

---

## 1. The position: neither neutral nor motivating, because that is the wrong axis

The evidence on delivering performance information to a person is the best-established thing
in the archive and it does not answer the question as posed. Feedback interventions improved
performance on average, d = .41, but over a third of the measured effects, 38 percent of 607,
made performance worse [research/distilled-weekly-review-design.md, section 4].

The mechanism is where attention lands. Effects are attenuated by cues that direct attention
to the self, and improve when attention stays at the task level. The critical variable is not
the content of the feedback but what the recipient attends to
[research/distilled-weekly-review-design.md, section 4].

**So the axis that matters is task versus self, not harsh versus kind.** A praising review and
a critical review are the same failure when both are verdicts on the person. The position this
skill takes:

> Report what happened to the work. Never issue a verdict on the reader.

Supported from two other directions. An author of the self-assessment synthesis: "As a society
we make the wrong trade-off by thinking that boosting self-esteem is going to boost
performance" [research/distilled-weekly-review-design.md, section 4]. And scorecard practice
reports that measurement bias undermines engagement once the system becomes an administrative
judgment [research/distilled-weekly-review-design.md, section 7].

### What that looks like in sentences

| Banned, self-level | Required, task-level |
|---|---|
| "Strong week." | "Nine of eleven commitments closed. Closure rate above the 12-week median." |
| "A tough week, but you are building momentum." | "Three of eleven closed. Two dropped past their date. Closure rate at a 12-week low." |
| "You are getting better at follow-through." | "Closure rate has risen for five consecutive weeks. Trend rule fired." |
| "You let this one slip." | "The Acme SOC 2 answer passed its date on the 12th and has no observed response." |
| "Great job on the content." | "Three items shipped: [names and dates]." |

The right-hand column is not colder. It is more useful, and it is the version that survives
being wrong, because a reader can check it.

## 2. No manufactured wins

**A win goes in the scorecard only if it is a countable event with a receipt.** Shipped,
closed, paid, signed, booked, published. Something a third party could verify.

Six banned moves, each of which is a way a win gets manufactured:

1. **Reframing a dropped commitment as a learning.** Explicitly banned. A dropped commitment
   goes in the dropped column with its date and stays there. This is the move the retrospective
   Prime Directive invites when it is ported naively to one person, since "everyone did the best
   job he or she could, given what was known at the time" is one step from an excuse
   [research/distilled-weekly-review-design.md, section 10].
2. **Counting effort as output.** Time spent on a project is not progress on it. Hours in
   meetings is a cost line, not an achievement line, and it appears in the scorecard as a cost.
3. **Counting a draft as shipped.** A composer window on screen is evidence of writing, not of
   publishing [evidence-standards.md, rule 4].
4. **Counting a plan as a result.** "Decided to focus on X" is a decision, and decisions belong
   in the projects section, not the wins.
5. **Promoting a small real win to headline position on a bad week to balance the tone.**
   Ordering is set by what the series says [trend-construction.md, section 5], not by mood
   management.
6. **The compensating clause.** Any sentence of the form "but" or "on the positive side"
   appended to a negative finding to soften it. Negative findings end at their receipt.

**The empirical reason this section exists.** People "tend to emphasize strengths while
downplaying weaknesses", which is one of the named reasons self-insight is only moderate,
r = .29 across 22 meta-analyses [research/distilled-weekly-review-design.md, section 3]. A
self-review that grades itself and always finds a win is that bias with a machine doing the
work.

**What is not banned.** Recording real progress. Progress on meaningful work was the top
driver of positive inner work life in a study of 238 people across 26 teams and over 12,000
diary entries, and "Even small wins can boost inner work life tremendously"
[research/distilled-weekly-review-design.md, sections 1 and 5]. Real wins are load-bearing and
a report that suppresses them to seem rigorous is failing in the other direction. The rule is
about manufacture, not about mention.

## 3. No manufactured crisis

Symmetric, and equally binding.

1. **A flat week is reported as flat.** Not as stagnation, not as drift, not as a warning
   sign. Flat is the most common shape a week takes.
2. **A single bad week is common cause until the series says otherwise.** There is "a
   temptation to react to an extreme outcome and to see it as significant, even where its
   causes are common" [research/distilled-weekly-review-design.md, section 6]. One low closure
   week is noise. Five consecutive falls is a trend, and only then does the report say so.
3. **No urgency without a date from a real source.** Sender adjectives are not deadlines.
   Urgency that comes from someone's tone is precisely the stimulus that makes people work on
   objectively worse tasks [research/distilled-weekly-review-design.md, section 8].
4. **No compounding.** Three unrelated mild findings do not become a pattern by being listed
   together. If the report wants to claim a pattern it names the rule that fired.
5. **No stakes inflation.** The consequence stated for an item is the consequence observable in
   the record, not the worst plausible downstream outcome.

## 4. The plain statement when the week was poor

Required. Not optional, not softened, and it goes at the top.

The exact shape:

```
This was a poor week on [the named measure]. [The number, with its series context.]
[One sentence naming what specifically did not happen, with receipts.]
```

Worked example:

```
This was a poor week on commitments. 3 of 11 closed, 27%, against a 12-week median of 74%,
and it is the lowest measured week in the series. Two items passed their dates with no
observed response: the Acme SOC 2 answer, due the 12th [from Commitment tracker, 2026-08-16],
and the Delacroix scope revision, due the 14th [same].
```

Note what is absent: no cause, no encouragement, no cushioning clause, no "but". Note what is
present: the number, the series context, the named items, the receipts. Every sentence is
about the work.

**The trigger for this block.** Print it when any of the following holds:

- A rate field sits at its lowest measured value across the read history and there are at
  least four points.
- Two or more commitments passed their dates with no observed response.
- A trend rule fired in the unfavourable direction on any rate field.

**And the countermeasure against the block itself becoming ritual.** If this block has printed
three weeks running, the fourth week does not print it again in the same form. Instead the
report escalates: it names that the measure has been poor for four weeks, states that the
weekly report is no longer telling the reader anything new, and recommends a change of
approach or an explicit decision to accept the level. A report that says the same bad thing
every week is as useless as one that says the same good thing.

## 5. Blameless about the person, exact about the record

The Prime Directive says "Regardless of what we discover, we must understand and truly believe
that everyone did the best job he or she could, given what was known at the time, his or her
skills and abilities, the resources available, and the situation at hand"
[research/distilled-weekly-review-design.md, section 10].

Its mechanism is removing fear of blame so that facts can surface in front of colleagues. In a
solo review there are no colleagues, the mechanism has no job to do, and the wording becomes
an excuse generator [research/distilled-weekly-review-design.md, section 10].

**The synthesis this skill adopts, and it is a synthesis rather than a sourced claim:** keep
the blamelessness about the person, refuse it about the record. Blameless means the report
does not speculate about why the person failed, does not attribute failure to character, and
does not moralize. Exact means the number is the number, the dropped item is dropped, and
nothing gets reclassified to make the record kinder.

The two halves are the same rule seen twice: keep attention on the work, which is what the
feedback evidence says separates useful from harmful
[research/distilled-weekly-review-design.md, section 4].

## 6. Timing: the position on Friday afternoon versus Sunday evening

**Default: Friday, late afternoon. Sunday evening supported, offered, and second choice.**

The practice literature offers three slots with no evidence behind any of them and then says
consistency matters more than which one [research/distilled-weekly-review-design.md,
section 9]. So the decision has to come from elsewhere.

**The case against Sunday evening, which is why it is not the default.**

Psychological detachment from work during nonwork time is a core recovery experience, and
interventions can improve it, particularly detachment on evenings and weekends. Boundary
management is the strongest lever by a wide margin: d = 0.65 for interventions with a
boundary-management component against d = 0.25 without, from a meta-analysis of 34
interventions with an overall d = 0.36 [research/distilled-weekly-review-design.md,
section 9].

A scheduled, notified Sunday-evening work scorecard is boundary management run backwards. It
installs a recurring work stimulus at the end of the recovery window, by design, every week.

The recovery paradox makes it worse specifically for **this** skill. Job stressors call for
recovery while producing the states that make recovery less likely, and perceiving that one
has performed well is associated with higher detachment and relaxation in the evening
[research/distilled-weekly-review-design.md, section 9]. Section 4 of this file requires the
report to sometimes state plainly that the week was poor. Sunday evening delivers that
statement to a reader whose capacity to detach afterwards is already lowest. The honesty
requirement and the Sunday slot are in direct tension, and the honesty requirement is not
negotiable.

**The case for Sunday evening, which is why it stays supported.**

Not detaching predicts positive affect when the work thinking is positive or takes the form of
problem-solving rumination, and very high detachment may itself undermine performance
[research/distilled-weekly-review-design.md, section 9]. A bounded review that ends in three
concrete decisions is closer to problem solving than to rumination. And Sunday evening is
genuinely reflective in a way Friday is not: the week is finished, and the next one has not
started.

**Why Friday wins anyway.** The strongest objection to Friday is that it is still inside the
work week and Friday-afternoon judgment is tired. That objection largely dissolves here,
because **the generator is a routine, not the person.** The machine has no Friday afternoon.
It runs at 16:30, retrieves a completed week's worth of sibling reports, and writes. The human
reads whenever they choose, including Monday morning, and the report is the same either way.
The boundary-management effect size is the largest number available on this question and it
points one way.

**What the skill does about it.** Offer both, with the tradeoff stated in the user's own terms
rather than in effect sizes, and set whichever they choose. Do not argue past one answer.

**And in either case, bound the report hard.** The recovery literature's distinction is between
problem-solving thinking and open-ended rumination. A short report that ends in three decisions
is the first. An open-ended reflective prompt at the end of the weekend is the second. That is
the real reason for the length ceiling, and it applies more strongly on Sunday.

**Caveat that must not be dropped.** None of this literature studied a weekly review artifact.
Every step above is a transfer from general recovery research to a product decision, and
long-term benefits of recovery are weaker than short-term gains in that literature anyway
[research/distilled-weekly-review-design.md, section 9]. This is a defensible position, not a
finding.

## 7. How to tell whether the scorecard is working

Three failure signatures, each with a threshold, each detectable by the routine reading its
own history.

| Signature | Threshold | What it means | What the report does |
|---|---|---|---|
| **Never a bad week** | Eight consecutive reports with no poor-week block and no trend firing unfavourably | Manufactured wins. The most likely failure. | Print one line naming it and stating the scorecard may be softening. |
| **Never a good week** | Eight consecutive reports whose leading section is negative | Manufactured crisis. | Same, in the other direction. |
| **Same top three** | Any item in the top three for three consecutive weeks | The selection method has stopped selecting | Escalate or drop, per `top-three-selection.md` |

The first two are the skill grading its own instrument, which it is allowed to do about
itself. It is not allowed to grade sibling routines that way; that is `routine-architect`'s
job.

**The honest floor.** Real quarters contain good weeks and bad weeks and mostly ordinary
weeks. A twelve-week series in which every week reads the same way is evidence about the
report, not about the person.
