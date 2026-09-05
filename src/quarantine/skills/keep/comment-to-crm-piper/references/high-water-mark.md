# The high-water mark: how "since last run" actually works

This is the spine of the skill. A daily drip that cannot answer "what is new since
yesterday" is just a slower campaign post-mortem, and this marketplace already has one of
those in `lead-harvester`. Read this guide before writing any query.

## The problem

There is no local database. There is no state file that survives between a routine firing
on Tuesday and the same routine firing on Wednesday. There is no cursor the Littlebird MCP
hands you. Two runs of the same search over overlapping windows will return the same
people twice, and a skill that pipes the same person into the CRM every morning is worse
than useless.

## The mechanism

**The routine's own past reports ARE the state store.**
`LB_INTERNAL_GET_ROUTINE_REPORTS` returns past reports, most recent first, each with a
date, a title, and the full report text, default 5 and maximum 25
(`references/littlebird-mcp-reference.md`, routine tools). That is a durable, append-only
log written by the same routine that is about to run again. Read it, parse the last
report, and you have the high-water mark.

This is why the report format below is not cosmetic. The report is a data structure that
the next run has to parse. Format drift breaks the mechanism.

## The two values that define the mark

Every report this skill writes ends with a machine-readable block. Two values matter:

| Value | What it is | Why both are needed |
|---|---|---|
| `WATERMARK_TIME` | The latest EVENT time of any signal included in the report, in the user's local timezone, not the time the report ran | Retrieval windows key off event time. Using run time silently skips anything that arrived during the run. |
| `PIPED_IDENTITIES` | The list of display names piped or queued in this report, one per line, exactly as they appeared | Time alone cannot dedupe. Capture is lossy and a signal can surface in a later sweep with an earlier timestamp. |

Time is the coarse filter. The identity list is the fine filter. Neither works alone.

## The exact block to emit

Put this at the end of every report and every Cowork run summary, verbatim in shape:

```
--- PIPER STATE, DO NOT EDIT ---
WATERMARK_TIME: 2026-08-16 21:40 EDT
CAMPAIGN_TAG: source-facebook-comment-2026-q3-launch
PIPED_IDENTITIES:
- Dani Thompson
- Marcus Oyelaran
- Priya Raghunathan
UNNAMED_GAP: 6
LAST_RUN_STATUS: piped
--- END PIPER STATE ---
```

`LAST_RUN_STATUS` is one of `piped`, `queued-for-cowork`, `quiet`, or `empty-retrieval`.

## Reading the mark, in order

1. Call the routine listing tool to find this skill's routine and its id. If the user has
   several, match on the routine title.
2. Call the routine reports tool for that id with a limit of at least 7, so a week of
   history is in hand.
3. Scan the reports newest to oldest for the first `PIPER STATE` block. That is the mark.
4. Set the retrieval window to start at `WATERMARK_TIME` minus a 6 hour overlap. Capture is
   not instantaneous and a signal that happened at 21:55 may be captured at 22:30. The
   overlap catches it; the identity list removes the duplicates the overlap creates.
5. Union `PIPED_IDENTITIES` across every report you read, not just the newest one. A person
   piped four days ago must not be piped again today.

## When there is no mark

Three cases, three different behaviors. Do not collapse them.

| Case | What it looks like | What to do |
|---|---|---|
| **First run ever** | No routine exists, or the routine exists with zero reports | Ask the user for a starting date with `AskUserQuestion`. Offer the last 7 days, the last 14 days, the last 30 days, and a custom date. Do NOT silently default to 24 hours: a first run should sweep the backlog once, and the user should choose how far back. |
| **Reports exist but no state block** | Reports were written before this skill was installed, or a run crashed mid-write | Fall back to the date of the most recent report as the mark, and say in the output that the identity filter was unavailable for this run so duplicates are possible. |
| **Gap in the history** | The routine was paused, or the reports are older than the retention the tool returns | Set the mark to the newest report's watermark and state the gap length in the output. A five day pause means five days of backlog, and the user should be told that before they open a file of 40 people. |

## The rules that keep it honest

**The mark advances only on a successful run.** If retrieval returns nothing because the
search failed rather than because nothing happened, do NOT write a new watermark. Write
`LAST_RUN_STATUS: empty-retrieval` and carry the PREVIOUS watermark forward unchanged.
Advancing the mark on a failed retrieval permanently loses everyone who raised a hand in
that window.

**A quiet day still writes a state block.** Nobody new means
`LAST_RUN_STATUS: quiet`, the previous watermark carried forward, and an empty
`PIPED_IDENTITIES` list. The routine still has to leave a trail.

**The Cowork side advances the mark too, and says so.** When the user opens Cowork and
actually pipes the queue, the Cowork run appends its own state block to the artifact it
writes and reports the identities it piped. The next routine run reads the ROUTINE's
reports, so tell the user plainly: if the routine detected someone and Cowork piped them,
the routine's own next report will still list that person as new unless the Cowork run's
identity list is fed back. Two ways to close that loop, in order of preference:

1. **Preferred.** The Cowork session updates the routine's prompt with the routine update
   tool, appending a short `ALREADY PIPED THROUGH yyyy-mm-dd` line. The next routine run
   reads its own prompt and treats that date as a floor. This works because routine update
   is available from an interactive session even though it is not available from inside a
   running routine (`references/littlebird-mcp-reference.md`, routine tools).
2. **Fallback.** The Cowork artifact is written to a stable filename the user can point the
   next session at, and the skill reads it at the start of the next Cowork run.

Say which one is in effect in the output. Do not leave the user guessing whether the loop
is closed.

## Overlap arithmetic, worked

Suppose yesterday's report ends `WATERMARK_TIME: 2026-08-16 21:40 EDT` and lists three
names. Today's run at 08:00:

- Retrieval window start: 2026-08-16 15:40 EDT, which is the mark minus 6 hours.
- Retrieval window end: `now`.
- Rows returned: 11.
- Rows whose event time is at or before 21:40 on Aug 16: 4. Three of those match names in
  `PIPED_IDENTITIES` and are dropped as already handled. One does not match, so it is a
  genuinely NEW person whose signal was captured late. Keep it and say so in the output.
- Rows after the mark: 7. All new.
- Today's report covers 8 people, and today's `WATERMARK_TIME` is the latest event time
  among those 8.

That fourth row is the entire reason the overlap exists. A naive "since the mark" window
would have lost that person forever.

## What this mechanism does not do

- It does not survive the user deleting the routine. The state dies with the report
  history. Tell the user that before they delete anything.
- It does not dedupe against the CRM. That is a separate problem with its own guide,
  `references/dedupe-against-crm.md`. The high-water mark answers "have I seen this signal
  before". The CRM check answers "does this person already exist as a contact". A person
  can be new to the watermark and old to the CRM, and both facts belong in the output.
- It does not fix a partial roster. A collapsed "and 9 others" is unnamed today and will
  still be unnamed tomorrow. See `references/evidence-standards.md`, rule 5.
