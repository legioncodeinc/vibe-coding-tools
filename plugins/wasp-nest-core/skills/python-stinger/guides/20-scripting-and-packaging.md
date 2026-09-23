# 20: Scripting and Packaging

One-off scripts, internal CLI tools, distributable packages. Patterns that scale from "a script in the repo" to "a published wheel".

## Hard rules

1. **Every script is `python -m <module>`-runnable.** No `python scripts/foo.py` paths-from-cwd hack.
2. **`__main__.py`** is the entry point for `python -m mypackage`.
3. **`typer` (or `argparse`) for CLIs.** Not a sea of `sys.argv` parsing.
4. **`if __name__ == "__main__":` guard** on every executable script.
5. **Distributable packages declare `[project.scripts]`** entry points in `pyproject.toml`.

## Script in a Django project

```python
# scripts/backfill_user_profiles.py
"""
Backfill missing User.profile rows.

Usage:
    DJANGO_SETTINGS_MODULE=config.settings.dev uv run python -m scripts.backfill_user_profiles
"""
from __future__ import annotations

import argparse
import logging

import django

logger = logging.getLogger(__name__)


def main(*, dry_run: bool, batch_size: int) -> None:
    django.setup()
    from apps.users.models import Profile, User  # imports after django.setup()

    qs = User.objects.filter(profile__isnull=True).order_by("id")
    total = qs.count()
    logger.info("backfilling %d users (dry_run=%s)", total, dry_run)

    if dry_run:
        return

    last_id = 0
    while True:
        batch = list(qs.filter(id__gt=last_id)[:batch_size])
        if not batch:
            break
        Profile.objects.bulk_create([Profile(user=u) for u in batch])
        last_id = batch[-1].id
        logger.info("backfilled up to id=%d", last_id)


def _parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser()
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--batch-size", type=int, default=500)
    return p.parse_args()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    args = _parse_args()
    main(dry_run=args.dry_run, batch_size=args.batch_size)
```

For Django scripts that run outside `manage.py`, use `os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")` before `django.setup()`.

## Django management commands (the canonical alternative)

```python
# apps/users/management/commands/backfill_profiles.py
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Backfill missing user profiles"

    def add_arguments(self, parser):
        parser.add_argument("--dry-run", action="store_true")
        parser.add_argument("--batch-size", type=int, default=500)

    def handle(self, *, dry_run, batch_size, **options):
        ...
```

Run with `python manage.py backfill_profiles --batch-size=1000`. Use management commands when:

- The script needs Django models and is intrinsic to a Django app.
- You want it discoverable via `manage.py help`.

Use a top-level `scripts/` script when:

- It crosses multiple apps or has no clear app home.
- It's a one-off cleanup or migration-adjacent task.
- It's run from CI.

## CLI tool with typer

For richer interactive CLIs:

```python
# mypackage/cli.py
import typer

app = typer.Typer(help="My CLI tool.")


@app.command()
def hello(name: str = typer.Option(..., help="Name to greet")):
    """Say hello."""
    typer.echo(f"Hello, {name}!")


@app.command()
def compute(input_file: str, output_file: str = "out.json"):
    """Run the compute pipeline."""
    ...


if __name__ == "__main__":
    app()
```

```python
# mypackage/__main__.py
from mypackage.cli import app

if __name__ == "__main__":
    app()
```

Now `python -m mypackage hello --name Mario` works.

## Distributable package: `[project.scripts]`

```toml
[project]
name = "myapp-cli"
version = "0.1.0"
dependencies = ["typer>=0.12"]

[project.scripts]
myapp = "myapp.cli:app"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["myapp"]
```

After `uv sync`, the `myapp` command is on PATH (inside the venv). For users to install:

```bash
uv tool install myapp-cli  # installs globally, isolated
# or
pip install myapp-cli
```

## Logging discipline

Scripts use the standard `logging` module. Never `print()` for production scripts.

```python
import logging
logger = logging.getLogger(__name__)

# Configure at the entry point only:
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(name)s %(levelname)s %(message)s",
)
```

## Findings checklist

| Finding | Severity |
|---|---|
| `python scripts/foo.py` referenced in CI / docs (path-from-cwd hack) | should-refactor (use `python -m`) |
| Mutable globals in a script | should-refactor |
| `print()` in production script (no logging) | should-refactor |
| Hardcoded paths in a script | must-fix |
| Script with no `if __name__ == "__main__":` guard | should-refactor |
| `sys.argv[1]` indexing (no argparse / typer) | should-refactor |
| Cross-app cleanup written inside a Django app's management command | style |

## Sources

- https://docs.python.org/3/library/__main__.html
- https://typer.tiangolo.com/
- https://docs.python.org/3/library/argparse.html
- https://packaging.python.org/en/latest/guides/distributing-packages-using-setuptools/
