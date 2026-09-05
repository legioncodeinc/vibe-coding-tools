# AuthKit branding: dashboard editor, custom CSS, when to drop to headless API

- URL: https://workos.com/docs/authkit/branding ; https://workos.com/blog/customizing-authkit-flows ; https://workos.com/blog/authkit-custom-css ; https://workos.com/changelog/authkit-branding-customization ; https://workos.com/changelog/custom-css-for-authkit
- Fetched: 2026-08-14
- Source type: Official docs + official WorkOS blog/changelog
- Component: AuthKit / Branding & UI customization

## Content

### Dashboard brand editor

Configured in WorkOS Dashboard > Branding, **per environment** - staging and production (and each "project," a grouping of environments for one product) can each carry their own logo/colors/theme independently. A branding config can be copied from another environment as a starting point before going live (e.g. test a change in staging first).

Editor covers:
- Logo upload (full logo, logo icon, favicon) - minimum 160x160px for logo/icon (1:1 for icon), 32x32px for favicon (1:1), 100KB max per asset, formats JPG/PNG/SVG (favicon also accepts GIF/WebP/AVIF/ICO).
- Four brand colors, each independently configurable for light AND dark mode: page background, button background, button text, link color. All other UI colors (focus outline, hover, borders) are auto-derived from these four for consistency.
- Light/dark mode: AuthKit supports both; can be forced to one appearance or left to follow the user's OS setting.
- Logo display mode: full logo, icon only, or none.
- Page copy: title, sign-in link text, sign-up link text - editable inline in the preview pane.
- Page layout: centered one-column, or two-column split with a custom-HTML/CSS content panel.
- Custom copy/links to terms-of-service and privacy policy.
- Localization: preview and translate auth screens and emails per supported locale.

### Custom CSS (released as an incremental capability beyond the color/logo editor)

Applies **globally across all AuthKit pages** (not to emails or the Admin Portal): login, signup, password reset, magic auth, SSO connections, MFA enrollment, organization selection. Scoped per-page targeting is available via a `data-hak-page` attribute, e.g. targeting `sign-up/registration`, `sign-in/password`, `mfa/enrollment`, or `organization-selection` independently, so a global stylesheet can still special-case one screen (reorder OAuth buttons, restyle just the sign-up header, add a background image on one screen only).

Light/dark targeting pattern using the CSS `light-dark()` function, or explicit parent-theme selectors:

```css
.ak-Background {
  .dark-theme & {
    background: linear-gradient(0deg, #333, #111);
  }
  .light-theme & {
    background: linear-gradient(0deg, #fff, #ccc);
  }
}
```

An in-editor element-targeting tool lets you hover/click a live-preview element to auto-focus its selector in the sidebar; interactive states (`:hover`, `:focus`, `:active`) still require external devtools to identify but can then be styled directly since custom CSS shipped.

### Decision rule: branding/CSS vs. dropping to the headless Authentication API

From the official "customizing AuthKit flows" post: if the ask is "change how a screen looks" or "change which screen someone lands on" - reach for **hints** (`screen_hint`, `login_hint`, `organization_id` on the authorization URL), **branding**, or **custom CSS** first. These options don't require reimplementing password resets, MFA, or email verification. Reserve the full custom/headless Authentication API for the case where the hosted UI's customization ceiling has genuinely been hit - e.g., one specific in-app screen like "add a teammate" - rather than replacing the whole authentication surface, since going headless trades a maintained, localized, bot-resistant flow for one you now own end-to-end. Reaching for the API first, before trying hints/branding/CSS, is called out explicitly as "the most common overcorrection."
