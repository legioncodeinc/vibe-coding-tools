#!/usr/bin/env python3
"""Generate Cursor and Codex distributions from the canonical Claude assets.

Run from the repository root. The script deliberately keeps research archives
unchanged while translating active instructions and component metadata.
"""

from __future__ import annotations

import json
import re
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
CLAUDE = ROOT / ".claude"
CURSOR = ROOT / ".cursor"
CODEX = ROOT / ".codex"
AGENTS = ROOT / ".agents"
CODEX_PLUGIN = CODEX / "plugins" / "vibe-coding-tools"


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
        for key in ("model", "tools"):
            if key in fields:
                kept[key] = fields[key]
    frontmatter = "\n".join(
        f"{key}: {json.dumps(value, ensure_ascii=False)}" for key, value in kept.items()
    )
    if harness == "cursor":
        body = body.replace(".claude/", ".cursor/")
    return f"---\n{frontmatter}\n---\n\n{body}"


def copy_tree(source: Path, target: Path) -> None:
    target.mkdir(parents=True, exist_ok=True)
    shutil.copytree(source, target, dirs_exist_ok=True)


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


def translate_active_cursor_files() -> None:
    for folder in (CURSOR / "commands", CURSOR / "agents"):
        for path in folder.rglob("*.md"):
            text = path.read_text(encoding="utf-8")
            path.write_text(text.replace(".claude/", ".cursor/"), encoding="utf-8")
    for path in (CURSOR / "skills").glob("*/SKILL.md"):
        text = path.read_text(encoding="utf-8")
        path.write_text(text.replace(".claude/", ".cursor/"), encoding="utf-8")


def generate_agents() -> None:
    cursor_agents = CURSOR / "agents"
    codex_agents = CODEX / "agents"
    cursor_agents.mkdir(parents=True, exist_ok=True)
    codex_agents.mkdir(parents=True, exist_ok=True)

    for path in sorted((CLAUDE / "agents").glob("*.md")):
        path.write_text(normalized_agent_text(path, "claude"), encoding="utf-8")
        (cursor_agents / path.name).write_text(
            normalized_agent_text(path, "cursor"), encoding="utf-8"
        )
        fields, body = read_agent(path)
        body = body.replace(".claude/skills/", ".agents/skills/").replace(
            "../skills/", ".agents/skills/"
        )
        toml = "\n".join(
            [
                f"name = {json.dumps(fields['name'], ensure_ascii=False)}",
                f"description = {json.dumps(fields['description'], ensure_ascii=False)}",
                f"developer_instructions = {json.dumps(body, ensure_ascii=False)}",
                "",
            ]
        )
        (codex_agents / f"{path.stem}.toml").write_text(toml, encoding="utf-8")


def generate_cursor() -> None:
    for path in (CLAUDE / "skills").glob("*/SKILL.md"):
        normalize_skill_frontmatter(path)
    for name in ("skills", "commands"):
        copy_tree(CLAUDE / name, CURSOR / name)
    copy_tree(CLAUDE / "hooks", CURSOR / "hooks")
    shutil.copy2(CLAUDE / "model-comparison-matrix.md", CURSOR / "model-comparison-matrix.md")
    translate_active_cursor_files()


