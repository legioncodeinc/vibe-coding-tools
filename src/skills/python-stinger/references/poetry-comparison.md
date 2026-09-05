# Poetry: preserved alternative

> Demoted in favor of **uv** (see `guides/14-uv-packaging.md`). Poetry is acceptable in legacy projects; new projects should use uv.

## Why Poetry was demoted

- **Speed.** uv is 80%+ faster on lock / sync operations (`research/2026-05-03-uv-vs-poetry.md`). Real-world benchmarks across three production services.
- **Bootstrap.** Poetry is written in Python: needs Python to install. uv is a Rust binary with zero runtime deps.
- **Unification.** uv replaces pyenv + virtualenv + pip + Poetry + pip-tools. Poetry is one tool of several.
- **Custom dep syntax.** Poetry's `^1.2`, `~=1.2`, table-style `[tool.poetry.dependencies]` are non-standard. uv uses PEP 621 `[project]` + PEP 735 `[dependency-groups]`.
- **Lockfile resolver.** Poetry's resolver, constrained by Python's GIL, can't match uv's parallel Rust resolver on speed or correctness.

## When Poetry is still acceptable

- **Existing Poetry project** that's working: don't migrate without a reason. The migration is straightforward (`examples/08-poetry-to-uv-migration.md`); plan it when you're already touching `pyproject.toml`.
- **Team / org standardization on Poetry** is binding: Poetry is fine; just don't add NEW projects on it.
- **Specific Poetry plugin** doing load-bearing work that uv doesn't replicate, rare in 2026, but check before migrating.

## Legacy-code recognition

When you find Poetry:

```toml
[tool.poetry]
name = "myapp"
version = "0.1.0"
authors = ["You <you@example.com>"]

[tool.poetry.dependencies]
python = "^3.12"
django = "^5.0"

[tool.poetry.group.dev.dependencies]
pytest = "^8.3"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

The presence of `[tool.poetry]` and `poetry.lock` is the giveaway.

## Command map

| Poetry | uv |
|---|---|
| `poetry install` | `uv sync` |
| `poetry install --no-dev` | `uv sync --no-dev` |
| `poetry install --with dev` | `uv sync` (default includes dev group) |
| `poetry add <pkg>` | `uv add <pkg>` |
| `poetry add --group dev <pkg>` | `uv add --group dev <pkg>` |
| `poetry remove <pkg>` | `uv remove <pkg>` |
| `poetry lock` | `uv lock` |
| `poetry lock --no-update` | `uv lock` (already deterministic) |
| `poetry update <pkg>` | `uv lock --upgrade-package <pkg>` |
| `poetry run X` | `uv run X` |
| `poetry shell` | `source .venv/bin/activate` (or just `uv run`) |
| `poetry publish` | `uv publish` |

## Migration

See `examples/08-poetry-to-uv-migration.md` for the full walkthrough with diffs. Tooling: `uvx migrate-to-uv`.

## What you keep

- **`pyproject.toml`** stays: converted to PEP 621 shape.
- **`uv.lock`** replaces `poetry.lock`.
- **Build backend** changes from `poetry-core` to `hatchling` (or `uv_build`).
- **`[tool.ruff]`, `[tool.pytest]`** etc. stay unchanged.

## Sources

- https://docs.astral.sh/uv/
- https://python-poetry.org/
- `research/2026-05-03-uv-vs-poetry.md`
- https://github.com/mkniewallner/migrate-to-uv
