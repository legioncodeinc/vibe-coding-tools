# Tauri 2 Engineering, Current Update Notes, and AI Application Patterns

This distillation covers official evidence collected for the 2026-03-03 through 2026-09-03 research window. Version values are cutoff observations and must be refreshed before an implementation calls them current. [raw/tauri--release--ecosystem-index.md]

Release and advisory change claims come from the six-month publication window. Mutable official documentation fetched at the cutoff is used only as supplemental living baseline behavior, not as evidence that a feature changed inside the window. [raw/tauri--docs--project-structure.md] [raw/tauri--docs--calling-rust.md] [raw/tauri--docs--updater-plugin.md]

## Authority and limitations

Official package-specific GitHub tags outrank the generated Tauri release website when the two disagree, because the website lagged the official August 31 plugin tags at the cutoff. [raw/tauri--release--ecosystem-index.md] [raw/tauri--release--updater-2.11.0.md] [raw/tauri--release--http-2.6.0.md] [raw/tauri--release--fs-2.5.2.md]

No first-party Tauri application dedicated to LLMs, AI providers, local model runners, or agents was identified in the official source sweep. [raw/tauri--research--first-party-ai-gap.md]

Therefore, all AI-specific topologies in this distillation are derived designs assembled from documented Tauri primitives, not Tauri-endorsed reference architectures. [raw/tauri--research--first-party-ai-gap.md]

## Dated package snapshot

| Package surface | Cutoff version | Evidence |
|---|---:|---|
| Rust `tauri` core | 2.11.5 | Latest official core tag found by 2026-09-03. [raw/tauri--release--core-2.11.5.md] |
| Rust `tauri-cli` | 2.11.4 | Latest package-specific CLI tag found by the cutoff. [raw/tauri--release--tauri-cli-2.11.4.md] [raw/tauri--release--cli-changelog.md] |
| npm `@tauri-apps/cli` | 2.11.4 | Independently tagged Node wrapper distribution. [raw/tauri--release--npm-cli-2.11.4.md] |
| npm `@tauri-apps/api` | 2.11.1 | Independently tagged JavaScript API distribution. [raw/tauri--release--api-2.11.1.md] |
| Rust `tauri-runtime` | 2.11.3 | Independently tagged runtime abstraction. [raw/tauri--release--runtime-2.11.3.md] |
| Rust `tauri-runtime-wry` | 2.11.4 | Independently tagged Wry-backed runtime. [raw/tauri--release--runtime-wry-2.11.4.md] |
| Rust `tauri-bundler` | 2.9.4 | Independently tagged bundler distribution. [raw/tauri--release--bundler-2.9.4.md] |
| Updater plugin, Rust and npm | 2.11.0 | Separate Rust and npm August 31 tags superseded the stale website value. [raw/tauri--release--updater-2.11.0.md] [raw/tauri--release--updater-js-2.11.0.md] |
| HTTP plugin, Rust and npm | 2.6.0 | Separate Rust and npm August 31 tags superseded the stale website value. [raw/tauri--release--http-2.6.0.md] [raw/tauri--release--http-js-2.6.0.md] |
| Filesystem plugin, Rust and npm | 2.5.2 | Separate Rust and npm tags plus the advisory identify the same patched version. [raw/tauri--release--fs-2.5.2.md] [raw/tauri--release--fs-js-2.5.2.md] [raw/tauri--advisory--fs-scope-2.5.2.md] |
| Shell plugin, Rust and npm | 2.3.6 | Separate Rust and npm August 31 tags superseded the stale website value. [raw/tauri--release--shell-2.3.6.md] [raw/tauri--release--shell-js-2.3.6.md] |
| Store plugin, Rust and npm | 2.4.4 | Separate Rust and npm July 18 tags. [raw/tauri--release--store-2.4.4.md] [raw/tauri--release--store-js-2.4.4.md] |
| SQL plugin, Rust and npm | 2.4.1 | Separate Rust and npm August 31 tags superseded the stale website value. [raw/tauri--release--sql-2.4.1.md] [raw/tauri--release--sql-js-2.4.1.md] |
| GitHub `tauri-action` | 1.0.0 | Official June 29 release with breaking changes. [raw/tauri--release--tauri-action-1.0.0.md] |

Tauri 2.11.5 still declares Wry 0.55.0, Tao 0.35.0, and `tauri-runtime` 2.11.3 in its immutable runtime-wry manifest. [raw/tauri--source--runtime-wry-2.11.5-manifest.md]

