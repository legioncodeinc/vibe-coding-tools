# SR-064: A form preview redirects to the website homepage

## Use when

Use this response when an existing form preview or share address redirects to the website homepage instead of opening the form.

## Required evidence

- Account, form identifier, and form name
- Affected preview and share addresses
- Custom domain, browser, network, timestamp, and timezone
- Private-browser and alternate-network results
- Exact redirect chain with private query data redacted
- Current embed state and recent domain or form changes

## Customer-facing email

**Subject:** {ticket_id}: Form preview redirects to the homepage

Hi {customer_first_name},

I understand the form preview is opening the website homepage instead of the form. We have not confirmed the cause, so please preserve the form, domain, and current embed while we compare the redirect in clean contexts.

Please do not change domain records or recreate the form. Send us:

1. The account, form identifier and name, affected preview address, share address, and custom domain.
2. The browser, network, timestamp, timezone, and exact redirect chain with private query details redacted.
3. The result from the same preview in one private browser session and one alternate network.
4. The current embed state and any recent form or domain changes.

Do not send domain-provider credentials, passwords, verification codes, tokens, or broad administrative access.

{agency} will compare the clean-session and alternate-network results, preserve the existing object, and escalate the evidence to our technical team. No domain change or form recreation will be proposed without an evidence-matched diagnosis, authorized owner, impact review, and rollback plan. I will update you after the review.

{agent_name}
{agency} Support

## Agent notes

- Evidence state: `UNRESOLVED`.
- Preserve the form and compare the same preview in one private browser and one alternate network.
- Apply `HR-01` before any domain or DNS change and `HR-13` before any form or domain recreation.
- Stop after evidence collection and escalate. Do not reuse a community-reported cause as a current diagnosis.
