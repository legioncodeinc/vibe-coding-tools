---
name: "typescript-node-stinger"
description: "Modern TypeScript/Node practice for this Hive's stack. SvelteKit (Svelte 5) on Vercel as the primary case: tsconfig (bundler resolution, verbatimModuleSyntax), typed load functions/form actions/+server.ts, Drizzle type inference, zod vs valibot at boundaries, Vitest plus Playwright, Biome vs ESLint, pnpm and monorepo choice, Node-on-Vercel policy. Also fully supports the legacy npm library/CLI publishing case (Hivemind stack: strict ESM on Node16 resolution, esbuild bundling, zod v3/v4 MCP split, jscpd, no ESLint/Prettier). Use when reviewing, refactoring, or authoring TypeScript or Node code in either context."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork.
metadata:
  hive-tier: stinger
  hive-bee: typescript-node-worker-bee
  research-window: 2026-08-14 (SvelteKit/general sweep), 2026-06-16 (Hivemind-era sweep)
  primary-surface: sveltekit-vercel-typescript
---

# typescript-node-stinger

You are equipping **typescript-node-worker-bee**, the Hive's TypeScript/Node specialist. This skill covers modern TypeScript/Node practice as it actually applies to this repo's stack: SvelteKit (Svelte 5) deployed to Vercel with Neon Postgres and Drizzle ORM as the PRIMARY case, and it fully preserves the npm library/CLI publishing case (Hivemind) it was originally forged for as a SECONDARY, still-supported case.

Every factual claim in the SvelteKit-case guides traces to a downloaded primary source in `references/research/raw/`. Do not author a TypeScript/Node fact from training data - if it is not archived, it is not a fact yet. The Hivemind-case guides trace to the earlier `research/` folder from the 2026-06-16 pass, preserved as-is.

**Opinionation is the product.** When you answer, say "do X, not Y" with reasoning and a citation - not "here are options." The one exception is the handful of genuinely current, still-open tradeoffs this pass researched (Biome vs ESLint, zod vs valibot, pnpm vs alternatives, Turborepo vs Nx) - those get a decision guide with a stated default, not a false sense of settled consensus.

## When to use this skill

- Reviewing, refactoring, or authoring TypeScript/Node code anywhere in this repo
- Setting up or auditing a SvelteKit app's `tsconfig.json`, `verbatimModuleSyntax`, or `moduleResolution`
- Typing a `load` function, a form action, a `+server.ts` endpoint, or the `App.Locals`/`App.PageData` ambient types
- Writing TypeScript that reads or writes through Drizzle (the type-inference layer around it, not the schema/migration design itself)
- Choosing or reviewing zod vs valibot at a validation boundary
- Setting up or auditing Vitest (unit/component) or Playwright (e2e) for a SvelteKit app
- Deciding Biome vs ESLint+Prettier, or auditing an existing lint/format setup
- Choosing a package manager or a monorepo tool (pnpm, Turborepo, Nx) for this stack
- Pinning or auditing `engines.node` against Vercel's supported-version policy
- Any of the legacy Hivemind-case triggers: "Hivemind code review", "add a zod-validated MCP tool", "add a column to a Deep Lake table", "fix the esbuild bundle", "wire a new harness", "jscpd is failing", "publish/pack-check"
- Or whenever `typescript-node-worker-bee` is invoked

Do NOT use for Vercel platform configuration (adapter, ISR, env vars, cron, images, middleware, firewall, cost - `vercel-stinger`), Drizzle schema design/migrations/connection pooling/RLS (`neon-drizzle-stinger`), Svelte 5 component/markup authoring and runes idiom (`svelte-stinger`), secrets/env mechanics (`doppler-stinger`), a formal security audit (`security-stinger`), repo hygiene (`github-repo-health-stinger`), Deep Lake schema design from a data-engineering POV (`vector-store-worker-bee`), recall/embeddings strategy (`retrieval-worker-bee`/`embeddings-runtime-worker-bee`), or PRD authoring (`library-worker-bee`).

## What Hivemind is (the legacy case this skill was originally forged for)

