---
name: content-repurposer
description: "Turn one long-form artifact into a week of voice-matched derivatives that each
  take a different angle. Trigger on 'repurpose this post', 'turn this into a week of
  content', 'make content from this call', 'break this down for LinkedIn', 'I need a content
  pack', 'what else can I do with this webinar'. Produces 5 to 7 standalone short posts, a
  carousel outline with per-slide copy, an email, a thread, a sequencing plan with reasons,
  and a mandatory do-not-publish list. Enforces a seven-angle taxonomy so the pack is genuine
  variety and not the same idea five times. Drafts through the user's own voice skill when
  one is installed. Never publishes and never posts."
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan)"
---

# Content Repurposer

## Purpose

One good long-form artifact becomes a week of derivatives. A Facebook post, a call
transcript, a webinar, a Loom, a long email. The output is a **content pack**: 5 to 7 short
posts that each stand alone, a carousel or slide outline with per-slide copy, an email, a
thread, optionally a short-video script or hook list, a sequencing plan that says which
piece goes out when and why, and a do-not-publish list.

**The craft problem this skill exists to solve.** Most repurposing output is the same idea
restated five times in different shapes. To anyone who follows the user on more than one
surface, that reads as spam, and that reader is the one the user most wants to keep.

The fix is not a better hook per format. **Each derivative takes a DIFFERENT ANGLE on the
source, not a different format of the same angle.** The one controlled experiment in the
research archive distinguishes cosmetic variation, meaning the same message in altered
packaging, from substantive variation, meaning a change in the arguments themselves, and
finds that cosmetic variation carried only under LOW message relevance while substantive
variation carried with an audience motivated to process it
(`references/research/distilled-repurposing-and-format-adaptation.md`, section 1). A
multi-surface follower is the motivated case by construction.

`references/angle-taxonomy.md` is the guide that makes this operational, and it is the most
important file in the skill.

**It drafts. It never posts, and it never publishes.**

### Relationship to `said-it-already`

These are siblings, not duplicates. **`said-it-already` MINES many sources for seeds.
`content-repurposer` takes ONE chosen artifact and expands it into a week.** Where their
craft overlaps, this skill points rather than restates: the spoken-to-written rebuild,
attribution screening, and the confidentiality screen all live in that skill's guides and
are used from there.

---

## Littlebird MCP calls used

Real tool names, verified against the live server
(`references/littlebird-mcp-reference.md`). LIST the tools available in this session before
calling anything and use the names you actually find.

| Tool | Used for |
|---|---|
| `search_user_context` | Finding a described post or written artifact the user cannot link, and sweeping for how the original performed |
| `LB_INTERNAL_SEARCH_MEETINGS` | Locating a call by TOPIC when the source is a conversation |
| `LB_INTERNAL_LIST_MEETINGS` | Locating a call by NAME or date, and enumerating a window |
| `LB_INTERNAL_GET_MEETING` | The structured summary, which carries owner attribution |
| `LB_INTERNAL_GET_MEETING_TRANSCRIPT` | Exact wording only, never attribution |
| `LB_INTERNAL_GET_ROUTINE_REPORTS` | Reading the weekly nomination routine's own past reports before selecting a source |
| `LB_INTERNAL_LIST_ROUTINES` | Checking whether the nomination routine already exists |
| `LB_INTERNAL_GET_ROUTINE_CONFIG` | Reading the existing routine before any update |
| `LB_INTERNAL_CREATE_ROUTINE` | Creating the weekly nomination routine, from an interactive session only |
| `LB_INTERNAL_UPDATE_ROUTINE` | Changing it later, from an interactive session only |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | Explaining a plan gate or a routine-count limit |

There is no Littlebird tool that searches past Littlebird chat conversations. Where a source
lives in one, use `search_user_context` and say so.

---

## Trigger

On demand is the primary mode. Trigger when the user says any of: repurpose this, turn this
into a week of content, make content out of this call, break this down for LinkedIn, I need
a content pack, what else can I do with this webinar, get more out of this post.

