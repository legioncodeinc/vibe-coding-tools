# mypy: preserved alternative

> Demoted in favor of **pyright** (see `guides/12-typing-and-pydantic.md`). mypy is acceptable in legacy or when its plugin ecosystem is doing load-bearing work.

## Why pyright is canonical

- **Conformance.** pyright passes 97.8% of the official typing-spec test suite; mypy passes 58.3% (as of `research/2026-05-03-pyright-vs-mypy.md`). Real-world impact: code that follows the typing spec works in pyright; in mypy it might or might not.
- **Speed.** pyright is faster (TypeScript engine, incremental).
- **IDE integration.** pyright ships as Pylance in VS Code: zero extra install. mypy in VS Code requires a separate extension and is slower for live feedback.
- **Modern features land first.** PEP 695 generics, `TypeIs`, `Self` type: pyright implements these on day one; mypy follows.

## Why mypy is preserved as an alternative

The single counter-argument: **plugin ecosystem.**

- `mypy_django_plugin`: provides Django-aware type checking. Pyright has no plugin system, so Django's dynamic metaclass machinery (Manager.objects, signals, queryset chaining) produces false positives in pyright that the mypy plugin handles.
- `pydantic.mypy`: Pydantic v2 ships its own plugin into mypy. Pyright basic mode handles Pydantic well too, but the plugin tightens validator/discriminator inference.
- `mypy-zope`, `mypy-aiohttp`, `mypy-protobuf`, `sqlalchemy-stubs`: domain-specific plugins.

If the team is already running mypy with these plugins, switching to pyright costs more than it saves. Keep mypy.

## When to pick mypy specifically

- **Heavy Django dynamism in the codebase** AND **the team has invested in `mypy_django_plugin`** → keep mypy.
- **SQLAlchemy** with the SA plugin → keep mypy.
- **Existing strict mypy config** that catches real bugs → don't disrupt.

## When to switch from mypy → pyright

- New project, no SQLAlchemy, default Django patterns.
- Team uses VS Code (Pylance is free, fast, and ships out-of-the-box).
- Need PEP 695 / new typing features now.
- Strict mode is the goal: pyright `strict` mode is more comprehensive.

## Legacy-code recognition

When you find mypy:

```ini
# mypy.ini (or [tool.mypy] in pyproject.toml)
[mypy]
python_version = 3.12
strict = true
warn_return_any = true
warn_unused_configs = true
plugins = ["mypy_django_plugin.main", "pydantic.mypy"]

[mypy.plugins.django-stubs]
django_settings_module = "config.settings.dev"

[[mypy.overrides]]
module = "third_party.*"
ignore_missing_imports = true
```

## Command map

| mypy | pyright |
|---|---|
| `mypy src/` | `pyright src/` |
| `mypy --strict src/` | `pyright src/` (with `typeCheckingMode: "strict"` in pyrightconfig) |
| `mypy --install-types` | n/a (pyright fetches stubs as needed) |
| `mypy --show-error-codes` | enabled by default |
| `# type: ignore[arg-type]` | `# pyright: ignore[reportArgumentType]` |

## Hybrid setup (running both in CI)

When migrating gradually:

```yaml
# .github/workflows/ci.yml
- name: Type-check (pyright — IDE-aligned)
  run: uv run pyright

- name: Type-check (mypy — Django/Pydantic plugin coverage)
  run: uv run mypy apps/
```

Run both in CI for the migration period; drop mypy once pyright is the source of truth.

## Sources

- https://microsoft.github.io/pyright/
- https://mypy.readthedocs.io/
- `research/2026-05-03-pyright-vs-mypy.md`
- https://pyrefly.org/blog/typing-conformance-comparison/
