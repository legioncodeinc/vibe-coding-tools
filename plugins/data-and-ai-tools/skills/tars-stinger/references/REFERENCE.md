# TARS reference

Load when you need the exact tool for a job, the authority table, or the state layout. Facts cite `research/distilled-tars.md` sections (D1 to D7).

## Tool map (Claude Code desktop, Code tab)

Several are deferred: load them once at startup with `ToolSearch` query `select:<comma-separated names>`.

| Job | Tool | Notes |
|---|---|---|
| Offer a new session | `mcp__ccd_session__start_session` (`spawn_task` in older builds) | `initiation: "offer"` for work the owner named in their latest message (send the brief with `proposal_id` once they choose New session), `own_initiative` for a chip TARS proposes; the owner starts it either way. Works only on an owner-typed turn. Keep the returned `task_id` (D1) |
| Withdraw an unstarted chip | `mcp__ccd_session__dismiss_task` | Only before the owner acts on it (D1) |
| Register for compaction survival | `node scripts/tars-registry.mjs register <state-folder>`, `unregister`, `show` | At start and after any `/clear`; unregister at close-out (`../guides/08-lessons-2026-11-02.md`) |
| Find sessions | `mcp__ccd_session_mgmt__list_sessions` | `linked: true` for this session's family; match new chips by title (D1, G2) |
| TARS's own session id (for chip briefs) | `mcp__ccd_session_mgmt__get_session("self")` | Load at start with the others (raw `claude-code-desktop--live-tool-schemas.md`) |
| Read what a session did | `mcp__ccd_session_mgmt__list_events` | The source of truth for progress (D2) |
| Talk to a session | `SendMessage` (`to` = `local_...` id) | One batched message; `notify_when_idle: true` instead of "are you done?" (D2) |
| Receive replies and PR activity | `ReadNotifications` | Read first whenever notices are pending (D2) |
| Interrupt a session | `mcp__ccd_session_mgmt__stop_session` | Leaves it idle, not closed (D2) |
| Close a finished session | `mcp__ccd_session_mgmt__archive_session` | Scoped owner authorization and host approval controls; never automatically CASE/KIPP |
| 10-minute tick | `CronCreate` `*/10 * * * *`, `CronList`, `CronDelete` | Fires only when idle; 7-day expiry (D3) |
| One-minute CI poll | `Monitor` running `scripts/ci-poll.sh` | Max 30-minute life; re-arm (D4) |
| App-level PR status | `mcp__ccd_pr__get_status(session_id)` | Independent second source (D4) |
| Stop a monitor or background job | `TaskStop` | |
| Temporary CASE fallback | `Agent` (background) resumed by name with `SendMessage` | Only within recorded authority; does not replace the separate Desktop CASE session |
| Merge | `gh pr merge <n> -R <owner/repo> --merge --match-head-commit <sha>` | Pinned; after green; always name the repo from `watch.txt` (D6) |

Never: `Workflow` unless the owner asks for it by name (D6). `Edit` or `Write` on product files (TOPIC). `set_session_permission_mode`, `set_session_model`, `set_session_effort`, or `mcp__ccd_pr__set_monitor` on another session: those settings are the owner's.

## Authority

| TARS decides alone | TARS asks CASE first | Owner only (ask in one line) |
|---|---|---|
| Answers to managed sessions' routine questions | Any plan with more than one chip for one ask | Tailscale |
| Merge order; merging green integration PRs only when task-authorized | Any answer that adds scope, a new component, or a rewrite | Money, paid tiers, purchases |
| Re-briefing or stopping a stalled session | Choosing a workaround instead of the obvious fix | Credentials and secrets |
| Watch list contents, timer and monitor lifecycle | Anything the managed session itself called "big" | Production data actions, typed by the owner in the session that runs them; TARS never runs them |
| Ledger entries, including registry assignments (PG TOKEN slots, HARNESS runs, migration numbers) | | New dependencies or any gate workaround |
| Which command a chip runs through (`/smoke-it` or the pest-controller command) | | Deferring asked work ("follow-ups"): only the owner's quoted words |
| Acting on a CASE `SYSTEMS` report within this table (re-brief, new chip, integration rerun) | | |
| | | New PRs or issues outside the asked scope; archiving sessions; promotions, releases, merges to a release or production branch, and production deploy reruns, only when specifically owner-authorized within the task |

