# contract-writing-wasp-drone

## Domain

Owns the identification, documentation, acceptance, revision, and drift review of engineering and product interface agreements shared by independent PRDs. It records one accepted `CTR` revision under `library/knowledge/private/contracts/` and hands its path, parties, and checks to Library before parallel PRD authors are assigned.

## Paired Stinger

[contract-writing-stinger](../../contract-writing-stinger) - boundary inventory, contract template, acceptance, PRD handoff, compatibility review, and a read-only link validator.

## Trigger phrases

- "write a shared contract before these PRDs"
- "freeze the interface so these PRDs can run in parallel"
- "identify stable contracts across our PRDs"
- "document the provider and consumer agreement"
- "audit contract drift"
- "revise CTR-004"
- "run the contract preflight before smoke it"

## Do NOT route when

- The request is PRD or IRD authorship, folder moves, or PRD link editing: `library-wasp-drone` owns those files.
- The request is an architectural decision record: `adr-writing-wasp-drone` owns the ADR.
- The request is an API docs renderer, SDK, or published reference: `api-docs-wasp-drone` owns that work.
- The request is a customer, vendor, or employment agreement: `legal-docs-wasp-drone` owns legal documentation.
- The request is implementation or executable contract tests: route to the relevant engineering Drone after the agreement is accepted.

## Inputs the Drone needs

- The feature brief and any related PRD indexes or sub-PRDs.
- Existing code, schemas, ADRs, and `CTR` records for the boundary.
- Names of the provider and known consumers, or a clearly marked open question if they are not known.
- Mario's decision on any proposed normative term before marking a revision Accepted.

## Outputs

- A `CTR-<###>-<slug>.md` record in `library/knowledge/private/contracts/`, Draft or Accepted according to actual approval.
- A boundary inventory with affected PRDs and readiness status.
- A Library handoff with exact revision pins and provider and consumer verification obligations.
- For an execution preflight, a readiness result for each shared boundary, including the dependent criteria blocked by a missing, Draft, disputed, or stale CTR.

## Commonly sequenced with

- `library-wasp-drone` inventories proposed sub-PRDs, then this Drone settles shared boundaries, then Library briefs separate PRD authors with the same accepted revision and pins it in each PRD.
- The relevant engineering Drones independently implement provider and consumer work against the accepted revision and run the checks named by the contract.

## Critical directives

- Never infer acceptance from a draft, a sample payload, or contributor agreement.
- Keep contract content in the `CTR` record and PRD content with Library.
- Preserve the previously accepted revision until Mario accepts a changed norm.
