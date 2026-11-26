# ci-release-wasp-drone

**Plugin owner:** `platform-and-release-tools`. **Required selection:** wasp-nest-core. Resolve the selected installed owner before dispatch; use the source link for the canonical procedure.


## Domain
CI and release engineering after target classification: SvelteKit-on-Vercel app checks and deployment interaction, published npm-package build/release contracts, or explicit handoff for another platform. Improve CI without redundant jobs through a baseline/proposed work and proof matrix, dependency-aware triggers, candidate/artifact identity, safe cancellation/rerun rules and measured cost/time inputs. This source tree is an asset distributor; do not assume it has either example pipeline.

## Paired Stinger
[ci-release-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/platform-and-release-tools/skills/ci-release-stinger) - the build/bundle guide, version single-sourcing, the quality-gate spec, workflow architecture, the release flow, npm publish discipline, and native-dep healing.

## Trigger phrases
- "improve CI without redundant jobs / CI is too slow or expensive"
- "is this partial rerun sufficient for the current candidate"
- "review our build, is it doing the right thing"
- "the bundle output looks wrong"
- "design our CI pipeline / audit our workflows"
- "the version is out of sync across manifests"
- "add a new CI job"
- "we leaked a secret on publish"
- "the npm pack ships junk we didn't mean to include"
- "tree-sitter broke on install, fix native-dep healing"

## Do NOT route when
- The request is runtime TypeScript/Node source design or module-resolution decisions; that is typescript-node-wasp-drone, though this Drone still enforces build principles like version inlining.
- The request is Deeplake dataset, retrieval, or embeddings logic; hand to the relevant domain Drone.
- The request is a CVE deep audit or secret-leak forensics; this Drone wires the gate and surfaces file:line, but security-wasp-drone owns the audit.
- The request is release-notes prose or an announcement; that is changelog-release-notes-wasp-drone. This Drone owns the release mechanics only.
- The request is dependency CVE or lockfile triage verdicts; that is dependency-audit-wasp-drone, though this Drone wires the audit step.

## Inputs the Drone needs
- Actual target workflow files, invoked scripts, platform/deployment ownership, required checks, event/candidate/toolchain/config and artifact inputs, inventoried before recommendation. Load esbuild/version-sync only for a matching npm-package case.
- Which invocation type applies: build-author, bundle-audit, pipeline-design/audit, release-cut, quality-gate, or native-dep-heal.
- Whether the change is must-fix (secret reachable, allowlist ships junk, unpinned action) vs should-refactor severity.

## Outputs
- A baseline/proposed CI obligation packet using paired guide 17, with preserved isolation/permissions and explicit Unknown measurements; hypothetical source review does not prove native CI savings.
- An esbuild/script diff or a new/modified GitHub Actions workflow job with local-parity notes.
- A bundle or workflow audit report citing exact file:line and the governing guide section.
- A release plan and checklist for cutting an `@deeplake/hivemind` release.

## Commonly sequenced with
- security-wasp-drone: audits the publish surface and secret-scan output on every pipeline change, first in the close-out chain.
- quality-wasp-drone: verifies gate parity, second in the close-out chain.
- changelog-release-notes-wasp-drone: writes the announcement prose for a release this Drone mechanically cuts.
- dependency-audit-wasp-drone: triages the CVE verdict for a dependency-audit step this Drone wires into CI.
