# 23 - tsconfig for a SvelteKit app

**Primary context: SvelteKit app on Vercel.** This is the tsconfig discipline for THIS repo's actual deliverable (the SvelteKit app), not for a published npm package. See `guides/01-stack-enforcement.md` for the contrasting Node16/NodeNext answer that applies to the npm-library/CLI secondary case.

## Extend the generated config, don't fight it

A SvelteKit project's own `tsconfig.json` extends the config SvelteKit generates on every `svelte-kit sync`:

```json
{ "extends": "./.svelte-kit/tsconfig.json" }
```

`.svelte-kit/tsconfig.json` mixes two categories of options. Know the difference before touching either:

1. **Generated from your project's own configuration** (`paths` for `$lib`, `rootDirs`, `include`/`exclude` covering `src/`, `tests/`, `vite.config`) - regenerated automatically, don't hand-edit these, edit the source of truth (`svelte.config.js`, your file layout) instead.
2. **Required for SvelteKit to work at all** - `verbatimModuleSyntax: true`, `isolatedModules: true`, `noEmit: true`, `moduleResolution: "bundler"`, `module: "esnext"`, `target: "esnext"`, `lib: ["esnext", "DOM", "DOM.Iterable"]`. Overriding any of these without understanding why it's set is a finding.

Source: `references/research/raw/sveltekit--types--generated-tsconfig-pagedata-actiondata.md`.

## Why `moduleResolution: "bundler"`, not `Node16`/`NodeNext`

This is the single most common tsconfig question in a SvelteKit review, and the answer is not "SvelteKit is behind" - it's a deliberate, documented choice. TypeScript 4.7 added `Node16`/`NodeNext` resolution to unlock `package.json` `exports`/`imports` field resolution that plain `"node"` resolution can't see. SvelteKit's own maintainers evaluated switching to it and rejected it for the generated config, on the record: switching would force `.js` extensions on every relative import (including TS files, which reads oddly) and would break packages whose types aren't cleanly resolvable under strict Node resolution. `bundler` resolution (TypeScript 5.0+) was adopted instead because it matches what's actually happening: **Vite, a bundler, resolves imports for a SvelteKit app** - not Node's own runtime ESM loader, the way it would for a published npm package's consumers. Source: `references/research/raw/sveltekit--types--generated-tsconfig-pagedata-actiondata.md` (quotes the SvelteKit maintainer discussion directly).

**The rule for this repo**: SvelteKit app code (`apps/web` or equivalent) uses `bundler` resolution via the generated config. If this monorepo ever publishes a standalone npm package (a shared internal library, a CLI), that package's own tsconfig should use `Node16`/`NodeNext` instead, per `guides/01-stack-enforcement.md` - two different deliverable shapes get two different correct answers, not one universal rule.

## `verbatimModuleSyntax` and `isolatedModules`, and why they're both mandatory here

Both exist because of the same root cause: Vite (and by extension the Svelte compiler) type-checks and compiles **one file at a time**, not the whole program the way `tsc` normally can.

- `isolatedModules: true` flags any TypeScript construct that requires whole-program knowledge to compile correctly - a handful of legacy TS features (e.g. re-exporting a type without `export type`) are disallowed because Vite genuinely cannot compile them correctly per-file.
- `verbatimModuleSyntax: true` forces every type-only import to say so explicitly: `import type { Foo } from './foo'`, never a plain `import { Foo } from './foo'` that TypeScript would otherwise silently elide at compile time. Per-file compilation can't infer type-only-ness from context the way whole-program `tsc` can, so the source has to state it.

A PR that writes `import { SomeType } from './module'` where `SomeType` is only ever used as a type is a **must-fix** under this config - it will fail the Svelte compiler, not just draw a lint warning. This is the direct SvelteKit-app analog of the Hivemind case's "no CJS in an ESM module" rule (`guides/01-stack-enforcement.md`): both are "the runtime/toolchain constraint is stricter than what `tsc` alone would catch."

## `strict: true` is still non-negotiable

Nothing about the SvelteKit-specific options above touches `strict`. `strict: true` (bundling `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, etc.) applies identically to a SvelteKit app and to the Hivemind npm-library case - see `guides/12-strict-types-and-zod.md` for the boundary-validation discipline that goes with it. Loosening `strict` to satisfy a stubborn import is a **must-fix** in either context.

## Monorepo tsconfig sharing

`svelte.config.js`'s `kit.typescript.config` accepts a function that mutates (or returns a new) generated config - documented specifically as the mechanism for extending a shared root tsconfig in a monorepo. Paths configured there must be relative to `.svelte-kit/tsconfig.json`'s own location, not the workspace root - a common mistake when copy-pasting a root-relative path into this function. See `guides/28-pnpm-and-monorepo-options.md` for the monorepo layout this fits into.

## Common findings

- Overriding `moduleResolution`, `verbatimModuleSyntax`, `isolatedModules`, or `noEmit` in the app's own tsconfig without an explicit, documented reason - **must-fix** (breaks the build or silently reintroduces the class of bug these settings exist to catch).
- A plain-value import of a type-only symbol (`import { Foo }` instead of `import type { Foo }`) - **must-fix** under `verbatimModuleSyntax`.
- `strict: false` or a loosened strictness flag anywhere in the app's own tsconfig - **must-fix**.
- A hand-written route-param type instead of importing the generated `RouteParams`/`PageData`/etc. from `./$types` - **should-refactor** (works today, drifts silently the moment a route is renamed). See `guides/24-typing-sveltekit-load-actions-endpoints.md`.
- Applying `Node16`/`NodeNext` resolution reasoning to the SvelteKit app itself (e.g. adding `.js` extensions to relative imports "to be consistent with the Hivemind guide") - **should-refactor**, wrong context; that's the npm-library answer, not the SvelteKit-app answer.

## Sources

- `references/research/raw/sveltekit--types--generated-tsconfig-pagedata-actiondata.md`
- `references/research/distilled-typescript-node.md` section 1
