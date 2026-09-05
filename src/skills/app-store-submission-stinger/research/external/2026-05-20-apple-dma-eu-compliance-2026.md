---
source_url: https://developers.apple.com/support/dma-and-apps-in-the-eu
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: eu-dma-compliance
stinger: app-store-submission-stinger
---

# Update on Apps Distributed in the European Union | Apple Developer

## Summary
Apple's canonical DMA compliance developer page, updated June 2025. Covers the Alternative Terms Addendum for EU developers, options for alternative payment processing (PSP within app, link-out to website, or standard IAP), commission structure changes (17%/10% vs 30%/15% standard), the transition from Core Technology Fee (CTF) to Commerce Transaction Charge (CTC) as of January 1, 2026, alternative app marketplace distribution, and the steering entitlement allowing EU apps to communicate external offers.

## Key quotations / statistics
- "By January 1, 2026, Apple plans to move to a single business model in the EU for all developers. Under this single business model, Apple will transition from the Core Technology Fee (CTF) to the CTC on digital goods or services."
- **CTC applies to:** "digital goods or services sold by apps distributed from the App Store, Web Distribution, and/or alternative marketplaces."
- **Payment options under Alternative Terms (EU only):**
  - Payment processing fee: iOS/iPadOS apps can use App Store's payment processing for an additional 3% fee
  - PSP within app: alternative payment processor, no additional fee to Apple
  - Link-out to website: no additional fee to Apple
- **Commission structure (EU Alternative Terms):**
  - Standard: 17% (vs 30% standard worldwide)
  - Small Business Program: 10% (vs 15% standard worldwide)
  - Plus 3% if App Store IAP used
- "Developers have a choice to remain on Apple's existing terms or adopt terms that reflect the additional capabilities for apps in the EU."
- "Developers must adopt the business terms for EU apps to use the capabilities for alternative distribution or payment processing."
- **Steering entitlement:** developers can "communicating and promoting offers in the app for digital goods or services, including steering to transactions other than App Store In-App Purchase."

## Annotations for stinger-forge
- This source partially answers the open question from the Command Brief: "Does Apple's March 2026 EU DMA compliance extension affect IAP requirements for apps distributed in the EU?" Answer: Yes. The CTF-to-CTC transition as of January 1, 2026, plus the ability to use alternative PSPs, means EU apps have materially different IAP configuration options. Stinger-forge should document EU vs non-EU IAP paths clearly.
- The "no mix & match" constraint (you can't offer Apple IAP AND an alternative PSP on the same storefront) is a critical decision gate that needs to be in `guides/04-iap-setup.md`.
- The steering entitlement (communicating external offers within the app, EU only) is a legitimate use case that developers may ask about: clarify the geographic scope limitation.
- Apps outside the EU are unaffected by these Alternative Terms and must still use Apple's IAP exclusively for digital goods.
