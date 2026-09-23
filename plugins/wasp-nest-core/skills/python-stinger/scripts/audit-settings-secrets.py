#!/usr/bin/env python3
"""
audit-settings-secrets.py — scan settings/ for hardcoded secrets.

Detects literal-string assignments to common secret-named variables. Should
be `os.environ[...]` or `env(...)` instead.

Usage: python -m scripts.audit-settings-secrets config/settings/
"""
from __future__ import annotations

import argparse
import ast
import re
import sys
from pathlib import Path


SECRET_NAMES = {
    "SECRET_KEY", "STRIPE_SECRET_KEY", "STRIPE_API_KEY", "STRIPE_WEBHOOK_SECRET",
    "AWS_SECRET_ACCESS_KEY", "AWS_ACCESS_KEY_ID", "DJANGO_SECRET_KEY",
    "DATABASE_PASSWORD", "DB_PASSWORD", "EMAIL_HOST_PASSWORD", "REDIS_PASSWORD",
    "API_KEY", "API_SECRET", "JWT_SECRET", "JWT_PRIVATE_KEY",
    "GOOGLE_API_KEY", "OPENAI_API_KEY", "ANTHROPIC_API_KEY",
    "SENTRY_DSN", "TWILIO_AUTH_TOKEN", "GITHUB_TOKEN",
}

SUSPICIOUS_VALUE_PATTERNS = [
    re.compile(r"^sk_live_"),    # Stripe live secret
    re.compile(r"^pk_live_"),    # Stripe publishable
    re.compile(r"^django-insecure-"),
    re.compile(r"^AKIA[0-9A-Z]{16}$"),  # AWS access key id
    re.compile(r"^xox[bpoa]-[0-9]{12}"),  # Slack token
]


def scan_file(path: Path) -> list[tuple[int, str, str]]:
    try:
        tree = ast.parse(path.read_text(encoding="utf-8"))
    except (SyntaxError, OSError):
        return []

    findings: list[tuple[int, str, str]] = []
    for node in ast.walk(tree):
        if not isinstance(node, ast.Assign):
            continue
        if not (len(node.targets) == 1 and isinstance(node.targets[0], ast.Name)):
            continue
        name = node.targets[0].id

        # Direct secret-named variable with string literal
        if name in SECRET_NAMES and isinstance(node.value, ast.Constant) and isinstance(node.value.value, str):
            findings.append((
                node.lineno,
                "error",
                f"`{name}` assigned a string literal — should be `os.environ[\"{name}\"]` or env(...)",
            ))
            continue

        # Suspicious-looking values regardless of variable name
        if isinstance(node.value, ast.Constant) and isinstance(node.value.value, str):
            value = node.value.value
            for pattern in SUSPICIOUS_VALUE_PATTERNS:
                if pattern.match(value):
                    findings.append((
                        node.lineno,
                        "error",
                        f"`{name}` value matches suspicious pattern `{pattern.pattern}` — appears to be a real secret",
                    ))
                    break
    return findings


def main() -> int:
    parser = argparse.ArgumentParser(description="Audit settings for hardcoded secrets.")
    parser.add_argument("paths", nargs="+", help="Settings files or directories.")
    args = parser.parse_args()

    total = 0
    for raw in args.paths:
        root = Path(raw)
        files = [root] if root.is_file() else root.rglob("*.py")
        for path in files:
            for line, sev, msg in scan_file(path):
                print(f"{path}:{line}: {sev}: {msg}")
                total += 1

    print(f"\n{total} suspected hardcoded secret(s).", file=sys.stderr)
    return 1 if total else 0


if __name__ == "__main__":
    sys.exit(main())
