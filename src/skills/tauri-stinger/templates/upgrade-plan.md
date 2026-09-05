# Tauri Upgrade or Migration Plan

- Current application version:
- Target outcome:
- Research observation date:
- Current Tauri package inventory:
- Candidate Tauri package inventory:
- Supported operating systems and architectures:
- Tauri 1 to Tauri 2 migration: yes or no

## Source ledger

| Package or behavior | Current source | Candidate source | Breaking or security notes |
|---|---|---|---|
| | | | |

## Alignment plan

- Cargo `tauri` and npm API minor alignment:
- Plugin exact-pair alignment:
- CLI choice and invocation path:
- Wry and Tao resolved versions:
- Lockfile policy:

## Migration slices

| Slice | Files | Behavior change | Verification | Rollback |
|---|---|---|---|---|
| 1 | | | | |

## Authority changes

- v1 allowlist translation:
- Generated capabilities to narrow:
- Custom commands to add to `AppManifest`:
- Scope enforcement to implement or review:
- CSP and remote-origin changes:

## Delivery changes

- Bundle format or artifact-name changes:
- Signing changes:
- Updater compatibility:
- CI action breaking changes:
- Mobile store implications:

## Exit criteria

- [ ] Manifests and resolved lockfiles align.
- [ ] Migration output has a manual diff review.
- [ ] Frontend, Rust, IPC, and native tests pass.
- [ ] Final packages and update artifacts are inspected.
- [ ] Security, Quality, and repository-health gates close in order.
- [ ] User approves commit and push.

