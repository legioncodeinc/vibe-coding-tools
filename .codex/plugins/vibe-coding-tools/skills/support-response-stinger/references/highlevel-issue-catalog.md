# Evidence-ranked HighLevel issue catalog

This is an internal, evidence-ranked public shortlist of 100 customer-observable support issues for a HighLevel-powered service. It is not a statistical top 100 and does not represent `{agency}` ticket volume, query volume, market prevalence, or a currently active incident. The ranking uses public evidence captured from 2026-06-04 through 2026-09-04 inclusive. Current official help records supply remediation facts but do not prove frequency.

Internal entries may name HighLevel and link to archived source records for provenance. Files assigned under `references/white-label-response-library/` are customer-facing. They must present `{agency}` as the provider and must not name, cite, link to, or expose HighLevel, GoHighLevel, LeadConnector, LC Phone, LC Email, `help.gohighlevel.com`, the upstream status site, or another upstream identity.

## Field contract

- Evidence class `F1`: a dated official incident record confirms that the named surface had the stated customer impact during the trend window. It does not establish that a similar new ticket has the same cause.
- Evidence class `F2`: two or more independent recent community records support a repeated customer-observable issue group. They do not establish root cause or a safe workaround.
- Evidence class `F3`: one recent community record supports a distinct support intent. It does not establish a defect or generally safe remedy.
- Evidence class `F4`: a current official community-board record or autocomplete snapshot supports directional demand or customer wording. It does not expose query volume or prevalence.
- Evidence class `F5`: current popular placement or official collection breadth supports an ordinary setup or troubleshooting intent. It does not rank traffic or severity.
- Remediation class `R1`: a current official help record updated inside the trend window supplies a documented diagnostic path. Apply it only after ticket evidence matches.
- Remediation class `R2`: an evergreen official help record outside the trend window supplies a documented diagnostic model. It does not prove recent demand or a current incident.
- Remediation class `UNRESOLVED`: the archive does not contain a sufficiently specific, safely applicable official remediation path. Collect the stated minimum evidence and escalate. Do not guess.

Entries are ordered globally by evidence strength first and customer impact second. Within one evidence class, broader interruption, data integrity, duplicate-side-effect, consent, access, and billing risks rank ahead of narrower configuration questions. Primary-family allocations are exact: platform 6, email 10, SMS and A2P 12, calendars 8, workflows 10, social 6, sites and forms 12, CRM 8, phone and AI 10, billing 8, portals and permissions 5, and APIs and integrations 5.

## High-risk action gates

The following 14 gates are mandatory. A catalog entry that references a gate inherits its complete stop condition. No response may weaken or bypass one of these gates.

| Gate | High-risk action | Required gate before recommendation or confirmation | Response stop |
|---|---|---|---|
| `HR-01` | Change or delete A, CNAME, AAAA, MX, SPF, DKIM, SSL, redirect, or proxy settings | Authorized domain owner, authoritative DNS provider, exact hostname, current records, affected services, desired target, impact review, and rollback record | Never tell a customer to delete existing records generically. Give only the exact reviewed change. [research/raw/recent-help/funnel-website-domain-dns.md](research/raw/recent-help/funnel-website-domain-dns.md) [research/raw/incidents/2026-08-25-isp-dns-data-loading.md](research/raw/incidents/2026-08-25-isp-dns-data-loading.md) |
| `HR-02` | Relax or replace DMARC | Authorized owner, current policy, authentication results, documented reason, specialist review, and rollback plan | Do not reuse a context-specific relaxation suggestion as generic troubleshooting. [research/raw/official--email-spam-troubleshooting.md](research/raw/official--email-spam-troubleshooting.md) |
| `HR-03` | Disable SaaS, disconnect a processor, transfer an account, change currency, or move a subscription | Verified billing authority, impact review, explicit confirmation, current balances and subscriptions, and recovery plan | State irreversible effects before confirmation. Never imply a refund is automatic. [research/raw/recent-help/saas-mode-faqs.md](research/raw/recent-help/saas-mode-faqs.md) |
| `HR-04` | Merge contacts | Admin authority, selected master record, conflicting-field review, financial and appointment review, and active-workflow review | State that the merge is permanent and identify the retained record before action. [research/raw/recent-help/duplicate-contact-merge.md](research/raw/recent-help/duplicate-contact-merge.md) |
| `HR-05` | Retry a failed charge or create a replacement subscription | Subscription, invoice, processor event, and customer charge state checked first | Never request full card data. Never promise approval or refund without billing authority. [research/raw/incidents/2026-08-05-subscription-payment-failures.md](research/raw/incidents/2026-08-05-subscription-payment-failures.md) |
| `HR-06` | Replay a failed API call, webhook, workflow action, or integration operation | Original operation state, logs, correlation ID, affected records, prior side effects, and idempotency control where available | Audit skipped and partially completed operations before any controlled replay. [research/raw/incidents/2026-08-19-marketplace-api-degradation.md](research/raw/incidents/2026-08-19-marketplace-api-degradation.md) |
| `HR-07` | Recreate or bulk-move an opportunity | Existing contact, opportunity, pipeline, stage, workflow history, and audit history checked | Use one controlled action only after the existing record is found or ruled out. [research/raw/incidents/2026-08-16-opportunities-not-generated.md](research/raw/incidents/2026-08-16-opportunities-not-generated.md) [research/raw/recent-help/pipelines-opportunities-setup.md](research/raw/recent-help/pipelines-opportunities-setup.md) |
| `HR-08` | Resend SMS or replay a campaign | Exact error fixed, prior delivery state checked, consent state verified, and one controlled recipient selected | Do not repeat sends because the interface shows a delay or failure. [research/raw/official--sms-delivery-troubleshooting.md](research/raw/official--sms-delivery-troubleshooting.md) [research/raw/incidents/2026-06-10-email-builder-gcs-outage.md](research/raw/incidents/2026-06-10-email-builder-gcs-outage.md) |
| `HR-09` | Republish, clone, reschedule, delete, or reconnect a social post or account | Destination checked, original post status verified, affected channel isolated, and authorizing user's permissions confirmed | Reconnect only the affected account. Retry only after confirming the original is not live. [research/raw/recent-help/social-planner-setup.md](research/raw/recent-help/social-planner-setup.md) [research/raw/incidents/2026-08-12-pinterest-publishing.md](research/raw/incidents/2026-08-12-pinterest-publishing.md) |
| `HR-10` | Load or push a snapshot again | Load history, snapshot version, target account, selected assets, current status, and failed-asset list checked | Do not start a second full load while the first may still be processing. [research/raw/recent-help/snapshot-load-history.md](research/raw/recent-help/snapshot-load-history.md) [research/raw/incidents/2026-08-17-snapshot-load-delay.md](research/raw/incidents/2026-08-17-snapshot-load-delay.md) |
| `HR-11` | Re-enroll a learner, recreate a purchase, republish an offer, or resend access | Payment history, enrollment, offer-to-course association, access workflow, and publication state checked | Separate purchase, enrollment, link freshness, and content permission before action. [research/raw/recent-help/course-launch-and-access.md](research/raw/recent-help/course-launch-and-access.md) [research/raw/recent-help/course-magic-links.md](research/raw/recent-help/course-magic-links.md) |
| `HR-12` | Clear cookies or site data | Exact page and browser scoped, private-browser comparison completed, and customer warned of impact | Use only when the post-recovery symptom still reproduces and the action is relevant to that browser. [research/raw/incidents/2026-06-17-intermittent-520-errors.md](research/raw/incidents/2026-06-17-intermittent-520-errors.md) |
| `HR-13` | Delete or recreate an AI agent, funnel, form, page, or domain | Current object preserved, clean-session test completed, incident state checked, and dependencies inventoried | Preserve first, test second, and recreate only after a verified object-level diagnosis. [research/raw/incidents/2026-07-15-ai-agents-not-responding.md](research/raw/incidents/2026-07-15-ai-agents-not-responding.md) [research/raw/incidents/2026-08-20-social-planner-funnel-blank-pages.md](research/raw/incidents/2026-08-20-social-planner-funnel-blank-pages.md) [research/raw/incidents/2026-07-13-form-service-disruption.md](research/raw/incidents/2026-07-13-form-service-disruption.md) |
| `HR-14` | Broaden user permissions or share credentials to bypass access trouble | Intended sub-account, role, user identity, least-privilege requirement, and administrator approval | Never use credential sharing or overbroad permissions as a shortcut. [research/raw/ideas--user-permissions-subaccounts.md](research/raw/ideas--user-permissions-subaccounts.md) [research/raw/incidents/2026-07-23-sub-account-switching.md](research/raw/incidents/2026-07-23-sub-account-switching.md) |

## Catalog

### SR-001: Multiple core modules are slow or time out

- Primary family: Platform access, performance, and support routing
- Evidence class: `F1`
- Remediation class: `UNRESOLVED`
- Trend support: A 2026-09-01 incident documented degraded performance across calendars, opportunities, contacts, conversations, and related areas. This is historical impact evidence, not proof that a later slowdown has the same cause.
- Cited raw files: [raw/incidents/2026-09-01-multi-module-slowness.md] [raw/official--status-incidents-2026-06-to-09.md]
- Minimum safe evidence: Account, exact slow pages, affected modules, start time and timezone, browser, network, and whether another clean browser or account reproduces the behavior.
- First safe response action: Establish whether impact is limited to one browser, one account, or one module, or is reproduced across clean contexts.
- Escalation or authority gate: Verify current internal status before using incident language. Escalate the scoped evidence when more than one clean account or module reproduces the slowdown. Do not reuse the historical root cause or ETA.
- Response file: `references/white-label-response-library/SR-001-multiple-core-modules-slow-or-time-out.md`

### SR-002: Application scripts, styles, or images fail to load

- Primary family: Platform access, performance, and support routing
- Evidence class: `F1`
- Remediation class: `UNRESOLVED`
- Trend support: A 2026-08-31 incident documented production application assets failing to load.
- Cited raw files: [raw/incidents/2026-08-31-application-asset-loading.md] [raw/official--status-incidents-2026-06-to-09.md]
- Minimum safe evidence: Exact page, account, browser, timestamp, screenshot, redacted console or network error when available, and cross-browser or cross-account comparison.
- First safe response action: Preserve the affected object and capture the rendering failure before testing the same page in one clean browser session.
- Escalation or authority gate: Apply `HR-13`. Escalate if assets still fail in a clean session. Do not tell the customer to rebuild a page or delete content because the interface looks incomplete.
- Response file: `references/white-label-response-library/SR-002-application-assets-fail-to-load.md`

### SR-003: The app shell opens but account data does not load

- Primary family: Platform access, performance, and support routing
- Evidence class: `F1`
- Remediation class: `UNRESOLVED`
- Trend support: A 2026-08-25 incident documented an application shell loading while data requests failed for some customers.
- Cited raw files: [raw/incidents/2026-08-25-isp-dns-data-loading.md] [raw/official--status-incidents-2026-06-to-09.md]
- Minimum safe evidence: ISP, network, operating system, browser, exact time, affected account and page, and current hostname lookup result.
- First safe response action: Compare the current hostname lookup and one alternate-network result before suggesting any local network change.
- Escalation or authority gate: Apply `HR-01` to any DNS change. The incident workaround was time-bound. Escalate current lookup evidence and require customer IT approval for any system-wide DNS action.
- Response file: `references/white-label-response-library/SR-003-app-shell-opens-data-does-not-load.md`

### SR-004: Pages intermittently return HTTP 520

- Primary family: Platform access, performance, and support routing
- Evidence class: `F1`
- Remediation class: `UNRESOLVED`
- Trend support: A 2026-06-17 incident documented intermittent HTTP 520 failures on a subset of pages.
- Cited raw files: [raw/incidents/2026-06-17-intermittent-520-errors.md] [raw/official--status-incidents-2026-06-to-09.md]
- Minimum safe evidence: Exact page, account, timestamp, browser, screenshot or redacted error, and private-browser comparison.
- First safe response action: Confirm the exact failing page and test it once in a private browser without clearing existing session data.
- Escalation or authority gate: Apply `HR-12`. Verify current incident status before attributing cause. Clearing site data requires an impact warning and is not the first step.
- Response file: `references/white-label-response-library/SR-004-pages-intermittently-return-http-520.md`

### SR-005: Email templates will not save or load, or campaign scheduling fails

- Primary family: Email delivery, authentication, reputation, links, and reporting
- Evidence class: `F1`
- Remediation class: `R1`
- Trend support: A 2026-06-10 incident documented template save and load failures and campaign scheduling impact. The current email troubleshooting collection separates test-send and campaign-step errors from delivery problems.
- Cited raw files: [raw/incidents/2026-06-10-email-builder-gcs-outage.md] [raw/official--email-troubleshooting-folder.md]
- Minimum safe evidence: Account, template or campaign identifier, timestamp, exact action and error, local copy of unsaved content when available, and current schedule state.
- First safe response action: Preserve unsaved content outside the builder and verify whether the original campaign schedule was accepted.
- Escalation or authority gate: Apply `HR-08` before rescheduling. Verify current status before calling the symptom an incident. Escalate when save or load failure reproduces on a preserved copy in a clean session.
- Response file: `references/white-label-response-library/SR-005-email-template-save-load-or-scheduling-fails.md`

### SR-006: Appointment data is missing from views or reports

