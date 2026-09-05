# Windows Code Signing
- URL: https://v2.tauri.app/distribute/sign/windows/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Page updated: 2026-07-08
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

- Configuration path: `bundle.windows.signCommand`
- Substitution passed to a custom signer: `%1`
- Azure credential names: `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_TENANT_ID`

## Archived evidence

Windows code signing supports store distribution and reduces untrusted-publisher warnings, but it is not required merely to execute an application. Certificate reputation and certificate type affect SmartScreen behavior.

Tauri supports native signing, Azure-backed signing, and a custom `bundle.windows.signCommand`. Cross-compiling Windows installers from Linux or macOS requires a custom signing command because the default implementation runs only on Windows.

## Archive interpretation

Treat a successful build as separate from signature and installer verification. Inspect the final executable, installer, and embedded components.
