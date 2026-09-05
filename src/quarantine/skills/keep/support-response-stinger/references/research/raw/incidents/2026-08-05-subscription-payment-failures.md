# Subscription Payment Failures

- URL: https://status.gohighlevel.com/incident/996969
- Fetched: 2026-09-04
- Source type: official-status-incident
- Incident observed: 2026-08-05
- Trend window: 2026-06-04 through 2026-09-04 inclusive
- Window role: direct recent incident evidence

## Captured facts

Subscription payment processing returned a "Subscription Payment Failed" error across the platform. The provider deployed a change and reported resolution.

## Safety caveat

Before retrying, confirm the subscription, invoice, processor event, and customer charge state. Do not request full card data and do not create a replacement subscription until duplicate billing has been ruled out.
