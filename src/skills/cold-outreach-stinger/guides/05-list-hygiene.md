# List Hygiene

A cold outreach list is a precision instrument, not a contact dump. A dirty list — wrong titles, bounced emails, unverified contacts, or the wrong companies — burns sending reputation, wastes personalization budget, and produces misleading signal about what is or is not working.

**Research grounding:** `research/external/2026-05-20-email-verification-zerobounce-neverbounce.md`, `research/external/2026-05-20-apollo-search-filters-list-building.md`

---

## ICP definition before list building

The list should not be built until the ICP is defined precisely. Use `templates/icp-definition-worksheet.md` before opening Apollo or any other prospecting tool.

A tight ICP definition includes:
- **Industry:** specific verticals (not "technology companies" — "B2B SaaS with 10-200 employees")
- **Company size:** employee count range + revenue range if available
- **Job title:** exact titles and acceptable variants (VP of Sales, Head of Sales, Director of Sales — not just "sales leader")
- **Geography:** countries/regions you can actually serve and have compliance clearance for
- **Buying trigger:** the business event or condition that makes them ready to buy (hiring for a specific role, recently raised funding, using a specific competing tool, etc.)
- **Negative signals (exclusions):** industries you do not serve, company sizes out of range, titles that sound right but are wrong-level (SDR managers vs VP Sales)

**The test:** read the ICP definition to three people in your target market. Do they recognize it as describing themselves? If not, the ICP is either too vague or wrong.

---

## Apollo list building filters

Apollo provides filters that dramatically improve list quality:
- **Job title keywords:** use job title exact match, not keyword search where possible
- **Seniority level:** filter to VP and above, or Manager and above — not "any seniority"
- **Employee count:** use company headcount bands that match your ICP
- **Last activity:** contacts active on LinkedIn in last 90 days (reduces stale contacts)
- **Technology used:** only works if your ICP has a specific tech signal (using Salesforce, Shopify, etc.)
- **Intent data (optional):** Apollo's intent data identifies companies currently researching relevant topics

After applying filters, review the first 50 contacts manually. Does the list look like your ICP? If titles are off, adjust the filter. Never export a 500-contact list without a 50-contact spot check.

**Research grounding:** `research/external/2026-05-20-apollo-search-filters-list-building.md`

---

## Email verification

All contact lists require email verification before sending. Unverified lists produce high bounce rates (>3%), which triggers spam filters and degrades sender reputation.

### Verification tool comparison (2026)

| Tool | Accuracy | Actual bounce rate after verify | Price | Best for |
|---|---|---|---|---|
| ZeroBounce | Highest | 1.8% | $0.80/1K | Accuracy-first |
| NeverBounce | High | ~2-3% | $1.00/1K | Best balance |
| Apollo native | Moderate | 3-5% | Included in plan | Quick checks only |
| Instantly native | Moderate | 3-5% | Included in plan | Quick checks only |

**Recommendation:** Run ZeroBounce or NeverBounce on any list before loading into your sending platform. The Apollo/Instantly native verification is adequate for quick checks but not for campaigns with >100 contacts.

**Research grounding:** `research/external/2026-05-20-email-verification-zerobounce-neverbounce.md`

### Verification results to handle

| Result | Action |
|---|---|
| Valid | Include |
| Invalid | Remove |
| Risky | Review; remove high-risk categories (known spam traps) |
| Catch-all | Remove entirely (see section below) |
| Unknown | Verify with secondary tool or remove |

### Catch-all domains
A catch-all domain accepts all email sent to it (including non-existent addresses) without bouncing. They appear verified but will produce real bounces at the inbox level.

**Rule:** Remove all catch-all addresses from cold email lists. The 5-10% of contacts you lose is not worth the risk of landing on a spam trap. If the company domain is catch-all and the prospect is critical, research their personal email or LinkedIn instead.

---

## List decay

Email lists decay at approximately 25% per year (people change jobs, companies are acquired, emails are deactivated).

- Re-verify lists every 6 months minimum
- For high-volume programs (sending to 1K+ contacts/month), re-verify quarterly
- Remove contacts who have not responded to 2+ sequences (not unsubscribed, just silent for 3+ months) — they are either unreachable or permanently disinterested

---

## Suppression list management

Maintain a suppression list that is applied to every new campaign:
- All previous unsubscribers
- All bounced addresses (hard bounces are permanent)
- All spam complainants
- Competitors (never cold email competitors by accident)
- Existing customers (route to customer success, not cold outreach)

Most sending platforms (Smartlead, Instantly) maintain bounce lists automatically. Ensure the unsubscribe mechanism is active and all unsub addresses are synchronized back to the master suppression list.

---

## Compliance by region

### US (CAN-SPAM)
- Commercial emails must include physical postal address
- Must honor unsubscribe requests within 10 business days
- Subject line cannot be deceptive
- Cold email to B2B contacts is generally permitted

### Canada (CASL)
- Requires implied or express consent before sending commercial email
- Implied consent covers: business cards, publicly published email addresses, prior business relationship
- Cold email to Canadian contacts using publicly listed addresses is generally covered by implied consent for B2B purposes
- Add CASL-compliant unsubscribe mechanism

### EU (GDPR)
> **FLAG: EU cold email compliance requires legal counsel review.**

Cold email to EU-domiciled prospects is high-risk without documented legitimate interest. Do not proceed with EU contacts until the user has confirmed:
1. They have reviewed GDPR Article 6(1)(f) legitimate interest requirements
2. They have documented a Legitimate Interest Assessment (LIA)
3. Legal counsel has reviewed the campaign design

Route the compliance audit to `security-worker-bee`. Do not provide legal advice.
