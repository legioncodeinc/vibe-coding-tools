# Red Sift: How expired certificates can cause service downtime and financial losses

- **Title:** A real-world view: How expired certificates can cause service downtime and financial losses
- **URL:** https://blog.redsift.com/certificates/a-real-world-view-how-expired-certificates-can-cause-service-downtime-and-financial-losses/
- **Fetch date:** 2026-08-17
- **Source type:** vendor-blog (certificate monitoring vendor, reporting a third-party survey)
- **Publication date:** 2023-07-06, last updated 2024-12

## Named organizations that suffered expired-certificate incidents

Listed by the source without dates, durations, or dollar figures attached to any individual
incident:

- Shopify, expired root certificate in a staging environment.
- Microsoft, WinGet CDN certificate expiry affecting package installation.
- Microsoft and Spotify, Windows 11 Clock app Spotify integration.
- Starlink, multi-hour downtime from an expired certificate.
- Windows Insider program, temporary unavailability.
- Spotify, Megaphone podcast platform outage.
- LinkedIn, country subdomain certificate expiry.
- US Government, 80 expired certificates rendering websites inaccessible.

## Survey figures, attributed to the Keyfactor 2024 PKI and Digital Trust Report

- Respondents experienced an average of three outages caused by expired certificates over
  24 months.
- Average time to identify: 2.6 hours.
- Average time to remediate: 2.7 hours.
- Estimated cost of an average outage: approximately $2,862,000, derived from a $9,000 per
  minute downtime assumption.

## Reliability assessment

The named incident list is useful and checkable. The $2.86 million figure is not: it is a
per-minute enterprise downtime assumption multiplied by a duration, and it describes large
organizations with revenue-bearing traffic. It has no bearing on a solo operator's site.

The out-of-window publication date is noted deliberately. This is the oldest source in the
archive and it is retained only for the named-incident list and the outage-frequency
observation, both of which are stable facts rather than current-state claims.

## Notes for the sentinel

The usable point: certificate expiry is not a slow degradation, it is an instantaneous full
outage, and organizations with dedicated PKI staff still average roughly one and a half
incidents a year. A solo operator without monitoring is not better positioned.

Never quote the dollar figure to a small-business user. Quote the failure mode.
