# Distilled Stripe research: custom checkout with Elements, SvelteKit stack

Dense, cited distillation of `raw/`. Every claim ends with a bracketed citation to its source file. Where sources conflict, both readings are stated with the preferred one marked.

## 1. The core decision: hosted Checkout vs embedded vs custom Elements

Stripe ships three payment UIs off one API (Checkout Sessions), plus a fourth lower-level option (raw Payment Intents). They are not four different products with different transaction records; the first three all create the same `Checkout Session` object and differ only in `ui_mode` and how much markup Stripe serves [raw/stripe--checkout--ui-comparison.md].

| Axis | Hosted / full page | Embedded form | Elements (`ui_mode: elements`, custom checkout) | Raw Payment Intents |
|---|---|---|---|---|
| API | Checkout Sessions | Checkout Sessions | Checkout Sessions | PaymentIntents |
| Where it renders | Stripe-hosted page (or redirect) | Iframe on your domain | Your own markup, Stripe-served input iframes only | Your own markup, Stripe-served input iframes only |
| Order summary | Full, built in | Limited, built in | None, you build it | None, you build it |
| Tax, discounts, shipping, subscriptions, Adaptive Pricing | Built in | Built in (minus split-tender) | Built in via the Checkout Session | You build all of it yourself |
| UI customization | 15 Dashboard settings | ~70 settings via Appearance API | Full CSS control via Appearance API | Full CSS control via Appearance API |
| PCI scope | SAQ A | SAQ A | SAQ A | SAQ A (same, as long as card fields stay inside Elements iframes) |
| Integration effort | Low, one server call | Low-medium | Medium, more coding | Highest, you own checkout state entirely |
| Stays on your domain the whole time | No (hosted) / yes (embedded variant) | Yes | Yes | Yes |
[raw/stripe--checkout--ui-comparison.md] [raw/stripe--pci--compliance-scope.md]

Stripe's own guidance to coding agents, verbatim: "We recommend using the Checkout Sessions API with the Payment Element over Payment Intents for most integrations... Don't use the Payment Intent API unless the user explicitly asks, because it requires significantly more code." [raw/stripe--payment-element--overview.md]

**Decision rule this skill encodes:** when a team wants a checkout that looks and feels like their own product and stays on their own domain, the default is the Elements custom-checkout path (`ui_mode: elements` Checkout Sessions, rendered with the Payment Element + Appearance API), not hosted Checkout, and not raw Payment Intents unless the team explicitly needs to own checkout state that Checkout Sessions can't represent. Hosted full-page Checkout is still the right call when: the team wants the lowest possible integration effort and doesn't care about matching brand chrome exactly (its Dashboard-level customization ceiling is real: 15 settings, no CSS); the product needs Checkout-exclusive features hosted mode covers better out of the box (Split-tender, full built-in order summary with cross-sell/upsell); or the team is pre-product-market-fit and speed-to-ship outweighs brand polish. Raw Payment Intents (no Checkout Session at all) is the right call only when the checkout doesn't fit the Checkout Session's transaction model at all, e.g. a multi-step configurator that prices per-step, or a payment embedded inside a non-checkout flow. [raw/stripe--checkout--ui-comparison.md] [raw/stripe--payment-methods--integration-options.md]

## 2. Elements: the building blocks of a custom checkout

| Element | Purpose | Placement rule | Source |
|---|---|---|---|
| Payment Element | Accepts 100+ payment methods in one dynamic form; validates input, handles errors | Last, after Contact Details and Address Elements | [raw/stripe--payment-element--overview.md] |
| Contact Details Element (formerly Link Authentication Element) | Single email field for both email collection and Link auth | First | [raw/stripe--contact-details-element--link-authentication.md] |
| Address Element | Shipping/billing address collection, auto-merges into the PaymentIntent | After Contact Details, before Payment Element | [raw/stripe--address-element--overview.md] |
| Express Checkout Element | One-click wallet buttons: Link, Apple Pay, Google Pay, PayPal, Klarna, Amazon Pay | Anywhere; suppresses Payment Element's own wallet buttons when both present | [raw/stripe--express-checkout-element--overview.md] |

All Elements sharing one `Elements`/`checkout` instance get cross-Element autofill (Link-saved address/payment data cascades once the customer authenticates via Contact Details) [raw/stripe--address-element--overview.md] [raw/stripe--contact-details-element--link-authentication.md].

## 3. Two client-side integration shapes, don't mix them

