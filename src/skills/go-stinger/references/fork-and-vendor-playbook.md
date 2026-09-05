# Fork-and-vendor playbook for Go monorepos

Worked procedure for taking ownership of an upstream Go repository (the stayfrosty Bifrost freeze is the motivating case). Grounded in `references/research/`.

## Decide: vendor/ vs fork-in-tree

| | `vendor/` directory | Fork-in-tree (`services/<name>/` or similar) |
|---|---|---|
| Own the source? | No - generated, never hand-edit | Yes - full commit-level ownership |
| Local modifications? | Impossible (clobbered by `go mod vendor`) | Normal git commits |
| Upgrades | `go get -u` + re-vendor | `git remote add upstream` + merge/rebase onto the pinned tag |
| Build hermeticity | Good | Good (source is in-repo) |

Rule: if you will modify the Go code, fork-in-tree. `vendor/` is for dependency caching only [raw/03].

## Fork-in-tree procedure

1. Pin the upstream ref. Record: repo URL, tag (or commit), and the exact commit SHA of the annotated tag's dereference (`<tag^{}`), plus the local clone date. Write this into a `FROSTY.md`/`PROVENANCE.md` at the fork root.
2. Clone once with partial clone to keep it cheap, then copy the working tree without `.git`:
   ```bash
   git clone --filter=blob:none --no-checkout https://github.com/<org>/<repo> /tmp/upstream
   cd /tmp/upstream && git fetch --depth 1 origin "refs/tags/<tag>:refs/tags/<tag>"
   git checkout <tag>          # fetches blobs for this tree only
   rsync -a --exclude=.git /tmp/upstream/ /path/to/repo/services/<name>/
   ```
3. Verify the fork builds before changing anything: `go build ./...` and `go test ./...` from the fork root. Record failures as pre-existing; do not fix upstream bugs silently in the same commit as the import.
4. Add your NOTICE obligations (Apache 2.0: keep LICENSE, THIRD_PARTY_NOTICES, add a NOTICE-of-changes file).
5. Point sibling modules at the fork with a `replace` directive when they previously required the upstream module path:
   ```
   require github.com/upstream/core vX.Y.Z
   replace github.com/upstream/core => ../<fork>/core
   ```
   A replaced directory must contain its own `go.mod` [raw/03]. Replacements change the module graph, so re-run `go mod tidy` and `go mod vendor` in every consuming module [raw/03].
6. Strip deliberately, not eagerly: delete a directory only after confirming nothing in the build graph imports it (`go build ./...` is the test). Enterprise/licensed dirs that compile cleanly can be left on the floor (present but unshipped) and removed in a later pass.

## One-tag rule for plugin ABI

If the binary loads .so plugins, everything is built from one toolchain, one module graph, one build: pin binary + plugins to the same commit, in the same Dockerfile, in one `go build` pass each, sharing module cache [raw/02]. A version mismatch between plugin go.mod and the binary's dependency versions is a latent runtime crash, not a load-time error you can catch in CI without building both together [raw/02].

## Upgrade procedure (later)

1. Read the upstream changelog between the pinned tag and the candidate; classify: CVEs, provider/API breaks, features wanted, cosmetic.
2. In the fork repo: `git remote add upstream <url>`, `git fetch upstream tag <new-tag>`, merge or rebase local commits onto it.
3. Rebuild binary + plugins together; rerun the full test suite; bump every consuming `replace` in the same commit.
