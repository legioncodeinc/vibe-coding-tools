# Tauri Permissions
- URL: https://v2.tauri.app/security/permissions/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Page updated: 2026-07-20
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

```toml
[[permission]]
identifier = "my-identifier"
commands.allow = ["read_file"]
```

## Archived evidence

A permission names explicit command privileges. It can allow or deny commands, define scopes, or combine command access with scopes. A capability must reference the permission before a window or WebView receives it.

Permission sets group permissions under a reusable identifier. Application-authored permission definitions belong under `src-tauri/permissions/` and use TOML.
