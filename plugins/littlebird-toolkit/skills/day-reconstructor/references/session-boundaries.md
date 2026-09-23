# Session boundaries

Where a work session starts and stops, how to find it in capture, and how to keep a
multi-day project reading as one continuous piece of work.

This runs before any retrieval sweep. Get the boundary wrong and everything downstream is
either padded with somebody else's day or truncated halfway through the thing the user
actually cares about.

Read `littlebird-mcp-reference.md` for tool parameters and return shapes. This guide is
about window selection, not about the API.

---

## 1. The calendar day is not the session

**The target user works nocturnal sessions.** A session that runs from 22:00 on Monday to
06:00 on Tuesday sits inside two calendar dates and inside neither calendar day. Any query
windowed on a single `YYYY-MM-DD` will cut it in half and report half a session as a whole
one.

There is no source in the archive defining a work session boundary for a non-standard
schedule. The published studies assume a workday and do not define where one ends
[research/distilled-dev-logging.md section 9, gap 1]. What the archive does support is that
productive windows vary substantially between individuals, with at least three distinct
patterns observed in a logged population
[research/distilled-dev-logging.md section 5]. So the rules below are a **design decision
for this skill**, evidenced only indirectly. They are stated as such.

**The governing rule: the user defines the boundary. The skill never assumes one.**

---

## 2. Establish the boundary, in this order

### Step 1: use a stored boundary if one exists

Before asking anything, check whether the boundary is already known:

- If this is a routine run, call `LB_INTERNAL_GET_ROUTINE_REPORTS` and read the most recent
  report. Every report this skill writes states the session window it covered and the
  boundary convention it used. Reuse it.
- If the user has a session convention recorded anywhere in the working directory (a prior
  dev log file from this skill), read it.

Do not re-ask a settled question every day. That is the friction that kills the habit
[research/distilled-dev-logging.md section 7].

### Step 2: ask once, with AskUserQuestion

If no boundary is known, ask. Offer concrete options, not an open prompt:

> When does your work session start and end? I will use this every time unless you change
> it.
>
> - Nocturnal: 8pm to 8am, logged under the date it started
> - Nocturnal: 8pm to 8am, logged under the date it ended
> - Standard day: 6am to 8pm, same calendar date
> - Let the capture decide: find the longest gap in activity and cut there
> - I will give you exact times

Record the answer in the artifact's header so the next run inherits it.

### Step 3: derive it from capture, if the user chose that

The "let the capture decide" option is a real method and is the correct default when the
user does not want to commit to a convention.

Run the summaries sweep across a 36 hour window centred on the target period:

```
search_user_context(
  search_queries: ["what was worked on", "coding development session activity"],
  standalone_query: "The shape of the work session around <target date>: when activity
    started, which applications were involved, and when activity stopped.",
  date_range: {"start": "<day minus 1> 12:00:00", "end": "<day plus 1> 12:00:00"},
  filters: {"data_source": "summaries"}
)
```

The summaries source is Littlebird's own compressed digest of a period and is the cheapest
way to see the shape of it (`littlebird-mcp-reference.md`, retrieval pattern 3).

Then apply the **gap rule**:

| Gap in captured activity | Reading |
|---|---|
| Under 30 minutes | Within the session. A break, not a boundary. |
| 30 to 90 minutes | Ambiguous. Note it as a possible split, keep the session together, and mention the gap in the coverage note. |
| Over 90 minutes | Session boundary candidate. Cut here. |
| Over 4 hours | Session boundary. Cut here without asking. |

The 90 minute threshold is a design decision. It is set above the 47.3 minute average
longest uninterrupted coding stretch reported in the archive
[research/distilled-dev-logging.md section 5], so an ordinary deep-work block plus a normal
interruption does not get read as the end of a session.

Confirm the derived boundary with the user before running the expensive sweeps. Getting it
wrong costs a full retrieval pass.

---

## 3. Building the date range

Littlebird's `date_range` accepts `HH:MM:SS` alongside the date
(`littlebird-mcp-reference.md`). Use it. A cross-midnight session is one range with two
dates, not two ranges:

```
date_range: {"start": "2026-08-17 20:00:00", "end": "2026-08-18 08:00:00"}
```

**Split for retrieval, not for reporting.** A window longer than about two hours will
exceed the tool result limit and get written to a file instead
(`littlebird-mcp-reference.md`, "Oversized results"). Sweep the session in two-hour
sub-windows and reassemble. The session stays one session in the report.

Sort everything by timestamp before writing. Retrieval is relevance-ordered, not
chronological (`littlebird-mcp-reference.md`, known limitations;
`evidence-standards.md` rule 8).

---

## 4. Naming the session

One session, one artifact, one name. Use the date the session **started**, in ISO 8601
`YYYY-MM-DD`, because that is what both changelog specifications require for dates and it
is unambiguous across regions [research/distilled-dev-logging.md section 1].

