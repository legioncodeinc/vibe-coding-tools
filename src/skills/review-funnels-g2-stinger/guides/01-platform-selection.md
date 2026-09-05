# Platform Selection: review-funnels-g2-stinger

## Decision matrix

Use this matrix to prioritize platforms for a new SaaS product. Score each relevant axis, then pick the top 2-3 platforms.

| Platform | Best for | Buyer profile | Free tier | Trust with Enterprise | AI citation weight |
|----------|----------|--------------|-----------|----------------------|-------------------|
| **G2** | B2B software, all segments | Software buyers, IT, Finance | Yes (limited badges) | Very High | High |
| **Capterra** | SMB, broad vertical coverage | SMB buyers, non-technical | Yes | Medium | Medium |
| **Trustpilot** | Consumer, transactional SaaS | General consumers, SMB | Yes | Low (brand awareness) | High |
| **Product Hunt** | Launch amplification, developer tools | Developers, early adopters | Free to post | Low | Medium |
| **AppSumo** | Deal-driven customer acquisition | SMB, bootstrapped buyers | Requires listing | Low | Low |
| **Software Advice** | Enterprise-adjacent, Gartner context | Enterprise procurement | Vendor-managed | Medium | Medium |

**2026 note:** G2 acquired Capterra, Software Advice, and GetApp. Capterra and Software Advice are now G2-family. Treat as one vendor relationship but separate databases/audiences.

Source: `research/external/2026-05-20-g2-capterra-trustpilot-platform-strategy.md`, `research/external/2026-05-20-g2-capterra-acquisition-consolidation.md`

---

## Recommended prioritization by stage

### Pre-launch / 0-10 customers
- Do nothing yet. Soliciting reviews at this stage produces a thin profile that looks worse than no profile.
- Exception: Product Hunt launch is appropriate at launch day itself.

### Early traction (10-50 customers)
1. **G2** -- claim the profile, complete it fully, begin seeding first 5-10 reviews from highest-NPS customers.
2. **Trustpilot** -- if your ICP includes SMB or consumer, claim the profile to own the brand search result.

### Growth (50-200 customers)
1. G2 (primary) -- build to 20+ reviews to qualify for "Users Love Us" badge and trigger quarterly badge window.
2. Consider Capterra only if you have a strong SMB motion and want the Gartner Digital Markets SEO footprint (separate from G2 despite same owner).

### Scale (200+ customers)
1. G2 (paid) -- if enterprise pipeline is real, invest in G2 Marketing Solutions for Leader/High Performer badge access.
2. Trustpilot -- automate review collection if volume warrants.
3. Software Advice -- useful for Gartner Magic Quadrant adjacency.

---

## G2 profile setup checklist

Complete ALL of these before soliciting a single review:

- [ ] Claim the profile at https://sell.g2.com
- [ ] Add company logo (400x400 min, transparent PNG preferred)
- [ ] Write product description (500-1000 words, benefit-oriented, keyword-rich)
- [ ] Add product screenshots (5-10, showing core UI, not onboarding flows)
- [ ] Select correct primary category (affects ranking and badge eligibility)
- [ ] Add secondary categories if applicable (max 3)
- [ ] List all competitors in the "Compare" section (improves discovery)
- [ ] Add pricing page URL and pricing model
- [ ] Set the review profile URL to match your product name
- [ ] Connect a verified business email for profile management
- [ ] Download and configure the G2 review widget for your website

An incomplete profile signals low effort to buyers. A competitor with a 3.9 rating on a complete profile often outranks you at 4.5 on a sparse one.

---

## Trustpilot profile setup checklist

- [ ] Claim the profile at https://www.trustpilot.com/businesses
- [ ] Verify domain ownership
- [ ] Add business description and categories
- [ ] Configure review invitation settings (email domain whitelist)
- [ ] Set auto-response template for new reviews (free plan)
- [ ] Note: bulk invitation API and scheduled review collection require paid plan (~$300+/month)

---

## Product Hunt listing setup

See `guides/04-product-hunt-launch.md` for the full playbook. Pre-launch checklist:

- [ ] Create a Maker account (distinct from Hunter account)
- [ ] Identify a Hunter with 1,000+ followers or an existing "hunted" track record
- [ ] Prepare gallery (product name, tagline ≤60 chars, thumbnail 240x240, gallery images 1270x760)
- [ ] Draft the "first comment" from the Maker (authentic, personal, explains origin story)
- [ ] Schedule: select a Tuesday-Thursday for maximum upvote potential; avoid Mondays and Fridays

Source: `research/external/2026-05-20-product-hunt-launch-playbook.md`
