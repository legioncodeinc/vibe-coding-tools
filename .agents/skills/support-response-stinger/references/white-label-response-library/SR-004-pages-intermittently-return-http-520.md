# SR-004: Pages intermittently return HTTP 520

## Use when

Use when a customer intermittently receives an HTTP 520 response on one or more pages.

## Required evidence

- Workspace, exact page, timestamp and timezone, browser, screenshot or redacted error, and the result of one private-browser comparison.

## Customer-facing email

**Subject:** {ticket_id}: Checking intermittent HTTP 520 responses

Hi {customer_first_name},

I understand that the page sometimes returns HTTP 520 instead of loading. We have not confirmed a current service-wide issue or the cause of this response.

Please send the exact page name, workspace, browser, and the time of the most recent response with your timezone. Include a screenshot or redacted error that does not expose private customer content. Then open the same page once in a private browser window and tell me whether the response appears there as well.

Please do not clear cookies or saved site data yet. That action signs you out and can remove local preferences, so it is not the first test. I will compare the normal and private-browser results and escalate the case with that evidence if the response continues. I do not have a confirmed restoration time.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F1`. Remediation class `UNRESOLVED`. Apply `HR-12`. Confirm current internal status before incident language. Clearing local data is allowed only after the private-session comparison, a customer impact warning, and evidence that the action is relevant.