- Primary family: Calendars, availability, synchronization, and booking
- Evidence class: `F1`
- Remediation class: `R2`
- Trend support: A 2026-09-02 incident documented appointment data missing from certain views and reports while affected data was being backfilled. Evergreen calendar diagnostics provide object-level checks.
- Cited raw files: [raw/incidents/2026-09-02-appointment-data-visibility.md] [raw/official--calendar-troubleshooting-tool.md]
- Minimum safe evidence: Account, calendar, exact view or report, appointment identifiers, timestamps, timezone, and whether the records appear in another appropriate view.
- First safe response action: Confirm whether each appointment record exists elsewhere before changing or recreating anything.
- Escalation or authority gate: Escalate with identifiers when records remain absent. Do not recreate appointments while visibility recovery or backfill is being validated.
- Response file: `references/white-label-response-library/SR-006-appointment-data-missing-from-views-or-reports.md`

### SR-007: Workflow triggers or actions fail or are skipped during API degradation

- Primary family: Workflows and automation
- Evidence class: `F1`
- Remediation class: `R1`
- Trend support: A 2026-08-19 incident documented workflow triggers and actions failing or being skipped alongside API and authentication degradation. Current workflow guidance provides execution-history and error checks.
- Cited raw files: [raw/incidents/2026-08-19-marketplace-api-degradation.md] [raw/recent-help/workflow-error-resolution.md]
- Minimum safe evidence: Workflow name and version, contact or object, operation, execution time, enrollment and execution history, redacted error, correlation ID when available, and prior side effects.
- First safe response action: Classify each operation as failed, skipped, partially completed, or completed before any replay.
- Escalation or authority gate: Apply `HR-06`. Use a fresh safe test contact only after live side effects are audited. Escalate with redacted history and do not reuse the historical incident cause for a current ticket.
- Response file: `references/white-label-response-library/SR-007-workflow-actions-fail-or-are-skipped.md`

### SR-008: Facebook account or page connection fails during a service disruption

- Primary family: Social publishing and connected channels
- Evidence class: `F1`
- Remediation class: `R1`
- Trend support: A 2026-06-12 incident documented failures connecting Facebook accounts and pages. Current social setup guidance distinguishes connection and authorizing-user permission failures.
- Cited raw files: [raw/incidents/2026-06-12-meta-service-disruption.md] [raw/recent-help/social-planner-setup.md]
- Minimum safe evidence: Account, exact destination asset, authorizing user, current permissions, timestamp, connection alert, and whether other connected destinations work.
- First safe response action: Isolate the affected Facebook asset and confirm the authorizing user's access without disconnecting it.
- Escalation or authority gate: Apply `HR-09`. Verify current incident status. Do not repeatedly disconnect and reconnect assets during a broader disruption.
- Response file: `references/white-label-response-library/SR-008-facebook-account-or-page-connection-fails.md`

### SR-009: Facebook leads do not synchronize or arrive

- Primary family: APIs, webhooks, integrations, and attribution bridges
- Evidence class: `F1`
- Remediation class: `UNRESOLVED`
- Trend support: The 2026-06-12 service incident documented Facebook lead-form synchronization and lead-delivery failures.
- Cited raw files: [raw/incidents/2026-06-12-meta-service-disruption.md] [raw/official--status-incidents-2026-06-to-09.md]
- Minimum safe evidence: Account, Facebook page and form, missing lead identifiers when available, submission timestamps, connection state, field mapping, and current CRM search result.
- First safe response action: Inventory missing lead submissions and confirm whether any already exist under another contact before synchronizing or recreating records.
- Escalation or authority gate: Escalate the inventory and timestamps when current connection and mapping are intact. Any later manual synchronization must prevent duplicate contacts and duplicate automation.
- Response file: `references/white-label-response-library/SR-009-facebook-leads-do-not-sync-or-arrive.md`

### SR-010: Social posts remain stuck in progress

- Primary family: Social publishing and connected channels
- Evidence class: `F1`
- Remediation class: `R1`
- Trend support: A 2026-06-05 incident documented scheduled posts remaining in progress without completing. Current social guidance makes destination state the first check.
- Cited raw files: [raw/incidents/2026-06-05-social-posts-stuck-in-progress.md] [raw/recent-help/social-planner-setup.md]
- Minimum safe evidence: Account, post ID, destination, scheduled time and timezone, current planner status, and destination URL or destination-side result.
- First safe response action: Check whether the original post is already live at the destination.
- Escalation or authority gate: Apply `HR-09`. Do not clone, reschedule, delete, or publish again until the original destination state is known.
- Response file: `references/white-label-response-library/SR-010-social-posts-remain-stuck-in-progress.md`

### SR-011: Social Planner opens as a blank page

- Primary family: Social publishing and connected channels
- Evidence class: `F1`
- Remediation class: `R1`
- Trend support: A 2026-08-20 incident documented intermittent blank pages in Social Planner.
- Cited raw files: [raw/incidents/2026-08-20-social-planner-funnel-blank-pages.md] [raw/recent-help/social-planner-setup.md]
- Minimum safe evidence: Account, exact planner page, post or draft identifier, browser, timestamp, screenshot, and clean-browser comparison.
- First safe response action: Preserve draft content outside the editor and check the same planner page in one clean browser session.
- Escalation or authority gate: Apply `HR-13`. Do not delete drafts, posts, or connections. Escalate if the same account remains blank in a clean session.
- Response file: `references/white-label-response-library/SR-011-social-planner-opens-as-blank-page.md`

### SR-012: Pinterest posts fail while other channels work

- Primary family: Social publishing and connected channels
- Evidence class: `F1`
- Remediation class: `R1`
- Trend support: A 2026-08-12 incident documented Pinterest-specific publishing failures while other social destinations remained operational.
- Cited raw files: [raw/incidents/2026-08-12-pinterest-publishing.md] [raw/recent-help/social-planner-setup.md]
- Minimum safe evidence: Account, Pinterest destination, post ID, scheduled time and timezone, error, connection state, and destination-side status.
- First safe response action: Confirm whether the original post reached Pinterest and isolate the issue to that channel.
- Escalation or authority gate: Apply `HR-09`. Do not reconnect unrelated accounts or republish a post that may already be live.
- Response file: `references/white-label-response-library/SR-012-pinterest-posts-fail-other-channels-work.md`

### SR-013: YouTube connection, secondary actions, or analytics are unavailable

- Primary family: Social publishing and connected channels
- Evidence class: `F1`
- Remediation class: `R1`
- Trend support: A 2026-07-30 incident documented intermittent YouTube connection, deletion, thumbnail, comment, and analytics problems while scheduled publishing continued.
- Cited raw files: [raw/incidents/2026-07-30-youtube-integration.md] [raw/recent-help/social-planner-setup.md]
- Minimum safe evidence: YouTube account, video or post ID, exact failing function, timestamp, scheduled-publication state, and destination result.
- First safe response action: Isolate the failing YouTube function and confirm whether the video already published.
- Escalation or authority gate: Apply `HR-09`. Do not disconnect a working account because analytics or a secondary action is delayed.
- Response file: `references/white-label-response-library/SR-013-youtube-actions-or-analytics-unavailable.md`

### SR-014: Meta social posts fail during a cross-service disruption

- Primary family: Social publishing and connected channels
- Evidence class: `F1`
- Remediation class: `R1`
- Trend support: A 2026-06-12 incident documented Meta Social Planner post impact alongside Facebook connection, lead-sync, and WhatsApp disruption. Current social guidance supplies destination, permission, connection, and post-state checks.
- Cited raw files: [raw/incidents/2026-06-12-meta-service-disruption.md] [raw/recent-help/social-planner-setup.md]
- Minimum safe evidence: Account, Meta destination, post ID, scheduled time and timezone, current status or error, authorizing-user permission, connection state, destination URL, and whether related Meta features also fail.
- First safe response action: Check whether the original post reached the destination and isolate the Meta-specific operation without disconnecting the account.
- Escalation or authority gate: Apply `HR-09`. Verify current incident status. Do not retry, delete, or reconnect before the original post and destination state are known.
- Response file: `references/white-label-response-library/SR-014-meta-social-posts-fail-during-disruption.md`

### SR-015: A branded site becomes unavailable

- Primary family: Sites, funnels, forms, domains, DNS, SSL, and publication
- Evidence class: `F1`
- Remediation class: `R1`
- Trend support: A 2026-06-05 incident documented unavailable branded sites. Current domain guidance supplies exact-host and assignment checks.
- Cited raw files: [raw/incidents/2026-06-05-branded-sites-legacy-infrastructure.md] [raw/recent-help/funnel-website-domain-dns.md]
- Minimum safe evidence: Exact domain and URL, account, timestamp, screenshot or error, current DNS records, domain assignment, and repeat result for the same URL.
- First safe response action: Verify current service status and retest the same domain before beginning configuration work.
- Escalation or authority gate: Apply `HR-01` and `HR-13`. Do not change DNS, SSL, assignment, or site content solely because a historical incident produced the same symptom.
- Response file: `references/white-label-response-library/SR-015-branded-site-becomes-unavailable.md`

### SR-016: Published changes do not appear on the live page

- Primary family: Sites, funnels, forms, domains, DNS, SSL, and publication
- Evidence class: `F1`
- Remediation class: `R1`
- Trend support: A 2026-07-10 incident documented delayed cache refresh after publishing. Current website guidance distinguishes saved and published versions.
- Cited raw files: [raw/incidents/2026-07-10-content-publishing-delay.md] [raw/recent-help/website-launch.md]
- Minimum safe evidence: Account, asset and live URL, saved version, published version, publication time, private-browser result, and recent changes.
- First safe response action: Compare the saved version, published version, and live page in a private browser.
- Escalation or authority gate: Apply `HR-13`. Do not repeatedly publish, delete, or recreate the page. Escalate if the verified published version remains absent after current status is checked.
- Response file: `references/white-label-response-library/SR-016-published-changes-not-on-live-page.md`

### SR-017: Production forms cannot be opened

- Primary family: Sites, funnels, forms, domains, DNS, SSL, and publication
- Evidence class: `F1`
- Remediation class: `R1`
- Trend support: A 2026-07-13 incident documented inaccessible forms. Current form and funnel guidance supplies form, embed, submission, and dependency checks.
- Cited raw files: [raw/incidents/2026-07-13-form-service-disruption.md] [raw/recent-help/funnel-launch.md] [raw/official--forms-folder-page-1.md]
- Minimum safe evidence: Form ID and name, account, live or embed URL, page assignment, timestamp, existing submission state, dependent workflows, and safe test conditions.
- First safe response action: Preserve the form and submissions, then test the existing form once with a contact that cannot trigger live charges or customer-facing automation.
- Escalation or authority gate: Apply `HR-13`. Do not replace or republish the production form before its submissions, embed, and dependencies are checked.
- Response file: `references/white-label-response-library/SR-017-production-forms-cannot-be-opened.md`

### SR-018: Funnel Builder opens as a blank page

- Primary family: Sites, funnels, forms, domains, DNS, SSL, and publication
- Evidence class: `F1`
- Remediation class: `R1`
- Trend support: A 2026-08-20 incident documented intermittent blank pages in Funnel Builder. Current funnel guidance supplies domain, assignment, and controlled-test checks.
- Cited raw files: [raw/incidents/2026-08-20-social-planner-funnel-blank-pages.md] [raw/recent-help/funnel-launch.md]
- Minimum safe evidence: Account, funnel and page ID, browser, timestamp, screenshot, saved draft state, recent edits, and clean-browser comparison.
- First safe response action: Preserve draft content outside the editor and check the same funnel in one clean session.
- Escalation or authority gate: Apply `HR-13`. Do not rebuild or delete the funnel, page, or form while object existence and current service status remain unverified.
- Response file: `references/white-label-response-library/SR-018-funnel-builder-opens-as-blank-page.md`

### SR-019: Opportunities tab is blank or bulk actions are unavailable

- Primary family: CRM, opportunities, contacts, imports, and account state
- Evidence class: `F1`
- Remediation class: `R1`
- Trend support: A 2026-08-06 incident documented a blank Opportunities tab and unavailable bulk actions. Current pipeline guidance supplies object and stage checks.
- Cited raw files: [raw/incidents/2026-08-06-opportunities-tab-unavailable.md] [raw/recent-help/pipelines-opportunities-setup.md]
- Minimum safe evidence: Account, affected view, time, expected opportunity count, earlier bulk-action details, audit history, and whether another authorized user can load the tab.
- First safe response action: Determine the execution state of any earlier bulk action and compare expected counts with audit history.
- Escalation or authority gate: Apply `HR-07`. Do not repeat a bulk action until its prior state is known.
- Response file: `references/white-label-response-library/SR-019-opportunities-tab-blank-or-bulk-actions-unavailable.md`

### SR-020: Opportunities are not created or will not move stages

- Primary family: CRM, opportunities, contacts, imports, and account state
- Evidence class: `F1`
- Remediation class: `R1`
- Trend support: A 2026-08-16 incident documented missing opportunity creation and failed pipeline-stage movement. Current pipeline guidance distinguishes manual, import, and workflow creation.
- Cited raw files: [raw/incidents/2026-08-16-opportunities-not-generated.md] [raw/recent-help/pipelines-opportunities-setup.md]
- Minimum safe evidence: Contact, existing opportunities, intended pipeline and stage, workflow and execution time, contact timeline, stage-movement setting, and audit history.
- First safe response action: Search for the existing opportunity and inspect workflow and audit history before creating or moving anything.
- Escalation or authority gate: Apply `HR-07`. Use one controlled action only after the existing record is found or ruled out.
- Response file: `references/white-label-response-library/SR-020-opportunities-not-created-or-moved.md`

### SR-021: Snapshot load remains pending longer than expected

