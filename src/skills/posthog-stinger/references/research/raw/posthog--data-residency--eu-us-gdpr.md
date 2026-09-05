# PostHog EU vs US cloud, data residency, and GDPR compliance posture

- URL: https://posthog.com/docs/privacy/gdpr-compliance ; https://posthog.com/docs/privacy/data-storage ; https://posthog.com/docs/privacy/data-collection ; https://posthog.com/subprocessors ; https://posthog.com/privacy ; https://posthog.com/dpa
- Fetched: 2026-08-14
- Source type: Official docs / official legal pages
- Component: Data residency / privacy compliance

## Content

### EU vs US cloud - the core choice

PostHog Cloud offers two regions: **US** (default, `us.i.posthog.com` / `us-assets.i.posthog.com`) and **EU** (`eu.i.posthog.com` / `eu-assets.i.posthog.com`), hosted on servers in Frankfurt, Germany. "If you require robust GDPR compliance, we recommend using PostHog Cloud EU... If you are self-hosting PostHog on a server outside the EU and are collecting EU user data, you should anonymize any of those users' personal data. If you are using PostHog Cloud US, we also recommend you anonymize any EU user data." US Cloud can still be used with EU users, but requires additional anonymization steps to approach EU compliance; EU Cloud is the direct-compliance path with no extra anonymization step required, since data never leaves the EU jurisdiction by design.

The region choice is set at project creation and determines the `api_host`/`ui_host` values used throughout SDK init, reverse-proxy rewrites, and asset hosts - **all of these must consistently target the same region** (mixing US and EU endpoints causes 401 authentication errors, per the reverse-proxy troubleshooting docs).

### Subprocessor / hosting facts (concrete, not just policy language)

Per PostHog's official subprocessors page: Amazon Web Services provides cloud storage for PostHog Cloud data, located "USA (PostHog US Cloud) or Germany (PostHog EU Cloud)" depending on which region a customer selected. Per PostHog's privacy policy: "The Websites are hosted in the United States, or in Germany if you are a PostHog Cloud customer who has selected EU hosting."

### GDPR - who is the controller/processor

| Hosting type | Data processor | Data controller |
| --- | --- | --- |
| PostHog Cloud (US or EU) | PostHog | You (the app owner) |
| Self-hosted | You | You |

### GDPR - lawful basis and consent requirements

Personal data (broadly defined - names, emails, location, ethnicity, gender, biometric data, religious beliefs, web cookies, political opinions) may only be processed with a valid lawful basis: explicit unambiguous consent, contractual necessity, legal obligation, vital interest, public-interest task, or legitimate interest (always subordinate to the data subject's fundamental rights, especially for minors). "Unambiguous consent" specifically requires: freely given/specific/informed/unambiguous language, presented distinguishably (not buried in ToS), revocable at any time, parental consent for under-13s, and documented evidence of consent. If using PostHog with cookies on a website for logged-out users, a cookie consent banner is required alongside product-level consent.

### GDPR - technical controls PostHog maps to each requirement

| Requirement | PostHog feature |
| --- | --- |
| Don't collect more than necessary / anonymize non-EU-hosted EU data | Realtime transformations (before-storage), autocapture controls |
| Mask PII before it's ever captured | Session replay masking, autocapture PII heuristics, capture overrides |
| Secure handling ("appropriate technical and organizational measures") | Access control at org/project/resource level, HTTPS in transit |
| Right to be forgotten | Person/group deletion API + UI, async event deletion |
| IP address handling (IP is personal data under GDPR) | IP data capture toggle at org level and project level (project overrides org default) |

### IP data capture defaults differ by region - concrete, non-obvious fact

"For organizations using PostHog Cloud EU, IP data capture is automatically disabled by default for all new projects." US Cloud and self-hosted do NOT get this default - it must be manually configured (Settings > Organization > General, or per-project override at Settings > Project > General) to disable IP capture by default. This is a real behavioral difference between regions, not just marketing language - EU-region projects start GDPR-safer on this specific axis out of the box.

### Right to be forgotten / data deletion mechanics

Deletion is available for accounts (deleted immediately, underlying data cleared within 30 days), projects (all data removed automatically on project deletion), organizations (background-processed, minutes), and individual persons (via UI or the Persons DELETE API with `delete_events=true` to also purge that person's events). Event deletion specifically is **asynchronous**, processed during non-peak hours (ClickHouse deletion is expensive and can affect other customers' query performance if run live) - avoid reusing a just-deleted `distinct_id` for a new user until deletion is confirmed complete (checkable via a deletion-status API), or use the "Reset deleted person" tool if reuse is unavoidable.

### Data transfer outside the EU / Standard Contractual Clauses

Per the privacy policy: where personal information is transferred outside the EEA/Switzerland/UK to a jurisdiction without an EU-adequacy decision, PostHog uses Standard Contractual Clauses (SCCs) approved by the EU Commission or UK Government as the transfer safeguard. PostHog also self-certifies to the EU-U.S. Data Privacy Framework (DPF), its UK Extension, and the Swiss-U.S. DPF. The DPA (data processing agreement) explicitly ties Subprocessor Page contents to "the Data Center Location chosen by the Company" - i.e. which subprocessors apply differs by whether the customer chose US or EU hosting.

### HIPAA note (adjacent to but distinct from GDPR)

PostHog states it can provide a Business Associate Agreement (BAA) to enable HIPAA-compliant usage of PostHog Cloud on request - contact required to arrange. Explicitly called out elsewhere (reverse-proxy raw file) that the **managed reverse proxy specifically is NOT covered** by any BAA and is not HIPAA-compliant regardless of an org-level BAA being in place, since it routes through Cloudflare as an additional subprocessor.

### Practical decision rule for this stinger (synthesized, not a direct PostHog quote - flagged as inference)

For any SvelteKit/Vercel app whose target users include EU residents and where GDPR is a live legal question, default to PostHog Cloud EU (`eu.i.posthog.com`/`eu-assets.i.posthog.com`) rather than US Cloud plus manual anonymization - it is the path PostHog's own docs describe as requiring the fewest extra compliance steps. US Cloud remains the right default when the user base is not meaningfully EU-facing, since it's PostHog's default region and has no functional difference otherwise.
