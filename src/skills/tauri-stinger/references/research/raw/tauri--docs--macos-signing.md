# macOS Code Signing
- URL: https://v2.tauri.app/distribute/sign/macos/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Page updated: 2026-05-17
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

```text
APPLE_SIGNING_IDENTITY
APPLE_CERTIFICATE
APPLE_CERTIFICATE_PASSWORD
APPLE_API_ISSUER
APPLE_API_KEY
APPLE_API_KEY_PATH
```

## Archived evidence

macOS code signing is required for App Store distribution and avoids the broken-app warning for browser downloads. Distribution outside the App Store with a Developer ID Application certificate also requires notarization.

Tauri accepts a keychain signing identity or `APPLE_SIGNING_IDENTITY`. CI can import a certificate from `APPLE_CERTIFICATE` and `APPLE_CERTIFICATE_PASSWORD`. Notarization accepts App Store Connect API credentials or Apple ID credentials through documented environment variables.

Ad hoc signing uses identity `-` but does not remove the user's security approval requirement.

## Archive interpretation

Signing, notarization, and updater signatures are three separate evidence items.
