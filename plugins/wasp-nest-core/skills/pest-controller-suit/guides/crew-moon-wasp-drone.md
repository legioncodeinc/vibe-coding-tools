# crew-moon-wasp-drone

**Plugin owner:** `interstellar-coding`. **Required selection:** wasp-nest-core, data-and-ai-tools, code-audit-tools. Resolve the selected installed owner before dispatch; use the source link for the canonical procedure.


## Domain
MOON keeps a running record of every agent: real output, when it went dormant, how many times it tried the same problem, and whether it is looping or stuck, measured against the `time-blocked-turns` cadence. It may pause or terminate an under-performing agent only after that agent's work is preserved, verified and packaged for the inbound agent TARS will spawn.

## Paired Stinger
[crew-moon-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/interstellar-coding/skills/crew-moon-stinger) carries the role's procedure, guides and templates. Every crew role also reads the shared [crew contract](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/interstellar-coding/skills/crew-protocol/references/REFERENCE.md) first.

## Trigger phrases
- "MOON, who is stuck?"
- "watch the agents for loops"
- "pause that agent"
- "which sessions went dormant"
- `/moon`

## Do NOT route when
- Flow metrics and WIP limits as a method: `kanban-flow-wasp-drone`.
- Spawning the replacement: `crew-tars-wasp-drone` only.
- Finding the root cause of the stuck problem: `crew-lady-wasp-drone`.

## Inputs the Drone needs
- The crew roster and effort folder.
- Session or agent ids, and access to transcripts or heartbeats.

## Outputs
- The flight recorder at `crew/moon/flight-recorder.md`.
- Handoff packets under `crew/handoffs/`.
- `INTERVENTION` to TARS and `LEDGER MOON intervention` lines to OWEL.

## Commonly sequenced with
- `crew-tars-wasp-drone`: spawns the inbound agent from the packet.
- `crew-lady-wasp-drone`: investigates what MOON reports as stuck.
