---
source_url: https://unlighthouse.dev/learn-lighthouse/lighthouse-ci/budgets
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: critical
topic: lhci-budgets
stinger: lighthouse-pagespeed-stinger
---

# Performance Budgets with Lighthouse CI: Assertions & budget.json

## Summary

Comprehensive reference for configuring performance budgets in LHCI through the `assert` block
in `lighthouserc.js`/`lighthouserc.json`. Covers two assertion threshold types (`minScore` for
0-1 scores, `maxNumericValue` for ms/byte values), three severity levels (`off`, `warn`, `error`),
assertion presets (`lighthouse:recommended`), and `budget.json` as an alternative to inline
assertions. Also covers `aggregationMethod` (`median-run` vs `pessimistic`) for handling
variance across multiple runs. Includes the critical practice of running locally first to set
realistic baselines, then adding a 10-20% buffer to prevent immediate build failures.

## Key quotations / statistics

- "Don't guess budgets. Base them on current performance: [run LHCI], review failures to see current metric values."
- "Prevents immediate failures while preventing regressions. The goal is to prevent regressions, not to fail every build." (on setting budgets above current perf)
- "numberOfRuns: multiple runs reduce noise; three is a common starting point."
- "Lighthouse CI runs mobile audits by default. Mobile simulates a slower device with 4x CPU slowdown and slow 3G network conditions."

## Key code examples

```json
// lighthouserc.json - production-ready config
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "url": ["http://localhost:3000/", "http://localhost:3000/pricing"]
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9, "aggregationMethod": "median-run" }],
        "categories:accessibility": ["error", { "minScore": 0.95, "aggregationMethod": "pessimistic" }],
        "categories:best-practices": ["error", { "minScore": 0.9, "aggregationMethod": "pessimistic" }],
        "categories:seo": ["error", { "minScore": 0.9, "aggregationMethod": "pessimistic" }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["warn", { "maxNumericValue": 300 }],
        "total-byte-weight": ["warning", { "maxNumericValue": 1500000 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

```json
// budget.json (alternative to assertions for resource budgets)
[{
  "path": "/*",
  "resourceSizes": [
    { "resourceType": "script", "budget": 300 },
    { "resourceType": "total", "budget": 1500 }
  ],
  "resourceCounts": [
    { "resourceType": "third-party", "budget": 5 }
  ],
  "timings": [
    { "metric": "largest-contentful-paint", "budget": 2500 },
    { "metric": "cumulative-layout-shift", "budget": 100 }
  ]
}]
```

## Assertion severity levels

- `off` - Skip assertion entirely
- `warn` - Log warning, don't fail the build
- `error` - Fail the build with non-zero exit code

## Aggregation methods

- `median-run` - Uses the median across multiple runs (best for performance scores, which have natural variance)
- `pessimistic` - Uses the worst-case value across runs (best for binary audits like accessibility/SEO)

## Annotations for stinger-forge

- This is the primary source for `guides/01-lhci-configuration.md` assert block and `templates/lighthouserc-starter.yaml`.
- Critical directive from the command brief must be encoded: never set a budget below the current production
  baseline without a remediation plan. Document the "measure first, then set budget" workflow.
- The `aggregationMethod` distinction is a subtle but important gotcha: using `pessimistic` for performance
  scores will cause nearly every CI run to fail (since worst-case across 3 runs is almost always lower).
  Use `median-run` for categories, `pessimistic` for binary audits.
- Note: `desktop` preset is available via `settings.preset: 'desktop'` in the `collect` block. Include
  this in the template as a comment.
- Resource-summary assertions (`resource-summary:script:size`) can be mixed with audit assertions in
  the `assertions` block to enforce bundle-size budgets alongside metric thresholds.
