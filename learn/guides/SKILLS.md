# Skills: reusable playbooks for AI work

A skill is a folder that teaches an AI assistant how to perform a repeatable kind of work. Think of a good recipe book. The title helps you find the right recipe, the main page gives the order of operations, and supporting pages explain techniques, examples, and ingredients.

Vibe Coding Tools calls skills **Stingers**. Most Stingers are paired with one specialist Bee.

## What a skill contains

Every skill starts with `SKILL.md`:

```markdown
---
name: security-stinger
description: Review authorized code for secret exposure, unsafe trust boundaries, and security regressions.
---

# Security Stinger
...
```

Optional supporting folders include:

- `guides/` for detailed procedures.
- `examples/` for finished examples worth copying.
- `templates/` for starting files.
- `references/` for facts, research, and validation scripts.
- `scripts/` for repeatable mechanical work.
- `assets/` for files the skill needs.

The main file should route the assistant to only the supporting material needed for the current task. Loading everything wastes context and makes instructions harder to follow.

## What makes a skill portable?

A portable skill does not pretend every harness has the same features. It keeps its core workflow in ordinary Markdown, uses relative paths, and clearly marks tool-specific steps.

| Harness | Skill location in this repository |
|---|---|
| Claude Code | `.claude/skills/<name>/SKILL.md` |
| Cursor | `.cursor/skills/<name>/SKILL.md` |
| Codex plugin | `.codex/plugins/vibe-coding-tools/skills/<name>/SKILL.md` |

The 80 source Stingers are portable. Codex also packages the two command behaviors as skills, for 82 plugin skills total.

## Skill versus prompt

A prompt is one request in one conversation. A skill is durable team knowledge. Create a skill when the procedure is repeated, needs safety rules, uses templates, or should behave consistently across repositories.

Do not create a skill for a one-time opinion or a tiny instruction that belongs in normal project guidance.

## Writing a strong skill

1. Give it a specific outcome.
2. Write a description with realistic trigger phrases and exclusions.
3. Put the required sequence and safety rules in `SKILL.md`.
4. Move deep explanations into focused guides.
5. Use examples that are clearly fake and cannot match secret scanners.
6. Prefer scripts for repeatable mechanical validation.
7. State required inputs, outputs, and stop conditions.
8. Test the skill on a realistic request and a request it should refuse or reroute.

## Secret-safe examples

Never make a fake credential look structurally real. A scanner does not know your intention. Use labels such as `<DOPPLER_SERVICE_TOKEN>`, `<STRIPE_TEST_KEY>`, and `<WORKOS_API_KEY>`. Do not reuse real prefixes plus realistic random bodies.

## Changing a skill

Edit the canonical `.claude/skills/` source, run `python learn/scripts/generate-harnesses.py`, inspect every generated mirror, validate links and metadata, then run security before quality. Do not hand-edit a generated copy and forget the source.

See [Asset Catalog](../ASSET-CATALOG.md) for the live inventory.