The optional weekly routine is a nomination mode. It does not produce the pack. It names a
candidate artifact and explains why, then hands off.

---

## Capability gate

This skill requires the **Littlebird MCP on a Power or Pro plan**.

1. LIST the tools actually available in this session. Do not assume tool names.
2. If no Littlebird tools are present, stop and tell the user the skill needs the Littlebird
   MCP connected, with a link to https://support.littlebird.ai/docs/mcp/.
3. If the tools are present but return plan errors, call the subscription status tool and
   report the plan gate.

One exception worth naming: if the user pastes the source artifact directly, the skill can
run without retrieval. Say so, and say what is lost, which is the performance sweep and any
surrounding context.

---

## Routine cadence

**On demand is primary.** The weekly routine is optional and it only nominates.

Schedule: weekly, `{"frequency": "weekly", "time": "09:00", "week_days": ["MO"]}` in the
user's local timezone, so the nomination lands at the start of a working week with time to
build the pack.

The routine cannot produce the pack. Building a pack requires a confidentiality screen, an
angle audit, and an approval gate on the actual final text, and a routine cannot run an
approval gate (`references/littlebird-mcp-reference.md`, the Routines-observe Cowork-acts
pattern). Exact prompt text is in the routine wiring section below.

---

## Process

### Step 1: Frame the run

Ask with `AskUserQuestion`, in one batch:

1. **The source.** A link, a paste, a description to search for, or a call to find. If they
   do not have one and the nomination routine exists, read its latest report first.
2. **The surfaces.** Which platforms they publish to, plus email yes or no. This sets the
   format constraints and the sequencing.
3. **The window.** How many days the pack should spread across. Default 7 to 10.
4. **Optional pieces.** Whether they want the short-video script or hook list.
5. **Existing cadence.** What they normally post per week, so the sequence fits their rhythm
   rather than replacing it.

### Step 2: Find the voice skill

Do this before drafting, not at drafting time, because the answer changes what the output is
worth.

LIST the skills available in this session and look for a personal voice skill: a name ending
in `-voice` or `-voice-skill`, or a description saying it writes in the authentic voice of a
named person.

- **Found.** Every draft goes through it. Pass it the angle and the substance. It owns style.
  This skill keeps authority over facts: hedges stay, clients stay unnamed, screened material
  stays screened.
- **Not found.** Say so now, plainly, and point at this marketplace's voice creator skills:
  `littlebird-voice-creator`, `facebook-voice-creator`, `combined-voice-creator`. Offer to
  build one first, or to continue and produce drafts that carry the user's material but not
  their voice. Their choice, taken before the work happens.

**Never imitate a voice from nothing.** Do not infer a voice profile from the source
artifact and present it as the user's voice.

### Step 3: Retrieve the source

Run MULTIPLE NARROW queries, never one broad one. Broad queries return oversized results
that get dumped to a file and score worse (`references/littlebird-mcp-reference.md`).

**A. The user names it directly.** Take it. Skip to the performance sweep.

**B. The user describes a post or written artifact.** `search_user_context` with three to
five narrow `search_queries` built from their description, bounded by `date_range`. Add
`search_queries_messages` if it may have been a message. Read the relevance scores. An item
scored 3 is a maybe and does not identify a source on its own.

**C. The source is a call.** Use the right tool for the lookup:

- By TOPIC: `LB_INTERNAL_SEARCH_MEETINGS` with `query`, bounded by `start_date` and
  `end_date`.
- By NAME: `LB_INTERNAL_LIST_MEETINGS` with `name`.

Using the wrong one is the most common retrieval mistake against this server
(`references/littlebird-mcp-reference.md`). Then `LB_INTERNAL_GET_MEETING` for the structured
summary, and `LB_INTERNAL_GET_MEETING_TRANSCRIPT` only where exact wording is needed.

