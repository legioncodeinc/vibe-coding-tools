# Guide 02: Configure device emulation

## What this guide covers

How to set up the two required browser profiles (desktop 1440x900, mobile 390x844) before capturing any checkpoint.

## Binding product decision, not a research finding

This Drone's exact viewport dimensions, 1440x900 desktop and 390x844 mobile, are a binding product decision recorded in PRD-012 and build plan section 6 ("Browser posture"). No research source in this Stinger's archive states these specific numbers; state them as product requirements, never cite a source for them. Section 5 of `distilled-visual-funnel.md` says this explicitly and this guide inherits that honesty.

## Procedure

1. Do not spread a named Playwright registry device descriptor unmodified for either profile. The registry's stock desktop entries commonly ship 1280x720, and its mobile descriptors cluster around iPhone-model viewports in the 390-430 width range at a 2-3x device scale factor, neither of which is 390x844 [raw/playwright-dev-docs-emulation.md]. Use `references/scripts/playwright-viewport-config.js` as the starting point: two explicit custom context configurations, not a bare device spread.
2. For the desktop profile: start from `devices['Desktop Chrome']` for the Chromium engine and its sane baseline settings, then override `viewport: { width: 1440, height: 900 }`. Declare `viewport` AFTER destructuring the device object; the official docs flag that declaring it before would let the descriptor's own viewport silently win depending on declaration order [raw/playwright-dev-docs-emulation.md].
3. Also on the desktop profile, set `userAgent: undefined` after the spread. Pre-configured descriptors assume a specific host platform for their UA string (Desktop Chrome ships a Windows-specific UA regardless of the actual host), and the docs recommend unsetting it to fall back to the real host platform's UA when that specificity is undesirable [raw/playwright-dev-docs-emulation.md]. This Drone's mandate is a "real desktop Chrome session," not a spoofed one.
4. For the mobile profile: build every field explicitly rather than spreading a named descriptor, since none matches 390x844. Set `viewport: { width: 390, height: 844 }`, an explicit mobile Chrome `userAgent` string, `isMobile: true`, and `hasTouch: true`. `isMobile` specifically controls whether the page honors the meta viewport tag and whether touch events fire [raw/playwright-dev-docs-emulation.md], both of which matter for an honest mobile-layout capture. Declare `isMobile` after any base spread for the same override-order reason as `viewport`.
5. If the harness's own browser tool (rather than a raw Playwright script) is what's actually driving the session, translate these same four fields, viewport width/height, user agent, isMobile, hasTouch, into whatever emulation call that tool exposes. The mechanics above are Playwright's documented model; the values (1440x900 / 390x844 / real UA strings / touch flags) are what must survive the translation.
6. Note the capture environment (host OS, browser version, headless vs. headed) alongside the screenshot's evidence pointer. Full-page screenshot rendering is sensitive to all four [raw/playwright-dev-docs-emulation.md]; this Stinger takes fresh per-run captures rather than diffing against a stored baseline, so the note is for auditability, not for triggering a re-capture.

## What this guide does not cover

Raw Chrome DevTools Protocol emulation (`Emulation.setDeviceMetricsOverride`) as opposed to Playwright's wrapper around it was not separately researched; if the harness exposes CDP directly rather than Playwright, treat the field mapping in step 5 as the transferable part, not the Playwright-specific API calls themselves.
