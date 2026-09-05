# G2 Incentive Policy: review-funnels-g2-stinger

## Current canonical sources (2026)

- G2 review validity page: https://sell.g2.com/review-validity (the command brief's original URL was a 404; this is the updated canonical)
- FTC Consumer Reviews and Testimonials Rule: https://www.ftc.gov/business-guidance/resources/ftc-endorsement-guides-what-people-are-asking (effective October 21, 2024)

> **Critical:** The original command brief URL `https://sell.g2.com/resources/what-are-the-rules-for-collecting-reviews-on-g2` returns a 404 as of May 2026. Always link to the current page above.

Source: `research/external/2026-05-20-g2-review-incentive-policy.md`, `research/external/2026-05-20-ftc-endorsement-guidelines-reviews.md`

---

## What G2 allows (incentivized reviews)

G2 permits incentivized reviews under these conditions:

1. **Disclosure is required.** The reviewer must disclose in the review body that they received an incentive (gift card, swag, product credit, etc.).
2. **The incentive must be non-conditional.** You may NOT tell reviewers "you'll only receive the gift card if you leave a 4-star or higher review." The incentive must be offered regardless of star rating.
3. **Incentive must be modest and uniform.** Wildly different incentive values for different review star ratings is a policy red flag.
4. **G2's own incentive program is the safest path.** G2 offers a certified incentive workflow through their platform. Using this workflow handles disclosure automatically and keeps the reviews "incentivized-compliant" in G2's moderation algorithm.

## What G2 prohibits

- Reviews from current or former employees of the vendor (or their immediate family).
- Reviews from users who received free licenses purely in exchange for a review with no production use of the product.
- Reviews submitted on behalf of another person.
- Reviews conditioned on a specific star rating.
- Bulk review generation through automated scripts.

---

## FTC Consumer Reviews and Testimonials Rule (Oct 2024) — key provisions

This rule applies to US-based businesses and any business marketing to US consumers.

**Prohibited:**
- Conditioning an incentive on a positive review or a specific star rating (civil penalty risk).
- Suppressing negative reviews through legal threats, NDAs, or intimidation.
- Buying fake reviews from any source (review farms, freelancers, etc.).
- Using "insider reviews" (reviews from employees or company affiliates without disclosure).
- Disseminating fake social proof signals.

**Required:**
- Clear disclosure when a reviewer received material compensation (defined broadly: cash, gift cards, free products, discounts, contest entries, etc.).
- The disclosure must be in the review itself or in close proximity to the review display; a footnote on a remote page is insufficient.

**Safe approach:**
```
Disclosure language to include in review-request copy:
"If you complete a review, we'll send you a $10 Amazon gift card as a thank-you, 
regardless of your rating. Please mention in your review that you received this 
incentive, as required by G2's policy and FTC guidelines."
```

---

## Incentive compliance decision tree

```
User proposes a reward for reviews
          |
          v
Is the incentive conditioned on star rating?
  YES → Non-compliant. Revise to remove conditioning.
  NO  → Continue
          |
          v
Does the proposed reward require disclosure (G2 policy, FTC rule)?
  YES → Add disclosure requirement to review-request copy.
  NO  → Continue (e.g., purely thank-you swag with no cash value threshold)
          |
          v
Is the reward a gift card via a third-party platform (Sendoso, Reachdesk)?
  UNKNOWN → Flag to user; manual check at 
            https://documentation.g2.com/help/docs/understanding-gift-card-eligibility
  YES, confirmed → Follow G2 certified incentive workflow + disclose.
          |
          v
COMPLIANT: Proceed with review campaign.
```

---

## Required disclosure language (copy-ready)

**In review-request email body:**
> "As a thank-you for your time, we'll send you a [reward] after you complete your review. Please note: this is offered regardless of your star rating, and G2 and FTC guidelines require that you disclose receiving this in your review."

**Disclosure prompt for reviewer to copy into review:**
> "Full disclosure: I received a [reward] as a thank-you for completing this review, offered unconditionally regardless of my rating."

---

## Incentive types by risk level

| Incentive type | G2 risk | FTC risk | Recommendation |
|---------------|---------|---------|---------------|
| Gift card ($10-$25) via G2 certified program | Low | Low (disclose) | Preferred |
| Gift card via Sendoso/Reachdesk | Unknown | Low (disclose) | Verify with G2 first |
| Free product month | Medium (if product-only) | Low (disclose) | OK if genuine usage exists |
| Swag (branded items, <$25 value) | Low | Low | OK with disclosure |
| Discounts on future renewals | Medium | Low (disclose) | OK if not conditioned on rating |
| Contest entry | Low | Low (disclose) | OK |
| Cash payment | High | High | Avoid; looks like bought reviews |
| Free license for review-only users | High | High | Prohibited by G2 |
