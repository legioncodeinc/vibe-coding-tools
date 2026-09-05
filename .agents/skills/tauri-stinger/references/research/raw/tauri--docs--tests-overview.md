# Tauri Tests Overview
- URL: https://v2.tauri.app/develop/tests/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Page updated: 2026-06-29
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

- Rust test runtime: `mock runtime`
- Native automation protocol: `WebDriver`
- Direct desktop driver support named by the page: Windows and Linux
- WebdriverIO Tauri support named by the page: Windows, Linux, and macOS

## Archived evidence

Tauri supports Rust unit and integration tests through a mock runtime that does not execute native WebView libraries. It also supports end-to-end testing through WebDriver.

The Tauri WebdriverIO integration reaches Windows, Linux, and macOS. Driving `tauri-driver` directly reaches Windows and Linux because macOS has no desktop WKWebView driver. Any CI runner can build Tauri when the target system libraries are installed.

## Archive interpretation

Mock-runtime tests do not prove native WebView behavior, installer behavior, signing, updater operation, or platform integration.
