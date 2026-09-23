#!/usr/bin/env python3
"""Classify already-detected vendors into this Stinger's three scoring buckets.

Grounding: the Google Tag Manager (GTM) regex signatures below are cited to
references/research/raw/sme-mapree-dev-stack-tech-google-tag-manager.md
(Tier A, grounded). The foundational-analytics platform signatures are
general/public knowledge, not cited to a source in this Stinger's research
archive (Tier B). The de-anonymization vendor list carries NO fingerprint,
by design, no raw source in this archive documents one; a name match there
is a candidate only (Tier C) and must be routed to manual verification, not
reported as confirmed. See references/templates/vendor-classification-table.md
for the full tier explanation this script implements.

Harness-portable: standard library only, no absolute paths, no network calls.
Input: a directory of already-crawled page text (site-data/*.html or *.md)
or a single vendor-inventory.md file to scan for the signatures below.
Output: a classification table (JSON to stdout, or write to a file with
--out) that a downstream step drops into
references/templates/analytics-findings-template.md's evidence fields.

This script never asserts a de-anonymization vendor's identity. It flags a
candidate and includes the matched text so a human (or the calling Drone) can
verify it against references/templates/vendor-classification-table.md before
it's reported as a finding.

Usage:
    python3 analytics-vendor-classify.py --input path/to/site-data/or/vendor-inventory.md [--out findings.json]
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

# Tier A: grounded in raw/sme-mapree-dev-stack-tech-google-tag-manager.md
GTM_SIGNATURES = {
    "javascript_global": [
        r"window\.google_tag_data",
        r"window\.google_tag_manager",
        r"window\.googletag",
    ],
    "html_source": [
        r"googletagmanager\.com/ns\.html[^>]+></iframe>",
        r"<!--\s*(?:End )?Google Tag Manager\s*-->",
    ],
    "script_src_url": [
        r"googletagmanager\.com/gtm\.js",
        r"\.googletagmanager\.com/",
    ],
}

# Tier B: general/public knowledge, not cited to this archive
FOUNDATIONAL_SIGNATURES = {
    "Google Analytics 4": [
        r"googletagmanager\.com/gtag/js",
        r"google-analytics\.com/g/collect",
        r"window\.gtag\b",
    ],
    "Meta Pixel": [
        r"connect\.facebook\.net/[^\"'\s]*fbevents\.js",
        r"window\.fbq\b",
    ],
    "LinkedIn Insight Tag": [
        r"snap\.licdn\.com/li\.lms-analytics/insight\.min\.js",
        r"_linkedin_data_partner_ids",
    ],
    "TikTok Pixel": [
        r"analytics\.tiktok\.com/i18n/pixel/events\.js",
        r"window\.ttq\b",
    ],
    "Adobe Analytics": [
        r"assets\.adobedtm\.com/",
        r"AppMeasurement\.js",
    ],
    "Matomo": [
        r"[\"']matomo\.js[\"']",
        r"[\"']piwik\.js[\"']",
        r"window\._paq\b",
    ],
}

# Tier C: named in research, no fingerprint. Domain fragments below are
# heuristic candidate flags only, a match here is NOT a confirmed detection.
DEANON_CANDIDATE_DOMAIN_FRAGMENTS = [
    "rb2b.com",
    "leadpipe.com",
    "abmatic.ai",
    "clearbit.com",
    "6sense.com",
    "dealfront.com",
]

# Flagged separately, write-capable content-injection tier, not scored by
# this Stinger. Grounded in raw/searchatlas-com-otto-pixel.md; no technical
# fingerprint documented there beyond the vendor's own hostname.
CONTENT_INJECTION_DOMAIN_FRAGMENTS = [
    "searchatlas.com",
]


def _scan_text(text: str, patterns: list[str]) -> list[str]:
    hits = []
    for pattern in patterns:
        for match in re.finditer(pattern, text, flags=re.IGNORECASE):
            hits.append(match.group(0))
    return hits


def classify(text: str) -> dict:
    result = {
        "tag_manager": {},
        "foundational_candidates": {},
        "deanon_candidates": [],
        "content_injection_candidates": [],
    }

    for channel, patterns in GTM_SIGNATURES.items():
        hits = _scan_text(text, patterns)
        if hits:
            result["tag_manager"][channel] = hits

    for vendor, patterns in FOUNDATIONAL_SIGNATURES.items():
        hits = _scan_text(text, patterns)
        if hits:
            result["foundational_candidates"][vendor] = {
                "tier": "B, general knowledge, not archive-sourced",
                "matches": hits,
            }

    for fragment in DEANON_CANDIDATE_DOMAIN_FRAGMENTS:
        if fragment.lower() in text.lower():
            result["deanon_candidates"].append(
                {
                    "domain_fragment": fragment,
                    "tier": "C, unconfirmed candidate, no fingerprint in this archive",
                    "action": "route to manual verification before reporting as a finding",
                }
            )

    for fragment in CONTENT_INJECTION_DOMAIN_FRAGMENTS:
        if fragment.lower() in text.lower():
            result["content_injection_candidates"].append(
                {
                    "domain_fragment": fragment,
                    "note": "write-capable, not scored by this Stinger, cross-reference to vendor-inventory-wasp-drone's finding",
                }
            )

    return result


def _load_input(path: Path) -> str:
    if path.is_dir():
        chunks = []
        for candidate in sorted(path.glob("**/*")):
            if candidate.suffix.lower() in (".html", ".md") and candidate.is_file():
                chunks.append(candidate.read_text(encoding="utf-8", errors="ignore"))
        return "\n".join(chunks)
    return path.read_text(encoding="utf-8", errors="ignore")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--input",
        required=True,
        help="Path to vendor-inventory.md, or a site-data/ directory of .html/.md files.",
    )
    parser.add_argument(
        "--out",
        default=None,
        help="Optional path to write the JSON classification result. Defaults to stdout.",
    )
    args = parser.parse_args()

    input_path = Path(args.input)
    if not input_path.exists():
        print(f"error: input path not found: {input_path}", file=sys.stderr)
        return 1

    text = _load_input(input_path)
    result = classify(text)
    payload = json.dumps(result, indent=2)

    if args.out:
        Path(args.out).write_text(payload, encoding="utf-8")
    else:
        print(payload)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
