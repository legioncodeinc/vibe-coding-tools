# Distilled research: modern TypeScript/Node practice for this repo's stack

Research window: 2026-08-14 single sweep (this pass), plus the original 2026-06-16 Hivemind-era research trail preserved in `../../research/`. Stack context for this pass: SvelteKit (Svelte 5) on Vercel, Neon Postgres with Drizzle ORM, WorkOS auth, Stripe, Doppler, PostHog, Sentry, as the PRIMARY case this skill now covers; the original Hivemind (`@deeplake/hivemind`) npm-published package remains the SECONDARY case and its research trail is untouched. Every claim below cites its raw source in `raw/`. Where the archive is thin or a source conflicts with itself, that is flagged explicitly rather than smoothed over.

## 1. tsconfig for a SvelteKit app vs an npm library

| Fact | Detail | Source |
|---|---|---|
| SvelteKit's own tsconfig | Extend `.svelte-kit/tsconfig.json` (`{ "extends": "./.svelte-kit/tsconfig.json" }`); regenerated on every `svelte-kit sync` | `[raw/sveltekit--types--generated-tsconfig-pagedata-actiondata.md]` |
| Required, do-not-override options | `verbatimModuleSyntax: true`, `isolatedModules: true`, `noEmit: true`, `moduleResolution: "bundler"`, `module: "esnext"`, `target: "esnext"`, `lib: ["esnext", "DOM", "DOM.Iterable"]` | `[raw/sveltekit--types--generated-tsconfig-pagedata-actiondata.md]` |
| Why `bundler` resolution, not `Node16`/`NodeNext` | SvelteKit's own maintainers rejected `Node16`/`NodeNext` for the generated config specifically because it would force `.js` extensions on relative TS imports and break packages whose types aren't resolvable under strict Node resolution; `bundler` resolution matches reality because Vite (a bundler) resolves imports, not Node's own runtime ESM loader, for SvelteKit app source | `[raw/sveltekit--types--generated-tsconfig-pagedata-actiondata.md]` |
| Why `verbatimModuleSyntax` / `isolatedModules` | Vite/the Svelte compiler processes one file at a time, not the whole module graph the way `tsc` normally can - these settings force type-only imports to be explicit (`import type`) because the compiler cannot infer type-only-ness from cross-file context alone | `[raw/sveltekit--types--generated-tsconfig-pagedata-actiondata.md]` |
| Customizing the generated config | `svelte.config.js`'s `kit.typescript.config` function mutates or returns the generated config - documented as useful for extending a shared root tsconfig in a monorepo | `[raw/sveltekit--types--generated-tsconfig-pagedata-actiondata.md]` |

**This repo's practical split**: a SvelteKit app on Vercel uses `bundler` resolution (extend the generated config, do not touch the required options above). An npm-published library or CLI (the Hivemind legacy case, see `guides/01-stack-enforcement.md`) correctly uses `Node16`/`NodeNext` resolution instead, because there is no bundler standing between the published package and its consumers' own Node runtime - the two are different tsconfig answers for two different deliverable shapes, not a contradiction. `strict: true` is non-negotiable in both cases (no source in this pass argues otherwise, and the original Hivemind research trail independently confirms it for the library case).

## 2. Typing SvelteKit `load`, form actions, and generated route types

