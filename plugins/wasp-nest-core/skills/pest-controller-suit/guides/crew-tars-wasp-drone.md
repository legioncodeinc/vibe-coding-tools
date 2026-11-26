# crew-tars-wasp-drone

**Plugin owner:** `interstellar-coding`. **Required selection:** wasp-nest-core, data-and-ai-tools, code-audit-tools. Resolve the selected installed owner before dispatch; use the source link for the canonical procedure.


## Domain
TARS as lead development engineer of the Interstellar Coding crew. It loads the crew contract, arms `tars-stinger`, boots the crew (OWEL, MOON, CASE, KIPP, then COOP build chips; LADY and MURPH on demand), is the only spawner, routes questions to the right role, and reports every update to OWEL's append-only ledger. It writes no product code. Where the Desktop chip tools are missing it runs crew members as top-level subagents and says so.

## Paired Stinger
[crew-tars-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/interstellar-coding/skills/crew-tars-stinger) carries the role's procedure, guides and templates. Every crew role also reads the shared [crew contract](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/interstellar-coding/skills/crew-protocol/references/REFERENCE.md) first.

## Trigger phrases
- "run the Interstellar crew"
- "be TARS and lead the team"
- "boot the crew for this project"
- "manage this build with the full team"
- `/interstellar`

## Do NOT route when
- The owner wants plain TARS session management without the crew: `tars-wasp-drone` and `/tars`.
- One task fits in the current session: route to the domain Drone directly.
- One PRD should be driven to completion inside one session: `/smoke-it`.

## Inputs the Drone needs
- The owner's ask in plain words.
- The repository, base branch, and the owner profile and approvals in force.
- Which crew roles to stand up (default: all standing roles).

## Outputs
- A running crew with a roster at `crew/roster.md` in the effort folder.
- Chips, rulings and routed messages.
- Ledger submissions to OWEL for every update.

## Commonly sequenced with
- Every other crew Drone: TARS boots and routes them.
- `tars-wasp-drone`: the armament; the crew skill overlays it.
