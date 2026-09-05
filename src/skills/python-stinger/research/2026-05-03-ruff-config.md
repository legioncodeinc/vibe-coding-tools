# 2026-05-03: Ruff configuration (replacing Black + isort + flake8)

## Sources

- https://docs.astral.sh/ruff/configuration/: official configuration docs
- https://docs.astral.sh/ruff/linter: linter rule selection
- https://docs.astral.sh/ruff/formatter: formatter (Black-equivalent)
- https://pydevtools.com/handbook/explanation/ruff-complete-guide/index.md: comprehensive 2026 walkthrough

## Summary

**Ruff replaces flake8, Black, isort, pyupgrade, pydocstyle, autoflake, and dozens of other tools**: single Rust binary, single config section, 10-100x faster than the tools it replaces. Astral toolchain alignment: Ruff + uv + ty (formerly the Astral type checker) all configure through `pyproject.toml`.

**Canonical config (in `pyproject.toml`):**

```toml
[tool.ruff]
line-length = 88
indent-width = 4
target-version = "py312"
exclude = [".bzr", ".direnv", ".eggs", ".git", ".git-rewrite", ".hg", ".ipynb_checkpoints", ".mypy_cache", ".nox", ".pants.d", ".pyenv", ".pytest_cache", ".pytype", ".ruff_cache", ".svn", ".tox", ".venv", ".vscode", "__pypackages__", "_build", "buck-out", "build", "dist", "node_modules", "site-packages", "venv", "migrations"]

[tool.ruff.lint]
select = [
  "E",   # pycodestyle errors
  "F",   # Pyflakes
  "I",   # isort
  "UP",  # pyupgrade
  "B",   # flake8-bugbear
  "SIM", # flake8-simplify
  "DJ",  # flake8-django
  "ASYNC", # flake8-async
]
ignore = ["E501"]  # line length handled by formatter

[tool.ruff.lint.per-file-ignores]
"**/migrations/**" = ["E", "F", "I", "UP"]
"**/tests/**" = ["S101"]  # asserts allowed in tests

[tool.ruff.format]
quote-style = "double"
indent-style = "space"
skip-magic-trailing-comma = false
line-ending = "auto"
```

## Key facts the active guides depend on

- Use `select` not `extend-select` to make the rule set explicit. `extend-select` adds to the defaults; `select` replaces them.
- `select = ["ALL"]` is dangerous: implicitly enables every new rule on every Ruff upgrade. Pick categories explicitly.
- `ruff format` is a Black drop-in (>99.9% identical output): copy any `[tool.black]` settings to `[tool.ruff.format]`.
- `ruff check --fix` autofixes safely-fixable rules; pre-commit hook runs it on changed files.
- The `DJ` (flake8-django) ruleset catches Django-specific anti-patterns: `null=True` on CharField, missing `__str__` on models, etc.
- Pre-commit: `astral-sh/ruff-pre-commit` with `id: ruff` (lint) and `id: ruff-format` (format).

## Relevance to the Stinger

- **`guides/13-ruff-config.md`**: canonical config block, rule selection rationale, autofix policy, pre-commit setup.
- **`templates/ruff.toml`**: standalone alternative to inline `[tool.ruff]`.
- **`templates/pyproject.toml`**: includes the inline config.
- **`references/black-isort-flake8-comparison.md`**: the legacy three-tool stack and why Ruff supersedes it.

## Pull quote

> "Ruff replaces flake8, Black, isort, pyupgrade, pydocstyle, and dozens of other Python code quality tools with a single binary. It re-implements over 1,000 lint rules from dozens of existing tools and runs 10-100x faster than the tools it replaces." (pydevtools.com Ruff complete guide, 2026-05-03 retrieval)
