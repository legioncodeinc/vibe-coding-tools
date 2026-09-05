# SKILL.md authoring reference across the four harnesses

This file tells you what actually goes in a `SKILL.md` frontmatter block, where the file lives, and what breaks if you get it wrong, per harness. Citations are deliberately not inline in this file: every claim traces back to `references/research/distilled-research-articles.md` (short form: the distilled doc), which itself cites `raw/` sources per claim. To verify anything here, look it up in the distilled doc's Skills sections and follow its bracketed raw citations.

If you only remember one thing from this file: author to the six-field Agent Skills spec and your stinger loads everywhere. Everything past that is a harness-specific bonus, not a requirement.

## The portability golden rule

Outside Claude Code proper (claude.ai uploads, the Skills API, `package_skill.py` packaging, and therefore Cowork's account-synced skills), only six frontmatter fields are legal: `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`. Any other key throws a hard error on packaging or upload: "Unexpected key(s) in SKILL.md frontmatter." Claude Code itself accepts all six spec fields plus its own extensions, so spec-six frontmatter loads cleanly in Claude Code too. This is why every Hive stinger's root `SKILL.md` uses the spec six and nothing else, no exceptions.

That single rule is why the reference template in this folder ships spec-six-only frontmatter.

## Frontmatter field support, per harness

### Claude Code (full extension set)

Only `description` is officially recommended/required for auto-invocation to work; every other field is optional. Confirmed complete field list, post-supplement-refetch:

`name`, `description`, `when_to_use`, `argument-hint`, `arguments`, `disable-model-invocation`, `user-invocable`, `allowed-tools`, `disallowed-tools`, `model`, `effort`, `context` (`fork` runs the skill in a subagent), `agent` (subagent type when `context: fork`), `background`, `hooks`, `paths`, `shell`, `metadata`, `license`, `compatibility`.

That is twenty fields. The combined `description` plus `when_to_use` text gets truncated at 1,536 characters in the skill listing, so budget the two fields together, not `description` alone. Boolean fields like `disable-model-invocation` accept `yes/no/on/off/1/0` in any case, not just `true/false` (v2.1.218+ for plugin skills/commands).

A community source (agentskills.io production guide) claims five different "non-negotiable" fields including a required `version`, `author`, and `triggers` array. This directly conflicts with Claude Code's own docs. The distilled research flags this explicitly and says prefer the official docs: `description` is the only thing Claude Code itself requires. Treat the community five-field claim as describing the general agentskills.io ecosystem, not a Claude Code minimum.

### Agent Skills spec (the portable six)

`name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`. This is the lowest common denominator and the only frontmatter shape guaranteed to survive claude.ai upload, the Skills API, and Cowork account sync. No `context: fork`, no `!` command injection, no `${CLAUDE_PLUGIN_ROOT}` substitution, none of the Claude Code extensions.

### Cursor

Full `SKILL.md` schema (from the dedicated Skills reference, which is authoritative over the narrower Plugins reference):

| Field | Required | Notes |
|---|---|---|
| `name` | Yes | lowercase/numbers/hyphens; **must match the parent folder name exactly** |
| `description` | Yes | what + when; the agent reads this to judge relevance |
| `paths` | No | glob(s) scoping the skill to matching files; comma-separated string or YAML list; unset means always available |
| `disable-model-invocation` | No | `true` restricts it to explicit `/skill-name`, never auto-loaded |
| `metadata` | No | arbitrary key-value map |

Legacy `globs` still works as a fallback but new skills should use `paths`. Cursor's Plugins reference lists only `name`/`description` for skill frontmatter inside a plugin bundle, a narrower subset than the dedicated Skills docs. Treat the Skills reference as authoritative for `SKILL.md` content itself; the Plugins reference is describing plugin packaging, not the file format.

The name-must-match-folder rule is a hard gotcha: `.claude/skills/deploy-app/SKILL.md` must declare `name: deploy-app`, not something else, or Cursor's discovery breaks silently.

### Codex

Minimum: `name` and `description` in frontmatter, nothing else is called out as supported in the raw research. A real working example from OpenAI's own customization overview:

```yaml
---
name: commit
description: Stage and commit changes in semantic groups. Use when the user wants to commit, organize commits, or clean up a branch before pushing.
---
```

Codex pairs the skill folder with an optional sidecar file, `agents/openai.yaml`, sitting next to `SKILL.md` inside the skill directory. That sidecar is where Codex-specific concerns live instead of frontmatter bloat: `interface.display_name`, `interface.short_description`, `interface.brand_color`, `interface.default_prompt`, `policy.allow_implicit_invocation` (defaults `true`; set `false` to disable auto-selection while explicit `$skill-name` invocation still works), and `dependencies.tools` (declares MCP tool dependencies for auto-install/wiring).

### Cowork

Required frontmatter, per the official support article:
- `name`: human-friendly name, **64 characters max**.
- `description`: what it does and when to use it. The official support article caps this at **200 characters**. A separate community source gives a looser "under 1,024 characters" figure. The two sources disagree; the distilled research prefers the official 200-character figure but flags both as evidence the cap is short and enforced. Author to 200 to be safe across both readings.

Optional: `dependencies` (software packages required, e.g. `python>=3.8, pandas>=1.5.0`).

Additional naming rules from a community source, not contradicted anywhere: `name` must be kebab-case; it cannot contain "claude" or "anthropic" (reserved words); frontmatter cannot contain XML angle brackets anywhere (a security restriction, not a style preference).

## Frontmatter cap conflict summary

| Field | Cap per official source | Cap per other source | Verdict |
|---|---|---|---|
| Cowork `description` | 200 chars (support article) | ~1,024 chars (community) | Author to 200, cite the conflict, don't chase the looser number |
| Claude Code `description` + `when_to_use` combined | 1,536 chars (truncated in listing) | n/a | Not a hard error, just gets cut in the UI |

## Skill directory locations, per harness

| Harness | Locations |
|---|---|
| Claude Code | Enterprise (managed settings), `~/.claude/skills/<name>/SKILL.md` (personal), `.claude/skills/<name>/SKILL.md` (project), `<plugin>/skills/<name>/SKILL.md` (plugin) |
| Cursor | `.agents/skills/` (project), `.claude/skills/` (project), `~/.agents/skills/` (user), `~/.claude/skills/` (user); Cursor also reads `.claude/skills/`, `.codex/skills/`, and their global equivalents as a cross-harness fallback |
| Codex | `$CWD/.agents/skills` (repo, working-folder-scoped), `$CWD/../.agents/skills`, `$REPO_ROOT/.agents/skills` (repo, root-wide), `$HOME/.agents/skills` (user), `/etc/codex/skills` (admin), plus system-bundled skills. Codex scans every directory from cwd up to repo root, not just root and cwd |
| Cowork | Not a filesystem location you author into directly. Cowork sessions read skills enabled on the claude.ai account, synced at session start, mounted read-only inside the session at `/sessions/*/mnt/.claude/skills/<skill-name>/SKILL.md`. Cloud sessions additionally load project skills committed to `.claude/skills/` in the cloned repo |

Codex migration note: repo-scoped skills moved from `.codex/skills/` to `.agents/skills/` (their PR #10317) to align with the shared cross-vendor `.agents/` convention. The old path still loads but is deprecated and slated for removal. That migration is REPO-scope only.

## Precedence and sync behavior

**Claude Code**: enterprise beats personal beats project beats bundled; a same-named skill beats a `.claude/commands/` file; plugin skills are always namespaced (`plugin-name:skill-name`) so they never collide with anything; any local or plugin skill beats a same-named claude.ai-synced skill. Nested `.claude/skills/` in subdirectories load lazily on first file touch and register with a directory-qualified name (`apps/web:deploy`) alongside the root skill of the same name; both stay available at once. `synced` is a reserved folder name, used for account-synced skills.

**Cursor**: project beats user; among project locations there's no documented ranking beyond "recursively walked," and the cross-harness fallback paths (`.claude/skills/`, `.codex/skills/`) mean a skill authored for Claude Code or Codex loads unmodified in Cursor and vice versa, as long as the frontmatter stays inside what Cursor parses.

**Codex**: same-name skills in different scope locations are **not merged**, both appear as separate selectable entries. Symlinked skill folders are followed.

**Cowork sync**: Cowork and cloud sessions do NOT read `~/.claude/skills/` on your machine, full stop. To reach a Cowork session, a personal skill must be enabled on the claude.ai account (synced automatically at session start), committed to the repo for cloud sessions, or shipped via a plugin declared in the repo's `.claude/settings.json`. Desktop scheduled tasks are the one exception: they run locally and load skills the same way any other local session does.

The env var that bridges this in the other direction, from account sync back into a local CLI run, is `CLAUDE_CODE_SYNC_SKILLS=1`:

```bash
CLAUDE_CODE_SYNC_SKILLS=1 claude -p "List the skills you have available"
```

This downloads synced skills into `~/.claude/skills/synced/` for that run. Without the env var, a local non-interactive Claude Code session never sees account-synced skills.

## Progressive disclosure budgets

All four harnesses implement some form of three-tier loading (frontmatter always resident, full body loaded on relevance, `references/`/`scripts/`/`assets/` loaded only when specifically pulled). The one harness with a hard, quantified budget in the research is Codex:

Codex loads only `name` + `description` + file path for every discoverable skill up front, capped at **2% of the model's context window, or 8,000 characters when the context window size is unknown**. Past that budget, Codex shortens descriptions first, then omits skills entirely (with a warning) if it still doesn't fit. Because implicit (auto) invocation depends entirely on `description` text matching the task, front-load your trigger words and the core use case at the start of the description, before the budget forces a truncation.

Cowork's three-level loading (frontmatter, then SKILL.md body, then `references/`/`assets/`) is documented as a mechanism, not a hard character/percentage budget the way Codex's is.

## The `!` command injection prohibition

Claude Code's `` !`command` `` syntax in a skill body runs a shell command and substitutes its stdout into the skill content before Claude ever reads it. This is a Claude Code-only extension, not part of the portable spec.

**In Cowork specifically, every `` !`command` `` line in a skill body gets replaced with a `disableSkillShellExecution` placeholder.** It does not execute. This is confirmed for both desktop Cowork sessions and, by extension, applies wherever the same skill body is supplied. Cloud sessions (isolated container) behave like a local Claude Code session and do run `!` injection normally, so the failure mode is specific to interactive Cowork, not cloud generally.

Practical rule for Hive stingers: **never use `` !`command` `` anywhere in a stinger's markdown.** Instead, instruct the model to run the equivalent command itself via a tool call (Bash, or whatever the harness's shell tool is called). This is slower by one round-trip but works identically in every harness and every session type. It is also why the reference template in this folder has no `!` lines anywhere.

In any other unsynced local Claude Code session (not the CLI-with-project-context case), `!` commands also don't run, `@`-referenced files don't get attached, and placeholders like `${CLAUDE_PROJECT_DIR}`/`${CLAUDE_SESSION_ID}` reach Claude as literal text instead of being substituted. Don't assume dynamic injection is safe just because you tested it in one session type.

## String substitution table (Claude Code only)

These only resolve inside Claude Code; nowhere else in the research substantiates equivalent substitution syntax.

| Substitution | Resolves to |
|---|---|
| `$ARGUMENTS` | full trailing text after the invocation |
| `$ARGUMENTS[N]` | Nth argument |
| `$N` | positional argument N |
| `$name` | a named argument declared via the `arguments` frontmatter field |
| `${CLAUDE_SESSION_ID}` | current session ID |
| `${CLAUDE_EFFORT}` | current effort level |
| `${CLAUDE_SKILL_DIR}` | the skill's own directory (substitutes in both markdown content and `Bash` rules inside `allowed-tools`) |
| `${CLAUDE_PROJECT_DIR}` | project root (same dual-substitution behavior as above) |
| `${CLAUDE_PLUGIN_ROOT}` | plugin-shipped skills only |
| `${CLAUDE_PLUGIN_DATA}` | plugin-shipped skills only |

Codex's custom-prompt argument syntax (`$1`-`$9`, `$ARGUMENTS`, `$NAME`, `$$` for a literal dollar sign) is a related but separate convention documented under Commands, not Skills, and applies to the deprecated custom-prompts feature, not `SKILL.md` itself. See `templates/commands/harness-specific-reference.md`.

## Gaps flagged, not invented

- The exact effect of Claude Code's `argument-hint` and `model` skill-frontmatter fields was named in the docs but the raw fetch truncated before their syntax was captured. Use them if you need them, but don't assume behavior beyond "documented to exist."
- Cursor's plugin-bundled skill frontmatter (`name`/`description` only, per the Plugins reference) versus the fuller standalone Skills schema is an unreconciled gap in the source material: the raw research doesn't say whether a plugin-distributed skill actually supports `paths`/`disable-model-invocation`/`metadata` or silently drops them.
- No raw source lists a Cowork-native `allowed-tools` equivalent. Since Cowork skills use spec-six frontmatter, `allowed-tools` is technically legal there, but no Cowork-specific behavior for it is documented.
