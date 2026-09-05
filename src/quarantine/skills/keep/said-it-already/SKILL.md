---
name: said-it-already
description: "Mine meeting transcripts and captured writing for things you already said
  well, then draft posts from them. Trigger on 'what should I post', 'I have nothing to
  write about', 'build my content bank', 'turn my calls into content', 'find my best
  quotes', 'I said something good on a call last week'. Produces a weekly bank of 10 to
  15 seeds, each carrying the verbatim quote, its receipt, the register it was said in,
  why it works, and a drafted piece, plus a mandatory do-not-publish list. Drafts through
  the user's own voice skill when one is installed. Never publishes and never posts."
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan)"
---

# Said It Already

## Purpose

A person's best content is what they already said out loud on a call and forgot by
Thursday. The hot take that landed. The client story with the real number in it. The
explanation that finally made it click for someone who did not get it. Those moments are
better than anything invented at a blank page, because they were tested on a live human
in real time.

They are also gone. Nobody remembers what they said on Tuesday.

This skill mines meeting transcripts and captured writing for those moments, screens them
for who actually said them and whether they can be published, rebuilds them for reading,
and hands back a content bank.

**It drafts. It never posts, and it never publishes.**

The scarce resource in personal content is not scheduling. It is raw material. An
independent practitioner in the research archive reaches the same conclusion and solves it
by asking people to record voice notes about client conversations
(`references/research/distilled-content-mining-and-repurposing.md`, section 5). This skill
solves it from capture that already happened.

**It MINES many sources for seeds. `content-repurposer` takes ONE chosen artifact and
expands it into a week.** They are siblings, not duplicates, and this skill's output is a
natural input to that one.

---

## Littlebird MCP calls used

Real tool names, verified against `references/littlebird-mcp-reference.md`. LIST the tools
available in this session before calling anything and use the names you actually find. Do
not assume a tool exists because it is named here.

| Tool | Used for |
|---|---|
| `LB_INTERNAL_LIST_MEETINGS` | Step 3A. Enumerating the window with `start_date` and `end_date` to get the meeting inventory, including the unrecorded calendar events that carry no id and are therefore a named coverage gap. Also the correct tool for a lookup by NAME, using `name`. |
| `LB_INTERNAL_SEARCH_MEETINGS` | Step 3B. TOPIC search, one pass per seed type, with `query` bounded by `start_date` and `end_date`. Using this for a name lookup, or `LIST_MEETINGS` for a topic lookup, is the most common retrieval mistake against this server. |
| `LB_INTERNAL_GET_MEETING` | Step 3C. The structured summary on every meeting that returned a hit. `## For You` is the highest-attribution surface in the whole MCP; `## Decisions` and `## Action Items` carry explicit owner tagging. |
| `LB_INTERNAL_GET_MEETING_TRANSCRIPT` | Step 3D. Exact wording only, and only for a meeting that already produced a candidate. Take wording from a transcript. Never take attribution from one. |
| `search_user_context` | Step 3E. The sweep of the user's own written lines. `search_queries_messages` carries the four message queries and `filters.data_source` is set to `messages`; `search_queries` still carries at least one entry because that parameter is required even for a messages-scoped sweep. `date_range` is bounded to the window from step 1. `filters.data_source: snapshots` is also how a seed that lived on screen rather than in a call is reached. |
| `LB_INTERNAL_LIST_ROUTINES` | Checking whether the weekly seed watcher already exists before offering to create one. |
| `LB_INTERNAL_GET_ROUTINE_REPORTS` | Step 3F and the handoff. Reading the watcher's own past reports before extracting anything, so the same strong opinion is not re-surfaced every week. |
| `LB_INTERNAL_GET_ROUTINE_CONFIG` | Reading the current routine before any update, because `prompt` and `schedule` each REPLACE the whole field. |
| `LB_INTERNAL_CREATE_ROUTINE` | Creating the weekly seed watcher, from an interactive session only. |
| `LB_INTERNAL_UPDATE_ROUTINE` | Rescheduling or retuning it later, from an interactive session only. |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | Explaining a plan gate or a routine-count limit. |

