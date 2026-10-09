# Source: Context7 extract - Effect v4 services and layers (effect.website v4 docs)

- URL: https://effect.website/docs/v4/requirements-management/layers, https://effect.website/docs/v4/api/effect/Effect, https://effect.website/docs/v4/api/effect/Layer
- Fetched: 2026-10-07 via Context7 library /websites/effect_website_v4 (query: "Services and dependency injection: Context.Service, layers, Layer.succeed, Layer.effect, Effect.provide, requirements")
- Source type: official documentation (Effect v4) retrieved through Context7

---

## Defining a service (v4 shape)

```typescript
import { Context, Effect, Layer } from "effect"

interface Database {
  readonly query: (sql: string) => Effect.Effect<string>
}

// class-based service definition (v4 canonical)
class Database extends Context.Service<Database, {
  readonly query: (sql: string) => Effect.Effect<string>
}>()("Database") {}

// functional form also exists:
const Database2 = Context.Service<Database>("Database")
```

## Building layers

```ts
const DatabaseLayer = Layer.succeed(Database)({
  query: Effect.fn("Database.query")((sql: string) =>
    Effect.succeed(`Result for: ${sql}`)),
})
```

`Layer.effect` constructs a layer from an effect that produces a single
service. The effect is executed in the scope of the layer, allowing resource
management (acquisition is scoped, `Scope` is excluded from the layer's
requirements):

```ts
declare const effect: {
  <I, S>(service: Key<I, S>): <E, R>(effect: Effect<S, E, R>) => Layer<I, E, Exclude<R, Scope>>;
  <I, S, E, R>(service: Key<I, S>, effect: Effect<NoInfer<S>, E, R>): Layer<I, E, Exclude<R, Scope>>;
}
```

`Service.use` accessor: `const program = Database.use((database) => database.query("SELECT 1"))`.

## Layer composition

```ts
const AppConfigLive = Layer.merge(ConfigLive, LoggerLive)

const MainLive = DatabaseLive.pipe(
  Layer.provide(AppConfigLive),
  Layer.provide(ConfigLive),
)

const runnable = Effect.provide(program, MainLive)
await Effect.runPromise(runnable)
```

A `Layer<ROut, E, RIn>` provides `ROut` services, may fail with `E` during
construction, and requires `RIn` services as dependencies. Merged layers
provide all their services; `Layer.provide` feeds dependencies to a layer,
hiding them from callers.

## Layer.effect with dependencies (full worked example shape)

```ts
const DatabaseLive = Layer.effect(
  Database,
  Effect.gen(function* () {
    const config = yield* Config
    const logger = yield* Logger
    return {
      query: (sql: string) => Effect.gen(function* () {
        yield* logger.log(`Executing query: ${sql}`)
        const { connection } = yield* config.getConfig
        return { result: `Results from ${connection}` }
      }),
    }
  }),
)

const userServiceWithDependencies = userServiceLayer.pipe(
  Layer.provide(Layer.mergeAll(databaseLayer, loggerLayer)),
)
```

Services are accessed by yielding the service class directly inside
`Effect.gen` (`const db = yield* Database`). `Effect.fn("Name")` wraps
functions for tracing-friendly spans.
