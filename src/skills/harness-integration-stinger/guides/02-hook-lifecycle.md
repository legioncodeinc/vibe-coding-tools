# Guide 02: Hooks and Lifecycle Events, Per Harness

**Sources:** `research/distilled-harness-integration.md` §2; queen-bee-stinger distilled-research-articles.md, Claude Code §Rules→Hooks; Cursor §Plugins→Hooks; ChatGPT Codex §Plugins→Hooks; Claude Cowork §Plugins ("What a plugin bundles"); `research/external/2026-08-14-hookbridge-loss-report-pattern.md`

---

## The event surface, per harness

| Harness | Hook surface | Event count / notable subset | Handler types |
|---|---|---|---|
| Claude Code | `settings.json` (user/project/local) + plugin `hooks/hooks.json` | 26 documented events (`SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`, `SubagentStart`/`SubagentStop`, `TaskCreated`/`TaskCompleted`, `FileChanged`, `PreCompact`/`PostCompact`, `Elicitation`, etc.) | `command`, `http`, `mcp_tool`, `prompt`, `agent` (experimental) |
| Cursor | `hooks/hooks.json` (plugin) or agent-hook config | Agent hooks: `sessionStart`, `sessionEnd`, `preToolUse`, `postToolUse`, `postToolUseFailure`, `subagentStart`, `subagentStop`, `beforeShellExecution`, `afterShellExecution`, `beforeMCPExecution`, `afterMCPExecution`, `beforeReadFile`, `afterFileEdit`, `beforeSubmitPrompt`, `preCompact`, `stop`, `afterAgentResponse`, `afterAgentThought`; Tab hooks: `beforeTabFileRead`, `afterTabFileEdit`; app lifecycle: `workspaceOpen` | script `command`; community docs also note `type: "prompt"` (LLM-evaluated condition) |
| Codex | `~/.codex/hooks.json` / `config.toml` `[hooks]` (user, project - trusted only) | 5 native events: `SessionStart`, `UserPromptSubmit`, `PreToolUse` (**Bash-only matcher**), `PostToolUse` (Bash-only native, Edit/Write approximated), `Stop`; plus `PermissionRequest`, `PreCompact`/`PostCompact`, `SubagentStart`/`SubagentStop`, `SessionEnd` | only `type: "command"` executes; `prompt`/`agent` types parsed but skipped; hooks require explicit trust review (hash-keyed) |
| Cowork | Plugin `hooks/` only | Undocumented exact event list; hooks are Cowork-only - grayed out/inert in plain Chat | Plugin-bundled, same package format as Claude Code |

---

## The gap is bigger than any one caveat

An independent, code-verified cross-harness hook compiler (`research/external/2026-08-14-hookbridge-loss-report-pattern.md`) confirms: "Claude Code supports 26 events. Codex supports 5." Of Claude Code's 26, **21 have no Codex equivalent at all** - a hard limit, not an approximation. The real shared-event floor across Claude Code and Codex is small:

| Event | Claude Code | Codex |
|---|---|---|
| `SessionStart` | Native | Native |
| `UserPromptSubmit` | Native | Native |
| `PreToolUse` | Native | Native (Bash only) |
| `PostToolUse` | Native | Native (Bash only) - Edit/Write approximated |
| `Stop` | Native | Native |

**Design any hook-driven capability around this five-event intersection first.** Treat everything past it (Cursor's rich `before*`/`after*` set, Claude Code's task/worktree/compaction events, Cowork's undocumented Cowork-only surface) as a harness-specific enhancement layered on top, not a baseline every harness must carry.

Reusable severity vocabulary for documenting a gap, rather than a blanket "not supported":

| Severity | Meaning |
|---|---|
| **Native** | Works perfectly on this harness |
| **Approximated** | A workaround exists but with a real limitation (e.g. fires at session/turn end instead of in real time) |
| **Hard limit** | Impossible on this harness, no workaround exists |
| **Warning** | Supported, but with a caveat (e.g. an `async` flag is silently ignored) |

---

## The two hard rules that generalize across every harness with hooks

### 1. Honor the timeout; dispatch heavy work off the critical path

Every hook system has a per-event timeout and a notion of "this can run async." Anything that only reacts (writes a log, records a trace, updates external state) should run off the critical path if the harness supports async dispatch; anything the agent needs the result of before continuing (recall injection, a permission decision) must stay well under its timeout.

```jsonc
{
  "PostToolUse": [
    {
      "hooks": [
        {
          "type": "command",
          "command": "your-handler-entry",
          "timeout": 15,
          "async": true
        }
      ]
    }
  ]
}
```

### 2. Fail open

A hook must never crash the host or leave it hanging. Wrap the handler body so any failure (network down, dependency unreachable, bad payload) exits cleanly without a status the host treats as a block:

```typescript
try {
  const payload = await readStdin();
  await doWork(payload);
} catch (err) {
  logQuietly(err);   // never throw on the hook path
} finally {
  process.exit(0);   // fail open
}
```

A hook that throws on a blocking event (Claude Code's `PreToolUse`, Codex's `PreToolUse`/`PermissionRequest`) can stop the tool call entirely if it exits non-zero unexpectedly. Always fail open on anything that isn't explicitly meant to deny.

---

## Adding an event across every hooks-based harness

1. Decide whether the event is a **capture-style write** (record something, run async, tolerate a delay) or a **recall-style read** (must complete before the agent continues, stays on the critical path).
2. Add it to Claude Code first if it exists there - the richest surface, easiest to verify against.
3. Mirror it on every other harness whose event set actually supports it. Do not invent an approximation on a harness that hard-limits the event unless you're prepared to document the approximation's real limitation (see the severity vocabulary above).
4. Resolve the handler path from each harness's own root/plugin variable - never hardcode an absolute path. Claude Code injects `${CLAUDE_PLUGIN_ROOT}`; other harnesses have their own equivalent.
5. Set the timeout and async flag per the two hard rules above, per harness (a heavier default timeout on one harness doesn't mean the others tolerate the same latency).

For a fully worked example of this flow (adding `SubagentStop` across four hosts, with concrete file diffs), see `examples/case-study-hivemind-six-host-installer.md` §3 and `examples/add-a-hook-event.md`.

---

*See also:* `guides/03-mcp-registration.md` for when to reach for an MCP server instead of a hook, and `guides/04-capability-detection-and-degradation.md` for how to detect which events a target harness actually supports before you build against them.
