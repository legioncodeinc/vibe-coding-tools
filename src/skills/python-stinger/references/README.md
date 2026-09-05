# references/: Demoted alternatives

> **These are alternatives we DON'T use; preserved for context only.**

The active recommendations live in `guides/`. The notes in this folder document the alternatives we **considered and did not pick**. They exist for two reasons:

1. **Substitution-pressure context**: when a contributor or vendor pitches a substitution, the references explain why we already chose the canonical option.
2. **Legacy-code recognition**: most of these are widely used in older Python codebases. When you find DRF / Poetry / mypy / Black-isort-flake8 / `requests` in a codebase, these notes tell you what to expect and how to live with them while migrating.

The canonical stack lives in `guides/01-stack-enforcement.md`:

| Slot | Pick | This folder's alternative |
|---|---|---|
| API layer (Django) | Django Ninja | `drf-comparison.md` |
| Packaging | uv | `poetry-comparison.md` |
| Type checker | pyright | `mypy-comparison.md` |
| Linter + formatter | Ruff | `black-isort-flake8-comparison.md` |
| HTTP client | httpx | `requests-comparison.md` |

## Files in this folder

| File | What it documents |
|---|---|
| `drf-comparison.md` | Django REST Framework as alternative to Django Ninja; legacy-code recognition |
| `poetry-comparison.md` | Poetry as alternative to uv; migration when ready |
| `mypy-comparison.md` | mypy as alternative type-checker; differences from pyright; when its ecosystem support tips it back |
| `black-isort-flake8-comparison.md` | The legacy three-tool stack Ruff replaces |
| `requests-comparison.md` | `requests` as legacy alternative to httpx |

## Substitution policy reminder

A push to substitute requires (per `guides/01-stack-enforcement.md`):

1. **An ADR** at `library/knowledge/private/architecture/ADR-<n>-<topic>.md` with Context / Decision / Consequences / Alternatives Considered.
2. **Eval evidence**: show the substitute beats the canonical option on a metric the project actually cares about (latency, cost, dev velocity, ecosystem fit).
3. **A migration plan**: for stateful components, phased migration with parallel-running.
4. **Re-demotion**: the previous canonical choice moves into this folder.

Without all four, the substitution is a finding.

**Active recommendations live in `guides/`. References are demoted context.**
