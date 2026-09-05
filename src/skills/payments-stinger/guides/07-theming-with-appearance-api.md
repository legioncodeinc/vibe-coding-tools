# 07, Theming with the Appearance API

Source: [raw/stripe--appearance-api--theming.md], [raw/stripe--checkout--ui-comparison.md], [raw/stripe--custom-checkout-session--quickstart.md], [raw/stripe--express-checkout-element--overview.md].

## Why this matters for the default integration

Elements custom checkout is the only tier in Stripe's own comparison table with "full CSS customization via the Appearance API." Hosted full-page Checkout caps at 15 Dashboard settings; the embedded form gets roughly 70 Appearance API settings. Full Elements gets unrestricted access [raw/stripe--checkout--ui-comparison.md]. Theming properly is what makes the "custom checkout" default actually pay off over hosted Checkout, a half-themed Elements form that still looks like generic Stripe UI has given up the customization win while keeping all the extra integration code.

## One Appearance object, two places to pass it

The shape is shared; where you pass it differs by integration:

```ts
// Custom Checkout Session (default)
checkout = await stripe.initCheckoutElementsSdk({
  clientSecret,
  elementsOptions: { appearance: brandAppearance, fonts: brandFonts },
});

// Raw Payment Intents
elements = stripe.elements({ clientSecret, appearance: brandAppearance, fonts: brandFonts });
```

Full example: `references/appearance-theming.ts`.

## The three theme levels

1. **`theme`**, base preset: `'stripe'`, `'night'`, or `'flat'`. Pick the closest match to your product's existing light/dark mode, then override with `variables`.
2. **`variables`**, global tokens: `colorPrimary`, `colorBackground`, `colorText`, `colorDanger`, `fontFamily`, `spacingUnit`, `borderRadius`. This is the fast 80% of a brand match.
3. **`rules`**, CSS-like overrides scoped to specific Element parts (`.Input`, `.Input:focus`, `.Label`, `.Tab`, `.Tab--selected`, etc.) for anything `variables` can't reach.

## Custom fonts

Passed as a separate `fonts` array alongside the appearance object at init time, not merged into `variables`:

```ts
const brandFonts = [
  { cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap' },
];
```

## Dark mode and the Express Checkout Element

If the appearance theme uses a dark background, the Express Checkout Element automatically switches Apple Pay / Google Pay button themes to a compatible (usually light) variant for visibility, you don't need to manually sync wallet button themes to your appearance theme [raw/stripe--express-checkout-element--overview.md].

## CSP requirements for theming to actually render

Custom fonts and Element iframes both depend on the page's Content Security Policy allowing Stripe's domains:

- `frame-src` / `script-src`: `https://js.stripe.com`
- `connect-src`: `https://api.stripe.com`
- `img-src`: `https://*.stripe.com`
- If a font is loaded via an external CSS file, its URL must also be allowed by `connect-src`.

See `guides/09-security-and-pci-scope.md` for the full CSP list, including the Address Element's Google Maps case.

## Don't theme past what Stripe controls

The Appearance API styles the chrome Stripe renders (input borders, labels, tabs, focus states). It does not give you DOM access inside the Element's iframe, you cannot, for example, add a custom icon inside the card number field. If a design calls for something inside that boundary, that's a hard limit of Elements, not a configuration gap; don't spend time hunting for an undocumented override.
