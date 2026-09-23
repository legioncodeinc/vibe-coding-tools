# Beyond the built-in summary

Read this first. It is the reason the skill exists, and it is the file that stops the skill
from producing something Littlebird already gives away for free.

## What `LB_INTERNAL_GET_MEETING` already returns

Every recorded meeting already carries a structured summary with these exact section
headings, observed in production (`littlebird-mcp-reference.md`):

- `## Executive Summary`
- `## For You`
- `## Topics Discussed`
- `## Decisions`, each tagged with who decided
- `## Action Items`, a checkbox list, each tagged with an owner or `Unassigned`, each
  ending `(source: transcript)`
- `## Risks / Open Questions`

The user can read all of that in the Littlebird app in ten seconds without invoking
anything.

**Therefore: producing a meeting summary is not a deliverable. It is a regression.** If a
run of this skill ends with the user holding a restatement of the built-in summary, the run
failed regardless of how well written it is.

## The five things the built-in summary does not do

| # | Gap | What this skill does about it |
|---|---|---|
| 1 | The summary is written for the user, not for the room. It contains `## For You`, the user's private obligations, and whatever internal observation the model made. | Produces a separate outbound artifact authored for named recipients, with a confidentiality filter run before drafting. `recipient-aware-recaps.md`. |
| 2 | Decisions are recorded as the summary's paraphrase, tagged with a decider. There is no quote and no timestamp. A disputed decision is settled by whoever remembers harder. | Anchors each decision to exact transcript wording plus the timestamp, so the record is checkable. `decision-capture.md`. |
| 3 | Action items sit inside one meeting and stay there. Nothing carries them forward across weeks. | Hands commitments into the standing ledger maintained by `commitment-tracker`, which is the skill that owns them over time. |
| 4 | `## Risks / Open Questions` captures questions the summary recognized as open. It does not catch the question that got asked and then talked over, which is where things quietly die. | Runs a separate unresolved sweep with three tiers. `unresolved-detection.md`. |
| 5 | One meeting produces one summary, even when the room held two parties with different interests. | Recipient-aware split, offered where the attendee list shows more than one organization. `recipient-aware-recaps.md`. |

Everything in the table above is an observation about the Littlebird tool surface
(`littlebird-mcp-reference.md`) plus this skill's own architecture. The DOMAIN claims that
justify each response live in `research/distilled-meeting-followup.md` and are cited at the
point of use in the four guides. Two are worth naming here because they carry the argument:
a deferred item that never informs future action is a social cost rather than a neutral act
(`research/distilled-meeting-followup.md`, section 3), and the default behavior of this
whole tool category is to auto-circulate the internal artifact to every attendee with no
review step (`research/distilled-meeting-followup.md`, section 4).

Section 7 of that distillation lists the seven things the research archive does NOT support.
Read it before adding a confident sentence anywhere in this skill.

Every one of these is downstream of the summary rather than a replacement for it. Build ON
the structured blocks. Do not re-derive them.

## The division of labor with commitment-tracker

These two skills touch the same `## Action Items` block and must not duplicate each other.

| | `meeting-scribe` (this skill) | `commitment-tracker` |
|---|---|---|
| Scope | ONE meeting, immediately after it | ALL meetings, over time |
| Time horizon | The next 24 hours | Weeks and months |
| With a commitment | Extracts it, states it in the recap, hands it off | Ages it, verifies whether it happened, escalates it, drafts nudges |
| Output | Decisions record, outbound draft, unresolved list, handoff block | Standing two-column ledger, decisions log, aged nudges |

**The harvesting procedure is not repeated here.** The field list, the attribution rule,
the two-column sort, the `Unassigned` handling, and the recurring-meeting deduplication all
live in the SEPARATE `commitment-tracker` skill, in its own references folder, in the file
named `harvesting-commitments.md`. That file is not part of this skill. Open the installed
`commitment-tracker` skill and read it there when extracting commitments. This skill's only addition is the handoff block described below.

### The handoff block

At the end of a run, emit a block the ledger can absorb without re-reading the meeting. One
row per commitment, with these fields and no others:

| Field | Source |
|---|---|
| Commitment text, verbatim | `## Action Items` line, exactly as written |
| Owner | the owner tag on that line, or `Unassigned` |
| Meeting name | summary header |
| Meeting date | summary header |
| Stated deadline | only where the summary named one, otherwise `none stated` |
| Origin | `meeting-scribe`, plus the date of this run |
| Shared externally | yes or no, meaning whether this commitment appears in an outbound draft the user approved |

That last field is the one only this skill can supply. A commitment the counterparty has
seen in writing is a different object from one that lives in an internal summary, and the
ledger should know which it is holding.

## Retrieval brief

Three calls, in this order, and the third one only where it earns itself.

### 1. Find the meeting

**On demand, most recent meeting:**

