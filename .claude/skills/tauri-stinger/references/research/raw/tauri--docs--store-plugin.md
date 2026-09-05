# Tauri Store Plugin
- URL: https://v2.tauri.app/plugin/store/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Page updated: 2025-11-10
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

```ts
const store = await load('store.json', { autoSave: false });
await store.set('some-key', { value: 5 });
await store.save();
```

## Archived evidence

Store is an asynchronous persistent key-value store saved in application data. `load` creates or reuses a store. `autoSave: false` requires explicit `save`; the default or a numeric value saves after a debounce, documented as 100 ms by default. Graceful exit also saves pending state.

Rust values must be `serde_json::Value` for JavaScript compatibility. The `store:default` permission set enables every operation, including set, delete, clear, reset, and save.

## Archive interpretation

Store fits preferences and small durable state. The page does not claim that the storage file is encrypted, and its default permission set is not read-only.