There is no Littlebird tool that searches past Littlebird chat conversations, and there is
no calendar tool. Anything that looks like `search_chats` or `get_calendar` is not real.
Where a seed lives in a past chat, use `search_user_context` and say so. Upcoming calendar
events, where they matter at all, come from `LB_INTERNAL_LIST_MEETINGS` with a future
`end_date`.

**Drafting through the user's voice is not an MCP call.** A personal voice skill is a SKILL
installed in the session, not a tool on this server. Step 2 lists the available skills and
looks for one. There is no `voice.apply`.

---

## Trigger

Fires on: what should I post, I have nothing to write about, build my content bank, turn my
calls into content, find my best quotes, I said something good on a call last week, mine my
meetings for content, give me seeds for this week.

Also fires when the user opens Cowork after a notification from the weekly seed watcher
routine.

Do NOT fire this when the user already has ONE artifact in hand and wants a week of
derivatives from it. That is `content-repurposer`.

---

## Routine cadence

**Weekly is the primary mode: the bank gets built once a week.** The on-demand themed mode
runs whenever the user asks, over a 30 to 90 day window.

The watcher runs `{"frequency": "weekly", "time": "16:00", "week_days": ["FR"]}` in the
user's local timezone, so the candidate list lands before the weekend while the week is
still fresh.

Offer to create it rather than telling the user to go set it up by hand.
`LB_INTERNAL_CREATE_ROUTINE` works from an interactive session and is only blocked from
inside a running routine. Show the exact prompt text and the schedule, get approval with
`AskUserQuestion`, then call it.

The routine OBSERVES and notifies. The Cowork session ACTS
(`references/littlebird-mcp-reference.md`, the Routines-observe Cowork-acts pattern). The
attribution screen, the confidentiality screen, the spoken-to-written rebuild, the drafting
and the approval gate all happen in the interactive session, because a routine cannot run an
approval gate and cannot finish unattended work that requires one. Exact prompt text is in
the routine wiring section below.

---

## Capability gate

This skill requires the **Littlebird MCP on a Power or Pro plan**.

1. LIST the tools actually available in this session. Do not assume tool names. Use the
   real names you find.
2. If no Littlebird tools are present, stop and tell the user the skill needs the
   Littlebird MCP connected, with a link to https://support.littlebird.ai/docs/mcp/. Do
   not proceed from memory or guesswork.
3. If the tools are present but return plan errors, call the subscription status tool and
   report the plan gate.

Tool surface, parameters, return shapes, and known limitations are in
`references/littlebird-mcp-reference.md`. Read it before writing any query.

---

## Process

### 1. Frame the run

Ask with `AskUserQuestion`, in one batch:

1. **Mode.** Weekly bank build, or on-demand for a specific theme or platform.
2. **The window.** Default is the last 7 days for a weekly run, the last 30 to 90 days for
   an on-demand themed run.
3. **The platform or platforms.** Which surfaces they publish to. This sets the format mix.
4. **Content pillars.** Three or four themes their content lives in. If they do not have
   them, propose a set from the meeting topics in the window and get agreement. Three to
   four pillars is standard practice
   (`references/research/distilled-content-mining-and-repurposing.md`, section 5).
5. **On-demand only: the theme.** The specific subject they want seeds for.

Record all of it. It drives every query in step 3 and every draft in step 6.

---

### 2. Find the voice skill

Do this early, not at drafting time, because the answer changes what the output is worth.

LIST the skills available in this session and look for a personal voice skill: a name
ending in `-voice` or `-voice-skill`, or a description saying it writes in the authentic
voice of a named person. Follow `references/voice-skill-integration.md`.

- **Found.** Note it. Every draft in step 6 goes through it.
- **Not found.** Tell the user now, not in the final report, and offer the three voice
  creator skills in this marketplace: `littlebird-voice-creator`,
  `facebook-voice-creator`, `combined-voice-creator`. Offer to build one first, or to
  continue and produce drafts that carry their material but not their voice. Their choice,
  taken before the work happens.

---

### 3. Retrieval brief

Run MULTIPLE NARROW queries, never one broad one. Broad queries return oversized results
that get dumped to a file and score worse
(`references/littlebird-mcp-reference.md`, retrieval patterns). Bound every query by the
window from step 1.

