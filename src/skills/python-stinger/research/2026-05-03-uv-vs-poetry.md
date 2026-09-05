# 2026-05-03: uv vs Poetry (migration & lockfile workflow)

## Sources

- https://docs.astral.sh/uv/: uv official docs
- https://docs.astral.sh/uv/guides/migration/poetry-to-uv/: Poetry → uv migration guide
- https://github.com/mkniewallner/migrate-to-uv: automated migration tool (`uvx migrate-to-uv`)
- https://blog.marzeta.pl/python-packaging-is-finally-solved-migrating-from-poetry-to-uv-in-production/: production migration with benchmarks (Dec 2025)
- https://open-research.gemmadanks.com/tutorials/poetry-to-uv/: manual migration walkthrough
- https://python.useinstructor.com/blog/2024/12/26/migrating-to-uv/: Instructor's migration writeup

## Summary

**uv is canonical.** It replaces pyenv + virtualenv + pip + Poetry + pip-tools with one Rust binary. Real-world benchmark across three production services: ~80% improvement on `lock` operations, 78-88% on `sync`, with Docker builds also faster in two of three services. Bootstrap problem solved (no Python needed to install Python packages).

**Migration shape:**

1. **Convert the `pyproject.toml`.** Either run `uvx migrate-to-uv` (auto) or hand-edit: drop `[tool.poetry]`, declare PEP 621 `[project]` metadata, replace build backend (`hatchling` is a safe pick; `uv_build` is also valid), keep dependencies in `[project.dependencies]` and dev deps in `[dependency-groups.dev]` (PEP 735) or `[project.optional-dependencies]`.
2. **Delete `poetry.lock`. Run `uv lock`.** Dependencies pin to the exact same versions if a lockfile was found.
3. **`uv sync`** installs into `.venv/`; `uv add <pkg>` adds; `uv remove <pkg>` removes; `uv run <cmd>` runs in the project's env.
4. **CI updates.** Replace `snok/install-poetry` with `astral-sh/setup-uv@v7` + `enable-cache: true`. Replace `poetry install` with `uv sync --frozen`. Replace `poetry run` with `uv run`.
5. **Dockerfile updates.** `COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/` plus a build-cache mount on `/root/.cache` and bind mounts on `pyproject.toml` / `uv.lock`. Multi-stage build with `uv sync --frozen` in the dependency stage.
6. **Pre-commit hook** for lockfile freshness: `astral-sh/uv-pre-commit` with `id: uv-lock`.
7. **Pin Python with `.python-version`** at the repo root.

## Key facts the active guides depend on

- `uv lock` is hermetic: produces `uv.lock` that pins all transitives. `uv sync --frozen` enforces it (CI must use `--frozen`).
- Dependency groups (PEP 735) are the canonical way to express dev-only deps in 2026: `[dependency-groups]` table at the top level (not under `[project]`).
- `uv add --group dev pytest` adds to the dev group; `uv sync --group dev` installs that group.
- `uv tool install <pkg>` installs CLI tools globally (replacing `pipx`).
- Build backend choice: `hatchling` is the safe default; setuptools has a known Metadata 2.4 bug with PEP 621 license fields.

## Relevance to the Stinger

- **`guides/14-uv-packaging.md`**: pyproject.toml shape, lock/sync/add/run, dependency groups.
- **`templates/pyproject.toml`**: uv-based, with Django + Ninja + Celery + pytest + Ruff + pyright.
- **`templates/dockerfile-django-uv`**: multi-stage Docker build with uv.
- **`scripts/uv-migration-helper.sh`**: driver for migrating existing Poetry / pip-tools projects.
- **`examples/08-poetry-to-uv-migration.md`**: full worked migration with diffs.
- **`references/poetry-comparison.md`**: Poetry as preserved alternative.

## Pull quote

> "UV delivered an average 80% performance improvement on lock operations in my benchmarks. And yes, we've now migrated most of our services to UV." (marzeta.pl production migration writeup)
