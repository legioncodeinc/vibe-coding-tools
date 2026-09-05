---
source_url: https://swiftcrafted.dev/article/storekit-2-swiftui-complete-guide-in-app-purchases-subscriptions
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: critical
topic: iap-storekit
stinger: app-store-submission-stinger
---

# StoreKit 2 SwiftUI Setup Guide (2026) | Swift Crafted

## Summary
Production-ready StoreKit 2 implementation guide updated for iOS 26, Xcode 26, and Swift 6.2. Covers the full subscription lifecycle using async/await, the currentEntitlements API, Transaction.updates listener, win-back offers (added WWDC 2024), the new SubscriptionOfferView (added iOS 26), appTransactionID for customer attribution, and critical production patterns (never hardcode prices, finish transactions only after granting access, start listener at app entry point). Also addresses the formal deprecation of StoreKit 1 at WWDC 2024.

## Key quotations / statistics
- "With the latest updates from WWDC 2025 and iOS 26, StoreKit 2 has gained even more power: the new `SubscriptionOfferView` for merchandising, expanded offer codes for all purchase types, win-back offers for re-engaging churned subscribers, and the `appTransactionID` field for precise customer attribution."
- "The `currentEntitlements` sequence always contains the latest list of active non-consumable purchases and subscriptions, even if they were purchased on another device. This basically eliminates the need for a separate 'Restore Purchases' flow for entitlement checks. That said, you should still offer a restore button — App Store Review expects it."
- "StoreKit 1 was formally deprecated at WWDC 2024. All new development should use StoreKit 2 exclusively — there's no reason to look back."
- **Critical production patterns:**
  1. "Never hardcode prices. Always use `product.displayPrice`. Prices vary by region and can change without an app update."
  2. "Finish transactions only after granting access. If your app crashes between finishing a transaction and unlocking content, the user loses their purchase with no recourse. This is the single most common StoreKit bug I see in production apps."
  3. "Start the transaction listener immediately. Initialize it in your app's entry point, before any views appear. Delayed listeners miss transactions that arrive during launch."
  4. "Handle the grace period state. When a subscription enters `.inGracePeriod`, the user should retain access while Apple retries billing."
  5. "Always provide restore purchases. Even though `currentEntitlements` handles most cases, App Store Review expects a visible restore button."
- **iOS version minimums:**
  - Core StoreKit 2 APIs: iOS 15+
  - SwiftUI views (ProductView, StoreView, SubscriptionStoreView): iOS 17+
  - SubscriptionOfferView: iOS 26+

## Annotations for stinger-forge
- This is the primary source for `guides/04-iap-setup.md`'s iOS StoreKit 2 section. The five production patterns are battle-tested and should be surfaced as a "critical mistakes to avoid" callout.
- The SubscriptionOfferView + iOS 26 note is important for minimum deployment target decisions: stinger-forge should note this as a capability gate.
- The "restore purchases button required by App Store Review even though currentEntitlements handles it" is a compliance nuance that will prevent rejections.
- Win-back offers section explains that they are delivered automatically by the App Store: stinger-forge should clarify that developers don't code trigger logic, only handle the resulting transaction.
- The appTransactionID field for customer attribution is new in iOS 18.4+ and useful for cross-device user mapping.
