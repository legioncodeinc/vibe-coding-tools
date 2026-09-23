#!/usr/bin/env python3
"""
validate.py - deterministic structure check for swarm-audit-stinger.

Checks: SKILL.md exists with spec-six frontmatter only, name matches the folder,
description is 200 characters or fewer (Cowork cap), no em or en dashes in any
markdown file, no backtick-bang injection lines, the research archive has a
distillation and at least one raw file, every guide exists, the workflow template
and the status script exist. JSON on stdout, exit 0 pass, 1 fail, 2 error.
"""

import argparse
import json
import re
import sys
from pathlib import Path

SPEC_SIX = {"name", "description", "license", "compatibility", "metadata", "allowed-tools"}
REQUIRED = [
    "SKILL.md",
    "references/research/distilled-swarm-audit.md",
    "references/observer-protocol.md",
    "references/templates/swarm-audit-workflow.js",
    "scripts/fleet-status.js",
    "guides/01-scout-and-plan.md",
    "guides/02-author-the-fleet-script.md",
    "guides/03-run-and-observe.md",
    "guides/04-verify-interpret-critique.md",
    "guides/05-assemble-and-deliver.md",
]


def frontmatter_keys(text: str):
    if not text.startswith("---"):
        return None, "missing frontmatter"
    end = text.find("\n---", 3)
    if end < 0:
        return None, "unterminated frontmatter"
    block = text[3:end]
    keys = set()
    desc = ""
    name = ""
    for line in block.splitlines():
        m = re.match(r"^([A-Za-z_-]+):\s*(.*)$", line)
        if m:
            keys.add(m.group(1))
            if m.group(1) == "description":
                desc = m.group(2).strip().strip('"')
            if m.group(1) == "name":
                name = m.group(2).strip().strip('"')
    return {"keys": keys, "description": desc, "name": name}, None


def run_check(root: Path) -> dict:
    failures = []
    for rel in REQUIRED:
        if not (root / rel).exists():
            failures.append(f"missing {rel}")
    raw_dir = root / "references" / "research" / "raw"
    if not raw_dir.exists() or not any(raw_dir.iterdir()):
        failures.append("references/research/raw/ is missing or empty")
    skill = root / "SKILL.md"
    if skill.exists():
        text = skill.read_text(encoding="utf-8")
        fm, err = frontmatter_keys(text)
        if err:
            failures.append(err)
        else:
            extra = fm["keys"] - SPEC_SIX
            if extra:
                failures.append(f"non-spec frontmatter keys: {sorted(extra)}")
            if fm["name"] != root.name:
                failures.append(f"frontmatter name '{fm['name']}' does not match folder '{root.name}'")
            if len(fm["description"]) > 200:
                failures.append(f"description is {len(fm['description'])} chars; Cowork cap is 200")
        if "## Critical Directive" not in text:
            failures.append("SKILL.md lacks a Critical Directive section")
    for md in root.rglob("*.md"):
        body = md.read_text(encoding="utf-8", errors="replace")
        if "—" in body or "–" in body:
            failures.append(f"em or en dash in {md.relative_to(root)}")
        if re.search(r"!`[^`]+`", body):
            failures.append(f"backtick-bang injection in {md.relative_to(root)}")
    return {"status": "pass" if not failures else "fail", "check": "swarm-audit-stinger-structure", "target": str(root), "failures": failures}


def main() -> int:
    parser = argparse.ArgumentParser(description="Deterministic structure check for swarm-audit-stinger.")
    parser.add_argument("target", type=Path, nargs="?", default=Path(__file__).resolve().parent.parent, help="Skill folder (default: this stinger).")
    args = parser.parse_args()
    try:
        result = run_check(args.target)
    except Exception as exc:  # noqa: BLE001
        print(json.dumps({"status": "error", "message": str(exc)}))
        return 2
    print(json.dumps(result))
    return 0 if result["status"] == "pass" else 1


if __name__ == "__main__":
    sys.exit(main())
