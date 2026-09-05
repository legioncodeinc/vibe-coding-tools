# Go modules reference: vendoring, vendor/modules.txt, -mod flags, replace
- URL: https://go.dev/ref/mod
- Fetched: 2026-09-04
- Source type: official docs

## What the vendor directory is

Vendoring exists because, by default, "the go command typically satisfies dependencies by downloading modules from their sources into the module cache, then loading packages from those downloaded copies." Vendoring "may be used to allow interoperation with older versions of Go, or to ensure that all files used for a build are stored in a single file tree."

## How go mod vendor works

> "The `go mod vendor` command constructs a directory named `vendor` in the main module's root directory containing copies of all packages needed to build and test packages in the main module. Packages that are only imported by tests of packages outside the main module are not included."

- Build constraints "except for `ignore`" are not considered when constructing the vendor directory.
- It also creates `vendor/modules.txt`, a manifest "that contains a list of vendored packages and the module versions they were copied from." When vendoring is enabled, this manifest "is used as a source of module version information, as reported by `go list -m` and `go version -m`."
- At `go 1.17` or higher, `go mod vendor` "omits `go.mod` and `go.sum` files for vendored dependencies" and "records the go version from each dependency's `go.mod` file in `vendor/modules.txt`."

## When vendor is used automatically

> "If the `vendor` directory is present in the main module's root directory, it will be used automatically if the `go version` in the main module's `go.mod` file is 1.14 or higher."

Equivalently: if `vendor/modules.txt` is present and consistent with `go.mod`, there is no need to explicitly use `-mod=vendor`. Otherwise the go command acts as if `-mod=readonly` were used.

## The -mod flag

- `-mod=vendor` - "tells the go command to use the `vendor` directory. In this mode, the go command will not use the network or the module cache."
- `-mod=mod` / `-mod=readonly` - both "tell the go command to ignore the `vendor` directory" (`-mod=mod` auto-updates `go.mod`; `-mod=readonly` errors if `go.mod` needs updating).
- Default: go 1.14+ with a vendor dir present acts as `-mod=vendor`; otherwise acts as `-mod=readonly`.

## Behavior while vendoring is enabled

> "When vendoring is enabled, build commands like `go build` and `go test` load packages from the vendor directory instead of accessing the network or the local module cache. The `go list -m` command only prints information about modules listed in `go.mod`."

However, "go mod commands such as `go mod download` and `go mod tidy` do not work differently when vendoring is enabled and will still download modules and access the module cache. `go get` also does not work differently when vendoring is enabled."

## Consistency verification

> "When the go command reads `vendor/modules.txt`, it checks that the module versions are consistent with `go.mod`. If `go.mod` has changed since `vendor/modules.txt` was generated, the go command will report an error. `go mod vendor` should be run again to update the vendor directory."

## Replace directives and other locations

- Only the main module's vendor dir counts: "the go command ignores `vendor` directories in locations other than the main module's root directory."
- Local-path replacements (`replace example.com/bad => ./fork/net`) require the replacement directory to "contain a `go.mod` file"; replacements "change the module graph, since a replacement module may have different dependencies than replaced versions," which affects what `go mod vendor` copies.
