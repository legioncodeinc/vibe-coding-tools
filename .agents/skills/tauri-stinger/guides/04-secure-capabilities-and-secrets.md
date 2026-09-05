# Secure Capabilities and Secrets

## Purpose

Constrain privileged Tauri APIs by WebView, command, scope, platform, origin, and secret class.

## Procedure

1. Inventory every capability, permission, permission set, scope, custom command, window label, WebView label, platform condition, and remote URL.
2. Calculate the effective union for any window or WebView in multiple capabilities. Tauri merges those permissions. [../references/research/raw/tauri--docs--capabilities.md](../references/research/raw/tauri--docs--capabilities.md)
3. Start with one capability per trust boundary, named labels, local bundled content, and no remote URL patterns.
4. If remote content is required, use the narrowest scheme, hostname, and path patterns. Include Linux and Android iframe-origin ambiguity in the threat model. [../references/research/raw/tauri--docs--capabilities.md](../references/research/raw/tauri--docs--capabilities.md)
5. Reserve window creation for a high-trust WebView.
6. For custom commands that need restriction, declare them with `tauri_build::AppManifest::commands`, define explicit permissions, and bind those permissions to capabilities. Commands registered only through `invoke_handler` are otherwise available to all application windows and WebViews. [../references/research/raw/tauri--docs--capabilities.md](../references/research/raw/tauri--docs--capabilities.md)
7. Treat custom scope enforcement as authorization code. Retrieve allow and deny values, apply deny precedence, canonicalize resources, reject unknowns, and audit bypass paths. [../references/research/raw/tauri--docs--command-scopes.md](../references/research/raw/tauri--docs--command-scopes.md)
8. Configure a restrictive CSP tailored to actual local assets and remote connections. Do not copy a sample policy blindly. [../references/research/raw/tauri--docs--content-security-policy.md](../references/research/raw/tauri--docs--content-security-policy.md)
9. Consider the Isolation pattern when the threat model benefits from a sandboxed IPC inspection layer. It adds overhead and does not replace command validation or capabilities. [../references/research/raw/tauri--docs--isolation-pattern.md](../references/research/raw/tauri--docs--isolation-pattern.md)
10. Keep updater keys, signing credentials, publisher-owned provider keys, refresh tokens, and database administrator credentials out of frontend code and frontend-readable configuration. Vite bundles variables admitted by `envPrefix`; Tauri's current example uses `TAURI_ENV_*`, not the broad literal prefix `TAURI_`. [../references/research/raw/vite--docs--environment-variables.md](../references/research/raw/vite--docs--environment-variables.md) [../references/research/raw/tauri--docs--vite-frontend.md](../references/research/raw/tauri--docs--vite-frontend.md)
11. Keep publisher-owned provider credentials behind a publisher service. Store a user-owned provider credential through Stronghold or a platform credential integration and never return it to the WebView. The publisher-service requirement is a derived design based on the Core/WebView boundary. [../references/research/raw/tauri--docs--process-model.md](../references/research/raw/tauri--docs--process-model.md) [../references/research/raw/tauri--docs--stronghold-plugin.md](../references/research/raw/tauri--docs--stronghold-plugin.md)
12. Scan built frontend assets and packaged resources with non-production canary values to verify secret exclusion. This is a derived release safeguard.
13. Hand the completed authority and secret diff to `security-stinger` for the formal Security gate.

Use [../templates/capability-review.md](../templates/capability-review.md) and [../examples/04-least-privilege-capability.md](../examples/04-least-privilege-capability.md).

## Dated security floors

At the 2026-09-03 cutoff, remote-content apps need Tauri core 2.11.1 or later for the recorded origin and ACL fixes, and affected filesystem-scope users need plugin 2.5.2 or later. Refresh both values before implementation. [../references/research/raw/tauri--advisory--cve-2026-42184.md](../references/research/raw/tauri--advisory--cve-2026-42184.md) [../references/research/raw/tauri--advisory--fs-scope-2.5.2.md](../references/research/raw/tauri--advisory--fs-scope-2.5.2.md)
