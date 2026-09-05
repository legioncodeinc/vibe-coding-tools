# registerTool type error with zod 4.4.x (typescript-sdk#1987)
- URL: https://github.com/modelcontextprotocol/typescript-sdk/issues/1987
- Fetched: 2026-08-14
- Source type: GitHub issue (practitioner)
- Component: zod v3/v4 trap, ongoing SDK/zod version-skew

## Why this source

Shows the zod/SDK compatibility problem did not end when v4 support landed - it recurs at finer version granularity, most recently on `@modelcontextprotocol/sdk@1.29.0` with `zod@4.4.x` (April 2026). This matters for the broadened guide: "pin to zod/v3" is one fix from one moment in time; the durable rule is "verify your exact SDK version against your exact zod version before shipping," because the compatibility boundary keeps moving.

## Key facts

- **Symptom:** with SDK `1.29.0` + zod `4.4.1`, `registerTool` calls fail *TypeScript type-checking* (not runtime) with `Type 'ZodString' is not assignable to type 'AnySchema'` - the SDK's compatibility shim type (`AnySchema = z3.ZodTypeAny | z4.$ZodType` in `zod-compat.d.ts`) stops structurally matching zod 4.4's schema types.
- **This is compile-time only** - the reporter confirms "the code works at runtime but doesn't type-check," which is a different failure mode than issue #925's runtime crash, and easy to miss in a CI pipeline that doesn't run `tsc --noEmit` as a gate.
- **Root cause, deeper than a version bump:** a *module identity* problem. Package managers (bun, and pnpm/npm in some configurations) can install two separate copies of zod - one nested inside `node_modules/@modelcontextprotocol/sdk/node_modules/zod` (satisfying the SDK's own `^3.25` half of its peer-dependency range) and one at the top level for the project's own code. TypeScript then sees two structurally different `$ZodType` declarations and refuses to unify them, even though both are "zod v4."
- **Fix/workaround:** pin `zod` to `4.3.6` (satisfies both the SDK's peer dep `^3.25 || ^4.0` and a common downstream peer dep like the Vercel AI SDK's `^3.25.76 || ^4.1.8`), or force dependency deduplication with `"overrides": { "zod": "4.4.2" }` in `package.json` so only one zod instance exists in the tree.
- **Upstream response:** referenced by PR #1990, "fix(server): accept structurally compatible Zod v4 schemas" - an SDK-side fix rather than a docs-only "just pin harder" answer, confirming the SDK team treats this as their bug to fix, not purely a consumer misconfiguration.

## Relevance to this stinger

Reinforces that the "zod v3/v4 trap" is a *recurring class* of problem tied to (a) which SDK version you're on, (b) which zod minor/patch you're on, and (c) whether your package manager is deduplicating zod across the dependency tree - not a one-time fact to memorize. The broadened zod guide should tell a builder to check current pins for their exact `@modelcontextprotocol/sdk` version rather than copy a hardcoded "always import zod/v3" rule that may already be stale for a newer SDK release.
