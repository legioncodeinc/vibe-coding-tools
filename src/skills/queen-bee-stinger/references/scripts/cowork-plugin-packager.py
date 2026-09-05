#!/usr/bin/env python3
"""
cowork-plugin-packager.py -- Project Hive (queen-bee-stinger)

Validates a Claude Code / Cowork plugin folder and, on a clean pass (or
with --force), zips it into a distributable archive with the plugin
folder itself as the zip root entry.

Grounding (raw research, see references/research/raw/):
  claude-code--plugins--plugins-official-docs.md       (.claude-plugin/
                                                          plugin.json is the
                                                          only thing inside
                                                          .claude-plugin/;
                                                          components at root)
  claude-code--plugins--plugins-reference-official-docs.md
  cowork--plugins--claude-docs-cowork-guide-plugins.md  (200 MB / 5000 file
                                                          Cowork limits)
  cowork--skills--support-create-custom-skills.md       (Cowork skill caps,
                                                          reused per skill)

This script is stdlib-only and self-contained: it does not import
per-type-validation.py or cowork-skill-packager.py, per project
requirements. The Cowork skill checks below are a minimal duplicate of
the same logic that lives in cowork-skill-packager.py.

PyYAML is used when present; otherwise a small built-in frontmatter
parser is used (see parse_simple_yaml below), which only understands
flat "key: value" pairs and simple lists -- not full YAML.

No network access. Deterministic output, ASCII-safe.
"""

import argparse
import json
import re
import sys
import zipfile
from pathlib import Path

try:
    import yaml  # type: ignore
    HAVE_YAML = True
except ImportError:
    HAVE_YAML = False


SPEC_SIX = {"name", "description", "license", "compatibility", "metadata", "allowed-tools"}
SKILL_NAME_MAX = 64
DESC_OFFICIAL_MAX = 200
DESC_COMMUNITY_MAX = 1024
KEBAB_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
RESERVED_WORDS = ("claude", "anthropic")
INJECTION_RE = re.compile(r"!`[^`]*`")

PLUGIN_NAME_RE = re.compile(r"^[a-z0-9]([a-z0-9-]*[a-z0-9])?$")
PLUGIN_COMPONENT_NAMES = {"skills", "commands", "agents", "hooks", ".mcp.json", ".lsp.json", "bin", "settings.json"}

COWORK_PLUGIN_MAX_BYTES = 200 * 1024 * 1024
COWORK_PLUGIN_MAX_FILES = 5000
COWORK_WARN_RATIO = 0.8


# ---------------------------------------------------------------------------
# Frontmatter parsing (self-contained; not imported from other scripts)
# ---------------------------------------------------------------------------

def extract_frontmatter(text):
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
    return "\n".join(lines[1:end_idx]), "\n".join(lines[end_idx + 1:])


def _strip_quotes(value):
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in ("'", '"'):
        return value[1:-1]
    return value


def parse_simple_yaml(text):
    """Minimal flat frontmatter parser used when PyYAML is unavailable.

    Supports "key: value", "key:" with indented "- item" lines, and
    inline "key: [a, b]" lists. No nested maps, no multi-line scalars.
    """
    data = {}
    current_key = None
    for raw_line in text.split("\n"):
        if not raw_line.strip() or raw_line.strip().startswith("#"):
            continue
        if raw_line[0] in (" ", "\t"):
            stripped = raw_line.strip()
            if stripped.startswith("- ") and current_key is not None:
                if not isinstance(data.get(current_key), list):
                    data[current_key] = []
                data[current_key].append(_strip_quotes(stripped[2:]))
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


# ---------------------------------------------------------------------------
# Minimal Cowork skill checks (duplicated from cowork-skill-packager.py)
# ---------------------------------------------------------------------------

def check_skill_folder(folder):
    findings = []
    skill_md = folder / "SKILL.md"
    label = "skills/%s/SKILL.md" % folder.name

    if not skill_md.is_file():
        findings.append(("ERROR", "%s: SKILL.md not found" % label))
        return findings

    try:
        text = skill_md.read_text(encoding="utf-8")
    except OSError as exc:
        findings.append(("ERROR", "%s: could not read file: %s" % (label, exc)))
        return findings

    fm_text, body = extract_frontmatter(text)
    if fm_text is None:
        findings.append(("ERROR", "%s: no YAML frontmatter found" % label))
        fm = {}
    else:
        fm = parse_frontmatter(fm_text)

    for key in fm:
        if key not in SPEC_SIX:
            findings.append(("ERROR", "%s: field '%s' is outside the spec-six fields; hard error on Cowork upload" % (label, key)))

    name = fm.get("name")
    if not name:
        findings.append(("ERROR", "%s: frontmatter is missing 'name'" % label))
    elif isinstance(name, str):
        if len(name) > SKILL_NAME_MAX:
            findings.append(("ERROR", "%s: name is %d chars, Cowork cap is %d" % (label, len(name), SKILL_NAME_MAX)))
        if not KEBAB_RE.match(name):
            findings.append(("ERROR", "%s: name '%s' is not kebab-case" % (label, name)))
        lname = name.lower()
        for word in RESERVED_WORDS:
            if word in lname:
                findings.append(("ERROR", "%s: name '%s' contains reserved word '%s'" % (label, name, word)))
        if name != folder.name:
            findings.append(("ERROR", "%s: frontmatter name '%s' does not match folder name '%s'" % (label, name, folder.name)))

    description = fm.get("description")
    if not description:
        findings.append(("WARN", "%s: frontmatter is missing 'description'" % label))
    elif isinstance(description, str):
        dlen = len(description)
        if dlen > DESC_COMMUNITY_MAX:
            findings.append(("ERROR", "%s: description is %d chars, community ceiling is %d" % (label, dlen, DESC_COMMUNITY_MAX)))
        elif dlen > DESC_OFFICIAL_MAX:
            findings.append(("WARN", "%s: description is %d chars, Cowork official cap is %d" % (label, dlen, DESC_OFFICIAL_MAX)))

    if fm_text is not None and ("<" in fm_text or ">" in fm_text):
        findings.append(("ERROR", "%s: frontmatter contains an XML angle bracket ('<' or '>'); not allowed for Cowork upload" % label))

    if INJECTION_RE.search(body):
        findings.append(("WARN", "%s: dynamic injection line(s) '!`command`' found; these do not execute in Cowork" % label))

    return findings


