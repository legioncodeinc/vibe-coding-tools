#!/usr/bin/env python3
"""
audit-untyped-boundaries.py — find functions accepting `dict` / `list` / `Any`
at API or webhook boundaries.

A "boundary function" is one decorated with @api.* / @router.* / @app.* /
@shared_task / one that accepts a `request` parameter. Untyped parameters
on these are must-fix findings (`guides/12-typing-and-pydantic.md`).

Usage: python -m scripts.audit-untyped-boundaries apps/
"""
from __future__ import annotations

import argparse
import ast
import sys
from pathlib import Path


BOUNDARY_DECORATOR_PREFIXES = (
    "router", "api", "app",         # FastAPI / Ninja
)
BOUNDARY_DECORATOR_NAMES = {
    "shared_task", "task",          # Celery
}

UNTYPED_AT_BOUNDARY = {"dict", "list", "tuple", "Any", "object"}


def is_boundary_function(node: ast.FunctionDef | ast.AsyncFunctionDef) -> bool:
    """Heuristic: function looks like an HTTP / Celery / webhook entrypoint."""
    for dec in node.decorator_list:
        # @router.get(...), @api.post(...), @app.put(...)
        if isinstance(dec, ast.Call) and isinstance(dec.func, ast.Attribute):
            root = dec.func.value
            if isinstance(root, ast.Name) and root.id in BOUNDARY_DECORATOR_PREFIXES:
                return True
        # @shared_task / @task / @router.get / @app.get
        if isinstance(dec, ast.Name) and dec.id in BOUNDARY_DECORATOR_NAMES:
            return True
        if isinstance(dec, ast.Call) and isinstance(dec.func, ast.Name) and dec.func.id in BOUNDARY_DECORATOR_NAMES:
            return True
        if isinstance(dec, ast.Attribute) and dec.attr in BOUNDARY_DECORATOR_NAMES:
            return True

    # Functions accepting `request` are likely Django / Ninja views.
    if node.args.args and node.args.args[0].arg == "request":
        return True
    return False


def annotation_text(ann: ast.expr | None) -> str:
    if ann is None:
        return ""
    return ast.unparse(ann)


def scan_file(path: Path) -> list[tuple[int, str]]:
    try:
        tree = ast.parse(path.read_text(encoding="utf-8"))
    except SyntaxError:
        return []

    findings: list[tuple[int, str]] = []
    for node in ast.walk(tree):
        if not isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            continue
        if not is_boundary_function(node):
            continue
        for arg in node.args.args:
            if arg.arg in {"self", "cls", "request"}:
                continue
            ann = annotation_text(arg.annotation)
            if not ann:
                findings.append((arg.lineno, f"untyped boundary parameter `{arg.arg}` in `{node.name}`"))
                continue
            # Trim Optional[...] etc., look at the bare type
            tokens = {t.strip() for t in ann.replace("|", " ").replace("[", " ").replace("]", " ").replace(",", " ").split()}
            if tokens & UNTYPED_AT_BOUNDARY:
                findings.append((
                    arg.lineno,
                    f"weak boundary type `{ann}` for `{arg.arg}` in `{node.name}` "
                    f"— use a Pydantic schema instead"
                ))
    return findings


def main() -> int:
    parser = argparse.ArgumentParser(description="Audit boundary parameter types.")
    parser.add_argument("paths", nargs="+")
    parser.add_argument("--ignore", action="append", default=["migrations", "tests", ".venv"])
    args = parser.parse_args()

    total = 0
    for raw in args.paths:
        root = Path(raw)
        files = [root] if root.is_file() else root.rglob("*.py")
        for path in files:
            if any(part in args.ignore for part in path.parts):
                continue
            for line, msg in scan_file(path):
                print(f"{path}:{line}: error: {msg}")
                total += 1

    print(f"\n{total} untyped boundary parameter(s) found.", file=sys.stderr)
    return 1 if total else 0


if __name__ == "__main__":
    sys.exit(main())
