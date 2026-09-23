# The pieces of The Wasp Nest

The [public catalog](https://github.com/legioncodeinc/vibe-coding-tools#what-ships) lists the current packs, versions, and counts. Core is installed first; optional packs add more specific capabilities.

| Piece | What it does | Where to inspect it |
| --- | --- | --- |
| Drone | A specialist agent with a bounded responsibility. | [Core Drones](../../agents/) or a pack's `agents/`. |
| Stinger | A procedure, examples, guides, and research distillation. | [Core Stingers](../../skills/) or a pack's `skills/`. |
| Command | A named orchestration workflow in a supporting harness. | [Core commands](../../commands/). |
| Rule | Persistent operating guidance. | [Core rules](../../rules/). |
| Hook | A supported lifecycle check such as first-session onboarding. | [Core hooks](../../hooks/). |

Every specialist Drone has a paired Stinger that defines how it works. Standalone Stingers such as the Pest Controller Suit coordinate other work. If a task needs a pack you have not installed, install that pack rather than asking an absent Drone to act.

Read the dedicated guides for [Drones](DRONES.md), [Stingers](STINGERS.md), [commands](COMMANDS.md), [rules](RULES.md), and [hooks](HOOKS.md) when you need to choose, write, or debug one. This page is the map, not the whole handbook.

## Three workflows to know

- **Get Started** inventories a repository and offers home and Library setup with separate consent. See [Getting Started](GETTING-STARTED.md).
- **Pest Controller** selects a Drone, loads its paired Stinger, and routes a bounded task. When two tasks share an interface, it checks that their PRDs pin the same accepted CTR revision.
- **Smoke It** tracks a PRD's acceptance criteria, dispatches ready work, and verifies the implementation against its plan. See [Execute a PRD](PRD-EXECUTION.md).

Claude Code exposes plugin commands such as `/pest-controller` and `/smoke-it`. Codex and other harnesses may expose those flows as Stinger skills instead. [Harness Capabilities](../reference/HARNESS-CAPABILITIES.md) has the exact placement and limitations.

To propose a new Drone, Stinger, command, hook, or pack, [open an issue](https://github.com/legioncodeinc/vibe-coding-tools/issues). This public tree is generated from private source, so a direct edit here would be replaced by a future release.
