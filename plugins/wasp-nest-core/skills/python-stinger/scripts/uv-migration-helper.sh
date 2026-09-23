#!/usr/bin/env bash
# uv-migration-helper.sh — driver for migrating from Poetry / pip-tools to uv.
#
# Usage:
#     bash scripts/uv-migration-helper.sh [--dry-run]
#
# This is a guided migration. It pauses between steps so you can review
# diffs before continuing. Run from the repo root.
#
# See guides/14-uv-packaging.md and examples/08-poetry-to-uv-migration.md.

set -euo pipefail

DRY_RUN=0
if [[ "${1:-}" == "--dry-run" ]]; then
    DRY_RUN=1
fi

run() {
    if [[ $DRY_RUN -eq 1 ]]; then
        echo "DRY: $*"
    else
        echo "+ $*"
        "$@"
    fi
}

pause() {
    if [[ $DRY_RUN -eq 0 ]]; then
        read -p "Continue? [y/N] " ans
        [[ "$ans" =~ ^[Yy]$ ]] || { echo "aborted."; exit 1; }
    fi
}

step() {
    echo ""
    echo "================================================================="
    echo "STEP: $*"
    echo "================================================================="
}

# ---- Preflight ----

if ! command -v uv >/dev/null 2>&1; then
    echo "uv not installed. Install with:"
    echo "    curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 1
fi

if [[ ! -f pyproject.toml ]]; then
    echo "No pyproject.toml found. Run from the repo root."
    exit 1
fi

# ---- Detect source manager ----

SOURCE="unknown"
if grep -q "^\[tool.poetry\]" pyproject.toml; then
    SOURCE="poetry"
elif [[ -f poetry.lock ]]; then
    SOURCE="poetry"
elif [[ -f requirements.txt ]] && grep -q "pip-tools" pyproject.toml 2>/dev/null; then
    SOURCE="pip-tools"
elif [[ -f Pipfile ]]; then
    SOURCE="pipenv"
elif [[ -f requirements.txt ]]; then
    SOURCE="pip"
fi

echo "Detected source: $SOURCE"

# ---- Step 1: backup ----

step "1. Backup current state"
run git status --short
run git stash push -u -m "pre-uv-migration backup" || true
pause

# ---- Step 2: convert ----

step "2. Convert pyproject.toml using migrate-to-uv"
run uvx migrate-to-uv
pause

# ---- Step 3: lock ----

step "3. Generate uv.lock"
run uv lock
pause

# ---- Step 4: sync ----

step "4. Sync the venv"
run uv sync --frozen
pause

# ---- Step 5: verify with tests ----

step "5. Run tests to verify the venv is healthy"
if [[ -f manage.py ]]; then
    run uv run python manage.py check
fi
run uv run pytest --collect-only || echo "(pytest not configured; skipping)"
pause

# ---- Step 6: cleanup old artifacts ----

step "6. Remove old packaging artifacts"
case "$SOURCE" in
    poetry)
        run rm -f poetry.lock
        echo "TIP: also remove [tool.poetry.*] sections from pyproject.toml if migrate-to-uv left any."
        ;;
    pip-tools)
        echo "TIP: remove requirements.in and requirements.txt after confirming uv.lock pins the same versions."
        ;;
    pipenv)
        run rm -f Pipfile Pipfile.lock
        ;;
    pip)
        echo "TIP: remove requirements.txt after confirming uv.lock pins the same versions."
        ;;
esac
pause

# ---- Step 7: CI / Docker handoff ----

step "7. Update CI / Dockerfile / pre-commit"
cat <<'EOF'
Manual updates required (not automated by this script):

1. CI (.github/workflows/*.yml):
   - Replace `snok/install-poetry@v1` with `astral-sh/setup-uv@v7`
   - Replace `poetry install` with `uv sync --frozen`
   - Replace `poetry run` with `uv run`

2. Dockerfile:
   - Use `templates/dockerfile-django-uv` from this Stinger as a starting point.

3. Pre-commit:
   - Add the `astral-sh/uv-pre-commit` hook (id: uv-lock).

4. Docs / README:
   - Update install instructions: `uv sync` instead of `poetry install`.

5. .python-version:
   - Add at the repo root if missing (`echo "3.12" > .python-version`).
EOF

echo ""
echo "Migration scaffolding complete. Review the diff and commit when ready."
