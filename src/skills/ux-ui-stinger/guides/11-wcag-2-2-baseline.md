# 11 — WCAG 2.2 baseline (the 2026 floor)

WAI-ARIA APG (`guides/00-principles.md` rule #4) is the keyboard + role contract floor. **WCAG 2.2 AA is the visual + interaction contract floor on top of it.** Both are floors — neither is the ceiling.

This guide is what the Angel checks against every UI review. If the design-system folder doesn't pin one of these criteria with a token or utility, the Angel updates the folder *first* (per `guides/00-principles.md` rule #1), then reviews the PR.

WCAG 2.2 was published as a W3C Recommendation on 2023-10-05. It is the current de facto floor for most legal frameworks targeting product accessibility — including the European Accessibility Act (see `guides/12-eaa-compliance.md`), which references EN 301 549 → WCAG 2.2 AA for digital services. WCAG 2.2 is backwards-compatible with 2.1 / 2.0; it adds nine success criteria and removes the obsolete 4.1.1 Parsing.

Source: <https://w3c.github.io/wcag/guidelines/22/>; <https://www.w3.org/TR/WCAG22/>.

---

## The four 2.2 criteria this Angel cares about most

These four cover the changes most likely to cause regressions in a token-driven design system that was specced against 2.1. The other 2.2 additions (3.2.6 Consistent Help, 3.3.7 Redundant Entry) are Level A and rarely cause token-system bugs — they are content/flow concerns covered by the design brief, not the token layer.

### 1. SC 2.4.11 Focus Not Obscured (Minimum) — Level AA

**The rule:** when a focusable component receives keyboard focus, it must not be **entirely** hidden by author-created content (sticky headers, sticky footers, persistent toasts, cookie banners, modal scrims, etc.).

Source: <https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum>.

**Why this breaks in real systems:** sticky `position: sticky` / `position: fixed` headers and footers are common. When the user `Tab`s to a control behind the sticky element, the focus ring is technically rendered but offscreen.

**What the Angel checks:**

- The product's `:focus-visible` token (`--focus-ring`) is applied app-wide via the utility layer, not bespoke per component.
- Any sticky / fixed element in `01-master-tokens.css` or its layout layer has documented z-index and offset behavior so focus scrolling can compensate.
- `scroll-padding-top` is set on the scrolling container to match sticky-header height, so `scrollIntoView` calls (used by Radix and React Hook Form's `setFocus`) don't park the focused element under a header. Pattern: `html { scroll-padding-top: var(--header-h); scroll-padding-bottom: var(--footer-h); }`.

**Common violation:** a feature ships a 64px sticky header. Tab-focused inputs on screens with ≥80vh of content land partly behind the header. Fix lives in tokens + global CSS, not in feature code.

### 2. SC 2.5.7 Dragging Movements — Level AA

**The rule:** any function operated by **dragging** (pointer-down → move → release) must have a **single-pointer alternative** that does not require dragging.

Source: <https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements>.

**Where this lands in our stack:**

- **Drag-and-drop reorder lists** (e.g., dnd-kit, react-beautiful-dnd): every reorderable item needs explicit "Move up" / "Move down" buttons (or keyboard handlers `ArrowUp` / `ArrowDown`) as an alternative.
- **Sliders** are exempt because each is a single pointer-down + click on the rail — but if a custom range UI requires dragging the thumb, it must accept clicks on the rail to set the value.
- **Map pans**, **canvas pans**, **chart brushing** — every dragging interaction needs a button-based or keyboard equivalent.

**What the Angel checks:**

- The component spec for any draggable surface includes a "non-drag alternative" subsection, citing this success criterion.
- The wrapper exposes the alternative (a small button group or keyboard map) via a documented API.
- Radix / Mantine drag primitives are used over hand-rolled mouse handlers — they tend to ship the keyboard alternative built-in. (Confirm via the library's APG-pattern citation in the wrapper's component doc.)

### 3. SC 2.5.8 Target Size (Minimum) — Level AA

**The rule:** pointer targets must be **at least 24×24 CSS pixels**, OR have **sufficient spacing** so that no other target falls within a 24×24-pixel circle centered on the target. Exceptions: equivalent target available, target is in a paragraph of text, the size is essential, or determined by the user agent.

Source: <https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum>.

**Where this lands in our stack:**

- **Icon buttons** (close-X, kebab-menu, etc.): a Lucide icon at 16px stroke ≠ a 24×24 hit area. The wrapper must provide ≥24×24 hit padding via a hidden hit-box (a `::before` pseudo-element extending the click region) or a min-width/min-height set on the button itself. See `guides/06-lucide-react-icons.md` for the Icon-wrapper rule.
- **Toolbar density** in dense UIs (data grids, table row actions): stacked icon buttons must be spaced so each has a 24×24 effective target.
- **Inline checkboxes / radios in lists**: native input sizes are typically 13×13 — wrap them in a clickable label that gives ≥24×24 effective area.
- **Pagination** components: the page-number buttons must be ≥24×24.

**What the Angel checks:**

- The product's icon-button utility (`.btn-icon` or similar) sets `min-width: 2.5rem; min-height: 2.5rem` (or whatever maps to ≥24px in CSS px) by default, and feature code uses the utility, not raw `<button><Icon /></button>`.
- `templates/icon-wrapper.tsx` enforces this hit-area floor — review confirms feature code uses the wrapper.
- For dense data-grid toolbars, the Angel calls out the need for spacing or alternative menu (`MoreActions` dropdown) when column action density exceeds the 24×24 budget.

**Tailwind reference:** `min-h-11 min-w-11` (44px, exceeds the floor) for primary touch targets; `min-h-6 min-w-6` (24px) for the absolute floor with sufficient spacing.

### 4. SC 3.3.8 Accessible Authentication (Minimum) — Level AA

**The rule:** a cognitive function test (remembering a password, solving a puzzle, transcribing a code) must NOT be required for any step in an authentication process unless the step also provides an alternative, a mechanism that assists, object recognition, or personal-content recognition.

Source: <https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html>.

**Where this lands in our stack:**

- **Allow paste into password / OTP / 2FA fields.** Blocking paste (via `onPaste={e => e.preventDefault()}`) is now a WCAG failure. Password managers and passkey autofill rely on paste.
- **Allow password manager autofill.** Use `autocomplete="current-password"`, `autocomplete="new-password"`, `autocomplete="one-time-code"` — never strip these or use `autocomplete="off"` on auth fields.
- **Offer passkeys / WebAuthn / magic-link / OAuth** as the primary path where possible. These are not cognitive function tests.
- **CAPTCHA**: if used, a non-cognitive alternative must exist (e.g., Cloudflare Turnstile, hCaptcha "audio challenge", or a behavioral check). reCAPTCHA v2 image-grid CAPTCHA used as the only path is a failure.
- **Authentication forms must have visible labels** — placeholder-only labels are an additional 2.1-era failure that compounds with this.

**What the Angel checks:**

- The auth screens in `04-screens/` declare paste-allowed for password and OTP fields and cite this success criterion.
- The login form spec mentions either a passkey path or a magic-link path or OAuth (i.e., something that's not "type a password from memory") as a first-class option.
- The `Input` wrapper does not strip `onPaste` or `autocomplete` from props.
- CAPTCHA components, if any, have the non-cognitive alternative documented in the screen spec.

---

## What the Angel reviews against this guide

When a PR touches an interactive surface, the Angel walks this checklist:

1. **Focus (2.4.11):** does the changed surface scroll a focused element behind any sticky header/footer? Does `scroll-padding-*` cover this case?
2. **Drag (2.5.7):** does the change introduce dragging? If yes, where is the non-drag alternative documented?
3. **Target size (2.5.8):** any icon-only button, checkbox, radio, pagination control, or close-X must use a wrapper that enforces ≥24×24. Hex / inline sizes that don't are flagged.
4. **Auth (3.3.8):** any change to a sign-in, sign-up, OTP, password-reset, or 2FA flow must preserve paste, preserve `autocomplete`, and not introduce a cognitive-only path.

If any check fails, the Angel writes a delta in `templates/review-output.md` shape, citing this guide's section and the W3C Understanding URL for that criterion.

---

## What's added but explicitly NOT the Angel's review focus

- **2.4.12 Focus Not Obscured (Enhanced)** — AAA. Stretch goal; review only on request.
- **2.4.13 Focus Appearance** — AAA. The product's `--focus-ring` token already exceeds AAA contrast in our default tokens (per `guides/02-token-and-utility-enforcement.md`), but we don't formally certify AAA.
- **2.5.5 Target Size (Enhanced)** — AAA. Stretch goal.
- **3.2.6 Consistent Help, 3.3.7 Redundant Entry** — Level A. Content / flow concerns covered by the design brief, not the token layer.
- **3.3.9 Accessible Authentication (Enhanced)** — AAA.

If a project explicitly chases AAA (e.g., government client), the Angel surfaces a handoff to `design-system-worker-bee` per `guides/09-system-level-escalation.md`.

---

## Cross-references

- `guides/00-principles.md` rule #4 — APG floor.
- `guides/02-token-and-utility-enforcement.md` — where `--focus-ring`, hit-area utilities, and scroll-padding tokens live.
- `guides/06-lucide-react-icons.md` — icon-button wrapper that enforces 24×24 floor.
- `guides/12-eaa-compliance.md` — the legal regime that makes WCAG 2.2 AA the EU floor.
- `research/2026-04-25-wcag-2-2.md` — research note.

---

*Sources cited:* W3C WCAG 2.2 working draft (<https://w3c.github.io/wcag/guidelines/22/>), W3C WCAG 2.2 Recommendation (<https://www.w3.org/TR/WCAG22/>), GetWCAG practical guide (<https://getwcag.com/en/wcag-2-2-guidelines>), and the four W3C Understanding pages linked inline above.
