# 13 - Secret handling in GitHub Actions: Doppler and GitHub OIDC

Primary case. This skill owns secret handling as it touches GitHub Actions workflow authoring. `doppler-stinger` owns the deeper Doppler platform mechanics (project/config model, rotation, Vercel sync, the Doppler-vs-raw-Vercel-env-vars decision) - where it already has CI/Actions guidance (`doppler-stinger/guides/05-cicd-in-github-actions.md`), link to it rather than re-deriving it. This guide is this skill's own condensed operational version for wiring a workflow, not a replacement.

## Two Doppler integration paths, and when each applies

**Native GitHub App sync** - authorize the Doppler GitHub App against a repo, pick a target (Actions/Codespaces/Dependabot) and a source Doppler config. Every secret change in Doppler instantly propagates to the corresponding GitHub secret, with zero workflow YAML for secret delivery. Fits a repo where all workflows need secrets from a **single** Doppler config.

**`dopplerhq/secrets-fetch-action`** - needed when one workflow needs secrets from multiple different Doppler configs (e.g. a monorepo with per-app configs), since the native sync integration is a single-repo-to-single-config mapping.

Source: `research/distilled-ci-release.md` §5.

## Secrets Fetch Action: three auth methods, ranked

1. **Service Account Identity via OIDC (recommended, default choice for this repo).** No static token stored anywhere.
   ```yaml
   permissions:
     id-token: write
   steps:
     - uses: dopplerhq/secrets-fetch-action@v2.0.0
       id: doppler
       with:
         auth-method: oidc
         doppler-identity-id: ${{ vars.DOPPLER_SERVICE_IDENTITY_ID }}
         doppler-project: <project>
         doppler-config: <config>
   ```
2. **Service Account Token** - static, requires Doppler Team/Enterprise plan.
3. **Service Token** - static, read-only, single config, stored as `DOPPLER_TOKEN`.

Fetched secrets are auto-masked in logs (except Doppler's own meta vars and anything explicitly marked `unmasked`). Prefer scoped `outputs` (`${{ steps.doppler.outputs.API_KEY }}`) over `inject-env-vars: true`, which exposes every fetched value to all subsequent processes in the job. Source: `research/distilled-ci-release.md` §5.

**The raw-CLI OIDC pattern does NOT get automatic masking** - if a workflow needs `doppler run --` specifically rather than the Action's output/env injection, take on manual masking responsibility (`::add-mask::`) for anything that could leak into logs.

## General GitHub Actions OIDC pattern (beyond Doppler)

Applies identically to AWS, GCP, and any provider with an official OIDC integration:

1. Grant `id-token: write` (workflow- or job-scoped; does not grant any other write access, only the ability to request/use an OIDC token).
2. Exchange via the provider's official login action (`aws-actions/configure-aws-credentials`, `google-github-actions/auth`) rather than a hand-rolled `curl` exchange, when one exists.
3. Scope the cloud-side trust condition on the token's `sub` claim (and usually `aud`), as tightly as the workflow's actual blast radius requires - down to a specific branch or GitHub Environment where the provider's syntax supports it, not just the repo as a whole.

**Currency note directly relevant to writing a trust policy today:** repositories created after **2026-07-15** default to an immutable `sub` claim format embedding numeric owner/repo IDs, not just names. A trust-policy example copied from an older tutorial may use the legacy name-only format and silently fail to match a newly-created repo's actual token. Check which format the target repo uses before copying a trust-policy snippet verbatim. Source: `research/distilled-ci-release.md` §5.

## Severity framing

- **Must-fix:** a static long-lived cloud/Doppler credential stored as a GitHub secret where an OIDC path is available and the provider has an official integration; a secret fetched via the raw CLI OIDC path with no manual masking, printed in a log step.
- **Should-refactor:** using `inject-env-vars: true` where scoped `outputs` would have sufficed; a trust policy using the legacy `sub` format on a repo created after 2026-07-15 without verifying which format applies.
- **Style:** secret naming convention drift, missing comment explaining why a particular auth method was chosen over OIDC.

## Cross-references

- `doppler-stinger` - the full Doppler platform picture (project/config model, rotation, audit logs, Vercel sync). Its `guides/05-cicd-in-github-actions.md` is the deeper version of this guide's Doppler section.
- `security-stinger` - secret-leak forensics and proving nothing reached logs/commits/client bundles; this guide owns wiring, security-stinger owns the audit.
- `guides/12-migration-gating-drizzle-neon.md` - where a Doppler-managed `DATABASE_URL` feeds into migration gating.
