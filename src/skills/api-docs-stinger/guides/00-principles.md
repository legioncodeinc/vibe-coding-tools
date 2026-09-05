# 00: Principles

The five core invariants that govern every `api-docs-worker-bee` session.

## 1. Spec-first mindset

The OpenAPI spec is the single source of truth. Every documentation artifact (rendered HTML, SDKs, changelog entries) is derived from the spec. Start every session by reading the spec before touching any tool config.

**Why it matters:** A beautiful Redoc page over a spec full of missing descriptions is worthless. Tool-first thinking produces docs that look polished but don't help developers. The spec's quality ceiling is the docs' quality ceiling.

## 2. Trade-off transparency

Never recommend a documentation tool without a scored comparison for the specific project context. "It depends" is not an answer. Use the matrix in `guides/01-tool-selection.md` to produce a concrete recommendation with rationale.

**Why it matters:** Documentation platform migrations are expensive (workflow changes, custom theming, content migration). The first recommendation must be defensible months later.

## 3. Example completeness before publishing

Every endpoint must have at least one JSON request example and one JSON response example before docs go live. Document what examples are missing before writing any other config.

**Why it matters:** Developers copy-paste examples. Missing examples are the most common complaint in API usability surveys (see `research/external/scalar-openapi-extensions-reference.md`).

## 4. Breaking-change discipline

Any API change that removes a field, renames a path, changes a required parameter, or alters authentication must be flagged `[BREAKING]` in the changelog. No exceptions. The `[BREAKING]` tag is machine-parseable and downstream consumers depend on it.

**Why it matters:** Silent breaking changes destroy developer trust faster than any other mistake. One missed `[BREAKING]` tag generates support tickets, angry blog posts, and SDK failures in production.

## 5. One-command rebuild

Every self-hosted docs setup must be reducible to a single command (`make docs`, `just docs`, `npm run docs`). Tribal-knowledge setups drift from the spec within weeks.

**Why it matters:** The person who set up the docs workflow won't be around forever. One-command rebuilds make documentation maintenance a culture rather than a heroic act.

---

## Scope boundary

`api-docs-worker-bee` owns the **API reference layer**: the spec-derived documentation surface.

It does NOT own:

- **Narrative guides, tutorials, conceptual docs** → `library-worker-bee`
- **CI/CD pipeline design for docs hosting** → `devops-worker-bee` (this stinger provides workflow file templates; the pipeline architecture is `devops-worker-bee`'s domain)
- **OpenAPI security scheme audits** → `security-worker-bee`
- **REST / GraphQL route design** → `python-worker-bee` or `react-worker-bee`

When a request blends API reference and narrative docs, do the API reference layer first, then explicitly hand off to `library-worker-bee` for the surrounding docs site.

---

## Five quality gates (run in order before declaring docs done)

1. **Spec validation**: the OpenAPI spec passes `redocly lint` or `openapi-generator validate` with zero errors.
2. **Example coverage**: every endpoint has at least one request example and one response example.
3. **Rendering smoke test**: the rendered docs load locally without console errors.
4. **SDK generation smoke test**: if SDKs are configured, `make sdk` runs to completion.
5. **Done checklist**: all 10 items in `guides/06-done-checklist.md` pass.

*Source: `research/external/scalar-openapi-extensions-reference.md`, `research/external/bump-sh-changelog-breaking-changes.md`*
