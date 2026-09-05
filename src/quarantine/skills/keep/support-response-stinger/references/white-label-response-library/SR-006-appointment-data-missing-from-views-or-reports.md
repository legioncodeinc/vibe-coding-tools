# SR-006: Appointment data is missing from views or reports

## Use when

Use when known appointments are absent from an expected calendar view or report.

## Required evidence

- Workspace, calendar, exact view or report, appointment identifiers, appointment times and timezone, and whether the records appear in another appropriate view.

## Customer-facing email

**Subject:** {ticket_id}: Checking missing appointment data

Hi {customer_first_name},

I understand that appointment records you expect to see are missing from a view or report. Before anything is recreated, we need to confirm whether the records still exist elsewhere and whether this is a visibility issue.

Please reply with the workspace, calendar, exact view or report, the affected appointment identifiers, and their scheduled times with timezone. Tell me whether each appointment appears in the contact record, another calendar view, or any other appropriate record location.

Please do not recreate the appointments while we check their existing state. I will compare the identifiers across the available views and send any confirmed discrepancy to our technical team. We have not confirmed data loss, a service-wide issue, or a restoration time.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F1`. Remediation class `R2`. Find the existing appointment objects before any action. Escalate absent identifiers with timestamps. Do not recreate records while visibility recovery or backfill remains possible.
