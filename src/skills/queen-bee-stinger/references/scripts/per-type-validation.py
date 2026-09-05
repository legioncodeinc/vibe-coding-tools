#!/usr/bin/env python3
"""
per-type-validation.py -- Project Hive (queen-bee-stinger)

Validates a skill, agent, rule, command, plugin, or AGENTS.md file/folder
against the frontmatter and packaging rules documented for four harnesses:
Claude Code, Cursor, ChatGPT Codex, and Claude Cowork.

Grounding (raw research, see references/research/raw/):
  claude-code--skills--agentskills-io-spec.md          (spec-six frontmatter)
  claude-code--skills--skills-official-docs.md          (CC skill extensions)
  claude-code--agents--sub-agents-official-docs.md      (CC agent frontmatter)
  claude-code--plugins--plugins-official-docs.md        (plugin layout)
  claude-code--plugins--plugins-reference-official-docs.md
  cowork--skills--support-create-custom-skills.md       (Cowork skill caps)
  cowork--skills--code-claude-docs-skills.md
  cowork--plugins--claude-docs-cowork-guide-plugins.md  (Cowork plugin limits)
  cursor--rules--cursor-docs-rules.md                   (.mdc rule files)
  cursor--rules--techsy-mdc-frontmatter.md
  cursor--agents--subagents-docs.md                     (Cursor agent fields)
  codex--rules--agents-md-standard.md                   (AGENTS.md spec)
  codex--rules--agents-md-hierarchy-community.md

This script is stdlib-only. PyYAML is used when present; otherwise a small
built-in frontmatter parser is used (see parse_simple_yaml below). That
fallback parser only understands flat "key: value" pairs, inline
"[a, b, c]" lists, and indented "- item" block lists. It does not handle
nested mappings, multi-line scalars, anchors, or quoted-with-colons edge
cases. Treat it as good-enough for skill/agent/rule frontmatter, not a
general YAML parser.

No network access. Output is deterministic and ASCII-safe.
"""

import argparse
import json
import os
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

try:
    import yaml  # type: ignore
    HAVE_YAML = True
except ImportError:
    HAVE_YAML = False


# ---------------------------------------------------------------------------
# Constants grounded in the research facts
# ---------------------------------------------------------------------------

SPEC_SIX = {"name", "description", "license", "compatibility", "metadata", "allowed-tools"}

CC_SKILL_EXTENSIONS = {
    "when_to_use", "argument-hint", "arguments", "disable-model-invocation",
    "user-invocable", "disallowed-tools", "model", "effort", "context",
    "agent", "background", "hooks", "paths", "shell",
}

CURSOR_SKILL_EXTENSIONS = {"paths", "disable-model-invocation", "globs"}

COWORK_NAME_MAX = 64
COWORK_DESC_OFFICIAL_MAX = 200
COWORK_DESC_COMMUNITY_MAX = 1024

KEBAB_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
AGENT_NAME_RE = re.compile(r"^[a-z]+(-[a-z]+)*$")
PLUGIN_NAME_RE = re.compile(r"^[a-z0-9]([a-z0-9-]*[a-z0-9])?$")
RESERVED_WORDS = ("claude", "anthropic")
INJECTION_RE = re.compile(r"!`[^`]*`")

AGENT_REQUIRED = {"name", "description"}
AGENT_OPTIONAL = {
    "tools", "disallowedTools", "model", "permissionMode", "maxTurns",
    "skills", "mcpServers", "hooks", "memory", "background", "effort",
    "isolation", "color", "initialPrompt",
}
AGENT_PLUGIN_IGNORED = {"hooks", "mcpServers", "permissionMode"}
AGENT_COLOR_ENUM = {"red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"}
AGENT_MEMORY_ENUM = {"user", "project", "local"}
AGENT_ISOLATION_ENUM = {"worktree"}

CURSOR_AGENT_FIELDS = {"name", "description", "model", "readonly", "is_background"}

CURSOR_RULE_FIELDS = {"description", "globs", "alwaysApply"}

PLUGIN_COMPONENT_NAMES = {
    "skills", "commands", "agents", "hooks", ".mcp.json", ".lsp.json",
    "bin", "settings.json",
}

