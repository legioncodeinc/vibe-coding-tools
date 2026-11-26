# 02. Spawn and track chips

Derived from `distilled-tars.md` D1, D2, D6.

1. **Scope the ask.** Write one sentence: the outcome the owner asked for, in their words. If it is more than one small PR, draft the split and send it to CASE (`05-questions-and-decisions.md`) before spawning anything.
2. **Check for duplicates.** `list_sessions`; if a live session already owns the work, manage or message it only within the owner's explicit session-coordination authorization and record that.
3. **Write the brief** from `references/templates/chip-brief.md`. Fill in the TARS session id (`get_session("self")`), the command the chip runs its work through (`/smoke-it <PRD path>` when a reviewed PRD drives the build, `/wasp-nest-core:source-command-pest-controller` for everything else; never leave it blank), the Drone the chip should arm itself with, the base branch, exact scope, pre-approved risks with source and scope, CASE conditions, and the done checks. Assign any migration number, PG TOKEN slot or HARNESS run the chip needs from the ledger registries and name it in the brief ([08](08-lessons-2026-11-02.md), rule 8).
   - The pest-controller command is marked `disable-model-invocation`: neither the chip nor TARS can run it through the Skill tool. Tell the chip the fallback: spawn the named Drone with the `Agent` tool, armed with its Stinger ([08](08-lessons-2026-11-02.md), rule 6).
   - Production data scripts always go to a chip, never to TARS. The owner types the approval in that chip's session; a chip that refuses a relayed approval is right ([08](08-lessons-2026-11-02.md), rule 1).
4. **Offer the chip** with `start_session` (`spawn_task` in older builds). Use `initiation: "offer"` for work the owner named in their latest message, then send the brief with the returned `proposal_id` once they choose New session; use `own_initiative` (brief in `prompt`) for a chip TARS proposes itself. Either way the owner starts it. Record title, `task_id`, and scope in the ledger's Sessions table with state `OFFERED`.
   - `start_session` only works on a turn the owner typed. On a tick, or after a message from another session, record the chip as `PROPOSED`, tell the owner in one line, and offer it on their next turn ([08](08-lessons-2026-11-02.md), rule 5).
5. **Link the session** on the next tick: find the new session in `list_sessions` (family first, then exact title). Record its `local_...` id; state `RUNNING`. The roster changed, so recreate the tick with the new `Managed sessions` line (`03-ten-minute-tick.md` step 5).
6. **When it opens a PR**, add `pr <n> <owner/repo> [required-check]` to `watch.txt` and record the PR number.
7. **Withdraw stale chips** the owner has not started with `dismiss_task` when the ask changes, and say why in the ledger.

Never give a chip more than one outcome. Never spawn a chip for TARS's own bookkeeping. Messages to chips share one budget: 10 cross-session sends per owner message, so batch and send blockers first (`05-questions-and-decisions.md` step 8).

Feature requests start in KIPP, using `07-case-and-kipp.md`. KIPP writes the PRD with `library-stinger` loaded; KIPP reserves the PRD number; TARS runs the PRD past CASE as a one-line proportion check before a `/smoke-it` build chip. Contracts go to a contract chip. KIPP does not spawn work chips. CASE and KIPP are helper sessions, not implementation chips.
