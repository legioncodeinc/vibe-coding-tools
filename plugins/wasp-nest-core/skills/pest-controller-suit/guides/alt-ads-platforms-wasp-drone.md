# alt-ads-platforms-wasp-drone

## Domain
This Drone owns paid acquisition across ten platforms beyond Meta and Google Search: LinkedIn Ads (B2B Lead Gen Forms, Thought Leader Ads, ABM), TikTok Ads (Smart+, CAPI), Reddit Ads (community targeting), Microsoft/Bing Ads (LinkedIn Profile Targeting), Pinterest Ads (Shopping Catalogs), Quora Ads (comparison-intent B2B), YouTube standalone video, Spotify Ad Studio and podcast advertising, and the channel-fit-by-ICP heuristic that selects among them. It is diagnosis-first: it always scores channel fit against the product's ICP before any campaign setup, and it will say a platform is wrong for the ICP rather than optimize execution on the wrong channel.

## Paired Stinger
[alt-ads-platforms-stinger](../../alt-ads-platforms-stinger) - the channel-fit scoring matrix, minimum-viable-spend thresholds, per-platform campaign architecture, and CAPI wiring guides this Drone applies.

## Trigger phrases
- "which ad platform beyond Meta/Google for my ICP"
- "set up LinkedIn Ads for B2B SaaS"
- "TikTok CAPI setup"
- "Reddit Ads for developers"
- "Microsoft Ads LinkedIn targeting"
- "podcast advertising on Spotify"
- "channel diversification for paid acquisition"
- "our Meta CPL is too high"

## Do NOT route when
- The task is Meta, Facebook, or Instagram Ads: no peer Drone owns this today; handle inline or flag the gap rather than misrouting.
- The task is Google Search Ads: no peer Drone owns this today; handle inline or flag the gap.
- The task is organic social posting or content strategy: that is `social-media-marketing-organic-wasp-drone`'s domain, not paid acquisition.
- The task is CRM schema design for ad-lead attribution: that is `db-wasp-drone`'s domain; this Drone specifies fields only.
- The task is writing the analytics pixel or conversion tag code in a React/Next.js codebase: that is `react-wasp-drone`'s domain; this Drone specifies what to implement.
- The task is a GDPR/CCPA compliance audit of tracking pixels: that is `security-wasp-drone`'s domain; this Drone flags the risk and routes.

## Inputs the Drone needs
- The product's ICP (industry, company size, title, buying trigger) and current channel performance or CPL
- Monthly budget, checked against each candidate platform's minimum viable spend threshold
- Creative assets available and the team's capacity to run more than one channel at full optimization cadence
- Conversion tracking maturity: whether a browser pixel alone is in place or dual pixel plus CAPI is already wired
- Whether the request touches Meta or Google Search specifically, since neither has a peer Drone today

## Outputs
- A ranked channel stack (primary, test, hold) from the ICP-to-platform scoring matrix
- Campaign architecture per selected channel: objectives, audience layers, bid strategy, budget pacing
- A creative specs table and a dual pixel plus CAPI wiring spec for TikTok, LinkedIn, and Microsoft/Bing
- A per-platform launch checklist and a 60-day success metrics framework with scale, pivot, or kill criteria

## Commonly sequenced with
- `social-media-marketing-organic-wasp-drone`: owns the organic strategy layer this Drone's paid channels complement
- `db-wasp-drone`: designs the lead-tracking schema this Drone specifies fields for
- `react-wasp-drone`: implements the analytics pixel or conversion tag code this Drone specifies
- `security-wasp-drone`: audits GDPR/CCPA compliance for the tracking pixels this Drone wires
- `cold-outreach-wasp-drone`: runs the outbound sequence that follows up on leads this Drone's campaigns capture
