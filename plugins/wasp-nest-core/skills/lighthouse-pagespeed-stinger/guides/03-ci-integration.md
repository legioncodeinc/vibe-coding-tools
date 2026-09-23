# Guide 03: CI Integration (GitHub Actions + LHCI)

> Research source: `research/external/2026-05-20-lhci-github-actions-guide.md`
> Template: `templates/lighthouserc-starter.yaml`
> Example: `examples/happy-path-lhci-setup.md`

---

## Requirements

- Node 18+ (LHCI 0.15.x requirement)
- `@lhci/cli@0.15.x` (uses Lighthouse 12.6.1)
- A URL to audit (deployed URL or local server running during CI)
- `lighthouserc.json` committed to repo root

---

## Minimal GitHub Actions workflow

```yaml
name: Lighthouse CI
on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 20   # CRITICAL: required for LHCI ancestor detection
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci && npm run build
      - run: npm install -g @lhci/cli@0.15.x
      - run: lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

**`fetch-depth: 20` is non-negotiable.** Without it, LHCI's ancestor detection (used for base branch comparison and PR comments) throws "Could not find hash" errors. The default shallow clone (`fetch-depth: 1`) breaks this.

> Source: `research/external/2026-05-20-lhci-github-actions-guide.md`: "Critical: Always set `fetch-depth: 20` or higher. Shallow clones break LHCI's ancestor detection."

---

## treosh/lighthouse-ci-action (recommended for most teams)

A simpler wrapper with 1.2k+ GitHub stars that handles the LHCI setup for you:

```yaml
- uses: treosh/lighthouse-ci-action@v12
  with:
    urls: |
      https://your-app.vercel.app/
      https://your-app.vercel.app/pricing
    budgetPath: ./budget.json
    uploadArtifacts: true
    temporaryPublicStorage: true
```

This action calls `lhci collect` + `lhci assert` + `lhci upload` internally. Use raw LHCI when you need finer control over individual steps.

---

## Authentication: GitHub status checks and PR comments

Two options:

**Option A: GitHub App token (recommended for org-level):**
- Install the LHCI GitHub App on your repo
- Add `LHCI_GITHUB_APP_TOKEN` as a repo secret
- Enables PR comments with score comparison against base branch

**Option B: Personal access token:**
- Create a PAT with `repo:status` scope
- Store as `LHCI_GITHUB_TOKEN`
- Adds commit status checks but no automatic PR comments

---

## For local dev servers (Next.js, Vite)

Start the server in the `collect` block:
```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run build && npm start",
      "startServerReadyPattern": "ready on",
      "url": ["http://localhost:3000/", "http://localhost:3000/about"],
      "numberOfRuns": 3
    }
  }
}
```

For Vercel preview deploys, set `url` to `$VERCEL_URL` and run LHCI after the deployment job completes.

---

## `lhci autorun` internals

`lhci autorun` runs these three steps in sequence:
1. `lhci collect`: runs Lighthouse N times against each URL
2. `lhci assert`: checks results against `lighthouserc` assertions; exits non-zero if any `"error"` assertion fails
3. `lhci upload`: sends results to `upload.target`

Run them individually when you need to upload regardless of assertion failures:
```bash
lhci collect
lhci upload   # run before assert to ensure results are always stored
lhci assert   # fail the build after upload
```

---

## Storing reports as GitHub Actions artifacts

When you don't have an LHCI server:
```json
"upload": {
  "target": "filesystem",
  "outputDir": ".lighthouseci"
}
```

Then in the Actions workflow:
```yaml
- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: lighthouse-results
    path: .lighthouseci
```

---

## Common gotchas

| Gotcha | Fix |
|--------|-----|
| "Could not find hash" ancestor detection error | Set `fetch-depth: 20` in checkout |
| Performance score varies wildly between runs | Use `numberOfRuns: 3` and `aggregationMethod: "median-run"` |
| CI fails immediately with new budget | Run without `assert` first, document baseline, then set budget with 10-20% buffer |
| PWA category missing | Expected: removed in LH12. Four categories remain. |
| `temporaryPublicStorage` results visible publicly | Use LHCI server or `filesystem` target for private results |
