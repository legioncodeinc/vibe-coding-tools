# Semantic Versioning 2.0.0

- **URL:** https://semver.org/
- **Fetched:** 2026-08-17
- **Source type:** official-docs (the specification itself)
- **Why archived:** Keep a Changelog recommends stating SemVer adherence, and Conventional
  Commits defines its types in terms of SemVer increments. Both citations dangle without
  this file. The skill also needs the deprecation rule, because a deprecation observed in a
  session is a changelog entry with a version consequence.

## Current version

**2.0.0.**

## The format

`MAJOR.MINOR.PATCH`, incremented as:

| Part | Increment when |
|---|---|
| MAJOR | "when you make incompatible API changes" |
| MINOR | "when you add functionality in a backward compatible manner" |
| PATCH | "when you make backward compatible bug fixes" |

## Rules that matter here

- Version numbers take the form X.Y.Z where X, Y, and Z are non-negative integers and must
  not contain leading zeroes.
- Once a versioned package has been released, the contents of that version must not be
  modified. Any modification must be released as a new version.
- Pre-release versions are denoted by a hyphen and dot-separated identifiers, for example
  `1.0.0-alpha`.
- Build metadata is denoted by a plus sign, for example `1.0.0+20130313144700`, and is
  ignored when determining version precedence.

## Deprecation guidance, from the FAQ

Quoted: "When you deprecate part of your public API, you should do two things: (1) update
your documentation to let users know about the change, (2) issue a new minor release with
the deprecation in place. Before you completely remove the functionality in a new major
release there should be at least one minor release that contains the deprecation so that
users can smoothly transition to the new API."

This is why Keep a Changelog carries a `Deprecated` category and why dropping it, as
Common Changelog does, has a real cost.

## Note on retrieval fidelity

Fetched through a summarizing reader. The MAJOR/MINOR/PATCH definitions and the FAQ
deprecation passage are reported as verbatim. The numbered rule list was returned
compressed and is paraphrased above.