Standalone Wry or Tao releases do not establish which APIs are available through a tagged Tauri core release, so implementation must inspect the resolved manifest or lockfile. [raw/tauri--source--runtime-wry-2.11.5-manifest.md]

## Security and update floor

Tauri 2.11.1 fixes CVE-2026-42184, an origin-confusion flaw affecting Tauri 2.0.0 through 2.11.0 on Windows and Android. [raw/tauri--advisory--cve-2026-42184.md]

The same 2.11.1 release also enforces remote-origin ACL resolution for custom commands when no `AppManifest` is configured. [raw/tauri--release--core-2.11.1.md]

Applications that load remote content must treat Tauri 2.11.1 as the minimum security floor, then select the latest compatible patch after a fresh version check. [raw/tauri--release--core-2.11.1.md] [raw/tauri--release--core-2.11.5.md]

Filesystem plugin 2.5.2 repairs ineffective predefined command scopes and WebView-data denials, and the matching advisory marks earlier 2.x Rust and npm packages as affected. [raw/tauri--release--fs-2.5.2.md] [raw/tauri--advisory--fs-scope-2.5.2.md]

Bundler 2.9.3 fixes a signed-NSIS path where `makensis` could embed unsigned stock plugin DLLs even though the signing step succeeded. [raw/tauri--release--bundler-2.9.3.md]

CLI 2.10.1 warns that updater keys generated with an empty password by CLI 2.9.3 through 2.10.0 are broken and must be regenerated. [raw/tauri--release--cli-changelog.md]

Updating the CLI does not repair a previously generated updater private key. [raw/tauri--release--cli-changelog.md]

## Noteworthy 2.x changes in the window

| Release | Engineering consequence | Evidence |
|---|---|---|
| Core 2.11.0 | Main feature tranche: command renaming, callback evaluation, deep drag regions, mobile file associations and lifecycle events, mobile multiwindow, and web-content-process termination handling. Never pass model output into direct evaluation. | [raw/tauri--release--core-2.11.0.md] |
| Core 2.11.1 | Mobile monitor APIs and Android permission crash fix arrived with two remote-origin security fixes. | [raw/tauri--release--core-2.11.1.md] |
| Core 2.11.2 | Fixes the macOS Window-menu setter being routed to the Help-menu setter. | [raw/tauri--release--core-2.11.2.md] |
| Core 2.11.3 | Fixes filesystem, Channel, and Android response deadlocks, nested once-listener behavior, and custom-protocol load performance. | [raw/tauri--release--core-2.11.3.md] |
| Core 2.11.4 | Temporarily pins `time` below 0.3.52 for build compatibility and updates runtime-wry. | [raw/tauri--release--core-2.11.4.md] |
| Core 2.11.5 | The release only unpinned `time` after a fixed upstream version, so it is a dependency patch rather than a feature release. | [raw/tauri--release--core-2.11.5.md] |
| CLI 2.10.1 | Regenerate empty-password updater keys created by CLI 2.9.3 through 2.10.0. | [raw/tauri--release--cli-changelog.md] |
| CLI 2.11.3 | Re-run migration or manually review aliased imports because this release fixed invalid ESM produced by `tauri migrate`. | [raw/tauri--release--cli-changelog.md] |
| CLI 2.11.4 | AppImage metadata symlinks no longer become absolute in the affected packaging path. | [raw/tauri--release--cli-changelog.md] |
| Bundler 2.9.3 | Signed NSIS output must use the signed stock plugin directory. | [raw/tauri--release--bundler-2.9.3.md] |
| Updater 2.11.0 | Windows installer spawn failures are surfaced, relaunch can be controlled, and system proxy support is enabled by default on Windows and macOS. | [raw/tauri--release--updater-2.11.0.md] |
| HTTP 2.6.0 | `system-proxy` replaces the former macOS feature name to match `reqwest`. | [raw/tauri--release--http-2.6.0.md] |
| Tauri Action 1.0.0 | v1 and unstable-v2 support is removed, several inputs are removed or renamed, artifact names change, and mobile support covers build only. | [raw/tauri--release--tauri-action-1.0.0.md] |

## Project inspection and version alignment

A normal application places its Cargo project under `src-tauri/` and uses `tauri.conf.json` as both configuration and a CLI project marker. [raw/tauri--docs--project-structure.md]

