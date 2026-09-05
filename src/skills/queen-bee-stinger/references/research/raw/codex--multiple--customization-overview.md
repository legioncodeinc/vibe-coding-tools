# Customization – Codex | OpenAI Developers
- URL: https://developers.openai.com/codex/concepts/customization
- Fetched: 2026-08-14
- Source type: official-docs
- Component: multiple

Customization is how you make Codex work the way your team works.

In Codex, customization comes from a few layers that work together:

- Project guidance (`AGENTS.md`) for persistent instructions
- Memories for useful context learned from prior work
- Skills for reusable workflows and domain expertise
- MCP for access to external tools and shared systems
- Subagents for delegating work to specialized subagents

These are complementary, not competing. `AGENTS.md` shapes behavior, memories carry local context forward, skills package repeatable processes, and MCP connects Codex to systems outside the local workspace.

## AGENTS Guidance

`AGENTS.md` gives Codex durable project guidance that travels with your repository and applies before the agent starts work. Keep it small.

Use it for the rules you want Codex to follow every time in a repo, such as:

- Build and test commands
- Review expectations
- Repo-specific conventions
- Directory-specific instructions

When the agent makes incorrect assumptions about your codebase, correct them in `AGENTS.md` and ask the agent to update `AGENTS.md` so the fix persists. Treat it as a feedback loop.

Updating `AGENTS.md`: Start with only the instructions that matter. Codify recurring review feedback, put guidance in the closest directory where it applies, and tell the agent to update `AGENTS.md` when you correct something so future sessions inherit the fix.

### When to update `AGENTS.md`

- Repeated mistakes: If the agent makes the same mistake repeatedly, add a rule.
- Too much reading: If it finds the right files but reads too many documents, add routing guidance (which directories/files to prioritize).
- Recurring PR feedback: If you leave the same feedback more than once, codify it.
- In GitHub: In a pull request comment, tag `@codex` with a request (e.g. `@codex add this to AGENTS.md`) to delegate the update to a cloud chat.
- Automate drift checks: Use scheduled tasks to run recurring checks (e.g. daily) that look for guidance gaps and suggest what to add to `AGENTS.md`.

Pair `AGENTS.md` with infrastructure that enforces those rules: pre-commit hooks, linters, and type checkers catch issues before you see them.

Codex can load guidance from multiple locations: a global file in your Codex home directory (for you as a developer) and repo-specific files that teams can check in. Files closer to the working directory take precedence. Use the global file to shape how Codex communicates with you (review style, verbosity, defaults); keep repo files focused on team and codebase rules.

## Skills

Skills give Codex reusable capabilities for repeatable workflows. Skills are often the best fit for reusable workflows because they support richer instructions, scripts, and references while staying reusable across tasks. Skills are loaded and visible to the agent (at least their metadata), so Codex can discover and choose them implicitly. This keeps rich workflows available without bloating context up front.

Use skill folders to author and iterate on workflows locally. If a plugin already exists for the workflow, install it first to reuse a proven setup. When you want to distribute your own workflow across teams or bundle it with connectors, package it as a plugin. Skills remain the authoring format; plugins are the installable distribution unit.

A skill is typically a `SKILL.md` file plus optional scripts, references, and assets. The skill directory can include a `scripts/` folder with CLI scripts that Codex invokes as part of the workflow (e.g. seed data or run validations). When the workflow needs external systems (issue trackers, design tools, docs servers), pair the skill with MCP.

Example `SKILL.md`:

```md
---
name: commit
description: Stage and commit changes in semantic groups. Use when the user wants to commit, organize commits, or clean up a branch before pushing.
---

1. Do not run `git add .`. Stage files in logical groups by purpose.
2. Group into separate commits: feat → test → docs → refactor → chore.
3. Write concise commit messages that match the change scope.
4. Keep each commit focused and reviewable.
```

Use skills for: repeatable workflows (release steps, review routines, docs updates); team-specific expertise; procedures that need examples, references, or helper scripts.

Skills can be global (user directory) or repo-specific (checked into `.agents/skills`).

| Layer | Global | Repo |
| --- | --- | --- |
| AGENTS | `~/.codex/AGENTS.md` | `AGENTS.md` in repo root or nested directories |
| Skills | `~/.agents/skills` | `.agents/skills` in repo |

Codex uses progressive disclosure for skills: starts with metadata (`name`, `description`) for discovery; loads `SKILL.md` only when a skill is chosen; reads references or runs scripts only when needed.

Skills can be invoked explicitly, and Codex can also choose them implicitly when the task matches the skill description. Clear skill descriptions improve triggering reliability.

## MCP

MCP (Model Context Protocol) is the standard way to connect Codex to external tools and context providers. Especially useful for remotely hosted systems such as Figma, Linear, GitHub, or internal knowledge services your team depends on.

Use MCP when Codex needs capabilities that live outside the local repo, such as issue trackers, design tools, browsers, or shared documentation systems.

Mental model:
- Host: Codex
- Client: the MCP connection inside Codex
- Server: the external tool or context provider

MCP servers can expose: Tools (actions), Resources (readable data), Prompts (reusable prompt templates). This separation helps reason about trust and capability boundaries — some servers mainly provide context, others expose powerful actions.

MCP is often most useful when paired with skills: a skill defines the workflow and names the MCP tools to use.

## Subagents

You can create different agents with different roles and prompt them to use tools differently. For example, one agent might run specific testing commands and configurations, while another has MCP servers that fetch production logs for debugging. Each subagent stays focused and uses the right tools for its job.

## Skills + MCP together

Skills plus MCP is where it all comes together: skills define repeatable workflows, and MCP connects them to external tools and systems. If a skill depends on MCP, declare that dependency in `agents/openai.yaml` so Codex can install and wire it automatically.

## Next step (recommended build order)

1. Custom instructions with `AGENTS.md` so Codex follows your repo conventions. Add pre-commit hooks and linters to enforce those rules.
2. Install a plugin when a reusable workflow already exists. Otherwise, create a skill and package it as a plugin when you want to share it.
3. MCP when workflows need external systems (Linear, GitHub, docs servers, design tools).
4. Subagents when you're ready to delegate noisy or specialized tasks to subagents.
