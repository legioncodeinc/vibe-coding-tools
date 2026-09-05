# Top three selection: a method, not a vibe

The top three is the decision hook. Without it the scorecard is a set of counts, and a set of
counts nobody acts on is the named reason these systems get abandoned: what gets implemented
"isn't the Balanced Scorecard, but a limited performance measurement framework", and the
dashboard failure named first is that it "shows data but doesn't tell the viewer what to do
when a number looks wrong" [research/distilled-weekly-review-design.md, section 7].

So the top three carries the whole report. It has to be selected, not sensed.

---

## 1. Why it cannot be the three loudest items

The relevant finding is sharp. Across five experiments with the normative reasons controlled
for, "people are more likely to perform unimportant tasks (i.e., tasks with objectively lower
payoffs) over important tasks (i.e., tasks with objectively better payoffs), when the
unimportant tasks are characterized merely by spurious urgency"
[research/distilled-weekly-review-design.md, section 8]. The behavior violates dominance, and
"pursuing an urgent task has its own appeal, independent of its objective consequence"
[research/distilled-weekly-review-design.md, section 8].

Three consequences, and they are the design of the scorer:

1. **Urgency is discounted, not weighted equally.** The reader already over-weights it. A
   scorer that weighs urgency and consequence equally reproduces the bias with arithmetic
   attached and launders it as a method.
2. **Spurious urgency is filtered before scoring, not penalized during it.** An item whose
   urgency comes from tone rather than a date does not enter the pool with a low urgency
   score. It enters with zero urgency.
3. **Consequence appears in the shown reasoning.** Reasoning that names only a deadline hands
   the bias straight back.

## 2. Candidate pool

Built only from what the run already retrieved. **Never invent a candidate.** Sources, in
order:

| Source | Candidate form |
|---|---|
| Commitments open past their date | The specific overdue item |
| Commitments dropped this week | The decision to re-commit or formally kill it |
| Money: renewal decision deadline inside 14 days | The cancel-or-keep decision |
| Money: an invoice that crossed an aging bucket | The specific chase |
| Leads captured with no next step recorded | The specific follow-up, named person |
| Projects with a band or stage change against them | The specific corrective |
| Last week's top three, unresolved | Carried forward, see section 5 |
| A trend or shift that fired unfavourably | The change of approach that the rule licenses |

Not eligible: anything whose only evidence is one retrieval result scored 3, one OCR
fragment, or a document that was on screen. Capture shows what the user was viewing, not what
they wrote [evidence-standards.md, rule 4; littlebird-mcp-reference.md]. A Low-confidence
claim never becomes a top-three item [evidence-standards.md, rule 3].

## 3. The three factors, and their weights

Every candidate is scored on three factors. The weights are deliberate and unequal.

### Consequence, weight 3

**What one more week of not doing this actually costs, stated in the record's own terms.**

| Points | Test |
|---|---|
| 3 | Money leaves, a client relationship materially degrades, or a legal or contractual obligation lapses |
| 2 | A named person stays blocked, or a decision that other work depends on stays unmade |
| 1 | Work accumulates but nothing external changes |
| 0 | Nothing observable changes in a week |

Consequence is the heaviest factor because it is the one the reader systematically
under-weights [research/distilled-weekly-review-design.md, section 8].

**Consequence is stated from the record, not projected.** "The renewal charges on the 3rd at
2,400 per year" is consequence. "This could snowball" is not.

### Urgency, weight 2

**Only from a real date attached to a real source.**

| Points | Test |
|---|---|
| 2 | A hard date inside the next 7 days, from a document, invoice, calendar entry, contract or meeting commitment |
| 1 | A hard date inside the next 30 days, same sourcing |
| 0 | Everything else, including every item whose urgency is somebody's adjective |

**The filter runs before the scorer.** An item with no dated source gets 0 and is not argued
about. "ASAP" from a vendor, a countdown in a marketing email, a colleague's exclamation mark,
and the model's own sense that something feels pressing are all 0.

An item can reach the top three on consequence alone with urgency 0. That is the intended
behavior and it is the entire reason the weights are 3 and 2 rather than equal.

### Carry, weight 2

**How long this has been on the list.**

| Points | Test |
|---|---|
| 3 | In the top three for 3 or more consecutive weeks. Triggers section 5. |
| 2 | In the top three for 2 consecutive weeks |
| 1 | Named anywhere in a prior report but never in the top three |
| 0 | New this week |

Carry is weighted at 2, equal to urgency and below consequence. It has to count for something,
because an item that keeps surfacing and never gets done is telling the reader something. It
must not dominate, because a carry-dominant scorer produces the same three items forever,
which is the failure this skill is required to surface about itself.

### The score

```
score = 3 * consequence + 2 * urgency + 2 * carry
```

Maximum 19. Rank descending, take three.

## 4. Tie-breaks, in order

Applied only to a genuine tie on total score.

1. **Higher consequence wins.** Always, before anything else.
2. **The one a named person is blocked on wins.** Someone else's week is at stake.
3. **The one that is smaller wins.** Between two otherwise equal items, the one that fits in a
   single working session gets picked, because the one that does not will still be here in
   three weeks and will then trigger section 5 anyway.
