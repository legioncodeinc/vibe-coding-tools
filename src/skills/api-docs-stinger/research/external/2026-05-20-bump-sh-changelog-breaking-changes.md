---
source_url: https://docs.bump.sh/help/api-change-management
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: changelog
stinger: api-docs-stinger
---

# API Change Management: Bump.sh Official Docs

## Summary

Official Bump.sh documentation for their automatic API changelog system. Covers automatic changelog generation on every spec upload, breaking change identification criteria, notification channels (Slack, email, RSS, webhook), GitHub PR diff comments via GitHub Action, and the `--fail-on-breaking` CLI flag for CI gates.

## Key quotations / statistics

- "Bump automatically builds a changelog for your API. Each time you upload a new version of your API definition, you will have a new event in your changelog."
- "Bump automatically identifies when a change is breaking for your API consumers."

### Breaking change criteria (Bump.sh definition)

- Rename or delete endpoint, unless it was deprecated before
- Rename or delete a property (body, header or query parameter), unless it was deprecated before
- Modify the type of a property
- Set an existing property as required
- Add or delete a security requirement
- GitHub integration

### Changelog UI features

- Color-coding: green = added, orange = modified, red = deleted
- Breaking changes appear in red at the top of each entry
- Consumers can subscribe to weekly email digest or RSS feed
- Side-by-side diff view between any two releases (including cross-branch)

### CLI / CI integration

- `bump diff path/to/file.yml --fail-on-breaking`: exits non-zero on breaking change
- In CI environments (`CI=1`), `--fail-on-breaking` is enabled by default
- GitHub Action supports `diff` (PR comment) and `deploy` (publish docs) steps
- `fail_on_breaking` option on GitHub Action: "Mark the action as failed when a breaking change is detected"

### Pricing (from concepts doc)

- Docs mention private repo support: pricing details at bump.sh; not enumerated in docs pages
- Public docs available on free tier

## Annotations for stinger-forge

- This is the **primary source** for `guides/05-changelog.md`: specifically the breaking change taxonomy.
- The `--fail-on-breaking` CLI flag is the key CI gate pattern. Document it as the recommended CI check.
- The Bump.sh breaking change criteria list should be reproduced verbatim in the changelog guide as the authoritative definition.
- Resolves open question from Command Brief: Bump.sh supports private repos; pricing details need verification at bump.sh/pricing.
- Contrast with manual `[BREAKING]` convention: Bump.sh automates detection; manual convention is for changelogs in repos without Bump.sh.
- The GitHub Action PR comment with diff summary is a high-value workflow to document as a "recommended setup" example.
