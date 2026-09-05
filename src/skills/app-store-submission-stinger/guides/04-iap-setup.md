# IAP Setup: StoreKit 2 and Google Play Billing Library

*Source: `research/external/2026-05-20-storekit-2-swiftui-guide-2026.md`, `research/external/2026-05-20-google-play-billing-library-7-migration.md`*

---

## iOS: StoreKit 2

StoreKit 1 was formally deprecated at WWDC 2024. **StoreKit 2 is now the only recommended API path for all new iOS IAP implementations.** Any project still on StoreKit 1 should plan migration before the next major iOS release.

### Product types

| Type | StoreKit 2 class | Use for |
|---|---|---|
| Consumable | `Product` (type: `.consumable`) | Credits, coins, tokens, one-time boosts |
| Non-consumable | `Product` (type: `.nonConsumable`) | Unlock forever, premium features |
| Auto-renewable subscription | `Product` (type: `.autoRenewable`) | Monthly/annual plans |
| Non-renewing subscription | `Product` (type: `.nonRenewing`) | Fixed-duration passes |

### Five production patterns (non-negotiable)

These patterns prevent the five most common StoreKit bugs documented in production. Every StoreKit 2 implementation must follow all five.

**1. Never hardcode prices**
```swift
// WRONG
Text("$9.99/month")

// CORRECT
if let product = products.first(where: { $0.id == "com.yourapp.premium.monthly" }) {
    Text(product.displayPrice)
}
```
Price localization is automatic in StoreKit 2. Hard-coded prices fail in non-US storefronts and are a policy violation if the price is incorrect.

**2. Always finish transactions after granting access**
```swift
// After verifying receipt and granting entitlement:
await transaction.finish()
// If you do not call finish(), StoreKit re-delivers the transaction on next launch
```

**3. Start the transaction listener at app entry, not at purchase time**
```swift
@main
struct YourApp: App {
    // Must be a task that lives for the app's lifetime
    var body: some Scene {
        WindowGroup {
            ContentView()
                .task {
                    for await verificationResult in Transaction.updates {
                        // Handle renewed, refunded, or revoked transactions
                        await handleTransactionUpdate(verificationResult)
                    }
                }
        }
    }
}
```
Starting the listener only when the paywall appears means you miss renewals, refunds, and revocations that arrive while the paywall is not visible.

**4. Handle the grace period for subscription lapses**
```swift
// Check subscription status
let statuses = try await Product.SubscriptionInfo.status(for: "com.yourapp.premium")
for status in statuses {
    switch status.state {
    case .subscribed:
        // Normal access
    case .inGracePeriod:
        // User's payment failed but Apple is retrying — grant access during grace period
        // Grace period is 6 days for monthly, 16 days for annual
    case .expired, .revoked:
        // Remove access
    }
}
```

**5. Always provide a Restore Purchases button**
This is **required** by App Review Guideline 3.1.1 for all apps with IAP. It must be accessible from a discoverable location (not buried in settings). Failure to include it is a top-10 rejection reason.

### Subscription group structure

Every auto-renewable subscription belongs to a subscription group. Best practices:
- One group per subscription offering (e.g., "Premium Access")
- Multiple tiers within the group (Monthly, Annual, Lifetime) at different price points
- Set the family sharing option on the Annual plan to maximize perceived value

### Introductory offers (2026)

Apple supports three introductory offer types:
- **Free trial:** X days/weeks/months free
- **Pay as you go:** First N periods at discounted price
- **Pay up front:** Discounted price for full X-period purchase

Configure in App Store Connect under the subscription product. Present offers using `Product.SubscriptionOffer.introductoryOffer`; do not hard-code offer periods.

### iOS 26: new in 2026

- `SubscriptionOfferView` component (iOS 26+): a pre-built SwiftUI paywall sheet with Apple's subscription UI design language
- `appTransactionID`: a stable, non-resettable app instance identifier (replaces some common uses of the device ID for fraud prevention in IAP)

---

## Android: Google Play Billing Library 7

Google Play Billing Library 7 (PBL 7) dropped legacy one-time purchase handling and introduced significant subscription API changes. PBL 7+ is required for all apps targeting API 35+.

> **TODO: open question**: PBL 8.x has been mentioned in community sources but is not fully documented in research. Verify the current stable version at `developer.android.com/google/play/billing/release-notes` before finalizing implementation. (See `research/research-summary.md` open question #3.)

### PBL 7 migration highlights

**Major breaking changes from PBL 5/6:**
- `SkuDetails` API is removed: replaced by `ProductDetails`
- `BillingFlowParams.Builder().setSkuDetails()` is removed: replaced by `setProductDetailsParamsList()`
- `BillingClient.queryPurchasesAsync()` must be called on purchase resume, not just purchase initiation

**Core billing flow (PBL 7+):**
```kotlin
// 1. Initialize BillingClient
val billingClient = BillingClient.newBuilder(context)
    .setListener(purchasesUpdatedListener)
    .enablePendingPurchases()
    .build()

// 2. Start connection
billingClient.startConnection(object : BillingClientStateListener {
    override fun onBillingSetupFinished(billingResult: BillingResult) {
        if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
            queryProductDetails()
        }
    }
    override fun onBillingServiceDisconnected() {
        // Retry connection with backoff
    }
})

// 3. Query products
val queryProductDetailsParams = QueryProductDetailsParams.newBuilder()
    .setProductList(
        listOf(
            QueryProductDetailsParams.Product.newBuilder()
                .setProductId("com.yourapp.premium_monthly")
                .setProductType(BillingClient.ProductType.SUBS)
                .build()
        )
    )
    .build()
```

### Subscription configuration (Play Console)

- **Base plans:** Define billing periods (monthly, annual)
- **Offers:** Attach introductory pricing or free trials to base plans
- **Eligibility criteria:** new subscribers only, upgrades from a specific base plan, etc.

### IAP product ID conventions

Use a consistent naming scheme or it becomes unmanageable:
```
Format: com.{package}.{feature}.{type}.{period}
Example: com.yourapp.premium.subscription.monthly
         com.yourapp.credits.consumable.100pack
         com.yourapp.adremoval.nonconsumable
```

---

## IAP submission checklist

Before submitting any app with IAP to review:

- [ ] All IAP products created in App Store Connect / Play Console
- [ ] All products have localized prices and descriptions
- [ ] Test purchase flow works end-to-end in sandbox / test environment
- [ ] Restore Purchases button present and functional (iOS, required)
- [ ] Subscription terms displayed clearly: price, period, renewal, cancellation instructions
- [ ] Privacy policy covers payment data handling
- [ ] No external payment references in the app UI (App Store) or app description (both)
- [ ] Family sharing configured (if applicable)
- [ ] Introductory offer period matches what is shown in the UI
