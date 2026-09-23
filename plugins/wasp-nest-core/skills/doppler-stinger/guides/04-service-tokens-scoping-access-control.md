# Service tokens, scoping, and access control

Grounded in `references/research/distilled-doppler.md` §5 and §8, citing [raw/doppler--tokens--service-tokens-and-token-formats.md] and [raw/doppler--access-control--permissions-and-custom-roles.md].

## Which token for which context

| Context | Correct token | Never use |
| --- | --- | --- |
| Local development | CLI Token (via `doppler login`) | - |
| Production / live environment | Service Token, scoped to exactly one config | Personal Token or CLI Token - both carry the account's full read/write permission set [raw/doppler--tokens--service-tokens-and-token-formats.md] |
| CI/CD (GitHub Actions, etc.) | Service Token (fallback) or Service Account Identity via OIDC (preferred, no static secret) | A Personal Token, ever |

A Service Token provides read-only (or optionally read/write) access to **one config in one project** - not the whole project, not the whole workplace. That single-config scoping is the mechanism, not a configuration choice to opt into [raw/doppler--tokens--service-tokens-and-token-formats.md].

## Creating and using a Service Token

```shell
doppler setup
doppler configs tokens create token-name --plain
```

Three ways to hand it to the CLI at runtime: persisted (`doppler configure set token --scope /path`, best for VMs since it survives restarts), the `DOPPLER_TOKEN` env var (best for CI/Docker/Kubernetes), or the `--token` flag directly on `doppler run`. Full examples for each, including Docker and Kubernetes secret injection: [raw/doppler--tokens--service-tokens-and-token-formats.md].

## Ephemeral tokens for short-lived jobs

```shell
doppler configs tokens create ephemeral-token --max-age 1m --plain
```

Auto-deletes after the given duration - well suited to a one-off CI job or a container that should never hold a long-lived credential.

## Revocation

Immediate and irreversible (dashboard Access tab > Revoke, or `doppler configs tokens revoke -p PROJECT -c CONFIG <token>`). Note: a process already holding the CLI's local encrypted fallback file keeps serving the last-successfully-fetched secrets until its next fetch attempt is denied - revocation doesn't retroactively wipe an already-running process's in-memory environment [raw/doppler--tokens--service-tokens-and-token-formats.md].

## Access control model

Two layers: **Workplace role** (Owner/Admin get automatic access to everything; Collaborator needs explicit per-project, per-environment grants - Team/Enterprise plan required for role-based access at all) and **Project role** (Viewer/Collaborator/Admin/None, assignable per user or group, per environment) [raw/doppler--access-control--permissions-and-custom-roles.md].

**Custom Roles** let you go finer than the built-ins. The documented pattern for asymmetric per-environment access (e.g. write on `dev`/`ci`, read-only on `stg`, no secret visibility on `prd`) is: create three Custom Project Roles (Secret Write, Secret Read-only, No Secrets), create three matching User Groups scoped to the relevant environments, and rely on Doppler's union/most-permissive rule across a user's group memberships. Full worked example: [raw/doppler--access-control--permissions-and-custom-roles.md].

## Never do this

- Never put a Personal Token or CLI Token in a live/production environment variable, CI secret, or `DOPPLER_TOKEN` value - stated directly in Doppler's own docs as the thing not to do.
- Never scope one Service Token across two configs (e.g. reuse the same token for `stg` and `prd`) - defeats the entire point of config-level scoping. Generate one per config.
- Never treat a rotated secret's "managing user" credential (see `guides/06-rotation-audit-logs-and-when-doppler-earns-its-place.md`) as reusable for anything other than the rotation itself.

## Where to go next

- CI/CD wiring using these tokens: `guides/05-cicd-in-github-actions.md`
- Copy-paste GitHub Actions examples: `references/github-actions-service-token-example.md`
- Audit trail for who used which token: `guides/06-rotation-audit-logs-and-when-doppler-earns-its-place.md`
