# Delay snapshots loading into sub-accounts

- URL: https://status.gohighlevel.com/incident/1017903
- Fetched: 2026-09-04
- Source type: official-status-incident
- Incident observed: 2026-08-17
- Trend window: 2026-06-04 through 2026-09-04 inclusive
- Window role: direct recent incident evidence

## Captured facts

Snapshots took longer than expected to apply to sub-accounts. The incident stated that existing sub-account data was not affected and later reported normal loading.

## Safety caveat

Do not start a second full snapshot load while the first operation may still be processing. Check load history, snapshot version, target account, selected assets, and current status to avoid duplicate or conflicting changes.
