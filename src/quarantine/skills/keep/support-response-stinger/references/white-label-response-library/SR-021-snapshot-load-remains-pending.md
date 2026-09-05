# SR-021: Snapshot load remains pending

## Use when

Use when a snapshot load has remained pending longer than the customer expected.

## Required evidence

- Target workspace, snapshot and version, initiator, selected asset categories, start time and timezone, current load status, and failed-asset list.

## Customer-facing email

**Subject:** {ticket_id}: Checking the pending snapshot load

Hi {customer_first_name},

I understand that the snapshot load is still pending and that you need to know which assets have completed. We need to inspect the existing load history and each asset state before another load is started.

Please send the target workspace, snapshot name and version, initiating user, selected asset categories, start time with timezone, current overall status, and any failed-asset list shown in the load history.

Please do not start a second full load, refresh, or push while the first operation may still be processing. I will compare the version, selected assets, and per-asset status, then send any unexplained pending state to our technical team. We have not confirmed that the operation failed or that repeating it is safe.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F1`. Remediation class `R1`. Apply `HR-10`. Inspect the target workspace's load history and per-asset state. A second load is prohibited until the first state and duplicate or conflict risk are known.
