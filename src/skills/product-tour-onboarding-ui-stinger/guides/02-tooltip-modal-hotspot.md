# Guide 02: Tooltip, Modal, Hotspot, and Spotlight Components

Use this guide when implementing or auditing the UI components that make up a product tour.

---

## The four tour UI primitives

### 1. Tooltip (popover step)

A small floating element anchored to a specific DOM element. Used for step-by-step contextual guidance.

**Anatomy:**
- **Positioning engine**: calculates above/below/left/right based on viewport space (Floating UI or Popper.js; both Driver.js and Shepherd.js bundle their own).
- **Backdrop / spotlight**: the semi-transparent overlay that dims the rest of the page and cutouts around the target element. Optional but dramatically improves focus.
- **Content slot**: title, body, and optional media (image/video).
- **Navigation**: Previous / Next / Skip / Close buttons.

**Stable anchor:** Target elements using `data-tour="step-name"` attributes. See `guides/00-principles.md` and `guides/06-maintenance-and-drift.md`.

### 2. Modal step

A centered overlay not anchored to a specific element. Used for welcome screens, mid-tour announcements, or "congratulations" screens.

**When to use:** Opening and closing steps; announcements that don't require element context; completion celebrations.

**Caution:** Modals that appear on login (not tied to a user action or behavioral trigger) have low engagement. Use behavioral triggers, not login-time triggers. See `guides/04-segment-triggers.md`.

### 3. Hotspot (pulsing beacon)

A persistent visual indicator (usually a pulsing dot or ring) attached to an element, inviting the user to click to learn more.

**Use case:** Surfacing new features without forcing a multi-step tour. Lower friction than a tooltip sequence.

**Implementation note:** Hotspots are passive: they wait for the user to click. This makes them appropriate for power-user features that don't block the primary workflow.

### 4. Spotlight (highlight)

A focused highlight around a single element without a popover. Used to draw attention without providing textual guidance.

**Best library for spotlights:** Driver.js: its primary use case is single-element `.highlight()` with zero overhead.

---

## The three-layer stack

Every tour component sits on three abstraction layers:

1. **Positioning engine**: computes where to render the popover relative to the target. (Bundled inside the tour library; not a user concern for SaaS tools.)
2. **Backdrop/spotlight**: the overlay and cutout. Controls user focus. Can be configured for opacity and border-radius (rounded vs. tight fit to element).
3. **Content slot**: your actual text, CTA, and media.

Keep these layers mentally separate when debugging tour UI issues. A positioning bug is a library concern; a content-layout bug is a CSS concern; a targeting bug is a selector concern.

---

## Accessibility baseline

Every tooltip/modal component must meet:
- `role="dialog"` on the popover container.
- Focus management: when a step opens, focus moves into the popover; when it closes, focus returns to the trigger element.
- Keyboard navigation: Tab moves between interactive elements in the popover; Escape dismisses.
- `aria-label` or `aria-labelledby` on the dialog container.

Shepherd.js v15 handles this by default. Driver.js requires manual additions. SaaS tools vary; verify in the platform's accessibility documentation.

---

## CSS token integration

Tour tooltip/modal styling should consume the product's existing design tokens (colors, border-radius, shadow, typography). Do NOT let the tour tool's default styles create a parallel style system.

For SaaS tools (Userpilot, Appcues, etc.): use the custom CSS injection feature to apply your token values.

For code-first libraries: wrap the popover content in your existing component library's `Card` or `Popover` component rather than using the library's default renderer.

Route all token decisions to `ux-ui-svelte-worker-bee`.
