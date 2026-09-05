# 14: uv Packaging

uv is canonical. Replaces pyenv + virtualenv + pip + Poetry + pip-tools with one Rust binary.

## Hard rules

1. **`pyproject.toml` is the only source of truth.** No `setup.py`, no `setup.cfg`, no `requirements*.txt`.
2. **`uv lock` produces `uv.lock`.** Both `pyproject.toml` AND `uv.lock` are committed.
3. **`uv sync --frozen` in CI.** Hard fail if `uv.lock` is stale.
4. **Dependency groups (PEP 735) for dev deps**, not optional dependencies. `[dependency-groups]` table at the top level.
5. **`.python-version` at the repo root** pins the Python version.
6. **Build backend is `hatchling`** by default. `uv_build` is also valid.

## Canonical pyproject.toml

```toml
[project]
name = "myapp"
version = "0.1.0"
description = "Short description."
readme = "README.md"
requires-python = ">=3.12"
license = { text = "MIT" }
authors = [{ name = "Your Name", email = "you@example.com" }]
dependencies = [
    "django>=5.0,<6.0",
    "django-ninja>=1.3",
    "django-cors-headers>=4.4",
    "django-environ>=0.11",
    "pydantic>=2.7",
    "pydantic-settings>=2.4",
    "celery[redis]>=5.4",
    "channels[daphne]>=4.1",
    "channels-redis>=4.2",
    "httpx>=0.27",
    "psycopg[binary]>=3.2",
    "argon2-cffi>=23.1",
    "redis>=5.0",
]

[dependency-groups]
dev = [
    "pytest>=8.3",
    "pytest-django>=4.9",
    "pytest-asyncio>=0.24",
    "factory-boy>=3.3",
    "respx>=0.21",
    "ruff>=0.6",
    "pyright>=1.1",
    "django-debug-toolbar>=4.4",
    "django-extensions>=3.2",
    "ipython>=8.27",
]
prod = [
    "gunicorn>=23.0",
    "uvicorn[standard]>=0.30",
    "sentry-sdk[django]>=2.13",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["apps", "config"]
```

## Daily commands

```bash
uv add django-ninja                  # add a runtime dep
uv add --group dev pytest            # add a dev dep (PEP 735 group)
uv remove some-package
uv sync                              # install all groups in .venv (default)
uv sync --frozen                     # CI: install from lock, fail if stale
uv sync --no-dev                     # production: skip dev group
uv lock                              # regenerate uv.lock without installing
uv lock --upgrade-package django     # bump just one package
uv run python manage.py migrate      # run command in the project venv
uv run pytest
uv tree                              # dependency tree
uv tool install ruff                 # install a CLI tool globally (replaces pipx)
```

## Migration from Poetry

See `examples/08-poetry-to-uv-migration.md` for the full walkthrough. Short version:

```bash
# 1. Auto-migrate
uvx migrate-to-uv

# 2. Or manually:
#    - Delete poetry.lock
#    - Replace [tool.poetry] with PEP 621 [project]
#    - Replace [tool.poetry.group.dev.dependencies] with [dependency-groups] dev = [...]
#    - Change build-system to hatchling
#    - Run `uv lock`

# 3. Update CI
#    Before: uses: snok/install-poetry@v1
#    After:  uses: astral-sh/setup-uv@v7

# 4. Update Dockerfile
#    Before: RUN poetry install --no-dev
#    After:  RUN uv sync --frozen --no-dev

# 5. Test, commit, deploy
```

## Migration from `requirements.txt`

```bash
# Inside the project root (with the existing requirements.txt)
uv init --no-readme  # creates a minimal pyproject.toml
uv add -r requirements.txt
# Then split dev/test deps into [dependency-groups] dev = [...]
```

## CI snippet

```yaml
# .github/workflows/ci.yml
name: ci

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env: { POSTGRES_PASSWORD: postgres }
        ports: ["5432:5432"]
      redis:
        image: redis:7
        ports: ["6379:6379"]
    steps:
      - uses: actions/checkout@v4
      - name: Install uv
        uses: astral-sh/setup-uv@v7
        with:
          enable-cache: true
      - name: Set up Python
        run: uv python install
      - name: Install dependencies
        run: uv sync --frozen
      - name: Lint
        run: uv run ruff check .
      - name: Format check
        run: uv run ruff format --check .
      - name: Type check
        run: uv run pyright
      - name: Migrations check
        run: uv run python manage.py makemigrations --check --dry-run
      - name: Test
        run: uv run pytest --cov
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/postgres
          REDIS_URL: redis://localhost:6379/0
          DJANGO_SECRET_KEY: test
```

## Pre-commit lockfile freshness

```yaml
# .pre-commit-config.yaml
- repo: https://github.com/astral-sh/uv-pre-commit
  rev: 0.4.x
  hooks:
    - id: uv-lock
```

This refuses commits that change `pyproject.toml` without re-locking.

## Findings checklist

| Finding | Severity |
|---|---|
| `requirements.txt` (no `pyproject.toml`) in a non-trivial project | should-refactor (uv-canonical) |
| Multiple lock files (`uv.lock` + `poetry.lock` + `requirements.txt`) | must-fix |
| `pyproject.toml` without `[build-system]` | must-fix |
| `[tool.poetry]` table in a uv project | should-refactor (clean up) |
| Optional dependencies (`[project.optional-dependencies]`) for dev tooling | should-refactor (use `[dependency-groups]`) |
| CI `uv sync` without `--frozen` | must-fix (lockfile drift) |
| Dockerfile installing into the system Python (no venv) | should-refactor |
| Missing `.python-version` | should-refactor |

## Sources

- `research/2026-05-03-uv-vs-poetry.md`
- https://docs.astral.sh/uv/
- https://docs.astral.sh/uv/concepts/projects/
- https://github.com/mkniewallner/migrate-to-uv
