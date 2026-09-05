# Tauri State Management
- URL: https://v2.tauri.app/develop/state-management/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Page updated: 2025-05-07
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

```rust
app.manage(Mutex::new(AppState::default()));
fn increase_counter(state: State<'_, Mutex<AppState>>) -> u32
```

## Archived evidence

Application state is registered with `manage` and injected into commands with `tauri::State<T>`. Code with a `Manager` implementation, including an `AppHandle`, can retrieve state outside commands.

Mutable shared state requires interior mutability such as `Mutex<T>`. Tauri already provides shared ownership for managed state, so an additional `Arc` is normally unnecessary. An async mutex is appropriate when a guard must survive an await point.

Requesting the wrong `State<T>` type causes a runtime panic rather than a compile-time error. A type alias can make the managed wrapper type consistent.
