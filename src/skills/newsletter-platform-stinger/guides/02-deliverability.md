# Guide 02: Deliverability — Managed SaaS vs Self-Hosted

*Derived from: `research/external/2026-05-20-listmonk-self-hosted-newsletter-2026.md`, `research/external/2026-05-20-newsletter-platform-full-comparison-2026.md`, `research/external/2026-05-20-beehiiv-vs-substack-vs-ghost.md`*

Deliverability is the percentage of your emails that reach the inbox. The three levers are: sender authentication, list hygiene, and sending behavior (volume, engagement, complaint rate).

---

## Managed SaaS deliverability (Beehiiv, Loops, Kit, Substack, Resend Audiences)

For managed platforms, deliverability is a shared responsibility:

- **Platform handles**: IP pool management, ISP feedback loops, bounce processing infrastructure, compliance enforcement.
- **You handle**: custom sending domain verification, list hygiene, engagement rate, complaint rate.

### Custom sending domain setup (one-time, required)

Every managed platform requires you to verify a custom domain before sending. Without this, email is sent from the platform's default domain (e.g., `newsletters.beehiiv.com`), which hurts open rates and click-through because recipients do not recognize the sender.

**Standard DNS records required** (all platforms use the same set):

| Record type | Purpose | Where to add |
|---|---|---|
| 3x CNAME | DKIM signature (authenticates the send) | DNS provider |
| 1x MX | Bounce handling | DNS provider |
| 1x TXT | SPF (authorizes platform to send as your domain) | DNS provider |
| 1x TXT | DMARC (tells ISPs what to do with unauthenticated mail) | DNS provider |

The platform's dashboard provides the exact values. DNS propagation: 1-6 hours.

**Before migrating lists or sending in bulk**: always verify the sending domain first. Sending from an unverified domain at volume is the fastest way to land in spam.

### Spam rate management

Gmail's 2024 sender guidelines require a spam complaint rate below 0.10% (1 in 1,000 sends). Above 0.30% triggers delivery suppression.

Actions that protect spam rate:
- Use double opt-in for organic signups (reduces fake or mistyped addresses).
- Remove unengaged subscribers after 90 days of no opens (clean list = better deliverability).
- Suppress hard bounces immediately (platforms do this automatically; monitor the bounce count).
- Never import purchased or scraped lists — ISPs and platforms will flag this.

> TODO: Loops double opt-in — research did not confirm whether Loops supports a traditional double opt-in confirmation email flow (click-to-confirm). Verify at loops.so/docs before recommending Loops for GDPR-sensitive EU audiences.

---

## Self-hosted deliverability (Ghost self-hosted, Listmonk, Postal)

Self-hosting your newsletter means owning the entire email stack. This includes:

- Your sending IP address and its reputation
- Your own MX record handling for bounces and replies
- All feedback loop subscriptions with major ISPs (Gmail, Microsoft, Yahoo)
- DKIM, SPF, DMARC configuration for your domain
- Active monitoring of spam complaint rates and bounce rates

**Honest operational cost** (from `research/external/2026-05-20-listmonk-self-hosted-newsletter-2026.md`):
- Initial setup: 4-8 hours (VPS, SMTP relay, DNS records, app configuration)
- Ongoing maintenance: 2-4 hours/week minimum (bounces, deliverability monitoring, ISP issues)
- A single bad week of high bounce rates can take 2-4 weeks of careful warm-up to recover from

### When self-hosted is worth it

- 50,000+ subscribers where platform fees exceed VPS + SMTP relay costs significantly
- Compliance requirement to store subscriber data on self-controlled infrastructure
- Technical founder comfortable with server administration

### When to avoid self-hosted

- Early-stage product (<10K subscribers): platform cost savings do not justify operational overhead
- Non-technical team: deliverability requires active monitoring and occasional firefighting
- Fast growth: a new IP sending to a rapidly-growing list needs careful warm-up; managed platforms already have warm IPs

### Self-hosted SMTP relay options

Most self-hosted newsletter tools (Listmonk, Postal) still use a third-party SMTP relay for the actual sending, because getting your own IP warmed up is a multi-month process:

| SMTP relay | Free tier | Good for |
|---|---|---|
| Amazon SES | 62K/month (within AWS) | High volume, technical teams |
| Mailgun | 100 emails/day | Low volume, easy API |
| Postmark | 100/month | High deliverability priority |
| Resend | 3K/month | Developer-friendly, modern API |

When using Listmonk + Amazon SES, the monthly cost for 50K subscribers is approximately $15-25/month (Listmonk is free; SES charges ~$0.10/1,000 emails).

---

## Deliverability comparison by platform

| Platform | IP sharing | Domain auth required | Feedback loops | Bounce handling | Deliverability risk |
|---|---|---|---|---|---|
| Beehiiv | Shared pool (established) | Yes (your subdomain) | Platform handles | Automatic | Low |
| Loops | Shared pool | Yes (your domain) | Platform handles | Automatic | Low |
| Kit | Shared pool | Yes (your domain) | Platform handles | Automatic | Low |
| Substack | Shared pool | No custom domain on free | Platform handles | Automatic | Medium (no custom domain on free) |
| Resend Audiences | Shared pool (transactional-grade) | If using custom domain | Platform handles | Automatic | Very Low |
| Ghost Pro | Managed (Mailgun) | Yes | Ghost handles | Automatic | Low-Medium |
| Ghost self-hosted | Your choice (see SMTP relay table) | You configure all | You manage | You manage | Variable (your responsibility) |
| Listmonk | SMTP relay of your choice | You configure all | You manage | Partial automation | Variable |

---

## For GDPR-sensitive audiences (EU subscribers)

All managed platforms operate data centers in the US by default. For EU data residency requirements:
- Loops: no EU data residency option confirmed (2026)
- Beehiiv: US-based; check DPA availability at beehiiv.com/legal
- Kit: US-based; GDPR data processing addendum available
- Ghost Pro: check ghost.org for current data center options

For strict EU data residency: self-hosted on a EU VPS is the clearest compliance path, at the operational cost described above.

Route infrastructure-level DNS work (SPF/DKIM/DMARC records) to `devops-worker-bee`.
