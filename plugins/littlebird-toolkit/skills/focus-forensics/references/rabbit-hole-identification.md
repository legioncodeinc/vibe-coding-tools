# Rabbit hole identification

How a recurring diversion gets named, what evidence it needs, and the wide category of
things that must never be named at all.

Read `references/what-snapshots-can-and-cannot-measure.md` first. This is the section of
the skill most likely to produce something that feels like judgment, so it carries the
strictest evidence bar in the whole skill.

## The definition, and what it deliberately excludes

A **rabbit hole** is a specific topic, site or context that:

1. appears in three or more separate runs,
2. within a window where the user had stated a different intention, in their own captured
   words, and
3. is not itself part of the stated intention or a plausible support activity for it.

All three conditions. Missing any one of them, it is not reported.

What that definition deliberately excludes:

- **Anything that merely appeared a lot.** Volume alone is not a rabbit hole. An editor
  appearing in forty snapshots is a person doing their job.
- **Anything the skill judges to be low value.** The skill has no opinion about whether
  reading industry news, browsing a forum or watching a video is a good use of a Tuesday.
  It has an opinion about whether the user said they were doing something else.
- **Breaks.** A capture gap is not a rabbit hole and is never interpreted at all
  (`references/switch-and-run-detection.md`, step 5).
- **Anything without a stated intention to contrast against.** No stated intention means no
  rabbit hole finding for that window. Report that the intention signal was absent and move
  on.

That third exclusion is the load-bearing one. Without a stated intention the skill is
substituting its own judgment of what the user should have been doing, and that is exactly
the register that gets a report turned off.

## Why the bar is set here, and not lower

No source in this archive measures rabbit-hole behavior as such
(`references/research/distilled-attention-fragmentation.md`, section 11, gap 3). The
nearest evidence is that internet surfing and window switching correlated with self-reported
boredom in one 32-person study
(`references/research/distilled-attention-fragmentation.md`, section 7), and that off-task
episodes in a 2025 observational study averaged 54 seconds with a standard deviation of 100
seconds (`references/research/distilled-attention-fragmentation.md`, section 4).

So rabbit-hole detection is an explicitly unvalidated heuristic over observed repetition
and stated intention. It is presented to the user as evidence to judge, never as a
diagnosis. Anything less than the three-condition bar would be the skill inventing a
finding.

One more number that governs the tone here: roughly 60 percent of off-task time in the most
recent observational study was self-initiated rather than externally triggered
(`references/research/distilled-attention-fragmentation.md`, section 9). People choose most
of their own diversions, usually for reasons. Naming one is informative. Moralizing about
it is not.

## Finding stated intentions

Intentions come from the user's own words, captured. Sources, in order of strength:

| Source | Retrieval | Strength |
|---|---|---|
| A message the user sent stating a plan, tagged `(From:[user])` | `search_user_context` with `search_queries_messages` | Strongest. Their own words, attributable |
| A to-do list, plan document or issue the user was editing | `search_user_context` snapshots, text in a compose or editor context | Strong, if the attribution guardrail is satisfied |
| A meeting's `## For You` section, listing what the user is expected to do | `LB_INTERNAL_GET_MEETING` | Strong. Already carries owner attribution (`references/littlebird-mcp-reference.md`) |
| An `## Action Items` line tagged with the user as owner | `LB_INTERNAL_GET_MEETING` | Strong |
| A daily activity summary naming a focus | `search_user_context`, `data_source: "summaries"` | Medium |
| A plan visible on screen but not demonstrably the user's | Any | Not usable. See below |

**The attribution guardrail applies at full strength here.** Captured content shows what
the user was VIEWING, not what they wrote (`references/evidence-standards.md`, rule 4). A
task list on screen might be someone else's board. A message in a thread is the user's only
if tagged `(From:[user])`. Text in a compose box is probably theirs; text in a feed is
probably not.

An intention the skill cannot attribute to the user is not an intention. Drop it.

## The evidence a named rabbit hole must carry

Every rabbit hole in the report carries all four of these. No exceptions, and no partial
entries.

