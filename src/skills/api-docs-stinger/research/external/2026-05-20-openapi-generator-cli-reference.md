---
source_url: https://github.com/OpenAPITools/openapi-generator
retrieved_on: 2026-05-20
source_type: github-readme
authority: official
relevance: high
topic: sdk-generation
stinger: api-docs-stinger
---

# openapi-generator: GitHub README

## Summary

The reference open-source SDK generator for OpenAPI specs (Apache-2.0). Supports 50+ language targets including TypeScript (multiple variants), Python, Go, Java, Ruby, and more. Latest stable release: v7.22.0 (2026-04-28). Next release: v7.23.0 scheduled 2026-05-28. 26,210 GitHub stars, 7,508 forks, 410 contributors. Primary language: Java (92.6%).

## Key quotations / statistics

- "OpenAPI Generator allows generation of API client libraries (SDK generation), server stubs, documentation and configuration automatically given an OpenAPI Spec (both 2.0 and 3.0 are supported)."
- Latest stable: v7.22.0 released 2026-04-28 (actively maintained)
- 5,665 open issues (maintenance burden warning)
- Requires Java runtime: `openapi-generator-cli` via Homebrew installs `openjdk@11` and many deps
- TypeScript generators: `typescript-axios`, `typescript-fetch`, `typescript-node`, `typescript-angular`, `typescript-rxjs` and more
- Go generator: `go` (net/http client)
- Python generator: `python` (uses requests/urllib3)

## TypeScript generation command

```bash
openapi-generator generate \
  --input-spec openapi.yaml \
  --generator-name typescript-axios \
  --output ./generated/typescript-sdk
```

## Go generation command

```bash
openapi-generator generate \
  --input-spec openapi.yaml \
  --generator-name go \
  --output ./generated/go-sdk
```

## Python generation command

```bash
openapi-generator generate \
  --input-spec openapi.yaml \
  --generator-name python \
  --output ./generated/python-sdk
```

## Annotations for stinger-forge

- Primary source for `guides/04-sdk-generation.md` openapi-generator section and `templates/makefile-sdk-targets.md`.
- **Critical caveat**: Java runtime dependency. TypeScript teams without Java installed will hit friction. Document Docker-based runner as alternative: `docker run --rm -v $(pwd):/local openapitools/openapi-generator-cli generate ...`
- The 5,665 open issues is a maintenance-burden warning to include in the tool selection matrix.
- v7.22.0 (2026-04-28) shows the project is actively maintained despite issue backlog.
- For Go SDK: document `oapi-codegen` as the preferred alternative (no Java dependency, idiomatic Go, 0 external deps) per Speakeasy comparison article.
- Makefile target pattern: wrap `openapi-generator-cli` invocations in `make generate-ts`, `make generate-go`, `make generate-py` targets so regeneration is one command.