COWORK_PLUGIN_MAX_BYTES = 200 * 1024 * 1024
COWORK_PLUGIN_MAX_FILES = 5000
COWORK_WARN_RATIO = 0.8

AGENTS_MD_WARN_BYTES = 32 * 1024

HARNESS_CHOICES = ["claude-code", "cursor", "codex", "cowork", "all"]
TYPE_CHOICES = ["skill", "agent", "rule", "command", "plugin", "agents-md"]


# ---------------------------------------------------------------------------
# Findings
# ---------------------------------------------------------------------------

@dataclass
class Finding:
    severity: str  # ERROR, WARN, INFO
    label: str
    message: str


@dataclass
class Report:
    findings: list = field(default_factory=list)

    def add(self, severity, label, message):
        self.findings.append(Finding(severity, label, message))

    def error_count(self):
        return sum(1 for f in self.findings if f.severity == "ERROR")

    def warn_count(self):
        return sum(1 for f in self.findings if f.severity == "WARN")

    def info_count(self):
        return sum(1 for f in self.findings if f.severity == "INFO")


# ---------------------------------------------------------------------------
# Frontmatter parsing
# ---------------------------------------------------------------------------

def extract_frontmatter(text):
    """Return (raw_frontmatter_text_or_None, body_text)."""
    if not text.startswith("---"):
        return None, text
    lines = text.split("\n")
    if lines[0].strip() != "---":
        return None, text
    end_idx = None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            end_idx = i
            break
    if end_idx is None:
        return None, text
    fm_text = "\n".join(lines[1:end_idx])
    body = "\n".join(lines[end_idx + 1:])
    return fm_text, body


def _strip_quotes(value):
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in ("'", '"'):
        return value[1:-1]
    return value


def parse_simple_yaml(text):
    """Minimal flat frontmatter parser used when PyYAML is unavailable.

    Supports: "key: value", "key:" followed by indented "- item" lines,
    and inline "key: [a, b, c]" lists. Does not support nested maps,
    multi-line scalars, anchors, or tags.
    """
    data = {}
    current_key = None
    for raw_line in text.split("\n"):
        if not raw_line.strip() or raw_line.strip().startswith("#"):
            continue
        if raw_line[0] in (" ", "\t"):
            stripped = raw_line.strip()
            if stripped.startswith("- ") and current_key is not None:
                item = _strip_quotes(stripped[2:])
                if not isinstance(data.get(current_key), list):
                    data[current_key] = []
                data[current_key].append(item)
            continue
        if ":" in raw_line:
            key, _, rest = raw_line.partition(":")
            key = key.strip()
            rest = rest.strip()
            current_key = key
            if rest == "":
                data[key] = None
            elif rest.startswith("[") and rest.endswith("]"):
                inner = rest[1:-1].strip()
                data[key] = [_strip_quotes(x.strip()) for x in inner.split(",") if x.strip()] if inner else []
            else:
                val = _strip_quotes(rest)
                low = val.lower()
                if low in ("true", "yes", "on"):
                    data[key] = True
                elif low in ("false", "no", "off"):
                    data[key] = False
                else:
                    data[key] = val
    return data


def parse_frontmatter(fm_text):
    if fm_text is None:
        return {}
    if HAVE_YAML:
        try:
            data = yaml.safe_load(fm_text)
            return data if isinstance(data, dict) else {}
        except Exception:
            return parse_simple_yaml(fm_text)
    return parse_simple_yaml(fm_text)


def read_text(path):
    try:
        return path.read_text(encoding="utf-8"), None
    except OSError as exc:
        return None, str(exc)


def rel_label(root, target):
    try:
        base = root if root.is_dir() else root.parent
        return str(target.relative_to(base)).replace(os.sep, "/")
    except ValueError:
        return str(target).replace(os.sep, "/")


# ---------------------------------------------------------------------------
# Skill validation
# ---------------------------------------------------------------------------

def resolve_skill_md(path):
    if path.is_file():
        return path
    return path / "SKILL.md"


def is_placeholder(value):
    """Unfilled Hive template values look like {this}. Report them as INFO
    instead of failing format checks that only apply to real values."""
    return isinstance(value, str) and "{" in value and "}" in value


