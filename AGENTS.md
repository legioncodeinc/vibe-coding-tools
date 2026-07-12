# Agents

> What agents are, how they work, and how they map across Cursor, Claude Code, Codex, and Claude Cowork.

## What an agent is

An agent (also called a subagent) is a focused AI persona with a narrow job, its own instructions, and its own guardrails. Instead of one general assistant trying to do everything, you give each domain its own specialist. A primary orchestrator reads the request, decides which agent owns it, and hands the work off. The agent runs with a clean, purpose-built brief and returns its result.

In this repo, agents are called **Bees**. Each Bee owns exactly one domain (Git, auth, databases, SEO, payments, and so on) and is paired with exactly one **Stinger** (a skill, see [SKILLS.md](./SKILLS.md)). The Bee is the persona and the judgment. The Stinger is the procedural arsenal it reads from. Routing across the whole roster is handled by a skill called `beekeeper-suit`, which keeps an index of every Bee, its trigger phrases, and when NOT to use it.

The agents live in [`.cursor/agents/`](./.cursor/agents/) (and a mirror in [`.claude/agents/`](./.claude/agents/)).

## Anatomy of an agent file

An agent is a single Markdown file with YAML frontmatter on top and instructions below:

```markdown
---
name: git-worker-bee
description: When to use this agent and what it owns. The orchestrator reads
  this to decide routing, so it is specific about trigger phrases and scope.
proactive: true
---

# Git Worker Bee

Identity, responsibilities, hard rules, and the workflow the agent follows.
```

- **name** is the handle the orchestrator invokes.
- **description** is the routing contract. Good descriptions say what the agent does, the phrases that should trigger it, and what it explicitly does NOT handle.
- **proactive** (optional) marks an agent that may volunteer when it sees relevant work, versus one that only runs when explicitly called.

## How agents map across harnesses

| Harness | Where agents live | Notes |
|---|---|---|
| **Cursor** | `.cursor/agents/*.md` | Custom agents the Cursor orchestrator routes to. This is the source of truth in this repo. |
| **Claude Code** | `.claude/agents/*.md` | Subagents. Same Markdown + frontmatter shape, so the files port directly. Frontmatter may also carry `tools` and `model`. |
| **Codex** | globally generated `~/.codex/agents/*.toml` | `bee-army` translates each canonical Bee into a native Codex agent and installs its paired Stinger globally under `~/.agents/skills/`. |
| **Claude Cowork** | runs on the Claude Agent SDK | Cowork is built on the same engine as Claude Code, so it executes subagents through its Agent and Task tooling. Cowork's primary distributable unit is the skill, so most cross-harness sharing happens at the skill layer. |

The short version: agents are a first-class concept in Cursor, Claude Code, and Codex. Cursor and Claude share a Markdown format. Codex uses native TOML definitions generated from the same canonical Bee and pairs them with the same Stingers. Cowork leans on skills as the portable unit, while still running agent-style delegation under the hood.

Codex installation is global-only. The manager must never write `.codex/`, `.agents/`, or `AGENTS.md` into a user's project.

## The orchestration model in this repo

This is not a loose pile of agents. It is a factory with a chain of command:

- **beekeeper-suit** (`.cursor/skills/beekeeper-suit/`) is the router. It holds the roster and decides which Bee owns a request.
- **Bees** (`.cursor/agents/*-worker-bee.md` and a few specials) are the domain specialists.
- **Stingers** (`.cursor/skills/*-stinger/`) are the skills each Bee reads from.
- **The factory line** (`command-center`, `scripture-historian`, `stinger-forge`, `bee-creator`, `hive-registrar`) is how new Bee + Stinger pairs get created, researched, written, and registered. `the-queen` and the proposal step drive that queue.

To see every Bee and its paired Stinger with direct links, check the catalog in the main [README](./README.md).

## Related

- [SKILLS.md](./SKILLS.md) — the Stingers that Bees wield
- [HOOKS.md](./HOOKS.md) — event-driven automation
- [RULES.md](./RULES.md) — always-on guidance that constrains every agent