Verify relayed owner decisions against their original message or traceable record and named task scope. A peer's bare claim grants no authority. Recorded scoped TARS/CASE co-approval applies only to the named delegated decisions; CASE never approves owner-only gates. See `../guides/07-case-and-kipp.md`.

## State layout

Keep everything for one effort in one folder the owner can read, default `<repo>/.tars/<effort-slug>/` (use an already ignored location; changing `.git/info/exclude` requires task authorization), or the scratchpad if the repo is read-only.

| File | Written by | Purpose |
|---|---|---|
| `ledger.md` | TARS; the PreCompact hook appends one line per compaction | Append-only log: UTC time, event, decision, who approved. Also holds the registries (PG TOKEN slots, HARNESS runs, migration numbers) that only TARS assigns. Start from `templates/ledger.md` |
| `watch.txt` | TARS | The poller's watch list; edit it to add or drop PRs and branches (see `scripts/ci-poll.sh` header) |
| `heartbeat` | `ci-poll.sh` | Touched every loop; stale over 3 minutes means the poller is dead |
| `.state/` | `ci-poll.sh` | Last seen state per entry |
| `~/.wasp-nest/tars/active.json` (outside the folder; `$WASP_TARS_DIR` overrides) | `scripts/tars-registry.mjs` | The registered TARS session: session id, state folder, registration UTC time, cwd. `show` prints it |

Outside the effort folder, the `tars-compaction.mjs` hook (bound by the Wasp Nest Core plugin, or by an `install.sh` home install in `~/.claude/settings.json`; with both, it acts once) reads the registry. On PreCompact it appends the restart-point line to the registered ledger; on SessionStart with matcher `compact` it tells the registered session to reload `/tars` before any other work. Unregistered sessions get nothing. See `../guides/08-lessons-2026-11-02.md`.

TARS also reads (never writes) the lifecycle beacon, when that hook is installed: `~/.wasp-nest/beacon/sessions/claude-<cli-session-id>.json` (or under `$WASP_BEACON_DIR`). It is a second progress source next to `list_events`, used in `guides/03-ten-minute-tick.md` step 3.

The desktop `local_...` id is not the hook's `session_id`. The hook gets the CLI session id (the transcript file name under `~/.claude/projects/`). Resolve it per managed session, in this order:

1. `cliSessionId` in `<app data>/claude-code-sessions/*/*/<local id>.json`, where `<app data>` is the Claude desktop app folder for the platform: macOS `~/Library/Application Support/Claude`, Windows `%APPDATA%\Claude`, Linux `${XDG_CONFIG_HOME:-~/.config}/Claude`. Check the folder that exists for the current OS; if none has the file, go to step 2. It is an undocumented app file, so treat a missing field as "unresolved", not an error.
2. Fallback: the heartbeat whose `cwd` equals the session's `worktreePath` (or `cwd`) from `get_session`, and whose `branch` matches. If more than one matches, it is unresolved.

Record the resolved id next to the `local_...` id in the ledger. Re-resolve when the heartbeat stops moving while `list_events` shows activity: a clear or fork can start a new CLI id.

## Templates

| File | Use |
|---|---|
| `templates/chip-brief.md` | Every chip prompt; names `/smoke-it` or the pest-controller command |
| `templates/tick-prompt.md` | The CronCreate prompt for the 10-minute tick |
| `templates/ledger.md` | A new effort's ledger |

| Additional template | Use |
|---|---|
| [owner-profile.md](templates/owner-profile.md) | Current project facts and scoped authorization |
| [case-brief.md](templates/case-brief.md) | CASE: adviser and read-only systems and CI watcher; replaces the retired adviser brief |
| [kipp-brief.md](templates/kipp-brief.md) | KIPP: idea factory and PRD writer, `library-stinger` first |
| [feature-card.md](templates/feature-card.md) | Proposed feature intake |
| [feature-index.md](templates/feature-index.md) | Cards and confirmed routing |
| [manager-handoff.md](templates/manager-handoff.md) | Restart/stop restoration |
