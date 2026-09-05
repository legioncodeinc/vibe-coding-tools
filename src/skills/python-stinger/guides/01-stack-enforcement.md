# 01: Stack Enforcement

The canonical stack and the substitution policy. This is the load-bearing document for opinionation.

## The stack

| Slot | Pick | Demoted alternatives (`references/`) |
|---|---|---|
| Web framework (full-stack) | **Django** (5.x) | Flask (when justified), FastAPI alone (no full-stack admin / migrations) |
| API layer (Django) | **Django Ninja** (1.x+) | DRF (`references/drf-comparison.md`) |
| API framework (no Django) | **FastAPI** | Flask, bare Starlette |
| Background jobs | **Celery + Redis broker** | RQ, dramatiq, arq, huey |
| Realtime / WebSockets | **Channels + Daphne + channels_redis** | FastAPI WebSockets (when no Django) |
| Tests | **pytest + pytest-django + factory_boy + pytest-asyncio + hypothesis (when it earns its keep)** | unittest, nose |
| Packaging | **uv** | Poetry (`references/poetry-comparison.md`), pip-tools, pipenv, raw pip |
| Type checker | **pyright** (basic on existing, strict on new) | mypy (`references/mypy-comparison.md`) |
| Linter + formatter | **Ruff** | Black + isort + flake8 (`references/black-isort-flake8-comparison.md`), pylint, autopep8, yapf |
| Validation at boundaries | **Pydantic v2** | marshmallow, attrs+cattrs, dataclasses-only |
| HTTP client | **httpx** | requests (`references/requests-comparison.md`), aiohttp, urllib3 direct |
| ASGI server (Django async / FastAPI) | **uvicorn** | hypercorn |
| ASGI server (Channels) | **daphne** | uvicorn (works but loses Channels-tuned defaults) |
| WSGI server (sync Django) | **gunicorn** | mod_wsgi, waitress |

## Substitution policy

A push to substitute requires:

1. **An ADR** at `library/knowledge/private/architecture/ADR-<n>-<topic>.md` documenting Context / Decision / Consequences / Alternatives Considered.
2. **Eval evidence**: show the substitute beats the canonical option on a metric the project actually cares about (latency, cost, dev velocity, ecosystem fit).
3. **A migration plan**: for stateful components (broker, vector DB), phased migration with parallel-running.
4. **A `references/` demotion** of the previous canonical choice.

Without all four, the substitution is a finding. The `references/` folder is not an invitation to substitute; it's awareness of the alternatives.

## Why this stack

- **Django Ninja over DRF.** Pydantic v2 schemas, function-based decorators, automatic OpenAPI / Swagger / ReDoc, dramatically less boilerplate. DRF's serializer + viewset + router stack carries history that Ninja does without.
- **Celery + Redis.** Mature, battle-tested, rich ecosystem (Flower, beat, prefork / gevent / eventlet pools), deep Django integration.
- **Channels + Daphne.** Official Django integration; channels_redis is the only Django-maintained channel layer for production.
- **pytest + pytest-django + factory_boy.** Discipline-friendly: explicit fixtures, `--reuse-db` for fast cycles, factories beat JSON fixtures every time.
- **uv.** Single Rust binary replacing pyenv + virtualenv + pip + Poetry + pip-tools. ~80% faster on lock operations in real-world benchmarks (`research/2026-05-03-uv-vs-poetry.md`).
- **pyright.** 97.8% typing-spec conformance vs mypy's 58.3%. Pylance ships in VS Code. Strict mode on new files is the right ratchet.
- **Ruff.** Single config block in `pyproject.toml`, autofix safely-fixable rules, runs in <1s on most repos.
- **Pydantic v2.** Carried by Ninja and FastAPI for free. Single source of truth for boundary types.
- **httpx.** Sync + async + HTTP/2 in one API. Replaces three separate clients.

## The canonical `pyproject.toml` skeleton

See `templates/pyproject.toml` for the full file. The shape:

```toml
[project]
name = "myapp"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    "django>=5.0",
    "django-ninja>=1.3",
    "pydantic>=2.7",
    "celery[redis]>=5.4",
    "channels[daphne]>=4.1",
    "channels-redis>=4.2",
    "httpx>=0.27",
    "psycopg[binary]>=3.2",
    "argon2-cffi>=23.1",
    "django-cors-headers>=4.4",
    "django-environ>=0.11",
]

[dependency-groups]
dev = [
    "pytest>=8.3",
    "pytest-django>=4.9",
    "pytest-asyncio>=0.24",
    "factory-boy>=3.3",
    "ruff>=0.6",
    "pyright>=1.1",
    "respx>=0.21",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.ruff]
line-length = 88
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "B", "SIM", "DJ", "ASYNC"]
ignore = ["E501"]

[tool.pytest.ini_options]
DJANGO_SETTINGS_MODULE = "config.settings.dev"
asyncio_mode = "auto"
addopts = "--reuse-db --tb=short -ra"
```

## Findings the audit produces

When this guide drives the review:

- **`requirements.txt` in a new project** → should-refactor (uv-canonical).
- **DRF in new endpoints when Ninja is already in the project** → must-fix.
- **`Black` + `isort` + `flake8` config alongside `ruff` config** → should-refactor (Ruff supersedes; remove the others).
- **`mypy` in a fresh project with no Django/Pydantic plugin pain** → should-refactor (pyright canonical).
- **`requests` for new outbound HTTP code** → should-refactor (httpx canonical).
- **No `pyproject.toml` (only `setup.py` or `setup.cfg`)** → should-refactor (PEP 621 `[project]` is canonical).

## Sources

- `research/2026-05-03-django-ninja-vs-drf.md`
- `research/2026-05-03-uv-vs-poetry.md`
- `research/2026-05-03-pyright-vs-mypy.md`
- `research/2026-05-03-ruff-config.md`
- `research/2026-05-03-httpx-async-production.md`
