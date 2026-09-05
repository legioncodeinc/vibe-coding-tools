# Tauri SQL Plugin
- URL: https://v2.tauri.app/plugin/sql/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Page updated: 2025-11-04
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

```ts
const db = await Database.load("sqlite:test.db");
const result = await db.select("SELECT * from todos WHERE id = $1", [ id ]);
```

## Archived evidence

The SQL plugin uses `sqlx` and enables SQLite, MySQL, and PostgreSQL through Cargo features. SQLite connection paths are application-relative.

Queries accept bound values. Migrations have a unique version, description, SQL, and migration kind; they can embed SQL through `include_str!` and register on the plugin builder. Preloaded connections and client-side loads run registered migrations. Migration failure rolls back the transaction.

`sql:default` permits load, close, and select. Mutating statements require `sql:allow-execute`.

## Archive interpretation

Prefer bound parameters. Granting generic execute access to a WebView is broader than exposing domain-specific Rust commands.
