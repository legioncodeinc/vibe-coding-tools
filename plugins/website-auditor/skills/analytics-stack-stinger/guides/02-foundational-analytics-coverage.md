# 02. Foundational analytics coverage

Scores the 5%-weighted leaf under the Analytics and insight category (12% total). "Foundational" means GA4-class tooling: a general-purpose, site-wide analytics platform, not an industry-specific or de-anonymization tool (those are separate leaves, see `guides/03-industry-specific-analytics.md` and `guides/04-deanonymization-and-jurisdiction.md`).

## What counts as foundational

Any general-purpose web analytics platform: Google Analytics 4, Adobe Analytics, Matomo, Plausible, Fathom, or an equivalent. `references/templates/vendor-classification-table.md`'s Tier B table lists common signatures for the most widely deployed of these, general/public knowledge, not cited to this Stinger's research archive, treat a Tier B match as a strong candidate rather than an archive-verified fact and say so in the justification line.

## Detecting it

1. Check `01-recon/vendor-inventory.md` first. `vendor-inventory-wasp-drone` already ran a full census after a real headless-browser load; if it names a foundational analytics vendor, use that as the primary evidence pointer.
2. If Google Tag Manager is present (Tier A, grounded in [raw/sme-mapree-dev-stack-tech-google-tag-manager.md]), treat it as a strong cue that a foundational analytics tag is loaded through it even if the specific vendor isn't independently named. GTM is documented as "rarely traveling alone", it commonly hosts Google Analytics, ad conversion pixels, and other marketing tags fired without a codebase change. Note in the finding that the specific vendor was inferred via the GTM cue rather than directly fingerprinted, if that's the case.
3. Run `references/scripts/analytics-vendor-classify.py` against `site-data/` or `vendor-inventory.md` as a spot-check cross-reference, not as the sole source of truth.

## Scoring

Presence/absence is close to a boolean checkpoint (resolves to 6 or 1 per the plugin-wide rule), but "basic correctness" per this pair's PRD is not boolean, apply the full 0-6 scale to correctness once presence is confirmed:

- **1 (F, critical):** No foundational analytics tooling detected at all. The site has no way to measure its own traffic.
- **2 (D, high):** Present but materially broken, e.g. a tag that fires on some pages and not others, or a container/property ID that appears misconfigured (label this `[subjective]` unless you have a concrete evidence pointer, such as two different Measurement IDs firing on different pages).
- **3 (C, medium):** Present and meets baseline, one clear tag, firing consistently across the sampled page set, no obvious duplication.
- **4 (B minus, low):** Solid, plus at least one refinement a specialist would notice (e.g. clean single-tag implementation with no console errors from the tag itself, where that's observable from crawled data).
- **5 (B, cosmetic):** Strong, only cosmetic findings remain.
- **6 (A, none):** Complete, correctly and consistently implemented, no findings.

## What is out of scope for this leaf

- Consent-mode wiring and cookie-banner mechanics are not covered by this Stinger's current research archive. Do not assert a consent finding here; note it as an open item requiring internal verification if it's visibly relevant (per conduct rule 5), and defer to `web-security-posture-wasp-drone`.
- Do not fabricate a "correct GA4 configuration" checklist from general knowledge beyond what's stated above. If a correctness question arises that this guide doesn't cover, flag it as `[subjective]` or as an open item rather than asserting a rule that isn't grounded here.
