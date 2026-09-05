# SR-069: Calls disconnect before business or number registration completes

## Use when

Use this response when calls disconnect immediately or before routing completes while the business or number registration state is incomplete or unclear.

## Required evidence

- Account, business country, and affected number references.
- Call direction, exact timestamp and timezone, and redacted call reference.
- Current registration state and the exact visible warning or error.
- Current routing target and whether any other number or outside caller succeeds.
- One controlled call result only. Do not request identity documents through email.

## Customer-facing email

**Subject:** {ticket_id}: Calls disconnect before registration completes

Hi {customer_first_name},

Thanks for reporting that calls on {affected_number_reference} disconnect before reaching the configured destination while registration is incomplete. We need one controlled call record and the current registration state before our telephony and compliance specialists can assess the case.

Please send the following in one reply:

1. The account, business country, and affected number references.
2. The call direction, exact timestamp and timezone, and redacted call reference for one controlled test.
3. The current registration state and exact visible warning or error.
4. The configured routing target, plus whether another number or outside caller succeeds.

Please do not run repeated call tests or send identity documents, passwords, verification codes, or private credentials by email. Keep the current routing unchanged while we preserve the evidence.

Once I have these details, I will escalate the packet to our telephony and compliance specialists. We have not confirmed activation or a restoration time. The case is queued for review. I do not have a confirmed update time yet, and I will not invent one.

{agent_name}
{agency} Support

## Agent notes

- Evidence class: `F3`. Remediation class: `UNRESOLVED`.
- Preserve routing and capture no more than one controlled call unless a specialist approves another test.
- Never request identity documents through ordinary email. Use an approved secure path if a specialist establishes that formal documents are required.
- Do not promise registration approval, activation, or a restoration time.
- The owner is `{agent_name}` until telephony and compliance accept the evidence packet.