**D. The performance sweep, and its honest limits.** If the source was published, sweep for
how it did. `search_user_context` with `filters.data_source: snapshots`, queries naming the
platform and the post subject, bounded to the weeks after publication. Social engagement
signal does appear in ordinary browser capture
(`references/littlebird-mcp-reference.md`, verified capture receipts).

**Report what you find as partial, because it is.** Social UIs collapse lists into "and 4
others" and "12 people reacted". Report the named set with receipts, the count of unnamed
entries and where it came from, and what the user could do to close the gap
(`references/evidence-standards.md`, rule 5). A captured count is a snapshot at one moment,
not a total, and two posts captured at different ages are not comparable. Never write "your
best-performing post".

**E. Read your own history.** If the nomination routine exists, call
`LB_INTERNAL_GET_ROUTINE_REPORTS` before selecting. It tells you what has already been
nominated and what has already been expanded, which prevents repurposing the same artifact
twice.

### Step 4: Select or reject the source

Follow `references/source-selection.md`. **Run the four-angle audit before any drafting
work.**

Check the source against all seven angles and count how many it can genuinely support.

- **Four or more: proceed.**
- **Exactly three: report it as a thin source and offer the user three options** (a smaller
  pack, combining with a second source, or a different source) before continuing.
- **Two or fewer: do not proceed.** Say which angles are missing and what would make it
  viable.

Do not pad. Inventing a counter-example to reach four is worse than reporting three, because
the invented one ships under the user's name.

The guide also covers what makes a source bad: a list of five unrelated points, a
time-sensitive announcement, a roundup, a piece with no specific detail, something already
repurposed, and a source whose good parts are confidential.

**If the source is a call transcript, apply the spoken-to-written rebuild before angling
anything.** That craft is researched and solved in the sibling skill. Read
`../said-it-already/references/spoken-to-written.md`. Apply its attribution ladder too
(`../said-it-already/references/attribution-screening.md`): a transcript proves a line was
said, not who said it.

### Step 5: The confidentiality screen

**A distinct stage, and it runs before drafting, never after.** Screening a finished draft
invites the user to argue for keeping a good post and wastes the drafting work.

Reuse the sibling skill's screen rather than a second version of it. Read
`../said-it-already/references/confidentiality-screen.md` and apply it to the source and to
every angle drawn from it.

Assign every candidate piece exactly one value: **Clear**, **Needs-scrub**, or
**Do-not-publish**. The hard list covers legal and privileged discussion, HR matters, trade
secrets, accommodation and medical, performance and discipline, a deal in progress, a private
complaint about a named person, and anything from a conversation with an implicit
confidence. The scrub list covers named clients, identifying detail clusters, unreleased
products, a client's own numbers, a third party's words, a dropped hedge, and off-the-record
framing.

**Two things specific to this skill.**

1. **Expansion multiplies exposure.** One source becomes 8 to 10 pieces on up to 5 surfaces.
   A detail that was borderline in one post is now published eight times. Screen at the
   source level AND at the piece level.
2. **The story angle carries the highest do-not-publish rate in a typical pack.** Screen it
   first.

**The do-not-publish list is a mandatory output.** A content pack shipped without one means
the screen did not run.

### Step 6: Assign angles

Follow `references/angle-taxonomy.md`. This is the step that determines whether the pack is
worth publishing.

Assign an angle to every piece BEFORE drafting, then choose the format for the angle. Never
the reverse. Fill the assignment table:

| Piece | Surface | Angle | Claim sentence | Passes disagreement test against |
|---|---|---|---|---|

Rules: the claim angle appears exactly once and goes first, no angle appears more than twice,
a repeated angle must be on a different surface with different supporting material, and a
piece that cannot name another piece a reader could disagree with does not ship.

**Then run both tests.**

- **The one-sentence claim test.** Write each piece's claim as one declarative sentence with
  no hook and no examples. If two are paraphrases, they are the same angle. Kill one or
  re-angle it.
