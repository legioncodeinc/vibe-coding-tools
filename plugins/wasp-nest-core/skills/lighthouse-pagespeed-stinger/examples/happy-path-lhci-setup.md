# Example: Happy Path LHCI Setup for a Next.js App

> Demonstrates guides: `guides/00-runner-selection.md`, `guides/01-lhci-configuration.md`, `guides/03-ci-integration.md`

**Scenario:** A Next.js 15 app on Vercel. The team wants to gate PRs on a Performance score of 85+ and LCP under 2.5s, with results stored as public temporary reports for 7 days.

---

## Step 1: Install LHCI locally

```bash
npm install --save-dev @lhci/cli
```

## Step 2: Run without assertions first (measure baseline)

```bash
# Build the app
npm run build

# Run the app locally
npm start &
SERVER_PID=$!

# Run LHCI collect + upload (no assert yet)
npx lhci collect --url http://localhost:3000/ --url http://localhost:3000/pricing --numberOfRuns 3
npx lhci upload --target=temporary-public-storage

kill $SERVER_PID
```

Review the report URL printed in the output. Note the current Performance score, LCP, CLS, TBT values.

## Step 3: Write lighthouserc.json with assertions based on baseline

Baseline from step 2: Performance 88, LCP 1800ms, CLS 0.04, TBT 120ms.

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm start",
      "startServerReadyPattern": "ready on",
      "url": [
        "http://localhost:3000/",
        "http://localhost:3000/pricing"
      ],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.85, "aggregationMethod": "median-run" }],
        "categories:accessibility": ["error", { "minScore": 0.95, "aggregationMethod": "pessimistic" }],
        "categories:best-practices": ["error", { "minScore": 0.9, "aggregationMethod": "pessimistic" }],
        "categories:seo": ["error", { "minScore": 0.9, "aggregationMethod": "pessimistic" }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500, "aggregationMethod": "median-run" }],
        "cumulative-layout-shift": ["warn", { "maxNumericValue": 0.1, "aggregationMethod": "median-run" }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

Note: Performance budget of 0.85 (85) is set slightly below baseline of 88 to allow buffer. LCP budget of 2500ms matches Core Web Vitals "Good" threshold.

## Step 4: Add the GitHub Actions workflow

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 20   # Required for LHCI ancestor detection
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
        env:
          NEXT_PUBLIC_URL: http://localhost:3000
      - run: npm install -g @lhci/cli@0.15.x
      - run: lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

## Step 5: Verify the CI run

After the first CI run:
- Check the Actions tab for LHCI output showing collected scores and assertion results.
- Confirm the PR status check appears (requires GitHub App auth).
- The temporary-public-storage upload prints a URL in CI logs; share it with the team.

## What success looks like

```
✅ categories:performance (0.88) >= 0.85 (median-run across 3 runs)
✅ categories:accessibility (0.97) >= 0.95
✅ largest-contentful-paint (2100ms) <= 2500ms
⚠  cumulative-layout-shift (0.12) is above 0.1 (warning only, build passes)
```
