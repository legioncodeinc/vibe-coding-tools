# Tauri Stronghold Plugin
- URL: https://v2.tauri.app/plugin/stronghold/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

```rust
tauri_plugin_stronghold::Builder::with_argon2(&salt_path).build()
```

```ts
const stronghold = await Stronghold.load(vaultPath, vaultPassword);
```

## Archived evidence

Tauri describes Stronghold as secret and key storage backed by the IOTA Stronghold engine. It supports Windows, Linux, macOS, Android, and iOS.

Initialization requires a password hash function that yields a 32-byte key. The plugin offers an Argon2-based builder and permits custom key derivation. Applications create or load clients, insert byte records, save the vault, and explicitly configure capabilities.

## Archive interpretation

Stronghold is the Tauri-provided secret store, but applications still own password acquisition, key derivation, lock state, logging, backup, and recovery behavior.
