# Harvesting commitments

How to pull every commitment out of a window of Littlebird meetings without re-deriving
anything from raw transcript.

The premise: `LB_INTERNAL_GET_MEETING` already returns a structured summary containing
`## Decisions`, `## Action Items`, `## Risks / Open Questions`, and `## For You`
(`littlebird-mcp-reference.md`). Action Items arrive as a checkbox list, each
tagged with an owner or with `Unassigned`, each ending `(source: transcript)`. That
structure is the harvest. Do not rebuild it.

---

## Step 1: fix the window

Ask the user for the window, or default by mode.

| Mode | Default window |
|---|---|
| Weekly routine | the last 7 days, plus any open item carried forward from prior reports |
| On-demand deep run | the last 30 days |
| First run ever | the last 90 days, stated to the user as a backfill |

Never run unbounded. Unbounded retrieval dilutes relevance and risks the oversized-result
file dump (`littlebird-mcp-reference.md`).

## Step 2: enumerate the meetings

Call `LB_INTERNAL_LIST_MEETINGS` with `start_date` and `end_date` set to the window and
`limit` set high enough to cover it.

Then split the returned list into two piles:

- **Recorded meetings.** These carry an id. They are the harvest set.
- **Unrecorded calendar events.** These have no id, no summary, no transcript. They are
  not searchable. Count them, name them, and report the count as a coverage gap. A window
  where six of fourteen meetings were unrecorded is a window whose ledger is at best
  partial, and the user needs to know that before trusting the totals.

## Step 3: pull each summary

For every recorded meeting id, call `LB_INTERNAL_GET_MEETING`.

Do NOT call `LB_INTERNAL_GET_MEETING_TRANSCRIPT` at this stage. Transcripts are long, and
nothing in the harvest needs them. Fetch a transcript only when step 6 requires exact
wording for a specific item.

From each summary, capture:

| Field | Where it comes from |
|---|---|
| Meeting name | summary header |
| Meeting date | summary header or the list result |
| Attendees | the linked calendar event returned by `GET_MEETING` |
| Action items, verbatim | the `## Action Items` block, one row per checkbox |
| Owner tag per item | the owner label on the checkbox, or `Unassigned` |
| Decisions, verbatim | the `## Decisions` block, with the decider tag |
| Open questions | the `## Risks / Open Questions` block |
| Items aimed at the user | the `## For You` block |

Preserve the exact text of each item. Do not summarize it, tighten it, or fix its grammar.
The user has to be able to recognize the sentence. Errors compound down the transcription
pipeline, so a paraphrase of a paraphrase drifts twice
(`research/distilled-commitment-tracking.md`, section 4).

## Step 4: the attribution rule, which is not negotiable

**Owner attribution comes from the summary's Action Items and Decisions blocks. It never
comes from a raw transcript chunk.**

The reason is quantitative. State-of-the-art speaker diarization runs at 11 to 13 percent
error, driven mainly by crosstalk, and the documented consequence is that a commitment
spoken by one person gets attached to another
(`research/distilled-commitment-tracking.md`, section 4). The Littlebird
reference independently records that raw chunks are weakly diarized and frequently tagged
`[Others]` (`littlebird-mcp-reference.md`).

Practical rules that follow:

- A raw transcript chunk may be quoted for **wording**. It may never be cited to prove
  **who said it**.
- If a summary action item has an owner tag, that tag is the owner. Full stop.
- If a summary action item is tagged `Unassigned`, it stays `Unassigned`. Do not read the
  transcript to guess. Do not infer from context. Do not assign it to whoever was talking
  nearby.
- If the summary and the transcript appear to disagree about who owns something, report
  both and say they disagree. Do not resolve it yourself
  (`evidence-standards.md`, rule 10).

## Step 5: sort into two columns

Every harvested action item lands in exactly one column.

### Owed by me

An item whose owner tag is the user, plus everything in the `## For You` block.