- **Custom Checkout Session (`ui_mode: elements`):** client secret initializes a `checkout` object via `stripe.initCheckoutElementsSdk()` (vanilla) or `CheckoutElementsProvider` (React, from `@stripe/react-stripe-js/checkout`). Elements are created off `checkout.createPaymentElement()` / `checkout.createExpressCheckoutElement()`. Confirmation is `checkout.confirm()` (or `actions.confirm()` from `checkout.loadActions()`), not `stripe.confirmPayment`. [raw/stripe--custom-checkout-session--quickstart.md] [raw/stripe--express-checkout-element--overview.md]
- **Raw Payment Intents + Elements:** client secret initializes `stripe.elements({ appearance, clientSecret })`; Elements created off `elements.create('payment', ...)`; confirmation is `stripe.confirmPayment({ elements, confirmParams: { return_url }, redirect })`. [raw/stripe--payment-intents--confirm-3ds-status.md]

These are two different client SDK surfaces with two different confirm calls. A codebase that mixes `checkout.confirm()` semantics with `elements.create()` created off a bare `stripe.elements()` call (not `checkout.createPaymentElement()`) is combining the two integration shapes incorrectly. [raw/stripe--custom-checkout-session--quickstart.md] [raw/stripe--payment-intents--confirm-3ds-status.md]

## 4. Payment Intents lifecycle (applies under either shape)

- `redirect: "if_required"` on confirm avoids an unconditional redirect for card payments; without it, even successful card confirmations bounce through `return_url`. When using `if_required`, you must handle the non-redirect success path (`{paymentIntent}` returned inline) and the redirect-based path (browser navigates away, comes back with `payment_intent_client_secret` in the query string) as two separate branches. [raw/stripe--payment-intents--confirm-3ds-status.md]
- On return, retrieve status with `stripe.retrievePaymentIntent(clientSecret)`; relevant statuses: `succeeded` / `requires_capture` (manual capture), `requires_action` (3DS/SCA pending). [raw/stripe--payment-intents--confirm-3ds-status.md]
- `stripe.handleNextAction` is the lower-level primitive for resuming a PaymentIntent stuck in `requires_action`, used in server-finalization flows; can take several seconds, disable the form and show a spinner. [raw/stripe--payment-intents--confirm-3ds-status.md]
- Off-session charges: `paymentIntents.create({ off_session: true, confirm: true, customer, payment_method })`; catch `authentication_required` and recover by retrieving the intent, some off-session charges still need the customer brought back online despite a saved, SCA-authenticated card. [raw/stripe--payment-intents--confirm-3ds-status.md] [raw/stripe--setup-intents--save-payment-methods.md]

## 5. Setup Intents and saved payment methods

- Setup Intents track the lifecycle of saving a payment method with zero charge; attaching to a `customer` auto-attaches the resulting PaymentMethod. [raw/stripe--setup-intents--save-payment-methods.md]
- `usage: off_session` (the default) front-loads any required authentication during the save step so later off-session charges usually don't need to interrupt the customer; `usage: on_session` defers authentication to the charge itself. This is an optimization, not a guarantee, off-session charges can still occasionally require the customer to come back online. [raw/stripe--setup-intents--save-payment-methods.md]
- Compliance requirement, not optional: on-session future use needs explicit consent (a checkbox); off-session future use needs an agreement/mandate covering permission, frequency, and amount-determination method. [raw/stripe--setup-intents--save-payment-methods.md]
- Stripe explicitly recommends SetupIntents (or `setup_future_usage` on a PaymentIntent) over saving a raw PaymentMethod directly, to avoid saving invalid/unoptimized methods. [raw/stripe--setup-intents--save-payment-methods.md]

## 6. Subscriptions with custom UI

- Trial Offers (the newer API) are supported only via direct Subscriptions API calls, explicitly NOT supported by hosted Checkout (must use legacy `trial_end`), Payment Links, or Elements-with-Checkout-Sessions. A custom-Elements subscription flow needing a paid/discounted trial must use the legacy `trial_end` parameter, not the new Trial Offer object. Cannot mix legacy `trial_end` and Trial Offer on the same subscription. [raw/stripe--subscriptions--build-with-elements.md]
- `billing_cycle_anchor` at trial end: `now` (default) resets the anchor and bills the full amount for the new period with zero proration; `unchanged` keeps the original anchor and prorates the gap. Get this wrong and a trial-to-paid transition either double-bills or silently undercharges relative to what the product team expects. [raw/stripe--subscriptions--build-with-elements.md]
- Both the Checkout-Sessions-Elements path and the raw-Payment-Intents-Elements path exist for subscriptions, same tradeoff logic as one-time payments (§1). [raw/stripe--subscriptions--build-with-elements.md]

## 7. Customer Portal vs custom subscription UI

