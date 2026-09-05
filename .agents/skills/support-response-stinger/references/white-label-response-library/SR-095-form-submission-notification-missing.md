# SR-095: A form submission does not send the expected notification

## Use when

Use this response when a form submission exists but an expected internal or automated notification is missing.

## Required evidence

- The affected account, form ID, and form name
- The live or embedded page address
- The submission ID and time with timezone
- The expected recipient and notification type
- Notification configuration at submission time
- Any dependent workflow and its execution result
- Current delivery state and a safe test-contact plan

## Customer-facing email

**Subject:** {ticket_id}: Checking the missing form notification

Hi {customer_first_name},

I understand that a form submission did not produce the expected notification. We will first confirm that the submission exists and compare the recipient and workflow configuration that applied when it was received.

Please reply with the affected account, form ID and name, live or embedded page address, submission ID and time with timezone, expected recipient, notification type, and the configuration that applied at submission time. Please also identify any dependent workflow, its execution result, and whether the notification appears in any delivery history.

Do not send the full form submission if the identifiers and redacted field names are sufficient. Please do not resend broadly, replace the form, or replay its workflow while we check prior delivery and automation effects.

{agency} Support will verify the submission, recipient, notification configuration, dependent workflow, and delivery state. If a test is needed, we will use one safe test contact that cannot charge or message a real customer. I will update you after that trace is complete.

{agent_name}
{agency} Support

## Agent notes

- Confirm the submission exists before diagnosing the notification path.
- Compare configuration as it existed at submission time.
- Use identifiers and redacted field names instead of full submission content.
- A test must not charge or message a real customer.
- Do not resend, replace the form, or replay automation until prior effects are known.

