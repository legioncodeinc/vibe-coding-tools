# lighthouse-pagespeed-worker-bee

## Domain
This Bee owns the full Lighthouse and PageSpeed Insights measurement surface: running audits locally versus in CI (LHCI on GitHub Actions), interpreting all four audit categories (Performance, Accessibility, Best Practices, SEO), setting score and performance budgets, authoring custom Lighthouse plugins, and reconciling the lab-vs-CrUX field-data gap, including the case where TBT looks fine but field INP does not.

## Paired Stinger
[lighthouse-pagespeed-stinger](../../lighthouse-pagespeed-stinger) - runner-selection, LHCI configuration, lab-vs-field reconciliation, CI-integration, performance-tracking, custom-plugin, and audit-category-glossary guides plus a starter lighthouserc.

## Trigger phrases
- "set up Lighthouse CI"
- "add a performance budget to CI"
- "our Lighthouse score is 90 but CrUX says we're failing LCP"
- "configure LHCI for GitHub Actions"
- "compare Treo vs SpeedCurve"
- "write a custom Lighthouse plugin"
- "audit this site with Lighthouse"

## Do NOT route when
- The ask is SEO content strategy or keyword research rather than Lighthouse's technical SEO signals; that belongs to seo-aeo-worker-bee.
- The ask is implementing the fix for a Core Web Vitals finding (the code change itself); that belongs to react-worker-bee or a future performance-optimizer, once this Bee has diagnosed the issue.
- The ask is CI/CD pipeline topology beyond the Lighthouse-specific step; that belongs to devops-worker-bee.
- The user references Lighthouse 13 or Node 22 requirements; flag that LHCI 0.15.x support is unconfirmed as of the last research pass rather than guessing.

## Inputs the Bee needs
- Whether the scenario is local debug, CI gate setup, budget enforcement, PSI/CrUX reconciliation, historical tracking, or plugin authoring.
- The current lighthouserc config and CI provider, if any.
- A baseline measurement before any budget is set (never gate CI below an unestablished baseline).

## Outputs
- A lighthouserc config and GitHub Actions workflow.
- A findings report distinguishing lab scores from CrUX field data, with metric-impact estimates.
- A custom Lighthouse plugin when built-in audits do not cover the requirement.

## Commonly sequenced with
- image-optimization-worker-bee: implements the image-side fixes this Bee's audit surfaces.
- react-worker-bee: implements INP and other Core Web Vitals fixes once diagnosis is complete.
- seo-aeo-worker-bee: picks up content-strategy findings out of scope for the SEO audit category here.
