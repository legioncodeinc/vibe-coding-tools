# Guide 01: LHCI Configuration

> Research source: `research/external/2026-05-20-lhci-budget-assertions.md`, `research/external/2026-05-20-lhci-github-actions-guide.md`
> Template: `templates/lighthouserc-starter.yaml`
> Example: `examples/happy-path-lhci-setup.md`

LHCI (`@lhci/cli@0.15.x`) uses Lighthouse 12.6.1. The config file is `lighthouserc.json`, `lighthouserc.yaml`, or `lighthouserc.js` at repo root (or pointed to via `--config`). All config lives under a top-level `ci` key.

---

## Three-block structure

```json
{
  "ci": {
    "collect": { ... },   // how to run the audits
    "assert":  { ... },   // what pass/fail means
    "upload":  { ... }    // where to store results
  }
}
```

Running `lhci autorun` executes all three sequentially. You can also run them individually: `lhci collect`, `lhci assert`, `lhci upload`.

---

## `collect` block

```json
"collect": {
  "numberOfRuns": 3,
  "url": ["https://your-site.com/", "https://your-site.com/pricing"],
  "settings": {
    "preset": "desktop"   // omit for mobile (default)
  }
}
```

**`numberOfRuns: 3`**: always use at least 3. Lighthouse scores have natural variance; LHCI reports the median across runs. A single run is not a reliable gate.

> "numberOfRuns: multiple runs reduce noise; three is a common starting point." (`research/external/2026-05-20-lhci-budget-assertions.md`)

For local dev server (e.g., Next.js):
```json
"collect": {
  "startServerCommand": "npm run build && npm start",
  "url": ["http://localhost:3000/"],
  "numberOfRuns": 3
}
```

---

## `assert` block

Two assertion types:
- `minScore`: for 0-1 category scores (e.g., `"categories:performance": ["error", { "minScore": 0.9 }]`)
- `maxNumericValue`: for millisecond/byte values (e.g., `"largest-contentful-paint": ["error", { "maxNumericValue": 2500 }]`)

Three severity levels:
- `"off"`: skip the assertion
- `"warn"`: log warning, don't fail the build
- `"error"`: fail the build (non-zero exit code)

**`aggregationMethod` (critical gotcha):**
- `"median-run"`: use the median value across runs. Use for category scores and metric values with natural variance.
- `"pessimistic"`: use the worst-case value across runs. Use for binary audits (Accessibility, SEO) where you want maximum strictness.

> Danger: using `"pessimistic"` on Performance score will cause almost every CI run to fail because the worst of 3 runs is almost always lower than the median. Always use `"median-run"` for Performance. (`research/external/2026-05-20-lhci-budget-assertions.md`)

**Production-ready assert block:**
```json
"assert": {
  "preset": "lighthouse:recommended",
  "assertions": {
    "categories:performance":   ["error", { "minScore": 0.9,  "aggregationMethod": "median-run" }],
    "categories:accessibility": ["error", { "minScore": 0.95, "aggregationMethod": "pessimistic" }],
    "categories:best-practices": ["error", { "minScore": 0.9, "aggregationMethod": "pessimistic" }],
    "categories:seo":           ["error", { "minScore": 0.9,  "aggregationMethod": "pessimistic" }],
    "largest-contentful-paint": ["error", { "maxNumericValue": 2500, "aggregationMethod": "median-run" }],
    "cumulative-layout-shift":  ["error", { "maxNumericValue": 0.1,  "aggregationMethod": "median-run" }],
    "total-blocking-time":      ["warn",  { "maxNumericValue": 300,   "aggregationMethod": "median-run" }]
  }
}
```

---

## Measuring baselines before setting budgets

**Never set a budget below your current production baseline without a remediation plan.** The workflow:

1. Run LHCI without an `assert` block first (collect + upload only).
2. Review the numbers in the LHCI report or logs.
3. Set `minScore` / `maxNumericValue` at the current value plus a 10-20% buffer.
4. Then add the `assert` block to CI.

> "Don't guess budgets. Base them on current performance." (`research/external/2026-05-20-lhci-budget-assertions.md`)

A budget gate that fails on day one with no remediation plan blocks deploys without unblocking the team.

---

## `upload` block

Three options:

| Option | Use case | Retention |
|--------|----------|-----------|
| `"target": "temporary-public-storage"` | Quick sharing, no server needed | 7 days, public URL |
| `"target": "lhci"` + LHCI server URL | Private history, commit-level diffs | Indefinite |
| `"target": "filesystem"` | Store JSON reports in CI artifacts | Per CI run |

```json
"upload": {
  "target": "temporary-public-storage"
}
```

For a private LHCI server:
```json
"upload": {
  "target": "lhci",
  "serverBaseUrl": "https://your-lhci-server.example.com",
  "token": "$LHCI_BUILD_TOKEN"
}
```

---

## `budget.json` alternative

For resource-size budgets (independent of LHCI `assert` block):
```json
[{
  "path": "/*",
  "resourceSizes": [
    { "resourceType": "script", "budget": 300 },
    { "resourceType": "total",  "budget": 1500 }
  ],
  "timings": [
    { "metric": "largest-contentful-paint", "budget": 2500 }
  ]
}]
```

Reference in `collect`:
```json
"collect": {
  "settings": { "budgetPath": "./budget.json" }
}
```
