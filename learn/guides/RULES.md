# Rules: guidance that stays active

A rule records an operating boundary that should not depend on someone remembering to invoke a Stinger. It answers **what must remain true while work is done?** A hook may enforce a narrow mechanical part of a rule, but many rules require human judgment and cannot be reduced to a file-edit detector.

## The four core rule families

| Rule | Practical meaning |
| --- | --- |
| [No em dashes](../../plugins/wasp-nest-core/rules/no-em-dashes.md) | Use ordinary punctuation in newly authored prose. A dash-guard hook checks supported edits, with exceptions for literal data and verbatim sources. |
| [Plan construction protocol](../../plugins/wasp-nest-core/rules/plan-construction-protocol.md) | When a plan is requested, name its branch, task ownership, model choices, verification, and close-out. It is not permission to create a branch or dispatch agents without task authority. |
| [PR conflict check](../../plugins/wasp-nest-core/rules/pr-conflict-check.md) | Compare proposed work with the current target branch before declaring a PR ready. Resolve conflicts deliberately instead of discovering them after handoff. |
| [Respect agent work boundaries](../../plugins/wasp-nest-core/rules/respect-agent-work-boundaries.md) | Do not edit, move, or delete another active worker's files merely because they look unfamiliar or unfinished. |

The core carries equivalent forms where a harness requires a different rule format. [Harness capabilities](../reference/HARNESS-CAPABILITIES.md) explains the difference. The exact installed rule is the operational authority for that harness; this page teaches the intent, not a replacement rule set.

## Rule, hook, command, or Stinger?

Use a **rule** for a standing boundary, a **hook** for a supported event, a **command** for a named job, and a **Stinger** for a reusable method. For example, the no-dash rule explains the writing standard; `dash-guard.mjs` checks one edit event. The PR conflict rule explains an obligation; `/ship-gate` is a workflow that can check a whole change. [Components](COMPONENTS.md) compares all five types.

Avoid placing a standing boundary only inside an optional command. A person who never calls that command would then never see the rule. Avoid writing a rule that claims a hook will catch everything: hooks are limited by their host's event support and can fail or be disabled.

## Write a useful rule

State the trigger, the required behavior, the reason, any narrow exceptions, and how someone can tell whether it was followed. Keep it short enough to read when the boundary matters. A vague line such as "be careful with PRs" cannot be checked. "Before opening a PR, compare the branch with the current target and report conflicts" names an action and evidence.

Public users can [request a correction](https://github.com/legioncodeinc/vibe-coding-tools/issues). The public marketplace is generated, so a rule change belongs in reviewed source and must be tested across the harnesses that receive it.
