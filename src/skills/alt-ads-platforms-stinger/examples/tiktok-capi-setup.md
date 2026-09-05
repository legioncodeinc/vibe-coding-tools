# Example: TikTok CAPI Setup for a D2C Brand

**Demonstrates:** `guides/12-capi-wiring.md` TikTok CAPI section and `guides/03-tiktok-ads.md` CAPI requirement.

---

## Scenario

**Company:** Hypothetical D2C skincare brand.
**Platform:** Shopify.
**Goal:** Set up TikTok CAPI alongside pixel for accurate purchase event attribution.
**Current state:** TikTok pixel is installed but Conversions API is not set up. CPLs look inflated due to iOS 14.5 signal loss.

---

## Path 1: No-code setup via TikTok Shopify App (recommended)

The TikTok Shopify app handles both pixel and CAPI installation automatically. This is the fastest path for Shopify merchants.

1. Go to Shopify App Store → Install "TikTok" app.
2. In the app settings, connect your TikTok Ads account.
3. Enable "TikTok Pixel" — this installs both the browser pixel AND the CAPI connection automatically.
4. Verify in TikTok Ads Manager → Events → Web Events that both "Browser pixel" and "Server-side API" events are showing.
5. Check that "Purchase" events show two sources: "pixel" and "API (server)" with matching counts (small discrepancies are normal; identical counts mean deduplication is working).

**Verification:** In TikTok Ads Manager, go to Assets → Events → your pixel → Event Details. You should see both "Browser" and "Server API" sources listed for Purchase events.

---

## Path 2: Manual CAPI implementation (no Shopify, or custom stack)

For non-Shopify platforms or custom implementations.

### Step 1: Install the TikTok Pixel (browser)

Add to your website `<head>`:

```javascript
<!-- TikTok Pixel Code -->
<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
  // ... TikTok pixel base code ...
  ttq.load('YOUR_PIXEL_ID');
  ttq.page();
}(window, document, 'ttq');
</script>
```

Fire conversion events from the browser:

```javascript
// Purchase event (browser)
ttq.track('Purchase', {
  content_type: 'product',
  value: 49.99,
  currency: 'USD',
  event_id: 'order_12345'  // REQUIRED for deduplication — must match CAPI event_id
});
```

### Step 2: Send the CAPI event from your server

On your server (Node.js example), send a POST to the TikTok Events API:

```javascript
const axios = require('axios');
const crypto = require('crypto');

// SHA-256 hash user data — REQUIRED
function sha256(data) {
  return crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
}

async function sendTikTokCAPIEvent(order) {
  const payload = {
    pixel_code: 'YOUR_PIXEL_ID',
    event: 'Purchase',
    event_time: Math.floor(Date.now() / 1000),
    event_id: `order_${order.id}`,  // MUST match browser pixel event_id
    properties: {
      value: order.total,
      currency: 'USD',
      content_type: 'product',
    },
    user: {
      email: sha256(order.customerEmail),  // SHA-256 hashed — REQUIRED
      // phone: sha256(order.phone),        // optional but improves match rate
    },
    page: {
      url: 'https://yourstore.com/checkout/confirmation',
    }
  };

  await axios.post(
    'https://business-api.tiktok.com/open_api/v1.3/event/track/',
    { data: [payload] },
    {
      headers: {
        'Access-Token': process.env.TIKTOK_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      }
    }
  );
}
```

### Step 3: Verify with test events

Before going live, add `test_event_code` to your CAPI payload:

```javascript
const payload = {
  pixel_code: 'YOUR_PIXEL_ID',
  test_event_code: 'YOUR_TEST_CODE',  // Get from TikTok Ads Manager > Events > Test Events
  // ... rest of payload
};
```

Check that test events appear in TikTok Ads Manager → Events → Test Events within 30 seconds of sending.

### Step 4: Remove test_event_code and deploy

Remove `test_event_code` from production code. Deploy. Monitor in TikTok Ads Manager → Events → Real-Time Events to confirm live CAPI events are flowing.

---

## Common errors and fixes

| Error | Cause | Fix |
|---|---|---|
| Conversion counts doubled | `event_id` missing or not matching between pixel and CAPI | Ensure `event_id` is set in both pixel `ttq.track()` and CAPI payload, and the values match exactly |
| CAPI call returns 401 | Expired or incorrect Access Token | Regenerate Access Token in TikTok Ads Manager → Assets → Events API |
| User data rejected | Email/phone not SHA-256 hashed | Hash with `crypto.createHash('sha256')` before sending; hashing is mandatory |
| Test events not appearing | `test_event_code` typo or wrong pixel | Copy test code directly from TikTok Ads Manager Test Events tab |
| "No conversion data" in Smart+ | Learning phase requires 50+ conversions in 7 days | Ensure total conversion volume is high enough; Smart+ cannot learn below $50/day |
