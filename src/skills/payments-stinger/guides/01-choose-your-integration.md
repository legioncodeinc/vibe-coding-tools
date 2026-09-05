# 01, Choose your integration

The default answer in this skill is **Elements custom checkout**: a Checkout Session created with `ui_mode: elements`, rendered on your own domain with the Payment Element (plus Address/Contact Details/Express Checkout Elements as needed), themed with the Appearance API. Not hosted Checkout. Not raw Payment Intents unless the checkout genuinely doesn't fit the Checkout Session model.

This reverses the old default in this skill's prior version, which pointed teams at hosted Checkout first. That was wrong for a SvelteKit product that wants its own brand chrome. It is still sometimes the right call, see §3 below.

## Why Elements custom checkout, not hosted Checkout, is the default here

Stripe's own comparison table [raw/stripe--checkout--ui-comparison.md]:

| | Hosted full page | Embedded form | Elements custom checkout |
|---|---|---|---|
| Customization | 15 Dashboard settings | ~70 Appearance API settings | Full CSS via Appearance API |
| Stays on your domain | Only in embedded variant | Yes | Yes |
| PCI scope | SAQ A | SAQ A | SAQ A |
| Complexity | Low | Some | Most |

The PCI line matters: building your own checkout markup around the Payment Element does not increase PCI burden versus hosted Checkout. Both land at SAQ A, because the card-number-collecting inputs are iframes Stripe serves from its own domain either way [raw/stripe--pci--compliance-scope.md]. There is no PCI tradeoff that justifies defaulting to the "super crappy hosted widget" when a team wants their own look and feel, the only real cost is more code, not more compliance surface.

Stripe's own guidance to coding agents, verbatim: "We recommend using the Checkout Sessions API with the Payment Element over Payment Intents for most integrations... Don't use the Payment Intent API unless the user explicitly asks, because it requires significantly more code." [raw/stripe--payment-element--overview.md]

## The decision rule

```
Does the checkout need to look and feel like the product, on the product's own domain?
├── YES (default assumption for this skill)
│   │
│   Does the checkout fit the Checkout Session transaction model
│   (line items, a subscription, tax, discounts, even one item, even $0 trial)?
│   ├── YES → Elements custom checkout: ui_mode: elements Checkout Session
│   │          + Payment Element + Appearance API.  ← DEFAULT
│   └── NO, it's a multi-step configurator pricing per-step, or a payment
│            embedded inside a flow that isn't "checkout" at all
│            → raw Payment Intents + Elements
│
└── NO, speed to ship matters more than brand chrome, or the team
         explicitly wants Stripe to own the page entirely
    │
    Do they need Checkout-exclusive built-in UI (full order summary with
    cross-sell/upsell, Split-tender, zero custom code at all)?
    ├── YES → hosted Checkout, full page
    └── NO, just want low effort but still embedded → embedded form (ui_mode: embedded_page)
```

## When hosted Checkout is still genuinely the right call

State this plainly to a team that reaches for hosted Checkout, it isn't wrong, it's a different tradeoff:

- **Pre-product-market-fit speed.** A team validating whether anyone will pay at all shouldn't spend engineering time on checkout theming. Hosted Checkout is one server call.
- **The team explicitly doesn't want to own checkout UI maintenance.** Every Appearance API rule, every Element placement decision, every layout edge case (mobile Safari viewport quirks inside an iframe, RTL locales, screen-reader flows through a 3DS challenge) becomes the team's problem with Elements. Hosted Checkout keeps 100% of that surface as Stripe's problem.
- **Built-in order summary matters and the team doesn't want to build one.** Elements custom checkout has no order summary at all, you build subtotals, tax display, discount lines yourself. Hosted (and to a lesser extent embedded) ships this out of the box.
- **Split-tender or other Checkout-exclusive hosted features are load-bearing for the product.**

Do not let a team default to hosted Checkout out of habit or because an older version of this skill said to. Ask explicitly: does this checkout need to look like the product? If yes, Elements custom checkout is correct even if it's more code, because the PCI/security argument for hosted Checkout does not hold, see §above.

## When raw Payment Intents is the right call (not Elements-with-Checkout-Sessions)

- A multi-step guided flow where the checkout *is* the product (a configurator that reprices per step, no single "line items" list exists until the very end).
- A payment embedded inside a flow that isn't "checkout" in Stripe's model at all, e.g. paying an ad-hoc invoice amount from an internal admin tool with no Checkout Session semantics needed.
- Multi-merchant carts (this typically means Stripe Connect, which is out of this skill's scope, see the sibling skill note in `SKILL.md`).

If the actual complaint is "we want it to look like our brand", that is Elements custom checkout, not raw Payment Intents. Don't reach for the harder API just because "custom" is in both names.

## Modes within Checkout Sessions (same regardless of ui_mode)

| Mode | Use for |
|---|---|
| `payment` | One-time charge, fulfillment via webhook |
| `subscription` | Recurring billing, see `guides/05-subscriptions-with-custom-ui.md` |
| `setup` | Capture a payment method with zero charge, see `guides/04-saving-payment-methods.md` |

## Next steps

- `guides/02-elements-setup-sveltekit.md`, mounting Elements in SvelteKit (Svelte 5 runes).
- `guides/03-payment-intents-lifecycle.md`, confirm, 3DS/SCA, status polling.
- `references/elements-mount-confirm.md`, copy-paste client code for both the default Elements-with-Checkout-Sessions path and the raw-Payment-Intents fallback.
