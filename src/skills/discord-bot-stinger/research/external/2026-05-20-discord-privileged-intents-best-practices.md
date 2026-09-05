---
source_url: https://support-dev.discord.com/hc/en-us/articles/6177533521047-Privileged-Intents-Best-Practices
retrieved_on: 2026-05-20
source_type: official_docs
authority: high
relevance: high
topic: verification-intents
url: https://support-dev.discord.com/hc/en-us/articles/6177533521047
fetched: 2026-05-20
---

# Discord Developer Support: Privileged Intents Best Practices

## Summary

Official Discord guidance on responsible use of privileged intents. Covers least-privilege principle, data sensitivity handling for anonymous/aggregated vs individual data, access control discipline, and user expectations. Discord cannot provide guidance on specific use cases; bots must self-evaluate against these principles.

## Key quotations / statistics

- "Request only the intents your application fundamentally needs."
- "Limit access to only those who need it"
- "Provide clear mechanisms for users to request data deletion"
- "Delete user data as soon as possible (30 days is our recommended maximum)"
- "Always encrypt personally identifiable information (email, phone, address, etc.)"
- "Discord servers are often considered private spaces by users"
- "Ask yourself 'Would users be concerned by how I'm using their data?'"

## Best practices checklist

**Principle of Least Privilege**
- [ ] Only request intents the bot fundamentally needs
- [ ] Consider alternative API endpoints that avoid privileged data
- [ ] Review Message Content Intent Alternatives article

**Data Handling**
- [ ] Anonymize/aggregate where possible
- [ ] Implement team access controls for data
- [ ] Provide user data deletion mechanism
- [ ] Delete user data within 30 days (max)
- [ ] Encrypt PII (email, phone, address)

**User Trust**
- [ ] Restrict server data visibility to appropriate roles
- [ ] Be transparent about data collection in Privacy Policy
- [ ] Consider opt-out mechanisms for features using member/presence data

## Annotations for stinger-forge

- **guides/06-verification-checklist.md**: The 30-day deletion window and privacy policy requirement are HARD requirements for passing the intent application. Bots storing data longer than 30 days WILL be denied.
- **guides/00-principles.md**: The "minimum required Gateway Intents" critical directive in the Command Brief is formally backed by Discord's own best practices documentation.
- The "Would users be concerned?" test is a simple heuristic for evaluating new features during bot design.