4. **The older carry wins.**
5. **Where all four are equal, take the first in retrieval order and say the tie-break was
   arbitrary.** Do not invent a distinction to make the pick look principled.

## 5. The carried-item rule

**Any item that has appeared in the top three for three consecutive weeks is named as carried
and is either escalated or explicitly dropped. It does not silently appear a fourth time in
the same form.**

This is a hard rule, not a preference. A routine that does not read its own past reports
repeats itself indefinitely; observed in production, a well-written daily routine flagged the
identical number-one item four days running with no change in approach because nothing told it
to escalate [littlebird-mcp-reference.md].

### The escalate-or-drop block

At three consecutive weeks, the item leaves the ordinary top-three format and prints as:

```
CARRIED, WEEK 3: [item]
  Tried so far: [what the past three reports show was attempted, from the reports themselves]
  The approach is not working. Choose one:
    ESCALATE: [a specifically different tactic, named]
    DROP:     [what is given up, stated plainly, and who needs to be told]
```

Rules for the block:

- **The escalation must be a different kind of action, not a louder version of the same one.**
  A different channel, a different person, a smaller first step, buying the outcome, or
  changing what counts as done. "Follow up again" is not an escalation.
- **The drop names the cost.** What is actually given up, and who has to be told. A drop with
  no named cost is a soft delete and the item will be back in two weeks.
- **The block cites its own history.** What was tried comes from the past reports read at the
  start of the run, not from imagination.
- **At four consecutive weeks with no resolution, the item is dropped by default** and printed
  as `DROPPED BY DEFAULT AT WEEK 4: [item]. Reinstate it deliberately if it still matters.`
  The scorecard is not allowed to carry an item forever while reporting that it is carrying it.

### The self-diagnosis

**A top three that is the same three every week is a failure signal about the skill, and the
skill surfaces it about itself.** When two or more of this week's three were also in last
week's three, print one line:

```
Selection note: [N] of 3 carried from last week. If this holds again, the top three has
stopped selecting and is just restating the backlog.
```

At three consecutive weeks with two or more carried, print instead:

```
Selection note: the top three has not turned over in three weeks. That is a signal about
this report, not just about the work. Run routine-architect on this routine.
```

## 6. Why three, stated honestly

**The archive does not support three.** The nearest evidence argues for **one**: dashboard
practice recommends one primary decision per audience segment
[research/distilled-weekly-review-design.md, section 7]. And section 12 of the distillation
names the absence directly: no evidence for three as the right size of a priority list.

Three is a product decision. The reasoning, stated as reasoning rather than as evidence:

- A weekly horizon contains multiple independent domains in this scorecard, commitments,
  money, leads, content, projects, and a list of one systematically starves four of them.
- Three is small enough to remain a selection. At five the mere-urgency pressure returns,
  because a list long enough to hold everything urgent no longer forces the consequence
  comparison [research/distilled-weekly-review-design.md, section 8].
- Three items produce a legible carry signal. One item makes carry invisible; five make it
  ambiguous.

**Say this in the skill rather than implying evidence exists.** If the user asks why three,
the honest answer is that it is a judgment and the closest research argues for fewer.

## 7. Output shape

Each of the three is exactly four lines. No more.

```
1. [The action, imperative, one clause, specific enough to start]
   Because: [the consequence in the record's own terms, with a receipt]
   By: [the date, with its source] or [no external date; chosen on consequence]
   Beat: [the runner-up], because [the one comparison that decided it]
```

**The Beat line is mandatory.** An unexplained pick gets ignored, and a top three with no
visible reasoning is indistinguishable from three items picked at random, which means the
reader has no basis for overriding it. Overriding it is a legitimate thing for the reader to
do and the report should make it possible.

**The Because line must state consequence, not urgency.** If the only thing it can say is that
something is due, the item was selected on urgency alone and it should be re-examined against
the pool [research/distilled-weekly-review-design.md, section 8].

Worked example:

```
1. Answer the Acme SOC 2 questionnaire and send it to Priya.
   Because: their security review is the last gate on a signed renewal, and it has been
   blocked on us since the 5th [from Commitment tracker, 2026-08-16] (exact)
   By: 2026-08-22, the date Priya gave in the 2026-08-05 call [Acme renewal call,
   2026-08-05, Action Items]
   Beat: chasing the Delacroix invoice, because that is one aging bucket away from a
   collections decision while this is one week away from a lost renewal.
```

## 8. When there is no defensible top three

Two cases, and neither of them pads.

**Fewer than three qualify.** Print the ones that do and say so:

```
Only 2 items qualified this week. Nothing else in the record had a consequence above zero.
```

Do not promote a zero-consequence item to fill the slot. A padded third item teaches the
reader that the list is a template rather than a selection, and after that the first two stop
being read too.

**None qualify.** Print:

```
No item this week had a consequence above zero and no dated obligation falls inside 30 days.
Nothing is being recommended. That is a real answer for a quiet week.
```

Then stop. Manufacturing a priority to justify the report existing is the same failure as
manufacturing a win [honest-scorekeeping.md, section 3].
