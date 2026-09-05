# SR-018: Funnel builder opens as a blank page

## Use when

Use when a funnel or page editor opens but displays a blank canvas.

## Required evidence

- Workspace, funnel and page identifiers, browser, timestamp and timezone, screenshot, saved draft state, recent edits, and one clean-browser comparison.

## Customer-facing email

**Subject:** {ticket_id}: Checking the blank funnel editor

Hi {customer_first_name},

I understand that the funnel editor opens as a blank page. Please preserve any draft text or assets outside the editor before testing so the current work is protected.

Please reply with the workspace, funnel and page identifiers, browser, and the time of the latest occurrence with timezone. Include a screenshot, the last known saved state, and a brief list of recent edits. Then open the same funnel once in a clean browser session and tell me whether the blank page remains.

Please do not rebuild or delete the funnel, page, form, or domain. If the same object remains blank in the clean session, I will consolidate the preserved evidence for our technical team. We have not confirmed a current incident, object damage, or a cause.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F1`. Remediation class `R1`. Apply `HR-13`. Preserve draft content and object identifiers. Rebuild or deletion is prohibited until existence, dependencies, and current internal status are verified.
