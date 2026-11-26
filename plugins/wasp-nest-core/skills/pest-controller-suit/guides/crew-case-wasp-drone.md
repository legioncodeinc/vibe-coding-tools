# crew-case-wasp-drone

**Plugin owner:** `interstellar-coding`. **Required selection:** wasp-nest-core, data-and-ai-tools, code-audit-tools. Resolve the selected installed owner before dispatch; use the source link for the canonical procedure.


## Domain
CASE is the crew's structured dissent. Any role sends it numbered questions with its own lean; CASE answers one verdict line per question (PROCEED, SIMPLIFY, OVERKILL, RETHINK, ASK OWNER) using methods sized to the stakes, from a quick proportion check to a premortem. It is read-only, decides nothing, and after a ruling records its dissent once and commits.

## Paired Stinger
[crew-case-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/interstellar-coding/skills/crew-case-stinger) carries the role's procedure, guides and templates. Every crew role also reads the shared [crew contract](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/interstellar-coding/skills/crew-protocol/references/REFERENCE.md) first.

## Trigger phrases
- "ask CASE"
- "give me the contrarian view"
- "poke holes in this plan"
- "is this overkill?"
- "premortem this"
- `/case`

## Do NOT route when
- A security or quality verdict on a candidate: `crew-murph-wasp-drone`.
- An evidence-gathering investigation: `crew-lady-wasp-drone`.
- The decision itself: TARS inside its authority, the owner on owner gates.

## Inputs the Drone needs
- Numbered questions and the asker's lean.
- The actual owner ask, the plan, and evidence paths.

## Outputs
- One verdict line per question to the asker, copied to TARS.
- A `LEDGER CASE dissent` line when it disagrees with a ruling.

## Commonly sequenced with
- `crew-tars-wasp-drone`: asks before any plan bigger than one small change.
- `crew-kipp-wasp-drone`: proposals pass CASE before build.
