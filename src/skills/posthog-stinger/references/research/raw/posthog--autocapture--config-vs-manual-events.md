# PostHog autocapture: what it captures, configuration, and when to disable it

- URL: https://posthog.com/docs/product-analytics/autocapture ; https://posthog.com/docs/getting-started/send-events ; https://posthog.com/docs/product-analytics/capture-events ; https://posthog.com/docs/libraries/js/config
- Fetched: 2026-08-14
- Source type: Official docs
- Component: Product analytics / JavaScript Web SDK config

## Content

### What autocapture captures (Web/JS SDK, enabled by default)

- Interactions: clicks, taps, and other interactions with `a`, `button`, `form`, `input`, `select`, `textarea`, `label` tags; form submissions/changes; `contenteditable` changes; clipboard copy/cut (`capture_copied_text`).
- Navigation: pageviews and pageleaves (see below for SPA config).
- Heatmap data: general clicks, mouse movement, scrolling (project-setting opt-in), no additional events created.
- Dead clicks: a click not followed by a page change - opt-in via project settings or `capture_dead_clicks: true`.
- Rage clicks: `$rageclick` fires on 3 clicks within 30px and 1s of each other (thresholds configurable). Latest `defaults` auto-ignore common false positives (navigation controls, quantity steppers, text-selection surfaces).
- Web vitals, exceptions, session recording are separate autocapture categories with their own docs.

Autocapture events display as `clicked span with text "Delete"` style names.

### Configuring interaction autocapture

```javascript
posthog.init('<ph_project_token>', {
  api_host: 'https://us.i.posthog.com',
  defaults: '2026-05-30',
  autocapture: {
    url_allowlist: ['https://example.com', 'test.com/.*'],
    url_ignorelist: ['https://example.com/admin'],
    dom_event_allowlist: ['click', 'change', 'submit', 'input'],
    element_allowlist: ['a', 'button', 'form', 'input', 'select', 'textarea', 'label'],
    css_selector_allowlist: ['[ph-capture]', '[data-track]'],
    css_selector_ignorelist: ['.ph-no-autocapture', '[data-ph-no-autocapture]', '[data-sensitive]'],
    element_attribute_ignorelist: ['aria-label', 'data-attr-pii', 'data-sensitive'],
    capture_copied_text: true,
  },
})
```

If unset, PostHog ignores `.ph-no-autocapture` and `[data-ph-no-autocapture]` by default; providing a custom `css_selector_ignorelist` replaces the defaults, so include them explicitly if still wanted.

### Disabling autocapture

Two ways: in project settings, or `autocapture: false` in config (before or after init via `posthog.set_config({ autocapture: false })`). Disabling interaction autocapture does NOT disable navigation autocapture (pageviews/pageleaves) - those are controlled separately via `capture_pageview`/`capture_pageleave`.

```javascript
posthog.init('<ph_project_token>', {
  api_host: 'https://us.i.posthog.com',
  defaults: '2026-05-30',
  autocapture: false,
})
```

### Navigation autocapture config

| Option | Type/Default | Behavior |
| --- | --- | --- |
| capture_pageview | boolean or `'history_change'`, default true (page-load based); `history_change` when `defaults >= '2025-05-24'` | `history_change` listens to browser History API - required for SPA pageview tracking |
| capture_pageleave | boolean or `'if_capture_pageview'`, default `'if_capture_pageview'` | Captures pageleave only if pageview capture is also active |

```javascript
posthog.init('<ph_project_token>', {
  api_host: 'https://us.i.posthog.com',
  defaults: '2026-05-30',
  capture_pageview: false,
  capture_pageleave: false,
})
```

### Attaching extra properties to autocapture events

`data-ph-capture-attribute-some-key={someValue}` on an element (or a parent) adds `some-key: 'someValue'` to autocapture events from that element/children. For form submissions specifically, PostHog does NOT auto-capture form field values by default (to prevent accidental sensitive-data capture) - use `data-ph-capture-attribute-*` on the `<form>` element to opt specific values in.

### Official guidance: autocapture vs custom (manual) events

"We recommend starting with autocapture for your web app as it's the quickest way to get set up, gives you full coverage, and avoids manually adding custom events... We recommend using a combination of autocapture and custom events, and tuning autocapture to your needs if you find you're sending too many events." [https://posthog.com/docs/getting-started/send-events]

Key limitation called out explicitly: **"Autocapture won't give you a reliable `user_signed_up` event. Tracking signups explicitly is essential for measuring activation, retention, and revenue."** Track key growth events (signups, purchases, feature usage) as explicit custom events even when autocapture is on.

Autocapture's other limitations (from the event-tracking tutorial):
- Lack of signal: captures everything, hard to know what matters at scale - needs filters/actions/insights to focus.
- Frontend only: no server-side coverage.
- Customization ceiling: adding rich properties to autocapture events is limited compared to custom events.
- UI-text-dependent naming drift: if an element's text changes (e.g. "Add to cart" -> "Add"), the autocapture event name changes too (`Clicked button with text 'Add to cart'` -> `Clicked button with text 'Add'`), silently breaking historical continuity. Manually tracking high-value actions with custom events avoids this.

### Custom event capture (client and server)

```javascript
// Web
posthog.capture('user_signed_up', { login_type: 'email', is_free_trial: true })

// Node.js
client.capture({
  distinctId: 'distinct_id_of_the_user',
  event: 'user signed up',
  properties: { login_type: 'email', is_free_trial: true },
})
```

### When to turn autocapture off (synthesis across sources)

- Cost control: autocapture materially increases event volume; the cutting-costs doc lists "configure autocapture" (allow/ignore lists, or full disable) as a primary lever.
- When the product's UI text/DOM changes frequently and autocapture-name drift would corrupt trend continuity.
- When precise, typed, versioned events matter more than broad low-effort coverage (schema-management workflows favor deliberate custom events).
- Backend-heavy or API-first products where most meaningful actions never touch the DOM at all.

### Global config attributes relevant to capture strategy (JS Web SDK)

| Attribute | Default | Purpose |
| --- | --- | --- |
| person_profiles | `'identified_only'` | Controls whether anonymous events create a person profile; `'always'` captures identified events for everyone |
| property_denylist | `[]` | Properties never sent with capture calls |
| rate_limiting | `{ events_per_second: 10, events_burst_limit: 100 }` | Client-side event rate limiting to avoid runaway capture volume |
| mask_all_text / mask_all_element_attributes | false | Prevents autocapture from reading text/attributes from elements |
