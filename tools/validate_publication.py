#!/usr/bin/env python3
"""Validate the complete public marketplace tree before a PR or release."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import tomllib

# A validation run must not add compiled companions to its own manifest tree.
sys.dont_write_bytecode = True
from distribution_contract import (EXPECTED_PLUGINS, CANONICAL_TOTALS, CORE_TOTALS, IMMUTABLE_CORE,
                                   PACK_HOOK_OWNERS, CORE_HOOK_HANDLERS)
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
        skills = sum(1 for skill in (path / "skills").glob("*/SKILL.md") if skill.is_file() and not skill.parent.name.startswith("source-command-"))
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
    model_prefix = "plugins/media-and-creative-tools/skills/natural-photography-stinger/models/"
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


def publication_catalog(root: Path) -> dict:
    return json.loads((root / "plugins" / "wasp-nest-core" / "plugin-catalog.json").read_text())


HOOK_BINDINGS = ("hooks/hooks.json", "hooks/openai-hooks.json", "hooks/claude-hooks.json", "hooks/cursor-hooks.json")


def pack_hook_errors(plugin: Path, name: str, extension: dict) -> list[str]:
    """Refuse hooks in an optional plugin, except one approved pack-owned binding.

    A plugin in PACK_HOOK_OWNERS may carry hooks/hooks.json and its listed handler files and
    nothing else: no manifest hooks field, no second binding, no Core handler, no stray file,
    no link, and every command must run one of its own approved handlers.
    """
    present = [rel for rel in HOOK_BINDINGS if (plugin / rel).exists()]
    handlers = PACK_HOOK_OWNERS.get(name)
    if handlers is None:
        if extension.get("hooks") or present:
            return [f"optional plugin duplicates global lifecycle hooks: {name}"]
        return []
    problem = f"pack-owned hook differs from its approved handlers: {name}"
    if extension.get("hooks") or present != ["hooks/hooks.json"]:
        return [f"{problem}: only hooks/hooks.json may bind, with no manifest hooks field"]
    hooks_dir = plugin / "hooks"
    errors: list[str] = []
    for entry in sorted(hooks_dir.iterdir()):
        if entry.is_symlink() or not entry.is_file():
            errors.append(f"{problem}: {entry.name} is not a regular file")
        elif entry.name in CORE_HOOK_HANDLERS:
            errors.append(f"optional plugin duplicates global lifecycle hooks: {name}/{entry.name}")
        elif entry.name != "hooks.json" and entry.name not in handlers:
            errors.append(f"{problem}: unapproved file {entry.name}")
    for handler in sorted(handlers):
        if not (hooks_dir / handler).is_file():
            errors.append(f"{problem}: missing handler {handler}")
    try:
        events = json.loads((hooks_dir / "hooks.json").read_text(encoding="utf-8"))["hooks"]
        commands = [hook for groups in events.values() for group in groups for hook in group["hooks"]]
    except (OSError, ValueError, KeyError, TypeError, AttributeError):
        return errors + [f"{problem}: hooks.json is not a readable binding"]
    allowed = "|".join(re.escape(handler) for handler in sorted(handlers))
    pattern = re.compile(r'node "\$\{CLAUDE_PLUGIN_ROOT\}/hooks/(?:' + allowed + r')"(?: [A-Za-z]+)?')
    if not commands:
        errors.append(f"{problem}: hooks.json binds nothing")
    for hook in commands:
        command = hook.get("command") if isinstance(hook, dict) else None
        if not isinstance(hook, dict) or hook.get("type") != "command" or not isinstance(command, str) \
                or not pattern.fullmatch(command):
            errors.append(f"{problem}: unapproved command")
            break
    return errors


def marketplace_errors(root: Path) -> list[str]:
    """Check the three native catalogs and forbid retired install aliases."""
    errors: list[str] = []
    actual_plugins = {p.name for p in (root / "plugins").iterdir() if p.is_dir()}
    if actual_plugins != EXPECTED_PLUGINS:
        errors.append(f"public plugin directories must match the approved {len(EXPECTED_PLUGINS)} owners")
    for relative in (".claude-plugin/marketplace.json", ".agents/plugins/marketplace.json",
                     ".cursor-plugin/marketplace.json"):
        path = root / relative
        if not path.is_file():
            errors.append(f"native marketplace is missing: {relative}")
            continue
        data = json.loads(path.read_text())
        names = [entry.get("name") for entry in data.get("plugins", [])]
        if len(names) != len(set(names)) or set(names) != EXPECTED_PLUGINS:
            errors.append(f"native marketplace IDs differ: {relative}")
        for entry in data.get("plugins", []):
            name = entry["name"]
            source = entry.get("source")
            source_path = source.get("path") if isinstance(source, dict) else source
            if source_path != f"./plugins/{name}":
                errors.append(f"native marketplace source differs: {relative}/{name}")
            if relative.startswith(".agents/"):
                policy = {"installation": "INSTALLED_BY_DEFAULT" if name == "wasp-nest-core" else "AVAILABLE",
                          "authentication": "ON_INSTALL"}
                if not isinstance(source, dict) or source.get("source") != "local" or entry.get("policy") != policy:
                    errors.append(f"Codex install policy/source differs: {name}")
                if entry.get("category") != "Productivity":
                    errors.append(f"Codex category differs: {name}")
    return errors


def native_manifest_errors(root: Path) -> list[str]:
    """Validate Claude/Cursor projections and prevent duplicated global hooks."""
    try:
        owners = publication_catalog(root)["plugins"]
    except (OSError, ValueError, KeyError) as error:
        return [f"packaged canonical plugin catalog unavailable: {error}"]
    errors: list[str] = []
    for owner in owners:
        name = owner["name"]
        plugin = root / "plugins" / name
        for harness, agent_dir in (("claude", "agents"), ("cursor", "cursor-agents")):
            file = plugin / f".{harness}-plugin" / "plugin.json"
            if not file.is_file():
                errors.append(f"native plugin manifest is missing: {harness}/{name}")
                continue
            manifest = json.loads(file.read_text())
            if manifest.get("name") != name or not isinstance(manifest.get("author"), dict):
                errors.append(f"native plugin identity/author differs: {harness}/{name}")
            if manifest.get("license") != "AGPL-3.0-or-later":
                errors.append(f"native plugin license differs: {harness}/{name}")
            agents = sorted(f"./{agent_dir}/{a}.md" for a in owner.get("agents", []))
            commands = sorted(f"./commands/{c}.md" for c in owner.get("commands", []))
            if sorted(manifest.get("agents", [])) != agents:
                errors.append(f"native agent owner paths differ: {harness}/{name}")
            if sorted(manifest.get("commands", [])) != commands:
                errors.append(f"native command owner paths differ: {harness}/{name}")
            if harness == "claude" and sorted(manifest.get("dependencies", [])) != sorted(owner.get("requires", [])):
                errors.append(f"Claude native dependencies differ: {name}")
            if harness == "cursor" and "dependencies" in manifest:
                errors.append(f"unsupported Cursor dependency field: {name}")
            if name != "wasp-nest-core" and manifest.get("hooks"):
                errors.append(f"optional plugin duplicates global lifecycle hooks: {harness}/{name}")
            if any(key in manifest for key in ("requires", "mandatory", "optional_workflow_requirements", "compatibility_aliases")):
                errors.append(f"planning fields leaked into native manifest: {harness}/{name}")
            for key in ("skills", "agents", "commands", "rules", "hooks"):
                values = manifest.get(key, [])
                values = [values] if isinstance(values, str) else values
                for value in values:
                    if not isinstance(value, str):
                        errors.append(f"native path type differs: {harness}/{name}/{key}")
                        continue
                    path = plugin / value
                    if not value.startswith("./") or ".." in Path(value).parts or not path.resolve().is_relative_to(plugin.resolve()):
                        errors.append(f"native path escapes plugin: {harness}/{name}/{value}")
                    elif not path.exists():
                        errors.append(f"native path missing: {harness}/{name}/{value}")
    return errors


def catalog_census_errors(root: Path) -> list[str]:
    try:
        data = publication_catalog(root)
    except (OSError, ValueError, KeyError) as error:
        return [f"packaged canonical plugin catalog unavailable: {error}"]
    errors: list[str] = []
    plugins = data["plugins"]
    names = [p["name"] for p in plugins]
    if len(names) != len(set(names)) or set(names) != EXPECTED_PLUGINS:
        errors.append(f"packaged canonical plugin catalog must contain exactly {len(EXPECTED_PLUGINS)} approved owners")
    if set(data.get("immutable_core", [])) != IMMUTABLE_CORE:
        errors.append("packaged immutable Core declarations differ")
    if data.get("compatibility_aliases") or data.get("legacy_aliases"):
        errors.append("retired aliases remain in packaged canonical catalog")
    totals = {kind: 0 for kind in CANONICAL_TOTALS}
    for plugin in plugins:
        counts = {kind: len(plugin.get(kind + "s", [])) for kind in totals}
        for kind in totals:
            totals[kind] += counts[kind]
        if plugin["name"] == "wasp-nest-core" and counts != CORE_TOTALS:
            errors.append("packaged Core census differs")
        if plugin["name"] != "wasp-nest-core" and "wasp-nest-core" not in plugin.get("requires", []):
            errors.append(f"packaged optional plugin does not require Core: {plugin['name']}")
    if totals != CANONICAL_TOTALS:
        errors.append(f"packaged canonical totals differ: {totals}")
    return errors


def codex_plugin_errors(root: Path) -> list[str]:
    marketplace_path = root / ".agents" / "plugins" / "marketplace.json"
    if not marketplace_path.is_file():
        return ["Codex marketplace is missing"]
    try:
        catalog = publication_catalog(root)
        owners = {p["name"]: p for p in catalog["plugins"]}
    except (OSError, ValueError, KeyError) as error:
        return [f"packaged canonical plugin catalog unavailable: {error}"]
    marketplace = json.loads(marketplace_path.read_text())
    errors: list[str] = []
    seen = [e.get("name") for e in marketplace.get("plugins", [])]
    if len(seen) != len(set(seen)) or set(seen) != set(owners):
        errors.append("Codex marketplace IDs differ from canonical catalog")
    for name, owner in owners.items():
        plugin = root / "plugins" / name
        manifest_path = plugin / "plugin.json"
        if not manifest_path.is_file():
            errors.append(f"portable plugin manifest is missing: {name}")
            continue
        manifest = json.loads(manifest_path.read_text())
        if manifest.get("name") != name:
            errors.append(f"Codex marketplace and plugin names differ: {name}")
        if manifest.get("$schema") != "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json":
            errors.append(f"portable plugin schema differs: {name}")
        if not isinstance(manifest.get("author"), dict):
            errors.append(f"portable plugin author is not an object: {name}")
        extension = manifest.get("extensions", {}).get("com.openai")
        if not isinstance(extension, dict) or not isinstance(extension.get("interface"), dict):
            errors.append(f"portable OpenAI extension is missing: {name}")
            extension = {}
        if (plugin / ".codex-plugin").exists():
            errors.append(f"retired Codex overlay remains: {name}")
        source_agents = {p.stem for p in (plugin / "agents").glob("*-wasp-drone.md")}
        roles = {p.stem for p in (plugin / "codex-agents").glob("*-wasp-drone.toml")}
        if source_agents != set(owner.get("agents", [])) or roles != source_agents:
            errors.append(f"Codex native roles differ from canonical Drones: {name}")
        for role in (plugin / "codex-agents").glob("*.toml"):
            try:
                config = tomllib.loads(role.read_text())
                if config.get("name") != role.stem or not all(config.get(k) for k in ("description", "developer_instructions")):
                    errors.append(f"Codex native role fields differ: {name}/{role.name}")
            except tomllib.TOMLDecodeError:
                errors.append(f"Codex native role TOML invalid: {name}/{role.name}")
        expected = {f"source-command-{command}" for command in owner.get("commands", [])}
        wrappers = {p.parent.name for p in (plugin / "skills").glob("source-command-*/SKILL.md")}
        if wrappers != expected:
            errors.append(f"Codex command wrappers differ for {name}: missing={sorted(expected - wrappers)}, extra={sorted(wrappers - expected)}")
        for command in owner.get("commands", []):
            wrapper = plugin / "skills" / f"source-command-{command}" / "SKILL.md"
            procedure = plugin / "commands" / f"{command}.md"
            if not procedure.is_file() or (wrapper.is_file() and f"../../commands/{command}.md" not in wrapper.read_text()):
                errors.append(f"Codex command procedure link differs: {name}/{command}")
        canonical_skills = {p.parent.name for p in (plugin / "skills").glob("*/SKILL.md")
                            if not p.parent.name.startswith("source-command-")}
        if canonical_skills != set(owner.get("skills", [])):
            errors.append(f"packaged canonical skills differ: {name}")
        if name == "wasp-nest-core":
            hook = extension.get("hooks")
            if not isinstance(hook, str) or not hook.startswith("./hooks/") or ".." in Path(hook).parts:
                errors.append("Core OpenAI hook path is invalid")
            elif not (plugin / hook).is_file() or "register-codex-agents.py" not in (plugin / hook).read_text():
                errors.append("Core native agent registration hook is unwired")
            if not (plugin / "hooks" / "register-codex-agents.py").is_file():
                errors.append("Core native agent registration helper is missing")
        else:
            errors.extend(pack_hook_errors(plugin, name, extension))
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
    errors.extend(marketplace_errors(root))
    errors.extend(catalog_census_errors(root))
    errors.extend(native_manifest_errors(root))
    errors.extend(codex_plugin_errors(root))
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
