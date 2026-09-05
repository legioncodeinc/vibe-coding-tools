# SR-047: The mobile app remains on its loading screen

## Use when

Use when the native mobile app remains on its loading screen and the customer cannot reach their workspace.

## Required evidence

- Workspace, device and operating-system version, app version, timestamp and timezone, network and ISP, browser comparison, alternate-network result, storage state, and screenshot.

## Customer-facing email

**Subject:** {ticket_id}: Checking the mobile app loading screen

Hi {customer_first_name},

I understand that the mobile app remains on its loading screen. We need to compare the same authorized account in the app, browser, and one alternate network before changing device or network settings.

Please send the workspace, device model, operating-system version, app version, time of the latest attempt with timezone, network type, ISP, available device storage state, and a screenshot. Tell me whether the same account loads in a browser and whether the mobile app loads on one alternate network.

Please do not change system DNS, clear app storage, or remove the app yet. If the native app alone remains blocked after the comparison, I will send the evidence to our technical team. We have not confirmed that a browser or network workaround applies to the mobile app.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F3`. Remediation class `UNRESOLVED`. Stop after the app, browser, and alternate-network comparison, then escalate. Do not reuse a browser DNS workaround or clear local storage without separate evidence and impact warning.