- Primary family: CRM, opportunities, contacts, imports, and account state
- Evidence class: `F1`
- Remediation class: `R1`
- Trend support: A 2026-08-17 incident documented delayed snapshot loads. Current snapshot history guidance identifies version, target, initiator, selected assets, and per-asset status.
- Cited raw files: [raw/incidents/2026-08-17-snapshot-load-delay.md] [raw/recent-help/snapshot-load-history.md]
- Minimum safe evidence: Target account, snapshot, version, initiator, selected asset categories, start time, current load status, and failed-asset list.
- First safe response action: Inspect the existing snapshot load history and per-asset state.
- Escalation or authority gate: Apply `HR-10`. Do not start a second full load while the first may still be processing.
- Response file: `references/white-label-response-library/SR-021-snapshot-load-remains-pending.md`

### SR-022: A user cannot switch between sub-accounts

- Primary family: CRM, opportunities, contacts, imports, and account state
- Evidence class: `F1`
- Remediation class: `UNRESOLVED`
- Trend support: A 2026-07-23 incident documented some users and administrators being unable to switch sub-accounts.
- Cited raw files: [raw/incidents/2026-07-23-sub-account-switching.md] [raw/official--status-incidents-2026-06-to-09.md]
- Minimum safe evidence: User identifier, intended sub-account, current role, expected access, browser session, timestamp, and comparison with another authorized user.
- First safe response action: Confirm intended access and role, then compare switching behavior with another authorized user.
- Escalation or authority gate: Apply `HR-14`. Escalate verified access mismatch. Do not remove and recreate the user, share credentials, or broaden permissions.
- Response file: `references/white-label-response-library/SR-022-user-cannot-switch-sub-accounts.md`

### SR-023: Inbound calls do not reach the mobile app

- Primary family: Phone, call quality, Voice AI, WhatsApp, and conversation AI
- Evidence class: `F1`
- Remediation class: `R1`
- Trend support: A 2026-06-23 incident documented mobile receipt failures after calling preference changed. Current mobile guidance supplies device permission checks.
- Cited raw files: [raw/incidents/2026-06-23-mobile-inbound-calls.md] [raw/recent-help/mobile-call-disconnections.md]
- Minimum safe evidence: Account, user, intended calling channel, current preference, assignment, app and version, notification and microphone permissions, timestamp, and controlled inbound-call result.
- First safe response action: Verify the intended calling channel, user assignment, and mobile permissions, then run one controlled inbound call.
- Escalation or authority gate: Escalate if the controlled call still fails. Do not change organization-wide routing to fix one user without impact review.
- Response file: `references/white-label-response-library/SR-023-inbound-calls-do-not-reach-mobile-app.md`

### SR-024: Voice AI call processing fails

- Primary family: Phone, call quality, Voice AI, WhatsApp, and conversation AI
- Evidence class: `F1`
- Remediation class: `UNRESOLVED`
- Trend support: A 2026-07-23 incident documented disrupted Voice AI call processing.
- Cited raw files: [raw/incidents/2026-07-23-voice-ai-call-processing.md] [raw/official--status-incidents-2026-06-to-09.md]
- Minimum safe evidence: Agent, contact, direction, timestamp, redacted call ID, consent state, call history, contact state, and any partial conversation or follow-up action.
- First safe response action: Review call history and contact state to determine whether a partial call or downstream action already occurred.
- Escalation or authority gate: Do not replay the call. Escalate the redacted evidence after consent and prior side effects are checked.
- Response file: `references/white-label-response-library/SR-024-voice-ai-call-processing-fails.md`

### SR-025: An AI agent does not answer prompts

- Primary family: Phone, call quality, Voice AI, WhatsApp, and conversation AI
- Evidence class: `F1`
- Remediation class: `UNRESOLVED`
- Trend support: A 2026-07-15 incident documented AI agents failing to respond to prompts.
- Cited raw files: [raw/incidents/2026-07-15-ai-agents-not-responding.md] [raw/official--status-incidents-2026-06-to-09.md]
- Minimum safe evidence: Agent ID, channel, contact, timestamp, preserved configuration and prompt, one controlled prompt result, and a minimal redacted transcript segment.
- First safe response action: Preserve configuration and run one controlled prompt without private customer content.
- Escalation or authority gate: Apply `HR-13`. Escalate if the controlled prompt still fails. Do not delete or recreate the agent.
- Response file: `references/white-label-response-library/SR-025-ai-agent-does-not-answer-prompts.md`

### SR-026: WhatsApp AI template generation is unavailable

- Primary family: Phone, call quality, Voice AI, WhatsApp, and conversation AI
- Evidence class: `F1`
- Remediation class: `UNRESOLVED`
- Trend support: A 2026-08-25 incident documented temporary unavailability of AI-assisted WhatsApp template generation.
- Cited raw files: [raw/incidents/2026-08-25-whatsapp-ai-template-generator.md] [raw/official--status-incidents-2026-06-to-09.md]
- Minimum safe evidence: Account, attempted template, timestamp, exact generator behavior, existing approval state, and whether manual template creation is available.
- First safe response action: Preserve existing approved content and determine whether the problem is limited to AI generation.
- Escalation or authority gate: Apply `HR-13`. Do not delete templates, reconnect WhatsApp, or resubmit approved templates solely because the generator fails.
- Response file: `references/white-label-response-library/SR-026-whatsapp-ai-template-generation-unavailable.md`

### SR-027: WhatsApp functions fail during a broader Meta disruption

- Primary family: Phone, call quality, Voice AI, WhatsApp, and conversation AI
- Evidence class: `F1`
- Remediation class: `UNRESOLVED`
- Trend support: The 2026-06-12 Meta service incident included WhatsApp function impact alongside other Meta services.
- Cited raw files: [raw/incidents/2026-06-12-meta-service-disruption.md] [raw/official--status-incidents-2026-06-to-09.md]
- Minimum safe evidence: Account, WhatsApp number and channel, exact function, message or template ID, timestamp, connection state, and whether Meta-linked features fail together.
- First safe response action: Isolate the exact WhatsApp function and preserve a list of failed or uncertain operations.
- Escalation or authority gate: Verify current incident status and escalate the redacted operation list. Do not reconnect the account or retry uncertain sends until prior delivery is checked.
- Response file: `references/white-label-response-library/SR-027-whatsapp-functions-fail-during-meta-disruption.md`

### SR-028: Subscription payment returns a failure

- Primary family: Billing, payments, subscriptions, SaaS, and reconciliation
- Evidence class: `F1`
- Remediation class: `R1`
- Trend support: A 2026-08-05 incident documented subscription payment failures. Current payment guidance distinguishes processor, surface, mode, country, currency, and recurring support.
- Cited raw files: [raw/incidents/2026-08-05-subscription-payment-failures.md] [raw/recent-help/stripe-payment-methods.md]
- Minimum safe evidence: Billing-authorized requester, account, customer, subscription and invoice IDs, amount and currency, processor event, test or live mode, timestamp, and current charge state.
- First safe response action: Verify the invoice, subscription, processor event, and actual customer charge state.
- Escalation or authority gate: Apply `HR-05`. Never request full card or bank credentials. Do not retry or create a replacement subscription until duplicate billing is ruled out.
- Response file: `references/white-label-response-library/SR-028-subscription-payment-returns-failure.md`

### SR-029: Course pages load slowly or time out

- Primary family: Portals, courses, permissions, and white-label account experience
- Evidence class: `F1`
- Remediation class: `R1`
- Trend support: A 2026-07-23 incident documented course page latency and loading timeouts. Current course guidance separates publication, offer, enrollment, and access state.
- Cited raw files: [raw/incidents/2026-07-23-course-page-latency.md] [raw/recent-help/course-launch-and-access.md]
- Minimum safe evidence: Account, course, offer, learner, page URL, timestamp, publication and enrollment state, and comparison with another appropriate learner or network.
- First safe response action: Compare the same page with another authorized learner or network without changing the offer or enrollment.
- Escalation or authority gate: Apply `HR-11`. Do not republish the course, recreate the offer, or re-enroll the learner solely because a page times out.
- Response file: `references/white-label-response-library/SR-029-course-pages-load-slowly-or-time-out.md`

### SR-030: MCP operations fail intermittently

- Primary family: APIs, webhooks, integrations, and attribution bridges
- Evidence class: `F1`
- Remediation class: `UNRESOLVED`
- Trend support: A 2026-08-07 incident documented intermittent MCP operation failures caused by reduced service availability at that time.
- Cited raw files: [raw/incidents/2026-08-07-mcp-service-disruption.md] [raw/official--status-incidents-2026-06-to-09.md]
- Minimum safe evidence: Operation name, timestamp, request or correlation ID, redacted error, affected object IDs, and prior side effects. Never collect credentials, tokens, authorization headers, or full private payloads.
- First safe response action: Capture one failed operation and determine whether it completed or changed data despite the returned error.
- Escalation or authority gate: Apply `HR-06`. Escalate with a redacted minimal record. Do not replay until side effects and idempotency are known.
- Response file: `references/white-label-response-library/SR-030-mcp-operations-fail-intermittently.md`

### SR-031: Marketing email lands in spam or Gmail Promotions

- Primary family: Email delivery, authentication, reputation, links, and reporting
- Evidence class: `F2`
- Remediation class: `R1`
- Trend support: Four independent recent Reddit records report spam or Promotions placement, low engagement, bounces, complaints, and sender-reputation concerns. This repeated symptom does not establish one cause.
- Cited raw files: [raw/reddit--email-deliverability-cluster.md] [raw/reddit/reddit--002--gmail-promotions-low-opens.md] [raw/reddit/reddit--012--cold-email-deliverability.md] [raw/reddit/reddit--027--unverified-email-workflow.md] [raw/reddit/reddit--036--website-visitor-email-reputation.md] [raw/recent-help/spam-filter-blocks.md]
- Minimum safe evidence: Representative recipient, message and timestamp, sending domain, sending path, authentication results, delivery or spam evidence, list source, volume, complaint and bounce signals, content, links, and recent changes.
- First safe response action: Inspect one representative message and its delivery record, then match the observed state to authentication, recipient, list, content, or reputation checks.
- Escalation or authority gate: Apply `HR-02` before any DMARC change. Do not promise inbox placement, instant reputation recovery, or a domain change. Escalate after the documented checks with the redacted message evidence.
- Response file: `references/white-label-response-library/SR-031-marketing-email-lands-in-spam-or-promotions.md`

### SR-032: Transactional messages are suppressed or presented as marketing

- Primary family: Email delivery, authentication, reputation, links, and reporting
- Evidence class: `F2`
- Remediation class: `UNRESOLVED`
- Trend support: Two independent recent Reddit records describe invoices, confirmations, reminders, or requested assets sharing marketing-oriented classification or DND behavior.
- Cited raw files: [raw/reddit/reddit--005--transactional-email-classification.md] [raw/reddit/reddit--042--marketing-transactional-dnd.md]
- Minimum safe evidence: Message purpose, channel, contact, consent and DND state, sending method, workflow, timestamp, expected delivery, actual recipient presentation, and whether other message purposes are affected.
- First safe response action: Preserve the current consent state and classify the exact message purpose and suppression point.
- Escalation or authority gate: These are community-only capability reports. Stop after evidence collection and escalate for current product and consent review. Do not bypass DND or claim that a message is legally transactional.
- Response file: `references/white-label-response-library/SR-032-transactional-messages-suppressed-or-marketing.md`

### SR-033: A2P registration is rejected or cannot be completed

- Primary family: SMS, A2P, consent, filtering, limits, and sender selection
- Evidence class: `F2`
- Remediation class: `R1`
- Trend support: Six independent recent Reddit records describe entity, document, consent, use-case, number, and rejection-code barriers. The current official A2P collection separates brand, campaign, vetting, use-case, and number-linkage paths.
- Cited raw files: [raw/reddit--a2p-registration-cluster.md] [raw/reddit/reddit--013--a2p-indian-sole-proprietor.md] [raw/reddit/reddit--025--a2p-client-onboarding.md] [raw/reddit/reddit--044--a2p-missed-call-consent.md] [raw/reddit/reddit--051--a2p-rejection-codes.md] [raw/reddit/reddit--075--a2p-consent-phone-leads.md] [raw/reddit/reddit--081--reuse-a2p-across-clients.md] [raw/official--a2p-registration-folder.md]
- Minimum safe evidence: Registration, brand, campaign, and number IDs; legal-entity type; use case; current state; exact rejection code; affected field if shown; consent source; and a description of requested documents. Do not request unredacted identity documents by email.
- First safe response action: Identify whether the block is at brand, campaign, vetting, use-case, or number-linkage stage, then address only the displayed requirement.
- Escalation or authority gate: Legal and consent interpretation, regional eligibility, and unexplained rejection codes require a compliance specialist. Use an agency-approved secure upload path if formal documents are required. Do not suggest a bypass provider.
- Response file: `references/white-label-response-library/SR-033-a2p-registration-rejected-or-incomplete.md`

### SR-034: Messaging uses the wrong number or cannot select among multiple numbers

- Primary family: SMS, A2P, consent, filtering, limits, and sender selection
- Evidence class: `F2`
- Remediation class: `R2`
- Trend support: Independent recent Reddit reports describe multi-number selection uncertainty, and current official community-board activity reports unexpected outbound numbers and broken conversation continuity.
- Cited raw files: [raw/reddit/reddit--079--single-number-multiple-channels.md] [raw/reddit/reddit--084--textgrid-multiple-numbers.md] [raw/ideas--sms-sender-selection.md] [raw/official--messaging-folder-page-1.md]
- Minimum safe evidence: Account, contact, channel, inbox or workflow source, expected and actual sender numbers, number capabilities, owner assignment, conversation history, and timestamp.
- First safe response action: Trace one message from its inbox or workflow source to the actual sending number without changing routing.
- Escalation or authority gate: Escalate when documented sender-selection behavior does not explain the result. Do not rotate numbers or replay the message until consent and prior delivery are known.
- Response file: `references/white-label-response-library/SR-034-messaging-uses-wrong-or-unselectable-number.md`

