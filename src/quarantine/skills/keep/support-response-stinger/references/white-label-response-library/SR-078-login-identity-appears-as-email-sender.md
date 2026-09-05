# SR-078: A login identity appears as the visible email sender

## Use when

Use this response when the visible From address on an email matches a user's login identity instead of the expected brand sender address.

## Required evidence

- Account and affected user login identifier, without any credential.
- Connected conversation inbox and sending method.
- Default sender and workflow sender settings.
- Authenticated sending domain.
- One affected message, exact timestamp, visible From address, and visible reply address.

## Customer-facing email

**Subject:** {ticket_id}: Login identity appears as the email sender

Hi {customer_first_name},

Thanks for reporting that an email shows {visible_from_address} as the sender instead of {expected_sender_address}. I will trace one affected message across the user, connected inbox, default sender, workflow sender, and authenticated-domain settings before recommending a change.

Please send the following in one reply:

1. The account and affected user login address. Send the address only, never the password or a verification code.
2. The connected conversation inbox and the sending method used for the affected email.
3. The current default sender and workflow sender settings.
4. The authenticated sending domain.
5. The affected message timestamp and timezone, visible From address, and visible reply address.

Please do not change the login identity, domain records, or organization-wide defaults while I trace the sender path. If the evidence identifies a mismatched setting, {agency} will propose one scoped correction for review before it is applied.

I will update you after I complete the sender-identity trace. We have not yet confirmed which setting selected the visible sender.

{agent_name}
{agency} Support

## Agent notes

- Evidence class: `F4`. Remediation class: `R1`.
- Trace one message across user identity, connected inbox, default sender, workflow sender, and authenticated sending domain.
- Do not change a login identity or organization-wide default until ownership, affected sends, and rollback are known.
- Before any DNS change, confirm the authorized owner, exact hostname, authoritative provider, current records, affected services, intended value, impact review, and rollback record.
- The owner is `{agent_name}` through the trace. Escalate if the selected sender remains unexplained after all evidence-matched settings are checked.
