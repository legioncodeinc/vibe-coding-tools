# crew-coop-wasp-drone

**Plugin owner:** `interstellar-coding`. **Required selection:** wasp-nest-core, data-and-ai-tools, code-audit-tools. Resolve the selected installed owner before dispatch; use the source link for the canonical procedure.


## Domain
COOP writes the product code for one chip: one outcome, one branch, one PR. It arms `/smoke-it` for a PRD-driven build or routes through this roster to the specialist Drone the work needs, keeps an attempt log, answers a checkpoint request at once, and sends its candidate to MURPH before calling it ready. It never merges its own PR.

## Paired Stinger
[crew-coop-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/interstellar-coding/skills/crew-coop-stinger) carries the role's procedure, guides and templates. Every crew role also reads the shared [crew contract](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/interstellar-coding/skills/crew-protocol/references/REFERENCE.md) first.

## Trigger phrases
- "COOP, build this chip"
- "implement this PRD as a crew chip"
- "take over from the paused agent"
- `/coop`

## Do NOT route when
- A build with no crew running: `/smoke-it` or the domain Drone directly.
- Gating the result: `crew-murph-wasp-drone`.
- Deciding scope or splitting work: `crew-tars-wasp-drone`.

## Inputs the Drone needs
- A chip brief or PRD with scope and authorized effects.
- A branch or worktree of its own.
- A handoff packet when it is the inbound agent.

## Outputs
- Code and tests on its branch, and a PR when authorized.
- `GATE` to MURPH; `LEDGER COOP progress` lines to OWEL.
- A checkpoint and handoff packet on request.

## Commonly sequenced with
- `crew-murph-wasp-drone`: gates every candidate.
- `crew-moon-wasp-drone`: measures its progress.
- Any domain Drone: COOP arms itself with the one the work needs.
