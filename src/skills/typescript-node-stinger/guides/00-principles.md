# 00 - Principles

The non-negotiables. Read on every invocation.

## First move: what kind of TypeScript/Node project is this?

Before anything else - before reading `package.json` even - work out which case applies. This skill covers two, and they take different tsconfig, package-manager, testing, and lint/format answers. Do not assume every repo is shaped like Hivemind; that used to be a safe assumption when this skill only had one case, it no longer is.

1. **SvelteKit app on Vercel (the PRIMARY case for this Hive).** Signals: a `svelte.config.js`, `@sveltejs/adapter-vercel` in dependencies, a `src/routes/` tree, `.svelte-kit/` present or generatable. Route to: `guides/23-tsconfig-for-sveltekit.md`, `guides/24-typing-sveltekit-load-actions-endpoints.md`, `guides/25-drizzle-type-inference-patterns.md`, `guides/26-vitest-playwright-for-sveltekit.md`, `guides/27-biome-vs-eslint-prettier.md`, `guides/28-pnpm-and-monorepo-options.md`, `guides/29-node-version-policy-on-vercel.md`, plus the general-purpose guides (`02`, `08`, `09`, `12`, `16`, `22`) which apply to both cases.
2. **npm library / CLI publishing (the SECONDARY case - what this skill was originally forged for, still fully supported).** Signals: a `bin` field in `package.json`, a `files` allowlist, no `svelte.config.js`, the package is meant to be `npm install`ed by someone else. Route to: `guides/01-stack-enforcement.md` through `guides/07`, `guides/13` through `guides/15`, `guides/17` through `guides/21` - all marked with a legacy-case banner at the top. Hivemind (`@deeplake/hivemind`) is the concrete example this material was built from; see `guides/01-stack-enforcement.md` for what's Hivemind-specific vs generally applicable to any published package.
3. **Something else entirely** (a different framework, a different deploy target). Apply the general-purpose guides (`00`, `02`, `08`, `09`, `12`, `16`, `22`), flag "REDUCED COVERAGE" for anything framework-specific, and escalate per the cross-Bee table below rather than guessing.

If it's genuinely ambiguous (e.g. a monorepo containing both a SvelteKit app and a published internal package), apply the matching guide set **per package**, not one blanket answer for the whole repo.

## The principles

### 1. Read `package.json` and `tsconfig.json` first - always

A recommendation for the wrong toolchain is wrong advice, regardless of which case applies. Before anything else, capture:

- Module system: `"type": "module"` and `engines.node`.
- The `scripts` block - what `build`, `test`, `typecheck`, `lint`/`format`/`dup`, and `ci` actually run.
- The dependency split - framework (`@sveltejs/kit`, `drizzle-orm`, etc. for the SvelteKit case; `zod`, `@modelcontextprotocol/sdk`, etc. for the Hivemind case), validation library, test runner, lint/format tooling.
- The compiler config - `moduleResolution` (`bundler` for a SvelteKit app per `guides/23-tsconfig-for-sveltekit.md`, `Node16`/`NodeNext` for a published package per `guides/01-stack-enforcement.md`), `target`, `strict`.

### 2. Stack is canon within its context, not recommendation

