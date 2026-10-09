# Source: Context7 extract - Effect v4 Schema (effect.website v4 docs)

- URL: https://effect.website/docs/v4/schema/transformations, https://effect.website/docs/v4/api/effect/Schema, https://effect.website/docs/v4/api/effect/SchemaParser
- Fetched: 2026-10-07 via Context7 library /websites/effect_website_v4 (query: "Schema: defining schemas, parsing and validating unknown data, decode and encode, SchemaClass")
- Source type: official documentation (Effect v4) retrieved through Context7

---

## decodeUnknownResult

Creates a decoder for `unknown` input that reports failure safely as a `Result`.
Use when decoding untyped boundary input and you want `SchemaIssue.Issue`
failures returned as data in a `Result`.

```typescript
declare function decodeUnknownResult<S extends ConstraintDecoder<unknown, never>>(schema: S, options?: ParseOptions): (input: unknown, options?: ParseOptions) => Result<S["Type"], Issue>
```

Remarks: this adapter runs synchronously. Causes made entirely of schema issues
become `Result.fail`, but causes that contain defects, interruptions, or
asynchronous work at this synchronous boundary throw instead. See
`decodeResult` for input already typed as the schema's `Encoded` type. See
`decodeUnknownEffect` for effectful or service-requiring decoding.

## Schema.fromJsonString

Creates a schema that decodes JSON text with JSON.parse and encodes with
JSON.stringify. Use Schema.Unknown when the parsed value can have any
JSON-compatible shape. Decoding an empty string throws a SchemaError.

```ts
import { Schema } from "effect"

const schema = Schema.fromJsonString(Schema.Unknown)
const decode = Schema.decodeUnknownSync(schema)

console.log(decode("{}")) // Output: {}
console.log(decode(`{"a":"b"}`)) // Output: { a: "b" }
decode("") // throws SchemaError: Expected a valid JSON string
```

## Schema.Class

Creates a schema-backed class whose constructor validates input against a
Struct schema. Construction throws an `Error` with a `SchemaIssue.Issue` in its
`cause` on invalid input. The `identifier` is the schema's stable runtime name,
used for diagnostics and hot module reload recognition.

```ts
import { Schema } from "effect"

class Person extends Schema.Class<Person>("Person")({
  name: Schema.String,
  age: Schema.Number
}) {}

const alice = new Person({ name: "Alice", age: 30 })
alice.name // => "Alice"
```

## Validating data with a service using Schema.decodeTo

Defines a Validation service and a branded PeopleId schema, then uses
Schema.decodeTo with SchemaGetter.transformEffect to validate a string
asynchronously.

```ts
import { Context, Effect, Schema, SchemaGetter, SchemaIssue, Layer } from "effect"

class Validation extends Context.Service<
  Validation,
  { readonly validatePeopleid: (s: string) => Effect.Effect<void, Error> }
>()("Validation") {}

const PeopleId = Schema.String.pipe(Schema.brand("PeopleId"))

const PeopleIdFromString = Schema.String.pipe(
  Schema.decodeTo(PeopleId, {
    decode: SchemaGetter.transformEffect((s) =>
      Effect.gen(function* () {
        const validator = yield* Validation
        yield* validator.validatePeopleid(s)
        return s
      }).pipe(
        Effect.mapError((e) => new SchemaIssue.InvalidValue({ message: e.message })),
      ),
    ),
    encode: SchemaGetter.passthrough(),
  }),
)

const SuccessTest = Layer.succeed(Validation, {
  validatePeopleid: (_) => Effect.void,
})

Effect.runPromiseExit(
  Schema.decodeUnknownEffect(PeopleIdFromString)("1").pipe(
    Effect.provide(SuccessTest),
  ),
).then(console.log)
// Output: { _id: 'Exit', _tag: 'Success', value: '1' }
```

Schema decode outputs in v4: `Result` (issues as data), `Exit` (decodeExit),
`Effect` (decodeUnknownEffect, supports services), plus sync variants
(decodeUnknownSync throws). Either decoding from v3 was replaced by Exit
parsing.

## Schema module summary (from the API page)

A schema can validate input, decode it into an application type, and encode
that value back to another representation. The module contains the main
schema, codec, decoder, and encoder APIs, schemas for common JavaScript
values and Effect data types, refinements, transformations, defaults,
classes, JSON Schema generation, test data generation, formatting,
equivalence, optics, and differs derived from schema definitions.
