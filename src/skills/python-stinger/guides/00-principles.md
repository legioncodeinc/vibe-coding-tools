# 00: Principles

The non-negotiables. Read on every invocation.

## The fourteen principles

### 1. Read `pyproject.toml` first, always

Python ecosystem fragmentation means a recommendation for the wrong stack is wrong advice. Before anything else, capture:

- Python version (`requires-python` or `.python-version`)
- Package manager: uv if `uv.lock` is present; Poetry if `poetry.lock`; pip-tools if `requirements*.txt` + a `compile` step; pip-only if just `requirements.txt`.
- Web framework (`django`, `fastapi`, `flask`, none).
- API layer (`django-ninja`, `djangorestframework`, FastAPI routes, Flask blueprints).
- Background queue (`celery`, `rq`, `dramatiq`, none).
- Realtime (`channels`, `daphne`, `channels-redis`).
- Test runner (`pytest`, `pytest-django`, `pytest-asyncio`, `factory-boy`).
- Type checker (`pyright` config, `mypy.ini`, `[tool.mypy]`).
- Linter / formatter (`ruff`, `black`, `isort`, `flake8`).

Source: every guide in this Stinger assumes you've done step 1.

### 2. Stack is canon, not recommendation

The active guides recommend one tool per slot. Substitution requires an ADR with eval evidence and a migration plan. The `references/` folder catalogs the alternatives we don't pick; read them for context, not as invitations to substitute. Source: `guides/01-stack-enforcement.md`.

### 3. Django Ninja over DRF

When new API code goes in, the answer is Django Ninja with a Pydantic schema. DRF in legacy code stays until a deliberate migration. DRF in new code is a **should-refactor** finding (or a **must-fix** if the project has Ninja already adopted). Source: `research/2026-05-03-django-ninja-vs-drf.md`, `guides/05-django-ninja-api.md`.

### 4. Django ORM is default; raw SQL needs a reason

`Model.objects.filter().select_related(...)` is canonical. Raw SQL is acceptable for performance-critical queries, complex CTEs, or vendor-specific features, but the file gets a `# raw-sql: <reason>` comment with a real reason. Source: `guides/03-django-orm.md`.

### 5. N+1 is must-fix

Any view, serializer, schema resolver, or template that triggers per-object queries gets `select_related` (forward FK / OneToOne) or `prefetch_related` (reverse FK / M2M). Cite the offending site + the fix. Source: `research/2026-05-03-django-orm-n-plus-one.md`.

### 6. Migrations are sacred

Never edit an applied migration. Schema-with-data changes use the **expand → backfill → contract** pattern over multiple deploys. CI runs `manage.py migrate --check`. Source: `guides/04-django-migrations.md`, `research/2026-05-03-django-zero-downtime-migrations.md`.

### 7. Pydantic v2 at every boundary

API requests and responses are Pydantic models (Django Ninja and FastAPI carry this for free). External data (webhooks, third-party APIs, file uploads, Celery task args) is parsed with Pydantic at entry. Untyped boundaries are a **must-fix**. Source: `guides/12-typing-and-pydantic.md`.

### 8. pyright basic minimum, strict on new code

`typeCheckingMode: "basic"` everywhere; `"strict"` on new files; ratchet up file-by-file as files are touched. mypy is acceptable in legacy or when its Django/SQLAlchemy plugins are doing load-bearing work. Source: `research/2026-05-03-pyright-vs-mypy.md`.

### 9. Ruff replaces Black + isort + flake8

One tool, one config block, autofix on save, runs in pre-commit. Source: `guides/13-ruff-config.md`.

### 10. uv is the packager

`uv lock` produces the lockfile; `uv sync --frozen` installs in CI; `uv add` / `uv remove` manage deps. Poetry is acceptable in legacy projects; pip + `requirements.txt` in any non-trivial project is a **should-refactor** finding. Source: `guides/14-uv-packaging.md`.

### 11. Test isolation discipline

pytest-django with `--reuse-db` for fast cycles. factory_boy for fixture authoring (no JSON `loaddata`). Async tests use pytest-asyncio with `asyncio_mode = "auto"`. No test depends on order. Source: `guides/10-pytest-discipline.md`.

