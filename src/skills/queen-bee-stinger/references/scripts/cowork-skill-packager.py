#!/usr/bin/env python3
"""
cowork-skill-packager.py -- Project Hive (queen-bee-stinger)

Validates a skill folder against the Cowork upload rules and, on a clean
pass (or with --force), zips it into a <name>.skill archive with the
skill FOLDER as the zip root entry (my-skill.zip -> my-skill/SKILL.md),
which is what claude.ai / Cowork expects when installing a skill.

Grounding (raw research, see references/research/raw/):
  cowork--skills--support-create-custom-skills.md   (name/description caps,
                                                       kebab-case, reserved
                                                       words, angle brackets)
  cowork--skills--code-claude-docs-skills.md
  cowork--skills--github-issue-skill-truncation-bug.md (injection lines)
  claude-code--skills--agentskills-io-spec.md       (spec-six frontmatter)

This script is stdlib-only. PyYAML is used when present; otherwise a small
built-in frontmatter parser is used (see parse_simple_yaml below). That
fallback only understands flat "key: value" pairs, inline "[a, b]" lists,
and indented "- item" block lists; it is not a general YAML parser.

No network access. Deterministic output, ASCII-safe.
"""

import argparse
import os
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
NAME_MAX = 64
DESC_OFFICIAL_MAX = 200
DESC_COMMUNITY_MAX = 1024
KEBAB_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
RESERVED_WORDS = ("claude", "anthropic")
INJECTION_RE = re.compile(r"!`[^`]*`")


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
# Validation
# ---------------------------------------------------------------------------

def validate_skill_folder(folder):
    """Return (findings, name_for_output). findings is a list of
    (severity, message) tuples; severity is ERROR, WARN, or INFO."""
    findings = []
    skill_md = folder / "SKILL.md"
    label = "%s/SKILL.md" % folder.name

    if not skill_md.is_file():
        findings.append(("ERROR", "%s: SKILL.md not found in %s" % (label, folder)))
        return findings, folder.name

    try:
        text = skill_md.read_text(encoding="utf-8")
    except OSError as exc:
        findings.append(("ERROR", "%s: could not read file: %s" % (label, exc)))
        return findings, folder.name

    fm_text, body = extract_frontmatter(text)
    if fm_text is None:
        findings.append(("ERROR", "%s: no YAML frontmatter found (must start with '---')" % label))
        fm = {}
    else:
        fm = parse_frontmatter(fm_text)

    for key in fm:
        if key not in SPEC_SIX:
            findings.append(("ERROR", "%s: field '%s' is outside the spec-six frontmatter fields; hard error on Cowork upload" % (label, key)))

    name = fm.get("name")
    if not name:
        findings.append(("ERROR", "%s: frontmatter is missing 'name'" % label))
    elif isinstance(name, str):
        if len(name) > NAME_MAX:
            findings.append(("ERROR", "%s: name is %d chars, Cowork cap is %d" % (label, len(name), NAME_MAX)))
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

    output_name = name if isinstance(name, str) and name else folder.name
    return findings, output_name


def error_count(findings):
    return sum(1 for sev, _ in findings if sev == "ERROR")


# ---------------------------------------------------------------------------
# Packaging
# ---------------------------------------------------------------------------

def package_skill(folder, output_path):
    with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for path in sorted(folder.rglob("*")):
            if path.is_file():
                arcname = "%s/%s" % (folder.name, path.relative_to(folder).as_posix())
                zf.write(path, arcname)


def main(argv=None):
    parser = argparse.ArgumentParser(description="Validate and package a Cowork .skill archive.")
    parser.add_argument("skill_folder", help="path to the skill folder containing SKILL.md")
    parser.add_argument("-o", "--output", help="output .skill path (default: <name>.skill in the current directory)")
    parser.add_argument("--force", action="store_true", help="package even if validation reported errors")
    args = parser.parse_args(argv)

    folder = Path(args.skill_folder)
    if not folder.is_dir():
        sys.stderr.write("error: not a directory: %s\n" % args.skill_folder)
        return 2

    findings, output_name = validate_skill_folder(folder)

    for sev, msg in findings:
        print("%s %s" % (sev, msg))

    errors = error_count(findings)
    warns = sum(1 for sev, _ in findings if sev == "WARN")
    print("Summary: %d error(s), %d warning(s) for %s" % (errors, warns, folder))

    if errors > 0 and not args.force:
        print("Packaging skipped: fix the errors above or re-run with --force.")
        return 1

    output_path = Path(args.output) if args.output else Path("%s.skill" % output_name)

    try:
        package_skill(folder, output_path)
    except OSError as exc:
        sys.stderr.write("error: could not write archive: %s\n" % exc)
        return 2

    print(str(output_path))
    return 1 if errors > 0 else 0


if __name__ == "__main__":
    sys.exit(main())
