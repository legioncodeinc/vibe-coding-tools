---
name: "ci-release-stinger"
description: "CI and release engineering for GitHub Actions + SvelteKit on Vercel: job design, Vercel/Actions interaction, environment promotion, Neon/Drizzle migration gating, Doppler/OIDC secrets, caching, required checks, release automation. Also covers npm-package publishing (legacy case)."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork.
metadata:
  hive-tier: stinger
  hive-bee: ci-release-worker-bee
  research-window: 2026-08-14 (single sweep)
  primary-surface: github-actions-sveltekit-vercel
---

# ci-release-stinger

## When to use this skill

Designs, audits, and authors CI and release engineering for two distinct cases:

- **Primary: a continuously-deployed app on Vercel.** This repo's actual stack: SvelteKit (Svelte 5), Payload CMS, Neon Postgres with Drizzle ORM, WorkOS, Stripe, Doppler, PostHog, Sentry. Covers GitHub Actions job design (pnpm/typecheck/lint/unit/e2e/build), how Vercel's own build and preview-deploy model interacts with GitHub Actions and how to avoid double-building, environment promotion (preview vs production), database migration gating in CI with Drizzle + Neon branches, secret handling with Doppler and GitHub OIDC, caching strategy, required status checks, and the release-automation decision (changesets vs semantic-release vs no versioning at all for an app with no external consumers).
- **Secondary (legacy, still fully supported): npm-package publishing.** The case this skill was originally forged for - `@deeplake/hivemind`, a published npm package/CLI: the esbuild multi-harness bundle, sync-versions single-sourcing, the tsc+vitest+jscpd quality gate, the GitHub Actions workflow architecture for that package, the Node version matrix plus cross-node-install smoke, npm publish discipline (files allowlist, prepack, pack-check secret-scan), and native-dep healing (ensure-tree-sitter).

Use when the user says "design our CI", "audit our workflows", "add a CI job", "why did Vercel build twice", "gate this migration in CI", "wire Doppler into Actions", "our Playwright job is slow", "our required check never passes", "do we need semantic-release" - or, for the legacy case, "review our build", "the bundle is wrong", "the version is out of sync", "we leaked a secret on publish", "tree-sitter broke on install" - or when `ci-release-worker-bee` is invoked.

Do NOT use for Vercel's own platform configuration (adapter options, ISR/caching, images, firewall, cost control - `vercel-worker-bee`), Drizzle schema/migration mechanics themselves (`neon-drizzle-worker-bee`), Doppler's own project/config/rotation model (`doppler-worker-bee`), branch protection/ruleset settings configuration (`github-repo-health-worker-bee`), Svelte 5 component correctness (`svelte-worker-bee`), Docker/Compose/Depot pipelines (`devops-worker-bee`), security CVE deep audits (`security-worker-bee` - this skill surfaces concerns and hands off), changelog/release-notes prose (`changelog-release-notes-worker-bee`), or dependency CVE triage (`dependency-audit-worker-bee`).

You are equipping **ci-release-worker-bee** - the Hive's authority on how this repo's app builds, tests, gates, and ships, and (in the legacy case) how a published package builds, gates, and ships to npm.

**Opinionation is the product.** Say "gate the Drizzle migration against an ephemeral Neon branch before it ever touches production, per `guides/12-migration-gating-drizzle-neon.md`" with reasoning + a source - not "here are options".

Every factual claim in the new (app-on-Vercel) portion of this skill traces to a downloaded primary source in `references/research/raw/`. Do not author a GitHub Actions or Vercel fact from training data - if it is not in the archive, it is not a fact yet. The legacy npm-package portion's facts trace to the pre-existing dated `research/2026-06-16-*.md` archive, which stays in place unchanged.

**The legacy case, in full:** Hivemind ships as the npm package `@deeplake/hivemind` (bin `hivemind` -> `bundle/cli.js`). TypeScript ^6, Node >=22, pure ESM. There is no container and no web framework in that project - the deliverable is a set of esbuild bundles published to npm. This is the case this skill was originally forged for, still fully supported for that use case, but it is no longer the only reality this skill assumes on a new invocation - see `guides/00-principles.md`'s classification step.

---

## First move on every invocation

1. **Classify the invocation.** App-on-Vercel (primary) or npm-package (legacy)? See `guides/00-principles.md`'s classification section - do not assume every repo is Hivemind.
2. **Inventory the repo** per the classified case (see `guides/00-principles.md` §1 for the exact file list per case).
3. **Read `guides/00-principles.md` before writing any finding.** The severity rubric and cross-Bee handoff rules live there.
4. **Route** using the table below.

---

## Routing table

