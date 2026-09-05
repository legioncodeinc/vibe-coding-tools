# SR-048: Email statistics are missing or appear incorrect

## Use when

Use when expected email sends or metrics do not appear in the relevant reporting view.

## Required evidence

- Contact, message or workflow, approximate send time and timezone, sending method and service ownership, reporting view, expected metric, actual metric, delivery record, and one representative recipient.

## Customer-facing email

**Subject:** {ticket_id}: Reconciling missing email statistics

Hi {customer_first_name},

I understand that email statistics are missing or do not match the delivery activity you expected. Different sending methods can report in different views, so we need to locate one representative message and compare its delivery record with the exact metric.

Please send the contact identifier, message or workflow, approximate send time with timezone, sending method, whether the sending service is managed by {agency} or an approved external service, reporting view, expected metric, actual metric, delivery record, and a redacted representative recipient. Do not send email-account credentials or unrestricted contact exports.

I will locate the message in the matching sending-method view and compare the specific metric with its delivery record. If the discrepancy reproduces, I will send the message identifiers and timestamps to our technical team. Please do not reset credentials, tracking DNS, or webhooks.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F3`. Remediation class `R1`. Match the message to the correct sending-method view before escalating. Credentials, tracking DNS, or webhooks must not be reset without ownership, impact review, and a rollback plan.
