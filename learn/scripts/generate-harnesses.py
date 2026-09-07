#!/usr/bin/env python3
"""Generate Cursor and Codex distributions from the canonical source package.

Run from the repository root. The script deliberately keeps research archives
unchanged while translating active instructions and component metadata.
"""

from __future__ import annotations

import json
import re
import shutil
import stat
import tempfile
from collections.abc import Callable
from pathlib import Path
from uuid import uuid4


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "src"
# Keep the established helper name because src/ retains the Claude-shaped
# agents/, skills/, commands/, hooks/, and model-comparison-matrix.md layout.
CLAUDE = SOURCE
CURSOR = ROOT / ".cursor"
CODEX = ROOT / ".codex"
AGENTS = ROOT / ".agents"
CODEX_PLUGIN = CODEX / "plugins" / "vibe-coding-tools"
CODEX_COMMAND_TRANSLATIONS = {
    "the-beekeeper": "beekeeper.md",
    "the-smoker": "smoke-it.md",
}


def require_repo_path(path: Path, label: str) -> None:
    try:
        path.resolve(strict=False).relative_to(ROOT.resolve())
    except ValueError as error:
        raise ValueError(f"Refusing {label} outside repository: {path}") from error


def require_link_free_tree(path: Path, label: str) -> None:
    require_repo_path(path, label)
    for candidate in (path, *path.rglob("*")):
        if candidate.is_symlink():
            raise ValueError(f"Refusing symlink in {label}: {candidate}")
        require_repo_path(candidate, label)


def remove_generated_path(path: Path) -> None:
    if path.is_symlink() or path.is_file():
        path.unlink(missing_ok=True)
    elif path.exists():
        shutil.rmtree(path)


def replace_generated_directory(
    target: Path, populate: Callable[[Path], None]
) -> None:
    """Build a generated directory beside its target, then swap it into place."""
    require_repo_path(target, "generated target")
    if target.is_symlink():
        raise ValueError(f"Refusing symlink as generated target: {target}")
    target.parent.mkdir(parents=True, exist_ok=True)
    staging = Path(
        tempfile.mkdtemp(prefix=f".{target.name}.staging-", dir=target.parent)
    )
    backup = target.with_name(f".{target.name}.backup-{uuid4().hex}")
    target_moved = False
    try:
        populate(staging)
        if target.exists() or target.is_symlink():
            target.replace(backup)
            target_moved = True
        try:
            staging.replace(target)
        except BaseException as swap_error:
            if target_moved:
                try:
                    backup.replace(target)
                except BaseException as rollback_error:
                    raise RuntimeError(
                        f"Could not install generated directory {target}. "
                        f"The prior tree remains at {backup}. "
                        f"Rollback also failed: {rollback_error}"
                    ) from swap_error
            raise
        if target_moved:
            remove_generated_path(backup)
    finally:
        remove_generated_path(staging)


def read_agent(path: Path) -> tuple[dict[str, str], str]:
    text = path.read_text(encoding="utf-8")
    match = re.match(r"^---\r?\n(.*?)\r?\n---\r?\n(.*)$", text, re.S)
    if not match:
        raise ValueError(f"Missing YAML frontmatter: {path}")
    fields: dict[str, str] = {}
    for line in match.group(1).splitlines():
        if ":" not in line or line[:1].isspace():
            continue
        key, value = line.split(":", 1)
        raw = value.strip()
        if raw.startswith('"'):
            try:
                raw = json.loads(raw)
            except json.JSONDecodeError:
                raw = raw.strip('"')
        fields[key.strip()] = raw
    return fields, match.group(2).strip() + "\n"


def normalized_agent_text(path: Path, harness: str) -> str:
    fields, body = read_agent(path)
    kept = {
        "name": fields["name"],
        "description": fields["description"],
    }
    if harness == "claude":
        for key in ("model", "tools", "isolation"):
            if key in fields:
                kept[key] = fields[key]
    frontmatter = "\n".join(
        f"{key}: {json.dumps(value, ensure_ascii=False)}" for key, value in kept.items()
    )
    if harness == "cursor":
        body = body.replace(".claude/", ".cursor/")
    return f"---\n{frontmatter}\n---\n\n{body}"


def codex_agent_text(path: Path) -> str:
    fields, body = read_agent(path)
    body = body.replace(".claude/skills/", ".agents/skills/").replace(
        "../skills/", ".agents/skills/"
    )
    return "\n".join(
        [
            f"name = {json.dumps(fields['name'], ensure_ascii=False)}",
            f"description = {json.dumps(fields['description'], ensure_ascii=False)}",
            f"developer_instructions = {json.dumps(body, ensure_ascii=False)}",
            "",
        ]
    )


