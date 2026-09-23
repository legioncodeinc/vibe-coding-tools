# Guide: building and shipping Go .so plugins

Verb: "build the plugin", "the .so won't load", "plugin crashes the binary", "rebuild plugins against the new core".

Full constraint table: `references/plugin-abi-constraints.md` (grounded in [raw/02](../references/research/raw/02-plugin-package.md)).

## The one-pipeline rule

Binary and plugins crash at runtime unless compiled with the same toolchain version, same build tags, same flag/env values, and identical source for shared dependencies. The only reliable way to guarantee all four is one build pipeline: same base image, same module graph, one command each, same invocation.

Dockerfile shape (multi-stage, Linux always):

```dockerfile
FROM golang:1.26.8 AS build
WORKDIR /src
# pin the toolchain; never rely on GOTOOLCHAIN=auto for shipped artifacts [raw/01]
ENV GOTOOLCHAIN=local CGO_ENABLED=1
COPY core/    core/
COPY plugin/  plugin/
COPY cmd/     cmd/
# one module graph: plugin's go.mod requires core via a replace to the local path
RUN go build -buildmode=plugin -o /out/plugin.so ./plugin \
 && go build -o /out/app ./cmd/app

FROM gcr.io/distroless/base AS runtime
COPY --from=build /out/plugin.so /out/app /app/
```

## Plugin project anatomy

- `package main` even though `main()` never runs [raw/02].
- Exported constructor returning the shared interface:
  ```go
  //go:build plugin  // optional; keep tags identical between both sides if used
  package main
  var NewPlugin = func(cfg *schemas.Config) (schemas.Plugin, error) { ... }
  ```
- Shared interface types come from a module both sides pin identically - either the same require version or, inside one repo, a `replace` to the local path.

## Debugging a misbehaving plugin

1. `plugin.Open` error at load: usually missing .so, wrong arch, or glibc mismatch (built on macOS, loaded on Linux).
2. Loads fine, crashes later: ABI mismatch - toolchain, build tags, or shared dependency versions differ between binary and plugin. Rebuild both in one pipeline [raw/02].
3. `symbol type mismatch` on Lookup: the interface definition differs between the two compilations even if names match. Both sides must compile the identical source of the interface's module [raw/02].
4. Mysterious memory corruption under load: race detector is unreliable across the plugin boundary; do not trust `-race` runs as evidence of safety [raw/02].

## Windows hosts

Plugins cannot be built for Linux on a Windows host directly (Linux-only feature, and cgo toolchains differ). Always build .so artifacts in a Linux container; the Windows machine only orchestrates Docker [raw/02].
