# DigiCert: TLS Certificate Lifetimes Will Officially Reduce to 47 Days

- **Title:** TLS Certificate Lifetimes Will Officially Reduce to 47 Days
- **URL:** https://www.digicert.com/blog/tls-certificate-lifetimes-will-officially-reduce-to-47-days
- **Fetch date:** 2026-08-17
- **Source type:** vendor-blog (certificate authority reporting on a CA/Browser Forum ballot it voted in; interested in certificate automation demand)
- **Publication date:** 2025 (post-ballot)

## The ballot

CA/Browser Forum ballot SC-081v3, "Introduce Schedule of Reducing Validity and Data Reuse
Periods". Voting period ended 2025-04-11. The proposal originated with Apple. The blog does
not list the full CA vote roll.

Ballot page for cross-reference: https://cabforum.org/2025/04/11/ballot-sc081v3-introduce-schedule-of-reducing-validity-and-data-reuse-periods/
That page confirms the current 398-day maximum, the 47-day end state, and the March 2026 to
March 2029 span, but does not reproduce the intermediate steps.

## Maximum certificate validity, by effective date

| Effective | Maximum validity |
|---|---|
| Until 2026-03-15 | 398 days |
| 2026-03-15 to 2027-03-14 | 200 days |
| 2027-03-15 to 2029-03-14 | 100 days |
| 2029-03-15 onward | 47 days |

## Domain control validation reuse, by effective date

| Effective | Reuse period |
|---|---|
| Until 2026-03-15 | 398 days |
| 2026-03-15 to 2027-03-14 | 200 days |
| 2027-03-15 to 2029-03-14 | 100 days |
| 2029-03-15 onward | 10 days |

## Subject identity information reuse

From 2026-03-15, SII validation reuse drops to 398 days from 825 days. Applies to OV and EV
certificates only.

## Notes for the sentinel

This is why SSL cannot be treated as an annual item any more. As of the fetch date the
schedule has already stepped once: certificates issued on or after 2026-03-15 max out at 200
days, so a certificate is now a roughly twice-a-year event and will be a roughly
quarterly one from March 2027.

The direct consequence for a 90-day forward calendar: a certificate that was outside the
horizon at the last run can be inside it at the next run, and the prior year's expiry date
is a useless predictor because the term length itself changed. Never project a certificate
expiry from last year's date. Read the current certificate's own expiry.
