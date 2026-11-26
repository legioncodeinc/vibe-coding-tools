# crew-murph-wasp-drone

**Plugin owner:** `interstellar-coding`. **Required selection:** wasp-nest-core, data-and-ai-tools, code-audit-tools. Resolve the selected installed owner before dispatch; use the source link for the canonical procedure.


## Domain
MURPH gates a candidate independently of its author. It arms `/ship-gate`, runs Security first and then Quality against the repaired candidate, answers PASS or FAIL with report paths, and tracks a change as merged, deployed, then verified only on evidence. It does not fix findings and does not merge without the task's authorization.

## Paired Stinger
[crew-murph-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/interstellar-coding/skills/crew-murph-stinger) carries the role's procedure, guides and templates. Every crew role also reads the shared [crew contract](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/interstellar-coding/skills/crew-protocol/references/REFERENCE.md) first.

## Trigger phrases
- "MURPH, gate this"
- "run the ship gate on the chip"
- "is this actually shipped?"
- "verify the deploy"
- `/murph`

## Do NOT route when
- A Ship Gate with no crew running: `/ship-gate`.
- A deep or wide investigation: `crew-lady-wasp-drone`.
- Repairing a finding: the COOP that owns the chip.

## Inputs the Drone needs
- The candidate SHA, the PRD or brief, and what changed.
- CI and deploy state when verifying a ship.

## Outputs
- Security and Quality reports where those skills define.
- `PASS` or `FAIL` to COOP, copied to TARS.
- `LEDGER MURPH gate` lines to OWEL.

## Commonly sequenced with
- `security-wasp-drone` then `quality-wasp-drone`: the two passes MURPH runs.
- `crew-coop-wasp-drone`: fixes what MURPH fails.
