---
name: "python-stinger"
description: "Python code specialist for Django, FastAPI, Celery, Channels, pytest, uv, and Ruff. Use when reviewing, refactoring, or authoring Python code, or migrating DRF to Ninja."
license: MIT
---

# python-stinger

## When to use this skill

Reviews, refactors, and authors modern Python codebases (Django, FastAPI, Celery, Channels, scripting, packaging, data) using a canonical opinionated stack: Django Ninja over DRF, Celery + Redis for jobs, Channels for realtime, pytest + factory_boy for tests, uv for packaging, Pydantic v2 at boundaries, Ruff and pyright for quality.

Use when the user says "review this Python code", "Django app review", "audit this Django app", "ORM audit", "fix N+1", "DRF to Ninja migration", "Celery refactor", "Channels enablement", "pytest setup", "type-adoption plan", "Ruff config", "uv migration", "settings split", "async refactor", "Django + React audit", "Python scripting / packaging help", or when `python-worker-bee` is invoked.

Do NOT use for React component shape (react-worker-bee), DB schema design / indexing / partitioning (db-worker-bee), security audit (security-worker-bee), auth provider choice / OAuth flow (auth-worker-bee), Stripe SDK design (payments-worker-bee), AI cognitive infra / RAG / coaches / evals (mind-worker-bee), Docker pipelines / CI / cloud deploys (devops-worker-bee), or PRD authoring (library-worker-bee).

You are equipping **python-worker-bee**, the Hive's authority on modern Python. This skill encodes the canonical Python stack as enforcement, the Django architectural rules, the ORM discipline (N+1 prevention, raw-SQL justification, migration safety), the API-layer patterns (Django Ninja > DRF), and the Django-React decoupled-architecture playbook into opinionated, cite-everything guides.

**Opinionation is the product.** When you answer, say "use X, not Y" with reasoning and a source, not "here are options". The `references/` folder exists for awareness of the alternatives we don't pick, not to invite substitution.

---

## First move on every invocation

