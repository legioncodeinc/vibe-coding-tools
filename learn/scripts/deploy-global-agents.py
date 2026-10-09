#!/usr/bin/env python3
"""Deploy the canonical global AGENTS.md to every harness on both devices.

Source of truth: src/harnesses/global-agents.md plus the per-device tail in
src/harnesses/device-tails/<machine>.md. Targets ~/.zcode/AGENTS.md,
~/.claude/AGENTS.md, and ~/.codex/AGENTS.md on this machine and on macdev
(over ssh). Existing files are kept as timestamped .bak copies. Re-run after
any edit to the canonical file so all six copies stay in sync.

Usage:
    python3 learn/scripts/deploy-global-agents.py            # both devices
    python3 learn/scripts/deploy-global-agents.py --local-only
"""

from __future__ import annotations

import hashlib
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BODY = ROOT / "src" / "harnesses" / "global-agents.md"
TAILS = {
    "chris-macbook-pro": ROOT / "src" / "harnesses" / "device-tails" / "chris-macbook-pro.md",
    "macdev": ROOT / "src" / "harnesses" / "device-tails" / "macdev.md",
}
TARGETS = [".zcode/AGENTS.md", ".claude/AGENTS.md", ".codex/AGENTS.md"]
MACDEV = "macdev@macdevs-macbook-pro.tail8264da.ts.net"


def run(cmd: list[str], stdin: str | None = None) -> str:
    proc = subprocess.run(cmd, input=stdin, capture_output=True, text=True)
    if proc.returncode != 0:
        raise SystemExit(f"FAILED: {' '.join(cmd)}\n{proc.stderr.strip()}")
    return proc.stdout.strip()


def content_for(machine: str) -> str:
    return (BODY.read_text() + "\n" + TAILS[machine].read_text()).rstrip() + "\n"


def deploy_local() -> None:
    content = content_for("chris-macbook-pro")
    digest = hashlib.md5(content.encode()).hexdigest()
    for rel in TARGETS:
        target = Path.home() / rel
        if target.exists():
            bak = target.with_name(target.name + ".bak-" + time.strftime("%Y%m%d-%H%M%S"))
            bak.write_text(target.read_text())
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content)
        print(f"chris-macbook-pro {rel}: wrote {len(content.splitlines())} lines, md5 {digest}")


def deploy_remote() -> None:
    content = content_for("macdev")
    digest = hashlib.md5(content.encode()).hexdigest()
    stamp = time.strftime("%Y%m%d-%H%M%S")
    ssh = ["ssh", "-o", "ConnectTimeout=8", MACDEV]
    for rel in TARGETS:
        run(ssh + [f"test -f ~/{rel} && cp ~/{rel} ~/{rel}.bak-{stamp} || true"])
        run(ssh + [f"mkdir -p ~/.{rel.split('/')[1]} && cat > ~/{rel}"], stdin=content)
        remote = run(ssh + [f"md5 -q ~/{rel}"])
        status = "OK" if remote == digest else f"MISMATCH (remote {remote})"
        print(f"macdev {rel}: {status}")


def main() -> None:
    for path in [BODY, *TAILS.values()]:
        if not path.is_file():
            raise SystemExit(f"Missing source file: {path}")
    if "--local-only" not in sys.argv:
        deploy_remote()
    deploy_local()
    print("Deploy complete. Open new harness sessions to load the new rules.")


if __name__ == "__main__":
    main()
