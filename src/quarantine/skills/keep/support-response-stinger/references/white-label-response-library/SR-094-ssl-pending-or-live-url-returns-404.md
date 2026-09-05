# SR-094: SSL remains pending or a live URL returns 404

## Use when

Use this response when SSL remains pending or a published page returns 404 and domain records, assignment, publication, default-page selection, path, or proxy state still needs review.

## Required evidence

- The full browser address, exact hostname, and path
- The authoritative DNS provider and current relevant records
- Current proxy mode, redirects, and propagation result
- Domain assignment and intended page
- Default-page selection and saved or published state
- The exact SSL warning or 404 result
- A private-browser comparison
- The authorized domain owner

## Customer-facing email

**Subject:** {ticket_id}: Reviewing pending SSL or the 404 on your live page

Hi {customer_first_name},

Thanks for reporting that SSL remains pending or the live page returns 404. We will first verify the existing domain and page configuration without editing or deleting anything.

Please reply with the full browser address, exact hostname and path, authoritative DNS provider, current relevant DNS records, proxy mode, domain assignment, intended page, default page, saved and published state, redirects, and the exact SSL or 404 result. Please also include the result from one private-browser check and identify the domain owner authorized to approve a change.

Do not send DNS-provider credentials. Please do not delete records, change proxy mode, remove the page, replace SSL, or recreate the domain while we review it.

{agency} Support will verify non-conflicting DNS, domain assignment, publication, default-page selection, and the exact path. Any record or proxy change requires owner authority, the exact current record, affected-service review, an intended value, and a rollback record. Any page or domain recreation requires preservation and a verified object-level diagnosis first.

{agent_name}
{agency} Support

## Agent notes

- Perform a read-only comparison before recommending any edit.
- Confirm authoritative DNS, assignment, publication, default page, and exact path separately.
- Never tell the customer to delete a record generically.
- DNS, proxy, redirect, or SSL changes require owner authority, current-state review, impact review, exact target, and rollback.
- Preserve the page and domain. Do not recreate either without a clean-session test and verified object-level diagnosis.
