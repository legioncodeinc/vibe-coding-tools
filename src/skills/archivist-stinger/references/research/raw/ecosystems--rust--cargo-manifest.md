# The Manifest Format - The Cargo Book
- URL: https://doc.rust-lang.org/cargo/reference/manifest.html
- Fetched: 2026-09-05
- Source type: official-docs

## Overview

The Cargo.toml file for each package is called its manifest. It is written in the TOML format. It contains metadata that is needed to compile the package.

Every manifest file consists of the following sections (full list from the page's table of contents):

- cargo-features -- Unstable, nightly-only features.
- [package] -- Defines a package, with sub-fields: name, version, authors, edition, rust-version, description, documentation, readme, homepage, repository, license, license-file, keywords, categories, workspace, build, links, exclude, include, publish, metadata, default-run, autolib, autobins, autoexamples, autotests, autobenches, resolver.
- Target tables: [lib], [[bin]], [[example]], [[test]], [[bench]]
- Dependency tables: [dependencies], [dev-dependencies], [build-dependencies], [target]
- [badges] -- Badges to display on a registry.
- [features] -- Conditional compilation features.
- [lints] -- Configure linters for this package.
- [hints] -- Provide hints for compiling this package.
- [patch] -- Override dependencies.
- [replace] -- Override dependencies (deprecated).
- [profile] -- Compiler settings and optimizations.
- [workspace] -- The workspace definition.

## The [package] section

The first section in a Cargo.toml is [package].

```toml
[package]
name = "hello_world" # the name of the package
version = "0.1.0"    # the current version, obeying semver
```

The only field required by Cargo is name. If publishing to a registry, the registry may require additional fields.

### The name field

The package name is an identifier used to refer to the package. It is used when listed as a dependency in another package, and as the default name of inferred lib and bin targets.

The name must use only alphanumeric characters or - or _, and cannot be empty.

Note that cargo new and cargo init impose additional restrictions (valid Rust identifier, not a keyword). crates.io imposes even more restrictions: only ASCII characters allowed; do not use reserved names; do not use special Windows names such as "nul"; maximum 64 characters of length.

### The version field

Formatted according to the SemVer specification (major.minor.patch, optional pre-release after a dash, optional metadata after a plus). This field is optional and defaults to 0.0.0; required for publishing packages. (MSRV note: before 1.75, this field was required.)

### The authors field

**Warning: This field is deprecated.**

The optional authors field lists in an array the people or organizations that are considered the "authors" of the package. An optional email address may be included within angled brackets at the end of each author entry.

```toml
[package]
# ...
authors = ["Graydon Hoare", "Fnu Lnu <no-reply@rust-lang.org>"]
```

This field is surfaced in package metadata and in the CARGO_PKG_AUTHORS environment variable within build.rs for backwards compatibility.

### The edition field

Optional key affecting which Rust Edition the package is compiled with (e.g. `edition = '2024'`). cargo new currently defaults to the 2024 edition. If absent, the 2015 edition is assumed for backwards compatibility.

### The rust-version field

Tells cargo what version of the Rust toolchain the package supports.

### The description field

A short blurb about the package, displayed by crates.io. Should be plain text (not Markdown).

```toml
[package]
# ...
description = "A short description of my package"
```

Note: crates.io requires the description to be set.

### The documentation field

Specifies a URL to a website hosting the crate's documentation. If unspecified, crates.io will automatically link to the corresponding docs.rs page once documentation is built.

```toml
[package]
# ...
documentation = "https://docs.rs/bitflags"
```

### The readme field

Path to a file in the package root containing general information about the package; transferred to the registry on publish and rendered as Markdown by crates.io.

```toml
[package]
# ...
readme = "README.md"
```

If unspecified and a README.md, README.txt or README file exists in the package root, that file's name is used. Set to false to suppress; set to true for a default of README.md.

### The homepage field

A URL to a site that is the home page for the package.

```toml
[package]
# ...
homepage = "https://serde.rs"
```

A value should only be set for homepage if there is a dedicated website for the crate other than the source repository or API documentation. Do not make homepage redundant with either the documentation or repository values.

### The repository field

A URL to the source repository for the package.

```toml
[package]
# ...
repository = "https://github.com/rust-lang/cargo"
```

### The license and license-file fields

The license field contains the name of the software license the package is released under. The license-file field contains the path to a file containing the text of the license (relative to this Cargo.toml).

crates.io interprets the license field as an SPDX 2.3 license expression. The name must be a known license from the SPDX license list 3.20.

SPDX license expressions support AND and OR operators to combine multiple licenses.

```toml
[package]
# ...
license = "MIT OR Apache-2.0"
```

Using OR indicates the user may choose either license. Using AND indicates the user must comply with both licenses simultaneously. The WITH operator indicates a license with a special exception. Examples:

```
MIT OR Apache-2.0
LGPL-2.1-only AND MIT AND BSD-2-Clause
GPL-2.0-or-later WITH Bison-exception-2.2
```

If a package is using a nonstandard license, then the license-file field may be specified in lieu of the license field.

```toml
[package]
# ...
license-file = "LICENSE.txt"
```

Note: crates.io requires either license or license-file to be set.

Footnote on the page: "Previously multiple licenses could be separated with a /, but that usage is deprecated."

### The keywords field

Array of strings describing the package, for registry search.

```toml
[package]
# ...
keywords = ["gamedev", "graphics"]
```

Note: crates.io allows a maximum of 5 keywords; each must be ASCII, at most 20 characters, start with an alphanumeric character, and contain only letters, numbers, _, - or +.

### The categories field

```toml
categories = ["command-line-utilities", "development-tools::cargo-plugins"]
```

Note: crates.io has a maximum of 5 categories; each must match one of the strings at https://crates.io/category_slugs exactly.

### The workspace field

Configures which workspace the package is a member of, if not inferable from directory nesting.

```toml
[package]
# ...
workspace = "path/to/workspace/root"
```

Cannot be specified if the manifest already has a [workspace] table (a crate cannot be both a workspace root and a member of another workspace).

### The build field

Specifies a file in the package root that is a build script for building native code.

```toml
[package]
# ...
build = "build.rs"
```

Default is "build.rs". Use `build = "custom_build_name.rs"` for a different path, or `build = false` to disable automatic detection.

### The links field

Specifies the name of a native library being linked to, e.g.:

```toml
[package]
# ...
links = "git2"
```

### The exclude and include fields

Explicitly specify which files are included when packaging for publish (and used for some change tracking).

```toml
[package]
# ...
exclude = ["/ci", "images/", ".*"]

[package]
# ...
include = ["/src", "COPYRIGHT", "/examples", "!/examples/big_example"]
```

Default (neither specified): include all files from the package root except listed exclusions. If include is not specified: hidden dotfiles are skipped if not in a git repo; gitignore-ignored files are skipped if in a git repo. If include is specified, gitignore rules are not applied. Always excluded regardless: sub-packages (subdirectories containing their own Cargo.toml) and a top-level directory named target. Always included: the package's own Cargo.toml; a minimized Cargo.lock; and, if specified, the license-file. The options are mutually exclusive (include overrides exclude); use ! to carve out exceptions within include.

Patterns are gitignore-style (foo, /foo, foo/, *, ?, [], **/ prefix, /** suffix, /**/ infix, ! negation -- full glob semantics documented on the page).

### The publish field

Controls which registries the package may be published to.

```toml
[package]
# ...
publish = ["some-registry-name"]
```

To prevent publishing (e.g. crates.io) by mistake, omit the version field, or explicitly disable:

```toml
[package]
# ...
publish = false
```

If the publish array contains a single registry, `cargo publish` uses it by default when --registry is not specified.

### The metadata table

package.metadata is ignored by Cargo (no unused-key warnings) and can be used by external tools to store package configuration, e.g.:

```toml
[package]
name = "..."
# ...

# Metadata used when generating an Android APK, for example.
[package.metadata.android]
package-name = "my-awesome-android-app"
assets = "path/to/static"
```

A similar table exists at the workspace level, workspace.metadata; no format is specified by Cargo for either table's contents, though it's suggested tools may fall back to workspace.metadata when data is missing from package.metadata.

### The default-run field

Specifies a default binary picked by `cargo run` when multiple binaries exist, e.g. `default-run = "a"`.

## The [lints] section

Overrides default lint levels from different tools, e.g.:

```toml
[lints.rust]
unsafe_code = "forbid"
```

Shorthand for `{ level = "forbid", priority = 0 }`. Levels: forbid, deny, warn, allow. priority is a signed integer controlling override order among lint groups. The table under [lints] a lint belongs to is the part before `::` in its name (default tool is "rust" if no `::`), e.g. `lints.rust.unsafe_code` vs `lints.clippy.enum_glob_use`. Cargo only applies these to the current package, not dependencies; suppresses lints from non-path dependencies via --cap-lints. (MSRV: respected as of 1.74.)

## The [hints] section

Allows specifying hints for compiling the package; Cargo respects them by default (top-level package can override via [profile]). Hints are always safe for Cargo to ignore -- an unrecognized hint or value warns, not errors, so specifying hints does not impact a crate's MSRV. No stable hints exist at time of writing. (MSRV: respected as of 1.90.)

## The [badges] section

For specifying status badges displayable on a registry site. Note: crates.io previously displayed badges next to a crate but removed that functionality; badges should instead go in the README.

```toml
[badges]
# The `maintenance` table indicates status; `status` is required.
# Options: actively-developed, passively-maintained, as-is, experimental,
# looking-for-maintainer, deprecated, none.
maintenance = { status = "..." }
```

## Dependency sections

[dependencies], [dev-dependencies], [build-dependencies], and target-specific [target.*.dependencies] are covered on the separate "specifying dependencies" page (not this page).

## The [profile.*] sections

Provide a way to customize compiler settings such as optimizations and debug settings; covered on the separate Profiles chapter.

## Omitted sections

The [lib]/[[bin]]/[[example]]/[[test]]/[[bench]] target-table settings, the full dependency-specification syntax, [features], [patch], [replace], and [workspace] table mechanics are referenced by this page but documented on their own separate Cargo Book pages, and were not fetched here (only their one-line descriptions from this page's table of contents are captured above). The cargo-features unstable-feature section and the autolib/autobins/autoexamples/autotests/autobenches/resolver fields were omitted from detailed capture as they are build-configuration fields unrelated to identity, attribution, license, repository, homepage, or contact metadata.
