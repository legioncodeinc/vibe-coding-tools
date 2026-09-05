---
source_url: https://unlighthouse.dev/learn-lighthouse/lighthouse-ci/github-actions
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: critical
topic: lhci-ci-integration
stinger: lighthouse-pagespeed-stinger
---

# Lighthouse CI GitHub Actions: Setup Guide & Documentation

## Summary

Comprehensive step-by-step reference for integrating LHCI (`@lhci/cli@0.15.x`) into GitHub
Actions workflows. Covers basic setup through advanced configurations including status checks,
PR comments, and the `treosh/lighthouse-ci-action` wrapper (1.2k+ GitHub stars). Current version
of LHCI uses Lighthouse 12.6.1. Node 18+ is required. The PWA category was removed in Lighthouse
12. GitHub Actions Ubuntu runners include Chrome pre-installed at `/usr/bin/google-chrome`.
Includes critical gotcha: `fetch-depth: 20` is required to prevent "Could not find hash" errors
in LHCI's ancestor detection for base branch comparison.

## Key quotations / statistics

- "LHCI 0.15.x requires Node 18+. GitHub Actions Ubuntu runners include Chrome pre-installed at `/usr/bin/google-chrome`."
- "Critical: Always set `fetch-depth: 20` or higher. Shallow clones break LHCI's ancestor detection and cause 'Could not find hash' errors."
- "Current Version: LHCI 0.15.x uses Lighthouse 12.6.1. The PWA category was removed in Lighthouse 12 (May 2024). Lighthouse 13 is not yet supported as it requires Node 22.19+."
- Two authentication paths: GitHub App (`LHCI_GITHUB_APP_TOKEN`) for org-level or personal token (`LHCI_GITHUB_TOKEN`) with `repo:status` scope.

## Key code patterns

```yaml
# Minimal GitHub Actions workflow
name: Lighthouse CI
on: [push, pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 20   # CRITICAL: needed for ancestor detection
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci && npm run build
      - run: npm install -g @lhci/cli@0.15.x
      - run: lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

```yaml
# treosh/lighthouse-ci-action wrapper (simpler setup)
- uses: treosh/lighthouse-ci-action@v12
  with:
    urls: |
      https://example.com/
      https://example.com/about
    budgetPath: ./budget.json
    uploadArtifacts: true
    temporaryPublicStorage: true
```

## Annotations for stinger-forge

- Core source for `guides/03-ci-integration.md`: provides the exact YAML syntax, gotchas (fetch-depth), and both CI integration paths.
- The `treosh/lighthouse-ci-action@v12` action is the recommended path for most teams: simpler than raw LHCI but built on top of it.
- Note that `lhci autorun` runs three steps internally: `collect`, `assert`, `upload`. These can also be run individually for more control.
- The `configPath` option in the action points to a `lighthouserc.json` or `lighthouserc.js` file in the repo root.
- Document the difference between `temporaryPublicStorage` (7-day retention, public) vs private LHCI server vs GitHub Actions artifacts.
