# SR-068: Company records lack a consolidated contact activity history

## Use when

Use this response when activity exists on individual contact records but the customer cannot see the required history consolidated under a company record.

## Required evidence

- Account, company reference, and representative associated contact references.
- Activity types that should appear, the current views checked, and the requested date range.
- One representative missing activity with its timestamp and contact reference.
- Reporting purpose, affected user roles, expected company-level view, and current associations.
- Redacted screenshots when they clarify the current view. Do not request an unrestricted export.

## Customer-facing email

**Subject:** {ticket_id}: Company activity history review

Hi {customer_first_name},

Thanks for explaining that activities are visible on individual contacts but are not consolidated in the company view you need. We first need to verify the underlying activity and the exact company-level result before considering any record change.

Please reply with one consolidated set of details:

1. The account, company reference, and two representative associated contact references.
2. The activity types and date range that should appear in the company view.
3. One redacted example that exists on a contact but is missing from the company view, including its timestamp.
4. The current view, affected user role, and the reporting or service outcome you need.

Please do not merge contacts or change company associations during this review. Once I confirm that the underlying activities exist, I will document the requested company-level view and escalate it to our product specialist for a current capability decision. We have not confirmed that a hidden setting or consolidated view is available. The case is queued for review. I do not have a confirmed update time yet, and I will not invent one.

{agent_name}
{agency} Support

## Agent notes

- Evidence class: `F3`. Remediation class: `UNRESOLVED`.
- Confirm the activity exists on the underlying contact before describing a company-level gap.
- Do not merge records, modify associations, or promise a hidden setting as a workaround.
- The owner is `{agent_name}` until the evidence is escalated for a current product-boundary decision.
- Replace all case placeholders before use and return `DRAFT_WITH_GAPS` while any required fact is unknown.
