# Semantic Versioning 2.0.0
- URL: https://semver.org/
- Fetched: 2026-08-14
- Source type: official-spec
- Component: versioning
- Author: Tom Preston-Werner

## Summary

Given a version `MAJOR.MINOR.PATCH`, increment: MAJOR on incompatible API changes, MINOR on backward-compatible functionality additions, PATCH on backward-compatible bug fixes. Pre-release and build-metadata labels extend this format.

## Core rules

- A normal version MUST take the form `X.Y.Z`, non-negative integers, no leading zeroes; each element increases numerically (`1.9.0 -> 1.10.0 -> 1.11.0`).
- Once a version is released its contents MUST NOT change; any modification is a new version.
- `0.y.z` is initial development — the public API SHOULD NOT be considered stable, anything MAY change at any time.
- **Patch** (`x.y.Z`, x>0): backward-compatible bug fix only.
- **Minor** (`x.Y.z`, x>0): backward-compatible new functionality; MUST increment if any public API functionality is marked deprecated; resets patch to 0.
- **Major** (`X.y.z`, X>0): any backward-incompatible change; resets minor and patch to 0.
- Pre-release: hyphen + dot-separated identifiers immediately after patch, ASCII alphanumerics and hyphens only, e.g. `1.0.0-alpha.1`. Lower precedence than the associated normal version.
- Build metadata: plus sign + dot-separated identifiers, e.g. `1.0.0+20130313144700`. Ignored for precedence purposes — two versions differing only in build metadata are equal precedence.

## Precedence algorithm

Compare major, minor, patch numerically first. Equal core versions: a pre-release version has lower precedence than the normal version (`1.0.0-alpha < 1.0.0`). Between two pre-releases with equal core, compare dot-separated identifiers left to right: numeric identifiers compare numerically, alphanumeric compare in ASCII sort order, numeric identifiers always have lower precedence than alphanumeric, and a larger set of fields has higher precedence than a smaller set when all preceding identifiers are equal. Worked example ordering: `1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-alpha.beta < 1.0.0-beta < 1.0.0-beta.2 < 1.0.0-beta.11 < 1.0.0-rc.1 < 1.0.0`.

## FAQ highlights relevant to a repo-init skill

- **When to release 1.0.0**: if the software is in production, or has a stable API users depend on, it should probably already be 1.0.0.
- **Deprecation procedure**: (1) update docs to note the deprecation, (2) ship a minor release with the deprecation in place, then remove no earlier than the *next* major release, so users get at least one minor release of warning.
- **Fixing an accidental breaking change released as minor**: immediately release a new minor version that restores compatibility; never modify a released version's contents. Document the offending version.
- Declare adherence explicitly (e.g. link to semver.org from the README/CHANGELOG) so consumers know the rules apply.

This spec is the versioning half of the Conventional-Commits-to-changelog pipeline: `fix` -> PATCH, `feat` -> MINOR, any `BREAKING CHANGE` -> MAJOR (see the Conventional Commits raw source for the commit-message side of that mapping).
