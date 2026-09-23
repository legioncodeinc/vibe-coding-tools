# Guide 05: The `.cursor/` Colony Layout

How the colony is structured inside `.cursor/`, and the conventions that keep it working in Cursor.

## The colony is a `.cursor/` construct

The colony lives entirely under `.cursor/` and is read by Cursor's native machinery:

```text
.cursor/
+- rules/                       Cursor project rules (.mdc with frontmatter)
|  +- no-em-dashes.mdc
|  +- plan-construction-protocol.mdc
|  +- respect-agent-work-boundaries.mdc
+- agents/                      one Markdown file per Drone (subagent)
|  +- <base>-wasp-drone.md
|  +- ... (cursor-ide, harness-integration, security, quality, etc.)
+- skills/                      one folder per Stinger + the orchestrator skills
|  +- <base>-stinger/           the Drone's paired arsenal (SKILL.md + guides/examples/templates/research)
|  +- pest-controller-suit/           the routing roster skill
|  +- hive-registrar/           registration skill
+- commands/                    slash commands the user types
|  +- the-pest-controller.md          route a task through the roster, dispatch armed Drones
|  +- the-smoker.md             drive PRDs to 100% completion in waves
+- model-comparison-matrix.md   scored model-routing rubric used when dispatching Drones
```

## The pairing convention

Every Drone is `<base>-wasp-drone` and pairs with exactly one Stinger `<base>-stinger`:

- The **Drone** (`.claude/agents/<base>-wasp-drone.md`) is persona + guardrails: identity, procedure, critical directives, escalation, and Read-references into its Stinger.
- The **Stinger** (`.claude/skills/<base>-stinger/`) is the procedural arsenal: a `SKILL.md` master index plus `guides/`, `examples/`, `templates/`, and `research/`.

This stinger pairs with `cursor-ide-wasp-drone`. When you author or edit a Drone/Stinger, keep the names in lockstep and keep the Drone's Read-references pointing at real files in its Stinger.

## Rules

Cursor reads `.cursor/rules/*.mdc` as project rules. Frontmatter (`description` / `globs` / `alwaysApply`) selects the activation mode (see `guides/02`). The three live rules are colony-wide guardrails: the em-dash ban, the plan-construction protocol, and the work-boundary rule that keeps each Drone inside its assigned scope.

## Commands and orchestration

Two slash commands drive the colony:

- **`/the-pest-controller`** routes a task through the `pest-controller-suit` roster and dispatches the right Drone(s), each ARMED with its paired Stinger before it starts. Independent Drones run in parallel in one wave; dependent Drones run in sequence after their dependency is verified.
- **`/the-smoker`** takes a set of PRDs and drives every acceptance criterion to verified completion in waves, tracked in an execution ledger.

Both close out every implementation task with **`security-wasp-drone` first, then `quality-wasp-drone`** (never quality before security; a security fix can invalidate the QA result). Both pick a model per Drone using `.cursor/model-comparison-matrix.md`.

## The model-comparison-matrix

`.cursor/model-comparison-matrix.md` is a scored rubric (1-10 across reasoning, code quality, tool use, cost, speed, context, etc.) for routing each Drone to the best spawnable model. The orchestrator commands consult it when building a wave plan. It is reference data, not a rule; refresh it when the spawnable model slugs change.

## When editing the layout

- Keep `<base>-wasp-drone` and `<base>-stinger` names matched.
- A new Drone needs: the agent file, the Stinger folder, a roster entry in `pest-controller-suit`, and (per the colony's process) registration via `hive-registrar`.
- Do not rename or substitute the Cursor-specific skill/agent/command names the orchestrators reference; they are matched by exact `name:` frontmatter.
- Author all of it without em dashes.
