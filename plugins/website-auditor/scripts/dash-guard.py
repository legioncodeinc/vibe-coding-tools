#!/usr/bin/env python3
"""Dash-guard: fail if an em dash (U+2014), en dash (U+2013), or their HTML
entity forms (&mdash; / &ndash;) appear in any authored content in this repo.

This plugin's standing convention is to never use em/en dashes anywhere in
authored text (SKILL.md, agent.md, guides, templates, reports, scripts,
this repo's own README/LICENSE notice, etc). The one deliberate exception is
the raw research archive: verbatim third-party quotes are preserved exactly
as fetched, and altering them would break citation integrity. Those two
archive locations are excluded below.

Exit 0 with a summary line when clean. Exit 1 and list every offending file
and line when a violation is found, so CI fails loudly instead of silently.
"""
import os
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Directories whose content is exempt: verbatim third-party research quotes.
EXEMPT_DIR_MARKERS = (
    "/shared/research/raw/",
    "/references/research/raw/",
)

# Individual files whose entire purpose is to reference the banned
# characters/entities literally (the detectors themselves). Exempting a
# whole directory would be too broad; these two files are named explicitly.
EXEMPT_FILES = (
    "scripts/dash-guard.py",
    "scripts/sync-harnesses.py",
)

# Only scan authored text file types; binary/generated files are irrelevant.
SCANNED_EXTENSIONS = (".md", ".json", ".py", ".js", ".mdc", ".yml", ".yaml")

BAD_CHARS = {
    "—": "em dash (U+2014)",
    "–": "en dash (U+2013)",
}
BAD_ENTITIES = ("&mdash;", "&ndash;")

SKIP_DIR_NAMES = {".git", "__pycache__", "node_modules"}


def is_exempt(path: str) -> bool:
    normalized = path.replace(os.sep, "/")
    return any(marker in normalized for marker in EXEMPT_DIR_MARKERS)


def scan_file(path: str):
    violations = []
    try:
        with open(path, "r", encoding="utf-8", errors="strict") as fh:
            lines = fh.readlines()
    except (UnicodeDecodeError, OSError):
        return violations
    for lineno, line in enumerate(lines, start=1):
        for ch, label in BAD_CHARS.items():
            if ch in line:
                violations.append((lineno, label, line.strip()))
        for entity in BAD_ENTITIES:
            if entity in line:
                violations.append((lineno, f"HTML entity {entity}", line.strip()))
    return violations


def main() -> int:
    offenders = []
    for root, dirs, files in os.walk(REPO_ROOT):
        dirs[:] = [d for d in dirs if d not in SKIP_DIR_NAMES]
        if is_exempt(root + "/"):
            continue
        for name in files:
            if not name.endswith(SCANNED_EXTENSIONS):
                continue
            full_path = os.path.join(root, name)
            rel_path = os.path.relpath(full_path, REPO_ROOT).replace(os.sep, "/")
            if is_exempt(full_path) or rel_path in EXEMPT_FILES:
                continue
            violations = scan_file(full_path)
            if violations:
                offenders.append((os.path.relpath(full_path, REPO_ROOT), violations))

    if offenders:
        print("Dash-guard FAILED: em/en dash characters or entities found outside the exempt raw research archives.\n")
        for rel_path, violations in offenders:
            for lineno, label, snippet in violations:
                print(f"  {rel_path}:{lineno}: {label}: {snippet}")
        print(f"\n{sum(len(v) for _, v in offenders)} violation(s) across {len(offenders)} file(s).")
        return 1

    print("Dash-guard OK: no em/en dash characters or entities found outside the exempt raw research archives.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
