# Secret rotation: two-secret strategy, issuer vs. updater, Postgres/AWS/GCP rotation

- URL: https://docs.doppler.com/docs/secrets-rotation ; https://docs.doppler.com/docs/aws-postgres ; https://docs.doppler.com/docs/gcp_cloudsql ; https://www.doppler.com/blog/doppler-secrets-rotation-core-logic
- Fetched: 2026-08-14
- Source type: Official docs + official engineering blog (docs.doppler.com, doppler.com/blog)
- Component: Secret rotation (Team/Enterprise plans)

## Content

### Plan requirement

Rotated Secrets require an upgraded subscription: Team or Enterprise plan.

### What rotation is and why it's hard without a platform

Secret rotation is updating a secret's value on a defined cadence (preferred) or by manual trigger. Doppler frames the historical difficulty as: effort at scale (thousands of secrets for an enterprise), downtime risk without a multi-secret strategy, and sprawl (no guarantee a rotated value propagates everywhere the old one was used) without a centralized platform.

### Two rotation delivery models

- **Proxied rotation**: for services that must stay off the public internet. Doppler uses AWS Lambda functions it deploys into the customer's own AWS account as the proxy. Rotation agents are open source (`github.com/DopplerHQ/secret-agents`) and the invocation payload is signed/validated with Doppler's public key over HTTPS. IAM requirements are least-privilege; audit history for the Lambda lives in the customer's own cloud account.
- **API rotation**: uses the target service's own public API directly (no Lambda proxy needed).

### Rotation requirements on the target service

The service must support: at least two active secret instances at a time (e.g. two DB users), and either programmatic create+delete (issuer) or update (updater) of credentials.

### Two-secret strategy (how zero-downtime rotation works)

Every rotated secret has an **active** and an **inactive** instance. Doppler always returns the active instance on request. Halfway through each rotation interval, active and inactive swap, and the newly-inactive-about-to-become-active instance's value is rotated *before* the swap. Each credential stays valid for two full rotation intervals, so as long as a consuming application re-fetches at least that often, it never holds a dead credential.

Worked example (15-day interval, `appuser1`/`appuser2`):
- Day 0: seed with `appuser1`/`appuser2`; Doppler returns `appuser1`.
- Day 15: Doppler updates `appuser2`'s password and makes it active; returns `appuser2`. `appuser1` still technically valid in the DB but no longer served.
- Day 30: Doppler updates `appuser1`'s password, makes it active again; returns `appuser1`.

### Issuer vs. updater rotation types

- **Issuer**: creates a brand-new secret instance and deletes/inactivates the old one at rotation time. Doppler explicitly states it **prefers issuer because it makes auditability easier**.
- **Updater**: updates the existing instance's value in place (this is what the Postgres/proxied-rotation example above uses - two pre-existing DB users, Doppler just rotates their passwords).

### Rotation interval sizing

Set the interval to at least as long as the slowest-restarting consumer of that credential takes to redeploy, plus buffer. Example given: three apps share a DB credential; the least-frequently-redeployed app restarts every 4 months, so the interval must not be shorter than 4 months or it risks downtime for that app.

### Triggering redeploys on rotation

- Kubernetes Operator can auto-redeploy on secret change (including a rotation).
- Any config change (including rotation) can fire a webhook.
- Any configured integration sync (e.g. to Vercel or GitHub Actions) re-syncs automatically on rotation, same as any other secret change.

### Managing user

Every rotated secret has a "managing user" - the credential Doppler itself uses to authenticate to the target service and perform the rotation. Doppler's strong recommendation: this managing user must be used ONLY for rotation, never for anything else, and its own credentials should live nowhere but inside the Doppler rotated-secret configuration.

### State ownership warning

Once a rotated secret is configured, Doppler considers itself the owner of that secret's state. Manually mutating the credential outside Doppler (e.g. changing a DB password by hand) desyncs Doppler's records from reality; Doppler will then serve a stale/incorrect value and pause rotation until reconciled.

### Postgres/GCP Cloud SQL specifics (representative of the DB-credential rotation pattern most relevant to a Neon-backed app, though Neon itself was not found as a named rotation integration in this research - see distilled gaps)

- AWS Postgres rotation: Doppler updates a Postgres user's password on the defined interval via a Lambda proxy; the database itself is never exposed to the internet and Doppler never needs direct DB access from outside the proxy. Requires a "managing user" able to update other users' passwords, and (if `force_ssl` is on, the AWS default on PG15+) an SSL CA cert pasted into the rotation config.
- GCP Cloud SQL: same two-secret strategy via the Cloud SQL Admin API and a narrowly scoped GCP Service Account instead of a Lambda; supports MySQL, Postgres, and SQL Server.
- Injected secret naming convention: rotation injects a family of secrets prefixed by the rotated-secret name, e.g. `DB_USER_HOST`, `DB_USER_PORT`, `DB_USER_DATABASE`, `DB_USER_USERNAME`, `DB_USER_PASSWORD`.

### Rotation notifications and error handling

Rotations generate an Activity Log entry and (plan-dependent) can forward to Slack/MS Teams/Sumo Logic/Splunk, plus webhook events. On repeated rotation failure, Doppler uses exponential backoff and eventually emails the account; secrets remain on their last-known-good active value and are not disrupted mid-failure.

### Rotation vs. Dynamic Secrets

Dynamic Secrets (leased, short-TTL, generated per-request) are framed as a further-reducing-risk alternative to scheduled rotation, with trade-offs in application architecture and latency that must be weighed - not simply a strict upgrade.
