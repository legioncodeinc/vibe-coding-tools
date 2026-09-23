# Campaign Launch QA Checklist

Per-platform pre-launch quality assurance. Complete before flipping any campaign from Draft to Active.

---

## Universal (all platforms)

- [ ] UTM parameters on all destination URLs follow `templates/utm-naming-convention.md` schema.
- [ ] Conversion event fires correctly on the destination page (use browser dev tools to verify pixel event in network tab).
- [ ] Campaign naming matches convention in `guides/11-campaign-architecture.md`.
- [ ] Budget meets MVS threshold for this platform (see `guides/00-principles.md`).
- [ ] Daily budget set (not lifetime budget for ongoing campaigns).
- [ ] Campaign start date is set; end date is set ONLY for finite-budget test campaigns.
- [ ] At least 2 creative variants per ad group for A/B testing.

---

## LinkedIn Ads

- [ ] LinkedIn Insight Tag is installed and firing on all key pages.
- [ ] Conversion action created in Campaign Manager (Measure > Conversions).
- [ ] Lead Gen Form (if used): preview LGF in mobile and desktop view; confirm auto-fill fields are correct.
- [ ] LGF: connected CRM integration or webhook for lead notification is wired.
- [ ] Audience size is >50,000 (below this, LinkedIn may not deliver reliably).
- [ ] Company list (if ABM): CSV uploaded and matched (check match rate — below 30% match means list quality issue).
- [ ] Thought Leader Ad (if used): employee/founder approved the post boost.
- [ ] Frequency cap confirmed (≤4 impressions/member/day for sustained campaigns).
- [ ] CAPI setup verified (see OQ-1 note in `guides/02-linkedin-ads.md` — confirm CAPI access in Campaign Manager).

---

## TikTok Ads

- [ ] TikTok Pixel base code fires on all pages (check in TikTok Pixel Helper browser extension).
- [ ] Purchase/Lead event fires on conversion page.
- [ ] CAPI is set up alongside pixel (not pixel-only). See `guides/12-capi-wiring.md`.
- [ ] `event_id` deduplication key is populated in both pixel and CAPI events.
- [ ] SHA-256 hashing confirmed for email/phone fields in CAPI payload.
- [ ] Test events verified in TikTok Ads Manager > Events > Test Events before removing `test_event_code`.
- [ ] Smart+ campaign: daily budget ≥$50 (below this, learning phase will not complete).
- [ ] Creative: hook visible in first 1.5 seconds before sound (silent autoplay).
- [ ] Creative: 9:16 vertical format, max 60 seconds.
- [ ] Brand Safety settings configured (category exclusions if needed).

---

## Reddit Ads

- [ ] Reddit Pixel installed on website.
- [ ] Conversion event fires on target page (check via Reddit Pixel Helper).
- [ ] Subreddit targeting: minimum 2 relevant subreddits selected; each has ≥10K members.
- [ ] Promoted Post: title written in native Reddit voice (not ad copy).
- [ ] Landing page: content behind the link is genuinely useful (not a form above the fold on first scroll).
- [ ] Plan to respond to comments: at least one team member assigned to monitor and reply.
- [ ] Campaign budget ≥$1,000/month; daily minimum ≥$30.

---

## Microsoft/Bing Ads

- [ ] UET tag installed and verified via UET Tag Helper browser extension.
- [ ] Conversion Goal created (Tools > Conversion Tracking > Conversion Goals).
- [ ] Import from Google Ads completed (if applicable); bids reviewed post-import.
- [ ] LinkedIn Profile Targeting layer: dimensions configured (Company, Job Function, or Job Title).
- [ ] LPT set to "bid modifier" mode (NOT "Target Only" unless intentional ABM).
- [ ] Observation mode enabled for first 2 weeks to collect LPT performance data.
- [ ] Search terms report reviewed after import to exclude irrelevant keywords.
- [ ] Geographic targeting confirmed (Bing market share varies significantly by country).

---

## Pinterest Ads

- [ ] Pinterest Tag installed and firing.
- [ ] Product Catalog created and synced (if running Shopping Ads).
- [ ] Attribution window extended to 60-90 days (default 30-day understimates Pinterest contribution).
- [ ] CAPI configured alongside tag (see `guides/12-capi-wiring.md`).
- [ ] Creative: Pin images are 1000x1500 (2:3 ratio); text overlay ≤20% of image area.
- [ ] Shopping Ads: product prices and availability verified in catalog feed.

---

## Quora Ads

- [ ] Quora Pixel installed.
- [ ] Question targeting: specific questions selected (not just broad topic targeting).
- [ ] Ad creative: headline is question-mirroring format ("Struggling to choose the right monitoring tool?").
- [ ] Landing page: provides genuine value (not a generic homepage).
- [ ] Attribution window: extended to 60 days in Quora Ads Manager.
- [ ] Budget: ≥$500/month for any meaningful data volume.

---

## Spotify / Podcast Ads

- [ ] Spotify Ad Studio account created and billing verified.
- [ ] Audio file: 15-30 seconds, professional quality voice, verbal CTA with vanity URL.
- [ ] Vanity URL is live and redirects correctly (test on mobile and desktop).
- [ ] Promo code (if used): created in backend, code is memorable and works.
- [ ] Targeting: podcast category OR context (commute/workout) defined.
- [ ] Campaign goal set: for direct response, use "Website Traffic" objective; for brand awareness, use "Awareness."