- The Portal handles the standard 80%: card update, invoice history, plan switching (capped at 10 configurable products), and standard cancellation, no code, Dashboard-configured. [raw/stripe--customer-portal--vs-custom-billing-ui.md]
- Its ceiling is real: no custom UI/layout injection, no signup/acquisition flow, no metered-usage edits, add-ons, quotes, bespoke cancellation surveys, trial extensions, or mid-cycle pauses without a subscription schedule. Those need custom UI against the Subscriptions API directly. [raw/stripe--customer-portal--vs-custom-billing-ui.md]
- **Load-bearing webhook gotcha:** a Portal (or API) cancel-at-period-end fires `customer.subscription.updated` with `cancel_at_period_end: true`, NOT `customer.subscription.deleted`. The `deleted` event only fires later, when the subscription actually ends at period end (up to a full billing cycle later). A handler that treats `subscription.deleted` as the sole "cancellation" signal sends confirmation emails weeks late or never notices the request. [raw/stripe--customer-portal--vs-custom-billing-ui.md]
- Portal-initiated and API-initiated changes fire identical webhook events, a handler doesn't need to distinguish origin, only react to the event data (`cancel_at_period_end`, `status`, etc). [raw/stripe--customer-portal--vs-custom-billing-ui.md]

## 8. Webhooks: the contract, and which events matter

- Canonical verification: raw body string + `Stripe-Signature` header + endpoint's `whsec_*` secret into `stripe.webhooks.constructEvent()`. Any body-parsing middleware or `request.json()` call before this step permanently breaks it, this is confirmed as a cross-framework issue (Express's `express.json()` ordering, and independently for SvelteKit). [raw/stripe--webhooks--receive-and-verify.md] [raw/stripe--webhooks--signature-errors-raw-body.md] [raw/stripe--sveltekit--raw-body-webhook-community.md]
- Manual verification (fallback path): split `Stripe-Signature` on `,` into `t=` and `v1=` pairs (ignore anything else, including `v0`, to block downgrade attacks); build `signed_payload = "{t}.{raw_body}"`; HMAC-SHA256 with the endpoint secret; compare in constant time; separately enforce a timestamp tolerance to block replay. [raw/stripe--webhooks--receive-and-verify.md]
- Test-mode CLI secret (`stripe listen`) and each Dashboard-registered production endpoint's secret are different values, never cross-verify one against the other. [raw/stripe--webhooks--receive-and-verify.md] [raw/stripe--sveltekit--stripe-integration-tutorial.md]
- Dedup on `event.id`, not on signature (Stripe regenerates the signature on every retry of the same logical event). [raw/stripe--production-failures--webhook-race-conditions.md]
- Mark an event "processed" only after side effects succeed, not before. This lets Stripe's own retry mechanism double as your free retry for transient failures. Add a secondary object-level status guard (e.g., "already finalized, refuse to re-finalize") to catch the residual race window where two near-simultaneous retries both pass the dedup check before either commits. [raw/stripe--production-failures--webhook-race-conditions.md]
- Pick exactly one Stripe event as the source of truth per business action. Reacting to two events (e.g., both `checkout.session.completed` and `payment_intent.succeeded`) for "the same" outcome causes double-provisioning even with perfect per-event dedup, because dedup keys on `event.id` and these are different IDs. [raw/stripe--production-failures--webhook-race-conditions.md]
- Client-side "eager sync" on return-to-page racing the async webhook for the same object is a documented real race: both can read "not processed yet" before either commits. Fix: webhooks are the only writer of payment/subscription state; the client's return page only reads. [raw/stripe--production-failures--webhook-race-conditions.md]
- Async work scheduled after the 200 response (e.g., enqueuing a background job) isn't protected by the webhook dedup row unless the enqueue happens in the same DB transaction as marking the event processed (outbox pattern); a separate worker drains the outbox. [raw/stripe--production-failures--webhook-race-conditions.md]

## 9. Idempotency keys (outbound writes)

- `Idempotency-Key` header on `POST` requests; Stripe (API v1) caches the first response, success or error, and replays it verbatim for 24 hours on the same key. Generate a fresh key after fixing a `4xx`, don't reuse the failed one. [raw/stripe--idempotency--api-requests.md]
- `429`/`401` responses run before the idempotency layer, so retrying with the same key after those can genuinely produce a different result, not a safe blind replay. [raw/stripe--idempotency--api-requests.md]
- API v2 (`/v2` namespace) widens this: idempotent replay on `POST` and `DELETE`, 30-day window, and re-executes (rather than replaying a cached failure) on retry of a failed first attempt. Treat v1 and v2 semantics as genuinely different. [raw/stripe--idempotency--api-requests.md]