**A. Enumerate the window.** `LB_INTERNAL_LIST_MEETINGS` with `start_date` and `end_date`.
This gives you the meeting inventory, including unrecorded calendar events. Only recorded
meetings carry an id. Note the ones without ids as a coverage gap: those conversations
happened and produced nothing minable.

**B. Search by seed type.** `LB_INTERNAL_SEARCH_MEETINGS` with `query`, once per seed type,
bounded by the window. The exact query sets, tuned per type, are in
`references/seed-types-and-extraction.md`. In summary, search separately for:

| Seed type | What the query is hunting |
|---|---|
| Hot take | A strong opinion stated with no hedge |
| Client story | A specific situation with a specific outcome |
| Objection handled | Someone pushed back and the user answered well |
| Analogy or metaphor | A comparison reached for when the literal version failed |
| Teaching explanation | The user explaining something to a person who did not know it |
| Contrarian observation | A noticing that runs against consensus |
| Number or result | A figure said out loud |

Use `LB_INTERNAL_SEARCH_MEETINGS` for TOPIC lookups and `LB_INTERNAL_LIST_MEETINGS` with
`name` for NAME lookups. Using the wrong one is the most common retrieval mistake against
this server (`references/littlebird-mcp-reference.md`).

**C. Pull the structured summaries.** `LB_INTERNAL_GET_MEETING` on every meeting that
returned a hit. Read `## For You` first: it is the highest-attribution surface in the whole
MCP and it is where the strongest seeds live. Then `## Decisions` and `## Action Items`,
which carry explicit owner tagging.

**D. Pull transcripts only where you need exact wording.**
`LB_INTERNAL_GET_MEETING_TRANSCRIPT`, and only for meetings that produced a candidate seed
needing a verbatim. Transcripts are long and weakly diarized. **Take wording from them.
Never take attribution from them.**

**E. Sweep the user's own written lines.** `search_user_context` with
`filters.data_source: messages` and `search_queries_messages` populated:

1. "message where I explained how something works to someone"
2. "message where I disagreed with something and said why"
3. "message where I told someone about a client situation"
4. "message where I answered a question about pricing or process"

Apply the attribution guardrail hard on this sweep. A message tagged `(From:[user])` is
theirs. Everything else in the thread is not
(`references/evidence-standards.md`, rule 4).

**F. Read your own history.** If the weekly routine exists, call
`LB_INTERNAL_GET_ROUTINE_REPORTS` before extracting anything. The same strong opinion
recurs across many calls, and re-surfacing it every week is the most likely way this skill
becomes useless.

Read the relevance scores. Items scored 3 are maybes and do not carry a seed alone
(`references/littlebird-mcp-reference.md`).

---

### 4. Attribution screening

**Run this before anything else touches a candidate.** Follow
`references/attribution-screening.md` exactly.

A meeting has multiple speakers. Raw transcript chunks are frequently tagged `[Others]`
rather than by name. Publishing someone else's line as the user's own is the highest risk
in this skill and it does not degrade gracefully.

Rank every candidate on the surface ladder in that guide. In short:

- **High:** the summary's `## For You` section, or a Decision or Action Item tagged to the
  user. Draftable.
- **Medium:** a transcript passage where the surrounding turns make the user unmistakably
  the speaker, or a two-person meeting where the other speaker is identified. Draftable,
  and flagged as Medium at the confirmation gate.
- **Low:** anything tagged `[Others]`, anything in a meeting with three or more
  participants where the speaker is not independently established, and anything from
  screen snapshots. **Goes to the "Confirm this was you" bucket. Never drafted.**

Never build a composite from two similar lines in two calls. One seed, one verbatim, one
receipt.

---

### 5. The confidentiality screen

**A distinct stage, and it runs before drafting, never after.** Follow
`references/confidentiality-screen.md`.

A meeting transcript turns a conversation that would have faded into a searchable record
that can circulate well beyond its original context
(`references/research/distilled-content-mining-and-repurposing.md`, section 7). The
speaker did not know they were writing.

