# Guide: freezing and upgrading a Bifrost fork

Verb: "freeze Bifrost", "pick the tag", "upgrade the fork to v1.6.x/v2.x", "rebuild the plugin".

## Picking the freeze tag

1. List upstream tags: `git ls-remote --tags https://github.com/maximhq/bifrost` (namespaced; annotated tags need `^{}` dereference).
2. Read `transports/changelog.md` at the candidate tag (or the releases page) between the currently deployed version and the candidate. Classify each entry: security fix, provider/API break, feature, cosmetic.
3. Prefer the tip of the line you already run for maintenance freezes (v1.6.11 over v1.6.7: WebSocket panic fixes, no DB migrations). Take a major bump (v2.x) only as a deliberate migration with its guide: v2.0.0 moves routing endpoints and requires Go 1.27.
4. Record in the fork's provenance file: repo URL, tag, dereferenced commit SHA, clone date, toolchain version, and why this tag.

## Freezing (fork-in-tree)

Follow [[go-stinger]] `guides/01-vendoring-upstream-go.md` for the mechanics (partial clone, copy without .git, verify `go build ./...` before edits). Bifrost-specific points:

- The tree is a monorepo: `core/`, `framework/`, `transports/`, `plugins/`, `ui/`, `docs/`, `cli/`, `examples/`. The gateway binary is `transports/bifrost-http`; its `go.mod` pins core and first-party plugin versions - keep that alignment intact.
- If you keep the embedded dashboard, `ui/` must stay and its build output lands in `transports/bifrost-http/ui` (the Docker build runs the UI build first). If you drop the embedded UI as a product surface, you still need the directory or a stub for the build to pass.
- Enterprise-looking directories (cluster, rbac, scim, guardrails surface code) compile as part of the tree; strip deliberately and only after `go build ./...` confirms nothing references them.
- Keep `docs/` and `AGENTS.md`: they are version-correct references for the contract and for porting.

## Rebuilding a .so plugin against the fork

Plugin ABI is unforgiving: same toolchain, same build tags, same shared-dependency source as the binary ([[go-stinger]] `references/plugin-abi-constraints.md`).

1. The plugin module's `require` of `github.com/maximhq/bifrost/core` must resolve to the same core the binary builds against. Inside the fork, use a `replace github.com/maximhq/bifrost/core => ../core` (or a workspace) so there is exactly one source of truth.
2. Build both in one pipeline (one Dockerfile stage): `go build -buildmode=plugin` for the .so, then the gateway binary, same base image, `CGO_ENABLED=1`, Linux.
3. Verify by loading the .so in the real binary in CI, not just compiling it.

## Upgrading the fork later

1. `git remote add upstream https://github.com/maximhq/bifrost && git fetch upstream tag <new-tag>`.
2. Diff the tag against the pinned commit; read the changelog; note endpoint moves against your `docs/openapi/` extraction.
3. Merge the upstream diff into the fork; resolve conflicts around your local commits (org-scoped handlers, folded-in plugins).
4. Rebuild binary + plugins together; bump every consumer; rerun the full test suite; update the provenance file.