The `## For You` section is the summary's own statement of what the user is expected to
do. Treat it as authoritative for the owed-by-me column even where an item does not also
appear under Action Items, and mark those items so the user can see where they came from.

### Owed to me

An item whose owner tag is another named person, where the deliverable comes back to the
user, appears in a meeting the user attended, or blocks something in the owed-by-me
column.

This is the column nobody maintains. It is the GTD Waiting For list, which the official
Weekly Review checklist treats as a first-class review item alongside the action lists
(`research/distilled-commitment-tracking.md`, section 3).

An item owned by another person that has nothing to do with the user goes in neither
column. Drop it. Purpose-bound collection is a standing rule
(`evidence-standards.md`, rule 10).

### Unassigned

An item tagged `Unassigned` goes in a third short list, presented separately, never
silently folded into either column.

These are not noise. A team-level commitment with no individual named is a documented
extraction failure mode that produces "an extracted task with no specific owner, no clear
assignee, and no accountability"
(`research/distilled-commitment-tracking.md`, section 5). The correct handling
is to hand it back: the user claims it, assigns it to someone, or discards it. Three
options, one line each, decided in seconds.

## Step 6: deduplicate across recurring meetings

A standup or a weekly 1:1 restates the same commitment across instances. Counting each
instance as a separate promise inflates the ledger and buries the real signal.

To find prior instances of a recurring meeting, call `LB_INTERNAL_LIST_MEETINGS` with
`name` set to the meeting title. Name lookup uses `LIST_MEETINGS`. Topic lookup uses
`SEARCH_MEETINGS`. Using the wrong one is the most common retrieval mistake against this
server (`littlebird-mcp-reference.md`).

Merge rule: two items are the same commitment when the owner matches and the deliverable
matches, even where the wording differs. When merging:

- Keep the **earliest** appearance as the origin date. Age is measured from first
  commitment, not from most recent restatement. An item restated four Mondays running is
  28 days old, not 7.
- Record the restatement count. Four restatements with no completion evidence is a
  stronger signal than one.
- Keep the most recent verbatim wording alongside the original, where they differ. A
  commitment that keeps getting narrower is a commitment being negotiated down, and the
  user should see that.

## Step 7: assemble the ledger row

Each row carries these fields, and a row missing any of the first five is not ready to
ship:

| Field | Rule |
|---|---|
| Column | owed by me / owed to me / unassigned |
| Owner | verbatim from the summary tag |
| Commitment text | verbatim from the summary, not paraphrased |
| Meeting | name |
| Date | origin date, earliest appearance |
| Age | days from origin date to today |
| Restatements | count, where the item recurred |
| Stated deadline | only where the summary named one; otherwise `none stated` |
| Status | set by `completion-verification.md`, not here |
| Receipt | `[Meeting name, YYYY-MM-DD, Action Items]` |

Do not invent a deadline. "Early next week" and "after the release" are documented
ambiguity failures (`research/distilled-commitment-tracking.md`, section 5).
Record the ambiguous phrase verbatim and mark the deadline as `none stated, meeting said:
"early next week"`.

## Step 8: report what you could not harvest

Before handing off to verification, state:

- Meetings in the window: recorded count and unrecorded count
- Summaries that contained no `## Action Items` block at all
- Items dropped as not relevant to the user, with a count
- Items merged as duplicates, with a count

There is no accepted benchmark for how reliably an assistant extracts tasks, owners, and
deadlines from a meeting, by the vendor's own admission
(`research/distilled-commitment-tracking.md`, section 4). The skill therefore
reports what the summaries contained. It never claims to report what the meetings
contained, and it never claims the harvest is complete.

## Empty harvest

If `LIST_MEETINGS` returns nothing for the window, or every returned meeting is an
unrecorded calendar event, say exactly that and stop. Report the window searched and the
count found. Do not widen the window silently, do not substitute plausible examples, do
not reason about what was probably discussed (`evidence-standards.md`, rule 9).
