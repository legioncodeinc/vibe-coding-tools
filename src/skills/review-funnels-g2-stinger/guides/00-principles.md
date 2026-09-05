# Principles: review-funnels-g2-stinger

## The policy-first principle

Platform policies change. Tactical advice built on top of a misread policy leads to account suspension, removed reviews, or FTC exposure. Every recommendation from this Stinger flows policy-first:

1. Confirm the current policy applies (platforms update rules; citations age out).
2. Check compliance before proposing the tactic.
3. Propose a compliant alternative if the user's first idea fails the compliance check.

The canonical G2 policy source (as of 2026) is: `https://sell.g2.com/review-validity`
The canonical FTC source: `https://www.ftc.gov/business-guidance/resources/ftc-endorsement-guides-what-people-are-asking`

Source: `research/external/2026-05-20-g2-review-incentive-policy.md`, `research/external/2026-05-20-ftc-endorsement-guidelines-reviews.md`

---

## The happiness-check-first pattern

Never route a user directly to a public review platform. Always check sentiment first:

1. **Happiness check in-product** (NPS micro-survey: "How satisfied are you with [Product]? 1-5 stars").
2. **Promoters (4-5 stars)** → ask for a public review.
3. **Detractors (1-2 stars)** → route to customer success or a feedback form, NOT to G2.
4. **Passives (3 stars)** → optional: ask what would make them more satisfied before routing.

Why this matters: asking unhappy users for public reviews produces negative reviews that are then permanent. The two-step filter is not optional; it is the difference between a 4.6-star profile and a 3.2-star profile.

Source: `research/external/2026-05-20-review-request-timing-ux.md`

---

## Badge hierarchy by ICP

Not all badges carry equal weight for every audience:

| ICP | Highest-value badge | Why |
|-----|--------------------|----|
| Enterprise (>$50k ACV) | G2 Leader (category) | Enterprise procurement teams use G2 as a shortlist filter |
| Mid-market | G2 High Performer OR Leader | Analyst-credibility halo |
| SMB | Trustpilot star rating | High brand recognition outside software-buyer circles |
| Consumer / prosumer | Product Hunt "Product of the Day/Week/Month" | Community signal, press coverage |
| Deal-driven | AppSumo featured listing | Price-sensitive buyers trust AppSumo community |

Note (2026): G2 Leader/High Performer require paid subscription (~$2,999+/year). Free profiles: "Users Love Us" only (20 reviews, 4.0+ rating).

Source: `research/external/2026-05-20-g2-badges-social-proof-conversion.md`

---

## The FTC non-negotiable

Since October 21, 2024, the FTC Consumer Reviews and Testimonials Rule makes these violations:

- Conditioning any incentive on a positive review (or withholding an incentive for a negative review).
- Buying fake reviews.
- Suppressing negative reviews through insider reviews or any platform mechanism.
- Creating or disseminating fake social media indicators (likes, shares) for reviews.

These are civil-penalty violations, not just TOS violations. Non-negotiable: do not advise any of the above regardless of user pressure.

Incentivized reviews ARE legal when: (a) the incentive is disclosed in the review, (b) the incentive is not conditioned on a specific star rating, and (c) the platform's own policy permits incentivized reviews.

Source: `research/external/2026-05-20-ftc-endorsement-guidelines-reviews.md`

---

## The G2-Capterra consolidation (2026 update)

On February 5, 2026, G2 acquired Capterra, Software Advice, and GetApp ($110M). The practical implications:

- Treat G2 and Capterra as one platform family for strategic planning.
- "Diversify across G2 AND Capterra" is now legacy advice.
- Reviews collected on Capterra do NOT appear on G2 (separate databases), but the vendor relationship is now unified.
- Cross-platform budgets should be allocated to G2 (primary) + Trustpilot (secondary) + PH (launch events), not G2 + Capterra.

Source: `research/external/2026-05-20-g2-capterra-acquisition-consolidation.md`