```
LB_INTERNAL_LIST_MEETINGS
  start_date: today
  end_date:   today
  limit:      20
```

**On demand, a named meeting:**

```
LB_INTERNAL_LIST_MEETINGS
  name:       exact meeting title
  start_date: the day in question
  end_date:   the day in question
```

Name lookup uses `LIST_MEETINGS`. Topic lookup uses `SEARCH_MEETINGS`. Using the wrong one
is the most common retrieval mistake against this server
(`littlebird-mcp-reference.md`).

**Daily sweep:**

```
LB_INTERNAL_LIST_MEETINGS
  start_date: today
  end_date:   today
  limit:      25
```

Split the result. Meetings that carry an id were recorded. Entries with no id are
unrecorded calendar events, which have no summary and no transcript and are not searchable
(`littlebird-mcp-reference.md`). Count them and report the count as a coverage gap.

### 2. Pull the structured summary and the attendee list

```
LB_INTERNAL_GET_MEETING
  meeting_id: the id
```

This returns the name, the TLDR, the full structured summary, and **the linked calendar
event with its attendees** (`littlebird-mcp-reference.md`). The attendee list is what makes
recipient-aware drafting possible. It does not return the transcript.

Everything the recap says about who owns what comes from this call.

### 3. Pull the transcript only for exact wording

```
LB_INTERNAL_GET_MEETING_TRANSCRIPT
  meeting_id: the id
```

Transcripts can be very long (`littlebird-mcp-reference.md`). Fetch one only when the run
needs exact wording, which is two cases and no others:

- A decision entry needs its verbatim quote and timestamp (`decision-capture.md`).
- The unresolved sweep needs to check whether a question was answered
  (`unresolved-detection.md`).

Do not fetch a transcript to build the recap prose. Do not fetch one to confirm an owner.

### The attribution rule, restated because it is the expensive one

**Attribution comes from the summary's structured blocks. Never from a raw transcript
chunk.**

Raw chunks are weakly diarized and frequently tagged `[Others]` rather than by name
(`littlebird-mcp-reference.md`). A transcript chunk may be quoted for WORDING. It may never
be cited to prove WHO SAID IT.

The cost of breaking this rule is asymmetric and external. A wrong owner in an internal
ledger is an annoyance the user fixes. A wrong owner in a message sent to four attendees
tells a named person, in writing, that they promised something they did not promise. That
is a relationship cost and it cannot be recalled.

Operationally:

- If the summary tags an action item with an owner, that tag is the owner.
- If the summary tags it `Unassigned`, it stays `Unassigned` in the recap, phrased as an
  open item rather than assigned to a guess.
- If the summary and the transcript appear to disagree, report both and say they disagree
  (`evidence-standards.md`, rule 10). Do not resolve it. Ask the user.

## The transcript-only meeting

A recorded meeting with no linked calendar event has a summary and a transcript but **no
attendee list**. This happens with ad hoc calls, dialed-in phone calls, and recordings
started outside a scheduled invite.

Recipient-aware drafting is impossible without an attendee list, because the skill does not
know who the recipients are or which organization they belong to.

What the skill does, in order:

1. **Say it plainly.** "This meeting has no linked calendar event, so I do not have an
   attendee list. I can produce the decisions record and the unresolved list, but I cannot
   safely draft a recipient-aware follow-up."
2. **Produce everything that does not need recipients.** Decisions with quotes and
   timestamps, the unresolved list, and the commitment handoff block all run normally. They
   depend on the summary, not on the attendee list.
3. **Offer the fallback with its limitation stated.** Ask the user to name the recipients
   with `AskUserQuestion`. If they do, draft against the names they gave and mark the draft
   as built on a user-supplied recipient list rather than a verified one.
4. **Never infer attendees from the transcript.** Names appearing in a weakly diarized
   transcript do not establish who was on the call, and a name mentioned in conversation is
   not a participant. Inferring an attendee list here produces exactly the failure the
   attribution rule exists to prevent.
5. **Never infer attendees from the owner tags.** An owner tag proves the summary assigned
   an item to a name. It does not supply an email address, an organization, or a complete
   roster.

If the user declines to supply recipients, ship the internal artifacts and say the outbound
draft was not produced and why.

## Empty retrieval

If `LIST_MEETINGS` returns nothing for the window, or every returned entry is an unrecorded
calendar event, report the window searched and the counts found, and stop
(`evidence-standards.md`, rule 9).

If `GET_MEETING` returns a summary with no `## Decisions` block and no `## Action Items`
block, that is a legitimate result for a meeting that decided nothing. Say the meeting
produced no recorded decisions and no recorded action items, produce the unresolved list if
there is anything in `## Risks / Open Questions`, and do not manufacture a recap around
nothing.

Do not widen the window silently. Do not substitute plausible content. Do not reason from
what was probably discussed.
