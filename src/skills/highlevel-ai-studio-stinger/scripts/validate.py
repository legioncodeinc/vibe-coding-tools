#!/usr/bin/env python3
"""Validate the HighLevel AI Studio Stinger package."""

from __future__ import annotations

import re
import sys
from datetime import date
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "references" / "research" / "raw"
WINDOW_START = date.fromisoformat("2026-03-03")
WINDOW_END = date.fromisoformat("2026-09-03")
ALLOWED_FRONTMATTER = {
    "name",
    "description",
    "license",
    "compatibility",
    "metadata",
    "allowed-tools",
}


def fail(errors: list[str], message: str) -> None:
    errors.append(message)


def root_frontmatter(errors: list[str]) -> None:
    skill = ROOT / "SKILL.md"
    if not skill.is_file():
        fail(errors, "missing SKILL.md")
        return

    text = skill.read_text(encoding="utf-8")
    match = re.match(r"\A---\n(.*?)\n---\n", text, re.DOTALL)
    if not match:
        fail(errors, "SKILL.md frontmatter is missing or malformed")
        return

    block = match.group(1)
    top_keys = {
        line.split(":", 1)[0].strip()
        for line in block.splitlines()
        if line and not line[0].isspace() and ":" in line
    }
    unexpected = sorted(top_keys - ALLOWED_FRONTMATTER)
    if unexpected:
        fail(errors, f"unexpected SKILL.md frontmatter fields: {', '.join(unexpected)}")

    for required in ("name", "description", "license", "compatibility", "metadata"):
        if required not in top_keys:
            fail(errors, f"missing SKILL.md frontmatter field: {required}")

    name_match = re.search(r'^name:\s*["\']?([^"\'\n]+)', block, re.MULTILINE)
    if not name_match or name_match.group(1).strip() != ROOT.name:
        fail(errors, "SKILL.md name must match the containing folder")

    description_match = re.search(
        r'^description:\s*["\']?(.*?)["\']?\s*$', block, re.MULTILINE
    )
    if not description_match:
        fail(errors, "SKILL.md description is missing")
    elif len(description_match.group(1).strip().strip('"\'')) > 200:
        fail(errors, "SKILL.md description exceeds the 200 character Cowork limit")

    critical = text.find("## Critical Directive")
    ship_gate = text.find("## Ship Gate")
    if critical < 0:
        fail(errors, "SKILL.md is missing the Critical Directive")
    if ship_gate < 0:
        fail(errors, "SKILL.md is missing the Ship Gate")
    if critical >= 0 and ship_gate >= 0 and critical > ship_gate:
        fail(errors, "Critical Directive must appear before the final Ship Gate")
    if ship_gate >= 0 and text[ship_gate:].count("\n## "):
        fail(errors, "Ship Gate must be the final level-two section")


def required_structure(errors: list[str]) -> None:
    required = [
        "references/research/topic.md",
        "references/research/research-plan.md",
        "references/research/distilled-highlevel-ai-studio.md",
        "references/product-selector.md",
        "references/ai-studio-project-brief.md",
        "references/prompt-patterns.md",
        "references/publish-qa-checklist.md",
        "references/pricing-access-snapshot.md",
        "references/troubleshooting-matrix.md",
        "examples/ai-studio-lead-capture-worked-example.md",
        "examples/routing-boundary-tests.md",
        "guides/01-choose-the-right-highlevel-ai-surface.md",
        "guides/02-plan-and-prompt-ai-studio.md",
        "guides/03-edit-debug-and-version.md",
        "guides/04-connect-forms-calendars-and-workflows.md",
        "guides/05-publish-domains-seo-and-reuse.md",
        "guides/06-use-adjacent-content-and-site-builders.md",
        "guides/07-troubleshoot-access-usage-and-state.md",
    ]
    for relative in required:
        if not (ROOT / relative).is_file():
            fail(errors, f"missing required file: {relative}")


def raw_archive(errors: list[str]) -> None:
    files = sorted(RAW.glob("*.md")) if RAW.is_dir() else []
    if len(files) < 20:
        fail(errors, f"raw archive has {len(files)} files; expected at least 20")

    header_fields = (
        "- URL:",
        "- Fetched:",
        "- Visible source date:",
        "- Source type:",
        "- Research window:",
        "- Status:",
    )
    for path in files:
        text = path.read_text(encoding="utf-8")
        head = "\n".join(text.splitlines()[:14])
        for field in header_fields:
            if field not in head:
                fail(errors, f"{path.name} is missing provenance field {field}")
        source_date = re.search(r"^- Visible source date:\s*(\d{4}-\d{2}-\d{2})", head, re.MULTILINE)
        if not source_date:
            continue
        parsed = date.fromisoformat(source_date.group(1))
        if not WINDOW_START <= parsed <= WINDOW_END:
            fail(errors, f"{path.name} source date is outside the research window")

    distilled = ROOT / "references" / "research" / "distilled-highlevel-ai-studio.md"
    if distilled.is_file():
        text = distilled.read_text(encoding="utf-8")
        citations = set(re.findall(r"\[raw/([^\]]+\.md)\]", text))
        names = {path.name for path in files}
        for missing in sorted(citations - names):
            fail(errors, f"distillation cites missing raw file: {missing}")
        for uncited in sorted(names - citations):
            fail(errors, f"raw file is absent from the distillation ledger: {uncited}")


def authored_prose(errors: list[str]) -> None:
    placeholder = re.compile(r"\{\{|\{(?:stinger|bee|topic|placeholder)[^}]*\}")
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in {".md", ".py"}:
            continue
        relative = path.relative_to(ROOT)
        if relative.parts[:3] == ("references", "research", "raw"):
            continue
        text = path.read_text(encoding="utf-8")
        if "\u2013" in text or "\u2014" in text:
            fail(errors, f"authored file contains an en or em dash: {relative}")
        if "!" + "`" in text:
            fail(errors, f"authored file contains non-portable shell injection: {relative}")
        if placeholder.search(text):
            fail(errors, f"authored file contains an unresolved template placeholder: {relative}")


def local_links(errors: list[str]) -> None:
    link_pattern = re.compile(r"\[[^\]]+\]\(([^)]+)\)")
    for path in ROOT.rglob("*.md"):
        if RAW in path.parents:
            continue
        text = path.read_text(encoding="utf-8")
        for target in link_pattern.findall(text):
            target = target.strip().split("#", 1)[0]
            if not target or target.startswith(("http://", "https://", "mailto:")):
                continue
            resolved = (path.parent / target).resolve()
            if not resolved.exists():
                fail(errors, f"broken local link in {path.relative_to(ROOT)}: {target}")


def main() -> int:
    errors: list[str] = []
    root_frontmatter(errors)
    required_structure(errors)
    raw_archive(errors)
    authored_prose(errors)
    local_links(errors)

    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        print(f"FAIL: {len(errors)} error(s)")
        return 1

    raw_count = len(list(RAW.glob("*.md")))
    guide_count = len(list((ROOT / "guides").glob("*.md")))
    print(
        "PASS: HighLevel AI Studio Stinger package "
        f"({raw_count} raw sources, {guide_count} guides)"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
