# crew-kipp-wasp-drone

**Plugin owner:** `interstellar-coding`. **Required selection:** wasp-nest-core, data-and-ai-tools, code-audit-tools. Resolve the selected installed owner before dispatch; use the source link for the canonical procedure.


## Domain
KIPP takes feature ideas from the owner, writes PRDs and IRDs after loading `library-stinger`, reserves their numbers, and keeps the library's folder and naming invariants. It hands shared-interface needs to contract writing and knowledge or ADR needs to OWEL. It writes no product code and never writes under `library/knowledge/`.

## Paired Stinger
[crew-kipp-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/interstellar-coding/skills/crew-kipp-stinger) carries the role's procedure, guides and templates. Every crew role also reads the shared [crew contract](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/interstellar-coding/skills/crew-protocol/references/REFERENCE.md) first.

## Trigger phrases
- "KIPP, I have a feature idea"
- "write the PRD for this with the crew"
- "take this intake"
- "reserve the next PRD number"
- `/kipp`

## Do NOT route when
- A whole new product before any build: `/product-studio:plan-product`.
- Library work with no crew running: `library-wasp-drone`.
- Narrative knowledge docs or ADRs: `crew-owel-wasp-drone` or `knowledge-wasp-drone`.

## Inputs the Drone needs
- The owner's idea or ask, verbatim.
- A repository with a Library (`wasp-nest.lock`); otherwise Get Started comes first.
- The integration branch to check numbering against.

## Outputs
- Intake notes, PRDs and IRDs under `library/requirements/` and `library/issues/`.
- One handoff per finished document to TARS.
- `LEDGER KIPP intake` lines to OWEL.

## Commonly sequenced with
- `crew-tars-wasp-drone`: receives the handoff and routes it.
- `crew-case-wasp-drone`: challenges the proposal before build.
- `contract-writing-wasp-drone`: drafts shared contracts KIPP identifies.
