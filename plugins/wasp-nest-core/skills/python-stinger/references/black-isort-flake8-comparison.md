# Black + isort + flake8: preserved alternative

> Demoted in favor of **Ruff** (see `guides/13-ruff-config.md`). The three-tool stack is the legacy that Ruff supersedes.

## Why Ruff replaced this

- **One tool.** Black + isort + flake8 (+ `pyupgrade`, `autoflake`, `pydocstyle`) require three to six pieces of dev infra wired up consistently. Ruff replaces all of them with one binary, one config, one CI step.
- **Speed.** Ruff is 10-100x faster than the tools it replaces.
- **Drop-in formatter.** `ruff format` produces output identical to Black in 99.9%+ of cases.
- **Single config.** All settings in `[tool.ruff]` in `pyproject.toml`. No separate `.flake8`, `setup.cfg [flake8]`, `[tool.isort]`, `[tool.black]`.
- **Plugin parity.** Ruff re-implements 1000+ lint rules from flake8, its plugins, isort, pyupgrade, pydocstyle, autoflake, and more.

## When the legacy stack is still acceptable

- **Existing config that works**: migration is easy (`guides/13-ruff-config.md`), but not urgent. Run them alongside Ruff during transition.
- **A custom flake8 plugin** with no Ruff equivalent. Rare in 2026.
- **Pylint is doing real work**: Pylint is more aggressive than Ruff (semantic analysis, refactoring suggestions). Pylint can stay alongside Ruff; they're complementary.

## Legacy-code recognition

When you find this stack:

```toml
# pyproject.toml — Black + isort
[tool.black]
line-length = 88
target-version = ["py312"]

[tool.isort]
profile = "black"
line_length = 88
known_first_party = ["apps", "config"]
```

```ini
# .flake8 — flake8 doesn't support pyproject.toml natively
[flake8]
max-line-length = 88
extend-ignore = E203, W503
exclude = .git,__pycache__,migrations,.venv
```

Plus a `requirements-dev.txt` or Poetry dev group with `black`, `isort`, `flake8`, and likely `flake8-bugbear`, `flake8-comprehensions`, etc.

## Tool-by-tool map

| Legacy tool | What it does | Ruff equivalent |
|---|---|---|
| **Black** | Auto-formatter | `ruff format` (drop-in; same output 99.9%+) |
| **isort** | Import sorter | `select = ["I"]` (with `[tool.ruff.lint.isort]` config) |
| **flake8** | Linter (pyflakes + pycodestyle) | `select = ["E", "F", "W"]` |
| **flake8-bugbear** | Subtle bug catcher | `select = ["B"]` |
| **flake8-comprehensions** | Comprehension hygiene | `select = ["C4"]` |
| **flake8-simplify** | Simplifier hints | `select = ["SIM"]` |
| **flake8-django** | Django anti-patterns | `select = ["DJ"]` |
| **flake8-bandit** | Security smells | `select = ["S"]` |
| **flake8-pytest-style** | Pytest conventions | `select = ["PT"]` |
| **pyupgrade** | Modern syntax migrator | `select = ["UP"]` |
| **autoflake** | Remove unused imports/vars | `ruff check --fix` (with `F` rules) |
| **pydocstyle** | Docstring style | `select = ["D"]` (off by default) |
| **pylint** (some rules) | Refactoring hints | `select = ["RUF", "PL"]` (PL is a subset of pylint rules) |

## Migration

```bash
# 1. Install Ruff
uv add --group dev ruff

# 2. Replace configs (see templates/pyproject.toml or templates/ruff.toml)

# 3. Format check
uv run ruff format --check .

# 4. Lint check (and autofix)
uv run ruff check --fix .

# 5. Remove the old tools
uv remove black isort flake8 flake8-bugbear flake8-comprehensions  # etc.

# 6. Remove old config files / sections
rm .flake8
# Remove [tool.black], [tool.isort] sections from pyproject.toml.

# 7. Update pre-commit
# Replace black/isort/flake8 hooks with astral-sh/ruff-pre-commit
```

## Pre-commit before/after

### Before

```yaml
- repo: https://github.com/psf/black
  rev: 24.8.0
  hooks:
    - id: black

- repo: https://github.com/pycqa/isort
  rev: 5.13.2
  hooks:
    - id: isort

- repo: https://github.com/pycqa/flake8
  rev: 7.1.1
  hooks:
    - id: flake8
      additional_dependencies: [flake8-bugbear, flake8-comprehensions]
```

### After

```yaml
- repo: https://github.com/astral-sh/ruff-pre-commit
  rev: v0.6.4
  hooks:
    - id: ruff
      args: [--fix]
    - id: ruff-format
```

## Sources

- https://docs.astral.sh/ruff/
- https://black.readthedocs.io/
- https://pycqa.github.io/isort/
- https://flake8.pycqa.org/
- `research/2026-05-03-ruff-config.md`
