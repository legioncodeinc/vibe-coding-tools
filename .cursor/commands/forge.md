---
description: Run queen-bee-stinger's seven-stage forge pipeline end to end for a brand-new Hive component, starting with mandatory topic elicitation before any work begins. Trigger with "forge a new stinger", "build a new bee", "we need a new command for X", "create a skill for Y", "make a new rule for Z".
argument-hint: [component idea]
---

# /forge - Seven-Stage Component Forge

A component that skips stage one is a guess wearing a skill's clothes. You are running queen-bee-stinger's forge, start to finish, and you do not touch real work until the topic is locked.

## Mandatory process

1. Load `.cursor/skills/beekeeper-suit/SKILL.md` (the roster) and consult it before any routing decision. This is the first step, always, no exceptions. Check whether the need already has a Bee; forging a duplicate is a bug, not a component.
2. Load `.cursor/skills/queen-bee-stinger/SKILL.md` in full. This command runs its pipeline; you do not improvise a shortcut version of it.
3. **Topic (stage 1).** Before any other work, ask the user, in one batch or one at a time:
   - What does this component do?
   - When does it trigger?
   - Which of the five component types is it: a Rule, a Beekeeper Tool (command), a Bee (agent), a Stinger (skill), or a Plugin?
   - Which harnesses must it reach: Claude Code, Cursor, ChatGPT Codex, Claude Cowork, or all four?
   - Is it development-focused (the Ship Gate applies to it) or research-only?
   Do not move to stage 2 until every question has a real answer. A vague answer gets a follow-up question, not a guess. Artifact: a locked topic statement you can quote back to the user.
4. **Research (stage 2).** Run a fresh sweep of primary sources for the component's domain, spanning the 6 months before today by default, never past 12 without the user's explicit consent. Official docs outrank vendor blogs outrank community posts. Archive each source as its own file under the new component's `references/research/raw/`, headed with URL, fetch date, and source type. If the component is a Stinger or Bee that only needs harness-format facts, reuse queen-bee-stinger's own `references/research/` instead of re-running that part. Artifact: the raw archive.
5. **Distillation (stage 3).** Re-ingest the raw archive fresh and write a distilled article into the component's `references/research/`: dense, tabular where it helps, every claim citing its raw file. State conflicts as conflicts and thin coverage as thin coverage; never smooth a gap into a guess. Artifact: the distilled article.
6. **References (stage 4).** Build field tables, worked examples, templates, and any deterministic scripts the component needs at runtime, all pulled from the distillation. This is the material the component loads on demand, so it earns its tokens or it does not belong. Artifact: the `references/` folder.
7. **Guides (stage 5).** Write one focused guide per major verb the component performs, each grounded in the distillation and citing its raw files. For anything crossing harnesses, consult `guides/harness-support-matrix.md` and `guides/per-type-per-harness-specific-guide.md`; never author a harness surface from memory. Artifact: the `guides/*.md` files.
8. **Skill file (stage 6).** Author the root file last, starting from `references/templates/<type>/`. Keep it lean with pointers into the guides and references, spec-six frontmatter if it crosses harnesses, the Critical Directive at the end, and the Ship Gate block if stage 1 called this component development-focused. Then validate: `python references/scripts/per-type-validation.py <path> --type <type> --harness all`, the Cowork packager if it targets Cowork, and an independent pass that samples claims against the raw archive. Fix every error before moving on. Artifact: the root file, validated clean.
9. **Register (stage 7).** If the component is a Stinger or a Bee, pair it with its counterpart and run the `/register` checklist against the pair. Every component type also gets its repo references synced per `guides/vibe-coding-tools-reference-update.md`. Artifact: the roster row, the guide, the cross-links, and the harness deployment.
10. Report back what landed at each stage: the locked topic, the raw source count, where the distillation lives, what references and guides were written, the validation result, and the registration outcome. Anything you could not ground in a real source, say so plainly instead of filling the gap.

## Arguments

`$ARGUMENTS` (or a short `$1` label) can carry an initial component idea, for example `/forge a Slack digest stinger`. Treat it as a starting point for stage 1's questions, not a substitute for asking them. If no argument was given, open stage 1 with a blank slate and ask all five questions anyway.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
