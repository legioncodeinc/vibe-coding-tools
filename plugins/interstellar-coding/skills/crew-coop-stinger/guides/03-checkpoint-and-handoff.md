# 03. Checkpoint and handoff

A `CHECKPOINT` from MOON or TARS means: save the work now and prove it. Answer it immediately, before finishing the current thought. The same steps apply when COOP stops itself at a retry, progress or time limit. Pause and termination rules are in [the crew handoff guide](../../crew-protocol/guides/04-pause-terminate-and-handoff.md); message formats are in [the crew contract](../../crew-protocol/references/REFERENCE.md).

## On CHECKPOINT

1. **Stop editing.** Finish no more than the write in progress. Do not start a build, a test run or a new attempt.
2. **Finish the attempt log.** Close the open row with its real result, even if the result is "interrupted".
3. **Save the work**, by the first path the chip brief allows:

   | Brief says | Do | Proof |
   |---|---|---|
   | Commits on your own branch are authorized | Stage only the paths in your chip scope, then commit on your own branch with a message starting `wip(<chip-slug>): checkpoint` | Branch name and the full SHA from `git rev-parse HEAD` |
   | Commits are not authorized | Write `git diff --binary HEAD` to `<effort>/crew/handoffs/<chip-slug>-<UTC>.patch`. List untracked files from `git ls-files --others --exclude-standard` in the packet, and archive them beside the patch | The patch path, its byte size, and the untracked file list |

   Never commit to a shared branch, never stage another agent's files, and do not push unless the brief authorizes pushes. If the patch file is empty and there are no untracked files, say so: there is nothing to save, and that is the proof.
4. **Write the handoff packet** from [the handoff packet template](../../crew-protocol/references/templates/handoff-packet.md) into `<effort>/crew/handoffs/`. Fill it for a reader who has never seen this session: outcome, what is done and checked, what is not, the branch and SHA or patch path, the attempt log path, the exact current failure, the next step you would take, open questions, and the remaining deadline.
5. **Reply** to whoever sent the `CHECKPOINT`, with a copy to TARS when MOON asked:

   ```text
   CHECKPOINTED <chip-slug> | branch: <branch> | proof: <full SHA, or patch path> | packet: <handoff packet path>
   ```

6. **Record it.** Send OWEL `LEDGER COOP handoff | <effort> | chip <slug> checkpointed | evidence: <packet path> | by: COOP`, or spool it.
7. **Wait.** After `CHECKPOINTED`, do nothing further on the chip until told to continue. MOON decides whether to pause or terminate; TARS decides whether an inbound COOP takes over.

## A checkpoint commit is a save, not a candidate

A `wip` commit preserves work on COOP's own unmerged branch. It is never called ready, never sent as a `GATE` candidate while it is known to be broken, and never merged. The Ship Gate still applies before any commit that is offered as finished work. If the chip brief does not authorize commits before the gate, use the patch file.

## When COOP stops itself

At 2 identical attempts, 3 failed approaches, 20 minutes without progress, or the deadline: run steps 1 to 4 and 6 above, then report to TARS with status STOPPED, the packet path, the attempt log path and the exact failure text. TARS routes it so MOON and LADY can act. Do not wait to be asked.

## Starting from someone else's packet

An inbound COOP reads the packet and the attempt log before any work, verifies the proof (the SHA exists on the branch, or the patch applies in a dry run), and continues from the packet's next step. It applies a patch only inside its own worktree and branch. It inherits the attempt counts and the deadline. If the proof does not check out, it tells TARS and stops.

## Limits

Nothing forces an agent to answer a `CHECKPOINT`; this is a rule COOP follows. A tool call that is already running cannot always be interrupted: report any overrun honestly when control returns. Nothing here grants push, PR or merge authority beyond the chip brief.
