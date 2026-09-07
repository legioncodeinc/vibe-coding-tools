#!/usr/bin/env python3
"""Replace retired Library Schema v1 paths in active component guidance."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
EXCLUDED_PARTS = {"references/research/raw"}
EXCLUDED_ROOT = ROOT / "src" / "skills" / "library-stinger"
REPLACEMENTS = (
    ("library/requirements/features/feature-", "library/requirements/<lifecycle>/prd-"),
    ("library/requirements/features/", "library/requirements/<lifecycle>/"),
    ("library/requirements/issues/issue-", "library/issues/<lifecycle>/ird-"),
    ("library/requirements/issues/", "library/issues/<lifecycle>/"),
    ("library/qa/", "library/requirements/reports/"),
    ("library/architecture/", "library/knowledge/private/architecture/"),
    ("library/knowledge-base/", "library/knowledge/private/"),
)


def main() -> None:
    changed = 0
    for folder in ("agents", "skills", "commands"):
        for path in (ROOT / "src" / folder).rglob("*.md"):
            normalized = path.as_posix()
            if any(part in normalized for part in EXCLUDED_PARTS):
                continue
            if path.is_relative_to(EXCLUDED_ROOT):
                continue
            original = path.read_text(encoding="utf-8")
            updated = original
            for old, new in REPLACEMENTS:
                updated = updated.replace(old, new)
            if updated != original:
                path.write_text(updated, encoding="utf-8")
                changed += 1
    print(f"Updated retired library paths in {changed} active files.")


if __name__ == "__main__":
    main()