| Fact | Detail | Source |
|---|---|---|
| Generated per-route types | SvelteKit generates a `.d.ts` per route under `.svelte-kit/types/` (`RouteParams`, `PageLoad`/`PageServerLoad`/`LayoutLoad`/`LayoutServerLoad`, `PageData`/`LayoutData`, `Actions`/`ActionData`) - import these from `./$types`, never hand-write the generic `Load` type | `[raw/sveltekit--types--generated-tsconfig-pagedata-actiondata.md]`, `[raw/sveltekit--load--universal-and-server-load-typing.md]` |
| Universal vs server `load` | `+page.js`/`+layout.js` (`PageLoad`/`LayoutLoad`) run on server AND browser; `+page.server.js`/`+layout.server.js` (`PageServerLoad`/`LayoutServerLoad`) run server-only and receive extra arguments (e.g. `cookies`) | `[raw/sveltekit--load--universal-and-server-load-typing.md]` |
| Server load -> universal load handoff | A server load's return value arrives as the universal load's `data` argument property - it is not automatically the universal load's own return value; the universal load must explicitly read and re-forward it if both exist for the same route | `[raw/sveltekit--load--universal-and-server-load-typing.md]` |
| Data merging across the layout hierarchy | Last `load` function to run wins on overlapping keys when merging parent-layout and page data | `[raw/sveltekit--load--universal-and-server-load-typing.md]` |
| `PageProps`/`LayoutProps` (2.16.0+) | Bundles `data`(+`form`/`children`) into one type; before 2.16.0, `data`/`form` had to be typed individually via `PageData`/`ActionData` | `[raw/sveltekit--types--generated-tsconfig-pagedata-actiondata.md]`, `[raw/sveltekit--form-actions--typing-and-flow.md]` |
| Server load serialization constraint | Must be `devalue`-serializable (JSON + `BigInt`/`Date`/`Map`/`Set`/`RegExp`/cyclical refs); universal loads have no such constraint | `[raw/sveltekit--load--universal-and-server-load-typing.md]` |
| Form actions | `+page.server` exports `actions: Actions` from `./$types`; after an action runs, `load` functions re-run and the action's return arrives as the `form` prop | `[raw/sveltekit--form-actions--typing-and-flow.md]` |
| `handle` staleness gotcha | `hooks.server`'s `handle` runs BEFORE an action and does not re-run after - if an action mutates a cookie `handle` reads into `event.locals`, that same request's `event.locals` is still stale | `[raw/sveltekit--form-actions--typing-and-flow.md]` |
| Client-side action response deserialization | Must use the deserialize helper from `$app/forms`, not plain `JSON.parse`, because action results (like load results) can carry `Date`/`BigInt` | `[raw/sveltekit--form-actions--typing-and-flow.md]` |
| `App.Locals`/`App.PageData` | Declared once in `src/app.d.ts`; `App.PageData` types the cross-page `page.data` read via `$app/state` | `[raw/sveltekit--load--universal-and-server-load-typing.md]` |

**Gap flagged**: the research window did not fetch a dedicated source for `+server.ts` endpoint typing (`RequestHandler` generics) beyond the `RouteParams` mechanism already covered in `raw/sveltekit--types--generated-tsconfig-pagedata-actiondata.md` - if a task needs `+server.ts`-specific typing detail beyond route params (e.g. `RequestHandler<Params, RouteId>` generics), verify against live `svelte.dev/docs/kit/types` docs rather than extrapolating from the `load`/actions coverage above.

## 3. Drizzle ORM type inference (guidance around Drizzle, not a duplicate of neon-drizzle-stinger)

This skill covers TypeScript patterns that play well with Drizzle's inference model. Drizzle's own schema design, migrations, connection pooling, and SvelteKit/Vercel wiring are owned by [neon-drizzle-stinger](../../../neon-drizzle-stinger/) - consult it, don't duplicate it.

| Fact | Detail | Source |
|---|---|---|
| Table-level inference | `typeof table.$inferSelect` / `typeof table.$inferInsert` (or the equivalent `InferSelectModel<typeof table>` / `InferInsertModel<typeof table>` generics) derive static types directly from a schema definition - one schema, two derived types, no hand-written duplicate interfaces | `[raw/drizzle--type-inference--infer-select-insert-goodies.md]` |
| `InferModel` is deprecated | The older single `InferModel<TTable, 'select'|'insert'>` type was deprecated in Drizzle v0.28.3 in favor of `$inferSelect`/`$inferInsert` and `InferSelectModel`/`InferInsertModel` - flag any code or guidance still using bare `InferModel` as stale | `[raw/drizzle--type-inference--infer-select-insert-goodies.md]` |
| Relational query builder (`db.query`) | Nested `with: {...}` queries infer fully nested result types automatically from the schema + `relations` definition passed to `drizzle()` at init - no manual annotation needed even for multi-level nesting | `[raw/drizzle--relational-query-builder--db-query-types.md]` |
| Callback-parameter rule (correctness, not just style) | Inside relational queries, `where`/`orderBy`/`RAW`/`extras` callbacks must reference the **callback-provided aliased table**, not the directly-imported table object - using the imported table works for simple queries but silently produces wrong SQL in nested/self-referential queries | `[raw/drizzle--relational-query-builder--db-query-types.md]` |
| Partial/typed column selection | `columns: { field: true \| false }` typed subsetting works at any nesting level; an empty `columns: {}` with `with` selects only the nested relation's fields | `[raw/drizzle--relational-query-builder--db-query-types.md]` |
| `.$type<T>()` column override | Narrows a column's TypeScript type (e.g. a `text` column storing an enum-like value) without changing the underlying SQL type | `[raw/drizzle--type-inference--infer-select-insert-goodies.md]` |
| `extras` cannot do aggregation | Aggregation must go through the core query builder's `.groupBy()`/aggregate functions, not the relational API's `extras` | `[raw/drizzle--relational-query-builder--db-query-types.md]` |

