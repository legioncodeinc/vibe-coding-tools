# Tauri Command Scopes
- URL: https://v2.tauri.app/security/scope/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Page updated: 2026-07-20
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

```toml
[[permission.scope.allow]]
path = "$APPLOCALDATA/**"
```

The source says deny scopes supersede allow scopes and application commands must enforce their own scope type.

## Archived evidence

Scopes provide granular allow or deny data for commands, and deny entries supersede allow entries. Plugin commands define their scope shape.

For application commands, the application defines the serializable scope type and the command implementation must retrieve and enforce it. The documentation warns command authors to audit scope validation for bypasses.

## Archive interpretation

A scope file is policy input, not self-enforcing authorization. Custom scope handling is security-critical Rust code.
