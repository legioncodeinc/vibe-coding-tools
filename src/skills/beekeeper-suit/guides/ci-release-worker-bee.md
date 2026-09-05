# ci-release-worker-bee

## Domain
Build, CI, and npm-release specialist for this repo's TypeScript/Node ESM package pipeline: the esbuild multi-harness bundle (`tsc && node esbuild.config.mjs`), version single-sourcing via `scripts/sync-versions.mjs`, the quality gate (`npm run ci` = typecheck + jscpd duplication + vitest, husky pre-commit lint-staged tsc), the GitHub Actions workflow architecture (ci.yaml, codeql.yaml, pr-checks.yaml, publish-smoke-test.yaml, release.yaml), the Node version matrix, npm publish discipline (the `files` allowlist, prepack, `pack-check.mjs` secret-scan), and native-dependency healing on install. Pure npm/ESM, no containers, no cloud deploy.

## Paired Stinger
[ci-release-stinger](../../ci-release-stinger) - the build/bundle guide, version single-sourcing, the quality-gate spec, workflow architecture, the release flow, npm publish discipline, and native-dep healing.

## Trigger phrases
- "review our build, is it doing the right thing"
- "the bundle output looks wrong"
- "design our CI pipeline / audit our workflows"
- "the version is out of sync across manifests"
- "add a new CI job"
- "we leaked a secret on publish"
- "the npm pack ships junk we didn't mean to include"
- "tree-sitter broke on install, fix native-dep healing"

## Do NOT route when
- The request is runtime TypeScript/Node source design or module-resolution decisions; that is typescript-node-worker-bee, though this Bee still enforces build principles like version inlining.
- The request is Deeplake dataset, retrieval, or embeddings logic; hand to the relevant domain Bee.
- The request is a CVE deep audit or secret-leak forensics; this Bee wires the gate and surfaces file:line, but security-worker-bee owns the audit.
- The request is release-notes prose or an announcement; that is changelog-release-notes-worker-bee. This Bee owns the release mechanics only.
- The request is dependency CVE or lockfile triage verdicts; that is dependency-audit-worker-bee, though this Bee wires the audit step.

## Inputs the Bee needs
- The repo's `package.json`, `esbuild.config.mjs`, `tsconfig*.json`, workflow files, and version-sync scripts, inventoried before any recommendation.
- Which invocation type applies: build-author, bundle-audit, pipeline-design/audit, release-cut, quality-gate, or native-dep-heal.
- Whether the change is must-fix (secret reachable, allowlist ships junk, unpinned action) vs should-refactor severity.

## Outputs
- An esbuild/script diff or a new/modified GitHub Actions workflow job with local-parity notes.
- A bundle or workflow audit report citing exact file:line and the governing guide section.
- A release plan and checklist for cutting an `@deeplake/hivemind` release.

## Commonly sequenced with
- security-worker-bee: audits the publish surface and secret-scan output on every pipeline change, first in the close-out chain.
- quality-worker-bee: verifies gate parity, second in the close-out chain.
- changelog-release-notes-worker-bee: writes the announcement prose for a release this Bee mechanically cuts.
- dependency-audit-worker-bee: triages the CVE verdict for a dependency-audit step this Bee wires into CI.
