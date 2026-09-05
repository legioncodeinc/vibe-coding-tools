# Doppler CLI guide: run, secrets set/get/download, commands reference

- URL: https://docs.doppler.com/docs/cli ; https://docs.doppler.com/docs/setting-secrets ; https://docs.doppler.com/docs/accessing-secrets
- Fetched: 2026-08-14
- Source type: Official docs (docs.doppler.com)
- Component: CLI

## Content

### Installation

Lightweight binary, every major OS/package manager, Docker supported. Install (macOS): `brew install dopplerhq/cli/doppler` (requires `gnupg`). Windows: `winget install doppler.doppler` or Scoop. Linux: apt/yum/apk repos or a shell-script installer for ephemeral environments like CI. Verify with `doppler --version`; self-update with `doppler update`.

### Authentication

- Local development: `doppler login` opens a browser to authenticate; only needed once per workplace (or once per scoped directory for multiple workplaces).
- Service Token (production/live environments): `echo 'dp.st.prd.xxxx' | doppler configure set token --scope /`.

### Basic usage: `doppler run`

```shell
doppler run -- your-command-here
doppler run --command="./configure && ./process-jobs; ./cleanup"
```

Injects the latest secrets as environment variables into the child process; works with any language since it's just env vars (`process.env`, `os.getenv`, `ENV[...]`, etc.). Escaping matters for one-off commands referencing a secret - use single quotes or escape `$`:

```shell
doppler run --command="echo \$SECRET_NAME"
doppler run --command='echo $SECRET_NAME'
```

### Full top-level command list (from `doppler help`)

```text
activity, changelog, completion, configs, configure, environments,
feedback, flags, help, import, login, logout, me, open, projects,
run, secrets, settings, setup, tui, update
```

Key global flags: `--project`/`-p`, `--config`/`-c`, `--token`/`-t`, `--scope`, `--json`, `--silent`, `--no-check-version`.

### `doppler setup` and `doppler.yaml`

`doppler setup` scopes a directory (and subdirectories) to a specific project/config so `-p`/`-c` flags aren't needed on every invocation. For monorepos, a `doppler.yaml` can map multiple subdirectories to different projects/configs:

```yaml
setup:
  - project: backend
    config: dev_personal
    path: backend/
  - project: frontend
    config: dev_personal
    path: frontend/
```

`doppler setup --no-interactive` applies this file without prompts.

### Setting secrets

`doppler secrets set` creates/updates one or more secrets interactively, via key-value pairs, or via stdin. Multi-line secrets (PEM/SSH keys) are supported:

```shell
cat ./id_rsa | doppler secrets set SSH_KEY
```

`doppler secrets upload` populates a project from an existing `.env` or `.json` file without leaving the terminal:

```shell
doppler secrets upload sample.env
doppler secrets upload secrets.json
```

Uploading from one config to another (piping a download into an upload):

```shell
doppler secrets upload -p DESTINATION_PROJECT -c DESTINATION_CONFIG <(doppler secrets download -p SOURCE_PROJECT -c SOURCE_CONFIG --no-file --format json)
```

### Getting/downloading secrets

```shell
doppler secrets get SECRET_NAME --plain          # single value to stdout
doppler secrets get TLS_CERT --plain > /etc/tls/cert.pem
doppler secrets download --no-file --format=json # all secrets, various formats
```

Download formats: `json` (default), `yaml`, `env`, `env-no-quotes`, `docker`, `dotnet-json`. Doppler explicitly recommends AGAINST downloading secrets to plaintext files on disk; prefer the mount feature (ephemeral named pipe, auto-cleaned on process exit) or bash process substitution so the value never touches the filesystem:

```shell
set -a
source <(doppler secrets download --no-file --format env)
set +a
```

Custom formats via `jq` piping are supported for targets without a first-class format (example: Apache `SetEnv` lines).

### Referencing secrets

`${SECRET_NAME}` references another secret in the same config; `${config.SECRET_NAME}` references another config in the same project; `${project.config.SECRET_NAME}` references across projects (paid plans only, and the referencing user must have access to the target). References resolve at read time; if the target is deleted/renamed, the literal `${...}` string becomes the value (a "dangling reference" risk) until the path becomes resolvable again, at which point it silently starts resolving - so stale references should be tracked and cleaned up, not left in place.

### Generating an ephemeral service token from the CLI

```shell
doppler configs tokens create your-token-name-here -p PROJECT -c CONFIG --max-age 1m --plain
```
