# SR-001: Multiple areas are slow or time out

## Use when

Use when a customer reports slow loading or timeouts across more than one area of their workspace.

## Required evidence

- Workspace, exact slow pages, affected areas, first and most recent occurrence with timezone, browser, network, and results from one clean browser or another authorized account.

## Customer-facing email

**Subject:** {ticket_id}: Checking slow pages across your workspace

Hi {customer_first_name},

I understand that several areas of your workspace are loading slowly or timing out, which is interrupting your work. We have not yet confirmed whether this is limited to one browser, one account, or a broader service issue.

Please reply with the exact page names that are affected, the first and most recent times this happened with your timezone, your browser, and the network you were using. If possible, also tell me whether the same pages fail in one clean browser session or for another authorized user. Please redact customer content from screenshots and error details.

Do not clear saved browser data or change network settings at this stage. Once I have this comparison, I will determine the scope and send the evidence to our technical team if the slowdown reproduces across clean contexts. I do not have a confirmed update time yet.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F1`. Remediation class `UNRESOLVED`. Keep the draft at `DRAFT_WITH_GAPS` until the minimum evidence is supplied. Verify current internal service status before using incident language. Escalate when more than one clean account or area reproduces the symptom. Do not reuse a historical cause or restoration estimate.
