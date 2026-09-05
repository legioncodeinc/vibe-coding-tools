---
name: meeting-scribe
description: "Post-meeting follow-up. Trigger on \"write the follow-up\", \"recap that call\",
  \"draft the follow-up email\", \"what did we decide\", \"send a recap to the client\",
  \"what did we not resolve\", \"sweep today's meetings\". Turns one recorded Littlebird
  meeting into three things the built-in summary does not give you: a decisions record with
  the exact quote and timestamp behind each one, a sendable follow-up drafted in your voice
  and filtered for what those recipients should actually see, and a list of what got raised
  and never landed. Commitments are handed to the standing ledger. Runs on demand right
  after a call, or as a daily evening sweep. Requires the Littlebird MCP."
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan)"
---

# Meeting scribe

## Purpose

Littlebird already writes the meeting summary. `LB_INTERNAL_GET_MEETING` returns
`## Executive Summary`, `## For You`, `## Topics Discussed`, `## Decisions` with a decider
tag, `## Action Items` with an owner tag per line, and `## Risks / Open Questions`
(`references/littlebird-mcp-reference.md`).

**So a skill that produces a meeting summary is worthless.** This one produces the four
things that summary does not:

1. **The outbound artifact.** A follow-up message the user can actually send, written for
   the recipients rather than for the user, with a confidentiality filter run before
   drafting. The built-in summary contains the private `## For You` section and the model's
   own internal observations, and forwarding it is a mistake with no undo. The
   internal-versus-shareable filter is a core function, not a polish step.
2. **Decision durability.** Each decision anchored to the exact quote and the timestamp
   behind it, so a disputed "we agreed X" is settled by evidence rather than by whoever
   remembers harder.
3. **The unresolved list.** Not a copy of `## Risks / Open Questions`. The valuable tier is
   the question that got asked and then talked over, which nobody parked because nobody
   registered it. That is where things quietly die.
4. **A recipient-aware split** where the room held multiple parties with different
   interests, for example a partner call where one recap goes to the partner and a different
   one goes to the internal team.

Commitments are extracted, stated in the recap, and handed off. They are not tracked here.
`commitment-tracker` owns the standing ledger across all meetings over time. This skill
owns the first 24 hours after one call.

Full argument, the gap table, and the division of labor:
`references/beyond-the-builtin-summary.md`.

## Capability gate

This skill requires the **Littlebird MCP on a Power or Pro plan**.

Before anything else:

1. **List the tools actually available in this session** and use the real tool names. Do not
   assume a tool exists because it appears in `references/littlebird-mcp-reference.md`.
2. If no Littlebird MCP tools are present, **stop** and tell the user: "This skill needs the
   Littlebird MCP connected on a Power or Pro plan. Connect it at
   https://support.littlebird.ai/docs/mcp/ and run this again." Do not attempt a partial run
   from memory or from other sources.
3. **List the tools again before mentioning any send path.** Email connectors are separate
   MCP servers that may or may not be connected in this session. Never assume one exists.
4. If the user asks to create the evening routine, call
   `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` first to confirm the plan supports another routine.

Read `references/evidence-standards.md` before writing any output. Every line in every
artifact is observed, inferred, external, or unknown, and the kind is visible to the reader.

## Littlebird MCP calls used

| Tool | Used for | Notes |
|---|---|---|
| `LB_INTERNAL_LIST_MEETINGS` | Finding the target meeting, or enumerating the day | Entries with an id are recorded. Entries without one are unrecorded calendar events with no summary and no transcript. Name lookup uses this tool; topic lookup uses `SEARCH_MEETINGS`. |
| `LB_INTERNAL_GET_MEETING` | The structured summary AND the linked calendar event with its attendee list | The attendee list is what makes recipient-aware drafting possible. Everything about who owns what comes from here. |
| `LB_INTERNAL_GET_MEETING_TRANSCRIPT` | Exact wording only | Transcripts are long. Two legitimate reasons: a decision quote with its timestamp, and the unresolved sweep. Never to build recap prose, never to confirm an owner. |
| `LB_INTERNAL_CREATE_ROUTINE` | Creating the evening sweep, on user approval | Works from an interactive session. Blocked only from inside a running routine. |
| `LB_INTERNAL_GET_ROUTINE_CONFIG` | Before any routine edit | `UPDATE_ROUTINE` replaces the whole prompt and the whole schedule. |
| `LB_INTERNAL_GET_ROUTINE_REPORTS` | Reading past sweeps so a handled meeting is not re-flagged | Both the routine and the on-demand run call this. |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | Confirming the plan allows another routine | Before `CREATE_ROUTINE`. |

