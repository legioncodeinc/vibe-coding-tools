# Distilled research: crew protocol

Research window 2026-05-25 to 2026-11-25. Every claim cites a file under `raw/`. Where the archive is thin, that is said.

## D1. The owner's mandate

| Claim | Source |
|---|---|
| The team is managed by a lead development engineer, TARS; roles may be altered or added where warranted | `raw/owner-role-brief-2026-11-25.md` |
| TARS orchestrates with `tars-stinger`, collects progress throughout the project, and incorporates it additively by messaging OWEL | same |
| OWEL inserts a ledger entry for any update and never erases entries; the ledger is never deleted or edited, only appended to | same |
| KIPP is the product team and librarian, armed with `library-stinger` | same |
| CASE is a consultant and contrarian who brings a new perspective, and needed a skill written | same |
| LADY does deep independent investigation with `audit-my-code-stinger`, summoning sub-skills and creating sub-agents from the audit tool | same |
| MOON, armed with `time-blocked-turns`, keeps a running record of each agent's output, dormancy and repeated attempts, and may pause or terminate under-performing agents after their work is safely stored and ready for the inbound agent TARS will spawn | same |
| OWEL, armed with `knowledge-stinger`, maintains `library/knowledge/{private|public}`, observes CTRs, PRDs, PRs and decisions made with the user, reads transcripts, and writes documentation unprompted, including ADRs | same |
| Every role needs a command, an agent, a skill with guides and references, and hooks for session start and for a post-compact resume that reinvokes the skill every time | same |

## D2. Claude Code hook events

| Claim | Source |
|---|---|
| `SessionStart` fires with source `startup`, `resume`, `clear`, `compact` or `fork`, receives `session_id` and `agent_type`, and can add model context | `raw/claude-code--hooks-reference-2026-11-25.md` |
| `PostCompact` cannot add model context; `PreCompact` stdout becomes instructions for the compaction summary. So a post-compact resume must bind to `SessionStart` with source `compact` | same |
| `UserPromptSubmit` receives the typed line for a slash command; `UserPromptExpansion` receives `command_name` | same |
| `SubagentStart` receives `agent_type` and can inject context into the subagent; hooks run inside subagents | same |
| `additionalContext` over 10,000 characters is replaced by a file path and a short preview, so notices must stay short | same |
| A `PreToolUse` hook denies with `hookSpecificOutput.permissionDecision: "deny"` | `raw/in-repo-sources.md` (`src/hooks/dash-guard.mjs`) |

Thin: the exact form of `command_name` was not captured. The hook therefore accepts a name with or without a leading slash and with or without the plugin prefix, and also binds `UserPromptSubmit`.

## D3. How a plugin ships hooks, per harness

| Harness | Finding | Source |
|---|---|---|
| Claude Code | A plugin's `hooks/hooks.json` is loaded by convention; `${CLAUDE_PLUGIN_ROOT}` resolves inside it | `raw/claude-code--hooks-reference-2026-11-25.md`, `raw/in-repo-sources.md` (forge distillations) |
| Codex | Reads `hooks/hooks.json` by default from a plugin and shares the event vocabulary, but does not run plugin hooks until the user trusts them | `raw/in-repo-sources.md` (forge distillations) |
| Cursor | Uses different event names and has no compaction event in the archive | same |
| Home installs | The builder copies only skills, agents and commands from packs into home trees and wires only Core's hooks | `raw/in-repo-sources.md` (`scripts/build.py`, `docs/HOOK-CATALOG.md`) |
| This repository | Until now only Core declared hooks; a pack shipping its own role hooks is new | `raw/in-repo-sources.md` (`docs/HOOK-CATALOG.md`) |

Not observed: live hook delivery for this plugin in any harness. The script was exercised directly with sample payloads on 2026-11-25.

## D4. Compaction loses rules; recovery precedent

| Claim | Source |
|---|---|
| On 2026-11-02 a compacted TARS kept its task list, lost its operating rules, and ran production data scripts itself until told to re-ingest its skill | `raw/in-repo-sources.md` (branch `legion/tars-compaction-survival-d52b31`) |
| The recovery design that followed: register the session, re-brief on `SessionStart(compact)`, note the restart point on `PreCompact`, unregistered sessions get nothing, observer contract (never block) | same |
| A compaction does not reset the work-unit clock, the deadline or the attempt count; a summary is a pointer to evidence, not authority | `raw/in-repo-sources.md` (`time-blocked-turns`) |

Conflict, stated: that branch keeps one shared registry file for TARS only and is wired into the Claude Code home by the builder. This plugin keeps one claim file per session for every role and ships its binding in the plugin. When that branch lands, a TARS session could receive both notices; consolidating them is a follow-up decision.

## D5. Messaging and shared state

| Claim | Source |
|---|---|
| In Claude Code Desktop, sessions message each other by `local_...` id, progress is read from session events, and sends are rationed | `raw/in-repo-sources.md` (`tars-stinger` reference and lessons) |
| The Desktop `local_...` id is not the hook's `session_id` | same |
| The lifecycle beacon writes per-session heartbeat files that are a read-only second progress source | `raw/in-repo-sources.md` (`docs/HOOK-CATALOG.md`) |
| TARS keeps one effort folder per effort in an already ignored location | `raw/in-repo-sources.md` (`tars-stinger` reference) |

## D6. The earlier TARS, CASE and KIPP model

| Claim | Source |
|---|---|
| CASE answers one verdict line per question: PROCEED, SIMPLIFY, OVERKILL, ASK OWNER; it is read-only and never contacts the owner or approves owner gates | `raw/in-repo-sources.md` (`guides/07-case-and-kipp.md`) |
| KIPP was the Feature Desk: owner ask verbatim, present behaviour, proposed scope, overlaps | same |
| Owner rules: a change is shipped only when verified against running code; only the owner defers work | `raw/in-repo-sources.md` (branch lessons) |

What changed here: CASE gains `RETHINK` and a full structured-dissent skill; KIPP owns PRDs, IRDs and their numbering; the ledger of record moves from TARS to OWEL; CI and deploy watching moves from CASE to MURPH.
