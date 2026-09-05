# Guide 04: Prompt and Context Discipline: Per-Tool Best Practices

*Sources: `research/external/2026-05-20-claude-code-best-practices.md`, `research/external/2026-05-20-aider-llm-leaderboard.md`, `research/external/2026-05-20-bolt-new-webcontainer.md`*

---

## Principle: Context quality > context quantity

Every tool's performance degrades when context is bloated or poorly structured. The discipline patterns below apply across tools:
1. Include only what the model needs for the current task
2. Use structured files (CLAUDE.md, .aider.conf.yml, Cursor rules) rather than repeating context in every prompt
3. Rotate context out when a task is complete; fresh context is cheaper than carrying stale state

---

## Claude Code: CLAUDE.md and the Explore-Plan-Code workflow

### CLAUDE.md structure

`CLAUDE.md` is a Markdown file in the project root that Claude Code loads automatically on startup. It is the single most impactful configuration for Claude Code quality.

**Canonical CLAUDE.md sections:**

```markdown
# Project Overview
<One paragraph: what this project does, primary language/framework, deployment target>

# Architecture
<Key directories and their roles. No more than 10 lines.>

# Development Commands
<Exact commands to build, test, lint, run dev server. Must be copy-paste runnable.>

# Coding Conventions
<Naming conventions, file structure rules, style guide references.>

# Do Not Touch
<Files or patterns Claude should not modify without explicit instruction.>

# Current Task Context
<Optional: cleared after each session. What the human is currently working on.>
```

Keep CLAUDE.md under 150 lines. Longer files dilute the signal; Claude reads the whole file on every interaction.

Source: `research/external/2026-05-20-claude-code-best-practices.md`

### Explore-Plan-Code workflow

The recommended three-phase loop for complex tasks with Claude Code:

1. **Explore:** Ask Claude to read and summarize relevant files without making changes. "Read `src/auth/` and tell me how session tokens are created."
2. **Plan:** Ask Claude to produce a numbered change plan in text only. "Write out the steps you'd take to add OAuth support, without writing code yet."
3. **Code:** Execute the plan step by step, reviewing each step before proceeding.

This prevents Claude from diving into code changes before understanding the full context and reduces costly wrong-direction explorations.

---

## Aider: `.aider.conf.yml` reference

Aider reads configuration from `.aider.conf.yml` in the project root (project-level) or `~/.aider.conf.yml` (global/user-level). Project-level overrides global.

### Minimal production config

```yaml
# Model routing
model: claude-opus-4-5            # Architect model (or gpt-5.2, deepseek/r1)
editor-model: deepseek/deepseek-chat  # Editor model (cheap + fast)

# Git integration
auto-commits: true      # Commit each accepted change
dirty-commits: false    # Don't commit if working tree is dirty

# Context management
read:                   # Additional files always in context
  - ARCHITECTURE.md
  - docs/api-contracts.md

# Safety
show-diffs: true        # Always show diffs before applying
```

Source: `research/external/2026-05-20-aider-llm-leaderboard.md`

### Context discipline for Aider

- Use `/add <file>` to explicitly add only the files needed for the current task
- Use `/drop <file>` to remove files from context when done with them
- Aider's `read:` config option (above) is for always-in-context reference files (ARCHITECTURE.md, API contracts), not task-specific files
- Keep context under ~100k tokens to avoid quality degradation from context-window saturation

### Prompt patterns for Aider

- Prefer precise instructions: "In `src/users/service.py`, add a `deactivate_user(user_id: int)` method that sets `user.active = False` and emits a `user.deactivated` event."
- Avoid vague instructions: "Improve the user service." Aider will pick something; it may not be what you want.
- Use `/ask` for questions that don't require code changes: `/ask Why is the deactivate_user method not emitting events?`

---

## Cursor: `.cursor/rules/` and `.cursorrules`

> **Scope note:** Deep Cursor configuration (rules, MCP servers, Cloud Agents) belongs to `cursor-ide-worker-bee`. The summary below is for quick reference; defer to that Bee for full configuration guidance.

Cursor reads project-level rules from `.cursor/rules/*.mdc` files (new format, 2025+) or `.cursorrules` (legacy). Key rule categories:

- **Always-active rules:** Loaded for every interaction (keep these short and high-signal)
- **Auto-attached rules:** Loaded when specific file globs are matched
- **Agent-requested rules:** Loaded when the agent determines they're relevant

Good rule: "When writing TypeScript, always use explicit return types on exported functions."
Bad rule: "Be helpful and accurate." (Too vague; no behavioral constraint.)

For full rule authoring guidance, see `cursor-ide-worker-bee`.

---

## Cline: System prompt configuration

Cline can be configured with a custom system prompt via VS Code settings. Key patterns:

- Include project architecture overview in the system prompt (same principle as CLAUDE.md)
- Specify the file editing strategy: "Prefer `write_to_file` over `replace_in_file` for files over 500 lines" (mitigates the file editing reliability footgun; see `guides/05-footguns.md`)
- Set explicit context window limits: "Do not load more than 50 files into context at once"

---

## Windsurf (Cascade): Workspace rules

Windsurf supports workspace-level rules similar to Cursor's `.cursorrules`. Keep them under 50 lines. Include project conventions and explicit "do not touch" patterns.

> **Freshness flag:** Windsurf's rule system may have changed under Cognition AI ownership post-December 2025. Verify current behavior in Windsurf docs before advising.

---

## Bolt.new: Prompt engineering for rapid scaffold

Bolt generates an entire project from a single prompt. The prompt quality determines the scaffold quality.

**High-quality Bolt prompt structure:**

```
Build a <type of app> using <tech stack>.

Key features:
- <Feature 1>
- <Feature 2>
- <Feature 3>

Constraints:
- Use <framework/library> for <component>
- Do NOT include <something> — I'll add it later
- Keep <file/module> under <size>
```

**After scaffold:** Bolt is not the right tool for incremental feature work on a complex codebase. If the scaffold is sound, move the code to a proper IDE tool (Cursor, Claude Code, Aider) for ongoing development. See `guides/05-footguns.md` for Bolt WebContainer limits.

Source: `research/external/2026-05-20-bolt-new-webcontainer.md`

---

## Examples

- `examples/happy-path-selection.md`: shows CLAUDE.md structure for a TypeScript monorepo scenario
- `examples/cost-constrained-workflow.md`: shows `.aider.conf.yml` for architect/editor cost optimization
