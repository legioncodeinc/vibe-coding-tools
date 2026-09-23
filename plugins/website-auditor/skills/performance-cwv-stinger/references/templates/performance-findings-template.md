# Performance / CWV findings, copy-ready output template

Write the populated version of this file to `09-performance/performance-findings.md` in the shared audit workspace (per `plan/website-auditor-build-plan.md` section 3). Fill every bracketed field. Do not leave a score without its evidence pointer and justification, `audit-scoring-wasp-drone` rejects scores that arrive without both.

Scoring scale is the plugin-wide zero-to-six scale (0 = N/A/no-op, 1 = F/critical, 2 = D/high, 3 = C/medium, 4 = B minus/low, 5 = B/cosmetic, 6 = A/none). Boolean checkpoints resolve only to 6 or 1, nothing between. This leaf sits under "Technical deployment" (11% of the final grade): CDN 3%, caching strategy 4%, Core Web Vitals 4%.

---

## Performance / CWV findings

**Domain:** `[domain]`
**Run date:** `[YYYY-MM-DD]`
**Pages sampled:** `[list or count, drawn from site-data/]`
**Cross-link note:** CWV threshold research and general Lighthouse/PageSpeed methodology are owned by `lighthouse-pagespeed-stinger` (a different Drone/Stinger pair, scoped to a repository the customer owns, run in CI). This Stinger's own archive covers only what's specific to assessing an external site with no source access and no CI integration. See `guides/05-external-audit-vs-lighthouse-ci.md`.

### 1. CDN presence (leaf weight 3% of Technical deployment)

| Field | Value |
|---|---|
| CDN vendor identified | `[vendor name, or "cannot determine"]` |
| Identifying evidence | `[raw header name + value, per references/templates/cdn-header-checklist.md, e.g. "CF-Ray: <value>"]` |
| Score (0-6) | `[score]` |
| Evidence pointer | `[artifact path to the raw header capture]` |
| Justification (one line) | `[why this score]` |

### 2. Caching-header strategy (leaf weight 4% of Technical deployment)

| Page | `Cache-Control` (raw) | `CDN-Cache-Control` (raw) | `Age` | Notes |
|---|---|---|---|---|
| `[URL]` | `[raw value or "absent"]` | `[raw value or "absent"]` | `[value or "absent"]` | `[e.g. "static asset served with no cache headers"]` |

| Field | Value |
|---|---|
| Score (0-6) | `[score]` |
| Evidence pointer | `[artifact path to the raw header captures above]` |
| Justification (one line) | `[why this score; state explicitly if this judgment goes beyond presence/absence into adequacy, and label it [subjective] per the caching-strategy research gap noted in this Stinger's distilled research]` |

### 3. Core Web Vitals (leaf weight 4% of Technical deployment)

| Metric | Threshold | Measurement point | Lab value (this run) | Field value (CrUX, if available) | Pass/Fail | Evidence pointer |
|---|---|---|---|---|---|---|
| LCP | 2.5s | p75, mobile/desktop segmented | `[value]` | `[value or "no CrUX coverage"]` | `[pass/fail]` | `[artifact path]` |
| INP | 200ms | p75, mobile/desktop segmented | `[value]` | `[value or "no CrUX coverage"]` | `[pass/fail]` | `[artifact path]` |
| CLS | 0.1 | p75, mobile/desktop segmented | `[value]` | `[value or "no CrUX coverage"]` | `[pass/fail]` | `[artifact path]` |

| Field | Value |
|---|---|
| Score (0-6) | `[score]` |
| Evidence pointer | `[artifact path to lab-run output or CrUX/PSI capture]` |
| Justification (one line) | `[why this score]` |
| Field-data availability note | `[state explicitly whether CrUX/PSI returned field data for this domain; absence of field data is not itself a failing score, per guides/03-core-web-vitals-thresholds.md]` |

### 4. Rejected/reframed candidates (verification log, conduct rule 4)

| Candidate | Why it was rejected or reframed | Reasoning |
|---|---|---|
| `[candidate finding]` | `[rejected / reframed]` | `[one line]` |

### 5. Summary

- CDN presence: `[score]`/6
- Caching-header strategy: `[score]`/6
- Core Web Vitals: `[score]`/6
- Open items requiring internal verification (per conduct rule 5): `[list, or "none"]`
