# Migrate Tauri 1 to Tauri 2

## Purpose

Turn the official automated migration into small, reviewable, tested changes.

## Procedure

1. Create a feature branch from current `main`, capture a clean baseline build and tests, and record the installed user base plus updater compatibility requirement.
2. Inventory all v1 configuration, allowlist entries, built-in APIs, events, resources, sidecars, updater behavior, bundle formats, and platform code.
3. Refresh the current stable Tauri 2 CLI and read every release note between the project's CLI and the selected CLI. CLI 2.11.3 fixed invalid aliased imports produced by earlier migration output. [../references/research/raw/tauri--release--cli-changelog.md](../references/research/raw/tauri--release--cli-changelog.md)
4. Run the official `tauri migrate` command through the repository's chosen CLI and package manager.
5. Do not accept the generated diff wholesale. The official guide says the command is not a substitute for completing the migration guide. [../references/research/raw/tauri--docs--v1-to-v2-migration.md](../references/research/raw/tauri--docs--v1-to-v2-migration.md)
6. Split review and commits into bounded slices:
   1. library entry point and mobile crate shape
   2. base and platform configuration
   3. dependency and import changes
   4. one plugin family at a time
   5. allowlist conversion to capabilities, permissions, and scopes
   6. event target changes
   7. resources and sidecars
   8. bundle, signing, and updater changes
7. For each pluginified API, add the Rust crate, initialize it, add the JavaScript binding only if the frontend needs it, and grant only the required permissions.
8. Review generated capability files manually. Replace broad defaults, wildcards, and remote origins with the narrowest real contract.
9. Declare custom application commands through `AppManifest::commands` if they must be permissioned, then add explicit permissions and scope enforcement. [../references/research/raw/tauri--docs--capabilities.md](../references/research/raw/tauri--docs--capabilities.md)
10. Update event code for new global and targeted semantics, and clean up listeners during frontend unmount. [../references/research/raw/tauri--docs--v1-to-v2-migration.md](../references/research/raw/tauri--docs--v1-to-v2-migration.md)
11. If users already run v1, configure and prove `v1Compatible` update artifacts through the transition. [../references/research/raw/tauri--docs--updater-plugin.md](../references/research/raw/tauri--docs--updater-plugin.md)
12. Validate every slice with frontend checks, Cargo checks, capability schemas, native launch, and the relevant package/update smoke path.

Use [../examples/05-v1-to-v2-migration.md](../examples/05-v1-to-v2-migration.md) and [../templates/upgrade-plan.md](../templates/upgrade-plan.md) as working artifacts.

## Stop conditions

Stop and request user input when the updater trust key, installed v1 population, supported platform set, signing identity, or required remote-content behavior is unknown and would change the migration design.

