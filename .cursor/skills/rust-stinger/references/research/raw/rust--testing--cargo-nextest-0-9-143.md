# cargo-nextest 0.9.143
- URL: https://github.com/nextest-rs/nextest/releases/tag/cargo-nextest-0.9.143
- Fetched: 2026-09-03
- Source type: official-docs

## Captured source material

- Immutable release: `cargo-nextest-0.9.143`, published 2026-08-04
- Tag commit: `6fef3157c9ff89c828dd89ae15c3e210c8ea9290`
- Added field: `junit.report-skipped`
- Added field: show a progress bar when test listing takes longer than two seconds
- Added field: host-versus-target status in binaries metadata
- Changed field: dynamic-library search order aligned with current Cargo
- Fixed fields: build-directory layout v2 search paths, configured `build.build-dir`, example test paths, filtered archives, and non-test binary counts

## Archived facts

- cargo-nextest 0.9.143 was released on 2026-08-04.
- It adds control over skipped-test reporting in JUnit XML and improves progress feedback during slow test listing.
- It records whether non-test binaries were built for the host or target platform.
- It fixes dynamic-library search and archive behavior related to Cargo's evolving build-directory layout.

## Stinger relevance

Projects using nextest archives, cross-target binaries, JUnit consumers, or nightly Cargo build-layout experiments should evaluate this release. Version selection still belongs to the project's dependency and CI policy.
