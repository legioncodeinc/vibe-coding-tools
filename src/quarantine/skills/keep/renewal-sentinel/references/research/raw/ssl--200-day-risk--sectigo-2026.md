# Sectigo: Certificate Expiration Risk, 200 Day Validity Starts March 15

- **Title:** Certificate Expiration Risk: 200 Day Validity Starts March 15
- **URL:** https://www.sectigo.com/blog/200-day-ssl-certificate-expiration-risk
- **Fetch date:** 2026-08-17
- **Source type:** vendor-blog (certificate authority; interested in selling certificate lifecycle automation)
- **Publication date:** 2026-02-19

## The change

From 2026-03-15, maximum TLS certificate validity is 200 days. This corroborates the
DigiCert schedule from an independent CA.

## Renewal cadence implied

The source advises treating a 200-day certificate as "renewing at the 180 day mark", which
gives approximately two renewals per year against one previously at 398 days.

It projects the later steps as roughly 3.6 renewals per year at 100-day validity from March
2027, and roughly 7.8 renewals per year at 47-day validity from March 2029.

## What the source does not provide

- Browser behavior detail on expiry.
- API and service failure mode detail.
- Any quantified outage statistics. It references a Forrester study showing "meaningful
  reductions in security and outage risk" from automation but cites no incident data.
- Named case studies.

## Notes for the sentinel

The 180-day renewal target is the useful operating number. It means a certificate issued
today has an action date roughly 20 days before its expiry date, and a 90-day forward
calendar should carry the certificate from about 90 days before expiry with the action date
marked at expiry minus 20.

Read the vendor's framing with the usual discount. Both this source and DigiCert sell the
automation that the shortening schedule makes necessary. The schedule itself is a
CA/Browser Forum ballot outcome and is not in dispute; the urgency framing around it is
marketing.
