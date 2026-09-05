# Tauri Bundler 2.9.3 Release
- URL: https://github.com/tauri-apps/tauri/releases/tag/tauri-bundler-v2.9.3
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Released: 2026-06-17
- Source type: official-docs
- Material: official package-specific GitHub release

## Captured source material

- Tag: `tauri-bundler-v2.9.3`
- Package: `tauri-bundler`
- Version: `2.9.3`
- Published: `2026-06-17`
- Fix commit: `2857c01c6`

> Fix NSIS stock plugins (`NSISdl.dll`, `StartMenu.dll`, `System.dll`, `nsDialogs.dll`) being embedded in the final installer as unsigned despite the signing step succeeding.

## Archived evidence

The release fixed NSIS stock plugin DLLs being embedded unsigned even though the signing step succeeded. The signed copies existed under the build output, but `makensis` did not search that directory and selected unsigned toolset copies instead. The fix added the signed plugin directory before plugin commands were parsed.

The release also improved error messages for missing NSIS icon and image configuration paths.

## Archive interpretation

Require bundler 2.9.3 or later for signed NSIS pipelines. Verify the signatures on the final installer contents because a successful signing command alone was not sufficient before this release.
