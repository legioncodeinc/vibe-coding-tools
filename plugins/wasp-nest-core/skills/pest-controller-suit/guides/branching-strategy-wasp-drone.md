# branching-strategy-wasp-drone

## Domain
Owns the strategic and tactical decisions behind how this repo structures its version-control workflow: branching model selection (trunk-based, GitHub Flow, GitLab Flow, GitFlow), migration between models, release and hotfix branch patterns, the merge-vs-rebase call, the long-lived-branch trap, and the feature-flag vs feature-branch decision. Defaults to trunk-based development for teams with the prerequisites and GitHub Flow otherwise; never recommends GitFlow without requiring explicit justification. Produces a branching policy document, not pipeline or ruleset configuration.

## Paired Stinger
[branching-strategy-stinger](../../branching-strategy-stinger) - the 9-factor model-selection matrix, release/hotfix protocols, merge-vs-rebase guardrails, the feature-flag decision matrix, and the merge-queue setup checklist.

## Trigger phrases
- "which branching model should we use"
- "we have too many merge conflicts"
- "our release process is broken"
- "GitFlow or trunk-based, which fits us"
- "merge or rebase, what's our policy"
- "should this be a feature flag or a branch"
- "set up GitHub Merge Queue"
- "our branches sit open for weeks"

## Do NOT route when
- The request is Git mechanics: interactive rebase, conflict resolution, history rewriting; that is git-wasp-drone.
- The request is branch protection ruleset configuration in GitHub/GitLab; that is github-repo-health-wasp-drone, not devops-wasp-drone.
- The request is CI/CD pipeline topology, including adding a `merge_group:` trigger for a merge queue; that is devops-wasp-drone.
- The request is choosing a feature-flag platform (LaunchDarkly vs Unleash vs Statsig) or writing flag implementation code; this Drone scopes the flag-vs-branch decision only, then routes implementation to react-wasp-drone or python-wasp-drone.
- The team just shipped a release under a new model and wants release notes; that is changelog-release-notes-wasp-drone.

## Inputs the Drone needs
- Release cadence, team size, product type, and whether multi-version support is required.
- Existing feature-flag infrastructure, or lack of it.
- A `git log --graph`, branch list, or `.github/` folder if available, inspected before asking further questions.

## Outputs
- A branching policy document (`docs/engineering/branching-policy.md`) covering model, naming, merge strategy, hotfix/release protocol, and feature-flag policy.
- A model recommendation with the GitFlow-bias explicitly stated and a merge-vs-rebase ruling.
- A routed list of protection-ruleset and CI-trigger deltas for the appropriate sibling Drones.

## Commonly sequenced with
- git-wasp-drone: handles the rebase mechanics and conflict resolution once the model is chosen.
- github-repo-health-wasp-drone: configures the branch protection rulesets this Drone's policy calls for.
- devops-wasp-drone: wires CI pipeline triggers, including merge-queue support.
- changelog-release-notes-wasp-drone: communicates releases once the new branching/release model produces one.