Assign every surviving seed exactly one value: **Clear**, **Needs-scrub**, or
**Do-not-publish**. Hard blocks, taken from a law firm's tiered meeting classification plus
operating judgment: legal or privileged discussion, HR matters, trade secrets,
accommodation and medical, performance and discipline, a deal in progress, a private
complaint about a named person, and anything from a conversation with an implicit
confidence. Scrub items: named clients, identifying detail clusters, unreleased products,
a client's own numbers, a third party's words, a dropped hedge.

**The do-not-publish list is a mandatory output.** A content bank shipped without one means
the screen did not run.

---

### 6. Rebuild and draft

Follow `references/spoken-to-written.md`, which is the craft core of this skill, then
`references/voice-skill-integration.md` for the handoff.

Spoken register and written register are different systems, not the same language at
different tidiness levels. Only about 3% of common four-word phrase bundles overlap between
conversation and written prose, and ordinary speech runs about 6% disfluent
(`references/research/distilled-content-mining-and-repurposing.md`, section 1). **Extraction
captures the idea and the energy. Drafting rebuilds it for reading. Never paste a transcript
line as a post.**

Expect the best seeds to read worst. Speakers doing the explaining are measurably more
disfluent than speakers listening, and harder material produces more disfluency than
familiar material (same source). The teaching explanation is the highest-value seed type
and the roughest verbatim.

Cut fillers, stumble repeats, dead false starts, verbal check-ins, and re-explanations.
Keep word choice, emphasis repetition, dialect, concrete detail, hedges, and one rough
edge. Rebuild pronoun density, clause chains, order, the opening, and paragraphing.

**Do not inflate.** Material perceived as cheesy or oversentimental measurably reduces its
own effect (`references/research/distilled-content-mining-and-repurposing.md`, section 4).
If the user said "that was annoying", they did not say "a moment of profound frustration".

Draft to the three format classes the voice skills in this repo already use: long form
(500 words or more), short form (under three sentences), quick statement (eight words or
fewer). Aim for a mix. Nobody publishes fifteen essays in a week.

If a voice skill is installed, pass it the **verbatim** and let it own style. This skill
keeps authority over facts: hedges stay, clients stay unnamed, screened seeds stay
screened.

---

### 7. Confirmation gate

Every seed gets user confirmation before it becomes a published draft
(`references/evidence-standards.md`, rule 6).

Use `AskUserQuestion`. Batch the seeds. Present, for each: the verbatim exactly as
captured, the receipt, the tier and speaker confidence, and the drafted piece.

The user approves the TEXT, not a plan and not a summary. Where a seed rests on Medium
confidence, say so at the point of approval. A Low-rated claim never drives an irreversible
action (`references/evidence-standards.md`, rule 3), and posting is irreversible.

Then hand the approved drafts back. The skill does not post them.

---

## Output

Write one file: **`content-bank-YYYY-MM-DD.md`**, dated to the end of the window, in the
user's working directory unless they name another location.

Sections, in this order:

1. **Run frame.** Mode, window, platforms, pillars, and whether a voice skill was found and
   used. If none was found, the offer to build one appears here.
2. **Do not publish.** Second, so nobody misses it. Every blocked and scrub-required seed
   with its id, its category, and a one-line reason. **The sensitive verbatim is not
   reproduced here** (`references/evidence-standards.md`, rule 7).
3. **Confirm this was you.** Every Low-confidence candidate with its verbatim, receipt,
   why the tier is Low, who else was in the meeting, and what it would become if confirmed.
   No drafts attached.
4. **The bank.** 10 to 15 seeds, grouped by type. Each one shows, in this order: id, type,
   register, theme, the verbatim, the receipt, speaker confidence, why it works, and the
   draft. Verbatim and draft appear together and labeled, always.
5. **Format mix.** How many long form, short form, and quick statement, so the user can see
   whether the week is publishable as a week.
6. **Coverage.** Which meetings in the window were mined, which had no id and therefore
   could not be mined, and which seed types came back empty. An empty type is information:
   it names a conversation the user did not have.
7. **Repeats.** Anything that appeared in a previous run's bank, with a note on how many
   times it has now recurred and whether it is worth a definitive piece.
