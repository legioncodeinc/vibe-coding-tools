# SR-050: Outreach harms sender reputation

## Use when

Use when cold or website-visitor outreach produces high bounces, complaints, unsubscribes, or reputation risk.

## Required evidence

- Campaign and date range, list source and consent basis, sending domain, authentication, volume pattern, bounce, complaint and unsubscribe signals, recipient engagement, content, and link domains.

## Customer-facing email

**Subject:** {ticket_id}: Protecting your sender reputation

Hi {customer_first_name},

I understand that recent outreach is producing bounce, complaint, unsubscribe, or reputation concerns. Please pause expansion to new recipients while we review list provenance, consent, authentication, and recent sending signals.

Please send the campaign and date range, list source and consent basis, sending domain, current authentication results, recent volume pattern, bounce rate and categories, complaint and unsubscribe signals, recipient engagement, message content, and link domains. Do not send mailbox credentials, full recipient exports, or unredacted customer data.

I will review whether the evidence points to list quality, consent, authentication, content, links, volume, or reputation. Please do not rotate domains, weaken DMARC, or immediately resend the campaign. We cannot guarantee deliverability or immediate recovery, and compliance or reputation uncertainty will be routed for specialist review.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F3`. Remediation class `R1`. Apply `HR-02` to any DMARC change. Pause audience expansion, not evidence collection. Do not guarantee delivery, rotate domains, weaken authentication, or advise an immediate resend.
