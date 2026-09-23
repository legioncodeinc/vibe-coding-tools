# Example: Fern TypeScript SDK Generation

Generating a TypeScript SDK from an existing OpenAPI spec using Fern.

**Demonstrates:** `guides/04-sdk-generation.md` (Fern workflow)

---

## Scenario

A team has `openapi.yaml` at the repo root and wants a typed TypeScript SDK published to npm.

## Step 1: Install Fern CLI

```bash
npm install -g fern-api
fern login  # authenticate with Fern Cloud (required for npm publishing)
```

## Step 2: Initialize Fern

```bash
fern init --openapi openapi.yaml
```

This creates a `fern/` folder:
```
fern/
├── fern.config.json
├── generators.yml
└── openapi/
    └── openapi.yaml  (symlinked or copied)
```

## Step 3: Configure generators.yml

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
        config:
          bundle: true
          includeCredentialsOnCrossOriginRequests: false

  production:
    generators:
      - name: fernapi/fern-typescript-node-sdk
        version: 0.20.7
        output:
          location: npm
          package-name: "@myorg/api-client"
          token: ${NPM_TOKEN}
```

## Step 4: Generate

```bash
# Local (writes to sdk/typescript/)
fern generate --local

# Production (publishes to npm)
fern generate --group production
```

## Step 5: Makefile target

```makefile
sdk-ts:
	fern generate --local --group local
	@echo "TypeScript SDK generated at sdk/typescript/"

sdk-ts-publish:
	fern generate --group production
```

## Generated SDK usage

```typescript
import { MyApiClient } from "@myorg/api-client";

const client = new MyApiClient({ token: "my-api-token" });

const user = await client.users.create({
  name: "Alice Smith",
  email: "alice@example.com",
  role: "editor",
});
```

Fern generates:
- Typed request/response models (from `$ref` components in the spec)
- Error classes per HTTP error response
- Retry logic with exponential backoff
- Streaming support (if SSE endpoints exist in the spec)

## When to use openapi-generator-cli instead

Use `openapi-generator-cli` if:
- You need Go output (see `guides/04-sdk-generation.md` for oapi-codegen).
- Fern's $250/mo cloud cost is not justified (use `--local` for free).
- You need one of the 50 non-TS/Python/Go languages Fern doesn't support.

*References: `guides/04-sdk-generation.md`, `research/external/fern-sdk-generator-github.md`, `research/external/sdk-generators-comparison-speakeasy-fern-openapi.md`*
