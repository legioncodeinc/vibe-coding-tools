# Guide: implement in Effect v4

Write new Effect-TS v4 code that compiles against the GA API and follows the
documented v4 idioms. Grounded in `references/research/distilled.md`; the
worked pattern lives in `references/worked-example-service.md`.

## Step 0: Confirm the target is v4

1. Check `package.json`: `effect` at `4.x` and every `@effect/*` package at the
   same exact version [distilled 1]. Mismatched versions are a v4 defect.
2. Check imports: v4 has no `effect/unstable/*` paths [distilled 1].
3. If the project is on v3, switch to guide 02 (migrate) first; never write
   v4 API calls into a v3 tree.

## Step 1: Model the domain

1. Identify each operation's success type, expected failure type, and
   requirements. Those become `Effect<A, E, R>` [raw/05].
2. Model expected failures as tagged errors (`Schema.TaggedError` or tagged
   classes). Bugs and impossible states are defects and stay untyped [raw/11].
3. Model external systems (DB, HTTP, clock, config) as services: one
   `Context.Service` class per dependency [raw/15, raw/20].

## Step 2: Compose with generators

1. Default to `Effect.gen(function* () { ... })` with `yield*` for sequencing
   [raw/07]. Pipeline style (`pipe`, `Effect.map`) is the documented
   alternative, not a fallback [raw/09].
2. Convert plain values explicitly: `Effect.fromOption`, `Effect.fromResult`,
   `Ref.get`, `Deferred.await`, `Fiber.join`. Never yield an `Option`, `Result`,
   `Ref`, `Deferred`, or `Fiber` raw - they are not Effects in v4 [raw/17].
3. Access services by `yield* ServiceClass`, not accessor proxies (removed in
   v4) and preferably not `Service.use` (hides the dependency) [raw/15].

## Step 3: Handle errors at the right level

1. Recover from typed failures with `Effect.catch`, `catchTag`,
   `catchTags`; partial recovery with `catchFilter` (Filter module) [raw/16].
2. Inspect defects only at boundaries: `Effect.exit`, `catchDefect`,
   `catchCause` [raw/11].
3. Nested tagged reasons: `Effect.catchReason` / `catchReasons` [raw/16].
4. Flatten causes via `cause.reasons` iteration, not v3 tree matching [raw/18].

## Step 4: Build and provide layers

1. `Layer.succeed(Service, impl)` for constants; `Layer.effect(Service,
   Effect.gen(...))` for effectful construction (scoped resources are managed
   automatically) [raw/20].
2. Wire dependencies with `Layer.provide`, combine with `Layer.merge` /
   `Layer.mergeAll`. Name the primary layer `X.layer` [raw/15, raw/20].
3. Layers memoize across `Effect.provide` calls in v4 - do not rely on v3
   re-execution behavior [distilled 3].

## Step 5: Run at the edge

1. `Effect.runPromise` / `runPromiseExit` for async edges, `runSync` for sync,
   `runFork` for background [raw/08].
2. No `Effect.run*` calls inside library code. Composition returns effects;
   only the application boundary executes them [raw/08].
3. Concurrency: `Effect.all` with `{ concurrency: n }` for bounded parallelism;
   structured concurrency cleans up children [raw/12].

## Step 6: Configure tooling (new projects)

`npx @effect/tsgo setup` installs the Effect LSP (TypeScript-Go based); the
tsconfig plugin name stays `@effect/language-service` and needs TypeScript 7
native for full function [raw/10]. Optional but recommended for agent-driven
work: the LSP gives real-time Effect diagnostics.

## Verify

- `tsc --noEmit` clean under the project's TypeScript.
- Every conformance checkpoint in
  `references/worked-example-service.md` passes.
- For streaming, scheduling, or workflow code, the archive is thin (distilled
  section 10): consult https://effect.website/docs/v4 before asserting API
  shapes, and record what you used.
