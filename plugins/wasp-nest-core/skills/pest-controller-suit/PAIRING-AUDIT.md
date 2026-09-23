# Pairing audit

Ground truth pulled from `src/` by `scripts/validate.py` conventions. Regenerate after any change to `src/agents/` or `src/skills/`.

## Totals

- Active drone files (`src/agents/*-wasp-drone.md`): **117**
- Active stinger folders (`src/skills/*-stinger/SKILL.md`): **119**
- Orchestrator-level skills with no paired drone by design: **3** (`pest-controller-suit`, `queen-wasp-stinger`, `get-started-stinger`)
- Other core skills without a drone by design: `time-blocked-turns` (cadence protocol, feeds the session-start hook)

## Pairing integrity

- Drones without a stinger: none
- Stingers without a drone: none
- Drones not on the roster: none
- Drones without a routing guide: none

## Law

Every drone names exactly one paired stinger in its Critical Directive, every stinger outside the orchestrator set has exactly one drone, and every drone has a roster row and a guide in `guides/`. `scripts/validate.py` fails the build on any violation.
