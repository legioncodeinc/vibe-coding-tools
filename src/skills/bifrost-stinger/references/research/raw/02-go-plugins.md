# Bifrost Go plugins (.so)
- URL: https://github.com/maximhq/bifrost (docs/plugins/writing-go-plugin.mdx at tag transports/v1.6.11)
- Fetched: 2026-09-04
- Source type: official repo docs

## Overview (from the doc)

"This guide walks you through creating a native Go plugin for Bifrost using our hello-world example as a reference. You'll learn how to structure your plugin, implement required functions, build the shared object, and integrate it with Bifrost."

Prerequisites per the doc:
- "Go 1.26.1 installed (must match Bifrost's Go version)" - i.e. the plugin toolchain must match the Bifrost build toolchain (matches the go plugin ABI rule: same toolchain version).
- "Linux or macOS (Go plugins are not supported on Windows)"
- go.mod "go version pinned to 1.26.1" (at this tag)

Project structure per the doc: `main.go` (plugin implementation), `go.mod`, `go.sum`, `Makefile`, `.gitignore`.

Related docs in the same tree: `docs/plugins/getting-started.mdx`, `docs/plugins/sequencing.mdx`, `docs/plugins/building-dynamic-binary.mdx`, `docs/plugins/writing-wasm-plugin.mdx`, `docs/plugins/migration-guide.mdx`. WASM plugins exist as an alternative to .so. Plugin interfaces live in `core/schemas/plugin.go` (LLMPlugin, MCPPlugin, HTTPTransportPlugin, ObservabilityPlugin per AGENTS.md).
