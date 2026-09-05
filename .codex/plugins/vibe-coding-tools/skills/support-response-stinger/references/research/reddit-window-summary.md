# Reddit trend window summary

## Scope and result

- Research window: 2026-06-04 through 2026-09-04 inclusive.
- Fetch date: 2026-09-04.
- Source type: public community discussion.
- Distinct Reddit source URLs archived: 96.
- Normalized issue candidates captured: 186.
- Every included individual page displayed an age between 20 hours and 2 months when accessed.
- No page displaying an age of 3 months or older was included.
- Primary community: r/gohighlevel. r/HighLevel was also inspected, but most substantive results were duplicates or crossposts.

The records support a candidate support taxonomy. They do not establish a statistically representative popularity ranking. Cluster counts overlap because one source can support several issue families.

## Cluster counts

| Cluster | Source records | Record IDs |
|---|---:|---|
| api-integrations | 29 | 1, 4, 8, 11, 17, 18, 23, 26, 31, 38, 43, 46, 48, 50, 52, 54, 55, 56, 67, 69, 70, 76, 79, 80, 83, 84, 87, 88, 93 |
| workflows-automation | 24 | 3, 4, 5, 6, 7, 12, 22, 27, 29, 32, 33, 36, 40, 42, 47, 52, 53, 54, 56, 57, 60, 68, 71, 77 |
| forms-sites-domains | 23 | 8, 15, 18, 25, 27, 28, 30, 34, 40, 49, 63, 65, 70, 74, 80, 82, 86, 88, 90, 91, 92, 94, 96 |
| support-access | 20 | 19, 24, 30, 34, 37, 39, 40, 41, 51, 58, 59, 62, 66, 72, 74, 78, 90, 91, 92, 95 |
| a2p-sms-compliance | 17 | 7, 13, 14, 16, 25, 29, 42, 44, 47, 51, 53, 61, 64, 71, 75, 81, 84 |
| phone-voice-whatsapp | 16 | 1, 7, 9, 13, 14, 16, 26, 44, 57, 62, 64, 75, 77, 79, 85, 93 |
| ai-conversation | 15 | 4, 6, 9, 10, 33, 34, 38, 57, 62, 63, 66, 74, 83, 85, 93 |
| billing-payments | 15 | 5, 20, 24, 26, 35, 48, 60, 63, 64, 67, 72, 78, 81, 88, 89 |
| tracking-reporting | 15 | 2, 11, 12, 15, 18, 36, 45, 46, 61, 65, 73, 76, 80, 86, 87 |
| white-label-agency | 15 | 19, 21, 22, 25, 28, 32, 44, 49, 54, 58, 60, 72, 81, 89, 96 |
| crm-data | 13 | 8, 21, 23, 28, 33, 38, 39, 47, 50, 68, 73, 93, 96 |
| email-deliverability | 11 | 2, 5, 12, 17, 27, 32, 36, 42, 45, 56, 82 |
| social-channels | 8 | 6, 10, 17, 21, 31, 37, 69, 79 |
| calendar-booking | 5 | 43, 55, 65, 83, 94 |
| courses-portals | 3 | 41, 55, 59 |
| reputation-reviews | 2 | 22, 29 |

## Repeated issue groups

Only repeat groups supported by two or more distinct source URLs appear below. Each raw record also carries its repeat group so single-source candidates remain traceable.

| Repeat group | Source records | Record IDs |
|---|---:|---|
| a2p-registration | 6 | 13, 25, 44, 51, 75, 81 |
| email-deliverability | 4 | 2, 12, 27, 36 |
| custom-site-attribution | 3 | 15, 18, 80 |
| domain-connection | 3 | 49, 74, 82 |
| form-outage | 3 | 30, 91, 92 |
| social-publishing | 3 | 17, 31, 37 |
| support-quality | 3 | 58, 72, 95 |
| card-authorization | 2 | 20, 35 |
| follow-up-boss-integration | 2 | 50, 93 |
| international-phone-numbers | 2 | 26, 64 |
| mcp-capability-gaps | 2 | 38, 83 |
| multi-channel-number | 2 | 79, 84 |
| plan-feature-gaps | 2 | 54, 96 |
| portal-access | 2 | 41, 59 |
| refund-support | 2 | 24, 78 |
| review-workflows | 2 | 22, 29 |
| transactional-marketing-separation | 2 | 5, 42 |
| voice-ai-transfer | 2 | 62, 85 |

