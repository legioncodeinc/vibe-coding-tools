#!/usr/bin/env python3
"""Report unresolved local Markdown links in selected files or directories."""

from __future__ import annotations

import argparse
import re
from pathlib import Path
from urllib.parse import unquote


LINK = re.compile(r"(?<!!)\[[^\]]*\]\(([^)]+)\)")
EXTERNAL = ("http://", "https://", "mailto:", "tel:", "data:", "#")


def markdown_files(inputs: list[Path]) -> list[Path]:
    files: set[Path] = set()
    for path in inputs:
        if path.is_dir():
            files.update(path.rglob("*.md"))
        elif path.is_file() and path.suffix.lower() in {".md", ".mdc"}:
            files.add(path)
    return sorted(files)


def broken_links(paths: list[Path]) -> list[str]:
    failures: list[str] = []
    for path in markdown_files(paths):
        if {"research", "raw"}.issubset(path.parts):
            continue
        content = path.read_text(encoding="utf-8")
        for match in LINK.finditer(content):
            raw = match.group(1).strip().strip("<>")
            target = raw.split("#", 1)[0].strip().split(' "', 1)[0]
            if not target or raw.startswith(EXTERNAL):
                continue
            if any(char in target for char in "<>{}*$"):
                continue
            resolved = (path.parent / unquote(target)).resolve()
            if not resolved.exists():
                line = content.count("\n", 0, match.start()) + 1
                failures.append(f"{path}:{line}: {raw}")
    return failures


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", nargs="+", type=Path)
    args = parser.parse_args()
    failures = broken_links(args.paths)
    for failure in failures:
        print(failure)
    print(f"{len(failures)} broken local link(s)")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
