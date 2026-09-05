# Distilled: commitment tracking and follow-through

Written from a fresh read of `raw/` on 2026-08-17. Every claim below ends in a bracketed
citation to the raw file it came from. Nothing here is written from training data. Where
the archive is thin or the sources disagree, that is stated rather than smoothed.

Twelve sources archived. Split by type: four academic, two official-docs, three
vendor-blog, one practitioner press, one large-sample vendor research report, and one
low-trust community blog archived specifically as a negative finding.

---

## 1. The number everybody quotes does not exist

The obvious opening statistic for a commitment tracker is some version of "N percent of
meeting action items are never completed." That number is not available from any
checkable source found in this sweep.

| Circulating claim | Sourcing status |
|---|---|
| 70 percent of decisions forgotten without follow-up | no source cited [raw/meetings--unsourced-stats--meetingtoll-2026.md] |
| 24-hour follow-ups raise task recall up to 80 percent | no source cited [raw/meetings--unsourced-stats--meetingtoll-2026.md] |
| Teams with prompt follow-ups complete 36 percent more items on time | no source cited [raw/meetings--unsourced-stats--meetingtoll-2026.md] |
| Standardized follow-up protocols cut miscommunication up to 50 percent | no source cited [raw/meetings--unsourced-stats--meetingtoll-2026.md] |
| Written goals plus weekly accountability raise achievement to 76 percent | numbers not present on the primary source page [raw/commitment--accountability--matthews-dominican-2007.md] |

The only attributed idea in that stack is the Ebbinghaus forgetting curve, which measured
recall of nonsense syllables and is being stretched to cover organizational follow-through
[raw/meetings--unsourced-stats--meetingtoll-2026.md].

**Consequence for the skill.** Do not open a report with a completion-rate statistic. The
only completion rate the skill is entitled to quote is the one it computed from the user's
own harvested ledger, which has receipts.

## 2. What IS well evidenced: intention alone is a weak predictor

This is the load-bearing research finding, and it is solid.

| Finding | Value | Source |
|---|---|---|
| Goal intentions explain variance in behavior | 28 percent, across 422 studies | [raw/commitment--implementation-intentions--gollwitzer-sheeran-meta-2006.md] |
| Experimentally changing goal intentions alone | R2 = .03, small to medium | [raw/commitment--implementation-intentions--gollwitzer-sheeran-meta-2006.md] |
| Implementation intentions on goal attainment | d = .65 across 94 studies | [raw/commitment--implementation-intentions--gollwitzer-sheeran-meta-2006.md] |
| Same, getting-started problems | d = .61 | [raw/commitment--implementation-intentions--gollwitzer-sheeran-meta-2006.md] |
| Same, getting-derailed problems | d = .77 | [raw/commitment--implementation-intentions--gollwitzer-sheeran-meta-2006.md] |

The active ingredient is the conditional structure "If situation Y occurs, then I will
initiate goal-directed response Z", and the reported mechanisms are cue accessibility (the
situation becomes highly activated and therefore noticeable) and strategic automaticity
(no deliberation needed at the moment of action)
[raw/commitment--implementation-intentions--gollwitzer-sheeran-meta-2006.md].

**Consequence for the skill.** A commitment spoken in a meeting and never written down is
a bare goal intention. The ledger's job is to supply the missing cue, not to apply
pressure.

### Conflict: how big is the planning effect

The two meta-analyses disagree in magnitude.

| Source | Construct | Effect | Studies | N |
|---|---|---|---|---|
| Gollwitzer and Sheeran 2006 | implementation intentions | d = .65 | 94 | not stated on the accessible pages |
| Frontiers 2021 | mental contrasting with implementation intentions | g = 0.336 | 24 | 15,907 |

[raw/commitment--implementation-intentions--gollwitzer-sheeran-meta-2006.md],
[raw/commitment--mcii--frontiers-meta-2021.md]

**Both readings stand.** They measure related but non-identical constructs, and the more
recent review is larger and includes weaker, self-administered arms. **Preferred reading
for this skill: the smaller figure**, because the moderator analysis in the 2021 review is
the one that maps onto what commitment-tracker actually is. Face-to-face delivery scored
g = 0.465 while document-based self-administered delivery scored g = 0.277
[raw/commitment--mcii--frontiers-meta-2021.md]. A generated ledger is a document. Claim
the smaller effect and design against the weakness.

That same review names boundary conditions: the technique failed in collectivist cultures
for individual goals, and "low-quality strategies emerged when participants self-designed
plans in unsupervised contexts" [raw/commitment--mcii--frontiers-meta-2021.md].

## 3. The two-column ledger is GTD's Next Actions plus Waiting For

The official GTD Weekly Review checklist contains two items that are the entire premise of
this skill, and they are the two people skip:

- "Review Previous Calendar Data ... for remaining action items, reference data, etc., and
  transfer into the active system"
