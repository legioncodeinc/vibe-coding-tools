# Distilled: Effect v4 (effect-ts) for the effect-wasp-drone

Research window: 2026-10-07. Effect v4 is generally available; `effect@4.0.2`
was published 2026-10-07 [raw/13 GitHub main; release feed verified at forge
time]. Every claim below cites its raw file under `references/research/raw/`.

## 1. Status and packaging (v4 vs v3)

| Fact | Detail | Source |
|---|---|---|
| Versioning | All ecosystem packages share one version and release together (`effect@4.0.0` matches `@effect/sql-pg@4.0.0`) | raw/13 |
| Consolidation | `@effect/platform`, `@effect/rpc`, `@effect/cluster` merged into core `effect`; separate packages remain platform/driver/AI-specific (`@effect/platform-*`, `@effect/sql-*`, `@effect/ai-*`, `@effect/opentelemetry`, `@effect/vitest`) | raw/13 |
| Unstable modules | `effect/unstable/<mod>` paths dropped the `unstable` segment; APIs carry `@stability unstable` (breaking in minors) or `@stability experimental` (breaking in patches); unstable modules include `ai`, `cli`, `cluster`, `devtools`, `http`, `http-api`, `rpc`, `schema`, `sql`, `workflow` | raw/13 |
| Runtime perf | Fiber runtime rewritten; minimal program ~6.3 KB min+gzip, ~15 KB with Schema | raw/13 |
| Toolchain floor | TypeScript 5.9+ (TS 7 recommended); Node 22.18+, Deno, Bun | raw/03 |
| GA evidence | `effect@4.0.0` release published 2026-10-01; `effect@4.0.2` published 2026-10-07 | raw/13 + GitHub release feed (forge-time check) |

## 2. Core model (unchanged spine from v3)

| Concept | v4 fact | Source |
|---|---|---|
| The type | `Effect<A, E, R>` describes success, error channel, and requirements; programs are values | raw/01, raw/05 |
| Composition | `Effect.gen(function* () { ... yield* ... })`; generators are optional, pipeline style is the documented alternative | raw/07, raw/09 |
| Running | At the edge only: `Effect.runPromise`, `runSync`, `runPromiseExit`, `runFork` | raw/08 |
| Two error kinds | Expected failures live in `E` (recovered via `Effect.catch`, `catchTag`); unexpected defects are untyped, retained in `Cause`, inspected at boundaries via `Effect.exit`, `catchDefect`, `catchCause` | raw/11 |
| Concurrency | Fibers, structured concurrency, bounded parallelism, interruption | raw/12 |
| Tagged errors | `Effect.catchTag`/`catchTags` unchanged in v4 | raw/16 |
| Requirements | Services via `Context.Service`, provided with `Effect.provide(program, layer)` | raw/20 |

## 3. Services and layers (biggest v4 surface change)

| v3 | v4 | Source |
|---|---|---|
| `Context.GenericTag<T>(id)` | `Context.Service<T>(id)` | raw/15 |
| `class X extends Context.Tag(id)<Self, Shape>()` | `class X extends Context.Service<Self, Shape>()(id)` (type params first, id passed to returned constructor) | raw/15 |
| `Effect.Tag` static accessors | Removed; use `Service.use((s) => ...)` / `Service.useSync`, but docs prefer `yield* Service` inside `Effect.gen` (dependencies stay visible) | raw/15 |
| `Effect.Service<Self>()(id, { effect, dependencies })` auto `.Default` layer | `Context.Service<Self>()(id, { make })` stores the constructor; build layers explicitly with `Layer.effect(this, this.make)` and wire deps with `Layer.provide`; no `dependencies` option | raw/15 |
| `FiberRef` | `Context.Reference<T>(id, { defaultValue })` | raw/13, raw/15 |
| Layer naming | `X.Default` / `XLive` convention replaced by `X.layer` primary plus descriptive variants (`layerTest`, `layerConfig`) | raw/15 |
| Layer construction | `Layer.succeed(Service, impl)`, `Layer.effect(Service, Effect.gen(...))` (scope-managed, `Scope` excluded from layer requirements); compose with `Layer.merge`, `Layer.mergeAll`, `Layer.provide` | raw/20 |
| Memoization | Layers memoize across `Effect.provide` calls in v4 (behavior change from v3) | raw/13 |

## 4. Error handling renames

| v3 | v4 | Source |
|---|---|---|
| `Effect.catchAll` | `Effect.catch` | raw/16 |
| `Effect.catchAllCause` | `Effect.catchCause` | raw/16 |
| `Effect.catchAllDefect` | `Effect.catchDefect` | raw/16 |
| `Effect.catchSome` | `Effect.catchFilter` (uses the `Filter` module, not `Option`) | raw/16 |
| `Effect.catchSomeCause` | `Effect.catchCauseFilter` | raw/16 |
| `Effect.catchSomeDefect` | Removed | raw/16 |
| (new) | `Effect.catchReason`, `Effect.catchReasons` (nested tagged reasons), `Effect.catchEager` | raw/16 |

## 5. Yieldable subtyping removed

`Option`, `Result` (replaces `Either`), `Ref`, `Deferred`, and `Fiber` are no
longer Effect subtypes and cannot be yielded in `Effect.gen` directly [raw/17].

