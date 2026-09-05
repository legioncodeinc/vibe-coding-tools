# Project / config naming convention example

Grounded in [raw/doppler--project-config--root-configs-and-branch-configs.md], [raw/doppler--project-config--workplace-structure-naming.md].

## Default recommendation for a single-service SvelteKit app on Vercel

One project, three root configs, no branch splitting until a genuine second deployable exists:

```
myapp                        (Doppler project)
├── dev                      (root config - local development)
│   └── dev_personal          (auto-created per developer, private)
├── stg                      (root config - Vercel Preview environment)
└── prd                      (root config - Vercel Production environment)
```

CLI setup for this layout:

```shell
doppler setup    # in the repo root, choose project=myapp, config=dev_personal
```

Vercel integration setup: one Doppler sync per Vercel environment, mapping `myapp/stg` -> Vercel Preview and `myapp/prd` -> Vercel Production (see `references/vercel-doppler-comparison.md` and the Vercel setup steps in `guides/03-vercel-integration-and-sync.md`).

## When a `ci` config earns its place

If GitHub Actions needs its own secret set distinct from `dev`/`stg`/`prd` (for example, a scoped test-database credential that should never be the same value as staging), add a custom environment:

```
myapp
├── dev
│   └── dev_personal
├── ci                       (custom environment, e.g. CI-scoped test DB)
├── stg
└── prd
```

## When the app grows a second deployable (worker, cron job, admin panel)

Only branch out into a second project once there's a genuinely separate service - not preemptively. Two reasonable patterns, both documented in the source with real trade-offs (`references/research/raw/doppler--project-config--workplace-structure-naming.md`):

**Option A - separate projects per service** (more projects, finer per-service access control):

```
myapp-web
├── dev / dev_personal, stg, prd
myapp-worker
├── dev / dev_personal, stg, prd
```

**Option B - one project, branch configs per service** (fewer projects, coarser access control - granting `prd` access grants every `prd_*` branch under it):

```
myapp
├── dev, dev_frontend, dev_worker
├── stg
└── prd, prd_frontend, prd_worker
```

Default to Option A for this Hive's stack unless a specific reason (small team, low secret-sprawl risk, strong preference for fewer projects) points to Option B - Option A keeps the access-control story simple and matches the "Application + Service" pattern the source calls out as best for teams that need to separate access by service.

## Shared secrets across services (e.g. a Neon connection string used by both `myapp-web` and `myapp-worker`)

Create a dedicated shared project, restrict its access to admins, and reference it from each application project instead of duplicating the value:

```
myapp-shared-credentials
├── dev, stg, prd    (holds e.g. DATABASE_URL, RESEND_API_KEY)
```

Reference from `myapp-web`'s `prd` config:

```
DATABASE_URL = ${myapp-shared-credentials.prd.DATABASE_URL}
```

## Naming rules worth keeping

- Hyphen-separated, lowercase project names [raw/doppler--project-config--root-configs-and-branch-configs.md].
- Put the part of the name you want to group/filter by earliest in the string (team prefix, then app name, then region suffix if applicable) [raw/doppler--project-config--workplace-structure-naming.md].
- Prefix shared-secret projects consistently (`shared-`, `global-`) so they sort together in the project list [raw/doppler--project-config--workplace-structure-naming.md].
- Stay well under the 15-environments-per-project cap; if you're approaching it, that's a signal the project boundary is probably wrong (see the "one project per team" anti-pattern) [raw/doppler--project-config--workplace-structure-naming.md].
