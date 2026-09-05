# Rollup composition: read, do not re-derive

This is the named feature that makes daily-brief cheap and reliable. **If a sibling routine
already did the work, daily-brief reads its report instead of re-running its retrieval.**

The argument is not just cost. A sibling routine's report is already distilled, already
carries owner attribution and receipts, and already carries its own escalation state, which
means daily-brief inherits a consecutive-run count it would otherwise have to reconstruct.
Re-deriving the same finding from raw capture gives a second, slightly different answer to a
question that was already answered, and then the user has to reconcile two versions of their
own week. Reading beats re-deriving on cost, on consistency, and on trust.

The pattern generalizes: **daily-brief is an index, not a store.** It points at where a
finding lives. It is never the only place a finding appears.

---

## 1. Discovery

Once per run, before any content retrieval:

```
LB_INTERNAL_LIST_ROUTINES
  limit: 25
```

That returns title, schedule, report count, latest report date, paused state, and id
[littlebird-mcp-reference.md]. Match sibling routines by title. Titles are user-chosen, so
match on substance rather than on an exact string, and record which title matched what so
the brief can attribute correctly.

Then, for each matched sibling:

```
LB_INTERNAL_GET_ROUTINE_REPORTS
  routine_id: [the sibling's id]
  limit: 2
```

Two reports, not one. The second report is what makes a sibling's own delta visible, which
daily-brief needs in order to decide whether a rolled-up item is New or Aged.

## 2. The mapping

| Sibling routine, by substance of title | Feeds | What daily-brief takes |
|---|---|---|
| Commitment tracker | Top open commitments due | The owed-by-me column, filtered to items dated today or overdue. Not the full ledger. |
| Client health radar | What went cold | Accounts already banded at risk, with the band and the named evidence. |
| Pre-call prep | Today's schedule | The one-line reason each meeting matters. Never the full brief. |
| Said it already | Not rolled up | Content work is not day-planning. Ignore unless it flagged a dated commitment. |
| Competitor watch | Rarely | Only if it flagged something with a date landing today. |
| Money leak auditor | Rarely | Only a failed payment or a renewal dated today. |
| Osint investigator, lead harvester, sop forge, testimonial miner | Not rolled up | On-demand skills, no daily signal. |

**The general test for whether a sibling feeds the brief:** does its latest report contain
an item with a date that falls today or earlier, or a state change since its previous
report? If neither, it does not appear in the brief. A sibling routine being healthy is not
news.

## 3. The freshness gate

A stale report is worse than no report, because it looks current.

| Sibling's latest report age | Behavior |
|---|---|
| Within one schedule interval | Use it. Cite it. Do not re-run its retrieval. |
| Within two intervals | Use it, and mark every rolled-up item with the report date so the reader can see the lag. |
| Older than two intervals, or the routine is paused | Do not use it. Run the fallback query in section 5 and add one line: `[Sibling name] has not reported since [date]. Its area is covered here by a reduced check only.` |

**Paused siblings deserve a specific note.** Littlebird exposes an auto-pause-when-unread
setting [littlebird-mcp-reference.md]. A sibling that auto-paused is the product's fatigue
circuit breaker having fired, and it also means that routine is holding a plan slot while
producing nothing [routine-architect failure mode 6]. Report it once, in the on-demand mode
of this skill, not every day in the routine. A daily nag about a paused routine is itself a
repeated item.

## 4. Attribution

Every rolled-up line carries where it came from and when.

```
[item] [from Commitment tracker, 2026-08-16]
```

Three rules govern how a rolled-up claim is written.

1. **Never restate a sibling claim more confidently than the sibling did.** If the sibling
   wrote "no evidence in the record since 2026-07-29", daily-brief writes the same thing.
   It does not write "not done" [evidence-standards.md].
2. **Never silently contradict a sibling.** If daily-brief's own retrieval disagrees with a
   rolled-up item, present both readings and say they disagree. Do not resolve it by
   picking the more interesting one [evidence-standards.md].
