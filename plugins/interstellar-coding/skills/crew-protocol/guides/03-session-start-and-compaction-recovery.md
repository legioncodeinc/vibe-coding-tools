# 03. Session start and compaction recovery

How a role gets its rules back. Sources: `D2`, `D3`, `D4` in [the distillation](../references/research/distilled-crew-protocol.md).

## Why this exists

A long session gets its context compacted. The summary keeps facts and drops rules, and a role that has lost its rules starts doing someone else's job. On 2026-11-02 a compacted TARS ran production data scripts itself until the owner told it to re-ingest its skill (D4). The fix is mechanical: record which role a session holds, and re-issue the "load your skill" order whenever the session starts, resumes or is compacted.

## What the hook does

| Moment | Hook event | Result |
|---|---|---|
| The owner, or a brief, types a crew command such as `/kipp` | `UserPromptSubmit`, `UserPromptExpansion` | The session id is recorded as holding that role. One context line confirms it |
| The session starts, resumes or is cleared | `SessionStart` (`startup`, `resume`, `clear`) | If the session holds a role, or was started as a crew Drone, the model is told its role and to load the role skill and armament first |
| Context was compacted | `SessionStart` (`compact`) | The post-compact resume: reinvoke the role skill, re-arm, read the contract, restore state, tell OWEL, then continue |
| Just before compaction | `PreCompact` | The summary is asked to keep the role, skill and effort folder |
| A crew Drone is spawned as a subagent | `SubagentStart` | The subagent is told to load its paired skill first |

`PostCompact` is not used: that event cannot add context for the model, so the resume binds to `SessionStart` with source `compact` (D2). A session that holds no role gets nothing from any of these.

## What the role does

When you see the hook's notice, the owner says "re-ingest", or you notice your summary no longer holds your rules, do this before any other work, in order:

1. Reinvoke your role skill. Read `SKILL.md` and every guide it points to, in full.
2. Re-arm: load the armament skill named in the contract's roster.
3. Read [the contract](../references/REFERENCE.md).
4. Restore state from the effort folder and the ledger tail, not from the summary. A summary is a pointer to evidence. An action it says was under way resumes only if the record shows who approved it.
5. Recover what the summary cannot be trusted on: the measured start and deadline of the work unit, attempt counts on the current problem, pending questions, and what was verified against which exact candidate. Use [the recovery worksheet](../references/templates/recovery-worksheet.md). Unknown stays `UNKNOWN`; never grant yourself a fresh hour or a fresh attempt.
6. Send OWEL `LEDGER <ROLE> resume | <effort> | resumed after <compaction or restart>; state restored from <path> | evidence: <path or none> | by: <ROLE>`. OWEL appends its own resume entry directly.
7. Continue.

If a step fails (the skill will not load, the effort folder is missing), tell TARS and the owner in one line and wait. Do not improvise from the summary.

## Recording the effort folder

The claim can carry the effort folder so the recovery notice names it. A role that knows its hook session id may run:

```bash
node <plugin-root>/hooks/crew-hook.mjs claim <role> --session <session-id> --effort <absolute effort folder>
```

Without it the notice says no effort folder is on record, and the role finds it in its last handoff or asks TARS. The Desktop `local_...` id is not the hook's session id; do not guess one from the other.

## Limits, stated plainly

- The hook injects context. It does not enforce anything, start a timer, or stop an agent. A model can still ignore it.
- Claude Code loads `hooks/hooks.json` from an installed plugin. Codex reads the same file but runs it only after the user trusts the hook. Neither delivery was observed live for this plugin on 2026-11-25; the script was exercised directly with sample payloads.
- Cursor uses different hook event names and has no documented compaction event, so this plugin does not wire Cursor. A home-directory install (copied skills and commands, no plugin) carries no hook binding either. In both cases the fallback is the owner saying "re-ingest" followed by the role command.
- A session that is forked, or that gets a new id after `/clear`, holds no claim until the role command is typed again.
- Claims older than 30 days are ignored.
