---
description: Walk the beekeeper registration checklist for a finished Bee and Stinger pair, verifying naming and the Critical Directive blocks, adding the roster row, authoring the routing guide, cross-linking related skills, wiring multi-Bee sequences, validating, and regenerating harnesses. Trigger with "register this bee", "register the new stinger pair", "add X to the roster", "finish registering Y", "the pair is built, wire it in".
argument-hint: [base-name]
---

# /register - Beekeeper Registration Checklist

An unregistered Bee is a Bee the orchestrator can never find. Forging is only half the job; this command does the other half, the part that makes a new pair real to the colony.

## Mandatory process

1. Load `.cursor/skills/beekeeper-suit/SKILL.md` (the roster) and consult it before any routing decision. This is the first step, always, no exceptions. Confirm the base name from `$1`/`$ARGUMENTS` is not already a roster row; registering a duplicate is a naming bug.
2. **Verify the pair exists and is named correctly.** Confirm `.cursor/skills/<base>-stinger/SKILL.md` and `.cursor/agents/<base>-worker-bee.md` both exist, the folder name matches the frontmatter `name` in each, and the base is lowercase kebab-case with no harness name or version suffix baked in. If either file is missing, stop here and send the user to `/forge` instead; this command registers finished pairs, it does not build them.
3. **Confirm the Critical Directive blocks are present and verbatim.** The Stinger's block, at the end of its `SKILL.md`, must read all files in the skill, search further if that falls short, and list related skills. The Bee's block, at the top of its agent file, must name its paired Stinger with a working relative link, read all of it, search further if needed, and list related skills. Check the exact wording against `.cursor/skills/queen-bee-stinger/references/templates/agents/reference-agents.md` and the paired Stinger's own template, and fix any drift before moving on.
4. **Add the roster row** in `.cursor/skills/beekeeper-suit/SKILL.md`: Bee name, one-line domain summary, trigger keywords pulled from the Bee's own description, and the paired Stinger. Put it in the domain group table it fits best, and update the registered-count line at the bottom of the file to match.
5. **Author the guide** at `.cursor/skills/beekeeper-suit/guides/<base>-worker-bee.md`, starting from `beekeeper-suit/templates/guide-template.md`. "Trigger phrases" and "Do NOT route when" matter most; the second one is what keeps this Bee from colliding with its nearest neighbors in the roster.
6. **Cross-link the relatives.** Add the new Stinger to the related-skills lists of its closest sibling Stingers and Bees, and add those siblings back into the new pair's own lists. Relatedness means the two get used together on a focused set of tasks, not just that they live in the same repo.
7. **Wire multi-Bee sequences.** If this Bee slots into an existing sequence in beekeeper-suit's "Multi-Bee orchestration" section (a build, an auth flow, a release), add its step there. If it starts a new recurring pattern, add a new sequence entry, and close it with the Ship Gate like every other entry in that section.
8. **Validate both files.** Run `python .cursor/skills/queen-bee-stinger/references/scripts/per-type-validation.py .cursor/skills/<base>-stinger --type skill --harness all` and `python .cursor/skills/queen-bee-stinger/references/scripts/per-type-validation.py .cursor/agents/<base>-worker-bee.md --type agent --harness all`. Zero errors before you call the pair registered.
9. **Regenerate harnesses.** Run `python learn/scripts/generate-harnesses.py`, inspect what changed under `.cursor/` and `.codex/`, and validate those generated packages too.
10. Report back: the base name registered, the roster row and guide file paths, every sibling cross-linked, any multi-Bee sequence touched, and the validation result from steps 8 and 9.

## Arguments

`$1` (or `$ARGUMENTS`) is the shared base name of the pair, for example `payments` for `payments-worker-bee` and `payments-stinger`. If it is missing, ask for it before doing anything else; this command cannot guess which pair to register.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
