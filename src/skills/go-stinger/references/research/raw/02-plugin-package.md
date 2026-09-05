# Go plugin package: buildmode=plugin constraints
- URL: https://pkg.go.dev/plugin
- Fetched: 2026-09-04
- Source type: official docs (pkg.go.dev)

## Build mode

A plugin must be a `main` package built with the special build mode:

> "A plugin is a Go main package with exported functions and variables that has been built with: `go build -buildmode=plugin`"

Initialization behavior:

> "When a plugin is first opened, the init functions of all packages not already part of the program are called. The main function is not run. A plugin is only initialized once, and cannot be closed."

## Supported platforms

> "Plugins are currently supported only on Linux, FreeBSD, and macOS, making them unsuitable for applications intended to be portable."

(Windows and js/wasm have no plugin support; the API fails at runtime there.)

## ABI / toolchain compatibility

> "Runtime crashes are likely to occur unless all parts of the program (the application and all its plugins) are compiled using exactly the same version of the toolchain, the same build tags, and the same values of certain flags and environment variables."

Consequence:

> "in practice, the application and its plugins must all be built together by a single person or component of a system."

## Shared dependency version requirements

> "Similar crashing problems are likely to arise unless all common dependencies of the application and its plugins are built from exactly the same source code."

Race detector support is poor: "Even simple race conditions may not be automatically detected" (see https://go.dev/issue/24245).

## Open and Lookup

```go
func Open(path string) (*Plugin, error)
```

> "Open opens a Go plugin. If a path has already been opened, then the existing *Plugin is returned. It is safe for concurrent use by multiple goroutines."

`Lookup` searches for a symbol named symName in plugin p; a symbol is any exported variable or function. Example:

```go
p, err := plugin.Open("plugin_name.so")
if err != nil { panic(err) }
v, err := p.Lookup("V")
f, err := p.Lookup("F")
*v.(*int) = 7
f.(func())() // prints "Hello, number 7"
```

## Docs' bottom line

Because of these restrictions, "many users decide that traditional interprocess communication (IPC) mechanisms such as sockets, pipes, RPC, shared memory mappings, or file system operations may be more suitable despite the performance overheads."
