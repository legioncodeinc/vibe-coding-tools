# Badge Deployment: review-funnels-g2-stinger

## Badge taxonomy (2026)

### G2 badges

| Badge | Eligibility | Paid required? | Awarded |
|-------|------------|---------------|---------|
| Users Love Us | 20+ reviews, 4.0+ rating | No (free) | Rolling (any time you qualify) |
| Leader | Top 25% of products by satisfaction + market presence | Yes (~$2,999+/yr) | Quarterly (Feb, May, Aug, Nov) |
| High Performer | Top 25% by satisfaction within small market presence tier | Yes | Quarterly |
| Best Support | Top 25% by support satisfaction score | Yes | Quarterly |
| Easiest to Use | Top 25% by ease-of-use score | Yes | Quarterly |
| Fastest Implementation | Top 25% by go-live time | Yes | Quarterly |
| Most Implementable | Top 25% by implementation satisfaction | Yes | Quarterly |

**2025 policy change (Summer 2025):** Report-based badges (Leader, High Performer, etc.) now require a paid G2 Marketing Solutions subscription. Free-tier vendors can only display "Users Love Us."

Source: `research/external/2026-05-20-g2-badges-social-proof-conversion.md`

### Trustpilot badge
- TrustScore (1-5 stars aggregate): free to embed via Trustpilot widget script.
- "Trustpilot Verified" seal: free to display if you have a verified business profile.

### Product Hunt badges
- "Featured on Product Hunt": available to any product that was featured on the daily leaderboard.
- "Product of the Day" / "Product of the Week" / "Product of the Month": awarded by PH after the fact; download from your Maker dashboard.
- These are static image assets; no embed script required.

---

## Conversion placement guide

Where to place badges for maximum conversion lift:

| Page | Recommended badges | Placement |
|------|-------------------|-----------|
| Marketing homepage | G2 Leader / High Performer (if paid), "Users Love Us" (free), Trustpilot stars | Hero section or above fold; "as seen in" row |
| Pricing page | G2 Leader / High Performer, specific feature badges (Best Support, Easiest to Use) | Between plan tiers; near the CTA |
| Product Hunt launch | "Featured on Product Hunt" | Day of launch: homepage, email signature, social posts |
| In-product upgrade prompts | G2 "Users Love Us" badge | Near upsell CTA for social validation |
| Email marketing (campaign) | Trustpilot stars widget or inline badge image | Footer or near CTA |
| Email signature (founder / CSM) | G2 badge image link | After name/title |
| Sales deck / pitch | Leader or High Performer badge | Credibility slide near team/traction section |
| Review platforms | Do not link to other platforms in reviews | Cross-promotion violates platform TOS |

---

## Embed options

### G2 widget (dynamic)
Embed via JavaScript snippet from G2's vendor portal. Updates automatically as your rating changes. Available on paid G2 plans.

```html
<!-- Example G2 widget embed (obtain actual snippet from G2 vendor portal) -->
<div class="g2-widget" data-product-id="YOUR_PRODUCT_ID"></div>
<script src="https://www.g2.com/assets/embeds/widget.min.js" async></script>
```

### G2 static badge (free, "Users Love Us")
Download the PNG from G2 vendor portal. Link it to your G2 profile:
```html
<a href="https://www.g2.com/products/YOUR-PRODUCT/reviews" target="_blank">
  <img src="g2-users-love-us-badge.png" alt="Users Love Us on G2" width="80" />
</a>
```

### Trustpilot widget
TrustBox widget (dynamic stars). Requires Trustpilot business account:
```html
<!-- TrustBox widget - Review Collector -->
<div class="trustpilot-widget" data-locale="en-US" data-template-id="56278e9abfbbba0bdcd568bc" data-businessunit-id="YOUR_BU_ID">
  <a href="https://www.trustpilot.com/review/yourcompany.com" target="_blank" rel="noopener">Trustpilot</a>
</div>
<script type="text/javascript" src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" async></script>
```

### Product Hunt badge (static)
Download from your Maker dashboard post-launch. Link to your PH product page:
```html
<a href="https://www.producthunt.com/posts/YOUR-PRODUCT-SLUG" target="_blank">
  <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=YOUR_POST_ID&theme=light" 
       alt="Product Hunt - Product of the Day" width="200" height="54" />
</a>
```

---

## Badge refresh cadence

| Badge type | When to update |
|-----------|---------------|
| G2 Leader/High Performer | After each quarterly award (Feb, May, Aug, Nov) |
| G2 Users Love Us | Self-updating via widget; replace static image if you lose/regain eligibility |
| Trustpilot widget | Dynamic -- no manual update needed |
| Product Hunt | One-time; update to higher tier (Week > Month) if you win |

Source: `research/external/2026-05-20-g2-badges-social-proof-conversion.md`
