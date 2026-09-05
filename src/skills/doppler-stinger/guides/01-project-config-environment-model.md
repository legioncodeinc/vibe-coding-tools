# Project, config, and environment model

Grounded in `references/research/distilled-doppler.md` §1, citing [raw/doppler--project-config--root-configs-and-branch-configs.md] and [raw/doppler--project-config--workplace-structure-naming.md].

## The hierarchy

Doppler organizes secrets as: **Workplace** > **Project** (1:1 with an application/service) > **Environment / Root Config** (`dev`/`stg`/`prd` by default) > **Branch Config** (optional overrides forked from a root config) > **Secret**.

A root config holds the master list of secrets for that environment. Updating a root-config secret automatically propagates to every branch config stemming from it - branch configs inherit and can override, they don't fork independently [raw/doppler--project-config--root-configs-and-branch-configs.md].

## Deciding the project boundary

Default assumption baked into Doppler's own design: one project per application/service. Don't model multiple unrelated services as Environments of one project - Doppler expects environments within a project to be logically related deployment stages of the *same* app, and both the UI's comparison/missing-secret-detection features and real cryptographic-operation cost degrade if that assumption is violated at scale [raw/doppler--project-config--workplace-structure-naming.md]. See `references/project-config-naming-example.md` for the worked `myapp` example and the point at which a second project (rather than a branch config) is the right call.

## Personal Configs - the default local-dev isolation mechanism

Every user with write access to `dev` automatically gets a private `dev_personal` branch (enabled by default on new projects). Point local development at `dev_personal`, not the shared `dev` root config, so one developer's in-progress secret experiments don't leak to the team until deliberately promoted. A committed `doppler.yaml` targeting `dev_personal` gives every new teammate this behavior with zero manual setup [raw/doppler--project-config--root-configs-and-branch-configs.md].

## Custom environments

Add a custom environment (e.g. `ci`) when a deployment target genuinely needs its own distinct secret set rather than reusing `dev`/`stg`/`prd` values - GitHub Actions CI is the most common real-world case for this stack, since "GitHub" doesn't map cleanly onto Development/Staging/Production (see `guides/05-cicd-in-github-actions.md`) [raw/doppler--github-actions--sync-fetch-action-oidc.md].

## Missing-secret detection

When a secret exists in one environment but not another, Doppler surfaces a visible warning ("Action Required") rather than silently letting environments drift - a real gap-detection mechanism worth relying on instead of manually diffing configs [raw/doppler--project-config--root-configs-and-branch-configs.md].

## Shared secrets across projects

Once a second service (a worker, an admin panel) needs the same credential as the main app (a Neon connection string is the obvious case for this stack), don't duplicate the value into both projects' configs. Use a dedicated shared-credentials project and cross-project secret references (`${project.config.SECRET_NAME}`, paid plans only) instead - see `references/project-config-naming-example.md` for the worked example, and flag "Restricted" visibility on the referenced value if the consuming project's users shouldn't see the raw computed value [raw/doppler--project-config--workplace-structure-naming.md].

## Anti-pattern to flag if seen in an existing setup

One project per team, with services represented as Environments instead of stages - hits the 15-environment cap fast and triggers expensive cross-environment comparison operations Doppler wasn't designed for at that shape. If a task involves auditing an existing Doppler layout, this is the first anti-pattern to check for [raw/doppler--project-config--workplace-structure-naming.md].

## Where to go next

- Local dev workflow (replacing `.env`): `guides/02-cli-and-local-dev-workflow.md`
- Vercel sync mapping these configs to Vercel's own three environments: `guides/03-vercel-integration-and-sync.md`
- Worked naming example for this stack: `references/project-config-naming-example.md`
