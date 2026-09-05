# Rules authoring reference, per harness

Grounding: `references/research/distilled-research-articles.md`, which cites raw sources in `references/research/raw/`. Every claim below carries its citation. Where sources conflict, both readings are stated rather than picking a winner silently.

"Rules" means the always-loaded, standing-instruction layer: CLAUDE.md, `.claude/rules/`, `.cursor/rules/`, AGENTS.md, and Cowork's Global/Folder instructions. This is distinct from Stingers (skills), which load on demand.

---

## Claude Code

### CLAUDE.md locations and concatenation order

Four scopes, loaded broadest to narrowest, so project instructions appear in context *after* user instructions:

| Scope | Location |
|---|---|
| Managed policy | macOS `/Library/Application Support/ClaudeCode/CLAUDE.md`; Linux/WSL `/etc/claude-code/CLAUDE.md`; Windows `C:\Program Files\ClaudeCode\CLAUDE.md` |
| User | `~/.claude/CLAUDE.md` |
| Project | `./CLAUDE.md` or `./.claude/CLAUDE.md` |
| Local | `./CLAUDE.local.md` (gitignore it) |

[raw/claude-code--rules--memory-official-docs.md]

Claude Code walks up the directory tree from cwd, loading `CLAUDE.md`/`CLAUDE.local.md` at every level. Files are **concatenated**, never override-replaced, ordered root to cwd, with `CLAUDE.local.md` appended right after `CLAUDE.md` at each level [raw/claude-code--rules--memory-official-docs.md].

### Walk-up loading and lazy subdirectory loading

The walk-up behavior above applies at session start. Subdirectory CLAUDE.md files below cwd load **lazily**, only when Claude actually reads a file in that subdirectory, not at launch [raw/claude-code--rules--memory-official-docs.md].

### Under-200-lines guidance

Target under 200 lines per CLAUDE.md file. Longer files measurably reduce instruction adherence [raw/claude-code--rules--memory-official-docs.md].

### `@import` syntax

`@path/to/import` supports both relative paths (resolved relative to the *containing file*, not cwd) and absolute paths. Max recursion depth is 4. Imports inside code spans or fences are skipped - wrap a path in backticks to cite it without triggering an import [raw/claude-code--rules--memory-official-docs.md].

External imports (resolving outside the working directory) trigger a one-time approval dialog in project-scope files. User-scope imports (`~/.claude/CLAUDE.md`, `~/.claude/rules/`) load without that dialog [raw/claude-code--rules--memory-official-docs.md].

### `.claude/rules/*.md` - `paths` frontmatter and budget

```text
your-project/
├── .claude/
│   ├── CLAUDE.md
│   └── rules/
│       ├── code-style.md
│       ├── testing.md
│       └── security.md
```

Rules discovered recursively, `.md` extension. Rules without `paths` frontmatter load unconditionally, at the same priority as `.claude/CLAUDE.md`. Path-scoped rules use YAML frontmatter and only enter context when Claude reads or edits a matching file:

```markdown
---
paths:
  - "src/api/**/*.ts"
---

# API Development Rules

- All API endpoints must include input validation
```

Brace expansion is supported (`src/**/*.{ts,tsx}`). The whole `paths` list across a rule file shares a budget of **1,000 expanded patterns and 4 MiB** (fixed in v2.1.217+, was a stall/crash bug before). An unreadable bracket expression like `photos [2024/**` matches nothing rather than erroring the whole rule (fixed v2.1.207; before that, one bad pattern broke the Read tool for every file the rule touched). `.claude/rules/` supports symlinks, including circular-symlink detection, for sharing rule files across projects. User-level rules (`~/.claude/rules/`) load before project rules, so project rules take higher priority [raw/claude-code--rules--memory-official-docs.md].

### `claudeMd` managed key and `claudeMdExcludes`

Managed CLAUDE.md content can be embedded directly via the `claudeMd` key in `managed-settings.json`, instead of shipping a separate file. This key has no effect in user, project, or local settings - it's managed-scope only [raw/claude-code--rules--memory-official-docs.md].

`claudeMdExcludes` (settable at any settings layer, arrays merge across layers) skips ancestor CLAUDE.md files by glob, useful in a monorepo where you don't want every package to inherit a sibling's rules. Managed-policy CLAUDE.md files can never be excluded this way [raw/claude-code--rules--memory-official-docs.md].

### Claude Code reads CLAUDE.md, not AGENTS.md

Claude Code reads `CLAUDE.md`. It does not read `AGENTS.md` on its own. To share instructions with other agents that do read AGENTS.md, either symlink (`ln -s AGENTS.md CLAUDE.md`, which needs admin/dev-mode on Windows, so use the import instead there) or import it at the top of CLAUDE.md and append Claude-specific content below:

