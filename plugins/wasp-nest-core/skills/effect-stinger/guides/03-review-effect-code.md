# Guide: review Effect code

Audit an Effect codebase or diff for v4 conformance and Effect idioms. The
checkpoints condense `references/worked-example-service.md` and the
distillation tables; each finding cites its source.

## Version and packaging

- [ ] `effect` and every `@effect/*` dependency share one exact version
  [raw/13]. Mismatch is a blocker: v4 packages release in lockstep.
- [ ] No `effect/unstable/*` import paths [raw/13].
- [ ] TypeScript 5.9+ (7 recommended), Node 22.18+/Deno/Bun [raw/03].

## API conformance (v3 leftovers are findings)

- [ ] No `Context.Tag`, `Context.GenericTag`, `Effect.Tag`, or `Effect.Service`
  definitions; all services extend `Context.Service<Self, Shape>()(id)`
  [raw/15].
- [ ] No static accessor-proxy call sites; service access is `yield* Service`
  or `Service.use` [raw/15].
- [ ] No `catchAll`, `catchAllCause`, `catchAllDefect`, `catchSome`,
  `catchSomeCause` [raw/16].
- [ ] No `Either` (replaced by `Result`), no raw yields of `Option`, `Result`,
  `Ref`, `Deferred`, `Fiber`; explicit `Effect.fromOption`, `Effect.fromResult`,
  `Ref.get`, `Deferred.await`, `Fiber.join` instead [raw/17].
- [ ] No v3 Cause tree matching (`Sequential`, `Parallel`, `Empty` variants,
  `isSequentialType`); iterate `cause.reasons` [raw/18].
- [ ] No `*Exception` names from Cause (`NoSuchElementException` and friends);
  v4 is `*Error` [raw/18].
- [ ] No `ParseResult` usage; `SchemaIssue`, `decodeExit`, `decodeTo`,
  `SchemaGetter` are the v4 surface [distilled 7].
- [ ] Layer names follow `X.layer` convention, not `Default`/`Live` [raw/15].

## Idiom quality

- [ ] `Effect.run*` appears only at the application edge; library code composes
  and returns effects [raw/08].
- [ ] Expected failures are typed and ideally tagged (`Schema.TaggedError`,
  `catchTag`-able); defects are not swallowed mid-domain - `catchDefect` /
  `catchCause` appear only at boundaries [raw/11].
- [ ] Error recovery uses the narrowest operator: `catchTag` before `catch`;
  `catchFilter` (not blanket `catch`) for partial recovery [raw/16].
- [ ] Layers use `Layer.succeed` for constants and `Layer.effect` for scoped
  construction; dependencies wired with `Layer.provide`, not ambient
  [raw/20].
- [ ] Bounded concurrency is explicit (`Effect.all` with `concurrency`);
  nothing forks unbounded [raw/12].
- [ ] Generator bodies don't hide sync work in `Effect.sync`/`promise` where a
  plain function would do; and conversely no `async/await` inside effectful
  code [raw/06, raw/07].

## Stability discipline

- [ ] Unstable-module usage (`http`, `rpc`, `schema`, `sql`, `ai`, `cluster`,
  `workflow`, ...) is pinned and expected to break on minors; flag it in the
  report so upgrades are planned [raw/13].
- [ ] APIs typed as third-party options (driver clients, provider schemas) are
  `@stability unstable` by definition; wrap them behind an owned service
  [raw/13].

## Reporting

Group findings: version/packaging blockers, v3-conformance findings, idiom
suggestions. For each, cite the raw file (as this guide does) so the author
can verify. Anything this archive does not ground (streams, schedules,
workflows specifics - see distilled section 10) gets checked against
https://effect.website/docs/v4 before it becomes a finding, or is reported as
unverified.
