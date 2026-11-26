# Start and resume

MOON's value is its record. That record lives in `crew/moon/flight-recorder.md`, not in MOON's context, so a restart or a compaction must lose nothing: attempt counts, dormancy times and past interventions all come back from the file.

Shared procedure: [session start and compaction recovery](../../crew-protocol/guides/03-session-start-and-compaction-recovery.md). Shared worksheet: [recovery worksheet](../../crew-protocol/references/templates/recovery-worksheet.md).

## First start

1. Claim check. When the owner types `/moon`, the crew hook records the role claim for this session and prints a line saying so. If no hook line appears, hooks are not active in this session. Say that in one line. The fallback after any compaction is then the owner saying "re-ingest /moon".
2. Read [the crew contract](../../crew-protocol/references/REFERENCE.md).
3. Load the armament: [time-blocked-turns](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/time-blocked-turns), its `SKILL.md` and `references/agent-instructions.md` in full.
4. Find the effort folder from TARS's `crew/roster.md` (default `<repo>/.tars/<effort-slug>/`). If there is none, ask the owner in one line which folder to use.
5. Check which tools are reachable and say so plainly:
   - Session tools (`list_sessions`, `list_events`, session messaging, `stop_session`). In the Claude Code desktop app they are deferred; load them once. If they do not load, MOON cannot message or stop anyone. Say "MOON cannot reach session tools here; recording and reporting only" and keep to that.
   - The beacon heartbeat folder (`~/.wasp-nest/beacon/sessions/`, or `$WASP_BEACON_DIR`). Missing means the beacon hook is not installed; note it and use the other sources.
   - Read access to each agent's worktree, for git activity.
6. Check for a timer. MOON is not a running watchdog. A pass happens only when something wakes MOON: a configured timer, a message from TARS, or the owner. If the task has a real timer for MOON's passes, verify it exists (for example with `CronList`) before saying a watch is running. If there is none, say "no timer: passes run when asked". Arm one only when the owner or TARS's authorized run says to.
7. Create `crew/moon/flight-recorder.md` from [the template](../references/templates/flight-recorder.md) if it is missing. Fill the header: effort, sources available, timer state.
8. Read `crew/roster.md` and add one row per agent it lists. Then run the first pass per [guide 02](02-keep-the-flight-recorder.md).

## What to restore, and from where

| Fact | Source of truth |
|---|---|
| Role, effort folder | The hook notice, the compaction summary, then `crew/roster.md` |
| Which agents exist and their ids | `crew/roster.md` (TARS's file, read only) |
| Per agent: last real output, dormant since, problem, attempt and approach counts, state | The table in `crew/moon/flight-recorder.md` |
| What MOON has already done: nudges, checkpoints, interventions | The observations log in the same file |
| Interventions in flight and what was preserved | `crew/handoffs/` |
| Timer state | The recorder header, then a fresh check that the timer still exists |
| What OWEL has recorded | `RECORDED L-<n>` ids in the observations log |

Then refresh each row from live sources. The file says where things stood; the transcripts, heartbeats and git say where they stand now.

## Recovery order after compaction

Do these in order. Send no nudge, checkpoint or stop until step 6.

1. Reinvoke the role skill: load `crew-moon-stinger` again and read it.
2. Re-arm: load `time-blocked-turns` and its agent instructions again. Use its [compaction worksheet](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/time-blocked-turns/references/recover-after-compaction.md) for MOON's own work unit.
3. Read [the crew contract](../../crew-protocol/references/REFERENCE.md).
4. Restore state from the effort folder using the table above.
5. Send OWEL one line: `LEDGER MOON resume | <effort> | MOON resumed after compaction, <n> agents on record | evidence: <path to flight-recorder.md> | by: MOON`. If OWEL cannot be reached, spool it to `crew/outbox/`.
6. Only then continue with the next pass.

## What a compaction does not reset

- Attempt and approach counts. A third identical attempt after a compaction, MOON's or the agent's, is still a third attempt.
- An agent's work-unit start. A new message or a compacted context does not buy another hour.
- An intervention in flight. If the log shows `CHECKPOINT` was sent and nothing after it, resume the ladder at the step after the last one recorded. Do not send a second checkpoint and do not skip to the stop.

## Limits

- The hook injects context. It cannot make MOON run a pass, start a timer or stop an agent.
- The beacon records events when they happen. It does not wake up on its own either.