1. **The stated intention, quoted verbatim, with its receipt.** The user's actual words and
   where they came from. Format per `references/evidence-standards.md`, section 1.
2. **The number of separate runs the diversion appeared in, and the total snapshot count
   across them.** Both numbers, always.
3. **The dates and clock times of each run's first snapshot.** So the user can find each
   occurrence in their own memory of the week.
4. **A neutral one-line description of what the topic was**, drawn from OCR, with no
   evaluative adjective.

If any of the four is missing, the item does not appear in the report. An unevidenced
rabbit hole is worse than no rabbit hole section at all, because it is the item a user will
check first and the one that will discredit everything else if it is wrong.

## The house format

```
Recurring alongside a stated intention

  You wrote on Monday 08:41: "this week is the Helix migration, nothing else"
                                        [Monday, August 10, 2026 08:41 EDT | slack]
                                        (sent Aug 10, 8:41 AM)

  Kubernetes operator documentation appeared in 4 separate runs across Tue and Wed,
  11 snapshots total.
    Tue 10:22, run of 2 snapshots
    Tue 14:05, run of 4 snapshots
    Wed 09:48, run of 3 snapshots
    Wed 16:30, run of 2 snapshots

  This is a count of observed appearances next to something you wrote down. It is
  not a judgment about whether the reading was worth doing, and this report has no
  way to know whether it turned out to be part of the migration after all.
```

That closing line, or one very like it, is mandatory on every rabbit hole entry. It is what
keeps interpretation with the user.

## Cap the section at two

At most two rabbit holes per report, chosen by run count and then by snapshot count. A list
of six reads as an indictment. Two read as observations.

If more than two clear the bar, name the top two and state the count of others without
naming them, so the user knows the section was filtered rather than exhaustive.

## What must never be named

This is a self-analysis tool reading a stream that captured a person's whole screen. Some
of what it captured is not this skill's business and does not enter the report even when it
would satisfy every condition above.

| Excluded | Why |
|---|---|
| Anything touching health, medical, financial, legal or family matters | Sensitive categories stay out of derived artifacts even when the capture contains them (`references/evidence-standards.md`, rule 10) |
| Job searching, applications, recruiter threads | Same rule, and a report naming it becomes dangerous the moment it is shared or synced |
| Anything about a named third party's behavior, performance or activity | Third parties in the capture are incidental (`references/evidence-standards.md`, rule 10). Other people's names appear in the user's screen; they are not subjects of this analysis |
| Adult content, or anything the user would plainly not want written into a file | No evidentiary purpose. Excluding it costs the report nothing |
| A colleague's or client's messages read on screen | Not the user's activity, and not this skill's subject |
| Anything from a screen share, someone else's dashboard, or another company's tooling | Raw capture of other parties never ships (`references/evidence-standards.md`, rule 7) |

When something is excluded on these grounds, the report says a category was excluded, and
does not say which one. The user knows.

## Never point this at another person

State this in the artifact, every time. The skill analyzes the capture from the user's own
machine, for the user. It does not:

- run against a named colleague, report or contractor,
- produce a comparison between two people,
- produce an artifact framed for a manager, or
- characterize anyone else's attention, activity or diligence.

This is not a courtesy. Electronic monitoring carries a small positive correlation with
strain and a small negative correlation with job attitudes, and its apparently neutral
average effect on performance may reflect suppression, meaning real harms and real gains
cancelling rather than nothing happening
(`references/research/distilled-attention-fragmentation.md`, section 10). The strongest
controllable moderator the review names is how the monitoring is implemented and
communicated (`references/research/distilled-attention-fragmentation.md`, section 10). A
person voluntarily reading their own capture sits at the benign end of that moderator. A
manager running the identical computation on a report sits at the other end, and the
computation being identical is exactly the point.

**If the user asks to run this on someone else, decline and say why in one sentence.** Do
not run a reduced version, do not run it "just to see", and do not offer a de-identified
variant. Offer instead to help them ask the person to run it on themselves and share what
they want to share.
