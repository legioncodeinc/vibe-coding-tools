# Effect v4 quick reference

Runtime lookup tables for the effect-wasp-drone. Every row cites the
distillation (`references/research/distilled.md`) which cites the raw archive.

## Core shape

```ts
// Effect<A, E, R>: success, error channel, requirements
const program = Effect.gen(function* () {
  const amount = yield* fetchAmount        // compose with yield*
  return yield* applyDiscount(amount, 5)   // typed errors flow in E
})
// run at the edge only
await Effect.runPromise(program)
```

Requirements: TypeScript 5.9+ (TS 7 recommended), Node 22.18+, Deno, Bun
[distilled 1].

## v3 to v4 rename tables

### Services and DI [distilled 3]

| v3 | v4 |
|---|---|
| `Context.GenericTag<T>(id)` | `Context.Service<T>(id)` |
| `class X extends Context.Tag(id)<Self, Shape>() {}` | `class X extends Context.Service<Self, Shape>()(id) {}` |
| `Effect.Tag` static accessors | `X.use((s) => ...)` / `X.useSync(...)`; prefer `yield* X` in `Effect.gen` |
| `Effect.Service` auto `.Default` layer | `Context.Service` + `{ make }`; layer via `static readonly layer = Layer.effect(this, this.make)` |
| `FiberRef` | `Context.Reference<T>(id, { defaultValue })` |
| `X.Default` / `XLive` naming | `X.layer` (+ `layerTest`, `layerConfig` variants) |

### Error handling [distilled 4]

| v3 | v4 |
|---|---|
| `Effect.catchAll` | `Effect.catch` |
| `Effect.catchAllCause` | `Effect.catchCause` |
| `Effect.catchAllDefect` | `Effect.catchDefect` |
| `Effect.catchSome` | `Effect.catchFilter` (Filter module, not Option) |
| `Effect.catchSomeCause` | `Effect.catchCauseFilter` |
| `Effect.catchSomeDefect` | removed |
| - | new: `catchReason`, `catchReasons`, `catchEager` |
| `Effect.catchTag` / `catchTags` / `catchIf` | unchanged |

### Yieldable removals [distilled 5]

| v3 (yieldable) | v4 (explicit) |
|---|---|
| `yield* option` | `yield* Effect.fromOption(opt, onNone?)` |
| `Either` module | `Result` module; `Effect.fromResult(res)` |
| `yield* ref` | `yield* Ref.get(ref)` |
| `yield* deferred` | `yield* Deferred.await(deferred)` |
| `yield* fiber` | `yield* Fiber.join(fiber)` |
| `Effect.fork(task)` | `Effect.forkChild(task)` |
| `Config`, `Context.Service` | still yieldable directly |

### Cause [distilled 6]

| v3 | v4 |
|---|---|
| tree: `Empty \| Fail \| Die \| Interrupt \| Sequential \| Parallel` | flat `cause.reasons: ReadonlyArray<Reason<E>>` with `Fail<E> \| Die \| Interrupt` |
| `Cause.failureOption(c)` | `Cause.findErrorOption(c)` |
| `Cause.isFailure / isDie / isInterrupted` | `Cause.hasFails / hasDies / hasInterrupts` |
| `NoSuchElementException` etc. | `NoSuchElementError`, `TimeoutError`, `UnknownError` |
| `Cause.sequential / parallel` | `Cause.combine` |

### Schema [distilled 7]

| v3 | v4 |
|---|---|
| `ParseResult.*` | `SchemaIssue.*` (`InvalidType`, `MissingKey`, `UnexpectedKey`, `Filter`, `Encoding`) |
| `decodeEither` / `encodeEither` | `Schema.decodeExit` / `encodeExit` |
| `Schema.Literal(a, b)` | `Schema.Literal(v)` / `Schema.Null` / `Schema.Literals([...])` |
| `Schema.Union(A, B)` | `Schema.Union([A, B])` |
| `Schema.filter(pred)` | `Schema.check(Schema.makeFilter(pred))` / `Schema.refine` |
| `Schema.transform` / `transformOrFail` | `schema.pipe(Schema.decodeTo(target, { decode, encode }))` with `SchemaGetter.transform` / `transformEffect` |
| decoder family | `decodeUnknownResult` (Result), `decodeUnknownEffect` (services), `decodeUnknownSync` (throws), `fromJsonString` |

## Package layout [distilled 1]

- Core `effect` now contains platform, rpc, cluster functionality.
- Separate: `@effect/platform-*`, `@effect/sql-*`, `@effect/ai-*`,
  `@effect/opentelemetry`, `@effect/atom-*`, `@effect/vitest` - all must match
  the core version exactly.
- No `effect/unstable/*` import paths; use `effect/http`, `effect/ai/...`.
  Stability is declared per API (`@stability unstable` breaks in minors,
  `experimental` in patches).

## Full rename map

`references/research/raw/14-github-effect--migration-v3-to-v4.md.md` (16,880
lines) is the authoritative complete import and API rename map. Consult it for
any rename not tabled above before guessing.
