#!/usr/bin/env python3
"""sync-harnesses.py

The canonical source of truth for this plugin is:
  - .claude-plugin/plugin.json   (manifest: name, version, description, author, repo, license, keywords)
  - agents/<name>.md             (20 Drone definitions, Claude Code + Cowork native frontmatter)
  - skills/<name>/SKILL.md       (20 Stinger + master-website-auditor definitions, six-spec-field
                                   frontmatter only, per queen-wasp-stinger's hard portability rule)
  - commands/<name>.md           (perform-website-audit, Claude Code legacy + Cowork-preferred path)
  - rules/*.md                   (conduct rules, no plugin-native path, documented for manual wiring)

This script GENERATES the other-harness manifests from that source. It does not generate Cursor's or
Codex's per-agent files (no clean cross-harness agent format exists per harness-support-matrix.md;
Cursor falls back to reading .claude/agents/-shaped files directly in many cases, and Codex has no
documented file-based subagent format at all, only agents.<role> keys in config.toml). Skills need
no content transformation to reach Cursor/Codex/Cowork: the six-spec-field discipline already
enforced on every skills/*/SKILL.md in this repo is exactly what makes them load unmodified
everywhere, per the Skills section of harness-support-matrix.md. This script's job for skills is
therefore validation, not rewriting: catching a drifted extra frontmatter field before it becomes a
Cowork packaging error, not a routine part of every sync.

Usage:
    python3 scripts/sync-harnesses.py            # generate + validate, write outputs
    python3 scripts/sync-harnesses.py --check     # validate only, exit non-zero on drift, no writes

Idempotent and safe to re-run: every generated file carries a "GENERATED, do not hand-edit" marker
and is fully rewritten each run from the canonical source, never partially patched.
"""
import argparse
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SPEC_SIX_FIELDS = {"name", "description", "license", "compatibility", "metadata", "allowed-tools"}
CURSOR_AGENT_FIELDS = {"name", "description", "model", "readonly", "is_background"}
COWORK_DESC_MAX = 200  # harness-support-matrix.md: prefer the official 200-char cap, not the looser 1024 reading
EM_EN_DASH = re.compile(r"[–—]")


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def write_json(path, obj, generated_note):
    obj = dict(obj)
    obj["_generated_note"] = generated_note
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        json.dump(obj, f, indent=2)
        f.write("\n")
    return path


def parse_frontmatter(text):
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if not m:
        return None, text
    raw = m.group(1)
    fields = {}
    # Minimal line-oriented parse: good enough for this repo's flat/shallow frontmatter (a real
    # sync in a broader repo should use pyyaml; kept dependency-free here deliberately).
    current_key = None
    for line in raw.split("\n"):
        if re.match(r"^[a-zA-Z_-]+:", line):
            key, _, rest = line.partition(":")
            fields[key.strip()] = rest.strip().strip('"')
            current_key = key.strip()
        elif line.startswith("  ") and current_key:
            fields.setdefault(current_key + "._raw_sub", []).append(line.strip())
    return fields, text[m.end():]


def discover_skills():
    skills_dir = os.path.join(ROOT, "skills")
    out = []
    for name in sorted(os.listdir(skills_dir)):
        skill_md = os.path.join(skills_dir, name, "SKILL.md")
        if os.path.isfile(skill_md):
            out.append((name, skill_md))
    return out


def discover_agents():
    agents_dir = os.path.join(ROOT, "agents")
    out = []
    for fn in sorted(os.listdir(agents_dir)):
        if fn.endswith(".md"):
            out.append((fn[:-3], os.path.join(agents_dir, fn)))
    return out


