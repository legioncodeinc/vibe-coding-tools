# Go release history: supported versions as of 2026-09
- URL: https://go.dev/doc/devel/release
- Fetched: 2026-09-04
- Source type: official docs

| Version | Release date | Latest minor revision |
|---------|-------------|----------------------|
| go1.27 | 2026-08-19 | go1.27.1 (2026-09-01) |
| go1.26 | 2026-02-10 | go1.26.8 (2026-09-01) |
| go1.25 | 2025-08-12 | go1.25.14 (2026-08-19) |
| go1.24 | 2025-02-11 | go1.24.13 (2026-02-04) |
| go1.23 | 2024-08-13 | go1.23.12 (2025-08-06) |

- go1.27.1 includes fixes to cgo, the compiler, the runtime, the `go fix` command, and `database/sql`, `debug/elf`, `encoding/json`, `net/http`, `os`, `simd`, `simd/archsimd`.
- Per the release policy, each major release is supported until two newer major releases appear - go1.25, go1.26, and go1.27 are the currently supported versions.
- Updating a Go source checkout to a specific release: `git fetch --tags; git checkout goX.Y.Z`.
