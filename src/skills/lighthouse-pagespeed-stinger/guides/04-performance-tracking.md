# Guide 04: Performance Tracking Over Time

> Research source: `research/external/2026-05-20-speedcurve-treo-comparison.md`, `research/external/2026-05-20-psi-crux-integration.md`

Three approaches for tracking Lighthouse and field performance over time: free (self-hosted LHCI server or CrUX Vis), mid-tier (Treo), and enterprise (SpeedCurve).

---

## Option A: Self-hosted LHCI server (free, commit-level lab tracking)

The LHCI server stores historical Lighthouse results with commit-level diffs. It ships as a Docker image or npm package.

**Best for:** teams that want commit-level regression tracking without paying for a SaaS tool.

```bash
# Run the LHCI server locally or on a private host
npx @lhci/cli server --storage.storageMethod=sql --storage.sqlDatabasePath=./db.sql
```

Configure upload to point at your server:
```json
"upload": {
  "target": "lhci",
  "serverBaseUrl": "https://your-lhci-server.example.com",
  "token": "$LHCI_BUILD_TOKEN"
}
```

**Limitations:** Lab data only (no RUM). Requires infra to run. Auth documentation is sparse beyond build tokens.

> TODO: open question: verify LHCI server's current auth capabilities at https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/server.md before relying on its private-instance docs.

---

## Option B: CrUX Vis (free, field data trends)

CrUX Vis is a Google-maintained tool for visualizing CrUX History API data over time. It replaced the CrUX Dashboard, which was deprecated November 2025.

**Best for:** teams that want free historical field data visualization without a paid tool.

URL: https://developer.chrome.com/docs/crux/tools/crux-vis

**Coverage:** weekly field data (LCP, INP, CLS, FCP, TTFB) up to 25 weeks of history. Origin and page-level. No lab data.

> Migration note for teams using the CrUX Dashboard: the Dashboard was deprecated November 2025. Migrate to CrUX Vis for simple trend visualization, or to CrUX on BigQuery for advanced analysis with country/ECT dimensions.

---

## Option C: Treo (paid, CWV-focused)

**Focus:** Core Web Vitals optimization, especially for improving Google search rankings. Powered by Lighthouse. Strips away everything except LCP, INP, CLS metrics.

**Pricing:** ~$8,000/year (per third-party comparison, March 2026; verify at https://treo.sh/docs before quoting).

**Best for:** content sites and ecommerce where organic search rankings drive revenue and the team wants CWV-specific guidance rather than a full Lighthouse score dashboard.

> TODO: open question: verify Treo's current offering and pricing at https://treo.sh/docs. A third-party article from 2026-03-20 cited ~$8k/yr but Treo's own docs were not scraped during research.

---

## Option D: SpeedCurve (paid, enterprise lab + RUM)

SpeedCurve was acquired by Embrace (mobile observability platform) in November 2025. It combines WebPageTest-based synthetic monitoring with Real User Monitoring (LUX).

**Best for:** enterprise teams that need both synthetic monitoring (consistent lab environment) and RUM across multiple geographic locations.

**Pricing (post-acquisition, as of May 2026):**

| Tier | Price/Month | Key Limits |
|------|-------------|------------|
| Starter | $90 | 25,000 synthetic checks/month |
| Growth | $576 | 13-month data retention, priority testing |
| Enterprise | $1,680 | SSO, private agents, consulting |

> Source: `research/external/2026-05-20-speedcurve-treo-comparison.md`

**Critical note:** SpeedCurve Synthetic always loads from a **completely empty cache** on consistent Amazon EC2 hardware. This is equivalent to Lighthouse's cold-cache behavior. SpeedCurve LUX (RUM) captures actual user sessions including repeat visitors with warm caches, similar to CrUX.

"The most important thing to track is consistency and changes within a single testing tool and settings." (SpeedCurve docs)

---

## Choosing between the options

| Criteria | Self-hosted LHCI server | CrUX Vis | Treo | SpeedCurve |
|----------|------------------------|----------|------|------------|
| Cost | Infra only | Free | ~$8k/yr | $90-$1,680/mo |
| Lab data | Yes (per commit) | No | Yes | Yes |
| Field / RUM data | No | Yes (CrUX) | No | Yes (LUX) |
| CWV focus | No (all audits) | Yes | Yes | Yes (+ more) |
| Historical trends | Yes | Yes (25 weeks) | Yes | Yes |
| Multi-location | No | n/a | No | Yes |
| Setup complexity | High (infra) | Low | Low | Medium |

**Start with:** self-hosted LHCI server for lab trends (free) + CrUX Vis for field trends (free). Upgrade to SpeedCurve when you need RUM, multi-location, or competitive benchmarking.
