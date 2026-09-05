---
name: "harness-integration-stinger"
description: "Cross-harness capability integration for The Hive's four harnesses (Claude Code, Cursor, ChatGPT Codex, Claude Cowork). Covers per-harness component placement (rules, commands, agents, skills, plugins), the wiring-mechanism decision (hooks vs MCP vs native extension vs plain instruction file), hook/lifecycle events per harness, MCP registration per harness (JSON vs TOML, Cowork connector reachability), capability detection/graceful degradation, and portability (spec-six frontmatter, AGENTS.md baseline, plugin manifests). Includes a worked six-host case study. Use for \\\\\\\"wire this into Claude Code and Cursor\\\\\\\", \\\\\\\"add a hook event\\\\\\\", \\\\\\\"register an MCP server across harnesses\\\\\\\", \\\\\\\"audit a harness adapter\\\\\\\", \\\\\\\"will this work in Cowork\\\\\\\", or when harness-integration-worker-bee is invoked. Do NOT use for vector-store schema (vector-store-stinger), embeddings runtime (embeddings-runtime-stinger), MCP protocol internals (mcp-protocol-stinger), or CI/CD topology (ci-release-stinger)."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork.
metadata:
  hive-tier: stinger
  hive-bee: harness-integration-worker-bee
  research-window: 2026-08-14 (broadening pass; reuses queen-bee-stinger 2026-08-14 research plus six new sources)
  case-study: Hivemind six-host installer (examples/case-study-hivemind-six-host-installer.md)
---

# harness-integration-stinger

The integration playbook for `harness-integration-worker-bee`. Encodes how to wire one capability (a skill, an agent, a hook-driven behavior, an MCP-backed tool) across The Hive's four harnesses - Claude Code, Cursor, ChatGPT Codex, Claude Cowork - from the first decision (which component type, which wiring mechanism) through capability detection, graceful degradation, portability, and distribution. Includes a full worked case study of a real six-host integration (Hivemind, a prior product this stinger originally documented) as a concrete example of every decision point answered end to end.

## Quick navigation

| Task | Guide |
|---|---|
| Start here: what integration means, the four harnesses, the wiring-mechanism decision matrix | `guides/00-decision-framework.md` |
| Where does each component type (rules, commands, agents, skills, plugins) live, per harness | `guides/01-component-placement.md` |
| Wire hooks/lifecycle events, per harness, and know the real shared-event floor | `guides/02-hook-lifecycle.md` |
| Register an MCP server, per harness (JSON vs. TOML, cloud reachability) | `guides/03-mcp-registration.md` |
| Detect what a harness supports and degrade gracefully when it doesn't | `guides/04-capability-detection-and-degradation.md` |
| Keep a skill, rule, or tool contract portable (spec-six frontmatter, AGENTS.md, plugin manifests) | `guides/05-portability-and-contracts.md` |
| Ship through each harness's marketplace/install flow and its distribution gate | `guides/06-distribution-and-audit.md` |
| Worked example: a real six-host integration end to end | `examples/case-study-hivemind-six-host-installer.md` |

## Critical directives

These are the non-negotiables. Violating any of them is the most common cause of a broken harness adapter. See the relevant guide for code patterns.

1. **Keep the tool and command contract identical across every host.** `hivemind_search`/`hivemind_read`/`hivemind_index` (plus `hivemind_goal_add`/`hivemind_kpi_add` on OpenClaw) must have the same name, args, and return shape everywhere. A drift in one host silently breaks cross-harness recall. Source: `research/external/2026-06-16-tool-contract.md`.

2. **Hooks must be fast and fail-open.** Capture hooks run on the agent's critical path. Honor the per-event timeout (SessionStart 10s, PreToolUse 60s, capture 10-30s), dispatch heavy work `async: true`, and never let a hook crash block the host. Source: `research/external/2026-06-16-hook-lifecycle.md`.

3. **Capability detection must be cheap and side-effect free.** `hivemind install` auto-detects each assistant by probing for its home dir / binary (`~/.claude/projects`, `~/.codex`, `~/.cursor`, `~/.hermes`, `~/.pi`, OpenClaw). Detection runs on every install; it must not write files or spawn work. Source: `research/external/2026-06-16-capability-detection.md`.