Shared desktop and mobile startup belongs in `src-tauri/src/lib.rs`, with a thin desktop `main.rs`. [raw/tauri--docs--project-structure.md]

JSON5 and TOML configuration need explicit Cargo features, and platform configuration follows JSON Merge Patch where arrays replace rather than extend. [raw/tauri--docs--configuration-files.md]

Core `@tauri-apps/api` and Cargo `tauri` should share a minor version, while each plugin's npm binding and Rust crate should match exactly. [raw/tauri--docs--updating-dependencies.md]

Independent core package patch versions are normal, so forcing `tauri`, the CLI, API, build crate, runtime, and bundler to one identical patch is wrong. [raw/tauri--release--ecosystem-index.md] [raw/tauri--docs--updating-dependencies.md]

An upgrade must inspect manifest constraints and resolved versions in both the frontend and Cargo lockfiles before editing. [raw/tauri--docs--updating-dependencies.md] [raw/tauri--docs--project-structure.md]

## Tauri 1 to Tauri 2 migration

`tauri migrate` performs mechanical migration work but the official guide requires the complete migration guide to be read and applied. [raw/tauri--docs--v1-to-v2-migration.md]

The migration moves startup into a mobile-compatible library entry point, restructures configuration, pluginifies many APIs, changes event targeting, and replaces the v1 allowlist with capabilities, permissions, and scopes. [raw/tauri--docs--v1-to-v2-migration.md]

Generated capabilities are a starting point that require manual least-privilege review. [raw/tauri--docs--v1-to-v2-migration.md] [raw/tauri--docs--capabilities.md]

An already-distributed v1 application needs `v1Compatible` updater artifacts during the migration path. [raw/tauri--docs--v1-to-v2-migration.md] [raw/tauri--docs--updater-plugin.md]

## IPC, state, and stream selection

Commands are typed request-response boundaries: Rust inputs deserialize, outputs and errors serialize, and frontend `invoke` returns a Promise. [raw/tauri--docs--calling-rust.md] [raw/tauri--docs--ipc-overview.md]

Use owned async inputs for heavy operations, avoid blocking the main thread, and return structured serializable errors rather than panics or opaque strings when the application needs stable frontend handling. [raw/tauri--docs--calling-rust.md]

Events fit lifecycle notifications, state changes, small payloads, and multi-producer or multi-consumer messaging, but not low-latency or high-throughput streams. [raw/tauri--docs--calling-frontend.md]

Channels deliver ordered, high-throughput data and are the documented choice for streaming responses and child output. [raw/tauri--docs--calling-rust.md] [raw/tauri--docs--calling-frontend.md]

Use a tagged Rust enum for a Channel so the frontend can implement a discriminated union with explicit start, data, usage, completion, cancellation, and failure states. Serde renames enum variants and struct-variant fields through separate attributes, so a camelCase JavaScript contract needs `rename_all` plus `rename_all_fields`. This is a derived API design based on Tauri's tagged-enum Channel example. [raw/tauri--docs--calling-frontend.md] [raw/serde--docs--container-attributes.md]

Managed state owns application-wide clients and handles, while mutable values use the appropriate mutex and the exact registered wrapper type. [raw/tauri--docs--state-management.md]

Frontend event listeners must be unregistered during component cleanup, and privileged actions should remain commands because event names are not business-authorization boundaries. [raw/tauri--docs--calling-frontend.md] [raw/tauri--docs--ipc-overview.md]

Never evaluate model-generated JavaScript. Direct evaluation is a Tauri API, but the safe derived design treats model output as untrusted data and renders it through ordinary application code. [raw/tauri--docs--calling-frontend.md] [raw/tauri--docs--security-overview.md]

## Capabilities, permissions, scopes, and secrets

Permissions name command privileges, capabilities bind them to windows, WebViews, platforms, and optionally remote origins, and scopes provide command-specific allow and deny data. [raw/tauri--docs--permissions.md] [raw/tauri--docs--capabilities.md] [raw/tauri--docs--command-scopes.md]

Runtime Authority checks the request origin and capability membership before dispatch and injects applicable scopes into allowed commands. [raw/tauri--docs--runtime-authority.md]

Application commands registered only through `invoke_handler` remain available to every application window and WebView by default; constraining them requires declaring commands through `AppManifest::commands` and granting explicit permissions. [raw/tauri--docs--capabilities.md]