### SR-035: An international number cannot support the requested voice, SMS, or WhatsApp path

- Primary family: SMS, A2P, consent, filtering, limits, and sender selection
- Evidence class: `F2`
- Remediation class: `UNRESOLVED`
- Trend support: Independent recent Reddit records from Switzerland and Australia describe separate voice and SMS numbers, existing-number retention, text-back, WhatsApp, and cost uncertainty.
- Cited raw files: [raw/reddit/reddit--026--swiss-voice-sms-whatsapp.md] [raw/reddit/reddit--064--australia-existing-number-textback.md]
- Minimum safe evidence: Country, business and number type, current carrier, requested channels, existing number, direction, registration state, workflow goal, and expected and actual billing behavior.
- First safe response action: Document the exact country, number, channel, and use case without changing or porting the number.
- Escalation or authority gate: This regional path is community-only. Stop after evidence collection and escalate to a telephony and compliance specialist. Do not promise number portability, channel support, or a compliant workaround.
- Response file: `references/white-label-response-library/SR-035-international-number-channel-support-blocked.md`

### SR-036: Native attribution is blank on a custom or external site

- Primary family: Sites, funnels, forms, domains, DNS, SSL, and publication
- Evidence class: `F2`
- Remediation class: `R1`
- Trend support: Three independent recent Reddit records describe missing opt-in metrics, broken pixel visibility, and blank native attribution on custom, embedded, external, or single-page application flows. Current form guidance covers external tracking.
- Cited raw files: [raw/reddit/reddit--015--custom-code-tracking-gaps.md] [raw/reddit/reddit--018--external-landing-page-integration.md] [raw/reddit/reddit--080--spa-native-attribution-blank.md] [raw/official--forms-folder-page-2.md]
- Minimum safe evidence: Live URL, page type, form or API path, contact ID, submission timestamp, UTM values, expected attribution fields, actual stored fields, pixel or analytics method, and a safe test contact.
- First safe response action: Trace one controlled submission from browser URL through the form or API operation to the resulting contact fields.
- Escalation or authority gate: Do not rewrite production tracking or replay live automation before the controlled trace is complete. Escalate unsupported external or SPA behavior with a redacted minimal reproduction.
- Response file: `references/white-label-response-library/SR-036-native-attribution-blank-on-custom-site.md`

### SR-037: A domain connection remains stuck or stale

- Primary family: Sites, funnels, forms, domains, DNS, SSL, and publication
- Evidence class: `F2`
- Remediation class: `R1`
- Trend support: Three independent recent Reddit records describe an empty asset selector, a persistent conflict after propagation, or stale deleted-domain state that blocks another service. Current domain guidance supplies exact-host checks.
- Cited raw files: [raw/reddit/reddit--049--domain-connection-no-data.md] [raw/reddit/reddit--074--ai-studio-godaddy-domain.md] [raw/reddit/reddit--082--deleted-domain-config-blocks-email.md] [raw/recent-help/funnel-website-domain-dns.md]
- Minimum safe evidence: Account, exact hostname, intended asset and service, authoritative DNS provider, current A, AAAA, CNAME, MX, and proxy state as applicable, assignment, propagation result, and screenshot of the stale state.
- First safe response action: Confirm the active sub-account, intended asset, exact hostname, and current authoritative records before proposing any change.
- Escalation or authority gate: Apply `HR-01` and `HR-13`. Do not delete DNS records, domains, sites, or funnels speculatively. Escalate when authoritative records and assignment match but stale state remains.
- Response file: `references/white-label-response-library/SR-037-domain-connection-remains-stuck-or-stale.md`

### SR-038: Forms disappear from the dashboard or search

- Primary family: Sites, funnels, forms, domains, DNS, SSL, and publication
- Evidence class: `F2`
- Remediation class: `R2`
- Trend support: Three independent recent Reddit records report form freezes, forms missing from sites and the dashboard, or search returning no results while Recent still shows the assets. A recent incident also documented form access disruption.
- Cited raw files: [raw/reddit/reddit--030--form-builder-freeze.md] [raw/reddit/reddit--091--forms-missing-sites-dashboard.md] [raw/reddit/reddit--092--all-forms-gone-search.md] [raw/incidents/2026-07-13-form-service-disruption.md] [raw/official--forms-folder-page-1.md]
- Minimum safe evidence: Account, form ID and name, dashboard view or search term, live and share URLs, browser, timestamp, screenshot, Recent-view result, existing submissions, and page or embed assignment.
- First safe response action: Verify the active account and check whether the same form still appears in Recent or at its existing embed without republishing it.
- Escalation or authority gate: Apply `HR-13`. Escalate a preserved asset inventory if the form remains missing. Do not replace, recreate, or republish before submissions and dependencies are protected.
- Response file: `references/white-label-response-library/SR-038-forms-disappear-from-dashboard-or-search.md`

### SR-039: The support path repeats canned steps or does not reach a specialist

- Primary family: Platform access, performance, and support routing
- Evidence class: `F2`
- Remediation class: `UNRESOLVED`
- Trend support: Three independent recent Reddit records describe repeated canned replies, inaccessible video evidence, unclear premium-support value, or a video-call queue that does not connect.
- Cited raw files: [raw/reddit/reddit--058--support-canned-responses-loom.md] [raw/reddit/reddit--072--premium-support-value.md] [raw/reddit/reddit--095--support-video-bot-never-connects.md]
- Minimum safe evidence: `{agency}` ticket ID, account, original symptom, business impact, timeline, evidence already supplied, steps already repeated, promised escalation or appointment, and the smallest accessible screenshot or redacted sample.
- First safe response action: Consolidate the verified case history into one escalation packet and assign a named `{agency}` owner.
- Escalation or authority gate: These are community-only service-quality reports. Escalate through `{agency}` internal routing and promise only an update that is actually scheduled. Do not claim an upstream escalation or SLA without proof.
- Response file: `references/white-label-response-library/SR-039-support-path-does-not-reach-specialist.md`

### SR-040: Card authorization blocks a trial or signup

- Primary family: Billing, payments, subscriptions, SaaS, and reconciliation
- Evidence class: `F2`
- Remediation class: `R1`
- Trend support: Two independent recent Reddit records describe Visa or Mastercard authorization failure during trial or affiliated signup. Current payment guidance requires surface, processor, country, currency, and mode checks.
- Cited raw files: [raw/reddit/reddit--020--free-trial-card-authentication.md] [raw/reddit/reddit--035--mastercard-debit-authorization.md] [raw/recent-help/stripe-payment-methods.md]
- Minimum safe evidence: Billing-authorized requester, exact signup surface, country and currency, card type and last four digits only if agency policy permits, timestamp, redacted error, processor event if available, and charge state.
- First safe response action: Verify test or live mode, country and currency support, exact surface, and whether any authorization or charge already exists.
- Escalation or authority gate: Apply `HR-05`. Never request a full card number, security code, bank credential, or processor password. Escalate processor or regional authorization after duplicate charge state is ruled out.
- Response file: `references/white-label-response-library/SR-040-card-authorization-blocks-trial-or-signup.md`

### SR-041: A customer disputes a charge after a trial

- Primary family: Billing, payments, subscriptions, SaaS, and reconciliation
- Evidence class: `F2`
- Remediation class: `UNRESOLVED`
- Trend support: Two independent recent Reddit records describe accidental or early trial charges and uncertain refund or restoration handling.
- Cited raw files: [raw/reddit/reddit--024--refund-after-trial-charge.md] [raw/reddit/reddit--078--trial-ended-charged-early.md]
- Minimum safe evidence: Verified billing authority, account, subscription and invoice IDs, trial start and expected end, charge amount and currency, timestamp, processor event, current access state, and the exact requested outcome.
- First safe response action: Acknowledge the dispute and preserve the billing timeline without retrying, refunding, canceling, or restoring anything.
- Escalation or authority gate: Community reports do not establish entitlement or refund policy. Escalate to the authorized billing owner. Do not promise a refund, trial restoration, or deadline.
- Response file: `references/white-label-response-library/SR-041-customer-disputes-charge-after-trial.md`

### SR-042: Portal or course access fails after invitation or enrollment

- Primary family: Portals, courses, permissions, and white-label account experience
- Evidence class: `F2`
- Remediation class: `R1`
- Trend support: Independent recent Reddit records describe affiliate password setup failures and missing course or offer access. Current portal and course guidance separates identity, invitation, publication, enrollment, and entitlement.
- Cited raw files: [raw/reddit/reddit--041--affiliate-portal-password.md] [raw/reddit/reddit--059--course-access-missing.md] [raw/recent-help/client-portal-setup.md] [raw/recent-help/course-launch-and-access.md]
- Minimum safe evidence: Account, intended contact, portal URL, invitation state, course and offer, publication state, enrollment, access workflow, permissions, browser comparison, and purchase history when applicable.
- First safe response action: Verify the intended identity, course publication, offer-to-course association, and enrollment before resending access.
- Escalation or authority gate: Apply `HR-11` and `HR-14`. Do not share another contact's link, broaden permissions, recreate a purchase, or re-enroll before entitlement history is checked.
- Response file: `references/white-label-response-library/SR-042-portal-or-course-access-fails.md`

### SR-043: Review-request automation cannot start or stop as expected

- Primary family: Workflows and automation
- Evidence class: `F2`
- Remediation class: `UNRESOLVED`
- Trend support: Two independent recent Reddit records describe no customer list to start review requests, missing interactive rating controls, and no reliable completion signal to stop reminders.
- Cited raw files: [raw/reddit/reddit--022--review-automation-without-list.md] [raw/reddit/reddit--029--google-review-workflow-details.md]
- Minimum safe evidence: Business and account, consented customer source, intended channel, workflow, trigger, reminder schedule, stop event, current contact state, and one redacted example.
- First safe response action: Map the intended enrollment source and objective stop event without sending a test request to a real customer.
- Escalation or authority gate: This is a community-only capability question. Stop after evidence collection and escalate for current product and consent review. Do not invent a completion event or bypass consent.
- Response file: `references/white-label-response-library/SR-043-review-request-automation-cannot-start-or-stop.md`

### SR-044: Voice AI transfer rings, becomes silent, or hangs up

- Primary family: Phone, call quality, Voice AI, WhatsApp, and conversation AI
- Evidence class: `F2`
- Remediation class: `UNRESOLVED`
- Trend support: Two independent recent Reddit records describe transfer attempts that ring without connecting, fall silent, or hang up after previously working.
- Cited raw files: [raw/reddit/reddit--062--voice-ai-transfer-silence.md] [raw/reddit/reddit--085--voice-ai-transfer-hangup.md]
- Minimum safe evidence: Account, agent, contact, direction, timestamps, redacted call IDs, transfer destination, ringing and voicemail behavior, configuration, consent state, call history, and whether any follow-up occurred.
- First safe response action: Preserve configuration and review one failed transfer and its downstream call history.
- Escalation or authority gate: This is community-only with no sufficiently specific remediation in the archive. Stop after evidence collection and escalate. Do not replay calls or change organization-wide routing.
- Response file: `references/white-label-response-library/SR-044-voice-ai-transfer-silent-or-hangs-up.md`

### SR-045: An external CRM connection or migration leaves data missing

- Primary family: APIs, webhooks, integrations, and attribution bridges
- Evidence class: `F2`
- Remediation class: `UNRESOLVED`
- Trend support: Independent recent Reddit records describe a Follow Up Boss connection that will not stay connected and migration concerns involving records, routing, phone numbers, and data portability.
- Cited raw files: [raw/reddit/reddit--050--zapier-follow-up-boss-disconnect.md] [raw/reddit/reddit--093--follow-up-boss-migration-gaps.md]
- Minimum safe evidence: Source and target accounts, integration path, operation, affected object types and IDs, migration window, mapping, record counts, disconnect time, redacted error, prior retries, and observed side effects.
- First safe response action: Freeze replay and compare a small source-to-target record sample plus connection history.
- Escalation or authority gate: Community-only integration behavior. Apply `HR-06`, stop after evidence collection, and escalate to the implementation owner. Do not reconnect, remigrate, port numbers, or promise data parity.
- Response file: `references/white-label-response-library/SR-045-external-crm-connection-or-migration-misses-data.md`

### SR-046: MCP cannot read or perform the configuration task requested

- Primary family: APIs, webhooks, integrations, and attribution bridges
- Evidence class: `F2`
- Remediation class: `UNRESOLVED`
- Trend support: Independent recent Reddit records describe missing configuration-object reads, undiscoverable IDs, and Conversation AI being unable to use MCP capabilities available elsewhere.
- Cited raw files: [raw/reddit/reddit--038--mcp-read-access-gaps.md] [raw/reddit/reddit--083--conversation-ai-mcp-gap.md]
- Minimum safe evidence: Requested operation, tool and channel, object type and IDs if known, expected capability, actual tool list or redacted error, timestamp, and the minimum field set needed. Never request tokens or full private payloads.
- First safe response action: Record the exact missing read or action and confirm whether a supported tool is exposed without attempting an undocumented endpoint.
- Escalation or authority gate: Community-only capability boundary. Stop after evidence collection and escalate. Do not use undocumented endpoints, expand data retrieval beyond need, or claim the capability exists.
- Response file: `references/white-label-response-library/SR-046-mcp-cannot-read-or-perform-requested-task.md`