Exact call shapes, parameters, and the transcript-only-meeting case:
`references/beyond-the-builtin-summary.md`, retrieval brief section.

## Trigger

**On demand.** "Write the follow-up", "recap that call", "draft the follow-up email", "what
did we decide", "send a recap to the client", "what did we not resolve", "who owes what
after that meeting". Runs against the most recent recorded meeting unless the user names a
different one.

**From the routine.** The evening sweep names meetings that need a follow-up sent. The user
opens Cowork and runs this skill against a named meeting.

## Routine cadence

Daily, evening, after the day's meetings are done. Default 18:00 local.

The routine observes and reports. It cannot send, cannot hold an approval gate open, and
cannot create or update routines (`references/littlebird-mcp-reference.md`). It hands off
to Cowork. Exact prompt text in the routine wiring section below.

## Process

### 1. Find the meeting and pull the summary

`LB_INTERNAL_LIST_MEETINGS` for the day or the named meeting, then `LB_INTERNAL_GET_MEETING`
on the id. Split recorded meetings from unrecorded calendar events and report the unrecorded
count as a coverage gap.

Call shapes and the empty-retrieval branch: `references/beyond-the-builtin-summary.md`.

**A recorded meeting with no linked calendar event has no attendee list.** Recipient-aware
drafting cannot proceed on it. The decisions record, the unresolved list, and the commitment
handoff all still run. The skill says so plainly and offers to draft against a
user-supplied recipient list, marked as user-supplied. It never infers attendees from the
transcript. Full handling: `references/beyond-the-builtin-summary.md`, transcript-only
meeting section.

### 2. Capture decisions with their evidence

Take each entry from `## Decisions` verbatim with its decider tag. Fetch the transcript once
and locate the passage where each decision was reached. Record the exact wording and the
timestamp.

Nine fields per entry, the supersession rule, the three handlings for a quote that cannot be
found, and what ships to which destination: `references/decision-capture.md`.

### 3. Sweep for what never landed

Three tiers: acknowledged open questions from the summary, explicitly parked items found by
scanning the transcript for deferral phrases, and talked-over questions found by reading
forward from each interrogative.

Tier 3 is the one worth having and the one with no documented method behind it. The scan,
its two failure modes, the attribution constraint, and the output shape:
`references/unresolved-detection.md`.

### 4. Filter, split, draft, hold

Audience from the attendee list. Then the confidentiality filter, run **before** drafting,
stripping third-party commentary, pricing the recipient should not see, side conversation,
the private `## For You` block, internal observations, internal-only risks, unverified
attributions, and anything rated Low confidence.

Then the recipient-aware split where the room had multiple parties. Then voice. Then the
draft. Then the approval gate.

The full six-step order, the strip list, the split procedure, the voice check, the drafting
spec, and the approval prompt: `references/recipient-aware-recaps.md`.

### 5. Hand commitments to the ledger

Do not re-derive the commitment harvest here. The field list, the attribution rule, the
two-column sort, the `Unassigned` handling, and the recurring-meeting deduplication live in
the SEPARATE `commitment-tracker` skill, in its own references folder, in the file named
`harvesting-commitments.md`. That file is not in this skill. Open the installed
`commitment-tracker` skill and read it there.

This skill's only addition is one field the ledger cannot compute for itself: whether the
commitment appears in an outbound draft the user approved. A commitment the counterparty has
seen in writing is a different object from one that lives in an internal summary. Handoff
block shape: `references/beyond-the-builtin-summary.md`.

