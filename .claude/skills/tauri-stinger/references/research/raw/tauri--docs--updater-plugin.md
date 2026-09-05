# Tauri Updater Plugin
- URL: https://v2.tauri.app/plugin/updater/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

```json
{ "bundle": { "createUpdaterArtifacts": true } }
```

- Static required fields: `version`, `platforms.[target].url`, `platforms.[target].signature`
- Dynamic no-update response: `204 No Content`
- Signature value: content of the generated `.sig` file

## Archived evidence

The updater supports Windows, Linux, and macOS, not Android or iOS. `bundle.createUpdaterArtifacts` enables updater artifacts. Already-distributed v1 applications may use `v1Compatible` artifacts during migration.

Updater signature verification cannot be disabled. The public key belongs in application configuration; the private key signs release artifacts and must remain protected. Losing the private key prevents publishing updates accepted by existing installations.

Static update metadata requires a SemVer version and per-platform URL plus signature. Dynamic servers return 204 for no update or 200 with URL, version, and signature. The signature field contains the actual `.sig` content, not a link.

The client advances to another endpoint only after a non-2xx response.

## Archive interpretation

Updater signing and operating-system code signing are separate controls. Both need release evidence for desktop distribution.