- **The disagreement test.** For each pair, could an intelligent reader agree with one and
  disagree with the other? If not, they are one piece in two costumes.

Do not force all seven angles. Six real angles beat seven with one invented.

### Step 7: Draft to the format

Follow `references/format-specs.md`. Draft each piece to its **fold** first and its ceiling
second. The ceiling is where the platform rejects the post. The fold is where the reader
decides. On LinkedIn the ceiling is 3,000 characters and the mobile fold is around 140
(`references/research/distilled-repurposing-and-format-adaptation.md`, section 2).

Draft the first 140 characters of every feed piece as if they were the whole piece.

Every piece carries its format record: surface, angle, character count against ceiling, the
exact first 140 characters, link handling, media, and whether the limits were re-verified
this run.

**Every email ships with an explicit subject line AND an explicit preview text line.** In
Gmail the subject and the preview share one line of inbox space, and preview text is a
separately authored field, not a truncation of the body (same source, section 2). An email
with no preview text has left its most constrained surface unwritten.

**Every short post stands alone.** Nothing in it refers to the source existing. No "I wrote
about this recently", no "link in comments to the full version". A teaser is not a
derivative.

Verify limits before sizing anything that matters. The research archive contains no
first-party platform documentation for any surface (same source, section 7), and platform
limits change without announcement.

### Step 8: Sequence

Follow `references/sequencing.md`. Produce the plan with the reasoning attached, because an
order with no reasoning is a schedule, not a plan.

The claim goes first. The contrarian read goes last. Consecutive slots never share a surface.
The production-heavy pieces go mid-to-late. At least one slot is held to absorb a real
objection from the pack's own comments.

Fit the sequence to the user's existing cadence rather than changing their rhythm as a side
effect. The only cadence measurement in the archive covers LinkedIn, uses a within-account
statistical design over 2 million posts, and found no reach cap or penalty for frequent
posting (`references/research/distilled-repurposing-and-format-adaptation.md`, section 4).
**The argument for restraint in a pack is a reader argument, not an algorithm argument.** Do
not tell the user to slow down for algorithmic reasons.

### Step 9: The approval gate

Every piece gets user confirmation before it counts as a publishable draft
(`references/evidence-standards.md`, rule 6).

Use `AskUserQuestion`. Batch the pieces. Present, for each: the angle, the claim sentence,
the full drafted text, the character count against the surface ceiling, and the exact text
above the fold.

**The user approves the TEXT, not a plan and not a summary.** Approving the angle assignment
is not approving the words.

Then hand the approved pack back. The skill does not post it, does not schedule it, and does
not write it into any third-party tool.

---

## Output

One file: **`content-pack-YYYY-MM-DD.md`**, dated to the first send day of the sequence, in
the user's working directory unless they name another location.

Sections, in this order:

1. **Run frame.** The source and how it was identified, its receipt, the surfaces, the
   window, whether a voice skill was found and used, and the four-angle audit result.
2. **Do not publish.** Second, so nobody misses it. Every blocked and scrub-required item
   with its id, its category, and a one-line reason. **The sensitive material itself is not
   reproduced here** (`references/evidence-standards.md`, rule 7).
3. **The angle assignment table.** Piece, surface, angle, claim sentence, and the piece it
   passes the disagreement test against. This is what makes the variety auditable.
4. **The short posts.** 5 to 7 of them. Each with its angle, its full text, its character
   count against ceiling, and its exact first 140 characters.
5. **The carousel or slide outline.** Per-slide copy, not a topic list. Cover slide, body
   slides at one point each, CTA slide. Word count per slide against the 60-word working
   budget.
6. **The email.** Subject line, preview text line, and body. All three, always.
7. **The thread.** Post by post, each within the account's per-post ceiling, with the first
   post standing alone.
8. **Optional: the short-video script or hook list**, with the note that the archive has no
   researched basis for video-specific hook guidance.
