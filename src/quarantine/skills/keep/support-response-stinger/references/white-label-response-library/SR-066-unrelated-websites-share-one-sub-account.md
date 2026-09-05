# SR-066: Unrelated client websites are placed in one sub-account

## Use when

Use this response when unrelated client businesses share one sub-account and the customer needs guidance on website, data, branding, access, billing, or offboarding isolation.

## Required evidence

- Agency plan and current sub-account
- Each business identity, domain, and intended account owner
- Contact, submission, and other data boundaries
- Branding, users, roles, and least-privilege requirements
- Integrations, billing, automation, and domain dependencies
- Offboarding, retention, and migration requirements

## Customer-facing email

**Subject:** {ticket_id}: Isolation review for unrelated client websites

Hi {customer_first_name},

I understand multiple unrelated client websites are currently placed in one sub-account. Separate domains alone do not establish safe separation for customer data, branding, users, integrations, billing, or automation, so we need an architecture review before adding another business or moving anything.

Please pause further consolidation and send one inventory:

1. The agency plan, current sub-account, and each business, domain, and intended account owner.
2. The required boundaries for contacts, submissions, other data, branding, users, and permissions.
3. Every integration, billing dependency, automation, and domain dependency shared today.
4. The offboarding, retention, and migration needs for each business.

Redact private customer data. Do not send passwords, verification codes, tokens, billing credentials, domain-provider credentials, or unrestricted exports.

{agency} will document the required isolation boundary for each business and escalate the inventory to our product and implementation specialists. We will not move data or domains, broaden permissions, or promise that the shared structure is safe while this decision is unresolved. I will update you after the architecture review.

{agent_name}
{agency} Support

## Agent notes

- Evidence state: `UNRESOLVED`.
- Stop additional consolidation and document the isolation boundary for every business.
- Escalate to product and implementation specialists before moving data, domains, users, billing, or automation.
- Do not promise that multiple domains make a shared sub-account safe. Any later risky change requires the matching authority, impact review, and rollback plan.
