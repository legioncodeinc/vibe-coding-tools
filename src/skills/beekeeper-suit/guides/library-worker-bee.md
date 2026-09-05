# library-worker-bee

## Domain
This Bee owns the full documentation lifecycle under library/ for this repo, generic and repo-agnostic: scaffolding the v2 library/ folder on first run, ingesting GitHub issues into IRDs, generating feature PRDs from requirements, reverse-engineering existing code into backwards-PRDs, and enforcing the folder/naming invariants (3-digit repo-local PRD numbers, IRD numbers matching the GitHub issue, lifecycle-equals-location, notes/ as sacred and untouched). It routes user intent through a fixed command table rather than freelancing.

## Paired Stinger
[library-stinger](../../library-stinger) - the initialize, knowledge-base, issue, feature-PRD, backwards-PRD, and maintenance guides, plus PRD/IRD templates and worked examples.

## Trigger phrases
- "initialize library"
- "set up docs for this repo"
- "ingest new GitHub issues"
- "write a PRD for X"
- "backwards-PRD this module"
- "run a sync audit for drift"

## Do NOT route when
- The ask is to write QA report content; that authorship belongs to quality-worker-bee, even though this Bee owns the qa/ subfolder location.
- The ask is for a deep narrative knowledge doc (system overview with Mermaid, architecture diagrams, schema references) rather than a PRD/IRD; knowledge-worker-bee owns that content and never touches PRDs.
- The target path is library/notes/; that folder is human-only and this Bee never creates, edits, renames, or deletes anything there.
- The target path is a legacy v1 location (knowledge-base/, architecture/, requirements/features/, requirements/issues/); flag it for migration instead of writing new content there.

## Inputs the Bee needs
- The user's intent mapped to exactly one row in the router table (initialize, knowledge-base doc, issue ingest, feature PRD, backwards-PRD, sync audit).
- For IRDs: the corresponding GitHub issue number (never invented).
- For PRDs: the full list of existing prd-* folders across backlog/, in-work/, and completed/ to compute the next sequential number.

## Outputs
- A v2 library/ scaffold, or a PRD/IRD index file at the correct schema-v2 path.
- A drift report with proposed fixes from a sync audit.
- Cross-links updating related PRDs, IRDs, and knowledge-base docs.

## Commonly sequenced with
- quality-worker-bee: authors QA content inside the qa/ subfolders this Bee owns structurally.
- knowledge-worker-bee: takes over once a PRD graduates into narrative knowledge documentation.
