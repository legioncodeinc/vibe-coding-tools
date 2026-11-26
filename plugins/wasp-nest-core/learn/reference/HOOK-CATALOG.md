# Hook Catalog

> Version: 3.0 | Date: October 2026 | Status: Active

This catalog explains all eight shared hook files: six JavaScript handlers and two Python helpers. It describes what the builder configures. The installed host must support and enable an event before its handler can run.

## Find a handler

| File | Purpose | Effect |
| --- | --- | --- |
| [dash-guard.mjs](../../hooks/dash-guard.mjs) | Check a proposed prose edit for em or en dashes | Can deny the write through the host's permission response |
| [component-validate.mjs](../../hooks/component-validate.mjs) | Validate an edited skill, agent, command, rule or declared manifest | Adds an error advisory; does not undo or block the completed edit |
| [onboarding-session.mjs](../../hooks/onboarding-session.mjs) | Offer missing home or repository setup | Reads setup locks and supplies context; asks for consent before setup |
| [session-start-cadence.mjs](../../hooks/session-start-cadence.mjs) | Supply the operating cadence at session start | Reads a context file and adds it to model context |
| [lifecycle-beacon.mjs](../../hooks/lifecycle-beacon.mjs) | Record event times, turn duration, and progress signals | Writes private local state and logs; supplies stamps and pending alerts on suitable events |
| [tars-compaction.mjs](../../hooks/tars-compaction.mjs) | Bring the TARS operating rules back after a context compaction | Appends a restart line to a registered session's ledger and supplies recovery context; other sessions get nothing |

## Python helpers

| File | Caller or use | Effect |
| --- | --- | --- |
| [register-codex-agents.py](../../hooks/register-codex-agents.py) | Core's configured SessionStart registration command | Writes selected, checked Codex roles and backs up changed same-name roles |
| [resolve-component.py](../../hooks/resolve-component.py) | Registrar import or an explicit component lookup | Reads the selected registry, catalog, manifests, and component paths; writes nothing |

The registrar can be called directly on SessionStart. The resolver has no independent event binding. These helpers are not two extra JavaScript lifecycle handlers.

## Configured carriers