- "Review Waiting For List. Record appropriate actions for any needed follow-up. Check off
  received ones"

[raw/gtd--weekly-review--gtd-checklist-pdf.md]

The Waiting For list is a first-class list in the method, not a footnote on the to-do list
[raw/gtd--weekly-review--gtd-checklist-pdf.md]. Also from the checklist: every project
should have at least one active next action, and the review sequence runs Get Clear, Get
Current, Get Creative [raw/gtd--weekly-review--gtd-checklist-pdf.md].

The five-step method is Capture, Clarify, Organize, Reflect, Engage
[raw/gtd--five-steps--gtd-official.md]. Littlebird already performed Capture, and the
meeting summary performed most of Clarify by emitting Action Items with owners. The skill
starts at Organize [raw/gtd--five-steps--gtd-official.md].

**Consequence for the skill.** Weekly is the method's own prescribed cadence, so the
weekly routine is not an arbitrary choice. And the owed-to-me column is not an invention;
it is a named list in a forty-year-old method that nobody maintains by hand.

## 4. Why owner attribution must come from the summary, never the transcript

This is the hardest design rule in the skill and it is quantitatively grounded.

| Pipeline stage | Error rate | Source |
|---|---|---|
| ASR, clean read-aloud audio | below 3 percent WER | [raw/ai-extraction--pipeline-accuracy--circleback-2026.md] |
| ASR, close-talk meeting recording | about 12 percent WER (WhisperX benchmark) | [raw/ai-extraction--pipeline-accuracy--circleback-2026.md] |
| ASR, far-field single room mic | above 35 percent WER | [raw/ai-extraction--pipeline-accuracy--circleback-2026.md] |
| Speaker diarization, state of the art | 11 to 13 percent error | [raw/ai-extraction--pipeline-accuracy--circleback-2026.md] |

The dominant cause of diarization error is crosstalk, and accuracy drops substantially
when two people speak at once [raw/ai-extraction--pipeline-accuracy--circleback-2026.md].
The vendor states the exact consequence: "If the system assigns your comment to a
colleague, and that comment contains a commitment, the resulting action item gets
attributed to the wrong person" [raw/ai-extraction--pipeline-accuracy--circleback-2026.md].
Errors also compound down the pipeline: a mis-heard word is inherited by the summary
[raw/ai-extraction--pipeline-accuracy--circleback-2026.md].

On extraction maturity specifically: the stage is "less mature than it appears", there is
"a lack of techniques as well as metrics for evaluating these techniques", and there is
"no widely accepted benchmark for measuring how reliably AI identifies tasks, owners, and
deadlines" [raw/ai-extraction--pipeline-accuracy--circleback-2026.md].

**Consequence for the skill.** An 11 to 13 percent diarization error rate is the number
behind the hard rule. Raw transcript chunks are the layer where that error lives, and the
Littlebird reference independently records that those chunks are weakly diarized and
frequently tagged `[Others]` (see `../littlebird-mcp-reference.md`). Take
attribution from the summary's Action Items and Decisions blocks. Quote raw transcript for
wording only. And because no benchmark exists, never claim the harvest is complete.

## 5. Known failure modes of automated action-item extraction

What extracts reliably [raw/ai-extraction--failure-modes--onplana-2026.md]:

1. Explicit commitments with a named owner and a deadline
2. Decisions that carry an explicit follow-on action
3. Recurring items in a meeting series, once the pattern is established

What fails reliably [raw/ai-extraction--failure-modes--onplana-2026.md]:

| Failure | Description |
|---|---|
| Implicit action items | Nothing is extracted from a follow-up nobody said out loud. "Implicit actions are often the consequential ones." |
| Group commitments | A task given to a team yields "an extracted task with no specific owner, no clear assignee, and no accountability." |
| Deadline ambiguity | "Early next week" needs external context; generic tools produce imprecise dates. |
| Context-dependent shorthand | "Update the tracker" is opaque without project knowledge. |

The recommended control is a per-item human gate: "The PM accepts, rejects, or edits each
item in thirty to sixty seconds" before task creation, with a stated trustworthiness
threshold of a miss rate at or below 10 percent on explicit items
[raw/ai-extraction--failure-modes--onplana-2026.md].

**Consequence for the skill.** The `Unassigned` tag in a Littlebird summary is the
documented signature of the group-commitment failure, not noise
[raw/ai-extraction--failure-modes--onplana-2026.md]. Surface those items for the user to
claim or discard. Never infer an owner for them. The thirty to sixty second per item
budget also sets the format: if an item takes longer than a minute to judge, it was badly
harvested.

## 6. Follow-up cadence: what the archive supports and what it does not

Timing guidance, from a cold-outreach vendor
[raw/followup--cadence--timetoreply-2026.md]:

| Attempt | Interval |
|---|---|
| Post-meeting recap | within 24 hours |
| First follow-up | 3 to 5 business days |
| Second follow-up | 7 to 14 days after the first |
| Third follow-up | 14 to 20 days after the second |
| Stopping rule | 2 to 3 total follow-ups, then stop |

Quoted response figures from the same source: first follow-up 45.3 percent open and 8.4
percent reply, follow-ups generating 42 percent of all responses, most prospects replying
after the third email [raw/followup--cadence--timetoreply-2026.md]. **These are unlinked
figures drawn from cold sales datasets and are weak evidence for colleague or partner
follow-up** [raw/followup--cadence--timetoreply-2026.md].

**The transferable line, and the most important line in this whole archive:** "Avoid
sending the exact same email again." Vary the message, add new value, shift tone from
passive to assertive without becoming aggressive
[raw/followup--cadence--timetoreply-2026.md].

**The non-transferable line:** the "stop after 2 to 3" rule. It comes from prospecting,
where dropping the lead is a valid outcome. A partner who owes the user a deliverable
cannot be dropped, so escalation replaces stopping
[raw/followup--cadence--timetoreply-2026.md].

Relationship-preserving framing [raw/followup--relationship--hbr-zucker-2021.md]:

- "just because someone hasn't responded to your initial request, it doesn't mean their
  answer is 'no.'"
- Keep the message brief and scannable
- "Make a clear ask, so the recipient knows exactly what you want"
- "Give the recipient an out. It will demonstrate humility and ease any potential
  discomfort"
- "Be persistent. You want to demonstrate assertiveness but also good judgment about when
  to move on"
- Mind the tone: friendly and polite

Age caveat: this source is from January 2021, outside the six-month default window. It is
retained because the recent-window search returned only cold-outreach content marketing
and this is the strongest available statement of the framing
[raw/followup--relationship--hbr-zucker-2021.md].

## 7. Does nudging cost you the relationship

The only peer-reviewed evidence located points the other way. Across 235 participants in
global virtual teams, both team-based interventions and digital reminder nudges were
associated with higher psychological safety
[raw/nudges--psych-safety--springer-gdn-2024.md]. The authors qualify it: "only the effect
of TBI on psychological safety can be explained with a higher-quality coordination
process. It remains unclear what causal mechanism explains the effect of DRN"
[raw/nudges--psych-safety--springer-gdn-2024.md].

**Named gap.** No source in this archive answers how often a person can be nudged before
it costs something. Frequency, repetition strategy, and diminishing returns are all
unmeasured in the accessible content [raw/nudges--psych-safety--springer-gdn-2024.md].

**Consequence for the skill.** Escalate by changing channel and framing, not by increasing
frequency. Frequency is the variable with no evidence behind it. And because the causal
mechanism is unknown even where the association is positive, keep the human in the loop:
the evidence supports nudges existing, not any unattended sending policy.

## 8. Market context

From a survey of 12,035 knowledge workers and 173 Fortune 1000 executives, fielded January
to February 2026 [raw/meetings--coordination--atlassian-state-of-teams-2026.md]:

- 87 percent of knowledge workers say that when colleagues focus heavily on execution,
  they lack adequate capacity to coordinate effectively
- 85 percent use AI at work, but only 29 percent have embedded it into regular workflows
- 89 percent of executives say AI increases speed; 6 percent are certain they can show
  organization-wide return
- High-performing teams are 2.3x more likely to trust AI for surfacing relevant,
  contextualized information

Publisher bias is disclosed in the raw file: the vendor sells collaboration software and
these conclusions are commercially convenient
[raw/meetings--coordination--atlassian-state-of-teams-2026.md].

**Consequence for the skill.** The gap between 85 percent usage and 29 percent workflow
embedding is the argument for a scheduled routine rather than a thing the user must
remember to ask for. The 2.3x trust figure is the argument for receipts on every line.

---

## Named gaps in this archive

1. **No verifiable action-item completion rate exists.** Every available figure traces to
   unsourced content marketing [raw/meetings--unsourced-stats--meetingtoll-2026.md].
2. **The Matthews accountability percentages could not be verified** from the primary
   source page [raw/commitment--accountability--matthews-dominican-2007.md].
3. **Nudge frequency tolerance is unmeasured.** No source states how often is too often
   [raw/nudges--psych-safety--springer-gdn-2024.md].
4. **No benchmark exists for action-item extraction reliability**, by the vendor's own
   admission [raw/ai-extraction--pipeline-accuracy--circleback-2026.md].
5. **Follow-up cadence evidence is cold-sales evidence.** No colleague-to-colleague or
   partner-to-partner cadence data was located
   [raw/followup--cadence--timetoreply-2026.md].
6. **The strongest relationship-framing source is from 2021**, outside the default
   research window [raw/followup--relationship--hbr-zucker-2021.md].
