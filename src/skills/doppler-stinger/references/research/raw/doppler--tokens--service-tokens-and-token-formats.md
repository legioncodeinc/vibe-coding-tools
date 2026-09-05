# Service tokens vs. personal tokens vs. service account tokens, and token formats

- URL: https://docs.doppler.com/docs/service-tokens ; https://docs.doppler.com/reference/api ; https://docs.doppler.com/reference/auth-token-formats
- Fetched: 2026-08-14
- Source type: Official docs (docs.doppler.com)
- Component: Access tokens / Authentication

## Content

### Six token types (per the API reference)

| Token type | Access | Generated from |
| --- | --- | --- |
| Personal Token | Read/write to all resources on the account | Tokens > Personal page on the dashboard |
| Service Token | Read (or read/write) to secrets within one specific config | Project > Config > Access page |
| Service Account Token | A granular set of resources within the workplace, attached to a Service Account | Service Account settings |
| Service Account Identity Token | Same as above but obtained via short-lived OIDC identity exchange rather than a static stored secret | Service Account Identity configuration |
| CLI Token | Set via `doppler login`; same permission as the authenticating user | Login flow |
| (Legacy/other API token types exist but are not detailed further here) | | |

### Service Tokens - the production/live-environment credential

A Service Token provides **read-only** secrets access to a specific config within a project, adhering to least privilege (an application only ever gets one config in one project). Doppler's own docs state plainly: do not use a CLI or Personal Token in live environments - both carry write access with the full permission set of the account that created them.

Creating a Service Token:
- Dashboard: Project > Config > **Access** tab > **Generate** > name it, optionally grant write access or an expiration > copy immediately (shown once).
- CLI: `doppler setup` then `doppler configs tokens create token-name --plain`, or in one line: `doppler configs tokens create --project your-project --config your-config token-name --plain`.

Three ways to supply a Service Token to the CLI at runtime:

1. **Persisted Service Token** (best for VMs - survives restarts, scoped to a directory):
   ```shell
   echo 'dp.st.prd.xxxx' | doppler configure set token --scope /usr/src/app
   ```
2. **`DOPPLER_TOKEN` environment variable** - best when a sync integration isn't possible, or multiple configs are needed in one CI system:
   ```shell
   export DOPPLER_TOKEN='dp.st.prd.xxxx'
   doppler run -- your-command-here
   ```
   Also shown for Docker (`-e DOPPLER_TOKEN=...`), Docker Compose, and Kubernetes (`kubectl create secret generic doppler-token --from-literal=DOPPLER_TOKEN=...` then `envFrom.secretRef`).
3. **`--token` flag** directly on `doppler run --token='dp.st.prd.xxxx' -- your-command-here`.

**Ephemeral Service Tokens**: set an expiration and the token auto-deletes after that duration.
```shell
export DOPPLER_TOKEN=$(doppler configs tokens create ephemeral-token --max-age 1m --plain)
```

**Revocation**: irreversible, immediate. Dashboard: Access tab > Revoke. CLI: `doppler configs tokens revoke -p PROJECT -c CONFIG dp.st.dev.fHhinxK...`. Note: revoking a token doesn't retroactively break an already-running process that's holding the last-fetched secrets in the CLI's local encrypted fallback file - the fallback continues serving the last successfully fetched version until a fresh fetch is attempted and denied.

### Token formats (used for secret-scanning identification)

| Token type | Regex format | Example |
| --- | --- | --- |
| Personal Token | `/dp\.pt\.[a-zA-Z0-9]{40,44}/` | `<DOPPLER_PERSONAL_TOKEN>` |
| Service Token | `/dp\.st\.(?:[a-z0-9\-_]{2,35}\.)?[a-zA-Z0-9]{40,44}/` | `<DOPPLER_SERVICE_TOKEN>` |

The Service Token format embeds the config slug (`dev`, `prd`, etc.) right in the token string, which is a useful visual/grep signal for which environment a leaked or logged token belongs to.

### OIDC / Service Account Identities (avoiding a static token entirely)

Referenced in the install-cli doc: Service Account Identities let a service authenticate to Doppler via OIDC without a static API token. Any tool that can produce an OIDC token (GitHub Actions, GitLab CI, CircleCI, etc.) is compatible:

```shell
doppler oidc login --scope=. --identity=00000000-0000-0000-0000-000000000000 --token=$CIRCLE_OIDC_TOKEN_V2
```
