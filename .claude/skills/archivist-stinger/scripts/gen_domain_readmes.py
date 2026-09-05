#!/usr/bin/env python3
"""Generate README.md indexes for every domain folder of a private knowledge tree.

Each README carries the Library Schema v2 frontmatter (ai_description and
human_description) and a table of every document in the folder, read from
the documents themselves: the H1 title, the one-sentence description under
the header, and an "(archived)" flag when Status: Archived. Subfolders are
walked three levels deep; evidence/ folders are listed by name only.

Domain descriptions come from DOMAINS.json:
  {"rotation": {"human": "...", "ai": "..."}, "auth": {...}}
Folders present on disk but absent from the JSON get a generic description
and are reported so you can fill them in.

Usage:
  python gen_domain_readmes.py ROOT DOMAINS.json [--dry]
"""
from __future__ import annotations

import argparse
import json
import os
import sys

GENERIC = {
    "human": "Knowledge documents for this domain. See each entry below.",
    "ai": "Domain folder of the private knowledge base. File new docs here with the standard knowledge header and a Related section.",
}


def title_case(domain: str) -> str:
    return {"ai": "AI", "faqs": "FAQs"}.get(domain, domain[:1].upper() + domain[1:])


def docs_in(directory: str, depth: int) -> list[str]:
    out: list[str] = []
    for entry in sorted(os.scandir(directory), key=lambda e: e.name):
        if entry.is_dir():
            if depth > 0 and entry.name != "evidence":
                out.extend(docs_in(entry.path, depth - 1))
        elif entry.name.endswith(".md") and entry.name.lower() != "readme.md":
            out.append(entry.path)
    return out


def meta(path: str) -> tuple[str, str, str]:
    with open(path, encoding="utf-8", errors="replace") as fh:
        lines = fh.read().splitlines()
    title = next((l[2:].strip() for l in lines if l.startswith("# ")), "(untitled)")
    cat_idx = next((i for i, l in enumerate(lines) if l.startswith("> Category:")), -1)
    desc = ""
    for l in lines[cat_idx + 1:]:
        if l.strip() and not l.startswith("**Related"):
            desc = l.strip()
            break
    status = "Archived" if cat_idx >= 0 and "Status: Archived" in lines[cat_idx] else "Active"
    return title, desc, status


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("root")
    ap.add_argument("domains")
    ap.add_argument("--dry", action="store_true")
    args = ap.parse_args()

    root = os.path.abspath(args.root)
    with open(args.domains, encoding="utf-8") as fh:
        domains = json.load(fh)
    missing = []
    for entry in sorted(os.scandir(root), key=lambda e: e.name):
        if not entry.is_dir() or entry.name.startswith("."):
            continue
        domain = entry.name
        d = domains.get(domain)
        if d is None:
            d = GENERIC
            missing.append(domain)
        files = docs_in(entry.path, 3)
        rows = []
        for f in files:
            rel = os.path.relpath(f, entry.path).replace(os.sep, "/")
            title, desc, status = meta(f)
            flag = " (archived)" if status == "Archived" else ""
            safe_desc = desc.replace("|", "\\|")
            rows.append(f"| [`{rel}`]({rel}) | {title}{flag} | {safe_desc} |")
        display = title_case(domain)
        body = (
            "---\n"
            "ai_description: |\n"
            f"  {d['ai']}\n"
            f"  Write path: library/knowledge/private/{domain}/<kebab-slug>.md. Use the standard\n"
            f"  knowledge header (Category: {display} | Version | Date | Status) and a Related section.\n"
            "human_description: |\n"
            f"  {d['human']}\n"
            "---\n\n"
            f"# {display}\n\n"
            f"{d['human']}\n\n"
            "Start with [`../overview.md`](../overview.md) for the reading guide across all domains.\n\n"
            "## Documents\n\n"
            "| File | Title | What it covers |\n| --- | --- | --- |\n"
            + "\n".join(rows) + "\n"
        )
        target = os.path.join(entry.path, "README.md")
        if args.dry:
            print(f"--- {domain}: {len(files)} docs")
        else:
            with open(target, "w", encoding="utf-8") as fh:
                fh.write(body)
            print(f"wrote {os.path.relpath(target)} ({len(files)} docs)")
    if missing:
        print("domains without a description in the JSON (generic text used): " + ", ".join(missing))
    return 0


if __name__ == "__main__":
    sys.exit(main())