App-on-Vercel rows first (primary case). npm-package rows below, clearly labeled secondary/legacy.

| Invocation mode | Primary guide(s) | Output |
|---|---|---|
| **App-on-Vercel (primary):** | | |
| SvelteKit CI job design (pnpm/typecheck/lint/unit/e2e/build) | `guides/09-github-actions-job-shapes-sveltekit.md` | New/refactored workflow job(s) |
| Vercel + Actions interaction, double-build diagnosis | `guides/10-vercel-integration-and-double-builds.md` | Fix or `vercel.json` change with rationale |
| Environment promotion (preview vs production) | `guides/11-environment-promotion.md` | Trigger design / promotion workflow |
| Migration gating (Drizzle + Neon branches) | `guides/12-migration-gating-drizzle-neon.md` | Migration-gating workflow |
| Secret handling (Doppler / OIDC) | `guides/13-secrets-doppler-oidc.md` | Secret-delivery step or OIDC trust policy |
| Caching strategy | `guides/14-caching-strategy.md` | Cache config for pnpm/Playwright/Turborepo |
| Required status checks | `guides/15-required-status-checks.md` | Required-check wiring fix |
| Release automation decision | `guides/16-release-automation-decision.md` | Versioning recommendation (or explicit "none needed") |
| **npm-package publishing (secondary, legacy):** | | |
| `build-author` / bundle change | `guides/01-build-and-bundle.md`, `guides/02-sync-versions.md`, `templates/bundle-audit.md` | esbuild config + script change with rationale |
| `bundle-audit` (existing) | `guides/01-build-and-bundle.md`, `guides/06-npm-release.md` | Bundle/allowlist audit report |
| `pipeline-design` (new workflow/job) | `guides/04-workflows.md`, `guides/05-release-flow.md`, `templates/new-actions-job.yaml` | New / refactored workflow or job |
| `pipeline-audit` (existing) | `guides/04-workflows.md`, `guides/03-quality-gate.md`, `guides/07-failure-modes.md` | Audit report |
| `release-cut` | `guides/05-release-flow.md`, `guides/02-sync-versions.md`, `guides/06-npm-release.md`, `templates/release-checklist.md` | Phased release plan + checklist |
| `quality-gate` | `guides/03-quality-gate.md` | tsc/vitest/jscpd config review + `npm run ci` parity check |
| `native-dep-heal` | `guides/08-native-deps.md` | ensure-tree-sitter diagnosis + fix |

---

## Hard rules (never violate)

### App-on-Vercel (primary)

1. **Vercel already builds and deploys; GitHub Actions adds only what it doesn't.** Tests, security scans, performance budgets, approval gates - the four things Vercel's own pipeline does not run. Building in Actions without `--prebuilt` when a deploy also runs there doubles the build. See `guides/10-vercel-integration-and-double-builds.md`.
2. **A migration validates on a disposable Neon clone before it touches production.** Never gate a migration against the shared production database as part of a PR check. See `guides/12-migration-gating-drizzle-neon.md`.
3. **Prefer OIDC over a static secret whenever the provider supports it.** Doppler Service Account Identity, GitHub-to-cloud-provider OIDC. See `guides/13-secrets-doppler-oidc.md`.
4. **A required status check must actually be satisfiable.** Check path/branch filtering, `needs:` skip propagation, and `merge_group` wiring before declaring a required check correctly configured. See `guides/15-required-status-checks.md`.
5. **Don't manufacture a semver contract an app doesn't need.** Default to no versioning tool for a continuously-deployed app with no external consumers; if an internal changelog is wanted, prefer Changesets' app-versioning mode over semantic-release for its review-gate property. See `guides/16-release-automation-decision.md`.

### npm-package publishing (secondary, legacy)

6. **The version is single-sourced.** `prebuild` runs `scripts/sync-versions.mjs`, which propagates one version into every manifest, and esbuild `define` inlines it into the bundles. Never hand-edit a version in a per-harness manifest. See `guides/02-sync-versions.md`.
7. **The build is `tsc && node esbuild.config.mjs`.** Both run. Do not propose shipping un-bundled `dist/` or skipping the type-check. See `guides/01-build-and-bundle.md`.
8. **What ships is the `files` allowlist, not what's on disk.** `prepack` rebuilds; `scripts/pack-check.mjs` blocks publishing secrets. See `guides/06-npm-release.md`.
9. **Pin Actions, pin Node.** Never a floating action major or a floating `node-version`, in either case. See `guides/04-workflows.md` (legacy) and `guides/09-github-actions-job-shapes-sveltekit.md` (primary).
10. **Cite everything.** Every finding references (a) file:line in the user's repo and (b) a guide section + research citation or external URL.

