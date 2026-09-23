#!/usr/bin/env python3
"""Validate the complete public marketplace tree before a PR or release."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def plugin_rows(root: Path) -> list[tuple[str, str, int, int]]:
    rows = []
    for path in sorted((root / "plugins").iterdir()):
        if not path.is_dir():
            continue
        manifest = path / ".claude-plugin" / "plugin.json"
        if not manifest.is_file():
            continue
        metadata = json.loads(manifest.read_text(encoding="utf-8"))
        skills = sum(1 for skill in (path / "skills").glob("*/SKILL.md") if skill.is_file())
        drones = sum(1 for drone in (path / "agents").glob("*-wasp-drone.md") if drone.is_file())
        rows.append((path.name, metadata["version"], skills, drones))
    return rows


def readme_errors(readme: str, root: Path, version: str) -> list[str]:
    errors = []
    required = {
        "Wasp Nest title": "# The Wasp Nest",
        "Wasp Nest hero": 'src="assets/the-wasp-nest.jpg"',
        "OSPRY brand panel": '<img alt="OSPRY"',
        "OSPRY mention": "https://www.ospry.ai",
        "Legion footer logo": 'alt="Legion Code Inc. symbol"',
        "Legion footer line": "We are Legion. Vibe with Legion.",
        "Claude install": "/plugin marketplace add legioncodeinc/vibe-coding-tools",
        "Codex install": "codex plugin marketplace add legioncodeinc/vibe-coding-tools",
        "Get Started": "## Start here",
        "problem statement": "## The problem this fixes",
        "Library explanation": "## The Library is the workbench",
        "coding process": "## From request to reviewed code",
        "command selection": "## What to call",
        "PRD execution command": "/smoke-it",
        "scoped routing command": "/pest-controller",
        "human-only notes boundary": "library/notes/",
        "component explanation": "## The parts, in plain English",
        "contribution path": "## Learn and build on it",
        "complete component roster": "[complete plugin catalog](learn/reference/PLUGIN-CATALOG.md)",
        "AGPL license": "AGPL-3.0-or-later",
        "pack catalog": "## What ships",
        "accepted contract": "CTR-###",
    }
    for label, fragment in required.items():
        if fragment not in readme:
            errors.append(f"public README is missing {label}")
    if readme.count("```mermaid") < 2:
        errors.append("public README needs at least two Mermaid diagrams")
    if readme.count("https://img.shields.io/") < 3:
        errors.append("public README needs three live status badges")
    if "{{" in readme or "}}" in readme:
        errors.append("public README has an unresolved template marker")
    if re.search(r"git clone[^\n]*the-wasp-nest-source|\./install\.sh|the-beekeeper|the-smoker", readme, re.I):
        errors.append("public README contains a private-source or retired Hive instruction")
    if not (root / "assets" / "the-wasp-nest.jpg").is_file():
        errors.append("public hero asset is missing")
    rows = plugin_rows(root)
    if not rows:
        errors.append("public plugin catalog is empty")
    else:
        summary = f"**{sum(row[3] for row in rows)} specialist Drones, {sum(row[2] for row in rows)} Stingers, commands, hooks, and rules across {len(rows)} installable plugins.**"
        if summary not in readme:
            errors.append("public README summary does not match built plugin counts")
        for name, pack_version, skills, drones in rows:
            fragment = f"| [{name}](plugins/{name}/README.md) | {pack_version} | {skills} | {drones} |"
            if fragment not in readme:
                errors.append(f"public README catalog does not match {name}")
    if f"Marketplace release **v{version}**" not in readme:
        errors.append("public README version does not match VERSION")
    guides = root / "learn" / "guides"
    if not (guides / "GETTING-STARTED.md").is_file():
        errors.append("public getting-started guide is missing")
    for page in (root / "learn").rglob("*.md"):
        content = page.read_text(encoding="utf-8")
        if re.search(r"git clone[^\n]*the-wasp-nest-source|\./install\.sh|https://github\.com/legioncodeinc/the-wasp-nest-source", content):
            errors.append(f"public learning page {page.relative_to(root / 'learn')} points to the private source installer")
    return errors


def manifest_errors(root: Path) -> list[str]:
    manifest_path = root / "PUBLICATION-MANIFEST.json"
    if not manifest_path.is_file():
        return ["publication manifest is missing"]
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    actual = {
        path.relative_to(root).as_posix(): hashlib.sha256(path.read_bytes()).hexdigest()
        for path in root.rglob("*")
        if path.is_file() and path != manifest_path and ".git" not in path.relative_to(root).parts
    }
    errors = [] if manifest.get("files") == actual else ["publication manifest does not match the staged file tree"]
    if any("/research/raw/" in name or "/node_modules/" in name for name in actual):
        errors.append("publication contains raw research or node_modules")
    model_prefix = "plugins/wasp-nest-core/skills/natural-photography-stinger/models/"
    if any(name.startswith(model_prefix) and not name.startswith(model_prefix + "model-template/")
           and name not in {model_prefix + "README.md", model_prefix + "MODELS-LIST.md"} for name in actual):
        errors.append("publication contains an ingested model record")
    return errors


def catalog_errors(root: Path) -> list[str]:
    path = root / "learn" / "reference" / "PLUGIN-CATALOG.md"
    if not path.is_file():
        return ["complete public plugin catalog is missing"]
    content = path.read_text(encoding="utf-8")
    errors = []
    for name, _, _, _ in plugin_rows(root):
        plugin = root / "plugins" / name
        for skill in (plugin / "skills").glob("*/SKILL.md"):
            if f"../../plugins/{name}/skills/{skill.parent.name}/SKILL.md" not in content:
                errors.append(f"public catalog omits Stinger {name}/{skill.parent.name}")
        for drone in (plugin / "agents").glob("*-wasp-drone.md"):
            if f"../../plugins/{name}/agents/{drone.name}" not in content:
                errors.append(f"public catalog omits Drone {name}/{drone.stem}")
    return errors


def core_learning_errors(root: Path) -> list[str]:
    public_learn = root / "learn"
    core_learn = root / "plugins" / "wasp-nest-core" / "learn"
    errors = []
    if (root / "plugins" / "wasp-nest-core" / "docs").exists():
        errors.append("core plugin learning material must live under learn/, not a second docs/ folder")
    for page in public_learn.rglob("*.md"):
        relative = page.relative_to(public_learn)
        if not (core_learn / relative).is_file():
            errors.append(f"core plugin learning page is missing: {relative}")
    guide = core_learn / "guides" / "GETTING-STARTED.md"
    if not guide.is_file():
        errors.append("core plugin getting-started guide is missing")
    for page in core_learn.rglob("*.md"):
        content = page.read_text(encoding="utf-8")
        if re.search(r"git clone[^\n]*the-wasp-nest-source|\./install\.sh|https://github\.com/legioncodeinc/the-wasp-nest-source", content):
            errors.append(f"core plugin learning page {page.relative_to(core_learn)} points to the private source installer")
    return errors


def instruction_template_errors(root: Path) -> list[str]:
    errors = []
    for path in (
        root / "AGENTS_template.md",
        root / "plugins" / "wasp-nest-core" / "templates" / "AGENTS_template.md",
    ):
        if not path.is_file():
            errors.append(f"public instruction template is missing: {path.relative_to(root)}")
            continue
        content = path.read_text(encoding="utf-8").lower()
        if any(claim in content for claim in (
            "federal government", "model guards", "compliance teams",
            "certified operator", "authorized operator", "system level directive", "authority",
        )):
            errors.append(f"public instruction template claims elevated authority: {path.relative_to(root)}")
    return errors


def validate(root: Path) -> list[str]:
    root = root.resolve()
    version = (root / "VERSION").read_text(encoding="utf-8").strip()
    readme = (root / "README.md").read_text(encoding="utf-8")
    errors = readme_errors(readme, root, version)
    if (root / "docs").exists():
        errors.append("public learning material must live under learn/, not a separate docs/ folder")
    required_guides = (
        "DRONES.md", "STINGERS.md", "COMMANDS.md", "RULES.md", "HOOKS.md",
        "LIBRARY-STRUCTURE.md", "WRITE-A-PRD.md", "WRITE-AN-IRD.md", "WRITE-A-CTR.md",
        "AGENTS.md", "SKILLS.md", "PRODUCT-REQUIREMENTS-DOCUMENT.md",
        "PRD-EXECUTION-PROMPT.md", "HARNESS-COMPATIBILITY.md",
    )
    for name in required_guides:
        if not (root / "learn" / "guides" / name).is_file():
            errors.append(f"public learning guide is missing: {name}")
    for relative in ("concepts/WHY-THE-LIBRARY.md", "reference/HARNESS-CAPABILITIES.md", "examples/README.md", "ASSET-CATALOG.md"):
        if not (root / "learn" / relative).is_file():
            errors.append(f"public learning page is missing: {relative}")
    errors.extend(catalog_errors(root))
    errors.extend(core_learning_errors(root))
    errors.extend(instruction_template_errors(root))
    errors.extend(manifest_errors(root))
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT)
    args = parser.parse_args()
    errors = validate(args.root)
    for error in errors:
        print(error)
    if errors:
        return 1
    print("public README, guides, catalog, and publication manifest match the staged tree")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
