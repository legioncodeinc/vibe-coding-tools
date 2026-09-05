# Community and incident window summary

- Capture date: 2026-09-04
- Trend window: 2026-06-04 through 2026-09-04 inclusive
- Purpose: rank customer-observable support issues using public recent evidence
- Official remediation role: current help articles supply answer facts but do not prove frequency
- Customer-output rule: all upstream names and URLs in this research are internal provenance only

## Evidence added in this pass

- 26 URL-specific official incident records under `raw/incidents/`
- 10 URL-specific Google autocomplete snapshots under `raw/autocomplete/`
- 18 URL-specific official help records under `raw/recent-help/`
- 3 mapped in-window help sources already had equivalent flat records and were not duplicated
- 17 flat Ideas records already existed and were not duplicated

The status RSS contained more than 26 updates because an incident can have investigation, monitoring, and resolution entries. Deduplication by incident URL produced exactly 26 distinct incident sources. Incidents dated 2026-06-03 were excluded.

## Ranking signals

The evidence supports this priority order for the later 100-issue catalog. The ordering is directional rather than a measured ticket-volume ranking.

1. Platform slowness, blank pages, timeouts, and data-loading failures
2. Email deliverability, authentication, warmup, spam placement, and missing statistics
3. SMS delivery, A2P and toll-free verification, filtering, limits, and sender-number behavior
4. Calendar availability, timezone, synchronization, booking-link, and appointment visibility problems
5. Workflow enrollment, trigger, re-entry, wait, branch, failed-action, and replay problems
6. Social publishing failures and disconnected or permission-limited social integrations
7. Domain, DNS, SSL, 404, stale publication, form, funnel, and website problems
8. Opportunity creation, stage movement, historical migration, and appointment association problems
9. Phone activation, mobile receipt, call quality, Voice AI processing, and spam-number problems
10. Subscription, checkout, processor, SaaS billing, wallet, recharge, and verification problems
11. Client portal branding, authentication, permissions, course access, and magic-link problems
12. Contact import, duplicate handling, irreversible merge, snapshot load, and sub-account switching problems
13. API version, OAuth, private integration, webhook, rate-limit, and skipped-operation problems

Incident-family counts overlap because one incident may affect several products. Within the window, at least eight distinct incidents involved loading, blank pages, timeouts, or multi-module slowness. Six involved social or content publishing. Five involved Marketplace, MCP, Meta, YouTube, or Pinterest integration paths. Four involved opportunity, contact, calendar, or appointment visibility and state.

## Existing flat Ideas captures

All Ideas sources used for the ranking were already captured under `raw/ideas--*.md`. They were not copied into a new subdirectory.

| Flat record | Exact Ideas URL | Visible interest | In-window signal |
|---|---|---:|---|
| `raw/ideas--client-portal-customization.md` | https://ideas.gohighlevel.com/client-portal/p/customize-client-portal | about 1,400 votes | July and August reports of irrelevant modules, incomplete per-account control, branding gaps, and accessibility concerns |
| `raw/ideas--tasks-on-calendar.md` | https://ideas.gohighlevel.com/scheduling-calendar/p/add-tasks-to-calendar | 692 votes | 2026-06-08, 2026-07-15, and 2026-08-05 activity |
| `raw/ideas--platform-performance.md` | https://ideas.gohighlevel.com/automations/p/overall-speedperformance-updates | 643 votes | 2026-06-15, 2026-06-25, 2026-07-01, and 2026-07-07 performance reports |
| `raw/ideas--sms-sender-selection.md` | https://ideas.gohighlevel.com/lcphonesystem/p/selecting-phone-number | 554 votes | July and August reports of failed sends and broken conversation continuity when the wrong number is selected |
| `raw/ideas--calendar-business-days.md` | https://ideas.gohighlevel.com/scheduling-calendar/p/date-range-business-days-only-option | 202 votes | repeated June through August demand; released 2026-08-27 |
| `raw/ideas--ai-human-handoff.md` | https://ideas.gohighlevel.com/conversation-ai/p/ai-hand-off-to-a-human-message-for-conversation-ai-at-the-end-of-maximum-number | 183 votes | June through August reports of silent handoff, out-of-office loops, and inappropriate timed follow-up |
| `raw/ideas--user-permissions-subaccounts.md` | https://ideas.gohighlevel.com/users-permissions/p/different-user-permissions-across-subaccounts | 142 votes | June and July reports that one user's permissions cannot vary by sub-account |
| `raw/ideas--opportunity-created-date.md` | https://ideas.gohighlevel.com/opportunities/p/ability-to-choose-opportunity-create-date | 124 votes | July and August migration reports showing historical opportunities stamped with the import date |
| `raw/ideas--block-incoming-spam-email.md` | https://ideas.gohighlevel.com/scheduling-calendar/p/block-incoming-spam-emails | 117 votes | June through August reports of spam, phishing risk, manual deletion, and missing block controls |
| `raw/ideas--ai-studio-site-transfer.md` | https://ideas.gohighlevel.com/ai-studio/p/ai-studio-website | 117 votes | June through August reports of transfer, maintenance, sub-account, domain, and order-routing limitations |
| `raw/ideas--appointment-opportunity-association.md` | https://ideas.gohighlevel.com/scheduling-calendar/p/manage-calendar-events-directly-inside-the-opportunity | 81 votes | repeated June and July reports that one appointment attaches to every opportunity for a contact |
| `raw/ideas--personal-email-layout.md` | https://ideas.gohighlevel.com/email/p/left-aligned-emails-1 | 47 votes | June and July reports that personal-looking email remains visually centered |
| `raw/ideas--free-checkout-card.md` | https://ideas.gohighlevel.com/invoice/p/dont-require-credit-card-information-on-a-free-offer | 33 votes | June and July reports that some zero-dollar calendar, form, survey, or membership checkouts still require a card |
| `raw/ideas--ach-fee-label.md` | https://ideas.gohighlevel.com/invoicing/p/different-processing-fee-for-cc-vs-ach | 25 votes | July reports that a fee labeled for cards was also charged on ACH payments |
| `raw/ideas--login-vs-sender-email.md` | https://ideas.gohighlevel.com/users-permissions/p/email-deliverability-issue-need-different-send-email-from-login-email | 14 votes | 2026-06-12 discussion of personal login addresses appearing as visible senders |
| `raw/ideas--phone-number-spam.md` | https://ideas.gohighlevel.com/lcphonesystem/p/lc-phone-spam-protection-number-reputation-checks-and-spam-caller-quarantine | 14 votes | repeated 2026-07-01 through 2026-07-08 reports of heavy spam calls, fake contacts, and paid AI usage |

