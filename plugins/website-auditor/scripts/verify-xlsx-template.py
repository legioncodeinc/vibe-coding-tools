#!/usr/bin/env python3
"""Sanity-check the audit-scoring XLSX deliverable actually opens and has the
shape it claims to have (prd-020's acceptance criteria: 16 sheets, N/A-aware
rollups, named ranges for the scoring engine to address).

This does not re-validate the full scoring logic (that's the generator
script's and its own template README's job); it just guards against the
binary deliverable being corrupted, truncated, or silently regenerated with
missing sheets/ranges by a future change, which a text-only diff review
would not catch.
"""
import os
import sys

try:
    import openpyxl
except ImportError:
    print("SKIP: openpyxl not installed, cannot verify the XLSX template. Install with:")
    print("  pip install --break-system-packages openpyxl")
    sys.exit(1)

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMPLATE_PATH = os.path.join(
    REPO_ROOT,
    "skills",
    "audit-scoring-stinger",
    "references",
    "templates",
    "website-audit-scorecard-template.xlsx",
)

MIN_EXPECTED_SHEETS = 16
MIN_EXPECTED_NAMED_RANGES = 20


def main() -> int:
    if not os.path.isfile(TEMPLATE_PATH):
        print(f"FAILED: expected XLSX deliverable not found at {os.path.relpath(TEMPLATE_PATH, REPO_ROOT)}")
        return 1

    try:
        wb = openpyxl.load_workbook(TEMPLATE_PATH, data_only=False)
    except Exception as exc:  # noqa: BLE001 - report any load failure plainly
        print(f"FAILED: could not open the XLSX deliverable: {exc}")
        return 1

    sheet_count = len(wb.sheetnames)
    named_range_count = len(wb.defined_names)

    problems = []
    if sheet_count < MIN_EXPECTED_SHEETS:
        problems.append(f"only {sheet_count} sheets found, expected at least {MIN_EXPECTED_SHEETS}")
    if named_range_count < MIN_EXPECTED_NAMED_RANGES:
        problems.append(f"only {named_range_count} named ranges found, expected at least {MIN_EXPECTED_NAMED_RANGES}")

    if problems:
        print("FAILED: XLSX deliverable shape check:")
        for p in problems:
            print(f"  {p}")
        return 1

    print(
        f"XLSX template OK: opens cleanly, {sheet_count} sheets, {named_range_count} named ranges "
        f"({os.path.relpath(TEMPLATE_PATH, REPO_ROOT)})."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