def copy_tree(source: Path, target: Path) -> None:
    require_link_free_tree(source, "canonical source tree")
    require_repo_path(target, "generated copy target")
    if target.exists() or target.is_symlink():
        require_link_free_tree(target, "generated copy target")
    target.mkdir(parents=True, exist_ok=True)
    shutil.copytree(source, target, dirs_exist_ok=True, symlinks=True)
    require_link_free_tree(target, "generated copy target")


def normalize_skill_frontmatter(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    match = re.match(r"^---\r?\n(.*?)\r?\n---\r?\n(.*)$", text, re.S)
    if not match:
        raise ValueError(f"Missing YAML frontmatter: {path}")
    lines = match.group(1).splitlines()
    normalized = []
    for line in lines:
        field = re.match(r"^(name|description):\s*(.*)$", line)
        if field and field.group(2) not in {"|", "|-", ">", ">-", ""}:
            raw = field.group(2).strip()
            if raw.startswith('"'):
                try:
                    value = json.loads(raw)
                except json.JSONDecodeError:
                    value = raw.strip('"')
            else:
                value = raw
            normalized.append(
                f"{field.group(1)}: {json.dumps(value, ensure_ascii=False)}"
            )
        else:
            normalized.append(line)
    frontmatter = "\n".join(normalized)
    path.write_text(f"---\n{frontmatter}\n---\n{match.group(2)}", encoding="utf-8")


def generate_agents() -> None:
    cursor_agents = CURSOR / "agents"
    codex_agents = CODEX / "agents"
    repository_agents = AGENTS / "agents"
    agents = sorted((CLAUDE / "agents").glob("*.md"))
    native_codex_agents = sorted((CLAUDE / "agents").glob("*.toml"))

    def populate_markdown_agents(target: Path, harness: str) -> None:
        for path in agents:
            (target / path.name).write_text(
                normalized_agent_text(path, harness), encoding="utf-8"
            )

    replace_generated_directory(
        cursor_agents, lambda target: populate_markdown_agents(target, "cursor")
    )

    def populate_repository_agents(target: Path) -> None:
        for path in agents:
            shutil.copy2(path, target / path.name)

    replace_generated_directory(repository_agents, populate_repository_agents)

    def populate_codex_agents(target: Path) -> None:
        generated_names = {f"{path.stem}.toml" for path in agents}
        for path in agents:
            (target / f"{path.stem}.toml").write_text(
                codex_agent_text(path), encoding="utf-8"
            )
        for path in native_codex_agents:
            if path.name in generated_names:
                raise ValueError(
                    f"Native Codex agent conflicts with generated agent: {path.name}"
                )
            require_plain_template_path(path, "native Codex agent source")
            text = path.read_text(encoding="utf-8").replace(
                "../skills/", ".agents/skills/"
            )
            (target / path.name).write_text(text, encoding="utf-8")

    replace_generated_directory(codex_agents, populate_codex_agents)


def generate_cursor() -> None:
    def populate_skills(target: Path) -> None:
        copy_tree(CLAUDE / "skills", target)
        for path in target.glob("*/SKILL.md"):
            normalize_skill_frontmatter(path)
            text = path.read_text(encoding="utf-8")
            path.write_text(
                text.replace(".claude/", ".cursor/"), encoding="utf-8"
            )

    def populate_commands(target: Path) -> None:
        copy_tree(CLAUDE / "commands", target)
        for path in target.rglob("*.md"):
            text = path.read_text(encoding="utf-8")
            path.write_text(
                text.replace(".claude/", ".cursor/"), encoding="utf-8"
            )

    replace_generated_directory(CURSOR / "skills", populate_skills)
    replace_generated_directory(CURSOR / "commands", populate_commands)
    copy_tree(CLAUDE / "hooks", CURSOR / "hooks")
    shutil.copy2(CLAUDE / "model-comparison-matrix.md", CURSOR / "model-comparison-matrix.md")


def generate_codex_skill_tree(target: Path) -> None:
    prior_files: dict[Path, bytes] = {}
    if target.exists():
        for existing in target.rglob("*"):
            if existing.is_file():
                try:
                    prior_files[existing.relative_to(target)] = existing.read_bytes()
                except OSError:
                    pass

    def normalize_newlines(text: str) -> str:
        return text.replace("\r\n", "\n").replace("\r", "\n")

    def normalize_text(text: str) -> str:
        return re.sub(r"[ \t]+(?=$)", "", normalize_newlines(text), flags=re.M)

    def populate(staging: Path) -> None:
        copy_tree(CLAUDE / "skills", staging)
        text_suffixes = {
            ".css",
            ".env",
            ".hcl",
            ".html",
            ".ini",
            ".js",
            ".json",
            ".jsx",
            ".md",
            ".mdc",
            ".mdx",
            ".mjs",
            ".prisma",
            ".py",
            ".sh",
            ".toml",
            ".ts",
            ".tsx",
            ".txt",
            ".yaml",
            ".yml",
        }
        for path in staging.rglob("*"):
            if not path.is_file() or path.suffix.lower() not in text_suffixes:
                continue
            try:
                text = path.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                continue
            path.write_text(normalize_text(text), encoding="utf-8")
        for path in staging.glob("*/SKILL.md"):
            normalize_skill_frontmatter(path)
            text = path.read_text(encoding="utf-8")
            text = text.replace(".claude/skills/", "../")
            text = text.replace(
                ".claude/model-comparison-matrix.md",
                "../../model-comparison-matrix.md",
            )
            path.write_text(text, encoding="utf-8")

        for name, source_name in CODEX_COMMAND_TRANSLATIONS.items():
            source = CLAUDE / "commands" / source_name
            command_target = staging / name
            command_target.mkdir(parents=True, exist_ok=True)
            command_text = source.read_text(encoding="utf-8")
            match = re.match(r"^---\r?\n.*?\r?\n---\r?\n(.*)$", command_text, re.S)
            body = (match.group(1) if match else command_text).lstrip()
            body = body.replace(".claude/skills/", "../")
            body = body.replace(
                ".claude/model-comparison-matrix.md",
                "../../model-comparison-matrix.md",
            )
            body = body.replace("Cursor-specific", "harness-specific")
            description = (
                "Route a request to the right specialist Bee and its paired Stinger."
                if name == "the-beekeeper"
                else "Run the repository delivery pipeline from planning through verified review."
            )
            (command_target / "SKILL.md").write_text(
                f"---\nname: {name}\ndescription: {description}\n---\n\n{body}",
                encoding="utf-8",
            )
            metadata = "\n".join(
                [
                    "interface:",
                    f'  display_name: "{name}"',
                    f'  short_description: "{description}"',
                    f'  default_prompt: "Use ${name} for this request."',
                    "policy:",
                    "  allow_implicit_invocation: false",
                    "",
                ]
            )
            metadata_path = command_target / "agents" / "openai.yaml"
            metadata_path.parent.mkdir(parents=True, exist_ok=True)
            metadata_path.write_text(metadata, encoding="utf-8")

        for path in staging.rglob("*"):
            if not path.is_file() or path.suffix.lower() not in text_suffixes:
                continue
            prior = prior_files.get(path.relative_to(staging))
            if prior is None:
                continue
            try:
                prior_text = prior.decode("utf-8")
                generated_text = path.read_bytes().decode("utf-8")
            except UnicodeDecodeError:
                continue
            if normalize_text(prior_text).rstrip("\n") == normalize_text(
                generated_text
            ).rstrip("\n"):
                path.write_bytes(prior)

    replace_generated_directory(target, populate)


def generate_codex_project() -> None:
    copy_tree(CLAUDE / "hooks", CODEX / "hooks")
    generate_codex_skill_tree(AGENTS / "skills")
    shutil.copy2(CLAUDE / "model-comparison-matrix.md", AGENTS / "model-comparison-matrix.md")


def generate_codex_plugin() -> None:
    generate_codex_skill_tree(CODEX_PLUGIN / "skills")
    copy_tree(CLAUDE / "hooks", CODEX_PLUGIN / "hooks")
    shutil.copy2(CLAUDE / "model-comparison-matrix.md", CODEX_PLUGIN / "model-comparison-matrix.md")


def require_plain_template_path(path: Path, label: str) -> None:
    """Reject links and Windows reparse points along a template path."""
    require_repo_path(path, label)
    root = ROOT.absolute()
    candidate = path.absolute()
    try:
        candidate.relative_to(root)
    except ValueError as error:
        raise ValueError(f"Refusing {label} outside repository: {path}") from error
    while True:
        try:
            metadata = candidate.lstat()
        except FileNotFoundError:
            pass
        else:
            reparse_point = getattr(metadata, "st_file_attributes", 0) & getattr(
                stat, "FILE_ATTRIBUTE_REPARSE_POINT", 0x400
            )
            if stat.S_ISLNK(metadata.st_mode) or reparse_point:
                raise ValueError(f"Refusing link or reparse point in {label}: {candidate}")
        if candidate == root:
            break
        candidate = candidate.parent


def generate_source_templates() -> None:
    """Materialize optional harness entry points from their source templates."""
    templates = (
        (SOURCE / "harnesses" / "claude" / "CLAUDE.md", ROOT / "CLAUDE.md"),
        (
            SOURCE / "harnesses" / "codex" / "marketplace.json",
            AGENTS / "plugins" / "marketplace.json",
        ),
    )
    for source, target in templates:
        require_plain_template_path(source, "harness source template")
        if not source.exists():
            continue
        require_plain_template_path(target, "generated harness entry point")
        target.parent.mkdir(parents=True, exist_ok=True)
        require_plain_template_path(target, "generated harness entry point")
        shutil.copy2(source, target)


def generate_catalog() -> None:
    agents = sorted((CLAUDE / "agents").glob("*.md"))
    native_codex_agents = sorted((CLAUDE / "agents").glob("*.toml"))
    skills = sorted(
        path
        for path in (CLAUDE / "skills").iterdir()
        if path.is_dir() and (path / "SKILL.md").is_file()
    )
    commands = sorted((CLAUDE / "commands").glob("*.md"))
    agent_count = len(agents) + len(native_codex_agents)
    core_skill_count = len(skills)
    command_count = len(commands)
    command_translation_count = len(CODEX_COMMAND_TRANSLATIONS)
    codex_skill_count = core_skill_count + command_translation_count
    skill_names = {path.name for path in skills}
    rows = []
    for agent in agents:
        bee = agent.stem
        expected = bee.removesuffix("-worker-bee") + "-stinger"
        if expected not in skill_names:
            expected = "beekeeper-suit" if bee == "beekeeper" else expected
        rows.append(
            f"| [{bee}](../src/agents/{agent.name}) | "
            f"[{expected}](../src/skills/{expected}/) | "
            f"`.codex/agents/{agent.stem}.toml` (generated) |"
        )
    for agent in native_codex_agents:
        bee = agent.stem
        expected = bee.removesuffix("-worker-bee") + "-stinger"
        rows.append(
            f"| [{bee}](../src/agents/{agent.name}) | "
            f"[{expected}](../src/skills/{expected}/) | "
            "Native TOML source; skill paths adapted on generation |"
        )
    paired_skills = {
        agent.stem.removesuffix("-worker-bee") + "-stinger"
        for agent in (*agents, *native_codex_agents)
    }
    utilities = sorted(skill_names - paired_skills)
    text = "\n".join([
        "# Asset Catalog",
        "",
        "This file is generated from the canonical `src/` source package. Do not maintain the roster by hand.",
        "",
        "## Exact manifest",
        "",
        (
            f"- Agents: {agent_count} "
            f"({len(agents)} portable Markdown plus "
            f"{len(native_codex_agents)} Codex-native TOML)"
        ),
        f"- Core skills: {core_skill_count}",
        (
            f"- Commands: {command_count} "
            f"({command_translation_count} translated into Codex-facing skills)"
        ),
        "- Rules: 4",
        "- Hook behaviors: 2",
        (
            f"- Codex-facing skills: {codex_skill_count} "
            f"({core_skill_count} core skills plus "
            f"{command_translation_count} command translations)"
        ),
        "",
        "## Compatibility ledger",
        "",
        "| Source capability | Claude Code | Codex | Cursor |",
        "|---|---|---|---|",
        (
            f"| {agent_count} agents | PRESERVE {len(agents)} portable Markdown agents | "
            f"TRANSLATE {len(agents)} Markdown agents; PRESERVE "
            f"{len(native_codex_agents)} native TOML agent | "
            f"PRESERVE {len(agents)} portable Markdown agents |"
        ),
        f"| {core_skill_count} skills | PRESERVE | PRESERVE in `.agents/skills` and plugin | PRESERVE |",
        f"| {command_count} commands | PRESERVE | TRANSLATE {command_translation_count} to explicit skills in both Codex layers | PRESERVE |",
        "| 4 rules | TRANSLATE to Claude rules and CLAUDE.md | TRANSLATE to project instructions | PRESERVE as MDC |",
        "| 2 hooks | PRESERVE | TRANSLATE patch input, preserve outcomes | TRANSLATE event and output schema |",
        "",
        "No capability is intentionally dropped.",
        "",
        "## Bee and Stinger pairs",
        "",
        "| Bee | Paired Stinger | Codex agent |",
        "|---|---|---|",
        *rows,
        "",
        "## Utility skills",
        "",
        *[f"- [{name}](../src/skills/{name}/)" for name in utilities],
        "",
        "Regenerate with `python learn/scripts/generate-harnesses.py`.",
        "",
    ])
    (ROOT / "learn" / "ASSET-CATALOG.md").write_text(text, encoding="utf-8")


def main() -> None:
    if not SOURCE.is_dir():
        raise SystemExit("Run this script from a Vibe Coding Tools checkout with src/ available.")
    generate_source_templates()
    generate_cursor()
    generate_agents()
    generate_codex_project()
    generate_codex_plugin()
    generate_catalog()
    print("Generated Cursor mirror, Codex agents, repository skills, and plugin skills.")


if __name__ == "__main__":
    main()
