#!/usr/bin/env python3
"""Emit a deterministic JSON inventory of a Rust workspace.

This helper performs static discovery only. It does not run Cargo, access the
network, modify files, or claim that a declared version is actually supported.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


SKIP_DIRS = {".git", "node_modules", "target", "vendor"}
FIELD_PATTERNS = {
    "edition": re.compile(r'^\s*edition\s*=\s*["\']([^"\']+)["\']', re.MULTILINE),
    "rust_version": re.compile(r'^\s*rust-version\s*=\s*["\']([^"\']+)["\']', re.MULTILINE),
    "resolver": re.compile(r'^\s*resolver\s*=\s*["\']([^"\']+)["\']', re.MULTILINE),
}
UNSAFE_PATTERN = re.compile(r"\bunsafe\b")


def included(path: Path, root: Path) -> bool:
    try:
        relative = path.relative_to(root)
    except ValueError:
        return False
    return not any(part in SKIP_DIRS for part in relative.parts)


def values(pattern: re.Pattern[str], text: str) -> list[str]:
    return sorted(set(pattern.findall(text)))


def inspect(root: Path) -> dict[str, object]:
    manifests = sorted(
        path for path in root.rglob("Cargo.toml") if included(path, root)
    )
    manifest_rows = []
    for path in manifests:
        text = path.read_text(encoding="utf-8", errors="replace")
        manifest_rows.append(
            {
                "path": path.relative_to(root).as_posix(),
                "editions": values(FIELD_PATTERNS["edition"], text),
                "rust_versions": values(FIELD_PATTERNS["rust_version"], text),
                "resolvers": values(FIELD_PATTERNS["resolver"], text),
                "workspace_manifest": "[workspace]" in text,
            }
        )

    toolchain_files = []
    for name in ("rust-toolchain", "rust-toolchain.toml"):
        for path in sorted(root.rglob(name)):
            if included(path, root):
                toolchain_files.append(path.relative_to(root).as_posix())

    rust_files = sorted(path for path in root.rglob("*.rs") if included(path, root))
    unsafe_hits = []
    for path in rust_files:
        text = path.read_text(encoding="utf-8", errors="replace")
        count = len(UNSAFE_PATTERN.findall(text))
        if count:
            unsafe_hits.append(
                {"path": path.relative_to(root).as_posix(), "token_count": count}
            )

    return {
        "status": "pass" if manifests else "fail",
        "root": str(root),
        "manifest_count": len(manifests),
        "manifests": manifest_rows,
        "toolchain_files": sorted(set(toolchain_files)),
        "rust_source_count": len(rust_files),
        "unsafe_token_hits": unsafe_hits,
        "limitations": [
            "Regex discovery, not a TOML parser; table ownership, comments, Cargo inheritance, and toolchain contents are not interpreted.",
            "unsafe token counts can include comments, strings, and safe wrappers.",
            "Declared editions, resolvers, and MSRVs are not verified by this script.",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Emit a static JSON inventory for a Rust workspace."
    )
    parser.add_argument("target", type=Path, help="Repository or workspace path")
    args = parser.parse_args()
    root = args.target.resolve()

    if not root.exists() or not root.is_dir():
        print(
            json.dumps(
                {"status": "error", "message": "target must be an existing directory"},
                sort_keys=True,
            )
        )
        return 2

    try:
        result = inspect(root)
    except OSError as exc:
        print(json.dumps({"status": "error", "message": str(exc)}, sort_keys=True))
        return 2

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["status"] == "pass" else 1


if __name__ == "__main__":
    sys.exit(main())
