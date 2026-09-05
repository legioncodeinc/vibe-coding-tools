# Tauri Content Security Policy
- URL: https://v2.tauri.app/security/csp/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Page updated: 2025-04-07
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

- Configuration path: `app.security.csp`
- WebAssembly directive named by the guide: `'wasm-unsafe-eval'`

## Archived evidence

CSP protection requires an application policy. Tauri recommends a restrictive policy that allows assets only from trusted sources and warns against remote scripts and untrusted content.

At compile time Tauri augments configured policies with nonces and hashes needed by bundled assets. WebAssembly frontends may require `wasm-unsafe-eval`.

## Archive interpretation

The example policy is not universal. A provider called from Rust does not require its origin in the WebView `connect-src`; a provider called by frontend JavaScript does.
