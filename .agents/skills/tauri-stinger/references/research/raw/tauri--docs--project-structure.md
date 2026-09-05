# Tauri Project Structure
- URL: https://v2.tauri.app/start/project-structure/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Page updated: 2025-09-26
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

```text
src-tauri/Cargo.toml
src-tauri/Cargo.lock
src-tauri/build.rs
src-tauri/tauri.conf.json
src-tauri/src/main.rs
src-tauri/src/lib.rs
src-tauri/capabilities/
```

## Archived evidence

A typical project has a web frontend at the repository root and a normal Cargo project in `src-tauri/`. The Tauri side includes `Cargo.toml`, `Cargo.lock`, `build.rs`, `tauri.conf.json`, `src/main.rs`, `src/lib.rs`, `icons/`, and `capabilities/`.

`tauri.conf.json` is both application configuration and the marker used by the CLI to find the Rust project. `build.rs` normally calls `tauri_build::build()`. Shared desktop and mobile startup belongs in `lib.rs` under a function marked `#[cfg_attr(mobile, tauri::mobile_entry_point)]`; desktop `main.rs` calls the library entry point.

The frontend builds to static assets before the Rust application embeds them.