def generate_codex_skill_tree(target: Path) -> None:
    prior_files = {}
    if target.exists():
        for existing in target.rglob("*"):
            if existing.is_file():
                try:
                    prior_files[existing.relative_to(target)] = existing.read_bytes()
                except OSError:
                    pass
        shutil.rmtree(target)
    copy_tree(CLAUDE / "skills", target)
    text_suffixes = {
        ".css", ".env", ".hcl", ".html", ".ini", ".js", ".json", ".jsx",
        ".md", ".mdc", ".mdx", ".mjs", ".prisma", ".py", ".sh", ".toml",
        ".ts", ".tsx", ".txt", ".yaml", ".yml",
    }
    for path in target.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in text_suffixes:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        normalized = re.sub(r"[ \t]+(?=\r?$)", "", text, flags=re.M)
        prior = prior_files.get(path.relative_to(target))
        if prior is not None:
            try:
                prior_text = prior.decode("utf-8")
            except UnicodeDecodeError:
                prior_text = None
            if prior_text is not None:
                prior_normalized = re.sub(
                    r"[ \t]+(?=\r?$)", "", prior_text, flags=re.M
                )
                if prior_normalized.rstrip("\r\n") == normalized.rstrip("\r\n"):
                    path.write_bytes(prior)
                    continue
        path.write_text(normalized, encoding="utf-8")
    for path in target.glob("*/SKILL.md"):
        text = path.read_text(encoding="utf-8")
        text = text.replace(".claude/skills/", "../")
        text = text.replace(
            ".claude/model-comparison-matrix.md", "../../model-comparison-matrix.md"
        )
        path.write_text(text, encoding="utf-8")

    command_skills = {
        "the-beekeeper": CLAUDE / "commands" / "the-beekeeper.md",
        "the-smoker": CLAUDE / "commands" / "the-smoker.md",
    }
    for name, source in command_skills.items():
        command_target = target / name
        command_target.mkdir(parents=True, exist_ok=True)
        command_text = source.read_text(encoding="utf-8")
        match = re.match(r"^---\r?\n.*?\r?\n---\r?\n(.*)$", command_text, re.S)
        body = (match.group(1) if match else command_text).lstrip()
        body = body.replace(".claude/skills/", "../")
        body = body.replace(".claude/model-comparison-matrix.md", "../../model-comparison-matrix.md")
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
        metadata = "\n".join([
            "interface:",
            f'  display_name: "{name}"',
            f'  short_description: "{description}"',
            f'  default_prompt: "Use ${name} for this request."',
            "policy:",
            "  allow_implicit_invocation: false",
            "",
        ])
        metadata_path = command_target / "agents" / "openai.yaml"
        metadata_path.parent.mkdir(parents=True, exist_ok=True)
        metadata_path.write_text(metadata, encoding="utf-8")


def generate_codex_project() -> None:
    copy_tree(CLAUDE / "hooks", CODEX / "hooks")
    generate_codex_skill_tree(AGENTS / "skills")
    shutil.copy2(CLAUDE / "model-comparison-matrix.md", AGENTS / "model-comparison-matrix.md")


def generate_codex_plugin() -> None:
    generate_codex_skill_tree(CODEX_PLUGIN / "skills")
    copy_tree(CLAUDE / "hooks", CODEX_PLUGIN / "hooks")
    shutil.copy2(CLAUDE / "model-comparison-matrix.md", CODEX_PLUGIN / "model-comparison-matrix.md")


def generate_catalog() -> None:
    agents = sorted((CLAUDE / "agents").glob("*.md"))
    skills = sorted(path for path in (CLAUDE / "skills").iterdir() if path.is_dir())
    skill_names = {path.name for path in skills}
    rows = []
    for agent in agents:
        bee = agent.stem
        expected = bee.removesuffix("-worker-bee") + "-stinger"
        if expected not in skill_names:
            expected = "beekeeper-suit" if bee == "beekeeper" else expected
        rows.append(
            f"| [{bee}](../.claude/agents/{agent.name}) | "
            f"[{expected}](../.claude/skills/{expected}/) | "
            f"[TOML](../.codex/agents/{agent.stem}.toml) |"
        )
    utilities = sorted(skill_names - {
        agent.stem.removesuffix("-worker-bee") + "-stinger" for agent in agents
    })
    text = "\n".join([
        "# Asset Catalog",
        "",
        "This file is generated from the canonical `.claude` tree. Do not maintain the roster by hand.",
        "",
        "## Exact manifest",
        "",
        f"- Agents: {len(agents)}",
        f"- Core skills: {len(skills)}",
        "- Commands: 2",
        "- Rules: 4",
        "- Hook behaviors: 2",
        f"- Codex-facing skills: {len(skills) + 2} ({len(skills)} core skills plus 2 command translations)",
        "",
        "## Compatibility ledger",
        "",
        "| Source capability | Claude Code | Codex | Cursor |",
        "|---|---|---|---|",
        f"| {len(agents)} agents | PRESERVE as Markdown | TRANSLATE to TOML project agents | PRESERVE as Markdown |",
        f"| {len(skills)} skills | PRESERVE | PRESERVE in `.agents/skills` and plugin | PRESERVE |",
        "| 2 commands | PRESERVE | TRANSLATE to explicit skills in both Codex layers | PRESERVE |",
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
        *[f"- [{name}](../.claude/skills/{name}/)" for name in utilities],
        "",
        "Regenerate with `python learn/scripts/generate-harnesses.py`.",
        "",
    ])
    (ROOT / "learn" / "ASSET-CATALOG.md").write_text(text, encoding="utf-8")


def main() -> None:
    if not CLAUDE.is_dir():
        raise SystemExit("Run this script from a Vibe Coding Tools checkout.")
    generate_cursor()
    generate_agents()
    generate_codex_project()
    generate_codex_plugin()
    generate_catalog()
    print("Generated Cursor mirror, Codex agents, repository skills, and plugin skills.")


if __name__ == "__main__":
    main()