### SR-047: The mobile app remains on its loading screen

- Primary family: Platform access, performance, and support routing
- Evidence class: `F3`
- Remediation class: `UNRESOLVED`
- Trend support: One recent Reddit record reports a native mobile app stuck on loading, with multiple participants describing related loading trouble. A browser DNS workaround discussed there does not establish a mobile-app remedy.
- Cited raw files: [raw/reddit--app-loading-issues.md]
- Minimum safe evidence: Account, device and operating-system version, app version, timestamp, network and ISP, browser comparison, alternate-network result, storage state, and screenshot.
- First safe response action: Compare the same account on the native app, browser, and one alternate network without changing system DNS.
- Escalation or authority gate: Stop after evidence collection and escalate if the native app alone remains blocked. Do not reuse a browser workaround or historical DNS incident as the diagnosis.
- Response file: `references/white-label-response-library/SR-047-mobile-app-remains-on-loading-screen.md`

### SR-048: Email statistics are missing or appear incorrect

- Primary family: Email delivery, authentication, reputation, links, and reporting
- Evidence class: `F3`
- Remediation class: `R1`
- Trend support: A recent Reddit record reports delivered messages omitted from reporting, an unexpected unsubscribed address, and expected sends with no recorded attempt. Current official guidance separates metrics by sending method and view.
- Cited raw files: [raw/reddit/reddit--045--email-statistics-inaccurate.md] [raw/official--email-statistics.md]
- Minimum safe evidence: Contact, message or workflow, approximate send time, sending method and provider ownership, reporting view, expected metric, actual metric, delivery record, and one representative recipient.
- First safe response action: Locate the message in the correct sending-method view and compare the specific missing metric with its delivery record.
- Escalation or authority gate: Escalate a reproduced discrepancy with message IDs and timestamps. Do not reset provider credentials, tracking DNS, or webhooks without ownership and impact review.
- Response file: `references/white-label-response-library/SR-048-email-statistics-missing-or-incorrect.md`

### SR-049: A form confirmation email is suppressed for an unverified address

- Primary family: Email delivery, authentication, reputation, links, and reporting
- Evidence class: `F3`
- Remediation class: `R1`
- Trend support: One recent Reddit record reports contact-form acknowledgments not reaching addresses marked unverified. Current delivery guidance separates recipient, configuration, authentication, and sending-path causes.
- Cited raw files: [raw/reddit/reddit--027--unverified-email-workflow.md] [raw/official--email-delivery-troubleshooting-folder.md] [raw/official--email-troubleshooting-folder.md]
- Minimum safe evidence: Contact and address, form and workflow, submission and execution timestamps, verification state, delivery log, exact error or suppression state, and one controlled test address.
- First safe response action: Inspect the form submission, workflow execution, and delivery record for one affected contact.
- Escalation or authority gate: Escalate when current recipient and delivery evidence do not explain suppression. Do not disable verification or resend broadly before the cause and prior delivery are known.
- Response file: `references/white-label-response-library/SR-049-form-confirmation-suppressed-unverified-address.md`

### SR-050: Automated website-visitor outreach harms sender reputation

- Primary family: Email delivery, authentication, reputation, links, and reporting
- Evidence class: `F3`
- Remediation class: `R1`
- Trend support: One recent Reddit record describes automated outreach to identified website visitors increasing complaints, unsubscribes, and bounces and risking the primary sending domain. Current official guidance requires opted-in engaged recipients, healthy lists, controlled volume, and gradual recovery.
- Cited raw files: [raw/reddit/reddit--036--website-visitor-email-reputation.md] [raw/official--email-sending-warmup.md] [raw/recent-help/spam-filter-blocks.md]
- Minimum safe evidence: Campaign and date range, visitor-identification and consent path, sending domain, authentication, volume pattern, bounce, complaint and unsubscribe signals, recipient engagement, content, and links.
- First safe response action: Pause expansion of the affected audience and review list provenance, consent, authentication, and recent reputation signals.
- Escalation or authority gate: Do not guarantee deliverability or advise domain rotation, DMARC weakening, or an immediate resend. Apply `HR-02` to DMARC. Escalate compliance or reputation uncertainty.
- Response file: `references/white-label-response-library/SR-050-website-visitor-outreach-harms-reputation.md`

### SR-051: Consent for automated outbound informational calls is unclear

- Primary family: SMS, A2P, consent, filtering, limits, and sender selection
- Evidence class: `F3`
- Remediation class: `UNRESOLVED`
- Trend support: One recent Reddit record describes uncertainty about whether an existing customer relationship permits automated outbound informational calls without a new consent form.
- Cited raw files: [raw/reddit/reddit--016--automated-outbound-call-consent.md]
- Minimum safe evidence: Business and jurisdiction, caller and recipient relationship, call purpose, automation and voice type, exact prior consent language and capture record, timing, proposed frequency, and opt-out handling.
- First safe response action: Preserve the automation in a non-calling state and document the intended call plus the actual consent record.
- Escalation or authority gate: The archive does not authorize legal interpretation. Stop and escalate to the agency's compliance or legal authority. Do not claim that an existing relationship supplies consent and do not call while authority is unresolved.
- Response file: `references/white-label-response-library/SR-051-automated-outbound-call-consent-unclear.md`

### SR-052: A2P registration reuse across unrelated clients is requested

- Primary family: SMS, A2P, consent, filtering, limits, and sender selection
- Evidence class: `F3`
- Remediation class: `UNRESOLVED`
- Trend support: A recent Reddit record reports registration-cost pressure to reuse one campaign or verified number across many client businesses.
- Cited raw files: [raw/reddit/reddit--081--reuse-a2p-across-clients.md] [raw/official--a2p-registration-folder.md]
- Minimum safe evidence: Each business identity, account, use case, consent path, campaign and brand IDs, numbers, current registration, and reason reuse is requested.
- First safe response action: Keep each client's existing registration and traffic unchanged while documenting the requested cross-client design.
- Escalation or authority gate: Stop and escalate to messaging compliance. Do not state that one brand, campaign, or number can safely represent unrelated businesses and do not recommend a bypass.
- Response file: `references/white-label-response-library/SR-052-a2p-reuse-across-unrelated-clients-requested.md`

### SR-053: A contact remains blocked after sending STOP

- Primary family: SMS, A2P, consent, filtering, limits, and sender selection
- Evidence class: `F3`
- Remediation class: `R1`
- Trend support: A recent Reddit record describes a carrier-level STOP block that cannot be removed by changing a CRM field. Current SMS guidance identifies prior opt-out as a delivery-failure family.
- Cited raw files: [raw/reddit/reddit--071--sms-reconsent-after-stop.md] [raw/official--sms-delivery-troubleshooting.md]
- Minimum safe evidence: Contact, sending and recipient numbers, STOP timestamp and channel, carrier or platform error, CRM DND state, any later inbound keyword, proposed confirmation, and jurisdiction.
- First safe response action: Preserve the carrier and CRM consent state and identify the exact opt-out and any customer-initiated re-consent event.
- Escalation or authority gate: Do not clear consent fields, send promotional confirmation, or override a carrier block. Escalate legal or compliance uncertainty and retry only after the displayed cause and consent state are resolved.
- Response file: `references/white-label-response-library/SR-053-contact-remains-blocked-after-stop.md`

### SR-054: Bulk SMS returns error 3111 or carrier filtering

- Primary family: SMS, A2P, consent, filtering, limits, and sender selection
- Evidence class: `F3`
- Remediation class: `R1`
- Trend support: A recent Reddit record reports large-scale error 3111 and carrier error 30007 even with A2P approval. Current SMS guidance requires error-specific triage and warns against blind retries.
- Cited raw files: [raw/reddit/reddit--061--bulk-sms-error-3111.md] [raw/official--sms-delivery-troubleshooting.md] [raw/official--messaging-folder-page-1.md]
- Minimum safe evidence: Account, campaign or workflow, sending and recipient numbers, timestamp, exact error distribution, A2P state, consent state, content, links, limits, and prior retries.
- First safe response action: Stop the bulk retry and identify the displayed cause for one representative failed recipient.
- Escalation or authority gate: Apply `HR-08`. Fix the displayed cause and confirm restrictions and consent before one controlled retest. Do not label carrier filtering an outage.
- Response file: `references/white-label-response-library/SR-054-bulk-sms-error-3111-or-carrier-filtering.md`

### SR-055: A dynamic image or MMS attachment does not render correctly

- Primary family: SMS, A2P, consent, filtering, limits, and sender selection
- Evidence class: `F3`
- Remediation class: `R1`
- Trend support: A recent Reddit record reports a dynamic image value appearing as a URL instead of inline media. The current messaging collection separates attachment size and recipient-device rendering behavior.
- Cited raw files: [raw/reddit/reddit--047--dynamic-images-in-sms.md] [raw/official--messaging-folder-page-1.md]
- Minimum safe evidence: Sending and recipient numbers, device and carrier, channel, message and timestamp, media type, size, public accessibility without secrets, field value, actual rendering, and exact error.
- First safe response action: Test one supported static attachment of known size to one controlled recipient and compare it with the dynamic-value path.
- Escalation or authority gate: Apply `HR-08` before resending. Escalate when a supported controlled attachment fails. Do not expose private media URLs or repeatedly message real contacts.
- Response file: `references/white-label-response-library/SR-055-dynamic-image-or-mms-does-not-render.md`

### SR-056: Busy events on connected calendars remove expected booking slots

- Primary family: Calendars, availability, synchronization, and booking
- Evidence class: `F3`
- Remediation class: `R2`
- Trend support: A recent Reddit record reports travel events on connected Google calendars suppressing public availability. Evergreen official diagnostics identify third-party conflicts as one missing-slot reason.
- Cited raw files: [raw/reddit/reddit--094--google-calendar-blocks-bookings.md] [raw/official--calendar-missing-slots.md] [raw/official--calendar-troubleshooting-tool.md]
- Minimum safe evidence: Public booking link, calendar and assigned users, affected date and time, timezone, connected calendar and busy event, diagnostic reason code, capacity, buffer, and notice settings.
- First safe response action: Inspect the built-in reason for one missing slot and confirm the exact external busy event before changing availability.
- Escalation or authority gate: Do not reconnect a working calendar or delete an external event speculatively. Escalate when the reason code and conflict state do not explain the slot.
- Response file: `references/white-label-response-library/SR-056-connected-busy-events-remove-booking-slots.md`

### SR-057: Tasks do not synchronize to Google Calendar

- Primary family: Calendars, availability, synchronization, and booking
- Evidence class: `F3`
- Remediation class: `UNRESOLVED`
- Trend support: One recent Reddit record reports no obvious native one-way or two-way path from sales tasks to each representative's Google Calendar. Current public evidence does not establish a supported capability.
- Cited raw files: [raw/reddit/reddit--043--tasks-google-calendar.md] [raw/ideas--tasks-on-calendar.md]
- Minimum safe evidence: Account, task type, assigned user, source and destination calendars, desired direction, required fields and reminders, current integration state, and business reason.
- First safe response action: Document the exact task-to-calendar behavior requested without changing the connected calendar.
- Escalation or authority gate: Community-only product-boundary question. Stop and escalate for a current capability decision. Do not promise that reconnecting or troubleshooting will enable unsupported task sync.
- Response file: `references/white-label-response-library/SR-057-tasks-do-not-sync-to-google-calendar.md`

### SR-058: Class booking lacks required waitlists or membership credits

- Primary family: Calendars, availability, synchronization, and booking
- Evidence class: `F3`
- Remediation class: `UNRESOLVED`
- Trend support: One recent Reddit record reports missing waitlists, membership credit packs, cancellation credit handling, and a complete member-booking experience.
- Cited raw files: [raw/reddit/reddit--055--class-booking-limitations.md]
- Minimum safe evidence: Account, class and capacity model, membership and credit rules, cancellation policy, waitlist order, required portal experience, payment implications, and current configuration.
- First safe response action: Separate the request into booking capacity, waitlist, credit entitlement, cancellation, and portal requirements.
- Escalation or authority gate: Community-only capability question. Stop after evidence collection and escalate to a product or implementation specialist. Do not promise native support or invent a billing workaround.
- Response file: `references/white-label-response-library/SR-058-class-booking-waitlist-or-credits-missing.md`

### SR-059: A large workflow is difficult to test and troubleshoot

- Primary family: Workflows and automation
- Evidence class: `F3`
- Remediation class: `R1`
- Trend support: One recent Reddit record reports an all-in-one customer journey becoming difficult to test and isolate. Current workflow guidance provides execution history, errors, test contacts, and change review.
- Cited raw files: [raw/reddit/reddit--003--large-workflows-hard-to-debug.md] [raw/recent-help/workflow-error-resolution.md] [raw/official--workflow-folders.md]
- Minimum safe evidence: Workflow name and version, trigger, affected path, safe test contact, execution history, exact error, recent changes, integration actions, and expected branch.
- First safe response action: Reproduce one path with a fresh safe test contact and inspect execution history before restructuring the live workflow.
- Escalation or authority gate: Apply `HR-06` before replaying external actions. Human-review any AI-generated repair. Escalate a minimal failing path rather than editing the whole live journey.
- Response file: `references/white-label-response-library/SR-059-large-workflow-difficult-to-troubleshoot.md`

### SR-060: Sequential workflow actions run much later than expected