## 4. zod vs valibot at boundaries (2026 update to the existing Hivemind-era comparison)

The existing `references/zod-vs-valibot.md` (Hivemind-era, dated to the 2026-06-16 research pass) is preserved as-is per this skill's mission constraints; the findings below update `guides/12-strict-types-and-zod.md` with the current (2026-08-14) tradeoff for THIS repo's stack, which is not identical to Hivemind's MCP-SDK-coupling reason for picking zod.

| Fact | Detail | Source |
|---|---|---|
| Bundle-size gap narrowed, didn't close | Zod v4 core ~1.8-5KB (down from Zod v3's ~13KB); Zod Mini (`zod/mini`) ~3.94-6.88kB for a realistic form; Valibot v1 ~1.37kB for the same form - Valibot still wins on tree-shaking but the gap that originally motivated Valibot's existence is much smaller now | `[raw/zod-vs-valibot--2026-tradeoffs.md]` |
| Runtime performance is now roughly equivalent | Zod v4 rewrite: 14.71x faster string parsing, 7.43x array, 6.5x object parsing vs v3; Valibot's older "2x faster than Zod" claim no longer holds since Zod v4 closed that gap | `[raw/zod-vs-valibot--2026-tradeoffs.md]` |
| Framework/ecosystem support via Standard Schema | tRPC, React Hook Form, Drizzle ORM (built into `drizzle-orm` core), TanStack Form, Hono, Vercel AI SDK, and SvelteKit Superforms all support BOTH via the Standard Schema spec - the ecosystem argument that used to strongly favor Zod is largely neutralized for this stack's actual integration points | `[raw/zod-vs-valibot--2026-tradeoffs.md]` |
| The one real exception | Astro Actions bundles Zod with no official Valibot adapter - **not relevant to this repo** (SvelteKit, not Astro) | `[raw/zod-vs-valibot--2026-tradeoffs.md]` |
| Where the bundle-size argument actually applies | Server-side/Node.js validation (most `+page.server.ts`/`+server.ts` code in this stack) - bundle size is irrelevant, stay with Zod for ecosystem/i18n/tooling depth. Client-component or edge-function validation code that ships to the browser - Valibot's smaller footprint is a real, measurable win | `[raw/zod-vs-valibot--2026-tradeoffs.md]` |
| i18n | Zod ships 40+ built-in locales (`zod/locales`); Valibot's i18n is a smaller, growing community package | `[raw/zod-vs-valibot--2026-tradeoffs.md]` |

**This skill's updated guidance** (see `guides/12-strict-types-and-zod.md`): default to Zod for this stack's server-side validation (`+page.server.ts` load/actions, `+server.ts` endpoints, Doppler-sourced env parsing) because that is where nearly all of this app's validation lives and bundle size there is a non-issue. If a task specifically ships validation logic into a client component or a genuinely edge-deployed function where bundle bytes are measured, evaluate Valibot on its own merits for that surface rather than defaulting to Zod out of habit - this is a narrower, more specific claim than the old Hivemind-era "zod because the MCP SDK requires v3" reasoning, which does not apply to this repo at all.

## 5. Vitest (unit + component) and Playwright (e2e) for SvelteKit

