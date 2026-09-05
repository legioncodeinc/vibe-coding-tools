# Some customers unable to load data

- URL: https://status.gohighlevel.com/incident/1032885
- Fetched: 2026-09-04
- Source type: official-status-incident
- Incident observed: 2026-08-25
- Resolved update: 2026-09-01
- Trend window: 2026-06-04 through 2026-09-04 inclusive
- Window role: direct recent incident evidence

## Captured facts

Some customers saw the application shell load while data requests failed. The incident update identified an ISP DNS resolver returning an incorrect address for an API hostname. It documented hostname lookup, secure browser DNS, system DNS, DNS cache flush, and ISP escalation as diagnostic or recovery options.

## Safety caveat

The published resolver addresses and workaround describe one time-bound incident. Do not prescribe DNS changes unless the current hostname lookup reproduces the documented mismatch. System-wide DNS changes may require customer IT approval. Collect the ISP, network, operating system, browser, lookup result, and timestamp first.
