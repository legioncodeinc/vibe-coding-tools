# Marketplace API degradation

- URL: https://status.gohighlevel.com/incident/1021504
- Fetched: 2026-09-04
- Source type: official-status-incident
- Incident observed: 2026-08-19
- Trend window: 2026-06-04 through 2026-09-04 inclusive
- Window role: direct recent incident evidence

## Captured facts

The Marketplace developer interface was unavailable. Some public API requests, OAuth token refreshes, private integration token checks, workflow triggers, and workflow actions failed or were skipped. The Marketplace UI was also inaccessible.

## Safety caveat

After recovery, audit skipped operations before replaying them. Replays can duplicate contacts, messages, charges, or external side effects. Use operation identifiers and idempotency controls where available, and never request API keys or tokens in email.
