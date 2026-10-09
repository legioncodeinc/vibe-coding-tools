# Worked example: a v4 service, layer, and program

The canonical v4 wiring pattern, assembled from the archived docs
[distilled 3, distilled 7; raw/15, raw/20]. Use this shape when implementing a
new service or when checking existing code for v4 conformance.

```ts
import { Context, Effect, Layer, Schema } from "effect"

// 1. Define the service with the v4 class syntax (type params first, id last)
class Config extends Context.Service<Config, {
  readonly getConfig: Effect.Effect<{
    readonly logLevel: string
    readonly connection: string
  }>
}>()("Config") {
  // 2. A layer with no dependencies, named with the v4 `layer` convention
  static readonly layer = Layer.succeed(this, {
    getConfig: Effect.succeed({
      logLevel: "INFO",
      connection: "postgres://user:pass@host/db",
    }),
  })
}

class UserNotFound extends Schema.TaggedError<UserNotFound>()(
  "UserNotFound",
  { id: Schema.String },
) {}

// 3. A service whose construction is effectful and depends on another service
class UserService extends Context.Service<UserService, {
  readonly getUser: (id: string) => Effect.Effect<{ id: string; name: string }, UserNotFound>
}>()("UserService") {
  static readonly layer = Layer.effect(this, Effect.gen(function* () {
    const config = yield* Config // yield the service itself, v4 style
    return {
      getUser: (id: string) =>
        Effect.gen(function* () {
          const { connection } = yield* config.getConfig
          // ...query over connection; simulate:
          yield* Effect.log(`querying ${connection} for ${id}`)
          return { id, name: "Alice" }
        }),
    }
  })).pipe(Layer.provide(Config.layer)) // dependencies wired via Layer.provide
}

// 4. The program reads services via yield*, runs at the edge only
const program = Effect.gen(function* () {
  const users = yield* UserService
  return yield* users.getUser("42")
}).pipe(Effect.provide(UserService.layer))

await Effect.runPromise(program)
```

## Conformance checkpoints

1. Service classes extend `Context.Service<Self, Shape>()(id)` - not
   `Context.Tag`, `Effect.Tag`, or `Effect.Service` [raw/15].
2. No static accessor proxies (`Notifications.notify(...)`) - accessors are
   removed in v4; use `yield* Service` or `Service.use` [raw/15].
3. Layer naming is `X.layer` (typically a static class property), not `X.Default`
   or `XLive` [raw/15].
4. `Option`, `Result`, `Ref`, `Deferred`, `Fiber` are never yielded raw; the
   explicit function is used (`Effect.fromOption`, `Ref.get`,
   `Deferred.await`, `Fiber.join`) [raw/17].
5. `Effect.gen` bodies only; no `yield*` outside generators, no raw
   `async/await` inside effectful code [raw/07].
6. Effects run at the application edge (`runPromise`, `runSync`,
   `runPromiseExit`, `runFork`), never mid-library [raw/08].
7. Expected failures are typed in `E` (ideally tagged via
   `Schema.TaggedError`); defects stay untyped and are only inspected at
   boundaries [raw/11].
8. All `@effect/*` package versions match the core `effect` version exactly
   [raw/13].
