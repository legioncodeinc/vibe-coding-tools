#!/usr/bin/env python3
"""Verify a Library Schema v2 knowledge tree produced by the archivist fleet.

Checks every markdown file under ROOT (default library/knowledge):
  header      H1 title, then "> Category: X | Version: N.N | Date: Month YYYY | Status: Active|Archived|Draft"
  category    the Category matches the first folder under public/ or private/ (Title Case; "ai" -> "AI", "faqs" -> "FAQs")
  related     a **Related:** section with 2 to 8 links, followed by a --- rule
  links       every relative markdown link resolves to an existing file
  mermaid     only flowchart, graph, sequenceDiagram, stateDiagram-v2; no style, classDef, linkStyle, fill:, or click
  dashes      newly authored docs contain no em dash or en dash (relocated docs keep their original body text)
  forbidden   no attribution strings anywhere except verbatim evidence folders
  length      newly authored docs are 100 to 520 lines (schema docs may exceed)

Relocated docs are recognised by Status: Archived, by living under an
audience folder such as releases/, reference/, guides/, faqs/, overview/,
history/, or audits/, or by a name listed in --relocated (one basename per line).
Forbidden strings default to copyright and license markers; add the names
and handles found by attribution_sweep.py with --forbidden (one regex per line).

Exit status 1 when any problem is found.

Usage:
  python verify_kb.py [ROOT] [--relocated FILE] [--forbidden FILE] [--allow-short]
"""
from __future__ import annotations

import argparse
import os
import re
import sys

HEADER = re.compile(r"^> Category: ([A-Za-z]+) \| Version: (\d+\.\d+) \| Date: ([A-Z][a-z]+ \d{4}) \| Status: (Active|Archived|Draft)$")
RELOCATED_FOLDERS = re.compile(r"/(releases|reference|guides|faqs|overview|history|audits)/")
LINK = re.compile(r"\]\((\.{1,2}/[^)#\s]+)(#[^)]*)?\)")
DASH = re.compile("[–—]")
DEFAULT_FORBIDDEN = [
    r"copyright \(c\)", "©", r"@author\b", r"@license\b", r"\bMIT License\b",
    r"\bApache License\b", r"All rights reserved",
]


def title_case(domain: str) -> str:
    return {"ai": "AI", "faqs": "FAQs"}.get(domain, domain[:1].upper() + domain[1:])


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("root", nargs="?", default="library/knowledge")
    ap.add_argument("--relocated")
    ap.add_argument("--forbidden")
    ap.add_argument("--allow-short", action="store_true")
    args = ap.parse_args()

    root = os.path.abspath(args.root)
    relocated_names = set()
    if args.relocated:
        with open(args.relocated, encoding="utf-8") as fh:
            relocated_names = {l.strip() for l in fh if l.strip()}
    forbidden = list(DEFAULT_FORBIDDEN)
    if args.forbidden:
        with open(args.forbidden, encoding="utf-8") as fh:
            forbidden += [l.strip() for l in fh if l.strip() and not l.startswith("#")]
    forbidden_rx = [re.compile(p, re.I) for p in forbidden]

    problems: list[str] = []
    files = headed = 0
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames.sort()
        for fn in sorted(filenames):
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, root).replace(os.sep, "/")
            files += 1
            try:
                with open(full, encoding="utf-8", errors="replace") as fh:
                    text = fh.read()
            except OSError:
                continue
            lines = text.splitlines()
            evidence = "/evidence/" in ("/" + rel)
            readme = fn.lower() == "readme.md"
            if not evidence:
                for rx in forbidden_rx:
                    m = rx.search(text)
                    if m:
                        problems.append(f"{rel}: forbidden string {m.group(0)!r}")
            if not fn.endswith(".md") or readme or evidence:
                continue
            headed += 1
            status_archived = "Status: Archived" in text
            relocated = status_archived or bool(RELOCATED_FOLDERS.search("/" + rel)) or fn in relocated_names
            if not lines or not lines[0].startswith("# "):
                problems.append(f"{rel}: line 1 is not an H1 title")
            cat_idx = next((i for i, l in enumerate(lines) if l.startswith("> Category:")), -1)
            if cat_idx < 0:
                problems.append(f"{rel}: missing category header line")
            else:
                m = HEADER.match(lines[cat_idx])
                if not m:
                    problems.append(f"{rel}:{cat_idx + 1}: malformed header {lines[cat_idx]!r}")
                else:
                    parts = rel.split("/")
                    aud = next((i for i, p in enumerate(parts) if p in ("public", "private")), -1)
                    if aud >= 0:
                        domain = parts[aud + 1] if len(parts) > aud + 2 else "overview"
                        if m.group(1) != title_case(domain):
                            problems.append(f"{rel}: category {m.group(1)!r} does not match domain {domain!r}")
            rel_idx = next((i for i, l in enumerate(lines) if l.strip() == "**Related:**"), -1)
            if rel_idx < 0:
                problems.append(f"{rel}: missing **Related:** section")
            else:
                n = 0
                for l in lines[rel_idx + 1:]:
                    if l.startswith("- "):
                        n += 1
                    else:
                        break
                if n < 2:
                    problems.append(f"{rel}: Related section has {n} links (need at least 2)")
                if n > 8:
                    problems.append(f"{rel}: Related section has {n} links (max 8)")
            if not any(l.strip() == "---" for l in lines):
                problems.append(f"{rel}: missing --- rule after header")
            for m in LINK.finditer(text):
                target = os.path.normpath(os.path.join(os.path.dirname(full), m.group(1)))
                if not os.path.exists(target):
                    problems.append(f"{rel}: broken link {m.group(1)}")
            for block in re.findall(r"```mermaid[\s\S]*?```", text):
                if re.search(r"^\s*(style|classDef|linkStyle)\s", block, re.M) or "fill:#" in block:
                    problems.append(f"{rel}: mermaid block uses explicit styling")
                if re.search(r"^\s*click\s", block, re.M):
                    problems.append(f"{rel}: mermaid block uses click")
                if not re.match(r"```mermaid\s*\n\s*(flowchart|graph|sequenceDiagram|stateDiagram-v2)", block):
                    problems.append(f"{rel}: mermaid block uses an unsupported diagram type")
            if not relocated:
                dashes = sum(1 for l in lines if DASH.search(l))
                if dashes:
                    problems.append(f"{rel}: {dashes} line(s) with em/en dash (newly authored doc must have none)")
                if len(lines) > 520 and "schema" not in fn:
                    problems.append(f"{rel}: {len(lines)} lines (over 520)")
                if len(lines) < 100 and not args.allow_short:
                    problems.append(f"{rel}: only {len(lines)} lines (new docs should be 100 to 400)")

    print(f"files={files} headed={headed} problems={len(problems)}")
    for p in problems:
        print("  " + p)
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
