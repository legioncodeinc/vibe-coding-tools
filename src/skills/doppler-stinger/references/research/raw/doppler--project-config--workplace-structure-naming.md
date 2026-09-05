# Workplace structure and project/config naming conventions

- URL: https://docs.doppler.com/docs/workplace-structure ; https://docs.doppler.com/docs/default-environments
- Fetched: 2026-08-14
- Source type: Official docs (docs.doppler.com)
- Component: Workplace organization / naming

## Content

The pattern adopted for naming projects and configs affects access control, secret comparison features, and cryptographic-operation cost. Doppler assumes a project maps one-to-one to a specific application or service.

### Project naming

- Doppler has no folders for grouping projects; use naming prefixes/suffixes to group logically (team name prefix, region code suffix).
- Put the portion of the name you want to filter/group by earliest in the string.
- Maximum projects per workplace: 1000 (Enterprise plans may request a review to raise this).

### Environment naming

- Environments should map to real deployment environments (`dev`, `stg`, `prd`, `qa`, `ci`, etc.). The environment slug is used in the API/CLI and prefixes Branch Config names (e.g. `dev_`), and is called the Root Config.
- Doppler assumes all Environments in a project are logically related (secrets will be similar across them) - this affects comparison features and prompts, and cryptographic operations get more expensive with large secret sets spread across many environments, especially unrelated ones.
- Access control for an Environment cascades to all Branch Configs under it (Personal Configs are the one exception).
- Maximum Environments per project: 15.
- A workplace can define its own **Default Project Environments** template (name, slug, branch configs, personal-configs default) so every new project starts consistent.

### Shared secrets across projects

For secrets used by many projects (`DATABASE_URL`, `STRIPE_API_KEY`, etc.), use config inheritance or cross-project secret references instead of duplicating values. Recommended pattern: dedicated project for shared secrets (e.g. `shared-db-credentials`), access-restricted to admins, referenced from application projects via `${project.config.SECRET_NAME}`. Use "Restricted" secret visibility on the target config to hide the computed reference value from users who shouldn't see it (note: this also blocks CLI use of that config, so avoid in `dev`).

### Project/config structure examples (imaginary company "Acme")

| Pattern | Example | Trade-off |
| --- | --- | --- |
| Application + Service | `eng-acme-widgets-frontend` with `dev`/`stg`/`prd` and `prd_aws`/`prd_gcp` branches | Best access-control granularity, more projects to manage |
| Application only | `eng-acme-widgets` with `dev`, `dev_frontend`, `dev_worker` branches | Fewer projects, but access control only at Environment level (all branch configs under an environment inherit access) |
| Monolith | `eng-acme-widgets` with plain `dev`/`stg`/`prd` | Simplest, fits single-service apps |
| Region-suffixed | `eng-acme-widgets-frontend-us`, `-eu` as separate projects, or as `prd_us`/`prd_eu` branch configs | Separate projects = per-region access control but more sprawl; branch configs = less sprawl but coarser access control |

### Anti-pattern: one project per team

Creating a single project per team and using Environments to represent each service (`frontend`, `backend`, `worker` instead of `dev`/`stg`/`prd`) scales poorly: it hits the 15-environment cap quickly and triggers the expensive cross-environment comparison operations described above, because Doppler assumes environments under one project are logically related deployment stages, not distinct services.

### Dynamic/ephemeral environments

For PR-review apps or other ephemeral configs, use a dedicated environment (e.g. `pr`) with one branch config per PR ID (e.g. `pr_12345`), and scope an access token narrowly to that environment so automation can't accidentally touch other environments. Feature-branch work that doesn't need collaboration should use Personal Configs (`dev_personal`) instead of a manually created branch.
