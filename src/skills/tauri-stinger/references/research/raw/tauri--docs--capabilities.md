# Tauri Capabilities
- URL: https://v2.tauri.app/security/capabilities/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Page updated: 2026-09-03
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

```json
{
  "identifier": "main-capability",
  "windows": ["main"],
  "permissions": ["core:window:allow-set-title"]
}
```

The source states that commands registered only through `invoke_handler` are allowed to all application windows and WebViews by default.

## Archived evidence

Capabilities bind permissions to named windows or WebViews and may limit them by platform. Files live under `src-tauri/capabilities/` as JSON or TOML. Files in that directory are enabled by default unless `app.security.capabilities` explicitly selects identifiers.

When a window or WebView belongs to multiple capabilities, its effective permissions merge. Remote API access is absent by default and must be enabled through `remote.urls` URL patterns.

Application commands registered through `tauri::Builder::invoke_handler` are available to all application windows and WebViews by default. The page directs authors to declare commands through `tauri_build::AppManifest::commands` when they need capability permissions to constrain those custom commands.

The page warns that Linux and Android cannot distinguish an embedded iframe request from its containing window. It recommends reserving window-creation privileges for higher-trust windows.

Generated schemas in `src-tauri/gen/schemas/` support desktop, mobile, and remote capability editing.
