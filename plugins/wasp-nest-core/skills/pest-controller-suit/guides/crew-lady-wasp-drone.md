# crew-lady-wasp-drone

**Plugin owner:** `interstellar-coding`. **Required selection:** wasp-nest-core, data-and-ai-tools, code-audit-tools. Resolve the selected installed owner before dispatch; use the source link for the canonical procedure.


## Domain
LADY investigates independently and in depth: a full code audit, a root cause nobody can find, an incident, or due diligence on a risky change. It arms `audit-my-code-stinger`, summons that tool's sub-skills and Drones at top level, cites evidence for every finding, and never changes the audited code or accepts an author's claim unchecked.

## Paired Stinger
[crew-lady-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/interstellar-coding/skills/crew-lady-stinger) carries the role's procedure, guides and templates. Every crew role also reads the shared [crew contract](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/interstellar-coding/skills/crew-protocol/references/REFERENCE.md) first.

## Trigger phrases
- "have LADY investigate"
- "find the real root cause"
- "independent audit of this"
- "why does this keep failing"
- "due diligence before we merge"
- `/lady`

## Do NOT route when
- A plain code audit with no crew running: `/audit-my-code`.
- The routine gate on one candidate: `crew-murph-wasp-drone`.
- Fixing what is found: a COOP chip through TARS.

## Inputs the Drone needs
- The question, the scope, evidence so far, and a deadline.
- Read access to the repository, history and CI.

## Outputs
- An investigation report in its run workspace, with confidence per finding.
- `FINDINGS` to TARS and `LEDGER LADY finding` lines to OWEL.

## Commonly sequenced with
- `crew-moon-wasp-drone`: reports the stuck problems LADY investigates.
- The `code-audit-tools` Drones: LADY dispatches them.
- `crew-coop-wasp-drone`: fixes go to a chip.
