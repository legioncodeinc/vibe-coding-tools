# Test Desktop and Mobile Tauri Applications

## Purpose

Match test depth to the native behavior, authority boundary, and delivery risk being changed.

## Verification ladder

1. Run pure frontend unit tests for rendering and state transitions.
2. Use Tauri frontend mocks for `invoke`, events, and window APIs, and clear mocks after every test. [../references/research/raw/tauri--docs--mocking.md](../references/research/raw/tauri--docs--mocking.md)
3. Run Rust unit and integration tests for validators, command services, state transitions, scope enforcement, persistence, sidecar protocol parsing, and error mapping.
4. Add IPC contract tests that assert frontend key casing, request limits, serialized success and errors, Channel variants, cancellation, and exactly one terminal state.
5. Run WebdriverIO with the Tauri service or another native application driver on supported desktop targets. [../references/research/raw/tauri--docs--webdriver.md](../references/research/raw/tauri--docs--webdriver.md)
6. Label browser-mode WebdriverIO as renderer-only because it does not launch a Tauri binary.
7. Build final package types and smoke test install, first launch, restart, update, rollback or rejection, and uninstall.
8. Test platform integrations on real supported operating systems, not only one development host.
9. For Android and iOS, use simulators for fast loops and physical devices for release evidence. Test permission denial, backgrounding, suspend, resume, offline behavior, and store-format artifacts.
10. Record commands, target versions, runner or device identity, artifact hashes, results, and remaining OPEN or EXTERNAL evidence.

Tauri's mock runtime does not execute native WebView libraries, which is why native and package layers remain necessary. [../references/research/raw/tauri--docs--tests-overview.md](../references/research/raw/tauri--docs--tests-overview.md)

## AI and sidecar matrix

| Case | Expected proof |
|---|---|
| Provider success | ordered output, usage, one terminal completion |
| Provider rejects or rate limits | stable safe error, no credential leakage |
| Cancel before start | no provider or sidecar work begins |
| Cancel during stream | producer stops, terminal cancellation, state removed |
| Renderer reload | no duplicate listeners or orphaned work |
| Sidecar missing or wrong architecture | bounded startup failure with actionable code |
| Sidecar malformed or oversized output | parser rejects, process is controlled, diagnostics bounded |
| App exits during work | child and tasks shut down, durable transaction policy holds |
| Store or database migration fails | rollback and recoverable user state |
| Credential vault locked or revoked | re-authentication path without secret echo |

## Capability tests

- Prove an allowed window can call only its required commands.
- Prove a lower-trust or remote window is denied.
- Prove deny scopes win and path or URL canonicalization blocks bypasses.
- Prove capability unions do not grant an unintended combination.
- Prove arbitrary shell and database operations are unavailable from the WebView.

Use [../references/RELEASE-CHECKLIST.md](../references/RELEASE-CHECKLIST.md) for final artifact evidence.

