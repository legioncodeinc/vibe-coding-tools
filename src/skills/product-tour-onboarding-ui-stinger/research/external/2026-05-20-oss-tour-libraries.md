---
source_url: https://userorbit.com/blog/best-open-source-product-tour-libraries
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: critical
topic: oss-libraries
stinger: product-tour-onboarding-ui-stinger
---

# Best Open-Source Product Tour Libraries in 2026

## Summary
Comparative review of the three dominant open-source product tour libraries (Driver.js, Shepherd.js, and Intro.js) as of 2026. Driver.js is smallest and fastest (zero dependencies), ideal for spotlight-style highlighting in React apps. Shepherd.js offers the most flexible API with built-in accessibility compliance; it is the most actively maintained (updated 17 days ago as of research date). Intro.js is the most established but uses AGPL v3 licensing that requires a paid commercial license for most SaaS products, and its maintenance cadence has slowed (last update 9 months ago). All three require teams to build targeting, analytics, localization, and experiment infrastructure on top: the "hidden cost" of open-source tours.

## Key quotations / statistics
- Driver.js: zero dependencies, MIT license, best for lightweight spotlight highlighting. Updated 4 months ago.
- Shepherd.js: MIT license, most actively maintained (updated 17 days ago), excellent for custom web apps with complex tour flows, built-in keyboard navigation and modal overlays.
- Intro.js: AGPL v3 (commercial license required for paid products), 12.5 KB file size, highly customizable but accumulates maintenance costs. Last updated 9 months ago.
- Maintenance status as of May 2026: Shepherd.js > Driver.js > Intro.js.
- "Open-source libraries often appear cheap but accumulate hidden costs as teams need targeting, analytics, localization, and experiments beyond basic tours."
- NPM downloads comparison (npm-compare.com): Driver.js, Intro.js, Shepherd.js all have significant download numbers; Intro.js highest historically but growth slowing.

## Annotations for stinger-forge
- Primary source for `guides/03-driver-js-shepherd-js.md`. The three-way comparison forms the decision tree for open-source library selection.
- Critical licensing callout: Intro.js's AGPL v3 is a legal red flag for commercial SaaS. The stinger MUST call this out explicitly with a "check your license" warning.
- Shepherd.js is the stinger's recommended open-source default for full-featured production tours; Driver.js is recommended for lightweight spotlight/highlight use cases.
- The "hidden costs" argument supports the qualification framework: when a team expects to need targeting, A/B tests, and localization, SaaS platforms become cheaper over time than a fully custom build on top of open-source libraries.
- No contradiction with other sources; this aligns with the Chameleon blog and Userpilot open-source review sources.