| Fact | Detail | Source |
|---|---|---|
| Two current, valid component-test setups | `@testing-library/svelte` on jsdom (simulated DOM, fast, supports Svelte 3/4/5) vs `vitest-browser-svelte` (real browser via Playwright, requires Vitest 4+, Browser Mode is stable not experimental as of Vitest 4) | `[raw/sveltekit--testing--vitest-browser-svelte-component-testing.md]` |
| `vitest-browser-svelte` config (Vitest 4 shape) | `import { playwright } from '@vitest/browser-playwright'`, `browser: { enabled: true, provider: playwright(), instances: [{ browser: 'chromium' }] }` - the older `provider: 'playwright', name: 'chromium'` string form is deprecated | `[raw/sveltekit--testing--vitest-browser-svelte-component-testing.md]` |
| `@testing-library/svelte` config for Svelte 5 | Add the `svelteTesting` plugin from `@testing-library/svelte/vite` - it sets the browser resolve condition AND auto-cleans the DOM after each test; do not also hand-write `resolve.conditions` | `[raw/sveltekit--testing--vitest-browser-svelte-component-testing.md]` |
| Runes in test files | Only work if the test filename itself includes `.svelte` (e.g. `counter.svelte.test.ts`), which routes it through the Svelte compiler; effects need `$effect.root()` + `flushSync()` before assertions | `[raw/sveltekit--testing--vitest-browser-svelte-component-testing.md]` |
| Should you even write a component test? | Official guidance: extract reactive logic into a `.svelte.js`/`.svelte.ts` module and unit-test it directly, without component-rendering overhead, when the thing under test is really just logic | `[raw/sveltekit--testing--vitest-browser-svelte-component-testing.md]` |
| The Vitest/Playwright split, per SvelteKit's own maintainers | "Vitest for component tests, where every dependency is mocked ... Playwright for end-to-end tests, where nothing is mocked (or at most outgoing HTTP calls)" - this mocked-vs-unmocked line is the actual decision rule | `[raw/sveltekit--testing-split--vitest-vs-playwright-recommended-boundary.md]` |
| Playwright drives the built+previewed app | `webServer: { command: 'npm run build && npm run preview' }`, not the dev server - exercises the real adapter/SSR output path | `[raw/sveltekit--testing-split--vitest-vs-playwright-recommended-boundary.md]` |
| E2E cadence recommendation | Run Playwright on PR-gate/staging CI, not on every commit, given the 20-60s-per-file wall-clock cost; keep Vitest unit/component tests in the fast inner loop | `[raw/sveltekit--testing-split--vitest-vs-playwright-recommended-boundary.md]` |
| `$app/*` runtime mocking | `vi.mock('$app/environment', () => ({ browser: false, dev: true, prerender: false }))` - SvelteKit runtime modules don't exist outside a real request context and must be mocked explicitly in unit/component tests | `[raw/sveltekit--testing-split--vitest-vs-playwright-recommended-boundary.md]` |
| Server `load` in component tests | Not automatically invoked when rendering a page component in a test - call `load()` directly and pass its result into the component's `data` prop by hand | `[raw/sveltekit--testing-split--vitest-vs-playwright-recommended-boundary.md]` |

**Gap flagged**: neither raw source in this pass gives a definitive, current recommendation on Storybook-vs-`vitest-browser-svelte` for component-driven-development workflows beyond noting Storybook now also runs on Vitest Browser Mode - if a task specifically needs a Storybook decision, verify against live docs.

## 6. Biome vs ESLint + Prettier

| Fact | Detail | Source |
|---|---|---|
| Speed | Roughly 30-40x faster in measured comparisons (e.g. ~0.09s vs ~2.9s combined ESLint+Prettier on a 50-file project; ~0.4s vs ~14s on 300 files) | `[raw/biome-vs-eslint-prettier--2026-tradeoffs.md]` |
| Coverage gap | Biome ~250 built-in rules vs ESLint's ~2,000-plugin ecosystem; named gaps: `react-hooks/exhaustive-deps` (called out as "a real bug-catcher"), `eslint-plugin-jsx-a11y`, `eslint-plugin-security`, `eslint-plugin-testing-library`, deep `@typescript-eslint` type-aware rules | `[raw/biome-vs-eslint-prettier--2026-tradeoffs.md]` |
| Migration tooling | `biome migrate eslint --write` / `biome migrate prettier --write` gets "80% of the way there automatically"; most teams can drop 30-40% of inherited ESLint rules on review without real impact | `[raw/biome-vs-eslint-prettier--2026-tradeoffs.md]` |
| CI command distinction | `biome ci` (no auto-fix, correct for CI gates) vs `biome check --write` (auto-fixes, correct for local/pre-commit) - using `check --write` in CI silently rewrites files instead of failing the build | `[raw/biome-vs-eslint-prettier--2026-tradeoffs.md]` |
| Hybrid approach is a legitimate, common outcome | Biome for formatting + most linting, ESLint scoped narrowly to the handful of plugin rules Biome doesn't cover (most commonly `exhaustive-deps`) - not a compromise to be embarrassed about | `[raw/biome-vs-eslint-prettier--2026-tradeoffs.md]` |

