# Tauri Isolation Pattern
- URL: https://v2.tauri.app/concept/inter-process-communication/isolation/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Page updated: 2025-07-10
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

```json
{
  "app": {
    "security": {
      "pattern": { "use": "isolation", "options": { "dir": "../dist-isolation" } }
    }
  }
}
```

## Archived evidence

The Isolation pattern inserts a sandboxed application between the primary frontend and Tauri Core. It can inspect or transform frontend IPC messages before they reach Core, then protects transport with a runtime-generated key.

Tauri recommends the pattern when it can be used, especially for applications exposed to frontend dependency risk or untrusted content. The pattern adds cryptographic processing overhead, and every application still has to implement meaningful validation in its isolation hook.

## Archive interpretation

Isolation is an additional IPC inspection layer, not a replacement for command validation, permissions, scopes, CSP, or dependency review. Adopt it through an explicit threat-model decision.
