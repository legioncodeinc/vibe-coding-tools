<!-- Copy-ready template for 01-recon/vendor-inventory.md. Hydrate every <placeholder> from the
same headless-browser-load session that produced the underlying vendor-census.json (see
shared/scripts/vendor-census.py); this report is the human-readable narrative of that data, not a
second source of truth. -->

# Vendor inventory

**Target:** <target_url>
**Run date:** <ISO 8601 date>
**Capture mode:** <js-executed-headless-load | static-only (if static-only, say explicitly this
run under-reports per the GTM-hydration note below and should be re-run before being treated as
complete)>
**Render-mode context:** <value read from _shared/target-profile.json's `rendering` field, since a
CSR/hybrid site's real vendor list only appears after JS execution>

## Google Tag Manager

**Detected:** <yes / no>

<If yes: state which of the 7 researched GTM signals matched (js global / html source / script src,
see references/vendor-lookup-table.md), and repeat the hydration warning: GTM's own signature does
not enumerate what it dispatches at runtime, every other vendor below was cross-referenced against
the same page load, not assumed away because GTM explains them.>

## Content-injection / metadata-manipulation tools (flagged category)

<If none detected, write "None detected this run" explicitly, do not omit the section.>

| Vendor | Evidence | Verification status | Note |
|---|---|---|---|
| <e.g. Search Atlas OTTO Pixel> | <matched signal + matched URL> | candidate, needs manual confirmation | Cross-referenced for prd-008 (technical-seo) and prd-009 (aeo-audit) to account for when interpreting this site's on-page metadata, per PRD-004 AC-2. |

## Full vendor census

| Vendor | Category | Confidence | Grounding | Evidence |
|---|---|---|---|---|
| <name> | <analytics / tag-manager / chat / payments / cro-testing / seo-injection / ads / consent-cmp / other> | <high / medium / low> | <researched / judgment-call> | <request URL, script src, or DOM node> |

## By function category

- **Analytics:** <list, or "none detected">
- **Tag manager:** <list>
- **Chat:** <list>
- **Payments:** <list>
- **CRO/testing:** <list>
- **SEO-injection:** <list, cross-reference to the flagged section above>
- **Ads:** <list>
- **Consent/CMP:** <list>
- **Other:** <list>

## Rejected candidates / verification log

Per the plugin-wide conduct rule that rejected findings are logged with the reason, not silently
dropped (`plan/website-auditor-build-plan.md` section 7, rule 4):

| Candidate | Why rejected |
|---|---|
| <e.g. a script src that matched a substring but on inspection was a first-party asset> | <reason> |

## What this Drone does not judge

This report inventories vendors. It does not rate any vendor as good or bad, that interpretation
belongs to `analytics-stack-wasp-drone` and `web-security-posture-wasp-drone` downstream, per
PRD-004's non-goal.