**This skill's decision guidance** (see `guides/27-biome-vs-eslint-prettier.md`): for a SvelteKit app, evaluate whether the project leans on `react-hooks/exhaustive-deps` equivalents or accessibility-lint plugins before defaulting to full Biome adoption - Svelte's own reactivity model (runes) does not have a direct `exhaustive-deps` analog the way React does, which removes the single most commonly cited reason to keep ESLint, making Biome a stronger default for a Svelte-first SvelteKit codebase than for an equivalent React codebase. This is a repo-specific inference from the raw source's React-centric gap list, not a claim any raw source states directly about Svelte specifically - flagged as inference, not fact.

## 7. pnpm as package manager choice

| Fact | Detail | Source |
|---|---|---|
| Architectural difference from npm | Content-addressable global store, hard-linked then symlinked into each project - one copy of a package version on disk regardless of how many projects use it; structurally prevents phantom dependencies (npm's flat hoisting allows them) | `[raw/package-managers--npm-pnpm-yarn-bun--2026-comparison.md]` |
| Install speed | Typically 2-3x faster than npm cold/CI install; Bun is faster still (5-20x) but is a bigger commitment (a full runtime switch, not just a package-manager swap) | `[raw/package-managers--npm-pnpm-yarn-bun--2026-comparison.md]` |
| Monorepo support | Described as "the strongest option... not particularly close" among the four - `workspace:*` protocol is a hard local-only guarantee, auto-rewritten to a real version at publish time; each workspace package gets its own strict, isolated `node_modules`, preventing cross-workspace phantom dependencies | `[raw/package-managers--npm-pnpm-yarn-bun--2026-comparison.md]` |
| Supply-chain hardening | `onlyBuiltDependencies` and a minimum-release-age setting (blocks installing a too-recently-published version, a defense against hijacked-release attacks) | `[raw/package-managers--npm-pnpm-yarn-bun--2026-comparison.md]` |
| Bottom-line recommendation for a new project | "If you're starting a new project today and nothing pushes you in another direction, use pnpm" - explicitly not an "always migrate away from npm" argument, but a "pnpm is the better default for new projects" one | `[raw/package-managers--npm-pnpm-yarn-bun--2026-comparison.md]` |
| Vercel and pnpm | Vercel's own Turborepo auto-detection and build-command inference work natively with pnpm workspaces (confirmed independently in this skill's monorepo research and in `vercel-stinger`'s own archive) | `[raw/monorepo--turborepo-pnpm-sveltekit-example.md]` |

## 8. Monorepo options for a SvelteKit + Payload stack

| Fact | Detail | Source |
|---|---|---|
| Turborepo + pnpm workspaces is the common pairing for this shape of app | Confirmed by both a practitioner write-up building a real multi-app SvelteKit Turborepo monorepo and by public example repos combining SvelteKit/Next.js with Payload CMS | `[raw/monorepo--turborepo-pnpm-sveltekit-example.md]` |
| Turborepo's own strengths (small-to-mid monorepo framing) | "Focuses solely on task orchestration and caching. The entire configuration fits in 20 lines of JSON" for a straightforward setup; native Vercel auto-detection (Build Command, Root Directory, Ignored Build Step) | `[raw/monorepo--turborepo-pnpm-sveltekit-example.md]` |
| Nx's advantages, per Nx's own comparison (advocacy-flagged) | Composable `namedInputs` caching (vs Turborepo's flat, repeated input lists), task sandboxing/cache-poisoning protection (Turborepo has none - ties to CVE-2025-36852/"CREEP"), built-in distributed CI (9m20s vs Turborepo's manual-binning 19m18s on the same benchmark workspace), AI-agent integration (`nx configure-ai-agents`, MCP server, self-healing CI), polyglot support, built-in release management | `[raw/monorepo--nx-vs-turborepo--official-comparison.md]` |
| Explicit conflict/framing flag | The Nx-vs-Turborepo comparison is Nx's own official docs page and is advocacy for Nx even though its benchmark methodology is disclosed; the Turborepo-practitioner source frames Turborepo as adequate specifically because their monorepo is smaller. Treat "Nx wins on paper" and "Turborepo is simpler for a small monorepo" as both true at their respective scales, not as a contradiction to resolve in favor of one tool universally | `[raw/monorepo--nx-vs-turborepo--official-comparison.md]`, `[raw/monorepo--turborepo-pnpm-sveltekit-example.md]` |
| Payload CMS placement in a SvelteKit monorepo | Payload's first-party integration story is Next.js-centric; a SvelteKit+Payload monorepo runs Payload as its own standalone server (Express or Payload's Node adapter) alongside, not embedded inside, the SvelteKit app - confirmed by a real (community, non-official) SvelteKit+Payload+tRPC Turborepo example repo | `[raw/monorepo--turborepo-pnpm-sveltekit-example.md]` |

