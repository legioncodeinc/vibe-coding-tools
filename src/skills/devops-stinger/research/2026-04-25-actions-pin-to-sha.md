# GitHub Actions: pin to commit SHA, not tag

**Source:** https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions + tj-actions/changed-files supply-chain incident reports (March 2025)
**Retrieved:** 2026-04-25

## Why tags are mutable and SHAs aren't

Git tags are pointers to commits. A repo owner (or someone with write access) can:

```bash
git tag -d v4
git tag v4 <new-commit>
git push --force --tags
```

Anyone who pulls `actions/checkout@v4` afterwards gets the new commit, without changing their workflow file. If the new commit is malicious, every dependent workflow runs the malicious code.

Commit SHAs (`<40-char-hex>`) are immutable in the sense that the same SHA always references the same content. A repo owner cannot retag a SHA to point at different content.

## The tj-actions/changed-files incident (March 2025)

A widely-used third-party action was compromised. The attacker pushed malicious code to existing tags. Workflows that referenced the action by tag (`uses: tj-actions/changed-files@v44`) executed the malicious code on the next run. Workflows pinned to a specific SHA were unaffected.

This is the canonical "why pin to SHA" story.

## The pinning convention

```yaml
# bad
- uses: actions/checkout@v4

# better but still mutable
- uses: actions/checkout@v4.2.2

# good
- uses: actions/checkout@<40-char-SHA>  # v4.2.2
```

The version comment is for human readers and Dependabot. Dependabot's "pin-by-SHA" mode (introduced 2024) updates the SHA reference and updates the version comment automatically when a new release ships.

## Allowlisting third-party actions

Settings → Actions → General → "Allow specific actions and reusable workflows":

- ☑ Allow GitHub-owned actions
- ☑ Allow actions by Marketplace verified creators
- Allowed pattern list: `aws-actions/*, docker/*, depot/*, aquasecurity/*, hadolint/*, pnpm/*`

Combined with SHA pinning, this gives defense in depth.

## Forbidden patterns

| Pattern | Why |
|---|---|
| `@main`, `@master` | Floats with the branch HEAD; trivially compromised |
| `@v4` (no patch) | Mutable tag; range vulnerable |
| `@latest` | Same as `@main` |
| `@<branch-name>` | Mutable |

## Approved pattern

```yaml
- uses: actions/checkout@<40-char-SHA>  # v4.2.2
- uses: docker/setup-buildx-action@<40-char-SHA>  # v3.7.1
- uses: depot/build-push-action@<40-char-SHA>  # v1.x
```

## Tooling

- `scripts/pin-actions-to-sha.sh`: rewrites tags to SHAs in a workflow directory, leaving version comments.
- Dependabot config (`.github/dependabot.yml`):

```yaml
version: 2
updates:
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

Dependabot will PR updates to SHA pins.

## Relevance to this Stinger

- `guides/06-actions-security.md` §2.
- `scripts/audit-workflow.sh`: flags non-SHA-pinned actions as Must-fix.
- `scripts/pin-actions-to-sha.sh`: automated rewrite.
- All `templates/.github/workflows/*` use `<sha>` placeholders with version comments.
