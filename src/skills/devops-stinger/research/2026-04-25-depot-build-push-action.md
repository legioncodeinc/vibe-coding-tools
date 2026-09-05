# Depot build-push-action: drop-in for docker/build-push-action

**Source:** https://github.com/depot/build-push-action + https://depot.dev/docs/container-builds/integrations/github-actions + https://depot.dev/blog/docker-layer-caching-in-github-actions
**Retrieved:** 2026-04-25

## The drop-in claim

Depot publishes `depot/build-push-action` with the explicit goal of being a drop-in replacement for `docker/build-push-action`. The README states: "you can use it as a drop-in replacement [...] just change the action name and add the `project` input."

Compatible inputs (per the action's README):

- `context`, `file`, `target`, `tags`, `labels`
- `push`, `load`, `outputs`
- `platforms`, `build-args`
- `secrets`, `secret-files`, `ssh`
- `sbom`, `provenance`
- `pull`, `no-cache`

Inputs **not** needed (Depot handles internally):

- `cache-from`, `cache-to`: Depot has persistent NVMe cache shared across builds; no manual cache wiring.
- `setup-buildx` step: `depot/setup-action` replaces it.

## The migration diff

```diff
- - uses: docker/setup-buildx-action@<sha>
- - uses: docker/build-push-action@<sha>
+ - uses: depot/setup-action@<sha>
+ - uses: depot/build-push-action@<sha>
    with:
+     project: ${{ vars.DEPOT_PROJECT_ID }}
      context: .
      push: true
      tags: ghcr.io/me/app:latest
-     cache-from: type=gha
-     cache-to: type=gha,mode=max
```

Net: 5-line change. `cache-from`/`cache-to` deletions are optional (they'd be ignored), but cleaner to remove.

## Cache behavior

- Persistent NVMe cache, project-scoped (not per-runner, not per-branch).
- Shared across team + local builds + CI.
- A developer running `depot build .` locally hits the same cache as the CI build for that project.
- Cache invalidation is per-layer, BuildKit-aware.

This is materially different from:

- GHA cache backend (`type=gha`): 10 GB cap, per-repo, per-branch scope, network restore.
- Registry cache (`type=registry`): pull cost on every restore, no cap but pay storage.
- Inline cache (`type=inline`): cache only in the final stage, requires pulling previous image.

## Multi-arch native

`platforms: linux/amd64,linux/arm64` runs each arch on native silicon (Intel + Graviton in Depot's infrastructure). No QEMU. No matrix gymnastics with separate jobs + manifest merge.

For comparison: a Node app under QEMU on a free GH-hosted runner takes 8-12 min for arm64 alone. On Depot native, often 1-3 min for both arches together.

## OIDC support

Depot project settings allow GitHub repo + branch claims as trusted issuers. The workflow declares `permissions: id-token: write`, the action requests an OIDC token, Depot accepts it. No `DEPOT_TOKEN` repo secret needed.

## Relevance to this Stinger

- `guides/07-depot-integration.md`: primary guide.
- `templates/.github/workflows/reusable-build.yml`: uses `depot/setup-action` + `depot/build-push-action` by default.
- `templates/.github/workflows/main-deploy.yml`: multi-arch via Depot.
- `examples/nextjs-with-depot-oidc.md`: full migration.
- Migration is positioned as a 5-line diff per workflow, not a re-architecture.
