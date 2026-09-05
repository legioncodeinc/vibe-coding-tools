# SR-054: Bulk SMS returns error 3111 or carrier filtering

## Use when

Use this response when a bulk SMS campaign or workflow reports error 3111, carrier filtering, or another repeated delivery failure across recipients.

## Required evidence

- Account, campaign or workflow, and sending number
- One representative recipient and failure timestamp with timezone
- Exact error distribution across attempted messages
- Current A2P registration and restriction state
- Consent state for the representative recipient
- Redacted message content, destination domain, limits, and prior retry history

## Customer-facing email

**Subject:** {ticket_id}: Bulk SMS delivery errors need recipient-level review

Hi {customer_first_name},

I understand the bulk send is returning error 3111 or carrier filtering and is not reaching the expected recipients. We have not classified this as a service-wide issue, and another bulk retry could duplicate messages or increase filtering.

Please pause retries and send one consolidated evidence set:

1. The account, campaign or workflow, sending number, and one representative recipient.
2. The failure timestamp and timezone, exact errors, and how many messages show each error.
3. The current A2P registration, account restriction, and recipient consent states.
4. A redacted copy of the message, the destination domain used, current limits, and any prior retry result.

Do not include passwords, verification codes, tokens, or an unrestricted contact export.

{agency} will identify the displayed cause for the representative failure and check prior delivery, consent, and restrictions. Only after that cause is corrected will we consider one controlled retest to a verified recipient. I will update you after our messaging review is complete.

{agent_name}
{agency} Support

## Agent notes

- Evidence state: `DOC_COVERED` after the exact error is matched.
- Apply `HR-08`: stop bulk retry, verify prior delivery and consent, correct the displayed cause, and use one controlled recipient only.
- Do not label filtering as an outage or recommend number rotation, traffic splitting, or campaign replay as a bypass.
- Escalate when the restriction or representative error cannot be classified from the collected evidence.
