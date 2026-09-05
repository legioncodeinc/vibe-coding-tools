# Tauri Plugin Development
- URL: https://v2.tauri.app/develop/plugins/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Page updated: 2026-08-20
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

```text
npx @tauri-apps/cli plugin new [name]
```

```rust
tauri_plugin::Builder::new(COMMANDS).build();
```

## Archived evidence

A Tauri plugin can expose Rust commands and events, hook lifecycle events, carry optional JavaScript bindings, and include Android and iOS implementations. The project shape separates Rust commands, desktop and mobile modules, permission files, JavaScript guest code, Android, and iOS sources.

Permission identifiers use lowercase ASCII letters, digits, and hyphens. Command permissions can be generated from a command list. Scope schemas use `schemars`; command and global scopes must be read and enforced by code. The guide recommends checking both global and command scopes.

## Archive interpretation

A reusable provider integration or native inference bridge may justify a plugin. Application-only logic should remain application commands until reuse or native platform bridging creates real value.
