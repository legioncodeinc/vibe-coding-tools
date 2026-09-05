#!/usr/bin/env python3
"""
{script-name}.py - stub pattern for a bundled deterministic helper script.

Replace the check below with what this stinger actually needs to verify.
Keep the shape: argparse for inputs, one clear check, JSON on stdout, a
real exit code. A model reading the output should never have to parse
prose to know whether the check passed.

Rules for any script in a stinger's scripts/ folder: deterministic (same
input, same output, no LLM calls from inside the script), JSON output
only (no ASCII tables), exit code matches JSON status (0 pass, 1 fail,
2 usage/environment error), no secrets, no network calls, no writes
outside what the check requires.
"""

import argparse
import json
import sys
from pathlib import Path


def run_check(target: Path) -> dict:
    """Replace with the real deterministic check, e.g. a frontmatter
    field check, a naming-convention lint, a size limit. This stub just
    confirms the target exists and is non-empty."""
    if not target.exists():
        return {"status": "fail", "check": "exists", "target": str(target),
                 "message": f"{target} does not exist"}
    if target.stat().st_size == 0:
        return {"status": "fail", "check": "non-empty", "target": str(target),
                 "message": f"{target} exists but is empty"}
    return {"status": "pass", "check": "exists-and-non-empty",
             "target": str(target), "message": "ok"}


def main() -> int:
    parser = argparse.ArgumentParser(description="Deterministic validation stub for a Hive stinger.")
    parser.add_argument("target", type=Path, help="Path this check runs against.")
    args = parser.parse_args()

    try:
        result = run_check(args.target)
    except Exception as exc:  # noqa: BLE001 - surface failures as JSON, not a traceback
        print(json.dumps({"status": "error", "message": str(exc)}))
        return 2

    print(json.dumps(result))
    return 0 if result["status"] == "pass" else 1


if __name__ == "__main__":
    sys.exit(main())
