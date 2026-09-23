#!/usr/bin/env python3
"""Create reproducible public marketplace and per-plugin release archives."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FIXED_ZIP_TIME = (2020, 1, 1, 0, 0, 0)


def archive(path: Path, files: list[Path], root: Path) -> None:
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as output:
        for source in sorted(files):
            item = zipfile.ZipInfo(source.relative_to(root).as_posix(), FIXED_ZIP_TIME)
            item.compress_type = zipfile.ZIP_DEFLATED
            item.external_attr = 0o644 << 16
            output.writestr(item, source.read_bytes())


def package(root: Path, out: Path) -> list[Path]:
    root, out = root.resolve(), out.resolve()
    if out in {root, Path(out.anchor), Path.home().resolve()}:
        raise ValueError("release output must be a dedicated directory")
    if out.exists() and any(out.iterdir()):
        raise ValueError(f"release output is not empty: {out}")
    version = (root / "VERSION").read_text(encoding="utf-8").strip()
    if not re.fullmatch(r"\d+\.\d+\.\d+", version):
        raise ValueError("VERSION must be a plain semantic version")
    market = root / ".claude-plugin" / "marketplace.json"
    if not market.is_file():
        raise ValueError("Claude marketplace catalog is missing")
    entries = json.loads(market.read_text(encoding="utf-8"))["plugins"]
    out.mkdir(parents=True, exist_ok=True)
    archives: list[Path] = []
    for entry in entries:
        name = entry["name"]
        folder = root / "plugins" / name
        if not (folder / ".claude-plugin" / "plugin.json").is_file():
            raise ValueError(f"plugin not found: {name}")
        archive_name = f"wasp-nest-core-{version}.zip" if name == "wasp-nest-core" else f"wasp-nest-pack-{name}-{version}.zip"
        target = out / archive_name
        archive(target, [p for p in folder.rglob("*") if p.is_file()], root)
        archives.append(target)
    all_files = [
        p for p in root.rglob("*") if p.is_file()
        and root / ".git" not in p.parents
        and out not in p.parents
    ]
    target = out / f"wasp-nest-marketplace-{version}.zip"
    archive(target, all_files, root)
    archives.append(target)
    checksums = "".join(f"{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.name}\n" for p in sorted(archives))
    (out / "SHA256SUMS").write_text(checksums, encoding="utf-8")
    return archives


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    archives = package(args.root, args.out)
    print(f"packed {len(archives)} public archives")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
