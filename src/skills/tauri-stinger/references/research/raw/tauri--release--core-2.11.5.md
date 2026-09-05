# Tauri Core 2.11.5 Release
- URL: https://github.com/tauri-apps/tauri/releases/tag/tauri-v2.11.5
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Released: 2026-07-01
- Source type: official-docs
- Material: official package-specific GitHub release

## Captured source material

- Tag: `tauri-v2.11.5`
- Package: `tauri`
- Version: `2.11.5`
- Published: `2026-07-01`
- Dependency commit: `44594d6f1`

> Unpin `time` as a new fixed version `0.3.53` has been published.

## Archived evidence

Version 2.11.5 was the latest `tauri` core tag found by the cutoff. Its only authored release change unpinned the `time` crate after fixed version 0.3.53 became available. Version 2.11.4 one day earlier had temporarily constrained `time` below 0.3.52 because of a compilation failure in a transitive dependency.

## Archive interpretation

This is a dependency-only patch and is evidence of the cutoff version, not a general rule to pin or unpin `time` in consumer applications.
