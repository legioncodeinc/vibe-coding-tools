# Guide 00: Runner Selection

> Research source: `research/external/2026-05-20-lhci-github-actions-guide.md`, `research/external/2026-05-20-psi-crux-integration.md`
> Example: `examples/happy-path-lhci-setup.md`

Before choosing any Lighthouse tool, answer three questions:

1. **Do you need automation or a one-off check?** (CLI/DevTools vs LHCI)
2. **Do you need field data (real users) or lab data (reproducible)?** (PSI API vs LHCI)
3. **Do you need historical trending?** (LHCI server / SpeedCurve / Treo)

---

## Decision tree

```
Need a quick local check on a URL?
  └─ Use: Chrome DevTools Lighthouse tab, or `npx lighthouse <url> --view`

Need to automate and run on a local server during dev?
  └─ Use: `lighthouse` Node module API or `@lhci/cli` in local mode

Need to gate a PR or enforce a score budget in CI?
  └─ Use: LHCI (`@lhci/cli`) via GitHub Actions — see guides/03-ci-integration.md

Need both lab + field data in a single API call?
  └─ Use: PageSpeed Insights API (includes Lighthouse + CrUX in one response)

Need field-only data quickly (no lab data needed)?
  └─ Use: CrUX API (faster, lower rate limits)

Need historical field data / trends over weeks?
  └─ Use: CrUX History API (weekly, up to 25 weeks) or Google Search Console (3 months)

Need historical lab data with commit-level regression tracking?
  └─ Use: Self-hosted LHCI server (free) or SpeedCurve/Treo (paid)
```

---

## Tool comparison

| Tool | Data type | Use case | Cost |
|------|-----------|----------|------|
| `lighthouse` CLI / Node | Lab | Local debugging, one-off | Free |
| Chrome DevTools Lighthouse | Lab | Local visual inspection | Free |
| LHCI (`@lhci/cli`) | Lab | CI gating, PR checks | Free |
| PageSpeed Insights API | Lab + Field | On-demand lab+field in one call | Free (rate limited) |
| CrUX API | Field | Fast field-only queries | Free |
| CrUX History API | Field | Weekly field trends | Free |
| Google Search Console | Field | CWV by URL group, ranking signals | Free |
| CrUX on BigQuery | Field | Advanced analysis, country/ECT dims | GCP costs |
| Self-hosted LHCI server | Lab | Historical lab trends, free | Infra cost |
| SpeedCurve | Lab + RUM | Enterprise tracking, competitive | $90-$1,680/mo |
| Treo | Lab (CWV) | CWV-focused tracking | ~$8k/yr |

---

## Throttling settings: always document yours

Lighthouse mobile simulation defaults (LHCI default):
- CPU: 4x slowdown (vs typical desktop)
- Network: 1.6 Mbps download, 750 Kbps upload, 150ms RTT
- This simulates the **slowest 5-10% of user experiences**, not the median

> Source: `research/external/2026-05-20-lhci-budget-assertions.md`: "Lighthouse CI runs mobile audits by default. Mobile simulates a slower device with 4x CPU slowdown and slow 3G network conditions."

Desktop override in LHCI collect block:
```json
"settings": { "preset": "desktop" }
```

**Rule:** Always commit your form-factor and throttling settings to the repo config. Never compare scores run with different settings; the numbers are not comparable.

---

## What the PWA category removal means (LH12)

The fifth Lighthouse category (Progressive Web App, PWA) was removed in Lighthouse 12 (May 2024). If you see five-category reports in older documentation, those are from Lighthouse 8-11. Current reports have four categories: Performance, Accessibility, Best Practices, SEO.

> Source: `research/external/2026-05-20-lhci-github-actions-guide.md`: "The PWA category was removed in Lighthouse 12 (May 2024)."