def validate_skill(root, harnesses, target, report):
    skill_md = resolve_skill_md(root)
    if not skill_md.is_file():
        report.add("ERROR", rel_label(root, skill_md), "SKILL.md not found")
        return

    text, err = read_text(skill_md)
    if text is None:
        report.add("ERROR", rel_label(root, skill_md), "could not read file: %s" % err)
        return

    label = rel_label(root, skill_md)
    fm_text, body = extract_frontmatter(text)
    if fm_text is None:
        report.add("ERROR", label, "no YAML frontmatter found (SKILL.md must start with '---')")
        fm = {}
    else:
        fm = parse_frontmatter(fm_text)

    name = fm.get("name")
    description = fm.get("description")

    if description is None:
        report.add("WARN", label, "no description field; needed for auto-invocation in every harness")
    elif is_placeholder(description):
        report.add("INFO", label, "description is an unfilled template placeholder; fill it before shipping")
    elif isinstance(description, str):
        dlen = len(description)
        if "cowork" in harnesses:
            if dlen > COWORK_DESC_COMMUNITY_MAX:
                report.add("ERROR", label, "description is %d chars, community ceiling is %d" % (dlen, COWORK_DESC_COMMUNITY_MAX))
            elif dlen > COWORK_DESC_OFFICIAL_MAX:
                report.add("WARN", label, "description is %d chars, Cowork official cap is %d" % (dlen, COWORK_DESC_OFFICIAL_MAX))

    if is_placeholder(name):
        report.add("INFO", label, "name is an unfilled template placeholder; fill it before shipping")
    if isinstance(name, str) and not is_placeholder(name) and "cowork" in harnesses:
        if len(name) > COWORK_NAME_MAX:
            report.add("ERROR", label, "name is %d chars, Cowork cap is %d" % (len(name), COWORK_NAME_MAX))
        if not KEBAB_RE.match(name):
            report.add("ERROR", label, "name '%s' is not kebab-case" % name)
        lname = name.lower()
        for word in RESERVED_WORDS:
            if word in lname:
                report.add("ERROR", label, "name '%s' contains reserved word '%s'" % (name, word))

    if isinstance(name, str) and not is_placeholder(name) and "cursor" in harnesses:
        parent_name = root.name if root.is_dir() else root.parent.name
        if name != parent_name:
            report.add("ERROR", label, "frontmatter name '%s' does not match parent folder name '%s' (Cursor rule)" % (name, parent_name))

    if fm_text is not None and ("<" in fm_text or ">" in fm_text) and "cowork" in harnesses:
        report.add("ERROR", label, "frontmatter contains an XML angle bracket ('<' or '>'); not allowed for Cowork upload")

    if "cowork" in harnesses and INJECTION_RE.search(body):
        report.add("WARN", label, "dynamic injection line(s) '!`command`' found; these do not execute in Cowork")

    check_unknown_fields(fm, harnesses, label, report, kind="skill")


COMMAND_FIELDS = {"description", "argument-hint", "allowed-tools", "model", "name", "disable-model-invocation"}


def check_unknown_fields(fm, harnesses, label, report, kind):
    # Commands are not uploaded as standalone skills, so the Agent Skills
    # spec-six restriction does not apply to them. They carry their own
    # documented field set (argument-hint, allowed-tools, model).
    if kind == "command":
        for key in fm:
            if key not in COMMAND_FIELDS:
                report.add("WARN", label, "field '%s' is not a recognized command frontmatter field" % key)
        return

    if "cowork" in harnesses:
        for key in fm:
            if key not in SPEC_SIX:
                report.add("ERROR", label, "field '%s' is outside the spec-six frontmatter fields; hard error on Cowork/claude.ai upload" % key)

    if "claude-code" in harnesses:
        allowed = SPEC_SIX | CC_SKILL_EXTENSIONS
        for key in fm:
            if key not in allowed:
                report.add("WARN", label, "field '%s' is not spec-six or a known Claude Code extension field" % key)

    if "cursor" in harnesses:
        allowed = SPEC_SIX | CURSOR_SKILL_EXTENSIONS
        for key in fm:
            if key not in allowed:
                report.add("WARN", label, "field '%s' is not spec-six or a known Cursor extension field" % key)

    if "codex" in harnesses:
        for key in fm:
            if key not in SPEC_SIX:
                report.add("WARN", label, "field '%s' is not in spec-six; Codex %s extension fields are not fully documented in research, verify manually" % (key, kind))