8. **Method and gaps.** Which queries ran, over which window, what came back empty, and
   what the skill could not determine.

Raw retrieved capture does not go in this file. Process it in temp space and let it go
(`references/evidence-standards.md`, rule 7).

---

## Guardrail

**The specific risk this skill carries: it takes words out of a private conversation and
puts them under the user's name in public. Two of those moves can go wrong badly, and the
third is what makes the output read as machine-written.**

1. **Publishing someone else's line as the user's own.** This is the highest risk in the
   skill and it does not degrade gracefully. A meeting has multiple speakers and the
   transcript is weakly diarized: raw chunks are frequently tagged `[Others]` rather than by
   name. A misattributed hot take published under the user's name is a reputational injury
   that a correction does not undo, and the person who actually said it will recognise it.
   The defense is the surface ladder in `references/attribution-screening.md`, run in step 4
   BEFORE anything else touches a candidate. High comes from `## For You` or an owner-tagged
   Decision or Action Item and is draftable. Medium is draftable and flagged at the gate.
   **Low is never drafted.** It goes to the "Confirm this was you" bucket with the verbatim,
   the receipt, the reason the tier is Low, and who else was in the meeting. Never build a
   composite from two similar lines in two calls: one seed, one verbatim, one receipt.
   Capture proves a line was said, not who said it
   (`references/evidence-standards.md`, rule 4).
2. **Publishing something that was never meant to leave the room.** A transcript turns a
   conversation that would have faded into a searchable record that can circulate far beyond
   its original context, and the speaker did not know they were writing. The confidentiality
   screen in step 5 is mandatory and it runs BEFORE drafting, never after, because screening
   a finished draft invites the user to argue for keeping a good post. Every surviving seed
   gets exactly one value: Clear, Needs-scrub, or Do-not-publish. **The do-not-publish list
   is a mandatory output.** A content bank shipped without one means the screen did not run.
   The list names what it blocked and why; it does not reproduce the sensitive verbatim
   (`references/evidence-standards.md`, rule 7). Other people are in every one of these
   conversations, and a third party's words are a permission question rather than an editing
   problem (rule 10).
3. **The AI tell.** This output is published under the user's name, so a draft that reads as
   machine-written costs credibility the bank cannot repay. **Zero em dashes and zero en
   dashes in any drafted seed.** Draft through the user's voice skill where one is installed,
   say plainly when one is not and point at this marketplace's voice creator skills, and
   never infer a voice profile from a transcript or from screen capture. Do not inflate:
   material perceived as cheesy or oversentimental measurably reduces its own effect
   (`references/research/distilled-content-mining-and-repurposing.md`, section 4). If the
   user said "that was annoying", they did not say "a moment of profound frustration".
   Keeping one rough edge is the point of the rebuild, not a flaw in it.

**The draft-never-send law.** Nothing is posted, published, scheduled, or written into a
third-party system without the user approving the actual final text through
`AskUserQuestion`. This holds even when a scheduling connector is present in the session and
even when the user has approved the theme, the pillar, or the seed list, because approving a
plan is not approving the words. Posting is irreversible, so a Medium-confidence seed is
labeled as such at the point of approval.

---

## Empty retrieval

If the searches return nothing for the window, **stop and report the gap. Do not fabricate
seeds.**

Say exactly which queries ran, over which window, with which filters, and that they came
back empty. Then give the user the two likely causes:

1. **No recorded meetings in the window.** Check `LB_INTERNAL_LIST_MEETINGS`. Unrecorded
   calendar events carry no id, no summary, and no transcript, and are not searchable
   (`references/littlebird-mcp-reference.md`). A week of unrecorded calls produces nothing.
2. **The window is wrong.** A window off by a few days over a light meeting week returns
   nothing.

A partial bank is reported as partial. An empty result ends the run
(`references/evidence-standards.md`, rule 9).

The same applies after screening: if attribution or confidentiality empties the bank, that
is a real finding. Report how many candidates were blocked and why, and stop.

---

## Routine wiring: the weekly seed watcher

