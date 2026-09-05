# SR-002: Page scripts, styles, or images fail to load

## Use when

Use when a customer sees an incomplete page because scripts, styles, or images do not load.

## Required evidence

- Workspace, exact page, browser, timestamp and timezone, screenshot, redacted console or network error if available, and clean-browser or authorized-account comparison.

## Customer-facing email

**Subject:** {ticket_id}: Checking incomplete page content

Hi {customer_first_name},

I understand that the page opens without all of its scripts, styling, or images. Please preserve the affected page and any unsaved content while we determine whether the behavior is tied to the page, browser, or workspace.

Please send the page name, workspace, browser, and the time of the most recent failure with your timezone. Include a screenshot and, if available, a redacted console or network error that excludes private customer data. Then open the same page once in a clean browser session and tell me whether it renders there.

Please do not delete, rebuild, or republish the page because it looks incomplete. If the assets still fail in the clean session, I will consolidate the evidence for our technical team. We have not confirmed a service-wide issue or a cause, and I do not have a confirmed update time yet.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F1`. Remediation class `UNRESOLVED`. Apply `HR-13`. Preserve the object before testing. Escalate after a clean-session reproduction. Never recommend deletion or recreation without the preservation, dependency, and authority gates.
