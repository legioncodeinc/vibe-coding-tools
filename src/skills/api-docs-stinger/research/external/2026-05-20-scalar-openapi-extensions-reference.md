---
source_url: https://scalar.com/products/api-references/openapi
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: scalar-extensions
stinger: api-docs-stinger
---

# Scalar OpenAPI Extensions Reference: scalar.com

## Summary

Official Scalar documentation for all supported OpenAPI specification extensions (x- properties). Covers the complete set of Scalar-specific extensions including environment variables, code samples, example enrichment (x-example / x-examples for Swagger 2.0), stability indicators, endpoint badges, enum descriptions, and SDK installation instructions. Also covers server-side rendering (SSR) API for pre-rendering docs at startup.

## Key quotations / statistics

- "We're expecting the passed OpenAPI document to adhere to the Swagger 2.0, OpenAPI 3.0 or OpenAPI 3.1 specification."
- `x-scalar-environments`: predefined environment variables for API Client/References
- `x-scalar-active-environment`: set default active environment
- `x-codeSamples`: custom code samples for SDKs, e.g. `lang: JavaScript`, `label: "My SDK"`, `source: "..."`
- `x-example` / `x-examples`: brings OpenAPI 3.x example functionality to Swagger 2.0 body parameters
- `x-scalar-stability: stable | experimental | deprecated`: endpoint stability indicator
- `x-badges`: add color-coded badges to operations (configurable color)
- `x-scalar-ignore`: hide operations/webhooks from reference
- `x-tagGroups`: group tags into sections
- `x-displayName`: override tag display names
- `x-scalar-sdk-installation`: SDK installation instructions in docs header (supports `description` in Markdown and `source` for shell scripts)
- `x-pre-request` / `x-post-response`: pre/post request scripts (Postman-compatible syntax)
- `x-enum-descriptions` + `x-enum-varnames`: human-readable enum value documentation

### SSR API (from server-side-rendering page)

```typescript
const html = await renderApiReference({
  pageTitle: 'My API Reference',
  config: { url: 'https://...' },
})
const js = getJsAsset()
```

- Returns complete HTML with inline CSS, dark mode detection, pre-rendered HTML, and hydration script
- `getJsAsset()` returns the client-side hydration bundle
- Suitable for SEO and instant content

## Annotations for stinger-forge

- The `x-example` / `x-examples` section directly informs `guides/02-examples.md`: this is how examples work for Swagger 2.0 docs hosted in Scalar.
- The `x-codeSamples` extension is how teams inject their own SDK code examples. Document the shape in the examples guide.
- `x-scalar-stability` and `x-scalar-ignore` are useful for progressive disclosure of experimental endpoints.
- The SSR API (`renderApiReference` + `getJsAsset`) belongs in `guides/03-deployment.md` as the Node.js self-hosted pattern.
- `x-pre-request` / `x-post-response` scripts with Postman-compatible syntax are a killer feature for interactive testing. Mention in `guides/00-principles.md`.
- `x-scalar-sdk-installation` enables embedding SDK install instructions directly in the hosted reference. Document as part of SDK generation workflow.