Custom application scopes must be enforced in the Rust command and audited for bypasses. [raw/tauri--docs--command-scopes.md]

Capabilities merge when a window or WebView belongs to more than one, so privilege review must reason about the resolved union rather than each file in isolation. [raw/tauri--docs--capabilities.md]

Remote API access is absent by default and must be granted with URL patterns; Linux and Android cannot distinguish an iframe request from its containing window. [raw/tauri--docs--capabilities.md]

The generated configuration default is `csp: null`, while the CSP guide recommends a restrictive policy that avoids remote scripts and untrusted sources. [raw/tauri--reference--configuration-schema.md] [raw/tauri--docs--content-security-policy.md]

The Isolation pattern can interpose a sandboxed application that inspects IPC before Core, but it adds overhead and still requires application-authored validation. [raw/tauri--docs--isolation-pattern.md]

Tauri's Core process owns application-wide state, settings, and database connections, and its process-model guidance keeps secrets out of frontend code. [raw/tauri--docs--process-model.md]

Vite exposes configured environment prefixes through `import.meta.env` and bundles those values into frontend code, while Tauri's current Vite example uses the narrower `TAURI_ENV_*` pattern rather than a broad literal `TAURI_` prefix. [raw/vite--docs--environment-variables.md] [raw/tauri--docs--vite-frontend.md]

A secret compiled into a desktop binary is still on a user-controlled machine. Therefore, a publisher-owned AI provider key belongs behind a publisher-controlled service, while a user-owned key can be stored locally through an intentionally designed secure store. This is a derived security design, not a Tauri guarantee. [raw/tauri--docs--process-model.md] [raw/tauri--docs--stronghold-plugin.md]

## Derived AI application topologies

### Hosted provider through Rust

The WebView sends a typed request without credentials to a narrow Rust command, Rust validates provider, model, size, limits, and referenced paths, then Rust makes the network call and returns either a result or a Channel stream. This is a derived design using commands, Channels, and the Core process boundary. [raw/tauri--docs--calling-rust.md] [raw/tauri--docs--calling-frontend.md] [raw/tauri--docs--process-model.md]

Because Rust owns the provider request, the provider origin does not need to appear in WebView `connect-src`, and the provider credential never needs to enter frontend state. This is a derived consequence of the documented CSP and process model. [raw/tauri--docs--content-security-policy.md] [raw/tauri--docs--process-model.md]

### Publisher-controlled service

For a publisher-owned provider credential, authenticate the desktop user to a publisher service and let that service call the provider. This derived topology recognizes that installed desktop binaries and local state are controlled by the end user. [raw/tauri--docs--process-model.md] [raw/tauri--docs--security-overview.md]

### Local model sidecar

On desktop, bundle one sidecar per supported target triple, let Rust own spawn and shutdown, keep the child handle in managed state, use framed typed stdin/stdout messages, and return generated data through a Channel. This is a derived design from documented sidecar, state, and Channel primitives. [raw/tauri--docs--sidecars.md] [raw/tauri--docs--state-management.md] [raw/tauri--docs--calling-frontend.md]

Expose narrow commands such as status, load, generate, cancel, and shutdown instead of granting frontend shell spawn or arbitrary arguments. This is a derived least-privilege design supported by the Shell plugin's permission model. [raw/tauri--docs--sidecars.md] [raw/tauri--docs--shell-plugin.md] [raw/tauri--docs--capabilities.md]

Shell 2.3.6 source shows that writing borrows the child handle mutably while killing consumes it, so multi-branch lifecycle code must retain and consume the handle deliberately. [raw/tauri--source--shell-command-child-2.3.6.md]

Treat sidecar stdout as untrusted input, bound accepted and forwarded messages, use a protocol version, detect readiness, time out startup, cap retained stderr, handle read errors and unexpected exit, and terminate on application shutdown. Tauri Shell's default line path allocates a complete line before emitting an event, so a post-event size check does not bound reader allocation; require producer-side line limits or implement bounded framing over a raw reader. These operational controls are derived and are not supplied automatically by Tauri. [raw/tauri--docs--sidecars.md] [raw/tauri--source--shell-command-child-2.3.6.md] [raw/tauri--research--first-party-ai-gap.md]

Sidecars are a desktop-only topology because the Shell plugin supports child processes on Windows, Linux, and macOS, while its Android and iOS support is limited to opening URLs. [raw/tauri--docs--shell-plugin.md]

