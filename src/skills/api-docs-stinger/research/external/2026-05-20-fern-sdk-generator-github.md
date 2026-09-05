---
source_url: https://github.com/fern-api/fern/
retrieved_on: 2026-05-20
source_type: github-readme
authority: official
relevance: high
topic: sdk-generation
stinger: api-docs-stinger
---

# Fern SDK Generator: GitHub README

## Summary

Fern (buildwithfern.com) is an open-source platform (Apache-2.0) that generates type-safe SDKs and documentation from OpenAPI (REST/Webhooks), AsyncAPI (WebSockets), Protobuf (gRPC), and OpenRPC. As of January 2026, Fern was acquired by Postman. The CLI supports `fern init --openapi ./path/to/openapi.yml` to initialize from an existing spec. Latest release as of research date: 4.62.0 (2026-04-03). 3,574 GitHub stars.

## Key quotations / statistics

- "Input OpenAPI. Output SDKs and Docs."
- "Type-safe SDKs in multiple languages, including TypeScript, Python, Java, Go, Ruby, PHP, and C#"
- "Developer documentation featuring an interactive UI and auto-generated API + SDK references"
- "AI Search powered by an assistant trained on your docs, APIs, and SDKs"
- Acquired by Postman in January 2026 (from SDK comparison article)
- Pricing: $250/month per SDK (after free OSS tier per comparison article)

## SDK Generators supported

| Generator ID | Languages |
|---|---|
| `fernapi/fern-typescript-sdk` | TypeScript |
| `fernapi/fern-python-sdk` | Python |
| `fernapi/fern-java-sdk` | Java |
| `fernapi/fern-ruby-sdk` | Ruby |
| `fernapi/fern-go-sdk` | Go |
| `fernapi/fern-csharp-sdk` | C# |
| `fernapi/fern-php-sdk` | PHP |
| `fernapi/fern-swift-sdk` | Swift |
| `fernapi/fern-rust-sdk` | Rust |

## Quickstart workflow

```bash
# Initialize from OpenAPI spec
fern init --openapi ./path/to/openapi.yml

# Add a generator
fern add fern-typescript-sdk

# Generate SDKs (runs in Fern's cloud)
fern generate
# Output: /generated/sdks/typescript
```

## Configuration shape

```
fern/
├── fern.config.json
├── generators.yml   # which generators to use
└── openapi/
    └── openapi.json # your openapi document
```

## Annotations for stinger-forge

- Primary source for the Fern section of `guides/04-sdk-generation.md`.
- The Postman acquisition (January 2026) is a longevity risk to note: Fern's roadmap may shift to serve Postman's enterprise priorities.
- `fern generate` runs in Fern's cloud: important for teams with air-gap requirements (they need Speakeasy instead).
- Fern also generates documentation (interactive UI + API reference): it competes with Scalar/Redoc on the docs side too, which is worth noting in the tool selection guide.
- The `generators.yml` + `fern.config.json` pattern is analogous to a Makefile target. Document the equivalent in `templates/makefile-sdk-targets.md`.
- Compare with `openapi-generator-cli`: Fern is more idiomatic output but cloud-dependent; openapi-generator is local/free but requires Java and produces less idiomatic TypeScript.
