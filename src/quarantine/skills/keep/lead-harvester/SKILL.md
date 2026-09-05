---
name: lead-harvester
description: "Harvest hand-raisers from a comment-keyword campaign. Trigger on 'who
  commented my keyword', 'harvest my campaign leads', 'who DMd me about the launch',
  'build my outreach list', 'comment to get it campaign', 'I missed a bunch of DMs',
  'rank my inbound leads', 'who raised their hand'. Mines captured social activity
  across comments, DMs, friend and connection requests, and reactions, dedupes into one
  ranked roster with receipts and a coverage report, and drafts a first touch per
  segment for the user to send by hand. Drafts only. Never sends and never automates a
  platform action."
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan)"
---

# Lead Harvester

## Purpose

You run a "comment KEYWORD to get it" campaign. Dozens or hundreds of people raise a
hand. The platform shows them to you once, as a notification, and then they are gone.
Some commented. Some skipped the comment and just DM'd you. Some sent a friend request.
Some only reacted. A week later you have a vague memory of nine names and a folder of
unanswered messages, one of which says "I DMd you and you haven't responded yet".

This skill reconstructs that list from what Littlebird already captured, ranks it by how
hard each person waved, and writes the first message for every one of them.

**It drafts. It does not send, and it does not automate platform actions.** That is a
design decision, not a limitation, and `references/platform-rules.md` has the evidence.

**It is the post-mortem. `comment-to-crm-piper` is the daily drip.** Run this one after a
launch to reconstruct the whole roster with scoring and segmentation. Run the sibling every
day so the roster never has to be reconstructed. They share the extraction and matching
logic, and the sibling points at this skill's guides rather than duplicating them.

---

## Littlebird MCP calls used

Real tool names, verified against `references/littlebird-mcp-reference.md`. LIST the tools
available in this session before calling anything and use the names you actually find. Do
not assume a tool exists because it is named here.

| Tool | Used for |
|---|---|
| `search_user_context` | Every retrieval pass in step 3. `search_queries` carries the snapshot-side queries: notification pages, expanded comment threads, reaction lists, friend and connection request screens, and the campaign post itself. `search_queries_messages` carries the direct message and message request queries. `date_range` is bounded to the campaign window extended 2 days past the end date. `filters` sets `data_source` to `snapshots` or `messages` and `app` to `chrome` or the platform's native client. |
| `LB_INTERNAL_LIST_ROUTINES` | Checking whether the campaign watcher already exists before offering to create one. |
| `LB_INTERNAL_GET_ROUTINE_REPORTS` | The handoff. Reading the watcher's own past reports before step 3, for the day-by-day timeline and the running gap count. |
| `LB_INTERNAL_GET_ROUTINE_CONFIG` | Reading the current routine before any update, because `prompt` and `schedule` each REPLACE the whole field. |
| `LB_INTERNAL_CREATE_ROUTINE` | Creating the campaign watcher, from an interactive session only. |
| `LB_INTERNAL_UPDATE_ROUTINE` | Rescheduling or pausing it later, from an interactive session only. |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | Explaining a plan gate or a routine-count limit. |

**Not used, and deliberately.** The meeting tools `LB_INTERNAL_LIST_MEETINGS`,
`LB_INTERNAL_SEARCH_MEETINGS`, `LB_INTERNAL_GET_MEETING` and
`LB_INTERNAL_GET_MEETING_TRANSCRIPT` are real, but a comment-keyword campaign lives on
social surfaces rather than in calls, so this skill does not touch them. There is also no
Littlebird tool that searches past Littlebird chat conversations and no calendar tool.
Anything that looks like `search_chats` or `get_calendar` is not real; use
`search_user_context` and say so.

**CRM and platform tools are NOT Littlebird tools.** GoHighLevel, HubSpot, Gmail and the
rest are separate MCP servers that may or may not be connected in this session. List the
tools first, and degrade to a file or a copy-paste block when a connector is absent.

---

## Trigger

Fires on: who commented my keyword, harvest my campaign leads, who DMd me about the launch,
build my outreach list, comment to get it campaign, I missed a bunch of DMs, rank my inbound
leads, who raised their hand.

Also fires when the user opens Cowork after a notification from the campaign watcher
routine.

Do NOT fire this for the everyday "anyone new since yesterday" question. That is
`comment-to-crm-piper`.

---

## Routine cadence

**On demand is primary.** This skill is a campaign post-mortem and most runs are one-off.

The optional watcher runs DAILY during an active campaign window, default
`{"frequency": "daily", "time": "17:00"}` in the user's local timezone, so the nudge lands
while the window is still open. Offer it only when the user says they run these campaigns
constantly or has a window open right now, and offer to pause or delete it when the campaign
closes.

