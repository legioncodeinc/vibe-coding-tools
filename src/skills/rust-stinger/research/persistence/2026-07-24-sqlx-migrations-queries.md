---
source_url: https://docs.rs/sqlx/latest/index.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: high
topic: migrations
stinger: rust-stinger
---

# SQLx query macros and embedded migrations

## Summary
SQLx provides compile-time checked query macros and `migrate!`, which embeds migrations into the binary. Query macros require a build-time schema connection or checked-in `.sqlx` offline metadata. Embedded migrations improve deployability but do not replace forward-only migration policy, crash tests, and schema-version compatibility checks.

## Key quotations / statistics
- "The `migrate!` macro embeds migrations into the binary"
- "The `query!` macro allows for statically checked SQL queries"

## Version/date caveat
SQLx latest docs at retrieval; offline metadata commands and migration macro rebuild behavior vary by release/build system.

## Annotations for stinger-forge
- Supports compile-checked repository queries and migration packaging tests.
- Database schema review remains a peer boundary; this source covers Rust integration mechanics.
