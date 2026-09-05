# SR-003: The workspace opens but its data does not load

## Use when

Use when navigation and page framing appear but account records or page data remain unavailable.

## Required evidence

- Workspace, affected page, ISP and network, operating system, browser, exact time and timezone, current hostname lookup result, and one alternate-network comparison.

## Customer-facing email

**Subject:** {ticket_id}: Checking workspace data that will not load

Hi {customer_first_name},

I understand that the workspace frame opens but the data inside it does not load. We have not confirmed whether the current behavior comes from the workspace, browser, or network path.

Please reply with the affected page, workspace, operating system, browser, internet provider, and exact time of the latest failure with your timezone. If your IT team can provide the current hostname lookup result, include that result without credentials. Please also tell me whether the same page loads when the same authorized account uses one alternate network.

Do not change system-wide DNS, proxy, or router settings. I will compare the two network results and current internal service state first. If the evidence still points outside one local network, I will send the scoped findings to our technical team. Any later network change will require customer IT approval, an exact reviewed value, and a rollback plan.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F1`. Remediation class `UNRESOLVED`. Apply `HR-01` before any DNS action. A historical workaround is not a current remedy. Escalate current lookup and alternate-network evidence without asserting a cause.
