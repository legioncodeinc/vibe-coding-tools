# doppler-wasp-drone

## Domain
This Drone owns Doppler specifically: the project/config/environment model (dev/stg/prd, branch configs, Personal Configs), the CLI workflow (`doppler run --`, `doppler secrets set/get/upload/download`), the Vercel integration and sync, service tokens vs personal tokens vs OIDC Service Account Identities and their scoping, workspace access control, secret rotation, Access and Activity Logs, and wiring secrets into GitHub Actions. It treats a database connection string or an auth provider's API key as an opaque secret value to store and rotate, not something it designs the shape of.

## Paired Stinger
[doppler-stinger](../../doppler-stinger) - the project/config/environment model, CLI and local-dev workflow, Vercel sync, token scoping, CI/CD wiring, and rotation/audit-log guides.

## Trigger phrases
- "set up Doppler"
- "sync secrets to Vercel"
- "rotate this secret"
- "replace our .env with Doppler"
- "scope a service token"
- "wire Doppler into GitHub Actions"
- "which Doppler token can go in production"

## Do NOT route when
- The ask is secret-leak forensics or auditing whether a secret already leaked into logs, commits, or a client bundle: that's security-wasp-drone. This Drone owns where the secret lives and how it gets into a running process; security-wasp-drone proves none of them got out.
- The ask is the broader CI/CD pipeline architecture beyond the single secret-injection step: that's devops-wasp-drone.
- The ask is the Neon/Postgres schema or connection-string shape itself: that's db-wasp-drone, this Drone only stores and rotates the connection string as an opaque value.
- The ask is which auth provider to use or that provider's own API surface: that's auth-wasp-drone or a provider-specific Drone like workos-wasp-drone.

## Inputs the Drone needs
- Whether this is initial project/config setup, a `.env` replacement, a Vercel sync, CI wiring, or a rotation task
- The existing Doppler project layout, if any (flag "one project per team" as an anti-pattern)
- Which environment the token targets, since a Service Token is scoped to exactly one config in one project
- Whether the secret rotation needs to coordinate with a release cutover

## Outputs
- Doppler project/config scaffolding or `doppler run --` local-dev wiring
- A Vercel sync configuration or GitHub Actions secret-injection step
- A rotation plan or an ADR at `library/knowledge/private/architecture/ADR-<n>-doppler-<topic>.md`

## Commonly sequenced with
- security-wasp-drone: audits whether masking and access control actually hold, and handles leak forensics
- devops-wasp-drone: owns the surrounding CI/CD pipeline this Drone's secret-injection step plugs into
- db-wasp-drone: owns the connection-string shape this Drone stores and rotates as an opaque secret
- ci-release-wasp-drone: coordinates rotation timing with a deploy cutover
