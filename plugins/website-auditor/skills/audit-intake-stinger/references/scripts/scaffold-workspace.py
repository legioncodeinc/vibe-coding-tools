#!/usr/bin/env python3
"""Scaffold a new www.<domain>-audit/ workspace.

Deterministic, harness-portable, no absolute paths (per build plan section 6's
scripting convention). This is a pair-local script, not one of the eleven
shared scripts listed in shared/scripts/README.md, because none of those
eleven cover folder-tree scaffolding; this Drone is the only one that needs it.

Grounding: the folder tree written here is reproduced verbatim from
plan/website-auditor-build-plan.md section 3. No source in
references/research/raw/ describes scaffolding mechanics, so the CLI shape
(argument names, JSON stub schema, domain-derivation rule) below is this
Stinger's own engineering judgment call, not a sourced procedure. See
references/templates/workspace-folder-tree-scaffold.md for the annotated
version of this same tree, and guides/02-workspace-scaffolding.md for the
procedure this script implements.

Usage:
    python3 scaffold-workspace.py \\
        --website-url "https://example.com" \\
        --auditor-name "Jane Auditor" \\
        --contact-name "John Client" \\
        --business-name "Example Co" \\
        [--base-dir .]

Exits non-zero and prints a clear error if the target workspace already
exists (use audit-intake-wasp-drone's resume path instead of re-scaffolding).
"""

import argparse
import datetime
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

FOLDER_TREE = [
    "_shared",
    "00-intake",
    "01-recon",
    "02-positioning",
    "content-targets",
    "content-targets/trends-raw",
    "site-data",
    "visual/desktop",
    "visual/mobile",
    "03-seo",
    "04-aeo",
    "05-funnel",
    "06-accessibility",
    "07-security",
    "08-analytics",
    "09-performance",
    "10-social",
    "11-blog",
    "12-ecommerce",
    "scoring",
    "reports",
]


def derive_domain(website_url: str) -> str:
    """Derive the workspace-key domain from a validated website URL.

    Strips scheme, strips a leading 'www.', strips path/query/fragment.
    No source addresses edge cases (ports, non-www subdomains, IP hosts);
    this function raises on anything ambiguous rather than guessing, per
    references/templates/workspace-folder-tree-scaffold.md's stated rule.
    """
    parsed = urlparse(website_url)
    if not parsed.scheme or not parsed.netloc:
        raise ValueError(
            f"website URL '{website_url}' must include a scheme and host, "
            "e.g. https://example.com"
        )
    host = parsed.hostname or ""
    if not host:
        raise ValueError(f"could not parse a host out of '{website_url}'")
    if parsed.port:
        raise ValueError(
            f"'{website_url}' includes a non-default port; domain-to-folder-name "
            "derivation for ports is not covered by this Drone's grounded research. "
            "Ask the user to confirm the intended workspace folder name instead "
            "of guessing."
        )
    if host.startswith("www."):
        host = host[len("www."):]
    if not re.match(r"^[a-zA-Z0-9.-]+$", host):
        raise ValueError(f"host '{host}' contains characters unsafe for a folder name")
    return host


def scaffold(base_dir: Path, website_url: str, auditor_name: str,
             contact_name: str, business_name: str) -> Path:
    domain = derive_domain(website_url)
    workspace = base_dir / f"www.{domain}-audit"
    if workspace.exists():
        raise FileExistsError(
            f"'{workspace}' already exists. Do not re-scaffold; "
            "audit-intake-wasp-drone should detect _shared/run-ledger.json "
            "and offer to resume instead (PRD-002 AC-4)."
        )

    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    engagement_ref = f"{domain}-{now[:10]}"

    for rel in FOLDER_TREE:
        (workspace / rel).mkdir(parents=True, exist_ok=True)

    (workspace / "00-intake" / "answers.md").write_text(
        "# Intake answers\n\n"
        f"| Field | Value |\n|---|---|\n"
        f"| Auditor | {auditor_name} |\n"
        f"| Audited-party contact | {contact_name} |\n"
        f"| Audited-party business | {business_name} |\n"
        f"| Website URL | {website_url} |\n"
        f"| Engagement reference | {engagement_ref} |\n"
        f"| Recorded | {now} |\n",
        encoding="utf-8",
    )

    (workspace / "_shared" / "run-ledger.json").write_text(
        json.dumps(
            {
                "engagement_ref": engagement_ref,
                "domain": domain,
                "website_url": website_url,
                "auditor_name": auditor_name,
                "contact_name": contact_name,
                "business_name": business_name,
                "scaffold_created": now,
                "drones": {
                    "audit-intake-wasp-drone": {
                        "status": "complete",
                        "started": now,
                        "completed": now,
                        "artifacts": [
                            "README.md",
                            "00-intake/",
                            "_shared/run-ledger.json",
                            "_shared/target-profile.json",
                            "_shared/evidence-index.md",
                        ],
                    }
                },
            },
            indent=2,
        ),
        encoding="utf-8",
    )

    (workspace / "_shared" / "target-profile.json").write_text(
        json.dumps(
            {
                "domain": domain,
                "website_url": website_url,
                "platform": None,
                "rendering": None,
                "stack": None,
                "confidence": None,
                "populated_by": "stack-fingerprint-wasp-drone",
                "populated_at": None,
            },
            indent=2,
        ),
        encoding="utf-8",
    )

    (workspace / "_shared" / "evidence-index.md").write_text(
        "# Evidence index\n\n"
        "| Artifact path | Produced by | Produced at | Notes |\n"
        "|---|---|---|---|\n"
        f"| `00-intake/answers.md` | audit-intake-wasp-drone | {now} | "
        "The four recorded intake answers |\n"
        f"| `README.md` | audit-intake-wasp-drone | {now} | Run manifest |\n"
        f"| `_shared/run-ledger.json` | audit-intake-wasp-drone | {now} | "
        "Per-Drone status ledger, append-only from here |\n"
        f"| `_shared/target-profile.json` | audit-intake-wasp-drone | {now} | "
        "Stub only; populated by stack-fingerprint-wasp-drone |\n",
        encoding="utf-8",
    )

    (workspace / "README.md").write_text(
        f"# Website Audit: {business_name}\n\n"
        "| Field | Value |\n|---|---|\n"
        f"| Auditor | {auditor_name} |\n"
        f"| Audited-party contact | {contact_name} |\n"
        f"| Audited-party business | {business_name} |\n"
        f"| Website | {website_url} |\n"
        f"| Domain (workspace key) | {domain} |\n"
        f"| Engagement reference | {engagement_ref} |\n"
        f"| Intake completed | {now} |\n",
        encoding="utf-8",
    )

    return workspace


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--website-url", required=True)
    parser.add_argument("--auditor-name", required=True)
    parser.add_argument("--contact-name", required=True)
    parser.add_argument("--business-name", required=True)
    parser.add_argument("--base-dir", default=".")
    args = parser.parse_args()

    try:
        workspace = scaffold(
            Path(args.base_dir),
            args.website_url,
            args.auditor_name,
            args.contact_name,
            args.business_name,
        )
    except (ValueError, FileExistsError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1

    print(f"scaffolded: {workspace}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