9. **The sequencing plan.** The table with send day, surface, piece, angle, and why that
   slot, plus the held-for-response slot, the overlap note, and the cadence basis.
10. **Source performance, if any crossed the screen.** Named reactors and commenters with
    receipts, the count of collapsed unnamed entries, and the plain statement that engagement
    data from capture is partial, collapsed, and a snapshot rather than a total.
11. **Method and gaps.** Which queries ran, over which window, what came back empty, which
    angles the source could not support, and which format limits were not re-verified this
    run.

Raw retrieved capture does not go in this file. Process it in temp space and let it go
(`references/evidence-standards.md`, rule 7).

---

## Empty retrieval

If the searches cannot identify the source, **stop and report the gap. Do not build a pack
from a reconstructed source.**

Say exactly which queries ran, over which window, with which filters, and that they came back
empty. Then give the user the likely causes:

1. **The artifact was never captured.** Littlebird captures what was on screen. A post
   written on a phone, or a call that was not recorded, produces nothing retrievable. Only
   recorded meetings carry an id; unrecorded calendar events have no summary and no
   transcript and are not searchable (`references/littlebird-mcp-reference.md`).
2. **The window is wrong.** Ask for a rough date and re-run.
3. **The description is too general.** Ask for one distinctive phrase from the artifact and
   query on that.

Offer the direct path: the user pastes the source and the skill runs without retrieval.

The same applies after screening. If the confidentiality screen empties the pack, that is a
real finding. Report how many pieces were blocked and why, and stop
(`references/evidence-standards.md`, rule 9).

---

## Guardrail

**The specific risk this skill carries: it publishes the same person's voice on many surfaces
at once, and it does it from material that was often not written for publication.**

Four failure modes, in the order they bite.

1. **The spam pack.** Five restatements shipped as variety. This is the default outcome of
   repurposing and the reason the angle taxonomy is mandatory rather than advisory. Run both
   tests in step 6 on every pack. A pack that fails them does not ship, and the fix is
   re-angling, not rescheduling.
2. **Multiplied exposure.** One borderline detail in a source becomes the same detail in
   eight pieces across five surfaces. Screening at the source level is not sufficient. Screen
   every piece.
3. **The em dash and the AI tell.** This output is published under the user's name. Drafts
   that read as machine-written cost the user credibility that the pack cannot repay. Draft
   through the user's voice skill where one exists, say plainly when one does not, and never
   infer a voice from the source artifact. **Zero em dashes and zero en dashes in any drafted
   piece.**
4. **Presenting captured engagement as performance.** Collapsed counts and snapshot
   timestamps are not a post's performance. Reporting them as such is the fastest way to make
   a recommendation untrustworthy, because the user will notice the missing names first
   (`references/evidence-standards.md`, rule 5).

**The draft-never-send law.** Nothing is sent, posted, published, scheduled, or written into
a third-party system without the user approving the actual final text through
`AskUserQuestion`. This holds even when a scheduling or email connector is present in the
session and even when the user has approved the plan, because approving a plan is not
approving the words. Where a connector exists and the user wants it used, produce the payload
and stop for approval on the exact text first.

---

## Routine wiring: the weekly source nomination

The routine OBSERVES and nominates. The Cowork session ACTS
(`references/littlebird-mcp-reference.md`, the Routines-observe Cowork-acts pattern). The
expansion, the confidentiality screen, the angle audit and the approval gate all happen in
Cowork, because a routine cannot run an approval gate.

Offer to create it. Show the user the prompt text and the schedule, get approval with
`AskUserQuestion`, then call `LB_INTERNAL_CREATE_ROUTINE`. Do not tell the user to go set it
up by hand. Check `LB_INTERNAL_LIST_ROUTINES` first for an existing one, and
`LB_INTERNAL_GET_ROUTINE_CONFIG` before any update, because `prompt` and `schedule` each
replace the whole field.

Schedule: `{"frequency": "weekly", "time": "09:00", "week_days": ["MO"]}` in the user's local
timezone.

