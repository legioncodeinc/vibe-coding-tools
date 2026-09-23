#!/usr/bin/env python3
"""Record successful Get Started completion in the repository root."""

from __future__ import annotations

import argparse
import json
import os
from datetime import datetime, timezone
from pathlib import Path


LOCK_NAME = "wasp-nest.lock"
SOURCE_SUFFIXES = {".c", ".cpp", ".cs", ".go", ".html", ".java", ".js", ".jsx", ".kt", ".php", ".py", ".rb", ".rs", ".sh", ".svelte", ".swift", ".ts", ".tsx", ".vue"}
IGNORED_SOURCE_DIRS = {".git", ".next", ".svelte-kit", ".venv", "build", "coverage", "dist", "docs", "library", "node_modules", "target", "vendor", "venv"}


def has_existing_code(root: Path) -> bool:
    if any((root / name).is_file() for name in ("Cargo.toml", "Gemfile", "go.mod", "mix.exs", "package.json", "pyproject.toml", "pom.xml")):
        return True
    for directory, children, files in os.walk(root):
        children[:] = [name for name in children if name not in IGNORED_SOURCE_DIRS]
        if any(Path(name).suffix in SOURCE_SUFFIXES for name in files):
            return True
    return False


def mark(root: Path, knowledge_status: str) -> dict:
    root = root.resolve(strict=True)
    if not (root / ".git").exists():
        raise ValueError(f"not a repository root: {root}")
    lock = root / LOCK_NAME
    if lock.is_symlink():
        raise ValueError("refusing symlinked wasp-nest.lock")
    if lock.exists():
        if not lock.is_file():
            raise ValueError("wasp-nest.lock is not a file")
        return {"status": "already-initialized", "lock": str(lock)}
    required = ("library/knowledge", "library/requirements", "library/issues", "library/notes")
    missing = [name for name in required if not (root / name).is_dir()]
    if missing:
        raise ValueError("Get Started is incomplete; missing " + ", ".join(missing))
    existing_code = has_existing_code(root)
    if existing_code and knowledge_status != "completed":
        raise ValueError("existing code requires the Knowledge Stinger pass before locking setup")
    if not existing_code and knowledge_status not in {"completed", "not-needed"}:
        raise ValueError("knowledge status must be completed or not-needed")
    record = {
        "schema": 1,
        "initialized_at": datetime.now(timezone.utc).isoformat(),
        "playbook": "get-started-stinger",
        "existing_code": existing_code,
        "knowledge_status": knowledge_status,
    }
    descriptor = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o644)
    with os.fdopen(descriptor, "w", encoding="utf-8") as file:
        json.dump(record, file, indent=2)
        file.write("\n")
    return {"status": "initialized", "lock": str(lock), **record}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, required=True, help="repository root")
    parser.add_argument("--knowledge-status", choices=("completed", "not-needed"), required=True)
    args = parser.parse_args()
    try:
        result = mark(args.repo, args.knowledge_status)
    except (OSError, ValueError) as error:
        parser.exit(1, f"repository setup was not marked complete: {error}\n")
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