## 10. SvelteKit specifics

- Raw body: `const body = await request.text();` is the confirmed-working pattern across community threads; pass that string directly into `constructEvent`. Calling `request.json()` first, or re-`JSON.stringify`-ing a parsed body, breaks the signature. A `Request` body stream can only be consumed once, calling `.json()` then `.text()` throws `TypeError: Body is unusable`. [raw/stripe--sveltekit--raw-body-webhook-community.md]
- Env var split: only `PUBLIC_`-prefixed vars (via `$env/static/public`) are exposed client-side; everything else (`$env/static/private`) is server-only and SvelteKit blocks importing it into client bundles at the module-resolution level, a second, framework-enforced guard beyond naming convention. [raw/stripe--sveltekit--stripe-integration-tutorial.md]
- Convention: server-only Stripe client lives in `src/lib/server/stripe.ts` (anything under `src/lib/server/` is import-blocked from client code); webhook route at `src/routes/api/webhooks/stripe/+server.ts` exporting `POST`. [raw/stripe--sveltekit--stripe-integration-tutorial.md]
- Requires an SSR-capable adapter (Vercel, Netlify, Cloudflare, Node), `adapter-static` cannot host the server endpoints Checkout Session creation and webhook receipt need. [raw/stripe--sveltekit--stripe-integration-tutorial.md]

## 11. Appearance API / theming

- One shared Appearance object shape, passed differently depending on integration: into `CheckoutElementsProvider`/`initCheckoutElementsSdk` options for Custom Checkout Sessions, or into `stripe.elements({ appearance, clientSecret })` for raw Payment Intents. [raw/stripe--appearance-api--theming.md]
- Elements custom checkout is the only tier with "full CSS customization" per Stripe's own comparison table, hosted full-page maxes at 15 Dashboard settings, embedded form at ~70 Appearance API settings, Elements gets unrestricted Appearance API access. [raw/stripe--checkout--ui-comparison.md]
- Custom fonts (e.g. Google Fonts) load via a font set option passed alongside the appearance object at init time. [raw/stripe--custom-checkout-session--quickstart.md]

## 12. Tax, currency, and payment method availability by region

- Dynamic payment methods (Dashboard-configured, no code) is the default mechanism for showing the right methods per customer location/currency/amount across Checkout, Elements, Payment Links, and Hosted Invoice Page. [raw/stripe--dynamic-payment-methods--tax-currency.md]
- The final amount used for method eligibility is post-tax, post-discount, not the subtotal. [raw/stripe--dynamic-payment-methods--tax-currency.md]
- Stripe Tax with `ui_mode: elements`: `automatic_tax[enabled]=true` plus a `tax_code`/`tax_behavior` per line item. Address collection for tax has two tiers: minimal country+postal fields inside the Payment Element itself (`billing_address_collection=auto`) or a full Address Element (`billing_address_collection=required`), Stripe explicitly recommends the full Address Element where "regional considerations" (jurisdictions needing more than country+postal) apply. [raw/stripe--dynamic-payment-methods--tax-currency.md]

## 13. Testing and local development

- `stripe listen --forward-to <url>` needs no pre-registered Dashboard endpoint; prints a session-scoped `whsec_*` secret that stays stable across restarts of that same session but differs from any Dashboard-registered endpoint's secret. [raw/stripe--cli--listen-testing-test-clocks.md]
- `stripe trigger <event>` fires a realistic fixture event; can cascade related events (triggering `payment_intent.succeeded` also triggers `payment_intent.created`). `stripe events resend --webhook-endpoint=we_xxx` replays a real past event (within 30 days) at a specific endpoint. [raw/stripe--cli--listen-testing-test-clocks.md]
- Test Clocks let you freeze/advance simulated time in test mode to deterministically exercise trial-end, renewal, and dunning webhooks without waiting real days. [raw/stripe--cli--listen-testing-test-clocks.md]
- Baseline success card `4242 4242 4242 4242`; specific decline codes map to specific test PANs (generic, insufficient funds, lost, stolen, expired, incorrect CVC, processing error); CVC checks are skipped entirely if you omit a CVC in a test, so you must supply one to exercise CVC-decline paths; general EEA test cards succeed *without* triggering 3DS, use the dedicated regulatory/3DS cards to actually exercise SCA challenge flows. [raw/stripe--cli--listen-testing-test-clocks.md]

## 14. Security and PCI scope

