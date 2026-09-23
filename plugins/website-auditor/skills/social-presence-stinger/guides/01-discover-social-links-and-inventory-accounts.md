# Guide 01: Discover social links and inventory accounts

## What this guide covers

Locating the target's Facebook, LinkedIn, and Instagram presence before any per-platform work begins.

## Procedure

1. Read `02-positioning/` for on-site social links, per this pair's shared workspace contract (prd-017-social-presence). This is the primary discovery path: footer/header links, contact pages, and structured data (schema.org `sameAs`, Open Graph tags) already surfaced by upstream Drones.
2. Treat "not found via on-site links" as provisional, not final. Per the account-inventory discipline named in the research, search each network for the brand name directly to surface accounts the site itself doesn't link to, forgotten accounts, rogue accounts, or imposter accounts [raw/blog-hootsuite-com-social-media-audit.md].
3. Record, for each of the three platforms, exactly one of three states before doing anything else:
   - **Found, active.** A profile/page exists and shows visible activity.
   - **Found, dormant.** A profile/page exists but is empty or shows no meaningful recent activity.
   - **Not found.** No account could be located for this brand on this platform, by either method above.
4. This three-way distinction is load-bearing for scoring, not a cosmetic label. Per build plan Q7: found-but-dormant scores as a finding (it's evidence of neglect, not absence), while not-found is a no-op, excluded from the score entirely. Do not conflate these into one "no presence" bucket.
5. Write the discovery result for all three platforms to `references/templates/platform-profile-checklist.md`'s header block before proceeding to guide 02, even for not-found platforms (a documented not-found is different from a platform this Drone simply never checked).

## Common failure this guide prevents

Scoring a not-found platform as a low score ("no LinkedIn presence: score 1"). That is exactly the failure PRD-017's AC-2 exists to prevent: a not-found platform is excluded from both numerator and denominator, never scored as a failure. Only a found-but-empty profile is a legitimate low score.
