#!/usr/bin/env python3
"""
audit-applied-migrations.py — verify no edits to migrations already deployed.

Compares migration files between the working tree and a base ref (typically
origin/main, or a release tag). Any migration that exists in both but differs
is a must-fix finding — applied migrations are sacred (`guides/04-django-migrations.md`).

Usage:
    python -m scripts.audit-applied-migrations origin/main
    python -m scripts.audit-applied-migrations v1.42.0
"""
from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path


def run(cmd: list[str]) -> str:
    return subprocess.check_output(cmd, text=True).strip()


def find_migration_files(ref: str) -> set[str]:
    """List migration files at the given ref."""
    out = run(["git", "ls-tree", "-r", "--name-only", ref])
    return {
        line for line in out.splitlines()
        if "/migrations/" in line and line.endswith(".py") and not line.endswith("__init__.py")
    }


def file_at_ref(ref: str, path: str) -> str | None:
    try:
        return run(["git", "show", f"{ref}:{path}"])
    except subprocess.CalledProcessError:
        return None


def file_at_head(path: Path) -> str | None:
    if path.exists():
        return path.read_text(encoding="utf-8")
    return None


def main() -> int:
    parser = argparse.ArgumentParser(description="Detect edits to applied migrations.")
    parser.add_argument("base_ref", help="Git ref considered 'deployed' (e.g., origin/main).")
    args = parser.parse_args()

    repo_root = Path(run(["git", "rev-parse", "--show-toplevel"]))

    base_files = find_migration_files(args.base_ref)
    findings = 0

    for rel in sorted(base_files):
        base = file_at_ref(args.base_ref, rel)
        if base is None:
            continue
        head = file_at_head(repo_root / rel)
        if head is None:
            # Deleted in working tree — also a finding (lost migration history)
            print(f"{rel}: error: applied migration deleted in working tree")
            findings += 1
            continue
        if base.strip() != head.strip():
            print(f"{rel}: error: applied migration edited (differs from {args.base_ref})")
            findings += 1

    if findings == 0:
        print(f"OK: no edits to applied migrations from {args.base_ref}.", file=sys.stderr)
    else:
        print(f"\n{findings} edited applied migration(s) — these are MUST-FIX.", file=sys.stderr)

    return 1 if findings else 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except subprocess.CalledProcessError as e:
        print(f"git error: {e}", file=sys.stderr)
        sys.exit(2)
