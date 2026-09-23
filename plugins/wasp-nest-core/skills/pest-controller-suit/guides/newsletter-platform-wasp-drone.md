# newsletter-platform-wasp-drone

## Domain
This Drone owns newsletter platform selection and email list strategy for product builders across Beehiiv, Kit (ConvertKit), Loops, Substack, Ghost, and Resend Audiences. It covers embedded signup integration for Next.js, list segmentation, platform migration including paid-subscriber Stripe transfer, the four-stream monetization stack (ad network, boosts, paid subscriptions, direct sponsorships), and the deliverability tradeoff between managed SaaS and self-hosted. Every recommendation names a concrete feature tied to the user's specific goal and states one honest limitation of the chosen platform.

## Paired Stinger
[newsletter-platform-stinger](../../newsletter-platform-stinger) - the platform decision matrix by use case and subscriber count, the embedded-signup cookbook, deliverability fundamentals per platform, the monetization revenue-stream map, and the Substack-to-Beehiiv migration checklist.

## Trigger phrases
- "which newsletter platform should I use"
- "embed a newsletter signup"
- "migrate from Substack to Beehiiv"
- "how do I monetize my newsletter"
- "Beehiiv vs Loops vs Kit"
- "self-hosted newsletter"
- "set up Beehiiv"
- "self-hosted newsletter deliverability"

## Do NOT route when
- The task is transactional email infrastructure: route to the `resend` tooling; a newsletter platform and transactional sending share no infrastructure.
- The task is SPF/DKIM/DMARC DNS setup at the infrastructure level: that is `devops-wasp-drone`.
- The task is custom Stripe billing built on top of a newsletter platform's paid tiers: that is `payments-wasp-drone`; platform-native paid tiers stay in scope here.
- The task is organic-search content strategy or keyword research: that is `seo-aeo-wasp-drone`.
- The user asks about a platform outside the six covered (for example Mailchimp, ActiveCampaign, Klaviyo): answer from general knowledge and flag that the research does not cover it.

## Inputs the Drone needs
- The primary goal: building a newsletter audience versus SaaS product email
- The monetization vector, if any: ads and sponsorships, digital products, or none
- The current subscriber count, since the optimal platform at 500 subscribers differs from 50,000
- Whether a migration is in play, and if so, whether paid Stripe subscribers must transfer and Substack billing must pause before cutover
- Whether the deliverability question points toward a managed SaaS platform or a self-hosted stack, since the operational cost differs sharply

## Outputs
- A platform recommendation naming the specific feature (ad network CPM, API depth, referral program) tied to the user's goal, plus one concrete limitation
- A Next.js API-route-handler signup integration with source-attribution tracking as the default pattern
- A migration checklist with domain verification and Stripe transfer ordered before list import and cutover
- A monetization walkthrough following the four-stream order: ad network, boosts, paid subscriptions, direct sponsorships
- A deliverability recommendation naming the operational cost of any self-hosted path
- A clear distinction between the newsletter platform and any transactional email infrastructure already in use

## Commonly sequenced with
- `devops-wasp-drone` alongside: handles the SPF/DKIM/DMARC DNS records this Drone's deliverability guidance depends on
- `payments-wasp-drone` alongside, never merged: custom Stripe billing on top of platform-native paid tiers stays a separate concern
- `seo-aeo-wasp-drone` alongside: when newsletter content also needs organic-search strategy beyond list growth
- `knowledge-base-help-center-wasp-drone` alongside: when newsletter content and help-center articles need shared distribution