# ---------------------------------------------------------------------------
# Agent validation
# ---------------------------------------------------------------------------

def validate_agent(root, harnesses, target, report):
    agent_md = root if root.is_file() else None
    if agent_md is None:
        report.add("ERROR", rel_label(root, root), "expected a single agent markdown file, got a directory")
        return

    text, err = read_text(agent_md)
    if text is None:
        report.add("ERROR", rel_label(root, agent_md), "could not read file: %s" % err)
        return

    label = rel_label(root, agent_md)
    fm_text, _ = extract_frontmatter(text)
    if fm_text is None:
        report.add("ERROR", label, "no YAML frontmatter found")
        fm = {}
    else:
        fm = parse_frontmatter(fm_text)

    if "claude-code" in harnesses or "cowork" in harnesses:
        for req in AGENT_REQUIRED:
            if not fm.get(req):
                report.add("ERROR", label, "missing required field '%s'" % req)

        name = fm.get("name")
        if isinstance(name, str):
            if ":" in name:
                report.add("ERROR", label, "name '%s' contains ':' which is reserved for plugin scoping" % name)
            elif not AGENT_NAME_RE.match(name):
                report.add("ERROR", label, "name '%s' must use only lowercase letters and hyphens" % name)

        allowed = AGENT_REQUIRED | AGENT_OPTIONAL
        for key in fm:
            if key not in allowed:
                report.add("WARN", label, "field '%s' is not a recognized Claude Code agent field" % key)

        color = fm.get("color")
        if color is not None and color not in AGENT_COLOR_ENUM:
            report.add("ERROR", label, "color '%s' is not one of %s" % (color, sorted(AGENT_COLOR_ENUM)))

        memory = fm.get("memory")
        if memory is not None and memory not in AGENT_MEMORY_ENUM:
            report.add("ERROR", label, "memory '%s' is not one of %s" % (memory, sorted(AGENT_MEMORY_ENUM)))

        isolation = fm.get("isolation")
        if isolation is not None and isolation not in AGENT_ISOLATION_ENUM:
            report.add("ERROR", label, "isolation '%s' is not one of %s" % (isolation, sorted(AGENT_ISOLATION_ENUM)))

        if target == "plugin":
            for key in AGENT_PLUGIN_IGNORED:
                if key in fm:
                    report.add("WARN", label, "field '%s' is ignored for plugin-packaged agents (--target plugin)" % key)

    if "cursor" in harnesses:
        for key in fm:
            if key not in CURSOR_AGENT_FIELDS:
                report.add("WARN", label, "field '%s' is not a recognized Cursor agent field (name, description, model, readonly, is_background)" % key)
        if not fm.get("name"):
            report.add("ERROR", label, "missing required field 'name' (Cursor)")
        if not fm.get("description"):
            report.add("ERROR", label, "missing required field 'description' (Cursor)")

    if "codex" in harnesses:
        report.add("INFO", label, "Codex does not document a custom agent-frontmatter spec in the research; skipping field checks")


# ---------------------------------------------------------------------------
# Rule validation
# ---------------------------------------------------------------------------

def validate_rule(root, harnesses, report):
    if root.is_dir():
        report.add("ERROR", rel_label(root, root), "expected a single rule file, got a directory")
        return
    label = rel_label(root, root)
    text, err = read_text(root)
    if text is None:
        report.add("ERROR", label, "could not read file: %s" % err)
        return

    fm_text, _ = extract_frontmatter(text)
    fm = parse_frontmatter(fm_text) if fm_text else {}

    if "cursor" in harnesses:
        if root.suffix != ".mdc":
            report.add("ERROR", label, "Cursor rules must use .mdc extension inside .cursor/rules/; plain .md is silently ignored")
        for key in fm:
            if key not in CURSOR_RULE_FIELDS:
                report.add("WARN", label, "field '%s' is not a recognized Cursor rule field (description, globs, alwaysApply)" % key)
        globs = fm.get("globs")
        if globs is not None and not isinstance(globs, (str, list)):
            report.add("ERROR", label, "globs must be a string or a list")
        always_apply = fm.get("alwaysApply")
        if always_apply is not None and not isinstance(always_apply, bool):
            report.add("WARN", label, "alwaysApply should be a boolean")

    if "claude-code" in harnesses:
        if fm_text is not None:
            for key in fm:
                if key != "paths":
                    report.add("WARN", label, "field '%s' is not the documented 'paths' rule field for .claude/rules/" % key)

    if "codex" in harnesses or "cowork" in harnesses:
        report.add("INFO", label, "no dedicated rule-file frontmatter spec documented for this harness in research; skipped")


