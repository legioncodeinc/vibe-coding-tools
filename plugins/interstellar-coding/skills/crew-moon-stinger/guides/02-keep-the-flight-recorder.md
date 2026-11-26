# Keep the flight recorder

The flight recorder is one file, `crew/moon/flight-recorder.md` in the effort folder, started from [the template](../references/templates/flight-recorder.md). MOON is its only writer. It has a table with one row per agent and an append-only observations log below it.

## The row

| Column | What goes in it |
|---|---|
| Role or chip | The crew role (COOP, LADY, KIPP and so on) or the chip title |
| Session or agent id | The `local_...` session id or the subagent name, from `crew/roster.md` |
| Last real output | What the agent last produced that counts as progress, in a few words, with its source |
| Last output (UTC) | When that happened |
| Dormant since | The UTC time progress stopped, or blank while ACTIVE |
| Current problem | The one problem the agent is working, in its own failure's terms |
| Identical attempts | Tries with the same approach, inputs and environment on that problem |
| Distinct approaches | Materially different approaches tried on that problem |
| State | ACTIVE, DORMANT, LOOPING, STUCK, PAUSED or TERMINATED |
| Last MOON action | The last thing MOON did about this agent, with its UTC time |

Counts reset only when the problem changes or is solved. They do not reset on a new message, a new turn, a re-brief or a compaction.

## Where progress comes from

Use what the agent did, never what it says it did. An agent's "almost done" is not an observation.

| Source | How to read it | What it proves |
|---|---|---|
| Transcript or events | `list_events` for the session; for a subagent, the output it has actually written | Tool calls made, checks run and their results, errors repeated |
| Beacon heartbeat | `~/.wasp-nest/beacon/sessions/claude-<cli-session-id>.json` (read only): `lastEventAt`, `lastProgressAt`, counts, flags | That events occurred and when. Its progress signals are not proof the task succeeded |
| Git activity | In the agent's worktree, read only: `git --no-optional-locks status --porcelain`, `git log -1 --format=%cI`, `git diff --stat` | Files changed, commits made, and when |

The desktop `local_...` id is not the heartbeat's session id. Resolve it the way the TARS reference describes (the app's session file, then worktree and branch match). Unresolved is a valid answer; write it down and rely on the other two sources.

Progress, as the armament defines it: a file changed, a check ran, a result was produced, a necessary question was sent, or a finding changed the next action. Reading with no consequence, narration and status messages do not count.

When sources disagree (events show activity but the heartbeat is still), record both and re-resolve the heartbeat id. When no source can be read for an agent, the row says "unobserved" and MOON takes no action against it on that basis.

## Thresholds

These come from `time-blocked-turns`. They are measured on wall-clock time from real output.

| Observation | State | MOON's action |
|---|---|---|
| Progress within the last 5 minutes | ACTIVE | None |
| 5 to 10 minutes without progress | ACTIVE, watch | Note it in the log |
| 10 minutes without progress | DORMANT | One nudge: a single message naming the time of last progress and asking what changed or what blocks. One nudge per dormancy, not a stream |
| 20 minutes without meaningful progress | STUCK | Intervene, per [guide 03](03-intervene-pause-or-terminate.md) |
| A third identical attempt (same approach, inputs, environment) | LOOPING | Intervene |
| The last three actions look alike and produced nothing new | LOOPING | Intervene |
| A fourth approach on one problem (three have already failed) | STUCK | Intervene, and consider `INVESTIGATE` to LADY |
| 45 minutes into a work unit | Unchanged | One line to TARS: agent, unit start, done, remaining |
| 60 minutes into a work unit | Unchanged | One line to TARS: the unit deadline was reached. MOON grants no extension; only the owner does |

Exceptions, recorded and reported instead of acted on:

- A session waiting on an owner permission prompt is waiting on the owner. One line to the owner.
- A session the owner is driving is the owner's. One line to the owner.
- TARS and OWEL are never paused or terminated by MOON. Report a stalled TARS or OWEL to the owner in one line.
- An agent waiting on an answer it asked for is not dormant on that question. Tell TARS the question is open.

## One pass

1. Read `crew/roster.md` for the current agents. Add rows for new ones; never delete a row.
2. For each agent, read the three sources and update the row.
3. Compare against the thresholds and set the state.
4. Append one line per observation that changed something to the log.
5. Act: nudge, report a mark, or start an intervention. One batched message per session per event.
6. Send OWEL a `LEDGER MOON progress` line only when a state changed. Routine passes with no change stay in the recorder.

## Writing rules

- Rewrite the table in place; append to the log. Never edit or remove a past log line. A wrong line is corrected by a new line that says so.
- Every time is UTC with its source (events, heartbeat, git).
- No transcript bodies, credentials or customer data in the recorder. Quote only the exact error text needed to show a repeat.
- Append-only is a rule MOON follows. Nothing in the harness guards this file.
