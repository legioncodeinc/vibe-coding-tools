# SR-079: Sending-domain verification or warm-up status is unclear

## Use when

Use this response when the customer cannot determine whether a sending domain is authenticated, verified, warming gradually, or blocked by a displayed issue.

## Required evidence

- Sending domain, domain age, ownership, and sending path.
- Current SPF, DKIM, and DMARC results.
- Current verification state, warm-up state, and exact displayed warning or error.
- Recent daily volume, engagement pattern, list source, and recent sending changes.
- Authorized domain owner for any later DNS decision. Never request DNS-provider credentials.

## Customer-facing email

**Subject:** {ticket_id}: Sending-domain verification and warm-up review

Hi {customer_first_name},

Thanks for reporting that the verification or warm-up state for {sending_domain} is unclear. We will read the current authentication and sending state first, and we recommend pausing any further volume increase until the displayed issue is classified.

Please send the following in one reply:

1. The sending domain, approximate domain age, domain owner, and sending method.
2. The current SPF, DKIM, and DMARC results as displayed, without changing any record.
3. The current verification and warm-up states, plus the exact warning or error.
4. Recent daily sending volume, engagement pattern, list source, and any recent sending change.

Please do not send DNS-provider credentials or a full recipient list. Do not delete or replace DNS records, weaken DMARC, rotate domains, or increase volume while we review the evidence.

I will classify the current authentication and warm-up state. If an exact record change appears necessary, {agency} will first document the affected services, owner approval, impact, and rollback. I will update you after this authentication and sending review is complete. We have not confirmed a recovery time or a deliverability outcome.

{agent_name}
{agency} Support

## Agent notes

- Evidence class: `F4`. Remediation class: `R1`.
- Pause further volume increases until the current warning, verification state, and warm-up state are classified.
- Before any DNS change, require the authorized owner, authoritative provider, exact hostname, current records, affected services, intended value, impact review, and rollback record.
- Do not relax or replace DMARC without the current policy, authentication evidence, documented reason, specialist review, and rollback plan.
- Never guarantee a recovery time, inbox placement, or deliverability improvement.
