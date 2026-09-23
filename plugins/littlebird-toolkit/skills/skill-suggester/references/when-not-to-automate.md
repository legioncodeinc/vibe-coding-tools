# When not to automate

Ten reasons to recommend skip. A suggester that recommends building everything is a bad
advisor, and the reasons below are what make a build recommendation mean something.

**Check every candidate against all ten before it is ranked as a build.** One hit is enough
to change the recommendation to skip, and the reason gets named in the report. A skip with a
stated reason is a finding, and it prevents the next run from rediscovering and re-proposing
the same thing.

---

## The argument this list rests on

The naive inference is: it repeats, therefore automate it. That inference is incomplete, and
the reason is 43 years old and still the clearest statement of the problem.

Quoted: "the designer who tries to eliminate the operator still leaves the operator to do the
tasks which the designer cannot think how to automate"
[references/research/distilled-automation-opportunity-identification.md section 8.1]. The
stated consequence is that the operator is left with an arbitrary collection of tasks, with
little thought given to supporting them [same section].

**Automating the mechanical portion of a task does not leave a smaller version of the same
task. It leaves the part that resisted automation** [distilled section 8.1]. That residue is
by construction the harder part, and it now has to be done without the run-up the mechanical
part used to provide.

The scope caveat, stated because it is in the source: the paper is about industrial process
control, and transfer to knowledge work is by analogy rather than measurement. It is
strongest for the residual task problem and the monitoring paradox, weakest for physical
skill decay [distilled section 8.4].

---

## Reason 1. Below the threshold

Fewer than three occurrences in 90 days, or fewer than four in 180.

Record it in a watchlist section rather than deleting it, with its count, so that if it
recurs the count is already established. Do not propose it. See
`references/threshold-and-ranking.md`.

**Related sub-case: the count is real but the pattern is stale.** Four occurrences, the most
recent four months ago. That is a completed project, not a recurring workflow. Watchlist.

---

## Reason 2. Too variable

The occurrences differ enough that no fixed procedure covers them.

Two independent sources land on this. The candidate checklist excludes tasks requiring
decision-making or adaptation, and tasks where most transactions need human intuition, and
states that human judgment and nuance are the key limitation
[distilled section 6]. The failure literature names automating a process with a high exception
rate, given there as exceeding 40 percent, as a distinct cause of failure
[distilled section 7]. That 40 percent figure is a vendor heuristic and not a measured
threshold, and the direction is the usable part rather than the number.

**How to test it against the capture.** Compare the deduplicated step sequences across
occurrences. If the shared spine is shorter than half of the longest occurrence, it is too
variable. Note that the detector itself will mislead you here: one deviation in the middle of
an otherwise identical sequence causes the detector to see two short patterns instead of one
[distilled section 4]. So check whether the variation is real or an artifact of fragmentation
before concluding either way.

---

## Reason 3. Not stable yet

The tool, the process or the format changed inside the observation window.

The candidate criteria want a process that is stable and does not change often
[distilled section 5]. The failure literature is blunter: post-implementation maintenance is
underestimated, and processes, interfaces and data formats change regularly, requiring
continuous planning and testing [distilled section 7].

**What this looks like in capture.** The same task performed through a different application
in the third occurrence than in the first. A form with different fields. A report with a
changed column set. Any of those means the thing being automated is still moving.

Recommendation: watchlist, with a note to reassess after two more occurrences on the same
shape.

---

## Reason 4. About to become obsolete

The work is ending, whether or not the pattern is real.

Look for it explicitly rather than waiting for it to appear:

- A migration or replacement of the system involved, visible in capture.
- A client, engagement or contract with a visible end date.
- Seasonal work whose season is closing.
- A team change that moves the work to someone else.

This one is cheap to check and expensive to miss, because a skill built for a workflow that
ends next month costs the full build and returns nothing.

---

## Reason 5. The judgment is the work

The repeated part is the shell, and everything that matters happens inside it.

This is reason 1 in the argument above, applied. The candidate criteria's exclusion for tasks
needing human intuition is the same point from the practitioner side
[distilled section 6].

**The test.** Ask what would be left after the automation. If the answer is "the hard part,
with less context than before", skip it and say why. If the honest answer is that the shell
still costs real steps and the judgment is unaffected, it is a build.

Signature 4 in `references/pattern-signatures.md` is the one most exposed to this. A monthly
report with identical headings can be five minutes of formatting or three hours of analysis,
and the snapshots look similar either way. Any claim about where the effort went inside a
rebuilt artifact is Low confidence unless the user says otherwise.

---

## Reason 6. A skill is the wrong artifact