### The attribution rule, which governs every step

**Attribution comes from the summary's structured blocks. Never from a raw transcript
chunk.** Raw chunks are weakly diarized and frequently tagged `[Others]`
(`references/littlebird-mcp-reference.md`). Quote raw transcript for exact wording only.

An owner tagged `Unassigned` stays `Unassigned` and appears in the recap as an item that
still needs an owner. It is never assigned to a guess. Where the summary and the transcript
appear to disagree, report both and say they disagree
(`references/evidence-standards.md`, rule 10). It does not go in the outbound draft.

The cost is asymmetric. A wrong owner in an internal note is an annoyance. A wrong owner in
a message sent to four attendees tells a named person, in writing, that they promised
something they did not. That is a relationship cost and it cannot be recalled.

## Output

An on-demand run writes one file:

```
meeting-followup-YYYY-MM-DD-slug.md
```

in the working directory, or the directory the user names. `slug` is the meeting name in
kebab-case. Sections, in this order:

1. **Coverage.** Meeting name, date, duration, attendee list with domains, whether a
   calendar event was linked, whether a transcript was fetched and why.
2. **Decisions.** One entry each, nine fields: decision verbatim, decided by, meeting and
   date, evidence quote, timestamp, status of standing or superseded or contested, context,
   alternatives or `none recorded`, and who was in the room.
3. **Outbound draft or drafts.** One block per audience. Each carries its recipient list,
   subject line, and full body verbatim as it would send. Held for approval. Never sent.
4. **Filter report.** One line per stripped item: the item, and the category it matched.
5. **Unresolved.** Three tiers in order. Columns: tier, item verbatim, timestamp, deferral
   phrase for tier 2, confidence for tier 3, owner or `unowned`, suggested next step.
6. **Commitment handoff.** One row per commitment: text verbatim, owner, meeting, date,
   stated deadline or `none stated`, origin, and shared-externally yes or no.
7. **Gaps.** Anything the run could not do, named. Missing attendee list, decisions with no
   locatable quote, tier 3 items rated Low, meetings in the window that were not recorded.

Raw retrieved capture is working data. It does not ship in the artifact
(`references/evidence-standards.md`, rule 7).

**Never open the artifact with a statistic about meeting follow-up.** No study in the
research archive tests whether sending a recap improves follow-through, and the sweep for
one returned cold-outreach content marketing
(`references/research/distilled-meeting-followup.md`, sections 1 and 7). The recap is worth
sending for the reasons in `references/beyond-the-builtin-summary.md`, not because of a
number.

## Empty retrieval

If `LIST_MEETINGS` returns nothing for the window, or every returned entry is an unrecorded
calendar event, report the window searched and the counts found, and stop.

If the summary has no `## Decisions` block and no `## Action Items` block, that is a real
result for a meeting that decided nothing. Say so, produce the unresolved list if
`## Risks / Open Questions` has anything in it, and do not manufacture a recap around
nothing.

If all three unresolved scans come back empty, report the three scans that ran and that each
was empty. That is a good outcome, not a failed run.

Do not widen the window silently. Do not substitute plausible content. Do not reason from
what was probably discussed (`references/evidence-standards.md`, rule 9).

## Guardrail

**The specific risk this skill carries is sending the wrong thing to the wrong person, in
writing, permanently.**

Three failure modes, each with its rule.

**Wrong attribution.** Naming the wrong owner in a message four people read. Governed by
the attribution rule above. Owner comes from the summary tag or the item goes out unowned.

**Wrong content.** Forwarding internal material outward. The default behavior of this entire
tool category is to push the internal artifact out to everyone: summaries and transcripts
are circulated to attendees automatically, and the leading product ships a one-click option
to auto-share the generated summary with all invitees including external participants, with
no review step in between
(`references/research/distilled-meeting-followup.md`, section 4). The default is the defect.
The filter runs before drafting, and the filter report is shown to the user, because a
filter nobody can see is a filter nobody can correct.

