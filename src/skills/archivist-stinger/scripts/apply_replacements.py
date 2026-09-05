#!/usr/bin/env python3
"""Apply an ordered, reviewed replacement map to every text file under ROOT.

The map is a JSON array of objects applied in order, each with:
  pattern      the literal string (or regular expression when "regex": true)
  replacement  the replacement text (Python re syntax when "regex": true)
  regex        optional boolean, default false
  paths        optional list of regular expressions; when present the rule
               applies only to files whose repo-relative path matches one
  note         optional free text, ignored by the script

Dry-run by default: prints per-file replacement counts and touches nothing.
Pass --apply to write. Files are read and written as bytes decoded with
surrogateescape so undecodable bytes and existing line endings survive
untouched. Binary files (NUL byte in the first 8 KiB) and files over 5 MiB
are skipped. .git and dependency roots are never entered.

Usage:
  python apply_replacements.py MAP.json ROOT [--apply] [--exclude-dir NAME ...]
                               [--only-ext .md .txt ...]
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from collections import Counter

SKIP_DIRS = {".git", "node_modules", ".venv", "venv", "__pycache__", "target",
             "dist", "build", "coverage", ".next", ".gradle", "Pods"}


def load_map(path: str) -> list[dict]:
    with open(path, encoding="utf-8") as fh:
        rules = json.load(fh)
    compiled = []
    for i, rule in enumerate(rules):
        if "pattern" not in rule or "replacement" not in rule:
            raise SystemExit(f"rule {i} needs pattern and replacement")
        flags = 0
        rx = re.compile(rule["pattern"] if rule.get("regex") else re.escape(rule["pattern"]), flags)
        paths = [re.compile(p) for p in rule.get("paths", [])]
        compiled.append({"rx": rx, "repl": rule["replacement"], "paths": paths,
                         "label": rule.get("form") or rule["pattern"][:40], "regex": bool(rule.get("regex"))})
    return compiled


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("map")
    ap.add_argument("root")
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--exclude-dir", action="append", default=[])
    ap.add_argument("--only-ext", nargs="*", default=None)
    args = ap.parse_args()

    rules = load_map(args.map)
    root = os.path.abspath(args.root)
    skip = SKIP_DIRS | set(args.exclude_dir)
    only_ext = {e.lower() for e in args.only_ext} if args.only_ext else None

    files_changed = 0
    totals: Counter = Counter()
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in skip]
        for fn in filenames:
            if only_ext is not None and os.path.splitext(fn)[1].lower() not in only_ext:
                continue
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, root).replace(os.sep, "/")
            try:
                if os.path.getsize(full) > 5 * 1024 * 1024:
                    continue
                with open(full, "rb") as fh:
                    raw = fh.read()
            except OSError:
                continue
            if b"\x00" in raw[:8192]:
                continue
            text = raw.decode("utf-8", errors="surrogateescape")
            new_text = text
            counts: Counter = Counter()
            for rule in rules:
                if rule["paths"] and not any(p.search(rel) for p in rule["paths"]):
                    continue
                new_text, n = rule["rx"].subn(rule["repl"], new_text)
                if n:
                    counts[rule["label"]] += n
            if not counts:
                continue
            files_changed += 1
            totals.update(counts)
            print(f"{rel}: " + ", ".join(f"{k} x{v}" for k, v in counts.items()))
            if args.apply:
                with open(full, "wb") as fh:
                    fh.write(new_text.encode("utf-8", errors="surrogateescape"))

    mode = "applied" if args.apply else "dry run"
    print(f"\n{mode}: {files_changed} files, replacements: " + (", ".join(f"{k}={v}" for k, v in totals.items()) or "none"))
    if not args.apply and files_changed:
        print("re-run with --apply to write these changes")
    return 0


if __name__ == "__main__":
    sys.exit(main())
