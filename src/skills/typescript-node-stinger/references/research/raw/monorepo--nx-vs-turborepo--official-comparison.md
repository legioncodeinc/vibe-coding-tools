# Nx vs Turborepo: official comparison (task orchestration, caching, CI, monorepo fit)

- URL: https://nx.dev/docs/guides/adopting-nx/nx-vs-turborepo
- Fetched: 2026-08-14
- Source type: Official docs (nx.dev) - note this is Nx's own comparison page, written by a party with an interest in the outcome; treat the framing (not the raw benchmark numbers, which are methodologically disclosed) as advocacy
- Component: Monorepo tooling selection

## Content

### Disclosed benchmark methodology

"All benchmarks on this page use the same pnpm workspace migrated with both tools" - i.e. numbers below come from one shared workspace, not separately-optimized best-case setups for each tool.

### Onboarding cost

| | Nx | Turborepo |
|---|---|---|
| Config to get started | Zero-config or guided `nx init` (+3 lines) | Manual `turbo.json` (+144 lines measured on the shared benchmark workspace) |
| Runs existing `package.json` scripts | Yes, immediately | Yes, but every task must be explicitly declared in `turbo.json` first (Turborepo errors with "Could not find task `build` in project" if it isn't declared, even if the script already works via the package manager directly) |

Nx's guided `nx init` "detects your existing tooling, asks which tasks should be cacheable, and scaffolds an `nx.json`" - for a Next.js + ESLint project it can auto-infer `build`/`dev`/`start`/`lint` targets without the user declaring them (via plugins like `@nx/vite` reading a project's actual `vite.config` for cache inputs/outputs).

### Caching model - the most consequential day-to-day difference

- **Turborepo**: caches every task **by default**; you opt out per-task (`cache: false`) for things like a long-running `dev` server. Inputs are flat lists with no composition - a shared exclusion pattern (e.g. "everything except test files") must be repeated verbatim across every task definition that needs it (`build`, `build:prod`, `check-types` all separately list the same `!**/*.spec.ts` etc. exclusions in the example config shown).
- **Nx**: nothing is cached unless explicitly marked `cache: true` - a more cautious opt-in default. Provides `namedInputs` - a reusable, composable input pattern defined once (e.g. a `"production"` pattern that excludes test files) and referenced by name across every target that needs it, so a change to a spec file correctly does not invalidate a build-cache entry that only reads the `production` input set.

### Task sandboxing / cache trustworthiness (a security-relevant distinction, not just a DX one)

Turborepo has **no task sandboxing** - during execution a task can read/write anywhere on the filesystem, including files not declared as inputs, and produce outputs not declared either; those undeclared outputs can still get cached and replayed into a different context later, producing false cache hits and hard-to-trace failures. Nx monitors filesystem access during task execution and flags reads/writes outside the declared `inputs`/`outputs`. The page explicitly ties this to a named CVE: "CVE-2025-36852 (CREEP) demonstrated that build systems without cache isolation are vulnerable to cache poisoning, where any contributor with PR access can inject compromised artifacts into production." Nx Cloud additionally provides branch-scoped cache isolation as a mitigation. This is called out as "an architectural difference, not a configuration problem" for Turborepo - there is no workaround on Turborepo's side today.

### Code generation

Turborepo's `turbo gen` is a thin wrapper around Plop.js - template-based file scaffolding with simple string append/prepend, no AST-level code modification, no project-graph awareness, no codemod/migration system. Nx generators run on Nx Devkit, a full programmatic workspace-manipulation API - can read/modify the project graph, perform AST-level TypeScript transforms, and compose with other generators; teams can write local workspace generators encoding their own conventions.

### Module boundary enforcement

Nx has had tag-based module boundary rules (assign tags to projects, declare which tags may depend on which, enforced as a lint rule) since its early versions, plus conformance rules for polyglot workspaces where ESLint isn't in play. Turborepo added an **experimental** `turbo boundaries` feature in 2024 (declares allowed dependencies in `turbo.json`, visualized in the devtools graph) - explicitly still experimental as of this source.

### Polyglot (non-JS) monorepo support

Nx has first-party plugins for Maven, Gradle, .NET, and Docker, plus community plugins for Python (UV, Poetry), Rust (Cargo), Go, PHP - each providing automatic dependency detection, target inference, caching, and affected-detection for that language. Turborepo can orchestrate any language only by wrapping its CLI commands inside `package.json` scripts - every non-JS project still needs a `package.json` shim, and Turborepo has no automatic dependency-graph analysis for those languages; everything must be declared manually. Not directly relevant to a SvelteKit+Payload monorepo (both are JS/TS), but relevant if the stack later adds a non-JS service.

### AI agent integration (directly relevant to a Claude-Code-driven workflow)

Nx: `nx configure-ai-agents` sets up agent skills, an MCP server, and `CLAUDE.md`/`AGENTS.md` guidance in one command, across Claude Code, Cursor, GitHub Copilot, Gemini, Codex, and OpenCode. Includes "self-healing CI" (a CI-side agent that diagnoses broken/flaky tasks and proposes verified fixes) and CLI commands (`nx init`, `nx import`, `create-nx-workspace`) that detect agent callers and emit structured JSON instead of interactive prompts. Turborepo provides an official skill covering task config/caching plus a `turbo docs` command, but no MCP server and no CI-side AI integration.

### CI performance (single machine, no cache, same shared benchmark workspace)

| Tool | Duration | Relative |
|---|---|---|
| Nx | 21m 56s | baseline |
| Turborepo | 25m 32s | ~16% slower |

### Distributed CI (4 machines, same workspace)

| Metric | Nx Agents | Turborepo (manual binning) |
|---|---|---|
| Total duration | 9m 20s | 19m 18s (~2x slower) |
| Agent spread | 5m 1s - 9m 16s | 2m 50s - 18m 20s |

Nx distributes at the individual-task level with dynamic load balancing from historical timing data. Turborepo has no built-in distribution mechanism - scaling to multiple CI machines requires manually and statically assigning tasks to runners ("binning") and rebalancing that assignment by hand as the codebase evolves; the gap is stated to grow with more machines added.

### Release/versioning and observability

Nx ships a first-party `nx release` command automating versioning, changelog generation, and publishing across a workspace. Turborepo has no built-in release tooling - teams configure third-party tools (Changesets, Lerna) separately. For observability, Nx Cloud provides integrated dashboards (timing, cache hit/miss trends, historical analysis) queryable via its MCP server; Turborepo exposes metrics via experimental OpenTelemetry export, which requires the team to already run (or stand up) its own collector/visualization stack.

### Framing for a small-to-mid SvelteKit+Payload monorepo

This page is written by Nx and is explicitly advocacy for adopting Nx - the raw numbers are disclosed with methodology, but the editorial framing throughout favors Nx. For a two-or-three-app SvelteKit+Payload monorepo without a distributed-CI need, polyglot services, or a dedicated platform team, Turborepo's simpler mental model and its native Vercel integration (see `raw/monorepo--turborepo-pnpm-sveltekit-example.md`-equivalent coverage) may still be the pragmatic default - the Nx-specific advantages (task sandboxing, distributed CI, AI agent tooling, polyglot support) become load-bearing specifically at a scale (many packages, many CI machines, non-JS services, a platform team maintaining the monorepo tooling itself) that a small SvelteKit+Payload app may not yet be at. This tradeoff should be stated plainly rather than defaulting to whichever tool's docs were read most recently.
