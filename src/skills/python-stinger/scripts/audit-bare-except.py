#!/usr/bin/env python3
"""
audit-bare-except.py — find `except:` and unexplained `except Exception:`.

Bare `except:` swallows KeyboardInterrupt and SystemExit. `except Exception:`
without a comment explaining why is a should-refactor finding
(`guides/22-common-failure-modes.md`).

Usage: python -m scripts.audit-bare-except apps/
"""
from __future__ import annotations

import argparse
import ast
import sys
from pathlib import Path


def line_has_comment(source_lines: list[str], lineno: int) -> bool:
    """Check if the except line or the line before has an explanatory comment."""
    for offset in (0, -1):
        idx = lineno - 1 + offset
        if 0 <= idx < len(source_lines) and "#" in source_lines[idx]:
            comment = source_lines[idx].split("#", 1)[1].strip().lower()
            # Substantive comment, not just `# noqa` etc.
            if len(comment) > 6 and "noqa" not in comment:
                return True
    return False


def scan_file(path: Path) -> list[tuple[int, str, str]]:
    try:
        source = path.read_text(encoding="utf-8")
        tree = ast.parse(source)
    except (SyntaxError, OSError):
        return []
    lines = source.splitlines()

    findings: list[tuple[int, str, str]] = []
    for node in ast.walk(tree):
        if not isinstance(node, ast.ExceptHandler):
            continue
        if node.type is None:
            findings.append((node.lineno, "error", "bare `except:` — swallows KeyboardInterrupt and SystemExit"))
            continue
        if isinstance(node.type, ast.Name) and node.type.id == "Exception":
            if not line_has_comment(lines, node.lineno):
                findings.append((
                    node.lineno,
                    "warning",
                    "`except Exception:` without a comment explaining why — narrow the exception or document the catch-all",
                ))
        # Tuple of multiple exceptions — fine
    return findings


def main() -> int:
    parser = argparse.ArgumentParser(description="Audit bare except patterns.")
    parser.add_argument("paths", nargs="+")
    parser.add_argument("--ignore", action="append", default=[".venv"])
    args = parser.parse_args()

    total = 0
    for raw in args.paths:
        root = Path(raw)
        files = [root] if root.is_file() else root.rglob("*.py")
        for path in files:
            if any(part in args.ignore for part in path.parts):
                continue
            for line, sev, msg in scan_file(path):
                print(f"{path}:{line}: {sev}: {msg}")
                total += 1

    print(f"\n{total} bare-except finding(s).", file=sys.stderr)
    return 1 if total else 0


if __name__ == "__main__":
    sys.exit(main())