```markdown
@AGENTS.md

## Claude Code

Use plan mode for changes under `src/billing/`.
```
[raw/claude-code--rules--memory-official-docs.md]

This is the bridge the Hive uses: a shared AGENTS.md baseline, imported into CLAUDE.md, with harness-specific additions layered underneath.

### Rules are context, not enforcement

Both CLAUDE.md and `.claude/rules/` are **context**, not enforced configuration. If a rule needs to actually block an action, that requires a `PreToolUse` hook - a rule telling Claude "never run X" is a strong suggestion the model can still deviate from under pressure, while a hook can return a hard deny [raw/claude-code--rules--memory-official-docs.md, raw/claude-code--rules--hooks-official-docs.md]. Anything in a Hive rule file that must be non-negotiable belongs in a hook, not just in prose.

---

## Cursor

### `.cursor/rules/*.mdc`

Location: `.cursor/rules/`, version-controlled, scoped to the codebase, subfolders allowed (`.cursor/rules/frontend/components.mdc`). Extension **must be `.mdc`** - a plain `.md` file dropped into `.cursor/rules/` is silently ignored, since there's no frontmatter mechanism for it. Use `AGENTS.md` for plain markdown instead [raw/cursor--rules--cursor-docs-rules.md].

| Field | Type | Required | Notes |
|---|---|---|---|
| `description` | string | No | read by the Agent to judge relevance when `alwaysApply: false` and no `globs` is set |
| `globs` | string or array | No | comma-separated string or list, both valid per official docs |
| `alwaysApply` | boolean | No | `true` means always included, `globs`/`description` ignored |

[raw/cursor--rules--cursor-docs-rules.md]

**Conflict:** a community source (TECHSY) types `globs` strictly as a YAML list and warns that brace syntax (`{src,lib}/**/*.ts`) "can fail silently." Official docs and the Plugins reference both show a working comma-separated string form. Prefer official (string or array both accepted); treat the "list only" claim as unconfirmed [raw/cursor--rules--techsy-mdc-frontmatter.md, raw/cursor--rules--cursor-docs-rules.md, raw/cursor--plugins--plugins-reference.md].

### Four rule types and resolution table

Cursor's four rule types are Project Rules, User Rules, Team Rules, and AGENTS.md [raw/cursor--rules--cursor-docs-rules.md].

| `alwaysApply` | `description` | `globs` | Behavior |
|---|---|---|---|
| `true` | - | - | Always included |
| `false` | - | provided | Auto-attached on matching file |
| `false` | provided | omitted | Agent decides from description |
| `false` | omitted | omitted | Manual - only via `@`-mention |

[raw/cursor--rules--cursor-docs-rules.md]

### Plain `.md` is silently ignored

Worth repeating on its own: `.cursor/rules/some-rule.md` does nothing. It must be `.mdc`. This is a common authoring mistake when copying a rule file over from a harness that uses plain markdown [raw/cursor--rules--cursor-docs-rules.md].

### Nested AGENTS.md

AGENTS.md is plain markdown, no frontmatter, a project-root alternative to `.cursor/rules`. Nested AGENTS.md files in subdirectories are supported and merge with parents, with the more-specific file winning [raw/cursor--rules--cursor-docs-rules.md].

### Team Rules

