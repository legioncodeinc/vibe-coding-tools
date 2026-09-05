# Guide 06: Audit Category Glossary

> Research source: `research/external/2026-05-20-lighthouse-performance-scoring.md`, `research/external/2026-05-20-lab-vs-field-data-differences.md`

Quick reference for the four Lighthouse 12 audit categories and the most important individual audits within each.

---

## Performance category

**Score:** weighted average of five metrics (see below). 0-49 red, 50-89 orange, 90-100 green.

### Metric weights (Lighthouse 10 / 12, unchanged)

| Metric | Weight | What it measures |
|--------|--------|-----------------|
| Total Blocking Time (TBT) | 30% | Sum of blocking portions of Long Tasks during load (> 50ms) |
| Largest Contentful Paint (LCP) | 25% | Load time of the largest visible content element |
| Cumulative Layout Shift (CLS) | 25% | Sum of unexpected layout shifts during lifecycle |
| First Contentful Paint (FCP) | 10% | Time until first text/image painted |
| Speed Index (SI) | 10% | How quickly content is visually populated |

**NOT in the score:** INP (field-only), TTI (removed in LH10), FID (removed March 2024 from CWVs and never in LH score).

### TBT vs INP (the critical nuance)

TBT is the lab proxy for INP, but the correlation is imperfect. TBT only measures Long Tasks during load. INP measures the full interaction lifecycle (input delay + processing time + presentation delay) at any point in the session, including after load.

**Good TBT does NOT guarantee good INP.** Always check field INP separately via PSI or CrUX API. (`research/external/2026-05-20-lab-vs-field-data-differences.md`)

### Desktop vs mobile thresholds differ

Desktop Lighthouse (no throttling) and mobile Lighthouse (4x CPU, 1.6 Mbps) use different score normalization curves. A 90 on desktop is not comparable to a 90 on mobile. Always compare the same form-factor over time.

---

## Accessibility category

**Score:** proportion of applicable audits passed, weighted by estimated user impact.

Key audits:
- `color-contrast`: text contrast ratio meets WCAG AA (4.5:1 for normal text)
- `image-alt`: all `<img>` elements have alt text
- `button-name`: all buttons have accessible names
- `aria-*` audits: proper ARIA roles, labels, and attributes
- `document-title`: `<title>` element is present
- `html-has-lang`: `<html>` element has `lang` attribute

**Aggregation method for CI:** use `"pessimistic"`: accessibility failures are binary and you want the strictest gate. (`research/external/2026-05-20-lhci-budget-assertions.md`)

---

## Best Practices category

**Score:** binary pass/fail audits covering security, modern web APIs, and deprecated patterns.

Key audits:
- `uses-https`: all page resources served over HTTPS
- `no-vulnerable-libraries`: no JavaScript libraries with known CVEs
- `csp-xss`: Content Security Policy in place
- `geolocation-on-start`: geolocation not requested on page load without gesture
- `inspector-issues`: no Chrome DevTools Issues (deprecations, violations)
- `doctype`: document has a proper HTML5 doctype

---

## SEO category

**Score:** technical SEO signals: NOT content quality or keyword relevance. Route content/strategy findings to `seo-aeo-worker-bee`.

Key audits:
- `is-crawlable`: page is not blocked by robots meta or X-Robots-Tag
- `meta-description`: meta description is present
- `document-title`: `<title>` element is present
- `canonical`: `<link rel="canonical">` points to valid URL
- `font-size`: legible font sizes for mobile
- `tap-targets`: touch targets are properly sized and spaced
- `structured-data`: structured data is valid (informational only, no score weight)

**Aggregation method for CI:** use `"pessimistic"`: SEO technical audits are binary. (`research/external/2026-05-20-lhci-budget-assertions.md`)

---

## PWA category (removed in LH12)

The Progressive Web App category was removed from Lighthouse 12 (May 2024). If you see five-category reports in older documentation or tooling, they are from Lighthouse 8-11. Current reports have four categories.

> Source: `research/external/2026-05-20-lhci-github-actions-guide.md`
