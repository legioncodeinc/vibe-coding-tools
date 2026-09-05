# Guide 04: Platform Migration

*Derived from: `research/external/2026-05-20-substack-to-beehiiv-migration-checklist.md`, `research/external/2026-05-20-beehiiv-vs-kit-comparison-2026.md`*

The most common migration request is Substack → Beehiiv. The general principles apply to other platform migrations; platform-specific gotchas are called out per section.

---

## Substack → Beehiiv migration (full checklist)

**Estimated time**: 1 focused week for a list under 10,000 subscribers. The bottleneck is not the import itself — it's the deliverability warm-up and the time to rebuild automations.

### Pre-migration (before touching any data)

1. **Create your Beehiiv account** and set up the publication (name, description, logo).
2. **Verify your sending domain on Beehiiv first** — add DKIM/SPF/DMARC DNS records and click Verify in Beehiiv's settings. DO NOT import your list or send anything until this is verified. Sending from an unverified domain at list-scale is the fastest path to landing in spam.
3. **Set your default post template in Beehiiv** before importing content — imported styling is much easier to fix before migration than after.

### Content migration

4. **Export Substack archive**: Substack → Settings → Exports → Request export. You receive a zip file.
   - CRITICAL: Keep the zip file intact. **Safari auto-unzips by default** on Mac — if you're on Safari, use Chrome or Firefox to download, or re-zip the folder before uploading.
5. **Import posts to Beehiiv**: Beehiiv → Grow → Import → Substack. Upload the zip. Beehiiv supports: Substack, WordPress, Ghost, and Mailchimp imports.

### Free subscriber migration

6. **Export Substack subscriber CSV**: Substack → Settings → Subscribers → Export.
   - The CSV contains: email, name, signup date, subscriber type (free/paid), activity status.
7. **Clean the CSV before import**: remove bounces, remove unengaged (if you have data), correct obvious formatting issues.
8. **Import to Beehiiv**: Beehiiv → Audience → Import Subscribers.
   - Add a tag to the import: `substack-migration-2026` — this lets you filter and analyze the migrated cohort later.
   - Recommended Beehiiv CSV fields to map: `email`, `name`, `start date`, `subscription source: free`, `activity`.

### Paid subscriber migration (if applicable)

Paid subscriber migration is the most complex step. The critical ordering avoids double-billing subscribers.

9. **Connect Stripe to Beehiiv**: Beehiiv uses Stripe for paid subscriptions. Connect your Stripe account in Beehiiv Settings.
10. **Create matching paid tiers in Beehiiv** that mirror your Substack tiers (same price points, same currency wherever possible).
11. **Copy Stripe customer payment data**: active paid subscribers have Stripe Customer IDs. Beehiiv's import tool can accept Stripe Customer IDs to map existing billing relationships.
12. **Pause Substack billing** (CRITICAL — do this BEFORE the Beehiiv paid tier goes live). If you activate Beehiiv billing before pausing Substack, subscribers are charged twice. Contact Substack support if you cannot pause billing independently.
13. **Map Substack products to Beehiiv tiers** and confirm each paid subscriber is correctly classified in Beehiiv.

### Cutover

14. **Quality check**: review imported posts (paywalls, formatting), subscriber counts, tags, and custom fields. Send a test broadcast to yourself.
15. **Send a final Substack broadcast** announcing the migration: tell subscribers your new sending address, what to expect, and when to expect the first email from Beehiiv.
16. **Cut over domain and sending on the same day** — do not run a "dual-send week" where you send from both platforms. Dual-sending creates subscriber confusion about which email is the real one, and ISPs may flag the same-content duplication.
17. **Warm-up period**: send at reduced frequency for the first 2 weeks post-migration. If you were sending 3x/week, send 1-2x/week during warm-up. This allows your new Beehiiv sender domain to establish reputation.

### Post-migration

18. **Monitor deliverability**: Beehiiv dashboard shows open rates, bounce rates, spam rates. Check after the first 5 sends.
19. **Rebuild automations**: any welcome email sequences or drip campaigns you had in Substack need to be recreated in Beehiiv's automation builder.
20. **Apply for Ad Network eligibility**: once your list is verified in Beehiiv, apply for the Ad Network (requires 1,000+ active subs and 20%+ open rate).

---

## Kit → Beehiiv migration (summary)

Less complex than Substack because Kit does not manage your Stripe billing — you own it directly.

1. Export Kit subscribers as CSV.
2. Set up Beehiiv, verify domain, import CSV (same process as free Substack subscribers).
3. Re-map Kit automations (welcome sequence, drip campaigns) to Beehiiv equivalents.
4. Paid subscriptions: if you use Kit Commerce, you will need to migrate Stripe customers to Beehiiv's Stripe connection. Same principle as Substack paid migration above.
5. Cut over sending domain in DNS (update MX/SPF/DKIM to Beehiiv values).

No "dual billing" risk because Kit Commerce is a direct Stripe integration — you can simply cancel Kit's Stripe connection after confirming Beehiiv's is live.

---

## General migration principles

These apply to any platform migration:

- **Verify domain first, import list second, send third.** In that order. Every time.
- **Never dual-send.** Pick a cutover date and cut over all at once.
- **Tag the migrated cohort.** `platform-migration-YYYY` tag lets you measure engagement of the migrated group vs organically acquired subscribers post-migration.
- **Warm up after any domain change.** Reducing send frequency for 2 weeks protects deliverability when your sender domain is new or newly configured.
- **Communicate clearly with subscribers.** A simple "we moved platforms" email sent from the OLD platform before cutover reduces confused spam reports from subscribers who do not recognize the new sender.

---

## Common migration gotchas

| Gotcha | Mitigation |
|---|---|
| Substack export zip auto-unzips on Safari | Use Chrome/Firefox to download; or re-zip before upload |
| Paid subscribers double-billed | Pause old platform billing BEFORE activating new platform billing |
| Sender domain reputation starts fresh | Warm-up period: send less frequently for first 2 weeks |
| Automation sequences not migrated | Rebuild manually; export Substack automations as reference first |
| Subscriber activity data not transferred | Only email + name carry cleanly; open history stays on old platform |
| Substack tier/signup-date data loss | Substack CSV includes tier; map it to Beehiiv's free/paid classification carefully |