Offer to create it rather than telling the user to go set it up by hand.
`LB_INTERNAL_CREATE_ROUTINE` works from an interactive session and is only blocked from
inside a running routine. Show the exact prompt text and the schedule, get approval with
`AskUserQuestion`, then call it.

The routine OBSERVES and the Cowork session ACTS
(`references/littlebird-mcp-reference.md`, the Routines-observe Cowork-acts pattern). The
scoring, the ambiguous-merge questions, the drafting and the approval gate all happen in the
interactive session, because a routine cannot run an approval gate. Exact prompt text is in
the routine wiring section below.

---

## Capability gate

This skill requires the **Littlebird MCP on a Power or Pro plan**.

1. LIST the tools actually available in this session. Do not assume tool names. Use the
   real names you find.
2. If no Littlebird tools are present, stop and tell the user the skill needs the
   Littlebird MCP connected, with a link to https://support.littlebird.ai/docs/mcp/. Do
   not proceed on capture-free guesswork.
3. If the tools are present but return plan errors, call the subscription status tool and
   report the plan gate to the user.

Tool surface, parameters, and return shapes are documented in
`references/littlebird-mcp-reference.md`. Read it before writing any query.

---

## Process

### 1. Frame the campaign. Do not guess.

Never infer which post was the campaign. Ask, with `AskUserQuestion`, in one batch:

1. **The keyword.** The exact word or phrase you asked people to comment.
2. **The campaign window.** Start and end dates. Offer sensible options: the last 7 days,
   the last 14 days, the last 30 days, or a custom range.
3. **The platform.** Facebook, Instagram, LinkedIn, X, or several.
4. **The post.** Enough to identify it: a URL if they have one, otherwise the date and
   the first line of the post text.
5. **The offer.** What they promised to send. The first touch has to deliver it.

Record all five. They drive every query in step 3 and every draft in step 6.

---

### 2. Pre-flight. Offer the capture protocol.

This is the skill's power move, and it happens BEFORE the harvest.

Littlebird records what is on screen. Social notification UIs collapse rosters into "X, Y
and 4 others commented" and "12 people reacted", so a roster built from ambient
notification capture alone is partial by construction. Thirty to sixty seconds of the user
slowly scrolling the expanded comment thread converts a partial roster into a
near-complete one, because capture reads the names that render.

Ask the user whether they have scrolled the full thread since the campaign started.

- **If no:** give them the platform-specific instructions from
  `references/capture-protocol.md`, tell them it takes under a minute, and offer to wait.
  If they would rather see partial results now, run the harvest and flag the gap loudly.
- **If yes:** note when, and set the retrieval window to include it.

Never run a harvest and hand back a thin roster without telling the user that a 60-second
action would have made it much thicker.

---

### 3. Retrieval brief

Run MULTIPLE NARROW queries, not one broad one. A broad query returns oversized results
that get dumped to a file, and it scores worse
(`references/littlebird-mcp-reference.md`, retrieval patterns). Every query below is
bounded by the campaign window from step 1, extended 2 days past the end date to catch
late arrivals.

Substitute the real keyword, platform, and dates. Run these as parallel calls where the
harness allows it.

