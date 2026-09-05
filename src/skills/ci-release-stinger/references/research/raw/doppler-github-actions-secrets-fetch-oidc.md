# Doppler in GitHub Actions: GitHub sync integration, Secrets Fetch Action, OIDC auth

- URL: https://docs.doppler.com/docs/github-actions ; https://github.com/DopplerHQ/secrets-fetch-action ; https://docs.doppler.com/docs/github-oidc-examples ; https://docs.doppler.com/docs/service-account-identities
- Fetched: 2026-08-14
- Source type: Official Doppler docs + official Doppler GitHub Action repo
- Component: Secret handling in GitHub Actions with Doppler / OIDC

## Content

### Two distinct integration paths, and when each applies

**Path 1 - Doppler GitHub Application (native sync).** Authorize the Doppler GitHub App (`github.com/apps/doppler-secretops-platform`) against a repo (or org), choose the target feature (Actions, Codespaces, or Dependabot), and choose which Doppler config syncs to it. Every add/update/remove of a secret **in Doppler** instantly propagates to the corresponding GitHub secret. This is the recommended default "if the GitHub Actions for your repository only require secrets from a single config" per the official Secrets Fetch Action README. A limitation worth flagging: Doppler cannot import existing GitHub secret *values* back into Doppler (GitHub's API doesn't expose secret values), so migrating an existing set of GitHub-native secrets into Doppler requires either re-entering them manually in Doppler, or running a one-time `workflow_dispatch` export workflow that uploads the current `${{ toJson(secrets) }}` payload into a target Doppler config.

**Path 2 - `dopplerhq/secrets-fetch-action`.** Used when a single workflow run needs secrets from **multiple different Doppler configs** (e.g. a monorepo where different apps need different configs) - the native sync integration is a single repo-to-single-config mapping, so it doesn't fit that shape.

### Secrets Fetch Action auth methods (three, in order of preference)

1. **Service Account Identity via OIDC (recommended)** - no static token stored anywhere. Requires `permissions: id-token: write` on the job so Doppler's action can obtain a GitHub-issued OIDC JWT and exchange it for Doppler access, scoped to the identity's configured project/config.
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
2. **Service Account Token** - a static token scoped to a service account with project/config-level access; requires the Team or Enterprise Doppler plan.
3. **Service Token** - read-only access to exactly one config, stored as a repo secret named `DOPPLER_TOKEN` (or prefixed per-app for monorepos, e.g. `AUTH_API_DOPPLER_TOKEN`), supplied via `doppler-token: ${{ secrets.DOPPLER_TOKEN }}`.

Fetched secrets are available either as step `outputs` (`${{ steps.doppler.outputs.API_KEY }}`) or, with `inject-env-vars: true`, as environment variables for all subsequent steps in the job - the README explicitly warns the env-var mode exposes values to *any* subsequent process in the job, so prefer scoped `outputs` where a workflow can.

**Automatic masking:** every fetched secret value is masked in Action logs by default, except the Doppler meta variables (`DOPPLER_PROJECT`, `DOPPLER_ENVIRONMENT`, `DOPPLER_CONFIG`) and any secret explicitly marked `unmasked` visibility in Doppler (useful for non-sensitive values like a public port or base URL that would otherwise be needlessly redacted in logs).

### OIDC without the Secrets Fetch Action (raw CLI pattern)

For cases needing the Doppler CLI directly rather than the Action (e.g. `doppler run --` wrapping a build command), the manual OIDC exchange inside a workflow step:

```yaml
permissions:
  id-token: write
steps:
  - name: Get OIDC token
    run: |
      TOKEN=$(curl -s -H "Authorization: Bearer $ACTIONS_ID_TOKEN_REQUEST_TOKEN" \
                   "${ACTIONS_ID_TOKEN_REQUEST_URL}&audience=https://github.com/$GITHUB_REPOSITORY_OWNER")
      echo "OIDC_TOKEN=$(echo $TOKEN | jq -r '.value')" >> $GITHUB_ENV
  - uses: dopplerhq/cli-action@v3
  - run: doppler oidc login --scope=. --identity=${{ vars.DOPPLER_SERVICE_IDENTITY_ID }} --token=$OIDC_TOKEN
  - run: doppler run -p <project> -c <config> -- <build command>
```

Doppler's docs explicitly warn secrets fetched via this raw CLI path are **not automatically masked** the way the Secrets Fetch Action's output is - if a secret ends up in step output or logs via this path, masking must be applied manually (GitHub's own `::add-mask::` workflow command). This is a concrete reason to prefer the Secrets Fetch Action over the raw CLI OIDC flow whenever the choice is available.

### Service Account Identity setup is the shared prerequisite

Both the OIDC-based Secrets Fetch Action mode and the raw CLI OIDC mode require a Doppler **Service Account Identity** configured first (Doppler dashboard: service account detail page -> configure identity -> GitHub as the trusted OIDC provider). Once configured, `doppler oidc login` or the Action's `auth-method: oidc` exchanges GitHub's per-run OIDC token for a short-lived Doppler API token - the docs note this short-lived token can optionally be explicitly revoked (`doppler oidc logout --scope=.`) at the end of a job, though it isn't required since it expires quickly on its own.

### Framing for this skill's decision guidance

Single-config repo, simplest possible setup: use the GitHub App sync integration, no workflow YAML at all for secret delivery. Multi-config/monorepo, or a repo wanting zero long-lived Doppler tokens stored anywhere in GitHub: use the Secrets Fetch Action with `auth-method: oidc`. Needing the Doppler CLI's own `doppler run --` wrapping behavior beyond a flat env/output injection: use the raw CLI OIDC pattern, but take on the manual-masking responsibility that comes with it.
