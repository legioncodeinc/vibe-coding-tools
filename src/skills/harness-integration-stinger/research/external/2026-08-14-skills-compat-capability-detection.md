# Skills Compat Manager - capability detection and pre-flight degradation pattern
- URL: https://github.com/hnaymyh123-henry/skills-compat-manager
- Fetched: 2026-08-14
- Source type: open-source project (community, MCP server)
- Component: capability detection and graceful degradation, across Claude Code / Cursor / Codex CLI / OpenCode

## What it does

A cross-platform compatibility layer for AI agent skills: "pre-flight dependency checks, MCP-native, works with Claude Code, Cursor, Codex CLI, OpenCode and more." Every time an agent loads a skill through the tool's MCP server, it scans the runtime environment against the skill's declared dependencies (packages, CLI tools, env vars, platform capabilities) and injects a **compatibility Delta** at the top of the skill content, before the skill's own instructions ever reach the model: "Missing pandas? The agent stops and asks before burning 10k tokens."

## The three-state degradation model

Each scan produces one of three states, shown to the agent as a structured block before skill instructions load:

```
⚠ Compatibility Delta - pdf @ claude_code

Code Deps:
  ✓ pypdf ........ installed (4.0.1)
  ✗ camelot-py ... missing [optional]
    → pip install camelot-py

System Tools:
  ✗ pdftotext .... missing [optional]
    → brew install poppler

Status: DEGRADED
Proceed with caution - optional deps missing
```

CLI states map to exit codes for CI use: `0` (OK), `1` (DEGRADED), `2` (BLOCKED), `3` (UNSCANNED), `4` (error) - e.g. `skills-compat verify pdf && deploy`. This OK / DEGRADED / BLOCKED vocabulary is a clean, three-state alternative (simpler than Hookbridge's four-level native/approximated/hard-limit/warning scale) for surfacing a capability gap to the *agent* rather than to a plugin author at build time - useful when the gap is discovered at runtime rather than compile time.

## Per-harness capability profiles (concrete evidence of what differs, harness by harness)

The tool ships a static capability profile per platform, auto-detected via the MCP `initialize` handshake (`clientInfo.name`):

| Platform | Declared capabilities | Confidence | Auto-detected |
|---|---|---|---|
| Claude Code | `bash` `file_read` `file_write` `web_search` `web_fetch` `python_runtime` `lsp` `notebook` `subagent` `monitor` | verified | yes |
| Cursor | `bash` `file_read` `file_write` `web_search` | partial | yes |
| Codex CLI | `bash` `file_read` `file_write` `python_runtime` | verified | yes |
| OpenCode | `bash` `file_read` `file_write` `web_search` `web_fetch` `python_runtime` `lsp` | verified | yes |

Documented platform-specific gotcha: "Codex CLI has network blocked by default in all sandbox modes - there is no built-in web_search." This corroborates the queen-bee-stinger research's Codex sandbox/network findings (network access off by default under `workspace-write`) from an independent, capability-detection-focused angle: a capability author targeting Codex cannot assume outbound network access is available even when other harnesses in the same integration have it.

## Detection mechanism - self-reporting over static assumption

"Platform detection happens automatically via the MCP handshake (clientInfo.name) - no manual configuration needed... If your agent platform supports self-reporting via `capabilities.experimental["skills-compat:platform-tools"]` in the MCP initialize handshake, its capabilities are used directly and take priority over the static profile." This is a working example of the MCP capability-negotiation mechanism (see the MCP architecture spec) applied specifically to feature/tool availability rather than protocol primitives - self-reported, live capability data beats a hardcoded per-harness table whenever the harness offers it, and the static table is the fallback only when it doesn't.

## Fix classification - actionable vs. inert degradation

When a dependency is missing, `suggest_fix` proposes 2-3 paths, each tagged on two axes so the agent knows what it may do autonomously:

```
Path A: Install                     [SAFE · agent_or_user · low effort]
  → pip install camelot-py
Path B: Use alternative library    [MANUAL · user_only · medium effort]
  → Edit SKILL.md to use tabula-py instead
Path C: Mark as optional            [MANUAL · user_only · low effort]
  → Accept graceful degradation
```
`SAFE` + `agent_or_user` paths may be auto-executed through a sandboxed allowlist (`pip`/`npm`/`yarn`/`mkdir`/`touch`) with a hard denylist (`sudo`, `rm`, `|sh`, `>/etc`, `&&rm`, etc.); `MANUAL`/`user_only` paths are only ever surfaced to the human, never executed. This SAFE/MANUAL × agent_or_user/user_only matrix is a reusable shape for documenting exactly which degradation responses a Hive integration is allowed to take unattended versus which ones require a human decision.
