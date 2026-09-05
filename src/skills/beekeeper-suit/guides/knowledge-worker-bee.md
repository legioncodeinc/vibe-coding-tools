# knowledge-worker-bee

## Domain
This Bee authors the narrative, human-readable knowledge documentation under library/knowledge/private/<domain>/: system overviews with Mermaid diagrams, auth architecture docs with sequence diagrams, consolidated SQL schema references, Valkey key catalogs, security trust-boundary diagrams, coding standards, and every other deep technical doc that explains how a system works and why it was built that way. It works from ADRs and PRDs as source material but never copies spec language verbatim, and it never touches PRDs or IRDs itself.

## Paired Stinger
[knowledge-stinger](../../knowledge-stinger) - domain taxonomy for library/knowledge/, the strict document-format spec, the analysis workflow, a blank template, and target-quality examples (system overview, auth architecture).

## Trigger phrases
- "document the auth architecture"
- "write the system overview"
- "create knowledge docs for this repo"
- "build out the knowledge base"
- "same quality as the legion-secure wiki"
- "document how our container runtime works internally"

## Do NOT route when
- The ask is a PRD or an IRD; those are authored by library-worker-bee, and this Bee never writes them.
- The ask is a QA report; that belongs to quality-worker-bee.
- The ask is authoring a new ADR (the WHY-decision record itself, not the narrative doc built from it); that belongs to adr-writing-worker-bee.
- The target file is under library/notes/; that folder is human-only, no agent writes there.

## Inputs the Bee needs
- Which domain (auth, data, security, frontend, etc.) or "full knowledge base" scope.
- The relevant ADRs to read first for the WHY behind the design.
- The relevant PRDs to extract DDL, API specs, and technical considerations from.
- Source code as ground truth for file paths and actual behavior.

## Outputs
- Knowledge docs with the standard header (Category, Version, Date, Status) and a Related section linking 3-8 sibling docs and ADRs.
- Mermaid diagrams (flowchart, sequenceDiagram, stateDiagram-v2) with no explicit colors and camelCase node IDs.
- Complete SQL DDL and trust-boundary diagrams where the domain calls for them.

## Commonly sequenced with
- library-worker-bee: supplies the PRDs this Bee reads as source material for the WHAT and HOW.
- adr-writing-worker-bee: supplies the ADRs this Bee reads as source material for the WHY.
- quality-worker-bee: authors the QA reports that sit alongside, but outside, this Bee's docs.
