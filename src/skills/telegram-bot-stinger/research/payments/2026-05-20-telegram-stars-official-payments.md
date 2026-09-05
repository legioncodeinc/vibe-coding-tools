---
source_url: https://core.telegram.org/bots/payments-stars
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: payments-stars
stinger: telegram-bot-stinger
---

# Telegram Bot Payments API for Digital Goods - Stars (Official)

## Summary

The official Telegram documentation for Stars-based digital goods payments (separate page from the physical goods payment docs). As of 2026, ALL digital goods and services sold via bots or Mini Apps MUST use Telegram Stars (currency code `XTR`). This is mandatory for AppStore/PlayStore compliance (Apple and Google require Telegram to use their in-app purchase systems for digital goods, and Stars satisfy this requirement). Physical goods can still use fiat currencies. Provider token must be empty string for Stars payments.

## Key quotations / statistics

- "Payments are seamlessly integrated into Telegram, allowing you to sell digital goods and services in exchange for Telegram Stars, an in-app virtual item that you can later convert to a reward."
- "All transactions must be carried out in Telegram Stars, with currency tag `XTR`."
- "Users can acquire Stars from Telegram using standard Apple and Google in-app purchases or via @PremiumBot."
- **On provider_token:** "Note that some API methods for Payments request a `provider_token`. This parameter is only needed for sales of physical goods and services - for digital ones, you can leave it empty."
- "Remember to specify `XTR` in the `currency` field, since all sales of digital goods and services are carried out exclusively in Telegram Stars."
- **App store compliance:** "To remain in compliance with Google's Payment Policies 1, 2 and 4, along with Apple's Review Guidelines 3.1.1, 3.1.1(a) and 3.1.3(b), your bot or mini app must use Telegram Stars for the sale of digital goods and services inside Telegram apps."

**Stars payment flow:**
1. Send invoice via `sendInvoice(currency: "XTR")` or create link via `createInvoiceLink`
2. Await `pre_checkout_query` update - bot has 10 seconds to respond
3. Call `answerPreCheckoutQuery` to approve or cancel
4. Await `successful_payment` update
5. Store `telegram_payment_charge_id` for potential refunds
6. Deliver the digital goods

**Critical FAQ answers from official docs:**
- "Can I use a different currency or payment provider?" -> **No.** Payments for digital goods/services must use Stars exclusively.
- "Can I accept payment in cryptocurrency instead of Stars?" -> **No.**
- Stars can be used to: place Telegram Ads, or convert to reward (via Fragment/TON).

**Refund mechanism:**
- Refund via `refundStarPayment` using the `telegram_payment_charge_id`.
- Fragment processes refunds; Stars return to user's balance.

## Annotations for stinger-forge

- `guides/04-payments.md` must be split clearly into two tracks:
  1. Digital goods/services -> **Stars only** (XTR, empty provider_token) - MANDATORY
  2. Physical goods/services -> fiat currencies with payment provider tokens (Stripe, etc.)
- The 10-second timeout for `answerPreCheckoutQuery` is a hard constraint - document as a CRITICAL DIRECTIVE.
- The `telegram_payment_charge_id` must be stored persistently for refund capability - this is a data modeling concern.
- "Stars can be used to place Telegram Ads" is a new use case not in the original Command Brief - worth noting in the payments guide.
- For Mini Apps: use `createInvoiceLink` + `window.Telegram.WebApp.openInvoice(url)` for the payment flow - distinct from the `sendInvoice` bot-chat flow.
