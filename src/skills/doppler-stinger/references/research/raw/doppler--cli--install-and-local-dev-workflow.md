# Local development workflow: install, doppler setup, replacing .env

- URL: https://docs.doppler.com/docs/install-cli ; https://docs.doppler.com/docs/secrets-setup-guide ; https://docs.doppler.com/docs/vitejs-and-sveltejs
- Fetched: 2026-08-14
- Source type: Official docs (docs.doppler.com)
- Component: CLI / Local dev / Vite-Svelte

## Content

### Local development flow

1. `doppler login` - browser auth, once per workplace.
2. `cd` into the project directory, run `doppler setup` to select project + config (usually the repository root). This must be run per project.
3. Optionally pre-configure via `doppler.yaml` in the repo root (or per app folder in a monorepo) so `doppler setup` needs no prompts:

```yaml
setup:
  - project: example
    config: dev_personal
```

4. Run the app through the CLI: `doppler run -- your-command-here`.

### How project/config resolution works (lookup precedence)

Doppler does NOT rely on local files in the project directory itself to know which project/config to use (no `.doppler` file living in the repo by default). Instead it looks up `~/.doppler/.doppler.yaml`, keyed by directory scope, with this precedence:

1. Project/config tied to a supplied Service Token (`DOPPLER_TOKEN` env var or `--token` flag) - always wins.
2. Explicit `--project`/`--config` flags.
3. Exact match in `~/.doppler/.doppler.yaml` for the current directory.
4. Nearest parent directory match, walking up until one is found or the lookup fails.

Moving a project directory loses its Doppler configuration (the move doesn't update `.doppler.yaml`); re-run `doppler setup`. `doppler configure` shows what's currently resolved for a directory; `doppler configure reset` clears all entries workplace-wide (last resort - requires re-login and re-setup for every project).

### Automatic restarts

On the Team plan, `doppler run --watch -- your-command-here` automatically restarts the wrapped process when secrets change - useful for local dev so a changed secret doesn't require a manual restart.

### Remove .env file usage

Doppler's own guidance, stated directly in the install docs: "Now that Doppler is injecting secrets as environment variables, it's best to remove all application code relying on `.env` files as well as `.env` files that may still exist locally. This instantly improves security by removing the storage of unencrypted secrets from your file system and avoids potential confusion as to what the source of truth is for the loading of environment variables."

### Fallback files (offline development)

The CLI automatically creates encrypted fallback files so development can continue offline; they refresh automatically once back online. This is separate from - and safer than - manually downloading secrets to a plaintext `.env`.

### Vite / SvelteKit-adjacent guidance

Doppler's own Vite.js/Svelte.js guide (a close analog for a SvelteKit app): create the project, run `doppler setup` in the app directory, import an existing `.env` with `doppler import .env` if one exists, then run the dev server through the CLI:

```shell
doppler run -- vite
```

Variables prefixed `VITE_` are exposed to client code via `import.meta.env`; the guide explicitly warns not to prefix sensitive/secret variables with `VITE_` since anything with that prefix ships to the browser bundle. This client/server exposure boundary is a Vite convention, not a Doppler-specific mechanism, but it is the exact boundary a SvelteKit app (which uses Vite) must respect: only `PUBLIC_`-style (SvelteKit's own convention is `$env/dynamic/public` / `$env/static/public` and a `PUBLIC_` prefix) variables belong on the client; everything else must stay server-only.

### Local dev vs. team sync

Every developer gets their own private development config (Personal Config, see `root-configs-and-branch-configs.md` raw file) so a change one developer makes locally doesn't affect teammates until explicitly promoted to the root config. Changes to the root config auto-pull to team members' clients on next fetch.