- Primary family: Workflows and automation
- Evidence class: `F3`
- Remediation class: `R1`
- Trend support: One recent Reddit record reports sporadic multi-minute delays between sequential assignment, opportunity, and webhook actions. Current workflow guidance supplies history and error checks but does not prove a cause.
- Cited raw files: [raw/reddit/reddit--052--workflow-step-delays.md] [raw/recent-help/workflow-error-resolution.md] [raw/official--workflow-folders.md]
- Minimum safe evidence: Workflow and version, affected contact, trigger time, each action's execution time, wait configuration, business-time setting, error history, integration response, and recent changes.
- First safe response action: Build the exact execution timeline for one affected contact and compare configured waits with recorded action times.
- Escalation or authority gate: Do not call the delay throttling or an outage without evidence. Apply `HR-06` before replaying. Escalate the timeline and redacted logs when configuration does not explain the gap.
- Response file: `references/white-label-response-library/SR-060-workflow-actions-run-late.md`

### SR-061: Dragging an opportunity triggers automation for intermediate stages

- Primary family: Workflows and automation
- Evidence class: `F3`
- Remediation class: `R1`
- Trend support: One recent Reddit record reports several stage-based emails firing while an opportunity card was dragged toward a later stage. Current workflow guidance provides execution-history and trigger review.
- Cited raw files: [raw/reddit/reddit--068--pipeline-drag-fires-automation.md] [raw/recent-help/workflow-error-resolution.md] [raw/official--workflow-folders.md]
- Minimum safe evidence: Contact and opportunity IDs, pipeline, starting and intended stages, drag time, every crossed stage, workflow names and versions, execution history, and messages already sent.
- First safe response action: Freeze further movement and reconstruct the stage and workflow timeline for the affected opportunity.
- Escalation or authority gate: Apply `HR-07` and `HR-06`. Do not move the card back, replay workflows, or send corrective messages until existing side effects and recipients are known.
- Response file: `references/white-label-response-library/SR-061-opportunity-drag-triggers-intermediate-automation.md`

### SR-062: Assigning a contact owner changes the AI conversation sender number

- Primary family: Workflows and automation
- Evidence class: `F3`
- Remediation class: `UNRESOLVED`
- Trend support: One recent Reddit record reports an established AI conversation switching from its original workflow number to the assigned team member's number after ownership changed.
- Cited raw files: [raw/reddit/reddit--057--conversation-ai-sender-switch.md] [raw/ideas--sms-sender-selection.md]
- Minimum safe evidence: Account, contact, agent and workflow, owner before and after, assignment time, expected and actual sender numbers, conversation history, routing configuration, and message timestamps.
- First safe response action: Preserve routing and trace the sender before and after the owner-assignment event.
- Escalation or authority gate: The exact AI sender-switch behavior remains community-reported. Stop after evidence collection and escalate. Do not reassign owners, rotate numbers, or replay messages as a test.
- Response file: `references/white-label-response-library/SR-062-owner-assignment-changes-ai-sender-number.md`

### SR-063: AI-collected answers do not persist to contact fields

- Primary family: Workflows and automation
- Evidence class: `F3`
- Remediation class: `UNRESOLVED`
- Trend support: One recent Reddit record reports Conversation AI retaining some collected details but losing others before they reached contact custom fields.
- Cited raw files: [raw/reddit/reddit--033--conversation-ai-custom-fields.md]
- Minimum safe evidence: Account, agent, contact, channel, timestamp, field definitions, redacted transcript excerpts for collected values, expected field map, actual stored values, workflow, and owner changes.
- First safe response action: Preserve the transcript and configuration, then compare one minimal controlled conversation with the resulting contact fields.
- Escalation or authority gate: Community-only behavior with no specific official remediation in the archive. Stop after the controlled evidence capture and escalate. Do not request a full private transcript or overwrite live fields.
- Response file: `references/white-label-response-library/SR-063-ai-answers-do-not-persist-to-contact-fields.md`

### SR-064: A form preview redirects to the website homepage

- Primary family: Sites, funnels, forms, domains, DNS, SSL, and publication
- Evidence class: `F3`
- Remediation class: `UNRESOLVED`
- Trend support: One recent Reddit record reports an existing form preview and prior share URL redirecting to the custom-domain homepage. Its reported browser DNS explanation is not a generally verified remedy.
- Cited raw files: [raw/reddit/reddit--090--form-preview-homepage-redirect.md]
- Minimum safe evidence: Account, form ID and name, preview and share URLs, custom domain, browser and network, timestamp, private-browser and alternate-network results, exact redirect chain, and existing embed state.
- First safe response action: Preserve the form and compare the same preview URL in a private browser and alternate network.
- Escalation or authority gate: Community-only cause. Stop after evidence collection and escalate. Apply `HR-01` before any DNS change and `HR-13` before recreating the form or domain.
- Response file: `references/white-label-response-library/SR-064-form-preview-redirects-to-homepage.md`

### SR-065: Mobile page speed remains poor after basic image optimization

- Primary family: Sites, funnels, forms, domains, DNS, SSL, and publication
- Evidence class: `F3`
- Remediation class: `R2`
- Trend support: One recent Reddit record reports poor mobile PageSpeed and First Contentful Paint after using small WebP images and built-in image optimization. Evergreen official guidance separates images, custom code, CSS, extensions, headers, and runtime behavior.
- Cited raw files: [raw/reddit/reddit--086--ghl-site-mobile-pagespeed.md] [raw/official--funnel-and-website-faq-troubleshooting.md]
- Minimum safe evidence: Live URL, device and browser, test region and time, measured metrics, affected pages and assets, image formats and sizes, custom HTML, JavaScript and CSS, security headers, extensions, and recent changes.
- First safe response action: Reproduce the slow page in a clean session and isolate the largest page-specific asset or custom-code difference without editing production.
- Escalation or authority gate: Apply `HR-13` before removing or recreating assets. Custom-code or security-header changes require an authorized owner, backup, narrow test, impact review, and restoration plan.
- Response file: `references/white-label-response-library/SR-065-mobile-page-speed-poor-after-optimization.md`

### SR-066: Unrelated client websites are placed in one sub-account

- Primary family: Sites, funnels, forms, domains, DNS, SSL, and publication
- Evidence class: `F3`
- Remediation class: `UNRESOLVED`
- Trend support: One recent Reddit record reports plan limits creating pressure to place unrelated client websites in one sub-account, with resulting data and branding isolation concerns.
- Cited raw files: [raw/reddit/reddit--096--multiple-websites-one-subaccount.md]
- Minimum safe evidence: Agency plan, each business and domain, intended account ownership, contacts and data boundaries, branding, users and permissions, integrations, billing, automation, and offboarding needs.
- First safe response action: Stop additional consolidation and document the required isolation boundary for every business.
- Escalation or authority gate: Community-only product and architecture boundary. Stop and escalate before moving data or domains. Do not promise that multiple domains make a shared sub-account safe.
- Response file: `references/white-label-response-library/SR-066-unrelated-websites-share-one-sub-account.md`

### SR-067: Deleted conversation history has no visible recovery path

- Primary family: CRM, opportunities, contacts, imports, and account state
- Evidence class: `F3`
- Remediation class: `UNRESOLVED`
- Trend support: One recent Reddit record reports no obvious self-service recovery path for deleted conversations. The archive contains no official recovery procedure.
- Cited raw files: [raw/reddit/reddit--039--recover-deleted-conversations.md]
- Minimum safe evidence: Account, contact, conversation and channel, deletion time, deleting user if known, affected message range, audit or export availability, business impact, and any retained external copy.
- First safe response action: Preserve current records and collect the deletion timeline without creating replacement messages or altering the contact.
- Escalation or authority gate: Stop and escalate as potential data loss. Do not promise recovery, reconstruct private content from memory, or overwrite audit evidence.
- Response file: `references/white-label-response-library/SR-067-deleted-conversation-has-no-recovery-path.md`

### SR-068: Company records lack a consolidated contact activity history

- Primary family: CRM, opportunities, contacts, imports, and account state
- Evidence class: `F3`
- Remediation class: `UNRESOLVED`
- Trend support: One recent Reddit record reports activity remaining contact-centric instead of consolidating under a business or company record.
- Cited raw files: [raw/reddit/reddit--073--b2b-company-activity-history.md]
- Minimum safe evidence: Account, company and associated contact IDs, required activity types, current views, reporting purpose, user roles, date range, and representative missing activity.
- First safe response action: Confirm that the activities exist on the underlying contacts and document the exact company-level view required.
- Escalation or authority gate: Community-only capability question. Stop after evidence collection and escalate for a current product boundary. Do not promise a hidden setting or merge records to simulate a company timeline.
- Response file: `references/white-label-response-library/SR-068-company-lacks-consolidated-contact-history.md`

### SR-069: Calls disconnect before business or number registration completes

- Primary family: Phone, call quality, Voice AI, WhatsApp, and conversation AI
- Evidence class: `F3`
- Remediation class: `UNRESOLVED`
- Trend support: One recent Reddit record reports immediate call disconnection across new numbers while business registration remained incomplete.
- Cited raw files: [raw/reddit/reddit--014--calls-disconnect-before-registration.md]
- Minimum safe evidence: Account, business and country, number IDs, direction, exact timestamps, redacted call IDs, registration state, displayed warning or error, route target, and whether any number or outside caller succeeds.
- First safe response action: Preserve routing and capture one controlled call plus the exact registration and error state.
- Escalation or authority gate: Regional and registration behavior is community-only. Stop and escalate to telephony and compliance. Do not repeatedly call, request identity documents by email, or promise activation.
- Response file: `references/white-label-response-library/SR-069-calls-disconnect-before-registration-completes.md`

### SR-070: Robocalls overwhelm a business line and hide legitimate leads

- Primary family: Phone, call quality, Voice AI, WhatsApp, and conversation AI
- Evidence class: `F3`
- Remediation class: `UNRESOLVED`
- Trend support: One recent Reddit record reports hundreds of daily robocalls, while current official community-board activity reports junk contacts and paid automation or AI impact from recycled-number spam.
- Cited raw files: [raw/reddit/reddit--077--robocalls-bury-leads.md] [raw/ideas--phone-number-spam.md]
- Minimum safe evidence: Account, number, sample redacted call IDs and timestamps, daily scope, caller patterns, legitimate calls affected, junk contacts, triggered workflows or AI usage, current routing, and business impact.
- First safe response action: Preserve representative call evidence and quantify the effect on routing, contacts, and automation without deploying a new IVR or number.
- Escalation or authority gate: Escalate number reputation, filtering, replacement, or IVR decisions. Do not promise elimination, change routing broadly, or impose a caller barrier without customer-impact review.
- Response file: `references/white-label-response-library/SR-070-robocalls-overwhelm-business-line.md`

### SR-071: WhatsApp media appears in Conversations but is not delivered

- Primary family: Phone, call quality, Voice AI, WhatsApp, and conversation AI
- Evidence class: `F3`
- Remediation class: `UNRESOLVED`
- Trend support: One recent Reddit record reports an attachment appearing in the internal conversation while no WhatsApp media reaches the recipient and an upload result remains null.
- Cited raw files: [raw/reddit/reddit--001--whatsapp-attachments-not-delivered.md]
- Minimum safe evidence: Account, channel and number, message ID, timestamp, recipient, media type and size, delivery state, upload result, non-sensitive public test URL, and whether text-only delivery works.
- First safe response action: Preserve the failed message and compare one small non-sensitive supported file with a text-only controlled message.
- Escalation or authority gate: Community-only case. Stop after evidence collection and escalate. Do not expose private media URLs, resend repeatedly, or claim the endpoint or recipient caused the failure.
- Response file: `references/white-label-response-library/SR-071-whatsapp-media-visible-but-not-delivered.md`

### SR-072: Failed-subscription recovery is too limited for the required process

- Primary family: Billing, payments, subscriptions, SaaS, and reconciliation
- Evidence class: `F3`
- Remediation class: `UNRESOLVED`
- Trend support: One recent Reddit record reports fixed retry timing, no card-expiry warning, a single recovery email, no SMS branch, and no agency-wide recovery view.
- Cited raw files: [raw/reddit/reddit--060--failed-subscription-recovery.md]
- Minimum safe evidence: Billing-authorized requester, account and subscription, invoice and processor event, failure reason, retry history, customer notification history, current charge state, desired recovery sequence, and affected sub-accounts.
- First safe response action: Reconcile the failed payment and existing notifications before designing or triggering any additional recovery step.
- Escalation or authority gate: Community-only capability request. Apply `HR-05` and stop for billing and implementation review. Do not retry, promise recovery, or message the customer until charge and consent state are known.
- Response file: `references/white-label-response-library/SR-072-failed-subscription-recovery-too-limited.md`

### SR-073: Payments cannot be reconciled across cash, Venmo, or partial amounts

- Primary family: Billing, payments, subscriptions, SaaS, and reconciliation
- Evidence class: `F3`
- Remediation class: `UNRESOLVED`
- Trend support: One recent Reddit record reports QuickBooks matching problems when customers pay off-platform or in irregular partial amounts.
- Cited raw files: [raw/reddit/reddit--048--quickbooks-payment-matching.md]
- Minimum safe evidence: Billing authority, account and customer, invoice and expected schedule, processor and external payment references, amounts and currency, payment dates, current balances, accounting record, and desired reconciliation outcome.
- First safe response action: Preserve both systems and build a transaction-by-transaction reconciliation table without creating or deleting payments.
- Escalation or authority gate: Community-only integration case. Stop and escalate to billing and accounting integration owners. Do not fabricate payments, alter settled amounts, or promise automatic matching.
- Response file: `references/white-label-response-library/SR-073-payments-cannot-be-reconciled-across-methods.md`

