# PostHog session replay: privacy masking controls and cost implications

- URL: https://posthog.com/docs/session-replay/privacy ; https://posthog.com/session-replay/pricing ; https://posthog.com/docs/session-replay ; https://posthog.com/docs/privacy/data-collection
- Fetched: 2026-08-14
- Source type: Official docs / official pricing page
- Component: Session replay

## Content

### How replay privacy controls work (architecturally important)

"PostHog offers a range of controls to limit what data is captured by session recordings. Our privacy controls run in the browser or mobile app. So, masked data is never sent over the network to PostHog." Masking happens client-side before transmission - not a post-hoc redaction on PostHog's servers.

### Input elements (masked by default)

Any `<input>` is highly likely to hold sensitive text (email, password), so inputs are masked by default:

```typescript
posthog.init('<ph_project_token>', {
  session_recording: {
    maskAllInputs: false, // disable the default
    maskInputOptions: {
      password: true, // highly recommended as an absolute minimum
      // color, date, 'datetime-local', email, month, number, range, search, tel, text, time, url, week, textarea, select
    },
  },
})
```

Custom masking function for finer control:

```typescript
posthog.init('<ph_project_token>', {
  session_recording: {
    maskAllInputs: true,
    maskInputFn: (text, element) => {
      if (element?.attributes['type']?.value === 'search') return text // don't mask search boxes
      return '*'.repeat(text.length)
    },
  },
})
```

### Text elements (NOT masked by default - opt-in)

```typescript
// Mask all non-input text
posthog.init('<ph_project_token>', {
  session_recording: { maskTextSelector: '*' },
})

// Mask specific elements via CSS selector
posthog.init('<ph_project_token>', {
  session_recording: { maskTextSelector: '.email, #sensitive' },
})
```

Masking an element cascades to its children (`:not` selectors don't work to exclude a child). Custom text-masking function (e.g. redact only email-looking strings):

```typescript
maskTextSelector: '*',
maskTextFn: (text) => {
  if (text.trim().length === 0) return text
  const emailRegex = /(\S+)@(\S+\.\S+)/g
  return text.replace(emailRegex, (m, g1, g2) => '*'.repeat(g1.length) + '@' + '*'.repeat(g2.length))
}
```

### Other elements / whole-element exclusion

Add CSS class `ph-no-capture` to any element that should be fully excluded (replaced with a same-size blank block in playback, and this ALSO disables autocapture events from that element):

```html
<div class="ph-no-capture">I won't be captured at all!</div>
```

### URL redaction (query strings can carry tokens/PII)

Session replay captures the page URL shown in the replay player's URL bar/timeline; query strings (auth tokens, user identifiers) need explicit redaction via `maskCapturedNetworkRequestFn`, which runs against both network-request capture AND the captured page URL:

```javascript
posthog.init('<ph_project_token>', {
  session_recording: {
    maskCapturedNetworkRequestFn: (request) => {
      if (request.name) {
        request.name = request.name.replace(/([?&](token|auth|email)=)[^&]+/g, '$1[REDACTED]')
      }
      return request
    },
  },
})
```

Runs in-browser, so redacted values never leave the device.

### Common config presets (from official docs)

- **Maximum privacy** (mask everything): `{ maskAllInputs: true, maskTextSelector: "*" }`
- **Limited privacy** (heuristically mask email/password-shaped content only): mask inputs of `type`/`id` in `['email', 'password']`, plus a `maskTextFn` regex for email-shaped text. Note: "show password" toggles switch `type` to `text`, so check `id` too, not just `type='password'`.
- **Selective privacy** (deny-by-default, allow-list safe fields): `maskAllInputs: true, maskTextSelector: "*"`, then a `maskTextFn`/`maskInputFn` that only reveals elements explicitly flagged safe via a data attribute (e.g. `data-record="true"`).
- **Third-party embeds that can't be masked** (payment forms, auth screens): manually stop/start the recording around that UI instead of relying on selector-based masking.

### Data-collection framing (what session replay captures by default)

Per the controlling-data-collection doc's feature/data table: Session replay captures "Clicks, mouse movements, scrolling, and snapshots of the DOM." "Private by default" recommendation for genuinely sensitive apps: mask all inputs and text globally, then selectively unmask only what's explicitly needed.

### Cost implications (official pricing page)

| Recording volume/month | Web price | Mobile price |
| --- | --- | --- |
| First 5,000 (web) / 2,500 (mobile) | Free | Free |
| Next tier (5k-15k web / 2.5k-15k mobile) | $0.0050/recording | $0.0100/recording |
| 15k-50k | $0.0035/recording | $0.0070/recording |
| 50k-150k | $0.0020/recording | $0.0040/recording |
| 150k-500k | $0.0017/recording | $0.0034/recording |
| 500k+ | $0.0015/recording | $0.0030/recording |

Web and mobile replay are billed separately, each with its own free tier. Pricing decreases with volume (as low as $0.0015/recording at scale). No hard cap on total recordings captured on paid tiers - cost simply scales.

Cross-reference to reverse-proxy raw file: session recordings are called out repeatedly across PostHog's own proxy docs as "the biggest driver" of proxy data-transfer cost on platforms like Vercel that bill egress/Fast Data Transfer, "often 1-5 MB per session," and can "consume a plan quickly on high-traffic sites" - session replay is simultaneously a product cost (per-recording billing) and, if proxied through your own infrastructure, a bandwidth cost.

### Comparison framing (PostHog's own "choose a competitor if" list)

PostHog's own marketing explicitly concedes two legitimate reasons to pick a different tool: "You want self-hosting or more strict data residency" and "You have strong security requirements that require more robust PII redaction." Worth surfacing to a user weighing session replay against a stricter-redaction competitor rather than silently assuming PostHog masking is always sufficient for a given compliance bar.
