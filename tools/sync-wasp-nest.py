#!/usr/bin/env python3
"""Sync the wasp-nest-core plugin from this clone to every harness surface
on the local machine, or report drift with --check.

Managed surfaces (managed = created/updated only, never deleted):
  1. ZCode plugin cache   ~/.zcode/cli/plugins/cache/wasp-nest/wasp-nest-core/<ver>
  2. Claude plugin cache  ~/.claude/plugins/cache/wasp-nest/wasp-nest-core/<ver>
  3. Paired stingers      ~/.agents/skills/<name>-stinger and ~/.claude/skills/<name>-stinger
  4. Claude drone agents  ~/.claude/agents/*-wasp-drone.md (only where wasp
                          drones are already the local pattern; the desk keeps
                          this dir drone-free by choice)
  5. Codex role TOMLs     ~/.codex/agents via the plugin's own register hook

The overlay version is read from plugin.json. The 2.0.1 cache dirs are the
git-marketplace installs and are never touched. Run from any checkout of this
repo on any device; the fork branch you have checked out is what deploys.

Usage:
  python3 tools/sync-wasp-nest.py            # deploy
  python3 tools/sync-wasp-nest.py --check    # drift report only, exit 1 on drift
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
PLUGIN = REPO_ROOT / "plugins" / "wasp-nest-core"
HOME = Path.home()
ZCODE_CACHE = HOME / ".zcode/cli/plugins/cache/wasp-nest/wasp-nest-core"
CLAUDE_CACHE = HOME / ".claude/plugins/cache/wasp-nest/wasp-nest-core"
AGENTS_SKILLS = HOME / ".agents/skills"
CLAUDE_SKILLS = HOME / ".claude/skills"
CLAUDE_AGENTS = HOME / ".claude/agents"
CODEX_AGENTS = Path(os.environ.get("CODEX_HOME", HOME / ".codex")) / "agents"


def plugin_version() -> str:
    return json.loads((PLUGIN / "plugin.json").read_text())["version"]


def paired_stingers() -> list[Path]:
    """Plugin skill dirs whose name is <stem>-stinger with a paired drone md."""
    out = []
    for skill in sorted((PLUGIN / "skills").iterdir()):
        if skill.is_dir() and skill.name.endswith("-stinger"):
            drone = PLUGIN / "agents" / (skill.name[: -len("-stinger")] + "-wasp-drone.md")
            if drone.is_file():
                out.append(skill)
    return out


def sha256(path: Path) -> str | None:
    if not path.is_file():
        return None
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest()


def tree_files(root: Path) -> dict[str, str]:
    """Relative path -> sha256 for every file under root (symlinks skipped)."""
    out: dict[str, str] = {}
    if not root.is_dir():
        return out
    for path in sorted(root.rglob("*")):
        if path.is_file() and not path.is_symlink():
            out[str(path.relative_to(root))] = sha256(path)
    return out


def compare(source: Path, target: Path, label: str, check: bool) -> tuple[int, int]:
    """Mirror source tree into target. Returns (synced, missing) file counts."""
    want = tree_files(source)
    have = tree_files(target)
    synced = missing = 0
    for rel, digest in want.items():
        dst = target / rel
        if have.get(rel) == digest:
            continue
        missing += 1
        if not check:
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source / rel, dst)
            synced += 1
            print(f"  synced {label}/{rel}")
    if missing == 0:
        print(f"  {label}: clean ({len(want)} files)")
    elif check:
        print(f"  {label}: DRIFT ({missing} files differ or missing)")
    return synced, missing


def deploy_stinger_dir(skill: Path, base: Path, label: str, check: bool) -> int:
    if not base.is_dir():
        return 0
    _, missing = compare(skill, base / skill.name, label, check)
    return missing


def run_register_hook(check: bool) -> int:
    hook = PLUGIN / "hooks" / "register-codex-agents.py"
    env = dict(os.environ, PLUGIN_ROOT=str(PLUGIN))
    result = subprocess.run(
        [sys.executable, str(hook), "--report"],
        env=env, capture_output=True, text=True, check=False,
    )
    report = result.stdout.strip() or '{"installed": 0}'
    print(f"  codex register hook: {report} (agents dir now {len(list(CODEX_AGENTS.glob('*.toml')))} TOMLs)")
    if check:
        installed = json.loads(report).get("installed", 0)
        return 1 if installed else 0
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="report drift only")
    args = parser.parse_args()
    mode = "CHECK" if args.check else "DEPLOY"
    version = plugin_version()

    dirty = subprocess.run(
        ["git", "-C", str(REPO_ROOT), "status", "--porcelain"],
        capture_output=True, text=True, check=False,
    ).stdout.strip()
    branch = subprocess.run(
        ["git", "-C", str(REPO_ROOT), "rev-parse", "--abbrev-ref", "HEAD"],
        capture_output=True, text=True, check=False,
    ).stdout.strip()

    print(f"wasp-nest sync [{mode}] branch={branch} overlay={version}")
    if dirty and not args.check:
        print(f"WARNING: working tree has uncommitted changes; deploying dirty state:")
        for line in dirty.splitlines()[:10]:
            print(f"  {line}")

    drift = 0
    for cache in (ZCODE_CACHE, CLAUDE_CACHE):
        overlay = cache / version
        if not cache.is_dir():
            print(f"  {cache}: no marketplace cache, skipped")
            continue
        if not overlay.is_dir():
            print(f"  {overlay.name}: overlay dir missing, run once with deploy mode")
            drift += 1
            continue
        harness = ".zcode" if ".zcode" in cache.parts else ".claude"
        _, missing = compare(PLUGIN, overlay, f"cache:{harness}/{version}", args.check)
        drift += missing

    for skill in paired_stingers():
        drift += deploy_stinger_dir(skill, AGENTS_SKILLS, ".agents/skills", args.check)
        drift += deploy_stinger_dir(skill, CLAUDE_SKILLS, ".claude/skills", args.check)

    existing_drones = list(CLAUDE_AGENTS.glob("*-wasp-drone.md")) if CLAUDE_AGENTS.is_dir() else []
    if existing_drones:
        source = PLUGIN / "agents"
        want = {p.name: sha256(p) for p in source.glob("*-wasp-drone.md")}
        missing = 0
        for name, digest in want.items():
            dst = CLAUDE_AGENTS / name
            if sha256(dst) != digest:
                missing += 1
                if not args.check:
                    shutil.copy2(source / name, dst)
                    print(f"  synced .claude/agents/{name}")
        print(f"  .claude/agents: {'clean' if missing == 0 else f'{missing} drifted'} ({len(want)} managed drones)")
        drift += missing

    drift += run_register_hook(args.check)

    roster = PLUGIN / "skills/pest-controller-suit/SKILL.md"
    line = next((l for l in roster.read_text().splitlines() if "Drones registered:" in l), "")
    print(f"  roster: {line.strip('*')}")
    if drift:
        print(f"RESULT: {'DRIFT' if args.check else 'DEPLOYED'} ({drift} file(s) {'need attention' if args.check else 'fixed'})")
        return 1 if args.check else 0
    print("RESULT: clean, all surfaces match this checkout")
    return 0


if __name__ == "__main__":
    sys.exit(main())
