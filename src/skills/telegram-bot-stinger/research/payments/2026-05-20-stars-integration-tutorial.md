---
source_url: https://teletype.in/@alteregor/how-to-integrate-telegram-stars
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: payments-stars
stinger: telegram-bot-stinger
---

# How to Integrate Telegram Stars Payment to Your Bot - Practitioner Tutorial

## Summary

A hands-on Node.js tutorial (using grammY) by Egor Gorbachev showing the complete Stars payment flow with real code: `sendInvoice` for chat-based payments and `createInvoiceLink` + Mini App SDK for in-app payments. Also covers withdrawal economics (Stars to TON via Fragment after 21-day hold), the refund mechanics, and the test environment workflow. Published June 2024 but remains accurate for 2026 as the Stars payment API has not changed fundamentally.

## Key quotations / statistics

**grammY Stars invoice code:**
```typescript
bot.command("pay", (ctx) => {
  return ctx.replyWithInvoice(
    "Test Product",       // Product title
    "Test description",   // Product description
    "{}",                // Product payload
    "XTR",               // Stars currency
    [{ amount: 1, label: "Test Product" }]
  );
});
```

**Pre-checkout handler (MUST respond within 10 seconds):**
```typescript
bot.on("pre_checkout_query", async (ctx) => {
  await ctx.answerPreCheckoutQuery(true); // approve
});
```

**Successful payment handler:**
```typescript
bot.on("message:successful_payment", async (ctx) => {
  const payment = ctx.message.successful_payment;
  // Deliver product, store telegram_payment_charge_id
});
```

**Mini App payment flow (createInvoiceLink):**
```typescript
// Backend API endpoint
app.post("/generate-invoice", async (req, res) => {
  const invoiceLink = await bot.api.createInvoiceLink(
    "Test Product", "Test description", "{}",
    "",      // Provider token MUST be empty for Stars
    "XTR",
    [{ amount: 1, label: "Test Product" }],
  );
  res.json({ invoiceLink });
});
// Frontend: window.Telegram.WebApp.openInvoice(invoiceLink)
```

**Economics (verbatim):**
- "1 star is always worth $0.013, regardless of current TON exchange rates."
- "You can only withdraw after 3 weeks following the stars payment." (21-day hold period)
- Withdrawal requires minimum 1000 Stars.
- "After taking out Apple's 30% commission and Telegram's 4-5% commission, you get ~65% of the value."

**Buying Stars for testing:**
- "50 Telegram Stars" available via @PremiumBot for test environment.

## Annotations for stinger-forge

- `guides/04-payments.md` should include BOTH the `sendInvoice` and `createInvoiceLink` + `openInvoice` patterns with complete code examples.
- The 21-day hold period and 1000 Stars minimum withdrawal are important business context to mention.
- The $0.013/star economics (65% net after commissions) helps developers set pricing. Include as a pricing note.
- The `provider_token: ""` (empty string) for Stars is a common gotcha - highlight prominently.
- The `pre_checkout_query` 10-second timeout and `successful_payment` delivery pattern should be in a "Payments Safety" section.
