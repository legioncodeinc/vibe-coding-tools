# Research Plan: python-stinger

Forge date: 2026-05-03

## Goal

Ground every active guide in `python-stinger/guides/` against (a) authoritative upstream docs, (b) production-pattern blog posts from teams shipping the canonical stack, and (c) curated style guides. Each research note documents one query's findings, the source URLs, retrieval date, and the specific guides it informs.

## Authoritative anchor sources (cited across multiple guides)

- **Django**: https://docs.djangoproject.com/en/stable/
- **Django Ninja**: https://django-ninja.dev/
- **FastAPI**: https://fastapi.tiangolo.com/
- **Celery**: https://docs.celeryq.dev/en/stable/
- **Channels**: https://channels.readthedocs.io/en/stable/
- **Pydantic v2**: https://docs.pydantic.dev/latest/
- **pytest / pytest-django**: https://docs.pytest.org/, https://pytest-django.readthedocs.io/
- **factory_boy**: https://factoryboy.readthedocs.io/
- **Ruff**: https://docs.astral.sh/ruff/
- **uv**: https://docs.astral.sh/uv/
- **pyright**: https://microsoft.github.io/pyright/
- **httpx**: https://www.python-httpx.org/
- **HackSoftware Django Styleguide**: https://github.com/HackSoftware/Django-Styleguide
- **OWASP Django Cheat Sheet**: https://cheatsheetseries.owasp.org/cheatsheets/Django_Security_Cheat_Sheet.html

## Search queries executed (2026-05-03)

| # | Query | Note file | Primary guides informed |
|---|---|---|---|
| 1 | Django Ninja vs DRF 2026 production patterns migration | `2026-05-03-django-ninja-vs-drf.md` | `05-django-ninja-api.md`, `examples/07-drf-to-django-ninja-migration.md`, `references/drf-comparison.md` |
| 2 | Django async views 4.1 ASGI sync_to_async patterns | `2026-05-03-django-async-views.md` | `16-django-async.md`, `18-deployment-runtimes.md`, `examples/05-async-django-view-with-sync-to-async.md` |
| 3 | Celery + Django + Redis broker best practices retries idempotency | `2026-05-03-celery-django-redis.md` | `08-celery-and-jobs.md`, `examples/02-celery-task-with-retries-and-idempotency.md` |
| 4 | Channels v4 daphne deployment channel-layer redis | `2026-05-03-channels-v4-daphne.md` | `09-channels-realtime.md`, `examples/06-django-channels-websocket-consumer.md` |
| 5 | pytest-django reuse-db factory_boy fixture patterns | `2026-05-03-pytest-django-factory-boy.md` | `10-pytest-discipline.md`, `examples/03-pytest-factory-boy-test-suite.md` |
| 6 | uv vs Poetry migration lockfile workflow | `2026-05-03-uv-vs-poetry.md` | `14-uv-packaging.md`, `examples/08-poetry-to-uv-migration.md`, `references/poetry-comparison.md` |
| 7 | pyright vs mypy strict mode Django Pydantic | `2026-05-03-pyright-vs-mypy.md` | `12-typing-and-pydantic.md`, `references/mypy-comparison.md` |
| 8 | Ruff config Python replace Black isort flake8 | `2026-05-03-ruff-config.md` | `13-ruff-config.md`, `references/black-isort-flake8-comparison.md` |
| 9 | HackSoftware Django Styleguide services selectors | `2026-05-03-hacksoftware-styleguide.md` | `02-django-app-architecture.md`, `22-common-failure-modes.md` |
| 10 | Pydantic v2 + Django Ninja schema patterns | `2026-05-03-pydantic-v2-ninja-schemas.md` | `05-django-ninja-api.md`, `12-typing-and-pydantic.md` |
| 11 | httpx async client production patterns | `2026-05-03-httpx-async-production.md` | `01-stack-enforcement.md`, `references/requests-comparison.md` |
| 12 | Django ORM N+1 prevention select_related prefetch_related | `2026-05-03-django-orm-n-plus-one.md` | `03-django-orm.md`, `scripts/audit-n-plus-one.py` |
| 13 | Django zero-downtime migrations expand backfill contract | `2026-05-03-django-zero-downtime-migrations.md` | `04-django-migrations.md` |
| 14 | Django security checklist SECURE_SSL_REDIRECT HSTS Argon2 | `2026-05-03-django-security-baseline.md` | `17-django-security-baseline.md` |
| 15 | Django + React decoupled architecture CORS auth | `2026-05-03-django-react-decoupled.md` | `15-django-react-decoupled.md`, `examples/04-django-react-decoupled-cors-and-auth.md` |

## Open questions (carried forward in `gaps.md`)

- async ORM (`aget`, `acreate`, etc.) maturity at Django 5.x: guides reflect current state with the conservative recommendation that the bridge (`sync_to_async`) is still the default for non-trivial reads.
- Whether `django-ninja-extra` (class-based views + permissions in Ninja) should be canonical: left as situational; not promoted in active guides.
- Daphne vs Uvicorn for Channels: Daphne remains canonical per upstream guidance, Uvicorn is acceptable but loses Channels-tuned defaults.
