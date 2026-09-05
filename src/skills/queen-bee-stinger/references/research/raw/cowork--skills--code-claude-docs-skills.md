# Extend Claude with skills - Claude Code Docs
- URL: https://code.claude.com/docs/en/skills
- Fetched: 2026-08-14
- Source type: official-docs
- Component: skills (also covers commands: custom commands merged into skills)

> Create, manage, and share skills to extend Claude's capabilities in Claude Code. Includes custom commands and bundled skills.

Skills extend what Claude can do. Create a `SKILL.md` file with instructions, and Claude adds it to its toolkit. Claude uses skills when relevant, or you can invoke one directly with `/skill-name`.

Create a skill when you keep pasting the same instructions, checklist, or multi-step procedure into chat, or when a section of CLAUDE.md has grown into a procedure rather than a fact. Unlike CLAUDE.md content, a skill's body loads only when it's used, so long reference material costs almost nothing until you need it.

**Custom commands have been merged into skills.** A file at `.claude/commands/deploy.md` and a skill at `.claude/skills/deploy/SKILL.md` both create `/deploy` and work the same way. Existing `.claude/commands/` files keep working. Skills add optional features: a directory for supporting files, frontmatter to control whether you or Claude invokes them, and the ability for Claude to load them automatically when relevant.

Claude Code skills follow the Agent Skills open standard (agentskills.io), which works across multiple AI tools. Claude Code extends the standard with additional features like invocation control, subagent execution, and dynamic context injection.

## Bundled skills

Claude Code includes a set of bundled skills, such as `/doctor`, `/code-review`, `/batch`, `/debug`, `/loop`, and `/claude-api`. Bundled skills are prompt-based: they give Claude detailed instructions and let it orchestrate the work using its tools. You invoke a bundled skill the same way as any other skill, by typing `/` followed by the skill name.

### Run and verify your app

Three bundled skills work together to launch your app and confirm changes against the running app instead of just tests:

| Skill | Purpose |
| :--------------------- | :---------------------------------------------------------------------------------------------------------------- |
| `/run` | Launch and drive your app to see a change working |
| `/verify` | Build and run your app to confirm a code change does what it should, without falling back to tests or type checks |
| `/run-skill-generator` | Teach `/run` and `/verify` how to build and launch your project |

`/run-skill-generator` records the recipe: it gets your app running from a clean environment, captures what worked, and commits it as a per-project skill at `.claude/skills/run-<name>/`.

## Getting started: create your first skill

Example: `~/.claude/skills/summarize-changes/SKILL.md`

```yaml
---
description: Summarizes uncommitted changes and flags anything risky. Use when the user asks what changed, wants a commit message, or asks to review their diff.
---

## Current changes

!`git diff HEAD`

## Instructions

Summarize the changes above in two or three bullet points, then list any risks you notice such as missing error handling, hardcoded values, or tests that need updating. If the diff is empty, say there are no uncommitted changes.
```

The `` !`git diff HEAD` `` line uses dynamic context injection: Claude Code runs the command and replaces the line with its output before Claude sees the skill content.

### Where skills live

| Location | Path | Applies to |
| :--------- | :-------------------------------------------------- | :----------------------------- |
| Enterprise | managed settings | All users in your organization |
| Personal | `~/.claude/skills/<name>/SKILL.md` | All your projects |
| Project | `.claude/skills/<name>/SKILL.md` | This project only |
| Plugin | `<plugin>/skills/<name>/SKILL.md` | Where plugin is enabled |

Precedence when skills share a name: enterprise overrides personal, personal overrides project. A skill at any level overrides a bundled skill with the same name. Plugin skills use a `plugin-name:skill-name` namespace so they never conflict with other levels.

Skills also load from nested `.claude/skills/` directories below your working directory. A nested skill appears under a directory-qualified name, e.g. `apps/web:deploy`.

Add a `.claude-plugin/plugin.json` to a skill folder and it loads as a plugin named `<dir>@skills-dir`, bundling agents, hooks, and MCP servers.

#### Live change detection

Claude Code watches skill directories for file changes and picks up edits within the current session, without a restart (except a brand-new top-level skills directory, which needs a restart).

Each skill is a directory with `SKILL.md` as the entrypoint:

```text
my-skill/
├── SKILL.md           # Main instructions (required)
├── template.md        # Template for Claude to fill in
├── examples/
│   └── sample.md      # Example output showing expected format
└── scripts/
    └── validate.sh    # Script Claude can execute
```

