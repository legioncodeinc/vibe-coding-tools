# scripts/: python-stinger audit scripts

Heuristic / static scans surfaced as quick first-pass findings. Each script is
non-destructive and prints findings to stdout; combine with `manage.py check`
for a full audit pass.

| Script | What it finds | Invocation |
|---|---|---|
| `audit-n-plus-one.py` | Likely N+1 patterns (loops over querysets without `select_related` / `prefetch_related`) | `python -m scripts.audit-n-plus-one <path>` |
| `audit-applied-migrations.py` | Edits to migrations already in the deployed git history | `python -m scripts.audit-applied-migrations <ref>` |
| `audit-untyped-boundaries.py` | Functions accepting `dict` / `list` at API or webhook boundaries | `python -m scripts.audit-untyped-boundaries <path>` |
| `audit-bare-except.py` | `except:` and unexplained `except Exception:` | `python -m scripts.audit-bare-except <path>` |
| `audit-settings-secrets.py` | Hardcoded secrets in `settings/` files | `python -m scripts.audit-settings-secrets <settings-dir>` |
| `uv-migration-helper.sh` | Driver for migrating from Poetry / pip-tools to uv | `bash scripts/uv-migration-helper.sh` |

## Conventions

- Scripts assume Python ≥ 3.12.
- They take repo-relative paths and print `path:line: severity: message` lines.
- Exit code: 0 if no findings, 1 if any finding.
- Each script has a `--help` / argparse usage.

## Severity output

- `error:`, must-fix (block CI).
- `warning:`, should-refactor (open follow-up).
- `info:`, informational (style or context).

## Running everything

```bash
for s in audit-n-plus-one audit-untyped-boundaries audit-bare-except; do
    uv run python -m scripts.$s apps/ && echo "OK: $s" || echo "FAIL: $s"
done

uv run python -m scripts.audit-settings-secrets config/settings/
uv run python -m scripts.audit-applied-migrations origin/main
```

## Limitations

These are heuristic scans. They will produce false positives. Each finding
should be inspected before acting. The scripts are useful as a triage tool
for a large existing codebase, not as a replacement for code review or pyright.