### SR-074: One-time and recurring service billing is difficult to combine

- Primary family: Billing, payments, subscriptions, SaaS, and reconciliation
- Evidence class: `F3`
- Remediation class: `UNRESOLVED`
- Trend support: One recent Reddit record reports uncertainty about combining setup fees, monthly services, annual services, subscriptions, recurring invoices, and autopay.
- Cited raw files: [raw/reddit/reddit--089--mixed-service-billing.md]
- Minimum safe evidence: Billing authority, each product and price, one-time or recurring intent, cadence, currency, tax and fee rules, desired documents, processor, autopay requirement, start dates, and cancellation behavior.
- First safe response action: Separate each charge by product, amount, cadence, and desired billing object before configuring anything.
- Escalation or authority gate: Community-only configuration gap. Stop and escalate for billing design. Do not create live subscriptions or invoices, promise autopay behavior, or combine incompatible cadences without an approved model.
- Response file: `references/white-label-response-library/SR-074-one-time-and-recurring-billing-hard-to-combine.md`

### SR-075: Mercado Pago renewals fail after the first payment succeeds

- Primary family: Billing, payments, subscriptions, SaaS, and reconciliation
- Evidence class: `F3`
- Remediation class: `UNRESOLVED`
- Trend support: One recent Reddit record reports recurring payments failing for Brazilian customers after successful initial payments, without a clear renewal decline reason.
- Cited raw files: [raw/reddit/reddit--067--mercado-pago-renewal-failure.md]
- Minimum safe evidence: Billing-authorized requester, account, country and currency, processor, customer and subscription IDs, initial and renewal invoice events, timestamps, redacted decline state, manual payment state, and access or provisioning effects.
- First safe response action: Reconcile the first payment, renewal invoice, processor event, subscription, and customer access state.
- Escalation or authority gate: Regional community-only case. Apply `HR-05`, stop, and escalate to the billing integration owner. Do not retry, create a replacement subscription, or promise manual payment will repair renewal.
- Response file: `references/white-label-response-library/SR-075-mercado-pago-renewal-fails-after-first-payment.md`

### SR-076: White-label branding does not propagate to every surface

- Primary family: Portals, courses, permissions, and white-label account experience
- Evidence class: `F3`
- Remediation class: `UNRESOLVED`
- Trend support: One recent Reddit record reports uncertainty around white-label setup, approval, propagation, and mobile-store or system-generated surfaces.
- Cited raw files: [raw/reddit/reddit--019--white-label-branding-process.md]
- Minimum safe evidence: Agency and account, surface inventory, expected and actual brand, domain, app or message context, screenshot, configuration and approval state, last update time, cache or private-browser comparison, and contractual disclosure requirement if any.
- First safe response action: Inventory every affected surface and distinguish configurable branding, stale display, approval state, and externally controlled presentation.
- Escalation or authority gate: Community-only coverage boundary. Stop and escalate for current branding capability and external-surface review. Do not promise complete white labeling or attach screenshots that expose upstream identity.
- Response file: `references/white-label-response-library/SR-076-white-label-branding-not-on-every-surface.md`

### SR-077: Agency-generated messages ignore the sub-account language

- Primary family: Portals, courses, permissions, and white-label account experience
- Evidence class: `F3`
- Remediation class: `UNRESOLVED`
- Trend support: One recent Reddit record reports agency-level automated messages not following the selected sub-account language.
- Cited raw files: [raw/reddit/reddit--032--bilingual-agency-messages.md]
- Minimum safe evidence: Agency and sub-account, user or contact locale, selected language, exact message type, trigger, current template and fallback, expected and actual language, timestamp, and affected scope.
- First safe response action: Preserve templates and identify which message layer generated one incorrect-language example.
- Escalation or authority gate: Community-only behavior. Stop after evidence collection and escalate for current localization ownership. Do not promise automatic translation or overwrite shared templates.
- Response file: `references/white-label-response-library/SR-077-messages-ignore-sub-account-language.md`

### SR-078: A login identity appears as the visible email sender

- Primary family: Email delivery, authentication, reputation, links, and reporting
- Evidence class: `F4`
- Remediation class: `R1`
- Trend support: Current official community-board activity describes a personal login address appearing as the sender when a different brand address is required.
- Cited raw files: [raw/ideas--login-vs-sender-email.md] [raw/official--email-sending-warmup.md] [raw/official--email-troubleshooting-folder.md]
- Minimum safe evidence: User login identifier, connected conversation inbox, sending method, default and workflow sender settings, authenticated sending domain, affected message and timestamp, and visible From and reply address.
- First safe response action: Trace the sender identity for one message across user, inbox, workflow, and authenticated-domain settings.
- Escalation or authority gate: Do not change login identity, domain DNS, or organization-wide defaults until ownership, affected sends, and rollback are known. Apply `HR-01` to DNS changes.
- Response file: `references/white-label-response-library/SR-078-login-identity-appears-as-email-sender.md`

### SR-079: Sending-domain verification or warm-up status is unclear

- Primary family: Email delivery, authentication, reputation, links, and reporting
- Evidence class: `F4`
- Remediation class: `R1`
- Trend support: The 2026-09-04 autocomplete snapshot contains email warmup and verification queries. This is directional search intent without query volume. Current official guidance documents authentication and gradual volume.
- Cited raw files: [raw/autocomplete/gohighlevel-email.md] [raw/official--email-sending-warmup.md] [raw/recent-help/spam-filter-blocks.md]
- Minimum safe evidence: Sending domain, domain age, ownership, sending path, SPF, DKIM and DMARC results, verification and warm-up state, recent daily volume, engagement, list source, and exact warning or error.
- First safe response action: Read the current authentication and warm-up state and pause further volume increase until any displayed issue is classified.
- Escalation or authority gate: Apply `HR-01` and `HR-02`. Do not guarantee recovery time, weaken DMARC, rotate domains, or make DNS changes without owner approval and rollback.
- Response file: `references/white-label-response-library/SR-079-sending-domain-verification-or-warmup-unclear.md`

### SR-080: Messaging reaches a daily, ramp, or restriction limit

- Primary family: SMS, A2P, consent, filtering, limits, and sender selection
- Evidence class: `F4`
- Remediation class: `R1`
- Trend support: The 2026-09-04 autocomplete snapshot includes SMS limit intent, while current official collections expose ramp, daily-limit, restriction-history, and throughput support paths. This does not establish query volume.
- Cited raw files: [raw/autocomplete/gohighlevel-sms.md] [raw/official--messaging-folder-page-1.md] [raw/official--messaging-folder-page-2.md] [raw/official--a2p-registration-folder.md]
- Minimum safe evidence: Account and number, exact error, timestamp, current and recent volume, displayed limit or ramp progress, restriction history, registration state, consent state, and campaign or workflow.
- First safe response action: Stop repeated sends and inspect the specific limit or restriction record.
- Escalation or authority gate: Apply `HR-08`. Do not rotate numbers, split traffic, or replay campaigns to bypass limits. A limit increase requires valid registration, compliant traffic, consent, and owner approval.
- Response file: `references/white-label-response-library/SR-080-messaging-daily-ramp-or-restriction-limit.md`

### SR-081: A business-day booking window shows too few usable dates

- Primary family: Calendars, availability, synchronization, and booking
- Evidence class: `F4`
- Remediation class: `R2`
- Trend support: Current official community-board activity reports booking windows counting closed days and showing too few usable dates. The feature was marked released on 2026-08-27, so a current ticket may be configuration rather than the historical limitation.
- Cited raw files: [raw/ideas--calendar-business-days.md] [raw/official--calendar-missing-slots.md] [raw/official--calendar-troubleshooting-tool.md]
- Minimum safe evidence: Account, public booking link, calendar, assigned user, affected date range, timezone, business-day option state, hours, overrides, notice, window and day limits, and diagnostic reason code.
- First safe response action: Confirm the current business-day option and inspect one missing date in the calendar diagnostic.
- Escalation or authority gate: Change only the setting identified by the current account evidence. Escalate if the released option is present and the reason code does not explain the window.
- Response file: `references/white-label-response-library/SR-081-business-day-window-shows-too-few-dates.md`

### SR-082: Calendar hours or timezone do not match the booking page

- Primary family: Calendars, availability, synchronization, and booking
- Evidence class: `F4`
- Remediation class: `R2`
- Trend support: The 2026-09-04 autocomplete snapshot contains calendar timezone intent. Evergreen official diagnostics identify calendar selection, working hours, overrides, and timezone as separate missing-slot causes.
- Cited raw files: [raw/autocomplete/gohighlevel-calendar.md] [raw/official--calendar-missing-slots.md] [raw/official--calendar-troubleshooting-tool.md]
- Minimum safe evidence: Public link, calendar and assigned user, affected time, expected and displayed timezone, working hours, date overrides, account and user timezone, reason code, and screenshot.
- First safe response action: Run the diagnostic for one affected slot and compare the selected calendar, hours, override, and timezone.
- Escalation or authority gate: Change only the evidence-matched setting. Do not remove all hours, buffers, or limits as a blanket test.
- Response file: `references/white-label-response-library/SR-082-calendar-hours-or-timezone-mismatch.md`

### SR-083: Calendar synchronization or writer permission fails

- Primary family: Calendars, availability, synchronization, and booking
- Evidence class: `F4`
- Remediation class: `R2`
- Trend support: The 2026-09-04 autocomplete snapshot contains calendar integration and sync intent. The official calendar collection distinguishes connection, missing account, writer permission, and general integration breakage.
- Cited raw files: [raw/autocomplete/gohighlevel-calendar.md] [raw/official--calendar-troubleshooting-folder.md] [raw/official--calendar-troubleshooting-tool.md]
- Minimum safe evidence: User and calendar, connected-account identifier without credentials, last successful sync, redacted error, current connection and writer permission, affected events and time range, and whether another user syncs.
- First safe response action: Inspect connection and writer permission without reconnecting the account.
- Escalation or authority gate: Reconnect only after a confirmed connection failure and the authorizing user's approval. Do not request credentials or delete calendar events.
- Response file: `references/white-label-response-library/SR-083-calendar-sync-or-writer-permission-fails.md`

### SR-084: One user needs different permissions in different sub-accounts

- Primary family: Portals, courses, permissions, and white-label account experience
- Evidence class: `F4`
- Remediation class: `UNRESOLVED`
- Trend support: Current official community-board activity reports demand for one identity to hold different permissions across sub-accounts. The record identifies a security-sensitive product limitation, not a verified configuration fix.
- Cited raw files: [raw/ideas--user-permissions-subaccounts.md]
- Minimum safe evidence: User, each sub-account, current role and permissions, required least-privilege differences, business duties, sensitive surfaces, administrator, and consequence of current access.
- First safe response action: Document a per-sub-account least-privilege matrix without changing current access.
- Escalation or authority gate: Apply `HR-14`. Stop and escalate for a current capability and security decision. Do not share credentials or grant broader permissions as a workaround.
- Response file: `references/white-label-response-library/SR-084-user-needs-different-sub-account-permissions.md`

### SR-085: A tracked email link does not open

- Primary family: Email delivery, authentication, reputation, links, and reporting
- Evidence class: `F5`
- Remediation class: `R1`
- Trend support: The current email troubleshooting collection gives broken tracked links a distinct support path. Collection placement supports coverage, not prevalence.
- Cited raw files: [raw/official--email-troubleshooting-folder.md] [raw/official--email-links-not-opening.md] [raw/official--knowledge-base-index.md]
- Minimum safe evidence: Affected message and contact, send time, visible destination, rewritten or tracking hostname if visible, browser result, affected scope, DNS result, and SSL symptom.
- First safe response action: Confirm that the intended destination works, then inspect the tracking hostname, DNS resolution, alignment, and SSL state read-only.
- Escalation or authority gate: Apply `HR-01`. Do not tell the customer to delete records. Any DNS change requires the authorized owner, exact current record, affected-service review, intended target, and rollback.
- Response file: `references/white-label-response-library/SR-085-tracked-email-link-does-not-open.md`

### SR-086: A recipient reply is absent from the conversation inbox

- Primary family: Email delivery, authentication, reputation, links, and reporting
- Evidence class: `F5`
- Remediation class: `R1`
- Trend support: The current email troubleshooting and conversations collections give missing replies and reply metadata distinct support paths. Collection breadth is not a ticket count.
- Cited raw files: [raw/official--email-troubleshooting-folder.md] [raw/official--conversations-folder.md] [raw/official--knowledge-base-index.md]
- Minimum safe evidence: Contact and conversation, original send time, reply time, sender and recipient addresses, sending method, expected inbox, filters and view, reply metadata, and affected scope.
- First safe response action: Inspect the specific contact conversation, message path, and current inbox filters before reconnecting anything.
- Escalation or authority gate: Do not reset credentials, reconnect the service, or alter webhooks without configuration ownership, impact review, and rollback. Never request credentials in email.
- Response file: `references/white-label-response-library/SR-086-recipient-reply-missing-from-inbox.md`

### SR-087: An outbound SMS fails with an unclassified error

