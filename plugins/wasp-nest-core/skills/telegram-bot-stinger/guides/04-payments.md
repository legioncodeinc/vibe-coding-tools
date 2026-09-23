# Guide 04: Telegram Payments

> Sources: `research/payments/2026-05-20-telegram-stars-official-payments.md`, `research/payments/2026-05-20-stars-integration-tutorial.md`, `research/payments/2026-05-20-stars-dev-community-overview.md`

---

## CRITICAL: Stars are mandatory for digital goods in 2026

**Telegram Stars (currency code: `XTR`) must be used for all digital goods and services** sold through bots or Mini Apps. This is enforced by Apple/Google app store compliance requirements. Bots that attempt to charge fiat for digital goods will be blocked from mobile users.

**Rule:**
- Digital goods (software, subscriptions, virtual items, AI credits, etc.) → Stars only
- Physical goods (shipped merchandise, in-person services) → fiat via payment provider still allowed

---

## How Stars work

- **Stars are Telegram's in-app currency.** Users buy Stars from Telegram directly.
- **Currency code:** `XTR`
- **Bot receives Stars** when a user pays for an invoice.
- **Economics (as of research date):** ~$0.013/Star, ~65% net after Apple/Google commissions, 21-day hold on withdrawals, 1000 Stars minimum withdrawal.
- **`provider_token` must be empty string (`""`)** for Stars payments. Do not pass a Stripe/Yoomoney token for Stars.

> TODO: The 21-day hold and 1000 Stars minimum withdrawal were confirmed as of mid-2024. Verify current thresholds at https://core.telegram.org/bots/payments-stars before publishing.

---

## Stars payment flow (step by step)

```
1. Bot calls sendInvoice (or createInvoiceLink for Mini Apps)
2. User sees invoice message with "Pay X Stars" button
3. User taps pay → Telegram shows payment screen (native UI)
4. Your bot receives pre_checkout_query
5. Bot MUST call answerPreCheckoutQuery within 10 seconds
6. On confirmed payment, bot receives successful_payment
7. Fulfill the order
```

---

## sendInvoice parameters for Stars

```typescript
// grammY
await ctx.api.sendInvoice(
  ctx.chatId,
  "Premium Subscription",                    // title
  "30 days of premium access",               // description
  "premium_30d_v1",                           // payload (your order ID — returned in successful_payment)
  "XTR",                                      // currency — always XTR for Stars
  [{ label: "Premium (30 days)", amount: 500 }],  // prices (500 Stars)
  {
    provider_token: "",                       // EMPTY STRING for Stars — no provider token
    photo_url: "https://example.com/premium.jpg",
    need_email: false,
    need_phone_number: false,
    is_flexible: false,
  }
);
```

```python
# aiogram 3.x
from aiogram.types import LabeledPrice

await bot.send_invoice(
    chat_id=message.chat.id,
    title="Premium Subscription",
    description="30 days of premium access",
    payload="premium_30d_v1",
    currency="XTR",
    prices=[LabeledPrice(label="Premium (30 days)", amount=500)],
    provider_token="",          # Empty for Stars
)
```

---

## Handling pre_checkout_query (REQUIRED: 10 second window)

```typescript
// grammY
bot.on("pre_checkout_query", async (ctx) => {
  // Validate the order (check inventory, user eligibility, etc.)
  const isValid = await validateOrder(ctx.preCheckoutQuery.invoice_payload);
  
  if (isValid) {
    await ctx.answerPreCheckoutQuery(true);  // Approve
  } else {
    await ctx.answerPreCheckoutQuery(false, "Sorry, this item is no longer available");
  }
});
```

```python
# aiogram 3.x
@dp.pre_checkout_query()
async def handle_pre_checkout(query: PreCheckoutQuery):
    is_valid = await validate_order(query.invoice_payload)
    if is_valid:
        await query.answer(ok=True)
    else:
        await query.answer(ok=False, error_message="Item no longer available")
```

**Critical:** You MUST call `answerPreCheckoutQuery` within 10 seconds. If you don't, Telegram cancels the payment and shows an error to the user. If validation takes time, start it asynchronously and answer immediately if you can't verify in time.

---

## Handling successful_payment (fulfill the order here)

```typescript
// grammY
bot.on("message:successful_payment", async (ctx) => {
  const payment = ctx.message.successful_payment;
  const payload = payment.invoice_payload;  // Your order ID from sendInvoice
  const starsAmount = payment.total_amount; // In Stars
  const chargeId = payment.telegram_payment_charge_id;
  
  // Fulfill the order
  await fulfillOrder(payload, ctx.from!.id);
  await ctx.reply(`✅ Payment received! ${starsAmount} Stars. Enjoy your subscription!`);
});
```

```python
# aiogram 3.x
@dp.message(F.successful_payment)
async def handle_payment(message: Message):
    payment = message.successful_payment
    await fulfill_order(payment.invoice_payload, message.from_user.id)
    await message.answer(f"✅ Payment received! Enjoy your subscription!")
```

---

## Stars in Telegram Mini Apps

For Mini Apps, use `createInvoiceLink` instead of `sendInvoice`, then open it with the WebApp SDK:

```typescript
// Bot side: create a payment link
const link = await ctx.api.createInvoiceLink(
  "Premium Access",
  "Unlock all features",
  "premium_access_v1",
  "",      // empty provider_token
  "XTR",
  [{ label: "Premium", amount: 250 }]
);

// Return link to Mini App frontend
```

```javascript
// Mini App frontend (WebApp JS SDK)
Telegram.WebApp.openInvoice(invoiceLink, (status) => {
  if (status === "paid") {
    // Payment succeeded — call your backend to verify
    fetch("/api/verify-payment").then(...);
  }
});
```

---

## Physical goods payments (fiat)

For physical goods, use a payment provider (Stripe, Yoomoney, etc.):

```typescript
await ctx.api.sendInvoice(
  ctx.chatId,
  "T-Shirt",
  "Size L, Blue",
  "tshirt_l_blue",
  "USD",
  [{ label: "T-Shirt", amount: 2999 }],  // amount in cents
  {
    provider_token: process.env.STRIPE_PROVIDER_TOKEN!,  // From BotFather payment settings
    need_shipping_address: true,
    is_flexible: true,  // If price may change based on shipping
  }
);
```

---

## Refunds

Stars can be refunded programmatically:

```typescript
await ctx.api.refundStarPayment(
  userId,
  telegramPaymentChargeId  // from successful_payment.telegram_payment_charge_id
);
```