The pattern is real and the answer is something else.

| The pattern | The better artifact |
|---|---|
| A procedure someone else could perform | A written SOP. Route to `sop-forge` |
| The same question answered for different people | A document, an FAQ, or a canned reply |
| A recurring watch for a condition | A routine. Route to `routine-architect` |
| The same text sent repeatedly with small edits | A template or a snippet |
| The same retrieval run repeatedly | A saved search or a saved view in the tool itself |
| One step of a longer task | An extension to whatever already covers the rest |

Signature 5, the re-answered question, lands here most of the time. Say so rather than
proposing a skill that will be used once.

---

## Reason 7. Something already covers it

The dedupe pass found an existing skill, or an existing routine, that does this.

This is its own guide because it is the highest-frequency skip reason and the one that most
damages credibility when missed. See `references/dedupe-against-existing-skills.md`. The
subcase worth repeating here: a skill that exists and is not firing is a triggering problem,
and the fix is a description rewrite, not a new skill.

---

## Reason 8. The process should be fixed before it is automated

The pattern is real, and it exists because something upstream is broken.

The failure literature names this directly: organizations automate the wrong process, or a
non-optimized one, rather than optimizing it first [distilled section 7]. Automating a bad
process makes the bad process faster and harder to see.

**What it looks like in capture.** Manual data movement between two systems that have an
integration available. A report rebuilt monthly because nobody has permissions on the tool
that generates it. A question answered repeatedly because the answer is not written anywhere
public.

The recommendation in these cases is the upstream fix, with the automation named as a
fallback if the fix is not available. Say which one is the recommendation.

---

## Reason 9. The output would need checking anyway

If the user must verify every result, the automation saves the doing and adds the checking.

This is the measured version of the monitoring paradox. Quoted: "the automatic control system
has been put in because it can do the job better than the operator, but yet the operator is
being asked to monitor that it is working effectively" [distilled section 8.2], and
Bainbridge's judgment is that the monitor has been given an impossible task [same section].

Then the part that turns it from a warning into a design rule. Automation complacency is
reduced monitoring vigilance, and it occurs specifically under conditions of multiple-task
load, when manual tasks compete with the automated task for attention
[distilled section 8.5]. Automation bias produces both omission and commission errors when
decision aids are imperfect, and omission errors are the harder class because nothing appears
in the output to inspect [same section]. Both occur across expertise levels and both resist
simple training interventions [same section].

**So "the user will check it" is not a mitigation.** The review says the checking degrades,
predictably, in exactly the conditions this user works under. If the proposal's safety
depends on sustained vigilance, the proposal is unsafe.

Two ways a candidate passes this test rather than failing it:

- The output is **verifiable at a glance**, so checking is cheap and does not depend on
  vigilance.
- The output is **not consequential if wrong**, because it is a draft that a human turns into
  the real thing.

The second is the shape most skills in this marketplace take, which is not an accident.

---

## Reason 10. Designer error would become systematic

The task has a failure mode that is currently caught by the person doing it noticing
something looks off.

Quoted: "designer errors can be a major source of operating problems"
[distilled section 8.3]. A wrong model of the task, once automated, produces the same wrong
output every time rather than occasionally.

**How to spot the candidate this applies to.** Look in the capture for occurrences where the
user did something different from the other occurrences: a correction, a backtrack, an extra
verification step, an error dialog. Those are the moments the human's presence was doing
work. A proposal that does not account for them is a proposal to remove the only thing
catching that class of error.

If the exception handling is visible in the capture, it belongs in the drafted skill as an
explicit branch. If it is not visible, that is a gap and the proposal says so.

---

## How to write a skip

A skip recommendation carries four things, in this order.

1. **The pattern**, with its recurrence count and dates.
2. **The reason number and its name**, from this list.
3. **The evidence for the skip**, with a receipt where the capture supports it.
4. **What to do instead**, if anything. A skip with an alternative is more useful than a skip
   alone, and most of these reasons have one.

Keep skips in the report. They are half the output. A ranked list of three builds with no
skips visible tells the user nothing about the judgment that produced it, and the judgment is
what they are actually buying.

---

## The count that matters

If a run produces three builds and no skips, that is a signal to re-check the ten reasons
rather than a signal that the month was unusually productive. The base rate in the failure
literature does not support a world where most candidates are good ones: the most-cited
figure is that 30 to 50 percent of automation projects initially fail
[distilled section 7], and that figure carries a low-confidence label because it is a vendor
page citing a consultancy with no linked methodology, no sample size, and no definition of
what counts as failing [same section]. Report it that way if you report it at all, and never
as "studies show".
