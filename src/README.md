# Honeybee source package

This folder is the canonical, portable source package assembled from the audited local libraries and attached repositories. Installed harness folders are disposable outputs generated from this source. Every imported active asset has a recorded origin, and every legacy or incomplete agent or skill lives separately under `quarantine/`.

## Start here

- [Merge ledger](MERGE_LEDGER.md) records the decisions and copy actions.
- [Asset hierarchy](ASSET_HIERARCHY.md) defines the command, hive, worker-bee, and stinger relationship.
- [Common-folder inventory](reports/common-folder-inventory.md) records every discovered source asset.
- [Cumulative net-gain report](reports/net-gain-report.md) records what entered `src`, what was quarantined, and what remained canonical or superseded.
- [Plugin-category proposal](reports/plugin-categories.md) groups assets by the outcome a marketplace user wants.

## Portable layout

`commands/beekeeper.md` is the general orchestration entrypoint. `commands/smoke-it.md` is the PRD-completion entrypoint. Both route through `skills/beekeeper-suit/`.

Active assets are in `agents/`, `skills/`, `commands/`, `hooks/`, and `rules/`. Quarantine contains only unpaired or unresolved legacy agents and skills. It is not part of an installable hive.

Internal navigation in active commands, agents, and skill entrypoints uses paths relative to this package. Historical research sources and literal external harness locations retain their original text when changing them would alter source evidence or instructions about a third-party product.

## Harness source templates

Keep shared harness entry files and manifests in [`harnesses/`](harnesses/). The generator can materialize these templates alongside local adapters. Root harness folders and generated entry files are ignored and must not be committed.
