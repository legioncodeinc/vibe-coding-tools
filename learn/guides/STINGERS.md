# Stingers: reusable playbooks

A Stinger is a skill that carries a repeatable procedure, examples, templates, scripts, and research references for one kind of work. It answers **how should this task be done consistently?** Most specialist Stingers are paired with a [Drone](DRONES.md). A few, such as the Pest Controller Suit and Get Started, coordinate work directly rather than representing one specialist.

## Open the small entry point first

Each Stinger begins with `SKILL.md`. Its name and description tell the harness when the skill applies, and its body routes the agent to the guide needed for the current verb. The deeper files stay in focused folders:

| Folder | What belongs there |
| --- | --- |
| `guides/` | Procedures for distinct actions. |
| `examples/` | Finished examples worth inspecting or adapting. |
| `templates/` | Starting files whose placeholders must be resolved. |
| `references/` | Field tables, research distillations, and factual background. |
| `scripts/` | Deterministic checks or transformations the skill needs. |

This is progressive disclosure. A request about recovering a deleted branch should load the [Git Stinger](../../plugins/wasp-nest-core/skills/git-stinger/SKILL.md) and its recovery guide, not every Git research file. A Stinger whose root file dumps all research into the initial context makes both routing and verification harder.

## Skill versus prompt versus command

A **prompt** asks for one outcome in one conversation. A **Stinger** preserves a method that should work across conversations and repositories. A **command** names a larger repeatable job, such as Pest Controller routing or Smoke It PRD execution, and may use several Drones and Stingers. A **rule** applies whether anyone invokes a Stinger; a **hook** reacts to a supported event. [Components](COMPONENTS.md) gives the short comparison and [Commands](COMMANDS.md) covers the orchestration layer.

Create or request a Stinger when a task repeats, has safety boundaries, needs examples, or should be handed to a specialist. Do not create one for a single opinion, a tiny project-specific instruction, or a fact that belongs in the project's Library.

## What makes a Stinger usable

A good Stinger states when it triggers and when it does not. It names inputs, an ordered procedure, output, evidence, and stop conditions. A skill for Git history repair should show the recovery path before a destructive command. A skill for a provider API should not claim that an unavailable credential or external state has been verified. When the procedure crosses Claude Code, Codex, Cursor, or Cowork, it marks the steps that differ by harness rather than pretending the file layouts are identical.

Use obviously illustrative values in examples. A placeholder such as `<SERVICE_TOKEN>` is clearer and safer than a fake credential shaped like a real key. The [Security and Secrets guide](SECURITY-AND-SECRETS.md) explains the boundary. Bundled plugin skills keep their distilled, cited research but omit raw archives from the public release.

## Find and improve one

The [complete catalog](../reference/PLUGIN-CATALOG.md) links every installed Stinger by pack. Start with the pack README and its `SKILL.md`; follow only the guides it routes to. To request a correction, [open an issue](https://github.com/legioncodeinc/vibe-coding-tools/issues) with the trigger phrase, the behavior you saw, and the expected result. Maintainers edit the private source and publish a reviewed release, not a generated public copy.
