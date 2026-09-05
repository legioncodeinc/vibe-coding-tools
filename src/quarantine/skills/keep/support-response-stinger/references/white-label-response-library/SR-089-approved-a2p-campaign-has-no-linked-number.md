# SR-089: An approved A2P campaign has no linked sending number

## Use when

Use this response when an approved A2P campaign has no sending number linked to it or a send reports that the required association is missing.

## Required evidence

- The affected account, brand ID, and campaign ID
- The campaign's approved state
- The exact intended sending number and its current association
- The exact redacted error
- Business ownership of the account, campaign, and number
- Other active campaigns or customers using the number
- Prior send attempts, delivery state, and recipient consent

## Customer-facing email

**Subject:** {ticket_id}: Reviewing the missing number link for your A2P campaign

Hi {customer_first_name},

I understand that your approved A2P campaign does not show the intended sending number. We need to confirm ownership and the current association before linking or testing anything.

Please reply with the affected account, brand ID, campaign ID, approved status, intended sending number, current number association, and exact redacted error. Please also confirm whether that number is assigned to another active campaign or customer and whether any send has already been attempted.

Do not send account credentials or private registration documents in email. Please do not relink the number or repeat the send while we complete the review.

{agency} Support will confirm account, brand, campaign, and number ownership, then inspect the current number association. We will not reuse or relink a number across customers or active campaigns without a compliance and impact review. One controlled send may follow only after the association, prior delivery state, and recipient consent are verified.

{agent_name}
{agency} Support

## Agent notes

- Confirm approved status and ownership before treating the issue as an association problem.
- Do not request private registration documents through email.
- Identify every other active campaign or customer using the number.
- Do not relink or reuse the number until compliance and impact are reviewed.
- Check prior delivery and consent before one controlled test send.

