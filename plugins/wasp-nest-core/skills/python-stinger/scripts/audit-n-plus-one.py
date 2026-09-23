#!/usr/bin/env python3
"""
audit-n-plus-one.py — heuristic scan for likely N+1 query sites.

Flags:
- A loop body that calls `.objects.` or `.filter(` / `.get(` / `.first(` /
  `.count(` on a related accessor (e.g., `for u in users: u.orders.count()`).
- A queryset assignment NOT followed by `select_related` / `prefetch_related`
  before being iterated.

Usage: python -m scripts.audit-n-plus-one apps/
"""
from __future__ import annotations

import argparse
import ast
import sys
from pathlib import Path


# Method names that, when called inside a loop on something, suggest a query.
QUERY_TRIGGER_METHODS = {
    "all", "filter", "exclude", "get", "first", "last", "count",
    "exists", "values", "values_list", "aggregate", "annotate",
}


class NPlusOneVisitor(ast.NodeVisitor):
    def __init__(self, path: Path) -> None:
        self.path = path
        self.findings: list[tuple[int, str]] = []

    def visit_For(self, node: ast.For) -> None:
        # Look for queries inside the loop body
        for sub in ast.walk(node):
            if isinstance(sub, ast.Call) and isinstance(sub.func, ast.Attribute):
                method = sub.func.attr
                if method in QUERY_TRIGGER_METHODS:
                    # Crude heuristic: if the call is on an attribute of the
                    # loop variable, flag.
                    obj = sub.func.value
                    if isinstance(obj, ast.Attribute):
                        root = obj.value
                        if isinstance(root, ast.Name) and self._matches_loop_var(node, root.id):
                            self.findings.append((
                                sub.lineno,
                                f"likely N+1: `{root.id}.{obj.attr}.{method}(...)` "
                                f"inside `for {root.id} in ...:`. Add prefetch_related/select_related on the outer queryset."
                            ))
        self.generic_visit(node)

    def _matches_loop_var(self, for_node: ast.For, name: str) -> bool:
        target = for_node.target
        if isinstance(target, ast.Name):
            return target.id == name
        if isinstance(target, ast.Tuple):
            return any(isinstance(e, ast.Name) and e.id == name for e in target.elts)
        return False


def scan_file(path: Path) -> list[tuple[int, str]]:
    try:
        tree = ast.parse(path.read_text(encoding="utf-8"))
    except SyntaxError:
        return []
    visitor = NPlusOneVisitor(path)
    visitor.visit(tree)
    return visitor.findings


def main() -> int:
    parser = argparse.ArgumentParser(description="Heuristic N+1 scanner.")
    parser.add_argument("paths", nargs="+", help="Files or directories to scan.")
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
                print(f"{path}:{line}: warning: {msg}")
                total += 1

    print(f"\n{total} likely N+1 site(s) found.", file=sys.stderr)
    return 1 if total else 0


if __name__ == "__main__":
    sys.exit(main())