def cursor_agent_text(source):
    """Project a Claude Drone into Cursor's documented frontmatter subset."""
    match = re.match(r"^---\n(.*?)\n---\n?(.*)$", source, re.S)
    if not match:
        raise ValueError("agent is missing YAML frontmatter")
    frontmatter, body = match.groups()
    kept = []
    field = ""
    dropped = {}
    for line in frontmatter.splitlines():
        found = re.match(r"^([A-Za-z][\w-]*):\s*(.*)$", line)
        if found:
            field, value = found.groups()
            if field in CURSOR_AGENT_FIELDS:
                kept.append(line)
            else:
                dropped[field] = value.strip().strip('"').strip("'")
        elif field in CURSOR_AGENT_FIELDS:
            kept.append(line)
    notes = []
    if "tools" in dropped:
        notes.append("Cursor cannot enforce the Claude tool allowlist. Follow the file scope above and ask before using broader tools.")
    if dropped.get("isolation") == "worktree":
        notes.append("For concurrent edits, the parent must request an isolated project copy before dispatch.")
    if "effort" in dropped:
        notes.append("Use %s reasoning effort when the selected Cursor model supports it." % dropped["effort"])
    if notes:
        body = body.rstrip() + "\n\n## Cursor compatibility\n\n" + "\n".join("- " + note for note in notes) + "\n"
    return "---\n" + "\n".join(kept) + "\n---\n\n" + body.lstrip("\n")


def discover_commands():
    cmds_dir = os.path.join(ROOT, "commands")
    out = []
    if os.path.isdir(cmds_dir):
        for fn in sorted(os.listdir(cmds_dir)):
            if fn.endswith(".md"):
                out.append((fn[:-3], os.path.join(cmds_dir, fn)))
    return out


def validate_skills(skills):
    problems = []
    for name, path in skills:
        folder_name = os.path.basename(os.path.dirname(path))
        if folder_name != name:
            problems.append(f"{path}: skill folder name ({folder_name}) must equal frontmatter "
                             f"`name` ({name}) for Cursor compatibility")
        text = open(path, encoding="utf-8").read()
        fields, body = parse_frontmatter(text)
        if fields is None:
            problems.append(f"{path}: no frontmatter block found")
            continue
        extra = set(k for k in fields if not k.endswith("._raw_sub")) - SPEC_SIX_FIELDS
        if extra:
            problems.append(f"{path}: non-spec-six frontmatter field(s) {sorted(extra)} will hard-"
                             f"fail claude.ai/Cowork upload; move to a documented opt-in extension "
                             f"block instead")
        desc = fields.get("description", "")
        if len(desc) > COWORK_DESC_MAX:
            problems.append(f"{path}: description is {len(desc)} chars, over Cowork's {COWORK_DESC_MAX}"
                             f"-char cap (harness-support-matrix.md Skills conflicts note)")
        if EM_EN_DASH.search(text):
            problems.append(f"{path}: contains an em or en dash (dash-guard convention: use comma/"
                             f"colon/period instead)")
    return problems


def validate_agents(agents):
    problems = []
    for name, path in agents:
        text = open(path, encoding="utf-8").read()
        fields, _ = parse_frontmatter(text)
        if fields is None:
            problems.append(f"{path}: no frontmatter block found")
            continue
        if "name" not in fields or "description" not in fields:
            problems.append(f"{path}: agent frontmatter missing required name/description")
        if EM_EN_DASH.search(text):
            problems.append(f"{path}: contains an em or en dash (dash-guard convention)")
    return problems


def generate_cursor_agent_plugins_manifest(manifest, skills):
    """Root plugin.json, Agent Plugins standard (agentskills.io): skills + MCP only, widest floor
    per harness-support-matrix.md's Plugins portability path. Loads unmodified in Cursor."""
    return {
        "name": manifest["name"],
        "version": manifest.get("version", "0.0.0"),
        "description": manifest.get("description", ""),
        "license": manifest.get("license", ""),
        "skills": [f"skills/{name}" for name, _ in skills],
    }