**A. Comment and notification surfaces.** `search_user_context`, `data_source: snapshots`,
`app: chrome` (add the platform's own app where the user works in a native client):

1. "notifications page showing who commented on my post"
2. "comment thread on my post with commenter names and comment text"
3. "KEYWORD comment on post" using the actual keyword
4. "post notification saying and others commented on your post"
5. "list of people who reacted to my post"

**B. Direct message surfaces.** `search_user_context`, `search_queries_messages`
populated, `data_source: messages`:

1. "message asking about the KEYWORD post or the free resource"
2. "new message request from someone I do not have a thread with"
3. "message saying I commented on your post" and "message saying I DMd you"
4. "someone asking when they will receive the thing I promised"

**C. Request surfaces.** `data_source: snapshots`:

1. "friend requests screen with pending request names"
2. "LinkedIn invitations pending with names"
3. "new follower notification"

**D. Carry-forward.** Same queries as A and B, with a date window covering the PREVIOUS
campaign, to find people who raised a hand and never got a reply.

**E. Campaign copy check.** One query for the post itself, to read the wording. Meta
prohibits gating promised material behind required engagement, so if the post says the
material is only available by commenting, flag it. See `references/platform-rules.md`.

Read the relevance scores. Items scored 3 are maybes and do not carry a claim alone
(`references/littlebird-mcp-reference.md`).

---

### 4. Extract and dedupe

Follow `references/signal-extraction-and-dedupe.md` exactly. In short:

- Every extracted signal is a ROW carrying display name, signal type, event time, receipt,
  surface, verbatim text, and confidence.
- Deduplicate identical OCR lines before counting anything.
- Sort by event time, not by retrieval relevance.
- Merge rows into people using the matching ladder. Tiers 1 and 2 merge automatically.
  Tiers 3 through 6 require corroboration or a question.
- **Surface ambiguous merges with `AskUserQuestion`. Never merge silently.** Batch them
  into one question. A bad merge sends a message to the wrong person and is invisible in
  the output; two unmerged rows are a duplicate the user fixes in a second.
- Record every "and N others" and "N people reacted" string as a countable member of the
  unnamed gap, with its own receipt.
- Do not attribute the user's own replies or a comment bot's public replies to a
  hand-raiser (`references/evidence-standards.md`, rule 4).

---

### 5. Score and segment

Follow `references/scoring-and-segmentation.md`. Base points by signal (DM 5, keyword
comment 4, on-topic comment 4, friend or connection request 3, thread reply 3, reaction 1),
plus a combination bonus for multiple distinct signal TYPES, times a recency multiplier,
plus content adjustments. Segments: Hot, Warm, Light, Ambient, Carry-forward, Excluded.

Two things to state in the deliverable:

1. This ranks priority. It does not qualify buyers. A hand-raiser is a marketing-qualified
   lead at best, and BANT-style qualification happens in the conversation that follows.
2. The weights are a defensible starting point constructed from published recency and
   frequency scoring practice, not a validated instrument. The user should tune them.
   Show the arithmetic so they can.

---

### 6. Draft the first touches

Follow `references/first-touch-drafting.md`.

Short and casual, under 60 words for Hot and Warm. Four parts: the specific receipt of
what they did, the thing they asked for, one question or none, and no pitch. Hot segment
gets individually written messages. Warm gets a segment template with a mandatory
personalization slot filled from that person's own verbatim. Ambient defaults to no
individual DM at all, with a public thank-you offered instead.

If a personal voice skill is installed in this workspace, list the available skills, find
it, and draft through it. If none is installed, write plainly and say so in the
deliverable. Do not build a voice model from screen capture: capture shows what the user
was viewing, not what they wrote (`references/evidence-standards.md`, rule 4).

Draft at most the opener plus two follow-ups. The published lift concentrates on the
SECOND follow-up, and the third onward is marginal.

---

### 7. Confirmation gates

Two gates, both `AskUserQuestion` (`references/evidence-standards.md`, rule 6).

**Before encoding.** Ambiguous merges, uncertain names, and anything about to be written
down as durable fact about a person gets confirmed first.

**Before sending.** Present the actual draft TEXT, not a summary of it, and get explicit
approval per batch. Approval attaches to text, never to a plan or a segment. Where a draft
rests on a Low-confidence row, say so at the point of approval: a Low-rated claim never
drives an irreversible action, and messaging a misidentified person is irreversible.

Then hand the approved drafts back for the user to send by hand. The skill does not send
them.

---

## Output

Write one file: **`campaign-harvest-YYYY-MM-DD.md`**, dated to the campaign end date, in
the user's working directory unless they name another location.

Sections, in this order:

1. **Campaign frame.** Keyword, window, platform, post pointer, offer. As confirmed in
   step 1.
2. **Coverage report.** Mandatory, and it comes second so nobody misses it. Named count,
   estimated total, coverage percentage, then the unnamed gap broken down by surface with
   receipts, then the pointer to the exact post and the instruction to run the capture
   protocol to close it. State that overlap between reaction and comment counts makes the
   estimated total a ceiling rather than a headcount.
3. **Ranked roster.** Every person, by segment then score. Each row: rank, name, segment,
   score, every signal with its event time and receipt, the verbatim that matters, and a
   confidence rating.
4. **Ambiguous merges.** Pairs the skill did not resolve, with both receipts, and how the
   user resolved them if they did.
5. **Excluded.** Hostile rows, organization pages, unresolvable rows. Named with reasons.
   Never silently dropped.
6. **Carry-forward.** People from the previous campaign who never got a reply.
7. **Drafted first touches.** Grouped by segment, in full text, marked approved or
   pending.
8. **Scoring model used.** The weights, so the user can audit and tune them.
9. **Compliance notes.** Anything flagged: engagement-gating in the campaign copy, an
   expired 7-day Meta reply window, a channel change to email that triggers CAN-SPAM.
10. **Method and gaps.** Which queries ran, what came back empty, and what the skill could
    not determine.

Raw retrieved capture does not go in this file. Process it in temp space and let it go
(`references/evidence-standards.md`, rule 7).

---

## Guardrail

**This skill builds a list of real people from a partial record and then writes messages to
them. Four things follow from that, and none of them are optional.**

1. **Only engagement on the user's OWN posts is harvestable.** The campaign frame in step 1
   pins the post, and step 3E reads the post itself to confirm it. Someone who commented on
   a competitor's post, a group thread, or a shared article did not raise a hand at the
   user. Harvesting them is scraping a stranger's audience, and it produces a first message
   nobody asked for.
2. **Never present a partial roster as complete.** The coverage report is mandatory and it
   is section 2 of the artifact for that reason. Social UIs collapse rosters into "and 4
   others" and "12 people reacted", so the named set is a floor, never a total
   (`references/evidence-standards.md`, rule 5). Report the named count, the unnamed gap
   broken down by surface with receipts, and the capture protocol that closes it. Say that
   overlap between reaction and comment counts makes the estimated total a ceiling rather
   than a headcount. A roster with no coverage report is not finished.
3. **Never automate a platform action and never auto-send.** No bulk friend requests, no
   scripted connection invites, no automated DM blast, no queued sequence, not even where a
   connector in the session would technically allow it. The prohibitions, the rate limits
   and the account-risk evidence are in `references/platform-rules.md`. Every draft is
   handed back for the user to send by hand.
4. **A private message's contents never enter a shared export.** A direct message counts as
   a signal: sender name, send time, receipt, and the fact that a message arrived. Pull the
   verbatim only where it is needed to personalize that same person's first touch, and keep
   it out of anything that leaves the user's own working file
   (`references/evidence-standards.md`, rule 7). Nothing derived from another person's
   private messages ends up in a shared artifact or a third-party system.

**The draft-never-send law.** Nothing is sent, posted, or written into a third-party system
without the user approving the actual final text or payload through `AskUserQuestion`. This
holds even when the user has approved the plan, the segment, or the scoring, because
approving a plan is not approving the words. Messaging a misidentified person is
irreversible, so a draft resting on a Low-confidence row says so at the point of approval.

Two more that bite in practice, both surfaced in the compliance notes of the artifact:
engagement-gating in the campaign copy, which Meta prohibits, and a channel change to email,
which brings CAN-SPAM into play. Surface the jurisdiction; do not give legal advice.

---

## Empty retrieval

If the searches return nothing for the campaign window, **stop and report the gap. Do not
fabricate a roster.**

Say exactly which queries ran, over which window, with which filters, and that they came
back empty. Then give the user the two things that could fix it:

1. Run the capture protocol in `references/capture-protocol.md` and re-run the harvest.
   The most common cause of an empty result is simply that the operator never had the
   comment thread open while Littlebird was watching.
2. Check the campaign window. A window off by a few days returns nothing.

A partial result is reported as partial. An empty result ends the run
(`references/evidence-standards.md`, rule 9).

---

## Routine wiring: the active campaign watcher

Optional. Offer it only when the user says they run these campaigns constantly or has an
active window open. The routine OBSERVES, the Cowork session ACTS
(`references/littlebird-mcp-reference.md`, the Routines-observe Cowork-acts pattern).

Offer it. Do not tell the user to go set it up by hand. `LB_INTERNAL_CREATE_ROUTINE` works
from an interactive session and is only blocked from inside a running routine
(`references/littlebird-mcp-reference.md`, routine tools). Check
`LB_INTERNAL_LIST_ROUTINES` first for an existing watcher, show the user the exact prompt
text and the schedule, get approval with `AskUserQuestion`, then create it. Creating one
immediately generates a first report. There is a plan-based limit on routine count; check it
with `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` if creation fails.

Schedule: `{"frequency": "daily", "time": "17:00"}` during the campaign window, in the
user's local timezone. Pausing, rescheduling or deleting it later happens the same way, from
an interactive session, with `LB_INTERNAL_GET_ROUTINE_CONFIG` read first because
`LB_INTERNAL_UPDATE_ROUTINE` REPLACES the whole prompt and the whole schedule.

Routine prompt text to pass, with the bracketed values substituted from step 1:

> Read your own previous reports first before writing anything. If an item you already
> flagged is still unresolved, escalate it rather than restating it: say how many days
> running it has appeared and raise its priority in this report.
>
> Search my captured context for the last 24 hours for activity on my [PLATFORM] campaign
> using the keyword [KEYWORD], posted on [DATE]. Run several narrow searches rather than
> one broad one. Cover: notification pages naming people who commented on my post,
> expanded comment threads, reaction lists, new direct messages and message requests
> mentioning the post or the offer, and pending friend or connection requests.
>
> Write a short report with four parts.
>
> First, the new hand-raisers you can NAME since your last report, each with the signal
> they gave, the time of the signal, and the receipt in the form
> [Day, Month DD, YYYY HH:MM TZ | app].
>
> Second, the UNNAMED gap: every "and N others" or "N people reacted" string you saw, with
> the number, the surface it came from, and its receipt. Never present the named list as
> if it were complete.
>
> Third, anyone who has now given a SECOND or THIRD distinct signal, for example someone
> who commented earlier and has now also sent a direct message or a friend request. Call
> these out at the top as the hottest leads.
>
> Fourth, the action line. If the unnamed gap is larger than the named set, tell me to
> open the post, expand the full comment thread, and scroll it slowly for sixty seconds so
> capture can read the names. Then tell me to open Cowork and run the lead-harvester skill
> to build the ranked roster and draft the outreach.
>
> If you find no new activity in the last 24 hours, say exactly that and stop. Do not
> invent names and do not repeat yesterday's list as if it were new.

Set notifications on so the user gets the nudge while the window is still open.

**Handoff.** When the user opens Cowork and runs this skill, read the routine's own past
reports with the routine reports tool before running step 3. They give you the day-by-day
timeline, the names captured while the thread was fresh, and the running gap count, which
is strictly better than reconstructing it all from one retrieval at the end.

---

## Evidence standards

Every claim in the deliverable follows `references/evidence-standards.md`. The rules that
bite hardest here:

- **Rule 5, partial rosters.** This skill's central obligation. Named set with receipts,
  count of unnamed entries and where they came from, and what the user can do to close the
  gap. A roster with no coverage report is not finished.
- **Rule 1, receipts.** Every signal carries one. For messages, the send time and the
  collection time are different values and both appear.
- **Rule 2, observed and inferred.** "Dani commented SYSTEM" is observed. "Dani is your
  hottest lead" is inferred from the signals it rests on. Mark which is which.
- **Rule 4, attribution.** Capture shows what the user was viewing. The operator's own
  replies and a comment bot's public replies are not hand-raiser signals.
- **Rule 6, confirmation.** Ambiguous merges before encoding. Actual draft text before
  sending.
- **Rule 8, timelines.** Sort by event time. Retrieval returns relevance order.
- **Rule 10, reporting on people.** Purpose-bound to the campaign. Provenance on every
  line. Sensitive categories stay out even when the capture contains them.

---

## Related skills

| Skill | Relationship |
|---|---|
| `comment-to-crm-piper` | The continuous sibling. Reach for it instead when the question is "anyone new since yesterday": it runs daily, works only the window since its last run, dedupes each person against the CRM, and pipes them in. This skill is the post-mortem that reconstructs a whole campaign after the fact. The sibling reuses this skill's `signal-extraction-and-dedupe.md`, `capture-protocol.md`, `first-touch-drafting.md` and `platform-rules.md` rather than duplicating them. |
| `deal-pipeline-reconstructor` | Reach for it instead once a hand-raiser has become a live deal. This skill ranks inbound priority and stops at the first touch; that one reconstructs where a real opportunity actually stands. |
| `testimonial-miner` | Reach for it instead when the goal is the other end of the relationship: finding customers who already said something good, rather than prospects who just raised a hand. |
| `routine-architect` | Use it to tune, reschedule, or merge the campaign watcher beyond what this skill sets up. |
| A personal voice skill | If one is installed, the first touches draft through it. If none is installed, this skill writes plainly, says so in the deliverable, and points at this marketplace's voice creator skills. Never build a voice model from screen capture. |

---

## Ship Gate

Ship Gate removed, research-only skill, produces no committable code.

---

## References

| File | What it covers |
|---|---|
| `references/capture-protocol.md` | The pre-flight scroll, per platform, and how to verify it worked |
| `references/signal-extraction-and-dedupe.md` | Signal rows, the matching ladder, failure modes, the coverage report |
| `references/scoring-and-segmentation.md` | The scoring model, the segments, and what the model is not |
| `references/first-touch-drafting.md` | Message shape per segment, follow-up sequencing, voice, the approval gate |
| `references/platform-rules.md` | What each platform prohibits, rate limits, account risk, CAN-SPAM |
| `references/littlebird-mcp-reference.md` | Tool inventory, parameters, return shapes, known limitations |
| `references/evidence-standards.md` | Receipts, confidence, attribution, partial rosters, confirmation gates |
| `references/research/distilled-keyword-comment-lead-generation.md` | Cited distillation of the domain research |
| `references/research/README.md` | Archive contents, source mix, and named research gaps |
