#!/usr/bin/env python3
"""Validate the support-response catalog and white-label response library.

This script is deterministic, performs no network calls, writes no files, emits
JSON only, and uses exit code 0 for pass, 1 for validation failure, and 2 for a
usage or environment error.
"""

from __future__ import annotations

import json
import re
import sys
from collections import Counter
from pathlib import Path


EXPECTED_FAMILIES = {
    "Platform access, performance, and support routing": 6,
    "Email delivery, authentication, reputation, links, and reporting": 10,
    "SMS, A2P, consent, filtering, limits, and sender selection": 12,
    "Calendars, availability, synchronization, and booking": 8,
    "Workflows and automation": 10,
    "Social publishing and connected channels": 6,
    "Sites, funnels, forms, domains, DNS, SSL, and publication": 12,
    "CRM, opportunities, contacts, imports, and account state": 8,
    "Phone, call quality, Voice AI, WhatsApp, and conversation AI": 10,
    "Billing, payments, subscriptions, SaaS, and reconciliation": 8,
    "Portals, courses, permissions, and white-label account experience": 5,
    "APIs, webhooks, integrations, and attribution bridges": 5,
}

PROHIBITED = {
    "help.gohighlevel.com",
    "status.gohighlevel.com",
    "app.gohighlevel.com",
    "gohighlevel.com",
    "gohighlevel",
    "highlevel",
    "leadconnectorhq.com",
    "leadconnector",
    "lc phone",
    "lc email",
}

CATALOG_ID = re.compile(r"^### (SR-\d{3}):\s+(.+)$", re.MULTILINE)
LIBRARY_ID = re.compile(r"^# (SR-\d{3}):\s+(.+)$", re.MULTILINE)
FAMILY = re.compile(r"^- Primary family:\s+(.+?)\s*$", re.MULTILINE)
RESPONSE_FILE = re.compile(r"^- Response file:\s+`([^`]+)`\s*$", re.MULTILINE)
RAW_CITATION = re.compile(r"\[raw/([^\]]+)\]")
URL = re.compile(r"https?://", re.IGNORECASE)


def expected_ids() -> list[str]:
    return [f"SR-{number:03d}" for number in range(1, 101)]


def validate() -> dict:
    root = Path(__file__).resolve().parents[1]
    catalog_path = root / "references" / "highlevel-issue-catalog.md"
    library_dir = root / "references" / "white-label-response-library"
    raw_root = root / "references" / "research" / "raw"

    errors: list[dict[str, object]] = []
    warnings: list[dict[str, object]] = []

    if not catalog_path.is_file():
        return {
            "status": "error",
            "message": f"missing catalog: {catalog_path}",
        }
    if not library_dir.is_dir():
        return {
            "status": "error",
            "message": f"missing response library: {library_dir}",
        }

    catalog_text = catalog_path.read_text(encoding="utf-8")
    catalog_entries = CATALOG_ID.findall(catalog_text)
    catalog_ids = [item[0] for item in catalog_entries]
    expected = expected_ids()

    if catalog_ids != expected:
        errors.append(
            {
                "check": "catalog-sequential-ids",
                "expected": expected,
                "actual": catalog_ids,
            }
        )
    duplicate_titles = [
        title for title, count in Counter(title.casefold() for _, title in catalog_entries).items()
        if count > 1
    ]
    if duplicate_titles:
        errors.append(
            {"check": "catalog-unique-titles", "duplicates": duplicate_titles}
        )

    family_counts = Counter(FAMILY.findall(catalog_text))
    if dict(family_counts) != EXPECTED_FAMILIES:
        errors.append(
            {
                "check": "catalog-family-allocation",
                "expected": EXPECTED_FAMILIES,
                "actual": dict(family_counts),
            }
        )

    declared_files = RESPONSE_FILE.findall(catalog_text)
    if len(declared_files) != 100 or len(set(declared_files)) != 100:
        errors.append(
            {
                "check": "catalog-response-file-count",
                "count": len(declared_files),
                "unique": len(set(declared_files)),
            }
        )

    missing_citations: list[str] = []
    for relative in sorted(set(RAW_CITATION.findall(catalog_text))):
        if not (raw_root / relative).is_file():
            missing_citations.append(relative)
    if missing_citations:
        errors.append(
            {"check": "catalog-citation-targets", "missing": missing_citations}
        )

    files = sorted(library_dir.glob("SR-*.md"))
    if len(files) != 100:
        errors.append(
            {"check": "response-library-file-count", "expected": 100, "actual": len(files)}
        )

    library_ids: list[str] = []
    library_violations: list[dict[str, object]] = []
    for path in files:
        text = path.read_text(encoding="utf-8")
        matches = LIBRARY_ID.findall(text)
        file_errors: list[str] = []
        if len(matches) != 1:
            file_errors.append("expected exactly one level-1 SR heading")
            item_id = path.name[:6]
        else:
            item_id = matches[0][0]
            library_ids.append(item_id)
            if not path.name.startswith(f"{item_id}-"):
                file_errors.append("filename does not start with heading ID")
        folded = text.casefold()
        exposed = sorted(token for token in PROHIBITED if token in folded)
        if exposed:
            file_errors.append(f"prohibited upstream identity: {', '.join(exposed)}")
        if URL.search(text):
            file_errors.append("pre-filled URL is not allowed in customer-facing library")
        if "{agency}" not in text:
            file_errors.append("missing {agency} placeholder")
        if "{agent_name}" not in text:
            file_errors.append("missing {agent_name} placeholder")
        if "{customer_first_name}" not in text:
            file_errors.append("missing {customer_first_name} placeholder")
        if "**Subject:**" not in text:
            file_errors.append("missing Subject label")
        if "## Customer-facing email" not in text:
            file_errors.append("missing customer-facing email section")
        if "\u2013" in text or "\u2014" in text:
            file_errors.append("contains an authored en dash or em dash")
        if file_errors:
            library_violations.append(
                {"file": str(path.relative_to(root)), "errors": file_errors}
            )

    if library_ids != expected:
        errors.append(
            {
                "check": "response-library-sequential-ids",
                "expected": expected,
                "actual": library_ids,
            }
        )
    if library_violations:
        errors.append(
            {"check": "response-library-contract", "violations": library_violations}
        )

    declared_paths = [root / relative for relative in declared_files]
    missing_declared = [
        str(path.relative_to(root)) for path in declared_paths if not path.is_file()
    ]
    if missing_declared:
        errors.append(
            {"check": "declared-response-files-exist", "missing": missing_declared}
        )

    unexpected = sorted(
        str(path.relative_to(root))
        for path in files
        if path not in set(declared_paths)
    )
    if unexpected:
        errors.append(
            {"check": "undeclared-response-files", "unexpected": unexpected}
        )

    result = {
        "status": "pass" if not errors else "fail",
        "catalog_entries": len(catalog_entries),
        "catalog_unique_ids": len(set(catalog_ids)),
        "family_counts": dict(family_counts),
        "catalog_raw_citations": len(RAW_CITATION.findall(catalog_text)),
        "catalog_unique_raw_targets": len(set(RAW_CITATION.findall(catalog_text))),
        "response_files": len(files),
        "response_unique_ids": len(set(library_ids)),
        "errors": errors,
        "warnings": warnings,
    }
    return result


def main() -> int:
    try:
        result = validate()
    except (OSError, UnicodeError) as exc:
        print(json.dumps({"status": "error", "message": str(exc)}))
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    if result["status"] == "error":
        return 2
    return 0 if result["status"] == "pass" else 1


if __name__ == "__main__":
    sys.exit(main())