`@deeplake/hivemind` v0.7.x - Activeloop's open-source "one brain for all your agents": cloud-backed shared memory and skill propagation for coding agents. The loop is Capture -> Codify (skillify) -> Search (recall) -> Propagate. Persistence is Activeloop Deep Lake reached over an HTTP SQL API, not Postgres, not Drizzle. **This is the legacy case this skill was originally forged for, still fully supported for that use case** - if you're working inside Hivemind itself, or any other repo shaped like it (a published npm package/CLI), the guides marked "Legacy/library case" below are your authority, unchanged from the original forging. If you're working in THIS repo's actual SvelteKit app, they are reference material for what a different kind of TypeScript/Node deliverable looks like, not your primary guidance.

---

## First move on every invocation

1. **Classify the project.** SvelteKit app on Vercel (primary case), npm library/CLI (Hivemind, secondary case), or something else. See `guides/00-principles.md`'s "First move" section for the concrete signals to check.
2. **Read `package.json` and the matching tsconfig.** For the SvelteKit case: `svelte.config.js` + the generated `.svelte-kit/tsconfig.json` (`moduleResolution: "bundler"`, `verbatimModuleSyntax: true`). For the Hivemind case: `tsconfig.json` directly (`module`/`moduleResolution: Node16`, `target: ES2022`, `strict: true`).
3. **Classify the invocation.** Route to the matching guide per the table below.
4. **Read `guides/00-principles.md`** before writing any finding - the classification checklist, severity rubric, and cross-Bee handoff rules all live there.

---

## Routing table

### SvelteKit / general TypeScript (primary case)

| Invocation | Primary guide(s) | Output |
|---|---|---|
| TypeScript/Node code review (SvelteKit app) | `guides/00-principles.md`, `guides/02-project-layout-esm.md` | Standalone: `library/requirements/reports/typescript/<date>-code-review.md`. Feature-tied: `library/requirements/<lifecycle>/prd-<###>-<title>/reports/<date>-ts-review.md` |
| tsconfig / module-resolution question | `guides/23-tsconfig-for-sveltekit.md` | tsconfig findings + fix |
| Typing a `load` function, form action, or `+server.ts` | `guides/24-typing-sveltekit-load-actions-endpoints.md` | Typed route code + findings |
| TypeScript patterns around Drizzle queries | `guides/25-drizzle-type-inference-patterns.md` | Findings; hand off schema/migration design to `neon-drizzle-stinger` |
| zod / valibot at a boundary | `guides/12-strict-types-and-zod.md` (2026 update section) | Validation schema + boundary review |
| Vitest unit/component setup, Playwright e2e | `guides/26-vitest-playwright-for-sveltekit.md` | Test layer plan + config review |
| Biome vs ESLint+Prettier decision or audit | `guides/27-biome-vs-eslint-prettier.md` | Decision + migration plan or config review |
| Package manager / monorepo tooling choice | `guides/28-pnpm-and-monorepo-options.md` | Recommendation + migration notes |
| `engines.node` / Vercel Node-version audit | `guides/29-node-version-policy-on-vercel.md` | Pin recommendation + deprecation check |
| Async/concurrency audit (either case) | `guides/08-async-concurrency.md` | Concurrency-bounding + batching review |
| Error-handling audit (either case) | `guides/09-error-handling.md` | Swallowed-catch + error-shape findings |
| Strict types / `any`-elimination (either case) | `guides/12-strict-types-and-zod.md` | `any`-elimination plan |
| Node runtime feature question (either case) | `guides/16-node22-runtime.md`, `guides/29-node-version-policy-on-vercel.md` | Runtime-feature + version-policy audit |
| Common footguns scan (either case) | `guides/22-common-failure-modes.md` + the "Common findings" sections in `guides/23`-`29` | Findings list |
| ADR | Relevant topic guide + cross-Stinger `templates/ADR.md` | `library/knowledge/private/architecture/ADR-<n>-<topic>.md` |

### npm library / CLI publishing - Hivemind (secondary case, clearly labeled)

