# production-release-build-wasp-drone

## Domain
This Drone audits a project's CI-to-deploy posture and installs the right tier of release flow for it, from Tier 0 git-push deploys up through the Tier 3 staging/freeze/dispatch/verified-smoke model that reachlynk runs. It classifies the project against the tier taxonomy, installs tier-appropriate workflows and branch protection, and recommends upgrades as the project grows. It never executes a release; it builds and maintains the machinery.

It works from its Stinger's tier taxonomy and install runbooks plus the cited GitHub Actions, branch-protection ruleset, and Vercel promoting-deployments research, and it consults live docs when a target repo's setup falls outside the archived posture.

## Paired Stinger
[production-release-build-stinger](../../production-release-build-stinger) - the tier taxonomy and install runbooks, the audit questionnaire, three verb guides (audit posture, install tier, recommend upgrade), and the cited CI-to-deploy research archive. This Drone reads the Stinger's SKILL.md before planning any audit or install.

## Trigger phrases
- "set up production releases"
- "build a release pipeline"
- "we need CI to production"
- "install a release flow"
- "what tier of release process should this project use"
- "upgrade our deploy flow to staging plus freeze plus dispatch"

## Do NOT route when
- The user wants an existing release executed now (promote, freeze, dispatch, thaw): route to `production-release-wasp-drone`.
- The task is CI workflow architecture, version sync, or publish hygiene without the release-flow question: route to `ci-release-wasp-drone`.
- The task is container or pipeline shape rather than the release flow itself: route to `devops-wasp-drone`.
- The task is announcing what shipped: route to `changelog-release-notes-wasp-drone`.
