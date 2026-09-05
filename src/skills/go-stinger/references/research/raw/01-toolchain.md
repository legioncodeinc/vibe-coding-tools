# Go toolchains: go directive, GOTOOLCHAIN, toolchain upgrades
- URL: https://go.dev/doc/toolchain
- Fetched: 2026-09-04
- Source type: official docs

## The go directive and toolchain interaction

- The `go` line declares the minimum required Go version for using the module or workspace. Since Go 1.21 it is a mandatory requirement: "Go toolchains refuse to load a module or workspace that declares a minimum required Go version greater than the toolchain's own version." E.g. Go 1.21.2 refuses a `go 1.21.3` or `go 1.22` line.
- Implicit defaults: omitting the line in `go.mod` means `go 1.16`; in `go.work`, `go 1.18`.
- A module's `go` line must be >= the `go` version of every module in its `require` statements; a workspace's `go` line must be >= every module in `use` statements.
- The `go` line sets the language version the compiler enforces. Per-file override via build constraint: `//go:build go1.22` ensures only Go 1.22+ compiles the file and changes that file's language version to 1.22.

## GOTOOLCHAIN settings

Forms: `<name>`, `<name>+auto`, `<name>+path`, where `GOTOOLCHAIN=auto` == `local+auto` and `GOTOOLCHAIN=path` == `local+path`.

| Setting | Behavior |
|---|---|
| `local` | Always runs the bundled Go toolchain |
| `<name>` (e.g. `go1.21.0`) | Always runs that toolchain; searches `$PATH` for a program with that name, otherwise downloads and verifies |
| `<name>+auto` | Starts with `<name>`, but may switch to a newer toolchain per `go`/`toolchain` lines |
| `<name>+path` | Like `+auto` but disables the download fallback - stops after searching the executable path |

Resolution order: process environment (`os.Getenv`) -> user's env default file (`go env -w` / `go env -u`) -> bundled toolchain's `$GOROOT/go.env` (standard toolchains set `GOTOOLCHAIN=auto`). If `go.env` is missing, assumes `GOTOOLCHAIN=local`. `go env GOTOOLCHAIN` prints the setting; since Go 1.24, `GODEBUG=toolchaintrace=1` traces selection.

Startup selection: consults `go.work` (or `go.mod` without a workspace); runs a newer toolchain if the `toolchain <tname>` or `go <version>` line is newer than the default. A `toolchain default` line disables updating beyond `<name>`.

## Toolchain upgrades (automatic switching)

- Applies when GOTOOLCHAIN permits (`auto`/`path` forms) and commands incorporate new modules: `go get`, `go work use`, `go work sync`, `go install package@version`, `go run package@version`. The command prints, e.g.:
  ```
  go: module example.com/widget@v1.2.3 requires go >= 1.24rc1; switching to go 1.27.9
  ```
- Candidates considered (three, per the release policy): latest rc of an unreleased language version, latest patch of the most recent released version, latest patch of the previous version. Per minimal version selection, it picks the oldest candidate satisfying the requirement.
- Any command that updates the `go` line also updates the `toolchain` line to its own name (repeatability). Run twice, only the first run prints the switching message - except `go install package@version` and `go run package@version`, which run in no module/workspace and print a message every time.

## The toolchain directive

- Declares a suggested toolchain; if omitted, an implicit `toolchain goV` is assumed from the `go` line (e.g. `go 1.21.0` => `toolchain go1.21.0`).
- Managed by `go get` like module dependencies:
  ```
  go get go@1.22.1 toolchain@1.24rc1
  go get go@1.25.0 toolchain@none   # toolchain matches go line exactly => line deleted
  go get toolchain@none             # remove toolchain line
  ```
  Downgrading: `go get toolchain@go1.22.9` updates only the toolchain line; `go get toolchain@go1.21.3` downgrades the `go` line too. `go get go@latest` updates to the latest released toolchain. For workspaces: `go work edit -toolchain=none`.

## Downloading details

Toolchains are modules with path `golang.org/toolchain`, version `v0.0.1-goVERSION.GOOS-GOARCH`, downloaded via GOPROXY with checksum-database verification. Downloads fail if `GOSUMDB=off` (checksums can't go in `go.sum` since they depend on GOOS/GOARCH); `GOPRIVATE`/`GONOSUMDB` do not apply.