## Source map

| ID | Raw record | Visible age | Candidates | Clusters | Repeat group |
|---:|---|---:|---:|---|---|
| 1 | [reddit--001--whatsapp-attachments-not-delivered.md](raw/reddit/reddit--001--whatsapp-attachments-not-delivered.md) | 2mo | 2 | api-integrations, phone-voice-whatsapp | whatsapp-media-delivery |
| 2 | [reddit--002--gmail-promotions-low-opens.md](raw/reddit/reddit--002--gmail-promotions-low-opens.md) | 1mo | 2 | email-deliverability, tracking-reporting | email-deliverability |
| 3 | [reddit--003--large-workflows-hard-to-debug.md](raw/reddit/reddit--003--large-workflows-hard-to-debug.md) | 9d | 1 | workflows-automation | workflow-maintainability |
| 4 | [reddit--004--workflow-api-creation-gap.md](raw/reddit/reddit--004--workflow-api-creation-gap.md) | 20h | 2 | api-integrations, workflows-automation, ai-conversation | workflow-api-gap |
| 5 | [reddit--005--transactional-email-classification.md](raw/reddit/reddit--005--transactional-email-classification.md) | 4d | 2 | email-deliverability, billing-payments, workflows-automation | transactional-marketing-separation |
| 6 | [reddit--006--meta-bot-human-handoff.md](raw/reddit/reddit--006--meta-bot-human-handoff.md) | 4d | 1 | ai-conversation, social-channels, workflows-automation | ai-human-handoff |
| 7 | [reddit--007--missed-call-textback-verizon.md](raw/reddit/reddit--007--missed-call-textback-verizon.md) | 3d | 2 | phone-voice-whatsapp, workflows-automation, a2p-sms-compliance | missed-call-routing |
| 8 | [reddit--008--survey-personalization-custom-objects.md](raw/reddit/reddit--008--survey-personalization-custom-objects.md) | 8d | 3 | forms-sites-domains, api-integrations, crm-data | survey-personalization |
| 9 | [reddit--009--voice-ai-ivr-navigation.md](raw/reddit/reddit--009--voice-ai-ivr-navigation.md) | 10d | 1 | phone-voice-whatsapp, ai-conversation | voice-ai-routing |
| 10 | [reddit--010--instagram-hidden-requests.md](raw/reddit/reddit--010--instagram-hidden-requests.md) | 6d | 1 | ai-conversation, social-channels | instagram-conversation-ai |
| 11 | [reddit--011--gtm-versus-ghl-tracking.md](raw/reddit/reddit--011--gtm-versus-ghl-tracking.md) | 5d | 1 | tracking-reporting, api-integrations | tracking-configuration |
| 12 | [reddit--012--cold-email-deliverability.md](raw/reddit/reddit--012--cold-email-deliverability.md) | 7d | 3 | email-deliverability, workflows-automation, tracking-reporting | email-deliverability |
| 13 | [reddit--013--a2p-indian-sole-proprietor.md](raw/reddit/reddit--013--a2p-indian-sole-proprietor.md) | 2d | 1 | a2p-sms-compliance, phone-voice-whatsapp | a2p-registration |
| 14 | [reddit--014--calls-disconnect-before-registration.md](raw/reddit/reddit--014--calls-disconnect-before-registration.md) | 17d | 2 | phone-voice-whatsapp, a2p-sms-compliance | phone-registration |
| 15 | [reddit--015--custom-code-tracking-gaps.md](raw/reddit/reddit--015--custom-code-tracking-gaps.md) | 6d | 2 | forms-sites-domains, tracking-reporting | custom-site-attribution |
| 16 | [reddit--016--automated-outbound-call-consent.md](raw/reddit/reddit--016--automated-outbound-call-consent.md) | 5d | 1 | phone-voice-whatsapp, a2p-sms-compliance | automated-call-consent |
| 17 | [reddit--017--blog-social-autopost-subscriptions.md](raw/reddit/reddit--017--blog-social-autopost-subscriptions.md) | 12d | 2 | social-channels, email-deliverability, api-integrations | social-publishing |
| 18 | [reddit--018--external-landing-page-integration.md](raw/reddit/reddit--018--external-landing-page-integration.md) | 8d | 3 | forms-sites-domains, api-integrations, tracking-reporting | custom-site-attribution |
| 19 | [reddit--019--white-label-branding-process.md](raw/reddit/reddit--019--white-label-branding-process.md) | 10d | 3 | white-label-agency, support-access | white-label-setup |
| 20 | [reddit--020--free-trial-card-authentication.md](raw/reddit/reddit--020--free-trial-card-authentication.md) | 8d | 1 | billing-payments | card-authorization |
| 21 | [reddit--021--unified-inbox-subaccounts.md](raw/reddit/reddit--021--unified-inbox-subaccounts.md) | 5d | 1 | white-label-agency, crm-data, social-channels | agency-inbox |
| 22 | [reddit--022--review-automation-without-list.md](raw/reddit/reddit--022--review-automation-without-list.md) | 4d | 2 | reputation-reviews, workflows-automation, white-label-agency | review-workflows |
| 23 | [reddit--023--api-multiple-phone-numbers.md](raw/reddit/reddit--023--api-multiple-phone-numbers.md) | 1mo | 1 | api-integrations, crm-data | contacts-api-field-gaps |
| 24 | [reddit--024--refund-after-trial-charge.md](raw/reddit/reddit--024--refund-after-trial-charge.md) | 23d | 2 | billing-payments, support-access | refund-support |
| 25 | [reddit--025--a2p-client-onboarding.md](raw/reddit/reddit--025--a2p-client-onboarding.md) | 1mo | 4 | a2p-sms-compliance, white-label-agency, forms-sites-domains | a2p-registration |
| 26 | [reddit--026--swiss-voice-sms-whatsapp.md](raw/reddit/reddit--026--swiss-voice-sms-whatsapp.md) | 5d | 2 | phone-voice-whatsapp, billing-payments, api-integrations | international-phone-numbers |
| 27 | [reddit--027--unverified-email-workflow.md](raw/reddit/reddit--027--unverified-email-workflow.md) | 1mo | 1 | email-deliverability, workflows-automation, forms-sites-domains | email-deliverability |
| 28 | [reddit--028--client-offboarding-portability.md](raw/reddit/reddit--028--client-offboarding-portability.md) | 3d | 3 | white-label-agency, forms-sites-domains, crm-data | client-offboarding |
| 29 | [reddit--029--google-review-workflow-details.md](raw/reddit/reddit--029--google-review-workflow-details.md) | 9d | 2 | reputation-reviews, workflows-automation, a2p-sms-compliance | review-workflows |
| 30 | [reddit--030--form-builder-freeze.md](raw/reddit/reddit--030--form-builder-freeze.md) | 1mo | 1 | forms-sites-domains, support-access | form-outage |
| 31 | [reddit--031--nextdoor-posting-gap.md](raw/reddit/reddit--031--nextdoor-posting-gap.md) | 1mo | 1 | social-channels, api-integrations | social-publishing |
| 32 | [reddit--032--bilingual-agency-messages.md](raw/reddit/reddit--032--bilingual-agency-messages.md) | 1mo | 2 | white-label-agency, workflows-automation, email-deliverability | multilingual-agency |
| 33 | [reddit--033--conversation-ai-custom-fields.md](raw/reddit/reddit--033--conversation-ai-custom-fields.md) | 1mo | 2 | ai-conversation, workflows-automation, crm-data | ai-data-capture |
| 34 | [reddit--034--ai-studio-project-404.md](raw/reddit/reddit--034--ai-studio-project-404.md) | 19d | 2 | ai-conversation, forms-sites-domains, support-access | ai-studio-incident |
| 35 | [reddit--035--mastercard-debit-authorization.md](raw/reddit/reddit--035--mastercard-debit-authorization.md) | 13d | 1 | billing-payments | card-authorization |
| 36 | [reddit--036--website-visitor-email-reputation.md](raw/reddit/reddit--036--website-visitor-email-reputation.md) | 20d | 2 | email-deliverability, tracking-reporting, workflows-automation | email-deliverability |
| 37 | [reddit--037--pinterest-scheduling-discovery.md](raw/reddit/reddit--037--pinterest-scheduling-discovery.md) | 1mo | 1 | social-channels, support-access | social-publishing |
| 38 | [reddit--038--mcp-read-access-gaps.md](raw/reddit/reddit--038--mcp-read-access-gaps.md) | 15d | 3 | api-integrations, ai-conversation, crm-data | mcp-capability-gaps |
| 39 | [reddit--039--recover-deleted-conversations.md](raw/reddit/reddit--039--recover-deleted-conversations.md) | 1mo | 1 | crm-data, support-access | data-recovery |
| 40 | [reddit--040--funnel-workflow-dead-canvas.md](raw/reddit/reddit--040--funnel-workflow-dead-canvas.md) | 21d | 2 | forms-sites-domains, workflows-automation, support-access | builder-freeze |
| 41 | [reddit--041--affiliate-portal-password.md](raw/reddit/reddit--041--affiliate-portal-password.md) | 1mo | 2 | courses-portals, support-access | portal-access |
| 42 | [reddit--042--marketing-transactional-dnd.md](raw/reddit/reddit--042--marketing-transactional-dnd.md) | 7d | 2 | a2p-sms-compliance, email-deliverability, workflows-automation | transactional-marketing-separation |
| 43 | [reddit--043--tasks-google-calendar.md](raw/reddit/reddit--043--tasks-google-calendar.md) | 16d | 1 | calendar-booking, api-integrations | calendar-integration |
| 44 | [reddit--044--a2p-missed-call-consent.md](raw/reddit/reddit--044--a2p-missed-call-consent.md) | 8d | 3 | a2p-sms-compliance, phone-voice-whatsapp, white-label-agency | a2p-registration |
| 45 | [reddit--045--email-statistics-inaccurate.md](raw/reddit/reddit--045--email-statistics-inaccurate.md) | 1mo | 3 | tracking-reporting, email-deliverability | email-reporting |
| 46 | [reddit--046--capi-low-emq.md](raw/reddit/reddit--046--capi-low-emq.md) | 1mo | 2 | tracking-reporting, api-integrations | meta-attribution |
| 47 | [reddit--047--dynamic-images-in-sms.md](raw/reddit/reddit--047--dynamic-images-in-sms.md) | 22d | 2 | a2p-sms-compliance, workflows-automation, crm-data | dynamic-messaging |
| 48 | [reddit--048--quickbooks-payment-matching.md](raw/reddit/reddit--048--quickbooks-payment-matching.md) | 1mo | 2 | billing-payments, api-integrations | payment-reconciliation |
| 49 | [reddit--049--domain-connection-no-data.md](raw/reddit/reddit--049--domain-connection-no-data.md) | 1mo | 2 | forms-sites-domains, white-label-agency | domain-connection |
| 50 | [reddit--050--zapier-follow-up-boss-disconnect.md](raw/reddit/reddit--050--zapier-follow-up-boss-disconnect.md) | 1mo | 1 | api-integrations, crm-data | follow-up-boss-integration |
| 51 | [reddit--051--a2p-rejection-codes.md](raw/reddit/reddit--051--a2p-rejection-codes.md) | 14d | 2 | a2p-sms-compliance, support-access | a2p-registration |
| 52 | [reddit--052--workflow-step-delays.md](raw/reddit/reddit--052--workflow-step-delays.md) | 17d | 2 | workflows-automation, api-integrations | workflow-runtime-delay |
| 53 | [reddit--053--sms-help-response-locked.md](raw/reddit/reddit--053--sms-help-response-locked.md) | 1mo | 1 | a2p-sms-compliance, workflows-automation | sms-compliance-responses |
| 54 | [reddit--054--subaccount-creation-from-form.md](raw/reddit/reddit--054--subaccount-creation-from-form.md) | 22d | 2 | white-label-agency, workflows-automation, api-integrations | plan-feature-gaps |
| 55 | [reddit--055--class-booking-limitations.md](raw/reddit/reddit--055--class-booking-limitations.md) | 15d | 4 | calendar-booking, api-integrations, courses-portals | calendar-feature-gaps |
| 56 | [reddit--056--prospecting-tool-niche-b2b.md](raw/reddit/reddit--056--prospecting-tool-niche-b2b.md) | 1mo | 3 | api-integrations, workflows-automation, email-deliverability | outbound-prospecting |
| 57 | [reddit--057--conversation-ai-sender-switch.md](raw/reddit/reddit--057--conversation-ai-sender-switch.md) | 28d | 1 | ai-conversation, phone-voice-whatsapp, workflows-automation | conversation-number-routing |
| 58 | [reddit--058--support-canned-responses-loom.md](raw/reddit/reddit--058--support-canned-responses-loom.md) | 1mo | 3 | support-access, white-label-agency | support-quality |
| 59 | [reddit--059--course-access-missing.md](raw/reddit/reddit--059--course-access-missing.md) | 18d | 2 | courses-portals, support-access | portal-access |
| 60 | [reddit--060--failed-subscription-recovery.md](raw/reddit/reddit--060--failed-subscription-recovery.md) | 1mo | 4 | billing-payments, workflows-automation, white-label-agency | subscription-recovery |
| 61 | [reddit--061--bulk-sms-error-3111.md](raw/reddit/reddit--061--bulk-sms-error-3111.md) | 6d | 2 | a2p-sms-compliance, tracking-reporting | sms-carrier-blocking |
| 62 | [reddit--062--voice-ai-transfer-silence.md](raw/reddit/reddit--062--voice-ai-transfer-silence.md) | 1mo | 2 | phone-voice-whatsapp, ai-conversation, support-access | voice-ai-transfer |
| 63 | [reddit--063--ai-studio-credit-limits.md](raw/reddit/reddit--063--ai-studio-credit-limits.md) | 1mo | 2 | ai-conversation, billing-payments, forms-sites-domains | ai-studio-billing |
| 64 | [reddit--064--australia-existing-number-textback.md](raw/reddit/reddit--064--australia-existing-number-textback.md) | 1mo | 2 | phone-voice-whatsapp, a2p-sms-compliance, billing-payments | international-phone-numbers |
| 65 | [reddit--065--appointment-source-utm.md](raw/reddit/reddit--065--appointment-source-utm.md) | 1mo | 1 | calendar-booking, tracking-reporting, forms-sites-domains | appointment-attribution |
| 66 | [reddit--066--ai-agents-outage.md](raw/reddit/reddit--066--ai-agents-outage.md) | 18d | 1 | ai-conversation, support-access | ai-agent-outage |
| 67 | [reddit--067--mercado-pago-renewal-failure.md](raw/reddit/reddit--067--mercado-pago-renewal-failure.md) | 19d | 3 | billing-payments, api-integrations | subscription-renewal |
| 68 | [reddit--068--pipeline-drag-fires-automation.md](raw/reddit/reddit--068--pipeline-drag-fires-automation.md) | 1mo | 1 | workflows-automation, crm-data | pipeline-triggering |
| 69 | [reddit--069--telegram-multiple-accounts.md](raw/reddit/reddit--069--telegram-multiple-accounts.md) | 1mo | 2 | social-channels, api-integrations | social-channel-gaps |
| 70 | [reddit--070--wordpress-webhook-cors.md](raw/reddit/reddit--070--wordpress-webhook-cors.md) | 2mo | 2 | forms-sites-domains, api-integrations | external-form-webhook |
| 71 | [reddit--071--sms-reconsent-after-stop.md](raw/reddit/reddit--071--sms-reconsent-after-stop.md) | 2mo | 2 | a2p-sms-compliance, workflows-automation | sms-consent-state |
| 72 | [reddit--072--premium-support-value.md](raw/reddit/reddit--072--premium-support-value.md) | 21d | 1 | support-access, billing-payments, white-label-agency | support-quality |
| 73 | [reddit--073--b2b-company-activity-history.md](raw/reddit/reddit--073--b2b-company-activity-history.md) | 2d | 2 | crm-data, tracking-reporting | b2b-crm-gaps |
| 74 | [reddit--074--ai-studio-godaddy-domain.md](raw/reddit/reddit--074--ai-studio-godaddy-domain.md) | 2mo | 2 | forms-sites-domains, ai-conversation, support-access | domain-connection |
| 75 | [reddit--075--a2p-consent-phone-leads.md](raw/reddit/reddit--075--a2p-consent-phone-leads.md) | 2mo | 1 | a2p-sms-compliance, phone-voice-whatsapp | a2p-registration |
| 76 | [reddit--076--undocumented-api-pagination-webhooks.md](raw/reddit/reddit--076--undocumented-api-pagination-webhooks.md) | 20d | 4 | api-integrations, tracking-reporting | api-reliability |
| 77 | [reddit--077--robocalls-bury-leads.md](raw/reddit/reddit--077--robocalls-bury-leads.md) | 2mo | 2 | phone-voice-whatsapp, workflows-automation | inbound-call-abuse |
| 78 | [reddit--078--trial-ended-charged-early.md](raw/reddit/reddit--078--trial-ended-charged-early.md) | 2mo | 2 | billing-payments, support-access | refund-support |
| 79 | [reddit--079--single-number-multiple-channels.md](raw/reddit/reddit--079--single-number-multiple-channels.md) | 1mo | 3 | phone-voice-whatsapp, social-channels, api-integrations | multi-channel-number |
| 80 | [reddit--080--spa-native-attribution-blank.md](raw/reddit/reddit--080--spa-native-attribution-blank.md) | 19d | 2 | tracking-reporting, forms-sites-domains, api-integrations | custom-site-attribution |
| 81 | [reddit--081--reuse-a2p-across-clients.md](raw/reddit/reddit--081--reuse-a2p-across-clients.md) | 1mo | 2 | a2p-sms-compliance, white-label-agency, billing-payments | a2p-registration |
| 82 | [reddit--082--deleted-domain-config-blocks-email.md](raw/reddit/reddit--082--deleted-domain-config-blocks-email.md) | 1mo | 1 | forms-sites-domains, email-deliverability | domain-connection |
| 83 | [reddit--083--conversation-ai-mcp-gap.md](raw/reddit/reddit--083--conversation-ai-mcp-gap.md) | 2mo | 2 | ai-conversation, api-integrations, calendar-booking | mcp-capability-gaps |
| 84 | [reddit--084--textgrid-multiple-numbers.md](raw/reddit/reddit--084--textgrid-multiple-numbers.md) | 2mo | 1 | a2p-sms-compliance, api-integrations | multi-channel-number |
| 85 | [reddit--085--voice-ai-transfer-hangup.md](raw/reddit/reddit--085--voice-ai-transfer-hangup.md) | 2mo | 1 | phone-voice-whatsapp, ai-conversation | voice-ai-transfer |
| 86 | [reddit--086--ghl-site-mobile-pagespeed.md](raw/reddit/reddit--086--ghl-site-mobile-pagespeed.md) | 1mo | 2 | forms-sites-domains, tracking-reporting | site-performance |
| 87 | [reddit--087--google-ads-integration-discovery.md](raw/reddit/reddit--087--google-ads-integration-discovery.md) | 2mo | 1 | api-integrations, tracking-reporting | google-ads-integration |
| 88 | [reddit--088--wordpress-ghl-subscription-state.md](raw/reddit/reddit--088--wordpress-ghl-subscription-state.md) | 2mo | 2 | billing-payments, api-integrations, forms-sites-domains | subscription-integration |
| 89 | [reddit--089--mixed-service-billing.md](raw/reddit/reddit--089--mixed-service-billing.md) | 1mo | 4 | billing-payments, white-label-agency | billing-configuration |
| 90 | [reddit--090--form-preview-homepage-redirect.md](raw/reddit/reddit--090--form-preview-homepage-redirect.md) | 2mo | 2 | forms-sites-domains, support-access | form-routing |
| 91 | [reddit--091--forms-missing-sites-dashboard.md](raw/reddit/reddit--091--forms-missing-sites-dashboard.md) | 9d | 1 | forms-sites-domains, support-access | form-outage |
| 92 | [reddit--092--all-forms-gone-search.md](raw/reddit/reddit--092--all-forms-gone-search.md) | 11d | 2 | forms-sites-domains, support-access | form-outage |
| 93 | [reddit--093--follow-up-boss-migration-gaps.md](raw/reddit/reddit--093--follow-up-boss-migration-gaps.md) | 2mo | 5 | crm-data, api-integrations, phone-voice-whatsapp, ai-conversation | follow-up-boss-integration |
| 94 | [reddit--094--google-calendar-blocks-bookings.md](raw/reddit/reddit--094--google-calendar-blocks-bookings.md) | 2mo | 2 | calendar-booking, forms-sites-domains | calendar-availability |
| 95 | [reddit--095--support-video-bot-never-connects.md](raw/reddit/reddit--095--support-video-bot-never-connects.md) | 2mo | 1 | support-access | support-quality |
| 96 | [reddit--096--multiple-websites-one-subaccount.md](raw/reddit/reddit--096--multiple-websites-one-subaccount.md) | 2mo | 2 | forms-sites-domains, white-label-agency, crm-data | plan-feature-gaps |

## Access and date caveats

- Reddit exposed relative ages rather than stable UTC creation timestamps in the anonymous readable pages.
- Some pages were served from search caches captured at different times. A visible age such as 5d means five days before that page's crawl, not necessarily five days before 2026-09-04.
- Every retained page remained safely inside the requested window because no included page displayed more than 2 months of age.
- Reddit public JSON and API requests returned HTTP 403 from this environment.
- Reddit RSS could not be processed through the available page reader, and direct Firecrawl scraping of Reddit was unsupported.
- Anonymous Reddit output frequently omitted upvote and comment totals. No engagement totals were invented.
- Duplicate listings and crossposts were collapsed to one source URL.
- One recent AI workflow listing was removed by Reddit filters after discovery. Its removed body was not used as primary evidence.
- Community replies can contain promotional, incomplete, or incorrect workarounds. Each raw record marks this limitation, and any remedy must be verified against current provider documentation before use in a customer response.

## Interpretation guidance

Use cluster and repeat counts to prioritize which support-email families deserve early coverage. Use the normalized candidates to split broad threads into specific customer intents. Before a response template is published, verify the operational steps independently and remove any provider branding or external help-center links required to keep the customer-facing response white label.

