# 2026-05-03: pyright vs mypy (Django + Pydantic considerations)

## Sources

- https://microsoft.github.io/pyright/: pyright official docs
- https://djangocfg.com/docs/guides/module-design/type-checking/: pyright with Django/DRF (false-positive playbook)
- https://pyrefly.org/blog/typing-conformance-comparison/: typing-spec conformance scores (pyright 97.8%, mypy 58.3%)
- https://docs.bswen.com/blog/2026-03-17-mypy-low-conformance-adoption: mypy ecosystem-vs-conformance discussion
- https://blog.bugsiki.dev/posts/type-checkers/: pragmatic comparison

## Summary

**pyright is canonical** for new Python work; mypy is acceptable but specifically called out as a tactical fallback when a Django/Pydantic plugin is doing load-bearing work.

**The conformance gap:** pyright passes 97.8% of the official typing-spec conformance suite; mypy passes 58.3%. mypy ships fewer features per release: its old role as the de-facto reference implementation is over.

**The plugin gap (the reason mypy is acceptable in legacy):** mypy has plugins for Django (`mypy_django_plugin`), Pydantic (built into Pydantic v2), SQLAlchemy. pyright famously does not support plugins. For Django, this means pyright reports false positives around `Manager.objects`, `signal.send()`, `Optional` types from `null=True` model fields, DRF method overrides, etc., but these are containable with a curated `pyrightconfig.json`.

**The 2026 default:** **`typeCheckingMode: "basic"` everywhere; `"strict"` on new files**. Strict-on-new is a ratchet: every touched file gets bumped one notch. pyright in basic mode + Pydantic v2 schemas at every API/webhook boundary is the canonical type discipline.

## Key facts the active guides depend on

- `pyrightconfig.json` is the canonical config file (not `pyproject.toml`-based, unlike Ruff and uv).
- Strict mode enables `reportMissingTypeStubs`, `reportUnknownMemberType`, etc., too noisy on existing Django code.
- For Django, suppress: `reportAttributeAccessIssue` (Manager.objects), `reportOptionalMemberAccess` (null=True fields), `reportIncompatibleMethodOverride` (DRF view classes), `reportArgumentType` (Django field choices), and a few others.
- Pyright comes with the Pylance VS Code extension by default: IDE integration is free.
- mypy with `--strict` + `mypy_django_plugin` + `pydantic.mypy` plugin is the closest equivalent for legacy Django codebases.

## Relevance to the Stinger

- **`guides/12-typing-and-pydantic.md`**: pyright basic minimum, strict on new code, Pydantic v2 at boundaries.
- **`templates/pyrightconfig.json`**: basic mode + curated suppress list for Django + strict-on-new policy.
- **`references/mypy-comparison.md`**: mypy as preserved alternative; ecosystem-support reasoning.

## Pull quote

> "If you are writing production code at work, I would recommend using Mypy. It has many plugins, and you can easily find a solution to most of the problems... Pyright is a good choice for personal projects or writing libraries, particularly when not using heavy dependencies like boto3 or django." (bugsik.dev, May 2024). The python-stinger **inverts** this default: pyright is canonical, mypy is the fallback. Rationale: Pylance ships everywhere, basic-mode false positives are containable, and the Pyright ecosystem (django-cfg auto-stubs, etc.) is improving fast.
