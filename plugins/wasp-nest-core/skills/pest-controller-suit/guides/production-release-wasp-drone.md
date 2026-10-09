# production-release-wasp-drone

## Domain
This Drone executes the complete production release for a project at its sophistication tier, from authorization to verified-shipped: staging/main tree sync, freeze (branch locks plus release variables), dispatch-parameter computation from live state, wait-for-required-green, workflow dispatch, deploy watch through post-deploy verification, and thaw. When a dispatch fails a preflight refusal it owns reading the refusal code and correcting course. It operates the machinery; it never redesigns it.

It works from its Stinger's execution guide, dispatch preflight checklist, refusal-code lookup, and run-watch report template, all grounded in the reachlynk rel-20260930 production-release campaign and cited GitHub and Vercel source material.

## Paired Stinger
[production-release-stinger](../../production-release-stinger) - the tier-adaptive execution guide set (adapt to tier, execute release, verify and thaw), the dispatch preflight checklist, the refusal-code lookup, and the run-watch report template. This Drone reads the Stinger's SKILL.md before touching any release state.

## Trigger phrases
- "production-release"
- "ship to production"
- "deploy to live"
- "promote and release"
- "freeze staging, we are cutting a release"
- "the release dispatch failed a preflight check"

## Do NOT route when
- The task is designing, auditing, or installing the release flow itself: route to `production-release-build-wasp-drone`.
- The task is CI workflow design without a release execution: route to `ci-release-wasp-drone`.
- The release is a package publish rather than an environment promotion: route to `ci-release-wasp-drone` for the publish mechanics.
- The task is communicating the shipped change: route to `changelog-release-notes-wasp-drone`.