Once the project type is classified (step "First move" above), the matching guide set encodes the toolchain that context runs - not a menu of options. Substitution within a context still requires an ADR with eval evidence and a migration plan (`guides/01-stack-enforcement.md`'s substitution policy applies to both cases). The `references/` folder catalogs alternatives not picked for the Hivemind case specifically; the SvelteKit-case decision guides (`guides/27`, `guides/28`) document the current tradeoff rather than a single locked-in pick, because those are newer, less locked decisions for this stack.

### 3. ESM is the baseline in both cases, with different import-extension rules

Both cases run ESM (`"type": "module"`). Where they differ: a SvelteKit app resolves imports through Vite (a bundler), so relative TS imports do NOT need `.js` extensions (`moduleResolution: "bundler"`, `guides/23-tsconfig-for-sveltekit.md`). A published npm package resolves imports through Node's own runtime ESM loader, so relative imports DO need `.js` extensions (`moduleResolution: "Node16"`/`"NodeNext"`, `guides/01-stack-enforcement.md`, `guides/02-project-layout-esm.md`). Applying the wrong case's extension rule is a **must-fix** - and the single most common context-mixing error this skill sees.

### 4. tsconfig is canon for its context; never loosen it

Whichever tsconfig applies (`guides/23` for SvelteKit, `guides/01` for the npm-library case), `strict: true` is non-negotiable in both. When an import fights the config, fix the import - do not flip `strict` off or downgrade resolution.

### 5. zod (or valibot, per context) at every external boundary

MCP tool input, parsed JSON, environment variables, file contents, third-party API responses, form submissions - all validated at entry. See `guides/12-strict-types-and-zod.md` for the full discipline and its 2026 update section for which validator this stack actually defaults to (zod, for reasons specific to this repo, not carried over unexamined from the Hivemind MCP-SDK case).

### 6. No `any` at boundaries

`unknown` then narrow, or a validated schema. `any` crossing a function signature defeats strict mode for everything downstream and is a **must-fix** in either case. Source: `guides/12-strict-types-and-zod.md`.

### 7. Persistence goes through the owning client/ORM, never a hand-rolled fetch

For the SvelteKit case: Drizzle queries go through the patterns in `guides/25-drizzle-type-inference-patterns.md`, with schema/migration/connection concerns handed to `neon-drizzle-stinger`. For the Hivemind case: Deep Lake queries go through `src/deeplake-api.ts` per `guides/03-deeplake-sql-api.md`. A hand-rolled `fetch` bypassing either is a **must-fix**.

### 8. Tests: split by what's mocked, not by file size

For the SvelteKit case: Vitest for unit/component tests (everything mocked), Playwright for e2e (nothing mocked) - `guides/26-vitest-playwright-for-sveltekit.md`. For the Hivemind case: `vitest run` + `@vitest/coverage-v8`, `tests/` mirroring `harnesses/` - `guides/10-vitest-discipline.md`, `guides/11-vitest-async-fixtures.md`.

### 9. The quality gate is context-specific; know which one applies before flagging a "missing" tool

The Hivemind case runs `tsc` + `jscpd` + husky, deliberately with **no ESLint, no Prettier** (`guides/13-jscpd-and-quality-gate.md`) - proposing a linter there is a should-refactor to push back on, not a gap to fill. The SvelteKit case has no such constraint; `guides/27-biome-vs-eslint-prettier.md` is the actual decision guide for that context. Do not import one context's gate philosophy into the other.

### 10. Package manager and monorepo tooling are context-specific too

Hivemind: npm, single package, no workspace - `guides/14-npm-and-publishing.md`, `references/npm-vs-pnpm.md`. The SvelteKit case: pnpm workspaces + Turborepo as the current default - `guides/28-pnpm-and-monorepo-options.md`. These are opposite defaults for good, context-specific reasons; neither is "wrong" for its own case.

### 11. No swallowed errors, in either case

Empty `catch {}` or a `catch` that drops the error without a documented reason is a **must-fix** - narrow on `err instanceof Error` and surface a message. Source: `guides/09-error-handling.md`.

### 12. Never state a fact you didn't archive

Every claim in every guide in this skill traces to either a research file (`references/research/raw/` for the current pass, `research/` for the original Hivemind pass) or a file actually in the target repo. If you're recalling something from training data and it isn't archived, go fetch a source before asserting it as fact.

---

## First-move checklist

Before writing findings, confirm:

- [ ] Project type classified (SvelteKit app / npm library-CLI / other) per the "First move" section above.
- [ ] `package.json` + `tsconfig.json` (or `svelte.config.js` + the generated `.svelte-kit/tsconfig.json`) read; stack map captured for the matching context.
- [ ] Invocation classified per the routing table in `SKILL.md` (SvelteKit/general rows first, Hivemind/library rows under their own heading).
- [ ] Severity rubric in mind (must-fix / should-refactor / style).
- [ ] Cross-Bee handoff lines clear - escalate at the boundary, don't author work another Bee owns.

## Cross-Bee boundaries

The full table lives in `SKILL.md`. The short version: surface concerns at the boundary; don't author work the other Bee owns.

| Question | Owner |
|---|---|
| Vercel platform config (adapter, ISR, env vars, cron, images, middleware, firewall, cost, domains) | `vercel-worker-bee` |
| Neon/Drizzle schema, migrations, connection pooling, RLS design | `neon-drizzle-worker-bee` |
| Svelte 5 component/markup authoring, runes usage, SvelteKit route/component patterns beyond typing | `svelte-worker-bee` |
| Secrets/env handling mechanics (Doppler project/config model, CLI, rotation) | `doppler-worker-bee` |
| Security audit (auth, injection, secret scanning, credential lifecycle) | `security-worker-bee` |
| Post-implementation QA against a plan | `quality-worker-bee` |
| Repo hygiene / branch protection / CI workflow density | `github-repo-health-worker-bee` |
| Deep Lake table/index design from a data-engineering POV (Hivemind case) | `vector-store-worker-bee` |
| Recall ranking, embeddings strategy, evals (Hivemind case) | `retrieval-worker-bee` and `embeddings-runtime-worker-bee` |
| Docker, CI runners, release automation, cloud (Hivemind case) | `ci-release-worker-bee` |
| PRD authoring | `library-worker-bee` |

## Severity rubric (rephrased for clarity)

| Severity | Examples | Blocks merge? |
|---|---|---|
| **Must-fix** | `any` crossing a boundary; missing validation on external input; un-guarded SQL interpolation; hand-rolled fetch bypassing the owning client/ORM; hardcoded token/key; wrong-context import-extension rule; loosened tsconfig strictness; empty/swallowed `catch`; CI gate that auto-fixes instead of failing | Yes |
| **Should-refactor** | Duplication near a gate threshold; a missing test for a new exported function; an un-pinned/unbounded `engines.node`; a package-manager proposal made as a drive-by; a decision-guide tradeoff (Biome vs ESLint, pnpm vs npm) applied without checking whether the stated reasoning actually transfers to this stack | No - opens follow-up |
| **Style** | Naming preference; import grouping; comment wording | Never - style is not the gate in either context |

Calling a style nit "must-fix" destroys your credibility for the next finding. Be disciplined.

## Citation discipline

Every finding has two citations:

1. **Where in the user's codebase** - `src/routes/blog/[slug]/+page.server.ts:12`.
2. **Why it's a finding** - guide section (`guides/24-typing-sveltekit-load-actions-endpoints.md`) or a source file in the repo.

No citations means the finding is opinion, not enforcement.

## Scope explicitly excluded (both cases)

- **Vercel platform mechanics** beyond the Node-version field this skill owns via `guides/29`. Everything else - adapter config, caching, cron, images, middleware, firewall, cost - belongs to `vercel-worker-bee`.
- **Drizzle schema design, migrations, connection pooling, RLS** - the type-inference layer around Drizzle is here (`guides/25`); the ORM/database design itself is `neon-drizzle-worker-bee`.
- **Svelte component/markup authoring** - the TypeScript typing layer for `load`/actions/`+server.ts` is here (`guides/24`); component internals, runes idiom, and SvelteKit route/component patterns beyond typing are `svelte-worker-bee`.
- **Security audit** - guarded interpolation and env-only secrets are flagged and ensured here; the formal audit is `security-worker-bee`.
- **Deep Lake schema engineering, recall/embeddings design** (Hivemind case) - the TS access patterns are here; the data-engineering and ML design are `vector-store-worker-bee` / `retrieval-worker-bee` / `embeddings-runtime-worker-bee`.

When in doubt, escalate.