### Native mobile or reusable provider plugin

A reusable provider client, native inference library, or platform integration may become a Tauri plugin with Rust commands, JavaScript bindings, permissions, and optional Kotlin and Swift implementations. [raw/tauri--docs--plugin-development.md] [raw/tauri--docs--mobile-plugin-development.md]

Mobile plugin commands, native permission prompts, and plugin events still need Tauri capability permissions. [raw/tauri--docs--mobile-plugin-development.md]

## Persistence split for AI applications

Use Store for preferences and small non-secret durable state, since it is a file-backed key-value layer and does not claim encrypted storage. This is a derived fit based on the plugin's documented behavior. [raw/tauri--docs--store-plugin.md]

Use SQL with bound parameters and migrations for conversations, messages, jobs, provider metadata, and other structured durable records. This is a derived fit based on the plugin's relational capabilities. [raw/tauri--docs--sql-plugin.md]

Use Stronghold or a platform credential integration for user-owned provider credentials, while keeping password and unlock lifecycle design explicit. [raw/tauri--docs--stronghold-plugin.md]

Use managed Rust state for active clients, sidecar handles, cancellation state, and other ephemeral process resources. [raw/tauri--docs--state-management.md]

Avoid granting `store:default` or `sql:allow-execute` directly to an untrusted WebView when narrow domain commands can own mutations in Rust. This is a derived least-privilege rule based on the breadth of those permission sets. [raw/tauri--docs--store-plugin.md] [raw/tauri--docs--sql-plugin.md]

## Verification and delivery

Mock APIs can prove renderer contracts, but the mock runtime does not execute native WebView libraries. [raw/tauri--docs--mocking.md] [raw/tauri--docs--tests-overview.md]

WebdriverIO can exercise a native Tauri application on Windows, Linux, and macOS, while browser mode intercepts invokes without launching a Tauri binary. [raw/tauri--docs--webdriver.md]

Therefore, a proportional verification ladder includes frontend mocks, Rust tests, IPC contract tests, native WebDriver or equivalent, packaged installer smoke tests, and physical mobile target checks when mobile is supported. The latter layers are a derived quality policy because the earlier layers explicitly omit native or packaged behavior. [raw/tauri--docs--tests-overview.md] [raw/tauri--docs--webdriver.md] [raw/tauri--release--tauri-action-1.0.0.md]

macOS distribution outside the App Store requires application signing and notarization, while Windows signing reduces trust warnings and can use native, Azure-backed, or custom commands. [raw/tauri--docs--macos-signing.md] [raw/tauri--docs--windows-signing.md]

Updater signatures cannot be disabled and use a dedicated key pair separate from operating-system code-signing identities. [raw/tauri--docs--updater-plugin.md] [raw/tauri--docs--macos-signing.md] [raw/tauri--docs--windows-signing.md]

Tauri Action builds and uploads artifacts but does not replace signing verification, installer tests, updater tests, or mobile store work. [raw/tauri--docs--github-pipeline.md] [raw/tauri--release--tauri-action-1.0.0.md]

## Conflicts and open gaps

- The generated Tauri release website lagged official package-specific plugin releases dated 2026-08-31, so package-specific tags are authoritative for the cutoff snapshot. [raw/tauri--release--ecosystem-index.md] [raw/tauri--release--updater-2.11.0.md] [raw/tauri--release--http-2.6.0.md] [raw/tauri--release--fs-2.5.2.md] [raw/tauri--release--shell-2.3.6.md] [raw/tauri--release--sql-2.4.1.md]
- Core package versions and plugin package versions advance independently, so no single Tauri-wide version can be inferred from one package's tag. [raw/tauri--release--ecosystem-index.md] [raw/tauri--docs--updating-dependencies.md]
- No official AI-specific reference application was found, so AI protocol, backpressure, cancellation, provider routing, model storage, and recovery policies remain application designs. [raw/tauri--research--first-party-ai-gap.md]
- Release job audit logs can contain allowed or unrelated dependency warnings; only authored release notes or a specific advisory support a vulnerability claim. [raw/tauri--release--sql-2.4.1.md]
- Store and SQL are documented persistence mechanisms, but only Stronghold is presented as a secret-storage plugin. [raw/tauri--docs--store-plugin.md] [raw/tauri--docs--sql-plugin.md] [raw/tauri--docs--stronghold-plugin.md]
