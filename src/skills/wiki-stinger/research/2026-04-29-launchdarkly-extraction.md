---
title: LaunchDarkly SDK client.variation extraction
date: 2026-04-29
sources:
  - https://docs.launchdarkly.com/sdk/features/evaluating/
  - https://docs.launchdarkly.com/sdk/client-side/javascript/
  - https://launchdarkly.github.io/js-client-sdk/interfaces/LDClient.html
  - https://docs.launchdarkly.com/sdk/client-side/node-js/
---

# LaunchDarkly SDK client.variation extraction

## Summary
LaunchDarkly is the largest commercial feature-flag platform, predating OpenFeature. Its SDK uses one canonical evaluation method: `client.variation(flagKey, defaultValue)`: same shape across browser-side `launchdarkly-js-client-sdk`, server-side `launchdarkly-node-server-sdk`, and Node.js client-side. The Node server-side SDK additionally exposes typed methods (`boolVariation`, `stringVariation`, `numberVariation`, `jsonVariation`) which are recommended over the generic `variation`. There's also `variationDetail` returning `{ value, reason, variationIndex }`. Wiki-worker-bee's detection is the same as for OpenFeature in shape: aggregate call sites by flag key.

## Key facts
- Server-side Node SDK methods (recommended typed forms):
  - `client.boolVariation(flagKey, context, defaultValue): Promise<boolean>`
  - `client.stringVariation(flagKey, context, defaultValue): Promise<string>`
  - `client.numberVariation(flagKey, context, defaultValue): Promise<number>`
  - `client.jsonVariation(flagKey, context, defaultValue): Promise<any>`
- Server-side generic: `client.variation(flagKey, context, defaultValue)`. NOTE arg order differs from client-side.
- Client-side (browser/JS) generic: `client.variation(flagKey, defaultValue)`. Synchronous return because flags are bootstrapped at init.
- Detail variants: `variationDetail`, `boolVariationDetail`, `stringVariationDetail`, `numberVariationDetail`, `jsonVariationDetail`: return `LDEvaluationDetail = { value, reason, variationIndex }`.
- Initialization: `LDClient.initialize(envKey, context, options)` (browser) or `LDClient.init(sdkKey, options)` (server). The `client` instance is shared application-wide (singleton convention).
- Lifecycle events: `client.on('initialized')`, `client.on('failed')`, `client.on('ready')`. Important to document because flag evaluations BEFORE `ready` return fallback values.
- Flag bootstrapping (browser): `client.identify(newContext)` switches the active context and triggers a flag refresh.
- `client.allFlags()` returns `LDFlagSet = { [key]: value }`: useful for full-flag audits but rarely seen in app code.
- Bots/CLI in the LaunchDarkly ecosystem (not consumed by wiki-worker-bee, but useful context):
  - `ldcli` lists flags from the LaunchDarkly API: could be a v2 enrichment source.
  - The `find-code-references` integration scans repos for flag-key strings: same idea as wiki-worker-bee's read_at extraction.

## Recommended approach for wiki-worker-bee

Detection heuristic for `feature-flag` (LaunchDarkly variant):

1. **Quick filter:** scan imports for `launchdarkly-js-client-sdk`, `launchdarkly-node-server-sdk`, `launchdarkly-node-client-sdk`, `launchdarkly-react-client-sdk`, or `@launchdarkly/*` org.
2. **AST walk:** find `CallExpression` nodes whose callee text matches:
   - `variation`, `variationDetail`
   - `boolVariation`, `boolVariationDetail`
   - `stringVariation`, `stringVariationDetail`
   - `numberVariation`, `numberVariationDetail`
   - `jsonVariation`, `jsonVariationDetail`
   The callee will typically be `<identifier>.<method>` where `<identifier>` is the LDClient instance.
3. **Extract flagKey:** the first argument that's a string literal.
   - For `variation(flagKey, ...)`: arg[0].
   - For server-side `variation(flagKey, context, defaultValue)`: arg[0] still.
   - The shared rule: the FIRST string-literal argument is always the flag key.
4. **Extract defaultValue:** the LAST positional argument is always the default. This works across browser and server SDK signatures.
5. **Aggregate by flagKey:** one entity page per unique key, same as OpenFeature pattern.
6. **React-specific:** `launchdarkly-react-client-sdk` provides `useFlags()` hook returning the full flag set. When detected, list as `read_at` for ALL keys discovered elsewhere, but the agent can't know which subset is actually used without dataflow analysis. Note this gap in the body.

Entity page differs from OpenFeature only in the `provider: launchdarkly` frontmatter and any LaunchDarkly-specific concepts (variation index, reason codes, percentage rollout context) noted in the body.

For the **dual-provider gotcha** (project uses both OpenFeature AND LaunchDarkly directly): file as one feature-flag entity per flag key, with the body noting both call sites. Frontmatter `provider:` becomes `multi: [openfeature, launchdarkly]`. This case is rare but real for migrating projects.

For projects using LaunchDarkly's `useFlags()` React hook destructuring (`const { myFlag } = useFlags()`), the agent can't easily resolve which keys are read. Recommend: detect `useFlags()` calls and list ALL flag keys from the project as potentially-read (the body can mark "read at scope: <component>"). Better than missing them entirely.

## Sources
- [Evaluating flags | LaunchDarkly](https://docs.launchdarkly.com/sdk/features/evaluating/): date retrieved 2026-04-29, canonical `variation` and typed-variation method docs.
- [JavaScript SDK reference](https://docs.launchdarkly.com/sdk/client-side/javascript/): date retrieved 2026-04-29, browser SDK init and variation patterns.
- [LDClient interface](https://launchdarkly.github.io/js-client-sdk/interfaces/LDClient.html): date retrieved 2026-04-29, full method signatures.
- [Node.js client-side SDK reference](https://docs.launchdarkly.com/sdk/client-side/node-js/): date retrieved 2026-04-29, Node-specific patterns.

## Quotes worth preserving
> "The variation method determines which variation of a flag LaunchDarkly serves to the current context. variation calls take the feature flag key and a fallback value.", LaunchDarkly docs
> "In the Node.js server-side SDK, there is a variation method for each type, such as boolVariation or stringVariation. These typed methods return a Promise and are recommended over the generic variation method.", LaunchDarkly docs

## Open questions / gaps
- Server-side Node SDK arg order differs from client-side: `(flagKey, context, defaultValue)` vs `(flagKey, defaultValue)`. Wiki-worker-bee's "last positional arg is the default" heuristic handles both, but document this.
- LaunchDarkly's `useFlags()` React hook reads ALL flags, making per-flag `read_at` ambiguous in React projects. Recommend: file `useFlags()` call sites under a `concepts/launchdarkly-react-flag-set.md` concept page, and link individual flag entities to it via `read_at_via: [[concepts/launchdarkly-react-flag-set]]`. Compromise that's better than nothing.
