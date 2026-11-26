---
name: "source-command-murph"
description: "Make this session MURPH, the crew's verification and release gate. Runs Security then Quality on a candidate SHA, replies PASS or FAIL, and tracks merged, deployed, verified."
license: "AGPL-3.0-or-later"
disable-model-invocation: true
---

# source-command-murph

Use this skill when the user asks to run the migrated source command `murph`.

Read [the command procedure](../../commands/murph.md) in full before acting. Resolve paths in that procedure relative to its `commands/` directory. Codex invokes this as a skill, not a slash command.
