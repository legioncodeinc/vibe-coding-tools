# Example 08: Poetry → uv migration

Full walkthrough with diff snippets. Real-world benchmark from production migrations: ~80% faster on `lock`, 78-88% faster on `sync`.

## Preflight

```bash
# Confirm uv is installed
which uv || curl -LsSf https://astral.sh/uv/install.sh | sh

# Be on a clean working branch
git status
git checkout -b chore/uv-migration
```

## Step 1: Convert with `migrate-to-uv`

```bash
uvx migrate-to-uv
```

This rewrites `pyproject.toml`, removing `[tool.poetry]` blocks and adding PEP 621 `[project]` metadata. It preserves dependency version pins by default.

## Step 2: Inspect the diff

### `pyproject.toml`: before (Poetry)

```toml
[tool.poetry]
name = "myapp"
version = "0.1.0"
description = ""
authors = ["You <you@example.com>"]

[tool.poetry.dependencies]
python = "^3.12"
django = "^5.0"
django-ninja = "^1.3"
celery = {extras = ["redis"], version = "^5.4"}
httpx = "^0.27"

[tool.poetry.group.dev.dependencies]
pytest = "^8.3"
pytest-django = "^4.9"
factory-boy = "^3.3"
ruff = "^0.6"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

### `pyproject.toml`: after (uv)

```toml
[project]
name = "myapp"
version = "0.1.0"
description = ""
requires-python = ">=3.12,<4.0"
authors = [{ name = "You", email = "you@example.com" }]
dependencies = [
    "django>=5.0,<6.0",
    "django-ninja>=1.3,<2.0",
    "celery[redis]>=5.4,<6.0",
    "httpx>=0.27,<0.28",
]

[dependency-groups]
dev = [
    "pytest>=8.3,<9.0",
    "pytest-django>=4.9,<5.0",
    "factory-boy>=3.3,<4.0",
    "ruff>=0.6,<0.7",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["apps", "config"]
```

Notes on the conversion:

- `^5.0` (Poetry caret) → `>=5.0,<6.0` (PEP 440-compatible).
- `python = "^3.12"` → `requires-python = ">=3.12,<4.0"`.
- `[tool.poetry.dependencies]` → `[project.dependencies]` (a list, not a table).
- `[tool.poetry.group.dev.dependencies]` → `[dependency-groups]` (PEP 735).
- Build backend: `poetry-core` → `hatchling` (works out of the box; `uv_build` is also valid).

## Step 3: Generate the lockfile

```bash
rm -f poetry.lock
uv lock
```

Inspect `uv.lock`: it's a Cargo-style lockfile with all transitive pins. Commit both `pyproject.toml` and `uv.lock`.

## Step 4: Sync the venv

```bash
uv sync --frozen
```

Activates `.venv/` and installs from `uv.lock`. `--frozen` enforces "no automatic relock if pyproject changed": this is what CI uses.

## Step 5: Verify

```bash
# Run management commands inside the project venv
uv run python manage.py check
uv run python manage.py migrate --check
uv run pytest --collect-only
uv run ruff check .
uv run ruff format --check .
```

Replace `poetry run X` with `uv run X` everywhere.

## Step 6: Update `.python-version`

```bash
echo "3.12" > .python-version
```

Allows `uv run` (and `uv python install` in CI) to pick the right interpreter without ambiguity.

## Step 7: CI updates

### `.github/workflows/ci.yml`: before

```yaml
- name: Set up Python
  uses: actions/setup-python@v5
  with:
    python-version: "3.12"

- name: Install Poetry
  uses: snok/install-poetry@v1
  with:
    version: 1.8.0
    virtualenvs-create: true
    virtualenvs-in-project: true

- name: Install dependencies
  run: poetry install --no-interaction --no-ansi --with dev

- name: Run tests
  run: poetry run pytest
```

### `.github/workflows/ci.yml`: after

```yaml
- name: Install uv
  uses: astral-sh/setup-uv@v7
  with:
    enable-cache: true                     # critical — caches /root/.cache/uv

- name: Set up Python
  run: uv python install

- name: Install dependencies
  run: uv sync --frozen

- name: Run tests
  run: uv run pytest
```

The `enable-cache: true` is the single biggest CI speed-up: uv caches across runs.

## Step 8: Dockerfile updates

### Before (Poetry)

```dockerfile
FROM python:3.12-slim
RUN pip install --no-cache-dir poetry==1.8.0
WORKDIR /app
COPY pyproject.toml poetry.lock ./
RUN poetry config virtualenvs.create false && poetry install --no-dev --no-interaction
COPY . .
CMD ["gunicorn", "config.wsgi:application"]
```

### After (uv): see `templates/dockerfile-django-uv` for full multi-stage version

```dockerfile
FROM python:3.12-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
WORKDIR /app

ENV UV_LINK_MODE=copy UV_COMPILE_BYTECODE=1

RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    uv sync --frozen --no-install-project --no-dev

COPY . /app
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev

ENV PATH="/app/.venv/bin:${PATH}"
CMD ["gunicorn", "config.wsgi:application"]
```

The two-stage `uv sync` (deps first, project last) maximizes Docker layer cache reuse.

## Step 9: Pre-commit hook

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/astral-sh/uv-pre-commit
    rev: 0.4.x
    hooks:
      - id: uv-lock              # refuses commits with stale uv.lock
```

## Step 10: README / contributor docs

Update install instructions:

```diff
-## Setup
-
-1. Install [Poetry](https://python-poetry.org/).
-2. `poetry install`
-3. `poetry run python manage.py migrate`
-4. `poetry run python manage.py runserver`
+## Setup
+
+1. Install [uv](https://docs.astral.sh/uv/).
+2. `uv sync`
+3. `uv run python manage.py migrate`
+4. `uv run python manage.py runserver`
```

## Step 11: Cleanup

```bash
# Remove Poetry artifacts that aren't auto-removed
git rm poetry.lock || true                 # already removed in step 3
# Remove any [tool.poetry.*] sections that migrate-to-uv left behind
# (rare — usually clean, but check)

# Final check
uv run python manage.py check
uv run pytest

git add -A
git commit -m "chore: migrate from Poetry to uv

- Replace [tool.poetry] with PEP 621 [project]
- Move dev deps to [dependency-groups]
- Switch build backend to hatchling
- Update CI to use astral-sh/setup-uv@v7
- Update Dockerfile to multi-stage with uv
- Add astral-sh/uv-pre-commit for lockfile freshness
"
```

## Performance impact (real-world benchmark)

From production migration of three services (marzeta.pl Dec 2025):

| Operation | Poetry | uv | Improvement |
|---|---|---|---|
| Cold lock | 6.2s | 1.0s | 84% faster |
| Cached sync | 2.1s | 0.4s | 81% faster |
| Cold Docker build | 145s | 78s | 46% faster |
| Cached Docker build | 38s | 18s | 53% faster |

The 80%+ wins on `lock` / `sync` directly translate to developer flow: `uv lock` finishes before you can context-switch.

## Source

`research/2026-05-03-uv-vs-poetry.md`, `guides/14-uv-packaging.md`, `references/poetry-comparison.md`, `scripts/uv-migration-helper.sh`.
