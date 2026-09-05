# Fern: API-First Docs + SDK Generation

Fern is a purpose-built platform for API documentation that generates SDKs, MCP servers, and `llms.txt` from an OpenAPI spec. Best for teams that want docs and SDKs from a single source of truth.

> Source: `research/external/2026-05-20-fern-api-docs-sdk-generation.md`

---

## 2026 Fern additions

- **MCP server auto-generation**: Fern generates an MCP server from an OpenAPI spec, letting AI assistants like Claude call your API via tools.
- **`llms.txt` auto-generation**: Fern produces `llms.txt` (the emerging standard for AI-readable API documentation) from your OpenAPI spec.

Both features make Fern uniquely valuable for teams building AI-accessible APIs.

## When to choose Fern

- API-first product where OpenAPI is the source of truth.
- Team wants TypeScript + Python + Go SDKs auto-generated and kept in sync with the spec.
- AI tooling (MCP server, `llms.txt`) is a priority.
- OpenAPI reference documentation is the core content, not a supplement.

Do NOT choose Fern for primarily guide/tutorial/conceptual content: Starlight or Docusaurus serves that better. Route OpenAPI spec authorship to `api-docs-worker-bee`.

## Setup

```bash
npm install -g fern-api
fern init
```

This creates:
```
fern/
├── fern.config.json      # project config
├── generators.yml        # SDK generator config
└── openapi/
    └── openapi.json      # or openapi.yaml
```

## `fern.config.json`

```json
{
  "organization": "my-org",
  "version": "0.x.x"
}
```

## `generators.yml`: SDK + docs generation

```yaml
default-group: sdk
groups:
  sdk:
    generators:
      - name: fernapi/fern-typescript-node-sdk
        version: 0.x.x
        output:
          location: npm
          package-name: "@my-org/sdk"
          token: ${NPM_TOKEN}
      - name: fernapi/fern-python-sdk
        version: 0.x.x
        output:
          location: pypi
          package-name: my-org
          token: ${PYPI_TOKEN}
  docs:
    generators:
      - name: fernapi/fern-docs
        version: 0.x.x
        config:
          output:
            path: fern-docs/
```

## MCP server generation (2026)

```bash
fern generate --group mcp
```

Fern auto-generates an MCP server with tools corresponding to each API endpoint. Consumers can configure Claude, Cursor, or other MCP-compatible clients to call your API directly.

## `llms.txt` generation

Fern generates `/llms.txt` from the OpenAPI spec: a structured plaintext summary of your API surface that LLM-based tools can read. This is auto-included in hosted Fern docs.

## Pricing

> TODO: open question: Fern pricing is not publicly documented (contact sales for enterprise). Include "pricing: contact sales" in any recommendation and note the lack of a publicly available free tier. Source: `research/research-summary.md` open question #3.

## Deployment

Fern has a hosted portal (managed SaaS). Self-hosted deployment requires Enterprise.

CI integration:
```yaml
- name: Fern generate (preview)
  run: fern generate --preview
  env:
    FERN_TOKEN: ${{ secrets.FERN_TOKEN }}
```
