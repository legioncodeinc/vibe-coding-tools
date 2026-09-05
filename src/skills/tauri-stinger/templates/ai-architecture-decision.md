# Tauri AI Architecture Decision

- Decision date:
- Status: proposed
- Product requirement:
- Supported platforms:
- Data classification:
- Offline requirement:
- Publisher-owned or user-owned credentials:
- Expected model and artifact sizes:

## Options considered

| Option | Fit | Security boundary | Distribution cost | Platform reach | Decision |
|---|---|---|---|---|---|
| Publisher service | | | | | |
| Hosted provider from Rust | | | | | |
| Desktop local sidecar | | | | | |
| Native Rust runtime | | | | | |
| Reusable Tauri plugin or mobile bridge | | | | | |

## Decision

Chosen topology:

Why it fits:

Why the other options do not:

## Command and stream contract

- Commands:
- Request limits:
- Channel event variants:
- Cancellation semantics:
- Timeout semantics:
- Error codes exposed to the WebView:
- Log and telemetry redaction:

## Secret and persistence policy

- Publisher credentials:
- User credentials:
- Store data:
- SQL data:
- Stronghold or platform credential data:
- Ephemeral managed state:

## Sidecar or native runtime policy

- Protocol version:
- Readiness signal:
- Message size bound:
- Process or runtime lifecycle:
- Model integrity check:
- Crash and restart policy:
- Shutdown behavior:

## Verification

- Renderer mocks:
- Rust tests:
- IPC tests:
- Native desktop tests:
- Physical mobile tests:
- Package and updater tests:

## Derived-design disclosure

This architecture is an application design derived from official Tauri primitives. It is not represented as a Tauri-endorsed AI reference architecture.

