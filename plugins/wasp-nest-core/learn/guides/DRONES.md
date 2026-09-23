# Drones: focused AI teammates

A Drone is a specialist agent with one bounded responsibility. It answers **who owns this part of the work?** The paired [Stinger](STINGERS.md) answers **how should that specialist do it?** Naming both keeps a general assistant from switching roles silently or treating a brief prompt as a complete procedure.

## Why a focused Drone helps

Suppose a release touches an API, an authentication flow, and its docs. One assistant could try to own all three at once, but the risks and evidence differ. Pest Controller can route each bounded part to the appropriate Drone, identify shared dependencies, and ask for a separate verification pass. The parent remains responsible for combining results and reporting what is proven.

| Benefit | What changes in practice |
| --- | --- |
| Routing | A domain specialist receives a request whose trigger matches its description. |
| Boundaries | The Drone names nearby work it does **not** own. |
| Context | It reads its paired Stinger before acting instead of loading the whole Nest. |
| Review | A different pass can check the work against requirements and evidence. |

The [Git Drone](../../agents/git-wasp-drone.md), for example, owns history, recovery, conflicts, and worktrees. It does not own CI pipelines or credential rotation. Its [Git Stinger](../../skills/git-stinger/SKILL.md) gives the recovery and safety procedures. That positive-and-negative description is more useful than a vague "Git expert" label.

## What a Drone file contains

A Drone's Markdown file identifies it in frontmatter, then records its responsibility, exclusions, paired Stinger, procedure, safety boundaries, and handoffs. A small illustration looks like this:

```markdown
---
name: "example-wasp-drone"
description: "Owns one named domain. Invoke for its specific tasks. Does not own a neighboring domain."
---

# Example Wasp Drone

Read `../skills/example-stinger/SKILL.md` before work.
Confirm scope, produce the requested artifact, and report the check that proves it.
```

This illustration is not an installable Drone. Use the [catalog](../reference/PLUGIN-CATALOG.md) for real names and files. The build adapts agents to each harness's supported format; a Claude agent file is not copied verbatim into a Codex TOML agent. [Harness capabilities](../reference/HARNESS-CAPABILITIES.md) describes those differences.

## Give a Drone a useful handoff

A good dispatch names the outcome, owned files or surfaces, exclusions, whether edits are allowed, the contract revision if one applies, required checks, and the point where the Drone must stop for a decision. For example:

```text
Ask the Git Drone to inspect the failed rebase without changing history. It may read the current branch and reflog. I need the recovery options, the safest next command, and evidence of which commits still exist. Stop before any reset or force push.
```

For parallel provider and consumer work, give both sides the same accepted `CTR-###` revision and separate file ownership. [Contract Writing](WRITE-A-CTR.md) explains why a Draft record is not enough. Do not dispatch two Drones to edit the same file at once.

## Add a specialist without creating a duplicate

The public marketplace cannot be edited in place; it is generated. For a new domain, first check the [catalog](../reference/PLUGIN-CATALOG.md) and [Pest Controller roster](../../skills/pest-controller-suit/SKILL.md). The maintainers use the Queen Wasp `/forge` workflow to define, research, and validate a new component, then `/register` to pair and route it. [Open a public issue](https://github.com/legioncodeinc/vibe-coding-tools/issues) with the missing task and the nearest existing Drone if you want one added.
