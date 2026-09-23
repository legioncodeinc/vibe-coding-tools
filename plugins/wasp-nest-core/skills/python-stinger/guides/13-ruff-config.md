# 13: Ruff Configuration

Ruff replaces Black + isort + flake8 + pyupgrade + autoflake + pydocstyle. One tool. One config. Sub-second on most repos.

## Canonical config

In `pyproject.toml`:

```toml
[tool.ruff]
line-length = 88
indent-width = 4
target-version = "py312"
exclude = [
    ".bzr", ".direnv", ".eggs", ".git", ".git-rewrite", ".hg",
    ".ipynb_checkpoints", ".mypy_cache", ".nox", ".pants.d",
    ".pyenv", ".pytest_cache", ".pytype", ".ruff_cache", ".svn",
    ".tox", ".venv", ".vscode",
    "__pypackages__", "_build", "buck-out", "build", "dist",
    "node_modules", "site-packages", "venv",
    "**/migrations",  # Django auto-generated migrations
]

[tool.ruff.lint]
# Use `select` (not `extend-select`) to keep the rule set explicit.
select = [
    "E",     # pycodestyle errors
    "W",     # pycodestyle warnings
    "F",     # Pyflakes
    "I",     # isort
    "UP",    # pyupgrade
    "B",     # flake8-bugbear
    "SIM",   # flake8-simplify
    "DJ",    # flake8-django
    "ASYNC", # flake8-async
    "C4",    # flake8-comprehensions
    "S",     # flake8-bandit (security)
    "RUF",   # Ruff-specific
    "PT",    # flake8-pytest-style
    "T20",   # flake8-print (no print() in production code)
]
ignore = [
    "E501",   # line length — handled by formatter
    "S101",   # assert used — fine in tests, narrowed below
    "B008",   # function call as default arg — Ninja / FastAPI use this for Depends/Query
    "B905",   # zip() without strict — too noisy on legacy code
]
unfixable = [
    "F841",   # don't auto-remove unused vars (might be commented-out work-in-progress)
]

[tool.ruff.lint.per-file-ignores]
"**/tests/**" = ["S101", "S106", "S311"]   # asserts, hardcoded passwords, random in tests
"**/conftest.py" = ["S101"]
"**/migrations/**" = ["E", "F", "I", "UP", "B", "SIM"]  # auto-generated
"**/__init__.py" = ["F401"]                 # re-export pattern
"**/settings/**.py" = ["F405", "F403"]      # `from .base import *` is intentional

[tool.ruff.lint.isort]
known-first-party = ["apps", "config"]
combine-as-imports = true
force-sort-within-sections = true

[tool.ruff.lint.flake8-bugbear]
extend-immutable-calls = ["fastapi.Depends", "fastapi.Query", "ninja.Query"]

[tool.ruff.lint.flake8-pytest-style]
fixture-parentheses = false
mark-parentheses = false

[tool.ruff.format]
quote-style = "double"
indent-style = "space"
skip-magic-trailing-comma = false
line-ending = "auto"
docstring-code-format = true
```

## Rule set rationale

| Code | What it catches | Why it's on |
|---|---|---|
| `E` / `W` | pycodestyle errors / warnings | Baseline syntax/whitespace hygiene |
| `F` | Pyflakes: unused imports, undefined names | Catches real bugs |
| `I` | isort: import order | Eliminates churn-y diffs |
| `UP` | pyupgrade: modernize old syntax | `Optional[T]` → `T \| None`, `List` → `list`, etc. |
| `B` | flake8-bugbear: subtle bugs | Mutable default args (`B006`), no-op assertions, etc. |
| `SIM` | flake8-simplify: readability | Combines `if/else` chains, `dict.get()` patterns |
| `DJ` | flake8-django: Django anti-patterns | `null=True` on CharField, missing `__str__`, etc. |
| `ASYNC` | flake8-async | Sync calls inside async def, blocking sleep |
| `C4` | flake8-comprehensions | List → comprehension, set/dict literals |
| `S` | flake8-bandit | Security smells (eval, hashlib.md5, hardcoded passwords) |
| `RUF` | Ruff-specific | Catches new patterns not in upstream rule sets |
| `PT` | flake8-pytest-style | Consistent fixture and parametrize patterns |
| `T20` | flake8-print | No stray `print()` in production code |

## Pre-commit

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.6.4
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format
```

## CI

```yaml
# .github/workflows/ci.yml
- name: Ruff lint
  run: uv run ruff check .

- name: Ruff format check
  run: uv run ruff format --check .
```

## Autofix policy

- **`ruff check --fix`** in pre-commit: autofixes the safely-fixable subset.
- **Don't** run `--unsafe-fixes` blindly. Some fixes change semantics.
- **`unfixable = ["F841"]`**: don't auto-remove unused vars. If a dev commented out the call site, the variable is intentional; auto-removing it loses context.

## Migrating from Black + isort + flake8

1. Add Ruff to dev deps (`uv add --group dev ruff`).
2. Add the `[tool.ruff]` block to `pyproject.toml`.
3. Run `uv run ruff format .`: expect ~99.9% identical output to Black.
4. Run `uv run ruff check --fix .`: autofix safe rules.
5. Review the diff. Resolve remaining flake8-style violations.
6. Remove `[tool.black]`, `.flake8`, `setup.cfg [flake8]`, `[tool.isort]` blocks.
7. Drop `black`, `isort`, `flake8` from dev deps.

See `references/black-isort-flake8-comparison.md` for the full migration map.

## Findings checklist

| Finding | Severity |
|---|---|
| `[tool.black]` / `.flake8` / `[tool.isort]` config still present alongside Ruff | should-refactor |
| `select = ["ALL"]` | must-fix (auto-enables every new rule on upgrade) |
| `# noqa` with no rule code | must-fix (silently suppresses everything) |
| Pre-commit hook missing | should-refactor |
| Format-on-save not configured in editor | style (but recommend) |
| `line-length` differs between Ruff and an editor config | should-refactor |

## Sources

- `research/2026-05-03-ruff-config.md`
- https://docs.astral.sh/ruff/configuration/
- https://docs.astral.sh/ruff/linter/