Team/Enterprise only, dashboard-managed: free-form text, no folder structure, glob-scopable. "Enable this rule immediately" (active vs. draft) and "Enforce this rule" (can't be disabled per-user) are separate toggles. Remote import: Customize → Rules → Add Rule → Remote Rule (GitHub) scans all `.mdc` files in a repo and syncs them into `.cursor/rules/imported/`, preserving relative paths [raw/cursor--rules--cursor-docs-rules.md].

User Rules apply only to Agent (Chat), not to Inline Edit (Cmd/Ctrl+K) [raw/cursor--rules--cursor-docs-rules.md].

### Precedence: Team > Project > User

Official precedence: Team Rules, then Project Rules, then User Rules - all applicable rules merge, and earlier sources win on conflict [raw/cursor--rules--cursor-docs-rules.md]. Within project rules, same-tier conflicts are undefined by official docs; community advice is to number files (`001-base.mdc`) for predictable load order, since later-loaded rules "tend to" win - treat this as unconfirmed convention, not documented behavior [raw/cursor--rules--techsy-mdc-frontmatter.md].

### Under-500-lines guidance and Rule of Three

Keep rules under 500 lines; reference files with `@filename` rather than copying content in; don't restate a whole style guide (use a linter instead). Codify a pattern as a rule only after the agent repeats the same mistake three times - the "Rule of Three" [raw/cursor--rules--cursor-docs-rules.md, raw/cursor--rules--techsy-mdc-frontmatter.md]. A community, unverified claim: a project with 20 always-on rules can burn "2,000+ tokens per request" against a roughly 20,000-token standard chat context - anecdotal, not official, but a useful sanity check when deciding what goes in `alwaysApply: true` [raw/cursor--rules--techsy-mdc-frontmatter.md].

---

## Codex

### AGENTS.md - exact filename, global, override

Plain Markdown. No YAML frontmatter, no required fields, no `@import` syntax in the base spec. Filename must be the exact uppercase `AGENTS.md` [raw/codex--rules--agents-md-standard.md, raw/codex--rules--agents-md-hierarchy-community.md].

| Scope | Path |
|---|---|
| Global | `~/.codex/AGENTS.md` |
| Project root | `./AGENTS.md` |
| Nested/directory | `<dir>/AGENTS.md` (any subdirectory) |
| Personal override | `AGENTS.override.md` (same directory; if present, the sibling `AGENTS.md` in that directory is skipped entirely) |

[raw/codex--rules--agents-md-hierarchy-community.md]

### Root-down concatenation vs. closest-wins - open conflict

This is the highest-impact gotcha in Codex's rules surface, and it is genuinely unresolved between sources:

- **agents.md site FAQ (base spec)**: "The closest AGENTS.md to the edited file wins; explicit user chat prompts override everything." Framed as single-file selection, not a merge [raw/codex--rules--agents-md-standard.md].
- **Codex CLI docs, per community quotation**: "Codex concatenates files from the root down, joining them with blank lines. Files closer to your current directory override earlier guidance because they appear later in the combined prompt." [raw/codex--rules--agents-md-standard.md, raw/codex--rules--agents-md-hierarchy-community.md]

Mechanics as cross-checked across two community write-ups: Codex CLI walks from git root to cwd and concatenates **every** AGENTS.md file found along the path, joined by blank lines, each injected as its own user-role message headed `# AGENTS.md instructions for <path>`. Precedence comes from prompt order (later wins), not from selecting a single file. Token cost scales with directory depth [raw/codex--rules--agents-md-hierarchy-community.md].

There is an open GitHub issue (`agentsmd/agents.md#53`) with three possible readings recorded and no resolution: Codex is simply out of spec, concatenation is intentional and the base spec needs updating, or concatenation is meant to be optional/configurable [raw/codex--rules--agents-md-hierarchy-community.md]. **State both readings when writing Hive guidance for Codex; do not assert one is correct.**

Cross-harness contrast: GitHub Copilot uses nearest-ancestor-only resolution (walks up, uses only the first file found, ignores parents) - the opposite of Codex's apparent concatenation. Neither Cursor nor Claude Code implements Codex's nested concatenation or Copilot's ancestor walk; a subdirectory-only AGENTS.md is invisible to both. This is flagged as "the most common drift" when a team assumes uniform AGENTS.md behavior across tools [raw/codex--rules--agents-md-hierarchy-community.md].

### `project_doc_max_bytes` - size cap conflict

**Conflict:** one community source (agentconfig.ing) states the default is 64KB; another (ccmd.dev) states the base-spec cap is 32 KiB. Unresolved in the raw research - state both figures, do not pick one [raw/codex--rules--agents-md-hierarchy-community.md, raw/codex--rules--agents-md-standard.md].

Codex also supports fallback filenames via `project_doc_fallback_filenames`, checked only when neither `AGENTS.md` nor `AGENTS.override.md` is found [raw/codex--rules--agents-md-hierarchy-community.md].

### `config.toml` precedence chain

| Location | Scope |
|---|---|
| `~/.codex/config.toml` | User-level defaults |
| `.codex/config.toml` (repo) | Project override, loaded **only when the project is trusted** |
| `$CODEX_HOME/profile-name.config.toml` | Named profile (`--profile profile-name`) |
| `/etc/codex/config.toml` (Unix) | System config |

Precedence, highest to lowest: (1) CLI flags / `--config`/`-c`; (2) project `.codex/config.toml`, root to cwd, closest wins, trusted only; (3) profile files; (4) user config; (5) system config; (6) built-in defaults [raw/codex--rules--config-basic.md].

### Untrusted projects skip all project `.codex/` layers

If a project is untrusted, Codex skips **all** project `.codex/` layers together - config, hooks, and rules - as one unit. User and system config still load [raw/codex--rules--config-basic.md]. A Hive rule file placed only in a project's `.codex/` directory is invisible in an untrusted project; there is no partial application.

Separately: project-local `.codex/config.toml` cannot override machine-local/auth/telemetry keys regardless of trust - `openai_base_url`, `chatgpt_base_url`, `apps_mcp_product_sku`, `model_provider`, `model_providers`, `notify`, `profile`, `profiles`, `experimental_realtime_ws_base_url`, `otel` are silently ignored if set at project scope. Put those in user-level config [raw/codex--rules--config-reference.md].

### Protected paths

Enforced even under `workspace-write`, inside any writable root: `<root>/.git` (read-only, recursive, resolved through `gitdir:` pointers), `<root>/.agents` (read-only if a directory), `<root>/.codex` (read-only if a directory) [raw/codex--rules--agent-approvals-security.md]. This means Codex agent-phase writes cannot self-modify their own rules directory even with a permissive sandbox - a useful backstop, but also a gotcha if a Hive workflow expects to write generated rules into `.codex/` at runtime; it can't.

---

## Cowork

### No disk CLAUDE.md

Cowork does not read a project-root CLAUDE.md from disk the way Claude Code CLI does. Cowork sessions run in cloud/VM sandboxes (paths like `/sessions/.../mnt/...`); a `.claude/CLAUDE.md`-style file is not the standard persistent-instruction unit there - skills and plugins are [raw/cowork--rules--support-claude-md-and-prompts.md].

### Global instructions

Standing instructions applied to every Cowork session (tone, output format, background on your role). Set via: Settings > Cowork, click "Edit" next to Global instructions, type the instructions, click "Save" [raw/cowork--agents--support-get-started-cowork.md].

### Folder instructions

Added automatically when you select a local folder on desktop; adds project-specific context. Claude can also update Folder instructions on its own during a session - there's no other documented manual-edit flow beyond that [raw/cowork--agents--support-get-started-cowork.md].

| Mechanism | Where set | Scope | Who can edit |
|---|---|---|---|
| Global instructions | Settings > Cowork > Global instructions | Every Cowork session | User only |
| Folder instructions | Auto-added when a local folder is selected on desktop | That project/folder | User, or Claude itself mid-session |

[raw/cowork--agents--support-get-started-cowork.md]

### Approval modes

Three approval modes govern how much Claude checks in before acting on anything a rule/instruction directs it to do:

| | Connector "Always allow" | Connector "Needs approval" | Connector "Blocked" |
|---|---|---|---|
| Manual mode | Approved | Asks for permission | Denied |
| Auto mode* | Read-only tools approved; write/delete Claude decides | Claude decides | Denied |
| Skip mode | Approved | Approved | Denied |

*Auto mode is currently Pro/Max only [raw/cowork--agents--support-get-started-cowork.md].

Deletion protection is a hard rule regardless of mode: Cowork requires explicit "Allow" permission before permanently deleting any files [raw/cowork--agents--support-get-started-cowork.md].

### Chat memory does not carry into Cowork

Chat memory does not carry into Cowork sessions. Within Cowork, memory is supported in projects only [raw/cowork--agents--support-get-started-cowork.md]. Don't assume a standing instruction from a regular Claude chat will be present when the same user opens Cowork.

### Gotcha: the CLI CLAUDE.md guide is written for the CLI

The general CLAUDE.md guide covering loading behavior, prompt caching, `/init`, `/memory`, `/compact`, and subdirectory files is written for Claude Code CLI and explicitly does not describe Cowork's mechanism. It's referenced here only as documented contrast, never as Cowork behavior [raw/cowork--rules--support-claude-md-and-prompts.md].

---

## Cross-harness strategy

AGENTS.md is the shared baseline: plain markdown, no frontmatter, read natively by Codex and Cursor, and importable into Claude Code's CLAUDE.md via `@AGENTS.md`. Build the Hive's core, harness-agnostic rule content once in AGENTS.md, then bridge it per harness:

- **Claude Code**: `@AGENTS.md` at the top of CLAUDE.md, harness-specific additions below it. Anything that must be enforced, not just stated, moves into a `.claude/rules/*.md` file with `paths` frontmatter, or a hook - CLAUDE.md content is context only [raw/claude-code--rules--memory-official-docs.md].
- **Cursor**: glob-scoped content moves into `.mdc` files under `.cursor/rules/` so it can be auto-attached per file type; content that should always apply everywhere can live in AGENTS.md directly, since Cursor reads it natively [raw/cursor--rules--cursor-docs-rules.md].
- **Codex**: AGENTS.md is native and required - no translation needed for the baseline. Be explicit that a section is root-wide vs. directory-specific if the repo relies on Codex's nested AGENTS.md behavior, given the concatenation-vs-closest-wins conflict above [raw/codex--rules--agents-md-standard.md].
- **Cowork**: no file bridge exists. Folder instructions are the closest analog to a project AGENTS.md, and either the user maintains them by hand or asks Claude to update them mid-session. There is no automated sync from a repo's AGENTS.md into Cowork's Folder instructions in the current research [raw/cowork--agents--support-get-started-cowork.md, raw/cowork--rules--support-claude-md-and-prompts.md].
