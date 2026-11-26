# Hooks: checks at lifecycle events

A hook is a small program invoked when a supported harness event happens. It can provide context at session start, block a specific unsafe edit, or report a validation result after a tool runs. A hook is not a substitute for a user's decision: seeing a prompt is not consent to modify files or contact an external system.

The [complete hook catalog](../reference/HOOK-CATALOG.md) lists each shipped hook or resolver, its purpose and its source procedure. Check the enabled manifest before relying on an event.

## Shared hook programs and capability lookup

| Hook | Event in supported local installs | What it does |
| --- | --- | --- |
| [`onboarding-session.mjs`](../../plugins/wasp-nest-core/hooks/onboarding-session.mjs) | Session start | Reads `~/.legioncodeinc.lock`, then the repository's `wasp-nest.lock`, and asks the assistant to offer the missing setup step. It makes no file changes. |
| [`session-start-cadence.mjs`](../../plugins/wasp-nest-core/hooks/session-start-cadence.mjs) | Session start where configured | Adds the local work-cadence reminder. |
| [`dash-guard.mjs`](../../plugins/wasp-nest-core/hooks/dash-guard.mjs) | Before a supported edit or write | Checks new prose for em and en dashes and rejects that edit when the rule applies. |
| [`component-validate.mjs`](../../plugins/wasp-nest-core/hooks/component-validate.mjs) | After a supported edit or write | Reports Wasp Nest component validation findings. It is advisory because an edit may be one step in an unfinished series. |
| [`lifecycle-beacon.mjs`](../../plugins/wasp-nest-core/hooks/lifecycle-beacon.mjs) | The lifecycle events configured by this build for supported local hosts | Stamps local and UTC+0 time, session and turn duration, and writes a heartbeat to `~/.wasp-nest/beacon/` that TARS can read. It observes only and never blocks. |
| [`tars-compaction.mjs`](../../plugins/wasp-nest-core/hooks/tars-compaction.mjs) | Before compaction and at the session start that follows it, in Claude Code (Core plugin or `install.sh` home install) | Re-briefs a registered TARS session about its rules and records a restart line in its ledger. Other sessions get nothing. With both installs it acts once. Codex, ZCode and Cursor do not bind it, and neither does the locally built Cowork Core variant. A marketplace Core install carries the Claude binding wherever it is loaded, and unregistered sessions get nothing. Where recovery does not run, say "re-ingest /tars". |

Core also carries [`register-codex-agents.py`](../../plugins/wasp-nest-core/hooks/register-codex-agents.py) and [`resolve-component.py`](../../plugins/wasp-nest-core/hooks/resolve-component.py). The registrar writes declared roles from the explicit selected-plugin registry after Core's OpenAI hook is trusted. The resolver checks a component's owner, version, dependencies and contained installed path before dispatch. Optional plugins carry their role projections without duplicate registration hooks.

The set actually active in a plugin can differ from a full local installation. Inspect the installed plugin's [hook manifest](../../plugins/wasp-nest-core/hooks/claude-hooks.json) and the [harness reference](../reference/HARNESS-CAPABILITIES.md) instead of assuming that copying a JavaScript file makes the event work everywhere. Event names, input shapes, output JSON, path resolution, timeouts, and hook trust differ by host. Cowork cannot write into your local home through the onboarding hook.

## The lifecycle beacon

`lifecycle-beacon.mjs` is registered once per event, with the harness and event name as arguments (`node lifecycle-beacon.mjs claude PreToolUse`). Each firing does three things:

1. Builds a stamp that names both clocks: `Local: 2026-10-02 09:51:14 CDT (UTC-05:00, America/Chicago) | UTC: 2026-10-02 14:51:14 UTC+00:00`.
2. Measures the session from the transcript file's creation time (or the first event it saw) and the current turn from `UserPromptSubmit` to `Stop`. A resume, clear, or fork closes a turn that never reached `Stop`; compaction keeps it open.
3. Rewrites `~/.wasp-nest/beacon/sessions/<harness>-<session>.json` and appends to `events/<harness>-<session>.jsonl`. The heartbeat holds the last event, the last real progress (a file edit, a test or build command, a commit, a PR command, or a finished subagent), event counts, branch, cadence flags (45 and 60 minute turn marks, 10 and 20 minutes without progress), and the age of every `.tars/<effort>/heartbeat` in the repository.

The model sees the stamp at session start, at each prompt (with the length of the turn that just finished as `last turn`), at subagent start, and once per alert. The human sees the session-start stamp and each alert once. Per-tool events are only written to disk. `Stop` and `SubagentStop` never carry model context: in Claude Code and ZCode, context returned there continues the turn, so an observer stamp would force extra model turns.

The optional Data and AI plugin's [TARS Stinger](../../plugins/data-and-ai-tools/skills/tars-stinger/SKILL.md) reads those heartbeats on its 10-minute tick as a second progress source next to `list_events`, which stays the source of truth: beacon-only progress can delay a nudge or stop by one tick, never cancel it. Heartbeat files are named for the CLI session id the hook receives, not the desktop app's `local_...` id; the TARS reference documents how to map one to the other. A stale CI poller heartbeat (over three minutes) under `.tars/<effort>/` shows up as an alert in sessions running in that repository. Set `WASP_BEACON_DIR` to move the state folder.

Coverage limits are deliberate. Claude Code's `WorktreeCreate` is skipped because a hook there replaces git's worktree creation. `FileChanged` has no catch-all matcher, so it watches `.envrc` and `.env` only. ZCode reads hooks from `~/.zcode/cli/config.json` and only when `hooks.enabled` is true; it never reads `~/.zcode/hooks.json`. The installer merges every Wasp Nest hook (onboarding, cadence, dash guard, component validation, and the beacon) there, and turns hooks on only if you never set that key. An older `~/.zcode/hooks.json` from a previous install is left in place and can be deleted. Codex runs a new or changed hook only after you trust it in `/hooks`.

## Blocking versus advisory

Use a blocking hook only for a narrow condition that can be checked reliably and corrected without damage. A dash guard can reject one proposed edit and tell the writer what to replace. A component validator often runs after a file changes, so it should report findings rather than undo the file. Onboarding reads lock state and adds context; the Get Started Stinger performs writes only after separate user consent.

For example, an absent home lock produces an invitation to review global instruction templates. It does **not** create `AGENTS.md`, `CLAUDE.md`, or the lock. If the user declines, the assistant continues the original task. [Getting Started](GETTING-STARTED.md) describes the two-step flow.

## Check a hook before relying on it

Inspect the enabled manifest and run a safe fixture through the hook. Confirm that ordinary input is allowed, the intended unsafe input gets a clear response, irrelevant file types do not false-block, and an error fails open where appropriate. For onboarding, test both lock states and verify that no files were written by the hook itself. Never describe a hook as portable solely because its script exists in multiple packs.

Core owns the shared lifecycle hooks. Its OpenAI role-registration hook reads the explicit installed-plugin registry; optional plugins carry role files without duplicating the hook. The one exception to optional plugins having no hooks is Interstellar Coding, whose own role hook is described in the [hook catalog](../reference/HOOK-CATALOG.md#pack-owned-hooks).