# ---------------------------------------------------------------------------
# Command validation (reduced skill-style checks; commands are flat files)
# ---------------------------------------------------------------------------

def validate_command(root, harnesses, report):
    if root.is_dir():
        report.add("ERROR", rel_label(root, root), "expected a single command file, got a directory")
        return
    label = rel_label(root, root)
    text, err = read_text(root)
    if text is None:
        report.add("ERROR", label, "could not read file: %s" % err)
        return

    fm_text, body = extract_frontmatter(text)
    if fm_text is None:
        report.add("INFO", label, "no frontmatter found; treated as a legacy plain-markdown command (allowed)")
        return
    fm = parse_frontmatter(fm_text)
    check_unknown_fields(fm, harnesses, label, report, kind="command")
    if "cowork" in harnesses and ("<" in fm_text or ">" in fm_text):
        report.add("ERROR", label, "frontmatter contains an XML angle bracket ('<' or '>'); not allowed for Cowork upload")
    if "cowork" in harnesses and INJECTION_RE.search(body):
        report.add("WARN", label, "dynamic injection line(s) '!`command`' found; these do not execute in Cowork")


# ---------------------------------------------------------------------------
# Plugin validation
# ---------------------------------------------------------------------------

def validate_plugin(root, harnesses, report):
    if not root.is_dir():
        report.add("ERROR", rel_label(root, root), "plugin target must be a directory")
        return

    manifest_dir = root / ".claude-plugin"
    manifest = manifest_dir / "plugin.json"
    label = rel_label(root, manifest)

    if not manifest.is_file():
        report.add("ERROR", rel_label(root, manifest_dir), ".claude-plugin/plugin.json not found")
        return

    text, err = read_text(manifest)
    if text is None:
        report.add("ERROR", label, "could not read plugin.json: %s" % err)
        return

    try:
        data = json.loads(text)
    except json.JSONDecodeError as exc:
        report.add("ERROR", label, "plugin.json does not parse as JSON: %s" % exc)
        return

    name = data.get("name")
    if not name:
        report.add("ERROR", label, "missing required field 'name'")
    elif is_placeholder(name):
        report.add("INFO", label, "name is an unfilled template placeholder; fill it before shipping")
    elif not PLUGIN_NAME_RE.match(name):
        report.add("ERROR", label, "name '%s' must be kebab-case with alphanumeric start and end" % name)

    if manifest_dir.is_dir():
        for entry in manifest_dir.iterdir():
            if entry.name != "plugin.json":
                report.add("ERROR", rel_label(root, entry), "only plugin.json may live inside .claude-plugin/; found '%s'" % entry.name)
                if entry.name in PLUGIN_COMPONENT_NAMES:
                    report.add("WARN", rel_label(root, entry), "component '%s' looks nested inside .claude-plugin/; it belongs at the plugin root" % entry.name)

    author = data.get("author")
    if author is not None and not isinstance(author, dict):
        report.add("WARN", label, "author should be an object, e.g. {\"name\": \"...\"}")

    if "cowork" in harnesses:
        total_bytes = 0
        total_files = 0
        for path in root.rglob("*"):
            if path.is_file():
                total_files += 1
                try:
                    total_bytes += path.stat().st_size
                except OSError:
                    pass
        size_label = rel_label(root, root)
        if total_bytes > COWORK_PLUGIN_MAX_BYTES:
            report.add("ERROR", size_label, "plugin is %.1f MB uncompressed, Cowork limit is 200 MB" % (total_bytes / (1024 * 1024)))
        elif total_bytes > COWORK_PLUGIN_MAX_BYTES * COWORK_WARN_RATIO:
            report.add("WARN", size_label, "plugin is %.1f MB uncompressed, approaching the 200 MB Cowork limit" % (total_bytes / (1024 * 1024)))
        if total_files > COWORK_PLUGIN_MAX_FILES:
            report.add("ERROR", size_label, "plugin has %d files, Cowork limit is %d" % (total_files, COWORK_PLUGIN_MAX_FILES))
        elif total_files > COWORK_PLUGIN_MAX_FILES * COWORK_WARN_RATIO:
            report.add("WARN", size_label, "plugin has %d files, approaching the %d file Cowork limit" % (total_files, COWORK_PLUGIN_MAX_FILES))

        skills_dir = root / "skills"
        if skills_dir.is_dir():
            for skill_folder in sorted(p for p in skills_dir.iterdir() if p.is_dir()):
                validate_skill(skill_folder, {"cowork"}, "plugin", report)


