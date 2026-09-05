---
source_url: https://github.com/swagger-api/swagger-ui/issues/10718
retrieved_on: 2026-05-20
source_type: github-readme
authority: community
relevance: medium
topic: swagger-ui-theming
stinger: api-docs-stinger
---

# Swagger UI Dark Mode color-scheme Issue: GitHub Issue #10718

## Summary

Filed February 2026. Swagger UI added native dark mode support but omitted the CSS `color-scheme: light dark` declaration, causing browser-native controls (scrollbars, form inputs) to render in light mode even when the page is in dark mode. The workaround is to add `<meta name="color-scheme" content="light dark">` in the HTML template. A fix PR (#10735) was merged February 20, 2026.

## Key quotations / statistics

- "It's great that Swagger UI supports dark mode now! However, it forgot to indicate that in the color-scheme property, and so scroll bars and other browser provided controls still render in light mode."
- Fix: `:root { color-scheme: light dark; }` in the CSS file
- PR #10735 merged: "fix(dark-mode): add color-scheme property for native dark UI controls" (Feb 20, 2026)

## Swagger UI theming approach (from SCSS source)

The Swagger UI SCSS architecture uses `@use "sass:meta"` and loads partials for variables, layout, buttons, form, modal, models, servers, table, topbar, information, authorize, errors. The dark mode module is loaded outside `.swagger-ui` class to target the HTML parent.

Key SCSS variables for theming (from `swagger-ui-scss` community package):
```scss
$color-primary: #6750a4;  // Override primary color
```

Community theme library `ostranme/swagger-ui-themes` offers: `theme-feeling-blue`, `theme-flattop`, `theme-material`, `theme-monokai`, `theme-muted`, `theme-newspaper`, `theme-outline` for both 2.x and 3.x.

## CSS variable override approach (simpler than SCSS)

For most customization, CSS variable overrides in a `<style>` block are sufficient:
```css
.swagger-ui { --primary-color: #6750a4; }
```

## Annotations for stinger-forge

- Relevant to `guides/01-tool-selection.md`: note Swagger UI's dark mode is a recent addition (not mature) compared to Scalar's built-in dark mode.
- The `color-scheme: light dark` fix was merged Feb 2026; teams on older Swagger UI versions should be aware.
- Community theme library (`swagger-ui-themes`) is a useful reference for teams stuck on Swagger UI; document it as the go-to for theming without SCSS compilation.
- Contrast with Scalar's theming: Scalar has 9 built-in themes + CSS custom property system; Swagger UI theming requires either SCSS compilation or a community CSS override.
- The SCSS architecture note is relevant for `templates/`: any Swagger UI theme template should use CSS variable overrides, not SCSS (simpler for most projects).
