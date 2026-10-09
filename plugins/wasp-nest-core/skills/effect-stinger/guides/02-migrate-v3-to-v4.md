# Guide: migrate a v3 codebase to v4

Move an Effect v3 project to the v4 GA API mechanically and verifiably.
Sources: `references/research/raw/13` (MIGRATION.md index),
`raw/15` (services), `raw/16` (error handling), `raw/17` (yieldable),
`raw/18` (cause), `raw/14` (complete rename map).

## Step 1: Establish the baseline

1. Record current versions: `effect@3.x`, each `@effect/*` package.
2. Run the typecheck and test suite; capture the pre-migration state so every
   later delta is attributable.
3. Confirm no codemod assumptions: this archive found migration tooling that
   generates the reference docs, but no confirmed automated code codemod.
   Plan a manual, grep-driven pass [distilled 10].

## Step 2: Bump packages to one version

1. Set `effect` to the target v4 version; set every remaining `@effect/*`
   package to the same exact version [raw/13].
2. Fold in what was consolidated: `@effect/platform`, `@effect/rpc`,
   `@effect/cluster` functionality now imports from `effect` directly; delete
   those deps where the imports were the only use [raw/13].
3. Keep platform/driver packages (`@effect/platform-*`, `@effect/sql-*`,
   `@effect/ai-*`, `@effect/opentelemetry`, `@effect/vitest`) but at matching
   versions [raw/13].
4. Rewrite `effect/unstable/<mod>` imports to `effect/<mod>`; there are no
   compatibility exports [raw/13].

## Step 3: Apply the five structural migrations

Order matters; each is independently greppable.

1. **Services** [raw/15]: `Context.Tag` / `Context.GenericTag` / `Effect.Tag` /
   `Effect.Service` → `Context.Service` (class syntax: type params first, id
   last). Delete static accessor proxies; replace call sites with
   `yield* Service` (preferred) or `Service.use`. Rebuild `Effect.Service`
   `.Default` layers as explicit `Layer.effect(this, this.make)` with
   `Layer.provide` wiring. Rename `Default`/`Live` layers to `layer`.
   `FiberRef` → `Context.Reference`.
2. **Error handling** [raw/16]: `catchAll`→`catch`, `catchAllCause`→
   `catchCause`, `catchAllDefect`→`catchDefect`, `catchSome`→`catchFilter`
   (rewrite the `Option`-returning predicate as a `Filter.fromPredicate`),
   `catchSomeCause`→`catchCauseFilter`. `catchSomeDefect` has no replacement.
3. **Yieldable removals** [raw/17]: `Either`→`Result`; add
   `Effect.fromOption` / `Effect.fromResult` at former implicit-yield sites;
   `yield* ref` → `Ref.get(ref)`; `yield* deferred` → `Deferred.await`;
   `yield* fiber` → `Fiber.join`; `Effect.fork` → `Effect.forkChild`.
4. **Cause** [raw/18]: replace tree pattern-matching with `cause.reasons`
   iteration; swap extractors per the table (`failureOption`→
   `findErrorOption`, `isFailure`→`hasFails`, `sequential`/`parallel`→
   `combine`); `*Exception` classes → `*Error`.
5. **Schema** [raw/14, distilled 7]: `ParseResult` → `SchemaIssue`;
   `decodeEither`/`encodeEither` → `decodeExit`/`encodeExit`;
   `Literal(a, b)` → `Literal(a)` / `Literals([a, b])`; `Union(A, B)` →
   `Union([A, B])`; `filter` → `check(makeFilter(...))` / `refine`;
   `transform`/`transformOrFail` → `pipe(decodeTo(...))` with
   `SchemaGetter.transform` / `transformEffect`.

## Step 4: Sweep the remainder with the rename map

Grep the tree for any v3 import path left standing, then resolve it in
`references/research/raw/14-github-effect--migration-v3-to-v4.md.md` - the
complete import and API map. Modules also flagged in MIGRATION.md: forking
combinators, fiber keep-alive (now automatic), `Runtime<R>` (removed), scope
and equality changes [raw/13]. Do not guess a rename that the map does not
contain; check the live docs and note it.

## Step 5: Verify the migration

1. `tsc --noEmit`: v4 type errors surface exactly the leftover v3 shapes -
   treat each as a work item until zero.
2. Re-run the recorded test suite; compare against the step 1 baseline.
3. Grep-verify the five migrations left no stragglers:
   `Context.Tag\|Effect.Tag\|Effect.Service<`, `catchAll`, `Either\.`,
   `NoSuchElementException`, `ParseResult`, `unstable/`.
4. Behavioral deltas tests cannot catch: layer memoization across
   `Effect.provide` and automatic fiber keep-alive - review call sites that
   depended on re-execution or manual lifetime management [raw/13].

## Escalate

Schema-heavy surfaces that resist the tabled renames go to the effect
Discord/docs cited in raw/13 rather than improvised rewrites.
