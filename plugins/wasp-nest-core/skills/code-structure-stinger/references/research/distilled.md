# Distillation: code-structure

Research window: 2026-10-05. Sources archived in `raw/`. Body authored fresh;
the layer model below traces to the archived source.

| Claim | Source |
|---|---|
| Two-layer separation: actions orchestrate domain rules (why/when), services centralize reusable operational mechanics (how) | raw/michaelshimeles--code-structure-SKILL.md |
| Actions own business rules, state transitions, auth and ownership checks, failure classification, user-facing errors | raw/michaelshimeles--code-structure-SKILL.md |
| Services own provider and SDK interactions, command execution detail, health checks; return structured results; never reach into database or state directly | raw/michaelshimeles--code-structure-SKILL.md |
| Extraction trigger is the same operational logic in 2 or more callers; single-caller logic stays put (over-abstraction anti-pattern) | raw/michaelshimeles--code-structure-SKILL.md |
| Service functions are composable capability blocks with explicit parameters and structured outputs | raw/michaelshimeles--code-structure-SKILL.md |
| Migration: extract, replace one caller, verify (typecheck, lint, flows), then migrate the rest; never all at once | raw/michaelshimeles--code-structure-SKILL.md |
| Anti-patterns: god service, leaky service, inconsistent API, over-abstraction | raw/michaelshimeles--code-structure-SKILL.md |

License status of the source: no LICENSE file in the source folder (checked
2026-10-05); all rights reserved by the author. Our component restates the
model in original text and copies nothing.
