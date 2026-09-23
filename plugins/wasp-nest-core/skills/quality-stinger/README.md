# quality-stinger

The Cursor skill that equips the `quality-wasp-drone` Drone to audit completed implementations against their source plan documentation. It encodes the canonical audit procedure (Locate plan -> Inventory changes -> Cross-reference -> Five-axis evaluation -> Severity classification -> Report) plus the findings-report template, the severity rubric, and a library of worked examples.

This Stinger is the final checkpoint in the `library-wasp-drone` (plan) -> implementer -> `security-wasp-drone` (security) -> `quality-wasp-drone` (QA) loop. It runs after `security-wasp-drone` and before work is marked done. See `SKILL.md` for the entry point and `guides/00-principles.md` for scope, ordering, and cross-Drone handoffs.

The Drone that wields this Stinger lives at `.claude/agents/quality-wasp-drone.md`.