4. **Never hardcode bundle paths - resolve them per host.** Claude Code forks `node "${CLAUDE_PLUGIN_ROOT}/bundle/<entry>.js"`; Cursor/Hermes use `~/.<host>/hivemind/bundle/`. Use the host's own root variable so the marketplace plugin and local installs both resolve correctly. Source: `research/external/2026-06-16-architecture-build.md`.

5. **The OpenClaw bundle must pass the ClawHub static scanner.** ClawHub forbids bare `spawn`/`execFileSync`. Route subprocess access through `createRequire`-based indirection (see `src/skillify/gate-runner.ts` comments and `scripts/audit-openclaw-bundle.mjs`) or the bundle is rejected. Source: `research/external/2026-06-16-openclaw-clawhub.md`.

6. **Register the MCP server only where the host supports it.** Hermes wires the MCP server (`src/mcp/server.ts`) under `mcp_servers.hivemind` in `~/.hermes/config.yaml`. Do not assume every host has an MCP transport - Claude Code and Cursor use hooks; pi/OpenClaw use native extensions. Source: `research/external/2026-06-16-mcp-registration.md`.

7. **pi ships raw TypeScript; do not pre-compile it.** `harnesses/pi/extension-source/hivemind.ts` is delivered as `.ts` and pi compiles it at load. Bundling or transpiling it in the installer breaks the load path. Source: `research/external/2026-06-16-pi-extension.md`.

8. **Author portable skills against the six-field Agent Skills spec only.** Outside Claude Code proper, only `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools` are legal `SKILL.md` frontmatter. Any Claude-Code-only field (`context: fork`, `disable-model-invocation`, `paths`, `hooks`, etc.) throws a hard packaging error on claude.ai uploads, the Skills API, and Cowork's "Save skill" pipeline. Source: `research/external/2026-08-14-agentskills-spec-six-fields.md`; queen-bee-stinger distilled-research-articles.md, Claude Code §SUPPLEMENT.

9. **Codex MCP config is TOML with an underscored `mcp_servers` key, not JSON `mcpServers`.** A config block copy-pasted from Claude Code or Cursor silently fails on Codex - no parse error, the server just never registers. Always write the Codex TOML form as its own case. Source: `research/external/2026-08-14-mcp-capability-negotiation.md`; queen-bee-stinger distilled-research-articles.md, ChatGPT Codex §Plugins.

10. **Cowork connectors must be reachable from the public internet, not localhost.** Cowork's MCP connectors run through Anthropic's cloud, not the local network. A capability that only stands up a local/stdio MCP server will silently fail to connect from a Cowork session. Source: queen-bee-stinger distilled-research-articles.md, Claude Cowork §Plugins.

11. **Know the real shared hook-event floor before designing a hook-driven capability.** Claude Code exposes 26 hook events; Codex exposes 5. The verified shared floor across Claude Code and Codex is `SessionStart`, `UserPromptSubmit`, `PreToolUse` (Bash-only), `PostToolUse` (Bash-only native, Edit/Write approximated), `Stop`. Design for that floor first; treat richer per-harness events as an enhancement, not a baseline. Source: `research/external/2026-08-14-hookbridge-loss-report-pattern.md`.

## Scope note

This stinger covers the **integration surface** for The Hive's four harnesses (Claude Code, Cursor, ChatGPT Codex, Claude Cowork): per-harness component placement, the wiring-mechanism decision (hooks, native extensions, MCP, AGENTS.md/instruction files), capability detection and graceful degradation, cross-harness portability, and distribution. It also retains, as a labeled case study, the original Hivemind six-host adapter work (Claude Code, Codex, Cursor, Hermes, pi, OpenClaw) this stinger was first built around. It does **not** cover vector-store schema/write-path internals, the embeddings runtime, retrieval ranking internals, or MCP wire-protocol details beyond registration - route those to the relevant stinger (`vector-store-stinger`, `embeddings-runtime-stinger`, `retrieval-stinger`, `mcp-protocol-stinger`).

## Handoff map

- Vector-store schema and the capture/write-path internals behind an MCP-backed memory tool: route to `vector-store-stinger`.
- Embeddings model selection, batching, runtime cost: route to `embeddings-runtime-stinger`.
- MCP protocol internals (tool schemas, transport framing) beyond per-harness registration: route to `mcp-protocol-stinger`.
- Bundling pipeline topology and release CI: route to `ci-release-stinger`.
- Login/auth device flow and token vault security audit: route to `security-stinger`.

---

*Part of The Hive, curated by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
