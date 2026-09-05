# Audit trail: Access Logs (who read a secret) vs. Activity Logs (who changed something)

- URL: https://docs.doppler.com/docs/access-logs ; https://docs.doppler.com/docs/workplace-logs ; https://docs.doppler.com/docs/security-fact-sheet
- Fetched: 2026-08-14
- Source type: Official docs (docs.doppler.com)
- Component: Audit logs / Access logs

## Content

Doppler splits auditing into two distinct systems that are easy to conflate:

### Access Logs - who READ a secret

Per-secret log of which actor accessed it, when (first and most recent access time), and via which access method. Opened from the **Access Log** icon on a secret's row.

"Access" is defined strictly: any request to Doppler that returns a payload containing the secret's value. Doppler optimistically marks a secret as accessed as soon as the payload is returned by the server, regardless of whether it actually reached the requesting client. Secrets with a blank value are not tracked. If a request doesn't get a value back (e.g. the Kubernetes Operator receiving a "no update" response because nothing changed), no access event is recorded. In the dashboard specifically, a secret's value is not fetched/rendered until the user performs an explicit reveal action (click-to-reveal), which is itself the access event.

Tracked actor types in the Access Log: Users, Service Tokens, Personal Access Tokens, CLI Tokens, Terraform Provider (via token), Kubernetes Operator (via token), API (via token).

Every mutation to a secret's name or value creates a new version; access logs are retained per-version, bounded by the plan's access-history retention limit (see pricing page for exact limits - not enumerated in this source).

### Activity Logs / Config Logs - who CHANGED something

Activity Logs cover every team action (adding a member, modifying a secret, etc.), viewable from the Activity Logs page. Config-specific changes (adding/editing/removing a secret) additionally produce a **Config Log**: a "commit style" log for that config which can be rolled back at any point in time (requires the versioning/rollback feature under Doppler's Enclave section).

### Custom Roles gate this data

From the Custom Roles permission table (see the access-control raw file): `logs` (View Logs) shows only the workplace Activity Logs a user already has access to; `logs_audit` (View All Logs, depends on `logs`) is required to see every workplace Activity Log workplace-wide. `enclave_config_access_logs` (depends on View Secrets) is the specific permission gating a user's ability to see the per-secret Access Log described above.

### Forwarding activity logs off-platform (SIEM integration)

Per the April 2026 and June 2026 changelogs (see the changelog raw file), Activity Log forwarding supports multiple simultaneous destinations per service type - Generic HTTPS webhook, Slack, Discord, Microsoft Teams - each independently named/configured/enabled, plus AWS SQS as an Enterprise-only destination. This is the mechanism for piping Doppler's audit trail into an external SIEM or alerting pipeline rather than relying solely on the in-dashboard log view.

### Security Fact Sheet framing (vendor's own words)

"Doppler helps ensure non-repudiation via an immutable audit log. All secret modifications generate an audit log that's attributed to the user that made the change. Secret modifications and other actions can be rolled back from the audit log via users with sufficient permissions." Also states employees cannot access customer secrets, API keys, or audit logs without explicit customer approval - "It is your data, not ours."
