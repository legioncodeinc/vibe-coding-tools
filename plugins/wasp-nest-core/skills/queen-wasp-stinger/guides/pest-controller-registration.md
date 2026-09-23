# Pest Controller registration

How a newly forged Drone and Stinger pair becomes a working member of the colony. Forging without registering leaves a component the orchestrator can never find; registration is part of the build, not an afterthought.

## Naming convention

The pair shares a base name: `<base>-wasp-drone` for the Drone, `<base>-stinger` for the Stinger. Examples: `payments-wasp-drone` and `payments-stinger`; `dependency-audit-wasp-drone` and `dependency-audit-stinger`. The base is the domain, lowercase kebab-case, no harness names, no version suffixes in the name itself.

Skill folder names must exactly match the frontmatter `name` (a hard Cursor requirement, good hygiene everywhere). Drone `name` frontmatter uses lowercase letters and hyphens only, never a colon (reserved for plugin scoping in Claude Code).

## Registration checklist

Registration is the seventh and final stage of the forge pipeline (topic, research, distillation, references, guides, skill file, register); see the pipeline in queen-wasp-stinger's SKILL.md. Do not start this checklist on a pair that skipped the earlier stages: a Stinger with no domain research archive on disk is not ready to register.

Run this every time a new pair is forged. Also run it, minus the creation steps, when a pair's domain or triggers change.

1. **Forge the Stinger** through the full pipeline, landing it at `.claude/skills/<base>-stinger/` with its own `references/research/` (raw archive plus cited distillation) inside. The root file starts from `references/templates/skills/reference-template/`. Confirm the Critical Directive is the last section (followed by the Ship Gate for development-focused stingers), and its related-skills list links real siblings.
2. **Forge the Drone** from `references/templates/agents/reference-agents.md` into `.claude/agents/<base>-wasp-drone.md`. The agent Critical Directive at the top must name the paired Stinger with a working relative link.
3. **Add the roster row** in `pest-controller-suit/SKILL.md`: Drone name, one-line domain, trigger keywords, and a link to its guide. Keep the registered-count line accurate.
4. **Author the guide** at `pest-controller-suit/guides/<drone-name>.md` from `pest-controller-suit/templates/guide-template.md`. The two sections that matter most are "Trigger phrases" and "Do NOT route when": the negative section is what disambiguates near-overlapping Drones.
5. **Wire the sequences.** If the new Drone joins an existing multi-Drone sequence (plan execution loop, release flow, schema-touching flow) or starts a new one, update the Multi-Drone orchestration section of pest-controller-suit.
6. **Cross-link the relatives.** Add the new Stinger to the related-skills lists of its closest sibling Stingers and Drones, and add those siblings to the new pair's lists. Relatedness means "commonly used in concert on a focused group of actions", not "same repo".
7. **Deploy to the other harnesses** per [per-type-per-harness-specific-guide.md](per-type-per-harness-specific-guide.md): Cursor picks up `.claude/agents/` and `.claude/skills/` through its fallback reads, so mirroring into `.cursor/` is only needed when you want Cursor-specific fields; Codex gets the Stinger via `.agents/skills/` or the plugin layer and the Drone as an `agents.<role>` config entry; Cowork gets both through the plugin build.
8. **Validate.** `python references/scripts/per-type-validation.py <path> --type skill --harness all` and the same with `--type agent`. Zero errors before the pair is announced.
9. **Update repo references** per [vibe-coding-tools-reference-update.md](vibe-coding-tools-reference-update.md).

## The arming contract

Registration exists so dispatch works. The canonical dispatch, defined in pest-controller-suit and repeated here because it is the reason the pairing law exists:

- Spawn at top level. Do not nest subagent spawns.
- The spawn prompt begins with the arming line: you are `<drone-name>`, read your paired Stinger at `<skills-path>/<stinger-name>/SKILL.md` in full before doing anything else, then the scoped task, exact files in scope, definition of done, and how the work gets verified.
- A Drone dispatched without its Stinger loaded is a failed dispatch. Terminate and re-dispatch.
- Development-focused dispatches end with the Ship Gate: security-stinger, then quality-stinger, then the orchestrator loads github-repo-health-stinger itself, then user approval before commit and push.

## Orchestrator-level exemptions

`pest-controller-suit`, `queen-wasp-stinger`, and `get-started-stinger` are the only skills without corresponding Drones. They are wielded by the harness orchestrator directly. Do not create a Drone for any of them, and do not register a new orchestrator-level skill without deliberately extending this exemption list; three is the intended number as of `get-started-stinger`'s forge (2026-08-14). `get-started-stinger` initializes and hardens a repository to a healthy baseline (library/ docs, GitHub CI, README, .gitignore, and hardening files), which is a whole-repo bootstrap concern rather than a single domain a dispatched Drone would own, hence the exemption.

## Deregistration and replacement

When a pair is replaced (as stinger-forge was replaced by queen-wasp-stinger):

1. Remove or archive the old skill and agent files per the decision recorded for that change.
2. Delete the roster row and guide, or mark them superseded with a pointer to the successor.
3. Sweep every related-skills list and command that referenced the old names; stale links in Critical Directives send Drones to dead paths.
4. Note the replacement in the repo documentation per [vibe-coding-tools-reference-update.md](vibe-coding-tools-reference-update.md).
