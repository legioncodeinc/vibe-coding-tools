# Configs, root configs, and branch configs

- URL: https://docs.doppler.com/docs/root-configs ; https://docs.doppler.com/docs/branch-configs ; https://docs.doppler.com/docs/create-project
- Fetched: 2026-08-14
- Source type: Official docs (docs.doppler.com)
- Component: Projects / Environments / Configs

## Content

### Projects

A project in Doppler is where you define the app config and secrets for a single service or application. Every new Doppler workplace comes with a default first-project; you create new projects with a name (recommended: hyphen-separated, lowercase) and optional description.

### Environments and root configs

Every project has a default set of Environments. By default, projects start with three root configs representing a typical environment: `dev`, `stg`, and `prd`. Each root config holds a master list of secrets for that environment. When a root config secret is updated, it automatically updates the secret in any Branch Configs stemming from that root config.

Custom Environments can be added (e.g. a `CI` environment for build-specific secrets), and the order of environments can be changed via drag-and-drop.

When adding or updating a secret, you can mirror the change to other environments inside the project. Doppler also warns (red box + "Action Required" section) when a secret is set in one environment but missing in another, so environments don't silently drift. Secret references (`${SECRET_NAME}`) are the recommended alternative to manually mirroring a value across environments.

### Branch configs

Projects have 3 default configs: `dev`, `stg`, `prd`. Think of these as the master/root config for their respective environments; all other configs branch off of them. Reasons to create a branched config:

- Dedicated configs per cloud deployment (AWS, GCP, Azure, etc.)
- Developing a new feature that needs secrets not yet released
- Securely sharing a branched config with a coworker by name
- Easy promotion of changes by merging them into the root config
- Extensive audit logging and versioning per branch

**Personal Configs**: every user with write access to an environment gets their own private branch config only they can access (e.g. `dev_personal` under `dev`). Enabled on all `dev` environments by default for new projects (not retroactively for older projects). Toggle-able per environment by a project Admin. Setup scripts for local development can target `dev_personal` so each developer's local secrets stay private without manually creating per-developer branches. A `doppler.yaml` file in the project root can pin a directory to the `dev_personal` branch automatically.

Creating a branched config: go to a project, click **+** under the environment name, name the config (prefixed with the environment name, e.g. `dev_stripe_billing`).

Locking a config prevents accidental rename/delete (requires sufficient permission).

Example CLI usage for promoting a feature branch config's secret to root configs across environments:

```shell
doppler secrets set -c dev STRIPE_API_KEY=<STRIPE_TEST_KEY>
doppler secrets set -c stg STRIPE_API_KEY=<STRIPE_TEST_KEY>
doppler secrets set -c prd STRIPE_API_KEY=<STRIPE_LIVE_KEY>
doppler configs delete dev_stripe_billing
```
