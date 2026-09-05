#!/usr/bin/env python3
"""Attribution and PII sweep for an acquired repository.

Scans every text file under ROOT and reports lines that carry attribution,
license, or personal-identifier signals, grouped by category. Every hit is
classified by path as first-party (candidate for removal), third-party
(preserve: the acquisition does not transfer a dependency's rights), or
generated (lockfiles and build output: leave alone, note in the report).

Read-only. It never edits a file. Review its findings, then express the
approved changes as a replacement map for apply_replacements.py.

Usage:
  python attribution_sweep.py ROOT [--json OUT.json] [--allow ALLOW.json]
                              [--exclude-dir NAME ...] [--git] [--max-hits N]

ALLOW.json shape (every entry is a regular expression):
  {"emails": ["@example\\.com$"], "handles": ["^@octocat$"],
   "paths": ["^docs/fixtures/"], "lines": ["Copyright placeholder"]}
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from collections import Counter, defaultdict

SKIP_DIRS_DEFAULT = {".git", "node_modules", ".venv", "venv", "__pycache__",
                     ".tox", ".mypy_cache", ".pytest_cache", ".gradle"}
# Build outputs are skipped only at the repository root; a dist/ folder under
# vendor/ is third-party code that may carry notices and must be scanned.
SKIP_ROOT_ONLY = {"target", "dist", "build", ".next", ".nuxt", "coverage", "out"}

THIRD_PARTY_PATH = re.compile(
    r"(^|/)(vendor|vendors|third[_-]party|thirdparty|external|extern|deps|"
    r"licenses?|LICENSES?|NOTICES?|site-packages|Carthage|Pods)(/|$)", re.I)
GENERATED_PATH = re.compile(
    r"(^|/)(package-lock\.json|npm-shrinkwrap\.json|yarn\.lock|pnpm-lock\.yaml|"
    r"bun\.lockb?|Cargo\.lock|poetry\.lock|Pipfile\.lock|uv\.lock|Gemfile\.lock|"
    r"composer\.lock|go\.sum|packages\.lock\.json|Package\.resolved|"
    r"pubspec\.lock|mix\.lock|flake\.lock|\.snap)$", re.I)
NOTICE_FILE = re.compile(
    r"(^|/)(LICEN[CS]E|COPYING|COPYRIGHT|NOTICE|AUTHORS|CONTRIBUTORS|"
    r"MAINTAINERS|CODEOWNERS|PATENTS|CREDITS|THANKS)([.\-_][A-Za-z0-9.]*)?$",
    re.I)

CODE_EXT = {".py", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".java",
            ".kt", ".kts", ".cs", ".swift", ".go", ".rs", ".rb", ".php", ".c",
            ".h", ".cc", ".cpp", ".hpp", ".m", ".mm", ".scala", ".dart", ".ex",
            ".exs", ".erl", ".hs", ".lua", ".pl", ".sh", ".bash", ".zsh",
            ".ps1", ".sql", ".r", ".jl", ".clj", ".groovy", ".vue", ".svelte"}

IGNORE_HANDLES = {
    "author", "authors", "license", "licence", "repository", "param", "params",
    "returns", "return", "type", "typedef", "template", "deprecated",
    "internal", "see", "throws", "throw", "default", "module", "file",
    "example", "media", "echo", "import", "keyframes", "font-face",
    "supports", "layer", "charset", "page", "apply", "tailwind", "extends",
    "implements", "override", "property", "public", "private", "protected",
    "readonly", "ts-ignore", "ts-expect-error", "ts-check", "ts-nocheck",
    "vitest-environment", "jest-environment", "format", "flow", "since",
    "version", "todo", "fixme", "note", "link", "inheritdoc", "packagedocumentation",
    "dataclass", "staticmethod", "classmethod", "abstractmethod", "pytest",
    "fixture", "override", "component", "injectable", "input", "output",
    "test", "before", "after", "describe", "it", "override", "args", "latest",
    "each", "mixin", "include", "use", "font-feature-values", "container",
    "scope", "starting-style", "property", "namespace", "counter-style",
    # TSDoc and JSDoc tags
    "remarks", "privateremarks", "defaultvalue", "typeparam", "decorator",
    "label", "sealed", "virtual", "eventproperty", "experimental", "alpha",
    "beta", "hidden", "ignore", "noinheritdoc", "satisfies", "category",
    "group", "throws", "yields", "async", "generator", "constructor", "class",
    "function", "enum", "memberof", "alias", "name", "description", "summary",
    "callback", "this", "fires", "listens", "mixes", "borrows", "lends", "kind",
    "variation", "tutorial", "requires", "external", "host", "global", "inner",
    "instance", "static", "access", "event", "readonly", "abstract", "final",
    "returns", "return", "typedef", "implements", "augments", "exports",
    "requires", "module", "public", "example", "deprecated", "internal",
    "override", "packagedocumentation", "inheritdoc", "see", "link", "linkcode",
    "linkplain", "param", "prop", "arg", "argument", "since", "version",
    "todo", "fixme", "xxx", "hack", "note", "warning", "important",
    # Python decorators, Java and C# annotations, Swift and Kotlin attributes
    "dataclass", "staticmethod", "classmethod", "abstractmethod", "property",
    "cached_property", "functools", "wraps", "pytest", "fixture", "mark",
    "parametrize", "override", "test", "override", "nullable", "nonnull",
    "suppresswarnings", "deprecated", "functionalinterface", "safevarargs",
    "inject", "autowired", "component", "service", "repository", "controller",
    "restcontroller", "bean", "configuration", "entity", "table", "column",
    "id", "generatedvalue", "transactional", "objc", "ibaction", "iboutlet",
    "main", "state", "binding", "published", "environment", "escaping",
    "available", "discardableresult", "objcmembers", "nsmanaged", "jvmstatic",
    "jvmfield", "throws", "composable", "preview", "serializable", "keep",
}

CATEGORIES = {
    "copyright": re.compile(r"(?i)(copyright\s*(\(c\)|©)?\s*(19|20)\d{2}|\(c\)\s*(19|20)\d{2}|©\s*(19|20)\d{2})"),
    "license-text": re.compile(r"(?i)(SPDX-License-Identifier|@license\b|licensed under|MIT License|Apache License|GNU (General|Lesser|Affero) Public|BSD[- ]\d[- ]Clause|Mozilla Public License|all rights reserved|Creative Commons|ISC License)"),
    # "written by another process" is prose; "Written by Jane" or "created by @jane" is attribution.
    "author-tag": re.compile(r"(@author\b|@maintainer\b|^\s*(#|//|\*|<!--)?\s*(?i:authors?|maintainers?)\s*:\s*\S|(?i:written|created|maintained|authored|developed)\s+by\s+[A-Z@\[]|\bby\s+@[A-Za-z])"),
    "credit": re.compile(r"((?i:thanks to|thank you to|special thanks to|kudos to|courtesy of)\s+[A-Z@\[]|(?i:reported|contributed|fixed|diagnosed)\s+by\s+[A-Z@\[]|(?i:co-authored-by)|h/t\s+@)"),
    "email": re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"),
    "repo-url": re.compile(r"https?://(www\.)?(github|gitlab|bitbucket|codeberg|sourcehut|sr\.ht)\.(com|org|ht)/[\w.-]+(/[\w.-]+)?"),
    "funding": re.compile(r"(?i)(github\.com/sponsors/|patreon\.com/|ko-fi\.com/|buymeacoffee\.com/|opencollective\.com/|liberapay\.com/|\bfunding\b.*https?://)"),
    "social": re.compile(r"(?i)(twitter\.com/|x\.com/[A-Za-z0-9_]+|linkedin\.com/in/|mastodon\.[a-z]+/@|discord\.gg/|t\.me/|youtube\.com/@|instagram\.com/)"),
    "home-path": re.compile(r"(/home/[A-Za-z0-9_.-]+|/Users/[A-Za-z0-9_.-]+|[A-Za-z]:[\\/]Users[\\/][A-Za-z0-9_.-]+)"),
    "bundle-id": re.compile(r"(?<![\w-])(com|org|io|net|dev)\.[a-z0-9-]+\.[a-z0-9-]+(\.[a-z0-9-]+)*(?![\w-])(?<!\.(ts|js|md|txt|py|rs|go|json|yml|yaml|toml|css|html))"),
    "scoped-package": re.compile(r"(?<![\w.])@[a-z0-9][a-z0-9-]*/[a-z0-9._-]+"),
}
# Categories reported as unique-value tables rather than per-line samples: the
# value itself (a package scope, a repository owner, a bundle id) is what the
# reviewer needs to judge, and most occurrences are ordinary dependency references.
AGGREGATE = {"scoped-package", "repo-url", "bundle-id"}
PLACEHOLDER_LOCAL = re.compile(r"^(user\d*|test\d*|tester|alice\d*|bob|carol|dave|eve|mallory|foo|bar|baz|admin|example|someone|somebody|you|me|owner|first|second|primary|secondary|work|personal|dev|ops|team|account\d*|name|email|your[\w-]*|my[\w-]*|no-?reply|noreply|jdoe|johndoe|janedoe|john|jane)@", re.I)
PLACEHOLDER_USER = re.compile(r"(/home/|/Users/|[\\/]Users[\\/])(alice\d*|bob|carol|user\d*|tester|test|you|me|example|name|username|jdoe|johndoe|janedoe|john|jane|foo|bar|dev|runner|ubuntu|vagrant|ci|build|admin|root|\$\{?\w+\}?|<[^>]+>|%[^%]+%)(?![\w.-])", re.I)
HANDLE = re.compile(r"(?<![\w./@-])@([A-Za-z][\w-]{2,38})(?![\w/-])")
COMMENT_HINT = re.compile(r"^\s*(#|//|\*|/\*|<!--|--|;|%|'''|\"\"\"|rem\b)", re.I)

PLACEHOLDER_EMAIL = re.compile(r"@(example\.(com|org|net)|test\.com|localhost|invalid|domain\.com|email\.com)$", re.I)


def is_text(path: str, cap: int = 5 * 1024 * 1024) -> bytes | None:
    try:
        size = os.path.getsize(path)
        if size > cap:
            return None
        with open(path, "rb") as fh:
            data = fh.read()
    except OSError:
        return None
    if b"\x00" in data[:8192]:
        return None
    return data


def classify(rel: str) -> str:
    if GENERATED_PATH.search(rel):
        return "generated"
    if THIRD_PARTY_PATH.search(rel):
        return "third-party"
    return "first-party"


def load_allow(path: str | None) -> dict[str, list[re.Pattern]]:
    allow: dict[str, list[re.Pattern]] = {"emails": [], "handles": [], "paths": [], "lines": []}
    if not path:
        return allow
    with open(path, encoding="utf-8") as fh:
        raw = json.load(fh)
    for key in allow:
        allow[key] = [re.compile(p) for p in raw.get(key, [])]
    return allow


def sweep(root: str, skip_dirs: set[str], allow: dict, max_hits: int) -> dict:
    hits: dict[str, list[dict]] = defaultdict(list)
    per_file: Counter = Counter()
    per_class: Counter = Counter()
    aggregates: dict[str, Counter] = {cat: Counter() for cat in AGGREGATE}
    notice_files: list[str] = []
    skipped_trees: list[str] = []
    for dirpath, dirnames, filenames in os.walk(root):
        rel_dir = os.path.relpath(dirpath, root).replace(os.sep, "/")
        at_root = rel_dir == "."
        kept = []
        for d in dirnames:
            if d in skip_dirs or (at_root and d in SKIP_ROOT_ONLY):
                skipped_trees.append((rel_dir + "/" + d).lstrip("./"))
            else:
                kept.append(d)
        dirnames[:] = kept
        for name in filenames:
            full = os.path.join(dirpath, name)
            rel = os.path.relpath(full, root).replace(os.sep, "/")
            if any(p.search(rel) for p in allow["paths"]):
                continue
            if NOTICE_FILE.search(rel):
                notice_files.append(rel)
            data = is_text(full)
            if data is None:
                continue
            text = data.decode("utf-8", errors="replace")
            klass = classify(rel)
            is_code = os.path.splitext(name)[1].lower() in CODE_EXT
            for lineno, line in enumerate(text.splitlines(), 1):
                if any(p.search(line) for p in allow["lines"]):
                    continue
                for cat, rx in CATEGORIES.items():
                    for m in rx.finditer(line):
                        val = m.group(0)
                        if cat == "email" and (PLACEHOLDER_EMAIL.search(val) or PLACEHOLDER_LOCAL.match(val) or any(p.search(val) for p in allow["emails"])):
                            continue
                        if cat == "home-path" and PLACEHOLDER_USER.search(val):
                            continue
                        if cat in AGGREGATE:
                            key = val if cat != "scoped-package" else val.split("/")[0]
                            if cat == "repo-url":
                                key = "/".join(val.split("/")[:4])
                            aggregates[cat][(key, klass)] += 1
                            continue
                        record(hits, per_file, per_class, cat, rel, lineno, line, val, klass, max_hits)
                if not is_code or COMMENT_HINT.match(line):
                    for m in HANDLE.finditer(line):
                        h = m.group(1)
                        if h.lower() in IGNORE_HANDLES or any(p.search("@" + h) for p in allow["handles"]):
                            continue
                        record(hits, per_file, per_class, "handle", rel, lineno, line, "@" + h, klass, max_hits)
    return {"hits": hits, "per_file": per_file, "per_class": per_class, "aggregates": aggregates,
            "notice_files": sorted(notice_files), "skipped_trees": sorted(skipped_trees)}


def record(hits, per_file, per_class, cat, rel, lineno, line, val, klass, max_hits):
    per_file[rel] += 1
    per_class[(cat, klass)] += 1
    if len(hits[cat]) < max_hits * 50:
        hits[cat].append({"path": rel, "line": lineno, "match": val, "class": klass,
                          "excerpt": line.strip()[:160]})


def git_identities(root: str) -> dict:
    if not os.path.isdir(os.path.join(root, ".git")):
        return {"available": False}
    try:
        out = subprocess.run(["git", "-C", root, "log", "--format=%an <%ae>"],
                             capture_output=True, text=True, check=True).stdout
    except (OSError, subprocess.CalledProcessError) as exc:
        return {"available": False, "error": str(exc)}
    counts = Counter(l.strip() for l in out.splitlines() if l.strip())
    return {"available": True, "commits": sum(counts.values()),
            "identities": [{"identity": k, "commits": v} for k, v in counts.most_common()]}


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("root")
    ap.add_argument("--json", dest="json_out")
    ap.add_argument("--allow")
    ap.add_argument("--exclude-dir", action="append", default=[])
    ap.add_argument("--git", action="store_true", help="also census git author identities")
    ap.add_argument("--max-hits", type=int, default=8, help="sample hits printed per category")
    args = ap.parse_args()

    root = os.path.abspath(args.root)
    skip = SKIP_DIRS_DEFAULT | set(args.exclude_dir)
    allow = load_allow(args.allow)
    result = sweep(root, skip, allow, args.max_hits)
    if args.git:
        result["git"] = git_identities(root)

    hits, per_class = result["hits"], result["per_class"]
    total = sum(per_class.values())
    print(f"root: {root}")
    print(f"total hits: {total} across {len(result['per_file'])} files")
    print("skipped trees (generated or dependency roots, not scanned):", ", ".join(result["skipped_trees"]) or "none")
    print("notice-bearing files present:", ", ".join(result["notice_files"]) or "none")
    print()
    print("category            first-party  third-party  generated")
    for cat in list(CATEGORIES) + ["handle"]:
        fp, tp, gen = (per_class[(cat, c)] for c in ("first-party", "third-party", "generated"))
        if fp or tp or gen:
            print(f"{cat:<19} {fp:>11}  {tp:>11}  {gen:>9}")
    print()
    for cat, items in hits.items():
        firsts = [h for h in items if h["class"] == "first-party"][: args.max_hits]
        if not firsts:
            continue
        print(f"[{cat}] first-party samples:")
        for h in firsts:
            print(f"  {h['path']}:{h['line']}  {h['match']}  |  {h['excerpt'][:100]}")
    for cat, counter in result["aggregates"].items():
        if not counter:
            continue
        print(f"\n[{cat}] unique values (judge each: dependency reference, upstream tool, or attribution):")
        for (key, klass), n in counter.most_common(20):
            print(f"  {n:>6}  {key}  ({klass})")
    if result.get("git", {}).get("available"):
        g = result["git"]
        print(f"\ngit identities: {len(g['identities'])} distinct across {g['commits']} commits")
        for row in g["identities"][:10]:
            print(f"  {row['commits']:>6}  {row['identity']}")
    print("\ntop files:")
    for path, n in result["per_file"].most_common(15):
        print(f"  {n:>5}  {path}  ({classify(path)})")

    if args.json_out:
        serial = {
            "root": root,
            "total_hits": total,
            "per_class": [{"category": c, "class": k, "count": v} for (c, k), v in per_class.items()],
            "per_file": [{"path": p, "hits": n, "class": classify(p)} for p, n in result["per_file"].most_common()],
            "notice_files": result["notice_files"],
            "skipped_trees": result["skipped_trees"],
            "hits": {k: v for k, v in hits.items()},
            "aggregates": {cat: [{"value": k, "class": c, "count": n} for (k, c), n in counter.most_common()]
                           for cat, counter in result["aggregates"].items()},
            "git": result.get("git"),
        }
        with open(args.json_out, "w", encoding="utf-8") as fh:
            json.dump(serial, fh, indent=2)
        print(f"\nfull report written to {args.json_out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
