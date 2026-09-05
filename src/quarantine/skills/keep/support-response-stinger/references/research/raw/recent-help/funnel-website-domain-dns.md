# How to Set Up Root Domain/Subdomain for Funnels and Websites

- URL: https://help.gohighlevel.com/support/solutions/articles/48001153720-how-to-set-up-root-domain-subdomain-for-funnels-websites
- Fetched: 2026-09-04
- Source type: official-docs
- Modified at source: 2026-08-20
- Window role: current remediation facts and in-window update
- Customer-output rule: internal reference only; do not name or link the upstream source or platform

## Captured facts

The article distinguishes a root-domain A record from a subdomain CNAME, requires the exact host and value, warns against creating both record types for the same host, and requires Cloudflare records used for site connection to be DNS-only. It covers authoritative DNS lookup, propagation, domain assignment, SSL issuance, redirects, conflicting records, unexpected AAAA records, and intermittent 404 behavior.

## Safety caveat

Never tell a customer to delete DNS records broadly. Confirm the authoritative DNS provider, exact hostname, current services on that hostname, existing records, and intended target before any change. DNS changes can interrupt websites and email.