- Primary family: SMS, A2P, consent, filtering, limits, and sender selection
- Evidence class: `F5`
- Remediation class: `R1`
- Trend support: SMS delivery failure has a dedicated current troubleshooting article and appears in a broad current messaging collection. This supports ordinary support coverage, not measured frequency.
- Cited raw files: [raw/official--sms-delivery-troubleshooting.md] [raw/official--messaging-folder-page-1.md] [raw/official--knowledge-base-index.md]
- Minimum safe evidence: Account, sending and recipient numbers, message ID, timestamp and timezone, channel, exact error, conversation or workflow, consent and A2P state, and prior retries.
- First safe response action: Inspect the matching conversation, contact timeline, workflow or provider log and classify the failing application, provider, or carrier layer.
- Escalation or authority gate: Apply `HR-08`. Fix the displayed cause, verify prior delivery and consent, then allow only one controlled retest. Do not label an unclassified error an outage.
- Response file: `references/white-label-response-library/SR-087-outbound-sms-fails-with-unclassified-error.md`

### SR-088: The selected number cannot send SMS

- Primary family: SMS, A2P, consent, filtering, limits, and sender selection
- Evidence class: `F5`
- Remediation class: `R1`
- Trend support: Number capability errors have a distinct path in current SMS and messaging troubleshooting collections.
- Cited raw files: [raw/official--sms-delivery-troubleshooting.md] [raw/official--messaging-folder-page-1.md] [raw/official--knowledge-base-index.md]
- Minimum safe evidence: Account, sender and recipient, timestamp, exact capability error, number capabilities, active state, registration and campaign linkage, source conversation or workflow, and dependent routes.
- First safe response action: Verify that the exact selected number is active, SMS-capable, registered where required, and linked to the intended account and campaign.
- Escalation or authority gate: Do not replace, port, or broadly reassign the number until ownership, dependent routes, consent, impact, and rollback are known. Apply `HR-08` before retest.
- Response file: `references/white-label-response-library/SR-088-selected-number-cannot-send-sms.md`

### SR-089: An approved A2P campaign has no linked sending number

- Primary family: SMS, A2P, consent, filtering, limits, and sender selection
- Evidence class: `F5`
- Remediation class: `R1`
- Trend support: The current A2P collection gives an approved campaign without a linked number, including error 30034, a distinct support path.
- Cited raw files: [raw/official--a2p-registration-folder.md] [raw/official--sms-delivery-troubleshooting.md] [raw/official--knowledge-base-index.md]
- Minimum safe evidence: Account, brand and campaign IDs, approved state, exact intended number, displayed association, exact error, business ownership, and other campaigns using the number.
- First safe response action: Confirm account, brand, campaign, and number ownership, then inspect the current number association.
- Escalation or authority gate: Do not reuse or relink a number across customers or active campaigns without compliance and impact review. Apply `HR-08` before a controlled send.
- Response file: `references/white-label-response-library/SR-089-approved-a2p-campaign-has-no-linked-number.md`

### SR-090: A calendar accepts a double booking

- Primary family: Calendars, availability, synchronization, and booking
- Evidence class: `F5`
- Remediation class: `R2`
- Trend support: Double booking has a distinct path in the evergreen official calendar troubleshooting collection. Folder placement supports coverage, not prevalence.
- Cited raw files: [raw/official--calendar-troubleshooting-folder.md] [raw/official--calendar-troubleshooting-tool.md] [raw/official--knowledge-base-index.md]
- Minimum safe evidence: Calendar and assigned user, both appointment IDs and timestamps, timezone, capacity and slot limit, connected conflicts, booking history, notifications, workflows, and payment state.
- First safe response action: Inspect both appointment records and the capacity or conflict reason before editing availability.
- Escalation or authority gate: Do not delete or recreate either appointment until notifications, workflows, payments, and customer impact are checked. Escalate unexplained concurrency with both records.
- Response file: `references/white-label-response-library/SR-090-calendar-accepts-double-booking.md`

### SR-091: A workflow does not enroll an eligible contact

- Primary family: Workflows and automation
- Evidence class: `F5`
- Remediation class: `R1`
- Trend support: Current workflow collections give publication state, enrollment history, trigger filters, and test contacts distinct troubleshooting paths. Collection breadth does not establish frequency.
- Cited raw files: [raw/recent-help/workflow-error-resolution.md] [raw/official--workflow-folders.md] [raw/official--knowledge-base-index.md]
- Minimum safe evidence: Workflow name and version, published state, contact, trigger event and time, field values at trigger time, filters, re-entry state, enrollment history, and expected first action.
- First safe response action: Inspect publication and enrollment history, then compare one fresh safe test contact with every trigger filter.
- Escalation or authority gate: Do not manually enroll, republish, or loosen production filters until prior execution and side effects are ruled out. Apply `HR-06` to any replay.
- Response file: `references/white-label-response-library/SR-091-workflow-does-not-enroll-contact.md`

### SR-092: A contact enters a workflow more than once

- Primary family: Workflows and automation
- Evidence class: `F5`
- Remediation class: `R1`
- Trend support: Current workflow collections expose re-entry and duplicate enrollment as a distinct support intent.
- Cited raw files: [raw/official--workflow-folders.md] [raw/recent-help/workflow-error-resolution.md] [raw/official--knowledge-base-index.md]
- Minimum safe evidence: Workflow and version, contact, all enrollment IDs and times, triggering events, re-entry setting, execution history, and duplicate side effects.
- First safe response action: Compare every enrollment event with the recorded trigger and re-entry setting.
- Escalation or authority gate: Audit duplicate sends, records, charges, appointments, and webhooks before any re-enrollment or resend. Apply `HR-06`.
- Response file: `references/white-label-response-library/SR-092-contact-enters-workflow-more-than-once.md`

### SR-093: A workflow chooses the wrong branch because values race

- Primary family: Workflows and automation
- Evidence class: `F5`
- Remediation class: `R2`
- Trend support: The current workflow collection identifies race conditions between actions as a distinct troubleshooting path. Collection placement supports coverage, not frequency, and does not identify an item-level in-window update for this path.
- Cited raw files: [raw/recent-help/workflow-error-resolution.md] [raw/official--workflow-folders.md] [raw/official--knowledge-base-index.md]
- Minimum safe evidence: Workflow and version, affected contact, condition values at evaluation time, ordered action and update timestamps, action outputs, expected and actual branch, wait configuration, and recent changes.
- First safe response action: Reconstruct the execution order for one safe test contact and identify which value existed when the branch evaluated.
- Escalation or authority gate: Preserve the live version. Reordering requires a safe copy, enrolled-contact impact review, and prior-side-effect audit. Apply `HR-06` before replaying any external action.
- Response file: `references/white-label-response-library/SR-093-workflow-chooses-wrong-branch-from-race.md`

### SR-094: SSL remains pending or a live URL returns 404

- Primary family: Sites, funnels, forms, domains, DNS, SSL, and publication
- Evidence class: `F5`
- Remediation class: `R1`
- Trend support: Current site launch and domain setup records give pending SSL, record conflicts, assignment, default page, path, and 404 behavior distinct support paths. Domain setup also appears in the current popular panel.
- Cited raw files: [raw/recent-help/funnel-website-domain-dns.md] [raw/recent-help/website-launch.md] [raw/official--support-home-popular.md]
- Minimum safe evidence: Full URL, exact hostname and path, authoritative DNS provider and records, proxy mode, assignment, intended and default page, saved and published state, SSL warning, redirects, propagation, and private-browser result.
- First safe response action: Verify authoritative non-conflicting DNS, domain assignment, published page, default page, and exact path without editing them.
- Escalation or authority gate: Apply `HR-01` and `HR-13`. No record deletion, proxy change, page deletion, or SSL replacement without owner authority, impact review, exact target, and rollback.
- Response file: `references/white-label-response-library/SR-094-ssl-pending-or-live-url-returns-404.md`

### SR-095: A form submission does not send the expected notification

- Primary family: Sites, funnels, forms, domains, DNS, SSL, and publication
- Evidence class: `F5`
- Remediation class: `R1`
- Trend support: The current forms collection gives missing internal and automated notifications a distinct support path, with the email-notification material modified inside the trend window.
- Cited raw files: [raw/official--forms-folder-page-1.md] [raw/official--knowledge-base-index.md]
- Minimum safe evidence: Account, form ID and name, live or embed URL, submission ID and time, expected recipient and notification, notification configuration, dependent workflow, delivery state, and a safe test contact.
- First safe response action: Confirm that the submission exists and that its recipient and dependent workflow were configured at submission time.
- Escalation or authority gate: Use one safe test that cannot charge or message real customers. Do not resend broadly or replace the form until prior delivery, submissions, and automation effects are checked.
- Response file: `references/white-label-response-library/SR-095-form-submission-notification-missing.md`

### SR-096: A CRM import skips records or maps fields incorrectly

- Primary family: CRM, opportunities, contacts, imports, and account state
- Evidence class: `F5`
- Remediation class: `R1`
- Trend support: Current import guidance documents error history, unsupported attachments, field-key collisions, label and internal-name differences, and record-level warnings. The support index exposes imports as an ordinary setup collection.
- Cited raw files: [raw/recent-help/hubspot-import.md] [raw/official--knowledge-base-index.md]
- Minimum safe evidence: Source and target accounts, import ID and time, source object types, counts, error and warning exports, representative record IDs, source labels and internal names, destination field keys, attachment expectations, and duplicate setting.
- First safe response action: Preserve all exports, classify the failure or mapping, and test a small representative set in a clean destination when possible.
- Escalation or authority gate: Do not rerun the full production import until mapping, duplicate policy, prior effects, and recovery plan are recorded. Preserve source records and error exports.
- Response file: `references/white-label-response-library/SR-096-crm-import-skips-or-maps-fields-wrong.md`

### SR-097: Duplicate contacts need an irreversible merge

- Primary family: CRM, opportunities, contacts, imports, and account state
- Evidence class: `F5`
- Remediation class: `R1`
- Trend support: Current duplicate-management guidance gives review, permissions, selection limits, master-record choice, and permanent merge effects a distinct support path.
- Cited raw files: [raw/recent-help/duplicate-contact-merge.md] [raw/official--knowledge-base-index.md]
- Minimum safe evidence: Duplicate IDs, proposed master, conflicting fields, payments, orders, invoices, appointments, conversations, tasks, tags, active workflows, permissions, and number of selected records.
- First safe response action: Review the candidates and identify the proposed retained master without executing the merge.
- Escalation or authority gate: Apply `HR-04`. The merge is permanent. Require administrator authority, explicit master confirmation, and financial, appointment, field, and workflow review.
- Response file: `references/white-label-response-library/SR-097-duplicate-contacts-need-irreversible-merge.md`

### SR-098: A connected call has choppy audio, echo, delay, or drops

- Primary family: Phone, call quality, Voice AI, WhatsApp, and conversation AI
- Evidence class: `F5`
- Remediation class: `R1`
- Trend support: Current call-quality guidance gives connected poor-audio symptoms a distinct diagnostic path and separates them from calls that never connect.
- Cited raw files: [raw/recent-help/call-quality.md] [raw/official--support-home-popular.md]
- Minimum safe evidence: Account, user, contact or number, direction, timestamp, app surface and version, network type, selected microphone and headset, warnings, latency, jitter and packet loss when available, and reproducibility.
- First safe response action: Compare one controlled call across available networks and verify the selected audio devices and app state.
- Escalation or authority gate: Do not blame the customer's network, request call credentials or unrestricted content, or change organization-wide routing without comparative evidence. Escalate a redacted call ID and test results.
- Response file: `references/white-label-response-library/SR-098-connected-call-has-poor-audio.md`

### SR-099: A SaaS account, processor, currency, or subscription change is blocked

- Primary family: Billing, payments, subscriptions, SaaS, and reconciliation
- Evidence class: `F5`
- Remediation class: `R1`
- Trend support: Current SaaS guidance documents blocked processor disconnects, account transfers, invalid currency, subscription moves and upgrades, unsupported interval changes, pause, disablement, and wallet effects. SaaS configuration is a current top-level support area.
- Cited raw files: [raw/recent-help/saas-mode-faqs.md] [raw/official--support-home-popular.md] [raw/official--knowledge-base-index.md]
- Minimum safe evidence: Verified billing authority, account and customer, processor, subscription and invoice IDs, plan and interval, currency, wallet balance, active services, source and target, requested outcome, effective date, and current error.
- First safe response action: Inventory balances, subscriptions, processor dependencies, account access, and the exact requested change before taking action.
- Escalation or authority gate: Apply `HR-03`. Require billing authority, impact review, explicit confirmation, and recovery plan. Disabling SaaS cancels the subscription and permanently deletes the wallet. Never imply a refund is automatic.
- Response file: `references/white-label-response-library/SR-099-saas-processor-currency-or-subscription-change-blocked.md`

### SR-100: A legacy V1 API integration is no longer supported

- Primary family: APIs, webhooks, integrations, and attribution bridges
- Evidence class: `F5`
- Remediation class: `R1`
- Trend support: API documentation and version selection lead the current popular-article panel. Current official guidance states that V1 support ended on 2025-12-31 and directs current implementation toward V2 and private integrations where applicable. Popular placement does not expose traffic volume.
- Cited raw files: [raw/recent-help/api-v1-v2.md] [raw/official--support-home-popular.md]
- Minimum safe evidence: Account or location ID, endpoint inventory, HTTP methods, API version, authentication method name, operation, timestamp, correlation ID, redacted error, affected object IDs, mapping, and prior side effects. Never collect keys, tokens, headers, client secrets, or signatures in email.
- First safe response action: Confirm V1 usage, map each required operation to a supported V2 path, and plan one controlled non-production test.
- Escalation or authority gate: Apply `HR-06`. Do not cut over production until endpoint coverage, authentication, mapping, idempotency, side effects, and rollback are verified. Never use an undocumented endpoint.
- Response file: `references/white-label-response-library/SR-100-legacy-v1-api-no-longer-supported.md`
