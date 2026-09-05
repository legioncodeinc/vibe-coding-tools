# Organizing a Go module: layout, internal/, cmd/
- URL: https://go.dev/doc/modules/layout
- Fetched: 2026-09-04
- Source type: official docs

## go.mod location

`go.mod` always sits in the project root directory. Its module line must match the repository path: "Assuming this directory is uploaded to a GitHub repository at github.com/someuser/modname, the module line in the go.mod file should say `module github.com/someuser/modname`."

## Package naming

"The package name matches the last path component of the module name." For commands, all files declare `package main`; the entry point is convention only ("the main.go file contains func main, but this is just a convention").

## internal/ visibility rules

The one go-command-enforced rule on this page (formal rule lives at cmd/go docs: "An import of a path containing the element `internal` is disallowed if the importing code is outside the tree rooted at the parent of the `internal` directory"):

- "this prevents other modules from depending on packages we don't necessarily want to expose"
- "Since other projects cannot import code from our internal directory, we're free to refactor its API and generally move things around without breaking external users."
- "A top-level internal directory can contain shared packages used by all commands in the repository."
- "it's recommended to keep the Go packages implementing the server's logic in the internal directory."

Import form: `import "github.com/someuser/modname/internal/auth"`.

## cmd/ directory

"placing all commands in a repository into a cmd directory; while this isn't strictly necessary in a repository that consists only of commands, it's very useful in a mixed repository that has both commands and importable packages."

Install paths:
```
$ go install github.com/someuser/modname@latest                 # basic command
$ go install github.com/someuser/modname/cmd/prog1@latest       # with cmd/ convention
```

## Canonical layouts

Mixed repo (packages + commands):
```
project-root-directory/
  go.mod
  modname.go, modname_test.go
  auth/
  internal/
  cmd/
    prog1/main.go
    prog2/main.go
```

Server project:
```
project-root-directory/
  go.mod
  internal/
    auth/  metrics/  model/
  cmd/
    api-server/main.go
  ... non-Go directories
```

## Splitting modules

"In case the server repository grows packages that become useful for sharing with other projects, it's best to split these off to separate modules."
