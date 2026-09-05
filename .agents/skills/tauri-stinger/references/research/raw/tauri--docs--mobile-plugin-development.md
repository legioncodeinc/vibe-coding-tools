# Tauri Mobile Plugin Development
- URL: https://v2.tauri.app/develop/plugins/develop-mobile/
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Page updated: 2026-05-14
- Source type: official-docs
- Material: supplemental living baseline reference, not evidence of an in-window release

## Captured source material

```kotlin
@TauriPlugin
class ExamplePlugin(private val activity: Activity): Plugin(activity)
```

```swift
@objc private func download(_ invoke: Invoke)
```

## Archived evidence

Android plugins use a Kotlin or Java class extending Tauri's `Plugin` and commands annotated with `@Command`. iOS plugins use a Swift class extending `Plugin`; callable functions use Objective-C exposure and an `Invoke` argument.

The bridge can call mobile code from Rust and can expose permission-check and permission-request commands. Plugin events sent to JavaScript remain gated by plugin capabilities and permissions.

Android submissions moving to 16 KB memory pages should build with NDK 28 or later, with a linker flag documented for older-toolchain exceptions.

## Archive interpretation

Mobile AI inference requires a hosted API or a native mobile integration. The desktop sidecar pattern does not transfer to mobile unchanged.
