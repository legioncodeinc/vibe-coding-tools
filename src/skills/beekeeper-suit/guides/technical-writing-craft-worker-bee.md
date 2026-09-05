# technical-writing-craft-worker-bee

## Domain
Owns the craft of writing technical documentation, not the platform that hosts it, the folder that organizes it, or the metadata that makes it discoverable: Diataxis mode correctness, inverted-pyramid prose structure, code-example discipline, voice and tone consistency, the reader-lens diagnostic, ghostwriting discipline, and docs-as-code PR review. It runs in three modes: review (auditing an existing document), ghostwriting (drafting one), and docs-as-code PR review (scoped to changed files).

## Paired Stinger
[technical-writing-craft-stinger](../../technical-writing-craft-stinger) - the Diataxis guide (read first, every invocation), inverted-pyramid and code-example guides, voice/tone, reader-lens, ghostwriting structure, and the docs-as-code PR checklist.

## Trigger phrases
- "review this document"
- "is this doc well-written"
- "audit this page"
- "apply Diataxis to this guide"
- "ghostwrite this how-to"
- "my docs PR needs a writing review"
- "does this code example hold up"

## Do NOT route when
- The ask is which platform should host the docs: route to docs-site-worker-bee.
- The ask is knowledge-base folder structure or organization: route to library-worker-bee.
- The ask is OpenAPI spec authorship or enrichment: route to api-docs-worker-bee.
- The ask is a README-specific review: route to readme-writing-worker-bee.
- The ask is SEO metadata for the doc: route to seo-aeo-worker-bee.

## Inputs the Bee needs
- The document (or PR diff) to review, or a completed ghostwrite intake brief for drafting mode.
- Any house style guide that should override the Bee's own voice/tone defaults.
- The intended Diataxis mode if it's not obvious from the document itself.
- For docs-as-code review: the scope is changed files only.

## Outputs
- A filled scorecard and findings report with every Blocker paired to a specific rewrite proposal.
- A self-reviewed draft in ghostwriting mode, plus any open Suggestions surfaced to the user.
- Docs-as-code PR findings using the standard review-report template.

## Commonly sequenced with
- docs-site-worker-bee: once content is drafted, for platform publishing.
- library-worker-bee: for where the finished doc should live in the knowledge base.
- api-docs-worker-bee: when a reviewed document references or embeds an OpenAPI spec.
