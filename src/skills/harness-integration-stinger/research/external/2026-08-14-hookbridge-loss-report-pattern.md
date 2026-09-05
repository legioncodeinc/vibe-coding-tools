# Hookbridge - cross-harness hook compiler and the "loss report" pattern
- URL: https://github.com/REPOZY/Hookbridge
- Fetched: 2026-08-14
- Source type: open-source project (community, npm/GitHub tool)
- Component: hooks/lifecycle events, capability detection and graceful degradation (Claude Code + Codex today, extensible)

## What it does

Hookbridge compiles one universal source file (`plugin.universal.yaml`) into the correct native hook configuration for each target platform - currently Claude Code (`hooks/hooks.json`) and Codex (`hooks/codex-hooks.json`), "generated automatically - correctly formatted, correctly structured, never out of sync." The core problem statement is exactly the harness-integration-stinger's own tool/hook-contract problem, generalized past one product: "Claude Code and Codex have completely different formats for hooks. They use different file names, different JSON structures, different ways of referencing paths, and different sets of supported events. A plugin built for one platform simply won't work on the other."

## The event-support matrix (concrete, verified evidence of the degradation problem)

Hookbridge documents that "Claude Code supports 26 events. Codex supports 5." Of the shared events:

| Event | Claude Code | Codex |
|---|---|---|
| `SessionStart` | Native | Native |
| `UserPromptSubmit` | Native | Native |
| `PreToolUse` | Native | Native (Bash only) |
| `PostToolUse` | Native | Native (Bash only) - Edit/Write approximated |
| `Stop` | Native | Native |

Claude-Code-only events that produce a hard-limit loss on Codex: `SessionEnd`, `InstructionsLoaded`, `PostToolUseFailure`, `PermissionRequest`, `PermissionDenied`, `SubagentStart`, `SubagentStop`, `TeammateIdle`, `TaskCreated`, `TaskCompleted`, `StopFailure`, `FileChanged`, `CwdChanged`, `ConfigChange`, `WorktreeCreate`, `WorktreeRemove`, `Notification`, `PreCompact`, `PostCompact`, `Elicitation`, `ElicitationResult`. `SubagentStop`/`SubagentStart` are approximated on Codex "via stop-time transcript analysis (fires at session end, not in real time)" rather than dropped outright.

This is an independent, code-verified confirmation of the Codex "PreToolUse matcher is Bash-only" caveat already in the harness-integration-stinger's own hook-lifecycle guide - and it shows the gap is much larger than that one caveat: 21 of Claude Code's 26 events have no Codex equivalent at all.

## The "loss report" - a reusable pattern for graceful degradation

Every compile emits a `loss-report.md` that classifies every gap on a four-level severity scale:

| Severity | What it means |
|---|---|
| Native | Works perfectly on this platform |
| Approximated | A generated workaround approximates the behavior, but with limitations (e.g. an event that should fire in real time instead fires at session end) |
| Hard limit | Impossible on this platform, no workaround exists |
| Warning | Supported, but with a caveat (e.g. an `async` flag is silently ignored on one platform) |

"The loss report is not a failure - it's information. It tells you exactly what your plugin users will experience on each platform." This four-level classification (native / approximated / hard-limit / warning) is a directly reusable vocabulary for a Hive capability-detection-and-degradation guide: when a harness lacks a feature, the write-up should say which of these four buckets the gap falls into rather than a vague "not supported," because "approximated" and "hard limit" require different author decisions (ship a workaround vs. document the gap and move on).

## Architecture note: adapters never see the raw source

Hookbridge's internal design normalizes the universal YAML into a platform-agnostic intermediate representation (IR: `{ meta, hooks, skills, extensions }`) before any platform-specific adapter runs. "The key design decision: adapters never see the raw YAML. They only see the normalized IR. This means adding a new platform never requires understanding what another platform does - each adapter is fully independent." This IR-then-adapter shape is the general pattern behind "pick the wiring mechanism per harness, from one shared definition of what the capability should do" - the same shape the Hive's own capability-integration guides should model, even without literally building a compiler.

## Freshness mechanism

A `sync` command "checks the live documentation for each platform and tells you what's changed... exits 1 if any changes are found - useful in CI," acknowledging explicitly that "platform docs change. New hook events get added, old ones get removed." Any cross-harness integration surface needs the same discipline: treat the per-harness event/field list as a living fact to re-verify, not a one-time capture.