| Invocation | Primary guide(s) | Output |
|---|---|---|
| ESM / import-resolution audit (Node16/NodeNext) | `guides/01-stack-enforcement.md`, `guides/02-project-layout-esm.md` | Findings list with file:line |
| Deep Lake query / SQL-API audit | `guides/03-deeplake-sql-api.md`, `examples/02-deeplake-query-with-retry-and-semaphore.md` | Findings: un-batched queries, missing Semaphore, missing SQL guards |
| esbuild bundle change | `guides/04-esbuild-bundling.md`, `examples/08-add-an-esbuild-bundle-entry.md` | Updated bundle entry + sync-versions/define check |
| Add / review an MCP tool | `guides/05-mcp-sdk-tools.md`, `examples/01-zod-validated-mcp-tool.md` | Tool with zod/v3 inputSchema + error handling |
| just-bash / VFS work | `guides/06-just-bash-vfs.md` | Shell-engine usage review |
| Harness model question | `guides/07-harness-model.md`, `examples/06-wire-a-new-harness-install-path.md` | Per-harness bundle + install-path plan |
| Vitest setup / audit (Hivemind's tests/ mirroring harnesses) | `guides/10-vitest-discipline.md`, `guides/11-vitest-async-fixtures.md` | tests/ layout + fixture plan + coverage report |
| jscpd / quality-gate failure | `guides/13-jscpd-and-quality-gate.md` | Dedup plan + gate explanation |
| npm / publishing question | `guides/14-npm-and-publishing.md`, `guides/18-publish-and-pack-check.md` | `files` allowlist + prepack/pack-check check |
| Deep Lake schema change | `guides/15-deeplake-schema-healing.md`, `examples/05-add-a-column-via-healmissingcolumns.md` | ColumnDef edit + healing verification |
| Secrets / SQL-injection guard (Deep Lake) | `guides/17-secrets-and-sql-guards.md` | Token-handling + sqlStr/sqlLike/sqlIdent findings; handoff to `security-worker-bee` |
| tree-sitter graph work | `guides/19-tree-sitter-graph.md` | Grammar + optional-dep handling review |
| CLI / scripts | `guides/20-cli-and-scripts.md` | yargs-parser CLI + scripts/*.mjs patterns |
| Deep Lake SDK / HF transformers | `guides/21-deeplake-sdk-and-hf.md` | SDK usage + optional-dep guard review |

---

## Hard rules

### SvelteKit / general case (primary)

| # | Rule | Guide |
|---|---|---|
| 1 | **`moduleResolution: "bundler"` for the SvelteKit app; extend the generated `.svelte-kit/tsconfig.json`, don't fight it.** No `.js` extensions on relative TS imports in this context. | `guides/23-tsconfig-for-sveltekit.md` |
| 2 | **`verbatimModuleSyntax: true` means type-only imports must say so.** `import type { Foo }`, never a bare `import { Foo }` for a type-only symbol. | `guides/23-tsconfig-for-sveltekit.md` |
| 3 | **`strict: true` is non-negotiable in every context.** No loosening to satisfy a stubborn import. | `guides/23-tsconfig-for-sveltekit.md`, `guides/12-strict-types-and-zod.md` |
| 4 | **Always import route types from `./$types`**, never hand-write `RouteParams`/`PageData`/`Actions`. | `guides/24-typing-sveltekit-load-actions-endpoints.md` |
| 5 | **A universal `load` must explicitly forward a server `load`'s data** via its `data` argument - it does not happen automatically. | `guides/24-typing-sveltekit-load-actions-endpoints.md` |
| 6 | **`handle` does not re-run after a form action.** Code relying on `event.locals` reflecting a cookie the current action just changed is wrong. | `guides/24-typing-sveltekit-load-actions-endpoints.md` |
| 7 | **Drizzle relational-query callbacks reference the callback's own aliased table, never the directly-imported table object**, inside nested/self-referential `where`/`orderBy`/`extras`. | `guides/25-drizzle-type-inference-patterns.md` |
| 8 | **Never hand-write a type duplicating a Drizzle table's shape.** Use `$inferSelect`/`$inferInsert`. | `guides/25-drizzle-type-inference-patterns.md` |
| 9 | **zod by default for this app's server-side validation**; evaluate valibot only for code that actually ships into a client component or edge function. | `guides/12-strict-types-and-zod.md` |
| 10 | **Vitest for mocked component/unit tests, Playwright for unmocked e2e** - the split is what's mocked, not file size. | `guides/26-vitest-playwright-for-sveltekit.md` |
| 11 | **`biome ci` (no auto-fix) in CI gates, `biome check --write` only locally/pre-commit.** | `guides/27-biome-vs-eslint-prettier.md` |
| 12 | **pnpm workspaces + Turborepo is this stack's default**, not npm. | `guides/28-pnpm-and-monorepo-options.md` |
| 13 | **Pin `engines.node` explicitly** (`"22.x"` or `"24.x"`); an unset or unbounded value drifts silently with Vercel's dashboard default. | `guides/29-node-version-policy-on-vercel.md` |
| 14 | **No `any` at boundaries; no swallowed errors.** Applies identically in every context. | `guides/12-strict-types-and-zod.md`, `guides/09-error-handling.md` |

### npm library / CLI publishing - Hivemind (secondary case)

| # | Rule | Guide |
|---|---|---|
| 15 | **ESM only, `.js` extensions on relative imports under Node16/NodeNext resolution** - the opposite of rule 1 above, correct for THIS context only. | `guides/01-stack-enforcement.md` |
| 16 | **zod at every external boundary; `zod ^4` in the app, `zod/v3` in the MCP server.** | `guides/12-strict-types-and-zod.md` |
| 17 | **Deep Lake queries go through the SQL-API client**, bounded by `Semaphore(5)`, never hand-rolled `fetch`. | `guides/03-deeplake-sql-api.md` |
| 18 | **SQL string interpolation is guarded** via `sqlStr`/`sqlLike`/`sqlIdent`. | `guides/17-secrets-and-sql-guards.md` |
| 19 | **Deep Lake schema is single-sourced**; column adds go through `healMissingColumns`, never a hand-rolled ALTER. | `guides/15-deeplake-schema-healing.md` |
| 20 | **The version is single-sourced** via `package.json` + `sync-versions.mjs` + esbuild `define`. | `guides/04-esbuild-bundling.md` |
| 21 | **The quality gate is `tsc` + `jscpd` + husky - no ESLint, no Prettier.** Do not import the SvelteKit-case Biome/ESLint decision into this context. | `guides/13-jscpd-and-quality-gate.md` |
| 22 | **The `files` allowlist is the publish contract**; `prepack` builds, `pack-check` verifies. | `guides/18-publish-and-pack-check.md` |
| 23 | **Optional deps (`@huggingface/transformers`, tree-sitter) are guarded**, never a hard top-level import. | `guides/21-deeplake-sdk-and-hf.md` |

---

## Severity rubric

Every finding is classified:

- **Must-fix** - correctness bug, swallowed error, `any` crossing a boundary, missing validation on external input, un-guarded SQL interpolation, a wrong-context import-extension or module-resolution rule applied, loosened tsconfig strictness, a CI lint/format gate that auto-fixes instead of failing, hardcoded token/key, and (Hivemind case) hand-rolled Deep Lake fetch, hand-rolled ALTER, hardcoded version string, CJS in an ESM module. Blocks merge.
- **Should-refactor** - duplication near a gate threshold, a missing test for a new exported function, an un-pinned/unbounded `engines.node`, a package-manager or monorepo-tool proposal made as a drive-by without a migration plan, a decision-guide tradeoff (Biome vs ESLint, zod vs valibot, pnpm vs npm) applied without checking whether the stated reasoning actually transfers to this stack. Cannot block a time-sensitive PR but opens a follow-up.
- **Style** - naming preference, import grouping. Never block on style alone.

Severity is the finding's credibility. Calling a style nit "must-fix" destroys trust.

---

## Cross-Bee handoffs

| Concern | Owner | typescript-node-stinger's role |
|---|---|---|
| Vercel platform config (adapter, ISR, env vars, cron, images, middleware, firewall, cost, domains) | `vercel-worker-bee` | Own `engines.node` and the TypeScript/build-adjacent concerns only |
| Neon/Drizzle schema design, migrations, connection pooling, RLS | `neon-drizzle-worker-bee` | Own the TS type-inference patterns around Drizzle, not the ORM/database design |
| Svelte 5 component/markup authoring, runes idiom, SvelteKit patterns beyond typing | `svelte-worker-bee` | Own the TypeScript typing layer for `load`/actions/`+server.ts` |
| Secrets/env mechanics (Doppler project/config, CLI, rotation) | `doppler-worker-bee` | Consume env vars through the typed boundary this skill enforces |
| Security audit (auth, injection, secret scanning, credential lifecycle) | `security-worker-bee` | Ensure guarded interpolation + env-only secrets are in place; audit is theirs |
| Post-implementation QA | `quality-worker-bee` | Provide the Vitest/Playwright suite as audit evidence |
| Repo hygiene, branch protection, CI workflow density | `github-repo-health-worker-bee` | Part of the Ship Gate below |
| Deep Lake table/index design from a data-engineering POV (Hivemind case) | `vector-store-worker-bee` | Own the TS access patterns + `deeplake-schema.ts` mechanics |
| Recall ranking, embeddings strategy, evals (Hivemind case) | `retrieval-worker-bee` and `embeddings-runtime-worker-bee` | Provide the TS implementation under it |
| Docker, CI runners, release automation, cloud (Hivemind case) | `ci-release-worker-bee` | Co-own the build + `npm run ci` shape and the harness bundle outputs |
| PRD authoring | `library-worker-bee` | Provide the architectural rationale that goes into the PRD |

---

## Output paths

Reports land in the **host repo's `library/` tree**, never inside this Stinger. There is no `reports/` subfolder in the Stinger.

- **Standalone reviews / audits** -> `library/requirements/reports/typescript/<date>-<topic>.md`
- **Feature-tied** -> `library/requirements/<lifecycle>/prd-<###>-<title>/reports/<date>-<type>-report.md`
- **Issue-tied** -> `library/issues/<lifecycle>/ird-<###>-<title>/reports/<date>-<type>-report.md`
- **ADRs** -> `library/knowledge/private/architecture/ADR-<n>-<topic>.md`

---

## Guides

Numbered so order is obvious. Read `00-principles.md` on every invocation - its "First move" section routes you to the right set below.

**SvelteKit / general (primary case):**

- `guides/00-principles.md` - project-type classification, first-move checklist, severity rubric, cross-Bee boundaries.
- `guides/02-project-layout-esm.md` - SvelteKit `src/routes`/`src/lib` layout and its ESM import rules, alongside the Hivemind `src/` layout for contrast.
- `guides/08-async-concurrency.md` - async/await correctness, batching, concurrency bounding (applies to both cases).
- `guides/09-error-handling.md` - narrow, surface, never swallow (applies to both cases).
- `guides/12-strict-types-and-zod.md` - strict TS, no `any` at boundaries, zod vs valibot including the 2026 update for this stack.
- `guides/16-node22-runtime.md` - Node runtime features (applies to both cases); see `29` for the Vercel-specific version policy.
- `guides/22-common-failure-modes.md` - the Hivemind-era footgun catalog, cross-referencing the SvelteKit-case "Common findings" sections in `23`-`29`.
- `guides/23-tsconfig-for-sveltekit.md` - `moduleResolution: "bundler"`, `verbatimModuleSyntax`, why SvelteKit's generated tsconfig looks the way it does.
- `guides/24-typing-sveltekit-load-actions-endpoints.md` - `load` return-type inference, form action typing, `+server.ts`, `App.Locals`/`App.PageData`.
- `guides/25-drizzle-type-inference-patterns.md` - `$inferSelect`/`$inferInsert`, the relational query builder's typing rules; links to `neon-drizzle-stinger` for schema/migrations.
- `guides/26-vitest-playwright-for-sveltekit.md` - `vitest-browser-svelte`/`@testing-library/svelte` component testing, Playwright e2e, the mocked-vs-unmocked split.
- `guides/27-biome-vs-eslint-prettier.md` - the current tradeoff and this skill's default for a Svelte-first codebase.
- `guides/28-pnpm-and-monorepo-options.md` - pnpm as default, Turborepo vs Nx and when each earns its place.
- `guides/29-node-version-policy-on-vercel.md` - which Node majors Vercel supports, `engines.node` pinning, the Node 20 deprecation timeline.

**npm library / CLI publishing - Hivemind (secondary case, clearly labeled in each guide):**

- `guides/01-stack-enforcement.md` - ESM + Node 22 + tsconfig Node16/ES2022/strict; the Hivemind dependency set; substitution policy.
- `guides/03-deeplake-sql-api.md` - the Deep Lake SQL-API client: `query()`, retry, `Semaphore(5)`, batching.
- `guides/04-esbuild-bundling.md` - the multi-harness bundle model, `sync-versions.mjs`, esbuild `define` version inlining.
- `guides/05-mcp-sdk-tools.md` - `McpServer.registerTool`, zod/v3 inputSchema, the search/read/index tool shape.
- `guides/06-just-bash-vfs.md` - just-bash as the VFS shell engine over Deep Lake.
- `guides/07-harness-model.md` - the per-harness packaging model.
- `guides/10-vitest-discipline.md` - `vitest run`, coverage-v8, `tests/` mirroring `harnesses/`.
- `guides/11-vitest-async-fixtures.md` - mocking the Deep Lake client, fixtures, temp-dir patterns.
- `guides/13-jscpd-and-quality-gate.md` - jscpd threshold 7, `npm run ci`, no ESLint/Prettier by design.
- `guides/14-npm-and-publishing.md` - npm (not pnpm here), the `files` allowlist, scoped publish.
- `guides/15-deeplake-schema-healing.md` - `ColumnDef`, `buildCreateTableSql`, `healMissingColumns`.
- `guides/17-secrets-and-sql-guards.md` - tokens via env/config only; sqlStr/sqlLike/sqlIdent.
- `guides/18-publish-and-pack-check.md` - `prebuild` -> `build` -> `prepack`, `pack-check.mjs`.
- `guides/19-tree-sitter-graph.md` - tree-sitter + grammars as optional deps for the codebase graph.
- `guides/20-cli-and-scripts.md` - the `hivemind` bin, yargs-parser CLI, `scripts/*.mjs`.
- `guides/21-deeplake-sdk-and-hf.md` - the deeplake SDK, `@huggingface/transformers` as an optional dep.

## Templates

`templates/tsconfig.json` (the Hivemind-case canonical compiler config - not the SvelteKit case, which extends its own generated config per `guides/23`), `templates/vitest.config.ts`, `templates/schema.ts` (a zod boundary module), `templates/esbuild-entry.mjs`, `templates/example.test.ts`, `templates/husky-pre-commit` + `templates/lint-staged.config`, `templates/package-scripts.json`. All Hivemind-case artifacts; no SvelteKit-case templates exist yet in this Stinger.

## Scripts

`scripts/audit-untyped-boundaries.mjs`, `scripts/audit-unbatched-queries.mjs`, `scripts/audit-hardcoded-secrets.mjs`, `scripts/audit-swallowed-catch.mjs`, `scripts/audit-schema-drift.mjs`, `scripts/check-esm-node22.mjs`. All Hivemind-case tooling (invocation instructions in `scripts/README.md`); several (`audit-untyped-boundaries.mjs`, `audit-hardcoded-secrets.mjs`, `audit-swallowed-catch.mjs`) are general enough to run against SvelteKit-app TypeScript too - verify their glob targets `src/` correctly for a SvelteKit layout before relying on them there.

## Examples

`examples/01-zod-validated-mcp-tool.md`, `examples/02-deeplake-query-with-retry-and-semaphore.md`, `examples/03-vitest-suite-for-a-recall-function.md`, `examples/05-add-a-column-via-healmissingcolumns.md`, `examples/06-wire-a-new-harness-install-path.md`, `examples/08-add-an-esbuild-bundle-entry.md`. All Hivemind-case worked examples; no SvelteKit-case examples exist yet in this Stinger.

## References (the alternatives we don't pick, or the current open tradeoff)

`references/README.md`, `references/tsc-vs-babel.md`, `references/vitest-vs-jest.md`, `references/esbuild-vs-tsup.md`, `references/zod-vs-valibot.md`, `references/npm-vs-pnpm.md` - all Hivemind-era demoted-alternatives docs, preserved as-is. **Active SvelteKit-case recommendations live in `guides/23`-`29`, including the still-open 2026 tradeoffs (Biome vs ESLint, zod vs valibot, pnpm vs alternatives, Turborepo vs Nx) - these are decision guides with a stated default, not settled "we don't pick this" verdicts the way the Hivemind-era references are.**

## Research

Two research trails, kept separate:

- `references/research/raw/` + `references/research/distilled-typescript-node.md` - the 2026-08-14 SvelteKit/general-TypeScript pass. Every guide numbered `23`-`29`, plus the 2026-update section of `guides/12`, cites this trail.
- `research/research-plan.md` + dated notes - the original 2026-06-16 Hivemind-era pass. Every Hivemind-case guide cites this trail. Untouched by this pass.

---

## Output conventions

- **All file paths in findings are absolute** when referencing project files. Relative when referencing guides in this Stinger.
- **Every claim is sourced.** Either a guide section, a `references/research/raw/` file, or a file in the repo.
- **Do not invent versions.** Read them from `package.json`.
- **Never approve a PR that breaks a Hard Rule above** - but only block on Must-fix severity.

## When in doubt

- Unfamiliar pattern in the repo? Read the actual source before asserting.
- New pattern from a blog post? Mark it "experimental" and cite the source.
- Hand off the moment a question crosses a boundary in the cross-Bee table.
- Not sure which case applies? Re-run the classification in `guides/00-principles.md`'s "First move" section rather than guessing.

## Quality bar

A TypeScript/Node task run through this skill is done when: the project type was classified correctly (SvelteKit app vs npm library/CLI) before any guide was applied, the relevant guide(s) were read in the right set (not mixing a Hivemind-case rule into the SvelteKit case or vice versa), every factual claim used in the output traces to `references/research/raw/` for the SvelteKit case (or `research/` for the Hivemind case), and - for anything development-focused - the Ship Gate below completed with user approval before commit or push.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [vercel-stinger](../vercel-stinger) - Vercel deploy/build specifics, Node version selection on Vercel, ISR/caching. Consult for anything beyond the `engines.node` field this skill owns.
  - [neon-drizzle-stinger](../neon-drizzle-stinger) - Drizzle schema design, migrations, connection pooling, RLS. This skill covers the TypeScript patterns AROUND Drizzle, not Drizzle itself.
  - [svelte-stinger](../svelte-stinger) - Svelte 5 runes and component authoring. This skill covers the TypeScript/Node fundamentals underpinning SvelteKit, not component markup itself.
  - [doppler-stinger](../doppler-stinger) - secrets/env handling mechanics. Consult for the Doppler side of the env-typing guidance in this skill.
  - [security-stinger](../security-stinger) - Security audit pass, first gate of the Ship Gate pipeline below.
  - [quality-stinger](../quality-stinger) - Post-implementation QA pass, second gate of the Ship Gate pipeline below.
  - [github-repo-health-stinger](../github-repo-health-stinger) - Repo hygiene audit, orchestrator-level final Ship Gate step below.
  - [tanstack-stinger](../tanstack-stinger) - TanStack Query/Table/Form usage in the same SvelteKit stack, when a page's data layer uses TanStack alongside SvelteKit's own `load`/remote functions.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.

---

*Part of The Hive, curated by [Mario Aldayuz a.k.a @thenotoriousllama].*
