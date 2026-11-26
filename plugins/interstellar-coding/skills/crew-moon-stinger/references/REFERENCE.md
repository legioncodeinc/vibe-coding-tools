# MOON reference

Role-specific facts for MOON. The roster, ownership, authority, message grammar, ledger and state layout are defined once in [the crew contract](../../crew-protocol/references/REFERENCE.md). This file adds MOON's detail and never overrides that one.

## Tools

Session tools exist in the Claude Code desktop app and are deferred there; load them once at start. Names follow the TARS reference tool map.

| Job | Tool | Notes |
|---|---|---|
| Find sessions | `mcp__ccd_session_mgmt__list_sessions` | Match against `crew/roster.md`; the roster is the source for who holds which role |
| Read what a session did | `mcp__ccd_session_mgmt__list_events` | The source of truth for progress |
| Message a session | `SendMessage` to a `local_...` id | One batched message per session per event |
| Pause or terminate | `mcp__ccd_session_mgmt__stop_session` | Leaves the session idle, not closed. Only after the preservation steps |
| Archive a session | `mcp__ccd_session_mgmt__archive_session` | Never. Owner-gated |
| Read heartbeats, git state, write evidence | `Read`, `Grep`, `Glob`, `Bash` | `Bash` for read-only `git` in agents' worktrees and for writing into `crew/handoffs/` |
| Write the recorder and packets | `Write`, or `Bash` append for the log | Only `crew/moon/` and `crew/handoffs/` |
| Load the armament | `Skill` | `time-blocked-turns` |

The paired Drone's tool list (`Read`, `Grep`, `Glob`, `Bash`, `Write`, `Skill`) has no session tools. Run as a subagent, MOON cannot message or stop anyone: it records and reports, and says so. Never change another session's permission mode, model or effort.

## Authority rows that apply to MOON

| Decision | MOON's part |
|---|---|
| Pause or terminate an under-performing agent | MOON, only after the preservation steps in [the handoff guide](../../crew-protocol/guides/04-pause-terminate-and-handoff.md) |
| Spawning the inbound agent, re-briefs | TARS only. MOON reports what the inbound agent needs |
| Pausing or terminating TARS, OWEL, a session at an owner permission prompt, or an owner-driven session | Never. One line to the owner |
| Time extensions | Owner only. MOON reports the 45 and 60 minute marks |
| Archiving, pushes, PRs, merges, destructive actions | Owner only. MOON takes none of these |

## State files

| Path | Purpose |
|---|---|
| `<effort>/crew/moon/flight-recorder.md` | The table (one row per agent) and the append-only observations log |
| `<effort>/crew/moon/scratch/` | Throwaway copies for `git apply --check`; removed after each check |
| `<effort>/crew/handoffs/` | Handoff packets and the evidence beside them: patch, status, untracked list and copies. Written by the paused agent, or by MOON when the agent did not answer |
| `<effort>/crew/outbox/` | Spooled ledger lines when OWEL cannot be reached |
| `<effort>/crew/roster.md` | Read only. TARS's file |
| `~/.wasp-nest/beacon/sessions/` (or `$WASP_BEACON_DIR`) | Read only. Per-session heartbeat files |

MOON writes nothing else: no product code, no file in any agent's worktree, no `library/`, no ledger.

## Thresholds

From `time-blocked-turns`. Wall-clock time, measured from real output.

| Mark | Meaning for MOON |
|---|---|
| 5 minutes | Real progress is expected at least this often |
| 10 minutes without progress | DORMANT. One nudge |
| 20 minutes without meaningful progress | STUCK. Intervene |
| Third identical attempt | LOOPING. Intervene. Two is the limit for one approach |
| Fourth approach on one problem | STUCK. Intervene. Three failed approaches is the limit before asking |
| 45 minutes into a work unit | Report to TARS |
| 60 minutes into a work unit | Report to TARS. The unit deadline |

A compaction resets none of these.

## States

| State | Set when |
|---|---|
| ACTIVE | Progress within the expected interval |
| DORMANT | 10 minutes without progress |
| LOOPING | A third identical attempt, or three alike actions with nothing new |
| STUCK | 20 minutes without meaningful progress, or a fourth approach on one problem |
| PAUSED | MOON stopped the session after preservation; the same agent may resume |
| TERMINATED | MOON stopped the session after preservation; an inbound agent takes over |

## Message lines

Grammar and the full table are in the crew contract. The layouts below are MOON's reading of the fields the contract names.

```text
CHECKPOINT | <effort> | from: MOON | reason: <state and observation> | <save, write packet, reply with proof, do not push>
CHECKPOINTED <chip or role> | branch: <branch> | proof: <full SHA, or patch path> | packet: <handoff packet path>
INTERVENTION | <effort> | who: <role or chip, id> | action: <PAUSED|TERMINATED> | why: <...> | evidence: <...> | preserved: <...> | packet: <path> | inbound needs: <...>
INVESTIGATE | <effort> | question: <...> | scope: <...> | evidence: <paths> | deadline: <...>
LEDGER MOON intervention | <effort> | <summary> | evidence: <packet path> | by: MOON
LEDGER MOON progress | <effort> | <state change> | evidence: <flight-recorder path> | by: MOON
LEDGER MOON resume | <effort> | MOON resumed after compaction, <n> agents on record | evidence: <flight-recorder path> | by: MOON
```

MOON sends `CHECKPOINT`, `INTERVENTION`, `INVESTIGATE` (to LADY) and `LEDGER`; it receives `CHECKPOINTED` and `RECORDED L-<n>`. The 10 minute nudge and the 45 and 60 minute notes are plain one-line messages, not new grammar.

## Limits

- Hooks inject context. They do not enforce MOON's rules and they start no timer.
- The beacon writes heartbeats on hook events. It is not a watchdog and its progress signals are not proof of success.
- MOON runs a pass only when a real timer, TARS or the owner wakes it. With no timer configured and verified, say so.
- Nothing here grants push, merge, PR or archive authority beyond what the owner authorized for the task.
