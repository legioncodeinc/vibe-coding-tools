# SR-017: Production forms cannot be opened

## Use when

Use when a live or embedded production form cannot be opened.

## Required evidence

- Form identifier and name, workspace, live or embed page address, page assignment, timestamp and timezone, existing submission state, dependent workflows, and whether a side-effect-free test is possible.

## Customer-facing email

**Subject:** {ticket_id}: Protecting and checking your production form

Hi {customer_first_name},

I understand that your production form cannot be opened. Before testing, we need to preserve the form, its submissions, and any workflows or pages that depend on it.

Please send the form name and identifier, workspace, live or embedded page address, page assignment, and the time of the latest failure with timezone. Tell me whether existing submissions are still visible and list the workflows that could run from a test submission. Please do not include full contact exports.

Do not replace, recreate, or republish the form. After we confirm that a test contact cannot trigger live charges or customer-facing automation, {agency} can run one controlled test against the existing form. If it still cannot open, I will send the preserved evidence and dependency list to our technical team.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F1`. Remediation class `R1`. Apply `HR-13`. The controlled test is allowed only after dependent side effects are ruled out. Protect submissions, embeds, and workflows before any object-level action.
