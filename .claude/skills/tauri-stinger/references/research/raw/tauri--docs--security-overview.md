# Tauri Security Overview
- URL: https://v2.tauri.app/security/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Page updated: 2026-07-22
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

- Security controls linked by the page: permissions, command scopes, capabilities, CSP, runtime authority
- Privileged side named by the page: Rust Core and plugin code
- Constrained side named by the page: WebView code through IPC

## Archived evidence

Tauri separates Rust and plugin code, which has system access, from WebView code, which reaches privileged behavior through exposed IPC. Capabilities, permissions, and scopes restrict that exposure but do not make malicious Rust safe or correct.

The security documentation directs application authors to combine runtime boundaries with secure development, dependency review, and threat analysis.

## Archive interpretation

The access-control layer is defense in depth around privileged code. Validation, authorization, safe secret handling, and supply-chain review still belong in application code and release gates.
