# Persist AI Application State

## Purpose

Place preferences, structured history, secrets, and ephemeral runtime handles in different storage classes with explicit permissions and migrations.

## Data classification

| Data class | Default mechanism | Reason |
|---|---|---|
| UI preferences and non-secret feature choices | Store | Small file-backed key-value state |
| Conversations, messages, jobs, usage, and model metadata | SQLite through SQL or a Rust-owned database layer | Structured records, bound queries, migrations |
| User-owned provider credentials | Stronghold or platform credential store | Secret-specific storage |
| Active clients, child handles, locks, cancellation | Managed Rust state | Ephemeral process resources |
| Publisher-owned provider credential | Publisher service | Must not ship in a user-controlled client |

This is a derived application classification based on the official Store, SQL, Stronghold, and state APIs. [../references/research/raw/tauri--docs--store-plugin.md](../references/research/raw/tauri--docs--store-plugin.md) [../references/research/raw/tauri--docs--sql-plugin.md](../references/research/raw/tauri--docs--sql-plugin.md) [../references/research/raw/tauri--docs--stronghold-plugin.md](../references/research/raw/tauri--docs--stronghold-plugin.md)

## Procedure

1. Inventory every field and classify confidentiality, durability, size, query shape, retention, export, deletion, and sync requirements.
2. Keep Store for small non-secret values. The plugin does not claim encryption, and `store:default` grants every operation. [../references/research/raw/tauri--docs--store-plugin.md](../references/research/raw/tauri--docs--store-plugin.md)
3. Decide explicit save versus debounced auto-save. Do not rely on graceful-exit persistence for crash-critical data.
4. Use SQL migrations with unique versions and transactions. Keep SQL in files that can be reviewed and use bound parameters. [../references/research/raw/tauri--docs--sql-plugin.md](../references/research/raw/tauri--docs--sql-plugin.md)
5. Grant `sql:allow-execute` only when the WebView truly needs generic writes. Prefer Rust domain commands for a stronger boundary.
6. Use Stronghold or a platform credential store for a user-owned secret, and design password acquisition, unlock, timeout, rotation, revocation, backup, and recovery. [../references/research/raw/tauri--docs--stronghold-plugin.md](../references/research/raw/tauri--docs--stronghold-plugin.md)
7. Never write credentials, private prompts, or raw provider bodies to logs by default.
8. Keep ephemeral runtime objects in managed state, not serialized storage.
9. Define data migration, rollback, corruption, partial write, interrupted shutdown, and concurrent access tests.
10. Verify file locations, permissions, export behavior, deletion behavior, and platform backup implications on each supported target.

## AI-specific decisions

- Decide whether prompts and model output are stored by default, opt-in, transient, or redacted.
- Separate user-visible history from diagnostic traces.
- Store usage summaries without storing raw provider authorization headers or full response bodies.
- Treat model caches and downloaded weights as large managed artifacts with hashes and cleanup policy, not Store values.
- If local history is searchable, define encryption and key recovery independently from the database plugin.

## Verification

Prove migration rollback, version upgrades, first run, repeated load, concurrent writes, abrupt termination, invalid vault password, revoked provider key, and user-requested deletion. Mark cloud sync, operating-system backup, and device migration as EXTERNAL until tested.

