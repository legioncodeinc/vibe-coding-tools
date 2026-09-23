# Session-start hooks

The cadence is auto-injected at the start of every session in Claude Code, Devin CLI, and Cursor, via each tool's native hook system — no need to paste the protocol in manually. One canonical content file (`hooks/session-start-context.md`, next to this doc's folder) holds the condensed cadence plus a pointer to the full `agent-instructions.md`; each harness's hook reads that same file and wraps it in that harness's own output contract. Wired 2026-09-08.

## Claude Code
- Config: `~/.claude/settings.json` → `hooks.SessionStart`
- Command: `jq -Rs '{hookSpecificOutput:{hookEventName:"SessionStart",additionalContext:.}}' <path to session-start-context.md>`
- Output contract: `{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"..."}}`
- Verified: `settings.json` is valid (`jq -e` on the new hook entry), the exact configured command was executed and produces well-formed output. `SessionStart` only fires at a new session's start, so live-fire inside the session that wrote it isn't observable — takes effect on the next Claude Code session (or a `/hooks` reload).

## Devin CLI
- Config: the *same file*, `~/.claude/settings.json` → `hooks.SessionStart`. Devin CLI documents this exact path as a supported global hook location and natively reads Claude Code's hook format from it — confirmed by quoting [Devin's hooks docs](https://docs.devin.ai/cli/extensibility/hooks/overview) verbatim, not paraphrased. No separate Devin config file exists or is needed.
- Verified: same JSON validity/command test as Claude Code (it's the same file). Not verified against a live Devin CLI session — `devin` isn't on PATH on this machine, though `~/.devin/` shows a local install (extensions added 2026-09-07).

## Cursor
- Config: `~/.cursor/hooks.json` → `sessionStart`
- Script: `~/.cursor/hooks/session-start-cadence.mjs` (Node, reads the same `session-start-context.md`, wraps it as `{"additional_context": "..."}`)
- Output contract: `{"additional_context": "..."}` — flat, snake_case; different shape from Claude Code/Devin's nested `hookSpecificOutput`, so it can't share the exact wrapper, only the source content.
- Verified: `hooks.json` parses; the script was executed directly and produced valid JSON carrying the full file content. Cursor's own docs confirm `sessionStart` supports `additional_context` injection. Not verified against a live Cursor session.
- Related but separate finding: the four pre-existing `~/.cursor/rules/*.mdc` files (mirroring the Claude Code global rules) are project-scoped per Cursor's docs, so they likely don't apply unless `%USERPROFILE%\` itself is opened as a Cursor project. Not touched here — flagged separately.

## What this doesn't guarantee
All three are fire-and-forget context injection, not enforcement. A hook failing silently just means the session starts with no cadence context and no visible error. None of this makes the receiving model actually follow the protocol — that's still self-enforced instruction-following, the same caveat `agent-instructions.md` and `origin-and-examples.md` already state about the whole system.
