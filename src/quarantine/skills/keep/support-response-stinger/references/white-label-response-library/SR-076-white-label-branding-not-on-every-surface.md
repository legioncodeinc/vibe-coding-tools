# SR-076: White-label branding does not propagate to every surface

## Use when

Use this response when the expected agency brand appears correctly in some places but is missing, stale, or inconsistent on another page, app, message, or system-controlled surface.

## Required evidence

- Agency, account, and an inventory of every affected surface.
- Expected and actual brand presentation for each surface.
- Domain, app, or message context without exposing another provider identity.
- Current configuration and approval state, last update time, and private-browser comparison.
- Cropped, redacted screenshots that mask private data and any third-party provider identity.
- Contractual disclosure requirement when one applies.

## Customer-facing email

**Subject:** {ticket_id}: Branding is inconsistent across account surfaces

Hi {customer_first_name},

Thanks for reporting that the expected {agency} branding appears correctly in some areas but not on {affected_surface}. We need to inventory each affected surface and separate configurable branding, stale display, pending approval, and externally controlled presentation.

Please send the following in one reply:

1. The account and a list of every affected page, app, message, or system-controlled surface.
2. The expected brand and a description of what currently appears on each surface.
3. The current branding configuration and approval state, plus the last update time and timezone.
4. The result from one private-browser comparison.
5. A cropped screenshot for each distinct symptom, with private data and any third-party provider identity masked.

Please do not reset branding, replace domains, or attach unredacted images while we preserve the current state. I will classify each surface and escalate the inventory for a current branding-capability and external-surface review. We have not confirmed that every surface supports the same branding controls. The case is queued for review. I do not have a confirmed update time yet, and I will not invent one.

{agent_name}
{agency} Support

## Agent notes

- Evidence class: `F3`. Remediation class: `UNRESOLVED`.
- Treat configurable branding, stale display, pending approval, and externally controlled presentation as separate possibilities.
- Do not promise complete white labeling and do not include screenshots or filenames that expose another provider identity.
- Apply the DNS change gate before any domain change. Preserve the current configuration first.
- The owner is `{agent_name}` until branding and external-surface specialists classify each item.
