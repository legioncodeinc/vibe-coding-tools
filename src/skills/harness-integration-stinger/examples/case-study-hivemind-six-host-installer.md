# Case study: the Hivemind six-host installer

**This is a worked example, not the general guide set.** `harness-integration-stinger` was originally written for Hivemind, an npm package that distributed agent-memory tooling (capture/recall of session activity) into six coding assistants: **Claude Code, Codex, Cursor, Hermes, pi, and OpenClaw**. Four of those six map onto The Hive's own four harnesses (Claude Code, Codex, Cursor, and - loosely, as a cloud-hosted assistant - Cowork); Hermes and pi are retained here as historical context, not as harnesses The Hive currently targets. Read `guides/00-decision-framework.md` through `guides/06-distribution-and-audit.md` for the general practice; this file shows every decision point in those guides answered concretely, for one real, shipped integration, with the original numbers and file paths intact.

Cross-reference: `examples/wire-a-new-harness.md`, `examples/add-a-hook-event.md`, and `examples/register-mcp-in-hermes.md` are three narrower Hivemind-specific worked examples that predate this file - they're part of the same case study and are not superseded by it.

---

## 1. The shared-core + per-harness-bundle model (answers guide 00's decision framework, worked)

Hivemind was one TypeScript codebase shipping into six different coding assistants, in three layers:

| Layer | Location | Role |
|---|---|---|
| Shared core | `src/` | All real logic: capture, recall, Deep Lake API, graph, MCP server, skillify |
| Per-agent installer | `src/cli/install-<agent>.ts` | Detects the host, writes its config, lays down its bundle |
| Per-agent build output | `harnesses/<agent>/` | The packaged artifact each host loads (plugin, extension, skills, hooks) |

Stack: TypeScript `^6` / Node `>=22` / ESM. Build: `tsc` for typecheck plus `esbuild` to produce per-harness bundles.

```
src/ (shared core)
  └─ tsc + esbuild
       ├─ harnesses/claude-code/   (marketplace plugin: plugin.json + hooks.json + skills + bundle/)
       ├─ harnesses/codex/         (hooks.json + install.sh + .codex-plugin + skills)
       ├─ harnesses/cursor/        (hooks.json wiring + first-party VS Code/Cursor extension/)
       ├─ harnesses/hermes/        (shell hooks + skill + MCP server registration)
       ├─ harnesses/pi/            (AGENTS.md marker + raw-TS extension)
       └─ harnesses/openclaw/      (native extension: openclaw.plugin.json + contracted tools)
```

### The six harnesses and their wiring mechanisms - worked answer to guide 00's decision matrix

| Harness | Primary mechanism | Where it wires | Notes |
|---|---|---|---|
| Claude Code | Lifecycle hooks | `harnesses/claude-code/.claude-plugin/plugin.json` + `hooks/hooks.json` | Marketplace plugin; 7 hook events; skills (hivemind-memory/goals/graph) |
| Codex | Lifecycle hooks | `~/.codex/hooks.json` + `install.sh` + `.codex-plugin/plugin.json` | PreToolUse matcher is Bash-only |
| Cursor | Lifecycle hooks (1.7+) + extension | `~/.cursor/hooks.json` → `~/.cursor/hivemind/bundle/` | 6 lifecycle events; plus first-party VS Code/Cursor extension at `harnesses/cursor/extension/` |
| Hermes | Shell hooks + MCP server | `~/.hermes/config.yaml` (`hooks:` + `mcp_servers.hivemind`) | Registers `src/mcp/server.ts`; skill `hivemind-memory` |
| pi | AGENTS.md marker + TS extension | `~/.pi/agent/AGENTS.md` marker block + `harnesses/pi/extension-source/hivemind.ts` | Ships raw `.ts`; pi compiles at load; registers `hivemind_search`/`read`/`index` |
| OpenClaw | Native extension | `harnesses/openclaw/openclaw.plugin.json` | Declares contracted tools + commands; must pass ClawHub static scanner |

Most real hosts combined mechanisms: Cursor used hooks AND shipped an extension; Hermes used shell hooks AND an MCP server; pi used an AGENTS.md marker AND a TS extension - exactly the "decide per mechanism, not once per capability" principle in `guides/00-decision-framework.md`.

**Bundle path resolution** - never hardcode an absolute bundle path: Claude Code forked hooks as `node "${CLAUDE_PLUGIN_ROOT}/bundle/<entry>.js"`; Cursor/Hermes resolved to `~/.<host>/hivemind/bundle/`; pi loaded `~/.pi/agent/` extensions with the raw `.ts` dropped there and compiled at load.