The routine OBSERVES and notifies. The Cowork session ACTS
(`references/littlebird-mcp-reference.md`, the Routines-observe Cowork-acts pattern).
Drafting and the approval gate happen in Cowork, because a routine cannot run an approval
gate and cannot finish unattended work that requires one.

Offer it. Do not tell the user to go set it up by hand. `LB_INTERNAL_CREATE_ROUTINE` works
from an interactive session and is only blocked from inside a running routine
(`references/littlebird-mcp-reference.md`, routine tools). Check `LB_INTERNAL_LIST_ROUTINES`
first for an existing watcher, show the user the exact prompt text and the schedule, get
approval with `AskUserQuestion`, then create it. Creating one immediately generates a first
report. There is a plan-based limit on routine count; check it with
`LB_INTERNAL_GET_SUBSCRIPTION_STATUS` if creation fails.

Schedule: `{"frequency": "weekly", "time": "16:00", "week_days": ["FR"]}` in the user's
local timezone, so the bank lands before the weekend and the week is still fresh. Any later
change happens the same way, from an interactive session, with
`LB_INTERNAL_GET_ROUTINE_CONFIG` read first because `LB_INTERNAL_UPDATE_ROUTINE` REPLACES
the whole prompt and the whole schedule.

Routine prompt text to pass, with bracketed values substituted from step 1:

> Read your own previous reports first, before writing anything. Build a running list of
> every quote you have already surfaced. If a moment you already reported comes up again
> this week, do NOT list it as new. Instead, note it once at the end as a recurrence, say
> how many weeks running it has appeared, and say that it has become a core position worth
> one definitive piece rather than another mention.
>
> Search my meetings from the last 7 days for moments worth turning into content. Run
> several narrow searches rather than one broad one, one per moment type. Search
> separately for: a strong opinion I stated plainly with no hedge; a specific client
> situation with a specific outcome; a moment where someone pushed back and I answered
> well; an analogy or comparison I reached for; a passage where I explained something to
> someone who did not know it; an observation that ran against what most people assume; and
> any number, percentage, dollar amount, or timeline I said out loud.
>
> For each meeting that returns a hit, read the structured meeting summary and start from
> its For You section. That section is the most reliable indicator of what I personally
> said. Only pull the raw transcript when you need the exact wording of a line.
>
> Write a short report with four parts.
>
> First, the candidate moments where you are CONFIDENT I was the speaker, because they came
> from the For You section or from a Decision or Action Item tagged to me. For each: the
> moment type, the quote in my own words, the meeting name and date, and one sentence on
> why it would work as a post. Do not write the post. That happens in Cowork.
>
> Second, the candidates where you are NOT confident I was the speaker, because the
> transcript chunk was tagged Others or the meeting had three or more people and nothing
> established who spoke. List these separately under the heading "Confirm this was you",
> with the quote, the meeting, and who else was in the room. Never present these as mine.
>
> Third, anything you noticed that should probably never be published: client names, deal
> terms, unreleased products, private complaints about a person, or anything from a
> conversation that sounded confidential. Name the meeting and the reason. Do not quote the
> sensitive material itself.
>
> Fourth, the action line. Tell me how many confident candidates you found this week and
> tell me to open Cowork and run the said-it-already skill to screen them, rebuild them for
> reading, and draft them. If you found fewer than five confident candidates, say so plainly
> and tell me it was a light week for recorded conversation rather than padding the list.
>
> If you find no candidates at all in the last 7 days, say exactly that and stop. Do not
> invent quotes, do not attribute a line to me that you cannot support, and do not repeat
> last week's list as if it were new.

Set notifications on. The nudge is the point: the material decays from the user's memory
within days, which is the whole problem this skill exists to solve.

**Handoff.** When the user opens Cowork and runs this skill, call
`LB_INTERNAL_GET_ROUTINE_REPORTS` before step 3. The reports give you the week's candidate
list, the confirm bucket, the confidentiality flags, and the running recurrence count,
which is strictly better than rebuilding all of it from one retrieval.

---

## Evidence standards

Every claim in the deliverable follows `references/evidence-standards.md`. The rules that
bite hardest here:

- **Rule 4, attribution.** The founding rule of this skill. Capture proves a line was said,
  not who said it. Guilty until proven innocent.
