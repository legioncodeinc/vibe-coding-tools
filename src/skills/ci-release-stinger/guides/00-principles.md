# 00 - Principles

The non-negotiables. Read on every invocation.

## Classify first: app-on-Vercel, or published npm package

Not every repo this skill touches is Hivemind. **The first move on every invocation is to classify which case applies**, because the two cases share almost nothing mechanically:

- **Continuously-deployed app (Vercel).** The deliverable is a running web app, redeployed on every merge, with no external consumer pinning a version range against it. Vibe Coding Tools is an asset-distribution repository rather than an example of this application shape, so use the web-app guidance only when the target repository actually matches it.
- **Published npm package.** The deliverable is a versioned tarball published to the npm registry, installed by external consumers who pin a semver range against it. This is the case this skill was originally forged for (`@deeplake/hivemind`, a Deep Lake agent-memory tool: esbuild multi-harness bundle, Node >=22, pure ESM). Still fully supported - route to guides 01-08. **This is the legacy/secondary case for this skill's current scope; still fully supported for that use case, but it is no longer the default assumption for a new invocation.**

Signals to classify by: is there a `files` allowlist and a `bin` entry in `package.json` with a `publishConfig.access`? Is there a `svelte.config.js` with `adapter-vercel` (or `adapter-auto`)? Is the deploy target `npm publish` or a Vercel Git-integration push? When both signals are ambiguous or a repo genuinely does both (an app repo that also publishes an internal shared package), classify per-task rather than per-repo - a single invocation might route to guide 09 for the app's CI and guide 06 for a vendored package's publish step, in the same session.

## The ten principles

### 1. Inventory the repo first - always

For the **app-on-Vercel case**, capture: `package.json` scripts (`build`, `dev`, `check`, `test`, `test:e2e`), `svelte.config.js` (adapter, runtime), `.github/workflows/*.yaml` (which jobs exist, triggers, `permissions:` blocks), `playwright.config.ts` (reporter, retries, sharding), `drizzle.config.ts` and any Neon-branch-per-PR workflow, whether Doppler or plain GitHub secrets deliver env vars, `vercel.json` (`git.deploymentEnabled`, `crons`, `functions`), and the current branch protection / required-checks configuration if visible.

For the **npm-package case** (legacy), capture the original Hivemind inventory: `package.json` (`scripts`, `files` allowlist, `bin`, `version`, `engines.node`), `esbuild.config.mjs`, `scripts/sync-versions.mjs`, `scripts/ensure-tree-sitter.mjs`, `scripts/pack-check.mjs`, `scripts/audit-openclaw-bundle.mjs`, `tsconfig.json`, `vitest.config.ts`, `.jscpd.json`, `.husky/pre-commit` + `lint-staged`, `.github/workflows/*.yaml`, `.coderabbit.yaml`.

A recommendation written without reading the existing pipeline is wrong advice, in either case.

### 2. For the app case: Vercel already builds and deploys, GitHub Actions adds only what it doesn't

Vercel's native Git integration deploys every push and every PR with zero YAML: preview on non-production branches/PRs, production on the production branch. GitHub Actions should add only what Vercel doesn't run: tests, security scans, performance budgets, approval gates. Building in Actions without `--prebuilt` when a deploy also runs there doubles the build. See `guides/10-vercel-integration-and-double-builds.md`.

### 3. For the app case: the version is not a contract, don't manufacture one

Unlike the npm-package case (where the version is single-sourced and inlined via `define`, see principle 2 below for that case), a continuously-deployed app has no external consumer pinning a version range against it. Default to no semver tool for the app surface at all; a build number, git SHA, or date-stamped tag covers internal correlation needs. See `guides/16-release-automation-decision.md`.

### 4. For the npm-package case: the version is single-sourced (legacy)

`prebuild` runs `scripts/sync-versions.mjs`, which propagates one version (from root `package.json`) into every harness manifest, and esbuild `define` (`__HIVEMIND_VERSION__`) inlines it into the bundles. Never hand-edit a version in a per-harness manifest - it will drift from the bundles and ship a lie. Source: `research/2026-06-16-version-single-sourcing.md` and `guides/02-sync-versions.md`.

### 5. For the npm-package case: the build is `tsc && node esbuild.config.mjs` - both run (legacy)

tsc type-checks and emits `dist/`; esbuild then bundles `dist/*.js` into the per-harness outputs. Skipping either ships broken or un-bundled artifacts. Source: `guides/01-build-and-bundle.md`.

### 6. Migrations validate on a disposable clone before they touch anything real

For the app case, a Drizzle migration against Neon runs against an ephemeral per-PR branch first; only a merged PR's migration touches the persistent production database. See `guides/12-migration-gating-drizzle-neon.md`. (The npm-package case has no analogous concept - it has no database.)

### 7. Secrets never reach logs, the tarball, or a long-lived GitHub secret when OIDC is available