**Wrong confidence.** Sending a generated claim nobody verified. Generated summaries fill
gaps with incorrect guesses rather than marking a passage inaudible, and they fabricate
outright, and both failures read as fluent confident prose
(`references/research/distilled-meeting-followup.md`, section 4). A professional regulator
states the rule directly: an AI summary of a client meeting should not be relied upon until
the participant has reviewed and verified it
(`references/research/distilled-meeting-followup.md`, section 4). The user was in the room.
They are the only reader who can catch it.

### The draft-never-send law

**The follow-up is a draft. Always.** Nothing reaches attendees without the user approving
the actual final text. Not a summary of the text. Not the plan to send it. The words.

This holds even where an email connector is present in the session, and even where the user
already approved the plan, because approving a plan is not approving the words. If no
connector is present, say so and produce a copy-paste block with the recipient list and
subject line. The degraded path is the normal path.

### The recording disclosure prompt

A recap that quotes the call verbatim tells every recipient it was recorded and transcribed.
No jurisdiction treats a visible recording bot in the participant list as legally sufficient
notice on its own (`references/research/distilled-meeting-followup.md`, section 6), so a
recipient may genuinely not know.

Before including any verbatim quote in an outbound draft, surface this with
`AskUserQuestion` and offer plain prose instead, which is the default.

**The skill gives no legal advice.** It does not determine jurisdiction and does not tell the
user whether their recording was lawful. The two best sources in the archive disagree about
which states require everyone's agreement, ten states appear in both lists and four are
disputed, and neither list was checked against statute
(`references/research/distilled-meeting-followup.md`, section 6). The skill surfaces the
fact. The user decides.

## Routine wiring

Offer to create the evening sweep. Show the user the exact prompt text and the schedule, get
approval through `AskUserQuestion`, then call `LB_INTERNAL_CREATE_ROUTINE`. Do not tell the
user to go set it up by hand. Creating it generates a first report immediately, then it runs
on schedule.

```
title:    Evening meeting sweep
schedule: {"frequency": "daily", "time": "18:00"}
notifications_enabled: true
email_notifications_enabled: false
```

Exact `prompt` text to pass:

```
You are sweeping today's recorded meetings and reporting what still needs a human.

STEP 1. MEMORY FIRST. Before anything else, call LB_INTERNAL_GET_ROUTINE_REPORTS for
this routine with limit 5 and read every past report. Build a list of every meeting you
have already reported on, by name and date, and note which ones you flagged as needing a
follow-up sent. You will need this in step 5. Do not skip this step. Re-flagging a
meeting you already handled is a failed report.

STEP 2. ENUMERATE. Call LB_INTERNAL_LIST_MEETINGS with start_date and end_date both set
to today, and limit 25. Split the result into two groups: entries that carry an id,
which are recorded, and entries with no id, which are unrecorded calendar events with no
summary and no transcript. Count both. You will report both counts.

STEP 3. READ THE SUMMARIES. Call LB_INTERNAL_GET_MEETING on every recorded id. From each
one take the Decisions block, the Action Items block with the owner tag on each line, the
Risks and Open Questions block, and the linked calendar event with its attendee list.
Copy every item verbatim. Take every owner from the tag on the item. Never take an owner
from a transcript chunk, because transcript chunks are weakly diarized and are often
tagged Others. Do not fetch any transcript. Transcripts are long and this report does not
need exact wording.

STEP 4. WRITE THE DAY. For each recorded meeting report, in this order: the meeting name
and time, the attendee list or the words no linked calendar event so no attendee list,
every decision verbatim with its decider tag, every action item verbatim with its owner
tag or the word Unassigned, and every open question verbatim. Never guess an owner for an
item tagged Unassigned. Never paraphrase a decision.

STEP 5. FLAG WHAT NEEDS A FOLLOW-UP SENT. A meeting needs a follow-up when at least one
of these is true: it had at least one attendee whose email domain is different from the
user's, it produced at least one decision, or it produced at least one action item owned
by someone other than the user. Check each candidate against the list you built in step
1. If you already flagged this exact meeting in a past report, do not flag it again as
new. Instead say it was flagged on the earlier date and ask whether the follow-up went
out. If you have flagged the same meeting three or more times, put it at the top of the
report under a heading called STILL UNSENT, say how many days it has been, and say the
window for a useful recap has passed and the right move now is a short direct message
rather than a recap.

STEP 6. NAME WHAT DID NOT LAND. For each meeting, list every entry from the Risks and
Open Questions block that has no matching action item. These are questions the meeting
raised and did not resolve. Report them verbatim with the meeting name. Do not try to
detect questions that were talked over. That needs the transcript and this report does
not fetch transcripts.

STEP 7. COVERAGE. End with the counts: meetings recorded today, meetings on the calendar
today that were not recorded, decisions found, action items found, open questions found.

RULES.
Report only what the summaries actually contain. Never report what a meeting probably
covered.
Quote decisions, action items and open questions verbatim. Do not tighten them.
Every item carries its meeting name and date.
Do not draft any message to anyone. Do not send anything. You cannot send and you cannot
hold an approval, so do not try.
If LIST_MEETINGS returns nothing for today, say today had no recorded meetings and stop.
Do not widen the window and do not invent meetings.
Do not open the report with any statistic about meeting follow-up or forgotten action
items.
End with one line naming the handoff: open Cowork and run meeting-scribe on any meeting
flagged above to get the decisions record with quotes, the filtered follow-up draft, and
the unresolved list.
```

