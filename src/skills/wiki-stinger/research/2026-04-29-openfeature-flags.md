---
title: OpenFeature flag declaration patterns
date: 2026-04-29
sources:
  - https://docs.openfeature.dev/docs/reference/concepts/evaluation-api
  - https://docs.openfeature.dev/specification/sections/flag-evaluation
  - https://docs.openfeature.dev/docs/reference/concepts/provider
---

# OpenFeature flag declaration patterns

## Summary
OpenFeature is the CNCF-graduated vendor-neutral feature-flag spec. Unlike LaunchDarkly, OpenFeature flags are **not declared** in code: they're **evaluated** via SDK methods (`client.getBooleanValue('flag-key', defaultValue, ctx?)`). There is no central declaration; the flag's existence is implicit in its first evaluation. Wiki-worker-bee's `feature-flag` extraction therefore must scan all `client.getXValue('...', ...)` and `client.getXDetails('...', ...)` call sites and aggregate by flag key. The aggregated entity page lists `read_at: [{file, line}, ...]` per the brief: which is exactly the cross-cutting visibility grep doesn't provide.

## Key facts
- Imports: `import { OpenFeature } from '@openfeature/server-sdk'` (server) or `'@openfeature/web-sdk'` (browser).
- Client setup: `const client = OpenFeature.getClient()` after `OpenFeature.setProvider(myProvider)`.
- Four typed evaluation methods (per the spec, REQUIRED by every SDK):
  - `client.getBooleanValue(flagKey, defaultValue, ctx?, opts?): boolean | Promise<boolean>`
  - `client.getStringValue(flagKey, defaultValue, ctx?, opts?): string | Promise<string>`
  - `client.getNumberValue(flagKey, defaultValue, ctx?, opts?): number | Promise<number>`
  - `client.getObjectValue<T>(flagKey, defaultValue, ctx?, opts?): T | Promise<T>`
- Detailed evaluation variants return additional metadata: `getBooleanDetails`, `getStringDetails`, `getNumberDetails`, `getObjectDetails`. Same arg shape; return includes `{ value, reason, variant, errorCode, errorMessage }`.
- Server vs client SDK: server sync return values may be Promises; client SDK is synchronous in browsers because flags are pre-loaded.
- Provider implementations can come from any vendor (LaunchDarkly, Flagsmith, ConfigCat, Split, Unleash). All conform to the same client-facing API: wiki-worker-bee can extract regardless of provider.
- `evaluationContext` is a key/value object used for targeting (user ID, account tier, etc.): useful for documenting the flag's targeting dependencies but optional.
- Flag default values: the second positional arg is the typed default returned on any evaluation error. This is the agent's best guess at the flag's intended fallback.

## Recommended approach for wiki-worker-bee

Detection heuristic for `feature-flag` (OpenFeature variant):

1. **Quick filter:** import scan for `@openfeature/` packages.
2. **AST walk:** find `CallExpression` nodes whose callee text matches `getBooleanValue | getStringValue | getNumberValue | getObjectValue | getBooleanDetails | getStringDetails | getNumberDetails | getObjectDetails`. The callee will typically be a `PropertyAccessExpression` like `client.getBooleanValue`.
3. **Extract per call:**
   - `flagKey` = first argument (string literal). If not a literal (variable, template, computed), emit `gap` and file under the variable name.
   - `defaultValue` = second argument's text: useful for documenting fallback behavior.
   - `valueType` = method-name suffix (`Boolean | String | Number | Object`).
   - `file:line` = source position.
4. **Aggregate by flagKey:** one entity page per unique flag key. The entity body contains:
   - Type (boolean / string / number / object)
   - Default value
   - `## Read at` subsection: bullet list of `{file:line, default, context}` per call site.
5. **Provider-agnostic by design:** mark the flag with `provider: openfeature` regardless of underlying vendor. If the agent can detect the provider registration (`OpenFeature.setProvider(...)`), record it as `backend_provider: <vendor>` in the body, NOT in frontmatter.

Entity filename: `entities/flag-<sanitized-key>.md`. `entity_type: feature-flag`. Frontmatter includes `read_at: [{file, line}]` array per the brief's recommendation. Note: keep `read_at` as a structured array of objects because YAML supports it cleanly:

```yaml
read_at:
  - { file: "src/billing.ts", line: 42 }
  - { file: "src/checkout.tsx", line: 113 }
```

For string flags with literal default values, include those defaults as a contract hint: "if this flag is missing or evaluation fails, the system behaves as if its value is X."

## Sources
- [OpenFeature Evaluation API](https://docs.openfeature.dev/docs/reference/concepts/evaluation-api): date retrieved 2026-04-29, canonical client API: `getBooleanValue`, `getStringValue`, `getNumberValue`, `getObjectValue`, plus the detailed variants.
- [OpenFeature Flag Evaluation Specification](https://docs.openfeature.dev/specification/sections/flag-evaluation): date retrieved 2026-04-29, normative spec saying each SDK MUST provide the four typed methods.
- [OpenFeature Providers](https://docs.openfeature.dev/docs/reference/concepts/provider): date retrieved 2026-04-29, provider interface.

## Quotes worth preserving
> "The client MUST provide methods for typed flag evaluation, including boolean, numeric, string, and structure, with parameters flag key (string, required), default value (boolean | number | string | structure, required)...", OpenFeature spec
> "The default value must also be specified. In the case of any error during flag evaluation, the default value will be returned, so give consideration to your default values!", OpenFeature evaluation API docs

## Open questions / gaps
- For wrapper utilities (`isFeatureEnabled('foo')` that internally calls `getBooleanValue`), AST detection by method name will miss them. Recommend: detect helper-function patterns by tracing imports from a per-repo helper file. Out of v1 scope; emit `gap` for now.
- Should the agent also detect `OpenFeature.setProvider(...)` calls and file the provider as a `service` entity? Recommend yes: provider configuration is architecturally significant. The flag entity links to the provider via `evaluated_by: [[entities/openfeature-provider]]`.
- Hooks (`OpenFeature.addHooks(...)`): out of v1 scope. Mention as architectural concept if a chunk includes a hook registration.