One additional flat aggregate record, `raw/ideas--recent-product-issues.md`, preserves these exact URLs without vote-count claims:

- https://ideas.gohighlevel.com/blog/p/issue-report-blog-returns-404-on-published-website
- https://ideas.gohighlevel.com/ai-employee/p/urgent-issue-voice-ai-doesnt-support-service-calendar-v2-for-appointment-booking
- https://ideas.gohighlevel.com/automations/p/overall-speedperformance-updates

Votes indicate public demand or pressure around a failure mode. They are not support-ticket counts. A feature request is useful to this catalog only when its current comments describe a concrete customer-observable failure or blocked task.

## Autocomplete signal

The ten September 4 snapshots show current suggestions for the seeds `gohighlevel not`, `error`, `email`, `calendar`, `domain`, `facebook`, `phone`, `login`, `sms`, and `workflow`. Direct troubleshooting phrases include not loading, not working, error while creating a page, emails going to spam, email warmup, email verification, calendar timezone, calendar sync, domain setup, domain transfer, phone-number verification, and login by password, email, app, or mobile.

Autocomplete exposes neither query volume nor the date each phrase first became popular. General product, pricing, tutorial, and template suggestions must not be counted as incidents.

## Recent help coverage

This pass added current source records for call quality, mobile call disconnection, duplicate-contact merge, workflow errors, pipelines and opportunities, course launch and access, funnel and website DNS, website launch, funnel launch, Social Planner, API version support, HubSpot import, course magic links, client portal setup, snapshot load history, SaaS FAQs, spam-filter blocks, and Stripe payment methods.

These mapped in-window help pages already had equivalent flat captures and were not duplicated:

- `raw/official--sms-delivery-troubleshooting.md`: https://help.gohighlevel.com/support/solutions/articles/48000981696-troubleshooting-sms-delivery-issues
- `raw/official--email-statistics.md`: https://help.gohighlevel.com/support/solutions/articles/48001208601-troubleshooting-email-statistics
- `raw/official--email-sending-warmup.md`: https://help.gohighlevel.com/support/solutions/articles/155000001021-email-sending-guide-email-best-practices-email-warm-up

Official help modification dates show that the guidance was current during the window. They do not prove that the issue was frequent.

## Safety findings for later response authoring

- Customer-facing output must represent `{agency}` as the provider and must not name or link the upstream help site, status site, product, phone service, email service, or platform identity.
- Never request passwords, authentication codes, API keys, bearer tokens, webhook secrets, full card data, bank credentials, or unredacted identity documents.
- Do not promise an outage cause, applied fix, or restoration time without evidence.
- DNS, SPF, DKIM, and DMARC changes require exact-host verification and impact review. Do not copy a broad recommendation to weaken DMARC policy.
- Disabling SaaS cancels the subscription and permanently deletes the wallet. It requires billing authority, explicit confirmation, and a recovery plan.
- Contact merges are permanent and require master-record and related-data review.
- A failed payment, campaign, workflow, snapshot, post, API call, or opportunity action must not be replayed until prior side effects are checked. Blind replay can cause duplicate charges, sends, records, or external actions.
- A failed SMS should be retried only after the displayed error's cause is addressed. Repeated retries can worsen carrier filtering or account restrictions.
- Deliverability and reputation recovery can take weeks or months. No response may guarantee inbox placement or immediate recovery.

## Known limits

Private groups, private tickets, agency inboxes, and platform query logs were unavailable. Public incidents overrepresent outages, and public feedback overrepresents visible pain or long-running feature gaps. The final ranking should combine this evidence with the separate Reddit capture and, when available, a redacted export of `{agency}` ticket tags and internal search terms.
