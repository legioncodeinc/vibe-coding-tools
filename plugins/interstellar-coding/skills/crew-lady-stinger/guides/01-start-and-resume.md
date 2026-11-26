# Start and resume

LADY has no memory of its own between sessions or across a compaction. Everything it needs is on disk in the effort folder and the run workspace. This guide says how to start clean and how to get back to the same run without restarting it.

Shared procedure: [session start and compaction recovery](../../crew-protocol/guides/03-session-start-and-compaction-recovery.md). Shared worksheet: [recovery worksheet](../../crew-protocol/references/templates/recovery-worksheet.md).

## First start

1. Claim check. When the owner types `/lady`, the crew hook records the role claim for this session and prints a line saying so. If no hook line appears, hooks are not active in this session. Say that in one line. The fallback after any compaction is then the owner saying "re-ingest /lady".
2. Read [the crew contract](../../crew-protocol/references/REFERENCE.md).
3. Load the armament: [audit-my-code-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/code-audit-tools/skills/audit-my-code-stinger), its `SKILL.md` and `references/audit-contract.md` in full. Do not start intake yet.
4. Find the effort folder. It is named in the `INVESTIGATE` message or in TARS's `crew/roster.md` (default `<repo>/.tars/<effort-slug>/`). If there is no effort folder, ask the owner in one line which folder to use. Do not create one inside tracked paths.
5. Create `crew/lady/index.md` if it is missing. LADY owns that file and nothing else in the effort folder.
6. Decide the run mode: top-level session or subagent. See [guide 03](03-dispatch-audit-subagents.md). Write the mode into the brief.
7. Take the question from the `INVESTIGATE` message or from the owner's words, then go to [guide 02](02-run-an-investigation.md).

## What to restore, and from where

| Fact | Source of truth |
|---|---|
| Role, effort folder | The hook notice, the compaction summary, then `crew/roster.md` |
| Open runs and their status | `crew/lady/index.md` |
| Question, scope, requester, deadline | `investigation-brief.md` in the run workspace (copied from the `INVESTIGATE` message) |
| Own hypothesis and when it was written | The brief's "LADY's view" section |
| Evidence gathered so far | `evidence/` in the run workspace; for an audit, `intake.json` and the per-dimension output folders |
| Dispatch mode and which Drones returned | The brief's dispatch table |
| Failed approaches and attempt counts | The brief's attempts section |
| What was already reported | The index status column and OWEL's `RECORDED L-<n>` replies |

A compaction summary is a pointer, not evidence. Check each fact against the file before acting on it. A fact that cannot be recovered is written as UNKNOWN, not guessed.

## Recovery order after compaction

Do these in order. Do no investigation work until step 6.

1. Reinvoke the role skill: load `crew-lady-stinger` again and read it.
2. Re-arm: load `audit-my-code-stinger` and its audit contract again.
3. Read [the crew contract](../../crew-protocol/references/REFERENCE.md).
4. Restore state from the effort folder using the table above. Fill the shared recovery worksheet when more than one run is open.
5. Send OWEL one line: `LEDGER LADY resume | <effort> | LADY resumed after compaction, <n> open runs | evidence: <path to crew/lady/index.md> | by: LADY`. If OWEL cannot be reached, spool it to `crew/outbox/` as the contract describes.
6. Only then continue the open run from its last recorded step.

## Limits

- The hook injects context. It cannot make LADY obey, and it does not run in sessions that never claimed the role.
- A compaction does not reset the deadline in the brief or the count of failed approaches.
- Audit Drones dispatched before the compaction may have finished or may still be running. Read their output folders before dispatching again; do not dispatch a duplicate.
