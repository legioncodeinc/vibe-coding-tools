#!/usr/bin/env python3
"""Back up and merge personalized Wasp Nest home instructions after consent."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import stat
import tempfile
from datetime import datetime, timezone
from pathlib import Path


START = "<!-- legioncodeinc:global-instructions:start -->"
END = "<!-- legioncodeinc:global-instructions:end -->"
LOCK_NAME = ".legioncodeinc.lock"
EXTRA_AGENTS_HOMES = (".antigravity", ".devin", ".manus", ".shadow", ".grok", ".hermes")


def validate_value(label: str, value: str) -> str:
    value = value.strip()
    if not value or len(value) > 120 or any(ord(char) < 32 or char in "{}" for char in value):
        raise ValueError(f"{label} must be 1-120 characters without controls or braces")
    return value


def find_templates(script: Path) -> Path:
    for candidate in (script.parents[3] / "templates", script.parents[4]):
        if (candidate / "AGENTS_template.md").is_file() and (candidate / "CLAUDE_template.md").is_file():
            return candidate
    raise FileNotFoundError("AGENTS_template.md and CLAUDE_template.md were not bundled")


def targets(home: Path) -> list[tuple[Path, str]]:
    result = [(home / "AGENTS.md", "AGENTS"), (home / "CLAUDE.md", "CLAUDE")]
    for directory, filename, kind in (
        (".claude", "AGENTS.md", "AGENTS"),
        (".claude", "CLAUDE.md", "CLAUDE"),
        (".codex", "AGENTS.md", "AGENTS"),
        (".zcode", "AGENTS.md", "AGENTS"),
        (".gemini", "GEMINI.md", "AGENTS"),
    ):
        if (home / directory).is_dir():
            result.append((home / directory / filename, kind))
    for directory in EXTRA_AGENTS_HOMES:
        if (home / directory).is_dir():
            result.append((home / directory / "AGENTS.md", "AGENTS"))
    return result


def merge(existing: str, content: str) -> str:
    block = f"{START}\n{content.rstrip()}\n{END}"
    if START in existing or END in existing:
        if existing.count(START) != 1 or existing.count(END) != 1:
            raise ValueError("an instruction file contains incomplete Wasp Nest markers")
        start, end = existing.index(START), existing.index(END)
        if start >= end:
            raise ValueError("an instruction file has reversed Wasp Nest markers")
        return existing[:start] + block + existing[end + len(END):]
    if not existing.strip():
        return block + "\n"
    return existing.rstrip("\n") + "\n\n" + block + "\n"


def atomic_write(path: Path, content: str, mode: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=path.parent, delete=False) as file:
        temporary = Path(file.name)
        file.write(content)
    try:
        os.chmod(temporary, mode)
        os.replace(temporary, path)
    finally:
        temporary.unlink(missing_ok=True)


def install(home: Path, template_dir: Path, user: str, org: str) -> dict:
    home = home.resolve(strict=True)
    user = validate_value("user", user)
    org = validate_value("org", org)
    lock = home / LOCK_NAME
    if lock.is_symlink():
        raise ValueError(f"refusing symlinked lock file: {lock}")
    if lock.exists():
        if not lock.is_file():
            raise ValueError(f"lock path is not a file: {lock}")
        return {"status": "already-installed", "lock": str(lock), "changed": []}

    templates = {}
    hashes = {}
    for kind in ("AGENTS", "CLAUDE"):
        raw = (template_dir / f"{kind}_template.md").read_text(encoding="utf-8")
        if "{user}" not in raw or "{org}" not in raw:
            raise ValueError(f"{kind}_template.md must contain both personalization variables")
        templates[kind] = raw.replace("{user}", user).replace("{org}", org)
        hashes[kind] = hashlib.sha256(raw.encode("utf-8")).hexdigest()

    changes = []
    for path, kind in targets(home):
        if path.is_symlink() or not path.parent.resolve().is_relative_to(home):
            raise ValueError(f"refusing symlinked or out-of-home target: {path}")
        if path.exists() and not path.is_file():
            raise ValueError(f"instruction target is not a file: {path}")
        previous = path.read_text(encoding="utf-8") if path.exists() else ""
        updated = merge(previous, templates[kind])
        if updated != previous:
            mode = stat.S_IMODE(path.stat().st_mode) if path.exists() else 0o644
            changes.append((path, previous, updated, mode))

    backup_dir = None
    if any(path.exists() for path, _, _, _ in changes):
        backup_root = home / ".legioncodeinc"
        if backup_root.is_symlink() or (backup_root.exists() and not backup_root.is_dir()):
            raise ValueError(f"refusing unsafe backup directory: {backup_root}")
        backup_parent = backup_root / "backups"
        if backup_parent.is_symlink() or (backup_parent.exists() and not backup_parent.is_dir()):
            raise ValueError(f"refusing unsafe backup directory: {backup_parent}")
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
        backup_dir = backup_parent / f"global-instructions-{timestamp}-{os.getpid()}"
        for path, _, _, _ in changes:
            if path.exists():
                backup = backup_dir / path.relative_to(home)
                backup.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(path, backup)

    for path, _, updated, mode in changes:
        atomic_write(path, updated, mode)

    record = {
        "schema": 1,
        "user": user,
        "org": org,
        "installed_at": datetime.now(timezone.utc).isoformat(),
        "template_sha256": hashes,
        "targets": [str(path.relative_to(home)) for path, _ in targets(home)],
        "backup_dir": str(backup_dir) if backup_dir else None,
    }
    descriptor = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    with os.fdopen(descriptor, "w", encoding="utf-8") as file:
        json.dump(record, file, indent=2)
        file.write("\n")
    return {"status": "installed", "lock": str(lock), "changed": [str(path) for path, _, _, _ in changes], "backup_dir": record["backup_dir"]}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--user", required=True, help="name supplied by the user after consent")
    parser.add_argument("--org", required=True, help="organization supplied by the user after consent")
    parser.add_argument("--home", type=Path, default=Path.home(), help="home directory, primarily for tests")
    parser.add_argument("--templates", type=Path, help="directory holding AGENTS_template.md and CLAUDE_template.md")
    args = parser.parse_args()
    template_dir = args.templates or find_templates(Path(__file__).resolve())
    try:
        result = install(args.home, template_dir, args.user, args.org)
    except (OSError, ValueError) as error:
        parser.exit(1, f"global instruction setup failed: {error}\n")
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