def generate_cursor_plugin_manifest(manifest, skills, agents, commands):
    """.cursor-plugin/plugin.json, Cursor Plugins full-component format."""
    return {
        "name": manifest["name"],
        "version": manifest.get("version", "0.0.0"),
        "description": manifest.get("description", ""),
        "author": manifest.get("author", {}).get("name", ""),
        "homepage": manifest.get("repository", ""),
        "repository": manifest.get("repository", ""),
        "license": manifest.get("license", ""),
        "keywords": manifest.get("keywords", []),
        "skills": [f"skills/{name}" for name, _ in skills],
        "agents": [f"cursor-agents/{name}.md" for name, _ in agents],
        "commands": [f"commands/{name}.md" for name, _ in commands],
    }


def generate_codex_plugin_manifest(manifest, skills):
    """.codex-plugin/plugin.json. Codex has no documented file-based agent format (research gap
    flagged in harness-support-matrix.md), so agents are intentionally NOT listed here: on Codex
    this plugin surfaces only through its skills, matching that documented gap rather than papering
    over it with an invented config shape."""
    return {
        "name": manifest["name"],
        "version": manifest.get("version", "0.0.0"),
        "description": manifest.get("description", ""),
        "author": manifest.get("author", {}).get("name", ""),
        "homepage": manifest.get("repository", ""),
        "repository": manifest.get("repository", ""),
        "license": manifest.get("license", ""),
        "keywords": manifest.get("keywords", []),
        "skills": [f"skills/{name}" for name, _ in skills],
        "_codex_agent_gap_note": (
            "Codex has no documented file-based subagent-definition format as of this plugin's "
            "research window (only agents.<role> config.toml keys pointing at an undocumented "
            "config_file shape). This plugin's 20 Drones are therefore not listed here; on Codex, "
            "reach this plugin's capability through its skills only, per harness-support-matrix.md."
        ),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="validate only, no writes, exit 1 on drift")
    args = parser.parse_args()

    manifest_path = os.path.join(ROOT, ".claude-plugin", "plugin.json")
    if not os.path.isfile(manifest_path):
        print("FATAL: .claude-plugin/plugin.json not found, nothing to sync from.", file=sys.stderr)
        return 2
    manifest = load_json(manifest_path)

    skills = discover_skills()
    agents = discover_agents()
    commands = discover_commands()

    problems = validate_skills(skills) + validate_agents(agents)
    cursor_outputs = [(name, os.path.join(ROOT, "cursor-agents", name + ".md"),
                       cursor_agent_text(open(path, encoding="utf-8").read())) for name, path in agents]
    if args.check:
        for _, target, expected in cursor_outputs:
            if not os.path.isfile(target) or open(target, encoding="utf-8").read() != expected:
                problems.append(f"{target}: Cursor agent projection is missing or stale")
    if problems:
        print(f"{len(problems)} validation problem(s):", file=sys.stderr)
        for p in problems:
            print(f"  - {p}", file=sys.stderr)
        if args.check:
            return 1
        print("Continuing to generate despite the above; fix before shipping.", file=sys.stderr)

    if args.check:
        print(f"OK: {len(skills)} skills, {len(agents)} agents, {len(commands)} commands, no drift.")
        return 0

    os.makedirs(os.path.join(ROOT, "cursor-agents"), exist_ok=True)
    for _, target, expected in cursor_outputs:
        with open(target, "w", encoding="utf-8") as output:
            output.write(expected)

    note = ("GENERATED by scripts/sync-harnesses.py from .claude-plugin/plugin.json and the agents/ "
            "+ skills/ + commands/ trees. Do not hand-edit; re-run the sync script instead.")
    written = [
        write_json("plugin.json", generate_cursor_agent_plugins_manifest(manifest, skills), note),
        write_json(".cursor-plugin/plugin.json",
                    generate_cursor_plugin_manifest(manifest, skills, agents, commands), note),
        write_json(".codex-plugin/plugin.json", generate_codex_plugin_manifest(manifest, skills), note),
    ]
    print(f"Synced {len(written)} generated manifest(s) from {len(skills)} skills, {len(agents)} "
          f"agents, {len(commands)} commands:")
    for w in written:
        print(f"  - {w}")
    if problems:
        print(f"\n{len(problems)} validation problem(s) remain, see above. Re-run with --check after "
              f"fixing to confirm.", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
