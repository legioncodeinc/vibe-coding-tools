# Distilled: Go toolchain, modules, vendoring, and plugin ABI
- Research window: 2026-09-01 to 2026-09-04 (current-docs sweep)
- Raw archive: `references/research/raw/01` through `05`
- Every claim cites its raw file by number.

## 1. Toolchain selection is declarative and automatic

- The `go` line in `go.mod` is a hard minimum since Go 1.21; a newer toolchain is selected automatically when GOTOOLCHAIN permits (default `auto`) [raw/01].
- `GOTOOLCHAIN=auto` == `local+auto`: start with the bundled toolchain, switch to a newer one if `go`/`toolchain` lines demand it. `+path` forms disable the download fallback [raw/01].
- The `toolchain` directive is a suggestion managed by `go get toolchain@...`; `go get go@latest` moves both lines [raw/01].
- Practical rule for forks: do not hand-pin toolchains in CI images unless you also set `GOTOOLCHAIN=local`; otherwise the toolchain downloads silently and builds stop being reproducible offline [raw/01].
- Toolchain downloads go through GOPROXY with checksum verification and fail under `GOSUMDB=off` [raw/01].

## 2. Vendoring

- `go mod vendor` copies all packages needed to build and test the main module into `vendor/` plus the `vendor/modules.txt` manifest; at go 1.17+ dependency `go.mod`/`go.sum` files are omitted and go versions are recorded in the manifest [raw/03].
- A vendor dir at the main module root is used automatically at go 1.14+ when `vendor/modules.txt` is consistent with `go.mod`; inconsistency is a hard error, fixed by rerunning `go mod vendor` [raw/03].
- `-mod=vendor` forbids network and module cache. `go mod download`, `go mod tidy`, and `go get` still touch the network even when vendoring is enabled [raw/03].
- Vendoring a fork is not the same as forking into the tree: "fork-in-tree" (copy the upstream module into your repo as its own module and wire `replace`) keeps full source ownership and lets you commit changes; `vendor/` is only a dependency cache and must never be hand-edited [raw/03].

## 3. Module layout

- `go.mod` at the project root; module path matches repo path; package name matches last path element [raw/04].
- `internal/` is the only go-command-enforced visibility rule: importable only from within the tree rooted at internal's parent [raw/04].
- `cmd/` per command is convention, useful in mixed repos; server logic is recommended to live under `internal/` [raw/04].

## 4. Plugin ABI (.so) constraints

- Plugins are `main` packages built with `-buildmode=plugin`, loaded with `plugin.Open`; init functions run on first Open, main does not, plugins cannot be closed [raw/02].
- Linux, FreeBSD, macOS only. Not Windows, not wasm [raw/02].
- Hard rule: the application and every plugin must be compiled with "exactly the same version of the toolchain, the same build tags, and the same values of certain flags and environment variables," and shared dependencies must come from "exactly the same source code." In practice: build the binary and all .so files in one Dockerfile stage from one module graph [raw/02].
- Race detector is unreliable across plugin boundaries [raw/02].

## 5. Supported versions (as of the sweep)

- go1.27 (2026-08-19, patch 1.27.1), go1.26 (patch 1.26.8), go1.25 (patch 1.25.14) are the supported lines [raw/05].
- A Go toolchain older than a module's `go` line refuses to load the module but can auto-switch upward; it can never switch downward [raw/01][raw/05].

## 6. Known gaps in this archive

- Workspace (`go.work`) mechanics beyond the toolchain interaction: not archived.
- `go generate`, embed (`//go:embed`) specifics: not archived; consult go.dev before asserting.
- Cross-compilation matrix and CGO_ENABLED interactions beyond plugins: not archived.
- Module proxy protocol internals (beyond toolchain downloads): not archived.
If a task lands in a gap, consult live go.dev docs and add a raw file rather than guessing.
