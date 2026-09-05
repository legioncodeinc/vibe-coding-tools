---
source_url: https://www.speakeasy.com/post/speakeasy-oss-go-generator
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: sdk-generation
stinger: api-docs-stinger
---

# Speakeasy Go SDK Generator Comparison: Speakeasy Blog

## Summary

Speakeasy's comparison of four Go SDK generators: OpenAPI Generator (official), oapi-codegen (OSS), ogen (OSS), and Speakeasy (commercial). Evaluates Go idiomaticity, dependency footprint, nil safety, union types, error handling, retries, pagination, and CI/CD integration. Key finding: for teams committed to OSS, `oapi-codegen` is the recommended alternative; Speakeasy wins on production features (retries, pagination, nil-safe getters).

## Key quotations / statistics

- "If you are committed to using an open source generator, we strongly recommend that you use oapi-codegen."
- OpenAPI Generator: "1500+ deps, requires Java"
- Speakeasy Go: "3 deps", native Go patterns, nil-safe getters, built-in retries and pagination
- oapi-codegen: "No external deps", simple patterns, type-safe enums

## Feature comparison (Go generators)

| Feature | Speakeasy | OpenAPI Generator | oapi-codegen | ogen |
|---|---|---|---|---|
| Dependencies | 3 deps | 1500+ deps + Java | 0 external deps | 0 external deps |
| Go Idiomaticity | ✅ Native Go | ❌ Non-idiomatic | ✅ Simple patterns | ⚠️ Custom patterns |
| Nil-safe Getters | ✅ | ❌ | ❌ | ❌ |
| Union Types | ✅ Full | ❌ | ⚠️ Limited | ✅ Full |
| Enums | ✅ Type-safe | ❌ Strings only | ✅ Type-safe | ✅ Type-safe |
| Error Handling | ✅ Custom types | ⚠️ Generic | ⚠️ Basic | ✅ Good |
| Retries | ✅ Built-in | ❌ | ❌ | ❌ |
| Pagination | ✅ Built-in | ⚠️ Manual | ⚠️ Manual | ⚠️ Manual |
| CI/CD Integration | ✅ GitHub Actions | ❌ Manual | ❌ Manual | ❌ Manual |

## Go generation command (OpenAPI Generator)

```bash
openapi-generator generate \
  --input-spec petstore.yaml \
  --generator-name go \
  --output ./petstore-sdk-go
```

## Annotations for stinger-forge

- Use this as the **Go-specific source** for `guides/04-sdk-generation.md`.
- The `oapi-codegen` recommendation for OSS Go is the key takeaway. Document it as the preferred free option for Go, not openapi-generator.
- `oapi-codegen` install: `go install github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen@latest` (no Java needed).
- Speakeasy's built-in retries and pagination are strong differentiators. Note them in the commercial tier comparison.
- The 1500+ deps + Java requirement for openapi-generator Go output is a concrete reason to prefer oapi-codegen for Go teams.
