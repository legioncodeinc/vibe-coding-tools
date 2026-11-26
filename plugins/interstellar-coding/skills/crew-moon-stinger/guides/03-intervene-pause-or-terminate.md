# Intervene: pause or terminate

MOON may pause or terminate an under-performing agent. It may do so only after that agent's work is safely stored and ready for the inbound agent TARS will spawn. The order below is strict: no step is skipped and none is reordered.

Read the shared guide first: [pause, terminate and handoff](../../crew-protocol/guides/04-pause-terminate-and-handoff.md). The packet format is [the handoff packet template](../../crew-protocol/references/templates/handoff-packet.md). Where the shared guide and this one differ, the shared guide wins.

## Before the ladder

Confirm all of these. If one fails, do not start.

- The trigger is on record: the flight recorder row shows STUCK or LOOPING with the observation that set it (see [guide 02](02-keep-the-flight-recorder.md)).
- The target is not TARS, not OWEL, not a session waiting on an owner permission prompt, and not a session the owner is driving. For any of those, send the owner one line and stop.
- The target is not simply waiting on an answer it asked for.
- MOON can reach the session tools. If it cannot, record, report to TARS, and stop here.

## The ladder

### 1. Ask the agent to checkpoint

Send one message:

```text
CHECKPOINT | <effort> | from: MOON | reason: <STUCK or LOOPING, with the observation> | Save your work now. Commit to your own branch if commits are authorized for your task, otherwise write a patch to <effort>/crew/handoffs/. Write the handoff packet. Reply CHECKPOINTED with the proof. Do not push.
```

Wait one short interval: up to 5 minutes, or until the reply arrives. The expected reply:

```text
CHECKPOINTED <chip or role> | branch: <branch> | proof: <full SHA, or patch path> | packet: <handoff packet path>
```

A reply is a claim. It is checked in step 3 like everything else. If it arrives, go to step 3.

### 2. No answer: capture the evidence yourself, read-only

Change nothing in the agent's worktree. No `add`, `commit`, `stash`, `checkout`, `reset`, `clean`, or edits. Write only into `<effort>/crew/handoffs/`. Name every file for one intervention with the same stem, `<stem>` = `<UTC yyyymmddThhmmZ>-<role-or-chip>`, so the packet and its evidence sit together.

```bash
WT=<agent worktree>; OUT=<effort>/crew/handoffs
git --no-optional-locks -C "$WT" rev-parse HEAD > "$OUT/<stem>-head.txt"
git --no-optional-locks -C "$WT" branch --show-current >> "$OUT/<stem>-head.txt"
git --no-optional-locks -C "$WT" status --porcelain=v1 -b > "$OUT/<stem>-status.txt"
git --no-optional-locks -C "$WT" diff HEAD --binary > "$OUT/<stem>.patch"
git --no-optional-locks -C "$WT" ls-files --others --exclude-standard > "$OUT/<stem>-untracked.txt"
```

- The patch holds staged and unstaged changes to tracked files, relative to the recorded `HEAD`.
- Untracked files are not in a patch. Copy the listed files (a copy, never a move) into `$OUT/<stem>-untracked/`, keeping their paths. Do not copy ignored files. If a listed file looks like a credential or holds customer data, do not copy it: list it in the packet as "left in place, not copied" and tell TARS.
- Save the last transcript lines that show the state of the work: the final actions and the exact repeated error, as a short excerpt in the packet. Not the transcript body.
- Write the handoff packet yourself from the shared template: who, task, branch and `HEAD`, what is done, what failed and how many times, the evidence paths, what the inbound agent needs first. Mark it "written by MOON, agent unresponsive", and carry over the work unit's start, deadline and attempt counts: a replacement does not get a new allowance.

### 3. Verify the proof exists

| Proof claimed | Check | Passes when |
|---|---|---|
| Commit SHA | `git -C <repo> cat-file -e <SHA>^{commit}` and `git -C <repo> branch --contains <SHA>` | The commit resolves and sits on the named branch. Note whether it is local only; MOON does not push |
| Patch file | `test -s <patch>`, then `git apply --check <patch>` inside a scratch copy of the same `HEAD` (for example `git -C "$WT" archive HEAD` unpacked under `crew/moon/scratch/`, removed afterwards) | The file is non-empty, covers the files the status listed as changed, and applies cleanly. If the apply check cannot be run, write "patch unverified" in the packet and the `INTERVENTION` |
| Untracked copies | Compare the copied list with `<stem>-untracked.txt` | Every listed file is copied or named as left in place |
| Handoff packet | Read it | It exists and names the branch, the proof and the next step |

A clean worktree with nothing to preserve is a valid result: record `HEAD` and say so.

If the proof does not hold and MOON cannot make it hold read-only, **do not stop the agent**. Escalate to TARS and the owner with what is at risk. Work that cannot be preserved is never traded for a stop.

### 4. Only then: pause or terminate

| Action | Use when | What MOON does |
|---|---|---|
| Pause | The same agent can resume after an answer or a re-brief | `stop_session` on the session, leaving it idle. Mark the row PAUSED |
| Terminate | The agent looped again after a checkpoint or re-brief, or its context is no longer usable | `stop_session`, mark the row TERMINATED, and state that an inbound agent is needed |

Both leave the session idle and unarchived. Archiving a session is an owner-gated action MOON never takes. MOON does not delete the worktree, the branch or anything else the agent made.

A subagent inside another session cannot be stopped by MOON. Ask TARS, who spawned it, to stop it, and say so in the record.

### 5. Tell TARS and OWEL

```text
INTERVENTION | <effort> | who: <role or chip, id> | action: <PAUSED or TERMINATED> | why: <trigger and observation> | evidence: <recorder row, transcript excerpt path> | preserved: <branch and SHA, or patch path; untracked copy path; verified or unverified> | packet: <path> | inbound needs: <first step, open question, what not to retry>
```

```text
LEDGER MOON intervention | <effort> | <role or chip> <paused or terminated>: <one-line why> | evidence: <packet path> | by: MOON
```

Append the same facts to the observations log and update the row's last MOON action. TARS decides whether to re-brief or spawn an inbound agent. MOON spawns nothing.

If the problem itself looks hard rather than the agent weak (three approaches failed for different reasons), MOON may also send `INVESTIGATE` to LADY with the question, scope, the evidence paths and a deadline.

## Hard limits

- Never pause or terminate TARS, OWEL, a session waiting on an owner permission prompt, or a session the owner is driving. Report those to the owner in one line.
- Never delete, reset, stash, force-push or edit another agent's files.
- Never write product code, and never finish the agent's task for it.
- Never stop an agent whose work cannot be preserved. Escalate to TARS and the owner.
- Never archive a session, push, open a PR or merge.
- Without session tools, record and report only.

These limits are behavioural. No hook or sandbox enforces them; MOON follows them.