| Value | v4 access | Source |
|---|---|---|
| `Option` | `Effect.fromOption(opt, onNone?)` | raw/17 |
| `Result` (ex-`Either`) | `Effect.fromResult(res)`; `Result.gen` for Result pipelines | raw/17 |
| `Ref` | `Ref.get(ref)` (yielding the ref itself no longer reads it) | raw/17 |
| `Deferred` | `Deferred.await(deferred)` | raw/17 |
| `Fiber` | `Fiber.join(fiber)` | raw/17 |
| `Config`, `Context.Service` | Still yieldable directly | raw/17 |

Rationale: v3 subtyping let `Effect.all` silently read arrays of refs; explicit
functions make the operation visible [raw/17].

## 6. Cause flattened

`Cause<E>` is now `{ reasons: ReadonlyArray<Fail<E> | Die | Interrupt> }`; the
`Empty`, `Sequential`, and `Parallel` variants are gone, `Cause.combine`
concatenates arrays [raw/18].

| v3 | v4 | Source |
|---|---|---|
| `Cause.failureOption` | `Cause.findErrorOption` (`findError` returns `Result`) | raw/18 |
| `Cause.isFailure/isDie/isInterrupted` | `Cause.hasFails/hasDies/hasInterrupts` | raw/18 |
| `NoSuchElementException` etc. | `*Error` suffix (`NoSuchElementError`, `TimeoutError`, `UnknownError`); `RuntimeException` and `InterruptedException` removed | raw/18 |
| (new) | `Cause.fromReasons`, `Cause.annotate`, `Cause.Done` graceful-completion signal | raw/18 |

## 7. Schema v4

| v3 | v4 | Source |
|---|---|---|
| `ParseResult.*` | `SchemaIssue.*` (`ParseIssue`→`SchemaIssue.Issue`, `Missing`→`MissingKey`, `Type`→`InvalidType`, `Unexpected`→`UnexpectedKey`, `Refinement`→`Filter`, `Transformation`→`Encoding`) | Context7 repo query, raw/14 |
| `decodeEither`/`encodeEither` | `Schema.decodeExit`/`encodeExit` (Exit parsing replaces Either) | raw/14 extract, raw/19 |
| `Schema.Literal(a, b)` | `Schema.Literal(value)` / `Schema.Null` / `Schema.Literals([...])` | Context7 repo query |
| `Schema.Union(A, B, ...)` | `Schema.Union([A, B])` (array argument) | Context7 repo query |
| `Schema.filter(pred)` | `Schema.check(Schema.makeFilter(pred))` or `Schema.refine` | Context7 repo query |
| `Schema.transform` / `transformOrFail` | `schema.pipe(Schema.decodeTo(target, SchemaTransformation/SchemeGetter...))` with `SchemaGetter.transform` / `transformEffect` | Context7 repo query, raw/19 |
| Decoders | `decodeUnknownResult` (issues as `Result` data), `decodeUnknownEffect` (services, async), `decodeUnknownSync` (throws), `fromJsonString` | raw/19 |
| Classes | `Schema.Class<Self>("Id")({...})` validates at construction; throws `Error` with `SchemaIssue.Issue` cause | raw/19 |
| Brands | `Schema.String.pipe(Schema.brand("PeopleId"))` | raw/19 |

## 8. Other core changes (indexed in MIGRATION.md, deep guides not archived)

Named in raw/13 but covered only by their index lines plus the full rename map
raw/14: forking (renamed combinators, `Effect.fork` → `Effect.forkChild` per
raw/17 example), fiber keep-alive (automatic process lifetime management),
`Runtime<R>` removed, scope changes, equality changes. The complete import and
API rename map is raw/14 (16,880 lines) and is the authoritative lookup for any
rename not tabled above.

## 9. Tooling and ecosystem

| Fact | Detail | Source |
|---|---|---|
| LSP | `@effect/tsgo`: TypeScript-Go build with Effect diagnostics; `npx @effect/tsgo setup`; tsconfig plugin name stays `@effect/language-service`; needs TypeScript 7 native | raw/10 |
| Testing | `@effect/vitest` companion package | raw/13 |
| Playground | effect.website/play for browser execution | raw/01 |
| Boundary discipline | Run effects only at the application edge; internals compose and return effects | raw/08 |

## 10. Gaps in this archive (stated, not smoothed)

- Stream, Schedule, Config, and workflow module docs were not archived (v4 doc
  set publishes them; time-boxed out of this sweep). Consult
  https://effect.website/docs/v4 and the API reference before asserting v4
  specifics there.
- Migration deep guides for forking, layer-memoization, fiberref, runtime,
  scope, equality, and schema.md were indexed but not individually archived;
  raw/14 rename map covers their mechanical renames.
- Community/vendor claims (blog posts on v4 adoption) were not swept; official
  docs and repo only, per forge policy.
- Codemods: existence referenced (api-diff tooling generates the migration
  reference) but no codemod availability was confirmed in the archive; do not
  claim automated migration without checking the repo.

## Source-to-file map

- raw/01 onboarding; raw/02 why-effect; raw/03 installation; raw/04
  importing-effect; raw/05 the-effect-type; raw/06 creating-effects; raw/07
  using-generators; raw/08 running-effects; raw/09 building-pipelines; raw/10
  devtools; raw/11 two-error-types; raw/12 basic-concurrency (all
  effect.website v4, fetched 2026-10-07).
- raw/13 MIGRATION.md; raw/14 migration/v3-to-v4.md; raw/15 services; raw/16
  error-handling; raw/17 yieldable; raw/18 cause (all Effect-TS/effect GitHub
  main, fetched 2026-10-07).
- raw/19 Schema v4 extract; raw/20 services/layers extract (effect.website v4
  via Context7, fetched 2026-10-07).
