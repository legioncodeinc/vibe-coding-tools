# Agents: focused AI teammates

An agent is an AI teammate with a narrow job, a clear identity, and boundaries. Think of a school project: one person researches, one draws the poster, one checks facts, and one presents. A focused role helps each person know what to do and what to leave alone.

Vibe Coding Tools calls its agents **Bees**. There are 77. Each domain Bee has exactly one matching skill, called a **Stinger**. The Bee supplies judgment and responsibility. The Stinger supplies the detailed procedure, examples, and reference material.

## Why use focused agents?

A single general assistant can attempt every task, but it must keep switching roles. Focused agents make four things clearer:

- **Routing:** The right specialist receives the request.
- **Boundaries:** The specialist knows what it does not own.
- **Context:** It loads only the guidance needed for its job.
- **Review:** You can ask an independent specialist to inspect the result.

Examples include `git-worker-bee`, `security-worker-bee`, `quality-worker-bee`, `auth-worker-bee`, and `readme-writing-worker-bee`.

## Anatomy of a Bee

A Claude or Cursor agent is a Markdown file with small routing metadata followed by its instructions:

```markdown
---
name: git-worker-bee
description: Git specialist for history, recovery, branches, conflicts, and repository workflows.
---

# Git Worker Bee

## Identity and responsibility
...
```

The `name` is the stable handle. The `description` tells the orchestrator when to use the agent. The body defines responsibilities, exclusions, required reading, procedure, safety checks, and the expected result.

A description should include positive and negative routing. "Owns Git" is too broad. "Owns Git history, recovery, branches, and conflicts; does not own CI pipelines or credential rotation" is much safer.

## Pairing with a Stinger

Each domain Bee points to a matching skill:

```text
git-worker-bee -> git-stinger
security-worker-bee -> security-stinger
quality-worker-bee -> quality-stinger
```

The three unpaired utility skills coordinate the system rather than represent a domain specialist:

- `beekeeper-suit` routes requests.
- `get-started-stinger` initializes a repository.
- `queen-bee-stinger` creates and validates new Bees and Stingers.

## Cross-harness formats

| Harness | Agent format |
|---|---|
| Claude Code | `.claude/agents/*.md` |
| Cursor | `.cursor/agents/*.md` |
| Codex | `.codex/agents/*.toml` |

Codex TOML files contain `name`, `description`, and `developer_instructions`. They preserve the Bee's full instructions in Codex's supported project-agent format. The generator creates all 77 from the canonical Claude sources.

## Safe delegation

Delegate work that is independent and clearly bounded. A good handoff names:

- The exact outcome.
- Files or directories the agent owns.
- Files it must not touch.
- Whether it may edit or only inspect.
- Required evidence.
- The point where it must stop and ask.

Do not have several agents edit the same file at once. Do not use delegation to hide uncertainty. The main agent remains responsible for combining results, resolving contradictions, and reporting what is actually proven.

## Adding an agent

1. Confirm an existing Bee does not already own the domain.
2. Define one narrow responsibility and explicit exclusions.
3. Create the matching Stinger first or as part of the same change.
4. Add the canonical Markdown agent under `.claude/agents/`.
5. Register the pair in `beekeeper-suit`.
6. Run `python learn/scripts/generate-harnesses.py`.
7. Verify the Claude, Cursor, and Codex versions preserve the same intent.
8. Test a positive trigger, a negative trigger, and a boundary case.
9. Run security, then quality.

The full live list is generated in [Asset Catalog](../ASSET-CATALOG.md).