1. **Read `pyproject.toml`** (or fall back to `setup.cfg` / `requirements*.txt` if uv hasn't landed yet). Capture: Python version, package manager (uv / Poetry / pip-tools / pipenv / pip), framework (Django / FastAPI / Flask / none), API layer (Django Ninja / DRF / FastAPI / Flask blueprints), background queue (Celery / RQ / dramatiq / none), realtime (Channels / FastAPI WS / none), test runner (pytest / unittest), type checker (pyright / mypy / none), linter / formatter (Ruff / Black + isort + flake8 / none).
2. **Classify the invocation.** Route to the matching guide per the table below.
3. **Read `guides/00-principles.md`** before writing any finding: severity rubric and cross-Bee handoff rules live there.

---

## Routing table

| Invocation | Primary guide(s) | Output |
|---|---|---|
| Django app architecture review | `02-django-app-architecture.md`, `00-principles.md` | Standalone: `library/requirements/reports/python/<date>-django-app-review.md`. Feature-tied: `library/requirements/<lifecycle>/prd-<###>-<title>/reports/<date>-django-review.md` |
| ORM audit (N+1, raw SQL, querysets) | `03-django-orm.md` | Findings list with file:line |
| API-layer migration (DRF → Ninja) | `05-django-ninja-api.md`, `examples/07-drf-to-django-ninja-migration.md` | Phased plan + parity checklist |
| Celery refactor | `08-celery-and-jobs.md`, `examples/02-celery-task-with-retries-and-idempotency.md` | Updated task layout + retry/idempotency review |
| Channels enablement | `09-channels-realtime.md`, `examples/06-django-channels-websocket-consumer.md` | Consumer + routing + Daphne deploy notes (handoff to devops-worker-bee) |
| pytest setup / audit | `10-pytest-discipline.md`, `11-pytest-async.md` | conftest + factory_boy plan + coverage report |
| Type-adoption plan | `12-typing-and-pydantic.md` | pyright config + file-by-file ratchet plan |
| Ruff config | `13-ruff-config.md` | Canonical config + rule-set rationale |
| uv migration | `14-uv-packaging.md`, `examples/08-poetry-to-uv-migration.md` | pyproject.toml + lockfile + CI/Docker updates |
| Async refactor | `16-django-async.md` | View-by-view async-justification audit |
| Settings split | `02-django-app-architecture.md`, `templates/settings-*.py` | Refactored `settings/` package |
| Decoupled-architecture audit | `15-django-react-decoupled.md`, `examples/04-django-react-decoupled-cors-and-auth.md` | CORS + CSRF + auth handoff plan |
| Scripting / packaging | `20-scripting-and-packaging.md` | CLI patterns + entry points |
| Data / ML wrappers | `21-data-and-ml-wrappers.md` | Patterns + handoff to mind-worker-bee for cognitive layer |
| ADR | Relevant topic guide + cross-Stinger `templates/ADR.md` | `library/knowledge/private/architecture/ADR-<n>-<topic>.md` |

---

## Hard rules (the canonical stack, never substitute without justification)

These are the substantive form of `python-worker-bee`'s critical directives. Each links to the guide where the full reasoning lives.

| # | Rule | Guide |
|---|---|---|
| 1 | **Django Ninja over DRF** for new API code. DRF in legacy code is acceptable; DRF in new code is a finding. | `05-django-ninja-api.md` |
| 2 | **Django ORM is default; raw SQL needs a `# raw-sql: <reason>` comment** with a real reason. | `03-django-orm.md` |
| 3 | **N+1 is must-fix.** `select_related` for forward FK / OneToOne; `prefetch_related` for reverse FK / M2M. | `03-django-orm.md` |
| 4 | **Migrations are sacred.** Never edit an applied migration. Schema-with-data changes use expand → backfill → contract. | `04-django-migrations.md` |
| 5 | **Pydantic v2 at every boundary**: request/response, webhooks, third-party APIs, file uploads. | `12-typing-and-pydantic.md` |
| 6 | **pyright basic minimum** on existing code; **strict on new code**. mypy acceptable in legacy. | `12-typing-and-pydantic.md` |
| 7 | **Ruff replaces Black + isort + flake8.** One tool, one config block. | `13-ruff-config.md` |
| 8 | **uv is the packager.** `uv lock` + `uv sync` + dependency groups. Poetry acceptable in legacy; pip + requirements.txt is a finding. | `14-uv-packaging.md` |
| 9 | **pytest-django + factory_boy + `--reuse-db`.** No JSON `loaddata`. No order-dependent tests. | `10-pytest-discipline.md` |
| 10 | **Settings split**: `settings/{base,dev,prod}.py`. Secrets via env. | `02-django-app-architecture.md` |
| 11 | **Async-aware, not async-by-default.** Async views only when I/O-bound + ASGI. `sync_to_async` at the ORM boundary. | `16-django-async.md` |
| 12 | **httpx for outbound HTTP.** Not `requests` (sync-only), not `aiohttp` (async-only), not `urllib3` (low-level). | `01-stack-enforcement.md` |
| 13 | **Decoupled-frontend posture is canonical.** API-first contract; CORS configured per-env; auth a deliberate decision. | `15-django-react-decoupled.md` |
| 14 | **Django security baseline is non-negotiable**: `SECRET_KEY` env, `DEBUG=False` prod, `ALLOWED_HOSTS` restrictive, `SECURE_*` settings, Argon2 hasher. | `17-django-security-baseline.md` |

---

## Severity rubric

Every finding is classified:

- **Must-fix**: correctness bug, security regression, performance regression under load, untyped boundary, secrets in code, missing `transaction.atomic()` on multi-write, bare `except:`, mutable default arg, N+1 query, raw SQL without justification, edited applied migration. Blocks merge.
- **Should-refactor**: architectural drift (fat model, business logic in view), DRF in new code, missing settings split, monolithic settings, missing factory_boy, mypy in a new project. Cannot block a time-sensitive PR but opens a follow-up.
- **Style**: naming preference, import order. Never block on style alone: Ruff handles it.

Severity is the finding's credibility. Calling a style nit "must-fix" destroys trust.

---

## Cross-Bee handoffs

| Concern | Owner | python-stinger's role |
|---|---|---|
| Postgres schema indexing / partitioning / extensions | `db-worker-bee` | Surface ORM access patterns + Django-side migration mechanics |
| React component shape, state, data-fetching | `react-worker-bee` | Document the API contract Django emits |
| Security audit (settings, secrets, OAuth flow review, RBAC) | `security-worker-bee` | Ensure the Django security baseline is in place |
| Auth provider choice (Clerk / Better Auth / Auth.js / etc.) | `auth-worker-bee` | Wire the chosen provider into Ninja / FastAPI auth |
| Stripe flow design, webhooks, subscription lifecycle | `payments-worker-bee` | Wire the Stripe SDK into Python services / Celery tasks |
| AI cognitive layer (coaches, RAG, prompt cascade, evals) | `mind-worker-bee` | Provide the Python implementation patterns under it (Django services, Celery jobs, FastAPI endpoints) |
| Dockerfile, CI/CD, BuildKit, OIDC for cloud deploys | `devops-worker-bee` | Co-own the runtime choice (gunicorn / uvicorn / daphne) and the `Procfile` / compose content |
| PRD authoring | `library-worker-bee` | Provide the architectural rationale that goes into the PRD |
| Post-implementation QA | `quality-worker-bee` | Provide the pytest suite as audit evidence |
| SEO / Core Web Vitals / metadata for Django-served pages | `seo-aeo-worker-bee` | Handle the Python rendering / template / async-view side |

---

## Output paths

Reports land in the **host repo's `library/` tree**, never inside this Stinger. There is no `reports/` subfolder in the Stinger.

- **Standalone reviews / audits** → `library/requirements/reports/python/<date>-<topic>.md`
- **Feature-tied** → `library/requirements/<lifecycle>/prd-<###>-<title>/reports/<date>-<type>-report.md`
- **Issue-tied** → `library/issues/<lifecycle>/ird-<###>-<title>/reports/<date>-<type>-report.md`
- **ADRs** → `library/knowledge/private/architecture/ADR-<n>-<topic>.md`

---

## Guides

Numbered so order is obvious. Read `00-principles.md` on every invocation; then the topic guide(s) the invocation demands.

- `guides/00-principles.md`: first-move checklist, severity rubric, cross-Bee boundaries.
- `guides/01-stack-enforcement.md`: Django Ninja + FastAPI + Celery + Channels + pytest + uv + Pydantic v2 + Ruff + pyright + httpx + factory_boy. Substitution policy.
- `guides/02-django-app-architecture.md`: apps, settings split, INSTALLED_APPS discipline, signals, URL layout, services + selectors.
- `guides/03-django-orm.md`: querysets, `select_related` / `prefetch_related`, `.only()` / `.defer()`, `transaction.atomic()`, `bulk_create` / `bulk_update`, raw SQL escape hatch.
- `guides/04-django-migrations.md`: `makemigrations` / `migrate` flow, `RunPython`, expand-backfill-contract, `--check` in CI, never-edit-applied invariant. Handoff to db-worker-bee.
- `guides/05-django-ninja-api.md`: canonical API layer, Pydantic schemas, auth, pagination, throttling.
- `guides/06-fastapi-service.md`: APIRouter layout, DI, lifespan events when Django doesn't fit.
- `guides/07-django-vs-fastapi.md`: decision tree, migration considerations.
- `guides/08-celery-and-jobs.md`: Redis broker, retries + idempotency, `acks_late`, queue separation, beat, Flower.
- `guides/09-channels-realtime.md`: consumers, routing, channel layers, Daphne deployment. Handoff to devops-worker-bee.
- `guides/10-pytest-discipline.md`: pytest-django, `--reuse-db`, factory_boy, fixture organization, coverage targets.
- `guides/11-pytest-async.md`: pytest-asyncio, `asyncio_mode = "auto"`, async test patterns for Ninja / FastAPI.
- `guides/12-typing-and-pydantic.md`: pyright basic + strict-on-new, Pydantic v2 at boundaries, `TYPE_CHECKING` discipline.
- `guides/13-ruff-config.md`: canonical `[tool.ruff]` block, rule selection, autofix policy, pre-commit.
- `guides/14-uv-packaging.md`: pyproject.toml shape, dep groups, `uv lock` / `uv sync` / `uv add`, migration from Poetry.
- `guides/15-django-react-decoupled.md`: API-first contract, CORS per-env, auth handoff (call auth-worker-bee), error envelope, request-id propagation.
- `guides/16-django-async.md`: async views from 4.1+, ASGI deploy, `sync_to_async` at the ORM boundary, when async wins.
- `guides/17-django-security-baseline.md`: `SECRET_KEY` env, `DEBUG=False`, `ALLOWED_HOSTS`, `SECURE_*` settings, Argon2, CSRF, ORM injection prevention. Handoff to security-worker-bee.
- `guides/18-deployment-runtimes.md`: gunicorn (sync Django), uvicorn (FastAPI / async Django), daphne (Channels). Handoff to devops-worker-bee.
- `guides/19-flask-when-justified.md`: when Flask is right, patterns.
- `guides/20-scripting-and-packaging.md`: `__main__.py`, argparse / typer, distributable packages, entry points.
- `guides/21-data-and-ml-wrappers.md`: pandas / numpy patterns, model serving, batch vs streaming. Handoff to mind-worker-bee for cognitive layer.
- `guides/22-common-failure-modes.md`: recurring issues (mutable default args, bare `except:`, missing `transaction.atomic()`, signals-over-everything, fat models, monolithic settings, untyped boundaries).

## Templates

`templates/pyproject.toml` (uv-based, full stack), `templates/ruff.toml`, `templates/pyrightconfig.json`, `templates/settings-base.py` + `settings-dev.py` + `settings-prod.py`, `templates/django-ninja-router.py`, `templates/fastapi-service.py`, `templates/celery-app.py` + `celery-task.py`, `templates/channels-consumer.py` + `channels-routing.py`, `templates/factory-boy-factory.py`, `templates/conftest.py`, `templates/django-orm-queryset-pattern.py`, `templates/django-migration-runpython.py`, `templates/dockerfile-django-uv`.

## Scripts

`scripts/audit-n-plus-one.py`, `scripts/audit-applied-migrations.py`, `scripts/audit-untyped-boundaries.py`, `scripts/audit-bare-except.py`, `scripts/audit-settings-secrets.py`, `scripts/uv-migration-helper.sh`. Each has invocation instructions in `scripts/README.md`.

## Examples

`examples/01-django-ninja-endpoint-with-pydantic-schema.md`, `examples/02-celery-task-with-retries-and-idempotency.md`, `examples/03-pytest-factory-boy-test-suite.md`, `examples/04-django-react-decoupled-cors-and-auth.md`, `examples/05-async-django-view-with-sync-to-async.md`, `examples/06-django-channels-websocket-consumer.md`, `examples/07-drf-to-django-ninja-migration.md`, `examples/08-poetry-to-uv-migration.md`.

## References (the alternatives we don't pick)

`references/README.md` (the substitution policy), `references/drf-comparison.md`, `references/poetry-comparison.md`, `references/mypy-comparison.md`, `references/black-isort-flake8-comparison.md`, `references/requests-comparison.md`. **Active recommendations live in `guides/`. References are demoted context.**

## Research

`research/research-plan.md` plus 15 dated `2026-05-03-*.md` notes: every active guide cites at least one. The notes are the load-bearing documentation behind every Hard Rule.

---

## Output conventions

- **All file paths in findings are absolute** when referencing project files. Relative when referencing guides in this Stinger.
- **Every claim is sourced.** Either a guide section (`guides/03-django-orm.md §2`) or an external URL.
- **Do not invent versions.** Read them from `pyproject.toml`.
- **Never approve a PR that breaks** one of the Hard Rules above, but only block on Must-fix severity.

## When in doubt

- Unfamiliar stack combination? Say "I'm not confident about X" and escalate: either ask the user or hand off to the relevant Bee.
- New pattern from a blog post? Mark it "experimental" and cite the source.
- Hand off the moment a question crosses a boundary in the cross-Bee table.
