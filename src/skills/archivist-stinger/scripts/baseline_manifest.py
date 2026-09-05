#!/usr/bin/env python3
"""Tamper baseline for parallel agent work.

Records a SHA-256 manifest of every file under ROOT (minus excluded trees),
then later reports exactly which files were added, removed, or changed.
Use it to prove that a fleet of writers confined itself to its assigned
directory, or to show a reviewer the full blast radius of a rename.

Usage:
  python baseline_manifest.py create ROOT MANIFEST [--exclude PATHPREFIX ...]
  python baseline_manifest.py diff   ROOT MANIFEST [--exclude PATHPREFIX ...]

--exclude takes repo-relative path prefixes (for example library/ or docs/).
.git and node_modules are always excluded.
"""
from __future__ import annotations

import argparse
import hashlib
import os
import sys

ALWAYS_SKIP = {".git", "node_modules"}


def walk(root: str, excludes: list[str]) -> dict[str, str]:
    manifest: dict[str, str] = {}
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in ALWAYS_SKIP]
        for fn in filenames:
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, root).replace(os.sep, "/")
            if any(rel == e.rstrip("/") or rel.startswith(e.rstrip("/") + "/") for e in excludes):
                continue
            h = hashlib.sha256()
            try:
                with open(full, "rb") as fh:
                    for chunk in iter(lambda: fh.read(1 << 20), b""):
                        h.update(chunk)
            except OSError:
                continue
            manifest[rel] = h.hexdigest()
    return manifest


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("mode", choices=["create", "diff"])
    ap.add_argument("root")
    ap.add_argument("manifest")
    ap.add_argument("--exclude", action="append", default=[])
    args = ap.parse_args()

    root = os.path.abspath(args.root)
    current = walk(root, args.exclude)
    if args.mode == "create":
        with open(args.manifest, "w", encoding="utf-8") as fh:
            for rel in sorted(current):
                fh.write(f"{current[rel]}  {rel}\n")
        print(f"baseline written: {len(current)} files -> {args.manifest}")
        return 0

    baseline: dict[str, str] = {}
    with open(args.manifest, encoding="utf-8") as fh:
        for line in fh:
            line = line.rstrip("\n")
            if not line:
                continue
            digest, rel = line.split("  ", 1)
            baseline[rel] = digest
    added = sorted(set(current) - set(baseline))
    removed = sorted(set(baseline) - set(current))
    changed = sorted(r for r in set(current) & set(baseline) if current[r] != baseline[r])
    for label, rows in (("added", added), ("removed", removed), ("changed", changed)):
        print(f"{label}: {len(rows)}")
        for r in rows[:200]:
            print(f"  {r}")
        if len(rows) > 200:
            print(f"  ... {len(rows) - 200} more")
    if not (added or removed or changed):
        print("no changes outside the excluded paths")
        return 0
    return 1


if __name__ == "__main__":
    sys.exit(main())