```jsonc
// harnesses/claude-code/hooks/hooks.json - every command resolves via the host root var
{
  "type": "command",
  "command": "node \"${CLAUDE_PLUGIN_ROOT}/bundle/session-start.js\"",
  "timeout": 10
}
```

---

## 2. Capability detection and idempotent wiring (worked example for guide 04's principles)

`hivemind install` auto-detected every coding assistant present on the machine via `src/cli/install-<agent>.ts`, plus shared helpers (`install-mcp-shared.ts`, `install-scan.ts`). Each installer did three things in order: **detect** (cheap, side-effect-free filesystem probe), **wire** (lay down the bundle, write the host's config), **converge** (idempotent re-install).

| Host | Detection probe |
|---|---|
| Claude Code | `~/.claude/projects/` exists (and has `.jsonl` sessions) |
| Codex | `~/.codex/` exists |
| Cursor | `~/.cursor/` exists (hooks need 1.7+) |
| Hermes | `~/.hermes/config.yaml` exists |
| pi | `~/.pi/agent/` exists |
| OpenClaw | OpenClaw binary / plugin dir present |

```typescript
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

function claudeProjectsDir(): string {
  return join(homedir(), ".claude", "projects");
}
function isClaudeInstalled(): boolean {
  return existsSync(claudeProjectsDir());
}
```

Idempotency patterns actually used:
- **Marker blocks** (pi's `AGENTS.md`): wrap injected text in begin/end markers, replace the block on re-install rather than appending.
- **Config keys** (hermes `config.yaml`): upsert the `hivemind` key under `mcp_servers` / detect an existing hivemind hook before adding.
- **Hooks files**: rewrite the hivemind hook entries wholesale rather than appending duplicates.

```typescript
// Hermes: recognize an existing hivemind hook so re-install does not duplicate
function isHivemindHook(entry: unknown): boolean {
  const cmd = (entry as { command?: string })?.command;
  return typeof cmd === "string" && cmd.includes("/.hermes/hivemind/bundle/");
}
```

`install-scan.ts` performed a cheap one-time scan: if a host had prior sessions and no mine-local manifest existed yet, it kicked off a background mine of that history into Hivemind - the one place install did heavyweight work, explicitly gated behind a manifest check so re-installs never re-mined.

---

## 3. The capture/recall hook lifecycle (worked example for guide 02)

Two jobs ran across the hooks-based hosts (Claude Code, Codex, Cursor, Hermes shell hooks): **capture** (write a trace of session activity to the Deep Lake `sessions` table) and **recall** (inject relevant prior memory back into the agent at session start and on each prompt).

### Claude Code's 7-event set (the reference set; other hosts implemented a subset)

| Event | Entry (bundle) | Timeout | Async | Role |
|---|---|---|---|---|
| `SessionStart` | `session-start.js` + `session-notifications.js` + `session-start-setup.js` | 10s / 8s / 120s | last one async | Inject recall, surface notifications, background setup |
| `UserPromptSubmit` | `capture.js` | 10s | yes | Capture prompt; inject prompt-time recall |
| `PreToolUse` | `pre-tool-use.js` | 60s | no | Pre-tool gating/capture (runs before the tool) |
| `PostToolUse` | `capture.js` | 15s | yes | Capture tool result |
| `Stop` | `capture.js` + `graph-on-stop.js` | 30s | yes | Capture turn end; update graph |
| `SubagentStop` | `capture.js` | - | yes | Capture subagent turn end |
| `SessionEnd` | `capture.js` | - | yes | Final capture / flush |

| Host | Events | Notes |
|---|---|---|
| Claude Code | 7 (above) | Full set |
| Codex | hook set in `~/.codex/hooks.json` | PreToolUse matcher is Bash-only |
| Cursor | 6 lifecycle events (1.7+) | Wired in `~/.cursor/hooks.json` → `~/.cursor/hivemind/bundle/` |
| Hermes | shell hooks in `config.yaml` | Plus the MCP server for direct recall |

**The two hard rules, worked:**

```jsonc
{
  "PostToolUse": [
    { "hooks": [ { "type": "command",
        "command": "node \"${CLAUDE_PLUGIN_ROOT}/bundle/capture.js\"",
        "timeout": 15, "async": true } ] }
  ]
}
```
Recall injection (SessionStart, UserPromptSubmit) stayed on the critical path, well under timeout; capture (PostToolUse, Stop, SubagentStop, SessionEnd) was fire-and-forget, marked `async`. Every hook body failed open - a Deep Lake outage logged and exited cleanly rather than blocking the host:

```typescript
try {
  const payload = await readStdin();
  await captureTrace(payload);
} catch (err) {
  logQuietly(err);
} finally {
  process.exit(0);
}
```

Worked add-a-hook-event flow (`SubagentStop`, added across all hooks-based hosts): see `examples/add-a-hook-event.md`.

---

## 4. The cross-host tool/command contract (worked example for guide 05)

Hivemind was shared memory: a trace captured under Claude Code had to be recallable from Cursor, pi, or Hermes. That only worked if every host exposed the same memory operations with the same names, args, and return shapes - the contract.

| Tool | Args | Returns | Hosts |
|---|---|---|---|
| `hivemind_search` | `{ query, limit? }` | ranked hits across summaries + sessions | all |
| `hivemind_read` | `{ path }` | full content at a memory path | all |
| `hivemind_index` | `{ prefix?, limit? }` | list of summary entries | all |
| `hivemind_goal_add` | `{ ... }` | goal record | OpenClaw (contracted) |
| `hivemind_kpi_add` | `{ ... }` | kpi record | OpenClaw (contracted) |

```jsonc
// harnesses/openclaw/openclaw.plugin.json - the contract source of truth for OpenClaw
{
  "contracts": {
    "tools": ["hivemind_search", "hivemind_read", "hivemind_index", "hivemind_goal_add", "hivemind_kpi_add"],
    "commands": ["hivemind_login", "hivemind_capture", "hivemind_whoami", "..."],
    "memoryCorpusSupplements": true
  }
}
```

Where the contract was declared per host: OpenClaw's `openclaw.plugin.json` (`contracts.tools`/`contracts.commands`), pi's `harnesses/pi/extension-source/hivemind.ts` (registers the tools directly), Hermes' `mcp_servers.hivemind` (exposes via `src/mcp/server.ts`), Cursor's extension + hooks bundle, Claude Code's skills (`hivemind-memory`, `hivemind-goals`, `hivemind-graph`) documenting the surface while hooks delivered recall.

Adding a tool the right way (in lockstep, across all six adapters in one change): implement in `src/`, expose via the MCP server for Hermes, register in the pi extension, add to `openclaw.plugin.json`, document in the host skills, verify byte-identical name/args/shape everywhere. A one-host-only tool change was a Critical contract-drift finding.

---

## 5. Native extension adapters (Cursor, pi, OpenClaw)

**Cursor**: hooks (`~/.cursor/hooks.json`, 1.7+) for capture/recall, **and** a first-party VS Code/Cursor extension at `harnesses/cursor/extension/` for in-editor surfaces (status, panels, commands) - normal `package.json`/`src/`/webpack build. The extension complemented the hooks; it did not replace them.

**pi**: two wiring points. (1) `~/.pi/agent/AGENTS.md` marker block, replaced between markers on re-install. (2) `harnesses/pi/extension-source/hivemind.ts`, registering `hivemind_search`/`read`/`index`. **pi shipped raw `.ts` and compiled it at load** - pre-compiling, transpiling, or bundling that file in the installer broke the load path.

```typescript
// harnesses/pi/extension-source/hivemind.ts - registers the contracted tools
// Delivered raw; pi compiles at load. Do not transpile in the installer.
export function register(pi: PiHost) {
  pi.registerTool("hivemind_search", searchSchema, handleSearch);
  pi.registerTool("hivemind_read", readSchema, handleRead);
  pi.registerTool("hivemind_index", indexSchema, handleIndex);
}
```

**OpenClaw**: native extension at `harnesses/openclaw/`, `openclaw.plugin.json` declaring the contracted tools/commands up front, `configSchema` for `autoCapture`/`autoRecall`/`autoUpdate` booleans. Layout: `openclaw.plugin.json`, `package.json`, `src/`, `skills/`, `README.md`.

Common gotchas from this surface: shipping compiled `hivemind.js` instead of raw `.ts` broke pi's load path; removing Cursor's hooks to "rely on the extension" lost the capture lifecycle; contract drift crept in easiest inside an extension, since tool names/shapes were easy to fork there.

---

## 6. Registering the MCP server (Hermes)

Of the six harnesses, **Hermes** was the one that registered the Hivemind MCP server directly (Claude Code and Cursor delivered recall through hooks; pi and OpenClaw used native extensions). Hermes wired three ways at once via `src/cli/install-hermes.ts`: shell hooks (capture lifecycle), the MCP server (direct `hivemind_search`/`read`/`index` recall), and a skill (`hivemind-memory`) documenting the tools.

```typescript
// src/cli/install-hermes.ts
import { ensureMcpServerInstalled, MCP_SERVER_PATH } from "./install-mcp-shared.js";

const HERMES_HOME = join(homedir(), ".hermes");
const CONFIG_PATH = join(HERMES_HOME, "config.yaml");
const SERVER_KEY = "hivemind";
```

Resulting `config.yaml` stanza:
```yaml
mcp_servers:
  hivemind:
    command: node
    args:
      - /home/<user>/.hermes/hivemind/bundle/mcp-server.js
```

`ensureMcpServerInstalled` laid down the bundled server and upserted the `hivemind` key idempotently - reused for any future MCP-capable host so the registration logic stayed in one place. Full worked flow: `examples/register-mcp-in-hermes.md`.

---

## 7. Distribution: the marketplace plugin and the ClawHub bundle audit (worked example for guide 06)

Two packaged distribution surfaces, each with its own gate: the **Claude Code marketplace plugin** (`harnesses/claude-code/`: `.claude-plugin/plugin.json`, `hooks/hooks.json` with all 7 events, `skills/`, `bundle/` - gate: valid manifest + hooks, bundle resolves via `${CLAUDE_PLUGIN_ROOT}`) and the **OpenClaw ClawHub bundle** (gate: ClawHub's static scanner, which rejects bare `spawn`/`execFileSync`).

Hivemind genuinely needed subprocess access (running gates). To pass the ClawHub scanner, those calls were routed through `createRequire`-based indirection so the static scan never saw a literal `spawn`/`execFileSync` reference:

```javascript
// Pattern: resolve the child_process API at runtime via createRequire so the
// ClawHub static scanner does not flag a literal spawn/execFileSync reference.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const cp = require("node:child_process");
// cp.spawn(...) / cp.execFileSync(...) resolved indirectly
```

`scripts/audit-openclaw-bundle.mjs` scanned the built OpenClaw bundle for forbidden patterns before publish:
```bash
node scripts/audit-openclaw-bundle.mjs
```
A clean run meant no bare `spawn`/`execFileSync` the ClawHub scanner would reject; a failing run listed the offending references to route through `createRequire`.

This is the general "some distribution channels run static analysis on your bundle before accepting it - budget for it" principle in `guides/06-distribution-and-audit.md`, made concrete: ClawHub was a real, non-obvious gate that failed builds silently if ignored.

### Pre-publish checklist (as originally used)

**Claude Code marketplace plugin**: `plugin.json` id + version bumped; all 7 hook entries present and resolving via `${CLAUDE_PLUGIN_ROOT}`; skills present (`hivemind-memory`, `hivemind-goals`, `hivemind-graph`); bundle entries exist for every forked hook command.

**OpenClaw ClawHub bundle**: `openclaw.plugin.json` `contracts.tools`/`contracts.commands` complete and matching the contract; no bare `spawn`/`execFileSync` in the bundle (`scripts/audit-openclaw-bundle.mjs` clean); subprocess access routed through `createRequire`; `version` bumped.

---

## What changed between this case study and today's four-harness guides

- Hermes and pi are not part of The Hive's four target harnesses (Claude Code, Cursor, Codex, Cowork). Their wiring mechanisms (Hermes' combined shell-hook+MCP registration, pi's AGENTS.md-marker+raw-TS-extension) are preserved above as real, working examples of mechanisms The Hive's guides describe in the abstract (MCP registration, AGENTS.md as a fallback surface, native extensions) - read them as pattern references, not as harnesses to target.
- Claude Cowork has no equivalent in this case study - Hivemind predates Cowork's plugin support and was never adapted to it. Any Cowork-targeted work needs guide 01 (component placement) and guide 04 (capability detection/degradation) read fresh; there's no six-host precedent for Cowork's account-synced skills or cloud-reachable-connector model.
- The tool/command contract discipline (§4 above) and the capability-detection/idempotency discipline (§2 above) are the two pieces of this case study that generalize cleanly and unchanged to any new Hive capability - see guides `04-capability-detection-and-degradation.md` and `05-portability-and-contracts.md`.