# ---------------------------------------------------------------------------
# Plugin validation
# ---------------------------------------------------------------------------

def validate_plugin_folder(root):
    findings = []

    manifest_dir = root / ".claude-plugin"
    manifest = manifest_dir / "plugin.json"

    if not manifest.is_file():
        findings.append(("ERROR", ".claude-plugin/plugin.json not found"))
        return findings

    try:
        text = manifest.read_text(encoding="utf-8")
    except OSError as exc:
        findings.append(("ERROR", "could not read plugin.json: %s" % exc))
        return findings

    try:
        data = json.loads(text)
    except json.JSONDecodeError as exc:
        findings.append(("ERROR", "plugin.json does not parse as JSON: %s" % exc))
        return findings

    name = data.get("name")
    if not name:
        findings.append(("ERROR", "plugin.json: missing required field 'name'"))
    elif not PLUGIN_NAME_RE.match(name):
        findings.append(("ERROR", "plugin.json: name '%s' must be kebab-case with alphanumeric start and end" % name))

    author = data.get("author")
    if author is not None and not isinstance(author, dict):
        findings.append(("WARN", "plugin.json: author should be an object, e.g. {\"name\": \"...\"}"))

    if manifest_dir.is_dir():
        for entry in sorted(manifest_dir.iterdir()):
            if entry.name != "plugin.json":
                findings.append(("ERROR", ".claude-plugin/%s: only plugin.json may live inside .claude-plugin/" % entry.name))
                if entry.name in PLUGIN_COMPONENT_NAMES:
                    findings.append(("WARN", ".claude-plugin/%s: this component belongs at the plugin root, not inside .claude-plugin/" % entry.name))

    total_bytes = 0
    total_files = 0
    for path in root.rglob("*"):
        if path.is_file():
            total_files += 1
            try:
                total_bytes += path.stat().st_size
            except OSError:
                pass

    if total_bytes > COWORK_PLUGIN_MAX_BYTES:
        findings.append(("ERROR", "plugin is %.1f MB uncompressed, Cowork limit is 200 MB" % (total_bytes / (1024 * 1024))))
    elif total_bytes > COWORK_PLUGIN_MAX_BYTES * COWORK_WARN_RATIO:
        findings.append(("WARN", "plugin is %.1f MB uncompressed, approaching the 200 MB Cowork limit" % (total_bytes / (1024 * 1024))))

    if total_files > COWORK_PLUGIN_MAX_FILES:
        findings.append(("ERROR", "plugin has %d files, Cowork limit is %d" % (total_files, COWORK_PLUGIN_MAX_FILES)))
    elif total_files > COWORK_PLUGIN_MAX_FILES * COWORK_WARN_RATIO:
        findings.append(("WARN", "plugin has %d files, approaching the %d file Cowork limit" % (total_files, COWORK_PLUGIN_MAX_FILES)))

    skills_dir = root / "skills"
    if skills_dir.is_dir():
        for skill_folder in sorted(p for p in skills_dir.iterdir() if p.is_dir()):
            findings.extend(check_skill_folder(skill_folder))

    return findings


def error_count(findings):
    return sum(1 for sev, _ in findings if sev == "ERROR")


# ---------------------------------------------------------------------------
# Packaging
# ---------------------------------------------------------------------------

def package_plugin(folder, output_path):
    with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for path in sorted(folder.rglob("*")):
            if path.is_file():
                arcname = "%s/%s" % (folder.name, path.relative_to(folder).as_posix())
                zf.write(path, arcname)


def main(argv=None):
    parser = argparse.ArgumentParser(description="Validate and package a Cowork/Claude Code plugin archive.")
    parser.add_argument("plugin_folder", help="path to the plugin folder containing .claude-plugin/plugin.json")
    parser.add_argument("-o", "--output", help="output .zip path (default: <plugin-name>.zip in the current directory)")
    parser.add_argument("--force", action="store_true", help="package even if validation reported errors")
    args = parser.parse_args(argv)

    folder = Path(args.plugin_folder)
    if not folder.is_dir():
        sys.stderr.write("error: not a directory: %s\n" % args.plugin_folder)
        return 2

    findings = validate_plugin_folder(folder)

    for sev, msg in findings:
        print("%s %s" % (sev, msg))

    errors = error_count(findings)
    warns = sum(1 for sev, _ in findings if sev == "WARN")
    print("Summary: %d error(s), %d warning(s) for %s" % (errors, warns, folder))

    if errors > 0 and not args.force:
        print("Packaging skipped: fix the errors above or re-run with --force.")
        return 1

    output_path = Path(args.output) if args.output else Path("%s.zip" % folder.name)

    try:
        package_plugin(folder, output_path)
    except OSError as exc:
        sys.stderr.write("error: could not write archive: %s\n" % exc)
        return 2

    print(str(output_path))
    return 1 if errors > 0 else 0


if __name__ == "__main__":
    sys.exit(main())
