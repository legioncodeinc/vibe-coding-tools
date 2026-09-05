# Tauri Runtime Authority
- URL: https://v2.tauri.app/security/runtime-authority/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Page updated: 2025-02-22
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

The source states: "If the origin is not allowed to call the command, the runtime authority will deny the request."

## Archived evidence

Runtime Authority holds permissions, capabilities, and scopes. For a WebView command request it checks the origin, capability membership, command access, and applicable scope before invoking Rust. A denied request never reaches the command.

## Archive interpretation

This explains the dispatch boundary. It does not validate business rules inside an allowed command.