Routine prompt text to pass:

> Read your own previous reports first, before writing anything. Build a running list of
> every artifact you have already nominated. Never nominate the same artifact twice. If the
> best candidate this week is something you already nominated and I never expanded, say so
> explicitly, say how many weeks running it has been the best available candidate, and tell
> me that either the artifact is worth a decision or my capture has gone quiet, rather than
> listing it again as if it were new.
>
> Look at my last 7 days and find the ONE long-form thing I made that is most worth turning
> into a week of shorter pieces. Candidates include a long post I wrote, a call I had that
> went deep on a single subject, a webinar or a recorded talk, a long email I sent, or a
> screen recording I made. Run several narrow searches rather than one broad one.
>
> Judge candidates on whether one piece could honestly support SEVEN DIFFERENT ANGLES, not on
> whether it was long. The seven angles are: the central claim stated flat; a counter-example
> or an exception that runs the other way; a how, meaning a real repeatable procedure with
> actual steps; the story behind it, meaning one specific incident with stakes; an objection
> someone actually raised and the answer to it; a specific number with its hedge intact; and
> a contrarian read where I disagree with what most people in my field assume.
>
> A good candidate argues ONE thing well, contains a specific story, and contains at least one
> real number. A bad candidate is a list of five unrelated points, a time-sensitive
> announcement, a roundup of other people's work, or anything with no specific detail in it.
> Say which kind you found.
>
> Write a short report with four parts.
>
> First, the nomination. Name the one artifact, say where and when it came from, and say in
> one sentence what single idea it argues. Do not write any of the derivative pieces. That
> happens in Cowork.
>
> Second, the angle count. Go through all seven angles and say for each one whether the
> artifact contains the material that angle needs, with a few words on what that material is.
> Then give the total. If the total is under four, say plainly that this is a thin week and
> that expanding it would produce restatement rather than variety.
>
> Third, the runners-up. Name at most two other candidates in one line each with their angle
> count, so I can overrule you.
>
> Fourth, anything in the top candidate that should probably never be published: client names,
> deal terms, unreleased products, private complaints about a person, someone else's numbers,
> or anything from a conversation that sounded confidential. Name the concern and the reason.
> Do not quote the sensitive material itself.
>
> End with the action line. Tell me to open Cowork and run the content-repurposer skill on the
> nominated artifact.
>
> If you find nothing worth nominating in the last 7 days, say exactly that and stop. Do not
> nominate something weak to fill the slot, do not invent an artifact, and do not repeat last
> week's nomination as if it were new. A week with no good source is a real finding and I
> would rather hear it.

Set notifications on.

**Handoff.** When the user opens Cowork and runs this skill, call
`LB_INTERNAL_GET_ROUTINE_REPORTS` before step 3. The reports give you the nominated artifact,
its angle count, the runners-up, the confidentiality flags, and the record of what has
already been expanded, which is strictly better than rebuilding all of it from one retrieval.

---

## Evidence standards

Every claim in the deliverable follows `references/evidence-standards.md`. The rules that
bite hardest here:

- **Rule 5, partial rosters.** The performance sweep is the main offender. Collapsed counts
  and snapshot timestamps are reported as partial, always, with the size of the unnamed gap.
- **Rule 1, receipts.** The source carries one. Every engagement observation carries one. For
  messages, collection time and send time are different values and both appear.
- **Rule 2, observed and inferred.** The source text is observed. "This angle will land" is
  an inference. Mark which is which.
- **Rule 3, confidence.** Publishing is irreversible, so a Low-confidence claim never reaches
  a draft without the user confirming it first.
- **Rule 4, attribution.** Applies to any transcript source. Capture proves a line was said,
  not who said it.
- **Rule 6, confirmation.** The approval gate is on the text, not the plan.
- **Rule 7, raw capture never ships.** The do-not-publish list names what it blocked without
  reproducing it.
