# Example 04 — Release evidence with signing and publication closed

Demonstrates [authority](../guides/00-authority-and-principles.md), [workspace inspection](../guides/01-inspect-workspace.md), [CLI/TUI boundary](../guides/07-build-cli-and-tui.md), [verification/release evidence](../guides/08-verify-and-package-evidence.md), and [closeout](../guides/09-close-the-loop.md).

## Input

```text
AC RELEASE-04: Produce local macOS ARM64 package evidence and an uninstall transcript.
Not authorized: signing, attestation, GitHub release, registry publication, installer execution outside a temp prefix.
Open: final multi-platform matrix and signing identity.
```

## Local-only evidence commands

```bash
cargo fmt --all -- --check
cargo clippy --workspace --all-targets --all-features -- -D warnings
cargo nextest run --profile release
cargo test --workspace --doc
cargo package --workspace
```

Then run the repository's pinned local package generator into a staging directory, calculate hashes, generate the approved SBOM/advisory/license reports, and install/uninstall only inside an isolated temporary prefix. `cargo package` verifies package contents/buildability but not provenance ([research](../research/supply-chain/2026-07-24-cargo-package-verification.md)); cargo-dist checksums are integrity evidence but are not signed proof ([research](../research/supply-chain/2026-07-24-cargo-dist-config.md)).

Do not invoke Cosign or a public release workflow: blob signing can create OIDC identity and transparency-log records ([research](../research/supply-chain/2026-07-24-sigstore-cosign-blob.md)). Re-run RustSec immediately at release time because advisory results are time-dependent ([research](../research/supply-chain/2026-07-24-rustsec.md)).

## Output

```markdown
## Outcome
Unsigned macOS ARM64 staging artifacts, hashes, SBOM, scans, and isolated install/uninstall transcript were generated locally.

## Verification
- `cargo nextest run --profile release` — PASS
- `cargo test --workspace --doc` — PASS
- local staging install/uninstall — PASS
- signing — BLOCKED (no identity/authorization)
- publication — BLOCKED (no authorization)

## Peer handoffs and remaining gates
- Dependency/license: review SBOM and scan dispositions.
- Release/Security: select signing identity and verify provenance policy.
- Quality: after Security and affected reruns.
- Platform: no support claim beyond the locally exercised target.
```
