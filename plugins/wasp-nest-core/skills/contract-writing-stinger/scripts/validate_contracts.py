#!/usr/bin/env python3
"""Read-only structural check for accepted CTR records and linked PRDs.

Usage: python3 scripts/validate_contracts.py /path/to/repository
Output is JSON. Exit 0 for pass, 1 for findings, 2 for invalid usage.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


NAME = re.compile(r"^CTR-([0-9]{3,})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$")
SECTION = re.compile(r"^## (.+)$", re.MULTILINE)
LINK = re.compile(r"\[[^]]+\]\(([^)]+)\)")
REQUIRED = (
    "Boundary and scope", "Parties and owners", "Sources and constraints",
    "Agreed behavior", "Examples and edge cases", "Compatibility and rollout",
    "Verification obligations", "PRD dependencies", "Open decisions", "Change history",
)


def sections(text: str) -> dict[str, str]:
    matches = list(SECTION.finditer(text))
    return {
        match.group(1): text[match.end():matches[index + 1].start() if index + 1 < len(matches) else len(text)].strip()
        for index, match in enumerate(matches)
    }


def check_contract(path: Path, repository: Path) -> list[str]:
    issues: list[str] = []
    match = NAME.match(path.name)
    if not match:
        return [f"{path}: filename must be CTR-<###>-<slug>.md"]
    text = path.read_text(encoding="utf-8")
    found = sections(text)
    for heading in REQUIRED:
        if heading not in found:
            issues.append(f"{path}: missing section: {heading}")
    status = re.search(r"^> \*\*Status:\*\* (Draft|Accepted|Superseded)\s*$", text, re.MULTILINE)
    revision = re.search(r"^> \*\*Revision:\*\* ([1-9][0-9]*)\s*$", text, re.MULTILINE)
    supersedes = re.search(r"^> \*\*Supersedes:\*\* (.+)$", text, re.MULTILINE)
    superseded_by = re.search(r"^> \*\*Superseded by:\*\* (.+)$", text, re.MULTILINE)
    if not status:
        issues.append(f"{path}: invalid or missing status")
    if not revision:
        issues.append(f"{path}: invalid or missing revision")
    if not supersedes or not superseded_by:
        issues.append(f"{path}: missing supersession metadata")
    if status and status.group(1) == "Accepted":
        accepted = re.search(r"^> \*\*Accepted by:\*\* (.+)$", text, re.MULTILINE)
        if not accepted or not re.search(r"^Mario, .*\b[0-9]{4}-[0-9]{2}-[0-9]{2}\b", accepted.group(1)):
            issues.append(f"{path}: accepted record needs operator acceptance evidence")
        if re.search(r"<[^>]+>", text):
            issues.append(f"{path}: accepted record contains template placeholders")
        for heading in ("Boundary and scope", "Parties and owners", "Agreed behavior", "Examples and edge cases", "Verification obligations"):
            if not found.get(heading):
                issues.append(f"{path}: accepted record has empty section: {heading}")
        decisions = found.get("Open decisions", "")
        if decisions != "- None.":
            issues.append(f"{path}: accepted record has unresolved open decisions")
        if supersedes and supersedes.group(1) != "None" and revision:
            predecessor = re.fullmatch(r"CTR-([0-9]{3,}) revision ([1-9][0-9]*)", supersedes.group(1))
            if not predecessor:
                issues.append(f"{path}: invalid predecessor ID or revision")
            else:
                siblings = list(path.parent.glob(f"CTR-{predecessor.group(1)}-*.md"))
                backlink = f"> **Superseded by:** CTR-{match.group(1)} revision {revision.group(1)}"
                if len(siblings) != 1 or backlink not in siblings[0].read_text(encoding="utf-8"):
                    issues.append(f"{path}: predecessor must link to CTR-{match.group(1)} revision {revision.group(1)}")
    if status and status.group(1) == "Superseded" and revision:
        successor = re.fullmatch(r"CTR-([0-9]{3,}) revision ([1-9][0-9]*)", superseded_by.group(1)) if superseded_by else None
        if not successor:
            issues.append(f"{path}: superseded record needs a successor ID and revision")
        else:
            siblings = list(path.parent.glob(f"CTR-{successor.group(1)}-*.md"))
            backlink = f"> **Supersedes:** CTR-{match.group(1)} revision {revision.group(1)}"
            if len(siblings) != 1 or backlink not in siblings[0].read_text(encoding="utf-8"):
                issues.append(f"{path}: successor must link back to CTR-{match.group(1)} revision {revision.group(1)}")
    dependencies = found.get("PRD dependencies", "")
    for target in LINK.findall(dependencies):
        if "://" in target or target.startswith("#"):
            continue
        resolved = (path.parent / target.split("#", 1)[0]).resolve()
        if not resolved.is_relative_to(repository.resolve()) or not resolved.is_file():
            issues.append(f"{path}: PRD dependency link does not resolve inside repository: {target}")
            continue
        if status and status.group(1) == "Accepted" and revision:
            prd = resolved.read_text(encoding="utf-8")
            token = f"CTR-{match.group(1)} revision {revision.group(1)}"
            if token not in prd or "## Contract dependencies" not in prd:
                issues.append(f"{resolved}: must pin {token} in Contract dependencies")
    return issues


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("repository", type=Path)
    args = parser.parse_args()
    root = args.repository.resolve()
    if not root.is_dir():
        print(json.dumps({"status": "error", "message": "repository path is not a directory"}))
        return 2
    folder = root / "library/knowledge/private/contracts"
    paths = sorted(path for path in folder.glob("*.md") if path.name != "README.md") if folder.is_dir() else []
    findings = [item for path in paths for item in check_contract(path, root)]
    by_number: dict[str, list[Path]] = {}
    for path in paths:
        match = NAME.match(path.name)
        if match:
            by_number.setdefault(match.group(1), []).append(path)
    for number, duplicates in by_number.items():
        if len(duplicates) > 1:
            findings.append(f"CTR-{number}: duplicate number in {', '.join(str(path) for path in duplicates)}")
    print(json.dumps({"status": "pass" if not findings else "fail", "checked": len(paths), "findings": findings}, indent=2))
    return 1 if findings else 0


if __name__ == "__main__":
    raise SystemExit(main())