- Checkout and Elements (including the Payment Element) are both SAQ A, the lightest PCI tier, because card-number-collecting inputs are iframes served from Stripe's domain, not your own DOM inputs, regardless of how much surrounding page chrome you control. Building a custom Elements checkout is not a PCI tradeoff versus hosted Checkout; both land at SAQ A. [raw/stripe--pci--compliance-scope.md]
- What increases PCI burden: writing your own raw `<input>` fields for card numbers instead of Elements iframes (out of scope for this skill; never do this), or Stripe.js v2's older "form you host, tokenize via JS" pattern (SAQ A-EP, heavier).
- Secret keys (`sk_*`, `whsec_*`) never leave the server; only the publishable key (`pk_*`) is safe client-side. [raw/stripe--api-keys implied by sveltekit env var split, raw/stripe--sveltekit--stripe-integration-tutorial.md]
- Always load Stripe.js from `js.stripe.com` at runtime, never bundle or self-host a copy, both a PCI requirement and how Stripe ships tokenization security patches. [raw/stripe--pci--compliance-scope.md]
- Required CSP directives for Elements to function: `frame-src`/`script-src` allow `https://js.stripe.com`; `connect-src` allow `https://api.stripe.com`; `img-src` allow `https://*.stripe.com`; add `https://maps.googleapis.com` to `connect-src`/`script-src` if the Address Element uses your own Google Maps key. [raw/stripe--pci--compliance-scope.md]

## 15. Production failure modes (catalog, cited)

| Failure | Root cause | Fix | Source |
|---|---|---|---|
| Double provisioning | Two different webhook events (`checkout.session.completed` + `payment_intent.succeeded`) both treated as "the" completion signal | Pick one event per business action; dedup keys on `event.id` won't save you across two different event IDs | [raw/stripe--production-failures--webhook-race-conditions.md] |
| Duplicate charge/credit on retry | Missing or crash-prone dedup ordering (marking processed before work finishes) | Mark processed only after side effects succeed; add an object-level status guard as a second layer | [raw/stripe--production-failures--webhook-race-conditions.md] |
| Client/webhook race | Client "eager sync" on return page writes the same state the webhook is about to write, both reading stale "not done yet" | Webhook is the only writer; client return page only reads | [raw/stripe--production-failures--webhook-race-conditions.md] |
| Missed async side effect after 200 | Background job enqueued outside the DB transaction that marks the event processed | Outbox pattern: enqueue in the same transaction, separate worker drains it | [raw/stripe--production-failures--webhook-race-conditions.md] |
| Silent broken guard | A "skip this event, another handler covers it" guard assumed one integration path (Checkout) when a second path (direct PaymentIntent, no Checkout Session) also reaches the same PaymentIntent | Guard logic must account for every origin that can reach a given PaymentIntent, not assume a single upstream flow | [raw/stripe--production-failures--webhook-race-conditions.md] |
| Signature verification 400s | Raw body consumed/parsed before `constructEvent`, or wrong `whsec_*` (CLI secret vs Dashboard secret mismatch) | `request.text()` first, pass string directly; verify secret source matches environment | [raw/stripe--webhooks--signature-errors-raw-body.md] [raw/stripe--sveltekit--raw-body-webhook-community.md] |
| Late/missing cancellation confirmation | Handler only listens for `customer.subscription.deleted`, which fires at period end (up to a full cycle later), not at cancel-request time | Listen for `customer.subscription.updated` with `cancel_at_period_end: true` for the confirmation moment; use `deleted` only for access revocation | [raw/stripe--customer-portal--vs-custom-billing-ui.md] |
| Queue-level dedup silently expires | Job-queue dedup (e.g. BullMQ `jobId`) only holds while the completed job record still exists in the queue's backing store | Set job retention to match/exceed Stripe's redelivery window (up to 3 days); treat your own DB-level idempotency check as the permanent safety net | [raw/stripe--production-failures--webhook-race-conditions.md] |

## 16. Where research is thin

- Adaptive Pricing, Split-tender, and Surcharging are named as Checkout-Sessions-exclusive or hosted/embedded-exclusive features in the comparison table, but this research did not fetch their individual feature docs in depth, treat any claim about their exact mechanics beyond "which UI tier supports them" as unverified.
- The Trial Offer API's exact interaction with `ui_mode: elements` beyond "not supported, use legacy `trial_end`" was not independently re-verified past the one source; if a team needs paid trial offers on a custom-Elements subscription flow, re-check current docs before committing to the `trial_end` fallback as permanent guidance.
- Payment method configuration objects, Payment Method Rules, and the A/B testing tool for payment methods were only surfaced by name, not researched in implementation depth, treat SKILL guidance on these as "they exist and are the right lever," not a how-to.
