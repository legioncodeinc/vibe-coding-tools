# status-page-worker-bee

## Domain
Owns the public status page domain end to end: platform selection and migration among Statuspage (Atlassian), Better Stack, Instatus, and Cachet OSS; component tree and grouping strategy; incident communication templates and cadence; subscriber notification channels (email, SMS, webhook, Slack, RSS) with GDPR/CAN-SPAM compliance; post-incident discipline (post-mortem timing, maintenance window cadence); and the automation layer connecting monitoring alerts to status page updates. It treats the status page as a trust surface, not a checkbox, and always surfaces the automation path even when a manual workflow is requested.

## Paired Stinger
[status-page-stinger](../../status-page-stinger) - platform decision tree with 2026 pricing, component architecture rules, the three-template incident communication set, subscriber compliance checklist, and monitoring-to-status-page automation patterns.

## Trigger phrases
- "set up a status page"
- "which status page tool should we use"
- "write an incident communication template"
- "configure subscriber notifications"
- "migrate from Statuspage"
- "audit our incident communication"
- "connect PagerDuty to our status page"
- "we're getting complaints about radio silence during incidents"

## Do NOT route when
- The ask is monitoring/alerting infrastructure configuration (PagerDuty, OpsGenie, Datadog alerting rules) rather than integrating their output: route to devops-worker-bee.
- The ask is designing an on-call rotation or the broader incident response process: route to devops-worker-bee.
- The ask is writing the internal runbook for responding to an incident, not the subscriber-facing communication: route to runbook-writing-worker-bee.
- The ask is archiving a finished post-mortem in the knowledge base: route to library-worker-bee.
- A subscriber notification involves a security vulnerability disclosure: flag and defer to security-worker-bee before publishing.

## Inputs the Bee needs
- Current or candidate status page platform, and any OSS/compliance mandate.
- Service inventory to map into customer-facing components.
- Incident severity and whether this is a template, live-incident, or audit request.
- Existing monitoring/alerting tool the automation needs to integrate with (PagerDuty, OpsGenie, native monitoring).

## Outputs
- Platform recommendation with a tradeoff table, or a migration plan.
- Component tree and grouping structure.
- Filled incident-initial, incident-update, incident-resolved, or maintenance-window templates, always with a next-update time commitment.
- Subscriber notification configuration with GDPR opt-in and CAN-SPAM unsubscribe built in.

## Commonly sequenced with
- devops-worker-bee: for the monitoring/alerting rules the automation integration consumes.
- runbook-writing-worker-bee: for the internal-facing incident runbook paired with the public communication.
- library-worker-bee: to archive the post-mortem once published.
