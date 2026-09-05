# Go plugin (.so) ABI constraint table

Source: [raw/02](research/raw/02-plugin-package.md). These constraints are the reason the one-tag rule exists.

| Constraint | Documented rule | Practical consequence |
|---|---|---|
| Build mode | `main` package + `go build -buildmode=plugin` | Plugin repos still declare `package main`; `main()` is never run |
| Platforms | Linux, FreeBSD, macOS only | Build .so inside a Linux container even when developing on Windows/macOS |
| Toolchain | "exactly the same version of the toolchain" as the loading binary | Bake `GOTOOLCHAIN=goX.Y.Z` or one base image; never `auto` at build time for shipped artifacts |
| Build tags / flags / env | must match between binary and plugins | One Dockerfile stage builds both; record `CGO_ENABLED`, `-ldflags`, `-tags` |
| Shared deps | "built from exactly the same source code" | Plugin's `go.mod` versions of shared modules must resolve to the same commits as the binary's; cleanest is one module graph (workspace or replace) |
| Init | all init functions run once at first `plugin.Open`; cannot close | No teardown logic; long-running goroutines started in init live forever |
| Lookup | only exported symbols; type-assert to the exact interface both sides compiled | Shared interface definitions must come from a module both sides pin identically |
| Symptom of mismatch | runtime crashes, "unlikely to occur unless..." is doc-speak for "will occur" | plugin.Open may succeed and crash later; CI must load-test the .so in the real binary |

## Load-check snippet

```go
p, err := plugin.Open(soPath)
if err != nil { return fmt.Errorf("open %s: %w", soPath, err) }
sym, err := p.Lookup("NewPlugin") // exported constructor
if err != nil { return fmt.Errorf("lookup: %w", err) }
ctor, ok := sym.(func(...) schemas.Plugin) // interface from shared module
if !ok { return errors.New("symbol type mismatch") }
```
