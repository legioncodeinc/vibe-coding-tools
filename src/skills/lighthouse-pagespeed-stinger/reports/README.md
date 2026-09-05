# Reports

This folder collects past Lighthouse audit reports produced by `lighthouse-pagespeed-worker-bee`.

## Report location convention

| Trigger | Report path |
|---------|-------------|
| Quick inline audit | Inline chat reply (no file written) |
| Formal audit for a feature or release | `docs/performance/YYYY-MM-DD-<slug>-lighthouse-audit.md` |
| QA audit tied to a PRD | `library/requirements/<lifecycle>/<feature-folder>/reports/YYYY-MM-DD-lighthouse-audit.md` |
| Standalone performance audit | `library/requirements/reports/performance/YYYY-MM-DD-<site>-audit.md` |

## Report format

Each formal audit report should include:

```markdown
# Lighthouse Audit: <site/page>

**Date:** YYYY-MM-DD
**Tool:** Lighthouse 12.6.1 / LHCI 0.15.x
**Form-factor:** mobile | desktop
**Throttling:** default mobile (4x CPU, 1.6 Mbps) | custom: <describe>
**Runs:** N (median reported)

## Scores

| Category | Score | Status |
|----------|-------|--------|
| Performance | XX | Green / Orange / Red |
| Accessibility | XX | ... |
| Best Practices | XX | ... |
| SEO | XX | ... |

## Field data (from PSI API / CrUX)

| Metric | Field p75 | Status |
|--------|-----------|--------|
| LCP | XXXXms | Good / Needs Improvement / Poor |
| INP | XXXms | ... |
| CLS | X.XX | ... |

## Lab vs field gap

<Describe any divergence between Lighthouse lab scores and CrUX field data.
If INP field is Poor but TBT lab is Good, explain the TBT/INP gap.>

## Prioritized findings

1. **[CRITICAL]** ...
2. **[HIGH]** ...
3. **[MEDIUM]** ...

## Recommended next steps

- ...

## Consumers

This report was produced for: <PR author / feature team / devops-worker-bee / etc.>
```
