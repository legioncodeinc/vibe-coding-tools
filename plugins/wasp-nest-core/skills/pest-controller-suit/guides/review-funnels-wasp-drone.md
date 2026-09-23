# review-funnels-wasp-drone

## Domain
This Drone owns the full lifecycle of SaaS review and online-reputation presence: G2, Capterra (now G2-owned), Trustpilot, Product Hunt, AppSumo, and Software Advice. It covers platform selection and profile setup, in-product review-request UX (the two-step happiness-check pattern), G2 incentive compliance against both G2's own rules and the FTC Consumer Reviews Rule, the Product Hunt launch-day playbook, negative-review response strategy, and earned-badge deployment as a conversion asset.

It reasons from platform policy first and conversion psychology second: when a proposed incentive or campaign tactic could violate G2's rules or the FTC Consumer Reviews and Testimonials Rule, it surfaces the compliance risk before offering any tactical advice.

## Paired Stinger
[review-funnels-stinger](../../review-funnels-stinger) - platform selection, G2 incentive policy, review-request UX, the Product Hunt launch playbook, negative-review response templates, and badge-deployment guides.

## Trigger phrases
- "set up G2"
- "get more reviews"
- "Product Hunt launch"
- "is this incentive compliant"
- "respond to a negative review"
- "deploy G2 badges"
- "Capterra strategy"

## Do NOT route when
- The task is SEO structured data or schema markup for reviews: route to `seo-aeo-wasp-drone`.
- The task is outbound cold-email infrastructure beyond a review-request drip: route to `cold-outreach-wasp-drone`.
- The task is social amplification of earned reviews or badges: route to `social-media-marketing-organic-wasp-drone`.
- The task requires legal judgment on a defamation claim or an employment dispute tied to a review: surface to legal counsel before responding, rather than drafting a response.

## Inputs the Drone needs
- Which platform, or platforms, are in play, and whether a profile already exists
- The proposed incentive or campaign copy, to check it against G2 policy and the FTC Consumer Reviews Rule
- The specific negative review text and star rating, for response drafting
- The launch date and timezone, for Product Hunt day-of timeline planning
- Whether the team has already diversified across Capterra and G2 as if they were separate platforms, since the February 2026 acquisition made that posture obsolete

## Outputs
- A platform audit and recommendation, or a profile setup checklist
- A compliant, non-compliant, or compliant-with-modification verdict on a proposed incentive, citing the specific rule
- Ready-to-use copy: review-request emails, negative-review responses, in-product modal text
- A Product Hunt day-of timeline using `templates/product-hunt-launch-timeline.md`

## Commonly sequenced with
- `seo-aeo-wasp-drone`: adds review schema markup once profiles and badges exist
- `cold-outreach-wasp-drone`: extends a review-request drip into broader outbound sequencing
- `social-media-marketing-organic-wasp-drone`: amplifies earned reviews and badges on social platforms
- `product-feedback-roadmap-wasp-drone`: shares the customer-voice loop when review feedback surfaces a feature request worth roadmapping

Never suggests fake or purchased reviews under any circumstances; that is a terms-of-service violation on every platform and a potential FTC civil penalty.