# ---------------------------------------------------------------------------
# AGENTS.md validation
# ---------------------------------------------------------------------------

def validate_agents_md(root, report):
    target = root if root.is_file() else root / "AGENTS.md"
    label = rel_label(root, target)

    if target.name != "AGENTS.md":
        report.add("ERROR", label, "filename must be exactly 'AGENTS.md'")

    if not target.is_file():
        report.add("ERROR", label, "file not found")
        return

    try:
        size = target.stat().st_size
    except OSError as exc:
        report.add("ERROR", label, "could not stat file: %s" % exc)
        return

    if size > AGENTS_MD_WARN_BYTES:
        report.add("WARN", label, "AGENTS.md is %d bytes, over the conservative 32 KiB warning threshold (some tooling documents a 64 KiB limit instead)" % size)

    text, err = read_text(target)
    if text is None:
        report.add("ERROR", label, "could not read file: %s" % err)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def resolve_harnesses(harness_arg):
    if harness_arg == "all":
        return {"claude-code", "cursor", "codex", "cowork"}
    return {harness_arg}


def print_human_report(report, path_arg):
    for f in report.findings:
        print("%s %s: %s" % (f.severity, f.label, f.message))
    print("Summary: %d error(s), %d warning(s), %d info(s) for %s" % (
        report.error_count(), report.warn_count(), report.info_count(), path_arg))


def print_json_report(report, path_arg, exit_code):
    payload = {
        "path": path_arg,
        "findings": [
            {"severity": f.severity, "label": f.label, "message": f.message}
            for f in report.findings
        ],
        "summary": {
            "errors": report.error_count(),
            "warnings": report.warn_count(),
            "infos": report.info_count(),
        },
        "exit_code": exit_code,
    }
    print(json.dumps(payload, indent=2, sort_keys=True))


def main(argv=None):
    parser = argparse.ArgumentParser(description="Validate a skill, agent, rule, command, plugin, or AGENTS.md against Agent Skills / Claude Code / Cursor / Codex / Cowork rules.")
    parser.add_argument("path", help="file or folder to validate")
    parser.add_argument("--type", required=True, choices=TYPE_CHOICES)
    parser.add_argument("--harness", default="all", choices=HARNESS_CHOICES)
    parser.add_argument("--target", default="standalone", choices=["standalone", "plugin"])
    parser.add_argument("--json", action="store_true", dest="as_json")
    args = parser.parse_args(argv)

    root = Path(args.path).resolve()
    if not root.exists():
        sys.stderr.write("error: path does not exist: %s\n" % args.path)
        return 2

    harnesses = resolve_harnesses(args.harness)
    report = Report()

    try:
        if args.type == "skill":
            validate_skill(root, harnesses, args.target, report)
        elif args.type == "agent":
            validate_agent(root, harnesses, args.target, report)
        elif args.type == "rule":
            validate_rule(root, harnesses, report)
        elif args.type == "command":
            validate_command(root, harnesses, report)
        elif args.type == "plugin":
            validate_plugin(root, harnesses, report)
        elif args.type == "agents-md":
            validate_agents_md(root, report)
    except OSError as exc:
        sys.stderr.write("error: %s\n" % exc)
        return 2

    exit_code = 1 if report.error_count() > 0 else 0

    if args.as_json:
        print_json_report(report, args.path, exit_code)
    else:
        print_human_report(report, args.path)

    return exit_code


if __name__ == "__main__":
    sys.exit(main())
