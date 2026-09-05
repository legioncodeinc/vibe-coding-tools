# Tauri 2.11.5 Runtime Wry Manifest
- URL: https://raw.githubusercontent.com/tauri-apps/tauri/tauri-v2.11.5/crates/tauri-runtime-wry/Cargo.toml
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Source type: official-docs
- Material: immutable tagged source manifest

## Captured source material

```text
wry = { version = "0.55.0", default-features = false, features = [
tao = { version = "0.35.0", default-features = false, features = ["rwh_06"] }
tauri-runtime = { version = "2.11.3", path = "../tauri-runtime" }
```

## Archived evidence

The `tauri-v2.11.5` manifest declares Wry 0.55.0 with default features disabled and declares Tao 0.35.0 with default features disabled. The same manifest depends on `tauri-runtime` 2.11.3.

## Archive interpretation

Standalone Wry or Tao releases published later are adjacent ecosystem information, not proof that the tagged Tauri core uses their APIs. Inspect the target Tauri manifest or resolved lockfile before relying on a runtime feature.