3. **Never collapse a sibling's hedge.** Confidence ratings and inference markers travel
   with the item.

## 5. Fallback when a sibling is absent or stale

daily-brief must work in an account with no sibling routines at all. Each rolled-up section
has a reduced fallback that fits the run's retrieval budget. The fallback is deliberately
narrower than the sibling's real work, and the brief says so rather than pretending
equivalence.

**Commitments, fallback.** Instead of a full ledger sweep:

```
LB_INTERNAL_LIST_MEETINGS
  start_date: [today minus 14 days]
  end_date:   [today]
  limit:      25
```

Take the three most recent recorded meetings that have ids. For each:

```
LB_INTERNAL_GET_MEETING
  meeting_id: [id]
```

Read only the `## Action Items` and `## For You` sections, which already carry owner
attribution [littlebird-mcp-reference.md]. Keep only items owned by the user with a date at
or before today. Cap at three items. Add the line:
`Reduced check only. Run commitment-tracker for the full ledger.`

**Cold, fallback.** Instead of a per-relationship cadence baseline:

```
search_user_context
  search_queries_messages: ["waiting to hear back", "any update on", "following up on", "circling back"]
  standalone_query:        "Threads where the other person asked something and the last message is theirs, not mine"
  date_range:              {"start": "[today minus 21 days]", "end": "[today minus 4 days]"}
  filters:                 {"data_source": "messages"}
```

Cap at two items. Add the line:
`Reduced check only. Run client-health-radar for the real cadence baseline.`

**Schedule reasons, fallback.** Without a pre-call-prep report, the one-line reason a
meeting matters comes from the meeting's own title plus, where a prior instance exists, one
`LB_INTERNAL_LIST_MEETINGS` lookup by `name` over the last 90 days. Do not run the full
pre-call-prep retrieval inside daily-brief. That is a budget the brief does not have and a
job the brief does not own.

## 6. The pointer discipline with pre-call-prep

This is the sharpest boundary in the composition, so it gets its own rule.

**pre-call-prep owns per-meeting depth. daily-brief owns the whole-day view.** The brief
gives one line per meeting saying why it matters, and then points.

Correct:

```
10:00 [Acme] renewal call. [Their SOC 2 question from the 5th is still unanswered.]
  Depth: run pre-call-prep on this one.
```

Wrong, and this is the most likely failure of the whole skill:

```
10:00 [Acme] renewal call. Attendees: [three names and roles]. Last time you discussed
  [four topics]. Open commitments: [a table]. Objections raised: [a list].
  Talking points: [three of them].
```

The second version is a pre-call brief pasted into a daily brief. It blows the length
ceiling on one meeting, it duplicates a skill that already runs, and it will diverge from
that skill's own output.

**Rule.** A meeting line in daily-brief is at most two lines: the time and title, one clause
on why it matters, and where the depth lives. If pre-call-prep produced a report for today,
the depth pointer names that report. If it did not, the pointer names the skill.

## 7. Cost and ordering

Rollup runs first, before content retrieval, because what the siblings already covered
determines which fallback queries need to run at all. In an account with commitment-tracker
and client-health-radar both reporting daily, daily-brief's own retrieval collapses to the
calendar call, the unread-thread sweep, and the yesterday summary. That is the intended
steady state.

Approximate call budget per run:

| Phase | Calls |
|---|---|
| Own memory | 1 |
| Sibling discovery and reports | 1 plus 1 per matched sibling, typically 3 to 4 total |
| Calendar | 1 |
| Yesterday summary | 1 |
| Unread and direct asks | 1 to 2 |
| Fallbacks, only for uncovered sections | 0 to 5 |

Prefer several narrow parallel queries over one broad one, both for relevance and to avoid
the oversized-result file dump [littlebird-mcp-reference.md].
