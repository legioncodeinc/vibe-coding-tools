#!/usr/bin/env python3
"""Inventory every spelling of a product identifier before renaming it.

Given the old identifier in kebab-case (for example ``old-product-name``) the
script derives its other forms (snake, screaming snake, Pascal, camel, Title
Case, Hyphenated-Title, dotted) and counts occurrences of each form across
every text file under ROOT, per file and per form. It also lists file and
directory names that contain the identifier. With ``--new`` it prints a
replacement map, longest and most specific forms first, ready for
apply_replacements.py.

Read-only. Nothing is renamed by this script.

Usage:
  python identifier_forms.py OLD-IDENT ROOT [--new NEW-IDENT] [--json OUT.json]
                             [--exclude-dir NAME ...]
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from collections import Counter, defaultdict

SKIP_DIRS = {".git", "node_modules", ".venv", "venv", "__pycache__", "target",
             "dist", "build", "coverage", ".next", ".gradle", "Pods"}


def forms(kebab: str) -> dict[str, str]:
    parts = [p for p in kebab.strip().lower().split("-") if p]
    if not parts:
        raise SystemExit("identifier must be non-empty kebab-case")
    return {
        "kebab": "-".join(parts),
        "snake": "_".join(parts),
        "screaming": "_".join(parts).upper(),
        "pascal": "".join(p.capitalize() for p in parts),
        "camel": parts[0] + "".join(p.capitalize() for p in parts[1:]),
        "title": " ".join(p.capitalize() for p in parts),
        "hyphen-title": "-".join(p.capitalize() for p in parts),
        "dotted": ".".join(parts),
        "upper-kebab": "-".join(parts).upper(),
    }


def is_text(path: str) -> str | None:
    try:
        if os.path.getsize(path) > 5 * 1024 * 1024:
            return None
        with open(path, "rb") as fh:
            data = fh.read()
    except OSError:
        return None
    if b"\x00" in data[:8192]:
        return None
    return data.decode("utf-8", errors="replace")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("old")
    ap.add_argument("root")
    ap.add_argument("--new")
    ap.add_argument("--json", dest="json_out")
    ap.add_argument("--exclude-dir", action="append", default=[])
    args = ap.parse_args()

    old = forms(args.old)
    new = forms(args.new) if args.new else None
    root = os.path.abspath(args.root)
    skip = SKIP_DIRS | set(args.exclude_dir)
    # Single-word identifiers collapse several forms into one string; dedupe.
    seen: dict[str, str] = {}
    for name, spelled in old.items():
        seen.setdefault(spelled, name)
    patterns = {name: re.compile(re.escape(spelled)) for spelled, name in seen.items()}

    per_form: Counter = Counter()
    per_file: dict[str, Counter] = defaultdict(Counter)
    named_paths: list[str] = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in skip]
        for d in dirnames:
            if any(s in d for s in seen):
                named_paths.append(os.path.relpath(os.path.join(dirpath, d), root).replace(os.sep, "/") + "/")
        for fn in filenames:
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, root).replace(os.sep, "/")
            if any(s in fn for s in seen):
                named_paths.append(rel)
            text = is_text(full)
            if text is None:
                continue
            for name, rx in patterns.items():
                n = len(rx.findall(text))
                if n:
                    per_form[name] += n
                    per_file[rel][name] += n

    print(f"identifier: {args.old}")
    print("forms searched:")
    for name, spelled in old.items():
        print(f"  {name:<13} {spelled:<40} {per_form[seen[spelled]] if seen[spelled] == name else 'dup':>6}")
    print(f"\nfiles with hits: {len(per_file)}")
    for rel, c in sorted(per_file.items(), key=lambda kv: -sum(kv[1].values()))[:25]:
        print(f"  {sum(c.values()):>6}  {rel}  {dict(c)}")
    if named_paths:
        print("\nfile and directory names containing the identifier (rename by hand or by script):")
        for p in sorted(set(named_paths)):
            print(f"  {p}")

    mapping = []
    if new:
        # Most specific spellings first so a shorter form never pre-empts a longer one.
        order = ["screaming", "upper-kebab", "hyphen-title", "title", "pascal", "camel", "snake", "dotted", "kebab"]
        emitted = set()
        for name in order:
            spelled = old[name]
            if spelled in emitted or old[name] == new[name]:
                continue
            emitted.add(spelled)
            mapping.append({"pattern": spelled, "replacement": new[name], "regex": False, "form": name})
        print("\nreplacement map (ordered; review before applying):")
        print(json.dumps(mapping, indent=2))
    if args.json_out:
        with open(args.json_out, "w", encoding="utf-8") as fh:
            json.dump({"old": old, "new": new, "per_form": dict(per_form),
                       "per_file": {k: dict(v) for k, v in per_file.items()},
                       "named_paths": sorted(set(named_paths)), "replacements": mapping}, fh, indent=2)
        print(f"\nwritten {args.json_out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