File naming follows the practitioner structure in the archive: one file per session, dated,
in a per-month folder [research/distilled-dev-logging.md section 7].

```
dev-log/2026-08 (August)/2026-08-17.md
```

If the session crossed midnight, the header says so explicitly:

```
Session: 2026-08-17 20:14 to 2026-08-18 05:47 EDT (9h 33m elapsed)
Boundary: user-defined nocturnal window, logged under start date
```

---

## 5. Grouping fragments into work threads

Do not emit the raw activity timeline. Logged measurement puts developers in an individual
activity for only 0.3 to 2.0 minutes before switching
[research/distilled-dev-logging.md section 5]. A timeline at that granularity is a list of
window focus events, not a record of work.

Group into **work threads** instead: a contiguous-enough run of activity aimed at one
outcome. A thread survives the user checking email in the middle of it. The grouping signal
is the target, not the window.

| Signal | Weight toward "same thread" |
|---|---|
| Same repo or project directory appears in the terminal prompt or path | Strong |
| Same file or file set open across the fragments | Strong |
| An error string reappears | Strong. Almost always the same thread. |
| Same feature name, ticket ID, or branch name visible | Strong |
| Same app, nothing else in common | Weak. Not sufficient alone. |
| Adjacent in time only | Not a signal. |

Report threads in the order they **started**. Give each a time range covering its first and
last observed fragment, and say plainly that the range is span, not duration, because the
user was demonstrably doing other things inside it
[research/distilled-dev-logging.md section 5].

Deduplicate the underlying snapshots before you count anything. Screen capture of one UI
state produces many near-identical frames, and repeated identical lines are one observation
(`littlebird-mcp-reference.md`, known limitations). This skill does not carry its own
deduplication script. **Reuse sop-forge's**: `sop-forge/scripts/dedupe_snapshots.py`,
documented in `sop-forge/references/session-reconstruction.md` steps 4 and 5. Build the
timestamp-sorted JSON timeline it expects, run it with `--scan-secrets`, and read the
output rather than trusting it. The threshold and gap defaults there are tuned for UI state
separation and are a reasonable starting point here.

---

## 6. Continuity across sessions

A multi-day project must read as continuous progress, not as N disconnected logs. This is
the difference between a log somebody keeps and a log somebody abandons
[research/distilled-dev-logging.md section 7].

Before writing anything, read the previous reports:

- In a routine: `LB_INTERNAL_GET_ROUTINE_REPORTS` with `routine_id` and `limit: 5`.
- In a Cowork session: read the last few dated files in the dev log folder.

Then carry three things forward explicitly:

| Carry-forward | Where it appears in the new artifact |
|---|---|
| **Open thread** from the previous session | Named at the top of its thread in this session as a continuation, with the prior date. "Continued from 2026-08-16: the auth refresh loop." |
| **Unresolved problem** from the previous session | If it was resolved this session, the problems-solved entry spans both dates and says so. If it is still open, it stays in the open list with a day count. |
| **Stated next step** from the previous session | Check whether it happened. If it did not, say so in one line. Do not silently drop it. |

**Escalation rule, mandatory for the routine.** If the same problem appears unresolved in
three consecutive reports, the artifact stops reporting it as a status line and escalates
it: name it at the top, state how many sessions it has been open, list what has already
been tried across all of them, and say plainly that the current approach is not converging.
A routine that reports the identical item day after day with no change in framing is a
documented failure mode (`littlebird-mcp-reference.md`, "Give every routine memory").

---

## 7. The empty session

A day with no development activity gets **one line**. Not a manufactured log.

```
2026-08-17: no development activity found in the 20:00 to 08:00 window. Captured apps
were chrome, slack, and zoom. No terminal, editor, or repository activity observed.
```

That is the whole artifact. Do not pad it with the meetings the user attended, do not
invent a "planning and research" thread out of browser tabs, and do not widen the window
looking for something to report unless the user asks.

Decision table:

| Situation | Action |
|---|---|
| Summaries empty for the window | Report it. Ask the user to confirm the window and the date. Do not run the expensive sweeps blindly. |
| Summaries present, no dev-tool activity | One-line no-activity report, naming the apps that did appear. Stop. |
| Dev activity present but under about 3 distinct work threads after grouping | Report what was found and name it as a fragment, not as a session log. Offer to widen the window. Do not pad it. |
| Everything scored 3 | Anything scored 3 is a maybe (`littlebird-mcp-reference.md`, retrieval pattern 5). Report low confidence across the board and confirm before writing anything durable. |

A failed or empty retrieval ends the run (`evidence-standards.md` rule 9). A skill that
reports "nothing happened in this window" is doing its job correctly, and it is the only
version of this skill that stays trustworthy on the day it matters.
