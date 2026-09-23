#!/usr/bin/env python3
"""Copy generated ZCode agents into ~/.zcode/agents for user-scope use.

ZCode loads user-scope agents from ~/.zcode/agents, and its scanner only
picks up regular files: symlinked entries are ignored. Run
learn/scripts/generate-harnesses.py first; this script then deploys the
generated .zcode/agents output as real copies. Re-run it after every
regeneration to pick up new or changed Bees.

The install is additive: existing files with matching names are replaced
and unrelated files in ~/.zcode/agents are left alone.
"""

from __future__ import annotations

import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / ".zcode" / "agents"
TARGET = Path.home() / ".zcode" / "agents"


def main() -> None:
    if not SOURCE.is_dir():
        raise SystemExit(
            "No generated .zcode/agents found. "
            "Run 'python learn/scripts/generate-harnesses.py' first."
        )
    files = sorted(SOURCE.glob("*.md"))
    if not files:
        raise SystemExit("Generated .zcode/agents is empty; nothing to install.")
    TARGET.mkdir(parents=True, exist_ok=True)
    for path in files:
        target = TARGET / path.name
        if target.is_symlink():
            target.unlink()
        shutil.copy2(path, target)
    print(f"Installed {len(files)} ZCode agents into {TARGET}.")
    print("Restart ZCode to load them.")


if __name__ == "__main__":
    main()