### 12. Settings split is mandatory beyond hello-world

`settings/base.py` + `settings/dev.py` + `settings/prod.py` (and `staging.py` if applicable). Selected via `DJANGO_SETTINGS_MODULE`. Secrets via env, never committed. Source: `templates/settings-base.py` + variants.

### 13. Async-aware, not async-by-default

Django async views from 4.1+: use them when the view is I/O-bound and you deploy on ASGI. Wrap sync ORM calls with `sync_to_async()` at the boundary. FastAPI is async-native; don't fight it with sync handlers. Source: `guides/16-django-async.md`.

### 14. Decoupled-frontend posture is canonical

Python service emits JSON; React consumes it. CORS configured per-environment. Auth is a deliberate decision (session vs JWT vs external, call `auth-worker-bee`). Django templates are out of scope unless the project is admin-only or a server-rendered legacy. Source: `guides/15-django-react-decoupled.md`.

---

## First-move checklist

Before writing findings, confirm:

- [ ] `pyproject.toml` (or `setup.cfg` / `requirements*.txt`) read; stack map captured.
- [ ] Invocation classified per the routing table in `SKILL.md`.
- [ ] Severity rubric in mind (must-fix / should-refactor / style).
- [ ] Cross-Bee handoff lines clear: escalate at the boundary, don't author work the other Bee owns.

## Cross-Bee boundaries

The full table lives in `SKILL.md`. The short version: surface concerns at the boundary; don't author work the other Bee owns.

| Question | Owner |
|---|---|
| Postgres schema indexing / partitioning / extensions | `db-worker-bee` |
| React component shape, state, data fetching | `react-worker-bee` |
| Security audit (settings, secrets, OAuth flow, RBAC) | `security-worker-bee` |
| Auth provider choice (Clerk / Better Auth / etc.) | `auth-worker-bee` |
| Stripe flow design, webhooks, subscriptions | `payments-worker-bee` |
| AI cognitive layer (coaches, RAG, evals, vector DB) | `mind-worker-bee` |
| Dockerfile, CI/CD, BuildKit, cloud deploys | `devops-worker-bee` |
| PRD authoring | `library-worker-bee` |
| Post-refactor QA verification | `quality-worker-bee` |
| SEO / metadata / Core Web Vitals | `seo-aeo-worker-bee` |

## Severity rubric (rephrased for clarity)

| Severity | Examples | Blocks merge? |
|---|---|---|
| **Must-fix** | N+1 query; raw SQL with no `# raw-sql:` comment; secrets in code; `DEBUG=True` in prod settings; bare `except:`; mutable default arg; missing `transaction.atomic()` on multi-write; untyped API boundary (`def view(request, data: dict)`); edited applied migration; SQL injection vector | Yes |
| **Should-refactor** | DRF in new code; fat model holding business logic; missing settings split; Poetry in a new project (uv canonical); mypy in a new project (pyright canonical); missing factory_boy (using JSON fixtures); signals doing business logic | No: opens follow-up |
| **Style** | Naming nit; import order; line length over 88 | Never: Ruff handles it |

Calling a style nit "must-fix" destroys your credibility for the next finding. Be disciplined.

## Citation discipline

Every finding has two citations:

1. **Where in the user's codebase**: `apps/orders/services.py:42`.
2. **Why it's a finding**: guide section (`guides/03-django-orm.md §3`) or external URL.

No citations means the finding is opinion, not enforcement.

## Scope explicitly excluded (v1)

- **AI cognitive layer.** Python is the runtime, but coaches / RAG / prompt cascade / evals belong to `mind-worker-bee`. Surface the Python implementation patterns; don't author the cognitive design.
- **DB schema engineering.** Indexing strategies, partitioning, vendor extensions, raw schema design → `db-worker-bee`. The Django ORM access patterns, queryset optimization, Django-side migration mechanics → this Stinger.
- **OAuth provider integration.** The Python wiring (Ninja `HttpBearer` subclass, FastAPI dependency, Django session config) is here; the provider choice is `auth-worker-bee`.

When in doubt, escalate.
