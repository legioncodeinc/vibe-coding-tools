---
source_type: official_docs
authority: high
relevance: high
topic: automation
url: https://support.atlassian.com/statuspage/docs/set-up-a-pagerduty-integration/
date_accessed: 2026-05-20
---

# Monitoring-to-Status-Page Automation Integration (PagerDuty, Datadog, OpsGenie) - 2026

## Key findings

- **The monitoring-to-status-page automation architecture has two layers**:
  1. **Component status automation**: Automatically change component status (e.g., Operational → Major Outage) when a monitoring alert fires.
  2. **Incident creation automation**: Create a public incident on the status page when an alert triggers, with the ability to use templates and auto-fill fields.
  Both layers are independent and can be configured separately.

- **PagerDuty → Statuspage integration** (official Atlassian):
  - Integration is webhook-based: PagerDuty sends webhooks to Statuspage on incident trigger/acknowledge/resolve/update.
  - Capabilities: degrade components on trigger, create incidents from templates, wait for PagerDuty acknowledgment before creating public incident (prevents noise from transient alerts), combine multiple PagerDuty incidents into one Statuspage incident, ignore PagerDuty alerts during active maintenance windows.
  - Mustache templating: embed PagerDuty webhook fields directly into incident name and message body (e.g., `{{pagerduty.incident.assigned_to_user.email}}`).
  - Recommendation: For public status pages, create incidents only after PagerDuty acknowledgment (filters out auto-resolving alerts). For private internal pages, more aggressive automation is appropriate.

- **Datadog → Statuspage integration** (official Datadog docs):
  - Native integration available in Datadog Incident Management Settings → Integrations → Status Pages → Atlassian Statuspage.
  - Also available via Datadog webhooks for custom status page platforms (HTTP POST to any URL, 15-second timeout, 5 retries on 5xx).
  - Datadog webhook variables available for dynamic incident content: service name, alert status, timestamp, metric values.
  - Note: Datadog does NOT support SMS notifications via webhooks for HIPAA-enabled accounts (security restriction).
  - Datadog supports OAuth 2.0 authentication for webhook endpoints (obtain + auto-refresh Bearer tokens).

- **OpsGenie/Opsgenie → Statuspage flow**:
  - OpsGenie integrates natively with Datadog (bidirectional: Datadog alert creates OpsGenie alert; OpsGenie acknowledge/close syncs back to Datadog).
  - For status pages, the common pattern is: monitoring tool → OpsGenie → OpsGenie webhook → status page API.
  - OpsGenie webhook payload includes `action` field ("Create", "Close", "AddNote", "Acknowledge") for mapping to status page lifecycle events.

- **Better Stack native integration**:
  - No external monitoring tool needed - Better Stack monitors feed directly into Better Stack status pages.
  - Incoming webhooks mechanism: any webhook-capable monitoring source can trigger Better Stack incidents programmatically.
  - Status pages automatically reflect monitor state without separate incident creation.

- **Instatus integration approach**:
  - Instatus connects to 20+ monitoring platforms (Datadog, New Relic, Prometheus, Pingdom, UptimeRobot, StatusCake, PagerDuty, Freshping, Grafana, Site24x7).
  - No monitoring is built-in for automation at scale - relies on inbound signals from external monitoring.
  - Full REST API: `POST /v2/:page_id/incidents` for programmatic incident creation.

- **Cachet API automation** (self-hosted):
  - REST JSON API for automated component status updates and incident creation.
  - v3.x webhooks added January 2025 for outbound notifications to external systems when component status changes.
  - No built-in monitoring - requires an external polling script or integration layer.

- **CI/CD maintenance window automation pattern**:
  - Most platforms support creating "scheduled maintenance" events via API.
  - Pattern: deploy pipeline → API call to create maintenance window before deployment → API call to resolve maintenance window after deployment completes.
  - Statuspage scheduled maintenance API: `POST /v1/pages/:page_id/incidents` with `scheduled_for`, `scheduled_until`, `scheduled_remind_prior: true` parameters.

## Quotes / data points

- Atlassian PagerDuty integration docs: "For public-facing status pages, you may want to err on the conservative side of communication. You may only want a single PagerDuty-related incident to be open at a time only after it has been acknowledged and confirmed as a real issue."
- Atlassian: "You can automate just component status changes, just incident creation/updating, or both component and incident changes."
- Datadog on webhook retry logic: "Datadog only issues a retry if there is an internal error... or if Datadog receives a 5XX response from the webhook endpoint. The timeout for any individual request is 15 seconds and missed connections are retried 5 times."
- From the AugmentCode comparison (May 2026): "The incoming webhook mechanism [in Better Stack] gives platform teams programmatic control over incident creation from any webhook-capable source."

## Open questions surfaced

- Is there a PagerDuty → Better Stack native integration (not just webhook-based)? The research shows Better Stack listed as an alternative to Statuspage, but didn't surface a native PagerDuty connector for Better Stack status pages specifically.
- For the Cachet API, what authentication mechanism does v3.x use (API key, OAuth, session)? The v2.x used a user API token.
- Does Instatus's PagerDuty integration support the same "wait for acknowledgment" pattern as Statuspage, or does it create a public incident on every PagerDuty trigger?