The authoring build configures each carrier separately. The shipped [Core hook configuration](../../hooks/) records native plugin bindings. Optional plugins do not repeat them. One optional plugin, Interstellar Coding, ships a separate hook of its own; see [Pack-owned hooks](#pack-owned-hooks).

| Carrier | Configuration | Configured calls |
| --- | --- | --- |
| Claude home | `~/.claude/settings.json` | `SessionStart`: cadence and onboarding; `PreToolUse` matched to `Edit|Write`: dash guard; `PostToolUse` matched to `Edit|Write`: component validator; beacon on its Claude event list; `PreCompact` and `SessionStart` matched to `compact`: TARS compaction recovery |
| Codex home | `~/.codex/hooks.json` | The same named start/edit bindings, plus beacon on its Codex event list; event support depends on the installed client |
| ZCode home | Merged `~/.zcode/cli/config.json`, under `hooks.enabled` and `hooks.events` | The same start/edit bindings, plus beacon on its ZCode event list. The home build input is `cli-config.json`; ZCode does not use a root `~/.zcode/hooks.json` for this configuration |
| Cursor home | `~/.cursor/hooks.json` | `sessionStart`: cadence and onboarding; `preToolUse`: dash guard; `postToolUse`: component validator; no beacon binding |
| Core Claude plugin | `hooks/claude-hooks.json` | `SessionStart`: registrar attempt and onboarding; pre/post `Edit|Write` events: dash guard and component validator; `PreCompact` and `SessionStart` matched to `compact`: TARS compaction recovery; no cadence or beacon binding |
| Core OpenAI plugin | `hooks/openai-hooks.json` | `SessionStart`: registrar after the host trusts the hook; no JavaScript handler binding |
| Core Cursor plugin | `hooks/cursor-hooks.json` | `sessionStart`: onboarding only |
| Cowork Core variant | Claude-shaped plugin configuration | Removes Claude `SessionStart` and `PreCompact`; retains configured pre/post edit checks. Retained files do not prove Cowork runs them |

The home build copies all eight files into each local hook directory. Core also carries them. Copying a file does not register an event. The shared `.agents` skill tree supplies skills, not another hook engine.

Review the selected configuration and host trust prompt before enabling hooks. Home installation merges configured settings; native marketplace installation is a different route. JavaScript handlers need Node. Registration, resolution, and component validation need Python 3. Payload shape, shell expansion, event support, and access depend on the host.

## Pack-owned hooks

The eight files above are shared and belong to Core. Interstellar Coding carries one more handler, in its own package, for its own roles. It is not copied into home hook directories.

| File | Purpose | Effect |
| --- | --- | --- |
| [crew-hook.mjs](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/interstellar-coding/hooks/crew-hook.mjs) | Record which crew role a session holds; bring that role's skill back at session start and after compaction; keep the crew ledger append-only | Supplies context on `SessionStart`, `UserPromptSubmit`, `UserPromptExpansion` and `SubagentStart`; prints summary guidance on `PreCompact`; denies `Edit` and `Write` calls on the ledger record through the host's permission response |

Its binding is [hooks/hooks.json](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/interstellar-coding/hooks/hooks.json) inside the plugin. The publication validator refuses hooks in every other optional plugin. Claude Code loads the file from an installed plugin by convention; Codex runs plugin hooks only after you trust them. Cursor and home installations are not wired, so the fallback there is saying "re-ingest" followed by the role command.

A session claims a role when its crew command is typed. The claim is one private file per session under `~/.wasp-nest/interstellar-coding/sessions/` (or `INTERSTELLAR_CREW_DIR`), holding the role, a time, the working directory and optionally the effort folder. It holds no prompt text. Sessions without a claim receive nothing. Apart from the ledger deny, the handler never blocks. Live delivery in an installed client has not been observed.

## Start and edit behavior

The dash guard reads JSON from standard input. It checks `.md`, `.mdc`, `.mdx`, and `.txt` changes from direct edits or added lines in an apply-patch command. It skips `references/research/raw/` passages so archived quotations retain their text. Malformed payloads return `{}`. It cannot check writes whose event or payload it never receives.

The component validator finds Queen's installed `per-type-validation.py`. It recognizes changed skills, agents, commands, rules and source plugin manifests under supported source/harness paths, deduplicates targets, and runs the matching type with `--harness all`. Pack ownership is checked against the current catalog. It reads at most 262,145 input bytes, considers at most twenty distinct targets and uses a four-second remaining subprocess budget with bounded output. Malformed/nonobject payloads are a no-op; recognized components with missing, crashed, timed-out or output-limited validation receive an unverified advisory. Excess target/input work remains explicitly unverified. This post-edit feedback neither blocks/undoes the edit nor supplies Security/Quality clearance. Input delivery and platform process termination still depend on the actual host; a configured event is not execution proof.

Onboarding checks `~/.legioncodeinc.lock` before the current repository's `wasp-nest.lock`. It offers global setup before repository setup and suppresses offers for background agents, forks, and compaction. It creates no instructions, library, or lock. Get Started performs setup only after consent and checks. Existing code requires a Knowledge pass before setup is marked complete.

Cadence reads the first available `time-blocked-turns/hooks/session-start-context.md` under these home skill roots, in order: `.claude`, `.agents`, `.zcode`, `.cursor`, `.codex`. It emits Cursor-shaped context for Cursor and `SessionStart` context for the other flavors. Missing or unreadable context returns `{}`. It does not start a timer or enforce a deadline.

## TARS compaction recovery

`tars-compaction.mjs` is for the TARS manager session in Claude Code Desktop. Claude Code binds it from two places: the Core plugin that a marketplace installation provides, and the Claude home configuration that `install.sh` writes. On a machine with both, the plugin copy stands down for any event that the home `settings.json` already binds, so each compaction is recorded once. It checks `settings.json` under `CLAUDE_CONFIG_DIR` or `~/.claude` and requires the home handler file; if it cannot read them, it runs. The Codex, ZCode and Cursor carriers and the locally built Cowork Core variant get no binding. A marketplace Core install carries the Claude binding wherever it is loaded, and unregistered sessions get nothing. Where recovery does not run, the fallback is the owner saying "re-ingest /tars". Live delivery in an installed client has not been observed.

It acts only on a session that TARS registered with `tars-registry.mjs`, recorded in `~/.wasp-nest/tars/active.json` (or under `WASP_TARS_DIR`). On `PreCompact` it appends one restart-point line to that session's existing `ledger.md`. On `SessionStart` after a compaction it adds context telling the model to reload `/tars`, reread the guides, read the ledger and owner profile, re-arm missing timers and reconcile linked sessions. Every other session receives nothing. It never blocks and always exits 0. It is a reminder, not enforcement.

## Beacon behavior

The beacon runs only when a configured event calls it. It records local and UTC stamps, session and turn duration, event counts, branch, current directory, and selected progress signals. Recognized edits, checks, and completion events count as progress signals; they are not proof that the task succeeded.

The saved state includes local work paths and branch names. It omits prompt text and tool output, but still belongs with private operational records.

Default storage is `~/.wasp-nest/beacon`, with an explicit `WASP_BEACON_DIR` override available. Snapshots live in `sessions/`; logs live in `events/` and rotate above 1,000,000 bytes. Writes use private files and guarded storage paths. Per-session locking limits concurrent lost updates; if a lock cannot be obtained, a stamp can be emitted without saving that event.

`UserPromptSubmit` starts a turn. Stop or interrupt closes it. A later prompt can show the prior turn's duration. Pending alerts cover 45/60-minute turn thresholds, 10/20-minute gaps between progress signals, and TARS poller heartbeats older than three minutes when effort state exists.

These are observed thresholds, not a running watchdog. Without a new event, the beacon does not wake up, poll CI, stop an agent, restart a monitor, or enforce policy. It returns exit 0 and never grants or denies tool permission. Stop and SubagentStop do not receive model context that would prolong the turn. Routine tool stamps stay on disk unless an alert is due; model and user messages use suitable events only.

### Generated beacon event lists

These names come from the builder's `BEACON_EVENTS`. They are configured targets, not proof that every client version exposes them. Claude omits `WorktreeCreate`, whose hook contract replaces worktree creation.

**Claude (32 events):** `SessionStart`, `Setup`, `InstructionsLoaded`, `UserPromptSubmit`, `UserPromptExpansion`, `PreToolUse`, `PermissionRequest`, `PermissionDenied`, `PostToolUse`, `PostToolUseFailure`, `PostToolBatch`, `Notification`, `MessageDisplay`, `SubagentStart`, `SubagentStop`, `TaskCreated`, `TaskCompleted`, `Stop`, `StopFailure`, `TeammateIdle`, `PreCompact`, `PostCompact`, `ConfigChange`, `CwdChanged`, `DirectoryAdded`, `FileChanged`, `WorktreeRemove`, `PreModelSwitch`, `PostModelSwitch`, `Elicitation`, `ElicitationResult`, `SessionEnd`.

**Codex (12 events):** `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PermissionRequest`, `PostToolUse`, `PreCompact`, `PostCompact`, `SubagentStart`, `SubagentStop`, `Stop`, `Interrupt`, `SessionEnd`.

**Zcode (7 events):** `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PermissionRequest`, `PostToolUse`, `PostToolUseFailure`, `Stop`.


`FileChanged` uses the literal matcher `.envrc|.env`. Beacon commands normally have a five-second host timeout; `SessionEnd` and `Interrupt` use two seconds. Host timeouts are separate from task deadlines.

## Role registration and resolution

The registrar needs `PLUGIN_ROOT` to identify trusted Core. Without it, registration is a no-op. The OpenAI binding uses that plugin-root convention. The Claude registrar attempt does not prove that a Claude client supplies the same environment.

Selection comes from `WASP_NEST_PLUGIN_REGISTRY` or `~/.wasp-nest/installed-plugins.json`. When neither exists, a Claude Code marketplace install is read from Claude Code's own install record (`~/.claude/plugins/installed_plugins.json`, or under `CLAUDE_CONFIG_DIR`), limited to Core's marketplace. The resolver can also recognize trusted Core. It requires one catalog owner, matching plugin versions, declared dependencies, and the requested installed file. Missing prerequisites, identity mismatches, unsafe component links, and unknown components cause refusal. It does not assume that every cached plugin is enabled.

Before writes, the registrar checks selected paths, declared role names, TOML identity, and instruction-resource links. It projects valid links to their selected package resources, then writes the selected Codex home's `agents/` files. Changed existing roles receive backups under `~/.wasp-nest/backups/codex-agents/`. Identical files stay unchanged. Registration failure is reported as skipped and does not stop SessionStart.

Trusting this hook enables a local write path, so review the actual selected roots first. Marketplace selection alone does not prove that a registry exists or roles registered. Resolver lookup does not install plugins. Registration does not launch a Drone.

## Support assets and verification

Generated hook JSON configures calls. Cadence context Markdown and sample hook JSON under skill references are support assets, not separate live handlers. Rules and skills do not become hooks merely by mentioning events or deadlines.

Read [Harness Capabilities](HARNESS-CAPABILITIES.md) for registration and portability limits. Inspect the configuration for your selected carrier and the [shipped handlers](../../hooks/) when behavior changes. Public documentation describes the prepared candidate; it does not claim that a new release has been published.


Validation failure advisories report only the bounded target and error count, never raw validator messages or unexpected stderr. Event/command fields are type-checked so malformed object values cannot trigger string-conversion crashes. Detailed failures must be inspected through an explicitly scoped validator invocation.
