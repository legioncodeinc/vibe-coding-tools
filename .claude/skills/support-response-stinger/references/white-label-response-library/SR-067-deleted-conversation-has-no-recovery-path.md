# SR-067: Deleted conversation history has no visible recovery path

## Use when

Use this response when conversation history appears to have been deleted and the customer cannot find a recovery control. Treat the report as potential data loss until the affected records and timeline are preserved.

## Required evidence

- Account, contact reference, conversation reference, and channel.
- Deletion time and timezone, plus the deleting user if known.
- Affected message date range and the business impact.
- Whether an audit record, export, or retained external copy exists.
- Only redacted identifiers and the minimum representative evidence. Do not request a full private transcript.

## Customer-facing email

**Subject:** {ticket_id}: Deleted conversation history review

Hi {customer_first_name},

Thanks for reporting that conversation history for {contact_reference} appears to have been deleted and that no recovery control is visible. We are treating this as a potential data-loss case and will preserve the current state before any further action.

Please do not create replacement messages, edit the affected contact, or alter the surrounding conversation while we review it. In one reply, please send:

1. The account name, contact reference, conversation reference, and channel.
2. The approximate deletion time and timezone, and the deleting user if known.
3. The affected message date range and whether an audit record, export, or retained external copy exists.
4. The current business impact.

Please redact private message content and unrelated customer data. Do not reconstruct missing content from memory or send a full transcript.

Once I have those details, I will preserve the evidence and escalate the case to our technical team. We have not confirmed that the deleted history can be recovered. The case is queued for review. I do not have a confirmed update time yet, and I will not invent one.

{agent_name}
{agency} Support

## Agent notes

- Evidence class: `F3`. Remediation class: `UNRESOLVED`.
- Use `NEEDS_INFO`, then `ESCALATED` after the minimum evidence is assembled.
- Do not promise recovery, reconstruct private content, create replacement messages, or overwrite audit evidence.
- The owner is `{agent_name}` until the complete, redacted packet is accepted by the technical team.
- Replace all case placeholders before use and return `DRAFT_WITH_GAPS` while any required fact is unknown.
