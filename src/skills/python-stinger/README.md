# python-stinger

Cursor skill that equips **python-worker-bee** to be the authority on modern Python: opinionated, modern, grounded in production-proven patterns rather than tutorial tropes. Encodes a canonical stack as enforcement, applies it across Django app architecture, the API layer, async work, realtime, testing, type discipline, packaging, and the Django-React decoupled-architecture surface.

Entry point: `SKILL.md`.

## Canonical stack

The product is opinionation. The active guides recommend exactly one tool per slot:

| Slot | Pick | Reasoning |
|---|---|---|
| Web framework (full-stack) | Django | First choice when you need ORM, admin, migrations, auth scaffolding |
| API layer | Django Ninja | Pydantic-first, FastAPI-style, less ceremony than DRF |
| API framework (no Django) | FastAPI | When Django doesn't fit |
| Background jobs | Celery + Redis | Mature, battle-tested at scale |
| Realtime / WebSockets | Channels + Daphne + channels_redis | Official Django integration |
| Tests | pytest + pytest-django + factory_boy + pytest-asyncio | The discipline-friendly stack |
| Packaging | uv | Replaces pyenv + virtualenv + pip + Poetry + pip-tools |
| Type checker | pyright (basic on existing, strict on new) | Pylance ships with VS Code; spec conformance leader |
| Linter / formatter | Ruff | Replaces Black + isort + flake8 + pyupgrade |
| Validation at boundaries | Pydantic v2 | Carried by Ninja and FastAPI for free |
| HTTP client | httpx | Sync + async + HTTP/2 in one API |

Substitution requires an ADR (`library/knowledge/private/architecture/ADR-<n>-*.md`) with eval evidence and a migration plan.

## Scope

- **Owns:** Django app architecture, ORM discipline, migrations safety, the API layer, Celery jobs, Channels realtime, pytest setup, type-checking adoption, Ruff config, uv migration, async refactors, settings split, Django-React decoupled-architecture audits, generalist Python (scripting, packaging, data, ML wrappers).
- **Does not own:** React component shape (`react-worker-bee`), DB schema design (`db-worker-bee`), security audit (`security-worker-bee`), auth provider choice (`auth-worker-bee`), Stripe flow design (`payments-worker-bee`), AI cognitive infra (`mind-worker-bee`), Docker / CI / cloud deploys (`devops-worker-bee`), PRD authoring (`library-worker-bee`), post-implementation QA (`quality-worker-bee`).

## Layout

```
python-stinger/
  SKILL.md                Navigation, hard rules, severity rubric, routing table
  README.md               This overview
  guides/                 23 numbered guides (00-principles → 22-failure-modes)
  templates/              13 templates (pyproject.toml, settings, Ninja router, FastAPI, Celery, Channels, factory, conftest, ORM, migration, Dockerfile, Ruff, pyright)
  scripts/                6 audit scripts + README
  examples/               8 worked examples (Ninja endpoint, Celery task, pytest suite, decoupled CORS+auth, async view, Channels WS, DRF→Ninja, Poetry→uv)
  references/             5 demoted-alternatives files + README
  research/               Research plan + 15 dated 2026-05-03 notes
```

## Reading order

Pick the entry path that matches the task:

- **Reviewing a Django app for the first time** → `guides/00-principles.md` → `guides/02-django-app-architecture.md` → `guides/03-django-orm.md` → `guides/22-common-failure-modes.md`.
- **DRF → Django Ninja migration** → `guides/05-django-ninja-api.md` → `examples/07-drf-to-django-ninja-migration.md` → `references/drf-comparison.md`.
- **Celery setup or refactor** → `guides/08-celery-and-jobs.md` → `examples/02-celery-task-with-retries-and-idempotency.md` → `templates/celery-app.py` + `templates/celery-task.py`.
- **Channels enablement** → `guides/09-channels-realtime.md` → `examples/06-django-channels-websocket-consumer.md` → `guides/18-deployment-runtimes.md`.
- **pytest setup** → `guides/10-pytest-discipline.md` → `guides/11-pytest-async.md` → `templates/conftest.py` + `templates/factory-boy-factory.py` → `examples/03-pytest-factory-boy-test-suite.md`.
- **Type adoption** → `guides/12-typing-and-pydantic.md` → `templates/pyrightconfig.json`.
- **Ruff config** → `guides/13-ruff-config.md` → `templates/ruff.toml` (or the `[tool.ruff]` block in `templates/pyproject.toml`).
- **Poetry → uv migration** → `guides/14-uv-packaging.md` → `examples/08-poetry-to-uv-migration.md` → `scripts/uv-migration-helper.sh`.
- **Django-React decoupled audit** → `guides/15-django-react-decoupled.md` → `examples/04-django-react-decoupled-cors-and-auth.md`.
- **Async refactor** → `guides/16-django-async.md` → `examples/05-async-django-view-with-sync-to-async.md`.
- **Security baseline check** → `guides/17-django-security-baseline.md` → `templates/settings-prod.py` → `scripts/audit-settings-secrets.py`.
- **Migration safety** → `guides/04-django-migrations.md` → `templates/django-migration-runpython.py` → `scripts/audit-applied-migrations.py`.

## Cross-Bee handoffs

| Concern | Owner |
|---|---|
| Postgres schema indexing / partitioning / extensions | `db-worker-bee` |
| React component shape, state management, data fetching | `react-worker-bee` |
| Security audit (settings, secrets, OAuth flow review, RBAC) | `security-worker-bee` |
| Auth provider choice (Clerk / Better Auth / Auth.js / etc.) | `auth-worker-bee` |
| Stripe flow design, webhooks, subscription lifecycle | `payments-worker-bee` |
| AI cognitive layer (coaches, RAG, prompt cascade, evals) | `mind-worker-bee` |
| Dockerfile, CI/CD, BuildKit, OIDC for cloud deploys | `devops-worker-bee` |
| PRD authoring | `library-worker-bee` |
| Post-implementation QA | `quality-worker-bee` |
| SEO / Core Web Vitals for Django-served pages | `seo-aeo-worker-bee` |

## Output convention

Reports are written into the **host repo's `library/` tree**, never inside this Stinger (there is no `reports/` subfolder in the Stinger):

- **Standalone reviews** → `library/requirements/reports/python/<date>-<topic>.md`
- **Feature-tied** → `library/requirements/<lifecycle>/prd-<###>-<title>/reports/<date>-<type>-report.md`
- **Issue-tied** → `library/issues/<lifecycle>/ird-<###>-<title>/reports/<date>-<type>-report.md`
- **ADRs** → `library/knowledge/private/architecture/ADR-<n>-<topic>.md`

Cursor sees this Stinger at `.claude/skills/python-stinger/` once deployed. In this repo it lives at `colony/.claude/skills/python-stinger/`.
