# Data Inventory Example: B2B SaaS CRM + Analytics + Payments

A completed data-inventory input for a typical B2B SaaS that offers a CRM module, usage analytics, and Stripe-powered billing. Use this as a reference when filling `templates/privacy-policy-data-inventory.md`.

---

| # | Data category | Collection method | Purpose | Legal basis (GDPR) | Retention | Third parties | Transfer mechanism |
|---|---|---|---|---|---|---|---|
| 1 | Account registration data (name, work email, company name, role) | User provides on signup | Account creation, authentication, service delivery | Contract (Art. 6(1)(b)) | Duration of account + 30 days post-deletion | None (stored in our DB) | N/A — EU data residency |
| 2 | IP address | Automatically collected | Security / fraud detection, analytics | Legitimate interest (Art. 6(1)(f)) | 90 days | Datadog (logging), Cloudflare (security) | DPF (Datadog), DPF (Cloudflare) |
| 3 | Usage analytics (page views, feature clicks, session duration) | Automatically collected via PostHog | Product improvement, support | Legitimate interest (Art. 6(1)(f)) | 24 months | PostHog (US, DPF-certified) | DPF |
| 4 | Payment information (card last 4, billing address, payment history) | User provides on checkout | Billing, subscription management | Contract (Art. 6(1)(b)) | 7 years (tax/accounting obligation) | Stripe (US, DPF-certified, PCI DSS Level 1) | DPF + PCI DSS |
| 5 | CRM data entered by user (contact names, emails, notes) | User provides | Service delivery (core product function) | Contract (Art. 6(1)(b)) | Duration of account + 30 days post-deletion | AWS S3 (EU region) | Adequacy (EU region, no transfer) |
| 6 | Support conversation data (Intercom chat transcripts) | User provides during support | Customer support delivery | Contract (Art. 6(1)(b)) | 3 years | Intercom (US, DPF-certified) | DPF |
| 7 | Error logs (stack traces, user context included) | Automatically collected | Debugging, reliability | Legitimate interest | 30 days | Sentry (US, DPF-certified) | DPF |
| 8 | Marketing email engagement (open, click events) | Automatically collected if opted in | Marketing analytics, campaign optimization | Consent (Art. 6(1)(a)) | 2 years | Mailchimp (US, DPF-certified) | DPF |

---

## Sub-processors for this example (Schedule 3)

| Sub-processor | Country | Service | Data categories received |
|---|---|---|---|
| AWS (Amazon Web Services) | EU-West-1 (Ireland) | Infrastructure / storage | All categories 1, 3, 5 |
| Stripe | US | Payment processing | Category 4 |
| PostHog | US | Product analytics | Categories 2, 3 |
| Intercom | US | Customer support | Category 6 |
| Datadog | US | Log management | Category 2 |
| Cloudflare | US | CDN / security | Category 2 |
| Sentry | US | Error tracking | Category 7 |
| Mailchimp | US | Email marketing | Category 8 |

---

## Notes on this example

- All US sub-processors are DPF-certified as of May 2026. If any loses DPF certification, SCCs Module 2 must be executed within 30 days.
- Category 5 (CRM data) is stored in AWS EU-West-1, so no international transfer occurs for this category.
- Category 4 (payment data) never enters our database; Stripe tokenizes it at the point of collection. We store only the last 4 digits, billing country, and payment method ID.
- Marketing emails (Category 8) are opt-in only. Users who do not consent receive only transactional emails (account activity).