Three properties of that prompt are load-bearing and must survive any edit. It reads its own
past reports before writing. It escalates a repeat flag rather than restating it. And it
never fetches a transcript, because a daily sweep across every meeting of the day would blow
the context on verbatim text it has no use for.

`UPDATE_ROUTINE` replaces the whole prompt and the whole schedule. Always call
`LB_INTERNAL_GET_ROUTINE_CONFIG` first (`references/littlebird-mcp-reference.md`).

### Handoff to Cowork

The routine observes. Cowork acts. The routine cannot send a message, cannot hold an
approval gate open, and cannot create or update routines
(`references/littlebird-mcp-reference.md`).

The routine report ends by naming this skill and the meetings it flagged. When the user
opens Cowork and runs the on-demand mode, call `LB_INTERNAL_GET_ROUTINE_REPORTS` on the
sweep routine first, so the run inherits which meetings were already flagged, which follow-
ups the user already sent, and which the user held. A meeting the user handled is not
re-drafted.

## Ship Gate

Ship Gate removed, research-only skill, produces no committable code.

## Related skills

| Skill | Relationship |
|---|---|
| `commitment-tracker` | Owns the standing ledger across all meetings over time. This skill hands commitments to it and does not track them. Its own `harvesting-commitments.md` guide is the harvest procedure; read it there, do not duplicate it here. |
| `pre-call-prep` | The other half of the meeting cycle. That skill runs before the call, this one runs after. |
| Personal voice skills | If one is installed, the recap drafts through it. If none is, say so and point the user at this marketplace's voice creator skills. Never invent a voice profile. |

## Reference map

| File | Read it for |
|---|---|
| `references/beyond-the-builtin-summary.md` | What the built-in summary already does, the five gaps, the retrieval brief, the transcript-only meeting case, the commitment handoff block |
| `references/decision-capture.md` | The nine-field decision entry, getting quote and timestamp, supersession, contested decisions, what ships where |
| `references/recipient-aware-recaps.md` | Audience, the confidentiality filter and its strip list, the recipient split, the voice check, the drafting spec, the approval gate |
| `references/unresolved-detection.md` | The three tiers, the talked-over scan and its failure modes, the attribution constraint, what goes outbound |
| `references/littlebird-mcp-reference.md` | Tool names, parameters, return shapes, known limitations |
| `references/evidence-standards.md` | Receipts, the four kinds, confidence ratings, confirmation gates |
| `references/research/distilled-meeting-followup.md` | Every domain claim in this skill, cited to a raw source, plus the seven named gaps |
| `references/research/README.md` | The archive index, the window exceptions, and the unresolved conflicts |