- **Rule 1, receipts.** Every seed carries one: meeting name, date, and the section the
  claim came from. For messages, collection time and send time are different values and both
  appear.
- **Rule 2, observed and inferred.** The verbatim is observed. "This would perform well" is
  an inference. Mark which is which and never promote one to the other.
- **Rule 3, confidence.** Medium-confidence seeds are labeled at the approval gate. Posting
  is irreversible.
- **Rule 6, confirmation.** Every seed before it becomes a draft. The user approves text,
  not plans.
- **Rule 7, raw capture never ships.** The do-not-publish list names what it blocked. It
  does not reproduce it.
- **Rule 8, timelines.** Retrieval returns relevance order. Sort the bank by date before
  presenting anything sequential.
- **Rule 9, empty retrieval ends the run.** No padding, no plausible examples.
- **Rule 10, reporting on people.** Other people are in every one of these conversations.
  They appear only where material, with the same standards applied.

---

## What this skill does not claim

Say this to the user once, in the artifact's method section.

The research archive behind this skill is honest about its own thinness
(`references/research/README.md`). Specifically:

- **Nobody has measured whether repurposed spoken content outperforms content written from
  scratch.** Every repurposing source found assumes the value and sells the service. The
  case for this skill rests on the material being real and already tested on a live
  listener, not on a published performance claim.
- **Platform engagement numbers in this domain are mostly unsourced vendor marketing.** The
  one source found with format-level engagement percentages gives no study, no sample, and
  no method. This skill does not repeat them.
- **The only first-party platform statement in the archive is a corporate announcement.**
  LinkedIn says it is showing more posts with genuine insight and less repetitive,
  low-substance content and engagement bait
  (`references/research/distilled-content-mining-and-repurposing.md`, section 6). That is
  what the platform says it wants, not a description of how ranking works. Frame it that
  way.
- **The 10 to 15 seed target is a starting point, not a benchmark.** The only working
  volume figure in the archive is one practitioner's unsourced report.

---

## Related skills

| Skill | Relationship |
|---|---|
| `content-repurposer` | The sibling. Reach for it instead when the user already has ONE artifact and wants a week of derivatives from it under a seven-angle taxonomy. This skill MINES many sources for seeds; that one EXPANDS one chosen source. A seed from this bank is a natural input to it, and it reuses this skill's `spoken-to-written.md`, `attribution-screening.md` and `confidentiality-screen.md` by reference rather than restating them. |
| `brand-voice-guardian` | The QA pass on the way out. Reach for it when the question is whether a finished draft sounds right against a stated voice or brand standard, rather than where the raw material comes from. |
| `littlebird-voice-creator` | Builds the personal voice skill from Littlebird capture. Offer it in step 2 when no voice skill is installed. |
| `facebook-voice-creator` | Builds the personal voice skill from a Facebook data export. |
| `combined-voice-creator` | Builds it from both sources. The strongest option when the user has both. |
| `routine-architect` | Use it to tune, reschedule, or merge the weekly seed watcher beyond what this skill sets up. |

---

## Ship Gate

Ship Gate removed, research-only skill, produces no committable code.

---

## References

| File | What it covers |
|---|---|
| `references/seed-types-and-extraction.md` | The seven seed types, the seed record, per-type queries and signatures, bank composition |
| `references/attribution-screening.md` | The surface ladder, the messages guardrail, the confirm bucket, named failure modes |
| `references/confidentiality-screen.md` | The hard list, the scrub list, how to run the screen, the do-not-publish output |
| `references/spoken-to-written.md` | Why the registers differ, cut and keep and rebuild, the three ruinous mistakes, a worked example |
| `references/voice-skill-integration.md` | Detecting a voice skill, the handoff protocol, who decides what, the no-voice-skill branch |
| `references/littlebird-mcp-reference.md` | Tool inventory, parameters, return shapes, known limitations |
| `references/evidence-standards.md` | Receipts, confidence, attribution, confirmation gates, empty retrieval |
| `references/research/distilled-content-mining-and-repurposing.md` | Cited distillation of the domain research |
| `references/research/README.md` | Archive contents, source mix, evidence quality, named gaps |
