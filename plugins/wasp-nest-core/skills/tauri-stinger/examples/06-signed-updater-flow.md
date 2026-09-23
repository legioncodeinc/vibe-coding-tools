# Example: Signed Desktop Updater Flow

Updater signatures are mandatory and separate from Windows or macOS application code signing. This example uses placeholders intentionally. Refresh package releases and deployment URLs before implementation.

## Application configuration

```json
{
  "bundle": {
    "createUpdaterArtifacts": true
  },
  "plugins": {
    "updater": {
      "pubkey": "PUBLIC_UPDATER_KEY_CONTENT",
      "endpoints": [
        "https://updates.example.invalid/{{target}}/{{arch}}/{{current_version}}"
      ]
    }
  }
}
```

The public key can ship in configuration. The private key and password belong in the protected release environment, never in the repository, frontend code, or packaged resources.

## Static metadata shape

```json
{
  "version": "NEXT_SEMVER",
  "notes": "Release notes",
  "pub_date": "RFC3339_TIMESTAMP",
  "platforms": {
    "TARGET_KEY": {
      "url": "HTTPS_ARTIFACT_URL",
      "signature": "ACTUAL_SIG_FILE_CONTENT"
    }
  }
}
```

The signature field contains signature content, not a path or URL. For a dynamic server, return 204 for no update or 200 with `version`, `url`, and `signature`.

## Frontend flow

```ts
import { check } from '@tauri-apps/plugin-updater';

export async function installAvailableUpdate(): Promise<boolean> {
  const update = await check();
  if (!update) return false;

  await update.downloadAndInstall((event) => {
    recordUpdaterProgress(event);
  });

  return true;
}
```

## Release proof

- Protect and back up the updater private key. Existing installations reject future releases if the trusted key changes without a planned rotation path.
- Regenerate an empty-password key created by CLI 2.9.3 through 2.10.0.
- Verify application code signing and updater signing separately.
- Test valid update, invalid signature, 204, offline, proxy, partial download, installer startup failure, relaunch choice, and rollback policy.
- On Windows, inspect signatures on the final installer and embedded components.
- On macOS, verify application signature, notarization, stapling, updater artifact, and signature.
- Do not use this updater flow for Android or iOS. Use platform distribution systems.

Source basis: [Updater docs](../references/research/raw/tauri--docs--updater-plugin.md), [Updater 2.11.0](../references/research/raw/tauri--release--updater-2.11.0.md), [CLI notes](../references/research/raw/tauri--release--cli-changelog.md), and [Bundler 2.9.3](../references/research/raw/tauri--release--bundler-2.9.3.md).
