# Guide 05: Automation Integration

*Source: `research/external/2026-05-20-monitoring-automation-integration.md`*

---

## Automation philosophy

A status page updated manually during an incident will always be stale. The person with the most context about the incident is also the person least available to update the status page. The correct architecture is:

1. Monitoring alert fires → triggers status page incident creation automatically
2. Human reviews and approves the incident content (optional gate)
3. Subsequent updates can be manual or automated based on monitoring signal changes
4. Resolution is triggered by the monitoring system returning to healthy

The goal is not to remove humans from the loop. It is to remove the step of "now go update the status page" from the on-call engineer's cognitive load during the incident.

---

## Integration patterns by platform

### Atlassian Statuspage: PagerDuty integration

**Native integration:** Statuspage has a native PagerDuty integration that maps PagerDuty incident states to Statuspage incident states.

**Setup:**
1. In Statuspage, go to Integrations → PagerDuty → Connect
2. Map PagerDuty services to Statuspage components
3. Configure Mustache templates for each state transition (triggered, acknowledged, resolved)

**Mustache template variables available:**
- `{{incident.title}}`: PagerDuty incident title
- `{{incident.status}}`: Current PagerDuty status
- `{{service.name}}`: The PagerDuty service name
- `{{escalation_policy.name}}`: Escalation policy name

**Example investigating template:**
```
We are investigating an issue with {{service.name}}. Our team has been paged and is actively working on a resolution. Next update in 30 minutes.
```

**Limitation:** Intermediate PagerDuty updates (notes added to the incident) do NOT automatically update Statuspage. You must manually add updates or configure additional webhook flows.

### Atlassian Statuspage: Webhook-based automation (Datadog, custom)

For monitoring tools without a native Statuspage integration, use the Statuspage REST API:

```bash
# Create an incident
curl -X POST https://api.statuspage.io/v1/pages/{page_id}/incidents \
  -H "Authorization: OAuth {api_key}" \
  -H "Content-Type: application/json" \
  -d '{
    "incident": {
      "name": "[INVESTIGATING] API response time degraded",
      "status": "investigating",
      "body": "We are aware of elevated API response times. Investigating now. Next update in 30 minutes.",
      "component_ids": ["component_id_here"],
      "components": { "component_id_here": "degraded_performance" }
    }
  }'

# Update an incident
curl -X PATCH https://api.statuspage.io/v1/pages/{page_id}/incidents/{incident_id} \
  -H "Authorization: OAuth {api_key}" \
  -H "Content-Type: application/json" \
  -d '{
    "incident": {
      "status": "identified",
      "body": "We have identified the cause: elevated database query latency due to missing index. Fix deploying now. Next update in 15 minutes."
    }
  }'
```

**Datadog webhook to Statuspage:** Configure a Datadog webhook monitor that fires on alert and calls the Statuspage API. Include a `$EVENT_TITLE` and `$ALERT_TRANSITION` in the payload to auto-populate the incident name. Add a 3-retry policy with 30-second delays in Datadog to handle transient API failures.

---

### Better Stack: Native monitoring integration

Better Stack integrates its uptime monitoring directly with its status page. When a monitor fails, Better Stack automatically:
1. Creates a status page incident
2. Updates the incident as the monitor state changes
3. Resolves the incident when the monitor returns to healthy

No external API calls are needed for this basic flow. This is the primary advantage of Better Stack's all-in-one model.

**External PagerDuty integration with Better Stack status pages:**
As of May 2026 research, there is no confirmed direct "PagerDuty alert → Better Stack status page" integration. Teams using PagerDuty as their primary alerter AND Better Stack only for status pages (not its monitoring) must use the Better Stack REST API or a middleware webhook to create incidents.

> TODO (open question): Verify whether Better Stack has released native PagerDuty-to-status-page integration since May 2026. Check https://betterstack.com/changelog.

---

### Instatus: API-driven incident management

Instatus exposes a full incidents API. Setup for automation:

```bash
# Create an incident
curl -X POST https://api.instatus.com/v1/{page_id}/incidents \
  -H "Authorization: Bearer {api_key}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "[INVESTIGATING] API degradation",
    "message": "We are investigating elevated error rates on our API.",
    "components": [{"id": "component_id", "status": "PARTIAL_OUTAGE"}],
    "status": "INVESTIGATING",
    "notify": true
  }'
```

For the full incidents + subscriber management API endpoints, consult https://instatus.com/docs/api directly. The research phase did not fetch the complete API reference; verify endpoint paths before building automation.

---

### OpsGenie integration

OpsGenie supports outbound webhooks on alert state changes. Configure a webhook action in OpsGenie to POST to a small middleware function that maps OpsGenie alert fields to Statuspage/Instatus/Better Stack incident API calls.

**Required field mapping for OpsGenie → Statuspage:**
```json
{
  "action": "{{ action }}",
  "alert.id": "{{ alert.alertId }}",
  "alert.message": "{{ alert.message }}",
  "alert.priority": "{{ alert.priority }}",
  "alert.status": "{{ alert.status }}"
}
```

Map `alert.priority` to Statuspage incident status:
- `P1` + `Create` → `investigating`
- `P1` + `Acknowledge` → `identified`
- `P1` + `Close` → `resolved`

---

## CI/CD maintenance window automation

For scheduled maintenance (deployments, migrations), create and resolve maintenance incidents programmatically from your CI/CD pipeline:

```yaml
# GitHub Actions example
- name: Create maintenance window
  run: |
    curl -X POST https://api.statuspage.io/v1/pages/$PAGE_ID/incidents \
      -H "Authorization: OAuth $STATUSPAGE_API_KEY" \
      -H "Content-Type: application/json" \
      -d "{
        \"incident\": {
          \"name\": \"Scheduled maintenance: Database migration\",
          \"status\": \"scheduled\",
          \"scheduled_for\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
          \"scheduled_until\": \"$(date -u -d '+2 hours' +%Y-%m-%dT%H:%M:%SZ)\",
          \"body\": \"We are performing a scheduled database schema migration. Service will be in read-only mode.\",
          \"component_ids\": [\"$DATABASE_COMPONENT_ID\"]
        }
      }"
  env:
    STATUSPAGE_API_KEY: ${{ secrets.STATUSPAGE_API_KEY }}
    PAGE_ID: ${{ secrets.STATUSPAGE_PAGE_ID }}
    DATABASE_COMPONENT_ID: ${{ secrets.STATUSPAGE_DB_COMPONENT_ID }}
```

Pair this with a post-deployment step that resolves the incident using the incident ID returned in the creation response.

---

## Automation testing checklist

Before enabling automated status page updates in production:

- [ ] Test incident creation in staging/sandbox page before enabling on production page
- [ ] Verify subscriber notifications do fire on automated incidents (some platforms require a "notify" flag)
- [ ] Test the resolution flow to confirm subscriber resolution notification is sent
- [ ] Add monitoring on the automation itself (if the webhook fails, it must alert separately)
- [ ] Document the "automation is broken, what to do manually" runbook section

*See `examples/happy-path-setup.md` for the Instatus automation setup walked end to end.*
