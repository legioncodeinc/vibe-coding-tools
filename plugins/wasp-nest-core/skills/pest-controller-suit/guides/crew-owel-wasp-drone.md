# crew-owel-wasp-drone

**Plugin owner:** `interstellar-coding`. **Required selection:** wasp-nest-core, data-and-ai-tools, code-audit-tools. Resolve the selected installed owner before dispatch; use the source link for the canonical procedure.


## Domain
OWEL keeps the crew's append-only ledger and the repository's `library/knowledge/{private,public}/`. It appends an entry for every update other roles send, never edits or deletes one, and on its own initiative reads contracts, PRDs, PRs, decisions and transcripts to write knowledge docs and ADRs. It arms `knowledge-stinger` and `adr-writing-stinger`.

## Paired Stinger
[crew-owel-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/interstellar-coding/skills/crew-owel-stinger) carries the role's procedure, guides and templates. Every crew role also reads the shared [crew contract](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/interstellar-coding/skills/crew-protocol/references/REFERENCE.md) first.

## Trigger phrases
- "OWEL, record this"
- "put that in the ledger"
- "document what we decided"
- "write the ADR for that decision"
- "verify the ledger"
- `/owel`

## Do NOT route when
- Knowledge docs with no crew running: `knowledge-wasp-drone`.
- A single ADR on request with no crew: `adr-writing-wasp-drone`.
- PRDs and IRDs: `crew-kipp-wasp-drone`.

## Inputs the Drone needs
- The effort folder and the ledger path.
- `LEDGER` lines from other roles, or the outbox to drain.
- Read access to the library, PRs and transcripts.

## Outputs
- Ledger entries, each answered with `RECORDED L-<n>`.
- Knowledge docs and ADRs under `library/knowledge/`.
- A one-line alarm to TARS and the owner if the chain fails verification.

## Commonly sequenced with
- Every crew Drone: all of them report to OWEL.
- `crew-kipp-wasp-drone`: hands OWEL decisions that deserve an ADR.
