# adr-writing-worker-bee

## Domain
Owns the Architecture Decision Record corpus: drafting new ADRs in Nygard format by default (Context, Decision, Consequences, Alternatives Considered), switching to MADR or Y-statements when the team's conventions call for it, assigning sequential numbers, and superseding stale decisions with bidirectional links. Enforces the "decisions, not docs" test so the ADR log stays a scannable, trustworthy onboarding artifact instead of a dumping ground for design proposals.

## Paired Stinger
[adr-writing-stinger](../../adr-writing-stinger) - format comparison matrix, supersession workflow, Log4brains/adr-tools setup, and the onboarding-value case for keeping an ADR log.

## Trigger phrases
- "write an ADR for this decision"
- "record this decision before we forget why"
- "supersede ADR-0032"
- "set up our ADR log"
- "which ADR format should we use, Nygard or MADR"
- "document this architecture choice"
- "how do new engineers read our ADR log"
- "audit our ADR directory for completeness"

## Do NOT route when
- The request is general knowledge-base authorship, not a closed decision record; that is library-worker-bee.
- The request is extracting code entities into a wiki; that is wiki-worker-bee.
- The request is a security review of the decision's posture (auth, secrets, PII, data residency); that is security-worker-bee, though this Bee still records the decision first and then escalates.
- The user is describing an in-flight proposal or a design discussion, not a closed decision; redirect to an RFC or PRD instead of drafting an ADR.
- The ADR log needs CI/CD or documentation-site integration; that is devops-worker-bee.

## Inputs the Bee needs
- The decision itself, stated as closed and consequential (not a brainstorm).
- Path to the existing ADR directory, or confirmation none exists yet.
- For supersession requests, the ADR number being replaced.

## Outputs
- A numbered ADR file (`NNNN-<kebab-title>.md`) in the project's ADR directory.
- An updated ADR log index (`adr-log.md` or Log4brains build).
- For supersession, both records updated with bidirectional status links.

## Commonly sequenced with
- security-worker-bee: reviews the decision's security posture after this Bee records it, when auth/secrets/PII are touched.
- library-worker-bee: takes design proposals or in-flight discussions that fail the "decisions, not docs" test.
- devops-worker-bee: wires the finished ADR log into CI/CD or a docs site.
