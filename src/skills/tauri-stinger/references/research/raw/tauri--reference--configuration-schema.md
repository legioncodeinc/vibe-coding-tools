# Tauri Generated Configuration Reference
- URL: https://v2.tauri.app/reference/config/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Source type: official-docs
- Material: supplemental living generated reference, not evidence of an in-window release

## Captured source material

- Default configuration format: `tauri.conf.json`
- Optional format features: `config-json5`, `config-toml`
- Content Security Policy default: `csp: null`

## Archived evidence

The generated configuration reference lists `tauri.conf.json` as the default file, with JSON5 and TOML enabled through Cargo features. Its application security schema shows a null CSP default.

## Archive interpretation

A missing or null CSP must be reported as an explicit security posture, not treated as a configured policy.

