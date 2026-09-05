# Why Are My Emails Going To Spam?

- URL: https://help.gohighlevel.com/support/solutions/articles/48001063372-why-are-my-emails-going-to-spam-
- Fetched: 2026-09-04
- Source type: official-docs
- Modified at source: 2026-05-11
- Window role: evergreen remediation facts, outside the trend window

## Captured facts

The article distinguishes sender identity, SPF/DKIM/DMARC authentication, list health, internal test behavior, sending volume and frequency, domain reputation, content, links, and complaint rate as separate causes.

The response workflow should collect a representative recipient, timestamp, sending domain, bounce or spam evidence, authentication results, current sending volume, list source, and recent changes before recommending a fix.

## Safety note

The article includes a context-specific suggestion to relax DMARC in some troubleshooting cases. That is not safe as a generic customer instruction. Changing a security policy can reduce spoofing protection. The response component must require an authorized domain owner, a recorded current value, a rollback plan, and specialist review before proposing a DMARC policy change.
