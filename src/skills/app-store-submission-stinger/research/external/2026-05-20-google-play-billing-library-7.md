---
source_url: https://developer.android.com/google/play/billing/migrate-gpblv7
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: iap-play-billing
stinger: app-store-submission-stinger
---

# Migrate to Google Play Billing Library 7 | Android Developers

## Summary
Official migration guide from Google Play Billing Library 5/6 to version 7. PBL 7 was released May 14, 2024 (7.0.0) with the latest patch as 7.1.1 (October 3, 2024). Key improvements: installment subscription support, pending transactions for prepaid plans, and removal of deprecated `ProrationMode` APIs replaced by `ReplacementMode`. All new APIs in PBL 7 are optional; the migration primarily requires removing deprecated API calls.

## Key quotations / statistics
- "Google Play Billing Library 7 improves payment handling for existing subscription features. These optional improvements add support for paying with installment plans as well as support for pending purchases for prepaid subscriptions."
- "All new Google Play Billing Library 7 APIs are optional, and developers don't need to implement any API changes to update."
- **Breaking API removals:**
  - `setOldSkuPurchaseToken` → replaced by `setOldPurchaseToken`
  - `setReplaceProrationMode` → replaced by `setSubscriptionReplacementMode`
  - `setReplaceSkusProrationMode` → replaced by `setSubscriptionReplacementMode`
- **Two new optional APIs in PBL 7:**
  1. "Support Pending Purchases for Prepaid Plans": enable with `PendingPurchasesParams.Builder.enablePrepaidPlans()`
  2. "Virtual Installment Subscriptions": via `ProductDetails.InstallmentPlanDetails`
- **Pending transactions note:** "For apps using Google Play Billing Library version 7.0 and higher, you can enable pending transactions for subscription prepaid plan purchases."
- **compileSdk requirement:** PBL 7.0 requires `compileSdk 34` or higher; PBL 8.0 requires `compileSdk 35`.
- "The Play Billing Library no longer creates an order ID for pending purchases. For these purchases, the order ID is populated after the purchase is moved to the `PURCHASED` state."

## Annotations for stinger-forge
- This source informs the Android IAP section of `guides/04-iap-setup.md`. The ProrationMode → ReplacementMode rename is a breaking change for existing apps and should be highlighted as a migration blocker.
- The "all new PBL 7 APIs are optional" note means apps can upgrade to PBL 7 without implementing installment plans: useful for developers who just need to clear the deprecated API warnings.
- The pending transaction order ID change (order ID only available after PURCHASED state) is a subtle but important backend integration note.
- Cross-reference with the PBL release notes page for the suspended subscriptions API added in a later minor version.
- For completeness, stinger-forge may want to note that PBL 8.x (compileSdk 35) adds prepaid plan support and personalized pricing: future compatibility consideration.
