# Guide: vendoring/freezing an upstream Go repository

Verb: "vendor this repo", "freeze upstream at tag X", "take ownership of the Go backend", "upgrade the fork".

## Preconditions

- You know the upstream URL and the candidate tag. If not, `git ls-remote --tags <url>` first; monorepos often use namespaced tags (`core/v1.7.10`, `transports/v1.6.11`) and the Docker image tag is usually the transport/application tag, not the library tag.
- Read the upstream changelog between the currently deployed version and the candidate. Classify every entry: security fix (take), API/schema break (evaluate against your consumers), feature (explicit want only), cosmetic (skip).

## Steps

1. Record the freeze: upstream URL, tag, dereferenced commit SHA, clone date, and the reason for the tag choice. This goes in a provenance file at the fork root. Never freeze to a moving ref (branch name, `latest`).
2. Partial clone and checkout the tag (keeps the fetch to one tree):
   ```bash
   git clone --filter=blob:none --no-checkout <url> /tmp/upstream
   cd /tmp/upstream
   git fetch --depth 1 origin "refs/tags/<tag>:refs/tags/<tag>"
   git checkout <tag>
   ```
3. Copy the tree in without `.git` (rsync on Git Bash: `rsync -a --exclude=.git /tmp/upstream/ <dest>/`; pure-cp fallback: `cp -r` then delete `.git`). Check for and copy `.gitattributes`-relevant files (line endings) if the repo has them.
4. Verify the import is green before any edits: `go build ./... && go test ./...` at the fork root. If the host toolchain is older than the module's `go` line, GOTOOLCHAIN=auto will download the required one; if the network forbids downloads, install the matching toolchain first [raw/01].
5. Apply license obligations: keep upstream LICENSE and THIRD_PARTY_NOTICES verbatim at the fork root; add a NOTICE-of-changes listing the local modifications you make later.
6. Wire consumers with `replace` directives pointing at in-repo module paths; re-run `go mod tidy` and `go mod vendor` in each consumer [raw/03].
7. If the binary loads .so plugins: rebuild every plugin from the same commit and toolchain in the same pipeline (see `guides/02-cgo-plugin-build.md`).

## Stripping directories from a forked monorepo

- Never delete a directory on sight. First check the import graph: `go list -deps ./...` from the binary's main package, or attempt `go build ./...` after removal.
- Enterprise/licensed directories that compile cleanly and are not wired into the shipped binary config can stay on the floor in the first pass; remove them in a dedicated follow-up commit once the build graph confirms nothing references them.
- Frontend trees (e.g. an embedded `ui/`) are build inputs to the server binary via embed; removing them breaks the Docker build. Decide keep-vs-strip per the product decision, not per code hygiene.

## Red flags

- `go.sum` inconsistent errors after a replace: re-run `go mod tidy` in the module that owns the replace.
- Vendor dir inconsistency (`vendor/modules.txt` vs `go.mod`): always fix by rerunning `go mod vendor`, never by hand-editing [raw/03].
- A plugin module requiring a different version of a shared dependency than the binary: stop and align to one commit before shipping [raw/02].
