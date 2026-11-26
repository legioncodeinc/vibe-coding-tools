# 04. Pause, terminate and hand off

MOON is authorized to pause or terminate an under-performing agent, but only after its work is safely stored and made ready for the inbound agent TARS will spawn (`D1` in [the distillation](../references/research/distilled-crew-protocol.md)). This guide is the shared procedure. MOON's own skill carries the thresholds that trigger it.

## The order never changes

1. **Ask.** Send `CHECKPOINT` to the agent. A working agent commits its work in progress on its own branch (or writes a patch file when committing is not authorized), writes a handoff packet from [the template](../references/templates/handoff-packet.md) into `<effort>/crew/handoffs/`, and replies `CHECKPOINTED` with the branch, commit SHA or patch path, and the packet path.
2. **If there is no answer, capture without touching.** Read-only, from outside the agent's files: `git status`, the diff saved as a patch into `crew/handoffs/`, the untracked file list, and the last lines of the transcript. Then write the packet yourself and mark it "written by MOON, agent unresponsive".
3. **Verify.** The SHA resolves, or the patch file is not empty and contains the changes the status showed. Unverifiable work is not preserved work.
4. **Only then stop.** Pause leaves the session idle and resumable. Terminate stops it and marks it `TERMINATED` in the flight recorder. Archiving a session is owner-gated and no crew role does it on its own.
5. **Report.** `INTERVENTION` to TARS with who, why, the evidence, what was preserved and where, and what the inbound agent needs. `LEDGER MOON intervention` to OWEL.
6. **Replace.** TARS decides whether to spawn an inbound agent and briefs it from the packet. The inbound agent starts by reading the packet, not by redoing the outbound agent's failed approaches.

## What is never done

- Stopping an agent whose work could not be preserved. Escalate to TARS and the owner instead.
- Deleting, resetting, stashing, force-pushing or editing the paused agent's files or branch. Its worktree stays exactly as it was left.
- Pausing or terminating TARS, OWEL, a session waiting on an owner permission prompt, or a session the owner is driving. Those are reported to the owner in one line.
- Treating a missing entry in a session list as proof that a process stopped.
- Letting a replacement reset the clock. The work unit's start, deadline and attempt counts carry over in the packet.

## What a good packet lets the inbound agent do

Start within minutes, on the right branch, knowing what was tried and why it failed, what is verified, what is still open, and which approvals exist. If the inbound agent has to ask the outbound agent anything, the packet was incomplete.
