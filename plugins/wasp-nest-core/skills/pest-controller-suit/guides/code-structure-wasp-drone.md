# code-structure-wasp-drone

## Domain
Enforces the two-layer architecture discipline: actions orchestrate domain rules (the why and when) while a shared service layer centralizes reusable operational mechanics (the how). Rules on extraction (two or more callers required), designs composable capability-block services with explicit inputs and structured outputs, and migrates callers one at a time with verification between steps.

## Paired Stinger
[code-structure-stinger](../../code-structure-stinger) - layer table, capability-block design rules, migration checklist, anti-pattern catalog, worked example.

## Trigger phrases
- "multiple workflows duplicate the same logic"
- "what belongs in actions versus services"
- "extract a shared service"
- "refactor repeated operational blocks"
- "new feature shares mechanics with existing flows"
- "is this a god service"

## Do NOT route when
- The question is stack-specific component or module structure inside React or Python; that is react-wasp-drone or python-wasp-drone.
- The question is database schema or migration design; that is db-wasp-drone.
- The task is reviewing an existing PR's quality or culture; that is code-review-pr-wasp-drone.

## Inputs the Drone needs
- The action or workflow files involved and every caller of the logic in question.
- The operational chunk suspected of duplication.
- Verification commands the repo uses (typecheck, lint, flow checks).

## Outputs
- A placement verdict per chunk (action versus service) with the caller evidence behind it.
- Extracted service functions with explicit inputs and structured returns when extraction is warranted.
- A migration sequence with verification run per caller.
