# 04: SDK Generation

Generating typed client SDKs from an OpenAPI spec. Read `research/external/sdk-generators-comparison-speakeasy-fern-openapi.md`, `research/external/fern-sdk-generator-github.md`, and `research/external/openapi-generator-cli-reference.md` before running this guide.

## Tool selection

| Tool | TypeScript quality | Python quality | Go quality | Price | Notes |
|---|---|---|---|---|---|
| **openapi-generator-cli** | Good | Good (v7.22.0+) | Excellent | Free | 50+ languages; community-maintained |
| **Fern** | Excellent | Excellent | Good | Free OSS; $250/SDK/mo cloud | Acquired by Postman Jan 2026 |
| **Speakeasy** | Excellent | Excellent | Excellent | Free tier; paid | Strong TypeScript + Go quality |

**Default recommendation:**
- **TypeScript:** Speakeasy or Fern (both produce idiomatic TS with proper types and error handling)
- **Python:** Fern (idiomatic Pydantic models) or openapi-generator-cli v7.22.0+
- **Go:** openapi-generator-cli + `oapi-codegen` (see `research/external/speakeasy-go-sdk-comparison.md`)

## openapi-generator-cli

### Installation

```bash
npm install -g @openapitools/openapi-generator-cli
# or use npx: npx @openapitools/openapi-generator-cli generate ...
```

### TypeScript (axios client)

```bash
openapi-generator-cli generate \
  -i openapi.yaml \
  -g typescript-axios \
  -o sdk/typescript \
  --additional-properties=supportsES6=true,npmName=my-api-client,npmVersion=1.0.0
```

### Python

```bash
openapi-generator-cli generate \
  -i openapi.yaml \
  -g python \
  -o sdk/python \
  --additional-properties=packageName=my_api_client,projectName=my-api-client
```

### Go

```bash
openapi-generator-cli generate \
  -i openapi.yaml \
  -g go \
  -o sdk/go \
  --additional-properties=packageName=myapiclient,structPrefix=true
```

## Fern

### Setup (generators.yml)

```yaml
# fern/generators.yml
default-group: local
groups:
  local:
    generators:
      - name: fernapi/fern-typescript-node-sdk
        version: 0.20.7
        output:
          location: local-file-system
          path: ../sdk/typescript
      - name: fernapi/fern-python-sdk
        version: 3.4.1
        output:
          location: local-file-system
          path: ../sdk/python
```

```bash
fern init --openapi openapi.yaml
fern generate --local
```

## Makefile targets (one-command rebuild)

```makefile
.PHONY: sdk sdk-ts sdk-py sdk-go

sdk: sdk-ts sdk-py sdk-go

sdk-ts:
	npx @openapitools/openapi-generator-cli generate \
		-i openapi.yaml \
		-g typescript-axios \
		-o sdk/typescript

sdk-py:
	npx @openapitools/openapi-generator-cli generate \
		-i openapi.yaml \
		-g python \
		-o sdk/python

sdk-go:
	npx @openapitools/openapi-generator-cli generate \
		-i openapi.yaml \
		-g go \
		-o sdk/go
```

See `templates/makefile-sdk-targets.md` for the full template.

## SDK documentation

After generation, add a `README.md` to each SDK folder with:
1. Installation instructions (`npm install my-api-client` / `pip install my-api-client`)
2. A quickstart code snippet copied from `examples/` in the spec
3. Link back to the full API reference docs

## Spec quality requirements for good SDK output

Generators produce better code when the spec has:
- `operationId` on every operation (becomes the method name)
- `$ref` components (not inline objects) for all request/response schemas
- `tags` on every operation (becomes the class/module grouping)
- Meaningful `description` on every schema property

Fix these before running generation. See `guides/02-examples.md` for example enrichment.

*Source: `research/external/sdk-generators-comparison-speakeasy-fern-openapi.md`, `research/external/openapi-generator-cli-reference.md`, `research/external/fern-sdk-generator-github.md`, `research/external/speakeasy-go-sdk-comparison.md`*