## THE CRITICAL COWORK-SPECIFIC SECTION: Skills in Cowork and cloud sessions

> **Cowork sessions and cloud sessions, including routines, don't read `~/.claude/skills/` on your machine.** Both interactive and scheduled Cowork sessions load the skills enabled for your claude.ai account, synced at session start; manage them from **Customize** in the Desktop app sidebar or from the skills settings on claude.ai. Cloud sessions additionally load project skills committed to the cloned repository's `.claude/skills/`.

If a skill exists only in `~/.claude/skills/` on your machine, Claude Code reports that the skill was not found when a routine invokes it, because each routine run starts as a fresh remote session. To make a personal skill available in these sessions:

* For Cowork and cloud sessions, enable the skill for your claude.ai account.
* For cloud sessions, you can instead commit the skill to the repository's `.claude/skills/`, or ship it in a plugin declared in the repository's `.claude/settings.json`.

Desktop scheduled tasks are different: they run locally on your machine and load skills from the same locations as any other local session.

### Skills synced from claude.ai

If you enabled skills for your claude.ai account, in Cowork and cloud sessions Claude Code loads those skills without any setup on your machine. In any other (local CLI) session, Claude Code loads them only after you turn syncing on with `CLAUDE_CODE_SYNC_SKILLS` in a non-interactive run:

```bash
CLAUDE_CODE_SYNC_SKILLS=1 claude -p "List the skills you have available"
```

Claude Code downloads the skills into `~/.claude/skills/synced/`.

### How Claude Code handles the body of a synced skill (Cowork-specific behavior)

* In a cloud session, the body keeps the behavior a local skill has, because the session runs in an isolated container.
* **In a Cowork session on your desktop, the body keeps the behavior a local skill has, EXCEPT that Claude Code replaces every `!` command line with the `disableSkillShellExecution` placeholder**, as it does for every skill supplied there. This means shell-command dynamic context injection (the `` !`command` `` syntax) does not execute in Cowork the way it does in local Claude Code sessions.
* In any other session on your machine (without sync enabled), Claude Code doesn't run `!` commands, doesn't attach `@`-referenced files, and doesn't substitute `${CLAUDE_PROJECT_DIR}`/`${CLAUDE_SESSION_ID}` placeholders — they reach Claude as literal text.

## Configure skills

Skills are configured through YAML frontmatter at the top of `SKILL.md` and the markdown content that follows.

### Types of skill content

**Reference content** adds knowledge Claude applies to your current work (conventions, patterns, style guides).

**Task content** gives Claude step-by-step instructions for a specific action. Add `disable-model-invocation: true` to prevent Claude from triggering it automatically; `context: fork` runs the skill in its own subagent context.

```yaml
---
name: deploy
description: Deploy the application to production
context: fork
disable-model-invocation: true
---

Deploy the application:
1. Run the test suite
2. Build the application
3. Push to the deployment target
```

### Frontmatter reference (partial)

```yaml
---
name: my-skill
description: What this skill does
disable-model-invocation: true
allowed-tools: Read Grep
---

Your skill instructions here...
```

All fields are optional. Only `description` is recommended so Claude knows when to use the skill. Boolean fields accept `yes`, `no`, `on`, `off`, `1`, and `0` in any letter case, in addition to `true`/`false`.

## Slash command naming for skills (from the merged slash-commands page)

The command you type to invoke a skill comes from where the skill file lives and, for plugin skills, also from the frontmatter `name` field.

| Skill location | Command name source | Example |
| :------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| Skill directory under `~/.claude/skills/` or `.claude/skills/` | Directory name | `.claude/skills/deploy-staging/SKILL.md` → `/deploy-staging` |
| Nested `.claude/skills/` directory, when the name clashes with another skill | Subdirectory path relative to the working directory, then the skill directory name | `apps/web/.claude/skills/deploy/SKILL.md` → `/apps/web:deploy` |
| File under `.claude/commands/` | File name without extension | `.claude/commands/deploy.md` → `/deploy` |
| Plugin `skills/` subdirectory | Frontmatter `name` or the directory name, namespaced by plugin | `my-plugin/skills/review/SKILL.md` → `/my-plugin:review`, or `/my-plugin:fancy` with `name: fancy` |
| Plugin root `SKILL.md` | Frontmatter `name`, with the plugin directory name as a fallback | `my-plugin/SKILL.md` with `name: review` → `/my-plugin:review` |
