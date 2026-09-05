# Distributing Tauri with GitHub
- URL: https://v2.tauri.app/distribute/pipelines/github/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

```yaml
- uses: tauri-apps/tauri-action@v1
```

The guide links separate Windows and macOS signing procedures from its build matrix.

## Archived evidence

The official pipeline uses `tauri-apps/tauri-action` to build platform artifacts and upload them to GitHub Releases. A platform matrix installs each operating system's native prerequisites. Code-signing setup remains in the platform-specific signing guides.

Tauri Action can generate `latest.json` for the updater when updater artifacts and signing material are configured.

## Archive interpretation

The action automates build and upload work. It does not replace dependency tests, artifact inspection, signing verification, installer smoke tests, updater rollback planning, or mobile store submission.
