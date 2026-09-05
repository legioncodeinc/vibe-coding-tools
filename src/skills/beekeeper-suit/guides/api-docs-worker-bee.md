# api-docs-worker-bee

## Domain
Owns the API documentation surface end to end: turning a raw OpenAPI spec into a usable developer experience. Covers rendering tool selection (Scalar, Redoc, Swagger UI, Mintlify, Stoplight, Bump.sh), JSON request/response example authoring, self-hosted and managed deployment (GitHub Pages, Netlify, Vercel, Docker), SDK generation for TypeScript/Python/Go, and changelog discipline that flags breaking API changes. Spec-first: the OpenAPI spec is the source of truth, tool choice is secondary.

## Paired Stinger
[api-docs-stinger](../../api-docs-stinger) - tool-selection comparison matrix, example-enrichment audit workflow, deployment templates, and SDK generation commands per language.

## Trigger phrases
- "set up API docs for our spec"
- "which docs renderer should I use, Redoc or Scalar"
- "generate a TypeScript SDK from my OpenAPI spec"
- "deploy my API docs to GitHub Pages"
- "write an API changelog entry for this breaking change"
- "add request/response examples to my endpoints"
- "audit my API docs before we publish"
- this Bee also triggers proactively when a PR touches an OpenAPI spec file

## Do NOT route when
- The request is general documentation sites or tutorials beyond the API reference; that is library-worker-bee.
- The request is an OpenAPI security scheme audit; that is security-worker-bee.
- The request is designing the REST/GraphQL routes themselves; that is python-worker-bee or react-worker-bee.
- The request is CI/CD pipeline architecture for docs hosting; this Bee provides workflow file templates but devops-worker-bee owns the pipeline design.
- The spec is missing entirely and cannot be inferred from the codebase; surface that gap and ask before proceeding.

## Inputs the Bee needs
- The OpenAPI spec file path, URL, or a description of the API if no spec exists yet.
- Rendering tool budget/tier constraints if Mintlify or Stoplight (paid platforms) are being considered.
- Target languages for SDK generation, if requested.

## Outputs
- A validated, rendered API docs site with a scored tool-selection rationale.
- An example-coverage audit table and enriched JSON request/response examples.
- Generated SDKs and Makefile targets, plus a changelog entry tagged `[BREAKING]` where applicable.

## Commonly sequenced with
- security-worker-bee: audits the OpenAPI security schemes once the docs are built.
- python-worker-bee / react-worker-bee: own the underlying route design that the spec documents.
- devops-worker-bee: owns the CI/CD pipeline design around the docs deployment workflow this Bee scaffolds.