App case: prefer Doppler's OIDC-based Service Account Identity or GitHub's own OIDC-to-cloud-provider pattern over static tokens; see `guides/13-secrets-doppler-oidc.md`. npm-package case (legacy): `scripts/pack-check.mjs` is the publish gate refusing forbidden filenames in the tarball; see `guides/06-npm-release.md`.

### 8. Pin actions, pin Node, in both cases

Workflows pin actions to a fixed version (never `@main` or a floating major) and pin an explicit Node version (never a floating alias). This holds identically for the app case's `guides/09-github-actions-job-shapes-sveltekit.md` jobs and the npm-package case's `guides/04-workflows.md` jobs.

### 9. Cite every finding

Two citations per finding:

- **Where in the user's repo** - `package.json:18`, `.github/workflows/ci.yaml:107`, `svelte.config.js:12`.
- **Why it's a finding** - guide section + research citation (`guides/12-migration-gating-drizzle-neon.md` + `references/research/raw/neon-drizzle-branch-per-pr-migration-gating.md` for the app case, or `guides/06-npm-release.md` + `research/2026-06-16-pack-check-secret-scan.md` for the legacy case) or an external URL.

### 10. Severity discipline

Three levels only, applied consistently across both cases:

| Severity | App-case example | npm-package-case example (legacy) | Blocks PR / release? |
|---|---|---|---|
| Must-fix | A migration running against the shared production DB as part of a PR check; a duplicate Vercel build from missing `--prebuilt`; a required check that can be silently skipped by path filtering | Hand-edited manifest version drift, build skips tsc or esbuild, secret reachable by the tarball | Yes |
| Should-refactor | Playwright browser cache missing the `install-deps` cache-hit fallback; an ephemeral Neon branch never cleaned up | New CI job without local parity, missing coverage upload, jscpd threshold loosened without justification | No - open follow-up |
| Style | Cache key naming convention, workflow step label | Script naming nit, YAML key ordering | No - suggestion |

Calling a style nit "must-fix" destroys reviewer trust in either case. Be disciplined.

---

## First-move checklist

Before writing findings, confirm:

- [ ] Classified the invocation: app-on-Vercel (primary) or npm-package (legacy) - see the classification section above.
- [ ] For the app case: `package.json`, `svelte.config.js`, `.github/workflows/*.yaml`, `playwright.config.ts`, `drizzle.config.ts`, `vercel.json` read.
- [ ] For the npm-package case: `package.json`, `esbuild.config.mjs`, the four `scripts/*.mjs`, `.github/workflows/*.yaml` read.
- [ ] Relevant guide(s) identified from the routing table in `SKILL.md`.
- [ ] Severity rubric in mind.

## Cross-Bee boundaries

Below is what you do not own. Hand off if the question is primarily:

| Question type | Owner |
|---|---|
| Vercel adapter config, runtime choice, ISR/caching, images, firewall, cost control, Neon integration choice | `vercel-worker-bee` (this skill owns the Actions side and the two systems' interaction, not Vercel's own config) |
| Drizzle schema design, migration command semantics, RLS, connection pooling | `neon-drizzle-worker-bee` (this skill owns CI gating logic only) |
| Doppler project/config model, rotation, audit logs, Vercel sync | `doppler-worker-bee` (this skill owns secret delivery into Actions workflows only) |
| Branch protection / ruleset settings configuration, repo-hygiene scoring | `github-repo-health-worker-bee` (this skill owns making a required check satisfiable, not configuring the ruleset) |
| Svelte 5 component/runes correctness | `svelte-worker-bee` |
| CVE deep audit, secret-leak forensics, supply-chain correctness | `security-worker-bee` (you surface concerns) |
| Dependency / lockfile CVE triage | `dependency-audit-worker-bee` (you wire the step) |
| Runtime TS/Node source design, ESM/module-resolution (npm-package case) | `typescript-node-worker-bee` |
| Post-implementation verification | `quality-worker-bee` |

You surface concerns but don't author the security audit yourself.

**Close-out chain on any pipeline change:** hand to `security-worker-bee` first (publish-surface / secret check), then `quality-worker-bee` (gate parity verification), then `github-repo-health-worker-bee` for the Ship Gate's final orchestrator-level step - see `SKILL.md`'s Ship Gate section.

## Scope explicitly excluded (both cases)

- **Runtime business logic.** This Bee stops at "the pipeline builds, gates green, and ships/deploys." What the code does at runtime is `svelte-worker-bee` (app case) or `typescript-node-worker-bee` (npm-package case).
- **Vercel platform configuration itself** (adapter options, ISR, images, firewall) - that's `vercel-worker-bee`'s territory; this skill owns the Actions side and the interaction between the two.
- **npm registry / org administration.** Recommend `publishConfig.access` correctness; do not manage registry tokens or org membership.

## Examples in action

`examples/cut-a-release.md`, `examples/add-ci-job.md`, and `examples/bundle-allowlist-audit.md` show these principles applied to the npm-package (legacy) case end-to-end. No app-case worked examples exist yet in `examples/` as of this rewrite - apply the principles above and the guides 09-16 directly until one is authored.