**This skill's guidance** (see `guides/28-pnpm-and-monorepo-options.md`): default recommendation for this repo's current single-app-per-deploy shape is pnpm workspaces + Turborepo, matching the common pairing found in research and Vercel's native support. Revisit toward Nx specifically if the monorepo grows to need distributed CI across many machines, multiple non-JS services, or dedicated platform-team tooling - the trigger conditions Nx's own comparison names as where its advantages become load-bearing.

## 9. Node.js version policy on Vercel

| Fact | Detail | Source |
|---|---|---|
| Currently available majors | 24.x (default for new projects), 22.x, 20.x (being deprecated) | `[raw/vercel--node-js-version-policy.md]` |
| Only major versions selectable | Vercel auto-rolls minor/patch within a major, including security fixes; pinning an exact patch in `engines.node` is not meaningful on Vercel | `[raw/vercel--node-js-version-policy.md]` |
| Two places the version is set | Dashboard Project Settings (default going forward) vs `package.json#engines.node` (overrides the dashboard) | `[raw/vercel--node-js-version-policy.md]` |
| Node 20 deprecation timeline | Upstream Node 20 EOL was 2026-04-30; Vercel disables Node 20 for Builds/Functions on 2026-10-01 for NEW deployments only (already-deployed functions unaffected) | `[raw/vercel--node-js-version-policy.md]` |
| Fallback if a project can't upgrade in time | Deploy as a container image (`Dockerfile.vercel`) - but Vercel explicitly still recommends upgrading, since the container path means the team owns Node-version security updates itself | `[raw/vercel--node-js-version-policy.md]` |

**This skill's guidance** (see `guides/29-node-version-policy-on-vercel.md`): pin `engines.node` to `"22.x"` or `"24.x"` explicitly in `package.json` rather than leaving it unset or using an unbounded range - this documents intent and survives dashboard-setting drift, and avoids the October 2026 Node 20 cutover entirely if the project starts on 22.x or 24.x.

## Open gaps carried forward (do not fill from training data)

1. `+server.ts` `RequestHandler` generic typing beyond `RouteParams` - not separately fetched this pass; verify live docs if a task needs it.
2. Storybook vs `vitest-browser-svelte` as the primary component-development/test surface - noted only in passing in one raw source.
3. No source in this pass covers Biome's Svelte-file linting/formatting support specifically (Biome's own docs list JS/TS/JSX/TSX/JSON/CSS as its language coverage, not `.svelte` files directly) - if a task needs to know whether Biome can lint/format `.svelte` files themselves (vs the `.ts`/`.js` files around them), fetch that live rather than assuming either way.
4. Exact current `@sveltejs/adapter-vercel` interplay with a pnpm-workspace monorepo's `engines.node` resolution was not independently verified in this pass beyond the general Vercel Node-version and Turborepo-monorepo facts already archived in `vercel-stinger`'s own research.
