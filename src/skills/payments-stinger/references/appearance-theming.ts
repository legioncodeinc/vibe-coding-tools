/**
 * payments-stinger, Appearance API theming example.
 *
 * Elements custom checkout gets full CSS customization via the Appearance
 * API, the deepest theming tier Stripe offers (hosted Checkout caps at 15
 * Dashboard settings, embedded form at ~70 Appearance settings).
 *
 * Grounded in:
 *   raw/stripe--appearance-api--theming.md
 *   raw/stripe--checkout--ui-comparison.md
 *   raw/stripe--custom-checkout-session--quickstart.md
 */

import type { Appearance } from '@stripe/stripe-js';

export const brandAppearance: Appearance = {
  theme: 'stripe', // base theme: 'stripe' | 'night' | 'flat'
  variables: {
    colorPrimary: '#0f172a',
    colorBackground: '#ffffff',
    colorText: '#1e293b',
    colorDanger: '#dc2626',
    fontFamily: '"Inter", system-ui, sans-serif',
    spacingUnit: '4px',
    borderRadius: '8px',
  },
  rules: {
    '.Input': {
      border: '1px solid #e2e8f0',
      boxShadow: 'none',
    },
    '.Input:focus': {
      border: '1px solid #0f172a',
      boxShadow: '0 0 0 1px #0f172a',
    },
    '.Label': {
      fontWeight: '500',
      color: '#475569',
    },
    '.Tab': {
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
    },
    '.Tab--selected': {
      border: '1px solid #0f172a',
      backgroundColor: '#f8fafc',
    },
  },
};

// Custom font set, passed alongside the appearance object at init time,
// not merged into `variables`.
export const brandFonts = [
  {
    cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
  },
];

// ---- Usage: Custom Checkout Session (default) ----
//
// checkout = await stripe.initCheckoutElementsSdk({
//   clientSecret,
//   elementsOptions: { appearance: brandAppearance, fonts: brandFonts },
// });

// ---- Usage: raw Payment Intents ----
//
// elements = stripe.elements({
//   clientSecret,
//   appearance: brandAppearance,
//   fonts: brandFonts,
// });

// Dark-mode variant. Express Checkout Element auto-switches Apple Pay /
// Google Pay button themes to stay visible against whatever background
// theme you set here, no manual button-theme sync needed.
export const brandAppearanceDark: Appearance = {
  ...brandAppearance,
  theme: 'night',
  variables: {
    ...brandAppearance.variables,
    colorBackground: '#0f172a',
    colorText: '#f1f5f9',
  },
};