- **Rule 9, empty retrieval ends the run.** No reconstructed sources, no plausible examples.
- **Rule 10, reporting on people.** Other people appear in the source. They appear in the
  pack only where material, with the same standards applied, and a third party's words are a
  permission question rather than an editing problem.

---

## What this skill does not claim

Say this to the user once, in the artifact's method section.

The research archive is honest about its own thinness
(`references/research/README.md`). This domain is written almost entirely by the companies
selling the service, and the headline numbers do not survive a provenance check. One widely
circulated article states that repurposed content saves "up to 60%" of budget, reaches "80%
more" audience, and gets "92% more traffic than original content", and names no study, no
sample, no date, and no method for any of them
(`references/research/distilled-repurposing-and-format-adaptation.md`, section 0).

So, specifically:

- **No source found measures whether repurposed content outperforms, matches, or
  underperforms originals.** Everyone selling repurposing assumes the answer. This skill
  states no lift, no reach claim, and no traffic multiple.
- **No first-party platform documentation was obtained for any surface.** Every format limit
  in `references/format-specs.md` is second-hand and should be verified before a draft is
  sized against it.
- **The seven-angle taxonomy is authored craft.** The cosmetic-versus-substantive distinction
  underneath it is sourced to a controlled experiment
  (`references/research/distilled-repurposing-and-format-adaptation.md`, section 1). That
  experiment is from 1990, tested print advertising on undergraduates, and its effect sizes
  do not transfer. The mechanism is used as reasoning, never as proof.
- **The only cadence measurement covers LinkedIn.** It found no penalty for frequent posting,
  and it did not measure repetitiveness, so it says nothing in either direction about the
  problem this skill solves (same source, section 4).
- **This skill never says "the algorithm rewards" anything.** Where a ranking signal is named
  it is attributed to a published repository as read by one publisher.

---

## Related skills

| Skill | Relationship |
|---|---|
| `said-it-already` | The sibling. It MINES many sources for seeds; this skill EXPANDS one chosen artifact. Its spoken-to-written guide, attribution ladder, and confidentiality screen are used from here by reference rather than restated. Its output is a natural input to this one. |
| `littlebird-voice-creator` | Builds the personal voice skill from Littlebird capture. Offer it when no voice skill is installed. |
| `facebook-voice-creator` | Builds the personal voice skill from a Facebook data export. |
| `combined-voice-creator` | Builds it from both sources. The strongest option when the user has both. |
| `routine-architect` | For tuning the nomination routine's prompt and schedule beyond what this skill sets up. |

---

## Ship Gate

Ship Gate removed, research-only skill, produces no committable code.

---

## References

| File | What it covers |
|---|---|
| `references/angle-taxonomy.md` | The seven angles, the two tests, the assignment rules, why format variation alone fails |
| `references/source-selection.md` | Good and bad sources, the four-angle audit gate, source type notes, the performance signal and its limits |
| `references/format-specs.md` | Ceilings and folds per surface, link handling, carousel and email specifications, the per-piece format record |
| `references/sequencing.md` | What sequencing is and is not for, the cadence evidence, the default sequence with reasoning, what ships in the plan |
| `references/littlebird-mcp-reference.md` | Tool inventory, parameters, return shapes, known limitations |
| `references/evidence-standards.md` | Receipts, confidence, attribution, partial rosters, confirmation gates, empty retrieval |
| `references/research/distilled-repurposing-and-format-adaptation.md` | Cited distillation of the domain research |
| `references/research/README.md` | Archive contents, source mix, evidence quality, named gaps, retrieval failures |
| `../said-it-already/references/spoken-to-written.md` | The spoken-to-written rebuild, used when the source is a call, a webinar, or a Loom |
| `../said-it-already/references/attribution-screening.md` | The surface ladder for proving who said a line in a transcript |
| `../said-it-already/references/confidentiality-screen.md` | The hard list, the scrub list, and the do-not-publish output format |
