/**
 * Playwright device-emulation config for visual-funnel-stinger's checkpoint captures.
 *
 * Grounded in Playwright's official emulation docs [raw/playwright-dev-docs-emulation.md]:
 * device descriptors are a registry (playwright.devices) meant to be spread into a
 * context or a test-runner project's `use` block, with `viewport` and `isMobile`
 * declared AFTER the spread so they are not silently overwritten by the descriptor.
 *
 * Neither of this plugin's two required viewports (1440x900 desktop, 390x844 mobile)
 * matches a named Playwright registry descriptor exactly (registry desktops commonly
 * ship 1280x720; registry mobile descriptors cluster in the 390-430 width range at a
 * 2-3x device scale factor, not 390x844 specifically). The 1440x900 and 390x844
 * dimensions themselves are this plugin's own binding product decision (PRD-012,
 * build plan section 6, "Browser posture"), not a value stated by any research
 * source. Because of that mismatch, both profiles below are explicit custom context
 * configurations rather than a bare spread of an off-the-shelf named device, per the
 * reasoning in distilled-visual-funnel.md section 5.
 *
 * Harness-portable: no absolute paths. Copy this file's `use` blocks into the
 * consuming harness's own Playwright config or `browser.newContext()` call; this
 * file is a reference snippet, not an invoked script.
 */

const { devices } = require('@playwright/test');

/**
 * Desktop checkpoint profile: real desktop Chrome at 1440x900.
 * Starts from 'Desktop Chrome' for its Chromium engine and sane defaults, then
 * overrides viewport explicitly (order matters, see header note above) and unsets
 * the descriptor's Windows-specific userAgent per the docs' own recommendation
 * [raw/playwright-dev-docs-emulation.md], so the desktop capture reflects a real
 * Chrome UA rather than a fixed, spoofed-looking platform string.
 */
const desktopFunnelProfile = {
  ...devices['Desktop Chrome'],
  viewport: { width: 1440, height: 900 },
  userAgent: undefined,
  isMobile: false,
  hasTouch: false,
};

/**
 * Mobile checkpoint profile: real mobile Chrome UA at 390x844.
 * No named registry descriptor ships this exact viewport, so every field is set
 * explicitly rather than spread from a named mobile device. deviceScaleFactor of 3
 * matches the density of shipping 390-wide phones in the registry's own iPhone
 * descriptors; adjust only if a specific target device is named at intake.
 */
const mobileFunnelProfile = {
  viewport: { width: 390, height: 844 },
  userAgent:
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36',
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
};

module.exports = { desktopFunnelProfile, mobileFunnelProfile };

/**
 * Usage inside a Playwright config (defineConfig projects), per the registry/spread
 * pattern shown in the official docs [raw/playwright-dev-docs-emulation.md]:
 *
 *   projects: [
 *     { name: 'funnel-desktop', use: { ...desktopFunnelProfile } },
 *     { name: 'funnel-mobile', use: { ...mobileFunnelProfile } },
 *   ]
 *
 * Or per-checkpoint inside a single script:
 *
 *   const desktopCtx = await browser.newContext({ ...desktopFunnelProfile });
 *   const mobileCtx = await browser.newContext({ ...mobileFunnelProfile });
 *   // capture desktopCtx screenshot to visual/desktop/<checkpoint-id>.png
 *   // capture mobileCtx screenshot to visual/mobile/<checkpoint-id>.png
 *
 * Screenshot determinism caveat, carried from the docs: full-page screenshots are
 * sensitive to host OS, browser version, and headless-vs-headed mode
 * [raw/playwright-dev-docs-emulation.md]. That caveat is written for baseline-diff
 * visual regression testing; this Stinger takes fresh per-run captures rather than
 * diffing against a committed baseline, so treat it as a reason to note the capture
 * environment in the evidence pointer, not as a reason to skip capture.
 */
