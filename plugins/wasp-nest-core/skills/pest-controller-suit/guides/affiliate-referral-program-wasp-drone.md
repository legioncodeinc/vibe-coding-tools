# affiliate-referral-program-wasp-drone

## Domain
This Drone owns affiliate and referral program selection, configuration, attribution architecture, payout design, and fraud mitigation for SaaS products. It distinguishes affiliate programs (third-party publishers driving traffic, EPC-driven) from referral programs (existing customers recommending peers, invite-link-driven), recommends a platform tier matched to product maturity and budget (Rewardful, FirstPromoter, Tolt for SMB; PartnerStack, Impact for enterprise), designs the attribution model (cookie-based vs server-side vs S2S postback given Safari ITP and Firefox ETP), configures commission and payout rules, and wires the fraud-detection controls a program needs before its first commission runs.

## Paired Stinger
[affiliate-referral-program-stinger](../../affiliate-referral-program-stinger) - the platform decision matrix, attribution architecture, payout design, fraud detection thresholds, and program economics model this Drone applies.

## Trigger phrases
- "set up an affiliate program"
- "which affiliate platform should I use"
- "Rewardful vs FirstPromoter"
- "my attribution is broken in Safari"
- "referral program fraud"
- "EPC or LTV for our program"
- "20% recurring commission"
- "postback tracking setup"
- "PartnerStack vs FirstPromoter"

## Do NOT route when
- The task is Stripe subscription billing mechanics unrelated to affiliate payouts: that is `payments-wasp-drone`'s domain, not this Drone's program-economics layer.
- The task is API key or secret storage hardening for the chosen platform: that is `security-wasp-drone`'s domain; this Drone flags the need but does not audit secret handling.
- The task is designing a custom attribution database schema from scratch: that is `db-wasp-drone`'s domain; this Drone consults on field requirements but does not author the schema.
- The task is outbound recruitment campaigns to sign up new affiliates: that is `cold-outreach-wasp-drone`'s domain, not program configuration.

## Inputs the Drone needs
- Whether the request is an affiliate program or a referral program, and the product's Stripe plan, team size, budget, and compliance posture
- The cookie duration and attribution method currently in use, and whether Safari/Firefox traffic share matters for the program
- The desired commission structure (percentage vs flat, recurring vs one-time) and the refund-window hold period
- Program scale (affiliate count, monthly commission volume) to size the fraud-detection layer
- Whether the target billing system is Stripe, Paddle, Chargebee, or Recurly, since platform compatibility varies

## Outputs
- A ranked platform shortlist with break-even rationale between tiers
- An attribution model recommendation disclosing ITP and Firefox ETP risk explicitly
- A payout rule spec covering commission type, hold period, and 1099/W-9 and GDPR obligations
- A fraud-detection control list (self-referral, velocity, disposable-email checks) and an EPC/LTV economics model
- A structured program-configuration spec naming any required handoffs

## Commonly sequenced with
- `payments-wasp-drone`: implements Stripe Express payout mechanics once this Drone specifies the payout rules
- `security-wasp-drone`: audits API key handling and secret storage for the chosen platform integration
- `db-wasp-drone`: designs any custom attribution or tracking schema this Drone specifies fields for
- `cold-outreach-wasp-drone`: runs the outbound campaign that recruits affiliates once the program is configured
- `library-wasp-drone`: authors the PRD for a program the user wants designed from scratch beyond this Drone's audit-and-configure scope
