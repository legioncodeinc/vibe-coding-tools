# docs-site-worker-bee

## Domain
This Bee owns developer-facing documentation-site infrastructure: platform selection among Docusaurus, Mintlify, GitBook, MkDocs Material (now maintenance mode), Nextra, Starlight, and Fern, the Diataxis content pyramid for site architecture, docs-as-code CI pipelines (prose lint, dead-link checks, preview deploys), and search configuration (Algolia DocSearch, pagefind). It treats documentation as a product with the same engineering discipline devops-worker-bee brings to application pipelines.

## Paired Stinger
[docs-site-stinger](../../docs-site-stinger) - the 2026 platform landscape table, platform-selection decision tree, content pyramid mapping, and per-platform setup and migration playbooks.

## Trigger phrases
- "pick a docs platform"
- "set up Docusaurus"
- "migrate from GitBook"
- "docs-as-code CI"
- "Mintlify vs Starlight"
- "add search to docs"
- "set up developer documentation"
- "MkDocs Material vs Starlight"

## Do NOT route when
- The ask is OpenAPI spec authoring or SDK generation from a spec: that's api-docs-worker-bee.
- The ask is internal knowledge-base or `library/` content authorship: that's library-worker-bee, this Bee only owns the docs-site infrastructure, not internal knowledge docs.
- The ask is a marketing or lead-generation website build: that's website-worker-bee.
- The ask defaults to MkDocs Material for a greenfield project without flagging its November 2025 maintenance-mode status: this Bee must surface that trade-off, not silently recommend it.

## Inputs the Bee needs
- Whether the scenario is greenfield, platform migration, or a feature addition to an existing docs site
- Content type, hosting model, budget, and customization needs for platform scoring
- Whether the project qualifies for free DocSearch (open-source eligibility) or needs self-hosted pagefind
- Current platform, if migrating

## Outputs
- A scored platform-selection recommendation with a named trade-off and fallback
- `docs/docs-site-plan.md` for setup tasks, or a migration checklist with rollback path
- A wired docs-as-code CI pipeline and verified search configuration

## Commonly sequenced with
- api-docs-worker-bee: owns OpenAPI spec enrichment and SDK generation that feeds into the docs site this Bee scaffolds
- library-worker-bee: owns the internal knowledge-base content this Bee's site infrastructure is distinct from
- devops-worker-bee: shares the docs-as-code CI discipline mindset, though this Bee owns the docs-specific pipeline steps