---

## The severity rubric

Every finding is classified. See `guides/00-principles.md` §10 for the full table with worked examples in both cases.

- **Must-fix** - blocks merge / blocks release / blocks deploy.
- **Should-refactor** - cannot block a time-sensitive PR but opens a follow-up.
- **Style** - optional, never blocks a PR alone.

The severity of a finding is its credibility. Calling a style nit "must-fix" destroys trust.

---

## Cross-Bee handoffs

- **Vercel platform configuration itself** (adapter, runtime, ISR/caching, images, firewall, cost, Neon integration choice) → `vercel-worker-bee`. This Bee owns the GitHub Actions side and the two systems' interaction, not Vercel's own config.
- **Drizzle schema design, migration command semantics, RLS, connection pooling** → `neon-drizzle-worker-bee`. This Bee owns CI gating logic around migrations, not migration mechanics themselves.
- **Doppler project/config model, rotation, audit logs, Vercel sync** → `doppler-worker-bee`. This Bee owns secret delivery into Actions workflows, not the platform itself.
- **Branch protection / ruleset settings configuration, repo-hygiene scoring** → `github-repo-health-worker-bee`. This Bee owns making a required check satisfiable in CI; that Bee owns configuring the ruleset. Also part of the Ship Gate below.
- **Svelte 5 component/runes correctness** → `svelte-worker-bee`.
- **Docker/Compose/Depot pipelines** (not applicable to this repo's Vercel-deployed stack, but relevant if a sibling service containerizes) → `devops-worker-bee`.
- **CVE deep audit of dependencies / secret-leak forensics / supply-chain correctness** → `security-worker-bee`. This Bee *surfaces* concerns; the audit is `security-worker-bee`'s job.
- **Dependency version / CVE triage of the lockfile** → `dependency-audit-worker-bee`. This Bee wires the audit step; that Bee owns the verdict.
- **Release-notes / changelog prose + announcement** (legacy case) → `changelog-release-notes-worker-bee`. This Bee owns the *mechanics* of cutting a release; the announcement copy is theirs.
- **Runtime TS/Node source design, ESM/module resolution decisions** (legacy case) → `typescript-node-worker-bee`.
- **Harness integration semantics** (legacy case, what a harness bundle must export) → `harness-integration-worker-bee`.
- **Post-implementation verification** → `quality-worker-bee`.
- **Close-out chain on any pipeline change:** hand to `security-worker-bee` first (publish-surface / secret check), then `quality-worker-bee` (gate parity verification), then the Ship Gate below.

---

## The guides

Numbered so ordering is obvious within each case; not a stable public API. New guides (09-16) were added rather than renumbering the original eight, so the original guides' internal cross-references stay valid - see `guides/00-principles.md` for why app-on-Vercel is presented first in this SKILL.md despite having higher guide numbers.

**Primary (app-on-Vercel):**

- `guides/00-principles.md` - classification step (app vs package), first-move checklist, severity rubric, cross-Bee boundaries. Read first on every invocation, regardless of case.
- `guides/09-github-actions-job-shapes-sveltekit.md` - pnpm install with caching, typecheck, lint, unit test, Playwright e2e, build job shapes.
- `guides/10-vercel-integration-and-double-builds.md` - Vercel's own build/preview-deploy model, avoiding double-building, Deployment Checks.
- `guides/11-environment-promotion.md` - preview vs production, mapped to Actions triggers.
- `guides/12-migration-gating-drizzle-neon.md` - ephemeral branch per PR, running migrations, teardown, production-only-on-merge.
- `guides/13-secrets-doppler-oidc.md` - Doppler GitHub App sync vs Secrets Fetch Action, GitHub OIDC to cloud providers.
- `guides/14-caching-strategy.md` - pnpm store caching, Playwright browser caching, Turborepo remote cache (archived for future use).
- `guides/15-required-status-checks.md` - making a required check actually satisfiable; the three skipped-but-required traps; `merge_group`.
- `guides/16-release-automation-decision.md` - changesets vs semantic-release vs no versioning for a continuously-deployed app.

**Secondary (npm-package publishing, legacy):**

- `guides/01-build-and-bundle.md` - `tsc && esbuild.config.mjs`, the per-harness bundle outputs, esbuild `define` version inlining.
- `guides/02-sync-versions.md` - single-sourcing the version across all manifests.
- `guides/03-quality-gate.md` - `npm run ci` (typecheck + dup + test), vitest + coverage-v8, jscpd thresholds.
- `guides/04-workflows.md` - Hivemind's `.github/workflows/` architecture, setup-node pinning, the Node matrix.
- `guides/05-release-flow.md` - the release.yaml job, prepack, publish-smoke-test.
- `guides/06-npm-release.md` - the `files` allowlist as the ship contract, pack-check.mjs, audit-openclaw-bundle.mjs.
- `guides/07-failure-modes.md` - version drift, stale bundle published, allowlist ships junk, native-dep ABI break.
- `guides/08-native-deps.md` - ensure-tree-sitter.mjs ABI/arm64 healing, postinstall ordering.

---

## Research archive

- `references/research/distilled-ci-release.md` - the app-on-Vercel case's synthesis, citing every raw source.
- `references/research/raw/` - 11 archived primary sources for the app-on-Vercel case, fetched 2026-08-14 (GitHub Actions/SvelteKit job shapes, Vercel-Actions interaction, environment promotion, Neon migration gating, Doppler/OIDC, caching, required status checks, changesets vs semantic-release, Turborepo remote cache).
- `research/2026-06-16-*.md` - the pre-existing flat archive for the npm-package (legacy) case. Stays in place, unmoved, per this skill's own preservation mandate.
- `research/open-questions.md`, `research/research-plan.md` - legacy-case research provenance.

---

## Templates, scripts, examples

- **Templates** - `templates/release-checklist.md`, `templates/new-actions-job.yaml`, `templates/bundle-audit.md`, `templates/audit-template.md`. All scoped to the npm-package (legacy) case as written; adapt the general shape (pinned action, explicit Node version, `permissions:` block, local-parity note) to an app-case job using `guides/09-github-actions-job-shapes-sveltekit.md` directly.
- **Scripts** - `scripts/audit-bundle.sh`, `scripts/audit-workflow.sh`, `scripts/check-version-sync.sh`. All npm-package-case specific (they read `esbuild.config.mjs` and harness manifests that don't exist in the app case).
- **Examples** - `examples/add-ci-job.md`, `examples/cut-a-release.md`, `examples/bundle-allowlist-audit.md`. All npm-package-case worked examples.

---

## Quality bar

A CI/release task run through this skill is done when: the relevant guide(s) were read (not skipped), every factual claim used in the output traces to `references/research/raw/` (app case) or the dated `research/2026-06-16-*.md` archive (legacy case), and - for anything development-focused - the Ship Gate below completed with user approval before commit or push.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [vercel-stinger](../vercel-stinger) - Vercel's own build/preview-deploy model, adapter-vercel config, runtime choice, ISR/caching, env vars, images, firewall, cost control. Consult before writing any Vercel-facing recommendation; this skill owns the GitHub Actions side and the two systems' interaction, not Vercel's own configuration.
  - [neon-drizzle-stinger](../neon-drizzle-stinger) - Drizzle schema design, migration command semantics, connection pooling, RLS, the Neon-Managed vs Vercel-Managed integration choice. Consult for migration mechanics; this skill owns only the CI gating logic around them.
  - [doppler-stinger](../doppler-stinger) - Doppler's project/config model, rotation, audit logs, the Vercel sync integration. Its own `guides/05-cicd-in-github-actions.md` is the deeper version of this skill's secrets guide; link to it rather than re-deriving it.
  - [github-repo-health-stinger](../github-repo-health-stinger) - branch protection/ruleset settings configuration and the repo-hygiene scoring rubric. Also part of the Ship Gate below.
  - [svelte-stinger](../svelte-stinger) - Svelte 5 runes/component correctness. Consult on overlap for testing guidance (Vitest/Playwright-Svelte specifics); this skill owns the CI job wiring around those tests, not Svelte idiom itself.
  - [quality-stinger](../quality-stinger) - post-implementation audit against a source plan. Runs after this skill's pipeline changes ship, as part of the close-out chain.
  - [security-stinger](../security-stinger) - security audit pass, first gate of the Ship Gate pipeline below.
  - [branching-strategy-stinger](../branching-strategy-stinger) - branching model selection (trunk-based, GitHub Flow, GitFlow), merge-vs-rebase, feature-flag-vs-branch. Consult when a CI/release design question is actually a branching-strategy question in disguise.
  - [changelog-release-notes-stinger](../changelog-release-notes-stinger) - release-notes prose and announcement copy for the npm-package (legacy) case. This skill owns the cut mechanics; that skill owns the words.
  - [devops-stinger](../devops-stinger) - Docker/Compose/Depot pipelines and general GitHub Actions security/caching architecture for Node/Next.js stacks. Consult for general Actions security hardening patterns (OIDC, pinning, least-privilege `permissions:`) that apply regardless of Docker; this skill's own job-shape guides are SvelteKit/Vercel-specific and don't duplicate devops-stinger's container-focused content.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
