---
source_url: https://productfruits.com/blog/building-unbreakable-product-tours
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: critical
topic: maintenance
stinger: product-tour-onboarding-ui-stinger
---

# Building Unbreakable Product Tours: Product Fruits (March 2026)

## Summary
Definitive practitioner guide on tour maintenance and drift prevention, published March 2026 by Lukáš Erben at Product Fruits. Identifies dynamic CSS class generation (CSS-in-JS frameworks like React with Emotion, Angular with ViewEncapsulation) as the primary cause of tour breakage after deployments. Prescribes a four-strategy framework: (1) Dynamic URL wildcards for multi-tenant environments, (2) Text targeting as an immediate no-code fix, (3) Data attributes as the gold-standard permanent fix (with a noted side benefit: the same `data-*` attributes also improve automated test coverage for Cypress/Selenium), and (4) Analytics-driven maintenance: reviewing the tour funnel after every sprint deployment to catch cliff-shaped drop-offs indicating broken selectors. Includes a live debugger tool (`window.productFruits.services.attachDebugger()`) for real-time diagnosis.

## Key quotations / statistics
- "You spent two weeks crafting the perfect user onboarding tour... By Wednesday morning, your tour is broken." (Core framing of the maintenance problem.)
- Dynamic CSS classes like `.css-4mrg2x7c` rebuild with each app deployment; "From Product Fruits' perspective, the element has vanished."
- "Data attributes... represent something deeper than a technical fix: a formal agreement between your customer experience team and your engineering team."
- HTML example: `<button data-component="MainSaveButton">Save</button>`: the stable anchor pattern.
- "These same data-attributes are standard practice for testing frameworks like Cypress and Selenium. Adding them for Product Fruits also improves your automated test coverage. It's a two-for-one."
- "A broken tour that goes undetected is worse than no tour at all. It erodes user trust and creates blind spots in your adoption data."
- Maintenance cadence: "If your team ships on a two-week sprint cycle, do a quick analytics review after each release."
- Broken-tour notification system is "actively being developed" (coming soon): proactive alerts when a tour stops functioning.
- Teams report spending "10+ hours building single tours, only to watch them break after the next engineering release, then spending additional hours on quarterly maintenance (3 hours per quarter per flow)."

## Annotations for stinger-forge
- This is the primary source for `guides/06-maintenance-and-drift.md`. All four strategies map directly to guide sections: Dynamic URLs, Text targeting, Data attributes, Analytics cadence.
- The `data-component` naming in the article is a variant of the `data-tour` pattern. stinger-forge should recommend `data-tour` as the standardized attribute name (consistent with the Command Brief) and note that `data-testid` from Testing Library is also an acceptable alternative for teams that want test-and-tour dual-use.
- The "selector registry" concept referenced in the Command Brief is implied but not made explicit in this article: stinger-forge should introduce the explicit JSON registry file (`templates/data-tour-registry.json`) as an extension of this strategy.
- Connects to CI smoke tests: the Playwright `data-tour` existence check in `guides/06` should reference the same "two-for-one" dual-use principle this article introduces.
- No contradiction with other sources; this is the single most actionable source on the maintenance topic.
