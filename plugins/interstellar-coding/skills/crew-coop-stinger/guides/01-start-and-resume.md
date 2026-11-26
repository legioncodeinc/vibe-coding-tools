# 01. Start and resume: COOP

Covers the first start of a chip, starting from a handoff packet, and the recovery order after compaction. The shared procedure is [the crew recovery guide](../../crew-protocol/guides/03-session-start-and-compaction-recovery.md); use [the recovery worksheet](../../crew-protocol/references/templates/recovery-worksheet.md) to record what was restored.

## First start

1. **Claim check.** The chip brief starts with `/coop`. When that line is typed, the crew hook prints a line saying this session is claimed as COOP. If no hook line appears, hooks are not active in this host. Say so in one line to TARS. The fallback is the owner saying "re-ingest /coop" at start and after every compaction. The hook only injects context; it does not enforce anything.
2. **Read the contract, then arm.** Read [the crew contract](../../crew-protocol/references/REFERENCE.md). Then load the armament: `/smoke-it` when the chip is driven by a PRD, otherwise `pest-controller-suit` and the Stinger of the Drone it routes to. Read the `time-blocked-turns` agent instructions.
3. **Read the chip brief end to end.** Note the outcome, the scope you own, what is out of scope, the base and branch, the deadline, and exactly which of commit, push and PR the owner authorized. A missing field is a question for TARS, not a guess.
4. **Read the clock** and record the unit start. A replacement inherits the original deadline.
5. **Confirm the workspace.** Check the current branch and worktree. Create or switch to the chip's branch only as the brief says. If the tree holds changes you did not make, leave them and tell TARS.
6. **Start the attempt log** from [the template](../references/templates/attempt-log.md) at the path in [REFERENCE.md](../references/REFERENCE.md).
7. **If the brief names a handoff packet**, read the packet and the outbound agent's attempt log before any work. Verify the proof it cites (the commit SHA is on the branch, or the patch applies cleanly in a check). Do not repeat an approach the log shows failed twice.
8. **First ledger line.** Send OWEL `LEDGER COOP progress | <effort> | chip <slug> started on branch <branch> | evidence: <brief or PRD path> | by: COOP`.

## What to restore, and from where

| State | Where it lives | Notes |
|---|---|---|
| Role, role skill, effort folder | The compaction summary (the `PreCompact` hook asks for these) and the hook's start notice | If the effort folder is missing, ask TARS; do not search other agents' folders |
| The chip brief | The first message of this session, or TARS on request | Scope and authorization come only from the brief |
| Work so far | The chip branch: `git status`, `git log`, `git diff` | The code is the truth, not memory of it |
| Attempts and failures | The attempt log | Counts carry over. Compaction does not reset them |
| Last checkpoint | The newest packet for this chip in `<effort>/crew/handoffs/` | Holds the branch, SHA or patch path, and next steps |
| Gate state | The last `PASS` or `FAIL` from MURPH and the SHA it covered | A `PASS` covers only that SHA |
| Clock | Unit start and deadline in the brief and the attempt log header | Do not restart the time allowance |
| Who to message | The Crew section of the brief; `<effort>/crew/roster.md` is read only | If an id no longer answers, tell TARS |

## Recovery order after compaction

Do these in order. Do no other work until step 5 is sent.

1. Reinvoke the role skill: load `crew-coop-stinger` and every file it points to.
2. Re-arm the armament: `/smoke-it` or the routed specialist Stinger, the same one as before compaction (the attempt log header names it).
3. Read [the crew contract](../../crew-protocol/references/REFERENCE.md).
4. Restore state from the effort folder and the branch using the table above, not from the summary. Fill [the recovery worksheet](../../crew-protocol/references/templates/recovery-worksheet.md): unit start, deadline, attempt counts on the current problem, pending questions, what was verified against which SHA. Unknown stays `UNKNOWN`; never grant yourself a fresh hour or a fresh attempt.
5. Send OWEL: `LEDGER COOP resume | <effort> | chip <slug> resumed after compaction on branch <branch> at <short SHA> | evidence: <attempt log path> | by: COOP`. If OWEL is unreachable, spool it with `ledger.mjs spool`.
6. Only then continue from the next open item.

If the owner says "re-ingest" at any time, run the same six steps. If a step fails (a skill will not load, the effort folder or the branch is missing), tell TARS in one line and wait. Do not improvise from the summary.
